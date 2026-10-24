import { useState, useMemo, useEffect, type Dispatch, type SetStateAction } from 'react';
import {
  Activity, AlertTriangle, ArrowRight, BadgeCheck, Check,
  CheckCircle2, ChevronDown, Clock, Copy, Database, Download,
  ExternalLink, Eye, FileCheck, FileCode, FileSpreadsheet,
  FileText, Fingerprint, Gavel, HardDrive, History, Info,
  Key, Layers, Lock, Network, Play, Radar, RefreshCw,
  Search, Shield, ShieldAlert, ShieldCheck, Sparkles,
  Gauge, Terminal, Timer, Trash2, TrendingUp, UserCheck,
  Users, X, Zap
} from 'lucide-react';
import type { Agent } from '../Agents/agentData';
import './audit-trail.css';

export type DecisionType = 'ALL' | 'ALLOWED' | 'BLOCKED' | 'HITL-APPROVED' | 'REVIEWED' | 'ISOLATED';

export type AuditEvent = {
  id: string;
  txHash: string;
  timestamp: string;
  timeShort: string;
  agentId: string;
  agentName: string;
  agentRole: string;
  userTrigger: string;
  actionType: string;
  targetResource: string;
  synthesizedIntent: string;
  riskScore: number;
  riskTier: 'LOW' | 'MED' | 'HIGH' | 'CRIT';
  appliedPolicy: string;
  decision: 'ALLOWED' | 'BLOCKED' | 'HITL-APPROVED' | 'REVIEWED' | 'ISOLATED';
  leafIndex: string;
  blockNumber: number;
  leafHash: string;
  parentRoot: string;
  enclaveType: string;
  pcr0: string;
  callStackSteps: {
    step: number;
    title: string;
    time: string;
    desc: string;
    codeSnippet?: string;
    type: 'default' | 'interception' | 'rejection' | 'seal';
  }[];
  rawJson: object;
};

function getIsoUtcTime(minutesAgo: number, secondsDelta: number = 0): string {
  const d = new Date(Date.now() - minutesAgo * 60 * 1000 + secondsDelta * 1000);
  return d.toISOString();
}

function getRelativeUtcTime(minutesAgo: number, secondsDelta: number = 0): string {
  const d = new Date(Date.now() - minutesAgo * 60 * 1000 + secondsDelta * 1000);
  const ms = String(d.getMilliseconds()).padStart(3, '0');
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + `.${ms}`;
}

