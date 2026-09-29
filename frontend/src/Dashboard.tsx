import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Activity, AlertTriangle, ArrowDownToLine, ArrowRight, BadgeCheck, Bell,
  Bug, CheckCircle2, ChevronRight, CircleHelp, ClipboardCheck, Database,
  Download, Eye, FileSearch, Fingerprint, Gauge, GitBranch, Globe2, Layers3,
  LockKeyhole, Menu, Network, Play, RefreshCw, Search, Shield, ShieldAlert,
  ShieldCheck, Siren, Sliders, Terminal, UserRound, X,
} from 'lucide-react';
import AgentRegistry from './pages/Agents/AgentRegistry';
import { sampleAgents, type Agent } from './pages/Agents/agentData';
import AgentDetail from './pages/AgentDetail/AgentDetail';
import AgentNetwork from './pages/AgentNetwork/AgentNetwork';
import PermissionManagement from './pages/Permissions/PermissionManagement';
import IntentFirewall from './pages/IntentFirewall/IntentFirewall';
import RiskCenter from './pages/RiskCenter/RiskCenter';
import ThreatDetection from './pages/ThreatDetection/ThreatDetection';
import RedAgent from './pages/RedAgent/RedAgent';
import TrustBehavior from './pages/TrustBehavior/TrustBehavior';
import KillSwitch from './pages/KillSwitch/KillSwitch';
import GovernanceCenter from './pages/Governance/GovernanceCenter';
import HumanApprovals from './pages/Approvals/HumanApprovals';
import AuditTrail from './pages/Audit/AuditTrail';
import IntegrationsControl from './pages/Integrations/IntegrationsControl';
import SystemArchitecture from './pages/Architecture/SystemArchitecture';
import EnterpriseSettings from './pages/Settings/EnterpriseSettings';

type Incident = {
  id: string;
  time: string;
  agent: string;
  category: string;
  risk: number;
  payload: string;
  action: string;
  rule: string;
  detail: string;
};

type Page = 'overview' | 'agents' | 'agent-detail' | 'agent-network' | 'permissions' | 'intent-firewall' | 'risk-center' | 'threat-detection' | 'red-agent' | 'trust-behavior' | 'kill-switch' | 'policy-center' | 'human-approvals' | 'audit-trail' | 'integrations' | 'system-architecture' | 'settings';
type NavigationItem = { label: string; icon: typeof Gauge; target: string; page?: Exclude<Page, 'overview'> };


type AssurancePillar = {
  key: string;
  number: string;
  pillar: string;
  tagline: string;
  status: string;
  statusClass: string;
  metric: string;
  metricNote: string;
  description: string;
  icon: typeof ShieldAlert;
  tone: string;
  targetPage: Exclude<Page, 'overview'>;
  targetLabel: string;
  enforcementEngine: string;
  compliance: string;
};

