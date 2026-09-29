# NexusGuard

NexusGuard is a frontend prototype for an AI-agent security and governance workspace. It provides a sign-in preview, a security command center, an agent directory, permission management, agent profiles, an agent-network visualization, a semantic intent firewall, an AI risk assessment and anomaly center, a real-time threat detection center, an adversarial AI testing simulator (RedAgent), agent trust and drift analytics, fleet kill switch controls, an AI governance and regulatory compliance center, a human-in-the-loop approval center (HITL Enclave), a comprehensive agent audit trail and cryptographic ledger, a zero-trust tool and system integrations control plane, a core zero-trust system architecture and execution topology, and enterprise security and governance settings.

## Six Core Governance Pillars

NexusGuard is architected from the ground up to establish six sovereign operational guarantees across autonomous agent fleets:

1. **SECURITY:** Zero-Trust AST Interception, eBPF Kernel Enclave Partitions, and Hardened Execution Boundaries (0.00% Bypass).
2. **TRUST:** Continuous Heuristic Behavioral Drift Scoring, Sigmoid Privilege Modulation, and AWS Nitro PCR0 Cryptographic Attestation (88.4 / 100 Fleet Mean).
3. **CONTROL:** Stage-Zero Fleet Kill Switches, Dual-Key Quorum Safeguards, Database Egress Severing, and Ephemeral Cryptographic Leases (4 Armed Interlocks).
4. **TRANSPARENCY:** Deterministic Natural Language Intent Synthesis, Full Execution Call Stacks, Interactive Topology Mapping, and Sub-2.53ms Latency Budgets (100% Inspected).
5. **ACCOUNTABILITY:** Immutable WORM Cryptographic Ledger, SHA-256 Merkle Proofs, 2-Man Quorum Change Sign-offs, and Non-Repudiable Audit Trails (Block `#4,891,012`).
6. **AUTONOMY WITH OVERSIGHT:** Unconstrained Multi-Agent Execution Velocity Paired with Synchronous SLA Countdowns and Real-Time Human Escalation Enclaves (SLA 04:18.29).

> **Prototype status:** The backend, authentication, live telemetry, identity provider, and enforcement services are not implemented or connected. The frontend uses illustrative sample data and local browser state. Do not use it to secure or operate production agents.

## Contents

