"""Tests for Agent Operations & Intent Firewall Evaluation API."""

import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_get_oracle_tables(async_client: AsyncClient) -> None:
    """Verify GET /api/v1/agents/oracle-tables returns list of created NexusGuard tables."""
    response = await async_client.get("/api/v1/agents/oracle-tables")
    assert response.status_code == 200
    tables = response.json()
    assert isinstance(tables, list)
    # Tables like AGENTS, USERS, POLICIES should exist in Oracle
    assert any("AGENTS" in t for t in tables)


@pytest.mark.asyncio
async def test_get_oracle_fleet(async_client: AsyncClient) -> None:
    """Verify GET /api/v1/agents/oracle-fleet returns the 5 seeded sovereign agents."""
    response = await async_client.get("/api/v1/agents/oracle-fleet")
    assert response.status_code == 200
    agents = response.json()
    assert len(agents) >= 5
    agent_names = {a["name"] for a in agents}
    assert "Database Agent" in agent_names
    assert "Research Agent" in agent_names


@pytest.mark.asyncio
async def test_intent_firewall_blocks_mutation(async_client: AsyncClient) -> None:
    """Verify Intent Firewall blocks destructive DDL/DML statements with CRITICAL risk."""
    payload = {
        "agent_id": "DB-AGENT-01",
        "agent_name": "DB Orchestrator",
        "query": "DROP TABLE employee_salary;",
        "permissions": ["QUERY: DB", "DB: Maintenance"],
        "target_resource": "Oracle::ORCL.salary",
    }
    response = await async_client.post("/api/v1/agents/evaluate-action", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["verdict"] == "BLOCKED"
    assert data["risk_score"] >= 90
    assert "POLICY-SEC-MUTATION-001" in data["policy_code"]
    assert data["query_output"] is None


@pytest.mark.asyncio
async def test_intent_firewall_blocks_missing_permission(async_client: AsyncClient) -> None:
    """Verify Intent Firewall blocks query execution when agent lacks QUERY: DB scope."""
    payload = {
        "agent_id": "DB-AGENT-01",
        "agent_name": "DB Orchestrator",
        "query": "SELECT * FROM agents;",
        "permissions": [],  # No permissions assigned
        "target_resource": "Oracle::ORCL.agents",
    }
    response = await async_client.post("/api/v1/agents/evaluate-action", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["verdict"] == "BLOCKED"
    assert data["risk_score"] == 88
    assert "POLICY-ZERO-TRUST-002" in data["policy_code"]
    assert data["query_output"] is None


@pytest.mark.asyncio
async def test_intent_firewall_allows_authorized_query(async_client: AsyncClient) -> None:
    """Verify Intent Firewall allows query execution and executes on Oracle when QUERY: DB is granted."""
    payload = {
        "agent_id": "DB-AGENT-01",
        "agent_name": "DB Orchestrator",
        "query": "SELECT id, name, status, risk_tier FROM agents;",
        "permissions": ["QUERY: DB"],
        "target_resource": "Oracle::ORCL.agents",
    }
    response = await async_client.post("/api/v1/agents/evaluate-action", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["verdict"] == "ALLOWED"
    assert data["risk_score"] == 14
    assert data["query_output"] is not None
    assert "agent-database-01" in data["query_output"] or "Database Agent" in data["query_output"]
