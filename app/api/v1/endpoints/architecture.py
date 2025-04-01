import logging
from fastapi import APIRouter, Depends, HTTPException, status

from app.schemas.architecture import ArchitectureRequest, ArchitectureResponse
from app.services.architecture_service import ArchitectureService
from app.core.exceptions import (
    ArchitectureGenerationError,
    OpenAIServiceError,
    ParsingError,
    ServiceError,
)

router = APIRouter()
logger = logging.getLogger(__name__)

@router.post(
    "/generate_architecture",
    response_model=ArchitectureResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Generate Software Architecture",
    description="Generates a software architecture based on a prompt, project type, and constraints using an AI model.",
    tags=["Architecture"],
)
async def generate_architecture(
    request: ArchitectureRequest,
    service: ArchitectureService = Depends(ArchitectureService)
):
    """
    Asynchronously generates software architecture based on user input using the ArchitectureService.

    This endpoint takes user requirements, project type, and constraints, uses the
    `ArchitectureService` (injected) to communicate with an AI model, and returns the
    generated architecture details, including a Mermaid diagram.

    It handles potential errors from the service layer (like API communication issues,
    response parsing errors, or configuration problems) and maps them to appropriate
    HTTP status codes and error messages.

    Args:
        request: The request body containing prompt, project_type, and constraints.
        service: The injected asynchronous ArchitectureService instance.

    Returns:
        An ArchitectureResponse containing the generated architecture diagram (Mermaid),
        description, and recommendations.

    Raises:
        HTTPException 503: If the AI service (OpenAI) is unavailable or errors out.
        HTTPException 500: If the AI response cannot be parsed or validated.
        HTTPException 500: If there's an unexpected error during generation.
        HTTPException 500: If the ArchitectureService fails to initialize (e.g., config error).
    """
    try:
        logger.info(f"Received architecture generation request: {request.dict()}")
        # Add await here as service.generate is now async
        architecture = await service.generate(
            prompt=request.prompt,
            project_type=request.project_type,
            constraints=request.constraints,
        )
        logger.info("Successfully generated architecture.")
        return architecture
    except OpenAIServiceError as e:
        logger.error(f"OpenAI service error during generation: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=f"Error communicating with AI service: {e}"
        )
    except ParsingError as e:
        logger.error(f"Parsing error during generation: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to process AI response: {e}"
        )
    except ArchitectureGenerationError as e:
        logger.error(f"Architecture generation failed: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to generate architecture: {e}"
        )
    except ServiceError as e:
         logger.error(f"Service initialization error: {e}", exc_info=True)
         raise HTTPException(
             status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
             detail=f"Service configuration error: {e}"
         )
    except Exception as e:
        logger.exception("An unexpected error occurred during architecture generation.")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An unexpected internal server error occurred."
        )
