"""Agent identity and cryptographic attestation credentials."""

from datetime import datetime
from typing import Optional
from sqlalchemy import String, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from backend.app.db.base import Base, TimestampMixin


class AgentCredential(Base, TimestampMixin):
    """Cryptographic attestation and identity token metadata. Never stores raw secrets."""

    __tablename__ = "agent_credentials"

    id: Mapped[str] = mapped_column(String(64), primary_key=True)
    agent_id: Mapped[str] = mapped_column(
        String(64), ForeignKey("agents.id", ondelete="CASCADE"), index=True, nullable=False
    )
    key_type: Mapped[str] = mapped_column(String(64), default="mTLS-Ed25519", nullable=False)
    public_key_fingerprint: Mapped[str] = mapped_column(
        String(128), unique=True, index=True, nullable=False
    )
    pcr0_measurement: Mapped[Optional[str]] = mapped_column(String(128), nullable=True)
    issued_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    expires_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    is_revoked: Mapped[bool] = mapped_column(Boolean, default=False, index=True, nullable=False)
    revoked_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    revocation_reason: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)

    # Relationships
    agent: Mapped["Agent"] = relationship("Agent", back_populates="credentials")
