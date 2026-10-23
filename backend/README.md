# NexusGuard Backend Foundation & Database Architecture

This is the modular FastAPI and SQLAlchemy backend foundation for **NexusGuard** (AI Agent Security & Governance Control Plane).

---

## Architecture Overview

```text
backend/
├── app/
│   ├── api/
│   │   ├── v1/
│   │   │   ├── endpoints/
│   │   │   │   └── health.py          # GET /api/v1/health
│   │   │   └── api.py                 # Aggregated v1 API router
│   ├── core/
│   │   ├── config.py                  # Pydantic Settings & environment variables
│   │   ├── exceptions.py              # Structured error handling & custom exceptions
│   │   └── logging.py                 # Structured logging with secret masking
│   ├── db/
│   │   ├── base.py                    # SQLAlchemy 2.0 Base & TimestampMixin
│   │   ├── session.py                 # Async PostgreSQL engine & connection auditor
│   │   └── seed.py                    # Idempotent development seed script for 5 agents
│   ├── models/                        # 12 Core SQLAlchemy ORM models across 15 tables
│   │   ├── user.py                    # SOC review & commander accounts
│   │   ├── agent.py                   # Autonomous agent registry
│   │   ├── credential.py              # Cryptographic identity & attestation
│   │   ├── permission.py              # Capability scopes & agent grants
│   │   ├── policy.py                  # Zero-trust invariant policies
│   │   ├── threat.py                  # OWASP/MITRE threat incidents
│   │   ├── risk.py                    # Spatial telemetry & risk divergence
│   │   ├── approval.py                # HITL approval requests & quorum signatures
│   │   ├── trust.py                   # Dynamic Sigmoid trust scoring & history
│   │   ├── communication.py           # Lateral inter-agent bus channels
│   │   ├── execution.py               # Tool execution & action audit ledger
│   │   └── audit.py                   # WORM Merkle root cryptographic audit log
│   ├── schemas/                       # Pydantic v2 validation & response models
│   ├── services/                      # Business & application services
│   ├── security/                      # Zero-trust intent & policy engines
│   ├── agents/                        # Autonomous agent runtimes
│   └── main.py                        # FastAPI application instance & lifespan
├── tests/
│   ├── conftest.py                    # Test client fixtures (sync & async)
│   ├── test_health.py                 # Health endpoint & secret masking tests
│   └── test_database.py               # ORM constraints, cascades, & seed tests
├── alembic/
│   ├── env.py                         # Async/sync Alembic migration environment
│   └── versions/
│       └── 001_initial_schema.py      # Initial schema migration (15 tables)
├── alembic.ini                        # Alembic configuration
├── .env.example                       # Example environment variables
├── requirements.txt                   # Production dependencies
├── requirements-dev.txt               # Testing and development dependencies
└── main.py                            # Root launcher proxying to app.main:app
```

---

## 12 Core Database Entities & 15 Relational Tables

| # | Entity / Model | Table Name | Purpose & Safeguards |
|---|----------------|------------|----------------------|
| 1 | `User` | `users` | Reviewers, commanders, and operators. Hashed credentials only (never raw passwords). |
| 2 | `Agent` | `agents` | Sovereign autonomous agent registry with model, cluster, status, and risk tier. |
| 3 | `AgentCredential` | `agent_credentials` | Public key fingerprints (mTLS-Ed25519) and enclave PCR0 measurements. Never stores raw secrets. |
| 4 | `Permission` | `permissions` | Granular capability scopes (`read:database_schema`, `exec:network_egress`). |
| 5 | `AgentPermission` | `agent_permissions` | Composite unique mapping `(agent_id, permission_id)` with active flag and audit info. |
| 6 | `Policy` | `policies` | Invariant rules (`POLICY-FIN-003`, NIST AI RMF, OWASP LLM) with enforcement mode (`BLOCK`, `QUARANTINE`). |
| 7 | `Threat` | `threats` | Threat incidents mapped to MITRE ATLAS / OWASP LLM taxonomy with containment status. |
| 8 | `RiskAssessment` | `risk_assessments` | Composite scoring: behavioral drift, permission entropy, tool egress velocity. |
| 9 | `ApprovalRequest` | `approval_requests` | HITL Enclave execution intercept ticket requiring quorum authorization. |
| 10 | `ApprovalSignature` | `approval_signatures` | Reviewer sign-off within quorum. Composite unique constraint `(approval_request_id, reviewer_id)`. |
| 11 | `AgentTrust` | `agent_trust` | Continuous Sigmoid drift state, baseline score, decay half-life, and anomaly delta. |
| 12 | `AgentTrustHistory` | `agent_trust_history` | 30-day adaptive trajectory telemetry points for risk trend analysis. |
| 13 | `AgentCommunication` | `agent_communications` | Inter-agent lateral bus channels with protocol crypto, intent, and sever switch. |
| 14 | `AgentExecution` | `agent_executions` | Verifiable tool execution trace and SHA-256 payload audit ledger. |
| 15 | `AuditLog` | `audit_logs` | Append-only cryptographically verifiable WORM ledger with Merkle root hashes and block IDs. |

