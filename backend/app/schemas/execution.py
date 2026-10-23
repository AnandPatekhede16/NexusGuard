"""Agent execution history schemas."""

from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field, ConfigDict


class ExecutionCreate(BaseModel):
    id: str = Field(..., max_length=64)
    agent_id: str = Field(..., max_length=64)
    operation: str = Field(..., max_length=64)
    target_resource: str = Field(..., max_length=255)
    raw_payload_snippet: Optional[str] = None
    payload_sha256: Optional[str] = None
    synthesized_intent: Optional[str] = None
    verdict: str = Field(default="ALLOWED", max_length=32)
    latency_ms: float = 1.5
    executed_at: datetime


class ExecutionResponse(BaseModel):
    id: str
    agent_id: str
    operation: str
    target_resource: str
    raw_payload_snippet: Optional[str]
    payload_sha256: Optional[str]
    synthesized_intent: Optional[str]
    verdict: str
    latency_ms: float
    executed_at: datetime
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
