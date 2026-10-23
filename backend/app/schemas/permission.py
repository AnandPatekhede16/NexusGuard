"""Permission and AgentPermission schemas."""

from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field, ConfigDict


class PermissionBase(BaseModel):
    scope_name: str = Field(..., max_length=128)
    resource: str = Field(..., max_length=128)
    description: Optional[str] = None


class PermissionCreate(PermissionBase):
    id: str = Field(..., max_length=64)


class PermissionResponse(PermissionBase):
    id: str
    is_system: bool
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class AgentPermissionGrant(BaseModel):
    permission_id: str = Field(..., max_length=64)
    granted_by: Optional[str] = Field(None, max_length=64)


class AgentPermissionResponse(BaseModel):
    id: str
    agent_id: str
    permission_id: str
    granted_by: Optional[str]
    granted_at: datetime
    is_active: bool
    permission: Optional[PermissionResponse] = None

    model_config = ConfigDict(from_attributes=True)
