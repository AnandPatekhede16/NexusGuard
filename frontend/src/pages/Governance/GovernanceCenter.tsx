import { useState, useMemo, type Dispatch, type SetStateAction } from 'react';
import {
  Activity, AlertTriangle, ArrowRight, Award, BadgeCheck, Check,
  CheckCircle2, Clock, Copy, Database, Download, ExternalLink,
  Eye, FileCheck, FileCode, FileSpreadsheet, FileText, Fingerprint,
  Gavel, HardDrive, History, Info, Key, Layers, Lock, Network,
  Radar, RefreshCw, RotateCcw, ScanLine, Search, Shield,
  ShieldAlert, ShieldCheck, Sparkles, Terminal, TrendingUp,
  UserCheck, Users, X, Zap
} from 'lucide-react';
import type { Agent } from '../Agents/agentData';
import './governance-center.css';

export type FrameworkType = 'nist' | 'iso' | 'euai' | 'soc2' | 'hipaa';

export type ComplianceControl = {
  id: string;
  code: string;
  name: string;
  category: string;
  framework: FrameworkType;
  standard: string;
  standardDesc: string;
  mechanism: string;
  scope: string;
  status: 'ENFORCED' | 'ACTIVE' | 'MONITORED' | 'CERTIFIED' | 'REVIEW';
  statusRate: string;
  evidenceLeaf: string;
  blockNumber: number;
  hash: string;
  lastAudited: string;
  verifyingNode: string;
  isHighRisk?: boolean;
};

const initialControls: ComplianceControl[] = [
  {
    id: 'ctrl-1',
    code: 'GOV-AI-01',
    name: 'Agent Identity & Cryptographic Attestation',
    category: 'GOVERN',
    framework: 'nist',
    standard: 'NIST MAP 1.1',
    standardDesc: 'Agent Identity & Machine Attestation',
    mechanism: 'Automated mTLS Ed25519 & Nitro Enclave check',
    scope: '24/24 Agents',
    status: 'ENFORCED',
    statusRate: '100%',
    evidenceLeaf: 'Leaf #194,821',
    blockNumber: 4198102,
    hash: '0x8f4b0918c72839e9a11003fa08219481be8329a10023',
    lastAudited: '4m ago',
    verifyingNode: 'enclave-validator-us-east-01',
    isHighRisk: true,
  },
  {
    id: 'ctrl-2',
    code: 'GOV-AI-02',
    name: 'Deterministic Intent Validation',
    category: 'MEASURE',
    framework: 'nist',
    standard: 'NIST MEASURE 2.4',
    standardDesc: 'Deterministic Intent Validation',
    mechanism: 'Intent Firewall AST parser',
    scope: 'All LLM Callouts',
    status: 'ACTIVE',
    statusRate: '99.98%',
    evidenceLeaf: 'Leaf #194,802',
    blockNumber: 4198099,
    hash: '0x7c3a0198e4129b82aa1022ff08119022ba9120a10944',
    lastAudited: '8m ago',
    verifyingNode: 'firewall-eval-us-east-04',
    isHighRisk: false,
  },
  {
    id: 'ctrl-3',
    code: 'GOV-AI-03',
    name: 'Prompt Injection Isolation & Adversarial Defense',
    category: 'MANAGE',
    framework: 'nist',
    standard: 'ISO 42001 §9.2',
    standardDesc: 'Prompt Injection Isolation',
    mechanism: 'Heuristic vector sanitization & RedAgent simulation',
    scope: 'Ingress Payloads',
    status: 'MONITORED',
    statusRate: '98.4%',
    evidenceLeaf: 'Leaf #194,765',
    blockNumber: 4198050,
    hash: '0x3a9f11029c8821bb450091ff78129481bb2091c10118',
    lastAudited: '12m ago',
    verifyingNode: 'redagent-strike-enclave-09',
    isHighRisk: true,
  },
  {
    id: 'ctrl-4',
    code: 'GOV-AI-04',
    name: 'Cryptographic Event Non-Repudiation',
    category: 'GOVERN',
    framework: 'nist',
    standard: 'SOC2 CC6.1 / SEC',
    standardDesc: 'Cryptographic Event Non-Repudiation',
    mechanism: 'Merkle-tree signed WORM storage',
    scope: 'Global Ledger',
    status: 'CERTIFIED',
    statusRate: '100%',
    evidenceLeaf: 'Leaf #194,710',
    blockNumber: 4197992,
    hash: '0x6e2b9188a10022cc771188ff91209384bc9102a90044',
    lastAudited: '18m ago',
    verifyingNode: 'worm-immutable-vault-02',
    isHighRisk: false,
  },
  {
    id: 'ctrl-5',
    code: 'GOV-AI-05',
    name: 'Mandatory Dual-Key Human Approval',
    category: 'MANAGE',
    framework: 'nist',
    standard: 'EU AI Act Art 14',
    standardDesc: 'Mandatory Dual-Key Human Approval',
    mechanism: '2-man quorum sign-off for financial/PII mutation',
    scope: 'Tier-1 Finance',
    status: 'ENFORCED',
    statusRate: '100%',
    evidenceLeaf: 'Leaf #194,688',
    blockNumber: 4197960,
    hash: '0x5d1c0988f41199ee882200aa90219481cd8210b10033',
    lastAudited: '24m ago',
    verifyingNode: 'governance-quorum-router-01',
    isHighRisk: true,
  },
];