---

## Requirements

- Python 3.11+
- PostgreSQL 14+ (or SQLite for automated in-memory tests)
- Node.js 18+ (for frontend)

---

## Setup & Local Run

### 1. Create and Activate Virtual Environment

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
```

### 2. Install Dependencies

```powershell
pip install -r requirements-dev.txt
```

### 3. Configure Environment Variables

Copy `.env.example` to `.env`:

```powershell
Copy-Item .env.example .env
```

Ensure `DATABASE_URL` matches your database target:

```env
DATABASE_URL="postgresql+asyncpg://postgres:postgres@localhost:5432/nexusguard"
```

> **Safe Disconnected Mode:** If PostgreSQL is not running locally, the backend starts gracefully in disconnected mode without crashing, serving `/api/v1/health` and logging a warning.

---

## Database Migrations (Alembic)

### Offline DDL Review (No Database Required)
To inspect the complete generated PostgreSQL DDL without running a live server:

```powershell
alembic -c backend/alembic.ini upgrade head --sql
```

### Live Migration Execution
Once your PostgreSQL instance is running:

```powershell
# 1. Create database in PostgreSQL (if not exists)
createdb nexusguard

# 2. Apply all schema migrations
alembic -c backend/alembic.ini upgrade head
```

---

## Development Seed Script

The seed script registers the **5 Sovereign Autonomous Agents**:
1. **Research Agent** (`agent-research-01`) | Information Discovery & Academic Intelligence (Cluster-Alpha)
2. **Finance Agent** (`agent-finance-01`) | Automated Ledger Reconciliation & Budgeting (Cluster-Finance)
3. **Coding Agent** (`agent-coding-01`) | Autonomous Software Synthesis & CI/CD Operator (Cluster-Alpha)
4. **Database Agent** (`agent-database-01`) | Schema Migration & DDL Execution Coordinator (Cluster-Data)
5. **RedAgent** (`agent-redagent-01`) | Automated Adversarial Threat Emulation (`quarantined`, CRITICAL)

> **Strict Development Rule:** The seed script registers **only agent configuration records**. It does **not** create fake threats, fake execution history, or fabricated security statistics.

### Run Seed Script
```powershell
python -m backend.app.db.seed
```
The script is strictly **idempotent**: running it repeatedly safely updates agent metadata without creating duplicate rows.

---

## Running Automated Tests

Run the full automated test suite with `pytest` (uses in-memory SQLite with foreign key enforcement and asyncpg simulation):

```powershell
pytest -v backend/tests
```

Tests cover:
- Health checks and masked secret logging
- User unique constraints on email and username
- Foreign key cascading deletion (`agents` -> `agent_credentials`, `agent_trust`, etc.)
- Composite unique constraints (`(agent_id, permission_id)`, `(approval_request_id, reviewer_id)`)
- Policy guardrails and Threat incident mapping
- Idempotent execution of the 5-agent seed script

---

## Oracle SQL Developer Integration Guide

If you have Oracle SQL Developer installed (e.g., at `C:\Users\Anand Patekhede\Downloads\sqldeveloper-24.3.1.347.1826-x64\sqldeveloper`):

### Understanding SQL Developer vs Database Server
- **Oracle SQL Developer** is a graphical client/editor GUI tool.
- It requires an active database server to connect to (either PostgreSQL or Oracle Database).

### Connecting SQL Developer to PostgreSQL:
1. Download the **PostgreSQL JDBC Driver** (`postgresql-42.x.x.jar`) from [jdbc.postgresql.org](https://jdbc.postgresql.org/).
2. Open Oracle SQL Developer:
   - Navigate to **Tools** -> **Preferences** -> **Database** -> **Third Party JDBC Drivers**.
   - Click **Add Entry...** and select the downloaded PostgreSQL `.jar` file.
3. Create a new Connection:
   - Click **New Connection (+)**.
   - You will now see a **PostgreSQL** tab.
   - Enter:
     * Hostname: `localhost`
     * Port: `5432`
     * Database: `nexusguard`
     * Username: `postgres`
     * Password: `<your-postgres-password>`
4. Click **Test** and then **Connect**. You can now inspect, visualize, and query all 15 NexusGuard tables directly in SQL Developer!

### Alternative Lightweight Clients
You can also use:
- **pgAdmin 4** (dedicated PostgreSQL GUI)
- **DBeaver Community** (universal database tool supporting both PostgreSQL and Oracle)
- **VS Code Extension** (`Database Client` or `PostgreSQL`)

---

## PostgreSQL Status & Live Limitations

| Component | Status | Note |
|---|---|---|
| PostgreSQL Server (Port 5432) | **Not Running Locally** | Local port check on `localhost:5432` returned `TcpTestSucceeded: False`. |
| Offline Alembic DDL | **Operational** | `alembic upgrade head --sql` generates full valid DDL. |
| In-Memory Test Suite | **12 / 12 Passing** | Pytest executes all schema, constraint, and seed validations in ~2.6s. |
| Backend Health Endpoint | **Operational** | Starts in disconnected safe mode without crashing. |
