import { useMemo, useState, type FormEvent } from 'react';
import {
  Activity, AlertTriangle, ArrowDownToLine, ArrowLeft, ArrowRight,
  BadgeCheck, Ban, Check, CheckCircle2, ChevronRight, ClipboardCheck,
  Copy, Database, Download, Fingerprint, KeyRound, LockKeyhole, Pause,
  Play, Search, Shield, ShieldAlert, Terminal, UserRound, X,
} from 'lucide-react';
import type { Agent, AgentStatus } from '../Agents/agentData';
import './agent-detail.css';

type AgentEvent = {
  time: string;
  state: 'ALLOWED' | 'BLOCKED' | 'VERIFIED' | 'REVIEW';
  summary: string;
  detail: string;
  reference: string;
};

const sampleEvents: AgentEvent[] = [
  { time: '14:32:17 UTC', state: 'ALLOWED', summary: 'Queried PostgreSQL finance replica', detail: 'SELECT date, sum(amount) FROM fin_ledger_q3 GROUP BY cost_center', reference: 'TX-8FA991' },
  { time: '14:28:05 UTC', state: 'BLOCKED', summary: 'Attempted restricted schema mutation', detail: 'UPDATE employee_salary · blocked by sample read-only policy', reference: 'EVT-ERR-9921' },
  { time: '14:20:11 UTC', state: 'REVIEW', summary: 'Requested an export outside assigned scope', detail: 'Export request routed to human review in the sample event stream', reference: 'TX-8FA944' },
  { time: '14:15:00 UTC', state: 'VERIFIED', summary: 'Identity session initialized', detail: 'Sample identity check recorded for this preview agent', reference: 'SES-00129' },
];

const permissionChoices = [
  'READ: Finance', 'QUERY: DB', 'READ: Reports', 'SEARCH: Vector',
  'GIT: Push', 'EXECUTE: CI', 'WRITE: Ticket', 'DB: Maintenance',
  'METRICS: Read', 'EXPORT: Data',
];

function getStatusLabel(status: AgentStatus) {
  return status === 'active' ? 'ACTIVE' : status === 'restricted' ? 'RESTRICTED' : 'QUARANTINED';
}

function TrustChart({ trust }: { trust: number }) {
  const dip = Math.max(22, 96 - trust);
  const points = `0,18 45,17 90,20 135,19 180,25 225,22 270,26 315,${dip} 360,${Math.min(75, dip + 5)} 400,${Math.min(70, dip + 1)}`;
  return <svg aria-label={`Sample trust trend ending at ${trust} out of 100`} className="detail-chart-svg" preserveAspectRatio="none" role="img" viewBox="0 0 400 100"><defs><linearGradient id="detail-trust-fill" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#6ffbbe" stopOpacity=".22" /><stop offset="1" stopColor="#6ffbbe" stopOpacity="0" /></linearGradient></defs><line x1="0" x2="400" y1="25" y2="25" /><line x1="0" x2="400" y1="55" y2="55" /><line x1="0" x2="400" y1="85" y2="85" /><polygon fill="url(#detail-trust-fill)" points={`0,100 ${points} 400,100`} /><polyline points={points} /><circle cx="315" cy={dip} r="4" /></svg>;
}