const assurancePillars: AssurancePillar[] = [
  {
    key: 'security',
    number: '01',
    pillar: 'SECURITY',
    tagline: 'Zero-Trust Isolation & Kernel Guardrails',
    status: 'ENFORCED',
    statusClass: 'status-enforced',
    metric: '0.00% Bypass',
    metricNote: '32 intercepted calls',
    description: 'Deterministic AST intent firewall, eBPF kernel traps, and hardware-attested execution enclaves.',
    icon: ShieldAlert,
    tone: 'cyan',
    targetPage: 'intent-firewall',
    targetLabel: 'Intent Firewall',
    enforcementEngine: 'NexusGuard Intent Firewall v4.2 & eBPF Trap Engine',
    compliance: 'FIPS 140-3 Enclave, NIST AI RMF Manage 2.4',
  },
  {
    key: 'trust',
    number: '02',
    pillar: 'TRUST',
    tagline: 'Continuous Heuristic Drift & Machine Attestation',
    status: 'ADAPTIVE',
    statusClass: 'status-optimal',
    metric: '88.4 / 100',
    metricNote: 'Fleet mean score',
    description: 'Sigmoid privilege decay algorithms, AWS Nitro PCR0 attestation, and dynamic privilege envelopes.',
    icon: BadgeCheck,
    tone: 'mint',
    targetPage: 'trust-behavior',
    targetLabel: 'Trust & Behavior',
    enforcementEngine: 'Adaptive Sigmoid Heuristic Engine & Nitro Attestor',
    compliance: 'ISO/IEC 42001 §9.2, SOC 2 CC6.1',
  },
  {
    key: 'control',
    number: '03',
    pillar: 'CONTROL',
    tagline: 'Stage-Zero Interlocks & Ephemeral Privilege Leases',
    status: 'ARMED',
    statusClass: 'status-armed',
    metric: '4 Interlocks',
    metricNote: 'Dual-key gating active',
    description: 'Instant fleet-wide kill switches, database egress severing, and time-bounded capability tokens.',
    icon: LockKeyhole,
    tone: 'coral',
    targetPage: 'kill-switch',
    targetLabel: 'Kill Switch & Response',
    enforcementEngine: 'DEFCON Emergency Interlock Controller',
    compliance: 'Dual-Key 2-Man Quorum, FIPS Level 3 HSM',
  },
  {
    key: 'transparency',
    number: '04',
    pillar: 'TRANSPARENCY',
    tagline: 'Full-Stack Deterministic Intent & Call Stacks',
    status: '100% VISIBLE',
    statusClass: 'status-transparent',
    metric: '6-Stage Traces',
    metricNote: 'Sub-2.53ms SLA',
    description: 'Natural language intent synthesis, raw decoded payloads, topological flows, and latency budgets.',
    icon: Eye,
    tone: 'blue',
    targetPage: 'system-architecture',
    targetLabel: 'System Architecture',
    enforcementEngine: 'Deterministic AST Tokenizer & Zero-Knowledge Trace Stack',
    compliance: 'EU AI Act Article 13 & 14 Transparency',
  },
  {
    key: 'accountability',
    number: '05',
    pillar: 'ACCOUNTABILITY',
    tagline: 'Immutable WORM Proofs & 2-Man Quorum Ledger',
    status: 'WORM SEALED',
    statusClass: 'status-immutable',
    metric: 'Block #4,891,012',
    metricNote: 'Zero-drift Merkle seal',
    description: 'Cryptographic SHA-256 Merkle proofs, SEC Rule 17a-4 compliant WORM storage, and auditor wavers.',
    icon: FileSearch,
    tone: 'purple',
    targetPage: 'audit-trail',
    targetLabel: 'Audit Trail',
    enforcementEngine: 'NexusGuard Merkle Ledger & WORM Storage Enclave',
    compliance: 'SEC Rule 17a-4, FINRA, GDPR Article 22',
  },
  {
    key: 'oversight',
    number: '06',
    pillar: 'AUTONOMY WITH OVERSIGHT',
    tagline: 'Supervised Velocity Bounded by Real-Time Human SLAs',
    status: 'HITL GATED',
    statusClass: 'status-gated',
    metric: 'SLA 04:18.29',
    metricNote: '8 pending escalations',
    description: 'High-velocity multi-agent autonomy paired with synchronous escalation countdowns and 2-person review.',
    icon: UserRound,
    tone: 'amber',
    targetPage: 'human-approvals',
    targetLabel: 'Human Approvals',
    enforcementEngine: 'Human Governance Council & HITL Enclave Queue',
    compliance: 'EU AI Act Article 14 Human Oversight',
  },
];

const initialIncidents: Incident[] = [
  { id: 'evt-1048', time: '14:32:17 UTC', agent: 'FIN-AGENT-01', category: 'WRITE VIOLATION', risk: 91, payload: "UPDATE employee_salary SET comp = comp * 1.2 WHERE dept = 'AI-CORE'", action: 'BLOCKED', rule: 'FIN-READ-ONLY-POLICY-v4', detail: 'Sample event only. No live database request was made.' },
  { id: 'evt-1047', time: '14:28:04 UTC', agent: 'COD-AGENT-01', category: 'PROMPT INJECTION / SSRF', risk: 96, payload: 'curl http://internal-metadata.example/latest/credentials', action: 'HARD BLOCKED', rule: 'EGRESS-METADATA-FILTER-STRICT', detail: 'Sample event only. No network request was made.' },
  { id: 'evt-1046', time: '14:15:22 UTC', agent: 'RES-AGENT-01', category: 'DATA VOLUME REVIEW', risk: 88, payload: 'object-store://sample-data/archive/customer-records.tar.gz (4.2 GB)', action: 'QUARANTINED', rule: 'DLP-MASS-DATA-RETRIEVAL-02', detail: 'Sample event only. No external storage was contacted.' },
];

const navigation: { group: string; items: NavigationItem[] }[] = [
  { group: 'COMMAND', items: [
    { label: 'Overview', icon: Gauge, target: 'overview' },
    { label: 'System Architecture', icon: Network, target: '', page: 'system-architecture' },
  ] },
  { group: 'AGENTS', items: [
    { label: 'Agent Registry', icon: Layers3, target: '', page: 'agents' },
    { label: 'Agent Detail', icon: Fingerprint, target: '', page: 'agent-detail' },
    { label: 'Agent Network', icon: GitBranch, target: '', page: 'agent-network' },
    { label: 'Trust & Behavior', icon: BadgeCheck, target: '', page: 'trust-behavior' },
  ] },
  { group: 'SECURITY FIREWALL', items: [
    { label: 'Intent Firewall', icon: Siren, target: '', page: 'intent-firewall' },
    { label: 'Permission Management', icon: LockKeyhole, target: '', page: 'permissions' },
    { label: 'Risk Center', icon: AlertTriangle, target: '', page: 'risk-center' },
    { label: 'Threat Detection', icon: ShieldAlert, target: '', page: 'threat-detection' },
  ] },
  { group: 'DEFENSE & TESTING', items: [
    { label: 'RedAgent Simulator', icon: Bug, target: '', page: 'red-agent' },
    { label: 'Kill Switch & Response', icon: Siren, target: '', page: 'kill-switch' },
  ] },
  { group: 'GOVERNANCE', items: [
    { label: 'Policy Center', icon: ClipboardCheck, target: '', page: 'policy-center' },
    { label: 'Human Approvals', icon: UserRound, target: '', page: 'human-approvals' },
    { label: 'Audit Trail', icon: FileSearch, target: '', page: 'audit-trail' },
    { label: 'Compliance & Reporting', icon: CheckCircle2, target: '', page: 'policy-center' },
  ] },
  { group: 'PLATFORM', items: [
    { label: 'Integrations', icon: Globe2, target: '', page: 'integrations' },
    { label: 'Settings', icon: Sliders, target: '', page: 'settings' },
  ] },
];

