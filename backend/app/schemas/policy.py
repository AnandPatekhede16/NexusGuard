"""Policy schemas."""

from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field, ConfigDict


class PolicyBase(BaseModel):
    policy_code: str = Field(..., max_length=64)
    name: str = Field(..., max_length=128)
    description: Optional[str] = None
    framework: str = Field(default="NIST-AI-RMF", max_length=64)
    standard_reference: Optional[str] = Field(None, max_length=64)
    enforcement_mode: str = Field(default="BLOCK", max_length=32)
    rule_expression: Optional[str] = None
    severity: str = Field(default="HIGH", max_length=32)
    is_active: bool = True


class PolicyCreate(PolicyBase):
    id: str = Field(..., max_length=64)


class PolicyResponse(PolicyBase):
    id: str
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
