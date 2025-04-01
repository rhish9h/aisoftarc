import logging
import json
from json import JSONDecodeError

from openai import OpenAI, APIError, RateLimitError
from pydantic import ValidationError

from app.core.config import settings
from app.schemas.architecture import ArchitectureResponse
from app.core.exceptions import (
    ArchitectureGenerationError,
    OpenAIServiceError,
    ParsingError,
    ServiceError,
)

SYSTEM_ROLE = "system"
USER_ROLE = "user"

logger = logging.getLogger(__name__)

class ArchitectureService:
    """Service class responsible for generating software architecture using OpenAI."""

    def __init__(self):
        """Initializes the ArchitectureService, including the OpenAI client."""
        try:
            self.client = OpenAI(api_key=settings.OPENAI_API_KEY)
            if not settings.OPENAI_API_KEY:
                logger.warning("OPENAI_API_KEY not found in settings. OpenAI client methods will fail.")
                self.client = None
        except Exception as e:
            logger.error(f"Failed to initialize OpenAI client: {e}", exc_info=True)
            self.client = None
            raise ServiceError(f"Failed to initialize OpenAI client: {e}") from e

    def _build_openai_prompt(self, prompt: str, project_type: str, constraints: list[str]) -> list[dict]:
        """Builds the list of messages for the OpenAI API call."""
        system_message = (
            f"You are an AI assistant specializing in software architecture. "
            f"Generate a software architecture for a '{project_type}' project. "
            f"Consider the following constraints: {', '.join(constraints) if constraints else 'None'}. "
            f"Provide the output as a JSON object with the following keys: "
            f"'architecture_diagram' (string, e.g., PlantUML or Mermaid syntax), "
            f"'description' (string), and 'recommendations' (list of strings)."
        )
        user_message = prompt

        messages = [
            {"role": SYSTEM_ROLE, "content": system_message},
            {"role": USER_ROLE, "content": user_message},
        ]
        logger.debug(f"Built OpenAI prompt messages: {messages}")
        return messages

    def _call_openai_api(self, messages: list[dict]) -> str:
        """Calls the OpenAI API and returns the response content or raises OpenAIServiceError."""
        if not self.client:
            logger.error("OpenAI client is not initialized.")
            raise OpenAIServiceError("OpenAI client is not initialized.")

        try:
            logger.info(f"Sending request to OpenAI model: {settings.OPENAI_MODEL}")
            response = self.client.chat.completions.create(
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

    def _parse_and_validate_response(self, response_content: str) -> ArchitectureResponse:
        """Parses the JSON response string and validates it against the schema."""
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

    def generate(self, prompt: str, project_type: str, constraints: list[str]) -> ArchitectureResponse:
        """
        Generates software architecture by calling the OpenAI API and parsing the response.

        Args:
            prompt: The user's main requirement.
            project_type: The type of project.
            constraints: A list of constraints.

        Returns:
            An ArchitectureResponse object containing the generated architecture.

        Raises:
            OpenAIServiceError: If communication with OpenAI fails.
            ParsingError: If the response from OpenAI cannot be parsed or validated.
            ArchitectureGenerationError: For other unexpected errors during generation.
        """
        try:
            messages = self._build_openai_prompt(prompt, project_type, constraints)
            raw_response = self._call_openai_api(messages)
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
