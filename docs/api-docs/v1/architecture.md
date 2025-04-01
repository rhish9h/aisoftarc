# API Documentation - v1 - Architecture Generation

This document details the API endpoint for generating software architecture.

## Endpoint: Generate Architecture

- **Path**: `/api/v1/generate_architecture`
- **Method**: `POST`
- **Summary**: Generate Software Architecture
- **Description**: Generates a software architecture based on a prompt, project type, and constraints using an AI model. Returns the architecture details including a diagram in Mermaid syntax.
- **Tags**: `Architecture`

### Request

- **Content-Type**: `application/json`
- **Body Schema**: `ArchitectureRequest` (defined in `app/schemas/architecture.py`)

```json
// Example Request Body
{
  "prompt": "Design a system for an online bookstore.",
  "project_type": "Web Application",
  "constraints": [
    "Must be scalable to handle 1 million users.",
    "Use a microservices approach.",
    "Prioritize security."
  ]
}
```

**Fields:**

- `prompt` (string, required): The primary description or requirement for the architecture.
- `project_type` (string, required): The general category of the project (e.g., "Web Application", "Mobile App Backend", "Data Pipeline").
- `constraints` (list[string], optional): A list of specific constraints, non-functional requirements, or technology preferences.

### Response

- **Success Status Code**: `201 Created`
- **Content-Type**: `application/json`
- **Body Schema**: `ArchitectureResponse` (defined in `app/schemas/architecture.py`)

```json
// Example Success Response Body
{
  "architecture_diagram": "graph TD\nA[User] --> B(Load Balancer);\nB --> C{Web Server};\nC --> D[API Gateway];\nD --> E(Auth Service);\nD --> F(Product Service);\nD --> G(Order Service);\nF --> H[(Product DB)];\nG --> I[(Order DB)];",
  "description": "A microservices-based architecture for an online bookstore...",
  "recommendations": [
    "Implement caching at the API Gateway level.",
    "Use asynchronous communication between services (e.g., message queue).",
    "Ensure proper monitoring and logging for all services."
  ]
}
```

**Fields:**

- `architecture_diagram` (string): A textual representation of the architecture diagram using **Mermaid** syntax.
- `description` (string): A textual explanation of the proposed architecture.
- `recommendations` (list[string]): A list of suggestions or best practices related to the architecture.

### Error Responses

- **Status Code**: `422 Unprocessable Entity`
  - **Cause**: Invalid request body (doesn't match `ArchitectureRequest` schema).
  - **Body**: Standard FastAPI validation error response.

- **Status Code**: `503 Service Unavailable`
  - **Cause**: Error communicating with the downstream AI service (OpenAI). Could be an API error, rate limit, network issue.
  - **Body**: `{"detail": "Error communicating with AI service: <error details>"}`

- **Status Code**: `500 Internal Server Error`
  - **Cause**: Failure to parse or validate the response received from the AI service.
  - **Body**: `{"detail": "Failed to process AI response: <error details>"}`

- **Status Code**: `500 Internal Server Error`
  - **Cause**: The `ArchitectureService` failed to initialize (e.g., missing API key configuration).
  - **Body**: `{"detail": "Service configuration error: <error details>"}`

- **Status Code**: `500 Internal Server Error`
  - **Cause**: An unexpected error occurred during the generation process within the service layer or API endpoint.
  - **Body**: `{"detail": "Failed to generate architecture: <error details>"}` or `{"detail": "An unexpected internal server error occurred."}`
