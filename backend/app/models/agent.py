"""Agent entity model representing sovereign autonomous agents."""

from typing import List, Optional
from sqlalchemy import String, Integer, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from backend.app.db.base import Base, TimestampMixin


class Agent(Base, TimestampMixin):
    """Core Agent directory record."""

    __tablename__ = "agents"

    id: Mapped[str] = mapped_column(String(64), primary_key=True)
    name: Mapped[str] = mapped_column(String(128), nullable=False)
    model: Mapped[str] = mapped_column(String(64), nullable=False)
    owner: Mapped[str] = mapped_column(String(128), nullable=False)
    role: Mapped[str] = mapped_column(String(128), nullable=False)
    cluster: Mapped[str] = mapped_column(String(128), default="Cluster-Default", nullable=False)
    status: Mapped[str] = mapped_column(String(32), default="active", index=True, nullable=False)
    risk_tier: Mapped[str] = mapped_column(String(32), default="LOW", nullable=False)
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    last_action: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    last_seen: Mapped[Optional[str]] = mapped_column(String(128), nullable=True)
    violations_count: Mapped[int] = mapped_column(Integer, default=0, nullable=False)

    # Relationships with safe deletion / cascades
    credentials: Mapped[List["AgentCredential"]] = relationship(
        "AgentCredential", back_populates="agent", cascade="all, delete-orphan"
    )
    permissions: Mapped[List["AgentPermission"]] = relationship(
        "AgentPermission", back_populates="agent", cascade="all, delete-orphan"
    )
    trust_record: Mapped[Optional["AgentTrust"]] = relationship(
        "AgentTrust", back_populates="agent", uselist=False, cascade="all, delete-orphan"
    )
    trust_history: Mapped[List["AgentTrustHistory"]] = relationship(
        "AgentTrustHistory", back_populates="agent", cascade="all, delete-orphan"
    )
    threats: Mapped[List["Threat"]] = relationship("Threat", back_populates="agent")
    risk_assessments: Mapped[List["RiskAssessment"]] = relationship(
        "RiskAssessment", back_populates="agent", cascade="all, delete-orphan"
    )
    approval_requests: Mapped[List["ApprovalRequest"]] = relationship(
        "ApprovalRequest", back_populates="agent", cascade="all, delete-orphan"
    )
    audit_logs: Mapped[List["AuditLog"]] = relationship("AuditLog", back_populates="agent")
    executions: Mapped[List["AgentExecution"]] = relationship(
        "AgentExecution", back_populates="agent", cascade="all, delete-orphan"
    )
    outbound_communications: Mapped[List["AgentCommunication"]] = relationship(
        "AgentCommunication",
        foreign_keys="AgentCommunication.source_agent_id",
        back_populates="source_agent",
        cascade="all, delete-orphan",
    )
    inbound_communications: Mapped[List["AgentCommunication"]] = relationship(
        "AgentCommunication",
        foreign_keys="AgentCommunication.target_agent_id",
        back_populates="target_agent",
        cascade="all, delete-orphan",
    )
