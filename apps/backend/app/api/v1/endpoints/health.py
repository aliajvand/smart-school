from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()

class HealthResponse(BaseModel):
    status: str = "ok"
    version: str = "1.0.0"
    service: str = "smart-school-backend"
    timestamp: str = "2026-10-30T11:23:00Z"

@router.get("/health", response_model=HealthResponse, tags=["Health"])
def get_health():
    """
    Service health check endpoint.
    """
    return HealthResponse()
