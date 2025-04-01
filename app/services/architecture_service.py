import logging
import json
from json import JSONDecodeError

# Import the Asynchronous client
from openai import AsyncOpenAI, APIError, RateLimitError 
from pydantic import ValidationError

from app.core.config import settings
from app.schemas.architecture import ArchitectureResponse
from app.core.exceptions import (
    ArchitectureGenerationError,
    OpenAIServiceError,
    ParsingError,
    ServiceError, 
)

# --- Constants ---
SYSTEM_ROLE = "system"
USER_ROLE = "user"

# --- Service Setup ---
logger = logging.getLogger(__name__)

# --- Service Class ---
class ArchitectureService:
    """Asynchronous service class for generating software architecture using OpenAI.

    This service encapsulates the logic for:
    1. Building the appropriate prompt for the OpenAI API.
    2. Calling the OpenAI API asynchronously.
    3. Parsing and validating the JSON response containing the architecture details.
    4. Handling potential errors during the process using custom exceptions.
    """

    def __init__(self):
        """Initializes the ArchitectureService, setting up the AsyncOpenAI client.

        Raises:
            ServiceError: If the AsyncOpenAI client cannot be initialized,
                          typically due to missing API key or configuration issues.
        """
        try:
            # Initialize AsyncOpenAI client
            self.client = AsyncOpenAI(api_key=settings.OPENAI_API_KEY) 
            if not settings.OPENAI_API_KEY:
                logger.warning("OPENAI_API_KEY not found in settings. OpenAI client methods will fail.")
                # Setting client to None or similar handling if key might be absent
                # self.client = None # Ensure subsequent calls fail clearly if key is missing
        except Exception as e:
            logger.error(f"Failed to initialize AsyncOpenAI client: {e}", exc_info=True)
            # Ensure client attribute exists but maybe is None or raises
            self.client = None 
            raise ServiceError(f"Failed to initialize AsyncOpenAI client: {e}") from e

    # This method doesn't perform I/O, can remain synchronous
    def _build_openai_prompt(self, prompt: str, project_type: str, constraints: list[str]) -> list[dict]:
        """Builds the list of messages for the OpenAI API call, requesting Mermaid syntax.

        Args:
            prompt: The user's core requirement for the architecture.
            project_type: The type of project (e.g., Web Application).
            constraints: Specific constraints for the architecture.

        Returns:
            A list of dictionaries representing the system and user messages for the API.
        """
        # (Implementation remains the same)
        system_message = (
            f"You are an AI assistant specializing in software architecture. "
            f"Generate a software architecture for a '{project_type}' project. "
            f"Consider the following constraints: {', '.join(constraints) if constraints else 'None'}. "
            f"Provide the output as a JSON object with the following keys: "
            f"'architecture_diagram' (string, MUST be valid Mermaid diagram syntax), "
            f"'description' (string), and 'recommendations' (list of strings)."
        )
        user_message = prompt

        messages = [
            {"role": SYSTEM_ROLE, "content": system_message},
            {"role": USER_ROLE, "content": user_message},
        ]
        logger.debug(f"Built OpenAI prompt messages: {messages}")
        return messages

    # Make this method asynchronous as it performs network I/O
    async def _call_openai_api(self, messages: list[dict]) -> str:
        """Calls the OpenAI Chat Completions API asynchronously using the configured client.

        Args:
            messages: The list of prompt messages (system and user roles).

        Returns:
            The raw JSON string content received from the OpenAI API.

        Raises:
            OpenAIServiceError: If the client is not initialized, if the API returns an error
                              (e.g., APIError, RateLimitError), if the response is empty,
                              or if any other unexpected communication error occurs.
        """
        if not self.client:
            logger.error("AsyncOpenAI client is not initialized.")
            raise OpenAIServiceError("AsyncOpenAI client is not initialized.")

        try:
            logger.info(f"Sending request to OpenAI model: {settings.OPENAI_MODEL}")
            # Use await with the async client's method
            response = await self.client.chat.completions.create( 
                model=settings.OPENAI_MODEL,
                messages=messages,
                max_tokens=settings.OPENAI_MAX_TOKENS,
                temperature=settings.OPENAI_TEMPERATURE,
                response_format={"type": "json_object"}, 
            )
            response_content = response.choices[0].message.content
            logger.debug(f"Received raw response from OpenAI: {response_content}")
            if not response_content:
                raise OpenAIServiceError("Received empty response content from OpenAI.")
            return response_content

        except (APIError, RateLimitError) as e:
            logger.error(f"OpenAI API error encountered: {e}")
            raise OpenAIServiceError(f"OpenAI API error: {e}") from e
        except Exception as e:
            logger.error(f"Unexpected error during OpenAI API call: {e}", exc_info=True)
            raise OpenAIServiceError(f"Unexpected error communicating with OpenAI: {e}") from e

    # This method doesn't perform I/O, can remain synchronous
    def _parse_and_validate_response(self, response_content: str) -> ArchitectureResponse:
        """Parses the JSON response string and validates it against the schema."""
        # (Implementation remains the same)
        try:
            data = json.loads(response_content)
            logger.debug(f"Successfully parsed JSON data: {data}")
            validated_response = ArchitectureResponse(**data)
            logger.info("Successfully validated response against schema.")
            return validated_response
        except JSONDecodeError as e:
            logger.error(f"Failed to decode JSON response from OpenAI: {e}")
            logger.debug(f"Invalid JSON content: {response_content}")
            raise ParsingError(f"Invalid JSON received from AI: {e}") from e
        except ValidationError as e:
            logger.error(f"Response validation failed: {e}")
            logger.debug(f"Data that failed validation: {data if 'data' in locals() else 'N/A'}")
            raise ParsingError(f"AI response did not match expected format: {e}") from e
        except Exception as e:
            logger.error(f"Unexpected error during response parsing/validation: {e}", exc_info=True)
            raise ParsingError(f"Unexpected error processing AI response: {e}") from e

    # Make the main public method asynchronous
    async def generate(self, prompt: str, project_type: str, constraints: list[str]) -> ArchitectureResponse:
        """Generates software architecture asynchronously by calling the OpenAI API and parsing the response.

        Args:
            prompt: The user's main requirement or description for the architecture.
            project_type: The type of project (e.g., 'Web Application', 'Data Pipeline').
            constraints: A list of specific constraints or requirements for the architecture.

        Returns:
            An ArchitectureResponse object containing the generated architecture details,
            including the Mermaid diagram syntax, description, and recommendations.

        Raises:
            OpenAIServiceError: If communication with the OpenAI API fails (e.g., network issues, API errors).
            ParsingError: If the response from the OpenAI API cannot be parsed as valid JSON
                          or does not conform to the expected ArchitectureResponse schema.
            ArchitectureGenerationError: For any other unexpected errors occurring during the
                                       orchestration of the generation process.
            ServiceError: If the service itself fails to initialize (e.g., missing API key).
        """
        try:
            messages = self._build_openai_prompt(prompt, project_type, constraints)
            # Use await to call the async helper method
            raw_response = await self._call_openai_api(messages) 
            # Parsing is sync, no await needed here
            validated_response = self._parse_and_validate_response(raw_response) 
            return validated_response

        except (OpenAIServiceError, ParsingError) as e:
            logger.error(f"Generation failed due to service error: {e}") 
            raise e
        except Exception as e:
            logger.error(
                f"An unexpected error occurred in ArchitectureService.generate: {e}",
                exc_info=True
            )
            raise ArchitectureGenerationError(f"An unexpected error occurred during generation: {e}") from e
