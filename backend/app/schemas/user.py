"""User and reviewer Pydantic schemas."""

from datetime import datetime
from typing import Optional
from pydantic import BaseModel, EmailStr, Field, ConfigDict


class UserBase(BaseModel):
    email: EmailStr
    username: str = Field(..., max_length=64)
    full_name: str = Field(..., max_length=128)
    role: str = Field(default="REVIEWER", max_length=64)
    avatar_initials: Optional[str] = Field(None, max_length=8)
    is_active: bool = True
    is_superuser: bool = False


class UserCreate(UserBase):
    id: str = Field(..., max_length=64)
    password: str = Field(..., min_length=8, description="Raw password to be hashed. Never stored directly.")


class UserResponse(UserBase):
    id: str
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
