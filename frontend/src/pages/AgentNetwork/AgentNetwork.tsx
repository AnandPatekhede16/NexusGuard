import { useMemo, useState } from 'react';
import {
  Activity, AlertTriangle, ArrowDownRight, ArrowRight, ArrowUpRight,
  BadgeCheck, Ban, Check, CheckCircle2, ChevronRight, CircleHelp,
  Clock3, Copy, Fingerprint, Globe2, Info, LockKeyhole, Minus, Network,
  Plus, Radio, RefreshCw, Shield, ShieldAlert, Terminal, UserRound, X,
} from 'lucide-react';
import type { Agent } from '../Agents/agentData';
import './agent-network.css';

type Protocol = 'mTLS-Ed25519' | 'REST API' | 'Vector RPC' | 'WebSocket';
type NetworkNode = {
  id: string;
  name: string;
  role: string;
  x: number;
  y: number;
  kind: 'gateway' | 'agent';
};
type NetworkEdge = {
  id: string;
  from: string;
  to: string;
  protocol: Protocol;
  state: 'verified' | 'review' | 'blocked' | 'isolated';
  messages: string;
  latency: string;
  label: string;
  path: string;
  markerX: number;
  markerY: number;
  risk?: number;
  rule?: string;
  intent?: string;
  payload?: string;
};

const nodes: NetworkNode[] = [
  { id: 'USER-GATEWAY', name: 'User / Operator', role: 'External origin', x: 12, y: 22, kind: 'gateway' },
  { id: 'RES-AGENT-01', name: 'Research Core Vector', role: 'Research analyst', x: 34, y: 22, kind: 'agent' },
  { id: 'FIN-AGENT-01', name: 'Finance Agent Alpha', role: 'Financial analyst', x: 52, y: 48, kind: 'agent' },
  { id: 'COD-AGENT-01', name: 'DevOps Synth Bot', role: 'DevOps engineer', x: 29, y: 62, kind: 'agent' },
  { id: 'DB-AGENT-01', name: 'DB Orchestrator', role: 'Database operations', x: 76, y: 48, kind: 'agent' },
  { id: 'HR-AGENT-01', name: 'People Onboarder', role: 'HR assistant', x: 14, y: 82, kind: 'agent' },
  { id: 'RED-AGENT-01', name: 'Adversarial Probe X', role: 'Security testing', x: 83, y: 82, kind: 'agent' },
];

const initialEdges: NetworkEdge[] = [
  { id: 'edge-gateway-res', from: 'USER-GATEWAY', to: 'RES-AGENT-01', protocol: 'mTLS-Ed25519', state: 'verified', messages: '420 / hr*', latency: '12 ms*', label: 'VERIFIED SESSION', path: 'M 145 150 L 315 150', markerX: 230, markerY: 150 },
  { id: 'edge-res-fin', from: 'RES-AGENT-01', to: 'FIN-AGENT-01', protocol: 'Vector RPC', state: 'verified', messages: '82 / hr*', latency: '24 ms*', label: 'CONTEXT LOOKUP', path: 'M 350 175 Q 390 245 480 305', markerX: 416, markerY: 248 },
  { id: 'edge-res-cod', from: 'RES-AGENT-01', to: 'COD-AGENT-01', protocol: 'REST API', state: 'verified', messages: '34 / hr*', latency: '18 ms*', label: 'TASK HANDOFF', path: 'M 325 190 Q 300 290 280 390', markerX: 301, markerY: 285 },
  { id: 'edge-fin-db', from: 'FIN-AGENT-01', to: 'DB-AGENT-01', protocol: 'mTLS-Ed25519', state: 'blocked', messages: '1 blocked*', latency: '0 ms*', label: 'POLICY BLOCK', path: 'M 550 325 L 720 325', markerX: 635, markerY: 325, risk: 91, rule: 'FIN-READ-ONLY-POLICY-v4', intent: 'Sample write intent exceeded the Finance agent read-only scope.', payload: 'UPDATE finance_ledger SET ...' },
  { id: 'edge-cod-db', from: 'COD-AGENT-01', to: 'DB-AGENT-01', protocol: 'REST API', state: 'review', messages: '7 / hr*', latency: '41 ms*', label: 'REVIEW REQUIRED', path: 'M 330 410 Q 520 500 720 350', markerX: 525, markerY: 450, risk: 58, rule: 'DB-CHANGE-REVIEW', intent: 'Sample database maintenance request requires human review.' },
  { id: 'edge-gateway-hr', from: 'USER-GATEWAY', to: 'HR-AGENT-01', protocol: 'WebSocket', state: 'verified', messages: '16 / hr*', latency: '19 ms*', label: 'SCOPED REQUEST', path: 'M 120 185 L 135 520', markerX: 127, markerY: 350 },
  { id: 'edge-red-cod', from: 'RED-AGENT-01', to: 'COD-AGENT-01', protocol: 'Vector RPC', state: 'isolated', messages: 'severed', latency: 'n/a', label: 'ISOLATED SAMPLE', path: 'M 790 535 Q 560 610 325 430', markerX: 560, markerY: 530, risk: 100, rule: 'RED-AGENT-SANDBOX', intent: 'Sample adversarial probe shown isolated from the development agent.' },
];

