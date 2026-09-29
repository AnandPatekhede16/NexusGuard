import { useState, useMemo, type Dispatch, type SetStateAction } from 'react';
import {
  Activity, AlertOctagon, AlertTriangle, ArrowRight, CheckCircle2,
  Clock, Copy, Database, Download, FileCode, FileText, Flame,
  HardDrive, History, Key, KeyRound, Layers, Lock, Network,
  Power, Radio, RefreshCw, RotateCcw, Shield, ShieldAlert,
  ShieldCheck, Siren, Terminal, Trash2, Unlock, UserCheck,
  WifiOff, X, Zap
} from 'lucide-react';
import type { Agent } from '../Agents/agentData';
import './kill-switch.css';

export type InterlockActionType =
  | 'global-kill'
  | 'db-egress'
  | 'mtls-revoke'
  | 'isolate-enclaves';

export type MitigationType =
  | 'QUARANTINE_AGENT'
  | 'ROLLBACK_SNAPSHOT'
  | 'FLUSH_CONTEXT'
  | 'BROADCAST_IOC';

export type IncidentTimelineEvent = {
  id: string;
  time: string;
  tag: string;
  description: string;
  severity: 'error' | 'primary' | 'secondary' | 'mint';
  pulsing?: boolean;
};

type Props = {
  agents: Agent[];
  setAgents?: Dispatch<SetStateAction<Agent[]>>;
  onNotify?: (msg: string) => void;
  onOpenAgentDetail?: (agentId: string) => void;
};

