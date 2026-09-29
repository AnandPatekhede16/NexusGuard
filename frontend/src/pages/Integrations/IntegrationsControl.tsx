import { useState, useMemo, type Dispatch, type SetStateAction } from 'react';
import {
  Activity, AlertTriangle, ArrowRight, BadgeCheck, Check,
  CheckCircle2, ChevronRight, Cloud, CloudRain, Copy,
  Database, Download, ExternalLink, Eye, EyeOff, FileCode,
  FileText, Fingerprint, Gavel, Globe, HardDrive, History,
  Info, Key, Layers, Lock, Network, Play, Plus, RefreshCw,
  Search, Server, Shield, ShieldAlert, ShieldCheck, Sparkles,
  Terminal, Timer, Trash2, TrendingUp, Users, Wifi, X, Zap
} from 'lucide-react';
import type { Agent } from '../Agents/agentData';
import './integrations-control.css';

export type IntegrationCategory = 'all' | 'databases' | 'apis' | 'cloud' | 'sandboxes' | 'git';

export type IntegrationAsset = {
  id: string;
  name: string;
  category: 'databases' | 'apis' | 'cloud' | 'sandboxes' | 'git';
  cluster: string;
  endpoint: string;
  protocol: string;
  badgeLabel: string;
  badgeTone: 'mint' | 'blue' | 'red' | 'cyan' | 'purple';
  throughput: string;
  latency: string;
  iconType: 'database' | 'cloud' | 'api' | 'bank' | 'browser' | 'terminal';
  accentColor: string;
  scopedAgents: { id: string; perm: string; tone?: string }[];
  hardRules: string[];
  enforcementEngine: string;
  sessionAuthMode: string;
  payloadHashing: string;
  assignedPolicyPack: string;
  tripwires: {
    name: string;
    type: 'danger' | 'warning' | 'info';
    desc: string;
    status: 'ACTIVE' | 'ENFORCED';
  }[];
  pcr0: string;
  status: 'SYNCHRONIZED' | 'MONITORED' | 'ISOLATED';
};

