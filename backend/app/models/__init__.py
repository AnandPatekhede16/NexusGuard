"""SQLAlchemy Models package exporting all 12 NexusGuard entities."""

from backend.app.db.base import Base, TimestampMixin
from backend.app.models.user import User
from backend.app.models.agent import Agent
from backend.app.models.credential import AgentCredential
from backend.app.models.permission import Permission, AgentPermission
from backend.app.models.policy import Policy
from backend.app.models.threat import Threat
from backend.app.models.risk import RiskAssessment
from backend.app.models.approval import ApprovalRequest, ApprovalSignature
from backend.app.models.trust import AgentTrust, AgentTrustHistory
from backend.app.models.communication import AgentCommunication
from backend.app.models.execution import AgentExecution
from backend.app.models.audit import AuditLog

__all__ = [
    "Base",
    "TimestampMixin",
    "User",
    "Agent",
    "AgentCredential",
    "Permission",
    "AgentPermission",
    "Policy",
    "Threat",
    "RiskAssessment",
    "ApprovalRequest",
    "ApprovalSignature",
    "AgentTrust",
    "AgentTrustHistory",
    "AgentCommunication",
    "AgentExecution",
    "AuditLog",
]
