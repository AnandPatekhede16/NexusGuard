"""Inter-agent lateral communication channels and eBPF network isolation states."""

from typing import Optional
from sqlalchemy import String, Integer, Boolean, ForeignKey, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from backend.app.db.base import Base, TimestampMixin


class AgentCommunication(Base, TimestampMixin):
    """Lateral communication bus channel between two autonomous agents."""

    __tablename__ = "agent_communications"

    id: Mapped[str] = mapped_column(String(64), primary_key=True)
    source_agent_id: Mapped[str] = mapped_column(
        String(64), ForeignKey("agents.id", ondelete="CASCADE"), index=True, nullable=False
    )
    target_agent_id: Mapped[str] = mapped_column(
        String(64), ForeignKey("agents.id", ondelete="CASCADE"), index=True, nullable=False
    )
    channel_title: Mapped[str] = mapped_column(String(128), nullable=False)
    protocol: Mapped[str] = mapped_column(String(64), default="mTLS-Ed25519", nullable=False)
    state: Mapped[str] = mapped_column(String(32), default="verified", index=True, nullable=False)
    channel_crypto: Mapped[str] = mapped_column(String(64), default="mTLS v1.3 Ed25519", nullable=False)
    signature_hash: Mapped[Optional[str]] = mapped_column(String(128), nullable=True)
    synthesized_intent: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    policy_code: Mapped[Optional[str]] = mapped_column(String(64), nullable=True)
    risk_score: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    diff_payload: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    is_severed: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)

    # Relationships
    source_agent: Mapped["Agent"] = relationship(
        "Agent", foreign_keys=[source_agent_id], back_populates="outbound_communications"
    )
    target_agent: Mapped["Agent"] = relationship(
        "Agent", foreign_keys=[target_agent_id], back_populates="inbound_communications"
    )
