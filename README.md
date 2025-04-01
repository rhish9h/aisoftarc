# AI Software Architecture Generator

A FastAPI-based system for generating software architecture designs, code, and deploying to Azure using AI.

## Features

- Generate software architecture diagrams from natural language prompts (Backend)
- Convert architecture designs into code (Backend - Planned)
- Automated deployment to Azure (Backend - Planned)
- RESTful API with OpenAPI documentation (Backend)
- **React Frontend** for interacting with the API (Frontend)

## Getting Started

### Prerequisites

- Python 3.9 or higher
- pip (Python package manager)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/aisoftarc.git
cd aisoftarc
```

2. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: .\venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Create a `.env` file in the root directory and add your configuration:
```
OPENAI_API_KEY=your_api_key
AZURE_SUBSCRIPTION_KEY=your_azure_key
```

### Running the Application

Start the development server:

```bash
uvicorn app.main:app --reload
```

The API will be available at `http://localhost:8000`
API documentation will be at `http://localhost:8000/docs`

### Frontend (React)

Please see the dedicated README in the `frontend` directory for instructions on how to set up and run the frontend application:

[Frontend README](./frontend/README.md)

## API Endpoints

- `POST /api/v1/generate_architecture`: Generate software architecture from requirements
- `POST /api/v1/generate_code`: Generate code from architecture design
- `POST /api/v1/deploy`: Deploy generated code to Azure

## Project Structure

```
aisoftarc/
├── app/                     # FastAPI backend application
│   ├── main.py              # FastAPI application entry point
│   ├── api/                 # API routes and endpoints
│   ├── core/                # Core configuration
│   ├── schemas/             # Pydantic schemas (request/response models)
│   ├── services/            # Business logic
│   └── utils/               # Utility functions
├── frontend/                # React frontend application
│   ├── public/
│   ├── src/
│   ├── package.json
│   └── ... (see frontend/README.md)
├── docs/                    # Documentation
├── tests/                   # Test suite
├── .env.example             # Example BACKEND environment variables file
├── requirements.txt         # Project BACKEND dependencies
├── .gitignore               # Top-level Git ignore rules
└── README.md                # This file (Project Overview)
```

## Technical Details

- **Framework**: FastAPI (Asynchronous)
- **AI Integration**: OpenAI API (using `openai` async client)
- **Data Validation**: Pydantic
- **Diagram Format**: Mermaid
- **Architecture**: Follows Clean Architecture principles with distinct layers (API, Services, Core).
- **Frontend**: React, Vite

## Future Improvements

- [ ] Add support for multiple architecture styles
- [ ] Implement CI/CD pipeline
- [ ] Add more deployment targets
- [ ] Enhance error handling and validation
- [ ] Add user authentication and authorization
- [ ] Implement caching for better performance

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.