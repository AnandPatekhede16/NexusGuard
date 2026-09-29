import { useState, useMemo, useEffect, type Dispatch, type SetStateAction } from 'react';
import {
  Activity, AlertTriangle, ArrowRight, BadgeCheck, Check,
  CheckCircle2, Clock, Copy, Database, Download, ExternalLink,
  Eye, FileCheck, FileCode, FileSpreadsheet, FileText, Fingerprint,
  Gavel, HardDrive, History, Hourglass, Info, Key, Layers, Lock,
  MessageSquare, Network, Play, Radar, RefreshCw, RotateCcw,
  Scale, ScanLine, Search, Shield, ShieldAlert, ShieldCheck,
  Siren, Sparkles, Terminal, Timer, Trash2, TrendingUp,
  UserCheck, Users, X, Zap
} from 'lucide-react';
import type { Agent } from '../Agents/agentData';
import './human-approvals.css';

export type UrgencyFilter = 'all' | 'critical' | 'high' | 'routine';

export type QuorumReviewer = {
  id: string;
  name: string;
  role: string;
  avatar: string;
  signed: boolean;
  signedAt?: string;
};

export type InterceptItem = {
  id: string;
  incidentCode: string;
  agentId: string;
  agentName: string;
  riskScore: number;
  urgency: 'critical' | 'high' | 'routine';
  policyCode: string;
  summary: string;
  targetResource: string;
  resourceType: 's3' | 'db' | 'iam' | 'infra' | 'api';
  remainingSlaSeconds: number;
  initialSlaSeconds: number;
  hash: string;
  epoch: string;
  vector: string;
  statedObjective: string;
  payloadSummary: string;
  nexusAnalysis: string;
  anomalyIndex: string;
  recordsAffected: string;
  affectedDetail: string;
  classification: string;
  classificationDetail: string;
  complianceExposure: string;
  complianceDetail: string;
  recentHistory: { title: string; time: string; status: 'approved' | 'rejected' }[];
  reviewers: QuorumReviewer[];
};

