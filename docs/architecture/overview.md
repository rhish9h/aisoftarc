# Architecture Overview

This document provides a high-level overview of the AI Software Architecture Generator application.

## Core Principles

The application aims to adhere to Clean Architecture principles, separating concerns into distinct layers:

1.  **API Layer (`app/api`)**: Handles incoming HTTP requests, routes them to the appropriate services, and manages request/response validation (using Pydantic schemas defined in `app/schemas`). Built with FastAPI.
2.  **Service Layer (`app/services`)**: Contains the core business logic. Services orchestrate tasks, interact with external systems (like the OpenAI API), and implement the application's features. Services are designed as injectable classes (e.g., `ArchitectureService`).
3.  **Core Layer (`app/core`)**: Holds application-wide concerns like configuration (`settings`), custom exceptions (`exceptions.py`), and potentially other foundational elements.

## Key Technologies & Patterns

- **Framework**: FastAPI (chosen for its high performance, async support, automatic OpenAPI documentation, and Pydantic integration).
- **Asynchronous Operations**: The application leverages Python's `asyncio` and FastAPI's async capabilities, particularly for I/O-bound operations like calling the OpenAI API. The `openai` library's `AsyncOpenAI` client is used.
- **Dependency Injection**: FastAPI's dependency injection system is used to manage service instances within the API layer.
- **Configuration**: Settings are managed via environment variables loaded using Pydantic's `BaseSettings` (in `app/core/config.py`).
- **Error Handling**: Custom exceptions are defined in `app/core/exceptions.py` and handled consistently in the API layer to provide meaningful HTTP responses.
- **Diagram Format**: The architecture generation feature specifically produces diagrams in **Mermaid** syntax, suitable for web rendering.

## Main Components

- **`app/main.py`**: The entry point for the FastAPI application.
- **`app/api/v1/endpoints/`**: Contains the specific API route handlers (e.g., `architecture.py`).
- **`app/services/architecture_service.py`**: The service responsible for interacting with OpenAI to generate architecture designs.
- **`app/schemas/architecture.py`**: Defines the Pydantic models for architecture-related request and response data.
- **`app/core/exceptions.py`**: Central location for custom application exceptions.

## Data Flow (Architecture Generation Example)

1.  Client sends a `POST` request to `/api/v1/generate_architecture` with requirements.
2.  FastAPI routes the request to the `generate_architecture` endpoint function in `app/api/v1/endpoints/architecture.py`.
3.  The endpoint validates the request body against the `ArchitectureRequest` schema.
4.  FastAPI injects an instance of the `ArchitectureService`.
5.  The endpoint calls the asynchronous `service.generate()` method.
6.  `ArchitectureService` builds the prompt, calls the `AsyncOpenAI` client (`await self.client.chat.completions.create(...)`), and awaits the response.
7.  `ArchitectureService` parses the JSON response and validates it against the `ArchitectureResponse` schema.
8.  The validated `ArchitectureResponse` (containing Mermaid syntax) is returned to the endpoint.
9.  The endpoint returns the response to the client with a `201 Created` status.
10. Errors (e.g., API errors, parsing errors) are caught at the service or API layer and mapped to appropriate HTTP exceptions.