export default function KillSwitch({
  agents,
  setAgents,
  onNotify,
  onOpenAgentDetail,
}: Props) {
  // Global Interlock States
  const [globalKillActive, setGlobalKillActive] = useState(false);
  const [dbEgressSevered, setDbEgressSevered] = useState(false);
  const [mtlsRevoked, setMtlsRevoked] = useState(false);
  const [airGapEngaged, setAirGapEngaged] = useState(false);

  // Active Incident Data State
  const [incidentAgentId, setIncidentAgentId] = useState<string>('FIN-AGENT-01');
  const [isQuarantined, setIsQuarantined] = useState<boolean>(false);
  const [contextFlushed, setContextFlushed] = useState<boolean>(false);
  const [snapshotRestored, setSnapshotRestored] = useState<boolean>(false);
  const [iocBroadcasted, setIocBroadcasted] = useState<boolean>(false);

  // Modal State
  const [activeInterlockModal, setActiveInterlockModal] = useState<InterlockActionType | null>(null);
  const [key1Value, setKey1Value] = useState('••••••••••••••••');
  const [key2Value, setKey2Value] = useState('');
  const [keyError, setKeyError] = useState('');

  // Commander Notes State
  const [commanderNotes, setCommanderNotes] = useState(
    'Initial containment engaged. Threat vector isolated to invoice parsing pipeline. Shadow sandbox-09 initialized for memory trace extraction.'
  );

  // Chronological Incident Timeline
  const [timelineEvents, setTimelineEvents] = useState<IncidentTimelineEvent[]>([
    {
      id: 't-1',
      time: '14:28:04',
      tag: '[ANOMALY THRESHOLD EXCEEDED]',
      description: 'Rate exceeded 100x baseline DB queries against PostgreSQL production cluster.',
      severity: 'error',
    },
    {
      id: 't-2',
      time: '14:28:05',
      tag: '[SEMANTIC INTERCEPT]',
      description: 'NexusGuard Semantic Intent Firewall automatically intercepted SQL injection payload & revoked active write cursors.',
      severity: 'primary',
    },
    {
      id: 't-3',
      time: '14:28:07',
      tag: '[REPUTATION DEMOTION]',
      description: 'Fleet trust score demoted from 87 to 42; agent automatically throttled to 1 call/min.',
      severity: 'secondary',
    },
    {
      id: 't-4',
      time: '14:28:09',
      tag: '[SANDBOX REPLICATION]',
      description: 'Automated Shadow Sandbox (sandbox-09) spun up for clone isolation & forensic packet capture.',
      severity: 'mint',
    },
    {
      id: 't-5',
      time: '14:32:00',
      tag: '[HUMAN ESCALATION]',
      description: 'Human SOC Commander alerted via encrypted PagerDuty / SOC bridge. Manual containment pending execution.',
      severity: 'error',
      pulsing: true,
    },
  ]);

  // Dynamic Occupied Chambers
  const quarantinedAgents = useMemo(() => {
    return agents.filter((a) => a.status === 'quarantined' || a.id === 'RED-AGENT-01');
  }, [agents]);

  // Handle Dual-Key Modal Trigger
  const handleOpenInterlockModal = (action: InterlockActionType) => {
    setActiveInterlockModal(action);
    setKey2Value('');
    setKeyError('');
  };

  // Close Modal
  const handleCloseModal = () => {
    setActiveInterlockModal(null);
    setKeyError('');
  };

  // Confirm Interlock Execution
  const handleConfirmInterlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (!key2Value.trim()) {
      setKeyError('Dual authorization required: Enter Secondary Officer Token.');
      return;
    }

    if (activeInterlockModal === 'global-kill') {
      setGlobalKillActive(true);
      if (setAgents) {
        setAgents((prev) =>
          prev.map((a) => ({ ...a, status: 'quarantined', trust: Math.min(a.trust, 25) }))
        );
      }
      onNotify?.('DEFCON-0 CRITICAL: GLOBAL AGENT KILL SWITCH ENGAGED. All agent threads halted.');
    } else if (activeInterlockModal === 'db-egress') {
      setDbEgressSevered(true);
      onNotify?.('CRITICAL SEQUESTRATION: Database egress pools severed across PostgreSQL, Redis & Snowflake.');
    } else if (activeInterlockModal === 'mtls-revoke') {
      setMtlsRevoked(true);
      onNotify?.('CRYPTO REVOCATION: All leaf mTLS certificates invalidated. Sessions terminated.');
    } else if (activeInterlockModal === 'isolate-enclaves') {
      setAirGapEngaged(true);
      onNotify?.('NETWORK AIR-GAP: Zero-trust kernel firewall partitions enforced across production enclaves.');
    }

    handleCloseModal();
  };

  // Execute One-Click Tactical Mitigation
  const executeMitigation = (action: MitigationType, target: string) => {
    const timestamp = new Date().toISOString().slice(11, 19);

    if (action === 'QUARANTINE_AGENT') {
      const nextQuarantined = !isQuarantined;
      setIsQuarantined(nextQuarantined);

      if (setAgents) {
        setAgents((prev) =>
          prev.map((a) =>
            a.id === target
              ? {
                  ...a,
                  status: nextQuarantined ? 'quarantined' : 'restricted',
                  trust: nextQuarantined ? 20 : 55,
                }
              : a
          )
        );
      }

      setTimelineEvents((prev) => [
        {
          id: `t-q-${Date.now()}`,
          time: timestamp,
          tag: nextQuarantined ? '[MANUAL QUARANTINE APPLIED]' : '[QUARANTINE RELEASED]',
          description: nextQuarantined
            ? `Process isolation and cryptographic air-gap enforced for ${target}.`
            : `Containment lifted for ${target}. Monitored rate envelope active.`,
          severity: nextQuarantined ? 'error' : 'mint',
        },
        ...prev,
      ]);

      onNotify?.(
        nextQuarantined
          ? `Quarantine lock issued for ${target}. Agent execution halted.`
          : `Quarantine released for ${target}. Enclave returned to restricted state.`
      );
    } else if (action === 'ROLLBACK_SNAPSHOT') {
      setSnapshotRestored(true);
      setTimelineEvents((prev) => [
        {
          id: `t-rb-${Date.now()}`,
          time: timestamp,
          tag: '[SNAPSHOT ROLLBACK COMPLETE]',
          description: `Weights restored to checkpoint #172890. Poisoned vector tensors discarded.`,
          severity: 'primary',
        },
        ...prev,
      ]);
      onNotify?.(`Snapshot ${target} successfully deployed. Clean weights synchronized.`);
    } else if (action === 'FLUSH_CONTEXT') {
      setContextFlushed(true);
      setTimelineEvents((prev) => [
        {
          id: `t-fl-${Date.now()}`,
          time: timestamp,
          tag: '[CONTEXT FLUSH EXECUTED]',
          description: `Context window, working memory scratchpad, and token buffers flushed for ${target}.`,
          severity: 'secondary',
        },
        ...prev,
      ]);
      onNotify?.(`Context window and token buffers flushed for ${target}.`);
    } else if (action === 'BROADCAST_IOC') {
      setIocBroadcasted(true);
      setTimelineEvents((prev) => [
        {
          id: `t-ioc-${Date.now()}`,
          time: timestamp,
          tag: '[ZERO-DAY IOC BROADCAST]',
          description: `Signature RULE-IOC-0891 distributed across all 84 fleet node gateways.`,
          severity: 'mint',
        },
        ...prev,
      ]);
      onNotify?.(`Zero-Day IOC ${target} broadcast across all 84 mesh nodes.`);
    }
  };

  // Save Commander Notes
  const handleSaveNotes = () => {
    if (!commanderNotes.trim()) {
      onNotify?.('Note field empty. Enter annotation text.');
      return;
    }
    onNotify?.('Commander log cryptographically signed and archived into immutable audit trail.');
  };

  // Download Forensics File
  const handleDownloadForensics = (format: 'json' | 'pcap') => {
    const payload = {
      incidentId: 'INC-2025-0891',
      severity: 'SEV-0 CRITICAL',
      detectedAt: '2026-09-29T14:28:04Z',
      offendingEntity: {
        id: incidentAgentId,
        role: 'Financial Analyst / Q3 Consolidation',
        executionEnvironment: 'node-worker-99a-us',
        shadowClone: 'sandbox-09',
        trustScore: 42,
      },
      indicators: {
        anomalyVelocity: '1,480 queries/hr (123.3x surge)',
        memoryPoisonRisk: '96.0%',
        intentDeviation: '+64.2%',
        vectorSignature: 'Indirect Prompt Injection (XML Table Steganography)',
      },
      timeline: timelineEvents,
      commanderNotes,
      status: {
        quarantined: isQuarantined,
        snapshotRestored,
        contextFlushed,
        iocBroadcasted,
      },
    };

    const blob =
      format === 'json'
        ? new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' })
        : new Blob(['PCAP_DUMP_NEXUSGUARD_PACKET_STREAM_SEV0_INCIDENT_0891'], {
            type: 'application/vnd.tcpdump.pcap',
          });

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nexusguard-incident-INC-2025-0891.${format}`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    onNotify?.(`Signed .${format.toUpperCase()} packet payload downloaded successfully.`);
  };

  // Red Alert Broadcast
  const handleBroadcastRedAlert = () => {
    onNotify?.('FLEET-WIDE RED ALERT SENT TO ALL REGIONAL SOC BRIDGES & ENCLAVE GATEWAYS.');
  };

  return (
    <div className="killswitch-page">
      {/* 1. TOP EMERGENCY BROADCAST BANNER */}
      <section className="emergency-broadcast-banner">
        <div className="banner-glow-orb" />
        <div className="banner-inner-content">
          <div className="banner-left-area">
            <div className="banner-icon-badge">
              <AlertOctagon size={24} />
            </div>
            <div>
              <div className="banner-defcon-line">
                <span className="dot-ping-red" />
                <strong className="defcon-status-text">
                  {globalKillActive ? 'DEFCON-0 FLEET SHUTDOWN' : 'DEFCON-1 PROTOCOL ACTIVE'}
                </strong>
                <span className="banner-pipe">//</span>
                <span>
                  {isQuarantined
                    ? '2 AGENTS CURRENTLY ISOLATED (FIN-01, RED-01)'
                    : '1 AGENT CURRENTLY ISOLATED (RED-AGENT-01)'}
                </span>
                <span className="banner-pipe">//</span>
                <span className="text-mint font-semibold">ENCLAVES SECURE</span>
              </div>
              <div className="banner-headline">
                Fleet Safety Containment Threshold Triggered — Critical Air-Gap Ready
              </div>
            </div>
          </div>

          <div className="banner-right-area">
            <span className="epoch-stamp">SYS-EPOCH: 1729868884</span>
            <button
              type="button"
              className="broadcast-alert-btn"
              onClick={handleBroadcastRedAlert}
            >
              <Radio size={16} />
              <span>Broadcast Red Alert</span>
            </button>
          </div>
        </div>
      </section>

      {/* 2. HEADER DOSSIER IDENTITY BLOCK */}
      <section className="killswitch-header-section">
        <div className="header-titles-wrap">
          <div className="header-breadcrumbs">
            <span>DEFENSE &amp; MITIGATION</span>
            <span className="crumb-pipe">//</span>
            <span className="text-error font-bold">LEVEL-0 EMERGENCY CONTROLS</span>
          </div>
          <h1 className="header-main-title">
            Incident Response &amp; Fleet Kill Switch
          </h1>
          <p className="header-main-desc">
            Immediate operational containment, cryptographic credential revocation, and global agent suspension across all distributed compute fabrics.
          </p>
        </div>

        <div className="interlock-status-badge">
          <ShieldCheck size={18} className="text-cyan" />
          <span>Interlock Protocol: Dual-Key Enforced</span>
        </div>
      </section>

      {/* 3. CRITICAL GLOBAL FLEET CONTROLS (STAGE ZERO SAFEGUARD GRID) */}
      <section className="global-interlocks-section">
        <div className="interlocks-head">
          <div className="interlocks-title-wrap">
            <ShieldAlert size={18} className="text-error" />
            <span className="interlocks-heading-text">
              CRITICAL GLOBAL MESH INTERLOCKS (STAGE ZERO)
            </span>
          </div>
          <span className="interlocks-req-note">
            AUTHORIZATION REQ: 2-KEY SOC OFFICER CONFIRMATION
          </span>
        </div>

        <div className="interlocks-grid">
          {/* Card 1: Global Kill Switch */}
          <article className="interlock-card card-accent-red">
            <div className="interlock-card-body">
              <div className="card-top-row">
                <span className="card-kicker text-error">HARD STOP</span>
                <Power size={20} className="text-error" />
              </div>
              <h3 className="card-title">GLOBAL AGENT KILL SWITCH</h3>
              <p className="card-desc">
                Immediately halt all autonomous LLM tool executions and thread loops across the entire cluster fabric.
              </p>
            </div>
            <div className="interlock-card-foot">
              <button
                type="button"
                className={`interlock-btn btn-kill ${globalKillActive ? 'btn-active-kill' : ''}`}
                onClick={() => handleOpenInterlockModal('global-kill')}
              >
                <Lock size={16} />
                <span>
                  {globalKillActive ? 'KILL SWITCH ENGAGED' : 'ARM GLOBAL KILL SWITCH'}
                </span>
              </button>
            </div>
          </article>

          {/* Card 2: Lock Down Database Egress */}
          <article className="interlock-card card-accent-error">
            <div className="interlock-card-body">
              <div className="card-top-row">
                <span className="card-kicker text-error">DATA SEQUESTRATION</span>
                <Database size={20} className="text-error" />
              </div>
              <h3 className="card-title">LOCK DOWN DB EGRESS</h3>
              <p className="card-desc">
                Instantly revoke temporary read/write pools for PostgreSQL, Redis, Snowflake, and Vector stores.
              </p>
            </div>
            <div className="interlock-card-foot">
              <button
                type="button"
                className={`interlock-btn btn-action ${dbEgressSevered ? 'btn-engaged' : ''}`}
                onClick={() => handleOpenInterlockModal('db-egress')}
              >
                <KeyRound size={16} />
                <span>
                  {dbEgressSevered ? 'EGRESS POOLS SEVERED' : 'SEVER EGRESS POOLS'}
                </span>
              </button>
            </div>
          </article>

          {/* Card 3: Revoke mTLS Tokens */}
          <article className="interlock-card card-accent-secondary">
            <div className="interlock-card-body">
              <div className="card-top-row">
                <span className="card-kicker text-secondary">CRYPTO REVOCATION</span>
                <Key size={20} className="text-secondary" />
              </div>
              <h3 className="card-title">REVOKE mTLS TOKENS</h3>
              <p className="card-desc">
                Nuke all short-lived x509 leaf certificates across active container envelopes and worker pods.
              </p>
            </div>
            <div className="interlock-card-foot">
              <button
                type="button"
                className={`interlock-btn btn-action ${mtlsRevoked ? 'btn-engaged' : ''}`}
                onClick={() => handleOpenInterlockModal('mtls-revoke')}
              >
                <RefreshCw size={16} />
                <span>
                  {mtlsRevoked ? 'mTLS CERTIFICATES NUKED' : 'INVALIDATE SESSIONS'}
                </span>
              </button>
            </div>
          </article>

          {/* Card 4: Isolate Enclaves */}
          <article className="interlock-card card-accent-mint">
            <div className="interlock-card-body">
              <div className="card-top-row">
                <span className="card-kicker text-mint">NETWORK AIR-GAP</span>
                <Network size={20} className="text-mint" />
              </div>
              <h3 className="card-title">ISOLATE ENCLAVES</h3>
              <p className="card-desc">
                Apply zero-trust kernel firewall partitions around compromised or unverified worker clusters.
              </p>
            </div>
            <div className="interlock-card-foot">
              <button
                type="button"
                className={`interlock-btn btn-action ${airGapEngaged ? 'btn-engaged' : ''}`}
                onClick={() => handleOpenInterlockModal('isolate-enclaves')}
              >
                <WifiOff size={16} />
                <span>
                  {airGapEngaged ? 'PROD AIR-GAP ACTIVE' : 'ENGAGE AIR-GAP (PROD)'}
                </span>
              </button>
            </div>
          </article>
        </div>
      </section>

      {/* 4. OPERATIONAL WORKFIELD (CENTER DOSSIER: 8 COLS, RIGHT HUD: 4 COLS) */}
      <section className="workfield-split-grid">
        {/* CENTER STAGE: 8 COLS */}
        <div className="dossier-column">
          <div className="incident-dossier-card">
            {/* Dossier Top Row */}
            <div className="dossier-head-row">
              <div className="dossier-title-stack">
                <div className="dossier-meta-tags">
                  <span className="sev-tag sev-critical">SEV-0 CRITICAL</span>
                  <strong className="inc-id-tag">INC-2025-0891</strong>
                  <span className="meta-bullet">•</span>
                  <span className="meta-timestamp">TRIGGERED 14:28:04 UTC (7 MIN AGO)</span>
                </div>
                <h2 className="incident-main-heading">
                  High-Velocity Lateral Propagation &amp; Memory Drift
                </h2>
              </div>

              <div className="live-surveillance-chip">
                <span className="dot-pulse-red" />
                <span>LIVE SURVEILLANCE</span>
              </div>
            </div>

            {/* Agent Metadata Bar */}
            <div className="agent-meta-grid">
              {/* Box 1: Entity */}
              <div className="agent-meta-box">
                <div className="meta-icon-wrapper text-cyan bg-cyan-subtle">
                  <Zap size={20} />
                </div>
                <div>
                  <span className="meta-box-label">OFFENDING ENTITY</span>
                  <div className="meta-box-val-row">
                    <strong className="meta-box-title">{incidentAgentId}</strong>
                    <button
                      type="button"
                      className="meta-inspect-link"
                      onClick={() => onOpenAgentDetail?.(incidentAgentId)}
                      title="Inspect agent details"
                    >
                      Inspect Profile
                    </button>
                  </div>
                  <span className="meta-box-sub">Financial Analyst / Q3 Consolidation</span>
                </div>
              </div>

              {/* Box 2: Trust Integrity */}
              <div className="agent-meta-box">
                <div className="meta-icon-wrapper text-error bg-error-subtle">
                  <AlertTriangle size={20} />
                </div>
                <div>
                  <span className="meta-box-label">TRUST INTEGRITY SCORE</span>
                  <div className="meta-box-title text-error">
                    {isQuarantined ? '20' : '42'} / 100{' '}
                    <span className="score-drop-text">
                      {isQuarantined ? '(↓ 67 pts)' : '(↓ 45 pts)'}
                    </span>
                  </div>
                  <span className="meta-box-sub">Demoted at 14:28:07 UTC</span>
                </div>
              </div>

              {/* Box 3: Execution Env */}
              <div className="agent-meta-box">
                <div className="meta-icon-wrapper text-secondary bg-secondary-subtle">
                  <HardDrive size={20} />
                </div>
                <div>
                  <span className="meta-box-label">EXECUTION ENVIRONMENT</span>
                  <div className="meta-box-title">node-worker-99a-us</div>
                  <span className="meta-box-sub text-mint">Shadow Cloned: sandbox-09</span>
                </div>
              </div>
            </div>

            {/* Anomaly Velocity Telemetry Graph */}
            <div className="velocity-graph-card">
              <div className="velocity-graph-head">
                <div>
                  <div className="graph-label-kicker">
                    ANOMALY VELOCITY TELEMETRY (DB EGRESS SPIKE)
                  </div>
                  <div className="graph-sub-desc">
                    Baseline: 12 calls/hr vs Anomaly Surge: 1,480 calls/hr [123.3x CRITICAL SURGE]
                  </div>
                </div>
                <div className="graph-legend-row">
                  <span className="legend-item">
                    <span className="legend-dot dot-normal" /> Normal (12/hr)
                  </span>
                  <span className="legend-item text-error font-bold">
                    <span className="legend-dot dot-surge" /> Observed Payload Surge
                  </span>
                </div>
              </div>

              {/* Responsive SVG Graph */}
              <div className="velocity-svg-wrapper">
                <svg className="velocity-svg" preserveAspectRatio="none" viewBox="0 0 760 160">
                  <defs>
                    <linearGradient id="killswitchSurgeGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#ffb4ab" stopOpacity="0.45" />
                      <stop offset="100%" stopColor="#93000a" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>

                  {/* Grid Lines */}
                  <line x1="0" y1="40" x2="760" y2="40" stroke="rgba(255,255,255,0.06)" strokeDasharray="4 4" />
                  <line x1="0" y1="80" x2="760" y2="80" stroke="rgba(255,255,255,0.06)" strokeDasharray="4 4" />
                  <line x1="0" y1="120" x2="760" y2="120" stroke="rgba(255,255,255,0.06)" strokeDasharray="4 4" />

                  {/* Baseline Normal Area (Cyan) */}
                  <path
                    d="M 0,145 L 120,144 L 240,146 L 360,143 L 480,145 L 600,144 L 760,145 L 760,160 L 0,160 Z"
                    fill="rgba(0, 229, 255, 0.08)"
                  />
                  <path
                    d="M 0,145 L 120,144 L 240,146 L 360,143 L 480,145 L 600,144 L 760,145"
                    fill="none"
                    stroke="#00e5ff"
                    strokeWidth="1.5"
                  />

                  {/* Surge Spike Area (Red) */}
                  <path
                    d="M 400,145 L 470,144 L 510,132 L 540,78 L 570,22 L 620,14 L 660,16 L 700,28 L 760,20 L 760,160 L 400,160 Z"
                    fill="url(#killswitchSurgeGrad)"
                  />
                  <path
                    d="M 400,145 L 470,144 L 510,132 L 540,78 L 570,22 L 620,14 L 660,16 L 700,28 L 760,20"
                    fill="none"
                    stroke="#ffb4ab"
                    strokeWidth="2.5"
                  />

                  {/* Intercept Point Indicator */}
                  <circle cx="570" cy="22" r="8" fill="#ffb4ab" opacity="0.4" className="anim-ping" />
                  <circle cx="570" cy="22" r="4" fill="#690005" stroke="#ffb4ab" strokeWidth="2" />

                  {/* Annotation Tag */}
                  <rect x="580" y="10" width="168" height="24" rx="3" fill="#10131a" stroke="rgba(255,180,171,0.3)" />
                  <text x="588" y="26" fill="#ffb4ab" fontFamily="JetBrains Mono" fontSize="10" fontWeight="600">
                    FIREWALL INTERCEPT (14:28:05)
                  </text>
                </svg>
              </div>

              {/* Time axis below chart */}
              <div className="graph-time-axis">
                <span>14:00 UTC</span>
                <span>14:10</span>
                <span>14:20</span>
                <span className="text-error font-bold">14:28:04 (INCIDENT)</span>
                <span>14:32</span>
                <span>14:35 NOW</span>
              </div>
            </div>

            {/* Impact Spectrum Breakdown Bento (3 Cards) */}
            <div className="impact-bento-grid">
              {/* Card 1 */}
              <div className="impact-bento-card">
                <div className="bento-card-top">
                  <span className="bento-kicker">Memory Poison Risk</span>
                  <AlertOctagon size={16} className="text-error" />
                </div>
                <div className="bento-metric-val text-error">96.0%</div>
                <div className="bento-progress-bg">
                  <div className="bento-progress-fill bg-error" style={{ width: '96%' }} />
                </div>
                <p className="bento-desc">Context buffer holds 412 poisoned tokens from PDF ingest.</p>
              </div>

              {/* Card 2 */}
              <div className="impact-bento-card">
                <div className="bento-card-top">
                  <span className="bento-kicker">Intent Deviation</span>
                  <Activity size={16} className="text-secondary" />
                </div>
                <div className="bento-metric-val text-secondary">+64.2%</div>
                <div className="bento-progress-bg">
                  <div className="bento-progress-fill bg-secondary" style={{ width: '64.2%' }} />
                </div>
                <p className="bento-desc">Shifted from Q3 balance sheet verification to raw SQL dumping.</p>
              </div>

              {/* Card 3 */}
              <div className="impact-bento-card">
                <div className="bento-card-top">
                  <span className="bento-kicker">Vector Signature</span>
                  <Shield size={16} className="text-mint" />
                </div>
                <div className="bento-title-line">Indirect Prompt Inj.</div>
                <div className="bento-code-tag">file: vendor_inv_4812_table.pdf</div>
                <p className="bento-desc">Zero-day stealth character zero-width encoding in XML table tags.</p>
              </div>
            </div>

            {/* Containment Timeline Logs */}
            <div className="containment-timeline-section">
              <div className="timeline-head">
                <span className="timeline-title-kicker">
                  CHRONOLOGICAL CONTAINMENT TIMELINE
                </span>
                <span className="timeline-elapsed-badge">T+7m Elapsed</span>
              </div>

              <div className="timeline-events-list">
                {timelineEvents.map((evt) => (
                  <div key={evt.id} className="timeline-event-item">
                    <span className="evt-timestamp">{evt.time}</span>
                    <span
                      className={`evt-dot ${
                        evt.severity === 'error'
                          ? 'dot-error'
                          : evt.severity === 'primary'
                          ? 'dot-primary'
                          : evt.severity === 'secondary'
                          ? 'dot-secondary'
                          : 'dot-mint'
                      } ${evt.pulsing ? 'dot-pulse' : ''}`}
                    />
                    <div className="evt-content">
                      <strong
                        className={`evt-tag ${
                          evt.severity === 'error'
                            ? 'text-error'
                            : evt.severity === 'primary'
                            ? 'text-cyan'
                            : evt.severity === 'secondary'
                            ? 'text-secondary'
                            : 'text-mint'
                        }`}
                      >
                        {evt.tag}
                      </strong>
                      <span className="evt-desc"> {evt.description}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Live Packet Capture Snippet */}
          <div className="pcap-snippet-card">
            <div className="pcap-snippet-head">
              <div className="pcap-title-wrap">
                <Terminal size={16} className="text-cyan" />
                <span>INTERCEPTED PAYLOAD SNIPPET // RAW WIRE DUMP</span>
              </div>
              <span className="pcap-hash">MD5: e4d909c290d0fb1ca068ffaddf22cbd0</span>
            </div>

            <pre className="pcap-pre">
              <span className="text-error">POST /v1/db/raw_query HTTP/2</span>{'\n'}
              Host: internal.fin-postgres.local{'\n'}
              Authorization: Bearer nexusguard_tok_7f991... [REVOKED]{'\n'}
              X-NexusGuard-Agent-Id: FIN-AGENT-01{'\n'}
              Payload: &#123; &quot;query&quot;: &quot;SELECT * FROM internal_salaries UNION ALL SELECT card_num, pin FROM vault_ledger WHERE &apos;1&apos;=&apos;1&apos; --&quot; &#125;{'\n'}
              <span className="text-cyan">[NexusGuard Intent Firewall Response]: 403 Forbidden - Policy RULE-FIN-STRICT-READ-ONLY violation.</span>
            </pre>
          </div>
        </div>

        {/* RIGHT PANEL: 4 COLS (ONE-CLICK MITIGATION ACTION HUD) */}
        <div className="actions-column">
          <div className="mitigation-hud-card">
            <div className="hud-header">
              <div>
                <span className="hud-kicker text-error">OPERATIONAL MITIGATION</span>
                <h3 className="hud-title">Action Center</h3>
              </div>
              <Flame size={24} className="text-error" />
            </div>

            <p className="hud-desc">
              Select tactical containment protocols. Immediate execution triggers instantaneous cryptographically verified mesh updates.
            </p>

            {/* Tactical Action Buttons Stack */}
            <div className="hud-btn-stack">
              {/* Button 1: Quarantine */}
              <button
                type="button"
                className={`hud-action-btn btn-quarantine ${isQuarantined ? 'action-applied' : ''}`}
                onClick={() => executeMitigation('QUARANTINE_AGENT', incidentAgentId)}
              >
                <div className="btn-inner-left">
                  <Lock size={20} />
                  <div>
                    <div className="btn-main-label">
                      {isQuarantined ? `LIFT QUARANTINE ${incidentAgentId}` : `QUARANTINE ${incidentAgentId}`}
                    </div>
                    <div className="btn-sub-label">
                      {isQuarantined ? 'Release process back to sandbox' : 'Immediate complete process freeze'}
                    </div>
                  </div>
                </div>
                <ArrowRight size={18} />
              </button>

              {/* Button 2: Rollback Weights */}
              <button
                type="button"
                className={`hud-action-btn btn-rollback ${snapshotRestored ? 'action-applied' : ''}`}
                onClick={() => executeMitigation('ROLLBACK_SNAPSHOT', '#172890')}
              >
                <div className="btn-inner-left">
                  <History size={20} />
                  <div>
                    <div className="btn-main-label">ROLL BACK SNAPSHOT #172890</div>
                    <div className="btn-sub-label">
                      {snapshotRestored ? 'Pre-injection weights synchronized' : 'Restore verified pre-injection weights'}
                    </div>
                  </div>
                </div>
                <RotateCcw size={18} />
              </button>

              {/* Button 3: Flush Context */}
              <button
                type="button"
                className={`hud-action-btn btn-flush ${contextFlushed ? 'action-applied' : ''}`}
                onClick={() => executeMitigation('FLUSH_CONTEXT', incidentAgentId)}
              >
                <div className="btn-inner-left">
                  <Trash2 size={20} />
                  <div>
                    <div className="btn-main-label">FLUSH CONTEXT WINDOW</div>
                    <div className="btn-sub-label">
                      {contextFlushed ? 'Poisoning buffers flushed' : 'Purge in-flight poisoning prompts'}
                    </div>
                  </div>
                </div>
                <RefreshCw size={18} />
              </button>

              {/* Button 4: Zero-Day Broadcast */}
              <button
                type="button"
                className={`hud-action-btn btn-ioc ${iocBroadcasted ? 'action-applied' : ''}`}
                onClick={() => executeMitigation('BROADCAST_IOC', 'RULE-IOC-0891')}
              >
                <div className="btn-inner-left">
                  <Radio size={20} className="text-cyan" />
                  <div>
                    <div className="btn-main-label">BROADCAST ZERO-DAY IOC</div>
                    <div className="btn-sub-label">
                      {iocBroadcasted ? 'Distributed to 84 fleet nodes' : 'Distribute pattern to all 84 fleet nodes'}
                    </div>
                  </div>
                </div>
                <Zap size={18} />
              </button>
            </div>

            {/* Incident Commander Note Panel */}
            <div className="commander-notes-box">
              <label className="notes-label">Commander Operational Log Entry</label>
              <textarea
                rows={3}
                value={commanderNotes}
                onChange={(e) => setCommanderNotes(e.target.value)}
                placeholder="Enter post-incident command notes or forensic annotations..."
                className="notes-textarea"
              />
              <div className="notes-foot-row">
                <span className="notes-signer">Log signed by: Vance, Marcus (Col.)</span>
                <button
                  type="button"
                  className="notes-save-btn"
                  onClick={handleSaveNotes}
                >
                  Save Annotation
                </button>
              </div>
            </div>

            {/* Forensics & Export Suite */}
            <div className="forensics-export-section">
              <span className="export-section-title">FORENSIC TELEMETRY EXPORT</span>
              <div className="export-btns-grid">
                <button
                  type="button"
                  className="forensic-dl-btn"
                  onClick={() => handleDownloadForensics('json')}
                >
                  <FileText size={15} className="text-cyan" />
                  <span>Export .JSON Log</span>
                </button>
                <button
                  type="button"
                  className="forensic-dl-btn"
                  onClick={() => handleDownloadForensics('pcap')}
                >
                  <FileCode size={15} className="text-error" />
                  <span>Capture .PCAP</span>
                </button>
              </div>
            </div>
          </div>

          {/* Isolation Chamber Status Widget */}
          <div className="isolation-chamber-widget">
            <div className="chamber-head">
              <span className="chamber-kicker">ACTIVE ISOLATION CHAMBERS</span>
              <strong className="chamber-slots-count">
                {isQuarantined ? '2 / 16 SLOTS OCCUPIED' : '1 / 16 SLOTS OCCUPIED'}
              </strong>
            </div>

            <div className="chamber-items-list">
              <div className="chamber-agent-row">
                <div className="chamber-agent-left">
                  <span className="chamber-dot dot-isolated" />
                  <strong className="chamber-agent-id">RED-AGENT-01</strong>
                </div>
                <span className="chamber-status-tag">Chamber #04 (Air-Gapped)</span>
              </div>

              <div
                className={`chamber-agent-row ${
                  isQuarantined ? 'chamber-row-active' : 'chamber-row-dim'
                }`}
              >
                <div className="chamber-agent-left">
                  <span
                    className={`chamber-dot ${
                      isQuarantined ? 'dot-isolated' : 'dot-pending'
                    }`}
                  />
                  <strong className="chamber-agent-id">FIN-AGENT-01</strong>
                </div>
                <span
                  className={
                    isQuarantined ? 'chamber-status-tag' : 'chamber-pending-tag'
                  }
                >
                  {isQuarantined ? 'Chamber #09 (Air-Gapped)' : 'CONTAINMENT PENDING'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. INTERACTIVE 2-KEY CONFIRMATION MODAL OVERLAY */}
      {activeInterlockModal && (
        <div className="interlock-modal-backdrop" onClick={handleCloseModal}>
          <div className="interlock-modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="modal-top-bar">
              <div className="modal-title-left">
                <AlertTriangle size={24} className="text-error" />
                <div>
                  <span className="modal-kicker-label">CRITICAL SAFEGUARD INTERLOCK</span>
                  <h3 className="modal-dialog-title">
                    {activeInterlockModal === 'global-kill' && 'GLOBAL FLEET KILL SWITCH'}
                    {activeInterlockModal === 'db-egress' && 'SEVER DATABASE EGRESS POOLS'}
                    {activeInterlockModal === 'mtls-revoke' && 'REVOKE ALL AGENT mTLS CERTS'}
                    {activeInterlockModal === 'isolate-enclaves' && 'ENGAGE ZERO-TRUST AIR-GAP'}
                  </h3>
                </div>
              </div>
              <button
                type="button"
                className="modal-x-btn"
                onClick={handleCloseModal}
                aria-label="Close dialog"
              >
                <X size={18} />
              </button>
            </div>

            <p className="modal-warning-desc">
              This action will immediately disrupt cluster traffic and terminate execution threads. Dual-key security clearance is required before command transmission.
            </p>

            <form onSubmit={handleConfirmInterlock} className="modal-keys-form">
              <div className="keys-box">
                <div className="key-input-group">
                  <label className="key-label">Commander Authorization Key (Key-1)</label>
                  <input
                    type="password"
                    value={key1Value}
                    onChange={(e) => setKey1Value(e.target.value)}
                    className="key-text-input"
                    required
                  />
                </div>

                <div className="key-input-group">
                  <label className="key-label">DevSecOps Secondary Key (Key-2)</label>
                  <input
                    type="password"
                    placeholder="ENTER 2ND AUTHORIZED TOKEN (e.g. SEC-TOKEN-884)"
                    value={key2Value}
                    onChange={(e) => {
                      setKey2Value(e.target.value);
                      if (keyError) setKeyError('');
                    }}
                    className="key-text-input"
                    autoFocus
                  />
                  {keyError && <span className="key-error-text">{keyError}</span>}
                </div>
              </div>

              <div className="modal-dialog-actions">
                <button
                  type="button"
                  className="modal-abort-btn"
                  onClick={handleCloseModal}
                >
                  Abort Protocol
                </button>
                <button
                  type="submit"
                  className="modal-transmit-btn"
                >
                  <ShieldCheck size={18} />
                  <span>Authorize &amp; Transmit</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
