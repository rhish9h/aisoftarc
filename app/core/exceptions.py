"""Defines custom exceptions for the aisofarc application."""

# --- Base Application Exception ---
class AISoftArcError(Exception):
    """Base exception for all custom errors in the aisofarc application."""
    pass

# --- Service Layer Exceptions ---
class ServiceError(AISoftArcError):
    """Base exception for service layer errors (e.g., initialization, configuration)."""
    def __init__(self, message: str):
        self.message = message
        super().__init__(self.message)

class ArchitectureGenerationError(ServiceError):
    """Exception raised for errors during the architecture generation orchestration.

    This typically wraps unexpected errors occurring within the main `generate` method
    of the ArchitectureService.
    """
    pass

class CodeGenerationError(ServiceError):
    """Exception raised specifically for errors during code generation.

    (Currently defined but may not be used by ArchitectureService).
    """
    pass

class DeploymentError(ServiceError):
    """Exception raised specifically for errors during deployment operations.

    (Currently defined but may not be used by ArchitectureService).
    """
    pass

# --- Specific Service Errors ---
class OpenAIServiceError(ArchitectureGenerationError):
    """Exception raised for errors related to communication with the OpenAI API.

    This includes API errors, rate limits, network issues, or empty responses.
    """
    pass

class ParsingError(ArchitectureGenerationError):
    """Exception raised when parsing or validating the response from the AI service fails.

    This can be due to invalid JSON format or the response data not matching the
    expected Pydantic schema (ArchitectureResponse).
    """
    pass

# Add specific exceptions for code generation and deployment services as needed
# Example:
# class CodeParsingError(CodeGenerationError): ...
# class DeploymentConfigurationError(DeploymentError): ...

# --- API Layer Exceptions ---
# (Could add specific API-level exceptions if needed, e.g., for authentication)

# --- Data Layer Exceptions ---
# (Could add specific data access exceptions if needed, e.g., DatabaseConnectionError)
