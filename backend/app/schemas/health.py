"""Health check schema."""

from pydantic import BaseModel, Field


class HealthResponse(BaseModel):
    """Health response model matching requirement."""

    status: str = Field(..., description="Service status", json_schema_extra={"example": "ok"})
    service: str = Field(..., description="Service identifier", json_schema_extra={"example": "NexusGuard API"})
