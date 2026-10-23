"""Cryptographic WORM audit ledger events."""

from datetime import datetime
from typing import Optional
from sqlalchemy import String, Integer, DateTime, ForeignKey, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from backend.app.db.base import Base, TimestampMixin


class AuditLog(Base, TimestampMixin):
    """Cryptographically verifiable WORM ledger entry with SHA-256 Merkle root hash."""

    __tablename__ = "audit_logs"

    id: Mapped[str] = mapped_column(String(64), primary_key=True)
    tx_hash: Mapped[str] = mapped_column(String(128), unique=True, index=True, nullable=False)
    block_number: Mapped[int] = mapped_column(Integer, index=True, nullable=False)
    leaf_index: Mapped[Optional[str]] = mapped_column(String(64), nullable=True)
    leaf_hash: Mapped[Optional[str]] = mapped_column(String(128), nullable=True)
    parent_root: Mapped[Optional[str]] = mapped_column(String(128), nullable=True)
    agent_id: Mapped[Optional[str]] = mapped_column(
        String(64), ForeignKey("agents.id", ondelete="SET NULL"), index=True, nullable=True
    )
    user_id: Mapped[Optional[str]] = mapped_column(
        String(64), ForeignKey("users.id", ondelete="SET NULL"), index=True, nullable=True
    )
    action_type: Mapped[str] = mapped_column(String(128), nullable=False)
    target_resource: Mapped[str] = mapped_column(String(255), nullable=False)
    synthesized_intent: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    risk_score: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    applied_policy: Mapped[Optional[str]] = mapped_column(String(128), nullable=True)
    decision: Mapped[str] = mapped_column(String(32), default="ALLOWED", index=True, nullable=False)
    enclave_type: Mapped[str] = mapped_column(String(128), default="AWS Nitro Enclave v2", nullable=False)
    pcr0_measurement: Mapped[Optional[str]] = mapped_column(String(128), nullable=True)
    call_stack_json: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    event_timestamp: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)

    # Relationships
    agent: Mapped[Optional["Agent"]] = relationship("Agent", back_populates="audit_logs")
    user: Mapped[Optional["User"]] = relationship("User", back_populates="audit_logs")
