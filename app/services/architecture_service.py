import json
import logging
from openai import OpenAI, APIError, RateLimitError, AsyncOpenAI # Use AsyncOpenAI for async calls
from pydantic import BaseModel, ValidationError

from app.core.config import settings
from app.schemas.architecture import ArchitectureResponse # Use the existing response model

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize AsyncOpenAI client for async operations
# Ensure OPENAI_API_KEY is set in the environment or .env file
client: AsyncOpenAI | None = None
try:
    if settings.OPENAI_API_KEY:
        client = AsyncOpenAI(api_key=settings.OPENAI_API_KEY)
    else:
        logger.warning("OPENAI_API_KEY not found in settings. OpenAI client not initialized.")
except Exception as e:
    logger.error(f"Failed to initialize OpenAI client: {e}")
    client = None # Set client to None if initialization fails

class ArchitectureGenerationError(Exception):
    """Custom exception for architecture generation failures."""
    pass

class OpenAIServiceError(ArchitectureGenerationError):
    """Exception for errors during OpenAI API interaction."""
    pass

class ParsingError(ArchitectureGenerationError):
    """Exception for errors during response parsing."""
    pass


async def generate_architecture_service(prompt: str, project_type: str, constraints: list[str]) -> ArchitectureResponse:
    """
    Service function to generate software architecture using OpenAI API.
    Requests JSON output from the model.
    """
    if not client:
        raise ArchitectureGenerationError("OpenAI client is not initialized. Check API key and configuration.")

    # Construct the prompt requesting JSON output
    prompt_detail = f"Generate a software architecture for a '{project_type}' project."
    prompt_detail += f" User requirement: '{prompt}'."
    if constraints:
        prompt_detail += " Consider the following constraints: " + ", ".join(constraints) + "."

    # Define the desired JSON structure for the model
    json_format_description = "{\"architecture_diagram\": \"<High-level textual description of components and connections>\", \"description\": \"<Concise textual description of the proposed architecture>\", \"recommendations\": [\"<Recommendation 1>\", \"<Recommendation 2>\", ...]}"

    system_message = "You are an AI assistant specialized in software architecture design. You MUST provide your response strictly in the following JSON format: " + json_format_description + " Ensure the entire output is a single valid JSON object and nothing else."
    user_message = prompt_detail

    try:
        logger.info(f"Sending request to OpenAI model: {settings.OPENAI_MODEL}")
        # Use the async client's chat completions create method
        response = await client.chat.completions.create(
            model=settings.OPENAI_MODEL,
            messages=[
                {"role": "system", "content": system_message},
                {"role": "user", "content": user_message}
            ],
            max_tokens=settings.OPENAI_MAX_TOKENS,
            temperature=settings.OPENAI_TEMPERATURE,
            response_format={"type": "json_object"} # Explicitly request JSON object output
        )

        content = response.choices[0].message.content
        if not content:
             raise ParsingError("Received empty content from AI.")

        logger.debug(f"Raw OpenAI response content: {content}")

        # Parse the JSON response
        try:
            parsed_json = json.loads(content)
            # Validate the parsed JSON against the Pydantic model
            architecture_data = ArchitectureResponse(**parsed_json)
            logger.info("Successfully parsed and validated architecture response from OpenAI.")
            return architecture_data
        except json.JSONDecodeError as e:
            logger.error(f"Failed to decode JSON response from OpenAI: {e}")
            logger.error(f"Invalid JSON received: {content}")
            raise ParsingError(f"Invalid JSON response received from AI: {e}")
        except ValidationError as e:
             logger.error(f"JSON response validation failed: {e}")
             logger.error(f"Parsed JSON received: {content}") # Log the raw content for inspection
             raise ParsingError(f"AI response does not match expected format: {e}")

    except (APIError, RateLimitError) as e:
        logger.error(f"OpenAI API error: {e}")
        raise OpenAIServiceError(f"OpenAI API error: {e}")
    except Exception as e:
        logger.error(f"An unexpected error occurred during architecture generation: {e}", exc_info=True)
        raise ArchitectureGenerationError(f"An unexpected error occurred: {e}")
