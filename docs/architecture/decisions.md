# Architecture Decision Records (ADRs)

This document records significant architectural decisions made during the development of the AI Software Architecture Generator.

## ADR-001: Choice of Web Framework

- **Status**: Accepted
- **Date**: (Specify Date, e.g., 2025-03-28)
- **Context**: Needed a modern, high-performance Python web framework for building the REST API.
- **Decision**: Chose **FastAPI**.
- **Rationale**:
    - Excellent performance.
    - Native asynchronous support (`asyncio`) is ideal for I/O-bound tasks like calling external APIs (OpenAI).
    - Built-in data validation using Pydantic simplifies request/response handling.
    - Automatic generation of interactive OpenAPI (Swagger UI) documentation.
    - Active community and good documentation.
- **Alternatives Considered**: Flask (less native async support), Django (heavier framework, less focused on APIs initially).

## ADR-002: Service Layer Implementation

- **Status**: Accepted
- **Date**: (Specify Date, e.g., 2025-03-30)
- **Context**: Needed a structured way to organize business logic separate from the API layer, adhering to Clean Architecture principles.
- **Decision**: Implemented services as **injectable classes** (e.g., `ArchitectureService`). Methods performing I/O (like OpenAI calls) are **asynchronous (`async def`)**.
- **Rationale**:
    - Encapsulates related logic, improving organization and testability.
    - Aligns with Clean Architecture principles (separation of concerns).
    - FastAPI's dependency injection integrates well with class-based services.
    - Using `async def` for I/O-bound operations prevents blocking the server's event loop, improving concurrency and performance.
- **Alternatives Considered**: Simple functions (less encapsulation, harder state management if needed), synchronous classes (would block the event loop or require thread pools, less efficient in an async framework).

## ADR-003: Centralized Custom Exceptions

- **Status**: Accepted
- **Date**: (Specify Date, e.g., 2025-03-30)
- **Context**: Need a consistent way to handle and signal errors originating from different parts of the application (especially the service layer).
- **Decision**: Created a dedicated module `app/core/exceptions.py` to define **custom exception classes** inheriting from a base `ServiceError`.
- **Rationale**:
    - Improves clarity and maintainability of error handling.
    - Allows the API layer to catch specific exception types and map them to appropriate HTTP responses.
    - Avoids scattering generic `Exception` handling.
- **Alternatives Considered**: Raising built-in exceptions directly (less specific), defining exceptions within each service (less centralized).

## ADR-004: Diagram Generation Format

- **Status**: Accepted
- **Date**: (Specify Date, e.g., 2025-03-31)
- **Context**: The architecture generation feature needs to output a diagram in a format easily renderable in a web frontend (specifically React).
- **Decision**: Standardized on **Mermaid** syntax for the `architecture_diagram` field in the response.
- **Rationale**:
    - Mermaid is JavaScript-native and designed for web embedding.
    - Excellent React integration libraries exist (`@mermaid-js/react`, `react-mermaid2`).
    - Simpler frontend integration compared to server-side rendering or image generation required by formats like PlantUML.
    - Text-based format is easy for the AI to generate.
- **Alternatives Considered**: PlantUML (requires server-side generation or complex client-side setup), Graphviz DOT (similar challenges to PlantUML for direct web rendering), simple text descriptions (not visual).

