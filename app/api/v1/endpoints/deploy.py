from fastapi import APIRouter, Depends, HTTPException, status
import logging
from app.schemas.deploy import DeploymentRequest, DeploymentResponse
from app.services.deploy_service import deploy_service

router = APIRouter()
logger = logging.getLogger(__name__)

def get_deploy_service():
    return deploy_service

@router.post(
    "/deploy",
    response_model=DeploymentResponse,
    status_code=status.HTTP_202_ACCEPTED,  
    summary="Deploy Architecture",
    description="Initiates the deployment of a generated architecture to a specified target.",
    tags=["Deployment"],
)
async def deploy_architecture(
    request: DeploymentRequest,
    service: callable = Depends(get_deploy_service),
):
    """
    Initiate deployment of the specified architecture.

    Args:
        request (DeploymentRequest): Deployment target and configuration.
        service (callable): Injected deployment service.

    Returns:
        DeploymentResponse: Status of the deployment initiation.

    Raises:
        HTTPException (500): If an unexpected error occurs.
        # Add specific exceptions later (e.g., 400 for bad config, 404 for arch ID)
    """
    try:
        logger.info(f"Received deployment request: {request.dict()}")
        deployment_status = await service(
            architecture_id=request.architecture_id,
            target=request.target,
            configuration=request.configuration,
        )
        logger.info(f"Deployment initiated for architecture '{request.architecture_id}' to {request.target.value}.")
        return deployment_status
    except Exception as e:
        logger.exception("An unexpected error occurred during deployment initiation.")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An internal server error occurred during deployment.",
        )