const initialAssets: IntegrationAsset[] = [
  {
    id: 'int-01',
    name: 'PostgreSQL Core Ledger',
    category: 'databases',
    cluster: 'Cluster-01:5432',
    endpoint: 'postgresql://pg-fin-cluster.internal:5432/corp_prod',
    protocol: 'PostgreSQL 16.2 / TLS 1.3',
    badgeLabel: 'AST Firewall Active',
    badgeTone: 'mint',
    throughput: '1,412 req/min',
    latency: '0.4ms',
    iconType: 'database',
    accentColor: '#00e5ff',
    scopedAgents: [
      { id: 'FIN-AGENT-01', perm: 'Read-Only', tone: 'mint' },
      { id: 'DB-AGENT-01', perm: 'R/W 2-Man Quorum', tone: 'cyan' },
    ],
    hardRules: [
      'DROP / ALTER TABLE strictly barred. Salary schema locked.',
      'Max 25 queries/sec per agent session.',
    ],
    enforcementEngine: 'AST Deterministic Tree Checker',
    sessionAuthMode: 'Dynamic Nitro Ephemeral (15m)',
    payloadHashing: 'SHA-256 Pre-Execution',
    assignedPolicyPack: 'SOC2-FIN-LEDGER-V3',
    tripwires: [
      {
        name: 'Zero-Tolerance DDL Tripwire',
        type: 'danger',
        desc: 'Any execution containing DROP, ALTER, or TRUNCATE will immediately quarantine the invoking agent and trigger an alert.',
        status: 'ACTIVE',
      },
      {
        name: 'Adaptive Rate-Limiter',
        type: 'info',
        desc: 'Max 25 queries/sec per agent session. Spikes above 30 rps result in 10-second token bucket dampening.',
        status: 'ENFORCED',
      },
      {
        name: 'Sensitive Column Masking',
        type: 'warning',
        desc: 'Columns ssn, bank_routing, salary masked with HMAC SHA-256 tokens unless 2-man authorization signed.',
        status: 'ACTIVE',
      },
    ],
    pcr0: '89f41b2c3910ab947218...e8',
    status: 'SYNCHRONIZED',
  },
  {
    id: 'int-02',
    name: 'AWS S3 Vault & Data Lake',
    category: 'cloud',
    cluster: 'us-east-1',
    endpoint: 's3://nexusguard-financial-records-enc',
    protocol: 'HTTPS / SSE-KMS',
    badgeLabel: 'DLP Enclave',
    badgeTone: 'mint',
    throughput: '382 GetObject/min',
    latency: 'Zero Leak',
    iconType: 'cloud',
    accentColor: '#5be9ad',
    scopedAgents: [
      { id: 'RES-AGENT-01', perm: 'Scoped Read', tone: 'cyan' },
      { id: 'HR-AGENT-01', perm: 'Restricted', tone: 'red' },
    ],
    hardRules: [
      'External unencrypted bucket sync prohibited via KMS SSE-C.',
      'Cross-region egress requires cryptographic signed ticket.',
    ],
    enforcementEngine: 'DLP Semantic Content Inspector',
    sessionAuthMode: 'AWS IAM Role Delegation (Nitro Gated)',
    payloadHashing: 'SHA-256 Chunked',
    assignedPolicyPack: 'ISO-27001-S3-STORAGE',
    tripwires: [
      {
        name: 'Mass Egress Sentinel',
        type: 'danger',
        desc: 'Retrieval exceeding 500MB within 60 seconds triggers automatic bandwidth throttle and SOC alert.',
        status: 'ACTIVE',
      },
      {
        name: 'PII Regex Guardrail',
        type: 'warning',
        desc: 'Intercepts unmasked credit card or personal identity tokens before S3 write commit.',
        status: 'ENFORCED',
      },
    ],
    pcr0: '4c8e129038ba912a7710...bf',
    status: 'SYNCHRONIZED',
  },
  {
    id: 'int-03',
    name: 'Swift Financial API / ISO 20022 Gateway',
    category: 'apis',
    cluster: 'BACS-HIGH',
    endpoint: 'https://iso-gateway.swift-mesh.corp:8443/v2/messages',
    protocol: 'mTLS 1.3 / Hardware Token',
    badgeLabel: 'Hardware Nitro Gated',
    badgeTone: 'red',
    throughput: 'Transfers: 0 TOLERANCE',
    latency: 'Hardware Locked',
    iconType: 'bank',
    accentColor: '#ff5449',
    scopedAgents: [
      { id: 'FIN-AGENT-01', perm: 'Query Only', tone: 'cyan' },
      { id: 'ALL-OTHERS', perm: 'Direct Transfer BLOCKED', tone: 'red' },
    ],
    hardRules: [
      'Direct automated funds transfer prohibited by Enclave Policy-003.',
      'Mandatory 2-officer hardware cryptographic quorum for any wire mutation.',
    ],
    enforcementEngine: 'Hardware Nitro Enclave Interlock',
    sessionAuthMode: 'Dual Hardware FIDO2 + Nitro Attestation',
    payloadHashing: 'Ed25519 Signed Digest',
    assignedPolicyPack: 'PCI-DSS-SWIFT-V4',
    tripwires: [
      {
        name: 'Direct Wire Injection Lock',
        type: 'danger',
        desc: 'Any programmatic invocation of transferFunds() or executePayment() instantly trips Defcon 1 lock on agent.',
        status: 'ACTIVE',
      },
      {
        name: 'Payload Schema Strict Enforcement',
        type: 'info',
        desc: 'All outbound MT103 / pacs.008 XML documents validated against static ISO schemas.',
        status: 'ENFORCED',
      },
    ],
    pcr0: '1a2b3c4d5e6f7a8b9c0d...11',
    status: 'SYNCHRONIZED',
  },
  {
    id: 'int-04',
    name: 'Internal Customer Service REST API',
    category: 'apis',
    cluster: 'k8s-mesh',
    endpoint: 'https://api.crm-core.svc.cluster.local/v1/customers',
    protocol: 'REST / JSON / mTLS',
    badgeLabel: 'mTLS + Token Rotation',
    badgeTone: 'blue',
    throughput: '840 req/min',
    latency: '1.1ms',
    iconType: 'api',
    accentColor: '#a3c9ff',
    scopedAgents: [
      { id: 'COD-AGENT-01', perm: 'Service Mesh Proxy', tone: 'mint' },
      { id: 'RES-AGENT-01', perm: 'Telemetry Reader', tone: 'cyan' },
    ],
    hardRules: [
      'PII masking filter automatically injected into response streams.',
      'Max 100 rows per paginated payload.',
    ],
    enforcementEngine: 'Dynamic Envoy Sidecar Proxy',
    sessionAuthMode: 'Short-lived JWT (5 min TTL)',
    payloadHashing: 'HMAC-SHA256 Bearer Check',
    assignedPolicyPack: 'GDPR-ART32-CRM-SHIELD',
    tripwires: [
      {
        name: 'Bulk Scrape Deterrent',
        type: 'warning',
        desc: 'Continuous pagination beyond 5 pages without human approval terminates JWT lease.',
        status: 'ACTIVE',
      },
      {
        name: 'Customer Anonymization Filter',
        type: 'info',
        desc: 'Replaces customer phone and email with pseudo-hash tokens at edge proxy.',
        status: 'ENFORCED',
      },
    ],
    pcr0: '99887766554433221100...ff',
    status: 'SYNCHRONIZED',
  },
  {
    id: 'int-05',
    name: 'Isolated Web Browser / Headless Chromium',
    category: 'sandboxes',
    cluster: 'Sandbox #09',
    endpoint: 'chromium://sandbox-containment-09.ephemeral.internal',
    protocol: 'Air-Gapped CDP / WebRTC',
    badgeLabel: 'Restricted Air-Gap',
    badgeTone: 'mint',
    throughput: '14 open tabs',
    latency: '0 infections',
    iconType: 'browser',
    accentColor: '#6ffbbe',
    scopedAgents: [
      { id: 'RES-AGENT-01', perm: 'ArXiv, PubMed, SEC Edgar only', tone: 'mint' },
    ],
    hardRules: [
      'Strict domain whitelist. Arbitrary JavaScript eval blocked by sandbox.',
      'Downloads limited to verified PDF and text schemas with antivirus scan.',
    ],
    enforcementEngine: 'gVisor Kernel Sandbox Isolation',
    sessionAuthMode: 'Ephemeral Disposable Container (10m TTL)',
    payloadHashing: 'DOM Tree Hash Verification',
    assignedPolicyPack: 'AIRGAP-SANDBOX-BROWSE-01',
    tripwires: [
      {
        name: 'Non-Whitelisted Domain Trap',
        type: 'danger',
        desc: 'DNS query to non-approved domains terminates browser container and purges memory state.',
        status: 'ACTIVE',
      },
      {
        name: 'Zero-Download Sandbox Envelope',
        type: 'info',
        desc: 'Binary executable files automatically scrubbed and deleted at container socket.',
        status: 'ENFORCED',
      },
    ],
    pcr0: '556677889900aabbccdd...ee',
    status: 'SYNCHRONIZED',
  },
  {
    id: 'int-06',
    name: 'Enterprise GitHub Organization',
    category: 'git',
    cluster: 'github.com/enterprise',
    endpoint: 'ssh://git@github.com:enterprise/core-repo.git',
    protocol: 'SSH Ed25519 / GPG Signed',
    badgeLabel: 'Branch Protection Hook',
    badgeTone: 'cyan',
    throughput: '18 PRs/wk',
    latency: '0 Bypasses',
    iconType: 'terminal',
    accentColor: '#849396',
    scopedAgents: [
      { id: 'COD-AGENT-01', perm: 'PR generation only', tone: 'cyan' },
      { id: 'ALL-OTHERS', perm: 'Push to main barred', tone: 'red' },
    ],
    hardRules: [
      'GPG signature required on all synthetic commits. No direct force push.',
      'All automated PRs require at least 1 human staff engineer review.',
    ],
    enforcementEngine: 'Pre-Receive Git Hook Sentinel',
    sessionAuthMode: 'Hardware Protected Deploy Key',
    payloadHashing: 'Git Tree SHA-1 / SHA-256 Object Integrity',
    assignedPolicyPack: 'SLSA-LEVEL-3-DEVSECOPS',
    tripwires: [
      {
        name: 'Direct Main Commit Intercept',
        type: 'danger',
        desc: 'Branch protection strictly rejects direct pushes to main, staging, or release/*',
        status: 'ACTIVE',
      },
      {
        name: 'Secret Leak Scanner',
        type: 'warning',
        desc: 'Scans commit diffs for API keys, private certificates, or environment configs.',
        status: 'ENFORCED',
      },
    ],
    pcr0: '33445566778899001122...aa',
    status: 'SYNCHRONIZED',
  },
  {
    id: 'int-07',
    name: 'Snowflake Enterprise Data Warehouse',
    category: 'databases',
    cluster: 'aws-us-east-1',
    endpoint: 'https://xy12345.snowflakecomputing.com',
    protocol: 'SnowSQL / PrivateLink',
    badgeLabel: 'Role-Based Query Gating',
    badgeTone: 'blue',
    throughput: '410 queries/min',
    latency: '1.8ms',
    iconType: 'database',
    accentColor: '#a3c9ff',
    scopedAgents: [
      { id: 'ANL-AGENT-03', perm: 'Aggregated Analytics Only', tone: 'mint' },
      { id: 'FIN-AGENT-01', perm: 'Read Scoped Ledger', tone: 'cyan' },
    ],
    hardRules: [
      'Row-level security enforces regional data sovereign isolation.',
      'No raw table exports to local scratch volumes.',
    ],
    enforcementEngine: 'Snowflake Dynamic Data Masking Gateway',
    sessionAuthMode: 'Key-Pair JWT Rotation (30m)',
    payloadHashing: 'Query Fingerprint Hash',
    assignedPolicyPack: 'SNOW-GOV-COMPLIANCE-V2',
    tripwires: [
      {
        name: 'Cross-Tenant Query Blocker',
        type: 'danger',
        desc: 'Queries crossing international tenant schema boundaries halted immediately.',
        status: 'ACTIVE',
      },
      {
        name: 'Execution Cost Governor',
        type: 'info',
        desc: 'Kills queries with projected warehouse credits exceeding 4 credits without CISO approval.',
        status: 'ENFORCED',
      },
    ],
    pcr0: '778899aabbccddeeff00...22',
    status: 'SYNCHRONIZED',
  },
  {
    id: 'int-08',
    name: 'Redis Cluster Consensus Cache',
    category: 'databases',
    cluster: 'k8s-cache-prod',
    endpoint: 'rediss://cache-cluster.internal:6379',
    protocol: 'Redis RESP3 / TLS 1.3',
    badgeLabel: 'Rate-Capped Enclave',
    badgeTone: 'mint',
    throughput: '12,400 ops/sec',
    latency: '0.12ms',
    iconType: 'database',
    accentColor: '#00e5ff',
    scopedAgents: [
      { id: 'COD-AGENT-01', perm: 'Read / Write Scoped Keys', tone: 'cyan' },
      { id: 'RES-AGENT-01', perm: 'Cache Reader', tone: 'mint' },
    ],
    hardRules: [
      'KEYS * and FLUSHALL commands disabled at cluster proxy level.',
      'Key namespace prefixes strictly partitioned per agent identity.',
    ],
    enforcementEngine: 'Redis Proxy Command Filter',
    sessionAuthMode: 'mTLS Client Certificate Authentication',
    payloadHashing: 'Command Parameter CRC64',
    assignedPolicyPack: 'CACHE-ZERO-TRUST-01',
    tripwires: [
      {
        name: 'Dangerous Command Sentinel',
        type: 'danger',
        desc: 'Execution of CONFIG, SHUTDOWN, or EVAL without pre-signed hash instantly drops client socket.',
        status: 'ACTIVE',
      },
    ],
    pcr0: '11223344556677889900...33',
    status: 'SYNCHRONIZED',
  },
];

