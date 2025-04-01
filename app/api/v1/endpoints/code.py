import logging
from fastapi import APIRouter, Depends, HTTPException, status

# Import schemas
from app.schemas.code import CodeGenerationRequest, CodeGenerationResponse

# Import services and exceptions (Define specific exceptions later if needed)
from app.services.code_service import generate_code_service

router = APIRouter()
logger = logging.getLogger(__name__)

# Dependency for the service
def get_code_service():
    return generate_code_service

@router.post(
    "/generate_code",
    response_model=CodeGenerationResponse,
    status_code=status.HTTP_200_OK,
    summary="Generate Code Component",
    description="Generates code, documentation, and tests for a specific component based on a generated architecture.",
    tags=["Code"],
)
async def generate_code(
    request: CodeGenerationRequest,
    service: callable = Depends(get_code_service),
):
    """
    Generate code for a specific component based on architecture.

    Args:
        request (CodeGenerationRequest): Request details including architecture ID and component name.
        service (callable): Injected code generation service.

    Returns:
        CodeGenerationResponse: Generated code, documentation, and tests.

    Raises:
        HTTPException (500): If an unexpected error occurs.
        # Add specific exceptions (e.g., 404 if architecture_id not found) later
    """
    try:
        logger.info(f"Received code generation request: {request.dict()}")
        code_data = await service(
            architecture_id=request.architecture_id,
            component_name=request.component_name,
            programming_language=request.programming_language,
        )
        logger.info(f"Successfully generated code for component '{request.component_name}'.")
        return code_data
    except Exception as e:
        logger.exception("An unexpected error occurred during code generation.")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An internal server error occurred during code generation.",
        )
