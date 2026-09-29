import { useState, type Dispatch, type SetStateAction } from 'react';
import {
  Activity, AlertTriangle, ArrowRight, BadgeCheck, Check,
  CheckCircle2, ChevronRight, Copy, Database, Download,
  ExternalLink, Eye, EyeOff, FileText, Fingerprint, Gavel,
  Globe, HardDrive, History, Info, Key, Layers, Lock,
  Network, Play, Power, RefreshCw, Save, Search, Server,
  Shield, ShieldAlert, ShieldCheck, Sliders, Smartphone,
  Terminal, Timer, Trash2, UserCheck, Users, Wifi, X, Zap
} from 'lucide-react';
import type { Agent } from '../Agents/agentData';
import './enterprise-settings.css';

export interface EnterpriseSettingsProps {
  agents?: Agent[];
  setAgents?: Dispatch<SetStateAction<Agent[]>>;
  onNotify?: (msg: string) => void;
  onOpenAgentDetail?: (agentId: string) => void;
}

export type SettingsSection = 'topology' | 'auth-sso' | 'agent-enclaves' | 'threat-policies' | 'kill-switch' | 'audit-worm' | 'api-tokens' | 'clusters';

export default function EnterpriseSettings({
  agents = [],
  onNotify,
}: EnterpriseSettingsProps) {
  // Navigation active section
  const [activeSection, setActiveSection] = useState<SettingsSection>('topology');

  // Form states
  const [orgName, setOrgName] = useState('NexusGuard Global Cyber Defense Operations');
  const [tenantId] = useState('org_98bf4e2910ba');
  const [primaryEnclave, setPrimaryEnclave] = useState('US-EAST-SECURE-PROD-CLUSTER-01 (Active Master)');
  const [opticalDark, setOpticalDark] = useState(true);

  // Auth & SSO states
  const [ssoStrict, setSsoStrict] = useState(true);
  const [fido2Enforced, setFido2Enforced] = useState(true);
  const [sessionLockout, setSessionLockout] = useState('15');
  const [quorumThreshold, setQuorumThreshold] = useState(2);

  // Agent identity & enclave states
  const [trustBaseline, setTrustBaseline] = useState(80);
  const [attestationRoot, setAttestationRoot] = useState('AWS Nitro Enclave v2 & TPM 2.0 Hardware Root');
  const [mtlsRotationHours, setMtlsRotationHours] = useState(24);

  // Cryptographic audit & WORM retention states
  const [wormDays, setWormDays] = useState(365);
  const [kmsKeyArn, setKmsKeyArn] = useState('arn:aws:kms:us-east-1:keys/nexusguard-merkle-master-9801fa');

  // API Tokens & Gateway
  const [apiToken, setApiToken] = useState('ak_sec_78fa81029c011e408892ba9902');
  const [showApiToken, setShowApiToken] = useState(false);
  const [webhookEndpoint, setWebhookEndpoint] = useState('https://soc-ops.nexusguard-defense.internal/hooks/alerts');
  const [rateLimit, setRateLimit] = useState(10000);

  // Save button animation state
  const [isSaving, setIsSaving] = useState(false);
  const [isSealed, setIsSealed] = useState(false);

  // Modals state
  const [auditModalOpen, setAuditModalOpen] = useState(false);
  const [revokeModalOpen, setRevokeModalOpen] = useState(false);
  const [pendingChangesCount, setPendingChangesCount] = useState(2);

  // Scroll to section helper
  const scrollToSection = (sectionId: SettingsSection) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Save Settings handler
  const handleSaveSettings = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setIsSealed(true);
      onNotify?.('Enterprise settings successfully committed to AWS Nitro enclaves and Merkle ledger #4,891,013.');
      setTimeout(() => {
        setIsSealed(false);
      }, 2500);
    }, 1200);
  };

  // Export Snapshot
  const handleExportSnapshot = () => {
    const snapshot = {
      system: 'NexusGuard Enterprise Security & Governance Platform',
      version: 'v4.18.2-PROD',
      exportedAt: new Date().toISOString(),
      organization: {
        name: orgName,
        tenantId: tenantId,
        primaryEnclave: primaryEnclave,
        opticalDarkProfile: opticalDark,
      },
      authentication: {
        ssoStrict: ssoStrict,
        fido2HardwareKeyMandatory: fido2Enforced,
        idleSessionLockoutMinutes: Number(sessionLockout),
        dualApprovalQuorumThreshold: quorumThreshold,
      },
      agentEnclaves: {
        initialTrustBaseline: trustBaseline,
        hardwareAttestationRoot: attestationRoot,
        mtlsRotationHours: mtlsRotationHours,
        automaticQuarantineTriggers: {
          riskScoreFloor: 90,
          trustDegradationFloor: 30,
        },
      },
      cryptographicAudit: {
        wormStorageLedger: 'ENABLED',
        retentionDays: wormDays,
        kmsKeyArn: kmsKeyArn,
      },
      apiGateway: {
        webhookEndpoint: webhookEndpoint,
        rateLimitPerNode: rateLimit,
      },
    };

    const blob = new Blob([JSON.stringify(snapshot, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nexusguard-enterprise-settings-snapshot-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    onNotify?.('Enterprise settings snapshot downloaded successfully.');
  };

  // Copy helper
  const handleCopyText = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    onNotify?.(`${label} copied to clipboard.`);
  };

  // Test SAML Assertion
  const handleTestSaml = () => {
    onNotify?.('SAML 2.0 handshake verified with Okta / CyberArk IdP. Response time: 142ms. Zero cert drift.');
  };

  // Rotate SAML Cert
  const handleRotateSamlCert = () => {
    onNotify?.('SAML 2.0 signing x509 leaf certificate rotated. Valid for 365 days.');
  };

  // Force Cycle mTLS
  const handleForceCycleMtls = () => {
    onNotify?.('Initiated zero-downtime mTLS keypair rotation across all 24 connected agent enclaves.');
  };

  // Rotate KMS Key
  const handleRotateKmsKey = () => {
    const newArn = `arn:aws:kms:us-east-1:keys/nexusguard-merkle-master-${Date.now().toString().slice(-6)}`;
    setKmsKeyArn(newArn);
    onNotify?.(`Storage KMS encryption key rotated to new customer-managed key: ${newArn}`);
  };

  // Revoke Master Token
  const handleConfirmRevokeToken = () => {
    const newToken = `ak_sec_${Date.now().toString(16)}${Math.random().toString(16).slice(2, 10)}`;
    setApiToken(newToken);
    setRevokeModalOpen(false);
    onNotify?.('Master API Token revoked. New cryptographically secure token generated.');
  };

  // Approve Pending Changes
  const handleApprovePendingChanges = () => {
    setPendingChangesCount(0);
    setAuditModalOpen(false);
    onNotify?.('2-Man quorum verified. Both pending configuration changes committed to Merkle ledger.');
  };

  return (
    <div className="enterprise-settings-page">
      {/* Top Breadcrumb & Header Control Rig */}
      <section className="settings-header-section">
        <div className="header-meta">
          <div className="settings-breadcrumbs font-mono">
            <span className="text-on-surface-variant font-semibold">PLATFORM</span>
            <span className="crumb-sep">/</span>
            <span className="text-on-surface-variant font-semibold">ADMINISTRATION</span>
            <span className="crumb-sep">/</span>
            <span className="crumb-active text-cyan font-semibold tracking-widest">ENTERPRISE SETTINGS</span>
          </div>

          <div className="title-row">
            <h1 className="settings-title">Enterprise Security &amp; Governance Settings</h1>
            <span className="enforce-badge font-mono">
              <span className="pulse-dot-mint" />
              <span>ENFORCEMENT: ENCLAVE-LEVEL ZERO TRUST</span>
            </span>
          </div>

          <p className="settings-subtitle">
            Global configuration for NexusGuard multi-cluster deployment, identity providers, cryptographic secrets, and audit retention policies.
          </p>
        </div>

        {/* Action Button Group */}
        <div className="header-actions font-mono">
          <button
            className="btn-toolbar-subtle"
            onClick={handleExportSnapshot}
            title="Download full enterprise settings configuration snapshot"
          >
            <Download size={15} />
            <span>Export Snapshot</span>
          </button>

          <button
            className="btn-toolbar-subtle relative"
            onClick={() => setAuditModalOpen(true)}
            title="Inspect pending 2-man authorization changes"
          >
            <History size={15} className="text-blue" />
            <span>Audit Changes</span>
            {pendingChangesCount > 0 && (
              <span className="pending-pill font-mono">{pendingChangesCount} PENDING</span>
            )}
          </button>

          <button
            id="save-settings-btn"
            className="btn-toolbar-primary font-bold"
            onClick={handleSaveSettings}
            disabled={isSaving}
          >
            {isSaving ? (
              <>
                <RefreshCw size={15} className="animate-spin text-background" />
                <span>Applying to Enclaves...</span>
              </>
            ) : isSealed ? (
              <>
                <CheckCircle2 size={15} className="text-background" />
                <span>Configuration Sealed</span>
              </>
            ) : (
              <>
                <ShieldCheck size={16} />
                <span>Save Settings</span>
              </>
            )}
          </button>
        </div>
      </section>

      {/* Threat Tripwire Critical Banner (2-Man Rule Protocol) */}
      <section className="two-man-banner">
        <div className="banner-left-rail" />

        <div className="banner-content">
          <div className="banner-icon-box">
            <Gavel size={20} className="text-amber" />
          </div>

          <div className="banner-text-col">
            <div className="banner-tag-row font-mono">
              <span className="text-amber font-bold">2-MAN RULE PROTOCOL ACTIVE</span>
              <span className="text-outline">•</span>
              <span className="text-outline">SEC-SPEC-4409-R</span>
            </div>

            <p className="banner-desc">
              Modifications to Stage-0 Kill Switch parameters or WORM retention policies require 2-Man cryptographic authorization from <strong className="text-cyan">Col. Marcus Vance</strong> and <strong className="text-cyan">Elena Rostova</strong>.
            </p>
          </div>
        </div>

        <div className="banner-attestation font-mono">
          <span className="text-outline">Key Ring Attestation:</span>
          <span className="fips-chip">FIPS 140-3 L3 OK</span>
        </div>
      </section>

      {/* Main Dock: Sub-Nav + Settings Sections */}
      <div className="settings-main-dock">
        {/* Left Sub-Navigation Column */}
        <aside className="settings-subnav-col">
          <div className="subnav-sticky-card">
            <div className="subnav-header font-mono">
              <span className="subnav-heading text-outline">CONFIGURATION NODES</span>
              <span className="version-pill text-cyan">v4.18.2-PROD</span>
            </div>

            <nav className="subnav-links-list font-mono">
              <button
                className={`subnav-link ${activeSection === 'topology' ? 'active' : ''}`}
                onClick={() => scrollToSection('topology')}
              >
                <div className="flex items-center gap-2">
                  <Sliders size={15} />
                  <span>General &amp; Topology</span>
                </div>
                {activeSection === 'topology' && <span className="active-dot-cyan" />}
              </button>

              <button
                className={`subnav-link ${activeSection === 'auth-sso' ? 'active' : ''}`}
                onClick={() => scrollToSection('auth-sso')}
              >
                <div className="flex items-center gap-2">
                  <Fingerprint size={15} />
                  <span>Authentication &amp; SSO</span>
                </div>
                <span className="nav-tag text-mint">ENFORCED</span>
              </button>

              <button
                className={`subnav-link ${activeSection === 'agent-enclaves' ? 'active' : ''}`}
                onClick={() => scrollToSection('agent-enclaves')}
              >
                <div className="flex items-center gap-2">
                  <Layers size={15} />
                  <span>Agent Identity &amp; Enclaves</span>
                </div>
                <span className="nav-tag text-outline">NITRO-V2</span>
              </button>

              <button
                className={`subnav-link ${activeSection === 'threat-policies' ? 'active' : ''}`}
                onClick={() => scrollToSection('agent-enclaves')}
              >
                <div className="flex items-center gap-2">
                  <ShieldAlert size={15} />
                  <span>Security &amp; Threat Policies</span>
                </div>
                <span className="nav-tag text-outline">STRICT</span>
              </button>

              <button
                className={`subnav-link ${activeSection === 'kill-switch' ? 'active' : ''}`}
                onClick={() => scrollToSection('agent-enclaves')}
              >
                <div className="flex items-center gap-2">
                  <Power size={15} className="text-red" />
                  <span>Emergency &amp; Kill Switch</span>
                </div>
                <span className="w-1.5 h-1.5 rounded-full bg-mint" />
              </button>

              <button
                className={`subnav-link ${activeSection === 'audit-worm' ? 'active' : ''}`}
                onClick={() => scrollToSection('audit-worm')}
              >
                <div className="flex items-center gap-2">
                  <History size={15} />
                  <span>Audit &amp; WORM Retention</span>
                </div>
                <span className="nav-tag text-mint">365D WORM</span>
              </button>

              <button
                className={`subnav-link ${activeSection === 'api-tokens' ? 'active' : ''}`}
                onClick={() => scrollToSection('api-tokens')}
              >
                <div className="flex items-center gap-2">
                  <Key size={15} />
                  <span>API Keys &amp; Webhooks</span>
                </div>
                <span className="nav-tag text-blue">1 ACTIVE</span>
              </button>

              <button
                className={`subnav-link ${activeSection === 'clusters' ? 'active' : ''}`}
                onClick={() => scrollToSection('topology')}
              >
                <div className="flex items-center gap-2">
                  <Server size={15} />
                  <span>Clusters &amp; Environments</span>
                </div>
                <span className="nav-tag text-outline">4 SYNCED</span>
              </button>
            </nav>

            {/* Security Telemetry Mini-Card */}
            <div className="subnav-telemetry-box font-mono">
              <div className="flex items-center justify-between text-xs">
                <span className="text-outline font-semibold">CONFIG INTEGRITY</span>
                <span className="text-mint font-bold">100% PASS</span>
              </div>
              <div className="telemetry-bar-wrap">
                <div className="telemetry-bar-fill" style={{ width: '100%' }} />
              </div>
              <div className="flex items-center justify-between text-xs text-outline">
                <span>Merkle Tree Root:</span>
                <span className="text-on-surface">0x7f..8a01</span>
              </div>
              <div className="flex items-center justify-between text-xs text-outline">
                <span>Last Sync:</span>
                <span className="text-on-surface">14s ago</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Right Settings Form Surfaces */}
        <main className="settings-content-col">
          {/* SECTION A: ORGANIZATION & TOPOLOGY */}
          <section className="settings-card" id="topology">
            <div className="card-top-header">
              <div className="card-heading-group">
                <div className="card-icon-box text-cyan">
                  <Server size={18} />
                </div>
                <div>
                  <h2 className="card-title">Organization &amp; Deployment Topology</h2>
                  <p className="card-subtitle">Core identity, sovereign cluster boundaries, and SOC rendering engine modes.</p>
                </div>
              </div>
              <span className="section-code font-mono">SECTION A // SEC-01</span>
            </div>

            <div className="form-grid-2">
              {/* Org Name Field */}
              <div className="form-field-group">
                <label className="field-label font-mono">Enterprise Organization Name</label>
                <input
                  type="text"
                  className="input-text"
                  value={orgName}
                  onChange={(e) => setOrgName(e.target.value)}
                />
                <span className="field-hint font-mono">Authoritative organization identifier applied across all mutual TLS certificates.</span>
              </div>

              {/* Tenant ID Field */}
              <div className="form-field-group">
                <label className="field-label font-mono">Tenant Identifier (Immutable UUID)</label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    className="input-text font-mono text-cyan bg-surface-high cursor-default"
                    readOnly
                    value={tenantId}
                  />
                  <button
                    className="btn-action-small font-mono"
                    onClick={() => handleCopyText(tenantId, 'Tenant Identifier')}
                    title="Copy to Clipboard"
                  >
                    <Copy size={14} />
                    <span>Copy</span>
                  </button>
                </div>
                <span className="field-hint font-mono">Cryptographically bound to downstream cluster enclaves and attestation ledgers.</span>
              </div>

              {/* Default Enclave */}
              <div className="form-field-group">
                <label className="field-label font-mono">Default Primary Cluster Enclave</label>
                <select
                  className="input-select font-mono"
                  value={primaryEnclave}
                  onChange={(e) => setPrimaryEnclave(e.target.value)}
                >
                  <option value="US-EAST-SECURE-PROD-CLUSTER-01 (Active Master)">US-EAST-SECURE-PROD-CLUSTER-01 (Active Master)</option>
                  <option value="EU-CENTRAL-DEFENSE-CLUSTER-02 (Sovereign)">EU-CENTRAL-DEFENSE-CLUSTER-02 (Sovereign)</option>
                  <option value="APAC-SOUTH-TIER1-ENCLAVE-03 (Edge-Mesh)">APAC-SOUTH-TIER1-ENCLAVE-03 (Edge-Mesh)</option>
                  <option value="GOVCLOUD-US-WEST-RESTRICTED-04 (Air-gapped)">GOVCLOUD-US-WEST-RESTRICTED-04 (Air-gapped)</option>
                </select>
                <span className="field-hint font-mono">Cluster holding root consensus quorum for autonomous agent policy arbitration.</span>
              </div>

              {/* Interface Mode */}
              <div className="form-field-group">
                <label className="field-label font-mono">SOC Optical Environment Profile</label>
                <div className="toggle-display-card">
                  <div className="flex items-center gap-2">
                    <ShieldCheck size={20} className="text-cyan" />
                    <div>
                      <div className="font-mono text-xs font-semibold text-on-surface">Dark Cyber SOC (Strict Zero-Glare)</div>
                      <div className="text-xs text-outline">Optically tuned for 24/7 subterranean command facilities</div>
                    </div>
                  </div>

                  <label className="switch-toggle">
                    <input
                      type="checkbox"
                      checked={opticalDark}
                      onChange={(e) => setOpticalDark(e.target.checked)}
                    />
                    <span className="slider-round" />
                  </label>
                </div>
                <span className="field-hint font-mono">Forces ultra-low luminance styling across telemetry visualizers.</span>
              </div>
            </div>
          </section>

          {/* SECTION B: AUTHENTICATION & ACCESS CONTROL */}
          <section className="settings-card" id="auth-sso">
            <div className="card-top-header">
              <div className="card-heading-group">
                <div className="card-icon-box text-cyan">
                  <Fingerprint size={18} />
                </div>
                <div>
                  <h2 className="card-title">Enterprise Authentication &amp; SOC Access Control</h2>
                  <p className="card-subtitle">Identity providers, FIDO2 hardware cryptographic enforcement, and multi-operator quorum thresholds.</p>
                </div>
              </div>
              <span className="section-code font-mono">SECTION B // SEC-02</span>
            </div>

            <div className="form-grid-2">
              {/* IdP Integration Status Card */}
              <div className="param-panel-card">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="panel-icon-box text-blue">
                      <Network size={20} />
                    </div>
                    <div>
                      <strong className="font-mono text-sm text-on-surface">Okta / CyberArk SAML 2.0</strong>
                      <div className="font-mono text-xs text-outline">ENTITY-ID: urn:nexusguard:idp:us-east</div>
                    </div>
                  </div>
                  <span className="status-pill-mint font-mono font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-mint" /> CONNECTED
                  </span>
                </div>

                <div className="panel-divider" />

                <div className="flex items-center justify-between font-mono text-xs">
                  <span className="text-outline">SSO Enforcement Policy:</span>
                  <span className="text-on-surface font-semibold">STRICT (Password Fallback Disabled)</span>
                </div>

                <div className="flex items-center justify-end gap-2 pt-1 font-mono">
                  <button className="btn-action-small" onClick={handleTestSaml}>
                    Test Assertion
                  </button>
                  <button className="btn-action-small" onClick={handleRotateSamlCert}>
                    Rotate Cert
                  </button>
                </div>
              </div>

              {/* Hardware MFA Switch Card */}
              <div className="param-panel-card">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="panel-icon-box text-cyan">
                      <Smartphone size={20} />
                    </div>
                    <div>
                      <strong className="font-mono text-sm text-on-surface">FIDO2 / WebAuthn Hardware Keys</strong>
                      <div className="text-xs text-outline">Yubikey 5 FIPS / NitroKey 3 mandatory</div>
                    </div>
                  </div>

                  <label className="switch-toggle">
                    <input
                      type="checkbox"
                      checked={fido2Enforced}
                      onChange={(e) => setFido2Enforced(e.target.checked)}
                    />
                    <span className="slider-round" />
                  </label>
                </div>

                <p className="text-xs text-on-surface-variant leading-relaxed">
                  Forces physical presence proof for every privilege escalation, quarantine bypass, or autonomous intent boundary rewrite.
                </p>

                <div className="flex items-center justify-between font-mono text-xs pt-1 border-t border-outline-variant/30">
                  <span className="text-outline">Enrolled Security Keys:</span>
                  <span className="text-cyan font-bold">14 Authenticated Tokens</span>
                </div>
              </div>

              {/* Idle Session Timeout */}
              <div className="form-field-group">
                <label className="field-label font-mono">SOC Officer Idle Session Lockout</label>
                <select
                  className="input-select font-mono"
                  value={sessionLockout}
                  onChange={(e) => setSessionLockout(e.target.value)}
                >
                  <option value="5">5 Minutes (High Alert War-Room Mode)</option>
                  <option value="15">15 Minutes (Standard SOC Mandatory Lockout)</option>
                  <option value="30">30 Minutes (Supervised Monitoring Enclave)</option>
                  <option value="60">60 Minutes (Read-Only Wall Display Terminal)</option>
                </select>
                <span className="field-hint font-mono">Automated biometric or key re-challenge triggers immediately upon timer expiration.</span>
              </div>

              {/* Quorum Threshold */}
              <div className="form-field-group">
                <label className="field-label font-mono">Dual-Approval Quorum Threshold</label>
                <div className="toggle-display-card">
                  <div className="quorum-num-box font-mono font-bold text-cyan text-xl">
                    {quorumThreshold}
                  </div>
                  <div className="flex-1">
                    <div className="font-mono text-xs font-semibold text-on-surface">SOC Officers Required for Quarantine Release</div>
                    <div className="text-xs text-outline">Both keys must sign distinct cryptographic nonces within 600s</div>
                  </div>
                  <span className="fips-chip font-mono">THRESHOLD: 2/5</span>
                </div>
                <span className="field-hint font-mono">Protects against rogue operator compromise or coercive terminal takeovers.</span>
              </div>
            </div>
          </section>

          {/* SECTION C: AGENT IDENTITY & ENCLAVES */}
          <section className="settings-card" id="agent-enclaves">
            <div className="card-top-header">
              <div className="card-heading-group">
                <div className="card-icon-box text-cyan">
                  <Layers size={18} />
                </div>
                <div>
                  <h2 className="card-title">Autonomous Agent Identity &amp; Enclave Parameters</h2>
                  <p className="card-subtitle">Default trust score bounds, hardware attestation profiles, and automated containment trips.</p>
                </div>
              </div>
              <span className="section-code font-mono">SECTION C // SEC-03</span>
            </div>

            <div className="form-grid-2">
              {/* Default Agent Trust Score Slider */}
              <div className="param-panel-card">
                <div className="flex items-center justify-between">
                  <label className="field-label font-mono">Initial Enrollment Trust Baseline</label>
                  <span className="font-mono text-sm text-cyan font-bold px-2 py-0.5 rounded bg-surface-high">
                    {trustBaseline} / 100
                  </span>
                </div>

                <input
                  type="range"
                  min="0"
                  max="100"
                  value={trustBaseline}
                  onChange={(e) => setTrustBaseline(Number(e.target.value))}
                  className="w-full accent-cyan bg-surface-highest h-1.5 rounded-lg cursor-pointer mt-2"
                />

                <div className="flex justify-between text-outline font-mono text-xs mt-1">
                  <span>0 (Untrusted Sandboxed)</span>
                  <span>50 (Monitored Proxy)</span>
                  <span>100 (Full Autonomy)</span>
                </div>
                <span className="field-hint font-mono">New AI instances require 48 hours of clean inference before trust elevates past 85.</span>
              </div>

              {/* Hardware Attestation Selection */}
              <div className="param-panel-card">
                <label className="field-label font-mono">Hardware Attestation Root of Trust</label>
                <select
                  className="input-select font-mono mt-1"
                  value={attestationRoot}
                  onChange={(e) => setAttestationRoot(e.target.value)}
                >
                  <option value="AWS Nitro Enclave v2 & TPM 2.0 Hardware Root">AWS Nitro Enclave v2 &amp; TPM 2.0 Hardware Root</option>
                  <option value="AMD SEV-SNP Confidential Virtual Machine Profile">AMD SEV-SNP Confidential Virtual Machine Profile</option>
                  <option value="Intel SGX Enclave with DCAP Remote Attestation">Intel SGX Enclave with DCAP Remote Attestation</option>
                  <option value="Software Emulated TPM (Non-Compliant - Dev Only)">Software Emulated TPM (Non-Compliant - Dev Only)</option>
                </select>

                <div className="flex items-center gap-1.5 mt-2 font-mono text-xs text-mint">
                  <BadgeCheck size={14} />
                  <span>PCR-0 / PCR-4 Cryptographic PCR Values Locked</span>
                </div>
              </div>

              {/* mTLS Rotation */}
              <div className="param-panel-card">
                <div className="flex items-center justify-between">
                  <label className="field-label font-mono">mTLS Certificate Lifetime &amp; Rotation</label>
                  <span className="font-mono text-xs text-blue">Ed25519 Ephemeral</span>
                </div>

                <div className="flex items-center gap-3 mt-1">
                  <RefreshCw size={18} className="text-blue shrink-0" />
                  <div className="flex-1 font-mono text-xs text-on-surface">
                    Rotates Automatically Every <strong className="text-cyan">{mtlsRotationHours} Hours</strong>
                  </div>
                  <button className="btn-action-small font-mono" onClick={handleForceCycleMtls}>
                    Force Cycle
                  </button>
                </div>
                <span className="field-hint font-mono">Zero-downtime SPIFFE/SPIRE attestation pipe with hardware key backing.</span>
              </div>

              {/* Auto Quarantine Rules */}
              <div className="param-panel-card">
                <div className="flex items-center justify-between">
                  <label className="field-label font-mono">Automatic Threat Containment Tripwire</label>
                  <span className="px-1.5 py-0.5 rounded bg-error-container/20 text-red font-mono text-xs font-bold">
                    STRICT TRIP
                  </span>
                </div>

                <div className="flex flex-col gap-1 mt-1 font-mono text-xs">
                  <div className="flex items-center justify-between text-on-surface">
                    <span className="text-outline">Trigger: Agent Risk Score</span>
                    <strong className="text-red">&gt; 90 / 100</strong>
                  </div>
                  <div className="flex items-center justify-between text-on-surface">
                    <span className="text-outline">Trigger: Agent Trust Degradation</span>
                    <strong className="text-red">&lt; 30 / 100</strong>
                  </div>
                </div>
                <span className="field-hint font-mono">Instant network isolation, memory dump export, and session revocation.</span>
              </div>
            </div>
          </section>

          {/* SECTION D: CRYPTOGRAPHIC AUDIT & RETENTION */}
          <section className="settings-card" id="audit-worm">
            <div className="card-top-header">
              <div className="card-heading-group">
                <div className="card-icon-box text-cyan">
                  <Lock size={18} />
                </div>
                <div>
                  <h2 className="card-title">Cryptographic Audit &amp; Log Retention Policy</h2>
                  <p className="card-subtitle">Immutable WORM storage, Merkle-root verification, and customer-managed KMS key wrapping.</p>
                </div>
              </div>
              <span className="section-code font-mono">SECTION D // SEC-04</span>
            </div>

            <div className="form-grid-2">
              {/* WORM Ledger Status */}
              <div className="param-panel-card">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="field-label font-mono">Immutable WORM Storage Ledger</span>
                    <div className="font-mono text-sm font-bold text-on-surface mt-0.5">Enabled &amp; Merkle-Root Signed</div>
                  </div>
                  <span className="status-pill-mint font-mono font-bold">ACTIVE</span>
                </div>

                <p className="text-xs text-on-surface-variant leading-relaxed">
                  Every telemetry record, prompt reflection, and decision event is hashed into a tamper-evident Merkle ledger.
                </p>

                <div className="flex items-center justify-between font-mono text-xs pt-1 border-t border-outline-variant/30">
                  <span className="text-outline">Block Seal Interval:</span>
                  <span className="text-on-surface">60 Seconds (Or 10K events)</span>
                </div>
              </div>

              {/* Retention Period */}
              <div className="param-panel-card">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="field-label font-mono">Regulatory Retention Window</span>
                    <div className="font-mono text-sm font-bold text-cyan mt-0.5">{wormDays} Days (1-Year Rolling Lock)</div>
                  </div>
                  <span className="fips-chip font-mono">COMPLIANT</span>
                </div>

                <div className="flex items-center gap-1.5 text-xs font-mono text-on-surface">
                  <ShieldCheck size={14} className="text-mint shrink-0" />
                  <span>SEC Rule 17a-4 &amp; FIPS 140-3 Cryptographic Integrity Standards</span>
                </div>

                <div className="flex items-center justify-between font-mono text-xs pt-1 border-t border-outline-variant/30">
                  <span className="text-outline">Legal Hold Override:</span>
                  <span className="text-mint font-bold">UNLOCKED (0 Active Subpoenas)</span>
                </div>
              </div>

              {/* Storage Encryption KMS (Full Width) */}
              <div className="param-panel-card full-width">
                <div className="flex items-center justify-between">
                  <label className="field-label font-mono">Storage Envelope Encryption Key (KMS)</label>
                  <span className="font-mono text-xs text-mint">AES-256-GCM / CUSTOMER-MANAGED</span>
                </div>

                <div className="flex items-center gap-2 mt-1">
                  <input
                    type="text"
                    className="input-text font-mono text-xs text-on-surface bg-surface-high cursor-default flex-1"
                    readOnly
                    value={kmsKeyArn}
                  />
                  <button className="btn-action-small font-mono whitespace-nowrap" onClick={handleRotateKmsKey}>
                    Rotate Key
                  </button>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mt-2 text-outline font-mono text-xs">
                  <span>Automated Export: Nightly zero-knowledge attestation bundle to cold vault (<strong className="text-on-surface">vault-cold-us-east-01</strong>)</span>
                  <span className="text-cyan font-bold">Next Export: 04:00 UTC</span>
                </div>
              </div>
            </div>
          </section>

          {/* SECTION E: API TOKENS & INTEGRATIONS */}
          <section className="settings-card" id="api-tokens">
            <div className="card-top-header">
              <div className="card-heading-group">
                <div className="card-icon-box text-cyan">
                  <Key size={18} />
                </div>
                <div>
                  <h2 className="card-title">API Tokens &amp; Integration Gateway</h2>
                  <p className="card-subtitle">Master ingress control keys, event webhooks, and perimeter rate-limiting parameters.</p>
                </div>
              </div>
              <span className="section-code font-mono">SECTION E // SEC-05</span>
            </div>

            <div className="flex flex-col gap-4">
              {/* Active Master Token */}
              <div className="param-panel-card">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="field-label font-mono">Active Master Control Plane Token</span>
                    <span className="px-2 py-0.5 rounded bg-tertiary-container/10 text-mint font-mono text-xs font-semibold">
                      SCOPES: FULL ADMIN
                    </span>
                  </div>
                  <span className="font-mono text-xs text-blue">Expires in 42 Days</span>
                </div>

                <div className="flex items-center gap-2 mt-1">
                  <div className="relative flex-1">
                    <input
                      type={showApiToken ? 'text' : 'password'}
                      className="input-text font-mono text-xs text-on-surface bg-surface-high pr-10 cursor-default"
                      readOnly
                      value={apiToken}
                    />
                    <button
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface"
                      onClick={() => setShowApiToken(!showApiToken)}
                      title={showApiToken ? 'Hide token' : 'Show token'}
                    >
                      {showApiToken ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>

                  <button
                    className="btn-action-small font-mono flex items-center gap-1"
                    onClick={() => handleCopyText(apiToken, 'Master API Token')}
                  >
                    <Copy size={14} />
                    <span>Copy</span>
                  </button>

                  <button
                    className="btn-danger-small font-mono"
                    onClick={() => setRevokeModalOpen(true)}
                  >
                    Revoke
                  </button>
                </div>
              </div>

              {/* Webhook Dispatch & Rate Limiting Grid */}
              <div className="form-grid-2">
                <div className="form-field-group">
                  <label className="field-label font-mono">Incident Webhook Dispatch Endpoint</label>
                  <input
                    type="text"
                    className="input-text font-mono text-xs"
                    value={webhookEndpoint}
                    onChange={(e) => setWebhookEndpoint(e.target.value)}
                  />
                  <span className="field-hint font-mono">Signs payloads via HMAC-SHA256 with secondary secret token.</span>
                </div>

                <div className="form-field-group">
                  <label className="field-label font-mono">Perimeter Rate-Limiting Protection</label>
                  <div className="toggle-display-card">
                    <div className="flex items-center gap-1.5 font-mono font-bold text-on-surface text-sm">
                      <span className="text-cyan text-base">{rateLimit.toLocaleString()}</span>
                      <span className="text-outline">req / sec</span>
                    </div>
                    <span className="fips-chip font-mono">PER CLUSTER NODE</span>
                  </div>
                  <span className="field-hint font-mono">DDoS mitigation powered by eBPF kernel-level egress throttling.</span>
                </div>
              </div>
            </div>
          </section>

          {/* LOWER TELEMETRY METRIC / COMPLIANCE BAR */}
          <div className="settings-footer-bar font-mono">
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-2">
                <span className="pulse-dot-mint" />
                <strong className="text-xs text-on-surface tracking-wider uppercase">Active Security Posture</strong>
              </div>
              <span className="text-outline">•</span>
              <span className="text-xs text-outline">Enclave Integrity: 99.999%</span>
              <span className="text-outline">•</span>
              <span className="text-xs text-outline">Audit Sync: Latency 8ms</span>
            </div>

            <div className="flex items-center gap-2 text-xs text-outline">
              <span>Config Hash:</span>
              <code className="hash-code-chip font-mono">0x4ae8...39fc</code>
            </div>
          </div>
        </main>
      </div>

      {/* Modal 1: Audit Changes (2-Man Quorum) */}
      {auditModalOpen && (
        <div className="settings-modal-backdrop" onClick={() => setAuditModalOpen(false)}>
          <div className="settings-modal-box font-mono" onClick={(e) => e.stopPropagation()}>
            <div className="modal-top">
              <div className="flex items-center gap-2">
                <History size={18} className="text-blue" />
                <h3 className="modal-heading">Pending 2-Man Authorization Queue</h3>
              </div>
              <button className="modal-close-btn" onClick={() => setAuditModalOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <div className="modal-body-content">
              <p className="text-xs text-on-surface-variant">
                The following changes modify enterprise-wide zero-trust invariants and require dual-officer cryptographic sign-off:
              </p>

              <div className="pending-items-list">
                {/* Item 1 */}
                <div className="pending-item-card">
                  <div className="flex items-center justify-between">
                    <strong className="text-cyan text-xs">01 // KMS Root Key Rotation</strong>
                    <span className="fips-chip">SEC-SPEC-4409</span>
                  </div>
                  <p className="text-xs text-on-surface mt-1">
                    Requesting rotation of storage envelope master key to HSM Slot 4.
                  </p>
                  <div className="flex items-center justify-between text-outline text-xs mt-2 pt-1 border-t border-outline-variant/30">
                    <span>Requested by: Elena Rostova</span>
                    <span className="text-amber">Pending 2nd Signature: Col. Marcus Vance</span>
                  </div>
                </div>

                {/* Item 2 */}
                <div className="pending-item-card">
                  <div className="flex items-center justify-between">
                    <strong className="text-cyan text-xs">02 // Trust Baseline Adjustment</strong>
                    <span className="fips-chip">POL-AGENT-01</span>
                  </div>
                  <p className="text-xs text-on-surface mt-1">
                    Relaxing initial agent onboarding trust score envelope from 85 to 80.
                  </p>
                  <div className="flex items-center justify-between text-outline text-xs mt-2 pt-1 border-t border-outline-variant/30">
                    <span>Requested by: Marcus Vance</span>
                    <span className="text-mint">1 of 2 Verified</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-foot">
              <button className="btn-cancel font-mono" onClick={() => setAuditModalOpen(false)}>
                Close
              </button>
              <button className="btn-confirm font-mono" onClick={handleApprovePendingChanges}>
                <CheckCircle2 size={14} />
                <span>Approve &amp; Sign Quorum</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 2: Revoke Master Token */}
      {revokeModalOpen && (
        <div className="settings-modal-backdrop" onClick={() => setRevokeModalOpen(false)}>
          <div className="settings-modal-box modal-danger font-mono" onClick={(e) => e.stopPropagation()}>
            <div className="modal-top">
              <div className="flex items-center gap-2">
                <AlertTriangle size={18} className="text-red" />
                <h3 className="modal-heading text-red">Revoke Master Ingress API Token</h3>
              </div>
              <button className="modal-close-btn" onClick={() => setRevokeModalOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <div className="modal-body-content">
              <p className="text-xs text-on-surface-variant">
                Revoking this API token will immediately terminate all active automated ingress sessions and webhooks utilizing token <code className="text-red">{apiToken.slice(0, 14)}...</code>.
              </p>

              <div className="p-3 rounded bg-surface-high border border-outline-variant/40 text-xs text-outline">
                A new cryptographically secure admin token will be minted and stored in the local hardware vault.
              </div>
            </div>

            <div className="modal-foot">
              <button className="btn-cancel font-mono" onClick={() => setRevokeModalOpen(false)}>
                Cancel
              </button>
              <button className="btn-danger-confirm font-mono" onClick={handleConfirmRevokeToken}>
                <Trash2 size={14} />
                <span>Confirm Revocation</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
