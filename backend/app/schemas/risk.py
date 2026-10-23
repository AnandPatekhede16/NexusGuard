"""Risk assessment schemas."""

from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field, ConfigDict


class RiskAssessmentBase(BaseModel):
    overall_risk_score: int = Field(..., ge=0, le=100)
    risk_tier: str = Field(default="LOW", max_length=32)
    behavioral_drift: float = 0.0
    permission_entropy: float = 0.0
    policy_compliance_subscore: float = 100.0
    identity_attestation_subscore: float = 100.0
    heuristic_velocity_subscore: float = 100.0
    tool_egress_subscore: float = 100.0
    assessment_notes: Optional[str] = None


class RiskAssessmentCreate(RiskAssessmentBase):
    id: str = Field(..., max_length=64)
    agent_id: str = Field(..., max_length=64)
    assessed_at: datetime


class RiskAssessmentResponse(RiskAssessmentBase):
    id: str
    agent_id: str
    assessed_at: datetime
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
