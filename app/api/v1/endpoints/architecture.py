import logging
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel

# Import the schemas from the new location
from app.schemas.architecture import ArchitectureRequest, ArchitectureResponse

from app.services.architecture_service import (
    generate_architecture_service,
    ArchitectureGenerationError,
    OpenAIServiceError,
    ParsingError
)

router = APIRouter()

logger = logging.getLogger(__name__)

@router.post("/generate_architecture", response_model=ArchitectureResponse, status_code=status.HTTP_200_OK)
async def generate_architecture(
    request: ArchitectureRequest,
):
    """
    Generate software architecture based on the provided prompt and constraints.
    Delegates the generation logic to the architecture service.
    """
    try:
        logger.info(f"Received architecture request for project type: {request.project_type}")
        architecture_data = await generate_architecture_service(
            prompt=request.prompt,
            project_type=request.project_type,
            constraints=request.constraints
        )
        logger.info("Successfully generated architecture.")
        return architecture_data

    except ParsingError as e:
        logger.warning(f"Parsing error during architecture generation: {e}")
        raise HTTPException(status_code=502, detail=f"Failed to parse response from AI: {e}")
    except OpenAIServiceError as e:
        logger.error(f"OpenAI service error: {e}")
        raise HTTPException(status_code=503, detail=f"AI service unavailable or encountered an error: {e}")
    except ArchitectureGenerationError as e:
        logger.error(f"General architecture generation error: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to generate architecture: {e}")
    except Exception as e:
        logger.exception("An unexpected error occurred in the architecture endpoint.")
        raise HTTPException(status_code=500, detail="An internal server error occurred.")
