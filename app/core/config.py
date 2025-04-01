from pydantic_settings import BaseSettings
import os

class Settings(BaseSettings):
    PROJECT_NAME: str = "AI Software Architect"
    VERSION: str = "0.1.0"
    API_V1_STR: str = "/api/v1"
    
    # Add your configuration variables here
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")
    AZURE_SUBSCRIPTION_KEY: str = os.getenv("AZURE_SUBSCRIPTION_KEY", "") # Also load Azure key from env

    # OpenAI specific settings
    OPENAI_MODEL: str = os.getenv("OPENAI_MODEL", "gpt-4o-mini")
    OPENAI_MAX_TOKENS: int = os.getenv("OPENAI_MAX_TOKENS", 1500)
    OPENAI_TEMPERATURE: float = os.getenv("OPENAI_TEMPERATURE", 0.7)

    class Config:
        # BaseSettings from pydantic_settings can automatically load environment
        # variables from .env files, making the explicit load_dotenv() call redundant.
        env_file = ".env"
        env_file_encoding = "utf-8"
        case_sensitive = False

settings = Settings()
