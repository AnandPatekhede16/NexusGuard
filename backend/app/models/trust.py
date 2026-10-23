"""Agent trust scoring and historical behavioral trajectory records."""

from datetime import datetime, timezone
from typing import Optional
from sqlalchemy import String, Float, DateTime, ForeignKey, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship
from backend.app.db.base import Base, TimestampMixin


class AgentTrust(Base, TimestampMixin):
    """Dynamic trust parameters and continuous Sigmoid drift state."""

    __tablename__ = "agent_trust"

    id: Mapped[str] = mapped_column(String(64), primary_key=True)
    agent_id: Mapped[str] = mapped_column(
        String(64), ForeignKey("agents.id", ondelete="CASCADE"), unique=True, index=True, nullable=False
    )
    current_score: Mapped[float] = mapped_column(Float, default=100.0, nullable=False)
    baseline_score: Mapped[float] = mapped_column(Float, default=100.0, nullable=False)
    compliance_rate: Mapped[float] = mapped_column(Float, default=100.0, nullable=False)
    anomaly_delta: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)
    behavioral_state: Mapped[str] = mapped_column(String(64), default="OPTIMAL (Stable)", nullable=False)
    sigmoid_steepness: Mapped[float] = mapped_column(Float, default=1.0, nullable=False)
    decay_half_life_hours: Mapped[float] = mapped_column(Float, default=24.0, nullable=False)
    last_evaluated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False
    )

    # Relationships
    agent: Mapped["Agent"] = relationship("Agent", back_populates="trust_record")


class AgentTrustHistory(Base, TimestampMixin):
    """Historical telemetry points powering the 30-day adaptive trust trajectory curve."""

    __tablename__ = "agent_trust_history"

    id: Mapped[str] = mapped_column(String(64), primary_key=True)
    agent_id: Mapped[str] = mapped_column(
        String(64), ForeignKey("agents.id", ondelete="CASCADE"), index=True, nullable=False
    )
    trust_score: Mapped[float] = mapped_column(Float, nullable=False)
    score_delta: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)
    reason: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    recorded_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False
    )

    # Relationships
    agent: Mapped["Agent"] = relationship("Agent", back_populates="trust_history")
