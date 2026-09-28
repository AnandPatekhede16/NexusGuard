import { useMemo, useState, type Dispatch, type SetStateAction } from 'react';
import {
  AlertTriangle, ArrowDownToLine, BadgeCheck, Ban, Check, CheckCircle2,
  ChevronRight, CircleHelp, ClipboardCheck, Database, FileKey2, Fingerprint,
  KeyRound, LockKeyhole, Plus, Search, Shield, ShieldAlert, UserRound, X,
} from 'lucide-react';
import type { Agent, AgentStatus } from '../Agents/agentData';
import './permission-management.css';

type AgentFilter = 'all' | AgentStatus;

type Scope = {
  name: string;
  description: string;
  resource: string;
};

const grantableScopes: Scope[] = [
  { name: 'READ: Finance', description: 'Read finance reports and ledger summaries.', resource: 'Finance workspace' },
  { name: 'QUERY: DB', description: 'Run read-only queries on an assigned database.', resource: 'Database replica' },
  { name: 'READ: Reports', description: 'Read generated operational and business reports.', resource: 'Reports' },
  { name: 'SEARCH: Vector', description: 'Search approved vector indexes.', resource: 'Vector index' },
  { name: 'READ: Arxiv', description: 'Read public research source documents.', resource: 'Research sources' },
  { name: 'GIT: Push', description: 'Push branches to configured repositories.', resource: 'Source control' },
  { name: 'EXECUTE: CI', description: 'Start approved continuous-integration jobs.', resource: 'CI runner' },
  { name: 'READ: HR Wiki', description: 'Read non-sensitive HR reference material.', resource: 'HR knowledge base' },
  { name: 'WRITE: Ticket', description: 'Create or update workflow tickets.', resource: 'Ticketing system' },
  { name: 'DB: Maintenance', description: 'Run allowlisted database maintenance operations.', resource: 'Database operations' },
  { name: 'METRICS: Read', description: 'Read approved infrastructure metrics.', resource: 'Monitoring' },
];

const reviewControls = [
  { name: 'Modify database schema', rule: 'Requires connected policy approval', icon: Database },
  { name: 'Export data outside workspace', rule: 'Requires data-owner review', icon: ArrowDownToLine },
  { name: 'Cross-agent data transfer', rule: 'Requires scoped destination approval', icon: UserRound },
];

const deniedControls = [
  { name: 'Delete records or audit history', rule: 'Unavailable in this preview', icon: Ban },
  { name: 'Execute payments or transfers', rule: 'No financial execution scope', icon: LockKeyhole },
  { name: 'Access unrelated personal data', rule: 'Outside the sample agent boundary', icon: ShieldAlert },
];

function statusText(status: AgentStatus) {
  return status === 'active' ? 'Active' : status === 'restricted' ? 'Restricted' : 'Quarantined';
}