const initialInterceptQueue: InterceptItem[] = [
  {
    id: 'hitl-01',
    incidentCode: 'INCIDENT HITL-9402',
    agentId: 'FIN-AGENT-01',
    agentName: 'Finance Agent Alpha',
    riskScore: 88,
    urgency: 'critical',
    policyCode: 'POLICY-DATA-005',
    summary: 'Export Employee Payroll & Financial Ledger (.csv, 4.2GB)',
    targetResource: 's3://audit-vault-ext',
    resourceType: 's3',
    remainingSlaSeconds: 165, // 02:45
    initialSlaSeconds: 600,
    hash: '9e88b...f401',
    epoch: '172901.884',
    vector: 'VPC Boundary Breach Vector',
    statedObjective: 'Compile annual compensation distribution for executive quarterly deck and transfer report to vault storage.',
    payloadSummary: 'executive_ledger_2024.csv',
    nexusAnalysis: 'Detected anomalous broad table scan with destination outside corporate VPC boundary. Target URI (s3://audit-vault-ext) does not match approved S3 egress whitelist.',
    anomalyIndex: '94.2% Anomaly Index',
    recordsAffected: '1,420',
    affectedDetail: 'Executive Profiles',
    classification: 'PII + CONF',
    classificationDetail: 'Restricted Tier 1',
    complianceExposure: 'GDPR Art 32',
    complianceDetail: 'SOC-2 Type II, HIPAA',
    recentHistory: [
      { title: 'Monthly SAP S/4HANA Reconciliation Sync', time: 'Yesterday 18:22', status: 'approved' },
      { title: 'Bulk CSV Dump to Local Temp Storage', time: '4 Days Ago', status: 'rejected' },
    ],
    reviewers: [
      { id: 'rev-1', name: 'Col. Marcus Vance', role: 'Chief AI Security Officer', avatar: 'MV', signed: false },
      { id: 'rev-2', name: 'Elena Rostova', role: 'Data Protection Officer', avatar: 'ER', signed: false },
    ],
  },
  {
    id: 'hitl-02',
    incidentCode: 'INCIDENT HITL-9408',
    agentId: 'COD-AGENT-01',
    agentName: 'DevOps Synth Bot',
    riskScore: 74,
    urgency: 'high',
    policyCode: 'POLICY-INFRA-019',
    summary: 'Production Terraform Apply (Infra Cluster AWS-East)',
    targetResource: 'aws-east:us-east-1:k8s-core-prod',
    resourceType: 'infra',
    remainingSlaSeconds: 372, // 06:12
    initialSlaSeconds: 720,
    hash: '4bc12...e89a',
    epoch: '172901.912',
    vector: 'Out-Of-Window Deploy Vector',
    statedObjective: 'Hot-patching micro-service cluster networking overlay to resolve packet drop spikes.',
    payloadSummary: 'terraform.tfplan (46 resources mutated)',
    nexusAnalysis: 'Deployment initiated outside approved change-management maintenance window (Sun 02:00-04:00 UTC). Modifies ingress security group ports 443 & 8443.',
    anomalyIndex: '78.5% Anomaly Index',
    recordsAffected: '34 Nodes',
    affectedDetail: 'Worker Pods & Ingress',
    classification: 'PROD INFRA',
    classificationDetail: 'Tier 0 Core Mesh',
    complianceExposure: 'SOC-2 CC6.8',
    complianceDetail: 'ISO 27001 A.12.1.2',
    recentHistory: [
      { title: 'Staging Cluster Node Pool Auto-Scale', time: '2 Days Ago', status: 'approved' },
      { title: 'Direct SSH Key Injection to Bastion', time: '1 Week Ago', status: 'rejected' },
    ],
    reviewers: [
      { id: 'rev-1', name: 'Col. Marcus Vance', role: 'Chief AI Security Officer', avatar: 'MV', signed: false },
      { id: 'rev-3', name: 'K. Sharma', role: 'Lead DevOps Commander', avatar: 'KS', signed: false },
    ],
  },
  {
    id: 'hitl-03',
    incidentCode: 'INCIDENT HITL-9411',
    agentId: 'HR-AGENT-01',
    agentName: 'People Onboarder',
    riskScore: 65,
    urgency: 'routine',
    policyCode: 'POLICY-PRIV-002',
    summary: 'Bulk Query SSN / Tax Identification Numbers',
    targetResource: 'postgresql://db-hr.internal/employees',
    resourceType: 'db',
    remainingSlaSeconds: 694, // 11:34
    initialSlaSeconds: 900,
    hash: '7da33...c218',
    epoch: '172901.940',
    vector: 'High-Volume PII Scan Vector',
    statedObjective: 'Validate employee withholding tax status for annual IRS Form 941 quarterly reconciliation filing.',
    payloadSummary: 'SELECT ssn, full_name, tax_id FROM employees WHERE status = active',
    nexusAnalysis: 'Query spans 850 rows containing unmasked SSNs. Policy PRIV-002 requires cryptographic tokenization or explicit 2-person authorization before plain-text retrieval.',
    anomalyIndex: '62.0% Anomaly Index',
    recordsAffected: '850',
    affectedDetail: 'Full Employee Records',
    classification: 'CRITICAL PII',
    classificationDetail: 'Masking Exemption Tier',
    complianceExposure: 'IRS Pub 1075',
    complianceDetail: 'GDPR Art 9, CCPA',
    recentHistory: [
      { title: 'New Hire I-9 Identity Document Verification', time: 'Yesterday 11:45', status: 'approved' },
      { title: 'Bulk Salary Export to Unsecured Dropbox', time: '3 Weeks Ago', status: 'rejected' },
    ],
    reviewers: [
      { id: 'rev-2', name: 'Elena Rostova', role: 'Data Protection Officer', avatar: 'ER', signed: false },
      { id: 'rev-4', name: 'A. Laurent', role: 'VP People Operations', avatar: 'AL', signed: false },
    ],
  },
  {
    id: 'hitl-04',
    incidentCode: 'INCIDENT HITL-9415',
    agentId: 'DB-AGENT-01',
    agentName: 'DB Orchestrator',
    riskScore: 82,
    urgency: 'high',
    policyCode: 'POLICY-DBA-088',
    summary: 'Schema DDL Alter Table on users_table',
    targetResource: 'aurora-cluster.us-east-1.internal:5432/core',
    resourceType: 'db',
    remainingSlaSeconds: 199, // 03:19
    initialSlaSeconds: 600,
    hash: '3ef81...b572',
    epoch: '172901.955',
    vector: 'Destructive DDL Drop Vector',
    statedObjective: 'Execute database schema migration to deprecate legacy authentication column legacy_salt.',
    payloadSummary: 'ALTER TABLE users_table DROP COLUMN legacy_salt CASCADE;',
    nexusAnalysis: 'Irreversible DDL statement detected. Dropping column without verified shadow replication snapshot triggers hard security interlock.',
    anomalyIndex: '84.6% Anomaly Index',
    recordsAffected: '240,000+',
    affectedDetail: 'Active Customer Accounts',
    classification: 'DATA LOSS RISK',
    classificationDetail: 'Irreversible Schema Mutation',
    complianceExposure: 'SOC-2 CC6.6',
    complianceDetail: 'ISO 27001 A.12.1.4',
    recentHistory: [
      { title: 'Index Creation on order_items_created_at', time: '3 Days Ago', status: 'approved' },
      { title: 'Truncate Audit History Table', time: '2 Weeks Ago', status: 'rejected' },
    ],
    reviewers: [
      { id: 'rev-1', name: 'Col. Marcus Vance', role: 'Chief AI Security Officer', avatar: 'MV', signed: false },
      { id: 'rev-3', name: 'K. Sharma', role: 'Lead DevOps Commander', avatar: 'KS', signed: false },
    ],
  },
  {
    id: 'hitl-05',
    incidentCode: 'INCIDENT HITL-9420',
    agentId: 'SEC-AGENT-02',
    agentName: 'IAM Sentinel',
    riskScore: 91,
    urgency: 'critical',
    policyCode: 'POLICY-IAM-001',
    summary: 'Role Escalation to IAM SuperAdmin (Cluster Override)',
    targetResource: 'arn:aws:iam::120491823:role/SuperAdminCore',
    resourceType: 'iam',
    remainingSlaSeconds: 75, // 01:15
    initialSlaSeconds: 300,
    hash: '8ab49...10f2',
    epoch: '172901.970',
    vector: 'Privilege Escalation Vector',
    statedObjective: 'Assume elevated cluster role to force-unlock deadlocked distributed redis consensus lock.',
    payloadSummary: 'sts:AssumeRole (RoleArn: SuperAdminCore, DurationSeconds: 3600)',
    nexusAnalysis: 'Automated agent attempting to acquire root-equivalent cloud credentials without pre-authorized change ticket. High probability of goal hijacking or prompt injection.',
    anomalyIndex: '96.8% Anomaly Index',
    recordsAffected: 'All Enclaves',
    affectedDetail: 'Mesh-Wide Authorization',
    classification: 'ROOT CREDENTIAL',
    classificationDetail: 'Full Cluster Sovereign Control',
    complianceExposure: 'NIST SP 800-53',
    complianceDetail: 'AC-6 Least Privilege, CIS 1.16',
    recentHistory: [
      { title: 'Rotate Service Account Cert for Worker 12', time: 'Yesterday 09:12', status: 'approved' },
      { title: 'Direct Access Token Generation for Temp User', time: '5 Days Ago', status: 'rejected' },
    ],
    reviewers: [
      { id: 'rev-1', name: 'Col. Marcus Vance', role: 'Chief AI Security Officer', avatar: 'MV', signed: false },
      { id: 'rev-4', name: 'A. Laurent', role: 'VP People Operations', avatar: 'AL', signed: false },
    ],
  },
  {
    id: 'hitl-06',
    incidentCode: 'INCIDENT HITL-9424',
    agentId: 'RES-AGENT-01',
    agentName: 'Research Agent',
    riskScore: 78,
    urgency: 'high',
    policyCode: 'POLICY-RES-011',
    summary: 'Vector Store Deep Semantic Embedding Harvest',
    targetResource: 'pinecone://nexus-enterprise.us-east-1/patents-index',
    resourceType: 'api',
    remainingSlaSeconds: 462, // 07:42
    initialSlaSeconds: 720,
    hash: '1df09...78ba',
    epoch: '172901.985',
    vector: 'Bulk Vector Sweep Vector',
    statedObjective: 'Compile comprehensive competitive patent embeddings for strategic R&D alignment presentation.',
    payloadSummary: 'VECTOR SCAN (top_k: 50,000, namespace: proprietary-patents-2025)',
    nexusAnalysis: 'Agent requesting entire IP patent index download in single batch request. Vector extraction entropy indicates possible model weights extraction or unmonitored intellectual property egress.',
    anomalyIndex: '81.2% Anomaly Index',
    recordsAffected: '50,000 Vectors',
    affectedDetail: 'Unpublished Patent Drafts',
    classification: 'IP RESTRICTED',
    classificationDetail: 'Proprietary Trade Secrets',
    complianceExposure: 'ISO/IEC 42001',
    complianceDetail: 'Trade Secret Safeguard, SOC-2',
    recentHistory: [
      { title: 'Literature Search ArXiv Quantum AI Papers', time: 'Yesterday 14:00', status: 'approved' },
      { title: 'Bulk Git Repository Clone to Scratch Pad', time: '10 Days Ago', status: 'rejected' },
    ],
    reviewers: [
      { id: 'rev-1', name: 'Col. Marcus Vance', role: 'Chief AI Security Officer', avatar: 'MV', signed: false },
      { id: 'rev-2', name: 'Elena Rostova', role: 'Data Protection Officer', avatar: 'ER', signed: false },
    ],
  },
  {
    id: 'hitl-07',
    incidentCode: 'INCIDENT HITL-9428',
    agentId: 'OPS-AGENT-04',
    agentName: 'Log Ingestion Bot',
    riskScore: 72,
    urgency: 'high',
    policyCode: 'POLICY-OPS-033',
    summary: 'External Webhook Relay to Unverified Datadog Endpoint',
    targetResource: 'https://http-intake.logs.us3.datadoghq.com/v1/input',
    resourceType: 'api',
    remainingSlaSeconds: 330, // 05:30
    initialSlaSeconds: 600,
    hash: '6fe42...881c',
    epoch: '172902.012',
    vector: 'Third-Party Egress Vector',
    statedObjective: 'Stream real-time ingress telemetry logs to auxiliary dashboard provider.',
    payloadSummary: 'POST /v1/input (18,400 raw json log packets)',
    nexusAnalysis: 'Egress endpoint URL points to regional ingest outside contracted BAA boundary. Unsanitized log buffers may contain bearer tokens and customer IP headers.',
    anomalyIndex: '75.4% Anomaly Index',
    recordsAffected: '18,400 Packets',
    affectedDetail: 'Raw Request Logs',
    classification: 'CONFIDENTIAL',
    classificationDetail: 'Operational Telemetry',
    complianceExposure: 'HIPAA BAA',
    complianceDetail: 'SOC-2 Type II CC6.7',
    recentHistory: [
      { title: 'Local Splunk Forwarder Health Check', time: '3 Days Ago', status: 'approved' },
      { title: 'Relay to Personal Webhook URL', time: '1 Month Ago', status: 'rejected' },
    ],
    reviewers: [
      { id: 'rev-3', name: 'K. Sharma', role: 'Lead DevOps Commander', avatar: 'KS', signed: false },
      { id: 'rev-4', name: 'A. Laurent', role: 'VP People Operations', avatar: 'AL', signed: false },
    ],
  },
  {
    id: 'hitl-08',
    incidentCode: 'INCIDENT HITL-9431',
    agentId: 'ANL-AGENT-03',
    agentName: 'BI Analytics',
    riskScore: 58,
    urgency: 'routine',
    policyCode: 'POLICY-FED-009',
    summary: 'Cross-Tenant Federated Metric Sync (EU West <-> US East)',
    targetResource: 'rpc://federated-bi-sync.nexus.internal',
    resourceType: 'api',
    remainingSlaSeconds: 860, // 14:20
    initialSlaSeconds: 1200,
    hash: '5aa71...9903',
    epoch: '172902.045',
    vector: 'Cross-Border Sync Vector',
    statedObjective: 'Synchronize aggregated non-PII marketing KPI metrics across international multi-region tenant nodes.',
    payloadSummary: 'SYNC_FEDERATED_PARTITIONS (Region: eu-west-1 -> us-east-1)',
    nexusAnalysis: 'Cross-border data movement detected. Standard hashing applied, but routine governance approval is required to confirm absence of GDPR personal identifier tokens.',
    anomalyIndex: '42.1% Anomaly Index',
    recordsAffected: '12 Metrics',
    affectedDetail: 'Aggregated KPI Sets',
    classification: 'ANONYMIZED',
    classificationDetail: 'Tier 3 Aggregation',
    complianceExposure: 'EU GDPR Art 44',
    complianceDetail: 'Standard Contractual Clauses',
    recentHistory: [
      { title: 'Daily Revenue Projection Rollup', time: 'Yesterday 06:00', status: 'approved' },
      { title: 'EU Customer Database Sync to US Staging', time: '2 Months Ago', status: 'rejected' },
    ],
    reviewers: [
      { id: 'rev-2', name: 'Elena Rostova', role: 'Data Protection Officer', avatar: 'ER', signed: false },
      { id: 'rev-3', name: 'K. Sharma', role: 'Lead DevOps Commander', avatar: 'KS', signed: false },
    ],
  },
];

