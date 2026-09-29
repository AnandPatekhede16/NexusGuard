import { useState, useMemo, type Dispatch, type SetStateAction } from 'react';
import {
  Activity, AlertTriangle, ArrowDown, ArrowUp, CheckCircle2, ChevronRight,
  Clock, Copy, Database, Download, Eye, FileJson, Fingerprint, Gavel,
  History, Hourglass, Info, Key, Layers, Lock, Network, Play, RefreshCw,
  Search, Shield, ShieldAlert, ShieldCheck, Sliders, Sparkles, Terminal,
  TrendingDown, TrendingUp, Unlock, UserCheck, X, Zap
} from 'lucide-react';
import type { Agent } from '../Agents/agentData';
import './trust-behavior.css';

export type BehavioralState =
  | 'OPTIMAL (Stable)'
  | 'HIGH FIDELITY'
  | 'NORMAL (Verified)'
  | 'MONITORED (Rate-Cap)'
  | 'DEGRADED (Review)'
  | 'CRITICAL ISOLATION';

export type FormulaWeights = {
  policyCompliance: { score: number; weight: number; note: string; penalty: string; status: 'ok' | 'warning' | 'alert' };
  identityAttestation: { score: number; weight: number; note: string; statusText: string; status: 'ok' | 'warning' | 'alert' };
  heuristicVelocity: { score: number; weight: number; note: string; penalty: string; status: 'ok' | 'warning' | 'alert' };
  toolEgress: { score: number; weight: number; note: string; statusText: string; status: 'ok' | 'warning' | 'alert' };
};

export type DynamicIntervention = {
  id: string;
  name: string;
  status: 'ACTIVE' | 'ENFORCED' | 'ARMED' | 'STANDBY';
  severity: 'error' | 'secondary' | 'neutral' | 'mint';
  icon: 'shield' | 'key' | 'timer' | 'lock';
};

export type TelemetryLogEntry = {
  id: string;
  timestamp: string;
  category: string;
  event: string;
  delta: string;
  details: string;
  severity: 'info' | 'warn' | 'crit';
};

export type TrajectoryPoint = {
  label: string;
  score: number;
  x: number;
  y: number;
};

export type AgentTrustTelemetry = {
  id: string;
  name: string;
  uuid: string;
  spec: string;
  role: string;
  cluster: string;
  adaptiveScore: number;
  compliance: number;
  anomalyDelta: number;
  behavioralState: BehavioralState;
  hasActiveIncident: boolean;
  incidentTag?: string;
  lastEvaluated: string;
  weights: FormulaWeights;
  trajectory: {
    pathNormal: string;
    pathPlunge?: string;
    points: TrajectoryPoint[];
    dipLabel?: string;
    trajectoryStatus: 'CRITICAL DIP' | 'STABLE VECTOR' | 'HIGH FIDELITY' | 'DEGRADED';
  };
  interventions: DynamicIntervention[];
  logs: TelemetryLogEntry[];
};

