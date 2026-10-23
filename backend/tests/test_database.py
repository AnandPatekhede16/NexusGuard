"""Tests for database models, constraints, relationships, cascades, and seed script."""

import pytest
import pytest_asyncio
from datetime import datetime, timezone
from typing import AsyncGenerator
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from sqlalchemy.exc import IntegrityError
from sqlalchemy import select, func
from sqlalchemy.orm import selectinload

from backend.app.db.base import Base
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
from backend.app.db.seed import seed_agents


@pytest_asyncio.fixture(scope="function")
async def db_session() -> AsyncGenerator[AsyncSession, None]:
    """In-memory async SQLite session fixture with freshly created schema."""
    test_engine = create_async_engine("sqlite+aiosqlite:///:memory:", echo=False)
    
    async with test_engine.begin() as conn:
        # Enable SQLite foreign key constraint enforcement
        await conn.exec_driver_sql("PRAGMA foreign_keys = ON;")
        await conn.run_sync(Base.metadata.create_all)

    session_factory = async_sessionmaker(bind=test_engine, class_=AsyncSession, expire_on_commit=False)

    async with session_factory() as session:
        yield session

    async with test_engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)

    await test_engine.dispose()


@pytest.mark.asyncio
async def test_user_unique_constraints(db_session: AsyncSession) -> None:
    """Test User unique constraints on email and username."""
    user1 = User(
        id="usr-test-01",
        email="soc-lead@nexusguard.io",
        username="soc_lead",
        full_name="SOC Commander",
        hashed_password="argon2id$hashed$v1",
        role="COMMANDER",
    )
    db_session.add(user1)
    await db_session.commit()

    # Duplicate email should fail
    user_dup_email = User(
        id="usr-test-02",
        email="soc-lead@nexusguard.io",
        username="soc_lead_alt",
        full_name="Alt Lead",
        hashed_password="argon2id$hashed$v2",
        role="REVIEWER",
    )
    db_session.add(user_dup_email)
    with pytest.raises(IntegrityError):
        await db_session.commit()

    await db_session.rollback()

    # Duplicate username should fail
    user_dup_username = User(
        id="usr-test-03",
        email="other@nexusguard.io",
        username="soc_lead",
        full_name="Other Lead",
        hashed_password="argon2id$hashed$v3",
        role="REVIEWER",
    )
    db_session.add(user_dup_username)
    with pytest.raises(IntegrityError):
        await db_session.commit()


@pytest.mark.asyncio
async def test_agent_and_credential_cascade(db_session: AsyncSession) -> None:
    """Test Agent creation, Credential relationship, and cascade deletion."""
    agent = Agent(
        id="agent-cascade-test",
        name="Test Agent",
        model="gpt-4o",
        owner="Engineering",
        role="Code Reviewer",
        status="active",
        risk_tier="LOW",
    )
    db_session.add(agent)
    await db_session.commit()

    cred = AgentCredential(
        id="cred-01",
        agent_id=agent.id,
        key_type="mTLS-Ed25519",
        public_key_fingerprint="SHA256:abcd1234efgh5678",
        issued_at=datetime.now(timezone.utc),
    )
    db_session.add(cred)
    await db_session.commit()

    # Verify relationship query with eager loading
    stmt = select(Agent).options(selectinload(Agent.credentials)).where(Agent.id == agent.id)
    result = await db_session.execute(stmt)
    loaded_agent = result.scalar_one()
    assert len(loaded_agent.credentials) == 1
    assert loaded_agent.credentials[0].public_key_fingerprint == "SHA256:abcd1234efgh5678"

    # Delete agent -> verify credential is also removed via cascade
    await db_session.delete(loaded_agent)
    await db_session.commit()

    cred_stmt = select(AgentCredential).where(AgentCredential.id == "cred-01")
    cred_result = await db_session.execute(cred_stmt)
    assert cred_result.scalar_one_or_none() is None


@pytest.mark.asyncio
async def test_permission_and_agent_permission_unique_constraint(db_session: AsyncSession) -> None:
    """Test fine-grained Permission scopes and composite unique constraint on AgentPermission."""
    agent = Agent(
        id="agent-perm-test",
        name="Perm Test Agent",
        model="gemini-1.5-pro",
        owner="R&D",
        role="Researcher",
    )
    perm = Permission(
        id="perm-scope-01",
        scope_name="read:database_schema",
        resource="PostgreSQL::Schema",
    )
    db_session.add_all([agent, perm])
    await db_session.commit()

    agent_perm1 = AgentPermission(
        id="ap-01",
        agent_id=agent.id,
        permission_id=perm.id,
        granted_at=datetime.now(timezone.utc),
    )
    db_session.add(agent_perm1)
    await db_session.commit()

    # Attempt duplicate assignment of same permission to same agent
    agent_perm_dup = AgentPermission(
        id="ap-02",
        agent_id=agent.id,
        permission_id=perm.id,
        granted_at=datetime.now(timezone.utc),
    )
    db_session.add(agent_perm_dup)
    with pytest.raises(IntegrityError):
        await db_session.commit()