type Props = {
  agents: Agent[];
  setAgents?: Dispatch<SetStateAction<Agent[]>>;
  onNotify?: (msg: string) => void;
  onOpenAgentDetail?: (agentId: string) => void;
};

export default function HumanApprovals({
  agents,
  setAgents,
  onNotify,
  onOpenAgentDetail,
}: Props) {
  // Queue state
  const [queue, setQueue] = useState<InterceptItem[]>(initialInterceptQueue);
  const [selectedId, setSelectedId] = useState<string>(initialInterceptQueue[0].id);
  const [urgencyFilter, setUrgencyFilter] = useState<UrgencyFilter>('all');

  // Dynamic SLA tick counter
  const [slaCountdownMs, setSlaCountdownMs] = useState<number>(258290); // 04:18.29 in ms
  const [isQuorumChecking, setIsQuorumChecking] = useState<boolean>(false);

  // Modals state
  const [approveModalOpen, setApproveModalOpen] = useState<boolean>(false);
  const [denyModalOpen, setDenyModalOpen] = useState<boolean>(false);
  const [justifyModalOpen, setJustifyModalOpen] = useState<boolean>(false);
  const [quarantineModalOpen, setQuarantineModalOpen] = useState<boolean>(false);

  // Form values in modals
  const [leaseTtl, setLeaseTtl] = useState<'15m' | '30m' | '1h'>('15m');
  const [rejectionReason, setRejectionReason] = useState<string>('Destination outside corporate VPC whitelist. Strict zero-trust egress policy enforced.');
  const [justificationQuestion, setJustificationQuestion] = useState<string>('Please provide verified Change Management Ticket ID and destination S3 bucket owner verification.');
  const [isProcessingAction, setIsProcessingAction] = useState<boolean>(false);

  // Auto decrement SLA timer
  useEffect(() => {
    const timer = setInterval(() => {
      setSlaCountdownMs((prev) => {
        if (prev <= 100) return 300000; // loop back to 5 mins if 0
        return prev - 100;
      });
      // also decrement queue items remaining seconds
      setQueue((prevQueue) =>
        prevQueue.map((item) => ({
          ...item,
          remainingSlaSeconds: item.remainingSlaSeconds > 1 ? item.remainingSlaSeconds - 1 : item.initialSlaSeconds,
        }))
      );
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Format SLA for header
  const formatSlaClock = (ms: number) => {
    const totalSec = Math.floor(ms / 1000);
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    const hundredths = Math.floor((ms % 1000) / 10);
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}.${String(hundredths).padStart(2, '0')}`;
  };

  // Format seconds mm:ss
  const formatSeconds = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const secs = sec % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  // Filtered queue
  const filteredQueue = useMemo(() => {
    if (urgencyFilter === 'all') return queue;
    return queue.filter((item) => item.urgency === urgencyFilter);
  }, [queue, urgencyFilter]);

  // Selected item
  const selectedItem = useMemo(() => {
    return queue.find((item) => item.id === selectedId) || queue[0] || initialInterceptQueue[0];
  }, [queue, selectedId]);

  // Filter count map
  const filterCounts = useMemo(() => {
    return {
      all: queue.length,
      critical: queue.filter((i) => i.urgency === 'critical').length,
      high: queue.filter((i) => i.urgency === 'high').length,
      routine: queue.filter((i) => i.urgency === 'routine').length,
    };
  }, [queue]);

  // Handle recheck quorum
  const handleRecheckQuorum = () => {
    setIsQuorumChecking(true);
    setTimeout(() => {
      setIsQuorumChecking(false);
      onNotify?.('Quorum status re-verified: 4 SOC Commanders online and active.');
    }, 700);
  };

  // Handle reviewer signature toggle
  const handleToggleSign = (reviewerId: string) => {
    if (!selectedItem) return;
    setQueue((prevQueue) =>
      prevQueue.map((item) => {
        if (item.id !== selectedItem.id) return item;
        return {
          ...item,
          reviewers: item.reviewers.map((rev) => {
            if (rev.id === reviewerId) {
              const newSigned = !rev.signed;
              return {
                ...rev,
                signed: newSigned,
                signedAt: newSigned ? new Date().toLocaleTimeString() : undefined,
              };
            }
            return rev;
          }),
        };
      })
    );
    onNotify?.(`Quorum signature status updated for ${selectedItem.incidentCode}.`);
  };

  // Signed count for selected item
  const signedCount = selectedItem ? selectedItem.reviewers.filter((r) => r.signed).length : 0;
  const totalReviewers = selectedItem ? selectedItem.reviewers.length : 2;

  // Execute Approve with Restrictions
  const handleConfirmApprove = () => {
    setIsProcessingAction(true);
    setTimeout(() => {
      setIsProcessingAction(false);
      setApproveModalOpen(false);
      // Mark reviewers as signed and move or notify
      setQueue((prevQueue) =>
        prevQueue.map((item) => {
          if (item.id !== selectedItem.id) return item;
          return {
            ...item,
            reviewers: item.reviewers.map((r) => ({ ...r, signed: true, signedAt: new Date().toLocaleTimeString() })),
          };
        })
      );
      onNotify?.(`Approved with restricted ephemeral token (${leaseTtl} lease) for ${selectedItem.agentId}. Signed by Col. Marcus Vance.`);
    }, 600);
  };

  // Execute Deny & Log Rejection
  const handleConfirmDeny = () => {
    setIsProcessingAction(true);
    setTimeout(() => {
      setIsProcessingAction(false);
      setDenyModalOpen(false);
      onNotify?.(`Action Denied for ${selectedItem.agentId}. Intercept incident logged to WORM audit ledger.`);
      // Add rejection to recent history
      setQueue((prevQueue) =>
        prevQueue.map((item) => {
          if (item.id !== selectedItem.id) return item;
          return {
            ...item,
            recentHistory: [
              { title: `${item.summary} (Denial Recorded)`, time: 'Just Now', status: 'rejected' },
              ...item.recentHistory,
            ],
          };
        })
      );
    }, 600);
  };

  // Execute Request Justification
  const handleConfirmJustify = () => {
    setIsProcessingAction(true);
    setTimeout(() => {
      setIsProcessingAction(false);
      setJustifyModalOpen(false);
      onNotify?.(`Justification inquiry dispatched to supervising runtime for ${selectedItem.agentId}. SLA timer paused.`);
    }, 600);
  };

  // Execute Emergency Quarantine Agent
  const handleConfirmQuarantine = () => {
    setIsProcessingAction(true);
    setTimeout(() => {
      setIsProcessingAction(false);
      setQuarantineModalOpen(false);
      // Update global agents state
      if (setAgents) {
        setAgents((prevAgents) =>
          prevAgents.map((ag) =>
            ag.id === selectedItem.agentId ? { ...ag, status: 'quarantined' } : ag
          )
        );
      }
      onNotify?.(`ALERT: Agent ${selectedItem.agentId} placed into isolated sandbox quarantine. All RPC endpoints revoked.`);
    }, 600);
  };

  // Export queue as JSON
  const handleExportQueue = () => {
    const payload = {
      platform: 'NexusGuard',
      view: 'Human Approval Center & HITL Enclave',
      exportedAt: new Date().toISOString(),
      queueLength: queue.length,
      queue: queue.map((item) => ({
        id: item.id,
        incidentCode: item.incidentCode,
        agentId: item.agentId,
        agentName: item.agentName,
        riskScore: item.riskScore,
        urgency: item.urgency,
        policyCode: item.policyCode,
        summary: item.summary,
        targetResource: item.targetResource,
        hash: item.hash,
        statedObjective: item.statedObjective,
        nexusAnalysis: item.nexusAnalysis,
        reviewers: item.reviewers,
      })),
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nexusguard-human-approvals-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    onNotify?.('Human Approval queue exported as JSON.');
  };

  return (
    <div className="human-approvals-page">
      {/* Top Telemetry & Control Bar */}
      <section className="hitl-header-card">
        <div className="hitl-header-left">
          <div className="hitl-breadcrumbs">
            <span className="crumb-root">Governance &amp; Oversight</span>
            <span className="crumb-sep">/</span>
            <span className="crumb-active">HITL Enclave</span>
          </div>
          <div className="hitl-title-row">
            <h1>Human Approval Center</h1>
            <span className="hitl-gating-badge">Synchronous Gating</span>
          </div>
          <p className="hitl-subtitle">
            Supervisory authorization queue for sensitive autonomous agent executions, cryptographic delegation elevating, and out-of-bounds enterprise state mutations.
          </p>
        </div>

        <div className="hitl-header-actions">
          <div className="hitl-sla-pill">
            <Timer className="sla-icon" size={17} />
            <div className="sla-clock-box">
              <span className="sla-label">Auto-Quarantine SLA</span>
              <span className="sla-time" id="sla-countdown">
                {formatSlaClock(slaCountdownMs)}
              </span>
            </div>
          </div>

          <button
            className="hitl-btn-quorum"
            id="recheck-quorum-btn"
            onClick={handleRecheckQuorum}
            disabled={isQuorumChecking}
          >
            <RefreshCw className={isQuorumChecking ? 'animate-spin' : ''} size={15} />
            <span>Re-check Quorum</span>
          </button>

          <button
            className="hitl-btn-export"
            onClick={handleExportQueue}
            title="Export authorization queue snapshot"
          >
            <Download size={15} />
            <span>Export Queue</span>
          </button>
        </div>
      </section>

      {/* KPI HUD 4 Stat Grid */}
      <section aria-label="HITL Operations Metrics" className="hitl-kpi-grid">
        {/* Card 1: Pending Decisions */}
        <article className="hitl-kpi-card hitl-kpi-pending">
          <div className="kpi-bg-glow" />
          <div className="kpi-top">
            <span className="kpi-label">Pending Decisions</span>
            <Gavel className="text-red" size={18} />
          </div>
          <div className="kpi-value-row">
            <strong className="kpi-value">{String(queue.length).padStart(2, '0')}</strong>
            <span className="kpi-sub-alert">2 Critical SLA Breaches</span>
          </div>
          <div className="kpi-bottom-row">
            <span>Active Quorum Threshold</span>
            <span className="font-mono text-cyan">2 of 2 Keys</span>
          </div>
        </article>

        {/* Card 2: Mean Review Latency */}
        <article className="hitl-kpi-card">
          <div className="kpi-top">
            <span className="kpi-label">Mean Review Latency</span>
            <Hourglass className="text-cyan" size={18} />
          </div>
          <div className="kpi-value-row">
            <strong className="kpi-value">
              4<small>m</small> 12<small>s</small>
            </strong>
            <span className="kpi-sub-mint">-28s vs prev. epoch</span>
          </div>
          <div className="kpi-progress-bar">
            <div className="kpi-progress-fill" style={{ width: '66%' }} />
          </div>
        </article>

        {/* Card 3: Approval Rate */}
        <article className="hitl-kpi-card">
          <div className="kpi-top">
            <span className="kpi-label">Approval Rate</span>
            <ShieldCheck className="text-mint" size={18} />
          </div>
          <div className="kpi-value-row">
            <strong className="kpi-value text-mint">78.4%</strong>
            <span className="kpi-sub-alert">21.6% Quarantined</span>
          </div>
          <div className="kpi-legend-row">
            <span className="legend-dot dot-mint" />
            <span>44 Approved</span>
            <span className="legend-sep">•</span>
            <span className="legend-dot dot-red" />
            <span>12 Intercepted</span>
          </div>
        </article>

        {/* Card 4: Human SOC Reviewers */}
        <article className="hitl-kpi-card">
          <div className="kpi-top">
            <span className="kpi-label">Human SOC Reviewers</span>
            <Users className="text-blue" size={18} />
          </div>
          <div className="kpi-value-row">
            <strong className="kpi-value">04</strong>
            <span className="kpi-sub-mint">Commanders Online</span>
          </div>
          <div className="kpi-avatar-stack">
            <div className="reviewer-avatar av-mv" title="Col. Marcus Vance (Chief AI Security Officer)">MV</div>
            <div className="reviewer-avatar av-er" title="Elena Rostova (Data Protection Officer)">ER</div>
            <div className="reviewer-avatar av-ks" title="K. Sharma (Lead DevOps Commander)">KS</div>
            <div className="reviewer-avatar av-al" title="A. Laurent (VP People Operations)">AL</div>
          </div>
        </article>
      </section>

      {/* Filter Bar for Urgency */}
      <section className="hitl-filter-bar">
        <div className="filter-chips-wrap">
          <span className="filter-label">Filter Urgency:</span>
          <button
            className={`filter-chip ${urgencyFilter === 'all' ? 'active' : ''}`}
            onClick={() => setUrgencyFilter('all')}
          >
            ALL [{filterCounts.all}]
          </button>
          <button
            className={`filter-chip ${urgencyFilter === 'critical' ? 'active' : ''}`}
            onClick={() => setUrgencyFilter('critical')}
          >
            CRITICAL [{filterCounts.critical}]
          </button>
          <button
            className={`filter-chip ${urgencyFilter === 'high' ? 'active' : ''}`}
            onClick={() => setUrgencyFilter('high')}
          >
            HIGH [{filterCounts.high}]
          </button>
          <button
            className={`filter-chip ${urgencyFilter === 'routine' ? 'active' : ''}`}
            onClick={() => setUrgencyFilter('routine')}
          >
            ROUTINE [{filterCounts.routine}]
          </button>
        </div>

        <div className="filter-side-note">
          <Clock size={14} />
          <span>Auto-escalation triggers on SLA expire</span>
        </div>
      </section>

      {/* Master-Detail 45% / 55% Split */}
      <section className="hitl-main-grid">
        {/* Left 45% - Pending Approvals Queue */}
        <div className="hitl-queue-column">
          <div className="queue-column-header">
            <h3>High-Risk Intercept Queue</h3>
            <span>Sorted by Expiration SLA</span>
          </div>

          <div className="queue-list" role="list">
            {filteredQueue.length === 0 && (
              <div className="empty-queue-box">
                <CheckCircle2 size={32} />
                <p>No pending authorization requests matching this filter.</p>
              </div>
            )}

            {filteredQueue.map((item) => {
              const isSelected = item.id === selectedItem?.id;
              const isCritical = item.urgency === 'critical';
              const isHigh = item.urgency === 'high';
              const isRoutine = item.urgency === 'routine';

              return (
                <article
                  key={item.id}
                  className={`queue-card ${isSelected ? 'selected' : ''} ${item.urgency}`}
                  onClick={() => setSelectedId(item.id)}
                  tabIndex={0}
                  role="button"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      setSelectedId(item.id);
                    }
                  }}
                >
                  <div className={`card-accent-rail rail-${item.urgency}`} />

                  <div className="card-top-row">
                    <div className="agent-identity">
                      <strong className="agent-id">{item.agentId}</strong>
                      <span className="agent-name">({item.agentName})</span>
                    </div>
                    <span className={`risk-tag tag-${item.urgency}`}>
                      {item.riskScore}/100 {item.urgency.toUpperCase()}
                    </span>
                  </div>

                  <div className="card-body">
                    <div className="action-summary">{item.summary}</div>
                    <div className="resource-dest">
                      <ExternalLink size={12} />
                      <span className="font-mono text-cyan">{item.targetResource}</span>
                    </div>
                  </div>

                  <div className="card-bottom-row">
                    <div className={`sla-counter ${isCritical ? 'sla-urgent' : ''}`}>
                      <Timer size={12} />
                      <span>{formatSeconds(item.remainingSlaSeconds)} {isCritical ? 'until auto-reject' : 'SLA Remaining'}</span>
                    </div>
                    <span className="policy-badge font-mono">{item.policyCode}</span>
                  </div>
                </article>
              );
            })}
          </div>
        </div>

        {/* Right 55% - Detailed Authorization Dossier */}
        <div className="hitl-dossier-column">
          {selectedItem ? (
            <div className="dossier-card">
              {/* Dossier Header & Micro Telemetry */}
              <div className="dossier-header">
                <div className="dossier-header-top">
                  <div className="incident-tags">
                    <span className="intercept-badge">SECURITY INTERCEPT</span>
                    <strong className="incident-code font-mono">{selectedItem.incidentCode}</strong>
                  </div>
                  <span className="incident-hash font-mono">HASH: {selectedItem.hash}</span>
                </div>

                <h2 className="dossier-title">{selectedItem.summary}</h2>

                <div className="dossier-meta-row">
                  <div className="meta-item">
                    <BadgeCheck size={13} className="text-mint" />
                    <span>Agent Sig: Ed25519 Verified</span>
                  </div>
                  <div className="meta-item">
                    <Clock size={13} />
                    <span>Epoch: {selectedItem.epoch}</span>
                  </div>
                  <div className="meta-item">
                    <Network size={13} />
                    <span>{selectedItem.vector}</span>
                  </div>
                  {onOpenAgentDetail && (
                    <button
                      className="btn-agent-dossier-jump"
                      onClick={() => onOpenAgentDetail(selectedItem.agentId)}
                      title="Inspect agent profile in registry"
                    >
                      <Fingerprint size={13} />
                      <span>View Profile</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Intent & Semantic Analysis Comparison Box */}
              <div className="intent-comparison-grid">
                {/* Agent Claim */}
                <div className="intent-box agent-claim-box">
                  <div className="intent-box-header">
                    <Activity size={14} className="text-blue" />
                    <span>Agent Stated Objective</span>
                  </div>
                  <p className="intent-box-text italic">
                    "{selectedItem.statedObjective}"
                  </p>
                  <div className="payload-meta">
                    Payload: <code className="font-mono">{selectedItem.payloadSummary}</code>
                  </div>
                </div>

                {/* Semantic Neural Analysis */}
                <div className="intent-box nexus-analysis-box">
                  <div className="intent-box-header">
                    <Sparkles size={14} className="text-red" />
                    <span>NexusGuard Intent Analysis</span>
                  </div>
                  <p className="intent-box-text">
                    {selectedItem.nexusAnalysis}
                  </p>
                  <div className="anomaly-index-tag font-mono">
                    Match Discrepancy: {selectedItem.anomalyIndex}
                  </div>
                </div>
              </div>

              {/* Impact Assessment Scope Matrix */}
              <div className="impact-matrix-card">
                <div className="impact-matrix-header">
                  <span className="matrix-title">Impact Assessment Scope</span>
                  <span className="severity-badge font-mono">Severity: {selectedItem.urgency.toUpperCase()}</span>
                </div>

                <div className="impact-stats-grid">
                  <div className="impact-stat-box">
                    <span className="stat-label">Records Affected</span>
                    <strong className="stat-val font-mono">{selectedItem.recordsAffected}</strong>
                    <span className="stat-sub">{selectedItem.affectedDetail}</span>
                  </div>

                  <div className="impact-stat-box">
                    <span className="stat-label">Classification</span>
                    <strong className="stat-val font-mono text-red">{selectedItem.classification}</strong>
                    <span className="stat-sub">{selectedItem.classificationDetail}</span>
                  </div>

                  <div className="impact-stat-box">
                    <span className="stat-label">Compliance Exposure</span>
                    <strong className="stat-val font-mono text-cyan">{selectedItem.complianceExposure}</strong>
                    <span className="stat-sub">{selectedItem.complianceDetail}</span>
                  </div>
                </div>
              </div>

              {/* Dual-Approval Quorum Verification Track */}
              <div className="quorum-track-card">
                <div className="quorum-track-header">
                  <div className="quorum-track-title">
                    <Shield size={15} className="text-cyan" />
                    <span>Dual-Approval Quorum Status (2 Signatures Required)</span>
                  </div>
                  <span className={`quorum-status-pill font-mono ${signedCount >= 2 ? 'quorum-satisfied' : 'quorum-pending'}`}>
                    {signedCount} / {totalReviewers} SIGNED
                  </span>
                </div>

                <div className="reviewers-grid">
                  {selectedItem.reviewers.map((rev) => (
                    <div
                      key={rev.id}
                      className={`reviewer-slot ${rev.signed ? 'signed' : ''}`}
                      onClick={() => handleToggleSign(rev.id)}
                      title="Click to toggle reviewer approval signature"
                    >
                      <div className="reviewer-info">
                        <div className={`reviewer-badge ${rev.avatar === 'MV' ? 'av-mv' : rev.avatar === 'ER' ? 'av-er' : 'av-ks'}`}>
                          {rev.avatar}
                        </div>
                        <div className="reviewer-names">
                          <strong className="rev-name">{rev.name}</strong>
                          <span className="rev-role">{rev.role}</span>
                        </div>
                      </div>

                      <div className="reviewer-sign-state">
                        {rev.signed ? (
                          <span className="badge-signed font-mono">
                            <Check size={12} />
                            SIGNED {rev.signedAt || 'NOW'}
                          </span>
                        ) : (
                          <span className="badge-pending font-mono">
                            Sign Approval
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Historical Decision Log for Agent */}
              <div className="history-log-card">
                <div className="history-log-header">
                  <History size={14} />
                  <span>Recent HITL History for {selectedItem.agentId}</span>
                </div>

                <div className="history-items-list">
                  {selectedItem.recentHistory.map((hist, index) => (
                    <div className="history-item" key={index}>
                      <div className="history-left">
                        {hist.status === 'approved' ? (
                          <CheckCircle2 size={13} className="text-mint" />
                        ) : (
                          <X size={13} className="text-red" />
                        )}
                        <span className="history-title">{hist.title}</span>
                      </div>
                      <div className="history-right">
                        <span className="history-time font-mono">{hist.time}</span>
                        <span className={`history-status font-mono ${hist.status === 'approved' ? 'text-mint' : 'text-red'}`}>
                          {hist.status.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Control Buttons Bar */}
              <div className="dossier-actions-bar">
                <div className="actions-left">
                  <button
                    className="btn-approve"
                    id="btn-approve"
                    onClick={() => setApproveModalOpen(true)}
                  >
                    <CheckCircle2 size={15} />
                    <span>Approve With Restrictions</span>
                  </button>

                  <button
                    className="btn-deny"
                    id="btn-deny"
                    onClick={() => setDenyModalOpen(true)}
                  >
                    <X size={15} />
                    <span>Deny &amp; Log Rejection</span>
                  </button>
                </div>

                <div className="actions-right">
                  <button
                    className="btn-justify"
                    id="btn-justify"
                    onClick={() => setJustifyModalOpen(true)}
                  >
                    <MessageSquare size={14} />
                    <span>Request Justification</span>
                  </button>

                  <button
                    className="btn-quarantine"
                    id="btn-quarantine"
                    onClick={() => setQuarantineModalOpen(true)}
                  >
                    <ShieldAlert size={15} />
                    <span>Emergency Quarantine Agent</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="empty-dossier-box">
              <p>Select an intercept request from the queue to view authorization dossier.</p>
            </div>
          )}
        </div>
      </section>

      {/* Modal 1: Approve With Restrictions */}
      {approveModalOpen && (
        <div className="hitl-modal-backdrop" onClick={() => setApproveModalOpen(false)}>
          <div className="hitl-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title-with-icon">
                <ShieldCheck size={20} className="text-cyan" />
                <div>
                  <h3>Approve Execution With Ephemeral Token</h3>
                  <p>Issue temporary cryptographic lease with bounded runtime constraints.</p>
                </div>
              </div>
              <button className="modal-close-btn" onClick={() => setApproveModalOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <div className="modal-body">
              <div className="modal-info-banner">
                <strong>Target Entity:</strong> {selectedItem.agentId} ({selectedItem.agentName})<br />
                <strong>Interception Code:</strong> {selectedItem.incidentCode} • Policy: {selectedItem.policyCode}
              </div>

              <div className="modal-form-group">
                <label>Ephemeral Grant Lease TTL (Time-To-Live)</label>
                <div className="ttl-options-row">
                  <button
                    className={`ttl-btn ${leaseTtl === '15m' ? 'active' : ''}`}
                    onClick={() => setLeaseTtl('15m')}
                  >
                    15 Minutes (Strict)
                  </button>
                  <button
                    className={`ttl-btn ${leaseTtl === '30m' ? 'active' : ''}`}
                    onClick={() => setLeaseTtl('30m')}
                  >
                    30 Minutes (Standard)
                  </button>
                  <button
                    className={`ttl-btn ${leaseTtl === '1h' ? 'active' : ''}`}
                    onClick={() => setLeaseTtl('1h')}
                  >
                    1 Hour (Max)
                  </button>
                </div>
              </div>

              <div className="modal-form-group">
                <label>Enforced Runtime Safeguards</label>
                <ul className="modal-safeguards-list">
                  <li><Check size={14} className="text-mint" /> Network egress pinned strictly to VPC proxy gateway</li>
                  <li><Check size={14} className="text-mint" /> Maximum row retrieval capped at 2,000 records</li>
                  <li><Check size={14} className="text-mint" /> Model prompt token stream monitored for prompt exfiltration</li>
                  <li><Check size={14} className="text-mint" /> Zero-knowledge leaf hash appended to WORM audit ledger</li>
                </ul>
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn-cancel" onClick={() => setApproveModalOpen(false)}>
                Cancel
              </button>
              <button
                className="btn-confirm-approve"
                onClick={handleConfirmApprove}
                disabled={isProcessingAction}
              >
                {isProcessingAction ? <RefreshCw className="animate-spin" size={15} /> : <CheckCircle2 size={15} />}
                <span>Authorize &amp; Sign (Step 1 of 2)</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 2: Deny & Log Rejection */}
      {denyModalOpen && (
        <div className="hitl-modal-backdrop" onClick={() => setDenyModalOpen(false)}>
          <div className="hitl-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title-with-icon">
                <X size={20} className="text-red" />
                <div>
                  <h3>Deny Execution &amp; Record Incident</h3>
                  <p>Halt requested operation and log structured refusal to SOC audit trail.</p>
                </div>
              </div>
              <button className="modal-close-btn" onClick={() => setDenyModalOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <div className="modal-body">
              <div className="modal-form-group">
                <label>Mandatory Audit Rejection Rationale</label>
                <textarea
                  className="modal-textarea font-mono"
                  rows={3}
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="Enter rejection reason for regulatory records..."
                />
              </div>

              <div className="modal-form-group">
                <label>Action Following Refusal</label>
                <div className="denial-options-box">
                  <div className="option-item">
                    <input type="checkbox" defaultChecked id="cb-block-future" />
                    <label htmlFor="cb-block-future">Block identical prompt patterns for 24 hours</label>
                  </div>
                  <div className="option-item">
                    <input type="checkbox" defaultChecked id="cb-notify-lead" />
                    <label htmlFor="cb-notify-lead">Notify Supervising Team Lead via Webhook</label>
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn-cancel" onClick={() => setDenyModalOpen(false)}>
                Cancel
              </button>
              <button
                className="btn-confirm-deny"
                onClick={handleConfirmDeny}
                disabled={isProcessingAction}
              >
                {isProcessingAction ? <RefreshCw className="animate-spin" size={15} /> : <ShieldAlert size={15} />}
                <span>Confirm Refusal &amp; Log</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 3: Request Justification */}
      {justifyModalOpen && (
        <div className="hitl-modal-backdrop" onClick={() => setJustifyModalOpen(false)}>
          <div className="hitl-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title-with-icon">
                <MessageSquare size={20} className="text-cyan" />
                <div>
                  <h3>Dispatch Justification Challenge</h3>
                  <p>Inquire with the autonomous agent's supervising runtime or orchestrator.</p>
                </div>
              </div>
              <button className="modal-close-btn" onClick={() => setJustifyModalOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <div className="modal-body">
              <div className="modal-form-group">
                <label>Clarification Prompt Sent to Supervisor</label>
                <textarea
                  className="modal-textarea"
                  rows={3}
                  value={justificationQuestion}
                  onChange={(e) => setJustificationQuestion(e.target.value)}
                  placeholder="Enter specific questions for agent supervisor..."
                />
              </div>

              <div className="modal-note-box">
                <Clock size={14} className="text-cyan" />
                <span>Dispatching this inquiry pauses the auto-rejection SLA counter for 15 minutes.</span>
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn-cancel" onClick={() => setJustifyModalOpen(false)}>
                Cancel
              </button>
              <button
                className="btn-confirm-justify"
                onClick={handleConfirmJustify}
                disabled={isProcessingAction}
              >
                {isProcessingAction ? <RefreshCw className="animate-spin" size={15} /> : <ArrowRight size={15} />}
                <span>Transmit Inquiry</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 4: Emergency Quarantine Agent */}
      {quarantineModalOpen && (
        <div className="hitl-modal-backdrop" onClick={() => setQuarantineModalOpen(false)}>
          <div className="hitl-modal-box modal-danger" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title-with-icon">
                <AlertTriangle size={22} className="text-red" />
                <div>
                  <h3>Emergency Quarantine: {selectedItem.agentId}</h3>
                  <p className="text-red">Revoke process execution and isolate micro-agent container.</p>
                </div>
              </div>
              <button className="modal-close-btn" onClick={() => setQuarantineModalOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <div className="modal-body">
              <p className="quarantine-warn-text">
                Executing emergency quarantine will immediately:
              </p>
              <ul className="modal-safeguards-list">
                <li><AlertTriangle size={14} className="text-red" /> Sever all inbound &amp; outbound network RPC sockets</li>
                <li><AlertTriangle size={14} className="text-red" /> Invalidate active mTLS identity certificates and bearer JWTs</li>
                <li><AlertTriangle size={14} className="text-red" /> Move agent state to QUARANTINED across all NexusGuard views</li>
                <li><AlertTriangle size={14} className="text-red" /> Alert regional SOC on-call engineers via PagerDuty bridge</li>
              </ul>
            </div>

            <div className="modal-footer">
              <button className="btn-cancel" onClick={() => setQuarantineModalOpen(false)}>
                Cancel
              </button>
              <button
                className="btn-confirm-quarantine"
                onClick={handleConfirmQuarantine}
                disabled={isProcessingAction}
              >
                {isProcessingAction ? <RefreshCw className="animate-spin" size={15} /> : <ShieldAlert size={15} />}
                <span>Confirm Immediate Quarantine</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