function downloadJson(payload: unknown) {
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'nexusguard-permission-management-sample.json';
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export default function PermissionManagement({
  agents,
  setAgents,
  selectedAgentId,
  onSelectedAgentChange,
  query,
  onQueryChange,
  onNotify,
}: {
  agents: Agent[];
  setAgents: Dispatch<SetStateAction<Agent[]>>;
  selectedAgentId: string;
  onSelectedAgentChange: (agentId: string) => void;
  query: string;
  onQueryChange: (value: string) => void;
  onNotify: (message: string) => void;
}) {
  const [filter, setFilter] = useState<AgentFilter>('all');
  const [grantDialogOpen, setGrantDialogOpen] = useState(false);
  const [draftScopes, setDraftScopes] = useState<string[]>([]);

  const counts = useMemo(() => ({
    all: agents.length,
    active: agents.filter((agent) => agent.status === 'active').length,
    restricted: agents.filter((agent) => agent.status === 'restricted').length,
    quarantined: agents.filter((agent) => agent.status === 'quarantined').length,
  }), [agents]);

  const visibleAgents = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return agents.filter((agent) => {
      const stateMatches = filter === 'all' || agent.status === filter;
      const textMatches = !normalized || [agent.id, agent.name, agent.role, agent.owner, agent.cluster, ...agent.permissions]
        .some((value) => value.toLowerCase().includes(normalized));
      return stateMatches && textMatches;
    });
  }, [agents, filter, query]);

  const selectedAgent = visibleAgents.find((agent) => agent.id === selectedAgentId) ?? visibleAgents[0] ?? null;
  const effectiveScopes = selectedAgent?.permissions.filter((scope) => !scope.startsWith('REVOKED')) ?? [];
  const scopeTotal = agents.reduce((total, agent) => total + agent.permissions.filter((scope) => !scope.startsWith('REVOKED')).length, 0);
  const quarantinedTotal = counts.quarantined;
  const availableScopes = grantableScopes.filter((scope) => !selectedAgent?.permissions.includes(scope.name));

  function updateSelectedScopes(nextScopes: string[]) {
    if (!selectedAgent) return;
    setAgents((current) => current.map((agent) => agent.id === selectedAgent.id
      ? { ...agent, permissions: nextScopes }
      : agent));
  }

  function openGrantDialog() {
    setDraftScopes([]);
    setGrantDialogOpen(true);
  }

  function saveGrantDialog() {
    if (!selectedAgent || draftScopes.length === 0) {
      setGrantDialogOpen(false);
      return;
    }
    updateSelectedScopes([...effectiveScopes, ...draftScopes]);
    setGrantDialogOpen(false);
    onNotify(`Added ${draftScopes.length} sample scope${draftScopes.length === 1 ? '' : 's'} to ${selectedAgent.id}. No live policy changed.`);
  }

  function revokeScope(scope: string) {
    if (!selectedAgent) return;
    if (!window.confirm(`Remove ${scope} from ${selectedAgent.id} in the local preview? No live permission will change.`)) return;
    updateSelectedScopes(effectiveScopes.filter((entry) => entry !== scope));
    onNotify(`${scope} removed from ${selectedAgent.id} in the local preview.`);
  }

  function exportSnapshot() {
    downloadJson({
      generatedAt: new Date().toISOString(),
      environment: 'local-demo',
      livePolicyServiceConnected: false,
      selectedAgentId: selectedAgent?.id ?? null,
      agents: agents.map((agent) => ({ id: agent.id, status: agent.status, permissions: agent.permissions })),
      reviewControls,
      deniedControls,
    });
    onNotify('Sample permission snapshot downloaded as JSON.');
  }

  return (
    <div className="permission-management-page">
      <section className="permission-page-heading">
        <div className="permission-page-copy">
          <div className="permission-eyebrow"><LockKeyhole size={13} /> IDENTITY GOVERNANCE <i /> LOCAL SAMPLE POLICY</div>
          <h1>Permission Management</h1>
          <p>Review each sample agent’s assigned scopes and preview policy boundaries. Changes are local to this browser session.</p>
        </div>
        <div className="permission-header-actions">
          <button className="pm-button pm-button-secondary" onClick={exportSnapshot}><ArrowDownToLine size={14} /> Export policy snapshot</button>
          <button className="pm-button pm-button-primary" disabled={!selectedAgent || selectedAgent.status === 'quarantined' || availableScopes.length === 0} onClick={openGrantDialog}><Plus size={15} /> Grant scopes</button>
        </div>
      </section>

      <section aria-label="Permission management summary" className="permission-summary">
        <article><span>AGENT RECORDS</span><div><strong>{agents.length}</strong><small>sample agents</small></div><Fingerprint size={18} /></article>
        <article><span>ASSIGNED SCOPES</span><div><strong className="pm-summary-cyan">{scopeTotal}</strong><small>local grants</small></div><KeyRound size={18} /></article>
        <article><span>UNDER REVIEW</span><div><strong className="pm-summary-amber">{counts.restricted}</strong><small>sample agents</small></div><AlertTriangle size={18} /></article>
        <article><span>QUARANTINED</span><div><strong className="pm-summary-red">{quarantinedTotal}</strong><small>all access revoked*</small></div><ShieldAlert size={18} /></article>
      </section>

      <section className="permission-directory-toolbar">
        <div className="permission-filter-list" role="tablist" aria-label="Filter agents by status">
          {(['all', 'active', 'restricted', 'quarantined'] as AgentFilter[]).map((key) => <button aria-selected={filter === key} className={filter === key ? 'pm-filter pm-filter-active' : 'pm-filter'} key={key} onClick={() => setFilter(key)} role="tab">
            {key === 'active' && <CheckCircle2 size={12} />}{key === 'restricted' && <AlertTriangle size={12} />}{key === 'quarantined' && <ShieldAlert size={12} />}{key === 'all' ? 'All agents' : statusText(key)}<span>{counts[key]}</span>
          </button>)}
        </div>
        <label className="pm-search"><Search size={14} /><input aria-label="Search agents and scopes" onChange={(event) => onQueryChange(event.target.value)} placeholder="Search IDs, roles, scopes..." value={query} />{query && <button aria-label="Clear permission search" onClick={() => onQueryChange('')} type="button"><X size={13} /></button>}</label>
      </section>

      <section className="permission-main-grid">
        <article className="permission-agent-table-panel">
          <div className="permission-panel-title"><div><h2>Agent scope directory</h2><p>Choose an agent to review its sample grants.</p></div><span>{visibleAgents.length} shown</span></div>
          <div className="permission-agent-table-scroll"><table className="permission-agent-table"><thead><tr><th>AGENT / ROLE</th><th>STATUS</th><th>ASSIGNED SCOPES</th><th>TRUST</th><th>VIOLATIONS</th><th /></tr></thead>
            <tbody>{visibleAgents.map((agent) => <tr aria-selected={selectedAgent?.id === agent.id} className={selectedAgent?.id === agent.id ? 'pm-row-selected' : ''} key={agent.id} onClick={() => onSelectedAgentChange(agent.id)}>
              <td><span className="pm-agent-identity"><span className="pm-agent-glyph"><UserRound size={15} /></span><span><strong>{agent.id}</strong><small>{agent.name} · {agent.role}</small></span></span></td>
              <td><span className={`pm-status pm-status-${agent.status}`}><i />{statusText(agent.status)}</span></td>
              <td><span className="pm-scope-cell">{agent.permissions.some((scope) => scope.startsWith('REVOKED')) ? <i className="pm-revoked-chip">All access revoked</i> : agent.permissions.length ? agent.permissions.map((scope) => <i key={scope}>{scope}</i>) : <i className="pm-empty-chip">No scopes</i>}</span></td>
              <td><span className="pm-trust-cell"><span><i style={{ width: `${agent.trust}%` }} /></span><strong>{agent.trust}</strong></span></td>
              <td><span className={`pm-violation-count${agent.violations ? ' pm-has-violations' : ''}`}>{agent.violations}</span></td>
              <td><button aria-label={`Manage ${agent.id} permissions`} className="pm-row-open" onClick={(event) => { event.stopPropagation(); onSelectedAgentChange(agent.id); }}><ChevronRight size={15} /></button></td>
            </tr>)}{visibleAgents.length === 0 && <tr><td className="pm-empty-row" colSpan={6}>No agents or scopes match this filter.</td></tr>}</tbody>
          </table></div>
          <footer className="pm-table-footer"><span>Showing <strong>{visibleAgents.length}</strong> of {agents.length} sample agents</span><span><CircleHelp size={12} /> Local state · not enforced</span></footer>
        </article>

        {selectedAgent && <aside className="permission-agent-detail">
          <header className="pm-detail-heading"><div><span className="pm-detail-kicker">SELECTED AGENT</span><h2>{selectedAgent.id}</h2><p>{selectedAgent.name} · {selectedAgent.role}</p></div><span className={`pm-status pm-status-${selectedAgent.status}`}><i />{statusText(selectedAgent.status)}</span></header>
          <div className="pm-agent-meta"><span>OWNER <strong>{selectedAgent.owner}</strong></span><span>CLUSTER <strong>{selectedAgent.cluster}</strong></span><span>TRUST <strong>{selectedAgent.trust} / 100</strong></span></div>
          <section className="pm-scope-section"><div className="pm-scope-heading"><h3><CheckCircle2 size={14} /> Assigned sample scopes</h3><span>{effectiveScopes.length}</span></div>
            {effectiveScopes.length === 0 ? <p className="pm-no-scopes">No effective scopes are assigned.</p> : <div className="pm-assigned-scopes">{effectiveScopes.map((scope) => <div className="pm-assigned-scope" key={scope}><span><KeyRound size={13} /><strong>{scope}</strong><small>{grantableScopes.find((entry) => entry.name === scope)?.resource ?? 'Sample scope'}</small></span><button aria-label={`Revoke ${scope}`} disabled={selectedAgent.status === 'quarantined'} onClick={() => revokeScope(scope)} title="Remove this local sample grant"><X size={14} /></button></div>)}</div>}
          </section>
          <section className="pm-fixed-controls"><div><h3><ClipboardCheck size={14} /> Review required</h3><span>Policy changes that require a connected approver</span></div>{reviewControls.map((control) => <div className="pm-policy-rule" key={control.name}><control.icon size={14} /><span><strong>{control.name}</strong><small>{control.rule}</small></span><span className="pm-rule-tag pm-rule-review">REVIEW</span></div>)}</section>
          <section className="pm-fixed-controls pm-denied-controls"><div><h3><Ban size={14} /> Denied by preview guardrails</h3><span>These are not grantable from this page.</span></div>{deniedControls.map((control) => <div className="pm-policy-rule" key={control.name}><control.icon size={14} /><span><strong>{control.name}</strong><small>{control.rule}</small></span><span className="pm-rule-tag pm-rule-denied">DENY</span></div>)}</section>
          <p className="pm-local-warning"><Shield size={13} /> Permission edits update the shared sample record only. No live access policy changes.</p>
        </aside>}
      </section>

      <section className="permission-policy-baseline"><div className="pm-baseline-heading"><span><BadgeCheck size={16} /></span><div><h2>Preview policy model</h2><p>Illustrative access tiers; a policy service is required for actual evaluation.</p></div><span className="pm-baseline-badge">NOT ENFORCED</span></div>
        <div className="pm-baseline-columns"><article><span className="pm-baseline-icon pm-allowed-icon"><Check size={15} /></span><div><h3>Allowed</h3><p>Explicit read, search, query, and task-specific scopes listed on the agent.</p></div></article><article><span className="pm-baseline-icon pm-review-icon"><AlertTriangle size={15} /></span><div><h3>Review required</h3><p>Schema changes, cross-boundary exports, and cross-agent transfers need approval.</p></div></article><article><span className="pm-baseline-icon pm-denied-icon"><Ban size={15} /></span><div><h3>Denied</h3><p>Destructive operations, payments, and unrelated personal data access are not grantable here.</p></div></article></div>
      </section>

      {grantDialogOpen && selectedAgent && <div className="pm-modal-backdrop" onClick={() => setGrantDialogOpen(false)} role="presentation"><section aria-labelledby="pm-grant-title" aria-modal="true" className="pm-grant-modal" onClick={(event) => event.stopPropagation()} role="dialog"><div className="pm-modal-header"><div><span>LOCAL SAMPLE POLICY</span><h2 id="pm-grant-title">Grant scopes to {selectedAgent.id}</h2><p>Only predefined sample scopes are available. This does not grant live access.</p></div><button aria-label="Close scope picker" onClick={() => setGrantDialogOpen(false)}><X size={17} /></button></div>
        {selectedAgent.status === 'quarantined' ? <p className="pm-modal-quarantine"><ShieldAlert size={15} /> This agent is marked quarantined in the preview. Restore its status before managing sample grants.</p> : <div className="pm-scope-picker">{availableScopes.length ? availableScopes.map((scope) => <label key={scope.name}><input checked={draftScopes.includes(scope.name)} onChange={(event) => setDraftScopes((current) => event.target.checked ? [...current, scope.name] : current.filter((name) => name !== scope.name))} type="checkbox" /><span className="pm-custom-checkbox"><Check size={12} /></span><span><strong>{scope.name}</strong><small>{scope.description}</small></span><i>{scope.resource}</i></label>) : <p className="pm-no-scopes">All grantable sample scopes are already assigned.</p>}</div>}
        <div className="pm-modal-actions"><button onClick={() => setGrantDialogOpen(false)} type="button">Cancel</button><button disabled={selectedAgent.status === 'quarantined' || draftScopes.length === 0} onClick={saveGrantDialog} type="button"><Plus size={14} /> Add {draftScopes.length || ''} scope{draftScopes.length === 1 ? '' : 's'}</button></div>
      </section></div>}
    </div>
  );
}
