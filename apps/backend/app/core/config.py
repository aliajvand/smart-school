import os
from typing import List
from pydantic import BaseModel

class Settings(BaseModel):
    API_V1_STR: str = "/api/v1"
    PROJECT_NAME: str = "مدرسه هوشمند آینده (AI-Powered Smart School API)"
    VERSION: str = "1.0.0"
    
    # CORS Configuration
    BACKEND_CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:8000",
        "http://127.0.0.1:8000",
    ]
    
    # AI Provider Decoupling (Never hardcode model names in user-facing UI)
    AI_PROVIDER: str = os.getenv("AI_PROVIDER", "mock")
    AI_MODEL_NAME: str = os.getenv("AI_MODEL_NAME", "gemini-2.5-flash")
    AI_API_KEY: str | None = os.getenv("AI_API_KEY", None)
    AI_BASE_URL: str | None = os.getenv("AI_BASE_URL", None)
    
    # Mathematical Engine Constraints
    MAX_EXPRESSION_LENGTH: int = 150
    MAX_SYMBOLS: int = 8
    MAX_VARIANTS_PER_REQUEST: int = 50

settings = Settings()
