import { useEffect, useState, type FormEvent } from 'react';
import Dashboard from './Dashboard';
import {
  Activity,
  ArrowUpRight,
  BadgeCheck,
  Check,
  ChevronRight,
  Eye,
  EyeOff,
  FileSearch,
  Fingerprint,
  KeyRound,
  LockKeyhole,
  Mail,
  Network,
  Shield,
  ShieldAlert,
  ShieldCheck,
  UserCheck,
  Webhook,
} from 'lucide-react';
import './styles.css';

const capabilities = [
  {
    pillar: 'SECURITY',
    icon: ShieldCheck,
    title: 'Zero-Trust Isolation',
    description: 'Deterministic AST intent firewall, eBPF kernel traps, and hardened execution enclaves.',
    tone: 'cyan',
  },
  {
    pillar: 'TRUST',
    icon: BadgeCheck,
    title: 'Adaptive Scoring',
    description: 'Continuous heuristic drift tracking, sigmoid privilege decay, and Nitro hardware attestation.',
    tone: 'lime',
  },
  {
    pillar: 'CONTROL',
    icon: LockKeyhole,
    title: 'Stage-Zero Interlocks',
    description: 'Hardware kill switches, dual-key authorizations, and ephemeral privilege envelopes.',
    tone: 'coral',
  },
  {
    pillar: 'TRANSPARENCY',
    icon: Eye,
    title: 'Full-Stack Visibility',
    description: 'Natural language intent synthesis, raw payload inspection, and deterministic execution trace.',
    tone: 'blue',
  },
  {
    pillar: 'ACCOUNTABILITY',
    icon: FileSearch,
    title: 'Immutable WORM Ledger',
    description: 'Verifiable SHA-256 Merkle proofs, FIPS 140-3 audit trails, and multi-party quorum sign-offs.',
    tone: 'purple',
  },
  {
    pillar: 'AUTONOMY WITH OVERSIGHT',
    icon: UserCheck,
    title: 'Supervised Velocity',
    description: 'High-velocity multi-agent autonomy bounded by synchronous SLA countdowns and human escalations.',
    tone: 'amber',
  },
];

