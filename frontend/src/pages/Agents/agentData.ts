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

export const sampleAgents: Agent[] = [
  { id: 'FIN-AGENT-01', name: 'Finance Agent Alpha', model: 'Claude 3.5 Sonnet', owner: 'Ops. Vance', role: 'Financial Analyst', cluster: 'Cluster-Fin-09', status: 'restricted', trust: 87, risk: 'MEDIUM', lastAction: 'PostgreSQL query', lastSeen: '2m ago · db_fin_rd', permissions: ['READ: Finance', 'QUERY: DB'], violations: 1 },
  { id: 'RES-AGENT-01', name: 'Research Core Vector', model: 'GPT-4o', owner: 'Team R&D', role: 'Research Analyst', cluster: 'Cluster-AI-01', status: 'active', trust: 94, risk: 'LOW', lastAction: 'Vector DB search', lastSeen: '5m ago · Pinecone', permissions: ['SEARCH: Vector', 'READ: Arxiv'], violations: 0 },
  { id: 'COD-AGENT-01', name: 'DevOps Synth Bot', model: 'Claude 3.5 Sonnet', owner: 'Infrastructure', role: 'DevOps Engineer', cluster: 'K8s-Prod-Worker', status: 'active', trust: 91, risk: 'LOW', lastAction: 'Git branch PR merge', lastSeen: '11m ago · Repo tools', permissions: ['GIT: Push', 'EXECUTE: CI'], violations: 0 },
  { id: 'HR-AGENT-01', name: 'People Onboarder', model: 'GPT-4o', owner: 'Human Capital', role: 'HR Assistant', cluster: 'Cluster-HR-SEC', status: 'restricted', trust: 72, risk: 'MEDIUM', lastAction: 'PII query intercepted', lastSeen: '18m ago · Workday API', permissions: ['READ: HR Wiki', 'WRITE: Ticket'], violations: 2 },
  { id: 'DB-AGENT-01', name: 'DB Orchestrator', model: 'Claude 3.5 Sonnet', owner: 'Cloud DBAs', role: 'Database Ops', cluster: 'RDS-Cluster-US', status: 'active', trust: 89, risk: 'LOW', lastAction: 'Vacuum analyze db_prod', lastSeen: '24m ago · Aurora replica', permissions: ['DB: Maintenance', 'METRICS: Read'], violations: 0 },
  { id: 'RED-AGENT-01', name: 'Adversarial Probe X', model: 'Mistral Large', owner: 'SecOps Lab', role: 'Security Testing', cluster: 'Sandbox-Isolated', status: 'quarantined', trust: 18, risk: 'CRITICAL', lastAction: 'Blocked write attempt', lastSeen: 'just now · sandbox', permissions: ['REVOKED: All'], violations: 7 },
];