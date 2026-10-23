"""Security policies and invariant guardrails."""

from typing import List, Optional
from sqlalchemy import String, Boolean, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from backend.app.db.base import Base, TimestampMixin


class Policy(Base, TimestampMixin):
    """Zero-trust policy rule (e.g. POLICY-FIN-003, NIST AI RMF invariants)."""

    __tablename__ = "policies"

    id: Mapped[str] = mapped_column(String(64), primary_key=True)
    policy_code: Mapped[str] = mapped_column(String(64), unique=True, index=True, nullable=False)
    name: Mapped[str] = mapped_column(String(128), nullable=False)
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    framework: Mapped[str] = mapped_column(String(64), default="NIST-AI-RMF", nullable=False)
    standard_reference: Mapped[Optional[str]] = mapped_column(String(64), nullable=True)
    enforcement_mode: Mapped[str] = mapped_column(String(32), default="BLOCK", nullable=False)
    rule_expression: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, index=True, nullable=False)
    severity: Mapped[str] = mapped_column(String(32), default="HIGH", nullable=False)

    # Relationships
    threats: Mapped[List["Threat"]] = relationship("Threat", back_populates="policy")
    approval_requests: Mapped[List["ApprovalRequest"]] = relationship("ApprovalRequest", back_populates="policy")