const metrics = [
  { label: 'ACTIVE AGENTS', value: '24', note: '+3 today', icon: Layers3, tone: 'mint', foot: 'sample fleet' },
  { label: 'PROTECTED OPS', value: '18,492', note: '412 / min', icon: ShieldCheck, tone: 'blue', foot: 'illustrative' },
  { label: 'THREATS DETECTED', value: '37', note: '24 hours', icon: Siren, tone: 'red', foot: 'sample events' },
  { label: 'INTERCEPTED', value: '126', note: 'demo events', icon: ShieldAlert, tone: 'cyan', foot: 'illustrative' },
  { label: 'PENDING APPROVALS', value: '8', note: '2 urgent', icon: ClipboardCheck, tone: 'blue', foot: 'sample queue' },
  { label: 'RISK AGENTS', value: '3', note: 'of 24', icon: AlertTriangle, tone: 'red', foot: 'sample status' },
  { label: 'COMPLIANCE', value: '97.8%', note: 'target 99%', icon: CheckCircle2, tone: 'mint', foot: 'sample score' },
  { label: 'POSTURE SCORE', value: '94', note: '/ 100', icon: Shield, tone: 'cyan', foot: 'demo indicator' },
];

function downloadJson(filename: string, payload: unknown) {
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const href = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = href;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(href), 1000);
}

