"""Agent execution and autonomous tool run history."""

from datetime import datetime
from typing import Optional
from sqlalchemy import String, Float, DateTime, ForeignKey, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from backend.app.db.base import Base, TimestampMixin


class AgentExecution(Base, TimestampMixin):
    """Verifiable execution trace and tool invocation history."""

    __tablename__ = "agent_executions"

    id: Mapped[str] = mapped_column(String(64), primary_key=True)
    agent_id: Mapped[str] = mapped_column(
        String(64), ForeignKey("agents.id", ondelete="CASCADE"), index=True, nullable=False
    )
    operation: Mapped[str] = mapped_column(String(64), nullable=False)
    target_resource: Mapped[str] = mapped_column(String(255), nullable=False)
    raw_payload_snippet: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    payload_sha256: Mapped[Optional[str]] = mapped_column(String(128), nullable=True)
    synthesized_intent: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    verdict: Mapped[str] = mapped_column(String(32), default="ALLOWED", index=True, nullable=False)
    latency_ms: Mapped[float] = mapped_column(Float, default=1.5, nullable=False)
    executed_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)

    # Relationships
    agent: Mapped["Agent"] = relationship("Agent", back_populates="executions")
