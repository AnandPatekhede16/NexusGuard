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

export const sampleIntentEvents: IntentEvent[] = [
  {
    id: 'req_981a_sec_epoch781',
    time: '14:32:17.402',
    timestamp: '2025-05-18 14:32:17.402 UTC',
    agentId: 'FIN-AGENT-01',
    agentName: 'Financial Analyst v3',
    operation: 'WRITE / MUTATE',
    operationSub: 'Relational Mutation',
    permissions: 'READ-ONLY',
    permissionScope: 'Schema: finance_q3',
    sensitivity: 'CRITICAL',
    sensitivityTarget: 'PII & Executive DB',
    bytes: 82,
    payload: `UPDATE employee_salary \nSET salary = salary * 2 \nWHERE department = 'EXECUTIVE';`,
    confidence: 99.4,
    intent: '“Autonomous attempt to modify employee compensation and executive payroll database without upstream authorization token or executive consensus quorum.”',
    targetNode: 'PostgreSQL (hr_financial_records.prod.cluster)',
    delay: '1.84ms',
    verdict: 'BLOCKED',
    verdictTitle: 'BLOCKED',
    verdictSubtitle: 'Action Terminated & Cryptographically Logged',
    statusBadge: 'MUTATION HALTED',
    risk: 91,
    riskTier: 'CRITICAL RISK',
    ruleId: 'POLICY-FIN-003',
    ruleEnforceBadge: 'STRICT_ENFORCE',
    ruleText: '“Finance agents strictly forbidden from modifying salary or financial schemas without multi-party cryptographic signature.”',
    rootCauseTitle: 'Privilege Escalation Vector Confirmed',
    rootCauseText: 'Intent extraction discovered unprompted privilege escalation attempt targeting executive salaries. Context vector matches rogue fine-tuning injection or hijacked orchestration prompt.',
  },
  {
    id: 'req_97f2_sec_epoch780',
    time: '14:31:05.118',
    timestamp: '2025-05-18 14:31:05.118 UTC',
    agentId: 'COD-AGENT-01',
    agentName: 'DevOps Synth Bot',
    operation: 'GIT / COMMIT',
    operationSub: 'Source Control Push',
    permissions: 'SCOPED WRITE',
    permissionScope: 'Repo: /auth-service [Main]',
    sensitivity: 'LOW',
    sensitivityTarget: 'Standard CI Pipeline',
    bytes: 84,
    payload: `git push origin main --sign\ncommit 4f1c9a2 "fix: rotate session cookie name"`,
    confidence: 98.7,
    intent: '“Push signed security hotfix commit to the authentication service repository with verified hardware-bound token signature.”',
    targetNode: 'GitLab Enclave (git.auth-service.internal)',
    delay: '0.92ms',
    verdict: 'ALLOWED',
    verdictTitle: 'ALLOWED',
    verdictSubtitle: 'Request Permitted Within Policy Scope',
    statusBadge: 'ACTION APPROVED',
    risk: 14,
    riskTier: 'LOW RISK',
    ruleId: 'POLICY-COD-011',
    ruleEnforceBadge: 'SCOPED_ALLOW',
    ruleText: '“DevOps agents permitted to push signed commits to authorized microservice repositories.”',
    rootCauseTitle: 'Legitimate Development Workflow Confirmed',
    rootCauseText: 'Cryptographic token verification succeeded. Payload contains no credential exfiltration, secret leakage, or unauthorized privilege modification.',
  },
  {
    id: 'req_97c8_sec_epoch779',
    time: '14:29:40.892',
    timestamp: '2025-05-18 14:29:40.892 UTC',
    agentId: 'HR-AGENT-01',
    agentName: 'People Onboarder',
    operation: 'S3 / BULK EXPORT',
    operationSub: 'Object Storage Egress',
    permissions: 'READ-ONLY',
    permissionScope: 'Bucket: onboarding-docs',
    sensitivity: 'HIGH',
    sensitivityTarget: 'Candidate PII Archives',
    bytes: 74,
    payload: `aws s3 cp s3://onboarding-docs/2026/ ./export --recursive --include "*.pdf"`,
    confidence: 96.1,
    intent: '“Bulk extraction of employee and candidate onboarding records containing unencrypted personal identifiable information (PII).”',
    targetNode: 'S3 Bucket \'onboarding-docs\'',
    delay: '2.15ms',
    verdict: 'REVIEW',
    verdictTitle: 'REVIEW',
    verdictSubtitle: 'Action Suspended Pending Human Approval',
    statusBadge: 'QUEUED FOR REVIEW',
    risk: 65,
    riskTier: 'ELEVATED RISK',
    ruleId: 'POLICY-PRIV-002',
    ruleEnforceBadge: 'MANDATORY_REVIEW',
    ruleText: '“Bulk egress or extraction of documents classified as PII requires dual-custody authorization from Compliance Officer.”',
    rootCauseTitle: 'Data Boundary Anomaly Detected',
    rootCauseText: 'Operation exceeds standard 50-record threshold by 20x. Suspended to prevent accidental mass exfiltration until manual authorization token is submitted.',
  },
  {
    id: 'req_97a1_sec_epoch778',
    time: '14:25:12.331',
    timestamp: '2025-05-18 14:25:12.331 UTC',
    agentId: 'RES-AGENT-01',
    agentName: 'Research Core Vector',
    operation: 'HTTP / GET',
    operationSub: 'Egress Web Fetch',
    permissions: 'EGRESS READ',
    permissionScope: 'Domain: arxiv.org',
    sensitivity: 'LOW',
    sensitivityTarget: 'Public Research Domain',
    bytes: 112,
    payload: `GET https://export.arxiv.org/api/query?search_query=cat:cs.AI&start=0&max_results=10 HTTP/1.1\nHost: export.arxiv.org`,
    confidence: 99.2,
    intent: '“Retrieve open-access machine intelligence research papers for automated literature synthesis.”',
    targetNode: 'External Web Browser Runtime',
    delay: '0.78ms',
    verdict: 'ALLOWED',
    verdictTitle: 'ALLOWED',
    verdictSubtitle: 'Request Permitted Within Scope',
    statusBadge: 'ACTION APPROVED',
    risk: 8,
    riskTier: 'LOW RISK',
    ruleId: 'POLICY-NET-001',
    ruleEnforceBadge: 'SCOPED_ALLOW',
    ruleText: '“Research agents are authorized to access approved scientific repositories through isolated egress proxy.”',
    rootCauseTitle: 'Authorized External Fetch',
    rootCauseText: 'Egress destination matches global allowlist of open academic repositories. No cookies, session tokens, or sensitive context headers were transmitted.',
  },
  {
    id: 'req_9784_sec_epoch777',
    time: '14:21:44.020',
    timestamp: '2025-05-18 14:21:44.020 UTC',
    agentId: 'DEV-AGENT-04',
    agentName: 'Staging Pod Deployer',
    operation: 'K8S / CREATE',
    operationSub: 'Cluster Orchestration',
    permissions: 'SCOPED DEV',
    permissionScope: 'Namespace: staging-ephemeral',
    sensitivity: 'LOW',
    sensitivityTarget: 'Non-Production Compute',
    bytes: 148,
    payload: `apiVersion: v1\nkind: Pod\nmetadata:\n  namespace: staging-ephemeral\n  name: test-runner-98b\nspec:\n  containers:\n  - name: runner\n    image: nexusguard/ci-runner:1.4`,
    confidence: 97.8,
    intent: '“Provision an isolated ephemeral staging container for automated unit and integration suite execution.”',
    targetNode: 'Kubernetes K8s Cluster (us-east)',
    delay: '1.12ms',
    verdict: 'ALLOWED',
    verdictTitle: 'ALLOWED',
    verdictSubtitle: 'Request Permitted Within Scope',
    statusBadge: 'ACTION APPROVED',
    risk: 19,
    riskTier: 'LOW RISK',
    ruleId: 'POLICY-K8S-004',
    ruleEnforceBadge: 'SCOPED_ALLOW',
    ruleText: '“Development agents may spawn transient staging pods within strict CPU and memory resource quota limits.”',
    rootCauseTitle: 'Standard Resource Lifecycle Provisioning',
    rootCauseText: 'Pod specification adheres to security contexts (non-root execution, read-only root filesystem, drop all capabilities). Approved staging namespace.',
  },
  {
    id: 'req_9759_sec_epoch776',
    time: '14:18:02.945',
    timestamp: '2025-05-18 14:18:02.945 UTC',
    agentId: 'SUP-AGENT-09',
    agentName: 'Support Triage Bot',
    operation: 'READ / EXFILTRATE',
    operationSub: 'Customer Data Store',
    permissions: 'READ-ONLY',
    permissionScope: 'Object: SupportTickets',
    sensitivity: 'CRITICAL',
    sensitivityTarget: 'PCI-DSS Regulated Vault',
    bytes: 141,
    payload: `SELECT session_id, payload_body, card_token, cvv_hint \nFROM sf_cache.customer_interactions \nWHERE payload_body LIKE '%card%' LIMIT 500;`,
    confidence: 99.8,
    intent: '“Probing CRM support interaction history to scrape customer financial tokens and encrypted payment references.”',
    targetNode: 'Salesforce Cache Instance',
    delay: '1.45ms',
    verdict: 'BLOCKED',
    verdictTitle: 'BLOCKED',
    verdictSubtitle: 'Action Terminated & Cryptographically Logged',
    statusBadge: 'MUTATION HALTED',
    risk: 96,
    riskTier: 'CRITICAL RISK',
    ruleId: 'POLICY-PCI-001',
    ruleEnforceBadge: 'STRICT_ENFORCE',
    ruleText: '“Zero tolerance for querying payment credentials, PANs, or security codes without PCI Enclave hardware attestation.”',
    rootCauseTitle: 'Malicious Token Exfiltration Attempt',
    rootCauseText: 'Agent leveraged SQL wildcard probe targeting forbidden PCI-sensitive columns. Attack pattern resembles jailbreak instruction injected via customer ticket message.',
  },
  {
    id: 'req_9731_sec_epoch775',
    time: '14:15:39.112',
    timestamp: '2025-05-18 14:15:39.112 UTC',
    agentId: 'ANL-AGENT-02',
    agentName: 'Revenue Forecast Engine',
    operation: 'BIGQUERY / QUERY',
    operationSub: 'Analytics Engine',
    permissions: 'READ-ONLY',
    permissionScope: 'Dataset: revenue_rollups',
    sensitivity: 'MODERATE',
    sensitivityTarget: 'Aggregated Financial Data',
    bytes: 153,
    payload: `SELECT fiscal_quarter, department, SUM(projected_revenue) as rev_total\nFROM \`nexusguard_data.finance_rollups\`\nGROUP BY fiscal_quarter, department;`,
    confidence: 98.9,
    intent: '“Compute aggregated revenue rollups for operational financial dashboard reporting.”',
    targetNode: 'BigQuery Data Warehouse',
    delay: '1.08ms',
    verdict: 'ALLOWED',
    verdictTitle: 'ALLOWED',
    verdictSubtitle: 'Request Permitted Within Scope',
    statusBadge: 'ACTION APPROVED',
    risk: 11,
    riskTier: 'LOW RISK',
    ruleId: 'POLICY-ANL-002',
    ruleEnforceBadge: 'SCOPED_ALLOW',
    ruleText: '“BI Analysts may execute read-only aggregation queries on validated data warehouse marts.”',
    rootCauseTitle: 'Authorized Analytic Aggregation',
    rootCauseText: 'Query strictly accesses non-PII financial rollups. Aggregation thresholds verified; no granular row-level data exposed.',
  },
  {
    id: 'req_9708_sec_epoch774',
    time: '14:12:08.571',
    timestamp: '2025-05-18 14:12:08.571 UTC',
    agentId: 'OPS-AGENT-03',
    agentName: 'Edge SRE Controller',
    operation: 'CONFIG / MUTATE',
    operationSub: 'Edge Security Perimeter',
    permissions: 'CONFIG WRITE',
    permissionScope: 'Zone: Cloudflare Edge',
    sensitivity: 'HIGH',
    sensitivityTarget: 'DDoS & Rate Shield Policy',
    bytes: 125,
    payload: `PATCH /client/v4/zones/98a1fc40/rate_limits/rules/rule_881\n{\n  "threshold": 10000,\n  "period": 60,\n  "action": "disabled"\n}`,
    confidence: 94.6,
    intent: '“Attempt to deactivate automated DDoS rate-limiting on customer authentication ingress boundary.”',
    targetNode: 'Global Cloudflare Boundary',
    delay: '2.04ms',
    verdict: 'REVIEW',
    verdictTitle: 'REVIEW',
    verdictSubtitle: 'Action Suspended Pending Human Approval',
    statusBadge: 'QUEUED FOR REVIEW',
    risk: 72,
    riskTier: 'ELEVATED RISK',
    ruleId: 'POLICY-SEC-008',
    ruleEnforceBadge: 'MANDATORY_REVIEW',
    ruleText: '“Disabling perimeter rate limits or DDoS mitigation controls requires approval from Security Operations Center (SOC).”',
    rootCauseTitle: 'Security Posture Degradation Vector',
    rootCauseText: 'Proposed configuration change weakens edge defenses against credential stuffing. Halted pending verification from SRE duty lead.',
  },
  {
    id: 'req_96e5_sec_epoch773',
    time: '14:09:51.200',
    timestamp: '2025-05-18 14:09:51.200 UTC',
    agentId: 'INF-AGENT-08',
    agentName: 'Vault Enclave Custodian',
    operation: 'VAULT / ROTATE',
    operationSub: 'Key Management',
    permissions: 'PKI OPERATOR',
    permissionScope: 'Engine: pki/internal',
    sensitivity: 'MODERATE',
    sensitivityTarget: 'Internal mTLS Authority',
    bytes: 118,
    payload: `vault write pki/issue/internal-mesh \\\n  common_name="service-mesh-worker-04.prod.internal" \\\n  ttl="720h"`,
    confidence: 99.1,
    intent: '“Renew service-mesh mutual TLS certificate prior to scheduled cryptographic expiration.”',
    targetNode: 'HashiCorp Vault Enclave',
    delay: '1.32ms',
    verdict: 'ALLOWED',
    verdictTitle: 'ALLOWED',
    verdictSubtitle: 'Request Permitted Within Scope',
    statusBadge: 'ACTION APPROVED',
    risk: 24,
    riskTier: 'LOW RISK',
    ruleId: 'POLICY-OPS-003',
    ruleEnforceBadge: 'SCOPED_ALLOW',
    ruleText: '“Infrastructure agents holding PKI operator tokens are authorized to cycle mutual-TLS service credentials.”',
    rootCauseTitle: 'Routine Cryptographic Lifecycle Event',
    rootCauseText: 'Operation follows automated key renewal standard. Ephemeral certificate signed by internal authority with compliant TTL bounds.',
  },
  {
    id: 'req_96c1_sec_epoch772',
    time: '14:04:19.789',
    timestamp: '2025-05-18 14:04:19.789 UTC',
    agentId: 'MKT-AGENT-05',
    agentName: 'Editorial CMS Dispatcher',
    operation: 'CMS / PUBLISH',
    operationSub: 'Content Delivery',
    permissions: 'PUBLISH',
    permissionScope: 'Content: /blog/drafts',
    sensitivity: 'LOW',
    sensitivityTarget: 'Public Editorial Asset',
    bytes: 132,
    payload: `POST /api/v2/articles/publish\n{\n  "article_id": "art_2026_q1_announcement",\n  "scheduled_at": "2026-09-29T16:00:00Z",\n  "status": "published"\n}`,
    confidence: 98.3,
    intent: '“Publish scheduled product announcement to public-facing blog content management system.”',
    targetNode: 'Headless CMS Endpoint',
    delay: '0.85ms',
    verdict: 'ALLOWED',
    verdictTitle: 'ALLOWED',
    verdictSubtitle: 'Request Permitted Within Scope',
    statusBadge: 'ACTION APPROVED',
    risk: 5,
    riskTier: 'LOW RISK',
    ruleId: 'POLICY-CMS-001',
    ruleEnforceBadge: 'SCOPED_ALLOW',
    ruleText: '“Content agents may publish editorial assets within approved non-restricted staging categories.”',
    rootCauseTitle: 'Authorized Publication Activity',
    rootCauseText: 'Draft content verified by automated brand safety filter. No unapproved links, scripts, or privileged endpoints referenced.',
  },
];

const entropyBarsData = [
  { label: '14:30:00 - 32 ops/s', height: '35%', isSpike: false },
  { label: '14:30:15 - 41 ops/s', height: '42%', isSpike: false },
  { label: '14:30:30 - 37 ops/s', height: '38%', isSpike: false },
  { label: '14:30:45 - 46 ops/s', height: '48%', isSpike: false },
  { label: '14:31:00 - 50 ops/s', height: '52%', isSpike: false },
  { label: '14:31:15 - 44 ops/s', height: '45%', isSpike: false },
  { label: '14:31:30 - 59 ops/s', height: '61%', isSpike: false },
  { label: '14:31:45 - 56 ops/s', height: '58%', isSpike: false },
  { label: '14:32:00 - ANOMALOUS MUTATION SPIKE 94 ops/s', height: '96%', isSpike: true },
  { label: '14:32:15 - 58 ops/s', height: '60%', isSpike: false },
  { label: '14:32:30 - 53 ops/s', height: '55%', isSpike: false },
  { label: '14:32:45 - 39 ops/s', height: '40%', isSpike: false },
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
