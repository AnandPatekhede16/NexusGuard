"""Structured error response schemas."""

from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field


class ErrorDetail(BaseModel):
    """Specific field or parameter validation issue."""

    field: Optional[str] = Field(None, description="Location of the invalid field")
    issue: str = Field(..., description="Explanation of validation failure")
    type: Optional[str] = Field(None, description="Error type identifier")


class ErrorBody(BaseModel):
    """Standardized error envelope."""

    code: str = Field(..., description="Machine-readable error code")
    message: str = Field(..., description="Human-readable error description")
    details: List[Dict[str, Any]] = Field(default_factory=list, description="Detailed diagnostic list")


class ErrorResponse(BaseModel):
    """Top-level error response model."""

    error: ErrorBody
