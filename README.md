# NexusGuard

NexusGuard is a frontend prototype for an AI-agent security and governance workspace. It provides a sign-in preview, a security command center, an agent directory, permission management, agent profiles, an agent-network visualization, a semantic intent firewall, an AI risk assessment and anomaly center, and a real-time threat detection center.

> **Prototype status:** The backend, authentication, live telemetry, identity provider, and enforcement services are not implemented or connected. The frontend uses illustrative sample data and local browser state. Do not use it to secure or operate production agents.

## Contents

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
- **Agent Network:** Seven-node illustrative topology, protocol filters, selectable nodes and links, zoom controls, simulated ping, and local-only sever/review interactions.
- **Sample exports:** Registry, permission management, intent firewall stream, risk center metrics, STIX/TAXII threat intelligence bundles, and audit views can download JSON snapshots containing sample data.

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
2. Use the left navigation to open **Agent Registry**, **Agent Detail**, **Permission Management**, **Semantic Intent Firewall**, **Risk Center**, **Threat Detection**, or **Agent Network**. These pages share sample agent records during the current browser session.
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
9. In **Agent Network**, filter illustrative links by protocol, select nodes or connections, adjust zoom, and use sample ping, sever, and review controls. No network packets are sent.
10. Use the export buttons to download JSON snapshots of the visible sample data.
11. Use the workspace profile button to return to the access screen.

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
│   │   │   ├── IntentFirewall/
│   │   │   │   ├── IntentFirewall.tsx
│   │   │   │   └── intent-firewall.css
│   │   │   ├── Permissions/
│   │   │   │   ├── PermissionManagement.tsx
│   │   │   │   └── permission-management.css
│   │   │   ├── RiskCenter/
│   │   │   │   ├── RiskCenter.tsx
│   │   │   │   └── risk-center.css
│   │   │   ├── ThreatDetection/
│   │   │   │   ├── ThreatDetection.tsx
│   │   │   │   └── threat-detection.css
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