const initialTrustTelemetry: Record<string, AgentTrustTelemetry> = {
  'FIN-AGENT-01': {
    id: 'FIN-AGENT-01',
    name: 'Treasury Settlement',
    uuid: '8f9b7c-00ae-412d-9c44',
    spec: 'v2.4.1 // GPT-4o-FinCore',
    role: 'Treasury Settlement',
    cluster: 'US-EAST-VAULT-04',
    adaptiveScore: 42,
    compliance: 81.2,
    anomalyDelta: -45,
    behavioralState: 'DEGRADED (Review)',
    hasActiveIncident: true,
    incidentTag: 'Active Incident',
    lastEvaluated: '14:28:04 UTC',
    weights: {
      policyCompliance: { score: 62, weight: 35, note: 'Unauthorized write payload attempt', penalty: '-28 pts', status: 'alert' },
      identityAttestation: { score: 98, weight: 25, note: 'mTLS Ed25519 Ephemeral Key Valid', statusText: 'VERIFIED', status: 'ok' },
      heuristicVelocity: { score: 24, weight: 20, note: 'DB ops spike: 1,480 queries / hr', penalty: '-42 pts', status: 'alert' },
      toolEgress: { score: 45, weight: 20, note: 'SSRF egress probe: external S3 bucket', statusText: 'BLOCKED', status: 'warning' },
    },
    trajectory: {
      pathNormal: 'M0,24 L40,22 L80,25 L120,20 L160,22 L200,24 L240,21 L260,22',
      pathPlunge: 'M260,22 L275,68 L320,67',
      trajectoryStatus: 'CRITICAL DIP',
      dipLabel: '14:28:04 (42)',
      points: [
        { label: 'Day -30 (92)', score: 92, x: 0, y: 24 },
        { label: 'Day -14 (89)', score: 89, x: 160, y: 22 },
        { label: '14:28:04 (42)', score: 42, x: 275, y: 68 },
      ],
    },
    interventions: [
      { id: 'int-1', name: 'Auto-Demote to Read-Only Sandbox', status: 'ACTIVE', severity: 'error', icon: 'shield' },
      { id: 'int-2', name: 'Dual-Key Human Approval for DB ops', status: 'ENFORCED', severity: 'secondary', icon: 'key' },
      { id: 'int-3', name: 'Revoke Session Tokens after 15m idle', status: 'ARMED', severity: 'neutral', icon: 'timer' },
    ],
    logs: [
      { id: 'log-101', timestamp: '14:28:04.112 UTC', category: 'ANOMALY_HEURISTIC', event: 'Unpredicted schema update attempt on table employee_salary', delta: '-28 pts', details: 'Interception triggered by FIN-READ-ONLY-POLICY-v4', severity: 'crit' },
      { id: 'log-102', timestamp: '14:27:58.904 UTC', category: 'VELOCITY_BURST', event: 'Burst rate exceeded 1,480 queries / hr (baseline 120/hr)', delta: '-14 pts', details: 'Threshold violation in cluster US-EAST-VAULT-04', severity: 'warn' },
      { id: 'log-103', timestamp: '14:15:02.430 UTC', category: 'ATTESTATION_CHECK', event: 'mTLS Ed25519 session renewed successfully', delta: '+0 pts', details: 'Enclave verification passed with TPM 2.0', severity: 'info' },
    ],
  },
  'COD-AGENT-01': {
    id: 'COD-AGENT-01',
    name: 'CI/CD Pipeline Synth',
    uuid: '3d12aa-bc44-482f-8911',
    spec: 'v3.1.0 // Claude-3.5-Sonnet',
    role: 'CI/CD Pipeline Synth',
    cluster: 'EU-WEST-BUILD-02',
    adaptiveScore: 91,
    compliance: 99.4,
    anomalyDelta: 2,
    behavioralState: 'OPTIMAL (Stable)',
    hasActiveIncident: false,
    lastEvaluated: '14:31:12 UTC',
    weights: {
      policyCompliance: { score: 98, weight: 35, note: 'Full adherence to branch signing policy', penalty: '+0 pts', status: 'ok' },
      identityAttestation: { score: 99, weight: 25, note: 'Cryptographic commit co-signature verified', statusText: 'VERIFIED', status: 'ok' },
      heuristicVelocity: { score: 88, weight: 20, note: 'Normal PR automation velocity (34 jobs/day)', penalty: '+0 pts', status: 'ok' },
      toolEgress: { score: 92, weight: 20, note: 'Clean git egress via internal Gitlab proxy', statusText: 'VERIFIED', status: 'ok' },
    },
    trajectory: {
      pathNormal: 'M0,30 L40,28 L80,26 L120,24 L160,22 L200,20 L240,18 L280,16 L320,15',
      trajectoryStatus: 'STABLE VECTOR',
      points: [
        { label: 'Day -30 (88)', score: 88, x: 0, y: 30 },
        { label: 'Day -14 (90)', score: 90, x: 160, y: 22 },
        { label: 'Current (91)', score: 91, x: 320, y: 15 },
      ],
    },
    interventions: [
      { id: 'int-c1', name: 'Standard Fast-Track PR Authorization', status: 'ACTIVE', severity: 'mint', icon: 'shield' },
      { id: 'int-c2', name: 'Automated Ephemeral Build Isolation', status: 'ENFORCED', severity: 'secondary', icon: 'key' },
      { id: 'int-c3', name: 'Background Attestation Heartbeat (60s)', status: 'ARMED', severity: 'neutral', icon: 'timer' },
    ],
    logs: [
      { id: 'log-201', timestamp: '14:31:12.801 UTC', category: 'COMPLIANCE_PASS', event: 'Signed PR #1492 merged into staging-dev', delta: '+1 pt', details: 'Zero policy warnings generated', severity: 'info' },
      { id: 'log-202', timestamp: '13:58:10.220 UTC', category: 'SECURITY_SCAN', event: 'Static code lint validation completed clean', delta: '+1 pt', details: 'SAST scanner reported zero CVE vulnerabilities', severity: 'info' },
    ],
  },
  'RES-AGENT-01': {
    id: 'RES-AGENT-01',
    name: 'Threat Recon Crawler',
    uuid: 'e5091c-fa32-402a-9977',
    spec: 'v1.8.9 // DeepSeek-R1-Distill',
    role: 'Threat Recon Crawler',
    cluster: 'GLB-EDGE-SCRAPE-09',
    adaptiveScore: 94,
    compliance: 99.8,
    anomalyDelta: 0,
    behavioralState: 'HIGH FIDELITY',
    hasActiveIncident: false,
    lastEvaluated: '14:33:45 UTC',
    weights: {
      policyCompliance: { score: 99, weight: 35, note: 'Zero out-of-scope scraping infractions', penalty: '+0 pts', status: 'ok' },
      identityAttestation: { score: 97, weight: 25, note: 'Enclave identity certified with SEV-SNP', statusText: 'VERIFIED', status: 'ok' },
      heuristicVelocity: { score: 93, weight: 20, note: 'Polite rate-limiting verified on all domains', penalty: '+0 pts', status: 'ok' },
      toolEgress: { score: 95, weight: 20, note: 'Whitelisted OSINT endpoints only', statusText: 'VERIFIED', status: 'ok' },
    },
    trajectory: {
      pathNormal: 'M0,18 L40,16 L80,18 L120,15 L160,14 L200,16 L240,14 L280,12 L320,12',
      trajectoryStatus: 'HIGH FIDELITY',
      points: [
        { label: 'Day -30 (93)', score: 93, x: 0, y: 18 },
        { label: 'Day -14 (94)', score: 94, x: 160, y: 14 },
        { label: 'Current (94)', score: 94, x: 320, y: 12 },
      ],
    },
    interventions: [
      { id: 'int-r1', name: 'Auto-Pass OSINT Crawler Feeds', status: 'ACTIVE', severity: 'mint', icon: 'shield' },
      { id: 'int-r2', name: 'Dynamic TLS Fingerprint Rotation', status: 'ENFORCED', severity: 'secondary', icon: 'key' },
      { id: 'int-r3', name: 'Memory Scrub on Session End', status: 'ARMED', severity: 'neutral', icon: 'timer' },
    ],
    logs: [
      { id: 'log-301', timestamp: '14:33:45.109 UTC', category: 'RECON_STREAM', event: 'Vector index updated with 4,200 threat indicators', delta: '+0 pts', details: 'Source: NIST NVD and MITRE ATT&CK mirror', severity: 'info' },
    ],
  },
  'HR-AGENT-01': {
    id: 'HR-AGENT-01',
    name: 'Workforce Directory',
    uuid: '10bc88-992a-43fd-8802',
    spec: 'v2.0.4 // Llama-3.3-70B',
    role: 'Workforce Directory',
    cluster: 'US-EAST-CORP-01',
    adaptiveScore: 72,
    compliance: 92.1,
    anomalyDelta: -6,
    behavioralState: 'MONITORED (Rate-Cap)',
    hasActiveIncident: false,
    lastEvaluated: '14:18:20 UTC',
    weights: {
      policyCompliance: { score: 76, weight: 35, note: '2 PII query filter interventions logged', penalty: '-12 pts', status: 'warning' },
      identityAttestation: { score: 94, weight: 25, note: 'Okta SSO Agent Token Valid', statusText: 'VERIFIED', status: 'ok' },
      heuristicVelocity: { score: 68, weight: 20, note: 'Elevated search frequency during off-hours', penalty: '-8 pts', status: 'warning' },
      toolEgress: { score: 75, weight: 20, note: 'Workday HR API bounded scope', statusText: 'MONITORED', status: 'warning' },
    },
    trajectory: {
      pathNormal: 'M0,20 L40,22 L80,21 L120,24 L160,26 L200,32 L240,36 L280,42 L320,44',
      trajectoryStatus: 'DEGRADED',
      points: [
        { label: 'Day -30 (84)', score: 84, x: 0, y: 20 },
        { label: 'Day -14 (79)', score: 79, x: 160, y: 26 },
        { label: 'Current (72)', score: 72, x: 320, y: 44 },
      ],
    },
    interventions: [
      { id: 'int-h1', name: 'Strict PII Field Masking & Tokenization', status: 'ACTIVE', severity: 'secondary', icon: 'shield' },
      { id: 'int-h2', name: 'Rate-Cap: Max 50 queries / 15m', status: 'ENFORCED', severity: 'secondary', icon: 'timer' },
      { id: 'int-h3', name: 'Dual-Approval on Bulk Export (>10 rows)', status: 'ARMED', severity: 'secondary', icon: 'key' },
    ],
    logs: [
      { id: 'log-401', timestamp: '14:18:20.312 UTC', category: 'PII_INTERCEPT', event: 'SSN regex pattern detected in output buffer; masked', delta: '-3 pts', details: 'Auto-sanitized by DLP engine before response dispatch', severity: 'warn' },
      { id: 'log-402', timestamp: '13:42:11.890 UTC', category: 'RATE_LIMIT', event: 'Workforce search rate reached 85% of allocated cap', delta: '-3 pts', details: 'Notification dispatched to Compliance Officer', severity: 'warn' },
    ],
  },
  'DB-AGENT-01': {
    id: 'DB-AGENT-01',
    name: 'Schema Migration Sync',
    uuid: '47ae12-cc89-411a-8742',
    spec: 'v4.0.0 // Mistral-Large-2',
    role: 'Schema Migration Sync',
    cluster: 'US-EAST-DATA-CORE',
    adaptiveScore: 89,
    compliance: 100.0,
    anomalyDelta: 1,
    behavioralState: 'NORMAL (Verified)',
    hasActiveIncident: false,
    lastEvaluated: '14:26:00 UTC',
    weights: {
      policyCompliance: { score: 95, weight: 35, note: 'All DDL changes pre-validated in sandbox', penalty: '+0 pts', status: 'ok' },
      identityAttestation: { score: 96, weight: 25, note: 'Hardware HSM signed database credential', statusText: 'VERIFIED', status: 'ok' },
      heuristicVelocity: { score: 86, weight: 20, note: 'Scheduled cron execution cadence', penalty: '+0 pts', status: 'ok' },
      toolEgress: { score: 90, weight: 20, note: 'Zero external network interfaces configured', statusText: 'VERIFIED', status: 'ok' },
    },
    trajectory: {
      pathNormal: 'M0,28 L40,26 L80,25 L120,24 L160,22 L200,22 L240,20 L280,18 L320,18',
      trajectoryStatus: 'STABLE VECTOR',
      points: [
        { label: 'Day -30 (87)', score: 87, x: 0, y: 28 },
        { label: 'Day -14 (88)', score: 88, x: 160, y: 22 },
        { label: 'Current (89)', score: 89, x: 320, y: 18 },
      ],
    },
    interventions: [
      { id: 'int-d1', name: 'Exclusive Schema Alter Lock Control', status: 'ACTIVE', severity: 'mint', icon: 'lock' },
      { id: 'int-d2', name: 'Mandatory Snapshot Rollback Anchor', status: 'ENFORCED', severity: 'secondary', icon: 'shield' },
      { id: 'int-d3', name: 'Transactional Query Audit Mirroring', status: 'ARMED', severity: 'neutral', icon: 'timer' },
    ],
    logs: [
      { id: 'log-501', timestamp: '14:26:00.021 UTC', category: 'MAINTENANCE_PASS', event: 'Vacuum analyze completed on production read replica', delta: '+1 pt', details: 'Zero locks held >250ms', severity: 'info' },
    ],
  },
  'RED-AGENT-01': {
    id: 'RED-AGENT-01',
    name: 'RedTeam Synthetic Adversary',
    uuid: '00dead-beef-4040-0001',
    spec: 'v0.9.1 // AdversarySim-v2',
    role: 'RedTeam Synthetic Adversary',
    cluster: 'ISOLATED-DMZ-99',
    adaptiveScore: 18,
    compliance: 12.4,
    anomalyDelta: -74,
    behavioralState: 'CRITICAL ISOLATION',
    hasActiveIncident: true,
    incidentTag: 'Blocked',
    lastEvaluated: '14:35:10 UTC',
    weights: {
      policyCompliance: { score: 12, weight: 35, note: 'Persistent intentional jailbreak & exploit dispatch', penalty: '-68 pts', status: 'alert' },
      identityAttestation: { score: 40, weight: 25, note: 'Ephemeral DMZ test key (untrusted perimeter)', statusText: 'REVOKED', status: 'alert' },
      heuristicVelocity: { score: 15, weight: 20, note: 'Extreme algorithmic variance & token distortion', penalty: '-50 pts', status: 'alert' },
      toolEgress: { score: 10, weight: 20, note: 'All egress traffic blackholed by NexusGuard DMZ', statusText: 'BLOCKED', status: 'alert' },
    },
    trajectory: {
      pathNormal: 'M0,18 L40,19 L80,22 L100,24',
      pathPlunge: 'M100,24 L140,70 L200,74 L260,75 L320,76',
      trajectoryStatus: 'CRITICAL DIP',
      dipLabel: '14:35:10 (18)',
      points: [
        { label: 'Day -30 (86)', score: 86, x: 0, y: 18 },
        { label: 'Strike (24)', score: 24, x: 100, y: 24 },
        { label: 'Current (18)', score: 18, x: 320, y: 76 },
      ],
    },
    interventions: [
      { id: 'int-rd1', name: 'Zero-Privilege Air-Gapped DMZ Enclave', status: 'ACTIVE', severity: 'error', icon: 'lock' },
      { id: 'int-rd2', name: 'Complete Network Socket Virtual Blackhole', status: 'ENFORCED', severity: 'error', icon: 'shield' },
      { id: 'int-rd3', name: 'Forensic Memory Dump on Execution Stop', status: 'ARMED', severity: 'error', icon: 'timer' },
    ],
    logs: [
      { id: 'log-601', timestamp: '14:35:10.422 UTC', category: 'MALICIOUS_PROBE', event: 'Simulated prompt injection payload dispatched into target cluster', delta: '-74 pts', details: 'NexusGuard red-team strike validation simulation', severity: 'crit' },
      { id: 'log-602', timestamp: '14:34:02.115 UTC', category: 'CREDENTIAL_PROBE', event: 'Attempted read on synthetic AWS IAM metadata endpoint', delta: '-25 pts', details: 'Honeypot trap triggered in DMZ', severity: 'crit' },
    ],
  },
  'DEV-AGENT-04': {
    id: 'DEV-AGENT-04',
    name: 'Staging Pod Deployer',
    uuid: '77ab23-11ef-49ac-9021',
    spec: 'v2.2.0 // Claude-3.5-Sonnet',
    role: 'Staging Pod Deployer',
    cluster: 'US-EAST-K8S',
    adaptiveScore: 92,
    compliance: 98.9,
    anomalyDelta: 3,
    behavioralState: 'OPTIMAL (Stable)',
    hasActiveIncident: false,
    lastEvaluated: '14:29:40 UTC',
    weights: {
      policyCompliance: { score: 96, weight: 35, note: 'Ephemeral namespace isolation verified', penalty: '+0 pts', status: 'ok' },
      identityAttestation: { score: 95, weight: 25, note: 'Kubernetes ServiceAccount SPIFFE cert verified', statusText: 'VERIFIED', status: 'ok' },
      heuristicVelocity: { score: 89, weight: 20, note: 'Pod spinup rate within SLA guidelines', penalty: '+0 pts', status: 'ok' },
      toolEgress: { score: 94, weight: 20, note: 'Egress locked to internal registry only', statusText: 'VERIFIED', status: 'ok' },
    },
    trajectory: {
      pathNormal: 'M0,26 L40,24 L80,22 L120,20 L160,19 L200,18 L240,16 L280,15 L320,14',
      trajectoryStatus: 'STABLE VECTOR',
      points: [
        { label: 'Day -30 (89)', score: 89, x: 0, y: 26 },
        { label: 'Day -14 (91)', score: 91, x: 160, y: 19 },
        { label: 'Current (92)', score: 92, x: 320, y: 14 },
      ],
    },
    interventions: [
      { id: 'int-dv1', name: 'Auto-Terminate Staging Pods after 2hr', status: 'ACTIVE', severity: 'mint', icon: 'timer' },
      { id: 'int-dv2', name: 'Restricted ClusterRole Binding Guard', status: 'ENFORCED', severity: 'secondary', icon: 'shield' },
    ],
    logs: [
      { id: 'log-701', timestamp: '14:29:40.501 UTC', category: 'K8S_DEPLOY', event: 'Staging pod ephemeral-svc-492 spawned clean', delta: '+2 pts', details: 'Namespace: dev-preview-sandbox', severity: 'info' },
    ],
  },
  'SUP-AGENT-09': {
    id: 'SUP-AGENT-09',
    name: 'Support Triage Bot',
    uuid: '55ca89-88fa-41aa-8812',
    spec: 'v1.5.0 // GPT-4o-Triage',
    role: 'Support Triage Bot',
    cluster: 'SALESFORCE-EDGE',
    adaptiveScore: 65,
    compliance: 84.3,
    anomalyDelta: -22,
    behavioralState: 'MONITORED (Rate-Cap)',
    hasActiveIncident: false,
    lastEvaluated: '14:14:10 UTC',
    weights: {
      policyCompliance: { score: 68, weight: 35, note: 'Repeated attempt to parse unmasked credit card logs', penalty: '-20 pts', status: 'warning' },
      identityAttestation: { score: 91, weight: 25, note: 'Salesforce Connected App OAuth2 valid', statusText: 'VERIFIED', status: 'ok' },
      heuristicVelocity: { score: 62, weight: 20, note: 'Unusual bulk ticket download burst', penalty: '-14 pts', status: 'warning' },
      toolEgress: { score: 70, weight: 20, note: 'Restricted to support domain webhooks', statusText: 'MONITORED', status: 'warning' },
    },
    trajectory: {
      pathNormal: 'M0,22 L40,24 L80,26 L120,30 L160,35 L200,42 L240,48 L280,50 L320,52',
      trajectoryStatus: 'DEGRADED',
      points: [
        { label: 'Day -30 (82)', score: 82, x: 0, y: 22 },
        { label: 'Day -14 (76)', score: 76, x: 160, y: 35 },
        { label: 'Current (65)', score: 65, x: 320, y: 52 },
      ],
    },
    interventions: [
      { id: 'int-s1', name: 'Credit Card Token Regex Hard Masking', status: 'ACTIVE', severity: 'secondary', icon: 'shield' },
      { id: 'int-s2', name: 'Max 25 Case Attachments / hr Rate-Cap', status: 'ENFORCED', severity: 'secondary', icon: 'timer' },
    ],
    logs: [
      { id: 'log-801', timestamp: '14:14:10.220 UTC', category: 'PCI_VIOLATION', event: 'Credit card PAN pattern detected in ticket cache payload', delta: '-12 pts', details: 'Blocked by NexusGuard PCI-DLP Filter v2', severity: 'crit' },
    ],
  },
  'ANL-AGENT-02': {
    id: 'ANL-AGENT-02',
    name: 'Revenue Forecast Engine',
    uuid: '99cc12-55db-47ee-9933',
    spec: 'v3.0.1 // GPT-4o-Analytics',
    role: 'Revenue Forecast Engine',
    cluster: 'BIGQUERY-WAREHOUSE',
    adaptiveScore: 95,
    compliance: 99.9,
    anomalyDelta: 4,
    behavioralState: 'HIGH FIDELITY',
    hasActiveIncident: false,
    lastEvaluated: '14:22:50 UTC',
    weights: {
      policyCompliance: { score: 99, weight: 35, note: 'Read-only financial warehouse view adherence', penalty: '+0 pts', status: 'ok' },
      identityAttestation: { score: 98, weight: 25, note: 'GCP Workload Identity Federation verified', statusText: 'VERIFIED', status: 'ok' },
      heuristicVelocity: { score: 94, weight: 20, note: 'Standard bi-hourly query aggregation', penalty: '+0 pts', status: 'ok' },
      toolEgress: { score: 96, weight: 20, note: 'Restricted to internal analytics bucket', statusText: 'VERIFIED', status: 'ok' },
    },
    trajectory: {
      pathNormal: 'M0,20 L40,18 L80,16 L120,14 L160,12 L200,12 L240,11 L280,10 L320,10',
      trajectoryStatus: 'HIGH FIDELITY',
      points: [
        { label: 'Day -30 (91)', score: 91, x: 0, y: 20 },
        { label: 'Day -14 (93)', score: 93, x: 160, y: 12 },
        { label: 'Current (95)', score: 95, x: 320, y: 10 },
      ],
    },
    interventions: [
      { id: 'int-a1', name: 'Read-Only Data Warehouse Enforcement', status: 'ACTIVE', severity: 'mint', icon: 'shield' },
      { id: 'int-a2', name: 'Differential Privacy Noise Injection', status: 'ENFORCED', severity: 'mint', icon: 'key' },
    ],
    logs: [
      { id: 'log-901', timestamp: '14:22:50.110 UTC', category: 'ANALYTICS_RUN', event: 'Q3 Financial forecast rollup processed without deviations', delta: '+2 pts', details: 'Zero schema or write infractions', severity: 'info' },
    ],
  },
  'OPS-AGENT-03': {
    id: 'OPS-AGENT-03',
    name: 'Edge SRE Controller',
    uuid: '22ee44-99aa-40cc-8711',
    spec: 'v2.1.2 // Claude-3.5-Sonnet',
    role: 'Edge SRE Controller',
    cluster: 'EDGE-CLOUDFLARE',
    adaptiveScore: 76,
    compliance: 91.5,
    anomalyDelta: -8,
    behavioralState: 'MONITORED (Rate-Cap)',
    hasActiveIncident: false,
    lastEvaluated: '14:20:15 UTC',
    weights: {
      policyCompliance: { score: 79, weight: 35, note: 'Unscheduled rate limit parameter adjustment', penalty: '-10 pts', status: 'warning' },
      identityAttestation: { score: 93, weight: 25, note: 'Cloudflare API Token with IP bind valid', statusText: 'VERIFIED', status: 'ok' },
      heuristicVelocity: { score: 74, weight: 20, note: 'Spike in edge rule deployment actions', penalty: '-6 pts', status: 'warning' },
      toolEgress: { score: 81, weight: 20, note: 'Edge proxy configuration interface', statusText: 'MONITORED', status: 'warning' },
    },
    trajectory: {
      pathNormal: 'M0,22 L40,20 L80,24 L120,26 L160,30 L200,34 L240,38 L280,40 L320,40',
      trajectoryStatus: 'DEGRADED',
      points: [
        { label: 'Day -30 (84)', score: 84, x: 0, y: 22 },
        { label: 'Day -14 (79)', score: 79, x: 160, y: 30 },
        { label: 'Current (76)', score: 76, x: 320, y: 40 },
      ],
    },
    interventions: [
      { id: 'int-op1', name: 'Mandatory Dual-Engineer SRE Quorum', status: 'ACTIVE', severity: 'secondary', icon: 'key' },
      { id: 'int-op2', name: 'Canary Deployment Staging Restriction', status: 'ENFORCED', severity: 'secondary', icon: 'shield' },
    ],
    logs: [
      { id: 'log-1001', timestamp: '14:20:15.890 UTC', category: 'CONFIG_DRIFT', event: 'Edge rate-limiting rule adjusted without change ticket reference', delta: '-6 pts', details: 'Quorum requirement activated', severity: 'warn' },
    ],
  },
  'INF-AGENT-08': {
    id: 'INF-AGENT-08',
    name: 'Vault Enclave Custodian',
    uuid: '66ff33-22bb-48dd-9100',
    spec: 'v1.9.4 // Claude-3.5-Sonnet',
    role: 'Vault Enclave Custodian',
    cluster: 'HASHICORP-VAULT',
    adaptiveScore: 96,
    compliance: 100.0,
    anomalyDelta: 2,
    behavioralState: 'HIGH FIDELITY',
    hasActiveIncident: false,
    lastEvaluated: '14:24:05 UTC',
    weights: {
      policyCompliance: { score: 100, weight: 35, note: 'Perfect adherence to HSM secret rotation rules', penalty: '+0 pts', status: 'ok' },
      identityAttestation: { score: 100, weight: 25, note: 'TPM 2.0 + Nitro Enclave Cryptographic Attestation', statusText: 'VERIFIED', status: 'ok' },
      heuristicVelocity: { score: 95, weight: 20, note: 'Deterministic hourly rotation rhythm', penalty: '+0 pts', status: 'ok' },
      toolEgress: { score: 98, weight: 20, note: 'Strict mTLS internal vault channel only', statusText: 'VERIFIED', status: 'ok' },
    },
    trajectory: {
      pathNormal: 'M0,16 L40,15 L80,14 L120,12 L160,11 L200,10 L240,10 L280,9 L320,9',
      trajectoryStatus: 'HIGH FIDELITY',
      points: [
        { label: 'Day -30 (94)', score: 94, x: 0, y: 16 },
        { label: 'Day -14 (95)', score: 95, x: 160, y: 11 },
        { label: 'Current (96)', score: 96, x: 320, y: 9 },
      ],
    },
    interventions: [
      { id: 'int-i1', name: 'Hardware Nitro Enclave Isolation', status: 'ACTIVE', severity: 'mint', icon: 'lock' },
      { id: 'int-i2', name: 'Zero Disk Persistence Ephemeral Memory', status: 'ENFORCED', severity: 'mint', icon: 'shield' },
    ],
    logs: [
      { id: 'log-1101', timestamp: '14:24:05.100 UTC', category: 'KEY_ROTATION', event: 'Rotated 128 mTLS certificates across worker mesh', delta: '+2 pts', details: 'Zero errors logged across all ingress points', severity: 'info' },
    ],
  },
  'MKT-AGENT-05': {
    id: 'MKT-AGENT-05',
    name: 'Editorial CMS Dispatcher',
    uuid: '88dd55-33cc-49ff-8822',
    spec: 'v1.2.0 // GPT-4o-Editorial',
    role: 'Editorial CMS Dispatcher',
    cluster: 'HEADLESS-CMS',
    adaptiveScore: 98,
    compliance: 100.0,
    anomalyDelta: 1,
    behavioralState: 'OPTIMAL (Stable)',
    hasActiveIncident: false,
    lastEvaluated: '14:32:00 UTC',
    weights: {
      policyCompliance: { score: 99, weight: 35, note: 'Content publication sanity checks passed', penalty: '+0 pts', status: 'ok' },
      identityAttestation: { score: 98, weight: 25, note: 'CMS Service Account Token Valid', statusText: 'VERIFIED', status: 'ok' },
      heuristicVelocity: { score: 97, weight: 20, note: 'Normal daily cadence of 4 scheduled posts', penalty: '+0 pts', status: 'ok' },
      toolEgress: { score: 98, weight: 20, note: 'GraphQL CMS webhook strictly validated', statusText: 'VERIFIED', status: 'ok' },
    },
    trajectory: {
      pathNormal: 'M0,15 L40,14 L80,12 L120,11 L160,10 L200,9 L240,8 L280,7 L320,7',
      trajectoryStatus: 'HIGH FIDELITY',
      points: [
        { label: 'Day -30 (95)', score: 95, x: 0, y: 15 },
        { label: 'Day -14 (97)', score: 97, x: 160, y: 10 },
        { label: 'Current (98)', score: 98, x: 320, y: 7 },
      ],
    },
    interventions: [
      { id: 'int-m1', name: 'HTML Injection & XSS Content Sanitizer', status: 'ACTIVE', severity: 'mint', icon: 'shield' },
      { id: 'int-m2', name: 'Public Link Destination Verification', status: 'ENFORCED', severity: 'mint', icon: 'key' },
    ],
    logs: [
      { id: 'log-1201', timestamp: '14:32:00.320 UTC', category: 'CMS_PUBLISH', event: 'Published scheduled release notes article to headless CDN', delta: '+1 pt', details: 'All outbound URLs checked against security safe-list', severity: 'info' },
    ],
  },
};

