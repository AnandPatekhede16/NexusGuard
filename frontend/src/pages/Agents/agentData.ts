export type AgentStatus = 'active' | 'restricted' | 'quarantined';

export type Agent = {
  id: string;
  name: string;
  model: string;
  owner: string;
  role: string;
  cluster: string;
  status: AgentStatus;
  trust: number;
  risk: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  lastAction: string;
  lastSeen: string;
  permissions: string[];
  violations: number;
};

// The 5 Sovereign Autonomous Agents verified in Oracle Database 11g
export const sovereignAgents: Agent[] = [
  {
    id: 'DB-AGENT-01',
    name: 'DB Orchestrator',
    model: 'Claude 3.5 Sonnet',
    owner: 'Cloud DBAs',
    role: 'Database Ops & Schema Migrations',
    cluster: 'Oracle-Prod-Cluster',
    status: 'active',
    trust: 92,
    risk: 'LOW',
    lastAction: 'SELECT * FROM agents',
    lastSeen: 'just now · localhost:1521/ORCL',
    permissions: ['QUERY: DB', 'WRITE: DB', 'DB: Maintenance'],
    violations: 0,
  },
  {
    id: 'FIN-AGENT-01',
    name: 'Finance Agent Alpha',
    model: 'GPT-4o',
    owner: 'Treasury Systems',
    role: 'Financial Analyst & Ledger Gateway',
    cluster: 'Cluster-Finance-09',
    status: 'active',
    trust: 88,
    risk: 'LOW',
    lastAction: 'Treasury ledger reconciliation',
    lastSeen: '3m ago · Fin-Enclave',
    permissions: ['READ: Finance', 'QUERY: DB'],
    violations: 0,
  },
  {
    id: 'COD-AGENT-01',
    name: 'DevOps Synth Bot',
    model: 'Claude 3.5 Sonnet',
    owner: 'Platform Infrastructure',
    role: 'Autonomous CI/CD & Build Operator',
    cluster: 'K8s-Prod-Worker',
    status: 'active',
    trust: 91,
    risk: 'LOW',
    lastAction: 'Git branch PR automated verification',
    lastSeen: '6m ago · Git-Runner',
    permissions: ['GIT: Push', 'EXECUTE: CI'],
    violations: 0,
  },
  {
    id: 'RES-AGENT-01',
    name: 'Research Core Vector',
    model: 'Gemini 1.5 Pro',
    owner: 'Autonomous R&D SecOps',
    role: 'Academic Intelligence & Vector Discovery',
    cluster: 'Cluster-AI-Vector',
    status: 'active',
    trust: 95,
    risk: 'LOW',
    lastAction: 'Vector DB similarity query',
    lastSeen: '8m ago · Pinecone-Enclave',
    permissions: ['SEARCH: Vector', 'READ: Arxiv'],
    violations: 0,
  },
  {
    id: 'RED-AGENT-01',
    name: 'Adversarial Probe X (RedAgent)',
    model: 'Mistral Large / Probe-v1',
    owner: 'SecOps Penetration Lab',
    role: 'Adversarial Threat Emulation & Probing',
    cluster: 'Isolated-Sandbox',
    status: 'quarantined',
    trust: 18,
    risk: 'CRITICAL',
    lastAction: 'Simulated prompt injection intercepted',
    lastSeen: 'just now · Sandbox',
    permissions: ['REVOKED: All'],
    violations: 7,
  },
];

// Default sample export using the 5 core agents
export const sampleAgents: Agent[] = sovereignAgents;