export default function App() {
  const [showDashboard, setShowDashboard] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [notice, setNotice] = useState('');

  useEffect(() => {
    document.title = showDashboard
      ? 'NexusGuard | Security Command Center'
      : 'NexusGuard | Secure Workspace Access';
  }, [showDashboard]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setNotice('Sign-in is not connected yet. Configure an identity provider to continue.');
  }

  function handleUnavailable(method: string) {
    setNotice(`${method} sign-in is not configured yet.`);
  }

  if (showDashboard) {
    return <Dashboard onSignOut={() => setShowDashboard(false)} />;
  }

  return (
    <main className="login-shell">
      <div className="login-frame">
        <section className="brand-panel" aria-labelledby="brand-title">
          <header className="brand-header">
            <a className="brand-lockup" href="#home" aria-label="NexusGuard home">
              <span className="brand-mark" aria-hidden="true">
                <Shield size={24} strokeWidth={1.8} />
                <span className="brand-mark-core" />
              </span>
              <span className="brand-wordmark">NexusGuard<span>.</span></span>
            </a>
            <span className="environment-label"><span /> CONTROL PLANE</span>
          </header>

          <div className="brand-copy">
            <p className="eyebrow"><span className="eyebrow-rule" /> SOVEREIGN AI AGENT GOVERNANCE</p>
            <h1 id="brand-title">Trust every agent.<br /><span>Verify every action.</span></h1>
            <p className="brand-description">
              The enterprise zero-trust control plane establishing deterministic <strong>Security</strong>, dynamic <strong>Trust</strong>, absolute <strong>Control</strong>, radical <strong>Transparency</strong>, cryptographic <strong>Accountability</strong>, and <strong>Autonomy with Human Oversight</strong>.
            </p>
          </div>

          <div className="assurance-ribbon-tag">
            <ShieldCheck size={14} />
            <span>SIX CORE PILLARS OF AGENT ASSURANCE</span>
          </div>

          <div className="capability-grid capability-grid-six" aria-label="NexusGuard capabilities">
            {capabilities.map(({ pillar, icon: Icon, title, description, tone }, index) => (
              <article className={`capability capability-${tone}`} key={pillar}>
                <div className="capability-topline">
                  <span className="capability-icon"><Icon size={17} strokeWidth={1.8} /></span>
                  <span className="capability-pillar-badge">{pillar}</span>
                  <span className="capability-index">0{index + 1}</span>
                </div>
                <h2>{title}</h2>
                <p>{description}</p>
              </article>
            ))}
          </div>

          <div className="assurance-ticker-bar">
            <span>SECURITY</span>
            <i>·</i>
            <span>TRUST</span>
            <i>·</i>
            <span>CONTROL</span>
            <i>·</i>
            <span>TRANSPARENCY</span>
            <i>·</i>
            <span>ACCOUNTABILITY</span>
            <i>·</i>
            <span>AUTONOMY WITH OVERSIGHT</span>
          </div>

          <footer className="platform-status">
            <div className="status-heading">
              <div className="status-title"><Network size={16} /><span>WORKSPACE STATUS</span></div>
              <span className="status-chip"><span /> LOCAL PREVIEW</span>
            </div>
            <div className="status-details">
              <span><span className="status-dot status-dot-muted" /> Identity provider <strong>Not connected</strong></span>
              <span><span className="status-dot" /> Platform interface <strong>Ready</strong></span>
            </div>
          </footer>
        </section>

        <section className="auth-panel" aria-labelledby="sign-in-title">
          <div className="auth-content">
            <div className="auth-heading">
              <div className="access-label"><LockKeyhole size={14} /><span>SECURE WORKSPACE ACCESS</span></div>
              <h2 id="sign-in-title">Welcome back</h2>
              <p>Sign in to your NexusGuard workspace.</p>
            </div>

            <form className="auth-form" onSubmit={handleSubmit}>
              <div className="field-group">
                <label htmlFor="email">WORK EMAIL</label>
                <div className="input-wrap">
                  <Mail className="input-icon" size={17} aria-hidden="true" />
                  <input autoComplete="username" id="email" name="email" placeholder="you@company.com" required type="email" />
                </div>
              </div>

              <div className="field-group">
                <div className="field-label-row">
                  <label htmlFor="password">PASSWORD</label>
                  <button className="text-action" onClick={() => handleUnavailable('Password recovery')} type="button">
                    Forgot password?
                  </button>
                </div>
                <div className="input-wrap">
                  <KeyRound className="input-icon" size={17} aria-hidden="true" />
                  <input autoComplete="current-password" id="password" name="password" placeholder="Enter your password" required type={showPassword ? 'text' : 'password'} />
                  <button
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    aria-pressed={showPassword}
                    className="icon-button password-toggle"
                    onClick={() => setShowPassword((visible) => !visible)}
                    type="button"
                  >
                    {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </div>
              </div>

              <div className="form-options">
                <label className="remember-option"><input name="remember" type="checkbox" /><span className="custom-check"><Check size={12} /></span><span>Remember this device</span></label>
                <span className="transport-status"><span /> TLS protected</span>
              </div>

              <button className="primary-button" type="submit">
                <span>Sign in to NexusGuard</span><ArrowUpRight size={18} />
              </button>

              <p aria-live="polite" className={`form-notice${notice ? ' form-notice-visible' : ''}`} role="status">
                {notice || ' '}
              </p>
            </form>

            <div className="sso-divider"><span>OR CONTINUE WITH</span></div>

            <div className="sso-options">
              <button className="sso-button" onClick={() => handleUnavailable('Single sign-on')} type="button">
                <span className="sso-icon"><Webhook size={17} /></span>
                <span className="sso-copy"><strong>Enterprise SSO</strong><small>SAML or OIDC provider</small></span>
                <ChevronRight className="sso-chevron" size={17} />
              </button>
              <button className="sso-button" onClick={() => handleUnavailable('Security key')} type="button">
                <span className="sso-icon"><Fingerprint size={18} /></span>
                <span className="sso-copy"><strong>Security key</strong><small>Passkey or hardware key</small></span>
                <ChevronRight className="sso-chevron" size={17} />
              </button>
            </div>

            <button className="preview-entry" onClick={() => setShowDashboard(true)} type="button">
              <span>Preview the command center</span><ArrowUpRight size={15} />
            </button>

            <div className="auth-footnote">
              <BadgeCheck size={15} />
              <span>Sign-in methods become available when configured by your administrator.</span>
            </div>
          </div>

          <footer className="auth-footer"><span>NEXUSGUARD ACCESS PORTAL</span><a href="#security" onClick={(event) => { event.preventDefault(); handleUnavailable('Security information'); }}>Security <ArrowUpRight size={12} /></a></footer>
        </section>
      </div>
    </main>
  );
}
