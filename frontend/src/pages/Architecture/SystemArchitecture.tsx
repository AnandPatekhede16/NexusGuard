import { useState, useEffect, type Dispatch, type SetStateAction } from 'react';
import {
  Activity, AlertTriangle, ArrowRight, BadgeCheck, Check,
  CheckCircle2, ChevronRight, Copy, Cpu, Database,
  Download, ExternalLink, Eye, FileCode, FileText, Fingerprint,
  Gauge, Globe, HardDrive, HelpCircle, History, Info, Key,
  Layers, Lock, Network, Play, RefreshCw, Search,
  Server, Shield, ShieldAlert, ShieldCheck, Siren,
  Sparkles, Terminal, Timer, Trash2, TrendingUp,
  UserCheck, Users, Wifi, X, Zap
} from 'lucide-react';
import type { Agent } from '../Agents/agentData';
import './system-architecture.css';

export interface SystemArchitectureProps {
  agents?: Agent[];
  setAgents?: Dispatch<SetStateAction<Agent[]>>;
  onNotify?: (msg: string) => void;
  onOpenAgentDetail?: (agentId: string) => void;
}

export type ArchTab = 'overview' | 'internals' | 'cryptography' | 'attestation' | 'latency';

export interface SubEngine {
  id: string;
  num: string;
  code: string;
  name: string;
  latencyMs: number;
  desc: string;
  statusTag: string;
  statusTone: 'mint' | 'cyan' | 'blue' | 'purple';
  metricLabel: string;
  metricValue: string;
  techStack: string;
  details: string[];
}

const subEngines: SubEngine[] = [
  {
    id: 'eng-01',
    num: '01',
    code: 'ATTESTATION',
    name: 'Identity & Machine Attestation',
    latencyMs: 0.12,
    desc: 'Hardware TPM 2.0 crypt-enclave validation. Ed25519 node keypair verification with Nitro isolation.',
    statusTag: 'PASSED',
    statusTone: 'mint',
    metricLabel: 'HW: TPM 2.0 / Nitro',
    metricValue: 'PCR0-2 Verified',
    techStack: 'Rust / Nitro Enclaves / TPM 2.0',
    details: [
      'PCR0, PCR1, PCR2 hardware register hashes cryptographically measured.',
      'AWS KMS root of trust signs node attestation certificates with 15-minute lease.',
      'Prevents malicious container execution and compromised sidecar spoofing.',
    ],
  },
  {
    id: 'eng-02',
    num: '02',
    code: 'SEMANTIC FIREWALL',
    name: 'Intent Extraction & AST Parser',
    latencyMs: 1.14,
    desc: 'Decompiles agent prompt output into Abstract Syntax Trees. Real-time NLP intent bounding and schema sanity checks.',
    statusTag: 'VALIDATED',
    statusTone: 'mint',
    metricLabel: 'Grammar: strict-sql-ast',
    metricValue: 'Zero-Bypass',
    techStack: 'Tree-Sitter / ANTLR4 / ONNX Intent Model',
    details: [
      'AST tokenizer decomposes SQL, GraphQL, Bash, and JSON-RPC payloads.',
      'Identifies malicious DDL attempts (DROP, ALTER, TRUNCATE) before socket transmission.',
      'Synthesizes neural intent confidence score against approved permission scopes.',
    ],
  },
  {
    id: 'eng-03',
    num: '03',
    code: 'INVARIANTS',
    name: 'Dynamic Invariant Engine',
    latencyMs: 0.42,
    desc: 'Rego OPA & CEL deterministic rules. Hard state invariants: table mutation ceilings, spend quotas, rate bounds.',
    statusTag: 'INVARIANT_OK',
    statusTone: 'mint',
    metricLabel: 'CEL Rules: 142 Active',
    metricValue: '100% Passing',
    techStack: 'Google CEL-Rust / Open Policy Agent',
    details: [
      'Evaluates compiled Common Expression Language (CEL) constraints in sub-500us.',
      'Enforces tenant boundary isolation and dynamic credit quota locks.',
      'Guarantees mathematical correctness of state updates without runtime locks.',
    ],
  },
  {
    id: 'eng-04',
    num: '04',
    code: 'RISK ENGINE',
    name: 'Multi-Dimensional Risk Engine',
    latencyMs: 0.28,
    desc: 'Calculates action sensitivity, call velocity, payload variance, and temporal drift against historical baselines.',
    statusTag: 'LOW RISK',
    statusTone: 'cyan',
    metricLabel: 'Score: 12/100 (Nominal)',
    metricValue: 'Drift +0.8%',
    techStack: 'Vector Covariance / Bayesian Probability Matrix',
    details: [
      'Tracks 5-vector anomaly metrics: behavioral drift, tool egress, auth state, schema probing, IPC drift.',
      'Maintains baseline profile for all registered autonomous agents.',
      'Automatically flags requests exceeding 40 risk threshold for mandatory review.',
    ],
  },
  {
    id: 'eng-05',
    num: '05',
    code: 'THREAT DETECTOR',
    name: 'Autonomous OWASP Interceptor',
    latencyMs: 0.19,
    desc: 'Prevents Prompt Injections (LLM01), Memory Poisoning, Jailbreak vectors, and hidden ASCII steerings in payloads.',
    statusTag: 'NO ANOMALY',
    statusTone: 'mint',
    metricLabel: 'OWASP Core: 10/10 Shielded',
    metricValue: 'eBPF Hooked',
    techStack: 'eBPF Kernel Socket Filters / Vector Signature Index',
    details: [
      'Inspects input context buffers for indirect prompt injection and XML steganography.',
      'Disrupts recursive loop attacks and agent impersonation vectors.',
      'Directly terminates offending TCP connections via kernel-level packet drops.',
    ],
  },
  {
    id: 'eng-06',
    num: '06',
    code: 'TRUST MATRIX',
    name: 'Adaptive Trust & Reputation',
    latencyMs: 0.15,
    desc: 'Dynamic Bayesian reputation matrix with half-life recovery models. Immediate capability degradation on policy misses.',
    statusTag: 'ALPHA-TIER',
    statusTone: 'mint',
    metricLabel: 'Half-life: 14 Days',
    metricValue: 'Optimal',
    techStack: 'Sigmoid Decay Engine / Cryptographic Score Registry',
    details: [
      'Dynamic trust score calculation based on policy compliance, identity, cadence, and tool boundary.',
      'Violations cause immediate 30% score degradation and privilege demotion.',
      'Recovers monotonically over a 14-day half-life upon clean consecutive transactions.',
    ],
  },
  {
    id: 'eng-07',
    num: '07',
    code: 'TOOL GATEWAY',
    name: 'Tool Gateway & Reverse Proxy',
    latencyMs: 0.35,
    desc: 'Deterministic routing proxy with inline Data Loss Prevention (DLP), token anonymization, and rate controls.',
    statusTag: 'ENGAGED',
    statusTone: 'cyan',
    metricLabel: 'DLP Mode: Real-time Mask',
    metricValue: 'Inline Active',
    techStack: 'Envoy / Tokio Rust / Ephemeral Tokenizer',
    details: [
      'Masks PII, SSNs, credit cards, and API secrets with HMAC SHA-256 tokens.',
      'Pins mTLS certificates and injects short-lived Nitro proxy leases.',
      'Enforces strict token bucket rate limits per agent session.',
    ],
  },
  {
    id: 'eng-08',
    num: '08',
    code: 'CRYPT LEDGER',
    name: 'Cryptographic Audit Ledger',
    latencyMs: 0.22,
    desc: 'Tamper-evident Merkle root leaf signing. SHA-256 state chain written asynchronously to immutable WORM store.',
    statusTag: 'SIGNED',
    statusTone: 'mint',
    metricLabel: 'Storage: WORM S3 Enclave',
    metricValue: 'Block #4,891,012',
    techStack: 'Ed25519 / Merkle Tree / WORM S3 Object Lock',
    details: [
      'Every intent evaluated and executed commits a cryptographic leaf.',
      'Merkle root sealed every 60 seconds with CISO signature verification.',
      'Immutable WORM compliance satisfying SEC Rule 17a-4 and SOC2 Type II.',
    ],
  },
];