type Props = {
  agents: Agent[];
  setAgents?: Dispatch<SetStateAction<Agent[]>>;
  onNotify?: (msg: string) => void;
  onOpenAgentDetail?: (agentId: string) => void;
};

export default function IntegrationsControl({
  agents,
  setAgents,
  onNotify,
  onOpenAgentDetail,
}: Props) {
  // State
  const [assets, setAssets] = useState<IntegrationAsset[]>(initialAssets);
  const [selectedAssetId, setSelectedAssetId] = useState<string>(initialAssets[0].id);
  const [activeCategory, setActiveCategory] = useState<IntegrationCategory>('all');
  const [searchFilter, setSearchFilter] = useState<string>('');
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');

  // Interactive Modals
  const [registerModalOpen, setRegisterModalOpen] = useState<boolean>(false);
  const [testModalOpen, setTestModalOpen] = useState<boolean>(false);
  const [testTesting, setTestTesting] = useState<boolean>(false);
  const [testSuccess, setTestSuccess] = useState<boolean>(false);
  const [logsModalOpen, setLogsModalOpen] = useState<boolean>(false);
  const [revokeModalOpen, setRevokeModalOpen] = useState<boolean>(false);
  const [isValidatingAll, setIsValidatingAll] = useState<boolean>(false);

  // New Tool Form State
  const [newToolName, setNewToolName] = useState<string>('');
  const [newToolCategory, setNewToolCategory] = useState<'databases' | 'apis' | 'cloud' | 'sandboxes' | 'git'>('databases');
  const [newToolEndpoint, setNewToolEndpoint] = useState<string>('');
  const [newToolAgent, setNewToolAgent] = useState<string>('FIN-AGENT-01');

  // Selected Asset
  const selectedAsset = useMemo(() => {
    return assets.find((a) => a.id === selectedAssetId) || assets[0] || initialAssets[0];
  }, [assets, selectedAssetId]);

  // Filtered Assets
  const filteredAssets = useMemo(() => {
    return assets.filter((asset) => {
      // Category filter
      if (activeCategory !== 'all' && asset.category !== activeCategory) {
        return false;
      }
      // Search filter
      if (searchFilter.trim()) {
        const q = searchFilter.toLowerCase();
        const matches =
          asset.name.toLowerCase().includes(q) ||
          asset.endpoint.toLowerCase().includes(q) ||
          asset.cluster.toLowerCase().includes(q) ||
          asset.scopedAgents.some((ag) => ag.id.toLowerCase().includes(q) || ag.perm.toLowerCase().includes(q));
        if (!matches) return false;
      }
      return true;
    });
  }, [assets, activeCategory, searchFilter]);

  // Category Counts
  const categoryCounts = useMemo(() => {
    return {
      all: assets.length,
      databases: assets.filter((a) => a.category === 'databases').length,
      apis: assets.filter((a) => a.category === 'apis').length,
      cloud: assets.filter((a) => a.category === 'cloud').length,
      sandboxes: assets.filter((a) => a.category === 'sandboxes').length,
      git: assets.filter((a) => a.category === 'git').length,
    };
  }, [assets]);

  // Handle Re-validate Enclaves
  const handleRevalidateEnclaves = () => {
    setIsValidatingAll(true);
    setTimeout(() => {
      setIsValidatingAll(false);
      onNotify?.('All 16 connected enclaves re-validated. Hardware PCR0 digests verified via AWS KMS.');
    }, 900);
  };

  // Handle Export Matrix
  const handleExportMatrix = () => {
    const payload = {
      platform: 'NexusGuard',
      suite: 'Tool & System Integrations Control Plane',
      exportedAt: new Date().toISOString(),
      connectedIntegrationsCount: assets.length,
      summary: {
        monitoredCoverage: '100%',
        interceptionEngine: 'AST Deterministic Tree Checker',
        averageOverhead: '0.65ms',
      },
      assets: assets,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nexusguard-integrations-matrix-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    onNotify?.('Integrations access matrix exported as JSON.');
  };

  // Handle Register Tool
  const handleSaveNewTool = () => {
    if (!newToolName.trim() || !newToolEndpoint.trim()) {
      onNotify?.('Please provide a valid tool name and endpoint URI.');
      return;
    }
    const newAsset: IntegrationAsset = {
      id: `int-${Date.now().toString().slice(-4)}`,
      name: newToolName,
      category: newToolCategory,
      cluster: 'us-east-1:custom',
      endpoint: newToolEndpoint,
      protocol: 'TLS 1.3 / Enclave Proxy',
      badgeLabel: 'AST Gateway Enforced',
      badgeTone: 'mint',
      throughput: '0 req/min',
      latency: '0.5ms',
      iconType: newToolCategory === 'databases' ? 'database' : newToolCategory === 'cloud' ? 'cloud' : 'api',
      accentColor: '#00e5ff',
      scopedAgents: [{ id: newToolAgent, perm: 'Scoped Access', tone: 'mint' }],
      hardRules: ['Zero-trust proxy interception enabled.', 'All mutations require signed authorization token.'],
      enforcementEngine: 'AST Deterministic Tree Checker',
      sessionAuthMode: 'Dynamic Nitro Ephemeral (15m)',
      payloadHashing: 'SHA-256 Pre-Execution',
      assignedPolicyPack: 'NEXUS-DEFAULT-PERIMETER-V1',
      tripwires: [
        {
          name: 'Zero-Tolerance Mutation Tripwire',
          type: 'danger',
          desc: 'Unapproved write operations immediately trigger quarantine alert.',
          status: 'ACTIVE',
        },
      ],
      pcr0: 'aa11bb22cc33dd44ee55...99',
      status: 'SYNCHRONIZED',
    };
    setAssets([newAsset, ...assets]);
    setSelectedAssetId(newAsset.id);
    setRegisterModalOpen(false);
    setNewToolName('');
    setNewToolEndpoint('');
    onNotify?.(`New tool "${newAsset.name}" successfully registered and enrolled into NexusGuard Intent Gateway.`);
  };

  // Test Gateway Connection
  const handleRunGatewayTest = () => {
    setTestModalOpen(true);
    setTestTesting(true);
    setTestSuccess(false);
    setTimeout(() => {
      setTestTesting(false);
      setTestSuccess(true);
      onNotify?.(`Gateway connection to ${selectedAsset.name} verified: Latency 0.42ms, TLS 1.3 handshake OK.`);
    }, 1000);
  };

  // Revoke All Leases
  const handleConfirmRevoke = () => {
    setAssets((prev) =>
      prev.map((a) => {
        if (a.id === selectedAsset.id) {
          return {
            ...a,
            status: 'ISOLATED',
            scopedAgents: a.scopedAgents.map((ag) => ({ ...ag, perm: 'REVOKED', tone: 'red' })),
          };
        }
        return a;
      })
    );
    setRevokeModalOpen(false);
    onNotify?.(`All active agent leases revoked for ${selectedAsset.name}. RPC endpoints severed.`);
  };

  return (
    <div className="integrations-page">
      {/* Breadcrumbs & Meta Bar */}
      <section className="integrations-header">
        <div className="header-meta">
          <div className="integrations-breadcrumbs font-mono">
            <span>PLATFORM</span>
            <span className="crumb-sep">//</span>
            <span>PERIMETER DEFENSE</span>
            <span className="crumb-sep">//</span>
            <span className="crumb-active">CONNECTED ASSETS &amp; ENCLAVES</span>
          </div>

          <h1 className="integrations-title">
            Tool &amp; System Integrations Control Plane
          </h1>

          <p className="integrations-subtitle">
            Unified zero-trust perimeter management for all external APIs, relational databases, cloud enclaves, browsers, and code repos accessed by autonomous agents.
          </p>
        </div>

        {/* Action Toolbar */}
        <div className="header-actions">
          <button
            className="btn-toolbar-subtle"
            onClick={handleRevalidateEnclaves}
            disabled={isValidatingAll}
          >
            <RefreshCw className={isValidatingAll ? 'animate-spin text-cyan' : 'text-cyan'} size={15} />
            <span>Re-validate Enclaves</span>
          </button>

          <button
            className="btn-toolbar-subtle"
            onClick={handleExportMatrix}
          >
            <Download size={15} />
            <span>Export Matrix</span>
          </button>

          <button
            className="btn-toolbar-primary font-bold"
            onClick={() => setRegisterModalOpen(true)}
          >
            <Plus size={16} />
            <span>Register New Tool (+)</span>
          </button>
        </div>
      </section>

      {/* Posture HUD Summary Banner (4 Columns) */}
      <section aria-label="Integrations Summary" className="integrations-hud-grid">
        {/* Card 1 */}
        <article className="hud-card">
          <div className="hud-card-top">
            <span className="hud-label font-mono">Connected Integrations</span>
            <Network className="text-cyan" size={17} />
          </div>
          <div className="hud-value-row">
            <strong className="hud-value">{assets.length}</strong>
            <span className="hud-tag font-mono text-mint">Active</span>
          </div>
          <div className="hud-sub-row">
            <span>Across 7 Infra Sectors</span>
            <span className="text-mint flex items-center gap-1 font-mono">
              <BadgeCheck size={13} /> 100% Monitored
            </span>
          </div>
          <div className="hud-progress-bar">
            <div className="hud-progress-fill" style={{ width: '100%' }} />
          </div>
        </article>

        {/* Card 2 */}
        <article className="hud-card">
          <div className="hud-card-top">
            <span className="hud-label font-mono">Protected &amp; Proxied</span>
            <ShieldCheck className="text-mint" size={17} />
          </div>
          <div className="hud-value-row">
            <strong className="hud-value text-mint">100%</strong>
            <span className="hud-tag font-mono">ENCLAVE HOOK</span>
          </div>
          <div className="hud-sub-text truncate">
            Routed via NexusGuard Semantic Intent Gateway
          </div>
          <div className="hud-progress-bar">
            <div className="hud-progress-fill bar-mint" style={{ width: '100%' }} />
          </div>
        </article>

        {/* Card 3 */}
        <article className="hud-card">
          <div className="hud-card-top">
            <span className="hud-label font-mono">Tool Abuse Intercepted</span>
            <Gavel className="text-red" size={17} />
          </div>
          <div className="hud-value-row">
            <strong className="hud-value">0.00%</strong>
            <span className="hud-tag font-mono text-red">Bypass</span>
          </div>
          <div className="hud-sub-row">
            <span className="text-red font-medium">32 rogue calls neutralized</span>
            <span className="font-mono text-outline">7d delta</span>
          </div>
          <div className="hud-progress-bar">
            <div className="hud-progress-fill bar-red" style={{ width: '4%' }} />
          </div>
        </article>

        {/* Card 4 */}
        <article className="hud-card">
          <div className="hud-card-top">
            <span className="hud-label font-mono">Throughput &amp; Overhead</span>
            <Activity className="text-blue" size={17} />
          </div>
          <div className="hud-value-row">
            <strong className="hud-value">48.2</strong>
            <span className="hud-tag font-mono">MB/s</span>
          </div>
          <div className="hud-sub-row">
            <span className="font-mono text-cyan">0.65ms avg overhead</span>
            <span className="font-mono text-mint">OPTIMAL</span>
          </div>
          <div className="hud-progress-bar">
            <div className="hud-progress-fill bar-blue" style={{ width: '78%' }} />
          </div>
        </article>
      </section>

      {/* Operational Enclave Grid & Deep Dive Layout (8 / 4 Split) */}
      <section className="integrations-main-grid">
        {/* Primary Integrations Stream (8 Cols) */}
        <div className="integrations-stream-col">
          {/* Category Filter Tabs & Filter Input Bar */}
          <div className="integrations-filter-card">
            {/* Category Filter Pills */}
            <div className="filter-pills-row font-mono" id="categoryFilterBar">
              <button
                className={`filter-pill ${activeCategory === 'all' ? 'active' : ''}`}
                onClick={() => setActiveCategory('all')}
              >
                All ({categoryCounts.all})
              </button>
              <button
                className={`filter-pill ${activeCategory === 'databases' ? 'active' : ''}`}
                onClick={() => setActiveCategory('databases')}
              >
                Databases ({categoryCounts.databases})
              </button>
              <button
                className={`filter-pill ${activeCategory === 'apis' ? 'active' : ''}`}
                onClick={() => setActiveCategory('apis')}
              >
                APIs &amp; Webhooks ({categoryCounts.apis})
              </button>
              <button
                className={`filter-pill ${activeCategory === 'cloud' ? 'active' : ''}`}
                onClick={() => setActiveCategory('cloud')}
              >
                Cloud Infrastructure ({categoryCounts.cloud})
              </button>
              <button
                className={`filter-pill ${activeCategory === 'sandboxes' ? 'active' : ''}`}
                onClick={() => setActiveCategory('sandboxes')}
              >
                Browsers &amp; Sandboxes ({categoryCounts.sandboxes})
              </button>
              <button
                className={`filter-pill ${activeCategory === 'git' ? 'active' : ''}`}
                onClick={() => setActiveCategory('git')}
              >
                Code &amp; Git Repos ({categoryCounts.git})
              </button>
            </div>

            {/* Filter Input & Mode Buttons */}
            <div className="filter-input-row">
              <div className="search-box-wrap">
                <Search size={15} className="search-icon" />
                <input
                  type="text"
                  className="search-input"
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  placeholder="Filter by resource name, ARN, endpoint, or agent privilege..."
                />
              </div>

              <div className="view-mode-toggle">
                <button
                  className={`btn-mode ${viewMode === 'cards' ? 'active' : ''}`}
                  onClick={() => setViewMode('cards')}
                  title="Card Grid View"
                >
                  <Layers size={14} />
                </button>
                <button
                  className={`btn-mode ${viewMode === 'table' ? 'active' : ''}`}
                  onClick={() => setViewMode('table')}
                  title="Compact Table View"
                >
                  <FileText size={14} />
                </button>
              </div>
            </div>
          </div>

          {/* Integration Cards Container */}
          {filteredAssets.length === 0 ? (
            <div className="empty-assets-box font-mono">
              <CheckCircle2 size={32} />
              <p>No connected integration assets match the search criteria.</p>
            </div>
          ) : viewMode === 'cards' ? (
            <div className="assets-cards-list">
              {filteredAssets.map((asset) => {
                const isSelected = asset.id === selectedAsset.id;

                return (
                  <article
                    key={asset.id}
                    className={`asset-card ${isSelected ? 'selected' : ''}`}
                    onClick={() => setSelectedAssetId(asset.id)}
                  >
                    <div
                      className="card-left-rail"
                      style={{ backgroundColor: asset.accentColor }}
                    />

                    <div className="asset-card-top">
                      <div className="asset-header-left">
                        <div className="asset-icon-box">
                          {asset.iconType === 'database' ? (
                            <Database size={18} className="text-cyan" />
                          ) : asset.iconType === 'cloud' ? (
                            <Cloud size={18} className="text-mint" />
                          ) : asset.iconType === 'bank' ? (
                            <Lock size={18} className="text-red" />
                          ) : asset.iconType === 'browser' ? (
                            <Globe size={18} className="text-mint" />
                          ) : asset.iconType === 'terminal' ? (
                            <Terminal size={18} className="text-outline" />
                          ) : (
                            <Server size={18} className="text-blue" />
                          )}
                        </div>

                        <div className="asset-info-col">
                          <div className="asset-name-row">
                            <strong className="asset-name">{asset.name}</strong>
                            <span className="asset-cluster-badge font-mono">{asset.cluster}</span>
                            <span className={`asset-status-badge font-mono badge-${asset.badgeTone}`}>
                              {asset.badgeLabel}
                            </span>
                          </div>
                          <span className="asset-endpoint font-mono">{asset.endpoint}</span>
                        </div>
                      </div>

                      <div className="asset-header-right font-mono">
                        <span className="throughput-text">{asset.throughput} · {asset.latency}</span>
                        <ChevronRight size={16} className="text-cyan" />
                      </div>
                    </div>

                    <div className="asset-card-subgrid">
                      <div className="subgrid-col">
                        <span className="subgrid-label font-mono">Scoped Agent Leases</span>
                        <div className="leases-chips-row font-mono">
                          {asset.scopedAgents.map((ag, i) => (
                            <span
                              key={i}
                              className={`lease-chip ${ag.tone === 'red' ? 'lease-red' : ag.tone === 'mint' ? 'lease-mint' : 'lease-cyan'}`}
                            >
                              {ag.id} ({ag.perm})
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="subgrid-col">
                        <span className="subgrid-label font-mono">Hard Invariant Rules</span>
                        <div className="rule-text-row">
                          <ShieldAlert size={13} className="text-red shrink-0" />
                          <span className="truncate">{asset.hardRules[0]}</span>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            /* Compact Table View */
            <div className="assets-table-card">
              <table className="compact-table">
                <thead>
                  <tr className="font-mono">
                    <th>Integration Name</th>
                    <th>Category</th>
                    <th>Endpoint URI</th>
                    <th>Throughput</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody className="font-mono">
                  {filteredAssets.map((asset) => (
                    <tr
                      key={asset.id}
                      className={asset.id === selectedAsset.id ? 'row-active' : ''}
                      onClick={() => setSelectedAssetId(asset.id)}
                    >
                      <td className="font-semibold text-on-surface">{asset.name}</td>
                      <td><span className="cat-pill">{asset.category}</span></td>
                      <td className="text-xs text-outline truncate max-w-xs">{asset.endpoint}</td>
                      <td>{asset.throughput}</td>
                      <td><span className="text-mint font-bold">{asset.status}</span></td>
                      <td>
                        <button className="btn-table-select">Inspect</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Infrastructure Enclave Topology Visualization */}
          <div className="topology-schematic-card">
            <div className="schematic-header">
              <div className="schematic-title">
                <Network size={16} className="text-cyan" />
                <span className="font-mono">Live Intent Gateway Topology &amp; Egress Traces</span>
              </div>
              <span className="font-mono text-outline text-xs">REFRESH: 1.0s</span>
            </div>

            <div className="schematic-svg-wrap">
              <svg className="topology-svg" fill="none" viewBox="0 0 700 140" xmlns="http://www.w3.org/2000/svg">
                {/* Flow lines */}
                <path d="M 90 70 L 240 70" stroke="rgba(59, 73, 76, 0.6)" strokeDasharray="4 4" strokeWidth="1.5" />
                <path d="M 390 70 L 560 30" stroke="rgba(0, 229, 255, 0.4)" strokeDasharray="4 4" strokeWidth="1.5" />
                <path d="M 390 70 L 560 70" stroke="rgba(91, 233, 173, 0.4)" strokeDasharray="4 4" strokeWidth="1.5" />
                <path d="M 390 70 L 560 110" stroke="rgba(255, 180, 171, 0.4)" strokeDasharray="4 4" strokeWidth="1.5" />

                {/* Agent Nodes Group */}
                <rect fill="#1d1f27" height="50" rx="4" width="100" x="20" y="45" stroke="#3b494c" strokeWidth="1" />
                <text fill="#e1e2ec" fontFamily="JetBrains Mono" fontSize="10" fontWeight="600" textAnchor="middle" x="70" y="68">AGENT SWARM</text>
                <text fill="#849396" fontFamily="JetBrains Mono" fontSize="8" textAnchor="middle" x="70" y="82">FIN / COD / RES</text>

                {/* Gateway Node */}
                <rect fill="#191b23" height="70" rx="6" stroke="#00daf3" strokeWidth="1.5" width="150" x="240" y="35" />
                <text fill="#00e5ff" fontFamily="JetBrains Mono" fontSize="11" fontWeight="bold" textAnchor="middle" x="315" y="62">NEXUS INTENT GW</text>
                <text fill="#5be9ad" fontFamily="JetBrains Mono" fontSize="9" textAnchor="middle" x="315" y="78">AST Verification OK</text>
                <text fill="#849396" fontFamily="JetBrains Mono" fontSize="8" textAnchor="middle" x="315" y="92">Latency: 0.65ms</text>

                {/* Target Resource Nodes */}
                {/* Postgres */}
                <rect fill="#1d1f27" height="34" rx="4" width="125" x="560" y="12" stroke="#3b494c" strokeWidth="1" />
                <circle cx="575" cy="29" fill="#00e5ff" r="4" />
                <text fill="#e1e2ec" fontFamily="JetBrains Mono" fontSize="9" textAnchor="middle" x="625" y="32">PostgreSQL Core</text>

                {/* S3 / Cloud */}
                <rect fill="#1d1f27" height="34" rx="4" width="125" x="560" y="53" stroke="#3b494c" strokeWidth="1" />
                <circle cx="575" cy="70" fill="#5be9ad" r="4" />
                <text fill="#e1e2ec" fontFamily="JetBrains Mono" fontSize="9" textAnchor="middle" x="625" y="73">S3 Vault (SSE-C)</text>

                {/* Swift API */}
                <rect fill="#1d1f27" height="34" rx="4" width="125" x="560" y="94" stroke="#3b494c" strokeWidth="1" />
                <circle cx="575" cy="111" fill="#ffb4ab" r="4" />
                <text fill="#e1e2ec" fontFamily="JetBrains Mono" fontSize="9" textAnchor="middle" x="625" y="114">Swift Financial</text>
              </svg>

              <div className="schematic-footer font-mono">
                <span>Enclave Verification Token: <strong className="text-on-surface">0x88F7...AE3B</strong></span>
                <span className="text-mint">AST Deterministic Pipeline Active</span>
              </div>
            </div>
          </div>
        </div>

        {/* Side Panel / Selected Integration Deep-Dive (4 Cols) */}
        <div className="integrations-sidebar-col">
          <div className="drawer-panel-card">
            <div className="drawer-header-top">
              <div className="drawer-title-row">
                <ShieldCheck size={16} className="text-cyan" />
                <span className="font-mono text-xs uppercase text-outline font-bold">Active Inspection Drawer</span>
              </div>
              <span className="sync-badge font-mono">{selectedAsset.status}</span>
            </div>

            <div className="drawer-title-block">
              <h2 className="drawer-asset-name">{selectedAsset.name}</h2>
              <span className="drawer-endpoint font-mono break-all">{selectedAsset.endpoint}</span>
            </div>

            {/* Connection Parameters & Engine */}
            <div className="drawer-params-box font-mono">
              <div className="param-item">
                <span className="text-outline">Enforcement Engine</span>
                <span className="text-on-surface font-semibold">{selectedAsset.enforcementEngine}</span>
              </div>
              <div className="param-item">
                <span className="text-outline">Session Auth Mode</span>
                <span className="text-on-surface">{selectedAsset.sessionAuthMode}</span>
              </div>
              <div className="param-item">
                <span className="text-outline">Payload Hashing</span>
                <span className="text-on-surface">{selectedAsset.payloadHashing}</span>
              </div>
              <div className="param-item">
                <span className="text-outline">Assigned Policy Pack</span>
                <span className="text-cyan font-bold">{selectedAsset.assignedPolicyPack}</span>
              </div>
            </div>

            {/* Active Perimeter Tripwires */}
            <div className="tripwires-section">
              <span className="section-label font-mono">Active Perimeter Tripwires</span>
              <div className="tripwires-list">
                {selectedAsset.tripwires.map((tw, idx) => (
                  <div key={idx} className={`tripwire-box box-${tw.type}`}>
                    <div className="tripwire-header">
                      <span className="tripwire-name flex items-center gap-1 font-semibold">
                        {tw.type === 'danger' ? (
                          <AlertTriangle size={13} className="text-red" />
                        ) : (
                          <Shield size={13} className="text-cyan" />
                        )}
                        {tw.name}
                      </span>
                      <span className="tripwire-status font-mono">{tw.status}</span>
                    </div>
                    <p className="tripwire-desc">{tw.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Telemetry Sparkline */}
            <div className="sparkline-card font-mono">
              <div className="sparkline-header">
                <span>AST Parse Latency (Past 60m)</span>
                <span className="text-mint font-bold">p99: 0.81ms</span>
              </div>
              <div className="sparkline-bars">
                {[30, 45, 40, 55, 70, 35, 85, 50, 60, 30, 90, 65, 40, 55].map((val, i) => (
                  <div
                    key={i}
                    className="spark-bar"
                    style={{ height: `${val}%` }}
                    title={`Tick ${i}: ${val}% load`}
                  />
                ))}
              </div>
            </div>

            {/* Deep-Dive Quick Action Buttons */}
            <div className="drawer-actions-col font-mono">
              <button
                className="btn-action-outline"
                onClick={handleRunGatewayTest}
              >
                <Wifi size={14} className="text-cyan" />
                <span>Test Gateway Connection</span>
              </button>

              <button
                className="btn-action-outline"
                onClick={() => setLogsModalOpen(true)}
              >
                <Terminal size={14} className="text-outline" />
                <span>Inspect Proxy Access Logs</span>
              </button>

              <button
                className="btn-action-danger"
                onClick={() => setRevokeModalOpen(true)}
              >
                <Gavel size={14} className="text-red" />
                <span>Revoke All Agent Leases</span>
              </button>
            </div>
          </div>

          {/* Nitro Enclave Cryptographic Attestation Card */}
          <div className="enclave-attestation-card">
            <span className="enclave-card-title font-mono">
              Nitro Enclave Cryptographic Attestation
            </span>

            <div className="enclave-status-banner font-mono">
              <BadgeCheck size={14} className="text-mint" />
              <span>HARDWARE ATTESTATION: VALID</span>
            </div>

            <div className="enclave-footer-row font-mono text-xs">
              <span className="text-outline">PCR0: {selectedAsset.pcr0}</span>
              <span className="text-mint">Verified By AWS KMS</span>
            </div>
          </div>
        </div>
      </section>

      {/* Modal 1: Register New Tool */}
      {registerModalOpen && (
        <div className="integrations-modal-backdrop" onClick={() => setRegisterModalOpen(false)}>
          <div className="integrations-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title-with-icon">
                <Plus size={20} className="text-cyan" />
                <div>
                  <h3>Register New Asset / Perimeter Gateway</h3>
                  <p>Enroll an external resource under NexusGuard zero-trust intent proxy.</p>
                </div>
              </div>
              <button className="modal-close-btn" onClick={() => setRegisterModalOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <div className="modal-body">
              <div className="form-group">
                <label className="font-mono">Integration / Tool Name</label>
                <input
                  type="text"
                  className="modal-input"
                  placeholder="e.g. Production Snowflake Warehouse"
                  value={newToolName}
                  onChange={(e) => setNewToolName(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="font-mono">Infrastructure Category</label>
                <select
                  className="modal-select font-mono"
                  value={newToolCategory}
                  onChange={(e) => setNewToolCategory(e.target.value as any)}
                >
                  <option value="databases">Relational / Analytical Database</option>
                  <option value="apis">External / Internal REST API</option>
                  <option value="cloud">Cloud Storage / Object Store</option>
                  <option value="sandboxes">Isolated Sandbox / Browser</option>
                  <option value="git">Code / Git Repository</option>
                </select>
              </div>

              <div className="form-group">
                <label className="font-mono">Endpoint URI / Connection String</label>
                <input
                  type="text"
                  className="modal-input font-mono"
                  placeholder="e.g. postgresql://cluster.internal:5432/db"
                  value={newToolEndpoint}
                  onChange={(e) => setNewToolEndpoint(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="font-mono">Assigned Primary Autonomous Agent</label>
                <select
                  className="modal-select font-mono"
                  value={newToolAgent}
                  onChange={(e) => setNewToolAgent(e.target.value)}
                >
                  {agents.map((ag) => (
                    <option key={ag.id} value={ag.id}>
                      {ag.id} ({ag.name})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn-cancel" onClick={() => setRegisterModalOpen(false)}>
                Cancel
              </button>
              <button className="btn-confirm-primary" onClick={handleSaveNewTool}>
                <CheckCircle2 size={15} />
                <span>Enroll Asset &amp; Apply Proxy</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 2: Test Gateway Connection */}
      {testModalOpen && (
        <div className="integrations-modal-backdrop" onClick={() => setTestModalOpen(false)}>
          <div className="integrations-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title-with-icon">
                <Wifi size={20} className="text-cyan" />
                <div>
                  <h3>Gateway Connectivity &amp; Enclave Handshake</h3>
                  <p>Pinging proxy endpoint: {selectedAsset.name}</p>
                </div>
              </div>
              <button className="modal-close-btn" onClick={() => setTestModalOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <div className="modal-body font-mono">
              <div className="test-info-box">
                <div><strong>Target URI:</strong> {selectedAsset.endpoint}</div>
                <div><strong>Protocol:</strong> {selectedAsset.protocol}</div>
                <div><strong>Proxy Pipeline:</strong> AST Parser v4.2.1 • Zero-Drift Verified</div>
              </div>

              {testTesting ? (
                <div className="test-running-box">
                  <RefreshCw className="animate-spin text-cyan" size={24} />
                  <span>Executing mTLS 1.3 cryptographic handshake...</span>
                </div>
              ) : testSuccess ? (
                <div className="test-success-box">
                  <BadgeCheck size={24} className="text-mint" />
                  <div>
                    <strong className="text-mint">Connection Verified (0.42ms)</strong>
                    <p className="text-xs text-outline mt-1">
                      Gateway latency p99 optimal. Hardware Nitro enclave certificate is valid and active.
                    </p>
                  </div>
                </div>
              ) : null}
            </div>

            <div className="modal-footer">
              <button className="btn-cancel" onClick={() => setTestModalOpen(false)}>
                Close
              </button>
              <button className="btn-confirm-primary" onClick={handleRunGatewayTest} disabled={testTesting}>
                <RefreshCw size={14} className={testTesting ? 'animate-spin' : ''} />
                <span>Re-Test Handshake</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 3: Inspect Proxy Access Logs */}
      {logsModalOpen && (
        <div className="integrations-modal-backdrop" onClick={() => setLogsModalOpen(false)}>
          <div className="integrations-modal-box modal-wide" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title-with-icon">
                <Terminal size={20} className="text-cyan" />
                <div>
                  <h3>Live Proxy Access Logs: {selectedAsset.name}</h3>
                  <p>Deterministic AST parser audit stream for last 10 requests.</p>
                </div>
              </div>
              <button className="modal-close-btn" onClick={() => setLogsModalOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <div className="modal-body">
              <pre className="logs-terminal font-mono">
{`[14:32:17.804] FIN-AGENT-01 -> ${selectedAsset.endpoint} [STATUS: ALLOWED] (0.4ms)
  AST Tokenizer: Verified SELECT query. Zero schema write mutations.
[14:32:02.119] FIN-AGENT-01 -> ${selectedAsset.endpoint} [STATUS: ALLOWED] (0.5ms)
  AST Tokenizer: Validated WHERE clause against tenant ID 'CORP_EAST'.
[14:28:05.116] FIN-AGENT-01 -> ${selectedAsset.endpoint} [STATUS: BLOCKED] (1.1ms)
  SECURITY TRIPWIRE: Detected 'UPDATE payroll' attempt. Severed execution.
[14:25:40.091] DB-AGENT-01  -> ${selectedAsset.endpoint} [STATUS: ALLOWED] (0.8ms)
  Dual-Key Quorum Verified: Snapshot replication query passed.
[14:20:12.384] SYSTEM_CRON  -> ${selectedAsset.endpoint} [STATUS: ALLOWED] (0.2ms)
  Health Check: Enclave ping OK. Hardware PCR0 valid.`}
              </pre>
            </div>

            <div className="modal-footer">
              <button className="btn-cancel" onClick={() => setLogsModalOpen(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 4: Revoke All Agent Leases */}
      {revokeModalOpen && (
        <div className="integrations-modal-backdrop" onClick={() => setRevokeModalOpen(false)}>
          <div className="integrations-modal-box modal-danger" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title-with-icon">
                <AlertTriangle size={22} className="text-red" />
                <div>
                  <h3>Emergency Revoke: {selectedAsset.name}</h3>
                  <p className="text-red">Sever all autonomous agent connections and invalidate tokens.</p>
                </div>
              </div>
              <button className="modal-close-btn" onClick={() => setRevokeModalOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <div className="modal-body">
              <p className="revoke-warn-text">
                Executing emergency revocation will immediately:
              </p>
              <ul className="modal-safeguards-list">
                <li><AlertTriangle size={14} className="text-red" /> Invalidate active mTLS leases across all assigned agents</li>
                <li><AlertTriangle size={14} className="text-red" /> Terminate in-flight queries and drop connection pool sockets</li>
                <li><AlertTriangle size={14} className="text-red" /> Set integration state to ISOLATED until human operator re-authorizes</li>
              </ul>
            </div>

            <div className="modal-footer">
              <button className="btn-cancel" onClick={() => setRevokeModalOpen(false)}>
                Cancel
              </button>
              <button className="btn-confirm-revoke" onClick={handleConfirmRevoke}>
                <Gavel size={15} />
                <span>Confirm Revoke All Leases</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
