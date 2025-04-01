from pydantic import BaseModel, Field

class CodeGenerationRequest(BaseModel):
    """Schema for requesting code generation for a specific architecture component."""
    architecture_id: str = Field(..., description="The unique identifier of the previously generated architecture.")
    component_name: str = Field(..., description="The specific component within the architecture to generate code for.")
    programming_language: str = Field(default="python", description="The target programming language for the code.")

class CodeGenerationResponse(BaseModel):
    """Schema for the response containing the generated code, docs, and tests."""
    code: str = Field(..., description="The generated source code for the component.")
    documentation: str = Field(..., description="Generated documentation for the code (e.g., docstrings, comments).")
    tests: str = Field(..., description="Generated unit or integration tests for the code.")
