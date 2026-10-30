from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError

from app.core.config import settings
from app.api.v1.api import api_router
from app.api.v1.endpoints.health import router as health_router
from app.schemas.common import ErrorResponse

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="پلتفرم یکپارچه آموزش هوشمند، ارزیابی پارامتریک و تصحیح هوشمند برگه‌های امتحانی",
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    docs_url=f"{settings.API_V1_STR}/docs",
    redoc_url=f"{settings.API_V1_STR}/redoc",
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global validation error handler with consistent envelope
@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content=ErrorResponse(
            success=False,
            error_code="VALIDATION_ERROR",
            message="داده‌های ارسالی با ساختار مشخص‌شده در قرارداد API همخوانی ندارند.",
            details=exc.errors(),
        ).model_dump(),
    )

# Root health check endpoint
app.include_router(health_router)

# Mount API v1 router
app.include_router(api_router, prefix=settings.API_V1_STR)

@app.get("/")
def root():
    return {
        "service": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "docs": f"{settings.API_V1_STR}/docs",
        "openapi": f"{settings.API_V1_STR}/openapi.json",
        "auth_model": "DEMO_AUTH (use X-Demo-Role header: teacher | principal | counselor | student)",
    }