@pytest.mark.asyncio
async def test_approval_request_and_signatures(db_session: AsyncSession) -> None:
    """Test HITL approval request lifecycle and reviewer signature unique constraints."""
    user = User(
        id="usr-reviewer-01",
        email="rev1@nexusguard.io",
        username="reviewer1",
        full_name="Reviewer One",
        hashed_password="hash",
    )
    agent = Agent(
        id="agent-appr-test",
        name="Finance Agent",
        model="gpt-4o",
        owner="Treasury",
        role="FinOps",
    )
    db_session.add_all([user, agent])
    await db_session.commit()

    req = ApprovalRequest(
        id="req-hitl-01",
        incident_code="INC-TREASURY-009",
        agent_id=agent.id,
        summary="High-value wire release",
        target_resource="SWIFT::FedWireGateway",
        urgency="urgent",
        risk_score=88,
        quorum_threshold=2,
    )
    db_session.add(req)
    await db_session.commit()

    sig = ApprovalSignature(
        id="sig-01",
        approval_request_id=req.id,
        reviewer_id=user.id,
        is_signed=True,
        signed_at=datetime.now(timezone.utc),
        ephemeral_lease_ttl_minutes=15,
    )
    db_session.add(sig)
    await db_session.commit()

    # Same reviewer cannot sign the same request twice
    sig_dup = ApprovalSignature(
        id="sig-02",
        approval_request_id=req.id,
        reviewer_id=user.id,
        is_signed=True,
    )
    db_session.add(sig_dup)
    with pytest.raises(IntegrityError):
        await db_session.commit()


@pytest.mark.asyncio
async def test_policy_and_threat_relationship(db_session: AsyncSession) -> None:
    """Test Policy guardrails and Threat incident relationships."""
    policy = Policy(
        id="pol-nist-01",
        policy_code="POLICY-SEC-001",
        name="Zero Exfiltration Invariant",
        enforcement_mode="BLOCK",
        severity="CRITICAL",
    )
    agent = Agent(
        id="agent-threat-test",
        name="Untrusted Scraper",
        model="custom-crawler",
        owner="External",
        role="Scraper",
    )
    db_session.add_all([policy, agent])
    await db_session.commit()

    threat = Threat(
        id="thr-01",
        agent_id=agent.id,
        policy_id=policy.id,
        taxonomy_code="AML.T0005",
        taxonomy_name="Model Inversion",
        title="Excessive prompt reconstruction attempt detected",
        severity="CRITICAL",
        risk_score=95,
        status="CONTAINED",
        detected_at=datetime.now(timezone.utc),
    )
    db_session.add(threat)
    await db_session.commit()

    stmt = select(Threat).options(selectinload(Threat.policy)).where(Threat.id == "thr-01")
    result = await db_session.execute(stmt)
    loaded_threat = result.scalar_one()
    assert loaded_threat.agent_id == agent.id
    assert loaded_threat.policy_id == policy.id
    assert loaded_threat.policy.policy_code == "POLICY-SEC-001"


@pytest.mark.asyncio
async def test_idempotent_seed_script(db_session: AsyncSession) -> None:
    """Test that seed_agents creates exactly the 5 specified agents and is idempotent on repeat execution."""
    # First execution: creates 5 agents
    first_run = await seed_agents(db_session)
    assert len(first_run) == 5

    stmt = select(func.count()).select_from(Agent)
    count = await db_session.scalar(stmt)
    assert count == 5

    # Verify agent names match the required specification exactly
    agent_names = {a.name for a in first_run}
    assert agent_names == {
        "Research Agent",
        "Finance Agent",
        "Coding Agent",
        "Database Agent",
        "RedAgent",
    }

    # Verify RedAgent is quarantined as specified
    red_agent = next(a for a in first_run if a.name == "RedAgent")
    assert red_agent.status == "quarantined"
    assert red_agent.risk_tier == "CRITICAL"

    # Second execution: idempotent, does not duplicate records
    second_run = await seed_agents(db_session)
    assert len(second_run) == 5

    count_after_repeat = await db_session.scalar(stmt)
    assert count_after_repeat == 5