type Props = {
  agents: Agent[];
  setAgents?: Dispatch<SetStateAction<Agent[]>>;
  onNotify?: (msg: string) => void;
  onOpenAgentDetail?: (agentId: string) => void;
};

export default function GovernanceCenter({
  agents,
  setAgents,
  onNotify,
  onOpenAgentDetail,
}: Props) {
  // Active Framework Tab
  const [activeFramework, setActiveFramework] = useState<FrameworkType>('nist');
  const [controlFilter, setControlFilter] = useState<'ALL' | 'HIGHRISK'>('ALL');

  // Interactive Action States
  const [attestationSigned, setAttestationSigned] = useState<boolean>(false);
  const [isSigning, setIsSigning] = useState<boolean>(false);
  const [isScanning, setIsScanning] = useState<boolean>(false);

  // Evidence Leaf Inspector Modal
  const [selectedLeaf, setSelectedLeaf] = useState<ComplianceControl | null>(null);

  // Scan modal simulation
  const [scanModalOpen, setScanModalOpen] = useState<boolean>(false);
  const [scanStep, setScanStep] = useState<number>(0);

  // Filtered Controls
  const filteredControls = useMemo(() => {
    let result = initialControls;
    if (controlFilter === 'HIGHRISK') {
      result = result.filter((c) => c.isHighRisk);
    }
    return result;
  }, [controlFilter]);

  // Pillar Metrics Mapping by Framework
  const frameworkPillars = useMemo(() => {
    switch (activeFramework) {
      case 'iso':
        return [
          { name: 'POLICY & OBJ', rate: '99%', desc: 'AI Management system objectives aligned with organizational goals.' },
          { name: 'RISK ASSESS', rate: '96%', desc: 'AI impact assessments on fundamental rights and data integrity.' },
          { name: 'LIFE-CYCLE', rate: '94%', desc: 'Continuous model deployment validation and runtime guardrails.' },
          { name: 'IMPROVEMENT', rate: '98%', desc: 'Automated corrective incident actions and anomaly containment.' },
        ];
      case 'euai':
        return [
          { name: 'TRANSPARENCY', rate: '97%', desc: 'Article 13 machine-readable audit logs and decision explanations.' },
          { name: 'HUMAN OVERSIGHT', rate: '100%', desc: 'Article 14 dual-key approval on high-risk model mutations.' },
          { name: 'ACCURACY & CYBER', rate: '98%', desc: 'Article 15 adversarial defense and data poisoning resistance.' },
          { name: 'DATA GOV', rate: '95%', desc: 'Article 10 training and validation data bias & lineage bounds.' },
        ];
      case 'soc2':
        return [
          { name: 'SECURITY (CC6)', rate: '99%', desc: 'Boundary protections, mTLS zero-trust mesh, and key rotation.' },
          { name: 'CONFIDENTIALITY', rate: '98%', desc: 'DLP filters preventing PII / financial credentials leakage.' },
          { name: 'PROCESSING INT', rate: '97%', desc: 'Deterministic AST intent evaluation and schema compliance.' },
          { name: 'AVAILABILITY', rate: '99.9%', desc: 'Redundant air-gap sandbox failovers and rate-limiting.' },
        ];
      case 'hipaa':
        return [
          { name: 'EPHI ISOLATION', rate: '100%', desc: 'Encrypted token storage with zero persistence in model weights.' },
          { name: 'ACCESS CONTROL', rate: '98%', desc: 'Role-based least privilege and emergency kill switch isolation.' },
          { name: 'AUDIT CONTROLS', rate: '99%', desc: 'WORM immutable ledger tracking every query to protected data.' },
          { name: 'TRANSMISSION', rate: '100%', desc: 'Hardware-enforced TLS 1.3 with authenticated PFS ciphers.' },
        ];
      case 'nist':
      default:
        return [
          { name: 'GOVERN', rate: '98%', desc: 'Organizational governance, accountability roles defined, agent ownership clear.' },
          { name: 'MAP', rate: '95%', desc: 'Context and risk mapping across all 24 deployed autonomous models.' },
          { name: 'MEASURE', rate: '97%', desc: 'Continuous quantitative behavioral telemetry & entropy evaluation.' },
          { name: 'MANAGE', rate: '96%', desc: 'Automated containment, kill switch, and dual-approval escalation workflows.' },
        ];
    }
  }, [activeFramework]);

  // Handle Attestation Sign
  const handleSignAttestation = () => {
    setIsSigning(true);
    setTimeout(() => {
      setIsSigning(false);
      setAttestationSigned(true);
      onNotify?.('Attestation successfully signed and chained with cryptographic seal by Col. Marcus Vance.');
    }, 1200);
  };

  // Handle Trigger Compliance Scan
  const handleTriggerScan = () => {
    setScanModalOpen(true);
    setScanStep(1);
    setIsScanning(true);

    setTimeout(() => setScanStep(2), 700);
    setTimeout(() => setScanStep(3), 1400);
    setTimeout(() => setScanStep(4), 2100);
    setTimeout(() => {
      setIsScanning(false);
      onNotify?.('Automated compliance scan completed across all 24 agents. WORM ledger updated.');
    }, 2800);
  };

  // Handle Export Audit Bundle
  const handleExportAuditBundle = () => {
    const payload = {
      platform: 'NexusGuard',
      suite: 'AI Governance & Regulatory Compliance Center',
      exportedAt: new Date().toISOString(),
      standards: ['NIST AI RMF 1.0', 'ISO/IEC 42001:2023', 'EU AI Act', 'SOC 2 Type II AI'],
      executiveScorecards: {
        aiGovernanceScore: '96.4 / 100',
        policyInvariantsRate: '97.8%',
        cryptoAuditRate: '99.2%',
        identityAttestationRate: '100% (24/24 Agents)',
        hitlOversightRate: '100.0%',
        dataBoundariesRate: '98.6%',
      },
      activeControls: initialControls,
      cryptographicRootSeal: {
        block: 4198102,
        hash: '0x8f4b0918c72839e9a11003fa08219481be8329a10023',
        status: 'CONFIRMED',
      },
      certifications: ['FedRAMP High Ready', 'FIPS 140-3 Enclave', 'GDPR Article 22 Compliant'],
      auditor: 'Ernst & Young (Cyber Trust)',
    };

    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nexusguard-audit-bundle-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    onNotify?.('Audit Bundle exported as JSON.');
  };

  // Handle Board Briefing
  const handleDownloadBriefing = () => {
    const content = `# NexusGuard Executive AI Governance Briefing (Q1 2025)
Prepared for: Board of Directors & Chief AI Security Officer
Date: ${new Date().toLocaleDateString()}
Status: SOC-AUDIT READY • NIST AI RMF PASS (96.4/100)

## Executive Summary
All 24 active autonomous agents operate inside authenticated mTLS enclaves.
Zero uncontained privilege escalations were detected during the past 90 days.
Weekly RedAgent adversarial regressions confirmed 1,842 of 1,842 threat payloads neutralized.

## Key Compliance Indicators
- NIST AI RMF Overall Compliance: 96.4%
- Policy Invariants Verified: 97.8% (18,492 ops)
- Identity & Attestation: 100% Hardware Bound
- Dual-Key Quorum: 100% Enforced on Sensitive Financial Transactions
`;

    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nexusguard-board-briefing-${new Date().toISOString().slice(0, 10)}.md`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    onNotify?.('Executive Board Briefing downloaded in Markdown format.');
  };

  // Copy hash helper
  const copyText = (txt: string, msg: string) => {
    navigator.clipboard.writeText(txt);
    onNotify?.(msg);
  };

  return (
    <div className="governance-page">
      {/* 1. HEADER BAR & BREADCRUMBS */}
      <section className="gov-header-section">
        <div className="gov-breadcrumbs">
          <span>GOVERNANCE &amp; ASSURANCE</span>
          <span className="crumb-pipe">/</span>
          <span>REGULATORY COMPLIANCE</span>
          <span className="crumb-pipe">/</span>
          <span className="text-cyan font-bold">NIST AI RMF &amp; ISO 42001</span>
        </div>

        <div className="gov-header-row">
          <div className="gov-header-titles">
            <h1 className="gov-page-title">
              AI Governance &amp; Regulatory Compliance Center
            </h1>
            <p className="gov-page-desc">
              Autonomous AI alignment tracking, continuous regulatory posture auditing, and cryptographic certification across all active agent workloads.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="gov-header-actions">
            <button
              type="button"
              className="gov-btn gov-btn-secondary"
              onClick={handleExportAuditBundle}
              title="Download verified compliance bundle in JSON format"
            >
              <Download size={15} className="text-cyan" />
              <span>Export Audit Bundle (PDF/JSON)</span>
            </button>

            <button
              type="button"
              className="gov-btn gov-btn-secondary"
              onClick={handleDownloadBriefing}
              title="Download executive briefing summary for board review"
            >
              <FileSpreadsheet size={15} className="text-secondary" />
              <span>Executive Board Briefing</span>
            </button>

            <button
              type="button"
              className="gov-btn gov-btn-primary"
              onClick={handleTriggerScan}
              title="Trigger real-time compliance scan across all 24 agents"
            >
              <Radar size={15} />
              <span>Schedule Automated Compliance Scan</span>
            </button>
          </div>
        </div>
      </section>

      {/* 2. TOP EXECUTIVE COMPLIANCE SCORECARDS (6 METRICS) */}
      <section className="gov-kpi-grid">
        {/* Scorecard 1: AI Governance */}
        <div className="gov-kpi-card">
          <div className="kpi-card-head">
            <span className="kpi-kicker">AI Governance</span>
            <span className="kpi-badge badge-mint uppercase">NIST RMF Pass</span>
          </div>
          <div className="kpi-metric-row">
            <span className="kpi-num">96.4</span>
            <span className="kpi-unit">/ 100</span>
          </div>
          <div className="kpi-foot-row">
            <span className="text-mint font-mono text-xs flex items-center gap-1">
              <TrendingUp size={13} /> +1.2% this epoch
            </span>
            <span className="text-outline text-xs">v1.0 Certified</span>
          </div>
        </div>

        {/* Scorecard 2: Policy Invariants */}
        <div className="gov-kpi-card">
          <div className="kpi-card-head">
            <span className="kpi-kicker">Policy Invariants</span>
            <ShieldCheck size={18} className="text-mint" />
          </div>
          <div className="kpi-metric-row">
            <span className="kpi-num text-cyan">97.8%</span>
          </div>
          <div className="kpi-foot-text">
            18,492 / 18,910 ops checked
          </div>
        </div>

        {/* Scorecard 3: Crypto Audit */}
        <div className="gov-kpi-card">
          <div className="kpi-card-head">
            <span className="kpi-kicker">Crypto Audit</span>
            <Fingerprint size={18} className="text-secondary" />
          </div>
          <div className="kpi-metric-row">
            <span className="kpi-num">99.2%</span>
          </div>
          <div className="kpi-foot-text">
            Zero-Knowledge Merkle active
          </div>
        </div>

        {/* Scorecard 4: Identity Attestation */}
        <div className="gov-kpi-card">
          <div className="kpi-card-head">
            <span className="kpi-kicker">Identity Attestation</span>
            <span className="kpi-badge badge-mint">100%</span>
          </div>
          <div className="kpi-metric-row">
            <span className="kpi-num text-mint">24 / 24</span>
          </div>
          <div className="kpi-foot-text">
            mTLS &amp; AWS Nitro Enclave
          </div>
        </div>

        {/* Scorecard 5: HITL Oversight */}
        <div className="gov-kpi-card">
          <div className="kpi-card-head">
            <span className="kpi-kicker">HITL Oversight</span>
            <Users size={18} className="text-cyan" />
          </div>
          <div className="kpi-metric-row">
            <span className="kpi-num">100.0%</span>
          </div>
          <div className="kpi-foot-text text-mint">
            0 unapproved high-risk ops
          </div>
        </div>

        {/* Scorecard 6: Data Boundaries */}
        <div className="gov-kpi-card">
          <div className="kpi-card-head">
            <span className="kpi-kicker">Data Boundaries</span>
            <Shield size={18} className="text-secondary" />
          </div>
          <div className="kpi-metric-row">
            <span className="kpi-num">98.6%</span>
          </div>
          <div className="kpi-foot-text">
            DLP &amp; sanitization active
          </div>
        </div>
      </section>

      {/* 3. MAIN COMPLIANCE FRAMEWORKS & CONTROLS MATRIX (7 COLS LEFT / 5 COLS RIGHT) */}
      <section className="gov-main-grid">
        {/* LEFT COLUMN: 7 COLS */}
        <div className="gov-left-col">
          {/* Framework Tabs & Pillars Card */}
          <div className="framework-tabs-card">
            {/* Framework Navigation Tabs */}
            <div className="framework-tabs-nav">
              <button
                type="button"
                className={`framework-tab-btn ${activeFramework === 'nist' ? 'tab-active' : ''}`}
                onClick={() => setActiveFramework('nist')}
              >
                NIST AI RMF 1.0 (Gov/Map/Measure/Manage)
              </button>
              <button
                type="button"
                className={`framework-tab-btn ${activeFramework === 'iso' ? 'tab-active' : ''}`}
                onClick={() => setActiveFramework('iso')}
              >
                ISO/IEC 42001:2023
              </button>
              <button
                type="button"
                className={`framework-tab-btn ${activeFramework === 'euai' ? 'tab-active' : ''}`}
                onClick={() => setActiveFramework('euai')}
              >
                EU AI Act (High-Risk AI)
              </button>
              <button
                type="button"
                className={`framework-tab-btn ${activeFramework === 'soc2' ? 'tab-active' : ''}`}
                onClick={() => setActiveFramework('soc2')}
              >
                SOC 2 Type II AI
              </button>
              <button
                type="button"
                className={`framework-tab-btn ${activeFramework === 'hipaa' ? 'tab-active' : ''}`}
                onClick={() => setActiveFramework('hipaa')}
              >
                HIPAA / BAA Boundaries
              </button>
            </div>

            {/* Framework Progress Breakdown (4 Pillars) */}
            <div className="pillars-grid">
              {frameworkPillars.map((pillar, idx) => {
                const colorClass =
                  idx === 0
                    ? 'text-cyan bar-cyan'
                    : idx === 1
                    ? 'text-secondary bar-secondary'
                    : idx === 2
                    ? 'text-mint bar-mint'
                    : 'text-primary bar-primary';

                return (
                  <div key={pillar.name} className="pillar-item-box">
                    <div className="pillar-item-head">
                      <span className={`pillar-name ${colorClass.split(' ')[0]}`}>
                        {pillar.name}
                      </span>
                      <strong className="pillar-rate">{pillar.rate}</strong>
                    </div>
                    <div className="pillar-bar-bg">
                      <div
                        className={`pillar-bar-fill ${colorClass.split(' ')[1]}`}
                        style={{ width: pillar.rate }}
                      />
                    </div>
                    <p className="pillar-desc">{pillar.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Interactive Compliance Controls Table */}
          <div className="controls-table-card">
            <div className="controls-table-header">
              <div>
                <h2 className="controls-table-title">Active Regulatory Controls Matrix</h2>
                <p className="controls-table-sub">
                  Real-time enforcement audit and leaf verification in NexusGuard WORM ledger.
                </p>
              </div>

              <div className="controls-filter-group">
                <span className="filter-label">FILTER:</span>
                <button
                  type="button"
                  className={`filter-chip ${controlFilter === 'ALL' ? 'filter-chip-active' : ''}`}
                  onClick={() => setControlFilter('ALL')}
                >
                  ALL ({initialControls.length})
                </button>
                <button
                  type="button"
                  className={`filter-chip ${controlFilter === 'HIGHRISK' ? 'filter-chip-active' : ''}`}
                  onClick={() => setControlFilter('HIGHRISK')}
                >
                  HIGH RISK ({initialControls.filter((c) => c.isHighRisk).length})
                </button>
              </div>
            </div>

            <div className="table-scroll-wrap">
              <table className="gov-table">
                <thead>
                  <tr>
                    <th>Control ID</th>
                    <th>Standard</th>
                    <th>Automated Mechanism</th>
                    <th>Fleet Scope</th>
                    <th>Status</th>
                    <th className="text-right">Evidence Hash</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredControls.map((ctrl, i) => (
                    <tr key={ctrl.id} className={i % 2 === 1 ? 'row-alt' : ''}>
                      <td>
                        <strong className="ctrl-code-text">{ctrl.code}</strong>
                      </td>
                      <td>
                        <div className="ctrl-standard-title">{ctrl.standard}</div>
                        <div className="ctrl-standard-sub">{ctrl.standardDesc}</div>
                      </td>
                      <td className="ctrl-mechanism-text">
                        {ctrl.mechanism}
                      </td>
                      <td>
                        <span className="ctrl-scope-pill">{ctrl.scope}</span>
                      </td>
                      <td>
                        <span
                          className={`ctrl-status-badge ${
                            ctrl.status === 'ENFORCED' || ctrl.status === 'ACTIVE' || ctrl.status === 'CERTIFIED'
                              ? 'status-mint'
                              : 'status-secondary'
                          }`}
                        >
                          {ctrl.status} ({ctrl.statusRate})
                        </span>
                      </td>
                      <td className="text-right">
                        <button
                          type="button"
                          className="evidence-hash-link"
                          onClick={() => setSelectedLeaf(ctrl)}
                          title="Inspect Merkle cryptographic evidence"
                        >
                          {ctrl.evidenceLeaf}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: 5 COLS */}
        <div className="gov-right-col">
          {/* Executive Risk & Compliance Dossier Card */}
          <div className="executive-dossier-card">
            <div className="dossier-glow-orb" />

            {/* Dossier Header */}
            <div className="dossier-top-line">
              <div>
                <span className="dossier-kicker">OFFICIAL ATTESTATION</span>
                <h2 className="dossier-title">Executive Compliance Dossier</h2>
              </div>
              <span className="dossier-audit-chip">
                SOC-AUDIT READY: 2025-Q1
              </span>
            </div>

            {/* Cryptographic Root Seal Box */}
            <div className="crypto-seal-card">
              <div className="seal-card-head">
                <div className="seal-head-left">
                  <BadgeCheck size={18} className="text-cyan" />
                  <span className="seal-label">NEXUSGUARD-ZERO-KNOWLEDGE ROOT SEAL</span>
                </div>
                <span className="seal-block">BLOCK #4,198,102</span>
              </div>

              <div
                className="seal-hash-display"
                onClick={() =>
                  copyText(
                    '0x8f4b0918c72839e9a11003fa08219481be8329a10023',
                    'Cryptographic root hash copied to clipboard.'
                  )
                }
                title="Click to copy hash"
              >
                0x8f4b0918c72839e9a11003fa08219481be8329a10023
              </div>

              <div className="seal-card-foot">
                <span className="text-mint font-mono font-semibold">
                  Cryptographic Validity: CONFIRMED
                </span>
                <span className="text-outline font-mono">Epoch 108</span>
              </div>
            </div>

            {/* Automated Findings & Observations */}
            <div className="findings-section">
              <span className="findings-header-title">Automated Findings &amp; Observations</span>
              <div className="findings-list">
                <div className="finding-item">
                  <CheckCircle2 size={18} className="text-mint shrink-0 mt-0.5" />
                  <div>
                    <strong className="finding-title">Zero Privilege Escalation</strong>
                    <p className="finding-desc">
                      Zero uncontained privilege escalations detected during last 90 continuous days.
                    </p>
                  </div>
                </div>

                <div className="finding-item">
                  <Shield size={18} className="text-secondary shrink-0 mt-0.5" />
                  <div>
                    <strong className="finding-title">Boundary Intercept Log</strong>
                    <p className="finding-desc">
                      FIN-AGENT-01 salary alteration intercepted at boundary before commit.
                    </p>
                  </div>
                </div>

                <div className="finding-item">
                  <Terminal size={18} className="text-cyan shrink-0 mt-0.5" />
                  <div>
                    <strong className="finding-title">RedAgent Adversary Regressions</strong>
                    <p className="finding-desc">
                      Continuous weekly regressions: 1,842 / 1,842 threat payloads neutralized.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Download Verified Artifacts */}
            <div className="artifacts-section">
              <span className="artifacts-header-title">Download Verified Artifacts</span>
              <div className="artifacts-list">
                <a
                  href="#download-pdf"
                  className="artifact-row"
                  onClick={(e) => {
                    e.preventDefault();
                    handleDownloadBriefing();
                  }}
                >
                  <div className="artifact-left">
                    <FileText size={16} className="text-error" />
                    <span className="artifact-name">NIST_AI_RMF_Executive_Summary_2025.pdf</span>
                  </div>
                  <span className="artifact-size">2.4 MB</span>
                </a>

                <a
                  href="#download-json"
                  className="artifact-row"
                  onClick={(e) => {
                    e.preventDefault();
                    handleExportAuditBundle();
                  }}
                >
                  <div className="artifact-left">
                    <FileCode size={16} className="text-secondary" />
                    <span className="artifact-name">EU_AI_Act_High_Risk_Self_Assessment.json</span>
                  </div>
                  <span className="artifact-size">840 KB</span>
                </a>

                <a
                  href="#download-sig"
                  className="artifact-row"
                  onClick={(e) => {
                    e.preventDefault();
                    copyText(
                      'MEYCIQD74a8f902ba98e10034a77bc9012e84711822cd01a99==',
                      'Merkle Proof Signature downloaded to clipboard.'
                    );
                  }}
                >
                  <div className="artifact-left">
                    <Key size={16} className="text-mint" />
                    <span className="artifact-name">Cryptographic_Ledger_Merkle_Proof.sig</span>
                  </div>
                  <span className="artifact-size">64 KB</span>
                </a>
              </div>
            </div>

            {/* Attestation Sign Button */}
            <button
              type="button"
              className={`attestation-sign-btn ${attestationSigned ? 'btn-signed' : ''}`}
              onClick={handleSignAttestation}
              disabled={isSigning}
            >
              {isSigning ? (
                <>
                  <RefreshCw size={16} className="anim-spin" />
                  <span>Sealing Cryptographic Attestation...</span>
                </>
              ) : attestationSigned ? (
                <>
                  <CheckCircle2 size={16} />
                  <span>Attestation Signed &amp; Chained (Col. M. Vance)</span>
                </>
              ) : (
                <>
                  <Award size={16} />
                  <span>Sign &amp; Seal Compliance Attestation (Chief AI Security Officer)</span>
                </>
              )}
            </button>
          </div>
        </div>
      </section>

      {/* 4. BOTTOM COMPLIANCE TREND & AUDIT RADAR SECTION (8 COLS / 4 COLS) */}
      <section className="gov-bottom-grid">
        {/* 12-Month Adherence Trajectory (8 cols) */}
        <div className="trajectory-card-col">
          <div className="trajectory-head-row">
            <div>
              <h2 className="trajectory-title">12-Month Compliance Adherence Trajectory</h2>
              <p className="trajectory-sub">
                Continuous telemetry score progression (from 91.0% to 96.4%)
              </p>
            </div>
            <div className="trajectory-legend">
              <div className="legend-chip">
                <span className="legend-dot dot-measured" />
                <span>Measured Score</span>
              </div>
              <div className="legend-chip">
                <span className="legend-bar bar-baseline" />
                <span className="text-outline">SOC Baseline (90%)</span>
              </div>
            </div>
          </div>

          {/* Inline SVG Trend Chart */}
          <div className="chart-svg-container">
            <svg className="trajectory-chart-svg" preserveAspectRatio="none" viewBox="0 0 600 140">
              <defs>
                <linearGradient id="gradientComplianceArea" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#00e5ff" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#00e5ff" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Baseline dashed line at y=105 (90%) */}
              <line x1="0" y1="105" x2="600" y2="105" stroke="#3b494c" strokeDasharray="4 4" strokeWidth="1.5" />

              {/* Gradient Area Fill */}
              <polygon
                fill="url(#gradientComplianceArea)"
                points="0,100 50,96 100,92 150,88 200,80 250,75 300,68 350,60 400,52 450,42 500,32 550,25 600,18 600,140 0,140"
              />

              {/* Progression Curve Line */}
              <polyline
                fill="none"
                stroke="#00e5ff"
                strokeWidth="2.5"
                points="0,100 50,96 100,92 150,88 200,80 250,75 300,68 350,60 400,52 450,42 500,32 550,25 600,18"
              />

              {/* Key Data Circles */}
              <circle cx="0" cy="100" r="3.5" fill="#00e5ff" />
              <circle cx="200" cy="80" r="3.5" fill="#00e5ff" />
              <circle cx="400" cy="52" r="3.5" fill="#00e5ff" />
              <circle cx="600" cy="18" r="5" fill="#5be9ad" stroke="#001f24" strokeWidth="1.5" />
            </svg>
          </div>

          {/* X-Axis Month Markers */}
          <div className="chart-x-axis">
            <span>MAY 2024 (91.0%)</span>
            <span className="hidden-mobile">AUG 2024 (92.4%)</span>
            <span>NOV 2024 (94.2%)</span>
            <span className="hidden-mobile">FEB 2025 (95.8%)</span>
            <span className="text-mint font-bold">CURRENT: APR 2025 (96.4%)</span>
          </div>
        </div>

        {/* Tier-1 Certifications & Hardware Assurance (4 cols) */}
        <div className="certifications-card-col">
          <div className="certs-head-row">
            <div>
              <h2 className="certs-title">Tier-1 Certifications</h2>
              <p className="certs-sub">
                Autonomous environment hardware lock and sovereign jurisdiction seals.
              </p>
            </div>
            <CheckCircle2 size={20} className="text-mint shrink-0" />
          </div>

          <div className="certs-stack">
            <div className="cert-item-row">
              <div className="cert-item-left">
                <ShieldCheck size={18} className="text-cyan" />
                <div>
                  <strong className="cert-name">FedRAMP High Ready</strong>
                  <span className="cert-spec">NIST SP 800-53 Rev 5 AI Controls</span>
                </div>
              </div>
              <span className="cert-status-badge">ACTIVE</span>
            </div>

            <div className="cert-item-row">
              <div className="cert-item-left">
                <HardDrive size={18} className="text-secondary" />
                <div>
                  <strong className="cert-name">FIPS 140-3 Enclave</strong>
                  <span className="cert-spec">Hardware-Secured Keystore HSM</span>
                </div>
              </div>
              <span className="cert-status-badge">VERIFIED</span>
            </div>

            <div className="cert-item-row">
              <div className="cert-item-left">
                <Gavel size={18} className="text-mint" />
                <div>
                  <strong className="cert-name">GDPR Article 22 Compliant</strong>
                  <span className="cert-spec">Right to Explanation &amp; Non-Automated Review</span>
                </div>
              </div>
              <span className="cert-status-badge">COMPLIANT</span>
            </div>
          </div>

          <div className="certs-foot-bar">
            <span>Auditor: Ernst &amp; Young (Cyber Trust)</span>
            <button
              type="button"
              className="cert-verify-link"
              onClick={() =>
                copyText(
                  'EY-CYBER-TRUST-CERT-2025-09884-VALID',
                  'Auditor verification key verified: EY-CYBER-TRUST-CERT-2025'
                )
              }
            >
              Verify Key ↗
            </button>
          </div>
        </div>
      </section>

      {/* 5. MODAL 1: EVIDENCE LEAF CRYPTOGRAPHIC INSPECTOR */}
      {selectedLeaf && (
        <div className="gov-modal-backdrop" onClick={() => setSelectedLeaf(null)}>
          <div className="gov-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-head">
              <div className="modal-title-wrap">
                <Fingerprint size={18} className="text-cyan" />
                <h3>Merkle Evidence Proof: {selectedLeaf.evidenceLeaf}</h3>
              </div>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setSelectedLeaf(null)}
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            <div className="modal-body-evidence">
              <div className="evidence-grid">
                <div className="evidence-prop">
                  <span className="prop-label">Control ID</span>
                  <strong className="prop-val text-cyan">{selectedLeaf.code}</strong>
                </div>
                <div className="evidence-prop">
                  <span className="prop-label">Standard Reference</span>
                  <span className="prop-val">{selectedLeaf.standard}</span>
                </div>
                <div className="evidence-prop">
                  <span className="prop-label">Block Height</span>
                  <span className="prop-val font-mono">#{selectedLeaf.blockNumber}</span>
                </div>
                <div className="evidence-prop">
                  <span className="prop-label">Status Verification</span>
                  <span className="prop-val text-mint font-semibold">
                    {selectedLeaf.status} ({selectedLeaf.statusRate})
                  </span>
                </div>
              </div>

              <div className="evidence-hash-box">
                <div className="hash-box-top">
                  <span className="prop-label">Cryptographic Leaf Hash (SHA-256 Merkle Proof)</span>
                  <button
                    type="button"
                    className="copy-hash-btn"
                    onClick={() => copyText(selectedLeaf.hash, 'Hash copied.')}
                  >
                    <Copy size={12} />
                    <span>Copy Hash</span>
                  </button>
                </div>
                <code className="evidence-hash-code">{selectedLeaf.hash}</code>
              </div>

              <div className="evidence-verifying-node">
                <span className="prop-label">Verifying Sovereign Enclave Node</span>
                <span className="node-val font-mono">{selectedLeaf.verifyingNode}</span>
              </div>
            </div>

            <div className="modal-foot-actions">
              <button
                type="button"
                className="gov-btn gov-btn-secondary"
                onClick={() => setSelectedLeaf(null)}
              >
                Close Proof
              </button>
              <button
                type="button"
                className="gov-btn gov-btn-primary"
                onClick={() => {
                  copyText(JSON.stringify(selectedLeaf, null, 2), 'Evidence JSON copied.');
                  setSelectedLeaf(null);
                }}
              >
                Copy Complete Evidence JSON
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. MODAL 2: AUTOMATED COMPLIANCE SCAN SIMULATION */}
      {scanModalOpen && (
        <div className="gov-modal-backdrop" onClick={() => !isScanning && setScanModalOpen(false)}>
          <div className="gov-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-head">
              <div className="modal-title-wrap">
                <Radar size={18} className="text-cyan anim-spin" />
                <h3>Automated Regulatory Compliance Scan</h3>
              </div>
              {!isScanning && (
                <button
                  type="button"
                  className="modal-close-btn"
                  onClick={() => setScanModalOpen(false)}
                  aria-label="Close"
                >
                  <X size={18} />
                </button>
              )}
            </div>

            <div className="modal-body-scan">
              <p className="scan-intro-desc">
                Scanning autonomous agent fleet against NIST AI RMF, ISO 42001, and EU AI Act regulatory requirements...
              </p>

              <div className="scan-steps-stack">
                <div className={`scan-step-item ${scanStep >= 1 ? 'step-done' : 'step-pending'}`}>
                  {scanStep > 1 ? (
                    <CheckCircle2 size={16} className="text-mint shrink-0" />
                  ) : scanStep === 1 ? (
                    <RefreshCw size={16} className="text-cyan anim-spin shrink-0" />
                  ) : (
                    <Clock size={16} className="text-outline shrink-0" />
                  )}
                  <span>1. Validating mTLS Ed25519 identity certificates &amp; AWS Nitro enclaves (24/24 agents)...</span>
                </div>

                <div className={`scan-step-item ${scanStep >= 2 ? 'step-done' : 'step-pending'}`}>
                  {scanStep > 2 ? (
                    <CheckCircle2 size={16} className="text-mint shrink-0" />
                  ) : scanStep === 2 ? (
                    <RefreshCw size={16} className="text-cyan anim-spin shrink-0" />
                  ) : (
                    <Clock size={16} className="text-outline shrink-0" />
                  )}
                  <span>2. Auditing semantic intent invariant rules and SQL boundary AST parsers...</span>
                </div>

                <div className={`scan-step-item ${scanStep >= 3 ? 'step-done' : 'step-pending'}`}>
                  {scanStep > 3 ? (
                    <CheckCircle2 size={16} className="text-mint shrink-0" />
                  ) : scanStep === 3 ? (
                    <RefreshCw size={16} className="text-cyan anim-spin shrink-0" />
                  ) : (
                    <Clock size={16} className="text-outline shrink-0" />
                  )}
                  <span>3. Verifying zero unapproved high-risk operations and dual-key signatures...</span>
                </div>

                <div className={`scan-step-item ${scanStep >= 4 ? 'step-done' : 'step-pending'}`}>
                  {scanStep >= 4 ? (
                    <CheckCircle2 size={16} className="text-mint shrink-0" />
                  ) : (
                    <Clock size={16} className="text-outline shrink-0" />
                  )}
                  <span>4. Sealing Merkle tree WORM proof block #4,198,103 with root hash confirmation...</span>
                </div>
              </div>

              {!isScanning && (
                <div className="scan-complete-alert">
                  <CheckCircle2 size={20} className="text-mint" />
                  <div>
                    <strong className="text-mint">Fleet Posture 96.4% Verified</strong>
                    <p className="text-xs text-on-surface-variant m-0">All 24 agents verified compliant with zero active boundary infractions.</p>
                  </div>
                </div>
              )}
            </div>

            <div className="modal-foot-actions">
              <button
                type="button"
                className="gov-btn gov-btn-primary"
                onClick={() => setScanModalOpen(false)}
                disabled={isScanning}
              >
                {isScanning ? 'Scan in progress...' : 'Complete & Return to Console'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