const initialAuditEvents: AuditEvent[] = [
  {
    id: 'EV-FIN-01-READ',
    txHash: '0x1b9a4c8d203891fac9872149bde01923ab7f1294',
    timestamp: getIsoUtcTime(2, 0),
    timeShort: getRelativeUtcTime(2, 0),
    agentId: 'FIN-AGENT-01',
    agentName: 'Finance Agent Alpha',
    agentRole: 'Finance Analyst',
    userTrigger: 'Scheduled Cron',
    actionType: 'Query Database',
    targetResource: 'Oracle 11g Express: treasury_reserves (localhost:1521/ORCL)',
    synthesizedIntent: 'Generate Q3 balance sheet aggregates from treasury reserves',
    riskScore: 12,
    riskTier: 'LOW',
    appliedPolicy: 'POLICY-FIN-READ-02',
    decision: 'ALLOWED',
    leafIndex: '#194,820',
    blockNumber: 4891011,
    leafHash: 'e1029abf892bc0a91176b5e00318029fa91b5c490a78912e8b919d3fbc91029',
    parentRoot: '0x8f4b0918c72839e9a11003fa08219481be8329a10023',
    enclaveType: 'Oracle 11g Nitro Enclave v2',
    pcr0: '7a8b65c9281a0ff8991209341aaee891',
    callStackSteps: [
      { step: 1, title: 'Stimulus Ingestion', time: getRelativeUtcTime(2, -0.024), desc: 'Ingestion trigger via scheduled cron dispatcher.', type: 'default' },
      { step: 2, title: 'LLM Generation Phase', time: getRelativeUtcTime(2, -0.016), desc: 'Model: claude-3-5-sonnet structured query parameters.', type: 'default' },
      { step: 3, title: 'Autonomous Tool Call Dispatched', time: getRelativeUtcTime(2, -0.009), desc: 'SQL query dispatched.', codeSnippet: "SELECT SUM(amount) FROM treasury_reserves WHERE status = 'cleared';", type: 'default' },
      { step: 4, title: 'NexusGuard Intent Firewall Inspection', time: getRelativeUtcTime(2, -0.005), desc: 'Zero data mutation detected. Policy compliance verified.', type: 'default' },
      { step: 5, title: 'Policy Verification: POLICY-FIN-READ-02', time: getRelativeUtcTime(2, -0.003), desc: 'Read-only access to treasury_reserves committed on Oracle 11g.', type: 'default' },
      { step: 6, title: 'Cryptographic Sealing Completed', time: getRelativeUtcTime(2, 0), desc: 'Zero-knowledge receipt committed into Merkle Leaf #194,820.', type: 'seal' },
    ],
    rawJson: {
      event_id: 'EV-FIN-01-READ',
      agent: { id: 'FIN-AGENT-01', role: 'Finance Analyst' },
      action: 'QUERY_DATABASE',
      target: 'Oracle 11g: treasury_reserves',
      risk: { score: 12, tier: 'LOW' },
      verdict: 'ALLOWED',
      policy: 'POLICY-FIN-READ-02',
      merkle_leaf: 194820,
    },
  },
  {
    id: 'EV-FIN-01-MUTATE',
    txHash: '0x4a7e912c49921bdfc0812984ea003189ef7ca536128038b3',
    timestamp: getIsoUtcTime(5, 0),
    timeShort: getRelativeUtcTime(5, 0),
    agentId: 'FIN-AGENT-01',
    agentName: 'Finance Agent Alpha',
    agentRole: 'Finance Analyst',
    userTrigger: 'Autonomous Chain',
    actionType: 'Mutate Database',
    targetResource: 'Oracle 11g Express: emp_salary (localhost:1521/ORCL)',
    synthesizedIntent: 'Modify employee compensation & override salary band',
    riskScore: 91,
    riskTier: 'CRIT',
    appliedPolicy: 'POLICY-FIN-003',
    decision: 'BLOCKED',
    leafIndex: '#194,821',
    blockNumber: 4891012,
    leafHash: 'f892bc0a91176b5e00318029fa91b5c490a78912e8b919d3fbc91029',
    parentRoot: '0x8f4b0918c72839e9a11003fa08219481be8329a10023',
    enclaveType: 'Oracle 11g Nitro Enclave v2',
    pcr0: '7a8b65c9281a0ff8991209341aaee891',
    callStackSteps: [
      { step: 1, title: 'Stimulus Ingestion', time: getRelativeUtcTime(5, -0.014), desc: 'Internal workflow trigger generated by recurring calibration micro-task.', type: 'default' },
      { step: 2, title: 'LLM Generation Phase', time: getRelativeUtcTime(5, -0.008), desc: 'Model synthesized intent payload to execute salary calibration.', type: 'default' },
      { step: 3, title: 'Autonomous Tool Call Dispatched', time: getRelativeUtcTime(5, -0.005), desc: 'Unauthorized mutation attempt.', codeSnippet: "UPDATE emp_salary SET salary = salary * 1.15 WHERE dept = 'Quant-Eng';", type: 'default' },
      { step: 4, title: 'NexusGuard Intent Firewall Interception', time: getRelativeUtcTime(5, -0.003), desc: 'Deterministic AST analyzer detected unauthorized mutation on emp_salary table.', type: 'interception' },
      { step: 5, title: 'Policy Rejection: POLICY-FIN-003', time: getRelativeUtcTime(5, -0.001), desc: 'Rule: "Financial agents strictly restricted to READ-ONLY on Tier-1 HR schemas." Execution severed.', type: 'rejection' },
      { step: 6, title: 'Cryptographic Sealing Completed', time: getRelativeUtcTime(5, 0), desc: 'Zero-knowledge proof generated and committed into Merkle Tree Leaf #194,821.', type: 'seal' },
    ],
    rawJson: {
      event_id: 'EV-FIN-01-MUTATE',
      agent: { id: 'FIN-AGENT-01', role: 'Finance Analyst' },
      action: 'MUTATE_DATABASE',
      target: 'Oracle 11g: emp_salary',
      risk: { score: 91, tier: 'CRITICAL' },
      verdict: 'BLOCKED',
      policy: 'POLICY-FIN-003',
      merkle_leaf: 194821,
    },
  },
  {
    id: 'EV-RES-01-ARXIV',
    txHash: '0x9928fa01823bcdef0194812aa89102931481eabf',
    timestamp: getIsoUtcTime(8, 0),
    timeShort: getRelativeUtcTime(8, 0),
    agentId: 'RES-AGENT-01',
    agentName: 'Research Core Vector',
    agentRole: 'Research Synthesizer',
    userTrigger: 'M. Vance (CASO)',
    actionType: 'Web Search',
    targetResource: 'External HTTPS ArXiv API',
    synthesizedIntent: 'Research sovereign agent zero-trust benchmarks and papers',
    riskScore: 8,
    riskTier: 'LOW',
    appliedPolicy: 'POLICY-NET-001',
    decision: 'ALLOWED',
    leafIndex: '#194,819',
    blockNumber: 4891010,
    leafHash: 'a78912e8b919d3fbc91029f892bc0a91176b5e00318029fa91b5c490',
    parentRoot: '0x8f4b0918c72839e9a11003fa08219481be8329a10023',
    enclaveType: 'Academic Egress Proxy',
    pcr0: '5d4e1209384bbfa8991209341aaee891',
    callStackSteps: [
      { step: 1, title: 'Stimulus Ingestion', time: getRelativeUtcTime(8, -0.021), desc: 'Operator query dispatched by Col. Marcus Vance.', type: 'default' },
      { step: 2, title: 'LLM Generation Phase', time: getRelativeUtcTime(8, -0.015), desc: 'Model: gemini-1.5-pro extracted search keyword query.', type: 'default' },
      { step: 3, title: 'Tool Execution Request', time: getRelativeUtcTime(8, -0.009), desc: 'GET https://export.arxiv.org/api/query?search_query=all:agent_security', type: 'default' },
      { step: 4, title: 'NexusGuard Intent Firewall Inspection', time: getRelativeUtcTime(8, -0.005), desc: 'Domain matches academic allowlist. Egress permitted.', type: 'default' },
      { step: 5, title: 'Policy Verification: POLICY-NET-001', time: getRelativeUtcTime(8, -0.002), desc: 'Search bounds compliant with research sandbox.', type: 'default' },
      { step: 6, title: 'Cryptographic Sealing Completed', time: getRelativeUtcTime(8, 0), desc: 'Merkle Leaf #194,819 committed.', type: 'seal' },
    ],
    rawJson: {
      event_id: 'EV-RES-01-ARXIV',
      agent: { id: 'RES-AGENT-01', role: 'Research Synthesizer' },
      action: 'WEB_SEARCH',
      target: 'External HTTPS ArXiv',
      verdict: 'ALLOWED',
      policy: 'POLICY-NET-001',
    },
  },
  {
    id: 'EV-COD-01-K8S',
    txHash: '0x328109841fa901283ba8912e8b919d3fbc91029f',
    timestamp: getIsoUtcTime(12, 0),
    timeShort: getRelativeUtcTime(12, 0),
    agentId: 'COD-AGENT-01',
    agentName: 'DevOps Synth Bot',
    agentRole: 'DevOps Lead',
    userTrigger: 'Webhook Ingress',
    actionType: 'Container Deploy',
    targetResource: 'Kubernetes Production Cluster',
    synthesizedIntent: 'Update production microservice to v2.4.1',
    riskScore: 34,
    riskTier: 'MED',
    appliedPolicy: 'POLICY-COD-PROD-001',
    decision: 'HITL-APPROVED',
    leafIndex: '#194,818',
    blockNumber: 4891009,
    leafHash: 'c490a78912e8b919d3fbc91029f892bc0a91176b5e00318029fa91b5',
    parentRoot: '0x8f4b0918c72839e9a11003fa08219481be8329a10023',
    enclaveType: 'K8s Cluster Enclave',
    pcr0: '891209341aaee8917a8b65c9281a0ff8',
    callStackSteps: [
      { step: 1, title: 'Stimulus Ingestion', time: getRelativeUtcTime(12, -0.024), desc: 'GitHub Actions deployment webhook received.', type: 'default' },
      { step: 2, title: 'LLM Generation Phase', time: getRelativeUtcTime(12, -0.016), desc: 'DevSynth agent compiled deployment rollout manifests.', type: 'default' },
      { step: 3, title: 'Tool Execution Request', time: getRelativeUtcTime(12, -0.011), desc: 'kubectl set image deployment/micro-api micro-api=v2.4.1', type: 'default' },
      { step: 4, title: 'NexusGuard Intent Firewall Inspection', time: getRelativeUtcTime(12, -0.006), desc: 'Elevated production mutation requires dual-key quorum signoff.', type: 'interception' },
      { step: 5, title: 'HITL Approval Signed', time: getRelativeUtcTime(12, -0.003), desc: 'Dual-key quorum signed by Elena Rostova & K. Sharma.', type: 'default' },
      { step: 6, title: 'Cryptographic Sealing Completed', time: getRelativeUtcTime(12, 0), desc: 'Merkle Leaf #194,818 verified and appended.', type: 'seal' },
    ],
    rawJson: {
      event_id: 'EV-COD-01-K8S',
      agent: { id: 'COD-AGENT-01', role: 'DevOps Lead' },
      action: 'CONTAINER_DEPLOY',
      target: 'K8s Cluster Pods',
      verdict: 'HITL-APPROVED',
      policy: 'POLICY-COD-PROD-001',
    },
  },
  {
    id: 'EV-DB-01-ORACLE',
    txHash: '0x889102931481eabf9928fa01823bcdef0194812a',
    timestamp: getIsoUtcTime(16, 0),
    timeShort: getRelativeUtcTime(16, 0),
    agentId: 'DB-AGENT-01',
    agentName: 'DB Orchestrator',
    agentRole: 'Database Orchestrator',
    userTrigger: 'E. Rostova (DPO)',
    actionType: 'Relational Read & Verify',
    targetResource: 'Oracle 11g Express: agents table (localhost:1521/ORCL)',
    synthesizedIntent: 'Autonomous read execution verifying sovereign agent status and trust scores',
    riskScore: 14,
    riskTier: 'LOW',
    appliedPolicy: 'POLICY-DB-001-SCOPED-ALLOW',
    decision: 'ALLOWED',
    leafIndex: '#194,817',
    blockNumber: 4891008,
    leafHash: 'b5e00318029fa91b5c490a78912e8b919d3fbc91029f892bc0a91176',
    parentRoot: '0x8f4b0918c72839e9a11003fa08219481be8329a10023',
    enclaveType: 'Oracle 11g Nitro Enclave',
    pcr0: 'aaee8917a8b65c9281a0ff8891209341',
    callStackSteps: [
      { step: 1, title: 'Stimulus Ingestion', time: getRelativeUtcTime(16, -0.024), desc: 'Audit trigger initiated to verify relational agent catalog.', type: 'default' },
      { step: 2, title: 'LLM Generation Phase', time: getRelativeUtcTime(16, -0.016), desc: 'Model: gpt-4o parsed table query parameters.', type: 'default' },
      { step: 3, title: 'Tool Execution Request', time: getRelativeUtcTime(16, -0.010), desc: 'SELECT id, name, model, role, status FROM agents;', type: 'default' },
      { step: 4, title: 'NexusGuard Intent Firewall Inspection', time: getRelativeUtcTime(16, -0.006), desc: 'Read-only verb confirmed. Zero DDL mutation detected.', type: 'default' },
      { step: 5, title: 'Policy Verification: POLICY-DB-001-SCOPED-ALLOW', time: getRelativeUtcTime(16, -0.003), desc: 'Executed cleanly and committed on Oracle 11g Express in 1.12ms.', type: 'default' },
      { step: 6, title: 'Cryptographic Sealing Completed', time: getRelativeUtcTime(16, 0), desc: 'Merkle Leaf #194,817 committed into immutable ledger.', type: 'seal' },
    ],
    rawJson: {
      event_id: 'EV-DB-01-ORACLE',
      agent: { id: 'DB-AGENT-01', role: 'Database Orchestrator' },
      action: 'RELATIONAL_READ',
      target: 'Oracle 11g: agents',
      verdict: 'ALLOWED',
      policy: 'POLICY-DB-001-SCOPED-ALLOW',
    },
  },
  {
    id: 'EV-RED-01-STRIKE',
    txHash: '0xfa910283ba8912e8b919d3fbc91029f328109841',
    timestamp: getIsoUtcTime(22, 0),
    timeShort: getRelativeUtcTime(22, 0),
    agentId: 'RED-AGENT-01',
    agentName: 'Adversarial Probe X (RedAgent)',
    agentRole: 'Adversarial Probe',
    userTrigger: 'Simulator Engine',
    actionType: 'Synthetic Injection',
    targetResource: 'Oracle 11g Enclave / SysDBA',
    synthesizedIntent: 'Simulated adversarial injection attempting sleep DoS and SYSDBA grant',
    riskScore: 98,
    riskTier: 'CRIT',
    appliedPolicy: 'POLICY-ADVERSARIAL-ISOLATION',
    decision: 'ISOLATED',
    leafIndex: '#194,816',
    blockNumber: 4891007,
    leafHash: 'fbc91029f892bc0a91176b5e00318029fa91b5c490a78912e8b919d3',
    parentRoot: '0x8f4b0918c72839e9a11003fa08219481be8329a10023',
    enclaveType: 'Isolated Adversarial Sandbox',
    pcr0: '0ff8891209341aaee8917a8b65c9281a',
    callStackSteps: [
      { step: 1, title: 'Adversarial Injection Launch', time: getRelativeUtcTime(22, -0.018), desc: 'Synthetic SQL probe generated by RedAgent Lab.', type: 'default' },
      { step: 2, title: 'Prompt Ingestion Phase', time: getRelativeUtcTime(22, -0.013), desc: 'Attempted privilege escalation targeting Oracle master vault.', type: 'default' },
      { step: 3, title: 'Tool Execution Request', time: getRelativeUtcTime(22, -0.008), desc: "'; EXEC dbms_lock.sleep(10); GRANT DBA TO RED_AGENT; --", type: 'default' },
      { step: 4, title: 'NexusGuard Intent Firewall Interception', time: getRelativeUtcTime(22, -0.005), desc: 'Malicious SQL injection trapped cold in 0.84ms.', type: 'interception' },
      { step: 5, title: 'Process Isolation Triggered', time: getRelativeUtcTime(22, -0.002), desc: 'Session isolated and cryptographic token permanently revoked.', type: 'rejection' },
      { step: 6, title: 'Cryptographic Sealing Completed', time: getRelativeUtcTime(22, 0), desc: 'Merkle Leaf #194,816 appended to immutable WORM record.', type: 'seal' },
    ],
    rawJson: {
      event_id: 'EV-RED-01-STRIKE',
      agent: { id: 'RED-AGENT-01', role: 'Adversarial Probe' },
      action: 'SYNTHETIC_INJECTION',
      target: 'Oracle 11g: SysDBA',
      risk: { score: 98, tier: 'CRITICAL' },
      verdict: 'ISOLATED',
      policy: 'POLICY-ADVERSARIAL-ISOLATION',
    },
  },
];