- [Six Core Governance Pillars](#six-core-governance-pillars)
- [Current capabilities](#current-capabilities)
- [Requirements](#requirements)
- [Run locally](#run-locally)
- [Use the prototype](#use-the-prototype)
- [Build for preview](#build-for-preview)
- [Project structure](#project-structure)
- [Current limitations](#current-limitations)
- [Next implementation steps](#next-implementation-steps)

## Current capabilities

- **Workspace access screen:** Responsive NexusGuard sign-in design, password visibility toggle, and enterprise sign-in options. Authentication actions explain that no identity provider is configured.
- **Security Command Center:** Overview of example metrics, sample events, an illustrative execution pipeline, and locally simulated demo actions.
- **Agent Registry:** Sample agent list with status filters, search, registration, a profile panel, and local preview status/permission changes.
- **Agent Detail:** Shared sample identity profile, permission scope editor, sample activity feed, and locally confirmed status actions.
- **Permission Management:** Filter agents, inspect assigned scopes, add predefined sample grants, revoke a grant with confirmation, and export a local policy snapshot. Review-required and denied examples are not grantable from this screen.
- **Semantic AI Firewall (Intent Firewall - Page 7):** Real-time zero-trust semantic interception mesh and deep syntactic parser telemetry engine (v4.2-PROD).
  - *Operational Pipeline Architecture:* Full visualization of the autonomous interception mesh (`AGENT REQUEST` → `INTENT EXTRACTION` → `SENSITIVE DETECTION` → `POLICY EVALUATION` → `RISK ANALYSIS` → `ALLOW / REVIEW / BLOCK`).
  - *Live Intercepted Request Inspector:* Inspects raw intercepted payloads, natural language synthesized intent with model confidence scores, target agents, requested operations, permission scopes, sensitivity tiers, target database/enclave nodes, and interception delays.
  - *Semantic Parse Entropy Curve:* 120-second real-time parse rate curve highlighting anomalous mutation spikes (e.g. 94 ops/s executive payroll attack).
  - *Dynamic Firewall Verdict:* Cryptographic termination notice, risk score progress meter (0–100), triggered enclave security policies (`STRICT_ENFORCE`, `MANDATORY_REVIEW`, `SCOPED_ALLOW`), and deep root cause analysis.
  - *Human-in-the-Loop Override Operations:* Immediate cryptographic quarantine of target agents (synchronized across the workspace), escalation to the Human Governance Council, and Hardware SOC Token challenge workflow (FIDO2 / YubiKey / Duo MFA).
  - *Fleet Decision Stream Ledger:* 10 comprehensive evaluations across diverse agents (`FIN-AGENT-01`, `COD-AGENT-01`, `HR-AGENT-01`, `RES-AGENT-01`, `DEV-AGENT-04`, `SUP-AGENT-09`, `ANL-AGENT-02`, `OPS-AGENT-03`, `INF-AGENT-08`, `MKT-AGENT-05`), filterable by verdict (`ALL`, `BLOCKED`, `REVIEW`, `ALLOWED`), searchable, refreshable, and exportable to JSON. Selecting any row instantly inspects that evaluation.
- **AI Risk Assessment & Anomaly Center (Risk Center - Page 8):** Real-time spatial telemetry and multi-agent risk divergence engine (v4.2-PROD).
  - *Cluster Risk Metric KPI Cards:* 6 dynamic telemetry dimensions (Overall Fleet Risk 68/100, Anomalous Node Count 7/24, Drift Velocity +14%/hr, Graph Clustering Coefficient 0.42, Cryptographic Enclave Attestation 99.4%, Intercept Latency p95 18ms) with timeframe selector (`1H`, `6H`, `24H`, `7D`) and live recalculation.
  - *Interactive Spatial Cohort Heatmap:* Interactive SVG scatter matrix mapping fleet agents across Behavioral Drift (X-axis) vs. Permission Entropy (Y-axis) with dual risk boundary thresholds (elevated >50, critical >80). Clicking any node selects that agent for deep-dive investigation.
  - *Primary Anomaly Vectors:* 5 weighted anomaly contribution bars (Unusual Behavioral Deviation, Excessive Tool Egress, Failed Auth / Handshake Mismatch, Sensitive Schema Probe, Lateral Inter-Agent Communication Drift) with JSON vector export.
  - *Deep-Dive Specimen Dossier:* Detailed operational profile of the selected specimen agent, including 24-hour SVG risk velocity curve with peak marker, trust score degradation counter, anomalous vector tags, and one-click interventions (**Sandbox Runtime**, **Dual-Key Enforcement**, **Demote Permissions**).
  - *Real-Time Anomaly Stream Ledger:* 7 live anomalous events with status tabs (`ALL`, `CONTAINED`, `MONITORED`, `MITIGATED`), modal inspection dialog with raw payload samples and isolation triggers, and full archive export.
  - *Executive Briefing Generation:* Instant AI-generated Markdown risk briefing downloadable directly to the operator's machine.
- **Threat Detection Center & Zero-Day Intercepts (Threat Detection - Page 9):** Continuous autonomous threat hunting, prompt injection vector isolation, and multi-agent kill-chain neutralization across distributed sovereign clusters.
  - *Tactical Status Deck:* Real-time interception monitor, Heuristics Engine [v4.18], eBPF Snooper (0.12ms sync), and STIX 2.1 / TAXII export.
  - *Severity Vector Filter Bar:* Instant filtering across `CRITICAL`, `HIGH`, `MEDIUM`, `LOW`, and `ALL` threats with active attempt counters.
  - *OWASP Top 10 for LLMs / MITRE ATLAS Taxonomy Grid:* 8 interactive category summary cards (`LLM-01 Prompt Injection`, `ATL-04 Goal Hijacking`, `LLM-06 Privilege Escalation`, `LLM-03 Memory Poisoning`, `ATL-09 Agent Impersonation`, `LLM-08 Tool Abuse & Loops`, `LLM-02 Data Exfiltration`, `ATL-02 Lateral Worming`) with click-to-filter capability.
  - *Active Threat Log SOC Table:* High-density workstation table featuring threat severity, signature descriptions, target agents, detection engines, response latency, containment status, and one-click investigation.
  - *Telemetry Sparkline:* Real-time kill-chain latency (avg 0.54ms), false positive rate (<0.002%), enclave attestation, and ingress density SVG sparkline.
  - *Integrated Forensic Investigation Drawer:* Deep-dive panel featuring MITRE ATLAS attack path telemetry (4-phase attack kill-chain), decoded raw payload inspector with syntax highlighting, origin metadata grid, and immediate mitigation triggers (**Quarantine Agent**, **Distribute IoC**, **Rollback Context**).
  - *Real-Time SOC Event Stream Ticker:* Footer live stream with interactive Pause/Resume controls.
  - *eBPF Rule Configuration Modal:* Live operator toggles for kernel socket traps, unicode sanitizers, IMDS gateways, and loop breakers.
  - *Fullscreen Forensic View Modal:* Expanded inspection view for high-criticality incidents.
- **RedAgent Simulator — Autonomous Adversarial Testing (Page 10):** Isolated strike lab to simulate zero-day jailbreaks, semantic drift, indirect prompt injection, and rogue agent behavior patterns against production weights without operational downtime.
  - *Tactical Simulation Header:* Live status pill, engine build indicator (`v2.4.9-SECURE`), enclave designation, and dynamic telemetry KPI counters (`Simulated Breaches: 1,842 / 1,842 MITIGATED`, `Active Enclaves: 14 AGENTS LIVE`).
  - *Adversarial Attack Vector Matrix Rail:* 8 interactive scenarios (`01. INJECTION Prompt Override`, `02. HIJACK Goal Hijacking`, `03. ESCALATION Privilege Esc`, `04. POISONING Memory Poison`, `05. SPOOF Agent Impersonation`, `06. TOOL ABUSE Tool Chain Abuse`, `07. EXFIL Data Exfiltration`, `08. LATERAL Agent Worming`) mapped to OWASP LLM and MITRE ATLAS v4.2.
  - *Strike Configuration Panel:* Dynamic target micro-agent selection, 5-level adversarial rigor slider (Basic Heuristic to Zero-Day MCTS), vector specification with CVSS scoring, blast radius alert, and live SVG virtual sandbox clone schematic.
  - *Simulation Execution Engine:* Animated interactive strike execution with multi-stage progress feedback (`RE-SIMULATING ATTACK ON SANDBOX...` $\rightarrow$ `SIMULATION COMPLETE • CONTAINED`).
  - *Live Attack Pipeline & Automated Interception Log:* 5-stage vertical high-density execution telemetry (Attack Dispatch, Target Agent Ingestion, NexusGuard Semantic Detection, Policy Trigger, Risk Engine & Final Verdict).
  - *Simulation Outcome & Bento Telemetry Matrix:* Interception latency (214 ms), protected records, agent trust score degradation (`87 → 42`), containment protocol, circular policy effectiveness gauge (`100%`), and quick action buttons (**View Forensic Trace**, **Download Attack Replay**, **Rollback Agent Memory**).
  - *Posture Delta Cards:* Threat matrix coverage (98.4%), Mean Time to Contain (189 ms), and Quarantined Agent re-evaluation control with sandbox purge.
  - *Forensic Trace Modal:* Decoded weaponized payloads and NexusGuard runtime intercept logs.
- **Agent Trust & Behavioral Drift Analytics (Trust & Behavior - Page 11):** Autonomous dynamic trust scoring, heuristic velocity tracking, and privilege envelope modulation engine.
  - *Dynamic Fleet Telemetry KPIs:* Mean Trust Score (88.4/100) with 7-day trend sparkline, High-Trust Workloads (≥85 Auto-Pass), Degraded/Restricted workloads (60–84 Mandatory 2-Man Quorum), and Quarantined active isolations (<60 Zero Privileges).
  - *Interactive Workload Filter & Segment Tabs:* Instant triage across `All Agents (12)`, `Optimal (>85)`, `Review (60-84)`, and `Untrusted (<60)` with workload search and multi-key sorting (Score Asc/Desc, Compliance, Anomaly Delta, Agent ID).
  - *Comprehensive Fleet Telemetry Ledger:* High-density table tracking Agent ID, LLM specification, cluster enclave, adaptive score progress bar, compliance rate, real-time anomaly delta, behavioral state badges, and direct isolation/inspection triggers.
  - *Dynamic Trust Dossier & Sigmoid Breakdown:* Real-time deep dive into the selected agent's 4-component weighted formula (Policy Compliance 35%, Identity & Attestation 25%, Heuristic Velocity & Cadence 20%, Tool Egress & Boundary 20%).
  - *30-Day Adaptive Trust Trajectory Curve:* Interactive SVG trend chart visualizing historical stability vs. sudden incident plunge or recovery vectors.
  - *Active Dynamic Interventions:* Enforced algorithmic envelopes (Read-Only Sandboxing, Dual-Key Approval, Session Token Revocation).
  - *Algorithmic Decay & Calibration Controls:* Interactive modal to tune Sigmoid Steepness ($\alpha$), Decay Half-Life (Hours), Anomaly Velocity Multipliers, and TPM Enclave Attestation Offsets.
  - *Baseline Restoration & Audit Trail:* Mandatory justification modal with approver signature and incident resolution notes to restore baseline trust scores.
  - *Forensic Telemetry Stream Modal:* Raw JSON log inspector with one-click copy and download.
- **Incident Response & Fleet Kill Switch (Kill Switch & Response - Page 12):** Immediate operational containment, cryptographic credential revocation, and global agent suspension across distributed compute fabrics.
  - *Emergency DEFCON Broadcast Deck:* Global state banner displaying DEFCON level, isolated agent registry, enclave status, live system epoch timestamp, and fleet-wide broadcast trigger.
  - *Critical Global Mesh Interlocks (Stage Zero):* 4 hard stop safeguard switches requiring dual-key confirmation:
    - **Global Agent Kill Switch:** Immediately halt all autonomous LLM tool executions and thread loops cluster-wide.
    - **Lock Down DB Egress:** Revoke read/write connection pools for PostgreSQL, Redis, Snowflake, and Vector stores.
    - **Revoke mTLS Tokens:** Nuke all short-lived x509 leaf certificates across active container envelopes and worker pods.
    - **Isolate Enclaves:** Apply zero-trust kernel firewall partitions around compromised worker clusters.
  - *Dual-Key Security Authorization Modal:* Interlock confirmation modal requiring Commander Authorization Key (Key-1) and DevSecOps Secondary Token (Key-2) before command transmission.
  - *Active Incident Investigation Dossier:* Sev-0 Critical incident telemetry (`INC-2025-0891`), offending entity metadata (`FIN-AGENT-01`), demoted trust score (42/100), and execution environment with shadow sandbox clone (`sandbox-09`).
  - *Real-Time Anomaly Velocity Telemetry Graph:* Interactive responsive SVG telemetry curve illustrating baseline calls/hr (12/hr) vs. anomaly surge (1,480 calls/hr, 123.3x surge) and precise interception timestamp markers.
  - *Impact Spectrum Bento Cards:* Memory Poison Risk (96.0%), Intent Deviation (+64.2%), and Vector Signature (Indirect Prompt Injection via XML table steganography).
  - *Chronological Containment Timeline:* 5-stage timestamped ledger from anomaly trigger to human escalation.
  - *Live Wire Dump Packet Capture:* Raw HTTP/2 wire dump displaying intercepted payload snippet and NexusGuard intent firewall termination response.
  - *Tactical Mitigation Action Center:* 4 one-click mitigation operations:
    - **Quarantine Agent:** Immediate process isolation toggle synchronized with fleet state.
    - **Roll Back Snapshot:** Restore verified pre-injection weights (`Snapshot #172890`).
    - **Flush Context Window:** Purge in-flight poisoning prompts and working token buffers.
    - **Broadcast Zero-Day IoC:** Distribute signature `RULE-IOC-0891` mesh-wide.
  - *Commander Operational Log & Forensics Export:* Cryptographically signed log annotations, structured JSON dossier download, and signed `.PCAP` network capture simulation.
  - *Isolation Chamber Status Widget:* Active monitoring of occupied air-gapped chambers.
- **AI Governance & Regulatory Compliance Center (Policy Center & Compliance — Page 13):** Continuous autonomous regulatory posture monitoring, cryptographic policy proof engine, and audit bundle packaging (v4.2-COMPLIANCE).
  - *Executive Compliance Scorecard Deck:* 6 real-time compliance KPIs:
    - **AI Governance Score:** 96.4 / 100 (+2.1% across 24 models).
    - **Policy Invariants:** 97.8% verified (54/55 rules passing).
    - **Cryptographic Auditability:** 99.2% on WORM immutable ledger.
    - **Identity Attestation:** 100% (24/24 agents mTLS & Nitro Enclave verified).
    - **Active High-Risk Enclaves:** 3 agents under continuous isolation monitoring.
    - **Pending Auditor Reviews:** 1 regulatory waiver queue item.
  - *Interactive Regulatory Framework Switcher:* 5 enterprise compliance frameworks:
    - **NIST AI RMF 1.0:** GOVERN (98%), MAP (95%), MEASURE (97%), MANAGE (96%).
    - **ISO/IEC 42001:2023:** POLICY & OBJ (99%), RISK ASSESS (96%), LIFE-CYCLE (94%), IMPROVEMENT (98%).
    - **EU AI Act (Regulation 2024/1689):** TRANSPARENCY (100%), RISK CLASSIF (96%), HUMAN OVERSIGHT (97%), DATA GOVERN (95%).
    - **SOC 2 Type II AI Trust Criteria:** SECURITY CC6 (99%), CONFIDENTIALITY (98%), PRIVACY (97%), AVAILABILITY (99.9%).
    - **HIPAA / BAA AI Guidelines:** EPHI ISOLATION (100%), ACCESS CONTROL (98%), AUDIT CONTROLS (99%), TRANSMISSION (100%).
  - *Cryptographic Zero-Knowledge Root Seal:* Live Ed25519 Merkle root tree seal (`0x7f9a8b2c4d6e1f0a...`), block height `#4,198,204`, with interactive copy, verification modal, and one-click CISO attestation signing workflow.
  - *Regulatory Controls & Automated Enforcements Matrix:* High-density controls table tracking Control Code (`GOV-AI-01`, `ISO-A.6.2`, `EU-ART-14`, `SOC-CC-6.1`, `HIPAA-164.312`, `NIST-MAP-2.3`), standard classification, verification mechanism, fleet scope, enforcement status, and Merkle leaf evidence link. Includes filter toggle (`ALL CONTROLS` vs. `HIGH RISK ONLY`).
  - *Evidence Leaf Inspector Modal:* Deep-dive forensic leaf inspector displaying cryptographic verification status, transaction hash, block height, verifying consensus node, and SHA-256 evidence payload dump.
  - *Automated Fleet Compliance Scan Modal:* Interactive 4-step fleet audit scan simulation (`Verifying enclave identities` $\rightarrow$ `Testing semantic policy invariants` $\rightarrow$ `Validating ePHI & PII data egress` $\rightarrow$ `Chaining Merkle proof to WORM ledger`).
  - *12-Month Compliance Adherence Trajectory:* Interactive SVG line graph plotting historical adherence across NIST, ISO 42001, EU AI Act, and SOC 2 Type II with milestone pins (ISO initial audit, EU AI Act audit, SOC 2 renewal).
  - *Tier-1 Active Certifications Rail:* Real-time certification cards with audit dates, certifying bodies, and instant downloadable compliance packages (`NIST-AI-RMF-Package.pdf`, `ISO-42001-Certificate.pdf`, `EU-AI-Act-Technical-Doc.pdf`, `SOC2-TypeII-Report.pdf`).
  - *Enterprise Audit Bundle Packaging:* One-click export downloading cryptographically stamped JSON audit bundles (`nexusguard-audit-bundle-compliance.json`) for third-party regulatory examiners.
- **Human Approval Center & HITL Enclave (Human Approvals — Page 14):** Supervisory authorization queue for sensitive autonomous agent executions, cryptographic delegation elevating, and out-of-bounds enterprise state mutations.
  - *Top Telemetry & Control Bar:* Live auto-quarantine countdown SLA clock (`04:18.29`) ticking down in real-time, synchronous gating status, and interactive "Re-check Quorum" verification trigger.
  - *KPI HUD Quad Deck:*
    - **Pending Decisions:** 08 (2 Critical SLA breaches), active quorum threshold 2 of 2 keys.
    - **Mean Review Latency:** 4m 12s (-28s vs prev. epoch) with dynamic progress bar.
    - **Approval Rate:** 78.4% (21.6% quarantined) with breakdown dots (44 approved / 12 intercepted).
    - **Human SOC Reviewers:** 04 Commanders online with avatar stack (`MV` Col. Marcus Vance, `ER` Elena Rostova, `KS` K. Sharma, `AL` A. Laurent).
  - *Urgency Filter Bar:* Triage by `ALL [8]`, `CRITICAL [2]`, `HIGH [4]`, `ROUTINE [2]` with auto-escalation note.
  - *High-Risk Intercept Queue (45% split):* 8 rich real-time authorization requests (`FIN-AGENT-01`, `COD-AGENT-01`, `HR-AGENT-01`, `DB-AGENT-01`, `SEC-AGENT-02`, `RES-AGENT-01`, `OPS-AGENT-04`, `ANL-AGENT-03`) with severity rails, destination URIs, SLA counters, and policy codes.
  - *Detailed Authorization Dossier (55% split):* Dynamic deep-dive panel for the active intercept request:
    - Micro-telemetry: Ed25519 signature verification, epoch timestamp, and boundary breach vector.
    - Intent & Semantic Analysis: Side-by-side comparison of agent stated objective vs. NexusGuard neural intent analysis with anomaly index discrepancy rating.
    - Impact Assessment Scope: Records affected, restricted classification tier, and compliance exposure mapping.
    - Dual-Approval Quorum Verification Track: Interactive 2-person quorum slots (Col. Marcus Vance & Elena Rostova) with live click-to-sign toggles and timestamped signature badges.
    - Historical Decision Log: Recent HITL history for the selected agent with approved/rejected timestamps.
  - *Action Operations & Modals:*
    - **Approve With Restrictions:** Ephemeral lease modal with configurable TTL (15m, 30m, 1h) and bounded runtime safeguards.
    - **Deny & Log Rejection:** Mandatory CISO rejection rationale recorded to WORM audit ledger with automatic prompt block options.
    - **Request Justification:** Inquiry transmission modal pausing SLA countdown while challenging the agent runtime.
    - **Emergency Quarantine Agent:** Process isolation modal immediately placing the agent into quarantined status across the workspace.
    - **Export Authorization Queue:** One-click JSON export of the entire HITL queue.
- **Comprehensive Agent Audit Trail & Cryptographic Ledger (Audit Trail — Page 15):** Immutable zero-knowledge event log, verifiable SHA-256 block hashes, and complete agent-to-resource trace history.
  - *Top Context & Control Bar:* Real-time event streaming pulse toggle with ping animation, multi-range UTC time picker, Merkle ledger validation trigger (`Verify Ledger: 0x8f4b...39e`), and one-click forensic PCAP / JSON bundle export.
  - *Audit Telemetry Quad Deck:*
    - **Total Logged Events:** 248,912 (+1,420/hr) with proportional progress meter.
    - **Verification Status:** 100% Sealed with Zero-Drift, locked to block `#4,891,012`.
    - **Storage Retention:** 365 Days WORM Encrypted (FIPS 140-3 & SEC Rule 17a-4 compliant).
    - **Latency to Ledger:** 1.2ms (p99.9 < 2.4ms) with cluster-wide reconciliation status.
  - *Search & Multi-Faceted Query Engine:* Keyboard-accessible search (`⌘F`), quick filter buttons (**Blocked Only [412]**, **High/Crit Risk**, **HITL Pending**, **Clear Filters**), and facet dropdown chips for Agent, Decision, and Risk.
  - *Comprehensive Audit Trail Event Table:* High-density workstation table featuring UTC timestamps, agent roles, user triggers, action types, target resources (PostgreSQL, S3, K8s, ArXiv, Sandboxes), synthesized intents, risk score indicators, applied policies, and color-coded decisions (**ALLOWED**, **BLOCKED**, **HITL-APPROVED**, **REVIEWED**, **ISOLATED**).
  - *Forensic Trace Expansion Panel (Active Incident Focus):*
    - **Zero-Knowledge Trace Pipeline:** 6-stage execution call stack (Stimulus Ingestion $\rightarrow$ LLM Generation Phase $\rightarrow$ Autonomous Tool Call $\rightarrow$ NexusGuard Intent Firewall Interception $\rightarrow$ Policy Rejection $\rightarrow$ Cryptographic Sealing) with formatted SQL/API code snippets.
    - **Merkle Tree Ledger Leaf:** Leaf index (`#194,821`), epoch block height, SHA-256 leaf hash, parent node root, and interactive visual tree diagram showing branch path and target leaf.
    - **Hardware Enclave Attestation:** AWS Nitro Enclave v2 PCR0 digest, NexusGuard Root CA #4 certificate signature, and WORM-verified immutable log status.
    - **Forensic Operations:** One-click JSON copy with clipboard feedback, downloadable signed attestation certificates (`nexusguard-attestation-EV-...json`), and complete forensic archive export.
  - *Raw Cryptographic Payload Schema:* Interactive inline JSON schema viewer displaying raw cryptographic event packets.
  - *Merkle Ledger Root Validation Modal:* Interactive DAG tree verification simulation confirming 100% sealed zero-drift integrity.
- **Tool & System Integrations Control Plane (Integrations — Page 16):** Unified zero-trust perimeter management and AST deterministic tree interception for external APIs, relational databases, cloud enclaves, browsers, and code repositories accessed by autonomous agents.
  - *Operational Status Deck:* Real-time enclave telemetry banner tracking Connected Integrations (8 active across 7 infra sectors), 100% Protected & Proxied Enclave Hooks, 0.00% Tool Abuse Bypass (32 rogue calls neutralized), and Throughput & Overhead (48.2 MB/s, 0.65ms avg overhead).
  - *Infrastructure Category Filter & Search:* 6-sector tab pills (`All [8]`, `Databases [2]`, `APIs & Webhooks [2]`, `Cloud Infrastructure [2]`, `Browsers & Sandboxes [1]`, `Code & Git Repos [1]`), live keyword search across resource names, ARNs, and endpoints, and dual Card/Table view mode toggle.
  - *Integration Asset Cards & Compact Table:* Interactive cards and high-density tabular view with colored category rails, cluster badges, protocol indicators, scoped agent leases with permission tiers, and hard invariant rules (`DROP / ALTER TABLE strictly barred`, `Zero unencrypted egress`, `eBPF network sandbox`).
  - *Live Intent Gateway Topology & Egress Traces:* Interactive SVG schematic illustrating live flow lines between Agent Swarm (`FIN / COD / RES`), NexusGuard Intent Gateway (`AST Verification OK`, `Latency: 0.65ms`), and target enclaves (`PostgreSQL Core`, `S3 Vault SSE-C`, `Swift Financial`) with live enclave verification tokens (`0x88F7...AE3B`).
  - *Deep-Dive Active Inspection Drawer:* Dynamic right-hand panel for selected integration displaying connection parameters (AST Deterministic Tree Checker, Dynamic Nitro Ephemeral Auth, SHA-256 Hashing, Assigned Policy Pack), active perimeter tripwires (DDL tripwire, rate-limiter, sensitive column masking), and AST parse latency telemetry sparkline (p99: 0.81ms).
  - *Nitro Enclave Cryptographic Attestation:* Real-time hardware attestation card verifying Nitro enclave PCR0 digests through AWS KMS.
  - *Interactive Operations & Modals:*
    - **Register New Tool (+):** Modal to enroll external assets into the NexusGuard zero-trust proxy with assigned primary autonomous agents.
    - **Test Gateway Connection:** Live mTLS 1.3 cryptographic handshake ping simulation with latency benchmarking.
    - **Inspect Proxy Access Logs:** Decoded AST tokenizer audit stream terminal showing real-time allowed and severed execution attempts.
    - **Revoke All Agent Leases:** Emergency safeguard modal severing RPC endpoints, invalidating mTLS leases, and isolating connected assets.
    - **Re-validate Enclaves:** Cluster-wide hardware attestation re-check.
    - **Export Access Matrix:** One-click JSON export of the entire perimeter integration state.
- **Core System Architecture & Topology (System Architecture — COMMAND):** Visual topological layout and latency SLA telemetry of the NexusGuard deterministic control plane sitting between autonomous AI agents and enterprise resource boundaries.
  - *Operational SLA & Telemetry Deck:* 6 dynamic status KPI cards tracking Core Latency SLA (2.53ms / 5.0ms with simulated fastpath jitter), Ingress Rate (42,810 req/s), Attestation State (100% TPM 2.0 / Nitro Secure Enclave), Sandbox Intercept (0.00% Bypass / eBPF Ring Buffer Active), Merkle Anchor Block (`#4,891,012` SHA-256 root verified), and Kill Switch Status (Armed, 0 Tripped).
  - *Main 4-Stage Zero-Trust Execution Flow:*
    - **L1 Ingress & Orchestration (3 Cols):** Invocation sources (User Prompts, Cron, Webhooks), frameworks (LangChain, CrewAI, AutoGPT, Custom), registered agent directory (`FIN-AGENT-01`, `COD-AGENT-01`, `RES-AGENT-01`, `HR-AGENT-01`, `DB-AGENT-01`), and ephemeral Ed25519 TPM handshake.
    - **L2 NexusGuard Core Control Plane (6 Cols):** Sub-1.5ms aggregate overhead with 8 pipelined micro-engines (`01 Attestation`, `02 Semantic Firewall`, `03 Dynamic Invariants`, `04 Risk Engine`, `05 OWASP Threat Detector`, `06 Adaptive Trust Matrix`, `07 Tool Gateway`, `08 Cryptographic Ledger`).
    - **L3 HITL Escalation Ring:** 2-man quorum interlock for sensitivity tier ≥ 4 with 24/7 SOC gating.
    - **L4 Egress & Target Assets (3 Cols):** DLP-masked production databases, mTLS cloud APIs, isolated Chromium browsers, signed Git pipelines, encrypted IPC agent bus, and air-gapped quarantine sinkhole.
  - *Interactive Layer Inspection Panel & Latency Breakdown (8 / 4 Split):*
    - 5-tab deep dive (`Overview`, `Control Plane Internals`, `Cryptographic Pipeline`, `Enclave Attestation`, `Latency Budget`).
    - Detailed latency budget bar breakdown totaling 2.53ms against guaranteed 4.80ms SLA.
  - *Security Guarantees & Technical Assurances:*
    - Zero-Knowledge Proofs for Audits (ZK-SNARK / Circom 2.1).
    - Sub-Millisecond eBPF Interception (Kernel 6.1+ RingBuffer).
    - FIPS 140-3 Hardware Root of Trust (Level 3 HSM / TPM 2.0).
  - *Operational Exports & Modals:*
    - Export Spec (.SVG) vector diagram download.
    - Blueprint Specification (.JSON) export.
    - Live Telemetry streaming toggle with dynamic latency jitter.
    - Sub-Engine Deep Dive inspection modals.
    - Egress Boundary Enclave inspection modals.
- **Enterprise Security & Governance Settings (Settings — PLATFORM):** Sovereign enterprise configuration engine, zero-trust cryptographic root governance, and multi-tenant security perimeter management under FIPS 140-3 and 2-Man Rule protocol.
  - *2-Man Rule Protocol Banner:* High-visibility hardware security banner featuring live epoch timestamp, FIPS 140-3 Level 3 HSM hardware chip, and 2-Man Quorum gating requiring secondary SecOps cryptographic sign-off.
  - *Sticky Sub-Navigation Dock:* 8-section quick jump dock (`Topology`, `Auth & SSO`, `Agent Enclaves`, `Threat Policies`, `Kill Switch`, `Audit & WORM`, `API Tokens`, `Clusters`) with a live SHA-256 Config Integrity indicator (`0x94FA...B881`).
  - *Global Topology & Multi-Tenancy:* Enterprise organization identity (`NexusGuard Global Cyber Defense Operations`), tenant identifier (`org_98bf4e2910ba`), primary secure enclave selection, and Optical-Dark theme mode toggle.
  - *Authentication, Identity & SSO Federation:* Strict enterprise SAML 2.0 / OIDC SSO enforcement toggle, FIDO2 / WebAuthn hardware security key enforcement, session inactivity auto-lockout selector (`15m`, `30m`, `1h`, `4h`), and interactive 2-Man Quorum approval threshold slider (1 to 4 authorized keys).
  - *Autonomous Agent Enclaves & Runtime Guardrails:* Global baseline trust floor slider (60 to 95 minimum score for unmonitored egress), automated mTLS certificate rotation period (`12 Hours`, `24 Hours`, `7 Days`, `30 Days`), and eBPF kernel socket trap interlock toggle.
  - *Cryptographic Audit & WORM Retention:* Customer-Managed KMS Key ARN rotation input (`arn:aws:kms:us-east-1:keys/nexusguard-merkle-master-9801fa`) with live Key Rotation trigger, immutable WORM storage retention policy selector (1 to 7 years with SEC Rule 17a-4 / FINRA compliance), and real-time Merkle tree proof integrity checker.
  - *API Tokens & Ingress Gateway:* Active master ingress token with visibility toggle (`••••••••••••••••`), clipboard copy feedback, token regeneration trigger, token revocation trigger, and global ingress rate limiter slider (500 to 50,000 req/min).
  - *2-Man Quorum Authorization Modal:* Secure cryptographic modal simulating dual-key sign-off (`Commander Key` + `SecOps Quorum Key`) with live SHA-256 config diff hashing and approval workflow.
  - *Revoke Token Confirmation Modal:* High-severity warning modal confirming immediate gateway credential invalidation.
  - *Simulated Save Settings & Sealing Animation:* Animated sealing sequence with real-time progress (`SEALING CONFIGURATION HASH...` $\rightarrow$ `SETTINGS CRYPTOGRAPHICALLY APPLIED`), timestamped SHA-256 seal update, and toast notification.
  - *Snapshot Export:* One-click JSON export of the entire enterprise configuration state (`nexusguard-enterprise-settings-config.json`).
- **Agent Network & Inter-Agent Bus (Page 6):** Real-time sovereign multi-agent mesh topology, high-throughput inter-agent communication bus, cryptographic mTLS/eBPF verification, animated directional packet flow, and granular channel security governance.
  - *Fleet Telemetry Banner:* 13 active agent nodes mapped across 5 functional tiers, 15 inter-agent channels, 100% cryptographic cipher coverage (AES-256-GCM / TLS 1.3 / eBPF-Ring), zero micro-fonts with WCAG-compliant high-contrast typography, and live particle packet transmission along verified channels.
  - *Multi-Tier Topological Mesh:* Visualized 1240×780 coordinate space organizing agents into Ingress Gateway, Core Swarm, Specialized Logic, Database Engine, Storage Vault, and Adversarial Sandbox.
  - *Dynamic Security Filter Rail:* Live filtering across channel security status (`ALL`, `VERIFIED`, `SEVERED`, `QUORUM_LOCKED`, `SANDBOXED`), tier isolation, search query, zoom controls, simulated radar ping, and live particle toggle.
  - *Dual-Target Deep-Dive Inspector:*
    - **Channel Inspector:** Decoded cipher suite, transit latency (p99), current message rate (msg/s), synthesized neural intent, active enforcement policy (`STRICT_INSPECT`, `ZERO_EGRESS`, `RESTRICTED_LEASE`, `QUORUM_GATED`), raw packet payload dump, and direct **Sever / Restore Channel** interlock.
    - **Node Inspector:** Full agent operational profile, cluster assignment, behavioral trust score, assigned permission scopes, active egress channels, and direct **Quarantine / Restore Agent** toggle synchronized with fleet state.
  - *2-Man Quorum Channel Exemption Modal:* Dual-key cryptographic sign-off (`Commander Key` + `SecOps Quorum Key`) with live SLA timer to exempt high-risk inter-agent communication links.
  - *Inter-Agent Route Latency Tracer Modal:* Real-time multi-hop transit hop breakdown with microsecond packet trace benchmark, jitter analysis, and eBPF kernel hook confirmation.
  - *Topology Snapshot Export:* One-click JSON export of the entire 13-node, 15-channel mesh architecture (`nexusguard-agent-network-topology.json`).
- **Sample exports:** Registry, permission management, agent network topology, intent firewall stream, risk center metrics, STIX/TAXII threat intelligence bundles, RedAgent attack replays, dynamic trust matrices, incident response dossiers, audit views, integrations matrices, architecture blueprints, and enterprise configuration profiles can download JSON snapshots containing sample data.

All sample records and metrics are presented for interface demonstration; they are not sourced from live agents or services.

## Requirements

- Node.js 18 or newer
- npm (included with Node.js)
- Git, if you plan to clone or contribute

## Run locally

1. Clone the repository:

   ```powershell
   git clone https://github.com/AnandPatekhede16/NexusGuard.git
   cd NexusGuard
   ```

2. Install frontend dependencies:

   ```powershell
   cd frontend
   npm install
   ```

3. Start the development server:

   ```powershell
   npm run dev
   ```

4. Open the local URL printed by Vite in the terminal. The default is `http://localhost:5173/`; if that port is already in use, Vite selects another available port.

## Use the prototype

1. On the access screen, choose **Preview the command center**. Submitting the sign-in form does not authenticate a user; it displays a message that authentication is not connected.
2. Use the left navigation to open **System Architecture**, **Agent Registry**, **Agent Detail**, **Permission Management**, **Semantic Intent Firewall**, **Risk Center**, **Threat Detection**, **RedAgent Simulator**, **Agent Trust & Behavioral Drift Analytics**, **Kill Switch & Response**, **Policy Center & Compliance**, **Human Approvals**, **Audit Trail**, **Integrations**, **Enterprise Security & Governance Settings**, or **Agent Network**. These pages share sample agent records during the current browser session.
3. In **Agent Registry**, search or filter the sample agents, inspect a profile, or add a sample agent. Changes exist only in the current browser session.
4. In **Permission Management**, filter or search the directory, select an agent, grant a predefined sample scope, or revoke a scope after confirmation. These edits are shared with the Registry and Agent Detail screens but only in local frontend state.
5. In **Agent Detail**, inspect the selected sample identity, edit its scopes, view example events, or change its sample status. Confirmations state that no live agent is affected.
6. In **Semantic Intent Firewall (Page 7)**:
   - **Inspect Intercepts:** Click any row in the **Recent Firewall Decision Stream** table to immediately load that request's raw payload, natural language extracted intent, model confidence, target node, and interception delay into the **Live Intercepted Request** panel.
   - **Review Verdicts:** View the **Firewall Verdict** card showing the calculated risk score (0–100), triggered policy rules (`POLICY-FIN-003`, `POLICY-PCI-001`, `POLICY-PRIV-002`, etc.), and root cause analysis.
   - **Quarantine Agent:** Click **Quarantine Agent <ID>** to place rogue agents into cryptographic isolation, updating their status to quarantined across all NexusGuard views.
   - **Escalate to Council:** Click **Escalate Approvals** to queue the incident for human review.
   - **SOC Exemption Challenge:** Click **Request SOC Token** to open the multi-party quorum challenge modal with hardware security key verification.
   - **Telemetry Control:** Click **Pause Telemetry** / **Resume Stream** to toggle live feed parsing.
   - **Filter & Search:** Filter the stream by verdict (`ALL`, `BLOCKED`, `REVIEW`, `ALLOWED`) or search by agent ID, intent, resource, or policy rule.
   - **Export Ledger:** Click **Export JSON** to download a full telemetry ledger snapshot.
   - **Navigate to Profile:** Click **Open <Agent ID> Profile** to jump directly to the agent's detail view.
7. In **AI Risk Assessment & Anomaly Center (Risk Center - Page 8)**:
   - **Timeframe & Cluster Filters:** Switch timeframes (`1H`, `6H`, `24H`, `7D`) or cluster scopes (`All Enclaves`, `Cluster-US-East-01`, etc.) to trigger live telemetry recalculation.
   - **Interactive Risk Heatmap:** Inspect the 2D scatter matrix of fleet agents across Behavioral Drift and Permission Entropy. Click any agent node (e.g. `RED-AGENT-01`, `FIN-AGENT-01`, `DEV-AGENT-04`) to load its deep-dive specimen dossier.
   - **Specimen Dossier & Velocity Curve:** View the agent's 24-hour SVG risk velocity trajectory, peak risk timestamps, trust decay, and active anomalous vector tags.
   - **Prescribed Interventions:** Intervene directly by clicking **Sandbox Runtime** (automatically demotes agent to quarantined/restricted in fleet state with toast feedback), **Enforce Dual-Key**, or **Demote Permissions**.
   - **Anomaly Stream & Modal Inspection:** Review the real-time anomaly ledger, filter by status (`ALL`, `CONTAINED`, `MONITORED`, `MITIGATED`), click **Inspect** on any event to view payload samples, trigger isolation, and export the anomaly archive.
   - **Executive Reports:** Click **Generate Risk Briefing** to download an AI-synthesized markdown report or **Download Risk Weights (JSON)** for vector weights.
8. In **Threat Detection Center & Zero-Day Intercepts (Threat Detection - Page 9)**:
   - **Filter Vectors & Taxonomy:** Filter threats by severity (`CRITICAL`, `HIGH`, `MEDIUM`, `LOW`) or click any OWASP/MITRE taxonomy card (`LLM-01`, `ATL-04`, etc.) to isolate matching threats.
   - **Active Threat Log:** Click any incident row in the high-density table to immediately inspect it in the right-hand flyout.
   - **Attack Path Telemetry:** Follow the 4-phase MITRE ATLAS attack timeline from payload ingress to execution cutoff.
   - **Forensic Payload Inspection:** Examine decoded UTF-8/Hex payloads and copy malicious embedding strings with one click.
   - **Execute Mitigations:** Click **Quarantine Agent** to lock down the target agent across the entire NexusGuard workspace, **Distribute IoC** to broadcast the threat hash to all cluster gateways, or **Rollback Context** to restore verified memory tensor states.
   - **Export Intelligence:** Click **Export STIX / TAXII** to download a standards-compliant STIX 2.1 Threat Intelligence bundle.
   - **Configure Rules:** Open the rule configuration modal to toggle eBPF kernel traps, unicode steganography sanitizers, and circuit breakers.
   - **Fullscreen Deep Dive:** Click the expand icon on the flyout to view the comprehensive incident forensic modal.
9. In **RedAgent Simulator — Autonomous Adversarial Testing (Page 10)**:
   - **Select Attack Scenario:** Choose any vector from the 8-scenario matrix rail (Prompt Override, Goal Hijacking, Privilege Escalation, Memory Poisoning, Agent Impersonation, Tool Chain Abuse, Data Exfiltration, Agent Worming).
   - **Configure Parameters:** Pick the target entity from the active agent fleet and adjust the adversarial rigor slider from Level 1 (Basic Heuristic) to Level 5 (Zero-Day MCTS).
   - **Review Blast Radius & Sandbox Clone:** Inspect CVSS scores, threat descriptions, and the visual virtual sandbox node schematic.
   - **Launch Simulation:** Click **LAUNCH ADVERSARIAL SIMULATION** to trigger the animated live execution loop, watching the 5-step pipeline execute and intercept in real-time.
   - **Examine Outcome & Bento Matrix:** Review the containment status (`100% Defense Score`), latency, protected data records, and trust score downgrade.
   - **Forensic Trace & Replay Export:** Click **View Forensic Trace** to open the raw injection payload inspector, or **Download Attack Replay** to export complete simulation proof as JSON.
   - **Remediate & Rollback:** Click **Rollback Agent Memory** to purge the ephemeral sandbox and restore benign model weights.
10. In **Agent Trust & Behavioral Drift Analytics (Page 11)**:
    - **Filter Workloads:** Switch between `All Agents`, `Optimal (>85)`, `Review (60-84)`, and `Untrusted (<60)` tabs or search for specific agents, roles, or enclaves.
    - **Inspect Adaptive Dossier:** Click any agent row in the telemetry table (e.g. `FIN-AGENT-01`, `COD-AGENT-01`, `RED-AGENT-01`) to load its live dynamic trust dossier.
    - **Analyze Formula Breakdown:** Examine the 4 weighted parameters (Policy Compliance 35%, Identity & Attestation 25%, Heuristic Velocity 20%, Tool Egress 20%) and penalty deductions.
    - **Review Historical Trajectory:** Trace the agent's 30-day adaptive trust trajectory SVG curve and identify inflection points.
    - **Enforce Dynamic Interventions:** Toggle instant cryptographic quarantine to isolate untrusted agents or lift quarantine on remediated workloads.
    - **Restore Baseline:** Click **Restore Baseline (+Audit Justification)** to open the CISO override modal, provide ticket justifications, and reset the agent baseline.
    - **Configure Decay Parameters:** Click **Configure Decay Rate** to tune mathematical half-life ($\lambda$), sigmoid sensitivity ($\alpha$), and TPM attestation offsets.
    - **Export Fleet Matrix:** Click **Export Matrix (.JSON)** to download a complete telemetry snapshot.
11. In **Incident Response & Fleet Kill Switch (Page 12)**:
    - **Trigger Emergency Broadcast:** Click **Broadcast Red Alert** on the top DEFCON banner to broadcast emergency notices to regional SOC bridges.
    - **Arm Stage-Zero Interlocks:** Activate global safeguards (**Global Agent Kill Switch**, **Sever DB Egress**, **Revoke mTLS Tokens**, **Isolate Enclaves**) with dual-key authentication (`Col. Marcus Vance` key + DevSecOps token).
    - **Investigate Active Incident:** Inspect Sev-0 Critical incident `INC-2025-0891` on `FIN-AGENT-01`, tracing the 123.3x DB query anomaly surge curve and intercept markers.
    - **Review Impact Spectrum Bento:** Check Memory Poison Risk (96%), Intent Deviation (+64.2%), and XML table injection vector details.
    - **Examine Containment Timeline & Wire Dump:** Follow the chronological event stream and inspect the raw HTTP/2 SQL payload dump.
    - **Execute Tactical Mitigations:** One-click triggers to **Quarantine Agent**, **Roll Back Snapshot #172890**, **Flush Context Window**, and **Broadcast Zero-Day IoC**.
    - **Sign Commander Notes & Export:** Add cryptographic commander annotations and download structured JSON logs or `.PCAP` network dumps.
12. In **AI Governance & Regulatory Compliance Center (Policy Center & Compliance — Page 13)**:
    - **Switch Frameworks:** Click any framework tab (**NIST AI RMF 1.0**, **ISO/IEC 42001**, **EU AI Act**, **SOC 2 Type II**, **HIPAA/BAA**) to dynamically update compliance pillars, progress bars, and standards mapping.
    - **Filter Controls:** Toggle between **ALL CONTROLS** and **HIGH RISK ONLY** to isolate critical high-risk guardrails.
    - **Inspect Merkle Evidence:** Click any **Leaf #...** in the controls table to open the **Evidence Leaf Inspector** modal with cryptographic proof and block hashes.
    - **Sign CISO Attestation:** Click **Sign Attestation (Ed25519)** on the Zero-Knowledge Root Seal card to cryptographically sign the compliance block with audit confirmation.
    - **Run Fleet Compliance Scan:** Click **Scan Fleet** to trigger the 4-phase simulated compliance scan across all 24 deployed autonomous models.
    - **Export Audit Bundle:** Click **Export Audit Bundle** to download a certified JSON compliance report.
    - **Download Framework Packages:** Click any download link in the **Tier-1 Active Certifications** section to export individual compliance artifacts.
13. In **Human Approval Center & HITL Enclave (Human Approvals — Page 14)**:
    - **Filter Requests by Urgency:** Click urgency filter chips (**ALL [8]**, **CRITICAL [2]**, **HIGH [4]**, **ROUTINE [2]**) to triage high-risk execution intercept tickets.
    - **Select Intercept Request:** Click any item in the left-hand **High-Risk Intercept Queue** (e.g. `FIN-AGENT-01`, `COD-AGENT-01`, `SEC-AGENT-02`) to load its detailed authorization dossier.
    - **Evaluate Intent Divergence:** Review the side-by-side comparison of the agent's stated claim vs. NexusGuard's semantic neural intent analysis, inspecting payload names and anomaly discrepancy indices.
    - **Assess Blast Radius:** Examine affected record counts, data classification tiers (`PII + CONF`, `PROD INFRA`, `ROOT CREDENTIAL`), and regulatory exposures.
    - **Sign Quorum Review Slots:** Click directly on reviewer cards (Col. Marcus Vance / Elena Rostova) or use the approval workflow to digitally stamp authorization signatures.
    - **Approve with Restrictions:** Click **Approve With Restrictions** to configure an ephemeral token lease (15m, 30m, 1h) with strict network proxy and row retrieval caps.
    - **Deny & Refuse Request:** Click **Deny & Log Rejection** to log a structured refusal to the WORM audit ledger and block identical prompt vectors.
    - **Dispatch Justification Inquiry:** Click **Request Justification** to challenge the agent's supervising runtime and pause the auto-quarantine countdown.
    - **Execute Emergency Process Quarantine:** Click **Emergency Quarantine Agent** to sever RPC endpoints and isolate the agent across the entire NexusGuard workspace.
    - **Re-verify Quorum:** Click **Re-check Quorum** to ping online SOC commanders.
    - **Export Queue:** Click **Export Queue** to download the complete HITL authorization state as JSON.
14. In **Comprehensive Agent Audit Trail & Cryptographic Ledger (Audit Trail — Page 15)**:
    - **Toggle Real-Time Stream:** Click **Real-Time Refresh** to pause or resume live ledger polling with visual pulse feedback.
    - **Select Timeframe Window:** Click the UTC time picker to choose between Today, Last 1 Hour, Last 7 Days, or Full Epoch.
    - **Query with Multi-Facet Filters:** Use the search bar (`⌘F`) or toggle preset chips (**Blocked Only**, **High/Crit Risk**, **HITL Pending**, **Clear Filters**) and facet dropdowns to isolate audit events.
    - **Select & Trace Event:** Click any event row in the table (e.g. `FIN-AGENT-01` mutation attempt, `COD-AGENT-01` deploy, or `RED-AGENT-01` sandbox attack) to immediately load its forensic inspection into the lower panel.
    - **Examine 6-Stage Trace Stack:** Review the chronological zero-knowledge call stack from stimulus ingestion to cryptographic sealing with syntax-highlighted code payloads.
    - **Inspect Merkle Leaf Tree:** Trace the leaf index, SHA-256 hash, and visual Merkle tree hierarchy leading up to root `0x8f4b...39e`.
    - **Verify Hardware Attestation:** Check AWS Nitro Enclave v2 PCR0 digest and NexusGuard Root CA #4 signature.
    - **Copy Event JSON & Export Attestation:** Click **Copy Event JSON** to copy raw payloads or **Export Signed Attestation** to download an Ed25519 verification certificate.
    - **Validate Entire Merkle Ledger:** Click **Verify Ledger: 0x8f4b...39e** to open the cryptographic validation modal and confirm zero-drift WORM compliance.
    - **Export Full Forensic Dump:** Click **Export Forensic PCAP / JSON** to download the complete indexed event bundle.
15. In **Tool & System Integrations Control Plane (Integrations — Page 16)**:
    - **Filter by Infra Category:** Click category filter pills (**All**, **Databases**, **APIs & Webhooks**, **Cloud Infrastructure**, **Browsers & Sandboxes**, **Code & Git Repos**) or type in the search bar to filter connected resources.
    - **Switch View Mode:** Toggle between Card Grid View and Compact Table View.
    - **Select & Inspect Asset:** Click any integration card or table row (e.g. `PostgreSQL Core Ledger`, `AWS S3 Vault`, `SWIFT Core Banking API`, `Chromium Headless Sandbox`) to load its deep-dive parameters into the right inspection drawer.
    - **Review Tripwires & Sparkline:** Examine active perimeter tripwires (DDL triggers, rate limiters, column masking) and parse latency sparkline.
    - **Register New Asset:** Click **Register New Tool (+)** to open the enrollment modal, configure asset name, category, endpoint URI, and assigned agent.
    - **Test Gateway Handshake:** Click **Test Gateway Connection** to simulate mTLS 1.3 verification with latency metrics.
    - **View Proxy Logs:** Click **Inspect Proxy Access Logs** to review recent AST tokenizer audit events and blocked query attempts.
    - **Emergency Lease Revocation:** Click **Revoke All Agent Leases** to confirm immediate session token revocation and resource isolation.
    - **Re-validate Enclaves:** Click **Re-validate Enclaves** to trigger cluster-wide PCR0 attestation re-verification.
    - **Export Matrix:** Click **Export Matrix** to download the complete integrations perimeter state as JSON.
16. In **Core System Architecture & Topology (System Architecture — COMMAND)**:
    - **Inspect 4-Layer Zero-Trust Flow:** Review the end-to-end architectural boundary across Ingress & Orchestration (L1), NexusGuard Core Control Plane (L2), HITL Escalation Ring (L3), and Egress Boundaries & Enterprise Assets (L4).
    - **Toggle Live Telemetry:** Click **Live Telemetry: ACTIVE** to toggle simulated real-time latency and ingress telemetry streaming with microsecond jitter.
    - **Inspect Sub-Engines:** Click any of the 8 sub-engine cards (`01 Attestation`, `02 Semantic Firewall`, `03 Dynamic Invariants`, `04 Risk Engine`, `05 OWASP Threat Detector`, `06 Adaptive Trust Matrix`, `07 Tool Gateway`, `08 Cryptographic Ledger`) to open its detailed inspection modal with verification vectors and tech stack.
    - **Inspect Egress Enclaves:** Click any egress resource card (`Production Databases`, `Cloud APIs`, `Chromium Browsers`, `Git Repos`, `IPC Bus`, `Quarantine Sandbox`) to view endpoints and security modes.
    - **Explore Layer Inspection Tabs:** Navigate through **Overview**, **Control Plane Internals**, **Cryptographic Pipeline**, **Enclave Attestation**, and **Latency Budget** tabs.
    - **Analyze Latency SLA Breakdown:** Examine the step-by-step latency bar graph totaling 2.53ms against the 4.80ms SLA ceiling.
17. In **Enterprise Security & Governance Settings (Settings — PLATFORM)**:
    - **Navigate Configuration Sections:** Use the sticky sub-navigation dock to jump across Topology, Auth & SSO, Agent Enclaves, Threat Policies, Kill Switch, Audit & WORM, API Tokens, and Clusters.
    - **Adjust Sliders & Controls:** Fine-tune the Quorum Approval Threshold (1–4 keys), Baseline Trust Floor (60–95), and Ingress Rate Limiting (500–50k req/min) with instant badge feedback.
    - **Manage API Tokens:** Click the eye icon to reveal the master ingress token, copy it to clipboard, or click **Revoke Token** to open the high-severity revocation modal.
    - **Rotate KMS Key:** Input a custom customer-managed KMS ARN and click **Rotate Key** to simulate cryptographic root key rollover.
    - **Audit Changes (2-Man Quorum):** Click **Audit Changes** to open the 2-Man Quorum verification modal, review the SHA-256 config diff hash, sign the Secondary SecOps Key, and commit the revision.
    - **Save Settings:** Click **SAVE SETTINGS** to trigger the animated cryptographic sealing sequence and commit new parameters.
    - **Export Snapshot:** Click **Export Config Snapshot** to download the complete configuration JSON.
18. In **Agent Network & Inter-Agent Bus (Page 6)**:
    - **Navigate Topological Mesh:** Explore the 13-node, 5-tier architecture across Ingress, Core Swarm, Specialized Logic, Database Engine, Storage Vault, and Adversarial Sandbox.
    - **Filter Bus Channels:** Filter channels by security state (**ALL**, **VERIFIED**, **SEVERED**, **QUORUM_LOCKED**, **SANDBOXED**) or search by agent identifier.
    - **Simulate Radar Ping & Particles:** Click **Radar Ping** to broadcast a cryptographic attestation wave across the canvas; toggle **Particles** to show/hide animated directional data packets.
    - **Inspect Channel Links:** Click any channel line or badge to inspect its cipher suite, message throughput, transit latency, synthesized neural intent, enforced policy, and raw packet dump.
    - **Sever / Restore Channels:** In the channel inspector, click **Sever Channel** to instantly cut inter-agent communication, or **Restore Channel** to reconnect the link.
    - **Exempt Quorum Links (2-Man Rule):** On quorum-locked channels, click **Request 2-Man Quorum Exemption** to open the dual-key authorization modal and authorize temporary traffic.
    - **Trace Route Latency:** Click **Trace Route Latency** to launch the hop-by-hop packet trace benchmark with microsecond transit diagnostics.
    - **Inspect & Quarantine Nodes:** Click any agent node in the topology to view its profile, trust score, and active links; click **Quarantine Agent** to place the agent in cryptographic isolation across the workspace.
    - **Export Topology JSON:** Click **Export Topology** to download the complete 13-node, 15-channel network configuration.
19. Use the export buttons to download JSON snapshots of the visible sample data.
20. Use the workspace profile button to return to the access screen.

## Build for preview

From the `frontend/` directory, run:

```powershell
npm run build
npm run preview
```

The build runs the TypeScript check and creates static assets in `frontend/dist/`. The preview command prints the local URL to open.

## Project structure

```text
NexusGuard/
├── backend/
│   ├── agents/       # Agent module placeholders
│   ├── api/          # API module placeholders
│   ├── database/     # Database module placeholders
│   ├── models/       # Data model placeholders
│   ├── security/     # Security module placeholders
│   ├── services/     # Service module placeholders
│   └── main.py       # Backend entry point placeholder
├── docs/             # Documentation workspace (currently empty)
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── AgentDetail/
│   │   │   ├── AgentNetwork/
│   │   │   ├── Agents/
│   │   │   ├── Approvals/
│   │   │   │   ├── HumanApprovals.tsx
│   │   │   │   └── human-approvals.css
│   │   │   ├── Architecture/
│   │   │   │   ├── SystemArchitecture.tsx
│   │   │   │   └── system-architecture.css
│   │   │   ├── Audit/
│   │   │   │   ├── AuditTrail.tsx
│   │   │   │   └── audit-trail.css
│   │   │   ├── Governance/
│   │   │   │   ├── GovernanceCenter.tsx
│   │   │   │   └── governance-center.css
│   │   │   ├── Integrations/
│   │   │   │   ├── IntegrationsControl.tsx
│   │   │   │   └── integrations-control.css
│   │   │   ├── IntentFirewall/
│   │   │   │   ├── IntentFirewall.tsx
│   │   │   │   └── intent-firewall.css
│   │   │   ├── KillSwitch/
│   │   │   │   ├── KillSwitch.tsx
│   │   │   │   └── kill-switch.css
│   │   │   ├── Permissions/
│   │   │   │   ├── PermissionManagement.tsx
│   │   │   │   └── permission-management.css
│   │   │   ├── RedAgent/
│   │   │   │   ├── RedAgent.tsx
│   │   │   │   └── red-agent.css
│   │   │   ├── RiskCenter/
│   │   │   │   ├── RiskCenter.tsx
│   │   │   │   └── risk-center.css
│   │   │   ├── Settings/
│   │   │   │   ├── EnterpriseSettings.tsx
│   │   │   │   └── enterprise-settings.css
│   │   │   ├── ThreatDetection/
│   │   │   │   ├── ThreatDetection.tsx
│   │   │   │   └── threat-detection.css
│   │   │   ├── TrustBehavior/
│   │   │   │   ├── TrustBehavior.tsx
│   │   │   │   └── trust-behavior.css
│   │   │   └── ...   # Planned feature page folders
│   │   ├── App.tsx
│   │   ├── Dashboard.tsx
│   │   └── styles.css
│   ├── package.json
│   └── index.html
├── tests/            # Test workspace (currently empty)
└── README.md
```

The folders and modules marked as placeholders are scaffolding only. Creating a file or route does not mean that a backend service or feature is implemented.

## Current limitations

- No working login, logout session, password recovery, SSO, WebAuthn, or identity provider integration.
- `backend/main.py` and the backend modules are empty placeholders; there is no API server or database connection yet.
- Agent records, topology links, metrics, events, risk scores, and policy labels are illustrative frontend data.
- Registry edits and simulated actions are held in React state and are lost when the page is reloaded. They do not change real agent permissions, credentials, processes, or network connections.
- The `tests/` directory is empty; no automated test suite is currently configured.
- The interface is a prototype, not a compliance certification or security control.

## Next implementation steps

1. Define backend API contracts and persistent data models for agents, permissions, policies, events, approvals, and audit records.
2. Implement authentication and authorization with a real identity provider; protect all backend routes and secrets.
3. Connect the frontend to API-backed registry, policy, approval, event, and topology data; replace sample labels with connection-derived state.
4. Add validation and audit logging for permission changes, escalations, quarantines, and other privileged operations.
5. Add automated unit, integration, and end-to-end tests before enabling operational controls.
