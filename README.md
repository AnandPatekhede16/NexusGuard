# NexusGuard

NexusGuard is a frontend prototype for an AI-agent security and governance workspace. It provides a sign-in preview, a security command center, an agent directory, permission management, agent profiles, and an agent-network visualization.

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
- **Agent Network:** Seven-node illustrative topology, protocol filters, selectable nodes and links, zoom controls, simulated ping, and local-only sever/review interactions.
- **Sample exports:** Registry, permission management, intent firewall stream, and audit views can download JSON snapshots containing sample data.

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
2. Use the left navigation to open **Agent Registry**, **Agent Detail**, **Permission Management**, **Semantic Intent Firewall**, or **Agent Network**. These pages share sample agent records during the current browser session.
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
7. In **Agent Network**, filter illustrative links by protocol, select nodes or connections, adjust zoom, and use sample ping, sever, and review controls. No network packets are sent.
8. Use the export buttons to download JSON snapshots of the visible sample data.
9. Use the workspace profile button to return to the access screen.

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
