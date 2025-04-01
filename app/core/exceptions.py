"""Defines custom exceptions for the aisofarc application."""

# --- Base Application Exception ---
class AISoftArcError(Exception):
    """Base exception for all custom errors in the aisofarc application."""
    pass

# --- Service Layer Exceptions ---
class ServiceError(AISoftArcError):
    """Base exception for errors originating from the service layer."""
    pass

class ArchitectureGenerationError(ServiceError):
    """Base exception for errors during architecture generation."""
    pass

class CodeGenerationError(ServiceError):
    """Base exception for errors during code generation."""
    pass

class DeploymentError(ServiceError):
    """Base exception for errors during deployment."""
    pass

# --- Specific Service Errors ---
class OpenAIServiceError(ArchitectureGenerationError):
    """Exception raised for errors related to the OpenAI API call (architecture)."""
    # Could potentially be generalized if other services use OpenAI
    pass

class ParsingError(ArchitectureGenerationError):
    """Exception raised for errors during response parsing or validation (architecture)."""
    # Could potentially be generalized
    pass

# Add specific exceptions for code generation and deployment services as needed
# Example:
# class CodeParsingError(CodeGenerationError): ...
# class DeploymentConfigurationError(DeploymentError): ...

# --- API Layer Exceptions ---
# (Could add specific API-level exceptions if needed, e.g., for authentication)

# --- Data Layer Exceptions ---
# (Could add specific data access exceptions if needed, e.g., DatabaseConnectionError)
