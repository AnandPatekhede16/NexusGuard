import { useMemo, useState, type Dispatch, type FormEvent, type SetStateAction } from 'react';
import {
  Activity, AlertTriangle, ArrowDownToLine, BadgeCheck, Banknote,
  Check, CheckCircle2, ChevronRight, CircleHelp, ClipboardCheck, Database,
  Download, Eye, Fingerprint, FlaskConical, LockKeyhole, Pause, Play,
  Plus, RefreshCw, Search, Shield, ShieldAlert, SlidersHorizontal, Terminal,
  UserRound, X,
} from 'lucide-react';
import './agents.css';
import { type Agent, type AgentStatus, sampleAgents } from './agentData';
type Filter = 'all' | AgentStatus;

const filterOptions: { key: Filter; label: string; icon?: typeof CheckCircle2 }[] = [
  { key: 'all', label: 'All agents' },
  { key: 'active', label: 'Active', icon: CheckCircle2 },
  { key: 'restricted', label: 'Restricted / review', icon: AlertTriangle },
  { key: 'quarantined', label: 'Quarantined / isolated', icon: ShieldAlert },
];

function saveJson(filename: string, content: unknown) {
  const file = new Blob([JSON.stringify(content, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(file);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function statusName(status: AgentStatus) {
  if (status === 'restricted') return 'Restricted';
  if (status === 'quarantined') return 'Quarantined';
  return 'Active';
}

export default function AgentRegistry({
  query,
  onQueryChange,
  onNotify,
  agents,
  setAgents,
  onOpenAgentDetail,
}: {
  query: string;
  onQueryChange: (value: string) => void;
  onNotify: (message: string) => void;
  agents: Agent[];
  setAgents: Dispatch<SetStateAction<Agent[]>>;
  onOpenAgentDetail: (agentId: string) => void;
}) {
  const [filter, setFilter] = useState<Filter>('all');
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(sampleAgents[0].id);
  const [registerOpen, setRegisterOpen] = useState(false);
  const [policyOpen, setPolicyOpen] = useState(false);
  const [recheckCount, setRecheckCount] = useState(0);

  const counts = useMemo(() => ({
    all: agents.length,
    active: agents.filter((agent) => agent.status === 'active').length,
    restricted: agents.filter((agent) => agent.status === 'restricted').length,
    quarantined: agents.filter((agent) => agent.status === 'quarantined').length,
  }), [agents]);

  const visibleAgents = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return agents.filter((agent) => {
      const statusMatches = filter === 'all' || agent.status === filter;
      const queryMatches = !normalized || [agent.id, agent.name, agent.model, agent.owner, agent.role, agent.cluster, agent.lastAction, ...agent.permissions]
        .some((field) => field.toLowerCase().includes(normalized));
      return statusMatches && queryMatches;
    });
  }, [agents, filter, query]);

  const selectedAgent = agents.find((agent) => agent.id === selectedAgentId) ?? null;
  const meanTrust = agents.length ? (agents.reduce((sum, agent) => sum + agent.trust, 0) / agents.length).toFixed(1) : '0.0';
  const totalViolations = agents.reduce((sum, agent) => sum + agent.violations, 0);

  function updateAgent(id: string, update: Partial<Agent>) {
    setAgents((current) => current.map((agent) => agent.id === id ? { ...agent, ...update } : agent));
  }

  function registerAgent(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const id = String(formData.get('id')).trim().toUpperCase();
    if (agents.some((agent) => agent.id.toLowerCase() === id.toLowerCase())) {
      onNotify(`Agent ID ${id} already exists in this demo directory.`);
      return;
    }
    const newAgent: Agent = {
      id,
      name: String(formData.get('name')).trim(),
      model: String(formData.get('model')).trim(),
      owner: String(formData.get('owner')).trim(),
      role: String(formData.get('role')).trim(),
      cluster: 'Local demo workspace',
      status: 'restricted',
      trust: 50,
      risk: 'MEDIUM',
      lastAction: 'No actions recorded',
      lastSeen: 'not connected',
      permissions: [],
      violations: 0,
    };
    setAgents((current) => [newAgent, ...current]);
    setSelectedAgentId(newAgent.id);
    setFilter('all');
    onQueryChange('');
    setRegisterOpen(false);
    onNotify(`${newAgent.id} added to the local demo directory as restricted.`);
  }

  function toggleSuspension(agent: Agent) {
    const nextStatus: AgentStatus = agent.status === 'active' ? 'restricted' : 'active';
    updateAgent(agent.id, { status: nextStatus });
    onNotify(`${agent.id} marked ${statusName(nextStatus).toLowerCase()} in the local preview.`);
  }

  function quarantineAgent(agent: Agent) {
    const confirmed = window.confirm(`Mark ${agent.id} as quarantined in this local preview? No real agent or network access will be affected.`);
    if (!confirmed) return;
    updateAgent(agent.id, { status: 'quarantined', risk: 'CRITICAL', permissions: ['REVOKED: All'] });
    onNotify(`${agent.id} marked quarantined in the local preview only.`);
  }

  function reEvaluate() {
    setRecheckCount((count) => count + 1);
    onNotify(`Preview policy review complete for ${agents.length} sample agents. No live policies were changed.`);
  }

  function exportManifest() {
    saveJson('nexusguard-agent-registry-demo.json', {
      generatedAt: new Date().toISOString(),
      environment: 'local-demo',
      liveBackendConnected: false,
      agents,
    });
    onNotify('Sample registry manifest downloaded as JSON.');
  }

  return (
    <div className="registry-page">
      <section className="registry-heading">
        <div className="registry-heading-copy">
          <div className="registry-eyebrow"><span>IDENTITY GOVERNANCE</span><i /> LOCAL SAMPLE DIRECTORY</div>
          <h1>Agent Registry &amp; Directory</h1>
          <p>Review agent identities, trust signals, permissions, and sample activity. This directory is stored in your browser session only.</p>
        </div>
        <div className="registry-actions">
          <button className="registry-button registry-button-neutral" onClick={exportManifest}><Download size={15} /> Export manifest</button>
          <button className="registry-button registry-button-neutral" onClick={reEvaluate}><RefreshCw size={15} /> Re-evaluate policies</button>
          <button className="registry-button registry-button-primary" onClick={() => setRegisterOpen(true)}><Plus size={16} /> Register agent</button>
        </div>
      </section>

      <section aria-label="Sample agent registry summary" className="registry-summary">
        <article><span>DIRECTORY RECORDS</span><div><strong>{agents.length}</strong><small>sample agents</small></div><LayersIcon /></article>
        <article><span>MEAN TRUST SCORE</span><div><strong className="summary-mint">{meanTrust}</strong><small>/ 100</small></div><BadgeCheck size={19} /></article>
        <article><span>POLICY VIOLATIONS</span><div><strong className="summary-blue">{totalViolations}</strong><small>recorded in samples</small></div><ShieldAlert size={19} /></article>
        <article><span>QUARANTINED</span><div><strong className="summary-red">{counts.quarantined}</strong><small>sample status</small></div><LockKeyhole size={19} /></article>
      </section>

      <section className="registry-toolbar" aria-label="Agent directory filters">
        <div className="registry-filters" role="tablist" aria-label="Filter agents by status">
          {filterOptions.map(({ key, label, icon: Icon }) => <button
            aria-selected={filter === key}
            className={`registry-filter${filter === key ? ' registry-filter-active' : ''}`}
            key={key}
            onClick={() => setFilter(key)}
            role="tab"
          >
            {Icon && <Icon size={13} />}{label}<span>{counts[key]}</span>
          </button>)}
        </div>
        <label className="registry-search"><Search size={15} /><input aria-label="Search agents" onChange={(event) => onQueryChange(event.target.value)} placeholder="Filter by ID, role, model, owner..." value={query} />{query && <button aria-label="Clear agent search" onClick={() => onQueryChange('')} type="button"><X size={13} /></button>}</label>
      </section>

      <section className="registry-workspace">
        <div className="registry-table-panel">
          <div className="registry-table-scroll">
            <table className="registry-table">
              <thead><tr><th>Agent &amp; identity</th><th>Agent ID</th><th>Role &amp; cluster</th><th>Status</th><th>Trust</th><th>Risk</th><th>Last action</th><th>Permissions</th><th>Violations</th><th aria-label="Actions" /></tr></thead>
              <tbody>
                {visibleAgents.map((agent) => <tr aria-selected={selectedAgentId === agent.id} className={selectedAgentId === agent.id ? 'agent-row-selected' : ''} key={agent.id} onClick={() => { setSelectedAgentId(agent.id); setPolicyOpen(false); }}>
                  <td><div className="agent-identity"><span className={`agent-avatar agent-avatar-${agent.status}`}>{agent.id.startsWith('FIN') ? <Banknote size={17} /> : agent.id.startsWith('RES') ? <FlaskConical size={17} /> : agent.id.startsWith('DB') ? <Database size={17} /> : agent.id.startsWith('RED') ? <ShieldAlert size={17} /> : agent.id.startsWith('HR') ? <UserRound size={17} /> : <Terminal size={17} />}</span><span><strong>{agent.name}</strong><small>{agent.model} · {agent.owner}</small></span></div></td>
                  <td><span className="agent-id">{agent.id}</span></td>
                  <td><span className="role-cell"><strong>{agent.role}</strong><small>{agent.cluster}</small></span></td>
                  <td><span className={`agent-status status-${agent.status}`}><i />{statusName(agent.status)}</span></td>
                  <td><span className="trust-cell"><span className="trust-track"><i style={{ width: `${agent.trust}%` }} /></span><strong>{agent.trust}%</strong></span></td>
                  <td><span className={`risk-cell risk-${agent.risk.toLowerCase()}`}>{agent.risk}</span></td>
                  <td><span className="last-action"><strong>{agent.lastAction}</strong><small>{agent.lastSeen}</small></span></td>
                  <td><span className="permission-list">{agent.permissions.length ? agent.permissions.slice(0, 2).map((permission) => <i key={permission}>{permission}</i>) : <i>None granted</i>}</span></td>
                  <td><span className={`violation-count${agent.violations ? ' has-violations' : ''}`}>{agent.violations}</span></td>
                  <td><div className="row-actions"><button aria-label={`Inspect ${agent.id}`} onClick={(event) => { event.stopPropagation(); setSelectedAgentId(agent.id); setPolicyOpen(false); }} title="Inspect agent"><Eye size={15} /></button><button aria-label={`Policy options for ${agent.id}`} onClick={(event) => { event.stopPropagation(); setSelectedAgentId(agent.id); setPolicyOpen(true); }} title="Policy options"><SlidersHorizontal size={15} /></button></div></td>
                </tr>)}
                {visibleAgents.length === 0 && <tr><td className="registry-empty" colSpan={10}>No sample agents match the current filter.</td></tr>}
              </tbody>
            </table>
          </div>
          <div className="registry-table-footer"><span>Showing <strong>{visibleAgents.length}</strong> of {agents.length} sample agents</span><span><CircleHelp size={13} /> Sample records only · live directory is not connected</span></div>
        </div>

        {selectedAgent && <aside aria-label={`${selectedAgent.id} details`} className="agent-detail-panel">
          <div className="detail-header"><div><span className="agent-id">{selectedAgent.id}</span><span className={`agent-status status-${selectedAgent.status}`}><i />{statusName(selectedAgent.status)}</span></div><button aria-label="Close agent details" onClick={() => setSelectedAgentId(null)}><X size={16} /></button></div>
          <h2>{selectedAgent.name}</h2><p className="detail-subtitle">{selectedAgent.role} · sample identity profile</p>
          <div className="trust-summary"><div><span>CALCULATED TRUST</span><strong>{selectedAgent.trust}<small> / 100</small></strong><em>{selectedAgent.risk} RISK · SAMPLE</em></div><div className="trust-ring" style={{ '--trust': `${selectedAgent.trust}%` } as React.CSSProperties}><span>{selectedAgent.trust}</span></div></div>
          <section className="detail-section"><h3><Fingerprint size={14} /> Identity profile</h3><dl><div><dt>Owner</dt><dd>{selectedAgent.owner}</dd></div><div><dt>Model</dt><dd>{selectedAgent.model}</dd></div><div><dt>Cluster</dt><dd>{selectedAgent.cluster}</dd></div><div><dt>Last activity</dt><dd>{selectedAgent.lastSeen}</dd></div></dl></section>
          <section className="detail-section"><h3><Activity size={14} /> Last recorded action</h3><div className="last-action-detail"><Terminal size={14} /><span>{selectedAgent.lastAction}</span></div></section>
          <section className="detail-section"><h3><LockKeyhole size={14} /> Permission boundaries</h3><div className="detail-permissions">{selectedAgent.permissions.map((permission) => <span key={permission}><Check size={12} />{permission}</span>)}{selectedAgent.permissions.length === 0 && <span>No permissions assigned in this sample.</span>}</div></section>
          {policyOpen && <section className="policy-note"><ClipboardCheck size={15} /><span><strong>Policy review panel</strong><small>Permission changes require a connected policy service. Use re-evaluate to update the local preview only.</small>{recheckCount > 0 && <small>Local preview reviews run: {recheckCount}</small>}</span></section>}
          <div className="detail-actions"><button onClick={() => { setPolicyOpen((open) => !open); }}>{policyOpen ? <CheckCircle2 size={14} /> : <SlidersHorizontal size={14} />}{policyOpen ? 'Close policy review' : 'Policies'}</button><button onClick={() => toggleSuspension(selectedAgent)}>{selectedAgent.status === 'active' ? <Pause size={14} /> : <Play size={14} />}{selectedAgent.status === 'active' ? 'Restrict' : 'Mark active'}</button><button className="detail-quarantine" onClick={() => quarantineAgent(selectedAgent)}><ShieldAlert size={14} />Quarantine</button><button className="detail-open-profile" onClick={() => onOpenAgentDetail(selectedAgent.id)}><Fingerprint size={14} />Open full profile</button></div>
          <p className="detail-disclaimer">Actions above modify local sample state only. No agent identity, token, or network permission is changed.</p>
        </aside>}
      </section>

      <div className="registry-note"><CircleHelp size={14} /><span>Trust scores, events, and identities on this page are illustrative. Connect a backend before using the registry operationally.</span></div>

      {registerOpen && <div className="registry-modal-backdrop" onClick={() => setRegisterOpen(false)} role="presentation"><section aria-labelledby="register-title" aria-modal="true" className="register-modal" onClick={(event) => event.stopPropagation()} role="dialog"><div className="register-modal-heading"><div><span className="registry-eyebrow">LOCAL SAMPLE DIRECTORY</span><h2 id="register-title">Register an agent</h2><p>Creates a restricted sample entry in this browser session only.</p></div><button aria-label="Close registration form" onClick={() => setRegisterOpen(false)}><X size={18} /></button></div><form onSubmit={registerAgent}><label>AGENT ID<input autoFocus maxLength={32} name="id" pattern="[A-Za-z0-9][A-Za-z0-9._-]{2,31}" placeholder="OPS-AGENT-01" required /></label><label>DISPLAY NAME<input maxLength={70} name="name" placeholder="Operations assistant" required /></label><label>ROLE<input maxLength={70} name="role" placeholder="Operations analyst" required /></label><label>MODEL<input maxLength={70} name="model" placeholder="Model name" required /></label><label>OWNER / TEAM<input maxLength={70} name="owner" placeholder="Platform team" required /></label><div className="register-modal-actions"><button className="registry-button registry-button-neutral" onClick={() => setRegisterOpen(false)} type="button">Cancel</button><button className="registry-button registry-button-primary" type="submit"><Plus size={15} /> Add sample agent</button></div></form></section></div>}
    </div>
  );
}

function LayersIcon() {
  return <Shield size={19} />;
}