export interface EgressResource {
  id: string;
  name: string;
  badge: string;
  badgeTone: 'mint' | 'blue' | 'cyan' | 'red';
  desc: string;
  endpoints: string;
  securityMode: string;
}

const egressResources: EgressResource[] = [
  {
    id: 'res-db',
    name: 'Production Databases',
    badge: 'DLP Masked',
    badgeTone: 'mint',
    desc: 'PostgreSQL, Snowflake, Redis Cluster',
    endpoints: 'postgresql://db-fin.internal:5432, s3://corp-lake',
    securityMode: 'Deterministic AST parser + HMAC pseudonymization on sensitive columns.',
  },
  {
    id: 'res-api',
    name: 'Enterprise Cloud APIs',
    badge: 'mTLS Pinned',
    badgeTone: 'mint',
    desc: 'AWS IAM, GCP Services, Azure Graph',
    endpoints: 'https://iam.aws.internal, https://graph.microsoft.com',
    securityMode: 'Nitro short-lived STS tokens + IP pinout verification.',
  },
  {
    id: 'res-browser',
    name: 'Sandboxed Web Browsers',
    badge: 'Zero-Download',
    badgeTone: 'blue',
    desc: 'Isolated Ephemeral Chromium VMs',
    endpoints: 'sandbox-vmid://chromium-vm-cluster:9222',
    securityMode: 'Air-gapped DOM render stream without host filesystem access.',
  },
  {
    id: 'res-git',
    name: 'Code Repos & CI/CD',
    badge: 'Signed Commits',
    badgeTone: 'mint',
    desc: 'GitHub Enterprise, GitLab Pipelines',
    endpoints: 'git@github.internal:core-systems.git',
    securityMode: 'Dual-key GPG commit signing + automated static invariant verification.',
  },
  {
    id: 'res-bus',
    name: 'Inter-Agent Comm Bus',
    badge: 'Encrypted IPC',
    badgeTone: 'cyan',
    desc: 'NexusGuard Secure ZeroMQ Fabric',
    endpoints: 'ipc:///run/nexusguard/agent-bus.sock',
    securityMode: 'CurveZMQ elliptic curve encryption with mutual agent attestation.',
  },
  {
    id: 'res-quarantine',
    name: 'Quarantine Sandbox',
    badge: 'ISOLATED',
    badgeTone: 'red',
    desc: 'Air-gapped sinkhole for anomalous or compromised agents (RedAgent Simulator)',
    endpoints: 'isolated://sinkhole-null.internal',
    securityMode: 'Zero egress routing. Real-time prompt injection capture & tensor telemetry.',
  },
];

