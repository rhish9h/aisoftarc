from pydantic import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "AI Software Architecture Generator"
    VERSION: str = "0.1.0"
    API_V1_STR: str = "/api/v1"
    
    # Add your configuration variables here
    OPENAI_API_KEY: str
    AZURE_SUBSCRIPTION_KEY: str
    
    class Config:
        env_file = ".env"

settings = Settings()
