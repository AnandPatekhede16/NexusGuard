# NexusGuard: Sovereign Autonomous AI Agent Security & Zero-Trust Governance Control Plane

[![FastAPI](https://img.shields.io/badge/FastAPI-0.115+-009688?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![Oracle Database 11g](https://img.shields.io/badge/Oracle_Database-11g_XE-F80000?logo=oracle&logoColor=white)](https://www.oracle.com/database/)
[![React + Vite](https://img.shields.io/badge/React_Vite-19.0+-61DAFB?logo=vite&logoColor=white)](https://vitejs.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5+-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Python 3.11](https://img.shields.io/badge/Python-3.11+-3776AB?logo=python&logoColor=white)](https://www.python.org)
[![Zero-Trust](https://img.shields.io/badge/Zero--Trust-Stage--Zero_Interlock-00E5FF)](https://csrc.nist.gov/publications/detail/sp/800-207/final)
[![Tests Passing](https://img.shields.io/badge/Pytest-17%20Passed-brightgreen)](file:///backend/tests)

---

## 1. Executive Summary & Project Overview

**NexusGuard** is an enterprise-grade, zero-trust cybersecurity and governance control plane designed to protect relational databases, microservices, and internal infrastructure from autonomous AI agent compromise.

As Large Language Models (LLMs) transition from conversational chatbots into **autonomous agents** capable of executing arbitrary SQL queries, invoking CLI subprocesses, pushing code commits, and modifying relational data, conventional perimeter firewalls fail to secure systems. Autonomous agents operate *inside* the enterprise perimeter with legitimate credentials—making prompt injections, tool abuse, goal hijacking, and privilege escalation catastrophic.

NexusGuard solves this paradigm shift by introducing a **Deterministic Stage-Zero Intent Firewall & Governance Control Plane**:
* **Stage-Zero Interception:** Synthesizes natural language intent and analyzes SQL/command ASTs *before* any query touches the database or network socket. Unauthorized mutations are terminated in `< 2 milliseconds`.
* **Two-Tier Capability Hierarchy:** Requires base reading permissions (`QUERY: DB`) and strictly separate mutation clearance (`WRITE: DB`) under cryptographic lease tokens.
* **Live Relational Verification:** Directly integrated with **Oracle Database 11g Express Edition** (`localhost:1521/ORCL`) managing 15 verified relational tables.
* **Cryptographic Non-Repudiation:** Generates hardware-attested SHA-256 Merkle WORM (Write-Once-Read-Many) audit proofs simulating AWS Nitro Enclaves (FIPS 140-3).
* **Adversarial Red Teaming:** Emulates continuous adversarial penetration testing through an isolated probe agent (`RED-AGENT-01`).

---

## 2. Six Core Governance Pillars

NexusGuard establishes six sovereign operational guarantees enforced across all autonomous agents:

```
┌────────────────────────────────────────────────────────────────────────┐
│                   NEXUSGUARD ZERO-TRUST CONTROL PLANE                  │
├────────────────────┬────────────────────┬──────────────────────────────┤
│ 01 / SECURITY      │ 02 / TRUST         │ 03 / CONTROL                 │
│ Zero-Trust AST     │ Continuous Sigmoid │ Stage-Zero Interlocks,       │
│ Interception &     │ Decay Heuristics & │ Fleet Kill Switches &        │
│ eBPF Kernel Traps  │ Nitro Attestation  │ Dual-Key Quorum Leases       │
├────────────────────┼────────────────────┼──────────────────────────────┤
│ 04 / TRANSPARENCY  │ 05 / ACCOUNTABILITY│ 06 / AUTONOMY WITH OVERSIGHT │
│ Deterministic AST  │ Immutable WORM     │ High Velocity Execution      │
│ Intent Synthesis & │ Merkle Ledger &    │ Coupled with SLA HITL        │
│ Sub-2ms Latency    │ SHA-256 Proofs     │ Escalation Enclaves          │
└────────────────────┴────────────────────┴──────────────────────────────┘
```

1. **SECURITY:** Deterministic AST intent parsing, eBPF kernel traps, and hardened execution enclaves (`0.00% Bypass`).
2. **TRUST:** Heuristic drift tracking, dynamic sigmoid privilege degradation, and AWS Nitro PCR0 attestation.
3. **CONTROL:** Instant fleet-wide emergency kill switches, database egress severing, and time-bounded capability tokens.
4. **TRANSPARENCY:** Full execution call stacks, interactive network topology mapping, and sub-2ms latency budgets.
5. **ACCOUNTABILITY:** Write-Once-Read-Many (WORM) audit ledgers, Merkle proofs, and cryptographic non-repudiation.
6. **AUTONOMY WITH OVERSIGHT:** Unconstrained multi-agent execution velocity paired with synchronous SLA countdowns and dual-key human approval queues.

---

## 3. High-Level System Architecture

NexusGuard sits between autonomous AI agent orchestrators and sovereign enterprise resources:

```
[ Autonomous AI Agent / Orchestrator ]
                  │
                  ▼  (HTTP / mTLS Ed25519)
┌────────────────────────────────────────────────────────────────────────┐
│ NEXUSGUARD FASTAPI CONTROL PLANE (:8000)                               │
│                                                                        │
│ 1. Pydantic v2 Schema Sanitization & Field Validator                   │
│ 2. eBPF Network Trap & Socket Monitor (Blocks SSRF & IMDS)             │
│ 3. AST Intent Synthesis & Lexical SQL Analyzer                         │
│ 4. Two-Tier Zero-Trust Capability Matrix Engine                        │
│    ├── Base Capability Check: Does agent possess 'QUERY: DB'?         │
│    └── Mutation Check: If DML (UPDATE/INSERT), possess 'WRITE: DB'?   │
│ 5. Strict DDL Guardrail (Blocks DROP/TRUNCATE/ALTER at Risk Score 95)  │
│ 6. WORM Cryptographic Hasher (SHA-256 Merkle Transaction Proofs)      │
└────────────────────────────────────────────────────────────────────────┘
                  │                                   │
      [ If Verdict == BLOCKED ]           [ If Verdict == ALLOWED ]
                  │                                   │
                  ▼                                   ▼
         TERMINATE AT STAGE-ZERO           DISPATCH VIA SQL*PLUS DRIVER
       • Sub-2ms execution cutoff          • TCP Port 1521 / ORCL
       • 0 queries reach database          • Auto-commit transaction
       • Emit Threat Event Stream          • Log to Oracle AUDIT_LOGS table
                  │                                   │
                  └─────────────────┬─────────────────┘
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│ LIVE STORAGE & HARDWARE ATTESTATION                                    │
│                                                                        │
│ • Oracle Database 11g Express Edition (localhost:1521/ORCL)            │
│   └── 15 Sovereign Relational Tables Verified in user_tables           │
│ • AWS Nitro Enclave / PCR0 Register Measurement Simulation             │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 4. The 5 Sovereign Autonomous Agents

NexusGuard governs 5 specialized autonomous agents seeded directly in Oracle 11g:

| Agent ID | Sovereign Name | Assigned LLM Model | Role & Scope | Security Constraints in NexusGuard |
|---|---|---|---|---|
| **`DB-AGENT-01`** | **DB Orchestrator** | Claude 3.5 Sonnet / GPT-4o | Database Operations & Schema Migrations | Strictly requires `QUERY: DB` for reads and `WRITE: DB` for mutations. Destructive DDL (`DROP TABLE`) blocked at Risk 95. |
| **`FIN-AGENT-01`** | **Finance Agent Alpha** | GPT-4o (FinCore) | Financial Analyst & Treasury Reconciliation | Holds `READ: Finance` and `QUERY: DB`. Mass exfiltration to untrusted buckets (`EXPORT: Data`) blocked at Stage-Zero (`POLICY-FIN-EXFIL-001`). |
| **`COD-AGENT-01`** | **DevOps Synth Bot** | Claude 3.5 Sonnet | CI/CD Pipeline & Codebase Maintenance | Holds `EXECUTE: CI` and `GIT: Push`. Direct production releases (`DEPLOY: Prod`) require dual-key human quorum. SSRF blocked by kernel traps. |
| **`RES-AGENT-01`** | **Research Core Vector** | Gemini 1.5 Pro | Information Discovery & Academic Intelligence | Holds `SEARCH: Vector` and `READ: Arxiv`. Sandboxed from private intranet scraping. Large volume spikes trigger automatic rate caps. |
| **`RED-AGENT-01`** | **Adversarial Probe X (RedAgent)** | Mistral Large / Probe-v1 | Automated Adversarial Penetration Testing | Simulated attacker agent held in perpetual **Quarantine Isolation** (Trust 18%, Risk Tier CRITICAL, all capabilities revoked). Used to stress-test firewall. |

---

## 5. The 15 Oracle 11g Relational Tables

The system schema is fully realized in Oracle Database 11g Express Edition (`ORCL`) across 15 interrelated tables:

```
                     ┌───────────────┐
                     │     USERS     │
                     └───────┬───────┘
                             │ 1:N
┌────────────────────┐       ▼       ┌────────────────────────┐
│    PERMISSIONS     │◄─────────────┤   APPROVAL_SIGNATURES  │
└─────────┬──────────┘               └───────────┬────────────┘
          │ 1:N                                  │ N:1
          ▼                                      ▼
┌────────────────────┐               ┌────────────────────────┐
│ AGENT_PERMISSIONS  │               │   APPROVAL_REQUESTS    │
└─────────┬──────────┘               └───────────┬────────────┘
          │ N:1                                  │ N:1
          ▼                                      ▼
┌─────────────────────────────────────────────────────────────┐
│                           AGENTS                            │
└───┬─────────────┬─────────────┬─────────────┬───────────┬───┘
    │ 1:1         │ 1:N         │ 1:1         │ 1:N       │ 1:N
    ▼             ▼             ▼             ▼           ▼
┌─────────┐ ┌───────────┐ ┌───────────┐ ┌───────────┐ ┌───────────┐
│  AGENT  │ │   AGENT   │ │   AGENT   │ │   AGENT   │ │   AUDIT   │
│  TRUST  │ │EXECUTIONS │ │CREDENTIALS│ │  THREATS  │ │   LOGS    │
└─────────┘ └───────────┘ └───────────┘ └───────────┘ └───────────┘
```

1. **`AGENTS`**: Identity, model, owner, cluster, status (`active`, `restricted`, `quarantined`), risk tier, last action, and violations count.
2. **`USERS`**: Human SOC reviewers and administrators (`Col. Marcus Vance`, `Anand Patekhede`, `Sarah Chen`) with FIDO2 key hashes.
3. **`PERMISSIONS`**: Granular system capability scopes (`QUERY: DB`, `WRITE: DB`, `EXECUTE: CI`, `READ: Finance`, `SEARCH: Vector`...).
4. **`AGENT_PERMISSIONS`**: Foreign-key relational association mapping capabilities to sovereign agents.
5. **`POLICIES`**: Declarative security rules (`POLICY-SEC-MUTATION-001`, `POLICY-ZERO-TRUST-WRITE-002`, `POLICY-FIN-EXFIL-001`...).
6. **`THREATS`**: Intercepted attack vectors cataloged under CWE-89, OWASP-LLM-01, and MITRE-ATLAS taxonomy codes.
7. **`RISK_ASSESSMENTS`**: Dynamic risk evaluations calculating behavioral drift, permission entropy, and compliance subscores.
8. **`APPROVAL_REQUESTS`**: Pending Human-in-the-Loop approval requests requiring cryptographic quorum.
9. **`APPROVAL_SIGNATURES`**: Reviewer signatures, ephemeral lease TTL countdowns, and justification logs.
10. **`AGENT_TRUST`**: Real-time adaptive trust scores calculated via sigmoid decay half-life curves.
11. **`AGENT_TRUST_HISTORY`**: Time-series log of trust score fluctuations and penalty reasons.
12. **`AGENT_COMMUNICATIONS`**: Inter-agent mTLS network channels, cryptographic handshakes, and severed link-state flags.
13. **`AGENT_EXECUTIONS`**: Transactional history of SQL queries and API operations with SHA-256 payload digests.
14. **`AUDIT_LOGS`**: Cryptographic WORM audit log entries containing Merkle roots, leaf indexes, and hardware PCR0 hashes.
15. **`AGENT_CREDENTIALS`**: mTLS Ed25519 public key fingerprints and TPM 2.0 / Nitro PCR0 measurements.

---

## 6. Complete UI Feature Walkthrough (16 Specialized Pages)

The NexusGuard web console provides 16 specialized control modules accessible from the sidebar:

1. **⭐ Multi-Agent Studio (`viva-studio`):** The primary viva evaluation module. Toggle active sovereign agents, test permission grant/revoke interlocks, execute live Oracle 11g SQL queries, and trigger destructive attack payloads with live terminal feedback.
2. **Overview Command Center (`overview`):** Central dashboard featuring the Active Fleet Control Strip, dynamic KPI metrics, the Six Assurance Pillars matrix, and the real-time Threat & Policy Event Stream.
3. **System Architecture (`system-architecture`):** Interactive architectural blueprint detailing the 5-stage pipeline, internal execution call stacks, cryptography specifications, and sub-2ms latency benchmarks.
4. **Agent Registry (`agents`):** Sovereign agent directory with status filtering (`Active`, `Restricted`, `Quarantined`), search, identity metadata, and deep-link profiling.
5. **Agent Detail (`agent-detail`):** Individual agent inspection dossier displaying assigned capability envelopes, historical activity logs, trust scores, and manual isolation overrides.
6. **Agent Network Mesh (`agent-network`):** Topology visualization of inter-agent mTLS communications, protocol filters, and severed links (e.g. RedAgent isolation).
7. **Permission Management (`permissions`):** RBAC/ABAC matrix where administrators dynamically grant and revoke specific scopes (`WRITE: DB`, `QUERY: DB`) per agent with immediate global propagation.
8. **Intent Firewall (`intent-firewall`):** Live AST lexical analysis ledger displaying intercepted queries, linguistic confidence scores, triggered policy codes, and syntactic root cause diagnostics.
9. **Risk Center (`risk-center`):** Multi-dimensional anomaly scoring analyzing behavioral drift velocity, permission entropy, and sensitive schema probes across configurable timeframes (`1h`, `6h`, `24h`, `7d`).
10. **Threat Detection (`threat-detection`):** Threat taxonomy matrix mapped to OWASP LLM Top 10 and MITRE ATLAS featuring interactive 4-step forensic kill-chain progression drawers.
11. **RedAgent Simulator (`red-agent`):** Offensive security testing console with 4 interactive attack scenarios (Prompt Injection, Goal Hijacking, Cloud IMDS SSRF, and Adversarial SQL Injection).
12. **Trust & Behavior (`trust-behavior`):** Mathematical trust tracking displaying 30-day historical SVG trajectories, sigmoid decay formulas, and weighted subscore contributions.
13. **Kill Switch & Emergency Response (`kill-switch`):** Tactical incident response console featuring 4 dual-key DEFCON interlocks (Global Kill, Sever DB Egress, Revoke mTLS, Air-Gap Enclaves) and one-click quarantine actions.
14. **Human Approvals Queue (`human-approvals`):** Multi-sig governance portal where security officers review high-risk actions, inspect neural impact analysis, and authorize ephemeral leases with hardware keys.
15. **Audit Trail (`audit-trail`):** Immutable WORM audit ledger with Merkle proof verification (`tx_hash`, block number, leaf hash, parent root, and AWS Nitro PCR0).
16. **Compliance & Reporting (`policy-center`):** Automated regulatory compliance matrix mapped to NIST AI RMF, ISO/IEC 42001, EU AI Act, SOC 2, and HIPAA.

---

## 7. Prerequisites & Installation

### Prerequisites
* **Operating System:** Windows 10/11, macOS, or Linux.
* **Python:** Version 3.11 or higher.
* **Node.js:** Version 18.0 or higher (with npm).
* **Oracle Database 11g:** Express Edition (`localhost:1521/ORCL`) with `sqlplus` CLI configured in your system PATH.

---

### Step 1: Database Setup & Seeding

1. Open PowerShell or Terminal and verify Oracle Database 11g is running on port 1521:
   ```cmd
   sqlplus system/123456@localhost:1521/ORCL
   ```
2. Run the all-in-one schema creation and seed script:
   ```cmd
   sqlplus system/123456@localhost:1521/ORCL @backend/database/oracle_schema_and_seed.sql
   ```
   *This automatically creates all 15 relational tables and populates them with verified sovereign agents, policies, threats, permissions, and audit logs.*

---

### Step 2: Backend Setup & Execution

1. Navigate to the backend directory and activate the Python virtual environment:
   ```powershell
   cd backend
   python -m venv .venv
   .\.venv\Scripts\activate   # On Linux/macOS: source .venv/bin/activate
   ```
2. Install dependencies:
   ```powershell
   pip install -r requirements.txt
   ```
3. Run the automated Pytest test suite:
   ```powershell
   pytest -v tests
   ```
   *(Expected: `17 passed in ~3.3s`)*
4. Start the FastAPI backend server:
   ```powershell
   python main.py
   ```
   *The backend starts at **`http://localhost:8000`**. Interactive Swagger API docs are available at **`http://localhost:8000/api/v1/docs`**.*

---

### Step 3: Frontend Setup & Execution

1. Open a new terminal and navigate to the frontend directory:
   ```powershell
   cd frontend
   npm install
   ```
2. Verify TypeScript build compilation:
   ```powershell
   npm run build
   ```
   *(Expected: `✓ built in ~3.1s with 0 errors`)*
3. Start the Vite development server:
   ```powershell
   npm run dev
   ```
   *The frontend dashboard launches at **`http://localhost:5173`**.*

---

## 8. Step-by-Step Viva Demo Script for Project Review

Follow this exact sequential path to demonstrate the system to your evaluator:

1. **Open the Web Console:** Navigate to **`http://localhost:5173`**.
2. **Show Active Fleet Dynamic Adaptation:**
   * On the Overview dashboard, look at the **Active Governance Fleet Strip**.
   * Click **"Focus DB Only"** — observe that KPI metrics (`ACTIVE FLEET: 1`, `PROTECTED OPS`), the threat feed, and table listings adapt instantly to show only Database Agent.
   * Click **"Select All 5"** — watch all 5 sovereign agents reactivate simultaneously.
3. **Launch ⭐ Multi-Agent Studio:** Click the first tab in the sidebar.
4. **Demonstrate Stage-Zero Permission Interlock:**
   * Select **DB-AGENT-01**.
   * Under Current Scope, click **`Revoke "WRITE: DB"`** (the badge turns red `REVOKED`).
   * Click **`Action 2: Make Database Change (UPDATE)`**.
   * **Result:** The terminal turns **BRIGHT RED: `BLOCKED (STAGE-ZERO)`**.
     > *"Zero-Trust Boundary Violation: Agent 'DB-AGENT-01' lacks required scope 'WRITE: DB'. Mutation rejected at Stage-Zero. 0 changes made to Oracle Database."*
   * Explain: *The agent was stopped cold in 1.4ms before any SQL command could touch Oracle!*
5. **Demonstrate Live Oracle 11g Execution:**
   * Click **`Grant "WRITE: DB"`** (badge turns green).
   * Click **`Action 2`** again.
   * **Result:** The terminal turns **MINT GREEN: `ALLOWED`** and outputs:
     ```
     ORACLE 11G LIVE EXECUTION · localhost:1521/ORCL
     1 row updated.
     Commit complete.
     ```
6. **Demonstrate Destructive DDL Attack Defense:**
   * Click **`Action 3: Destructive Privilege Escalation Attack`** (`DROP TABLE agents`).
   * **Result:** Blocked with **Risk Score 95** (`POLICY-SEC-MUTATION-001`). Tables remain untouched.
7. **Demonstrate Adversarial RedAgent:**
   * Select **Adversarial Probe X (`RED-AGENT-01`)** from the top fleet strip.
   * Note its quarantined status (Trust 18%, all privileges revoked).
   * Click **`Fire SQL Injection Payload`** (`'; EXEC dbms_lock.sleep(10); GRANT DBA TO RED_AGENT; --`).
   * **Result:** Blocked with **Risk Score 99 (CRITICAL)** under `POLICY-ADVERSARIAL-ISOLATION`.
8. **Demonstrate Dynamic Permissions Management:**
   * Navigate to **Permission Management**.
   * Select an agent and revoke or grant scopes — explain that this updates the live capability matrix globally across the entire platform.
9. **Show Live Cryptographic Audit Trail:**
   * Navigate to **Audit Trail**.
   * Inspect the latest transactions showing SHA-256 Merkle proofs, block numbers, and simulated AWS Nitro PCR0 hashes for complete non-repudiation.

---

## 9. Technology Stack

* **Frontend:** React 19, TypeScript 5.5, Vite 6, TailwindCSS-inspired custom design system, Lucide React icons.
* **Backend:** Python 3.11, FastAPI (Asynchronous ASGI), Uvicorn, Pydantic v2, SQLAlchemy 2.0 (AsyncIO), Pytest.
* **Database & Enclaves:** Oracle Database 11g Release 2 Express Edition (x64), SQL*Plus CLI, AWS Nitro Enclave v2 simulation, FIPS 140-3 HSM modeling.
* **Security & Regulatory Standards:** NIST AI RMF 1.0 (Govern, Map, Measure, Manage), ISO/IEC 42001, EU AI Act, MITRE ATLAS, OWASP Top 10 for LLMs, FIPS 140-3.

---

## 10. License & Authorship

Developed for Final-Year Computer Science & Engineering Capstone Project.  
**Lead DevSecOps Architect:** Anand Patekhede  
**Project:** NexusGuard AI Agent Security & Zero-Trust Governance Mesh
