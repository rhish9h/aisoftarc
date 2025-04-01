from pydantic import BaseModel, Field

# Define request schema
class ArchitectureRequest(BaseModel):
    """Schema for requesting software architecture generation."""
    prompt: str = Field(..., description="The main prompt or requirement for the software architecture.")
    project_type: str = Field(..., description="The type of project (e.g., web app, mobile app, data pipeline).")
    constraints: list[str] = Field(default=[], description="Optional list of constraints or non-functional requirements (e.g., budget, specific tech).")

# Define response schema
class ArchitectureResponse(BaseModel):
    """Schema for the response containing the generated software architecture details."""
    architecture_diagram: str = Field(..., description="A textual or structured representation of the architecture (e.g., PlantUML, Mermaid, JSON).")
    description: str = Field(..., description="A natural language description of the proposed architecture.")
    recommendations: list[str] = Field(..., description="A list of recommendations, trade-offs, or next steps.")