export default function AgentDetail({
  agent,
  onAgentChange,
  onNotify,
  onBack,
}: {
  agent: Agent;
  onAgentChange: (id: string, change: Partial<Agent>) => void;
  onNotify: (message: string) => void;
  onBack: () => void;
}) {
  const [permissionEditorOpen, setPermissionEditorOpen] = useState(false);
  const [draftPermissions, setDraftPermissions] = useState(agent.permissions);
  const [eventQuery, setEventQuery] = useState('');
  const meanActions = agent.violations + 11;

  const visibleEvents = useMemo(() => {
    const normalized = eventQuery.trim().toLowerCase();
    return sampleEvents.filter((event) => [event.time, event.state, event.summary, event.detail, event.reference]
      .some((value) => value.toLowerCase().includes(normalized)));
  }, [eventQuery]);

  function copyAgentId() {
    void navigator.clipboard?.writeText(agent.id).then(
      () => onNotify(`Copied ${agent.id} to the clipboard.`),
      () => onNotify(`Agent ID: ${agent.id}`),
    );
  }

  function savePermissions(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onAgentChange(agent.id, { permissions: draftPermissions });
    setPermissionEditorOpen(false);
    onNotify(`${agent.id} sample permissions updated locally.`);
  }

  function setStatus(status: AgentStatus) {
    onAgentChange(agent.id, { status, ...(status === 'quarantined' ? { risk: 'CRITICAL' as const, permissions: ['REVOKED: All'] } : {}) });
    onNotify(`${agent.id} marked ${status} in the local preview only.`);
  }

  function handleStatusAction() {
    const nextStatus: AgentStatus = agent.status === 'active' ? 'restricted' : 'active';
    const accepted = window.confirm(`Mark ${agent.id} as ${nextStatus} in this local preview? No real agent credentials or access will change.`);
    if (accepted) setStatus(nextStatus);
  }

  function quarantine() {
    if (agent.status === 'quarantined') {
      onNotify(`${agent.id} is already marked quarantined in this preview.`);
      return;
    }
    const accepted = window.confirm(`Mark ${agent.id} as quarantined in the local preview? This will not affect a live agent or network.`);
    if (accepted) setStatus('quarantined');
  }

  function exportEvents() {
    const blob = new Blob([JSON.stringify({ generatedAt: new Date().toISOString(), environment: 'local-demo', agent, events: visibleEvents }, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `nexusguard-${agent.id.toLowerCase()}-sample-audit.json`;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    onNotify(`Sample activity export created for ${agent.id}.`);
  }

  const allowedPermissions = agent.permissions.filter((permission) => !permission.startsWith('REVOKED'));

  return (
    <div className="agent-detail-page">
      <div className="agent-detail-breadcrumb"><button onClick={onBack}><ArrowLeft size={14} /> Agent Registry</button><ChevronRight size={13} /><span>AGENT PROFILE</span><ChevronRight size={13} /><strong>{agent.id}</strong><span className="detail-sample-tag">LOCAL SAMPLE</span><span className="breadcrumb-spacer" /><span><Activity size={13} /> SAMPLE TELEMETRY</span></div>

      <section className="agent-profile-hero">
        <div className="agent-profile-copy"><div className="profile-badges"><span className={`profile-status profile-status-${agent.status}`}><i /> STATUS: {getStatusLabel(agent.status)}</span><span className="profile-trust"><BadgeCheck size={13} /> TRUST SCORE: {agent.trust}/100</span><span className={`profile-risk profile-risk-${agent.risk.toLowerCase()}`}><AlertTriangle size={13} /> RISK: {agent.risk}</span><span className="profile-enclave"><Shield size={13} /> SAMPLE ENCLAVE</span></div>
        <h1>{agent.name} <span>({agent.id})</span></h1>
        <p>{agent.role} <i /> Sample autonomous agent profile · {agent.cluster}</p>
        <div className="mandate-strip"><Terminal size={14} /><span>LAST ACTION</span><strong>{agent.lastAction}</strong><small>{agent.lastSeen}</small></div>
      </div>
      <div className="agent-control-cockpit"><button onClick={() => { setDraftPermissions(agent.permissions.filter((permission) => !permission.startsWith('REVOKED'))); setPermissionEditorOpen(true); }}><ClipboardCheck size={15} /> Modify permissions</button><button onClick={handleStatusAction}>{agent.status === 'active' ? <Pause size={15} /> : <Play size={15} />}{agent.status === 'active' ? 'Restrict agent' : 'Mark active'}</button><button className="cockpit-quarantine" onClick={quarantine}><ShieldAlert size={15} /> Quarantine locally</button><div><button onClick={copyAgentId}><Copy size={13} /> Copy ID</button><button onClick={() => onNotify('Credential revocation requires a configured identity provider. No credentials were changed.')}><KeyRound size={13} /> Revoke keys</button></div></div>
      </section>
      <section className="agent-enclave-grid">
        <article className="detail-surface identity-enclave"><div className="detail-section-heading"><span><Fingerprint size={17} /></span><div><h2>Identity &amp; cryptographic envelope</h2><p>Sample profile metadata · not a live attestation</p></div><strong className={`enclave-chip enclave-${agent.status}`}>{agent.status === 'active' ? 'PROFILE ACTIVE' : getStatusLabel(agent.status)}</strong></div>
        <div className="enclave-facts"><div><span>UNIQUE IDENTIFIER</span><button onClick={copyAgentId}>{agent.id}<Copy size={13} /></button></div><div><span>AGENT ROLE</span><strong>{agent.role}</strong></div><div><span>BASE MODEL</span><strong>{agent.model}</strong></div><div><span>OWNER / TEAM</span><strong><UserRound size={13} /> {agent.owner}</strong></div><div><span>AUTHENTICATION</span><strong>Not connected</strong></div><div><span>LAST SAMPLE ACTIVITY</span><strong>{agent.lastSeen}</strong></div></div>
        <div className="fingerprint-row"><span><KeyRound size={13} /> SAMPLE IDENTIFIER HASH</span><code>DEMO:{agent.id.replace(/-/g, '').toLowerCase()}-not-attested</code><span className="hash-note"><CircleHelpInline /> No cryptographic attestation available</span></div>
      </article>
      <article className="detail-surface runtime-summary"><div className="detail-section-heading"><span><Activity size={17} /></span><div><h2>Runtime resource</h2><p>Illustrative values only</p></div><i className="runtime-indicator" /></div>
        <div className="resource-gauges"><div><div><span>Request budget</span><strong>37 / 100 actions</strong></div><i><b style={{ width: '37%' }} /></i></div><div><div><span>Review threshold</span><strong>{agent.violations} / 10 events</strong></div><i><b style={{ width: `${Math.min(agent.violations * 10, 100)}%` }} /></i></div><div><div><span>Trust score</span><strong>{agent.trust} / 100</strong></div><i><b style={{ width: `${agent.trust}%` }} /></i></div></div>
        <div className="operator-note"><strong>WORKSPACE NOTE</strong><span>Live runtime, hardware metrics, and enclave checks are unavailable in this local preview.</span></div>
      </article>
      </section>
      <section className="detail-surface permissions-matrix"><div className="detail-section-heading"><span><LockKeyhole size={17} /></span><div><h2>Permission capabilities</h2><p>Current sample scopes are shared with the Agent Registry page.</p></div><span className="permission-counts"><i>{allowedPermissions.length} ALLOWED</i><i>{agent.status === 'restricted' ? 'REVIEW REQUIRED' : 'NO LIVE POLICY'}</i><i>BACKEND OFFLINE</i></span></div>
        <div className="permission-columns"><article className="permission-column permission-allowed"><h3><CheckCircle2 size={15} /> Allowed sample scopes</h3>{allowedPermissions.length ? allowedPermissions.map((permission) => <div key={permission}><Check size={14} /><span><strong>{permission}</strong><small>Listed on the local sample identity</small></span></div>) : <p>No allowed scopes are assigned to this sample agent.</p>}</article><article className="permission-column permission-review"><h3><AlertTriangle size={15} /> Review before approval</h3><div><ClipboardCheck size={14} /><span><strong>Modify privileged resources</strong><small>Requires an actual policy service and reviewer</small></span></div><div><ClipboardCheck size={14} /><span><strong>Export outside assigned workspace</strong><small>Not authorized by this preview</small></span></div><div><ClipboardCheck size={14} /><span><strong>Send cross-agent data</strong><small>Requires explicit connected policy</small></span></div></article><article className="permission-column permission-denied"><h3><Ban size={15} /> Denied by preview guardrails</h3><div><X size={14} /><span><strong>Delete records or credentials</strong><small>No destructive actions are available in this preview</small></span></div><div><X size={14} /><span><strong>Execute payments or transfers</strong><small>Financial execution is not enabled</small></span></div><div><X size={14} /><span><strong>Access unrelated personal data</strong><small>Outside this sample profile scope</small></span></div></article></div>
      </section>
      <section className="agent-analytics-grid"><article className="detail-surface analytics-chart"><div className="detail-section-heading"><span><Activity size={17} /></span><div><h2>Action activity &amp; policy events</h2><p>Illustrative sample activity · last 24 hours</p></div><strong>{meanActions} sample actions</strong></div><div className="chart-wrap"><TrustChart trust={agent.trust} /><div className="chart-axis"><span>24H AGO</span><span>18H</span><span>12H</span><span>6H</span><span>NOW</span></div></div><div className="chart-legend"><span><i /> Sample allowed actions</span><span><i /> Review / blocked events: {agent.violations}</span></div></article>
        <article className="detail-surface trust-trend"><div className="detail-section-heading"><span><BadgeCheck size={17} /></span><div><h2>Trust score</h2><p>Current sample profile score</p></div></div><div className="trust-score-display"><strong>{agent.trust}</strong><span>/ 100</span><b className={`profile-risk-${agent.risk.toLowerCase()}`}>{agent.risk} RISK</b></div><div className="trust-score-track"><i style={{ width: `${agent.trust}%` }} /></div><div className="trust-facts"><span>Violations recorded</span><strong>{agent.violations}</strong><span>Current status</span><strong>{getStatusLabel(agent.status)}</strong><span>Data source</span><strong>Sample profile</strong></div></article></section>

      <section className="detail-surface activity-ledger" id="agent-activity"><div className="activity-ledger-heading"><div className="detail-section-heading"><span><Terminal size={17} /></span><div><h2>Activity log &amp; event stream</h2><p>Example events for this agent · no live audit connection</p></div></div><div className="ledger-tools"><label><Search size={14} /><input aria-label="Filter agent activity" onChange={(event) => setEventQuery(event.target.value)} placeholder="Filter sample events..." value={eventQuery} /></label><button onClick={exportEvents}><Download size={14} /> Export JSON</button></div></div>
        <div className="agent-event-list">{visibleEvents.map((event) => <article className={`agent-event event-${event.state.toLowerCase()}`} key={event.reference}><time>{event.time}</time><span className="event-state">{event.state}</span><div><strong>{event.summary}</strong><small>{event.detail}</small></div><code>{event.reference}</code><button aria-label={`Inspect ${event.reference}`} onClick={() => onNotify(`${event.reference}: ${event.detail}`)}><ChevronRight size={15} /></button></article>)}{visibleEvents.length === 0 && <p className="agent-events-empty">No sample events match “{eventQuery}”.</p>}</div>
        <footer className="ledger-footer"><span><i /> SAMPLE EVENT STREAM · NOT CONNECTED</span><span>{visibleEvents.length} of {sampleEvents.length} illustrative events</span></footer>
      </section>

      <div className="agent-detail-footer"><span>NEXUSGUARD · AGENT PROFILE PREVIEW</span><button onClick={onBack}><ArrowLeft size={13} /> Back to registry</button></div>

      {permissionEditorOpen && <div className="permission-modal-backdrop" onClick={() => setPermissionEditorOpen(false)} role="presentation"><section aria-labelledby="permission-editor-title" aria-modal="true" className="permission-editor-modal" onClick={(event) => event.stopPropagation()} role="dialog"><div className="permission-editor-heading"><div><span>LOCAL SAMPLE PROFILE</span><h2 id="permission-editor-title">Edit permission scopes</h2><p>Updates this browser-session record only; no live policy changes are made.</p></div><button aria-label="Close permission editor" onClick={() => setPermissionEditorOpen(false)}><X size={17} /></button></div><form onSubmit={savePermissions}><div className="permission-choice-list">{permissionChoices.map((permission) => <label key={permission}><input checked={draftPermissions.includes(permission)} onChange={(event) => setDraftPermissions((current) => event.target.checked ? [...current, permission] : current.filter((entry) => entry !== permission))} type="checkbox" /><span><Check size={12} /></span>{permission}</label>)}</div><div className="permission-editor-actions"><button onClick={() => setPermissionEditorOpen(false)} type="button">Cancel</button><button type="submit"><Check size={14} /> Save sample scopes</button></div></form></section></div>}
    </div>
  );
}

function CircleHelpInline() {
  return <span className="hash-warning" aria-label="Sample data only">i</span>;
}