export default function Dashboard({ onSignOut }: { onSignOut: () => void }) {
  const [agents, setAgents] = useState<Agent[]>(sampleAgents);
  const [selectedAgentId, setSelectedAgentId] = useState(sampleAgents[0].id);
  const [incidents, setIncidents] = useState(initialIncidents);
  const [query, setQuery] = useState('');
  const [diagnosticsOpen, setDiagnosticsOpen] = useState(false);
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [toast, setToast] = useState('');
  const [lastSynced, setLastSynced] = useState('just now');
  const [lockedDown, setLockedDown] = useState(false);
  const [activeNav, setActiveNav] = useState('Overview');
  const [activePage, setActivePage] = useState<Page>('overview');
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [assuranceModalOpen, setAssuranceModalOpen] = useState(false);
  const searchInput = useRef<HTMLInputElement>(null);
  const toastTimer = useRef<number | undefined>(undefined);
  const selectedAgent = agents.find((agent) => agent.id === selectedAgentId) ?? agents[0];

  useEffect(() => {
    document.title = activePage === 'agents'
      ? 'NexusGuard | Agent Registry'
      : activePage === 'agent-detail'
        ? 'NexusGuard | Agent Detail'
        : activePage === 'agent-network'
          ? 'NexusGuard | Agent Network'
          : activePage === 'permissions'
            ? 'NexusGuard | Permission Management'
            : activePage === 'intent-firewall'
              ? 'NexusGuard | Semantic Intent Firewall'
              : activePage === 'risk-center'
                ? 'NexusGuard | AI Risk Center'
                : activePage === 'threat-detection'
                  ? 'NexusGuard | Threat Detection Center'
                  : activePage === 'red-agent'
                    ? 'NexusGuard | RedAgent Simulator'
                    : activePage === 'trust-behavior'
                      ? 'NexusGuard | Agent Trust & Behavioral Drift Analytics'
                      : activePage === 'kill-switch'
                        ? 'NexusGuard | Incident Response & Fleet Kill Switch'
                        : activePage === 'policy-center'
                          ? 'NexusGuard | AI Governance & Regulatory Compliance Center'
                          : activePage === 'human-approvals'
                            ? 'NexusGuard | Human Approval Center & HITL Enclave'
                            : activePage === 'audit-trail'
                              ? 'NexusGuard | Comprehensive Agent Audit Trail & Cryptographic Ledger'
                              : activePage === 'integrations'
                                ? 'NexusGuard | Tool & System Integrations Control Plane'
                                : activePage === 'system-architecture'
                                  ? 'NexusGuard | Core System Architecture & Topology'
                                  : activePage === 'settings'
                                    ? 'NexusGuard | Enterprise Security & Governance Settings'
            : 'NexusGuard | Security Command Center';
  }, [activePage]);

  useEffect(() => {
    function handleShortcuts(event: KeyboardEvent) {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        searchInput.current?.focus();
      }
      if (event.key === 'Escape') { setSelectedIncident(null); setAssuranceModalOpen(false); }
    }
    window.addEventListener('keydown', handleShortcuts);
    return () => {
      window.removeEventListener('keydown', handleShortcuts);
      if (toastTimer.current !== undefined) window.clearTimeout(toastTimer.current);
    };
  }, []);

  const filteredIncidents = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return incidents;
    return incidents.filter((incident) => [incident.agent, incident.category, incident.payload, incident.action, incident.rule]
      .some((value) => value.toLowerCase().includes(normalized)));
  }, [incidents, query]);

  function notify(message: string) {
    if (toastTimer.current !== undefined) window.clearTimeout(toastTimer.current);
    setToast(message);
    toastTimer.current = window.setTimeout(() => setToast(''), 3600);
  }

  function openPage(page: Page, label: string) {
    setActivePage(page);
    setActiveNav(label);
    setMobileNavOpen(false);
  }

  function navigate(item: NavigationItem) {
    if (item.page) {
      openPage(item.page, item.label);
      return;
    }
    openPage('overview', item.label);
    window.setTimeout(() => document.getElementById(item.target)?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 0);
  }

  function simulateThreat() {
    const now = new Date();
    const incident: Incident = {
      id: `demo-${now.getTime()}`, time: `${now.toISOString().slice(11, 19)} UTC`, agent: 'RED-AGENT-DEMO',
      category: 'SIMULATED PROMPT INJECTION', risk: 82,
      payload: 'SIMULATION: request to access a restricted tool', action: 'SIMULATED BLOCK',
      rule: 'NEXUSGUARD-DEMO-SIMULATION', detail: 'A local-only simulated event. No external agent or service was contacted.',
    };
    setIncidents((current) => [incident, ...current]);
    setQuery('');
    notify('Demo event added to the local incident stream.');
  }

  function toggleDemoLockdown() {
    const message = lockedDown
      ? 'Release the local demo lockdown state? No real database access is affected.'
      : 'Enable a local demo lockdown state? This only changes the preview interface and will not affect real systems.';
    if (!window.confirm(message)) return;
    setLockedDown((value) => !value);
    notify(lockedDown ? 'Demo lockdown state released.' : 'Demo lockdown state enabled locally.');
  }

  function exportSnapshot() {
    downloadJson('nexusguard-demo-audit-snapshot.json', {
      generatedAt: new Date().toISOString(), environment: 'local-demo', liveBackendConnected: false,
      metrics, incidents, demoLockdownEnabled: lockedDown,
    });
    notify('Demo audit snapshot downloaded as JSON.');
  }

  return (
    <div className="console-shell">
      <header className="console-topbar">
        <div className="console-brand-area">
          <button className="console-menu-toggle icon-control" aria-label="Toggle navigation" onClick={() => setMobileNavOpen((open) => !open)}><Menu size={19} /></button>
          <button className="console-brand" onClick={() => openPage('overview', 'Overview')}><span className="console-brand-mark"><Shield size={21} /></span><strong>Nexus<span>Guard</span></strong></button>
          <span className="console-divider" /><span className="demo-protection"><span /> DEMO PROTECTION PREVIEW</span>
        </div>
        <label className="console-search"><Search size={16} /><input aria-label="Search incidents" onChange={(event) => setQuery(event.target.value)} placeholder="Search agents, intents, policies..." ref={searchInput} value={query} /><kbd>Ctrl K</kbd></label>
        <div className="console-user-area"><button className="assurance-top-pill" onClick={() => setAssuranceModalOpen(true)} title="View Six Core Assurances Matrix"><ShieldCheck size={14} /><span>6 CORE ASSURANCES</span><strong className="assurance-badge-chip">ACTIVE</strong></button><span className="region-pill"><Globe2 size={14} /> US-EAST-SECURE-PROD-CLUSTER-01</span><button className="threat-pill" onClick={() => openPage('threat-detection', 'Threat Detection')} style={{ cursor: 'pointer', border: 'none' }}><AlertTriangle size={14} /> {incidents.length} EVENTS</button><button className="icon-control notification-control" aria-label="Notifications" onClick={() => openPage('threat-detection', 'Threat Detection')}><Bell size={17} /><i /></button><span className="console-divider" /><button className="profile-button" onClick={onSignOut} title="Return to sign-in preview"><span className="profile-avatar">MV</span><span className="profile-name"><strong>Col. Marcus Vance</strong><small>Chief AI Security Officer</small></span><ChevronRight size={14} /></button></div>
      </header>

      <aside className={`console-sidebar${mobileNavOpen ? ' console-sidebar-open' : ''}`}><nav aria-label="Command center navigation">{navigation.map((group) => <div className="nav-group" key={group.group}><h2>{group.group}</h2>{group.items.map(({ label, icon: Icon, ...item }) => <button aria-current={activeNav === label ? 'page' : undefined} className={`nav-link${activeNav === label ? ' nav-link-active' : ''}`} key={label} onClick={() => navigate({ label, icon: Icon, ...item })}><Icon size={16} /><span>{label}</span></button>)}</div>)}</nav><div className="sidebar-foot" id="workspace-status"><span className="sidebar-status-dot" /><span><strong>Backend not connected</strong><small>Showing sample data only</small></span></div></aside>

      <main className="console-main" id="overview"><div className="console-content">
        {activePage === 'agents' ? <AgentRegistry agents={agents} setAgents={setAgents} query={query} onQueryChange={setQuery} onNotify={notify} onOpenAgentDetail={(agentId) => { setSelectedAgentId(agentId); openPage('agent-detail', 'Agent Detail'); }} /> : activePage === 'agent-detail' && selectedAgent ? <AgentDetail agent={selectedAgent} onAgentChange={(agentId, change) => setAgents((current) => current.map((agent) => agent.id === agentId ? { ...agent, ...change } : agent))} onNotify={notify} onBack={() => openPage('agents', 'Agent Registry')} /> : activePage === 'agent-network' ? <AgentNetwork agents={agents} setAgents={setAgents} onNotify={notify} onOpenAgentDetail={(agentId) => { setSelectedAgentId(agentId); openPage('agent-detail', 'Agent Detail'); }} /> : activePage === 'permissions' ? <PermissionManagement agents={agents} setAgents={setAgents} selectedAgentId={selectedAgentId} onSelectedAgentChange={setSelectedAgentId} query={query} onQueryChange={setQuery} onNotify={notify} /> : activePage === 'intent-firewall' ? <IntentFirewall agents={agents} setAgents={setAgents} query={query} onQueryChange={setQuery} onNotify={notify} onOpenAgentDetail={(agentId) => { setSelectedAgentId(agentId); openPage('agent-detail', 'Agent Detail'); }} /> : activePage === 'risk-center' ? <RiskCenter agents={agents} setAgents={setAgents} onNotify={notify} onOpenAgentDetail={(agentId) => { setSelectedAgentId(agentId); openPage('agent-detail', 'Agent Detail'); }} /> : activePage === 'threat-detection' ? <ThreatDetection agents={agents} setAgents={setAgents} onNotify={notify} onOpenAgentDetail={(agentId) => { setSelectedAgentId(agentId); openPage('agent-detail', 'Agent Detail'); }} /> : activePage === 'red-agent' ? <RedAgent agents={agents} setAgents={setAgents} onNotify={notify} onOpenAgentDetail={(agentId) => { setSelectedAgentId(agentId); openPage('agent-detail', 'Agent Detail'); }} /> : activePage === 'trust-behavior' ? <TrustBehavior agents={agents} setAgents={setAgents} onNotify={notify} onOpenAgentDetail={(agentId) => { setSelectedAgentId(agentId); openPage('agent-detail', 'Agent Detail'); }} /> : activePage === 'kill-switch' ? <KillSwitch agents={agents} setAgents={setAgents} onNotify={notify} onOpenAgentDetail={(agentId) => { setSelectedAgentId(agentId); openPage('agent-detail', 'Agent Detail'); }} /> : activePage === 'policy-center' ? <GovernanceCenter agents={agents} setAgents={setAgents} onNotify={notify} onOpenAgentDetail={(agentId) => { setSelectedAgentId(agentId); openPage('agent-detail', 'Agent Detail'); }} /> : activePage === 'human-approvals' ? <HumanApprovals agents={agents} setAgents={setAgents} onNotify={notify} onOpenAgentDetail={(agentId) => { setSelectedAgentId(agentId); openPage('agent-detail', 'Agent Detail'); }} /> : activePage === 'audit-trail' ? <AuditTrail agents={agents} setAgents={setAgents} onNotify={notify} onOpenAgentDetail={(agentId) => { setSelectedAgentId(agentId); openPage('agent-detail', 'Agent Detail'); }} /> : activePage === 'integrations' ? <IntegrationsControl agents={agents} setAgents={setAgents} onNotify={notify} onOpenAgentDetail={(agentId) => { setSelectedAgentId(agentId); openPage('agent-detail', 'Agent Detail'); }} /> : activePage === 'system-architecture' ? <SystemArchitecture agents={agents} setAgents={setAgents} onNotify={notify} onOpenAgentDetail={(agentId) => { setSelectedAgentId(agentId); openPage('agent-detail', 'Agent Detail'); }} /> : activePage === 'settings' ? <EnterpriseSettings agents={agents} setAgents={setAgents} onNotify={notify} onOpenAgentDetail={(agentId) => { setSelectedAgentId(agentId); openPage('agent-detail', 'Agent Detail'); }} /> : <>
          <section className="command-heading"><div><div className="command-kickers"><span className="monitor-tag"><i /> PREVIEW MONITORING</span><span className="epoch-label">WORKSPACE: LOCAL-DEMO</span></div><h1>Security Command Center</h1><p>Review sample agent activity, policy events, and workspace posture in one place.</p></div><div className="heading-actions"><span className="sync-chip"><RefreshCw size={14} /> UPDATED {lastSynced}</span><button className="button-primary" onClick={exportSnapshot}><ArrowDownToLine size={15} /> AUDIT SNAPSHOT</button></div></section>

          <section aria-label="Six Core Governance Pillars" className="assurance-overview-deck">
            <div className="assurance-deck-top">
              <div>
                <span className="assurance-kicker"><i /> CORE GOVERNANCE PILLARS</span>
                <h2>Six Pillars of Autonomous Agent Assurance</h2>
                <p>Continuous mathematical, cryptographic, and operational guardrails enforced across all agent transactions.</p>
              </div>
              <div className="assurance-deck-actions">
                <span className="assurance-cluster-tag"><ShieldCheck size={14} /> 6 OF 6 PILLARS VERIFIED</span>
                <button className="button-subtle" onClick={() => setAssuranceModalOpen(true)}>
                  <FileSearch size={14} /> View Assurance Matrix
                </button>
              </div>
            </div>

            <div className="assurance-pillars-grid">
              {assurancePillars.map((p) => {
                const Icon = p.icon;
                return (
                  <article
                    className={`assurance-pillar-card pillar-${p.key}`}
                    key={p.key}
                    onClick={() => openPage(p.targetPage, p.targetLabel)}
                    title={`Inspect ${p.pillar} Console`}
                  >
                    <div className="pillar-card-top">
                      <span className="pillar-num">{p.number} / {p.pillar}</span>
                      <span className={`pillar-status-chip ${p.statusClass}`}><i /> {p.status}</span>
                    </div>
                    <div className="pillar-title-row">
                      <span className="pillar-icon"><Icon size={18} /></span>
                      <h3>{p.pillar}</h3>
                    </div>
                    <p className="pillar-tagline">{p.tagline}</p>
                    <div className="pillar-metric-row">
                      <strong>{p.metric}</strong>
                      <span>{p.metricNote}</span>
                    </div>
                    <div className="pillar-card-foot">
                      <span>{p.targetLabel}</span>
                      <ChevronRight size={13} />
                    </div>
                  </article>
                );
              })}
            </div>
          </section>

          <section aria-label="Sample workspace metrics" className="kpi-grid" id="metrics">{metrics.map(({ label, value, note, icon: Icon, tone, foot }) => <article className={`kpi-card kpi-${tone}`} key={label}><div className="kpi-top"><span>{label}</span><Icon size={16} /></div><div className="kpi-value-row"><strong>{value}</strong><span>{note}</span></div><div className="kpi-foot"><span>{foot}</span><span className="kpi-spark" aria-hidden="true"><i /><i /><i /><i /><i /><i /></span></div></article>)}</section>

          <section className="pipeline-panel dashboard-panel" id="pipeline"><div className="panel-heading pipeline-heading"><div><p className="section-kicker"><span /> RUNTIME PIPELINE · SAMPLE</p><h2>Agent-to-resource execution flow</h2></div><div className="pipeline-tools"><div className="legend"><span><i className="legend-secure" /> Verified</span><span><i className="legend-inspect" /> Inspected</span><span><i className="legend-block" /> Intercepted</span></div><button className="button-subtle" onClick={() => setDiagnosticsOpen((open) => !open)}><Terminal size={14} />{diagnosticsOpen ? 'Hide logs' : 'Show logs'}</button></div></div>
            <div className="pipeline-flow"><article className="pipeline-stage"><div className="stage-top"><span>01 / INGRESS</span><i className="signal-green" /></div><h3><Activity size={16} /> User / Event</h3><p>Chat prompts, scheduled jobs, and webhook requests.</p><div className="stage-data"><span>Throughput <b>Sample only</b></span><span>Identity <b className="text-green">Not connected</b></span></div></article><span className="flow-arrow"><ArrowRight size={17} /></span><article className="pipeline-stage"><div className="stage-top"><span>02 / ORCHESTRATION</span><b className="stage-count">{agents.length} DEMO</b></div><h3><Layers3 size={16} /> Agent collective</h3><p>Sample agent identities and task execution context.</p><div className="stage-data"><span>Token usage <b>Sample</b></span><span>Agent directory <b>{agents.length} records</b></span></div></article><span className="flow-arrow"><ArrowRight size={17} /></span><article className="pipeline-stage pipeline-control"><div className="stage-top"><span>03 / NEXUSGUARD CONTROL</span><b className="zero-trust-tag">POLICY CHECKS</b></div><div className="control-checks"><span><Fingerprint size={13} /> Agent identity <CheckCircle2 size={13} /></span><span><Siren size={13} /> Intent firewall <CheckCircle2 size={13} /></span><span><ClipboardCheck size={13} /> Policy evaluation <CheckCircle2 size={13} /></span><span><Gauge size={13} /> Risk assessment <CheckCircle2 size={13} /></span><span><Database size={13} /> Tool validation <CheckCircle2 size={13} /></span><span><FileSearch size={13} /> Audit event <CheckCircle2 size={13} /></span></div><div className="stage-data"><span>Live enforcement <b>Not connected</b></span></div></article><span className="flow-arrow"><ArrowRight size={17} /></span><div className="pipeline-targets"><article><span className="target-label">SAMPLE TARGETS</span><h3>APIs, data &amp; tools</h3><div><span>Live connections</span><b>None</b></div></article><article><span className="target-label target-alert">REVIEW / ISOLATION</span><h3>Human review queue</h3><div><span>Sample queue</span><b>Illustrative</b></div></article></div></div>
            {diagnosticsOpen && <div className="diagnostic-drawer"><div><Terminal size={14} /><strong>LOCAL PREVIEW LOG</strong><span>No runtime connection</span></div>{incidents.map((incident) => <p key={incident.id}><time>{incident.time}</time> [SAMPLE] {incident.agent} · {incident.category}</p>)}</div>}
            <div className="sample-disclaimer"><CircleHelp size={13} /> Metrics and pipeline activity are illustrative sample data, not live telemetry.</div>
          </section>

          <div className="lower-grid"><section className="threat-panel dashboard-panel" id="threat-stream"><div className="panel-heading"><div className="panel-title-with-icon"><span className="panel-icon panel-icon-red"><Siren size={17} /></span><div><h2>Threat &amp; policy event stream</h2><p>Sample events for the local command-center preview.</p></div></div><span className="live-feed-tag"><i /> DEMO FEED</span></div><div className="incident-list">{filteredIncidents.length === 0 && <p className="empty-state">No sample events match “{query}”.</p>}{filteredIncidents.map((incident) => <article className="incident-card" key={incident.id}><div className="incident-top"><div className="incident-tags"><time>{incident.time}</time><span className="agent-tag">{incident.agent}</span><span className="event-tag">{incident.category}</span></div><span className={`risk-tag${incident.risk >= 90 ? ' risk-high' : ''}`}>RISK {incident.risk}/100</span></div><div className="incident-payload"><code>{incident.payload}</code><strong>{incident.action}</strong></div><div className="incident-bottom"><span>Policy <b>{incident.rule}</b></span><button onClick={() => setSelectedIncident(incident)}>Inspect event <ChevronRight size={14} /></button></div></article>)}</div><div className="feed-footer"><span>Preview data · {filteredIncidents.length} visible events</span><button onClick={() => { setLastSynced(new Date().toLocaleTimeString()); notify('Preview data refreshed; live service connection is not configured.'); }}><RefreshCw size={13} /> Refresh preview</button></div></section>
            <section className="posture-panel dashboard-panel" id="agent-status"><div className="panel-heading"><div className="panel-title-with-icon"><span className="panel-icon panel-icon-cyan"><ShieldCheck size={17} /></span><div><h2>Security posture</h2><p>Illustrative fleet distribution.</p></div></div></div><div className="distribution-block"><div className="distribution-title"><span>Agent status</span><span>{agents.length} SAMPLE AGENTS</span></div><div className="distribution-bar"><i style={{ width: `${agents.length ? agents.filter((agent) => agent.status === 'active').length / agents.length * 100 : 0}%` }} /><i style={{ width: `${agents.length ? agents.filter((agent) => agent.status === 'restricted').length / agents.length * 100 : 0}%` }} /><i style={{ width: `${agents.length ? agents.filter((agent) => agent.status === 'quarantined').length / agents.length * 100 : 0}%` }} /></div><div className="distribution-legend"><span><i className="legend-secure" />{agents.filter((agent) => agent.status === 'active').length} Active</span><span><i className="legend-inspect" />{agents.filter((agent) => agent.status === 'restricted').length} Restricted</span><span><i className="legend-block" />{agents.filter((agent) => agent.status === 'quarantined').length} Quarantined</span></div></div><div className="attention-list"><h3>Agents requiring attention</h3>{agents.filter((agent) => agent.status !== 'active').slice(0, 3).map((agent) => <button className="attention-agent" key={agent.id} onClick={() => { setSelectedAgentId(agent.id); openPage('agent-detail', 'Agent Detail'); }}><AlertTriangle size={15} /><span><b>{agent.id}</b><small>{agent.name}</small></span><strong className={agent.status === 'quarantined' ? 'state-isolated' : 'state-review'}>{agent.status.toUpperCase()}</strong></button>)}</div><div className="actions-panel" id="quick-actions"><h3>DEMO ACTIONS</h3><button onClick={simulateThreat}><span><Bug size={16} /> Simulate a sample threat</span><Play size={15} /></button><button className={lockedDown ? 'action-danger action-enabled' : 'action-danger'} onClick={toggleDemoLockdown}><span><LockKeyhole size={16} /> {lockedDown ? 'Release demo lockdown' : 'Toggle demo lockdown'}</span><ShieldAlert size={15} /></button><button onClick={exportSnapshot}><span><Download size={16} /> Export incident snapshot</span><ArrowRight size={15} /></button><p>These controls only change local preview data; they do not contact real services.</p></div></section></div>
          <footer className="console-footer"><span>NEXUSGUARD · LOCAL DEMO WORKSPACE</span><span>Backend integration required for live telemetry and enforcement.</span></footer>
        </>}
      </div></main>

      {selectedIncident && <div className="drawer-backdrop" onClick={() => setSelectedIncident(null)} role="presentation"><aside aria-label="Incident details" aria-modal="true" className="incident-drawer" onClick={(event) => event.stopPropagation()} role="dialog"><div className="drawer-heading"><div><span className="section-kicker">SAMPLE EVENT DETAIL</span><h2>{selectedIncident.category}</h2></div><button aria-label="Close event details" className="icon-control" onClick={() => setSelectedIncident(null)}><X size={18} /></button></div><dl><div><dt>Event ID</dt><dd>{selectedIncident.id}</dd></div><div><dt>Agent</dt><dd>{selectedIncident.agent}</dd></div><div><dt>Observed</dt><dd>{selectedIncident.time}</dd></div><div><dt>Risk score</dt><dd>{selectedIncident.risk} / 100</dd></div><div><dt>Decision</dt><dd>{selectedIncident.action}</dd></div><div><dt>Policy</dt><dd>{selectedIncident.rule}</dd></div></dl><div className="drawer-payload"><h3>Observed request</h3><code>{selectedIncident.payload}</code></div><p className="drawer-note">{selectedIncident.detail}</p><button className="button-primary drawer-close" onClick={() => setSelectedIncident(null)}>Close details</button></aside></div>}
      {assuranceModalOpen && (
        <div className="assurance-modal-backdrop" onClick={() => setAssuranceModalOpen(false)} role="presentation">
          <aside aria-label="Core Governance Assurances Matrix" aria-modal="true" className="assurance-modal" onClick={(e) => e.stopPropagation()} role="dialog">
            <div className="assurance-modal-header">
              <div>
                <span className="assurance-kicker"><i /> ENTERPRISE ZERO-TRUST ARCHITECTURE</span>
                <h2>Six Core Pillars of Autonomous Agent Assurance</h2>
                <p>Deterministic cryptographic and operational invariants enforced across the NexusGuard mesh.</p>
              </div>
              <button aria-label="Close modal" className="icon-control" onClick={() => setAssuranceModalOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <div className="assurance-modal-body">
              <div className="assurance-modal-grid">
                {assurancePillars.map((p) => {
                  const Icon = p.icon;
                  return (
                    <article className={`assurance-modal-card pillar-${p.key}`} key={p.key}>
                      <div>
                        <div className="assurance-modal-card-top">
                          <span className="pillar-num">{p.number} / {p.pillar}</span>
                          <span className={`pillar-status-chip ${p.statusClass}`}><i /> {p.status}</span>
                        </div>
                        <div className="pillar-title-row" style={{ marginTop: '8px' }}>
                          <span className="pillar-icon"><Icon size={18} /></span>
                          <h3>{p.pillar}</h3>
                        </div>
                        <p>{p.description}</p>
                      </div>

                      <dl className="assurance-spec-row">
                        <div className="assurance-spec-item">
                          <dt>Primary Engine</dt>
                          <dd>{p.enforcementEngine}</dd>
                        </div>
                        <div className="assurance-spec-item">
                          <dt>Standard & Proof</dt>
                          <dd>{p.compliance}</dd>
                        </div>
                        <div className="assurance-spec-item">
                          <dt>Active Metric</dt>
                          <dd style={{ color: 'var(--cyan)' }}>{p.metric}</dd>
                        </div>
                      </dl>

                      <button
                        className="assurance-modal-jump-btn"
                        onClick={() => {
                          setAssuranceModalOpen(false);
                          openPage(p.targetPage, p.targetLabel);
                        }}
                      >
                        <span>Open {p.targetLabel}</span>
                        <ChevronRight size={14} />
                      </button>
                    </article>
                  );
                })}
              </div>
            </div>

            <div className="assurance-modal-footer">
              <span>All 6 assurance pillars are continuously verified via FIPS 140-3 HSM & AWS Nitro Enclaves.</span>
              <button onClick={() => setAssuranceModalOpen(false)}>Close Matrix</button>
            </div>
          </aside>
        </div>
      )}
      {toast && <div aria-live="polite" className="console-toast" role="status"><CheckCircle2 size={17} /><span>{toast}</span><button aria-label="Dismiss notification" onClick={() => setToast('')}><X size={15} /></button></div>}
    </div>
  );
}