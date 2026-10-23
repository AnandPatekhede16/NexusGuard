"""Agent Credential and identity Pydantic schemas."""

from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field, ConfigDict


class CredentialCreate(BaseModel):
    id: str = Field(..., max_length=64)
    agent_id: str = Field(..., max_length=64)
    key_type: str = Field(default="mTLS-Ed25519", max_length=64)
    public_key_fingerprint: str = Field(..., max_length=128)
    pcr0_measurement: Optional[str] = Field(None, max_length=128)
    issued_at: datetime
    expires_at: Optional[datetime] = None


class CredentialResponse(BaseModel):
    id: str
    agent_id: str
    key_type: str
    public_key_fingerprint: str
    pcr0_measurement: Optional[str]
    issued_at: datetime
    expires_at: Optional[datetime]
    is_revoked: bool
    revoked_at: Optional[datetime]
    revocation_reason: Optional[str]
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
