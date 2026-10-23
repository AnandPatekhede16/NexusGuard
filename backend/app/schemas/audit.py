"""Audit log schemas."""

from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field, ConfigDict


class AuditLogBase(BaseModel):
    tx_hash: str = Field(..., max_length=128)
    block_number: int
    leaf_index: Optional[str] = None
    leaf_hash: Optional[str] = None
    parent_root: Optional[str] = None
    action_type: str = Field(..., max_length=128)
    target_resource: str = Field(..., max_length=255)
    synthesized_intent: Optional[str] = None
    risk_score: int = 0
    applied_policy: Optional[str] = None
    decision: str = Field(default="ALLOWED", max_length=32)
    enclave_type: str = Field(default="AWS Nitro Enclave v2", max_length=128)
    pcr0_measurement: Optional[str] = None
    call_stack_json: Optional[str] = None


class AuditLogCreate(AuditLogBase):
    id: str = Field(..., max_length=64)
    agent_id: Optional[str] = None
    user_id: Optional[str] = None
    event_timestamp: datetime


class AuditLogResponse(AuditLogBase):
    id: str
    agent_id: Optional[str]
    user_id: Optional[str]
    event_timestamp: datetime
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
