"""Multi-dimensional risk assessment and spatial telemetry."""

from datetime import datetime
from typing import Optional
from sqlalchemy import String, Integer, Float, DateTime, ForeignKey, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from backend.app.db.base import Base, TimestampMixin


class RiskAssessment(Base, TimestampMixin):
    """Spatial risk divergence and composite scoring."""

    __tablename__ = "risk_assessments"

    id: Mapped[str] = mapped_column(String(64), primary_key=True)
    agent_id: Mapped[str] = mapped_column(
        String(64), ForeignKey("agents.id", ondelete="CASCADE"), index=True, nullable=False
    )
    overall_risk_score: Mapped[int] = mapped_column(Integer, nullable=False)
    risk_tier: Mapped[str] = mapped_column(String(32), default="LOW", nullable=False)
    behavioral_drift: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)
    permission_entropy: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)
    policy_compliance_subscore: Mapped[float] = mapped_column(Float, default=100.0, nullable=False)
    identity_attestation_subscore: Mapped[float] = mapped_column(Float, default=100.0, nullable=False)
    heuristic_velocity_subscore: Mapped[float] = mapped_column(Float, default=100.0, nullable=False)
    tool_egress_subscore: Mapped[float] = mapped_column(Float, default=100.0, nullable=False)
    assessment_notes: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    assessed_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)

    # Relationships
    agent: Mapped["Agent"] = relationship("Agent", back_populates="risk_assessments")
