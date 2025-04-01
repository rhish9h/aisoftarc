from pydantic import BaseModel, Field
from enum import Enum

class DeploymentTarget(str, Enum):
    """Enumeration of possible deployment target environments."""
    AWS = "aws"
    AZURE = "azure"
    GCP = "gcp"
    LOCAL = "local"

class DeploymentRequest(BaseModel):
    """Schema for requesting deployment of a generated architecture."""
    architecture_id: str = Field(..., description="The unique identifier of the architecture to deploy.")
    target: DeploymentTarget = Field(..., description="The target cloud provider or environment for deployment.")
    configuration: dict = Field(default={}, description="Optional target-specific configuration parameters (e.g., region, resource group).")

class DeploymentResponse(BaseModel):
    """Schema for the response indicating the status of the deployment initiation."""
    status: str = Field(..., description="The current status of the deployment process (e.g., Initiated, InProgress, Failed, Completed).")
    deployment_url: str | None = Field(default=None, description="The URL where the deployed application can be accessed, if applicable.")
    message: str = Field(..., description="A message providing details about the deployment status or any errors.")
