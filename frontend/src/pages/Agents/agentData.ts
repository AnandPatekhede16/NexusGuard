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
  { id: 'FIN-AGENT-01', name: 'Finance Agent Alpha', model: 'Claude 3.5 Sonnet', owner: 'Col. Vance', role: 'Financial Analyst', cluster: 'Cluster-Fin-09', status: 'restricted', trust: 87, risk: 'MEDIUM', lastAction: 'PostgreSQL query', lastSeen: '2m ago · db_fin_rd', permissions: ['READ: Finance', 'QUERY: DB'], violations: 1 },
  { id: 'COD-AGENT-01', name: 'DevOps Synth Bot', model: 'Claude 3.5 Sonnet', owner: 'Infrastructure', role: 'DevOps Engineer', cluster: 'K8s-Prod-Worker', status: 'active', trust: 91, risk: 'LOW', lastAction: 'Git branch PR merge', lastSeen: '11m ago · Repo tools', permissions: ['GIT: Push', 'EXECUTE: CI'], violations: 0 },
  { id: 'HR-AGENT-01', name: 'People Onboarder', model: 'GPT-4o', owner: 'Human Capital', role: 'HR Assistant', cluster: 'Cluster-HR-SEC', status: 'restricted', trust: 72, risk: 'MEDIUM', lastAction: 'PII query intercepted', lastSeen: '18m ago · Workday API', permissions: ['READ: HR Wiki', 'WRITE: Ticket'], violations: 2 },
  { id: 'RES-AGENT-01', name: 'Research Core Vector', model: 'GPT-4o', owner: 'Team R&D', role: 'Research Analyst', cluster: 'Cluster-AI-01', status: 'active', trust: 94, risk: 'LOW', lastAction: 'Vector DB search', lastSeen: '5m ago · Pinecone', permissions: ['SEARCH: Vector', 'READ: Arxiv'], violations: 0 },
  { id: 'DEV-AGENT-04', name: 'Staging Pod Deployer', model: 'Claude 3.5 Sonnet', owner: 'DevPlatform', role: 'Cloud Engineer', cluster: 'us-east-k8s', status: 'active', trust: 92, risk: 'LOW', lastAction: 'Spin Up Ephemeral Staging Pod', lastSeen: '8m ago · k8s cluster', permissions: ['EXECUTE: CI', 'METRICS: Read'], violations: 0 },
  { id: 'SUP-AGENT-09', name: 'Support Triage Bot', model: 'GPT-4o', owner: 'Customer Care', role: 'Support Specialist', cluster: 'Salesforce-Edge', status: 'restricted', trust: 65, risk: 'CRITICAL', lastAction: 'Extract Credit Card Tokens from CRM Logs', lastSeen: '14m ago · CRM cache', permissions: ['READ: Ticket', 'READ: CRM Logs'], violations: 3 },
  { id: 'ANL-AGENT-02', name: 'Revenue Forecast Engine', model: 'GPT-4o', owner: 'Data Org', role: 'BI Analyst', cluster: 'BigQuery-Warehouse', status: 'active', trust: 95, risk: 'LOW', lastAction: 'Daily Revenue Forecast Summary', lastSeen: '16m ago · BigQuery', permissions: ['QUERY: DB', 'READ: Reports'], violations: 0 },
  { id: 'OPS-AGENT-03', name: 'Edge SRE Controller', model: 'Claude 3.5 Sonnet', owner: 'Reliability Ops', role: 'SRE Operator', cluster: 'Edge-Cloudflare', status: 'restricted', trust: 76, risk: 'HIGH', lastAction: 'Modify NGINX Edge Rate-Limiting Threshold', lastSeen: '20m ago · Cloudflare', permissions: ['METRICS: Read', 'CONFIG: EdgeProxy'], violations: 1 },
  { id: 'INF-AGENT-08', name: 'Vault Enclave Custodian', model: 'Claude 3.5 Sonnet', owner: 'SecOps Lab', role: 'Security Operator', cluster: 'HashiCorp-Vault', status: 'active', trust: 96, risk: 'LOW', lastAction: 'Rotate Internal Mutual-TLS Certificates', lastSeen: '22m ago · Vault Enclave', permissions: ['DB: Maintenance', 'METRICS: Read'], violations: 0 },
  { id: 'MKT-AGENT-05', name: 'Editorial CMS Dispatcher', model: 'GPT-4o', owner: 'Growth Org', role: 'Content Creator', cluster: 'Headless-CMS', status: 'active', trust: 98, risk: 'LOW', lastAction: 'Publish Scheduled Blog Content Payload', lastSeen: '28m ago · Headless CMS', permissions: ['WRITE: Ticket', 'READ: Reports'], violations: 0 },
  { id: 'DB-AGENT-01', name: 'DB Orchestrator', model: 'Claude 3.5 Sonnet', owner: 'Cloud DBAs', role: 'Database Ops', cluster: 'RDS-Cluster-US', status: 'active', trust: 89, risk: 'LOW', lastAction: 'Vacuum analyze db_prod', lastSeen: '24m ago · Aurora replica', permissions: ['DB: Maintenance', 'METRICS: Read'], violations: 0 },
  { id: 'RED-AGENT-01', name: 'Adversarial Probe X', model: 'Mistral Large', owner: 'SecOps Lab', role: 'Security Testing', cluster: 'Sandbox-Isolated', status: 'quarantined', trust: 18, risk: 'CRITICAL', lastAction: 'Blocked write attempt', lastSeen: 'just now · sandbox', permissions: ['REVOKED: All'], violations: 7 },
];