from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_read_main():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "Welcome to AI Software Architecture Generator API"}

def test_generate_architecture():
    response = client.post(
        "/api/v1/generate_architecture",
        json={"prompt": "Test prompt", "project_type": "web", "constraints": []}
    )
    assert response.status_code == 200
    data = response.json()
    assert "architecture_diagram" in data
    assert "description" in data
    assert "recommendations" in data

def test_generate_code():
    response = client.post(
        "/api/v1/generate_code",
        json={
            "architecture_id": "test_id",
            "component_name": "test_component",
            "programming_language": "python"
        }
    )
    assert response.status_code == 200
    data = response.json()
    assert "code" in data
    assert "documentation" in data
    assert "tests" in data

def test_deploy():
    response = client.post(
        "/api/v1/deploy",
        json={
            "code_id": "test_id",
            "azure_resource_group": "test_group",
            "environment": "development"
        }
    )
    assert response.status_code == 200
    data = response.json()
    assert "status" in data
    assert "deployment_url" in data
    assert "logs" in data