export default function SystemArchitecture({
  agents = [],
  onNotify,
  onOpenAgentDetail,
}: SystemArchitectureProps) {
  // Navigation tab state
  const [activeTab, setActiveTab] = useState<ArchTab>('overview');

  // Live telemetry streaming simulation state
  const [telemetryLive, setTelemetryLive] = useState(true);
  const [coreLatency, setCoreLatency] = useState(2.53);
  const [ingressRate, setIngressRate] = useState(42810);
  const [merkleBlock, setMerkleBlock] = useState(4891012);

  // Inspection modal state
  const [selectedEngine, setSelectedEngine] = useState<SubEngine | null>(null);
  const [selectedResource, setSelectedResource] = useState<EgressResource | null>(null);

  // Live simulation jitter effect
  useEffect(() => {
    if (!telemetryLive) return;
    const interval = setInterval(() => {
      // Jitter latency slightly between 2.44 and 2.62 ms
      const jitterLat = Number((2.45 + Math.random() * 0.16).toFixed(2));
      setCoreLatency(jitterLat);

      // Jitter ingress rate slightly
      const jitterRate = 42000 + Math.floor(Math.random() * 1600);
      setIngressRate(jitterRate);

      // Increment Merkle block every now and then
      if (Math.random() > 0.7) {
        setMerkleBlock((b) => b + 1);
      }
    }, 2400);

    return () => clearInterval(interval);
  }, [telemetryLive]);

  // Handle telemetry toggle
  const toggleTelemetryStream = () => {
    setTelemetryLive((prev) => {
      const next = !prev;
      onNotify?.(next ? 'Live architectural telemetry resumed. Fastpath jitter active.' : 'Live telemetry stream paused.');
      return next;
    });
  };

  // Export Spec SVG
  const handleExportSpecSvg = () => {
    const svgContent = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1200" height="700" viewBox="0 0 1200 700" xmlns="http://www.w3.org/2000/svg" style="background:#10131a; font-family:'JetBrains Mono', monospace;">
  <!-- Title -->
  <text x="40" y="50" fill="#00daf3" font-size="20" font-weight="bold">NexusGuard Core System Architecture</text>
  <text x="40" y="75" fill="#849396" font-size="12">Zero-Trust Pipeline Topology &amp; Cryptographic Execution Boundary</text>
  <text x="1000" y="50" fill="#5be9ad" font-size="12">LATENCY: ${coreLatency}ms / SLA: 5.0ms</text>

  <!-- L1: Ingress & Orchestration -->
  <rect x="40" y="110" width="250" height="540" rx="8" fill="#191b23" stroke="#3b494c" stroke-width="1.5"/>
  <text x="60" y="145" fill="#00daf3" font-size="14" font-weight="bold">L1: INGRESS &amp; ORCHESTRATION</text>
  <text x="60" y="170" fill="#849396" font-size="10">mTLS 1.3 / User, Cron, Webhook</text>
  <rect x="55" y="190" width="220" height="60" rx="4" fill="#10131a" stroke="#3b494c"/>
  <text x="65" y="215" fill="#e1e2ec" font-size="11">FIN-AGENT-01 (Trust: 98)</text>
  <text x="65" y="235" fill="#849396" font-size="10">Portfolio Auto-Rebalancer</text>
  <rect x="55" y="260" width="220" height="60" rx="4" fill="#10131a" stroke="#3b494c"/>
  <text x="65" y="285" fill="#e1e2ec" font-size="11">COD-AGENT-01 (Trust: 95)</text>
  <text x="65" y="305" fill="#849396" font-size="10">CI/CD Autonomous Patcher</text>

  <!-- L2: Core Control Plane -->
  <rect x="330" y="110" width="540" height="540" rx="8" fill="#1d1f27" stroke="#00daf3" stroke-width="2"/>
  <text x="350" y="145" fill="#00daf3" font-size="14" font-weight="bold">L2: NEXUSGUARD CORE CONTROL PLANE</text>
  <text x="350" y="170" fill="#5be9ad" font-size="10">Zero-Trust Kernel Active • Agg. Overhead &lt; 1.5ms</text>
  
  <!-- Sub-Engines -->
  <rect x="345" y="190" width="245" height="95" rx="4" fill="#191b23" stroke="#3b494c"/>
  <text x="355" y="215" fill="#00daf3" font-size="10" font-weight="bold">01 // ATTESTATION (0.12ms)</text>
  <text x="355" y="235" fill="#e1e2ec" font-size="10">Identity &amp; TPM 2.0 Enclave</text>

  <rect x="605" y="190" width="245" height="95" rx="4" fill="#191b23" stroke="#3b494c"/>
  <text x="615" y="215" fill="#00daf3" font-size="10" font-weight="bold">02 // SEMANTIC FIREWALL (1.14ms)</text>
  <text x="615" y="235" fill="#e1e2ec" font-size="10">AST Parser &amp; Intent Boundary</text>

  <rect x="345" y="300" width="245" height="95" rx="4" fill="#191b23" stroke="#3b494c"/>
  <text x="355" y="325" fill="#00daf3" font-size="10" font-weight="bold">03 // INVARIANTS (0.42ms)</text>
  <text x="355" y="345" fill="#e1e2ec" font-size="10">Rego OPA &amp; CEL 142 Rules</text>

  <rect x="605" y="300" width="245" height="95" rx="4" fill="#191b23" stroke="#3b494c"/>
  <text x="615" y="325" fill="#00daf3" font-size="10" font-weight="bold">04 // RISK ENGINE (0.28ms)</text>
  <text x="615" y="345" fill="#e1e2ec" font-size="10">Multi-Dimensional Scoring</text>

  <!-- L3 HITL Ring -->
  <rect x="345" y="570" width="510" height="60" rx="4" fill="#0b0e15" stroke="#a3c9ff"/>
  <text x="360" y="605" fill="#a3c9ff" font-size="11" font-weight="bold">L3 HITL ESCALATION RING: 2-Man Quorum Required for Sensitivity Tier ≥ 4</text>

  <!-- L4: Egress & Target Assets -->
  <rect x="910" y="110" width="250" height="540" rx="8" fill="#191b23" stroke="#3b494c" stroke-width="1.5"/>
  <text x="930" y="145" fill="#5be9ad" font-size="14" font-weight="bold">L4: EGRESS &amp; TARGET ASSETS</text>
  <text x="930" y="170" fill="#849396" font-size="10">PostgreSQL, Cloud APIs, Chromium, Git</text>
</svg>`;

    const blob = new Blob([svgContent], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nexusguard-system-architecture-${new Date().toISOString().slice(0, 10)}.svg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    onNotify?.('System Architecture SVG diagram downloaded successfully.');
  };

  // Blueprint Specification Export
  const handleExportBlueprint = () => {
    const blueprintData = {
      system: 'NexusGuard Autonomous Agent Security Platform',
      version: 'v4.2-PROD',
      exportedAt: new Date().toISOString(),
      architecture: {
        layer1: {
          name: 'Ingress & Agent Orchestration',
          protocol: 'mTLS 1.3 with Ephemeral Ed25519 Handshake',
          sources: ['User Prompts', 'Cron Schedulers', 'Webhooks'],
          frameworks: ['LangChain', 'CrewAI', 'AutoGPT', 'Custom LLM Runtimes'],
          registeredFleetCount: 5,
        },
        layer2: {
          name: 'NexusGuard Core Control Plane',
          executionModel: 'Lock-free Rust io_uring Zero-Copy Packet Engine',
          totalMeanLatencyMs: coreLatency,
          slaMaxLatencyMs: 4.80,
          engines: subEngines.map((e) => ({
            code: e.code,
            name: e.name,
            latencyMs: e.latencyMs,
            status: e.statusTag,
            techStack: e.techStack,
          })),
        },
        layer3: {
          name: 'HITL Escalation Ring',
          quorum: '2-Man Dual Key for Sensitivity Tier >= 4',
          gatekeepers: ['Col. Marcus Vance', 'Elena Rostova'],
        },
        layer4: {
          name: 'Egress Boundaries & Enterprise Assets',
          resources: egressResources.map((r) => ({
            name: r.name,
            protection: r.badge,
            endpoints: r.endpoints,
            securityMode: r.securityMode,
          })),
        },
      },
      telemetry: {
        coreLatencyMs: coreLatency,
        ingressReqPerSec: ingressRate,
        tpmAttestation: '100% TPM 2.0 / AWS Nitro Enclaves',
        ebpfInterceptState: '0.00% Bypass (Active RingBuffer)',
        merkleAnchorBlock: merkleBlock,
        killSwitchState: 'ARMED (0 Tripped)',
      },
    };

    const blob = new Blob([JSON.stringify(blueprintData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nexusguard-architecture-blueprint-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    onNotify?.('NexusGuard Architecture Blueprint spec exported as JSON.');
  };

  return (
    <div className="system-architecture-page">
      {/* Top Header & Controls */}
      <section className="arch-header-section">
        <div className="header-meta">
          <div className="arch-breadcrumbs font-mono">
            <span className="text-cyan">PLATFORM</span>
            <span className="crumb-sep">//</span>
            <span>SYSTEM ARCHITECTURE &amp; TOPOLOGY</span>
            <span className="crumb-sep">//</span>
            <span className="crumb-active text-mint font-semibold">ZERO-TRUST CONTROL PLANE</span>
          </div>

          <h1 className="arch-title">NexusGuard Core System Architecture</h1>

          <p className="arch-subtitle">
            Visual topology of the NexusGuard control plane sitting between autonomous AI agents and enterprise resource boundaries. Real-time deterministic enforcement envelope with zero-loss cryptographic audit roots.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="header-actions font-mono">
          <button
            className="btn-toolbar-subtle"
            onClick={handleExportSpecSvg}
            title="Download architectural diagram as vector SVG"
          >
            <Layers className="text-cyan" size={15} />
            <span>Export Spec (.SVG)</span>
          </button>

          <button
            className="btn-toolbar-subtle"
            onClick={handleExportBlueprint}
            title="Download full architectural blueprint specification"
          >
            <Download className="text-blue" size={15} />
            <span>Blueprint Spec (.JSON)</span>
          </button>

          <button
            id="toggle-telemetry-btn"
            className={`btn-toolbar-primary ${!telemetryLive ? 'btn-telemetry-paused' : ''}`}
            onClick={toggleTelemetryStream}
          >
            <Activity className={telemetryLive ? 'animate-pulse text-background' : 'text-outline'} size={15} />
            <span id="telemetry-btn-text">
              {telemetryLive ? 'Live Telemetry: ACTIVE' : 'Live Telemetry: PAUSED'}
            </span>
          </button>
        </div>
      </section>

      {/* Live SLA & Control Telemetry Strip (6 KPI Cards) */}
      <section aria-label="Architecture Telemetry KPIs" className="arch-telemetry-grid">
        {/* KPI 1 */}
        <div className="kpi-box">
          <div className="kpi-top font-mono">
            <span>CORE LATENCY SLA</span>
            <Timer className="text-mint" size={15} />
          </div>
          <div className="kpi-value-row">
            <strong className="kpi-val" id="rt-latency">{coreLatency.toFixed(2)}</strong>
            <span className="kpi-sub font-mono">ms / 5.0ms</span>
          </div>
          <div className="kpi-bar-wrap">
            <div className="kpi-bar-fill bar-mint" style={{ width: `${(coreLatency / 5.0) * 100}%` }} />
          </div>
        </div>

        {/* KPI 2 */}
        <div className="kpi-box">
          <div className="kpi-top font-mono">
            <span>INGRESS RATE</span>
            <Activity className="text-cyan" size={15} />
          </div>
          <div className="kpi-value-row">
            <strong className="kpi-val">{ingressRate.toLocaleString()}</strong>
            <span className="kpi-sub font-mono">req/s</span>
          </div>
          <div className="kpi-bar-wrap">
            <div className="kpi-bar-fill bar-cyan" style={{ width: '78%' }} />
          </div>
        </div>

        {/* KPI 3 */}
        <div className="kpi-box">
          <div className="kpi-top font-mono">
            <span>ATTESTATION STATE</span>
            <ShieldCheck className="text-mint" size={15} />
          </div>
          <div className="kpi-value-row">
            <strong className="kpi-val text-mint">100%</strong>
            <span className="kpi-sub font-mono">TPM 2.0</span>
          </div>
          <div className="kpi-foot-text font-mono truncate">Nitro Secure Enclave</div>
        </div>

        {/* KPI 4 */}
        <div className="kpi-box">
          <div className="kpi-top font-mono">
            <span>SANDBOX INTERCEPT</span>
            <ShieldAlert className="text-blue" size={15} />
          </div>
          <div className="kpi-value-row">
            <strong className="kpi-val text-blue">0.00%</strong>
            <span className="kpi-sub font-mono">BYPASS</span>
          </div>
          <div className="kpi-foot-text font-mono truncate">eBPF Ring Buffer Active</div>
        </div>

        {/* KPI 5 */}
        <div className="kpi-box">
          <div className="kpi-top font-mono">
            <span>MERKLE ANCHOR</span>
            <Network className="text-cyan" size={15} />
          </div>
          <div className="kpi-value-row">
            <strong className="kpi-val">#{merkleBlock.toLocaleString()}</strong>
          </div>
          <div className="kpi-foot-text font-mono truncate">SHA-256 Root Verified</div>
        </div>

        {/* KPI 6 */}
        <div className="kpi-box">
          <div className="kpi-top font-mono">
            <span>KILL SWITCH STATUS</span>
            <Lock className="text-mint" size={15} />
          </div>
          <div className="kpi-value-row">
            <strong className="kpi-val text-mint">ARMED</strong>
            <span className="kpi-sub font-mono">0 TRIPPED</span>
          </div>
          <div className="kpi-foot-text font-mono truncate">Interlock Standby</div>
        </div>
      </section>

      {/* Architectural Flow Visualization (Main Topology Diagram) */}
      <section className="arch-main-topology-card">
        {/* Topology Header */}
        <div className="topology-card-header">
          <div className="topology-title-block">
            <div className="accent-square" />
            <h2 className="topology-title">
              Zero-Trust Pipeline Topology &amp; Cryptographic Execution Boundary
            </h2>
          </div>

          {/* Legend */}
          <div className="topology-legend font-mono">
            <div className="legend-item">
              <span className="legend-dot dot-mint" />
              <span>Verified Safe Path</span>
            </div>
            <div className="legend-item">
              <span className="legend-dot dot-cyan" />
              <span>Core Control Flow</span>
            </div>
            <div className="legend-item">
              <span className="legend-dot dot-red" />
              <span>Quarantine &amp; Containment</span>
            </div>
          </div>
        </div>

        {/* Diagram 4-Stage Grid (3 cols - 6 cols - 3 cols) */}
        <div className="stages-flow-grid">
          {/* LAYER 1: INGRESS & AGENT ORCHESTRATION (3 COLS) */}
          <div className="stage-column stage-l1">
            <div className="stage-col-header">
              <div className="stage-badge-group">
                <span className="stage-badge font-mono">L1</span>
                <strong className="stage-title font-mono">INGRESS &amp; ORCHESTRATION</strong>
              </div>
              <span className="stage-meta font-mono">mTLS 1.3</span>
            </div>

            {/* Invocation Sources */}
            <div className="sub-module-box">
              <span className="sub-module-label font-mono">Invocation Sources</span>
              <div className="sources-chips-grid font-mono">
                <div className="source-chip">User Prompts</div>
                <div className="source-chip">Cron Schedulers</div>
                <div className="source-chip">Webhooks</div>
              </div>
            </div>

            {/* Runtime Frameworks */}
            <div className="sub-module-box">
              <span className="sub-module-label font-mono">Runtime Frameworks</span>
              <div className="frameworks-pills-row font-mono">
                <span className="framework-pill">LangChain</span>
                <span className="framework-pill">CrewAI</span>
                <span className="framework-pill">AutoGPT</span>
                <span className="framework-pill">Custom LLM Runtimes</span>
              </div>
            </div>

            {/* Active Autonomous Agents */}
            <div className="agents-fleet-box">
              <div className="fleet-header font-mono">
                <span>REGISTERED AGENTS</span>
                <span className="text-mint font-bold">5/5 SECURED</span>
              </div>

              <div className="agents-fleet-list">
                {/* Agent 1 */}
                <div
                  className="fleet-agent-item"
                  onClick={() => onOpenAgentDetail ? onOpenAgentDetail('FIN-AGENT-01') : onNotify?.('Agent FIN-AGENT-01 selected.')}
                  title="Click to view Agent Detail"
                >
                  <div className="fleet-agent-left">
                    <Database size={15} className="text-mint shrink-0" />
                    <div>
                      <div className="agent-code font-mono">FIN-AGENT-01</div>
                      <div className="agent-role truncate">Portfolio Auto-Rebalancer</div>
                    </div>
                  </div>
                  <span className="agent-trust-chip font-mono tone-mint">TRUST 98</span>
                </div>

                {/* Agent 2 */}
                <div
                  className="fleet-agent-item"
                  onClick={() => onOpenAgentDetail ? onOpenAgentDetail('COD-AGENT-01') : onNotify?.('Agent COD-AGENT-01 selected.')}
                  title="Click to view Agent Detail"
                >
                  <div className="fleet-agent-left">
                    <Terminal size={15} className="text-cyan shrink-0" />
                    <div>
                      <div className="agent-code font-mono">COD-AGENT-01</div>
                      <div className="agent-role truncate">CI/CD Autonomous Patcher</div>
                    </div>
                  </div>
                  <span className="agent-trust-chip font-mono tone-cyan">TRUST 95</span>
                </div>

                {/* Agent 3 */}
                <div
                  className="fleet-agent-item"
                  onClick={() => onOpenAgentDetail ? onOpenAgentDetail('RES-AGENT-01') : onNotify?.('Agent RES-AGENT-01 selected.')}
                  title="Click to view Agent Detail"
                >
                  <div className="fleet-agent-left">
                    <TrendingUp size={15} className="text-blue shrink-0" />
                    <div>
                      <div className="agent-code font-mono">RES-AGENT-01</div>
                      <div className="agent-role truncate">Market Research Crawler</div>
                    </div>
                  </div>
                  <span className="agent-trust-chip font-mono tone-blue">TRUST 89</span>
                </div>

                {/* Agent 4 */}
                <div
                  className="fleet-agent-item"
                  onClick={() => onOpenAgentDetail ? onOpenAgentDetail('HR-AGENT-01') : onNotify?.('Agent HR-AGENT-01 selected.')}
                  title="Click to view Agent Detail"
                >
                  <div className="fleet-agent-left">
                    <UserCheck size={15} className="text-outline shrink-0" />
                    <div>
                      <div className="agent-code font-mono">HR-AGENT-01</div>
                      <div className="agent-role truncate">Onboarding Copilot</div>
                    </div>
                  </div>
                  <span className="agent-trust-chip font-mono tone-neutral">TRUST 91</span>
                </div>

                {/* Agent 5 */}
                <div
                  className="fleet-agent-item"
                  onClick={() => onOpenAgentDetail ? onOpenAgentDetail('DB-AGENT-01') : onNotify?.('Agent DB-AGENT-01 selected.')}
                  title="Click to view Agent Detail"
                >
                  <div className="fleet-agent-left">
                    <Server size={15} className="text-cyan shrink-0" />
                    <div>
                      <div className="agent-code font-mono">DB-AGENT-01</div>
                      <div className="agent-role truncate">Database Index Optimizer</div>
                    </div>
                  </div>
                  <span className="agent-trust-chip font-mono tone-mint">TRUST 97</span>
                </div>
              </div>
            </div>

            {/* Handshake Barrier */}
            <div className="barrier-footer-box font-mono">
              <div className="flex items-center gap-1.5">
                <Fingerprint size={14} className="text-cyan" />
                <span>Ephemeral Ed25519 Handshake</span>
              </div>
              <CheckCircle2 size={13} className="text-mint" />
            </div>
          </div>

          {/* LAYER 2: THE NEXUSGUARD CORE CONTROL PLANE (6 COLS) */}
          <div className="stage-column stage-l2">
            <div className="stage-col-header">
              <div className="stage-badge-group">
                <span className="stage-badge badge-primary font-mono">L2</span>
                <div>
                  <strong className="stage-title text-cyan font-mono">NEXUSGUARD CORE CONTROL PLANE</strong>
                  <span className="overhead-tag font-mono">[AGGREGATE OVERHEAD &lt; 1.5ms]</span>
                </div>
              </div>
              <div className="kernel-active-tag font-mono">
                <span className="pulse-dot-mint" />
                <span>Zero-Trust Kernel Active</span>
              </div>
            </div>

            {/* 8 SUB-ENGINES GRID (4x2 layout) */}
            <div className="engines-8-grid">
              {subEngines.map((engine) => (
                <div
                  key={engine.id}
                  className="engine-card"
                  onClick={() => setSelectedEngine(engine)}
                  title={`Click to inspect ${engine.name}`}
                >
                  <div className="engine-card-top font-mono">
                    <span className="engine-code text-cyan">{engine.num} // {engine.code}</span>
                    <span className="engine-latency">{engine.latencyMs.toFixed(2)}ms</span>
                  </div>

                  <h3 className="engine-name font-mono">{engine.name}</h3>

                  <p className="engine-desc">{engine.desc}</p>

                  <div className="engine-card-foot font-mono">
                    <span className="engine-metric truncate">{engine.metricLabel}</span>
                    <span className={`engine-badge badge-${engine.statusTone}`}>{engine.statusTag}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* LAYER 3: HITL ESCALATION RING INTERLAY */}
            <div className="hitl-escalation-bar">
              <div className="hitl-left">
                <ShieldAlert size={16} className="text-secondary shrink-0" />
                <div>
                  <strong className="font-mono text-on-surface">L3 HITL ESCALATION RING:</strong>
                  <span className="hitl-desc"> 2-Man Quorum Required for Sensitivity Tier ≥ 4</span>
                </div>
              </div>

              <div className="hitl-badges font-mono">
                <span className="hitl-gate-badge">SOC 24/7 Gate</span>
                <span className="hitl-kill-badge">Kill-Switch Ready</span>
              </div>
            </div>
          </div>

          {/* LAYER 4: EGRESS BOUNDARIES & ENTERPRISE ASSETS (3 COLS) */}
          <div className="stage-column stage-l4">
            <div className="stage-col-header">
              <div className="stage-badge-group">
                <span className="stage-badge badge-mint font-mono">L4</span>
                <strong className="stage-title font-mono">EGRESS &amp; TARGET ASSETS</strong>
              </div>
              <span className="stage-meta text-mint font-mono font-bold">PROTECTED</span>
            </div>

            <div className="egress-list">
              {egressResources.map((res) => (
                <div
                  key={res.id}
                  className={`egress-item ${res.id === 'res-quarantine' ? 'egress-quarantine' : ''}`}
                  onClick={() => setSelectedResource(res)}
                  title={`Click to inspect ${res.name}`}
                >
                  <div className="egress-item-top font-mono">
                    <strong className="egress-name">{res.name}</strong>
                    <span className={`egress-badge tone-${res.badgeTone}`}>{res.badge}</span>
                  </div>
                  <div className="egress-desc">{res.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Layer Inspection Panel & Latency SLA Breakdown (8 / 4 Split) */}
      <section className="arch-inspection-layout">
        {/* LEFT: LAYER INSPECTION TABS (8 COLS) */}
        <div className="inspection-tabs-panel">
          {/* Tab Navigation */}
          <div className="tabs-nav-bar font-mono">
            <button
              className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              Overview
            </button>
            <button
              className={`tab-btn ${activeTab === 'internals' ? 'active' : ''}`}
              onClick={() => setActiveTab('internals')}
            >
              Control Plane Internals
            </button>
            <button
              className={`tab-btn ${activeTab === 'cryptography' ? 'active' : ''}`}
              onClick={() => setActiveTab('cryptography')}
            >
              Cryptographic Pipeline
            </button>
            <button
              className={`tab-btn ${activeTab === 'attestation' ? 'active' : ''}`}
              onClick={() => setActiveTab('attestation')}
            >
              Enclave Attestation
            </button>
            <button
              className={`tab-btn ${activeTab === 'latency' ? 'active' : ''}`}
              onClick={() => setActiveTab('latency')}
            >
              Latency Budget
            </button>
          </div>

          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="tab-pane">
              <div className="overview-duo-grid">
                <div className="pane-card">
                  <span className="pane-card-title text-cyan font-mono">Zero-Trust Agent Guarding</span>
                  <p className="pane-card-text">
                    Autonomous AI agents require continuous evaluation at invocation, runtime execution, and downstream tool synthesis. NexusGuard acts as a deterministic cryptographic proxy that validates intention invariants prior to socket execution.
                  </p>
                  <div className="code-formula-box font-mono">
                    <code>INVARIANT: ∀ action ∈ Agent_Exec : Intent_AST(action) ⊆ Allowed_Rules ∧ Risk(action) &lt; 40</code>
                  </div>
                </div>

                <div className="pane-card">
                  <span className="pane-card-title text-mint font-mono">Sub-Kernel eBPF Enforcement</span>
                  <p className="pane-card-text">
                    NexusGuard deploys eBPF program hooks at the host network driver layer to monitor raw TCP/Unix sockets. Any agent container attempting to establish unverified connections or bypass proxy listeners suffers kernel-level drop.
                  </p>
                  <div className="hook-info-box font-mono">
                    <CheckCircle2 size={14} className="text-mint shrink-0" />
                    <span>Kernel hook: tc_ingress / sock_ops (Cgroup v2)</span>
                  </div>
                </div>
              </div>

              <div className="defense-banner-box">
                <div className="banner-left">
                  <Shield size={22} className="text-cyan" />
                  <div>
                    <div className="banner-title font-mono">Deterministic Defense Profile (DDP-v4)</div>
                    <div className="banner-subtitle">Active across 12 agent clusters and 4 cloud regions.</div>
                  </div>
                </div>
                <span className="enforce-badge font-mono">100% ENFORCING</span>
              </div>
            </div>
          )}

          {/* TAB 2: CONTROL PLANE INTERNALS */}
          {activeTab === 'internals' && (
            <div className="tab-pane">
              <p className="pane-card-text">
                The NexusGuard Core is structured as an isolated, lock-free Rust engine utilizing io_uring and zero-copy packet dispatching. Each request traverses 8 micro-engines in deterministic pipelined stages:
              </p>

              <div className="internals-quad-grid font-mono">
                <div className="internals-card">
                  <span className="text-cyan font-bold">AST Syntax Disassembly:</span>
                  <p className="internals-desc">Converts dynamic agent JSON-RPC and natural language queries into AST trees for invariant cross-checking against target schemas.</p>
                </div>
                <div className="internals-card">
                  <span className="text-cyan font-bold">OPA CEL Engine:</span>
                  <p className="internals-desc">Evaluates Common Expression Language constraints in under 420 microseconds against local compiled policy bytecode.</p>
                </div>
                <div className="internals-card">
                  <span className="text-cyan font-bold">Dynamic Anonymizer:</span>
                  <p className="internals-desc">Inline RegEx and embedding-based DLP swaps credit cards, API keys, and PII with ephemeral crypt-tokens prior to egress.</p>
                </div>
                <div className="internals-card">
                  <span className="text-cyan font-bold">Reputation Decay Matrix:</span>
                  <p className="internals-desc">Dynamic trust scores drop by 30% per anomaly and recover with a 14-day half-life upon clean consecutive transactions.</p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: CRYPTOGRAPHIC PIPELINE */}
          {activeTab === 'cryptography' && (
            <div className="tab-pane">
              <div className="merkle-state-card font-mono">
                <div className="text-cyan font-bold">MERKLE TREE STATE COMMITMENT</div>
                <p className="text-outline text-xs mt-1">
                  Every intent parsed, rule evaluated, and egress transmission produces a cryptographic leaf:
                </p>
                <div className="merkle-equation-box">
                  <code>H_leaf = SHA-256(Epoch || Agent_ID || Intent_Hash || Invariant_Root || Timestamp)</code>
                </div>
              </div>

              <div className="crypto-pillars-grid font-mono">
                <div className="pillar-box">
                  <span className="pillar-label">Epoch Root Cadence</span>
                  <strong className="pillar-val">Every 60 Sec</strong>
                </div>
                <div className="pillar-box">
                  <span className="pillar-label">WORM Ledger Redundancy</span>
                  <strong className="pillar-val">Triple AWS / GCP</strong>
                </div>
                <div className="pillar-box">
                  <span className="pillar-label">Zero-Knowledge Proof</span>
                  <strong className="pillar-val">Groth16 / Circom</strong>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: ENCLAVE ATTESTATION */}
          {activeTab === 'attestation' && (
            <div className="tab-pane">
              <div className="enclave-duo-grid font-mono">
                <div className="enclave-box">
                  <span className="text-blue font-bold">AWS NITRO ENCLAVES</span>
                  <p className="text-xs text-on-surface mt-1">
                    Cryptographic measurement via PCR0, PCR1, PCR2 hardware register hashes ensures control plane code integrity.
                  </p>
                  <div className="enclave-foot text-mint font-bold">Status: ATTESTED_VALID</div>
                </div>

                <div className="enclave-box">
                  <span className="text-blue font-bold">TPM 2.0 HARDWARE ROOT</span>
                  <p className="text-xs text-on-surface mt-1">
                    Hardware security modules hold root authority keys. Private keys never touch shared memory space.
                  </p>
                  <div className="enclave-foot text-mint font-bold">FIPS 140-3 Level 3 Certified</div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: LATENCY BUDGET */}
          {activeTab === 'latency' && (
            <div className="tab-pane font-mono">
              <p className="pane-card-text">
                Aggressive overhead constraints are built directly into the NexusGuard SLA contract. Operations exceeding 4.8ms trigger automated bypass or safe-revert depending on cluster profile.
              </p>

              <div className="latency-contract-card">
                <span>Enterprise SLA Ceiling: 5.00ms</span>
                <span className="text-mint font-bold">Current Mean: {coreLatency.toFixed(2)}ms (Margin: +{(5.0 - coreLatency).toFixed(2)}ms)</span>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT: DETAILED LATENCY BUDGET BREAKDOWN (4 COLS) */}
        <div className="latency-breakdown-panel">
          <div className="latency-panel-header font-mono">
            <div className="flex items-center gap-1.5">
              <Timer className="text-cyan" size={16} />
              <strong className="panel-title">LATENCY BUDGET SLA</strong>
            </div>
            <span className="passing-badge">PASSING</span>
          </div>

          {/* Latency Bar Graph Breakdown */}
          <div className="latency-bars-list font-mono">
            {/* Step 1 */}
            <div className="lat-bar-item">
              <div className="lat-bar-label">
                <span>mTLS Handshake &amp; Attestation</span>
                <span className="lat-val">0.12 ms</span>
              </div>
              <div className="lat-track">
                <div className="lat-fill" style={{ width: '2.4%' }} />
              </div>
            </div>

            {/* Step 2 */}
            <div className="lat-bar-item">
              <div className="lat-bar-label">
                <span>Intent Extraction &amp; AST Parsing</span>
                <span className="lat-val text-cyan">1.14 ms</span>
              </div>
              <div className="lat-track">
                <div className="lat-fill bg-cyan" style={{ width: '22.8%' }} />
              </div>
            </div>

            {/* Step 3 */}
            <div className="lat-bar-item">
              <div className="lat-bar-label">
                <span>Policy Invariant Evaluation</span>
                <span className="lat-val">0.42 ms</span>
              </div>
              <div className="lat-track">
                <div className="lat-fill" style={{ width: '8.4%' }} />
              </div>
            </div>

            {/* Step 4 */}
            <div className="lat-bar-item">
              <div className="lat-bar-label">
                <span>Risk Engine Multi-Scoring</span>
                <span className="lat-val">0.28 ms</span>
              </div>
              <div className="lat-track">
                <div className="lat-fill" style={{ width: '5.6%' }} />
              </div>
            </div>

            {/* Step 5 */}
            <div className="lat-bar-item">
              <div className="lat-bar-label">
                <span>Tool Proxy Routing &amp; DLP Mask</span>
                <span className="lat-val">0.35 ms</span>
              </div>
              <div className="lat-track">
                <div className="lat-fill" style={{ width: '7.0%' }} />
              </div>
            </div>

            {/* Step 6 */}
            <div className="lat-bar-item">
              <div className="lat-bar-label">
                <span>Ledger Merkle Leaf Signing (Async)</span>
                <span className="lat-val">0.22 ms</span>
              </div>
              <div className="lat-track">
                <div className="lat-fill" style={{ width: '4.4%' }} />
              </div>
            </div>
          </div>

          {/* Latency Summary Box */}
          <div className="latency-summary-card font-mono">
            <div className="summary-total-row">
              <span className="text-on-surface font-semibold">Total Round-Trip:</span>
              <strong className="text-mint text-xl">{coreLatency.toFixed(2)} ms</strong>
            </div>
            <div className="summary-sla-row text-xs text-outline">
              <span>Guaranteed Max SLA:</span>
              <span>4.80 ms</span>
            </div>
            <div className="summary-health-row text-xs text-mint">
              <Zap size={13} />
              <span>Operating at {((coreLatency / 4.80) * 100).toFixed(1)}% of allowed enterprise latency budget</span>
            </div>
          </div>
        </div>
      </section>

      {/* Security Guarantees & Technical Assurances (3 Cards) */}
      <section className="arch-guarantees-grid">
        {/* Assurance 1 */}
        <div className="guarantee-card">
          <div className="guarantee-header">
            <div className="guarantee-title-with-icon text-cyan">
              <Lock size={18} />
              <strong className="font-mono">Zero-Knowledge Proofs for Audits</strong>
            </div>
            <CheckCircle2 size={16} className="text-mint" />
          </div>
          <p className="guarantee-desc">
            Prove policy compliance, data lineage, and safety invariant adherence to external regulators without decrypting confidential agent prompts or enterprise payloads.
          </p>
          <div className="guarantee-footer font-mono">
            <span>ZK-SNARK / Circom 2.1</span>
            <span className="text-on-surface font-semibold">Self-Verifying</span>
          </div>
        </div>

        {/* Assurance 2 */}
        <div className="guarantee-card">
          <div className="guarantee-header">
            <div className="guarantee-title-with-icon text-blue">
              <Cpu size={18} />
              <strong className="font-mono">Sub-Millisecond eBPF Interception</strong>
            </div>
            <CheckCircle2 size={16} className="text-mint" />
          </div>
          <p className="guarantee-desc">
            Kernel-resident socket routing drops zero-day evasion attempts before packets hit userland network buffers. Unmodified agent containers operate without manual sidecars.
          </p>
          <div className="guarantee-footer font-mono">
            <span>Kernel 6.1+ eBPF RingBuffer</span>
            <span className="text-on-surface font-semibold">Zero-Copy Fastpath</span>
          </div>
        </div>

        {/* Assurance 3 */}
        <div className="guarantee-card">
          <div className="guarantee-header">
            <div className="guarantee-title-with-icon text-mint">
              <Key size={18} />
              <strong className="font-mono">FIPS 140-3 Hardware Root of Trust</strong>
            </div>
            <CheckCircle2 size={16} className="text-mint" />
          </div>
          <p className="guarantee-desc">
            Hardware-enforced key isolation using dedicated cryptographic processors. Policy signing keys remain inaccessible even in the event of full operating system compromise.
          </p>
          <div className="guarantee-footer font-mono">
            <span>Level 3 HSM / TPM 2.0</span>
            <span className="text-on-surface font-semibold">Tamper-Proof</span>
          </div>
        </div>
      </section>

      {/* Sub-Engine Deep Dive Modal */}
      {selectedEngine && (
        <div className="arch-modal-backdrop" onClick={() => setSelectedEngine(null)}>
          <div className="arch-modal-box font-mono" onClick={(e) => e.stopPropagation()}>
            <div className="modal-top">
              <div className="modal-title-row">
                <span className="modal-num text-cyan">{selectedEngine.num} // {selectedEngine.code}</span>
                <h3 className="modal-heading">{selectedEngine.name}</h3>
              </div>
              <button className="modal-close-btn" onClick={() => setSelectedEngine(null)}>
                <X size={18} />
              </button>
            </div>

            <div className="modal-body-content">
              <div className="modal-stat-pill-row">
                <span className="stat-pill">Latency: <strong>{selectedEngine.latencyMs.toFixed(2)} ms</strong></span>
                <span className="stat-pill">Status: <strong className="text-mint">{selectedEngine.statusTag}</strong></span>
                <span className="stat-pill">Stack: <strong>{selectedEngine.techStack}</strong></span>
              </div>

              <p className="modal-desc-text">{selectedEngine.desc}</p>

              <div className="modal-details-card">
                <span className="card-subhead">Operational Verification Vectors:</span>
                <ul className="modal-checks-list">
                  {selectedEngine.details.map((detail, idx) => (
                    <li key={idx}>
                      <Check size={14} className="text-cyan shrink-0" />
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="modal-foot">
              <button className="btn-modal-close" onClick={() => setSelectedEngine(null)}>
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Egress Resource Modal */}
      {selectedResource && (
        <div className="arch-modal-backdrop" onClick={() => setSelectedResource(null)}>
          <div className="arch-modal-box font-mono" onClick={(e) => e.stopPropagation()}>
            <div className="modal-top">
              <div className="modal-title-row">
                <span className="modal-num text-mint">L4 BOUNDARY // EGRESS ENCLAVE</span>
                <h3 className="modal-heading">{selectedResource.name}</h3>
              </div>
              <button className="modal-close-btn" onClick={() => setSelectedResource(null)}>
                <X size={18} />
              </button>
            </div>

            <div className="modal-body-content">
              <div className="modal-stat-pill-row">
                <span className="stat-pill">Badge: <strong className="text-mint">{selectedResource.badge}</strong></span>
                <span className="stat-pill">Protocol: <strong>Zero-Trust Encrypted</strong></span>
              </div>

              <div className="modal-details-card">
                <span className="card-subhead">Enclave Routing Endpoints:</span>
                <code className="block bg-surface-lowest p-2 rounded text-cyan text-xs mt-1">
                  {selectedResource.endpoints}
                </code>
              </div>

              <div className="modal-details-card">
                <span className="card-subhead">Enforced Security Boundary:</span>
                <p className="text-xs text-on-surface mt-1">{selectedResource.securityMode}</p>
              </div>
            </div>

            <div className="modal-foot">
              <button className="btn-modal-close" onClick={() => setSelectedResource(null)}>
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