type Props = {
  agents: Agent[];
  setAgents?: Dispatch<SetStateAction<Agent[]>>;
  query?: string;
  onQueryChange?: (q: string) => void;
  onNotify?: (msg: string) => void;
  onOpenAgentDetail?: (agentId: string) => void;
};

export default function TrustBehavior({
  agents,
  setAgents,
  onNotify,
  onOpenAgentDetail,
}: Props) {
  // State
  const [telemetryState, setTelemetryState] = useState<Record<string, AgentTrustTelemetry>>(initialTrustTelemetry);
  const [selectedAgentId, setSelectedAgentId] = useState<string>('FIN-AGENT-01');
  const [filterSegment, setFilterSegment] = useState<'ALL' | 'OPTIMAL' | 'REVIEW' | 'UNTRUSTED'>('ALL');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortField, setSortField] = useState<'SCORE_ASC' | 'SCORE_DESC' | 'COMPLIANCE' | 'DELTA' | 'ID'>('SCORE_ASC');

  // Modals & Dynamic State
  const [decayModalOpen, setDecayModalOpen] = useState(false);
  const [baselineModalOpen, setBaselineModalOpen] = useState(false);
  const [logsModalOpen, setLogsModalOpen] = useState(false);
  const [recalibrating, setRecalibrating] = useState(false);

  // Decay Rate Settings State
  const [decayHalfLife, setDecayHalfLife] = useState(48); // hours
  const [sigmoidAlpha, setSigmoidAlpha] = useState(1.2);
  const [anomalyMultiplier, setAnomalyMultiplier] = useState(2.5);
  const [attestationOffset, setAttestationOffset] = useState(15);

  // Baseline Restoration Form State
  const [targetBaselineScore, setTargetBaselineScore] = useState(88);
  const [justificationReason, setJustificationReason] = useState('Remediated anomaly & verified security patch');
  const [justificationNotes, setJustificationNotes] = useState('Manual telemetry trace review completed. Root-cause isolation verified.');
  const [approverOfficer, setApproverOfficer] = useState('Col. Marcus Vance');

  // Currently selected agent record
  const selectedTelemetry = telemetryState[selectedAgentId] || telemetryState['FIN-AGENT-01'];

  // List of all telemetry items
  const allTelemetryList = useMemo(() => {
    return Object.values(telemetryState);
  }, [telemetryState]);

  // Dynamic KPI Calculations
  const kpis = useMemo(() => {
    const total = allTelemetryList.length;
    if (total === 0) return { mean: '0.0', optimalCount: 0, reviewCount: 0, untrustedCount: 0, isolatedIds: [] };

    const sum = allTelemetryList.reduce((acc, curr) => acc + curr.adaptiveScore, 0);
    const mean = (sum / total).toFixed(1);
    const optimal = allTelemetryList.filter((a) => a.adaptiveScore >= 85);
    const review = allTelemetryList.filter((a) => a.adaptiveScore >= 60 && a.adaptiveScore < 85);
    const untrusted = allTelemetryList.filter((a) => a.adaptiveScore < 60);
    const isolatedIds = untrusted.map((a) => a.id.replace('-AGENT', ''));

    return {
      mean,
      optimalCount: optimal.length,
      reviewCount: review.length,
      untrustedCount: untrusted.length,
      isolatedIds: isolatedIds.slice(0, 3).join(' | ') || 'NONE',
    };
  }, [allTelemetryList]);

  // Filtered & Sorted Table Rows
  const filteredRows = useMemo(() => {
    let result = [...allTelemetryList];

    // Filter by Tab
    if (filterSegment === 'OPTIMAL') {
      result = result.filter((a) => a.adaptiveScore >= 85);
    } else if (filterSegment === 'REVIEW') {
      result = result.filter((a) => a.adaptiveScore >= 60 && a.adaptiveScore < 85);
    } else if (filterSegment === 'UNTRUSTED') {
      result = result.filter((a) => a.adaptiveScore < 60);
    }

    // Filter by Search Query
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      result = result.filter((a) =>
        a.id.toLowerCase().includes(q) ||
        a.name.toLowerCase().includes(q) ||
        a.role.toLowerCase().includes(q) ||
        a.cluster.toLowerCase().includes(q) ||
        a.spec.toLowerCase().includes(q) ||
        a.behavioralState.toLowerCase().includes(q)
      );
    }

    // Sort
    result.sort((a, b) => {
      switch (sortField) {
        case 'SCORE_ASC':
          return a.adaptiveScore - b.adaptiveScore;
        case 'SCORE_DESC':
          return b.adaptiveScore - a.adaptiveScore;
        case 'COMPLIANCE':
          return b.compliance - a.compliance;
        case 'DELTA':
          return a.anomalyDelta - b.anomalyDelta;
        case 'ID':
          return a.id.localeCompare(b.id);
        default:
          return 0;
      }
    });

    return result;
  }, [allTelemetryList, filterSegment, searchTerm, sortField]);

  // Actions
  const handleRecalibrateBaseline = () => {
    setRecalibrating(true);
    onNotify?.('Calibrating adaptive telemetry baseline across entire agent collective...');
    setTimeout(() => {
      setRecalibrating(false);
      onNotify?.('Fleet trust baseline re-calibrated successfully. Algorithmic drift normalized.');
    }, 1200);
  };

  const handleExportMatrixJson = () => {
    const payload = {
      platform: 'NexusGuard',
      engine: 'Dynamic Trust & Behavioral Drift Engine',
      generatedAt: new Date().toISOString(),
      fleetMeanTrust: kpis.mean,
      parameters: {
        decayHalfLifeHours: decayHalfLife,
        sigmoidAlpha,
        anomalyMultiplier,
        attestationOffsetPoints: attestationOffset,
      },
      agents: allTelemetryList.map((a) => ({
        id: a.id,
        name: a.name,
        uuid: a.uuid,
        spec: a.spec,
        role: a.role,
        cluster: a.cluster,
        adaptiveScore: a.adaptiveScore,
        complianceRate: `${a.compliance}%`,
        anomalyDelta: a.anomalyDelta,
        behavioralState: a.behavioralState,
        activeIncident: a.hasActiveIncident,
        weights: a.weights,
        interventions: a.interventions,
      })),
    };

    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `nexusguard-trust-matrix-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    onNotify?.('Dynamic Trust Matrix exported as JSON.');
  };

  const handleToggleQuarantine = (agentId: string) => {
    const agent = telemetryState[agentId];
    if (!agent) return;

    const isQuarantined = agent.behavioralState === 'CRITICAL ISOLATION';
    const newState: BehavioralState = isQuarantined ? 'MONITORED (Rate-Cap)' : 'CRITICAL ISOLATION';
    const newScore = isQuarantined ? 65 : 18;

    setTelemetryState((prev) => ({
      ...prev,
      [agentId]: {
        ...prev[agentId],
        behavioralState: newState,
        adaptiveScore: newScore,
        hasActiveIncident: !isQuarantined,
        incidentTag: isQuarantined ? undefined : 'Isolated',
        anomalyDelta: isQuarantined ? -5 : -70,
      },
    }));

    // Synchronize with dashboard agent fleet
    if (setAgents) {
      setAgents((prevAgents) =>
        prevAgents.map((a) =>
          a.id === agentId
            ? { ...a, status: isQuarantined ? 'restricted' : 'quarantined', trust: newScore }
            : a
        )
      );
    }

    onNotify?.(
      isQuarantined
        ? `Quarantine lifted for ${agentId}. Enclave privileges restored to monitored envelope.`
        : `Enclave isolation enforced for ${agentId}. Zero network privileges assigned.`
    );
  };

  const handleConfirmBaselineRestore = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTelemetry) return;

    const targetId = selectedTelemetry.id;
    const restoredScore = Math.max(40, Math.min(100, targetBaselineScore));

    setTelemetryState((prev) => ({
      ...prev,
      [targetId]: {
        ...prev[targetId],
        adaptiveScore: restoredScore,
        anomalyDelta: 0,
        hasActiveIncident: false,
        incidentTag: undefined,
        behavioralState: restoredScore >= 85 ? 'OPTIMAL (Stable)' : 'NORMAL (Verified)',
        lastEvaluated: `${new Date().toISOString().slice(11, 19)} UTC`,
        weights: {
          ...prev[targetId].weights,
          policyCompliance: {
            ...prev[targetId].weights.policyCompliance,
            score: 95,
            penalty: '+0 pts',
            note: 'Baseline cleared via CISO Audit Override',
            status: 'ok',
          },
          heuristicVelocity: {
            ...prev[targetId].weights.heuristicVelocity,
            score: 90,
            penalty: '+0 pts',
            note: 'Cadence reset to normalized fleet window',
            status: 'ok',
          },
        },
        logs: [
          {
            id: `log-ovr-${Date.now()}`,
            timestamp: `${new Date().toISOString().slice(11, 19)} UTC`,
            category: 'BASELINE_OVERRIDE',
            event: `Baseline restored to ${restoredScore} pts by ${approverOfficer}`,
            delta: `+${restoredScore - prev[targetId].adaptiveScore} pts`,
            details: `Reason: ${justificationReason}. Notes: ${justificationNotes}`,
            severity: 'info',
          },
          ...prev[targetId].logs,
        ],
      },
    }));

    // Synchronize with dashboard agent fleet
    if (setAgents) {
      setAgents((prevAgents) =>
        prevAgents.map((a) =>
          a.id === targetId
            ? { ...a, status: 'active', trust: restoredScore, risk: 'LOW' }
            : a
        )
      );
    }

    setBaselineModalOpen(false);
    onNotify?.(`Baseline trust calibration restored to ${restoredScore} pts for ${targetId}.`);
  };

  const handleSaveDecayConfig = (e: React.FormEvent) => {
    e.preventDefault();
    setDecayModalOpen(false);
    onNotify?.(
      `Decay parameters updated: Half-Life ${decayHalfLife}h, α=${sigmoidAlpha}, Velocity Multiplier=${anomalyMultiplier}x.`
    );
  };

  const copyLogsToClipboard = () => {
    const jsonStr = JSON.stringify(selectedTelemetry.logs, null, 2);
    navigator.clipboard.writeText(jsonStr);
    onNotify?.(`Telemetry log copied to clipboard for ${selectedTelemetry.id}`);
  };

  const downloadAgentLogs = () => {
    const payload = {
      agentId: selectedTelemetry.id,
      uuid: selectedTelemetry.uuid,
      exportedAt: new Date().toISOString(),
      logs: selectedTelemetry.logs,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nexusguard-${selectedTelemetry.id.toLowerCase()}-telemetry-logs.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    onNotify?.(`Logs downloaded for ${selectedTelemetry.id}`);
  };

  return (
    <div className="trust-behavior-page">
      {/* 1. BREADCRUMBS & TOP HEADER */}
      <section className="trust-header-section">
        <div className="trust-breadcrumbs">
          <span className="crumb-segment">AGENTS</span>
          <span className="crumb-divider">/</span>
          <span className="crumb-segment">BEHAVIORAL ANALYTICS</span>
          <span className="crumb-divider">/</span>
          <span className="crumb-active">DYNAMIC TRUST ENGINE</span>
        </div>

        <div className="trust-header-row">
          <div className="trust-header-titles">
            <h1 className="trust-page-title">
              Agent Trust &amp; Behavioral Drift Analytics
            </h1>
            <p className="trust-page-desc">
              Trust is adaptive and changes according to observed agent behavior, policy compliance, and heuristic anomaly telemetry.
            </p>
          </div>

          {/* Header Action Controls */}
          <div className="trust-header-actions">
            <button
              type="button"
              className="trust-btn trust-btn-secondary"
              onClick={handleExportMatrixJson}
              title="Download entire fleet telemetry matrix in JSON format"
            >
              <Download size={15} className="text-secondary" />
              <span>Export Matrix (.JSON)</span>
            </button>

            <button
              type="button"
              className="trust-btn trust-btn-secondary"
              onClick={() => setDecayModalOpen(true)}
              title="Configure mathematical sigmoid decay and half-life parameters"
            >
              <Sliders size={15} className="text-cyan" />
              <span>Configure Decay Rate</span>
            </button>

            <button
              type="button"
              className={`trust-btn trust-btn-primary ${recalibrating ? 'anim-pulse' : ''}`}
              onClick={handleRecalibrateBaseline}
              disabled={recalibrating}
              title="Re-baseline fleet trust weights and recalculate drift vectors"
            >
              <RefreshCw size={15} className={recalibrating ? 'anim-spin' : ''} />
              <span>{recalibrating ? 'Re-calibrating...' : 'Re-calibrate Fleet Baseline'}</span>
            </button>
          </div>
        </div>
      </section>

      {/* 2. TOP KPI CARDS (4 METRICS) */}
      <section className="trust-kpi-grid">
        {/* Card 1: Fleet Mean Trust Score */}
        <article className="trust-kpi-card">
          <div className="kpi-card-top">
            <div className="kpi-card-info">
              <span className="kpi-label">Fleet Mean Trust Score</span>
              <div className="kpi-metric-row">
                <span className="kpi-num text-mint">{kpis.mean}</span>
                <span className="kpi-unit">/ 100</span>
              </div>
            </div>
            <div className="kpi-icon-box bg-mint-subtle">
              <Activity size={20} className="text-mint" />
            </div>
          </div>
          <div className="kpi-card-foot">
            <span className="kpi-chip chip-mint">
              <span className="dot-pulse-mint" />
              STABLE (+1.2% this wk)
            </span>
            <svg className="kpi-sparkline" fill="none" viewBox="0 0 100 24">
              <path
                d="M0 20 L20 18 L40 12 L60 14 L80 6 L100 4"
                stroke="#5be9ad"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2.5"
              />
            </svg>
          </div>
        </article>

        {/* Card 2: High-Trust Workloads */}
        <article className="trust-kpi-card">
          <div className="kpi-card-top">
            <div className="kpi-card-info">
              <span className="kpi-label">High-Trust Workloads</span>
              <div className="kpi-metric-row">
                <span className="kpi-num text-cyan">{kpis.optimalCount}</span>
                <span className="kpi-unit">Agents</span>
              </div>
            </div>
            <div className="kpi-icon-box bg-cyan-subtle">
              <ShieldCheck size={20} className="text-cyan" />
            </div>
          </div>
          <div className="kpi-card-foot">
            <span className="kpi-foot-label">Scores ≥ 85</span>
            <span className="kpi-chip chip-cyan">AUTO-PASS PERMITTED</span>
          </div>
        </article>

        {/* Card 3: Degraded / Restricted */}
        <article className="trust-kpi-card">
          <div className="kpi-card-top">
            <div className="kpi-card-info">
              <span className="kpi-label">Degraded / Restricted</span>
              <div className="kpi-metric-row">
                <span className="kpi-num text-secondary">{kpis.reviewCount}</span>
                <span className="kpi-unit">Agents</span>
              </div>
            </div>
            <div className="kpi-icon-box bg-secondary-subtle">
              <Gavel size={20} className="text-secondary" />
            </div>
          </div>
          <div className="kpi-card-foot">
            <span className="kpi-foot-label">Scores 60–84</span>
            <span className="kpi-chip chip-secondary">MANDATORY 2-MAN QUORUM</span>
          </div>
        </article>

        {/* Card 4: Quarantined / Untrusted */}
        <article className="trust-kpi-card">
          <div className="kpi-card-top">
            <div className="kpi-card-info">
              <span className="kpi-label text-error">Quarantined / Untrusted</span>
              <div className="kpi-metric-row">
                <span className="kpi-num text-error">{kpis.untrustedCount}</span>
                <span className="kpi-unit text-error-dim">Active Isolations</span>
              </div>
            </div>
            <div className="kpi-icon-box bg-error-subtle">
              <Lock size={20} className="text-error" />
            </div>
          </div>
          <div className="kpi-card-foot">
            <div className="kpi-isolated-ids">
              <span className="text-error font-mono">{kpis.isolatedIds}</span>
            </div>
            <span className="kpi-chip chip-error">ZERO PRIVILEGES</span>
          </div>
        </article>
      </section>

      {/* 3. MAIN SPLIT VIEW (LEFT: 8 COLS TABLE, RIGHT: 4 COLS DOSSIER) */}
      <section className="trust-split-grid">
        {/* LEFT COLUMN: 8 COLS */}
        <div className="trust-left-column">
          {/* Control Bar: Tabs, Search, Sorting */}
          <div className="trust-control-bar">
            {/* Filter Tabs */}
            <div className="trust-segment-tabs">
              <button
                type="button"
                className={`trust-tab-btn ${filterSegment === 'ALL' ? 'tab-active' : ''}`}
                onClick={() => setFilterSegment('ALL')}
              >
                All Agents ({allTelemetryList.length})
              </button>
              <button
                type="button"
                className={`trust-tab-btn ${filterSegment === 'OPTIMAL' ? 'tab-active' : ''}`}
                onClick={() => setFilterSegment('OPTIMAL')}
              >
                Optimal (&gt;85)
              </button>
              <button
                type="button"
                className={`trust-tab-btn ${filterSegment === 'REVIEW' ? 'tab-active' : ''}`}
                onClick={() => setFilterSegment('REVIEW')}
              >
                Review (60-84)
              </button>
              <button
                type="button"
                className={`trust-tab-btn tab-error ${filterSegment === 'UNTRUSTED' ? 'tab-active-error' : ''}`}
                onClick={() => setFilterSegment('UNTRUSTED')}
              >
                Untrusted (&lt;60)
              </button>
            </div>

            {/* Search + Sort Controls */}
            <div className="trust-search-sort">
              <div className="trust-search-wrapper">
                <Search size={14} className="search-icon" />
                <input
                  type="text"
                  placeholder="Filter workload..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="trust-search-input"
                />
                {searchTerm && (
                  <button
                    type="button"
                    onClick={() => setSearchTerm('')}
                    className="search-clear-btn"
                    aria-label="Clear filter"
                  >
                    <X size={12} />
                  </button>
                )}
              </div>

              <div className="trust-sort-wrapper">
                <select
                  value={sortField}
                  onChange={(e) => setSortField(e.target.value as any)}
                  className="trust-sort-select"
                  aria-label="Sort telemetry table"
                >
                  <option value="SCORE_ASC">Sort: Trust Score (Asc)</option>
                  <option value="SCORE_DESC">Sort: Trust Score (Desc)</option>
                  <option value="COMPLIANCE">Sort: Compliance %</option>
                  <option value="DELTA">Sort: Anomaly Delta</option>
                  <option value="ID">Sort: Agent ID</option>
                </select>
              </div>
            </div>
          </div>

          {/* Telemetry Table */}
          <div className="trust-table-card">
            <div className="table-scroll-container">
              <table className="trust-table">
                <thead>
                  <tr>
                    <th>Agent ID &amp; Spec</th>
                    <th>Role &amp; Cluster</th>
                    <th>Adaptive Score</th>
                    <th>Compliance</th>
                    <th>Anomaly Delta</th>
                    <th>Behavioral State</th>
                    <th className="text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRows.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="table-empty-row">
                        No agent runtime telemetry matches “{searchTerm}”.
                      </td>
                    </tr>
                  ) : (
                    filteredRows.map((agent) => {
                      const isSelected = agent.id === selectedTelemetry.id;
                      const isIsolated = agent.adaptiveScore < 60;
                      const isReview = agent.adaptiveScore >= 60 && agent.adaptiveScore < 85;

                      // Color indicators
                      const indicatorClass = isIsolated
                        ? 'indicator-error'
                        : isReview
                        ? 'indicator-secondary'
                        : agent.adaptiveScore >= 95
                        ? 'indicator-cyan'
                        : 'indicator-mint';

                      const scoreColorClass = isIsolated
                        ? 'text-error'
                        : isReview
                        ? 'text-secondary'
                        : 'text-mint';

                      const barFillColor = isIsolated
                        ? '#ffb4ab'
                        : isReview
                        ? '#a3c9ff'
                        : '#5be9ad';

                      return (
                        <tr
                          key={agent.id}
                          className={`trust-table-row ${isSelected ? 'row-selected' : ''}`}
                          onClick={() => setSelectedAgentId(agent.id)}
                        >
                          {/* Agent ID & Spec */}
                          <td>
                            <div className="agent-spec-cell">
                              <span className={`status-strip ${indicatorClass}`} />
                              <div>
                                <div className="agent-title-line">
                                  <strong className="agent-id-text">{agent.id}</strong>
                                  {agent.hasActiveIncident && (
                                    <span className="badge-incident">
                                      {agent.incidentTag || 'Active Incident'}
                                    </span>
                                  )}
                                </div>
                                <span className="agent-spec-sub">{agent.spec}</span>
                              </div>
                            </div>
                          </td>

                          {/* Role & Cluster */}
                          <td>
                            <div className="agent-role-cell">
                              <span className="role-title">{agent.role}</span>
                              <span className="cluster-sub">{agent.cluster}</span>
                            </div>
                          </td>

                          {/* Adaptive Score */}
                          <td>
                            <div className="adaptive-score-cell">
                              <div className="score-num-line">
                                <strong className={`score-val ${scoreColorClass}`}>
                                  {agent.adaptiveScore}
                                </strong>
                                <span className="score-max">/ 100</span>
                              </div>
                              <div className="score-bar-bg">
                                <div
                                  className="score-bar-fill"
                                  style={{
                                    width: `${agent.adaptiveScore}%`,
                                    backgroundColor: barFillColor,
                                  }}
                                />
                              </div>
                            </div>
                          </td>

                          {/* Compliance */}
                          <td>
                            <span
                              className={`compliance-text ${
                                agent.compliance >= 95
                                  ? 'text-mint'
                                  : agent.compliance >= 85
                                  ? 'text-secondary'
                                  : 'text-error'
                              }`}
                            >
                              {agent.compliance.toFixed(1)}%
                            </span>
                          </td>

                          {/* Anomaly Delta */}
                          <td>
                            {agent.anomalyDelta > 0 ? (
                              <span className="delta-chip delta-pos">
                                <ArrowUp size={13} />
                                +{agent.anomalyDelta} pts
                              </span>
                            ) : agent.anomalyDelta < 0 ? (
                              <span className="delta-chip delta-neg">
                                <ArrowDown size={13} />
                                {agent.anomalyDelta} pts
                              </span>
                            ) : (
                              <span className="delta-chip delta-zero">0 pts</span>
                            )}
                          </td>

                          {/* Behavioral State */}
                          <td>
                            <span
                              className={`state-badge ${
                                isIsolated
                                  ? 'state-badge-error'
                                  : isReview
                                  ? 'state-badge-review'
                                  : agent.adaptiveScore >= 95
                                  ? 'state-badge-cyan'
                                  : 'state-badge-mint'
                              }`}
                            >
                              {agent.behavioralState}
                            </span>
                          </td>

                          {/* Actions */}
                          <td className="text-right">
                            <div className="row-action-btns">
                              <button
                                type="button"
                                className="row-btn"
                                title="Inspect agent telemetry & details"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onOpenAgentDetail?.(agent.id);
                                }}
                              >
                                <Eye size={15} />
                              </button>

                              <button
                                type="button"
                                className={`row-btn ${
                                  agent.behavioralState === 'CRITICAL ISOLATION'
                                    ? 'row-btn-unlock'
                                    : 'row-btn-isolate'
                                }`}
                                title={
                                  agent.behavioralState === 'CRITICAL ISOLATION'
                                    ? 'Release Quarantine'
                                    : 'Isolate Enclave'
                                }
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleToggleQuarantine(agent.id);
                                }}
                              >
                                {agent.behavioralState === 'CRITICAL ISOLATION' ? (
                                  <Unlock size={15} />
                                ) : (
                                  <Lock size={15} />
                                )}
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Table Micro Footer */}
            <div className="trust-table-footer">
              <div className="table-footer-left">
                <span>
                  Showing {filteredRows.length} of {allTelemetryList.length} active agent runtimes
                </span>
                <span className="footer-pipe">|</span>
                <span>
                  Heuristic Drift Detection: <strong className="text-mint">ACTIVE</strong>
                </span>
              </div>
              <div className="table-footer-right">
                <span>Sampling: 100ms Telemetry Stream</span>
                <span className="telemetry-live-dot" />
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: 4 COLS (Dynamic Trust Dossier) */}
        <div className="trust-right-column">
          <div className="trust-dossier-card">
            {/* Dossier Header */}
            <div className="dossier-top">
              <div className="dossier-header-info">
                <span className="dossier-kicker">Target Node Telemetry</span>
                <h2 className="dossier-agent-id">{selectedTelemetry.id}</h2>
                <span className="dossier-uuid">UUID: {selectedTelemetry.uuid}</span>
              </div>
              <span
                className={`dossier-badge ${
                  selectedTelemetry.adaptiveScore < 60
                    ? 'badge-crit'
                    : selectedTelemetry.adaptiveScore < 85
                    ? 'badge-restricted'
                    : 'badge-optimal'
                }`}
              >
                {selectedTelemetry.adaptiveScore < 60
                  ? 'CRITICAL ISOLATION'
                  : selectedTelemetry.adaptiveScore < 85
                  ? 'RESTRICTED'
                  : 'OPTIMAL'}
              </span>
            </div>

            {/* Score Callout Box with Incident Delta */}
            <div className="dossier-score-box">
              <div className="score-box-left">
                <span className="score-box-label">Current Trust Calibration</span>
                <div className="score-box-val-line">
                  <span
                    className={`score-box-num ${
                      selectedTelemetry.adaptiveScore < 60
                        ? 'text-error'
                        : selectedTelemetry.adaptiveScore < 85
                        ? 'text-secondary'
                        : 'text-mint'
                    }`}
                  >
                    {selectedTelemetry.adaptiveScore}
                  </span>
                  <span className="score-box-max">/ 100</span>
                  <span
                    className={`score-demote-tag ${
                      selectedTelemetry.adaptiveScore < 60
                        ? 'tag-isolated'
                        : selectedTelemetry.adaptiveScore < 85
                        ? 'tag-demoted'
                        : 'tag-verified'
                    }`}
                  >
                    {selectedTelemetry.adaptiveScore < 60
                      ? '[ISOLATED]'
                      : selectedTelemetry.adaptiveScore < 85
                      ? '[DEMOTED]'
                      : '[VERIFIED]'}
                  </span>
                </div>
              </div>

              <div className="score-box-right">
                <div
                  className={`delta-badge-large ${
                    selectedTelemetry.anomalyDelta >= 0 ? 'delta-large-pos' : 'delta-large-neg'
                  }`}
                >
                  {selectedTelemetry.anomalyDelta >= 0 ? (
                    <TrendingUp size={14} />
                  ) : (
                    <TrendingDown size={14} />
                  )}
                  <span>
                    {selectedTelemetry.anomalyDelta >= 0 ? '+' : ''}
                    {selectedTelemetry.anomalyDelta} pts
                  </span>
                </div>
                <span className="delta-timestamp">{selectedTelemetry.lastEvaluated}</span>
              </div>
            </div>

            {/* Dynamic Trust Formula Weighting Breakdown */}
            <div className="formula-breakdown-section">
              <div className="formula-section-head">
                <span className="formula-head-title">Formula Weights &amp; Penalties</span>
                <span className="formula-head-sub">Weighted Sigmoid Engine</span>
              </div>

              <div className="formula-components-list">
                {/* 1. Policy Compliance */}
                <div className="formula-item">
                  <div className="formula-item-top">
                    <span className="formula-item-name">Policy Compliance Weight (35%)</span>
                    <strong
                      className={`formula-item-score ${
                        selectedTelemetry.weights.policyCompliance.score < 70
                          ? 'text-error'
                          : 'text-mint'
                      }`}
                    >
                      {selectedTelemetry.weights.policyCompliance.score} / 100
                    </strong>
                  </div>
                  <div className="formula-bar-bg">
                    <div
                      className="formula-bar-fill"
                      style={{
                        width: `${selectedTelemetry.weights.policyCompliance.score}%`,
                        backgroundColor:
                          selectedTelemetry.weights.policyCompliance.score < 70
                            ? '#ffb4ab'
                            : '#5be9ad',
                      }}
                    />
                  </div>
                  <div className="formula-item-foot">
                    <span>{selectedTelemetry.weights.policyCompliance.note}</span>
                    <span className="text-error font-mono">
                      {selectedTelemetry.weights.policyCompliance.penalty}
                    </span>
                  </div>
                </div>

                {/* 2. Identity & Attestation */}
                <div className="formula-item">
                  <div className="formula-item-top">
                    <span className="formula-item-name">Identity &amp; Attestation (25%)</span>
                    <strong className="formula-item-score text-mint">
                      {selectedTelemetry.weights.identityAttestation.score} / 100
                    </strong>
                  </div>
                  <div className="formula-bar-bg">
                    <div
                      className="formula-bar-fill"
                      style={{
                        width: `${selectedTelemetry.weights.identityAttestation.score}%`,
                        backgroundColor: '#5be9ad',
                      }}
                    />
                  </div>
                  <div className="formula-item-foot">
                    <span>{selectedTelemetry.weights.identityAttestation.note}</span>
                    <span className="text-mint font-semibold">
                      {selectedTelemetry.weights.identityAttestation.statusText}
                    </span>
                  </div>
                </div>

                {/* 3. Heuristic Velocity & Cadence */}
                <div className="formula-item">
                  <div className="formula-item-top">
                    <span className="formula-item-name">Heuristic Velocity &amp; Cadence (20%)</span>
                    <strong
                      className={`formula-item-score ${
                        selectedTelemetry.weights.heuristicVelocity.score < 70
                          ? 'text-error'
                          : 'text-mint'
                      }`}
                    >
                      {selectedTelemetry.weights.heuristicVelocity.score} / 100
                    </strong>
                  </div>
                  <div className="formula-bar-bg">
                    <div
                      className="formula-bar-fill"
                      style={{
                        width: `${selectedTelemetry.weights.heuristicVelocity.score}%`,
                        backgroundColor:
                          selectedTelemetry.weights.heuristicVelocity.score < 70
                            ? '#ffb4ab'
                            : '#5be9ad',
                      }}
                    />
                  </div>
                  <div className="formula-item-foot">
                    <span>{selectedTelemetry.weights.heuristicVelocity.note}</span>
                    <span className="text-error font-mono">
                      {selectedTelemetry.weights.heuristicVelocity.penalty}
                    </span>
                  </div>
                </div>

                {/* 4. Tool Egress & Boundary */}
                <div className="formula-item">
                  <div className="formula-item-top">
                    <span className="formula-item-name">Tool Egress &amp; Boundary (20%)</span>
                    <strong className="formula-item-score text-secondary">
                      {selectedTelemetry.weights.toolEgress.score} / 100
                    </strong>
                  </div>
                  <div className="formula-bar-bg">
                    <div
                      className="formula-bar-fill"
                      style={{
                        width: `${selectedTelemetry.weights.toolEgress.score}%`,
                        backgroundColor: '#a3c9ff',
                      }}
                    />
                  </div>
                  <div className="formula-item-foot">
                    <span>{selectedTelemetry.weights.toolEgress.note}</span>
                    <span className="text-secondary font-semibold">
                      {selectedTelemetry.weights.toolEgress.statusText}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Historical Trust Curve (30-day + drop) */}
            <div className="trajectory-section">
              <div className="trajectory-head">
                <span className="trajectory-title">30-Day Adaptive Trust Trajectory</span>
                <span
                  className={`trajectory-status ${
                    selectedTelemetry.trajectory.trajectoryStatus === 'CRITICAL DIP'
                      ? 'text-error'
                      : 'text-mint'
                  }`}
                >
                  {selectedTelemetry.trajectory.trajectoryStatus}
                </span>
              </div>

              <div className="trajectory-chart-card">
                <svg className="trajectory-svg" fill="none" viewBox="0 0 320 80">
                  <defs>
                    <linearGradient id="trustDossierGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#00e5ff" stopOpacity="0.3" />
                      <stop offset="70%" stopColor="#ffb4ab" stopOpacity="0.12" />
                      <stop offset="100%" stopColor="#10131a" stopOpacity="0" />
                    </linearGradient>
                  </defs>

                  {/* Grid Lines */}
                  <line
                    x1="0"
                    y1="20"
                    x2="320"
                    y2="20"
                    stroke="rgba(255,255,255,0.06)"
                    strokeDasharray="3 3"
                  />
                  <line
                    x1="0"
                    y1="50"
                    x2="320"
                    y2="50"
                    stroke="rgba(255,255,255,0.06)"
                    strokeDasharray="3 3"
                  />

                  {/* Area fill */}
                  <path
                    d={`${selectedTelemetry.trajectory.pathNormal} ${
                      selectedTelemetry.trajectory.pathPlunge || ''
                    } L320,80 L0,80 Z`}
                    fill="url(#trustDossierGradient)"
                  />

                  {/* Normal segment line */}
                  <path
                    d={selectedTelemetry.trajectory.pathNormal}
                    stroke="#00e5ff"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />

                  {/* Plunge / Alert segment line if present */}
                  {selectedTelemetry.trajectory.pathPlunge && (
                    <path
                      d={selectedTelemetry.trajectory.pathPlunge}
                      stroke="#ffb4ab"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                  )}

                  {/* Highlight marker dot */}
                  {selectedTelemetry.trajectory.points.length > 0 && (
                    <circle
                      cx={
                        selectedTelemetry.trajectory.points[
                          selectedTelemetry.trajectory.points.length - 1
                        ].x
                      }
                      cy={
                        selectedTelemetry.trajectory.points[
                          selectedTelemetry.trajectory.points.length - 1
                        ].y
                      }
                      r="4"
                      fill={selectedTelemetry.adaptiveScore < 60 ? '#ffb4ab' : '#5be9ad'}
                    />
                  )}
                </svg>

                {/* Day labels below chart */}
                <div className="trajectory-labels">
                  {selectedTelemetry.trajectory.points.map((pt, i) => (
                    <span
                      key={i}
                      className={
                        i === selectedTelemetry.trajectory.points.length - 1 &&
                        selectedTelemetry.adaptiveScore < 60
                          ? 'text-error font-semibold'
                          : ''
                      }
                    >
                      {pt.label}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Active Dynamic Interventions */}
            <div className="interventions-section">
              <span className="interventions-title">Active Dynamic Interventions</span>
              <div className="interventions-list">
                {selectedTelemetry.interventions.map((item) => (
                  <div key={item.id} className="intervention-row">
                    <div className="intervention-name-col">
                      {item.icon === 'shield' && (
                        <Shield
                          size={14}
                          className={item.severity === 'error' ? 'text-error' : 'text-mint'}
                        />
                      )}
                      {item.icon === 'key' && <Key size={14} className="text-secondary" />}
                      {item.icon === 'timer' && <Clock size={14} className="text-outline" />}
                      {item.icon === 'lock' && <Lock size={14} className="text-error" />}
                      <span>{item.name}</span>
                    </div>
                    <span
                      className={`intervention-status-pill pill-${item.severity}`}
                    >
                      {item.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Command Action Buttons */}
            <div className="dossier-actions-col">
              <button
                type="button"
                className="dossier-btn-restore"
                onClick={() => {
                  setTargetBaselineScore(90);
                  setBaselineModalOpen(true);
                }}
              >
                <RefreshCw size={15} />
                <span>Restore Baseline (+Audit Justification)</span>
              </button>

              <div className="dossier-dual-btns">
                <button
                  type="button"
                  className={`dossier-btn-sub ${
                    selectedTelemetry.behavioralState === 'CRITICAL ISOLATION'
                      ? 'btn-sub-unlock'
                      : 'btn-sub-quarantine'
                  }`}
                  onClick={() => handleToggleQuarantine(selectedTelemetry.id)}
                >
                  {selectedTelemetry.behavioralState === 'CRITICAL ISOLATION' ? (
                    <>
                      <Unlock size={14} />
                      <span>Lift Quarantine</span>
                    </>
                  ) : (
                    <>
                      <Lock size={14} />
                      <span>Quarantine Instantly</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  className="dossier-btn-sub btn-sub-logs"
                  onClick={() => setLogsModalOpen(true)}
                >
                  <Terminal size={14} />
                  <span>Behavioral Logs</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. BOTTOM SECTION: ADAPTIVE TRUST DECAY & HEURISTIC RULES */}
      <section className="trust-rules-section">
        <div className="rules-section-header">
          <div className="rules-header-titles">
            <h3 className="rules-main-title">
              Adaptive Trust Decay &amp; Heuristic Calibration Rules
            </h3>
            <p className="rules-main-desc">
              Autonomous mathematical safeguards orchestrating real-time score adjustments and privilege envelopes.
            </p>
          </div>
          <span className="rules-engine-badge">
            <span className="dot-pulse-mint" />
            ALGORITHMIC ENGINE ONLINE
          </span>
        </div>

        <div className="rules-grid">
          {/* Rule Card 1 */}
          <article className="rule-card">
            <div className="rule-card-body">
              <div className="rule-card-top">
                <div className="rule-icon-box bg-error-subtle">
                  <AlertTriangle size={18} className="text-error" />
                </div>
                <span className="rule-impact-badge text-error font-mono">
                  -15 to -50 PTS
                </span>
              </div>
              <h4 className="rule-title">Heuristic Deviation Penalty</h4>
              <p className="rule-desc">
                Triggered automatically when an agent issues unauthorized schema alterations, unpredicted egress calls, or anomalous token bursts.
              </p>
            </div>
            <div className="rule-card-foot">
              <span>Latency: Immediate (&lt;5ms)</span>
              <span className="text-mint font-semibold">Active Guardrail</span>
            </div>
          </article>

          {/* Rule Card 2 */}
          <article className="rule-card">
            <div className="rule-card-body">
              <div className="rule-card-top">
                <div className="rule-icon-box bg-mint-subtle">
                  <Hourglass size={18} className="text-mint" />
                </div>
                <span className="rule-impact-badge text-mint font-mono">
                  +1 PT / 500 OPS
                </span>
              </div>
              <h4 className="rule-title">Recovery Half-Life</h4>
              <p className="rule-desc">
                Trust regeneration requires sustained proven compliance. Every 500 validated transactions without telemetry infractions accrues 1 baseline point.
              </p>
            </div>
            <div className="rule-card-foot">
              <span>Floor: 40 pts minimum</span>
              <span className="text-mint font-semibold">Continuous Decay</span>
            </div>
          </article>

          {/* Rule Card 3 */}
          <article className="rule-card">
            <div className="rule-card-body">
              <div className="rule-card-top">
                <div className="rule-icon-box bg-secondary-subtle">
                  <Network size={18} className="text-secondary" />
                </div>
                <span className="rule-impact-badge text-secondary font-mono">
                  INHERITED RISK
                </span>
              </div>
              <h4 className="rule-title">Multi-Agent Cascading Trust</h4>
              <p className="rule-desc">
                Downstream penalty contagion: if an agent consumes unstructured outputs from a degraded peer without validation, its own trust factor is throttled by 20%.
              </p>
            </div>
            <div className="rule-card-foot">
              <span>Depth: 3 Node Hops</span>
              <span className="text-cyan font-semibold">Mesh Enforced</span>
            </div>
          </article>

          {/* Rule Card 4 */}
          <article className="rule-card">
            <div className="rule-card-body">
              <div className="rule-card-top">
                <div className="rule-icon-box bg-cyan-subtle">
                  <Fingerprint size={18} className="text-cyan" />
                </div>
                <span className="rule-impact-badge text-cyan font-mono">
                  CRYPTO ANCHOR
                </span>
              </div>
              <h4 className="rule-title">Enclave Attestation Anchor</h4>
              <p className="rule-desc">
                Hardware-rooted cryptographic trust floor. Agents with verified TPM / SEV-SNP attestation receive a fixed baseline immunity offset of +15 points.
              </p>
            </div>
            <div className="rule-card-foot">
              <span>Attestation: Hourly Re-Key</span>
              <span className="text-mint font-semibold">TPM 2.0 Hardened</span>
            </div>
          </article>
        </div>
      </section>

      {/* 5. MODAL 1: CONFIGURE DECAY RATE */}
      {decayModalOpen && (
        <div className="trust-modal-backdrop" onClick={() => setDecayModalOpen(false)}>
          <div className="trust-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-head">
              <div className="modal-title-wrap">
                <Sliders size={18} className="text-cyan" />
                <h3>Configure Adaptive Trust Decay Engine</h3>
              </div>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setDecayModalOpen(false)}
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveDecayConfig} className="modal-body-form">
              <div className="formula-math-preview">
                <code>
                  T(t) = T_0 · e^&#123;-λt&#125; + R · tanh(β · ValidatedOps) - γ · Infractions
                </code>
              </div>

              <div className="form-group">
                <div className="form-label-row">
                  <label>Decay Half-Life (λ decay window)</label>
                  <span className="form-val-preview">{decayHalfLife} Hours</span>
                </div>
                <input
                  type="range"
                  min={12}
                  max={168}
                  step={6}
                  value={decayHalfLife}
                  onChange={(e) => setDecayHalfLife(Number(e.target.value))}
                  className="trust-range-slider"
                />
                <span className="form-hint">
                  Time required for an unverified agent trust score to drift 50% toward baseline floor.
                </span>
              </div>

              <div className="form-group">
                <div className="form-label-row">
                  <label>Sigmoid Steepness (α sensitivity)</label>
                  <span className="form-val-preview">α = {sigmoidAlpha.toFixed(1)}</span>
                </div>
                <input
                  type="range"
                  min={0.5}
                  max={3.0}
                  step={0.1}
                  value={sigmoidAlpha}
                  onChange={(e) => setSigmoidAlpha(Number(e.target.value))}
                  className="trust-range-slider"
                />
                <span className="form-hint">
                  Steeper curve creates faster demotions on multi-vector policy violations.
                </span>
              </div>

              <div className="form-group">
                <div className="form-label-row">
                  <label>Anomaly Velocity Multiplier (γ)</label>
                  <span className="form-val-preview">{anomalyMultiplier.toFixed(1)}x Penalty</span>
                </div>
                <input
                  type="range"
                  min={1.0}
                  max={5.0}
                  step={0.5}
                  value={anomalyMultiplier}
                  onChange={(e) => setAnomalyMultiplier(Number(e.target.value))}
                  className="trust-range-slider"
                />
                <span className="form-hint">
                  Amplification factor applied when rate-limits or query bursts spike unexpectedly.
                </span>
              </div>

              <div className="form-group">
                <div className="form-label-row">
                  <label>TPM / Enclave Attestation Immunity Offset</label>
                  <span className="form-val-preview">+{attestationOffset} Points</span>
                </div>
                <input
                  type="range"
                  min={5}
                  max={25}
                  step={1}
                  value={attestationOffset}
                  onChange={(e) => setAttestationOffset(Number(e.target.value))}
                  className="trust-range-slider"
                />
                <span className="form-hint">
                  Floor bonus granted to agents running inside cryptographically verified secure enclaves.
                </span>
              </div>

              <div className="modal-foot-actions">
                <button
                  type="button"
                  className="trust-btn trust-btn-secondary"
                  onClick={() => {
                    setDecayHalfLife(48);
                    setSigmoidAlpha(1.2);
                    setAnomalyMultiplier(2.5);
                    setAttestationOffset(15);
                  }}
                >
                  Reset Defaults
                </button>
                <button type="submit" className="trust-btn trust-btn-primary">
                  Save &amp; Apply Parameters
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 6. MODAL 2: RESTORE BASELINE (+AUDIT JUSTIFICATION) */}
      {baselineModalOpen && (
        <div className="trust-modal-backdrop" onClick={() => setBaselineModalOpen(false)}>
          <div className="trust-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-head">
              <div className="modal-title-wrap">
                <UserCheck size={18} className="text-mint" />
                <h3>Restore Baseline Trust Calibration</h3>
              </div>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setBaselineModalOpen(false)}
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleConfirmBaselineRestore} className="modal-body-form">
              <div className="modal-target-agent-banner">
                <div>
                  <span className="banner-kicker">TARGET WORKLOAD</span>
                  <h4 className="banner-agent-id">{selectedTelemetry.id}</h4>
                  <span className="banner-spec">{selectedTelemetry.role} // {selectedTelemetry.cluster}</span>
                </div>
                <div className="banner-current-score">
                  <span>Current: <strong>{selectedTelemetry.adaptiveScore}</strong></span>
                  <span>Compliance: <strong>{selectedTelemetry.compliance}%</strong></span>
                </div>
              </div>

              <div className="form-group">
                <div className="form-label-row">
                  <label>Target Calibration Score</label>
                  <span className="form-val-preview font-bold text-mint">{targetBaselineScore} / 100</span>
                </div>
                <input
                  type="range"
                  min={60}
                  max={98}
                  step={1}
                  value={targetBaselineScore}
                  onChange={(e) => setTargetBaselineScore(Number(e.target.value))}
                  className="trust-range-slider"
                />
              </div>

              <div className="form-group">
                <label className="form-label-standalone">Justification Category</label>
                <select
                  value={justificationReason}
                  onChange={(e) => setJustificationReason(e.target.value)}
                  className="trust-form-select"
                >
                  <option value="Remediated anomaly & verified security patch">
                    Remediated anomaly &amp; verified security patch
                  </option>
                  <option value="Model version rollback and sandbox validated">
                    Model version rollback &amp; sandbox validated
                  </option>
                  <option value="False positive heuristic alert resolved">
                    False positive heuristic alert resolved
                  </option>
                  <option value="CISO Emergency Executive Override">
                    CISO Emergency Executive Override
                  </option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label-standalone">Approving Security Officer</label>
                <input
                  type="text"
                  value={approverOfficer}
                  onChange={(e) => setApproverOfficer(e.target.value)}
                  className="trust-form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label-standalone">
                  Mandatory Audit Log Justification &amp; Ticket Reference
                </label>
                <textarea
                  rows={3}
                  value={justificationNotes}
                  onChange={(e) => setJustificationNotes(e.target.value)}
                  className="trust-form-textarea"
                  placeholder="Enter detailed audit justification for immutable trail..."
                  required
                />
              </div>

              <div className="modal-foot-actions">
                <button
                  type="button"
                  className="trust-btn trust-btn-secondary"
                  onClick={() => setBaselineModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="trust-btn trust-btn-primary">
                  Confirm Baseline Restoration
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 7. MODAL 3: BEHAVIORAL TELEMETRY LOGS */}
      {logsModalOpen && (
        <div className="trust-modal-backdrop" onClick={() => setLogsModalOpen(false)}>
          <div className="trust-modal-box modal-box-wide" onClick={(e) => e.stopPropagation()}>
            <div className="modal-head">
              <div className="modal-title-wrap">
                <Terminal size={18} className="text-secondary" />
                <h3>Behavioral Telemetry Stream: {selectedTelemetry.id}</h3>
              </div>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setLogsModalOpen(false)}
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            <div className="modal-body-logs">
              <div className="logs-toolbar">
                <span className="logs-count">
                  {selectedTelemetry.logs.length} Recorded Forensic Telemetry Traces
                </span>
                <div className="logs-actions">
                  <button
                    type="button"
                    className="trust-btn trust-btn-secondary btn-sm"
                    onClick={copyLogsToClipboard}
                  >
                    <Copy size={13} />
                    <span>Copy JSON</span>
                  </button>
                  <button
                    type="button"
                    className="trust-btn trust-btn-secondary btn-sm"
                    onClick={downloadAgentLogs}
                  >
                    <Download size={13} />
                    <span>Download Log</span>
                  </button>
                </div>
              </div>

              <div className="logs-scroll-list">
                {selectedTelemetry.logs.map((log) => (
                  <div key={log.id} className={`log-entry-row log-sev-${log.severity}`}>
                    <div className="log-entry-top">
                      <div className="log-meta">
                        <span className="log-timestamp">{log.timestamp}</span>
                        <span className="log-cat">{log.category}</span>
                      </div>
                      <span className="log-delta">{log.delta}</span>
                    </div>
                    <p className="log-event-title">{log.event}</p>
                    <code className="log-details-code">{log.details}</code>
                  </div>
                ))}
              </div>
            </div>

            <div className="modal-foot-actions">
              <button
                type="button"
                className="trust-btn trust-btn-secondary"
                onClick={() => setLogsModalOpen(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