const protocolOptions: ('All protocols' | Protocol)[] = ['All protocols', 'mTLS-Ed25519', 'REST API', 'Vector RPC', 'WebSocket'];

function agentStatus(agent: Agent | undefined) {
  if (!agent) return 'GATEWAY';
  if (agent.status === 'quarantined') return 'ISOLATED';
  if (agent.status === 'restricted') return 'REVIEW';
  return 'ACTIVE';
}

function stateLabel(state: NetworkEdge['state']) {
  return state === 'verified' ? 'VERIFIED' : state === 'review' ? 'REVIEW' : state === 'blocked' ? 'BLOCKED' : 'ISOLATED';
}

function stateColor(state: NetworkEdge['state']) {
  return state === 'verified' ? '#83d99a' : state === 'review' ? '#e1bd74' : '#eb938b';
}

export default function AgentNetwork({
  agents,
  onNotify,
  onOpenAgentDetail,
}: {
  agents: Agent[];
  onNotify: (message: string) => void;
  onOpenAgentDetail: (agentId: string) => void;
}) {
  const [protocol, setProtocol] = useState<(typeof protocolOptions)[number]>('All protocols');
  const [selectedNodeId, setSelectedNodeId] = useState('FIN-AGENT-01');
  const [selectedEdgeId, setSelectedEdgeId] = useState('edge-fin-db');
  const [severedEdges, setSeveredEdges] = useState<string[]>([]);
  const [escalatedEdges, setEscalatedEdges] = useState<string[]>([]);
  const [physicsEnabled, setPhysicsEnabled] = useState(true);
  const [zoom, setZoom] = useState(1);
  const [pingCount, setPingCount] = useState(0);
  const [twoPersonNotice, setTwoPersonNotice] = useState(false);

  const agentMap = useMemo(() => new Map(agents.map((agent) => [agent.id, agent])), [agents]);
  const activeEdges = useMemo(() => initialEdges.map((edge) => severedEdges.includes(edge.id) ? { ...edge, state: 'isolated' as const, label: 'SEVERED IN LOCAL PREVIEW' } : edge), [severedEdges]);
  const visibleEdges = useMemo(() => activeEdges.filter((edge) => protocol === 'All protocols' || edge.protocol === protocol), [activeEdges, protocol]);
  const selectedNode = nodes.find((node) => node.id === selectedNodeId) ?? nodes[0];
  const selectedAgent = selectedNode.kind === 'agent' ? agentMap.get(selectedNode.id) : undefined;
  const selectedEdge = activeEdges.find((edge) => edge.id === selectedEdgeId) ?? activeEdges[0];
  const selectedFromNode = nodes.find((node) => node.id === selectedEdge.from);
  const selectedToNode = nodes.find((node) => node.id === selectedEdge.to);
  const displayEdgeState = escalatedEdges.includes(selectedEdge.id) && selectedEdge.state === 'review' ? 'review' : selectedEdge.state;

  function selectNode(node: NetworkNode) {
    setSelectedNodeId(node.id);
    const related = activeEdges.find((edge) => edge.from === node.id || edge.to === node.id);
    if (related) setSelectedEdgeId(related.id);
  }

  function simulatePing() {
    setPingCount((count) => count + 1);
    onNotify('Sample ping acknowledged locally. No agent or network was contacted.');
  }

  function severConnection() {
    if (severedEdges.includes(selectedEdge.id)) {
      onNotify('This sample connection is already marked severed.');
      return;
    }
    if (!window.confirm(`Mark ${selectedFromNode?.id} → ${selectedToNode?.id} as severed in the local preview? No live connection will be changed.`)) return;
    setSeveredEdges((current) => [...current, selectedEdge.id]);
    onNotify('Connection marked severed in the local preview only.');
  }

  function escalate() {
    if (escalatedEdges.includes(selectedEdge.id)) {
      onNotify('This sample connection is already in the local review queue.');
      return;
    }
    setEscalatedEdges((current) => [...current, selectedEdge.id]);
    onNotify('Sample connection added to the local review queue. No SOC service is connected.');
  }

  return (
    <div className="agent-network-page">
      <section className="network-heading">
        <div className="network-heading-main">
          <div className="network-eyebrow"><Network size={13} /> AGENT TOPOLOGY <i /> SAMPLE GRAPH</div>
          <h1>Agent Network &amp; Inter-Agent Bus</h1>
          <p>Explore sample agent relationships and inspect illustrative policy events. No live mesh connection is active.</p>
        </div>
        <div className="network-heading-status"><span><i /> GRAPH DATA: LOCAL SAMPLE</span><span><LockKeyhole size={13} /> ENFORCEMENT: NOT CONNECTED</span></div>
        <div className="network-toolbar">
          <div className="protocol-switch" aria-label="Filter connections by protocol" role="group">
            {protocolOptions.map((option) => <button aria-pressed={protocol === option} className={protocol === option ? 'protocol-active' : ''} key={option} onClick={() => setProtocol(option)}>{option}</button>)}
          </div>
          <div className="network-toolbar-actions"><button className={`network-control-button${physicsEnabled ? ' network-control-on' : ''}`} onClick={() => setPhysicsEnabled((enabled) => !enabled)}><Activity size={14} /> Motion {physicsEnabled ? 'on' : 'off'}</button><button className="network-control-button network-ping-button" onClick={simulatePing}><Radio size={14} /> Simulate ping</button></div>
        </div>
      </section>

      <section className="network-workspace">
        <article className="topology-panel">
          <header className="topology-panel-header"><div><span className="topology-live-dot" /><strong>AGENT CONNECTION MAP</strong><span>ILLUSTRATIVE · NOT LIVE</span></div><div className="topology-meta"><span>{nodes.filter((node) => node.kind === 'agent').length} SAMPLE AGENTS</span><span>{visibleEdges.length} VISIBLE LINKS</span></div></header>
          <div className="topology-viewport">
            <div className={`topology-canvas${physicsEnabled ? ' topology-motion-on' : ''}`} style={{ '--network-zoom': zoom } as React.CSSProperties}>
              <svg aria-label="Sample agent topology map" className="topology-svg" preserveAspectRatio="none" role="img" viewBox="0 0 1000 680">
                <defs><pattern height="40" id="network-grid" patternUnits="userSpaceOnUse" width="40"><path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(132,147,150,.13)" strokeWidth="1" /><circle cx="0" cy="0" fill="rgba(0,229,255,.22)" r="1.3" /></pattern><radialGradient id="network-glow"><stop offset="0" stopColor="#00daf3" stopOpacity=".09" /><stop offset="1" stopColor="#0b0e15" stopOpacity=".28" /></radialGradient></defs>
                <rect fill="url(#network-grid)" height="680" width="1000" /><rect fill="url(#network-glow)" height="680" width="1000" />
                {visibleEdges.map((edge) => <g className={`network-edge network-edge-${edge.state}`} key={edge.id} onClick={() => { setSelectedEdgeId(edge.id); setSelectedNodeId(edge.from); }} role="button" tabIndex={0} aria-label={`${edge.from} to ${edge.to}, ${stateLabel(edge.state)}`}>
                  <path d={edge.path} stroke={stateColor(edge.state)} strokeDasharray={edge.state === 'blocked' ? '8 6' : edge.state === 'isolated' ? '5 8' : edge.state === 'review' ? '6 4' : undefined} strokeWidth={selectedEdgeId === edge.id ? 3.5 : 2.2} />
                  <path className="network-edge-hit" d={edge.path} />
                  <circle className="network-edge-marker" cx={edge.markerX} cy={edge.markerY} fill={stateColor(edge.state)} r={selectedEdgeId === edge.id ? 5 : 3.5} />
                  <g className="network-edge-label" transform={`translate(${edge.markerX - 63}, ${edge.markerY - 24})`}><rect height="18" rx="3" width="126" /><text textAnchor="middle" x="63" y="12">{edge.label}</text></g>
                </g>)}
              </svg>
              {nodes.map((node) => {
                const agent = agentMap.get(node.id);
                const status = agentStatus(agent);
                const selected = selectedNodeId === node.id;
                return <button aria-pressed={selected} className={`topology-node topology-node-${node.kind} topology-node-${agent?.status ?? 'gateway'}${selected ? ' topology-node-selected' : ''}`} key={node.id} onClick={() => selectNode(node)} style={{ left: `${node.x}%`, top: `${node.y}%` }}>
                  <span className="topology-node-top"><span>{node.kind === 'gateway' ? 'GATEWAY INGRESS' : node.role.toUpperCase()}</span><span className={`node-status-pill node-status-${agent?.status ?? 'gateway'}`}>{status}</span></span>
                  <span className="topology-node-body"><span className="topology-node-icon">{node.kind === 'gateway' ? <UserRound size={16} /> : <Fingerprint size={16} />}</span><span className="topology-node-text"><strong>{node.id}</strong><small>{node.name}</small></span></span>
                  <span className="topology-node-footer"><span>{node.kind === 'gateway' ? 'Origin' : `Trust ${agent?.trust ?? '--'}`}</span><span>{node.kind === 'gateway' ? 'LOCAL' : status}</span></span>
                </button>;
              })}
              {pingCount > 0 && <span aria-hidden="true" className="ping-signal" key={pingCount} />}
            </div>
          </div>
          <footer className="topology-controls"><div className="topology-zoom"><button aria-label="Zoom in" onClick={() => setZoom((value) => Math.min(value + 0.1, 1.4))}><Plus size={14} /></button><button aria-label="Zoom out" onClick={() => setZoom((value) => Math.max(value - 0.1, 0.7))}><Minus size={14} /></button><button onClick={() => setZoom(1)}>{Math.round(zoom * 100)}% · Reset</button></div><div className="topology-legend"><span><i className="legend-verified" /> Verified sample</span><span><i className="legend-review" /> Review sample</span><span><i className="legend-blocked" /> Blocked / isolated</span></div><span className="topology-stats">{pingCount} local ping{pingCount === 1 ? '' : 's'} · no packets sent</span></footer>
        </article>

        <aside className="network-inspector">
          <header className="inspector-header"><div><span>CONNECTION INSPECTOR</span><small>Selected edge · sample data</small></div><span className={`inspector-state inspector-state-${displayEdgeState}`}><i />{stateLabel(displayEdgeState)}</span></header>
          <div className="inspector-route"><div><span>{selectedFromNode?.id}</span><small>{selectedFromNode?.name}</small></div><ArrowRight size={17} /><div><span>{selectedToNode?.id}</span><small>{selectedToNode?.name}</small></div></div>
          <div className="inspector-meta"><div><span>PROTOCOL</span><strong>{selectedEdge.protocol}</strong></div><div><span>SAMPLE LATENCY</span><strong>{selectedEdge.latency}</strong></div><div><span>MESSAGE RATE</span><strong>{selectedEdge.messages}</strong></div><div><span>RISK SCORE</span><strong className={selectedEdge.risk && selectedEdge.risk >= 80 ? 'risk-emphasis' : ''}>{selectedEdge.risk ? `${selectedEdge.risk} / 100*` : 'Not scored'}</strong></div></div>
          <section className="inspector-event"><div><ShieldAlert size={15} /><strong>{selectedEdge.state === 'blocked' ? 'Sample intercepted intent' : selectedEdge.state === 'review' ? 'Sample review intent' : selectedEdge.state === 'isolated' ? 'Sample isolated path' : 'Sample connection detail'}</strong></div><p>{selectedEdge.intent ?? 'This illustrative edge represents an example agent relationship. No traffic is flowing.'}</p>{selectedEdge.payload && <code>{selectedEdge.payload}</code>}<small>Rule: {selectedEdge.rule ?? 'No live policy attached'}</small></section>
          <section className="selected-agent-card"><div><Fingerprint size={15} /><strong>Selected agent</strong></div><span>{selectedAgent?.id ?? selectedNode.id}</span><small>{selectedAgent?.name ?? selectedNode.name} · {selectedAgent ? `trust ${selectedAgent.trust}/100` : 'entry point'}</small>{selectedAgent && <button onClick={() => onOpenAgentDetail(selectedAgent.id)}>Open agent detail <ChevronRight size={14} /></button>}</section>
          <div className="network-actions"><button className="network-sever-action" onClick={() => {
            if (severedEdges.includes(selectedEdge.id)) { onNotify('This sample path is already severed locally.'); return; }
            if (!window.confirm(`Mark ${selectedFromNode?.id} → ${selectedToNode?.id} as severed in this local preview? No live connection will be changed.`)) return;
            setSeveredEdges((current) => [...current, selectedEdge.id]);
            onNotify('Sample path marked severed locally; no live connection changed.');
          }}><Ban size={15} /> {severedEdges.includes(selectedEdge.id) ? 'Sample path severed' : 'Sever sample path'}</button><div><button onClick={() => {
            if (escalatedEdges.includes(selectedEdge.id)) { onNotify('This sample path is already in the local review queue.'); return; }
            setEscalatedEdges((current) => [...current, selectedEdge.id]);
            onNotify('Added sample path to local review queue; no SOC service connected.');
          }}><ArrowUpRight size={14} /> {escalatedEdges.includes(selectedEdge.id) ? 'Queued for review' : 'Escalate to SOC'}</button><button onClick={() => setTwoPersonNotice(true)} title="Requires a live identity and approval service"><UserRound size={14} /> 2-person review</button></div></div>
          <div className="network-recent"><h3>RECENT SAMPLE LINKS</h3>{activeEdges.slice(0, 4).map((edge) => <button key={edge.id} onClick={() => { setSelectedEdgeId(edge.id); setSelectedNodeId(edge.from); }}><span><strong>{edge.from} → {edge.to}</strong><small>{edge.protocol} · {edge.messages}</small></span><i className={`recent-state recent-${edge.state}`}>{stateLabel(edge.state)}</i></button>)}</div>
          <p className="network-disclaimer"><Info size={13} /> Every node, event, metric, ping, and action on this page is local sample state. No service credentials or network connections are configured.</p>
        </aside>
      </section>

      {twoPersonNotice && <div className="network-modal-backdrop" onClick={() => setTwoPersonNotice(false)} role="presentation"><section aria-labelledby="two-person-title" aria-modal="true" className="network-review-modal" onClick={(event) => event.stopPropagation()} role="dialog"><button aria-label="Close review information" className="network-modal-close" onClick={() => setTwoPersonNotice(false)}><X size={17} /></button><span className="review-modal-icon"><LockKeyhole size={20} /></span><h2 id="two-person-title">Two-person approval unavailable</h2><p>This preview has no identity provider or approval backend. A two-person bypass cannot be requested or executed here.</p><div><span>Selected sample path</span><strong>{selectedFromNode?.id} → {selectedToNode?.id}</strong></div><button className="review-modal-confirm" onClick={() => setTwoPersonNotice(false)}>Understood</button></section></div>}
    </div>
  );
}
