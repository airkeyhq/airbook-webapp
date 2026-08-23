'use client';

import React, { useState, useEffect } from 'react';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { useToast } from '@/components/Toast';
import {
  Globe24Filled,
  Checkmark24Filled,
  ArrowSync24Filled,
  LockClosed24Regular,
  Warning24Filled,
  Info24Regular,
  Copy24Filled,
  Delete24Filled,
  CheckmarkCircle24Filled,
} from '@fluentui/react-icons';

export const CustomDomainStudio: React.FC = () => {
  const { t } = useTranslation();
  const { addToast } = useToast();

  const [domainInput, setDomainInput] = useState('');
  const [savedDomain, setSavedDomain] = useState<string | null>(null);
  const [domainVerified, setDomainVerified] = useState(false);
  const [sslStatus, setSslStatus] = useState('pending');
  const [cnameTarget, setCnameTarget] = useState('cname.getairbook.com');
  const [aRecord, setARecord] = useState('76.76.21.21');
  const [isSaving, setIsSaving] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [verifyResult, setVerifyResult] = useState<{ verified: boolean; message: string } | null>(null);

  const fetchConfig = async () => {
    try {
      const res = await fetch('/api/domain/configure');
      const data = await res.json();
      if (data.success) {
        setSavedDomain(data.customDomain || null);
        setDomainInput(data.customDomain || '');
        setDomainVerified(data.domainVerified || false);
        setSslStatus(data.sslStatus || 'pending');
        if (data.cnameTarget) setCnameTarget(data.cnameTarget);
        if (data.aRecordTarget) setARecord(data.aRecordTarget);
      }
    } catch {
      // Fallback silently
    }
  };

  useEffect(() => {
    fetchConfig();
  }, []);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    addToast(t('copiedToClipboard'), 'success');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSave = async () => {
    if (!domainInput.trim()) return;
    setIsSaving(true);
    try {
      const res = await fetch('/api/domain/configure', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customDomain: domainInput.trim() }),
      });
      const data = await res.json();
      if (data.success) {
        setSavedDomain(data.customDomain || null);
        setDomainVerified(false);
        setSslStatus('pending');
        setVerifyResult(null);
        addToast(t('customDomainSaved'), 'success');
        fetchConfig();
      } else {
        addToast(data.error || 'Failed to save domain.', 'error');
      }
    } catch {
      addToast('Failed to save domain.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleRemove = async () => {
    setIsRemoving(true);
    try {
      const res = await fetch('/api/domain/configure', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customDomain: '' }),
      });
      const data = await res.json();
      if (data.success) {
        setSavedDomain(null);
        setDomainInput('');
        setDomainVerified(false);
        setSslStatus('pending');
        setVerifyResult(null);
        addToast(t('domainRemoved'), 'success');
        fetchConfig();
      } else {
        addToast(data.error || 'Failed to remove domain.', 'error');
      }
    } catch {
      addToast('Failed to remove domain.', 'error');
    } finally {
      setIsRemoving(false);
    }
  };

  const handleVerify = async () => {
    setIsVerifying(true);
    setVerifyResult(null);
    try {
      const res = await fetch('/api/domain/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });
      const data = await res.json();
      setVerifyResult(data);
      if (data.verified) {
        setDomainVerified(true);
        setSslStatus('provisioning');
        addToast(t('domainVerified'), 'success');
      } else {
        addToast(data.message || t('domainNotVerified'), 'error');
      }
    } catch {
      addToast(t('domainNotVerified'), 'error');
    } finally {
      setIsVerifying(false);
    }
  };

  const getSslLabel = () => {
    switch (sslStatus) {
      case 'active':
        return { label: t('sslStatusActive'), color: 'text-emerald-600 bg-emerald-500/10 border-emerald-500/20' };
      case 'provisioning':
        return { label: t('sslStatusProvisioning'), color: 'text-blue-600 bg-blue-500/10 border-blue-500/20' };
      case 'failed':
        return { label: t('sslStatusError'), color: 'text-red-600 bg-red-500/10 border-red-500/20' };
      default:
        return { label: t('sslStatusPending'), color: 'text-amber-600 bg-amber-500/10 border-amber-500/20' };
    }
  };

  const sslBadge = getSslLabel();

  return (
    <div className="space-y-5">
      {/* ─── Top Configuration Overview Card ─── */}
      <div className="p-6 rounded-3xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] space-y-4 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-extrabold text-[var(--text-primary)] flex items-center gap-2">
              <Globe24Filled className="w-5 h-5 text-blue-500" />
              <span>{t('customDomainTitle')}</span>
            </h3>
            <p className="text-xs text-[var(--text-secondary)] mt-0.5 max-w-xl">
              {t('customDomainDesc')}
            </p>
          </div>

          {savedDomain && (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleRemove}
                disabled={isRemoving}
                className="px-3.5 py-2 rounded-2xl bg-red-500/10 hover:bg-red-500/20 text-red-600 text-xs font-extrabold flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
              >
                <Delete24Filled className="w-3.5 h-3.5" />
                <span>{t('removeDomain')}</span>
              </button>
            </div>
          )}
        </div>

        {/* Status Strip if domain is set */}
        {savedDomain && (
          <div className="pt-3 border-t border-[var(--border-subtle)] flex flex-wrap items-center gap-2.5">
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold ${
              domainVerified
                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-700 dark:text-emerald-300'
                : 'bg-amber-500/10 border-amber-500/20 text-amber-700 dark:text-amber-300'
            }`}>
              {domainVerified ? (
                <CheckmarkCircle24Filled className="w-4 h-4 text-emerald-600" />
              ) : (
                <Warning24Filled className="w-4 h-4 text-amber-600" />
              )}
              <span>
                {domainVerified
                  ? t('domainLiveVerified').replace('{domain}', savedDomain)
                  : t('domainDnsPending').replace('{domain}', savedDomain)}
              </span>
            </div>

            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold ${sslBadge.color}`}>
              <LockClosed24Regular className="w-3.5 h-3.5" />
              <span>{sslBadge.label}</span>
            </div>
          </div>
        )}

        {/* Domain Input Field */}
        <div className="pt-2">
          <label className="block text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)] mb-2">
            {t('tabDomain')}
          </label>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
            <input
              type="text"
              value={domainInput}
              onChange={(e) => setDomainInput(e.target.value)}
              placeholder="booking.yourbrand.com"
              className="flex-1 px-4 py-3 rounded-2xl bg-black/5 dark:bg-white/5 border border-[var(--border-subtle)] text-xs font-mono font-bold text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            />
            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving || !domainInput.trim() || domainInput.trim() === savedDomain}
              className="px-5 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white text-xs font-extrabold flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer flex-shrink-0"
            >
              <CheckmarkCircle24Filled className="w-4 h-4" />
              <span>{isSaving ? '...' : t('saveDomain')}</span>
            </button>
          </div>
        </div>
      </div>

      {/* ─── DNS Configuration Instructions & Live Verification ─── */}
      {savedDomain && !domainVerified && (
        <div className="p-6 rounded-3xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] space-y-4 shadow-xs">
          <div className="flex items-center gap-2">
            <Info24Regular className="w-5 h-5 text-blue-500" />
            <div>
              <h4 className="text-sm font-extrabold text-[var(--text-primary)]">{t('dnsInstructions')}</h4>
              <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                {t('dnsInstructionsSubtitle')}
              </p>
            </div>
          </div>

          <div className="space-y-3 pt-1">
            {/* Option A: CNAME */}
            <div className="p-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-[var(--border-subtle)] space-y-2">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-[var(--text-secondary)]">
                {t('cnameOptionTitle')}
              </span>
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 font-mono text-xs flex items-center justify-between gap-2 overflow-x-auto">
                <div className="text-slate-300">
                  <span className="text-blue-400 font-bold">{savedDomain}</span>
                  <span className="text-slate-500"> CNAME </span>
                  <span className="text-emerald-400 font-bold">{cnameTarget}</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopy(`${savedDomain} CNAME ${cnameTarget}`, 'cname')}
                  className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-slate-200 text-[11px] font-mono flex items-center gap-1.5 transition-colors cursor-pointer flex-shrink-0"
                >
                  {copiedId === 'cname' ? (
                    <Checkmark24Filled className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy24Filled className="w-3.5 h-3.5" />
                  )}
                  <span>{copiedId === 'cname' ? '✓' : 'Copy'}</span>
                </button>
              </div>
            </div>

            {/* Option B: A Record */}
            <div className="p-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-[var(--border-subtle)] space-y-2">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-[var(--text-secondary)]">
                {t('aRecordOptionTitle')}
              </span>
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 font-mono text-xs flex items-center justify-between gap-2 overflow-x-auto">
                <div className="text-slate-300">
                  <span className="text-blue-400 font-bold">@</span>
                  <span className="text-slate-500"> A </span>
                  <span className="text-emerald-400 font-bold">{aRecord}</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopy(`@ A ${aRecord}`, 'arecord')}
                  className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-slate-200 text-[11px] font-mono flex items-center gap-1.5 transition-colors cursor-pointer flex-shrink-0"
                >
                  {copiedId === 'arecord' ? (
                    <Checkmark24Filled className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy24Filled className="w-3.5 h-3.5" />
                  )}
                  <span>{copiedId === 'arecord' ? '✓' : 'Copy'}</span>
                </button>
              </div>
            </div>
          </div>

          <p className="text-[11px] text-[var(--text-muted)] leading-relaxed">
            {t('dnsTtlNotice')}
          </p>

          {/* Trigger Live DNS Check */}
          <div className="pt-2">
            <button
              type="button"
              onClick={handleVerify}
              disabled={isVerifying}
              className="w-full py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-extrabold text-xs shadow-md flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <ArrowSync24Filled className={`w-4 h-4 ${isVerifying ? 'animate-spin' : ''}`} />
              <span>{isVerifying ? t('verifyingDomain') : t('verifyDomain')}</span>
            </button>
          </div>

          {/* Verification Result Callout */}
          {verifyResult && (
            <div className={`p-4 rounded-2xl text-xs font-semibold border flex items-start gap-2.5 ${
              verifyResult.verified
                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-700 dark:text-emerald-300'
                : 'bg-amber-500/10 border-amber-500/20 text-amber-700 dark:text-amber-300'
            }`}>
              {verifyResult.verified ? (
                <CheckmarkCircle24Filled className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
              ) : (
                <Warning24Filled className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
              )}
              <p className="flex-1">{verifyResult.message}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CustomDomainStudio;
