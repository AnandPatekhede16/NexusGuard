"""Idempotent development seed script for sovereign autonomous agents.

Seeds ONLY agent configuration records:
1. Research Agent
2. Finance Agent
3. Coding Agent
4. Database Agent
5. RedAgent

Does NOT create fake threats, fake execution history, or fabricated security statistics.
"""

import sys
import asyncio
from typing import List, Dict, Any
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from backend.app.core.logging import logger
from backend.app.db.session import AsyncSessionLocal, check_db_connection, engine
from backend.app.models.agent import Agent
from backend.app.db.base import Base

# Predefined autonomous agent configuration records
SEED_AGENTS: List[Dict[str, Any]] = [
    {
        "id": "agent-research-01",
        "name": "Research Agent",
        "model": "gemini-1.5-pro",
        "owner": "Autonomous R&D SecOps",
        "role": "Information Discovery & Academic Intelligence",
        "cluster": "Cluster-Alpha",
        "status": "active",
        "risk_tier": "LOW",
        "description": "Autonomous search, literature synthesis, and documentation crawler.",
        "violations_count": 0,
    },
    {
        "id": "agent-finance-01",
        "name": "Finance Agent",
        "model": "gpt-4o",
        "owner": "Treasury Systems",
        "role": "Automated Ledger Reconciliation & Budgeting",
        "cluster": "Cluster-Finance",
        "status": "active",
        "risk_tier": "MEDIUM",
        "description": "Autonomous financial transaction analyst and treasury ledger gateway.",
        "violations_count": 0,
    },
    {
        "id": "agent-coding-01",
        "name": "Coding Agent",
        "model": "claude-3-5-sonnet",
        "owner": "DevOps & Core Engineering",
        "role": "Autonomous Software Synthesis & CI/CD Operator",
        "cluster": "Cluster-Alpha",
        "status": "active",
        "risk_tier": "MEDIUM",
        "description": "Automated code synthesis, pull request review, and repository patch engine.",
        "violations_count": 0,
    },
    {
        "id": "agent-database-01",
        "name": "Database Agent",
        "model": "gpt-4o",
        "owner": "Data Infrastructure Team",
        "role": "Schema Migration & DDL Execution Coordinator",
        "cluster": "Cluster-Data",
        "status": "active",
        "risk_tier": "HIGH",
        "description": "Autonomous database schema management, query optimization, and read replica manager.",
        "violations_count": 0,
    },
    {
        "id": "agent-redagent-01",
        "name": "RedAgent",
        "model": "adversarial-probe-v1",
        "owner": "Red Team & Adversarial Simulation",
        "role": "Automated Adversarial Penetration & Threat Emulation",
        "cluster": "Cluster-Isolated",
        "status": "quarantined",
        "risk_tier": "CRITICAL",
        "description": "Adversarial probe agent used for stress-testing NexusGuard intent verification invariants.",
        "violations_count": 0,
    },
]


async def seed_agents(session: AsyncSession) -> List[Agent]:
    """Seed the 5 core sovereign autonomous agent configurations idempotently.
    
    If an agent with the given ID exists, updates its configuration.
    If it does not exist, creates a new Agent record.
    """
    seeded: List[Agent] = []

    for agent_data in SEED_AGENTS:
        stmt = select(Agent).where(Agent.id == agent_data["id"])
        result = await session.execute(stmt)
        existing_agent = result.scalar_one_or_none()

        if existing_agent:
            # Update configuration attributes while preserving dynamic runtime metrics
            existing_agent.name = agent_data["name"]
            existing_agent.model = agent_data["model"]
            existing_agent.owner = agent_data["owner"]
            existing_agent.role = agent_data["role"]
            existing_agent.cluster = agent_data["cluster"]
            existing_agent.risk_tier = agent_data["risk_tier"]
            existing_agent.description = agent_data["description"]
            seeded.append(existing_agent)
            logger.info(f"Agent '{agent_data['name']}' ({agent_data['id']}) already exists. Configuration refreshed.")
        else:
            new_agent = Agent(**agent_data)
            session.add(new_agent)
            seeded.append(new_agent)
            logger.info(f"Agent '{agent_data['name']}' ({agent_data['id']}) registered.")

    await session.commit()
    return seeded


async def main() -> None:
    """CLI runner for seed script."""
    print("NexusGuard: Initializing Agent Directory Seed...")
    db_status = await check_db_connection()

    if not db_status["connected"]:
        print(f"\n[WARNING] Database target is currently unreachable: {db_status.get('error')}")
        print("Configured DATABASE_URL:", db_status.get("database_url"))
        print("\nTo run the seed script with PostgreSQL:")
        print("  1. Ensure PostgreSQL is installed and service is running.")
        print("  2. Verify database 'nexusguard' exists: createdb nexusguard")
        print("  3. Run Alembic migration: alembic -c backend/alembic.ini upgrade head")
        print("  4. Rerun seed script: python -m backend.app.db.seed\n")
        sys.exit(1)

    async with AsyncSessionLocal() as session:
        results = await seed_agents(session)
        print(f"\n[SUCCESS] Successfully seeded {len(results)} agent configuration records:")
        for a in results:
            print(f"  - [{a.status.upper()}] {a.name} ({a.id}) | Model: {a.model} | Tier: {a.risk_tier}")


if __name__ == "__main__":
    asyncio.run(main())
