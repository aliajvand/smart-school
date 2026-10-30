from fastapi import APIRouter
from app.api.v1.endpoints import (
    health,
    auth,
    vision,
    dashboard,
    counselor,
    studio,
    integrity,
    audio,
    regrades,
    audit,
)

api_router = APIRouter()

# Register endpoints
api_router.include_router(auth.router)
api_router.include_router(vision.router)
api_router.include_router(dashboard.router)
api_router.include_router(counselor.router)
api_router.include_router(studio.router)
api_router.include_router(integrity.router)
api_router.include_router(audio.router)
api_router.include_router(regrades.router)
api_router.include_router(audit.router)
