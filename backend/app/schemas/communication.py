"""Inter-agent communication schemas."""

from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field, ConfigDict


class CommunicationBase(BaseModel):
    channel_title: str = Field(..., max_length=128)
    protocol: str = Field(default="mTLS-Ed25519", max_length=64)
    state: str = Field(default="verified", max_length=32)
    channel_crypto: str = Field(default="mTLS v1.3 Ed25519", max_length=64)
    signature_hash: Optional[str] = None
    synthesized_intent: Optional[str] = None
    policy_code: Optional[str] = None
    risk_score: int = Field(default=0, ge=0, le=100)
    diff_payload: Optional[str] = None
    is_severed: bool = False


class CommunicationCreate(CommunicationBase):
    id: str = Field(..., max_length=64)
    source_agent_id: str = Field(..., max_length=64)
    target_agent_id: str = Field(..., max_length=64)


class CommunicationResponse(CommunicationBase):
    id: str
    source_agent_id: str
    target_agent_id: str
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
