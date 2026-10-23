"""Permission scopes and agent authorization mappings."""

from datetime import datetime, timezone
from typing import List, Optional
from sqlalchemy import String, Boolean, DateTime, ForeignKey, Text, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship
from backend.app.db.base import Base, TimestampMixin


class Permission(Base, TimestampMixin):
    """Predefined fine-grained capability scopes."""

    __tablename__ = "permissions"

    id: Mapped[str] = mapped_column(String(64), primary_key=True)
    scope_name: Mapped[str] = mapped_column(String(128), unique=True, index=True, nullable=False)
    resource: Mapped[str] = mapped_column(String(128), nullable=False)
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    is_system: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)

    # Relationships
    agent_grants: Mapped[List["AgentPermission"]] = relationship(
        "AgentPermission", back_populates="permission", cascade="all, delete-orphan"
    )


class AgentPermission(Base, TimestampMixin):
    """Mapping between an agent and an assigned permission scope."""

    __tablename__ = "agent_permissions"
    __table_args__ = (
        UniqueConstraint("agent_id", "permission_id", name="uq_agent_permission"),
    )

    id: Mapped[str] = mapped_column(String(64), primary_key=True)
    agent_id: Mapped[str] = mapped_column(
        String(64), ForeignKey("agents.id", ondelete="CASCADE"), index=True, nullable=False
    )
    permission_id: Mapped[str] = mapped_column(
        String(64), ForeignKey("permissions.id", ondelete="CASCADE"), index=True, nullable=False
    )
    granted_by: Mapped[Optional[str]] = mapped_column(String(64), nullable=True)
    granted_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False
    )
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, index=True, nullable=False)

    # Relationships
    agent: Mapped["Agent"] = relationship("Agent", back_populates="permissions")
    permission: Mapped["Permission"] = relationship("Permission", back_populates="agent_grants")
