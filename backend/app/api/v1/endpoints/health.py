"""Health endpoint."""

from fastapi import APIRouter, status
from backend.app.schemas.health import HealthResponse

router = APIRouter(tags=["Health"])


@router.get(
    "/health",
    response_model=HealthResponse,
    status_code=status.HTTP_200_OK,
    summary="Health Check",
    description="Returns the operational status and service identifier.",
)
async def get_health() -> HealthResponse:
    """Return service health status."""
    return HealthResponse(
        status="ok",
        service="NexusGuard API",
    )
