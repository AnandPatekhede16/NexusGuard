"""Agent Pydantic schemas for request validation and serialization."""

from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, Field, ConfigDict


class AgentBase(BaseModel):
    name: str = Field(..., max_length=128)
    model: str = Field(..., max_length=64)
    owner: str = Field(..., max_length=128)
    role: str = Field(..., max_length=128)
    cluster: str = Field(default="Cluster-Default", max_length=128)
    status: str = Field(default="active", max_length=32)
    risk_tier: str = Field(default="LOW", max_length=32)
    description: Optional[str] = None


class AgentCreate(AgentBase):
    id: str = Field(..., max_length=64, description="Unique Agent ID, e.g. FIN-AGENT-01")


class AgentUpdate(BaseModel):
    name: Optional[str] = Field(None, max_length=128)
    model: Optional[str] = Field(None, max_length=64)
    owner: Optional[str] = Field(None, max_length=128)
    role: Optional[str] = Field(None, max_length=128)
    cluster: Optional[str] = Field(None, max_length=128)
    status: Optional[str] = Field(None, max_length=32)
    risk_tier: Optional[str] = Field(None, max_length=32)
    description: Optional[str] = None


class AgentResponse(AgentBase):
    id: str
    last_action: Optional[str] = None
    last_seen: Optional[str] = None
    violations_count: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
