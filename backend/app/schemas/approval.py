"""Approval request and signature schemas."""

from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, Field, ConfigDict


class SignatureSign(BaseModel):
    reviewer_id: str = Field(..., max_length=64)
    ephemeral_lease_ttl_minutes: Optional[int] = Field(default=15, ge=1, le=1440)
    comments: Optional[str] = None


class SignatureResponse(BaseModel):
    id: str
    reviewer_id: str
    is_signed: bool
    signed_at: Optional[datetime]
    ephemeral_lease_ttl_minutes: Optional[int]
    comments: Optional[str]

    model_config = ConfigDict(from_attributes=True)


class ApprovalRequestBase(BaseModel):
    incident_code: str = Field(..., max_length=64)
    summary: str = Field(..., max_length=255)
    target_resource: str = Field(..., max_length=255)
    urgency: str = Field(default="routine", max_length=32)
    risk_score: int = Field(default=50, ge=0, le=100)
    initial_sla_seconds: int = Field(default=600)
    remaining_sla_seconds: int = Field(default=600)
    stated_objective: Optional[str] = None
    neural_analysis: Optional[str] = None
    records_affected: Optional[str] = None
    quorum_threshold: int = Field(default=2)


class ApprovalRequestCreate(ApprovalRequestBase):
    id: str = Field(..., max_length=64)
    agent_id: str = Field(..., max_length=64)
    policy_id: Optional[str] = None


class ApprovalRequestResponse(ApprovalRequestBase):
    id: str
    agent_id: str
    policy_id: Optional[str]
    status: str
    created_at: datetime
    signatures: List[SignatureResponse] = []

    model_config = ConfigDict(from_attributes=True)
