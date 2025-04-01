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
    Generate software architecture based on user input.
    Handles potential errors during generation and returns appropriate HTTP exceptions.
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
