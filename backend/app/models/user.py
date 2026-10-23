"""User and reviewer accounts model."""

from typing import List, Optional
from sqlalchemy import String, Boolean
from sqlalchemy.orm import Mapped, mapped_column, relationship
from backend.app.db.base import Base, TimestampMixin


class User(Base, TimestampMixin):
    """User account model for SOC commanders, reviewers, and operators."""

    __tablename__ = "users"

    id: Mapped[str] = mapped_column(String(64), primary_key=True)
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True, nullable=False)
    username: Mapped[str] = mapped_column(String(64), unique=True, index=True, nullable=False)
    full_name: Mapped[str] = mapped_column(String(128), nullable=False)
    hashed_password: Mapped[str] = mapped_column(String(255), nullable=False)
    role: Mapped[str] = mapped_column(String(64), default="REVIEWER", nullable=False)
    avatar_initials: Mapped[Optional[str]] = mapped_column(String(8), nullable=True)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    is_superuser: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    fido2_token_hash: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)

    # Relationships
    signatures: Mapped[List["ApprovalSignature"]] = relationship("ApprovalSignature", back_populates="reviewer")
    audit_logs: Mapped[List["AuditLog"]] = relationship("AuditLog", back_populates="user")
