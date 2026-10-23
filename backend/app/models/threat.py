"""Threat detection incidents and zero-day isolation records."""

from datetime import datetime
from typing import Optional
from sqlalchemy import String, Integer, DateTime, ForeignKey, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from backend.app.db.base import Base, TimestampMixin


class Threat(Base, TimestampMixin):
    """Threat detection incident (OWASP LLM / MITRE ATLAS taxonomy)."""

    __tablename__ = "threats"

    id: Mapped[str] = mapped_column(String(64), primary_key=True)
    agent_id: Mapped[Optional[str]] = mapped_column(
        String(64), ForeignKey("agents.id", ondelete="SET NULL"), index=True, nullable=True
    )
    policy_id: Mapped[Optional[str]] = mapped_column(
        String(64), ForeignKey("policies.id", ondelete="SET NULL"), nullable=True
    )
    taxonomy_code: Mapped[str] = mapped_column(String(32), index=True, nullable=False)
    taxonomy_name: Mapped[str] = mapped_column(String(128), nullable=False)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    severity: Mapped[str] = mapped_column(String(32), index=True, nullable=False)
    risk_score: Mapped[int] = mapped_column(Integer, default=50, nullable=False)
    status: Mapped[str] = mapped_column(String(32), default="CONTAINED", index=True, nullable=False)
    engine: Mapped[str] = mapped_column(String(64), default="eBPF + Semantic", nullable=False)
    ingress_hash: Mapped[Optional[str]] = mapped_column(String(128), nullable=True)
    payload_summary: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    kill_chain_steps_json: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    detected_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)

    # Relationships
    agent: Mapped[Optional["Agent"]] = relationship("Agent", back_populates="threats")
    policy: Mapped[Optional["Policy"]] = relationship("Policy", back_populates="threats")
