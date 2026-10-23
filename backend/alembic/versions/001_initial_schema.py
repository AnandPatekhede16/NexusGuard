"""Initial schema migration creating all 12 core NexusGuard tables.

Revision ID: 001_initial_schema
Revises: 
Create Date: 2026-10-23 11:45:00.000000

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa

revision: str = "001_initial_schema"
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # 1. users
    op.create_table(
        "users",
        sa.Column("id", sa.String(length=64), primary_key=True),
        sa.Column("email", sa.String(length=255), unique=True, nullable=False),
        sa.Column("username", sa.String(length=64), unique=True, nullable=False),
        sa.Column("full_name", sa.String(length=128), nullable=False),
        sa.Column("hashed_password", sa.String(length=255), nullable=False),
        sa.Column("role", sa.String(length=64), server_default="REVIEWER", nullable=False),
        sa.Column("avatar_initials", sa.String(length=8), nullable=True),
        sa.Column("is_active", sa.Boolean(), server_default=sa.text("true"), nullable=False),
        sa.Column("is_superuser", sa.Boolean(), server_default=sa.text("false"), nullable=False),
        sa.Column("fido2_token_hash", sa.String(length=255), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
    )
    op.create_index("ix_users_email", "users", ["email"])
    op.create_index("ix_users_username", "users", ["username"])

    # 2. agents
    op.create_table(
        "agents",
        sa.Column("id", sa.String(length=64), primary_key=True),
        sa.Column("name", sa.String(length=128), nullable=False),
        sa.Column("model", sa.String(length=64), nullable=False),
        sa.Column("owner", sa.String(length=128), nullable=False),
        sa.Column("role", sa.String(length=128), nullable=False),
        sa.Column("cluster", sa.String(length=128), server_default="Cluster-Default", nullable=False),
        sa.Column("status", sa.String(length=32), server_default="active", nullable=False),
        sa.Column("risk_tier", sa.String(length=32), server_default="LOW", nullable=False),
        sa.Column("description", sa.Text(), nullable=True),
        sa.Column("last_action", sa.String(length=255), nullable=True),
        sa.Column("last_seen", sa.String(length=128), nullable=True),
        sa.Column("violations_count", sa.Integer(), server_default="0", nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
    )
    op.create_index("ix_agents_status", "agents", ["status"])

    # 3. agent_credentials
    op.create_table(
        "agent_credentials",
        sa.Column("id", sa.String(length=64), primary_key=True),
        sa.Column("agent_id", sa.String(length=64), sa.ForeignKey("agents.id", ondelete="CASCADE"), nullable=False),
        sa.Column("key_type", sa.String(length=64), server_default="mTLS-Ed25519", nullable=False),
        sa.Column("public_key_fingerprint", sa.String(length=128), unique=True, nullable=False),
        sa.Column("pcr0_measurement", sa.String(length=128), nullable=True),
        sa.Column("issued_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("expires_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("is_revoked", sa.Boolean(), server_default=sa.text("false"), nullable=False),
        sa.Column("revoked_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("revocation_reason", sa.String(length=255), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
    )
    op.create_index("ix_agent_credentials_agent_id", "agent_credentials", ["agent_id"])
    op.create_index("ix_agent_credentials_fingerprint", "agent_credentials", ["public_key_fingerprint"])
    op.create_index("ix_agent_credentials_is_revoked", "agent_credentials", ["is_revoked"])

    # 4. permissions
    op.create_table(
        "permissions",
        sa.Column("id", sa.String(length=64), primary_key=True),
        sa.Column("scope_name", sa.String(length=128), unique=True, nullable=False),
        sa.Column("resource", sa.String(length=128), nullable=False),
        sa.Column("description", sa.Text(), nullable=True),
        sa.Column("is_system", sa.Boolean(), server_default=sa.text("true"), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
    )
    op.create_index("ix_permissions_scope_name", "permissions", ["scope_name"])

    # 5. agent_permissions
    op.create_table(
        "agent_permissions",
        sa.Column("id", sa.String(length=64), primary_key=True),
        sa.Column("agent_id", sa.String(length=64), sa.ForeignKey("agents.id", ondelete="CASCADE"), nullable=False),
        sa.Column("permission_id", sa.String(length=64), sa.ForeignKey("permissions.id", ondelete="CASCADE"), nullable=False),
        sa.Column("granted_by", sa.String(length=64), nullable=True),
        sa.Column("granted_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("is_active", sa.Boolean(), server_default=sa.text("true"), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
        sa.UniqueConstraint("agent_id", "permission_id", name="uq_agent_permission"),
    )
    op.create_index("ix_agent_permissions_agent_id", "agent_permissions", ["agent_id"])
    op.create_index("ix_agent_permissions_permission_id", "agent_permissions", ["permission_id"])
    op.create_index("ix_agent_permissions_is_active", "agent_permissions", ["is_active"])

    # 6. policies
    op.create_table(
        "policies",
        sa.Column("id", sa.String(length=64), primary_key=True),
        sa.Column("policy_code", sa.String(length=64), unique=True, nullable=False),
        sa.Column("name", sa.String(length=128), nullable=False),
        sa.Column("description", sa.Text(), nullable=True),
        sa.Column("framework", sa.String(length=64), server_default="NIST-AI-RMF", nullable=False),
        sa.Column("standard_reference", sa.String(length=64), nullable=True),
        sa.Column("enforcement_mode", sa.String(length=32), server_default="BLOCK", nullable=False),
        sa.Column("rule_expression", sa.Text(), nullable=True),
        sa.Column("is_active", sa.Boolean(), server_default=sa.text("true"), nullable=False),
        sa.Column("severity", sa.String(length=32), server_default="HIGH", nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
    )
    op.create_index("ix_policies_policy_code", "policies", ["policy_code"])
    op.create_index("ix_policies_is_active", "policies", ["is_active"])

    # 7. threats
    op.create_table(
        "threats",
        sa.Column("id", sa.String(length=64), primary_key=True),
        sa.Column("agent_id", sa.String(length=64), sa.ForeignKey("agents.id", ondelete="SET NULL"), nullable=True),
        sa.Column("policy_id", sa.String(length=64), sa.ForeignKey("policies.id", ondelete="SET NULL"), nullable=True),
        sa.Column("taxonomy_code", sa.String(length=32), nullable=False),
        sa.Column("taxonomy_name", sa.String(length=128), nullable=False),
        sa.Column("title", sa.String(length=255), nullable=False),
        sa.Column("severity", sa.String(length=32), nullable=False),
        sa.Column("risk_score", sa.Integer(), server_default="50", nullable=False),
        sa.Column("status", sa.String(length=32), server_default="CONTAINED", nullable=False),
        sa.Column("engine", sa.String(length=64), server_default="eBPF + Semantic", nullable=False),
        sa.Column("ingress_hash", sa.String(length=128), nullable=True),
        sa.Column("payload_summary", sa.Text(), nullable=True),
        sa.Column("kill_chain_steps_json", sa.Text(), nullable=True),
        sa.Column("detected_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
    )
    op.create_index("ix_threats_agent_id", "threats", ["agent_id"])
    op.create_index("ix_threats_taxonomy_code", "threats", ["taxonomy_code"])
    op.create_index("ix_threats_severity", "threats", ["severity"])
    op.create_index("ix_threats_status", "threats", ["status"])

    # 8. risk_assessments
    op.create_table(
        "risk_assessments",
        sa.Column("id", sa.String(length=64), primary_key=True),
        sa.Column("agent_id", sa.String(length=64), sa.ForeignKey("agents.id", ondelete="CASCADE"), nullable=False),
        sa.Column("overall_risk_score", sa.Integer(), nullable=False),
        sa.Column("risk_tier", sa.String(length=32), server_default="LOW", nullable=False),
        sa.Column("behavioral_drift", sa.Float(), server_default="0.0", nullable=False),
        sa.Column("permission_entropy", sa.Float(), server_default="0.0", nullable=False),
        sa.Column("policy_compliance_subscore", sa.Float(), server_default="100.0", nullable=False),
        sa.Column("identity_attestation_subscore", sa.Float(), server_default="100.0", nullable=False),
        sa.Column("heuristic_velocity_subscore", sa.Float(), server_default="100.0", nullable=False),
        sa.Column("tool_egress_subscore", sa.Float(), server_default="100.0", nullable=False),
        sa.Column("assessment_notes", sa.Text(), nullable=True),
        sa.Column("assessed_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
    )
    op.create_index("ix_risk_assessments_agent_id", "risk_assessments", ["agent_id"])

    # 9. approval_requests
    op.create_table(
        "approval_requests",
        sa.Column("id", sa.String(length=64), primary_key=True),
        sa.Column("incident_code", sa.String(length=64), unique=True, nullable=False),
        sa.Column("agent_id", sa.String(length=64), sa.ForeignKey("agents.id", ondelete="CASCADE"), nullable=False),
        sa.Column("policy_id", sa.String(length=64), sa.ForeignKey("policies.id", ondelete="SET NULL"), nullable=True),
        sa.Column("summary", sa.String(length=255), nullable=False),
        sa.Column("target_resource", sa.String(length=255), nullable=False),
        sa.Column("urgency", sa.String(length=32), server_default="routine", nullable=False),
        sa.Column("status", sa.String(length=32), server_default="PENDING", nullable=False),
        sa.Column("risk_score", sa.Integer(), server_default="50", nullable=False),
        sa.Column("initial_sla_seconds", sa.Integer(), server_default="600", nullable=False),
        sa.Column("remaining_sla_seconds", sa.Integer(), server_default="600", nullable=False),
        sa.Column("stated_objective", sa.Text(), nullable=True),
        sa.Column("neural_analysis", sa.Text(), nullable=True),
        sa.Column("records_affected", sa.String(length=64), nullable=True),
        sa.Column("quorum_threshold", sa.Integer(), server_default="2", nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
    )
    op.create_index("ix_approval_requests_incident_code", "approval_requests", ["incident_code"])
    op.create_index("ix_approval_requests_agent_id", "approval_requests", ["agent_id"])
    op.create_index("ix_approval_requests_urgency", "approval_requests", ["urgency"])
    op.create_index("ix_approval_requests_status", "approval_requests", ["status"])

    # 10. approval_signatures
    op.create_table(
        "approval_signatures",
        sa.Column("id", sa.String(length=64), primary_key=True),
        sa.Column("approval_request_id", sa.String(length=64), sa.ForeignKey("approval_requests.id", ondelete="CASCADE"), nullable=False),
        sa.Column("reviewer_id", sa.String(length=64), sa.ForeignKey("users.id", ondelete="CASCADE"), nullable=False),
        sa.Column("is_signed", sa.Boolean(), server_default=sa.text("false"), nullable=False),
        sa.Column("signed_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("ephemeral_lease_ttl_minutes", sa.Integer(), nullable=True),
        sa.Column("comments", sa.Text(), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
        sa.UniqueConstraint("approval_request_id", "reviewer_id", name="uq_request_reviewer"),
    )
    op.create_index("ix_approval_signatures_request", "approval_signatures", ["approval_request_id"])
    op.create_index("ix_approval_signatures_reviewer", "approval_signatures", ["reviewer_id"])

    # 11. agent_trust
    op.create_table(
        "agent_trust",
        sa.Column("id", sa.String(length=64), primary_key=True),
        sa.Column("agent_id", sa.String(length=64), sa.ForeignKey("agents.id", ondelete="CASCADE"), unique=True, nullable=False),
        sa.Column("current_score", sa.Float(), server_default="100.0", nullable=False),
        sa.Column("baseline_score", sa.Float(), server_default="100.0", nullable=False),
        sa.Column("compliance_rate", sa.Float(), server_default="100.0", nullable=False),
        sa.Column("anomaly_delta", sa.Float(), server_default="0.0", nullable=False),
        sa.Column("behavioral_state", sa.String(length=64), server_default="OPTIMAL (Stable)", nullable=False),
        sa.Column("sigmoid_steepness", sa.Float(), server_default="1.0", nullable=False),
        sa.Column("decay_half_life_hours", sa.Float(), server_default="24.0", nullable=False),
        sa.Column("last_evaluated_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
    )
    op.create_index("ix_agent_trust_agent_id", "agent_trust", ["agent_id"])

    # 12. agent_trust_history
    op.create_table(
        "agent_trust_history",
        sa.Column("id", sa.String(length=64), primary_key=True),
        sa.Column("agent_id", sa.String(length=64), sa.ForeignKey("agents.id", ondelete="CASCADE"), nullable=False),
        sa.Column("trust_score", sa.Float(), nullable=False),
        sa.Column("score_delta", sa.Float(), server_default="0.0", nullable=False),
        sa.Column("reason", sa.String(length=255), nullable=True),
        sa.Column("recorded_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
    )
    op.create_index("ix_agent_trust_history_agent_id", "agent_trust_history", ["agent_id"])

    # 13. agent_communications
    op.create_table(
        "agent_communications",
        sa.Column("id", sa.String(length=64), primary_key=True),
        sa.Column("source_agent_id", sa.String(length=64), sa.ForeignKey("agents.id", ondelete="CASCADE"), nullable=False),
        sa.Column("target_agent_id", sa.String(length=64), sa.ForeignKey("agents.id", ondelete="CASCADE"), nullable=False),
        sa.Column("channel_title", sa.String(length=128), nullable=False),
        sa.Column("protocol", sa.String(length=64), server_default="mTLS-Ed25519", nullable=False),
        sa.Column("state", sa.String(length=32), server_default="verified", nullable=False),
        sa.Column("channel_crypto", sa.String(length=64), server_default="mTLS v1.3 Ed25519", nullable=False),
        sa.Column("signature_hash", sa.String(length=128), nullable=True),
        sa.Column("synthesized_intent", sa.Text(), nullable=True),
        sa.Column("policy_code", sa.String(length=64), nullable=True),
        sa.Column("risk_score", sa.Integer(), server_default="0", nullable=False),
        sa.Column("diff_payload", sa.Text(), nullable=True),
        sa.Column("is_severed", sa.Boolean(), server_default=sa.text("false"), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
    )
    op.create_index("ix_agent_comms_source", "agent_communications", ["source_agent_id"])
    op.create_index("ix_agent_comms_target", "agent_communications", ["target_agent_id"])
    op.create_index("ix_agent_comms_state", "agent_communications", ["state"])

    # 14. agent_executions
    op.create_table(
        "agent_executions",
        sa.Column("id", sa.String(length=64), primary_key=True),
        sa.Column("agent_id", sa.String(length=64), sa.ForeignKey("agents.id", ondelete="CASCADE"), nullable=False),
        sa.Column("operation", sa.String(length=64), nullable=False),
        sa.Column("target_resource", sa.String(length=255), nullable=False),
        sa.Column("raw_payload_snippet", sa.Text(), nullable=True),
        sa.Column("payload_sha256", sa.String(length=128), nullable=True),
        sa.Column("synthesized_intent", sa.Text(), nullable=True),
        sa.Column("verdict", sa.String(length=32), server_default="ALLOWED", nullable=False),
        sa.Column("latency_ms", sa.Float(), server_default="1.5", nullable=False),
        sa.Column("executed_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
    )
    op.create_index("ix_agent_executions_agent_id", "agent_executions", ["agent_id"])
    op.create_index("ix_agent_executions_verdict", "agent_executions", ["verdict"])

    # 15. audit_logs
    op.create_table(
        "audit_logs",
        sa.Column("id", sa.String(length=64), primary_key=True),
        sa.Column("tx_hash", sa.String(length=128), unique=True, nullable=False),
        sa.Column("block_number", sa.Integer(), nullable=False),
        sa.Column("leaf_index", sa.String(length=64), nullable=True),
        sa.Column("leaf_hash", sa.String(length=128), nullable=True),
        sa.Column("parent_root", sa.String(length=128), nullable=True),
        sa.Column("agent_id", sa.String(length=64), sa.ForeignKey("agents.id", ondelete="SET NULL"), nullable=True),
        sa.Column("user_id", sa.String(length=64), sa.ForeignKey("users.id", ondelete="SET NULL"), nullable=True),
        sa.Column("action_type", sa.String(length=128), nullable=False),
        sa.Column("target_resource", sa.String(length=255), nullable=False),
        sa.Column("synthesized_intent", sa.Text(), nullable=True),
        sa.Column("risk_score", sa.Integer(), server_default="0", nullable=False),
        sa.Column("applied_policy", sa.String(length=128), nullable=True),
        sa.Column("decision", sa.String(length=32), server_default="ALLOWED", nullable=False),
        sa.Column("enclave_type", sa.String(length=128), server_default="AWS Nitro Enclave v2", nullable=False),
        sa.Column("pcr0_measurement", sa.String(length=128), nullable=True),
        sa.Column("call_stack_json", sa.Text(), nullable=True),
        sa.Column("event_timestamp", sa.DateTime(timezone=True), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
    )
    op.create_index("ix_audit_logs_tx_hash", "audit_logs", ["tx_hash"])
    op.create_index("ix_audit_logs_block", "audit_logs", ["block_number"])
    op.create_index("ix_audit_logs_decision", "audit_logs", ["decision"])


def downgrade() -> None:
    op.drop_table("audit_logs")
    op.drop_table("agent_executions")
    op.drop_table("agent_communications")
    op.drop_table("agent_trust_history")
    op.drop_table("agent_trust")
    op.drop_table("approval_signatures")
    op.drop_table("approval_requests")
    op.drop_table("risk_assessments")
    op.drop_table("threats")
    op.drop_table("policies")
    op.drop_table("agent_permissions")
    op.drop_table("permissions")
    op.drop_table("agent_credentials")
    op.drop_table("agents")
    op.drop_table("users")
