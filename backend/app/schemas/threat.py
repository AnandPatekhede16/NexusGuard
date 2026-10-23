"""Threat detection schemas."""

from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field, ConfigDict


class ThreatBase(BaseModel):
    taxonomy_code: str = Field(..., max_length=32)
    taxonomy_name: str = Field(..., max_length=128)
    title: str = Field(..., max_length=255)
    severity: str = Field(..., max_length=32)
    risk_score: int = Field(default=50, ge=0, le=100)
    status: str = Field(default="CONTAINED", max_length=32)
    engine: str = Field(default="eBPF + Semantic", max_length=64)
    ingress_hash: Optional[str] = None
    payload_summary: Optional[str] = None
    kill_chain_steps_json: Optional[str] = None


class ThreatCreate(ThreatBase):
    id: str = Field(..., max_length=64)
    agent_id: Optional[str] = None
    policy_id: Optional[str] = None
    detected_at: datetime


class ThreatResponse(ThreatBase):
    id: str
    agent_id: Optional[str] = None
    policy_id: Optional[str] = None
    detected_at: datetime
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
