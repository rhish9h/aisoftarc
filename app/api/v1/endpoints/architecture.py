import logging
from fastapi import APIRouter, Depends, HTTPException, status

# Import schemas
from app.schemas.architecture import ArchitectureRequest, ArchitectureResponse

# Import services and exceptions
from app.services.architecture_service import (
    generate_architecture_service,
    ArchitectureGenerationError,
    OpenAIServiceError,
    ParsingError,
)

router = APIRouter()
logger = logging.getLogger(__name__)

# Define a dependency function for the service (optional but good practice)
# In this simple case, Depends(generate_architecture_service) works directly too.
def get_architecture_service():
    """Dependency provider for the architecture service."""
    return generate_architecture_service

@router.post(
    "/generate_architecture",
    response_model=ArchitectureResponse,
    status_code=status.HTTP_200_OK,
    summary="Generate Software Architecture",
    description="Generates software architecture based on user prompt, project type, and constraints using an AI model.",
    tags=["Architecture"],
)
async def generate_architecture(
    request: ArchitectureRequest,
    service: callable = Depends(get_architecture_service) # Inject the service
):
    """
    Generate software architecture based on the provided request.

    Args:
        request (ArchitectureRequest): The request payload containing the prompt,
            project type, and constraints.
        service (callable): The injected architecture generation service function.

    Returns:
        ArchitectureResponse: The generated architecture diagram, description,
            and recommendations.

    Raises:
        HTTPException (400): If the input request is invalid (though handled by FastAPI/Pydantic).
        HTTPException (500): If there's an internal server error or unexpected issue during generation.
        HTTPException (502): If there's an error parsing the response from the AI service.
        HTTPException (503): If the AI service itself fails or is unavailable.
    """
    try:
        logger.info(f"Received architecture generation request: {request.dict()}")

        architecture_data: ArchitectureResponse = await service(
            prompt=request.prompt,
            project_type=request.project_type,
            constraints=request.constraints,
        )

        logger.info("Successfully generated architecture.")
        return architecture_data

    except ParsingError as e:
        logger.warning(f"Parsing error during architecture generation: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=f"Failed to parse response from AI service: {e}",
        )
    except OpenAIServiceError as e:
        logger.error(f"AI service error during architecture generation: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=f"AI service unavailable or encountered an error: {e}",
        )
    except ArchitectureGenerationError as e:
        # Catching the more general generation error
        logger.error(f"Architecture generation failed: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to generate architecture: {e}",
        )
    except Exception as e:
        # Catch-all for any other unexpected errors
        logger.exception("An unexpected error occurred during architecture generation.") 
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An internal server error occurred.",
        )
