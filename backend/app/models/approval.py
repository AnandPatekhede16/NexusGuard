"""Human-in-the-Loop (HITL) approval requests and multi-party quorum sign-offs."""

from datetime import datetime
from typing import List, Optional
from sqlalchemy import String, Integer, Boolean, DateTime, ForeignKey, Text, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship
from backend.app.db.base import Base, TimestampMixin


class ApprovalRequest(Base, TimestampMixin):
    """HITL Enclave execution intercept ticket requiring human authorization."""

    __tablename__ = "approval_requests"

    id: Mapped[str] = mapped_column(String(64), primary_key=True)
    incident_code: Mapped[str] = mapped_column(String(64), unique=True, index=True, nullable=False)
    agent_id: Mapped[str] = mapped_column(
        String(64), ForeignKey("agents.id", ondelete="CASCADE"), index=True, nullable=False
    )
    policy_id: Mapped[Optional[str]] = mapped_column(
        String(64), ForeignKey("policies.id", ondelete="SET NULL"), nullable=True
    )
    summary: Mapped[str] = mapped_column(String(255), nullable=False)
    target_resource: Mapped[str] = mapped_column(String(255), nullable=False)
    urgency: Mapped[str] = mapped_column(String(32), default="routine", index=True, nullable=False)
    status: Mapped[str] = mapped_column(String(32), default="PENDING", index=True, nullable=False)
    risk_score: Mapped[int] = mapped_column(Integer, default=50, nullable=False)
    initial_sla_seconds: Mapped[int] = mapped_column(Integer, default=600, nullable=False)
    remaining_sla_seconds: Mapped[int] = mapped_column(Integer, default=600, nullable=False)
    stated_objective: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    neural_analysis: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    records_affected: Mapped[Optional[str]] = mapped_column(String(64), nullable=True)
    quorum_threshold: Mapped[int] = mapped_column(Integer, default=2, nullable=False)

    # Relationships
    agent: Mapped["Agent"] = relationship("Agent", back_populates="approval_requests")
    policy: Mapped[Optional["Policy"]] = relationship("Policy", back_populates="approval_requests")
    signatures: Mapped[List["ApprovalSignature"]] = relationship(
        "ApprovalSignature", back_populates="approval_request", cascade="all, delete-orphan"
    )


class ApprovalSignature(Base, TimestampMixin):
    """Individual human reviewer sign-off within the quorum."""

    __tablename__ = "approval_signatures"
    __table_args__ = (
        UniqueConstraint("approval_request_id", "reviewer_id", name="uq_request_reviewer"),
    )

    id: Mapped[str] = mapped_column(String(64), primary_key=True)
    approval_request_id: Mapped[str] = mapped_column(
        String(64), ForeignKey("approval_requests.id", ondelete="CASCADE"), index=True, nullable=False
    )
    reviewer_id: Mapped[str] = mapped_column(
        String(64), ForeignKey("users.id", ondelete="CASCADE"), index=True, nullable=False
    )
    is_signed: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    signed_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    ephemeral_lease_ttl_minutes: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    comments: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

    # Relationships
    approval_request: Mapped["ApprovalRequest"] = relationship("ApprovalRequest", back_populates="signatures")
    reviewer: Mapped["User"] = relationship("User", back_populates="signatures")
