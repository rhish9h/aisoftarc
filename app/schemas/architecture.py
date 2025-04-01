from pydantic import BaseModel

# Define request schema
class ArchitectureRequest(BaseModel):
    prompt: str
    project_type: str
    constraints: list[str] = []

# Define response schema
class ArchitectureResponse(BaseModel):
    architecture_diagram: str
    description: str
    recommendations: list[str]