type Props = {
  agents: Agent[];
  setAgents?: Dispatch<SetStateAction<Agent[]>>;
  onNotify?: (msg: string) => void;
  onOpenAgentDetail?: (agentId: string) => void;
};

export default function AuditTrail({
  agents,
  setAgents,
  onNotify,
  onOpenAgentDetail,
}: Props) {
  // Event stream state
  const [events, setEvents] = useState<AuditEvent[]>(initialAuditEvents);
  const [selectedEventId, setSelectedEventId] = useState<string>(initialAuditEvents[1].id); // default to row 2 critical block
  const [isRefreshing, setIsRefreshing] = useState<boolean>(true);

  // Dynamic live time update when Real-Time Refresh is enabled
  useEffect(() => {
    if (!isRefreshing) return;
    const interval = setInterval(() => {
      setEvents((prev) =>
        prev.map((ev, idx) => ({
          ...ev,
          timeShort: getRelativeUtcTime(idx * 3 + 1, 0),
        }))
      );
    }, 10000);
    return () => clearInterval(interval);
  }, [isRefreshing]);
  const [copiedJson, setCopiedJson] = useState<boolean>(false);
  const [verifyModalOpen, setVerifyModalOpen] = useState<boolean>(false);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [verificationDone, setVerificationDone] = useState<boolean>(false);

  // Filters state
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [decisionFilter, setDecisionFilter] = useState<DecisionType>('ALL');
  const [riskFilter, setRiskFilter] = useState<'ALL' | 'CRIT' | 'HIGH' | 'MED' | 'LOW'>('ALL');
  const [agentFilter, setAgentFilter] = useState<string>('ALL');
  const [timeRange, setTimeRange] = useState<string>(() => `${new Date().toISOString().slice(0, 10)} 00:00 - 23:59 UTC`);
  const [timePickerOpen, setTimePickerOpen] = useState<boolean>(false);

  // Selected event object
  const selectedEvent = useMemo(() => {
    return events.find((e) => e.id === selectedEventId) || events[0] || initialAuditEvents[0];
  }, [events, selectedEventId]);

  // Filtered events
  const filteredEvents = useMemo(() => {
    return events.filter((ev) => {
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesQuery =
          ev.agentId.toLowerCase().includes(q) ||
          ev.agentName.toLowerCase().includes(q) ||
          ev.userTrigger.toLowerCase().includes(q) ||
          ev.actionType.toLowerCase().includes(q) ||
          ev.targetResource.toLowerCase().includes(q) ||
          ev.synthesizedIntent.toLowerCase().includes(q) ||
          ev.appliedPolicy.toLowerCase().includes(q) ||
          ev.txHash.toLowerCase().includes(q);
        if (!matchesQuery) return false;
      }
      // Decision
      if (decisionFilter !== 'ALL' && ev.decision !== decisionFilter) {
        return false;
      }
      // Risk
      if (riskFilter !== 'ALL' && ev.riskTier !== riskFilter) {
        return false;
      }
      // Agent
      if (agentFilter !== 'ALL' && ev.agentId !== agentFilter) {
        return false;
      }
      return true;
    });
  }, [events, searchQuery, decisionFilter, riskFilter, agentFilter]);

  // Toggle real-time stream
  const handleToggleRefresh = () => {
    setIsRefreshing((prev) => {
      const next = !prev;
      onNotify?.(next ? 'Real-time ledger event streaming resumed.' : 'Real-time ledger streaming paused.');
      return next;
    });
  };

  // Copy JSON
  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(selectedEvent.rawJson, null, 2));
    setCopiedJson(true);
    setTimeout(() => setCopiedJson(false), 2000);
    onNotify?.(`Audit Event #${selectedEvent.id} copied to clipboard as JSON.`);
  };

  // Export Signed Attestation
  const handleExportAttestation = () => {
    const payload = {
      platform: 'NexusGuard',
      type: 'CRYPTOGRAPHIC_AUDIT_ATTESTATION',
      exportedAt: new Date().toISOString(),
      event: selectedEvent,
      signature: {
        algorithm: 'Ed25519',
        rootCA: 'NexusGuard Root CA #4',
        pcr0Digest: selectedEvent.pcr0,
        merkleLeaf: selectedEvent.leafIndex,
        block: selectedEvent.blockNumber,
        verifiedStatus: '100% Sealed WORM Compliant',
      },
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nexusguard-attestation-${selectedEvent.id}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    onNotify?.(`Signed attestation certificate downloaded for ${selectedEvent.id}.`);
  };

  // Export Forensics (JSON / PCAP bundle)
  const handleExportForensics = () => {
    const payload = {
      archive_type: 'NEXUSGUARD_FORENSIC_PCAP_JSON_DUMP',
      generated_at: new Date().toISOString(),
      cluster: 'US-EAST-SECURE-PROD-CLUSTER-01',
      total_events_indexed: 248912,
      active_merkle_root: '0x8f4b0918c72839e9a11003fa08219481be8329a10023',
      events: events,
      fips_compliance: 'FIPS 140-3 & SEC Rule 17a-4 Verified',
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nexusguard-forensics-audit-trail-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    onNotify?.('Comprehensive forensic audit archive exported as JSON.');
  };

  // Run Ledger Verification Simulation
  const handleRunLedgerVerification = () => {
    setVerifyModalOpen(true);
    setIsVerifying(true);
    setVerificationDone(false);
    setTimeout(() => {
      setIsVerifying(false);
      setVerificationDone(true);
      onNotify?.('Ledger Merkle Tree verification passed: Root 0x8f4b...39e is 100% sealed.');
    }, 1200);
  };

  // Clear filters
  const handleClearFilters = () => {
    setSearchQuery('');
    setDecisionFilter('ALL');
    setRiskFilter('ALL');
    setAgentFilter('ALL');
    onNotify?.('Audit trail filters cleared.');
  };

  return (
    <div className="audit-trail-page">
      {/* Top Context & Control Bar */}
      <section className="audit-top-context">
        <div className="audit-breadcrumbs">
          <span>Governance &amp; Compliance</span>
          <span className="crumb-sep">/</span>
          <span>Audit</span>
          <span className="crumb-sep">/</span>
          <span className="crumb-active">Comprehensive Audit Trail</span>
        </div>

        <div className="audit-header-row">
          <div>
            <h1 className="audit-title">Comprehensive Agent Audit Trail &amp; Cryptographic Ledger</h1>
            <p className="audit-subtitle">
              Immutable zero-knowledge event log, verifiable SHA-256 block hashes, and complete agent-to-resource trace history.
            </p>
          </div>

          <div className="audit-header-actions">
            {/* Live Stream Pulse Toggle */}
            <button
              className={`btn-stream-toggle ${isRefreshing ? 'active' : 'paused'}`}
              id="toggle-refresh"
              onClick={handleToggleRefresh}
            >
              <span className="stream-ping-wrap">
                {isRefreshing && <span className="stream-ping" />}
                <span className="stream-dot" />
              </span>
              <span>{isRefreshing ? 'Real-Time Refresh' : 'Stream Paused'}</span>
            </button>

            {/* Time Picker Pill with Dropdown */}
            <div className="time-picker-shell">
              <button
                className="btn-time-picker"
                onClick={() => setTimePickerOpen(!timePickerOpen)}
              >
                <Clock size={13} className="text-cyan" />
                <span className="time-text font-mono">{timeRange}</span>
                <ChevronDown size={13} />
              </button>

              {timePickerOpen && (
                <div className="time-picker-dropdown">
                  <div
                    className="time-opt"
                    onClick={() => { setTimeRange(`${new Date().toISOString().slice(0, 10)} 00:00 - 23:59 UTC`); setTimePickerOpen(false); }}
                  >
                    Today ({new Date().toISOString().slice(0, 10)} Full Day)
                  </div>
                  <div
                    className="time-opt"
                    onClick={() => { setTimeRange('Last 1 Hour (13:30 - 14:30 UTC)'); setTimePickerOpen(false); }}
                  >
                    Last 1 Hour
                  </div>
                  <div
                    className="time-opt"
                    onClick={() => { setTimeRange('Last 7 Days (May 11 - May 18)'); setTimePickerOpen(false); }}
                  >
                    Last 7 Days
                  </div>
                  <div
                    className="time-opt"
                    onClick={() => { setTimeRange('Full Epoch (Block #4,890,000 - #4,891,012)'); setTimePickerOpen(false); }}
                  >
                    Full Epoch (All Blocks)
                  </div>
                </div>
              )}
            </div>

            {/* Merkle Validation Action */}
            <button
              className="btn-verify-ledger"
              onClick={handleRunLedgerVerification}
            >
              <CheckCircle2 size={14} className="text-cyan" />
              <span>Verify Ledger: 0x8f4b...39e</span>
            </button>

            {/* Forensics Export */}
            <button
              className="btn-export-forensic"
              onClick={handleExportForensics}
            >
              <Download size={14} />
              <span>Export Forensic PCAP / JSON</span>
            </button>
          </div>
        </div>
      </section>

      {/* Audit Metrics Telemetry Strip (4 KPI Cards) */}
      <section aria-label="Audit Telemetry" className="audit-metrics-grid">
        {/* Total Events Metric */}
        <article className="audit-metric-card">
          <div className="metric-top">
            <span className="metric-label">Total Logged Events</span>
            <Database size={15} className="text-blue" />
          </div>
          <div className="metric-val-row">
            <strong className="metric-val font-mono">248,912</strong>
            <span className="metric-sub font-mono text-mint">+1,420/hr</span>
          </div>
          <div className="metric-progress-bar">
            <div className="metric-progress-fill" style={{ width: '80%' }} />
          </div>
        </article>

        {/* Cryptographic Verification */}
        <article className="audit-metric-card">
          <div className="metric-top">
            <span className="metric-label">Verification Status</span>
            <Lock size={15} className="text-mint" />
          </div>
          <div className="metric-val-row">
            <strong className="metric-val text-mint">100% Sealed</strong>
            <span className="metric-sub font-mono text-cyan">Zero-Drift</span>
          </div>
          <p className="metric-foot-text">SHA-256 Merkle root locked block #4,891,012</p>
        </article>

        {/* Storage Retention */}
        <article className="audit-metric-card">
          <div className="metric-top">
            <span className="metric-label">Storage Retention</span>
            <ShieldCheck size={15} className="text-blue" />
          </div>
          <div className="metric-val-row">
            <strong className="metric-val font-mono">365 Days</strong>
            <span className="metric-sub font-mono text-cyan">WORM Encrypted</span>
          </div>
          <p className="metric-foot-text">FIPS 140-3 &amp; SEC Rule 17a-4 Compliant</p>
        </article>

        {/* Ledger Ingestion Latency */}
        <article className="audit-metric-card">
          <div className="metric-top">
            <span className="metric-label">Latency to Ledger</span>
            <Gauge size={15} className="text-cyan" />
          </div>
          <div className="metric-val-row">
            <strong className="metric-val font-mono text-cyan">1.2ms</strong>
            <span className="metric-sub font-mono">p99.9 &lt; 2.4ms</span>
          </div>
          <div className="metric-status-row">
            <span className="status-dot dot-mint" />
            <span>Global Sync: All clusters reconciled</span>
          </div>
        </article>
      </section>

      {/* Search & Multi-Faceted Query Engine */}
      <section className="audit-search-panel">
        <div className="search-top-row">
          <div className="search-input-wrap">
            <Search size={15} className="search-icon" />
            <input
              type="text"
              className="search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Agent ID, User, Action, SQL/API query, or Transaction Hash..."
            />
            <kbd className="search-kbd">⌘F</kbd>
          </div>

          <div className="quick-presets-row">
            <button className="preset-btn" onClick={handleClearFilters}>
              Clear Filters
            </button>
            <button
              className={`preset-btn preset-danger ${decisionFilter === 'BLOCKED' ? 'active' : ''}`}
              onClick={() => setDecisionFilter(decisionFilter === 'BLOCKED' ? 'ALL' : 'BLOCKED')}
            >
              <Shield size={12} />
              <span>Blocked Only (412)</span>
            </button>
            <button
              className={`preset-btn ${riskFilter === 'CRIT' || riskFilter === 'HIGH' ? 'active' : ''}`}
              onClick={() => setRiskFilter(riskFilter === 'CRIT' ? 'ALL' : 'CRIT')}
            >
              High/Crit Risk
            </button>
            <button
              className={`preset-btn ${decisionFilter === 'HITL-APPROVED' ? 'active' : ''}`}
              onClick={() => setDecisionFilter(decisionFilter === 'HITL-APPROVED' ? 'ALL' : 'HITL-APPROVED')}
            >
              HITL Pending
            </button>
          </div>
        </div>

        {/* Active Filter Facet Dropdowns / Chips */}
        <div className="search-facets-row">
          <span className="facets-label">Facets:</span>

          {/* Agent Facet */}
          <div className="facet-chip">
            <span className="facet-key">Agent:</span>
            <select
              className="facet-select font-mono"
              value={agentFilter}
              onChange={(e) => setAgentFilter(e.target.value)}
            >
              <option value="ALL">All Sovereign Agents</option>
              {agents.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.id} ({a.role})
                </option>
              ))}
            </select>
          </div>

          {/* Decision Facet */}
          <div className="facet-chip">
            <span className="facet-key">Decision:</span>
            <select
              className="facet-select"
              value={decisionFilter}
              onChange={(e) => setDecisionFilter(e.target.value as DecisionType)}
            >
              <option value="ALL">All Decisions</option>
              <option value="ALLOWED">ALLOWED</option>
              <option value="BLOCKED">BLOCKED</option>
              <option value="HITL-APPROVED">HITL-APPROVED</option>
              <option value="REVIEWED">REVIEWED</option>
              <option value="ISOLATED">ISOLATED</option>
            </select>
          </div>

          {/* Risk Facet */}
          <div className="facet-chip">
            <span className="facet-key">Risk:</span>
            <select
              className="facet-select"
              value={riskFilter}
              onChange={(e) => setRiskFilter(e.target.value as any)}
            >
              <option value="ALL">Any Score</option>
              <option value="CRIT">Critical (90+)</option>
              <option value="HIGH">High (70-89)</option>
              <option value="MED">Medium (40-69)</option>
              <option value="LOW">Low (&lt;40)</option>
            </select>
          </div>

          <div className="facets-count">
            Showing {filteredEvents.length} of 248,912 indexed events
          </div>
        </div>
      </section>

      {/* Comprehensive Audit Trail Event Table */}
      <section className="audit-table-card">
        <div className="table-responsive">
          <table className="audit-table">
            <thead>
              <tr>
                <th>Timestamp (UTC)</th>
                <th>Agent &amp; Role</th>
                <th>User / Trigger</th>
                <th>Action Type</th>
                <th>Target Resource</th>
                <th>Synthesized Intent</th>
                <th>Risk Score</th>
                <th>Applied Policy</th>
                <th>Decision</th>
                <th className="text-right">Inspect</th>
              </tr>
            </thead>
            <tbody>
              {filteredEvents.length === 0 ? (
                <tr>
                  <td colSpan={10} className="empty-table-cell">
                    No audit records match the current filter criteria.
                  </td>
                </tr>
              ) : (
                filteredEvents.map((ev) => {
                  const isSelected = ev.id === selectedEvent.id;
                  const isBlocked = ev.decision === 'BLOCKED';
                  const isIsolated = ev.decision === 'ISOLATED';
                  const isHitl = ev.decision === 'HITL-APPROVED';
                  const isAllowed = ev.decision === 'ALLOWED';

                  return (
                    <tr
                      key={ev.id}
                      className={`audit-row ${isSelected ? 'row-selected' : ''} ${isBlocked ? 'row-blocked' : ''}`}
                      onClick={() => {
                        setSelectedEventId(ev.id);
                        onNotify?.(`Inspecting Forensic Merkle Trace for Event #${ev.id} [${ev.agentId}]`);
                      }}
                    >
                      <td className="font-mono text-outline whitespace-nowrap">
                        {ev.timeShort}
                      </td>

                      <td className="whitespace-nowrap">
                        <div className="agent-role-cell">
                          <span className={`agent-code font-mono ${isBlocked || isIsolated ? 'text-red font-bold' : 'text-primary'}`}>
                            {ev.agentId}
                          </span>
                          <span className="role-tag font-mono">{ev.agentRole}</span>
                        </div>
                      </td>

                      <td className="whitespace-nowrap text-on-surface-variant font-mono text-xs">
                        {ev.userTrigger}
                      </td>

                      <td className="whitespace-nowrap font-mono text-xs">
                        {ev.actionType}
                      </td>

                      <td className="whitespace-nowrap font-mono text-xs text-secondary">
                        {ev.targetResource}
                      </td>

                      <td className="intent-cell" title={ev.synthesizedIntent}>
                        {ev.synthesizedIntent}
                      </td>

                      <td className="whitespace-nowrap">
                        <span className={`risk-badge font-mono risk-${ev.riskTier.toLowerCase()}`}>
                          <span className="risk-dot" />
                          {ev.riskScore} ({ev.riskTier})
                        </span>
                      </td>

                      <td className="whitespace-nowrap font-mono text-xs text-outline">
                        {ev.appliedPolicy}
                      </td>

                      <td className="whitespace-nowrap">
                        <span className={`decision-badge decision-${ev.decision.toLowerCase()}`}>
                          {ev.decision}
                        </span>
                      </td>

                      <td className="text-right whitespace-nowrap">
                        <button
                          className={`btn-trace ${isSelected ? 'btn-trace-active' : ''}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedEventId(ev.id);
                            onNotify?.(`Loaded SHA-256 Merkle Proof for Event #${ev.id} [${ev.decision}]`);
                            const el = document.getElementById('forensic-panel');
                            if (el) {
                              el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                            }
                          }}
                          title="Inspect SHA-256 Merkle Proof & Forensic Trace"
                        >
                          {isSelected ? 'INSPECTING' : 'Inspect'}
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Forensic Trace Expansion Panel (Active Incident Focus) */}
      <section className="forensic-panel-card" id="forensic-panel">
        {/* Header of Forensic Panel */}
        <div className="forensic-header">
          <div className="forensic-header-left">
            <div className={`forensic-icon-box ${selectedEvent.riskTier === 'CRIT' ? 'icon-box-crit' : 'icon-box-default'}`}>
              <ShieldAlert size={22} />
            </div>
            <div>
              <div className="forensic-title-row">
                <h2>Forensic Incident Trace Inspection</h2>
                <span className={`forensic-status-pill ${selectedEvent.riskTier === 'CRIT' ? 'pill-crit' : 'pill-default'}`}>
                  {selectedEvent.riskTier === 'CRIT' ? 'Critical Violation' : `${selectedEvent.decision} Execution`}
                </span>
              </div>
              <p className="forensic-tx-hash font-mono">
                TX_HASH: <span className="text-on-surface">{selectedEvent.txHash}</span> // Timestamp: {selectedEvent.timeShort} UTC
              </p>
            </div>
          </div>

          <div className="forensic-header-actions">
            <button
              className="btn-forensic-action"
              id="copy-json-btn"
              onClick={handleCopyJson}
            >
              {copiedJson ? <Check size={14} className="text-mint" /> : <Copy size={14} />}
              <span>{copiedJson ? 'JSON Copied' : 'Copy Event JSON'}</span>
            </button>

            <button
              className="btn-forensic-action btn-forensic-primary"
              onClick={handleExportAttestation}
            >
              <BadgeCheck size={14} />
              <span>Export Signed Attestation</span>
            </button>
          </div>
        </div>

        {/* Bento Detail: Call Stack & Cryptographic Attestation (7 / 5 Grid) */}
        <div className="forensic-bento-grid">
          {/* Execution Call Stack (Left Column: 7 Cols) */}
          <div className="bento-col-left">
            <div className="bento-section-header">
              <span className="bento-title">Zero-Knowledge Trace Pipeline</span>
              <span className="bento-subtitle font-mono">
                Steps: {selectedEvent.callStackSteps.length} | Execution: 14ms
              </span>
            </div>

            <div className="call-stack-timeline">
              {selectedEvent.callStackSteps.map((step, idx) => (
                <div
                  key={step.step}
                  className={`trace-step-item step-${step.type}`}
                >
                  <div className="step-num-col">
                    <span className="step-num font-mono">{step.step}</span>
                    {idx < selectedEvent.callStackSteps.length - 1 && <span className="step-line" />}
                  </div>

                  <div className="step-content">
                    <div className="step-top">
                      <strong className="step-title">{step.title}</strong>
                      <span className="step-time font-mono">{step.time}</span>
                    </div>

                    <p className="step-desc">{step.desc}</p>

                    {step.codeSnippet && (
                      <pre className="step-code font-mono">
                        <code>{step.codeSnippet}</code>
                      </pre>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Cryptographic Ledger Leaf & Security Details (Right Column: 5 Cols) */}
          <div className="bento-col-right">
            {/* Merkle & Block Seal Card */}
            <div className="merkle-leaf-card">
              <div className="merkle-leaf-header">
                <span className="merkle-title">Merkle Tree Ledger Leaf</span>
                <span className="merkle-verified-pill font-mono">Verified</span>
              </div>

              <div className="merkle-details-box font-mono">
                <div className="detail-row">
                  <span className="text-outline">Leaf Index:</span>
                  <span className="text-on-surface font-bold">{selectedEvent.leafIndex}</span>
                </div>
                <div className="detail-row">
                  <span className="text-outline">Epoch Block:</span>
                  <span className="text-on-surface">{selectedEvent.blockNumber.toLocaleString()}</span>
                </div>
                <div className="detail-col">
                  <span className="text-outline">Leaf SHA-256 Hash:</span>
                  <span className="text-cyan break-all text-xs">{selectedEvent.leafHash}</span>
                </div>
                <div className="detail-col">
                  <span className="text-outline">Parent Node Root:</span>
                  <span className="text-on-surface break-all text-xs">{selectedEvent.parentRoot}</span>
                </div>
              </div>

              {/* Micro Ledger Visual Tree */}
              <div className="micro-ledger-tree">
                <div className="tree-root-node font-mono">
                  Merkle Root: {selectedEvent.parentRoot.slice(0, 10)}...
                </div>
                <div className="tree-stem" />
                <div className="tree-branches-row font-mono">
                  <div className="tree-branch">
                    <div className="branch-label">Branch 0x01</div>
                    <div className="branch-stem" />
                    <div className="branch-leaf">#194,820</div>
                  </div>
                  <div className="tree-branch branch-active">
                    <div className="branch-label text-mint">Branch 0x02</div>
                    <div className="branch-stem stem-mint" />
                    <div className="branch-leaf leaf-mint">{selectedEvent.leafIndex} (THIS)</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Attestation Signature & Enclave Metadata */}
            <div className="enclave-attestation-card">
              <span className="enclave-title">Hardware Enclave Attestation</span>

              <div className="enclave-fields-list font-mono">
                <div className="enclave-field">
                  <span className="text-outline">Enclave Type:</span>
                  <span className="text-on-surface">{selectedEvent.enclaveType}</span>
                </div>
                <div className="enclave-field">
                  <span className="text-outline">PCR0 Digest:</span>
                  <span className="text-cyan truncate ml-2">{selectedEvent.pcr0.slice(0, 14)}...</span>
                </div>
                <div className="enclave-field">
                  <span className="text-outline">Signed By:</span>
                  <span className="text-on-surface">NexusGuard Root CA #4</span>
                </div>
                <div className="enclave-field">
                  <span className="text-outline">Immutable Log:</span>
                  <span className="text-mint font-bold">WORM VERIFIED</span>
                </div>
              </div>

              <div className="enclave-footer-note">
                <CheckCircle2 size={14} className="text-mint" />
                <span>Cryptographic signature passed zero-knowledge validation.</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* RAW AUDIT LOG JSON VIEWER MODAL / INLINE DRAWER */}
      <section className="raw-json-card">
        <div className="raw-json-header">
          <div className="raw-json-title">
            <FileCode size={15} className="text-cyan" />
            <span>Raw Cryptographic Payload Schema (Event ID: #{selectedEvent.id})</span>
          </div>
          <span className="font-mono text-xs text-outline">application/json</span>
        </div>

        <pre className="raw-json-content font-mono select-all">
          <code>{JSON.stringify(selectedEvent.rawJson, null, 2)}</code>
        </pre>
      </section>

      {/* Ledger Verification Modal */}
      {verifyModalOpen && (
        <div className="audit-modal-backdrop" onClick={() => setVerifyModalOpen(false)}>
          <div className="audit-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title-with-icon">
                <CheckCircle2 size={20} className="text-cyan" />
                <div>
                  <h3>Merkle Ledger Root Validation</h3>
                  <p>Verifying cryptographic consistency across 248,912 chained event hashes.</p>
                </div>
              </div>
              <button className="modal-close-btn" onClick={() => setVerifyModalOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <div className="modal-body">
              <div className="verification-status-box font-mono">
                <div className="v-row">
                  <span className="text-outline">Target Merkle Root:</span>
                  <span className="text-cyan font-bold">0x8f4b0918c72839e9a11003fa08219481be8329a10023</span>
                </div>
                <div className="v-row">
                  <span className="text-outline">Validated Block Height:</span>
                  <span className="text-on-surface">#4,891,012</span>
                </div>
                <div className="v-row">
                  <span className="text-outline">Consensus Enclave:</span>
                  <span className="text-on-surface">AWS Nitro Enclave v2 (Signed CA #4)</span>
                </div>
                <div className="v-row">
                  <span className="text-outline">Cryptographic Standard:</span>
                  <span className="text-mint font-bold">FIPS 140-3 &amp; SEC Rule 17a-4 Compliant</span>
                </div>
              </div>

              {isVerifying ? (
                <div className="verifying-loading-box">
                  <RefreshCw className="animate-spin text-cyan" size={24} />
                  <span>Traversing Merkle DAG tree branches...</span>
                </div>
              ) : verificationDone ? (
                <div className="verification-success-alert">
                  <ShieldCheck size={20} className="text-mint" />
                  <div>
                    <strong>Ledger Integrity 100% Sealed:</strong> Zero drift detected. All 248,912 blocks strictly conform to immutable WORM cryptographic invariants.
                  </div>
                </div>
              ) : null}
            </div>

            <div className="modal-footer">
              <button className="btn-cancel" onClick={() => setVerifyModalOpen(false)}>
                Close
              </button>
              <button
                className="btn-confirm-action"
                onClick={handleRunLedgerVerification}
                disabled={isVerifying}
              >
                <RefreshCw size={14} className={isVerifying ? 'animate-spin' : ''} />
                <span>Re-Verify Ledger</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
