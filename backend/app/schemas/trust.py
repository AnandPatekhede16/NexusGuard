"""Agent trust scoring schemas."""

from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field, ConfigDict


class AgentTrustBase(BaseModel):
    current_score: float = Field(..., ge=0.0, le=100.0)
    baseline_score: float = Field(default=100.0, ge=0.0, le=100.0)
    compliance_rate: float = Field(default=100.0, ge=0.0, le=100.0)
    anomaly_delta: float = 0.0
    behavioral_state: str = Field(default="OPTIMAL (Stable)", max_length=64)
    sigmoid_steepness: float = 1.0
    decay_half_life_hours: float = 24.0


class AgentTrustResponse(AgentTrustBase):
    id: str
    agent_id: str
    last_evaluated_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class TrustHistoryEntry(BaseModel):
    id: str
    agent_id: str
    trust_score: float
    score_delta: float
    reason: Optional[str]
    recorded_at: datetime

    model_config = ConfigDict(from_attributes=True)
