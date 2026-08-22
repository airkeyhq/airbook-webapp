'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { useToast } from '@/components/Toast';
import {
  Globe24Filled,
  Globe24Regular,
  Checkmark24Filled,
  ArrowSync24Filled,
  LockClosed24Regular,
  Warning24Filled,
  Dismiss24Filled,
  Info24Regular,
  Copy24Filled,
} from '@fluentui/react-icons';

const SSL_STATUS_LABELS: Record<string, { label: string; color: string }> = {
  pending: { label: 'Pending DNS', color: 'text-amber-600 bg-amber-50 border-amber-200 dark:bg-amber-500/10 dark:border-amber-500/20' },
  provisioning: { label: 'SSL Provisioning', color: 'text-blue-600 bg-blue-50 border-blue-200 dark:bg-blue-500/10 dark:border-blue-500/20' },
  active: { label: 'SSL Active', color: 'text-emerald-600 bg-emerald-50 border-emerald-200 dark:bg-emerald-500/10 dark:border-emerald-500/20' },
  failed: { label: 'SSL Error', color: 'text-red-600 bg-red-50 border-red-200 dark:bg-red-500/10 dark:border-red-500/20' },
};

export const CustomDomainStudio: React.FC = () => {
  const { t } = useTranslation();
  const { addToast } = useToast();

  const [domainInput, setDomainInput] = useState('');
  const [savedDomain, setSavedDomain] = useState<string | null>(null);
  const [domainVerified, setDomainVerified] = useState(false);
  const [sslStatus, setSslStatus] = useState('pending');
  const [cnameTarget, setCnameTarget] = useState('cname.airbook.app');
  const [aRecord, setARecord] = useState('76.76.21.21');
  const [instructions, setInstructions] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [verifyResult, setVerifyResult] = useState<any>(null);

  const fetchConfig = async () => {
    try {
      const res = await fetch('/api/domain/configure');
      const data = await res.json();
      if (data.success) {
        setSavedDomain(data.customDomain || null);
        setDomainInput(data.customDomain || '');
        setDomainVerified(data.domainVerified);
        setSslStatus(data.sslStatus || 'pending');
        setCnameTarget(data.cnameTarget);
        setARecord(data.aRecordTarget);
        setInstructions(data.instructions);
      }
    } catch {}
  };

  useEffect(() => { fetchConfig(); }, []);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSave = async () => {
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
        addToast(data.message || 'DNS not propagated yet.', 'error');
      }
    } catch {
      addToast('Verification request failed.', 'error');
    } finally {
      setIsVerifying(false);
    }
  };

  const sslBadge = SSL_STATUS_LABELS[sslStatus] || SSL_STATUS_LABELS.pending;

  return (
    <div className="space-y-5">
      {/* Current Status Banner */}
      {savedDomain && (
        <div className={`p-4 rounded-2xl border flex items-start gap-3 ${
          domainVerified ? 'bg-emerald-50 border-emerald-200 dark:bg-emerald-500/10 dark:border-emerald-500/20' : 'bg-amber-50 border-amber-200 dark:bg-amber-500/10 dark:border-amber-500/20'
        }`}>
          {domainVerified ? (
            <Checkmark24Filled className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
          ) : (
            <Warning24Filled className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
          )}
          <div className="flex-1">
            <p className={`text-xs font-extrabold ${domainVerified ? 'text-emerald-700 dark:text-emerald-400' : 'text-amber-700 dark:text-amber-400'}`}>
              {domainVerified ? `✓ ${savedDomain} is live and verified` : `DNS pending for ${savedDomain}`}
            </p>
            <div className="flex items-center gap-2 mt-1.5">
              <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase border flex items-center gap-1 ${sslBadge.color}`}>
                <LockClosed24Regular className="w-2.5 h-2.5" />
                {sslBadge.label}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Domain Input */}
      <div className="p-5 rounded-3xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] space-y-4">
        <div className="flex items-center gap-2">
          <Globe24Filled className="w-4 h-4 text-blue-600" />
          <h4 className="text-sm font-extrabold text-[var(--text-primary)]">{t('customDomainTitle')}</h4>
        </div>
        <p className="text-xs text-[var(--text-secondary)]">{t('customDomainDesc')}</p>

        <div className="flex items-center gap-2">
          <input
            type="text"
            value={domainInput}
            onChange={(e) => setDomainInput(e.target.value)}
            placeholder="booking.yourbrand.com"
            className="flex-1 px-4 py-2.5 rounded-xl bg-black/5 dark:bg-white/5 border border-[var(--border-subtle)] text-xs font-mono font-bold text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          />
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving || !domainInput.trim()}
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-extrabold transition-colors cursor-pointer flex-shrink-0"
          >
            {isSaving ? 'Saving…' : t('saveDomain')}
          </button>
        </div>
      </div>

      {/* DNS Instructions */}
      {savedDomain && !domainVerified && (
        <div className="p-5 rounded-3xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] space-y-4">
          <div className="flex items-center gap-2">
            <Info24Regular className="w-4 h-4 text-blue-500" />
            <h4 className="text-sm font-extrabold text-[var(--text-primary)]">{t('dnsInstructions')}</h4>
          </div>
          <p className="text-xs text-[var(--text-secondary)]">
            Add ONE of the following DNS records at your domain registrar (Namecheap, GoDaddy, Cloudflare, etc.):
          </p>

          {/* CNAME Option */}
          <div className="space-y-2">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-[var(--text-muted)]">Option A — CNAME Record (Subdomain)</span>
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-700 font-mono text-xs flex items-center justify-between gap-2">
              <div className="text-slate-300">
                <span className="text-blue-400">{savedDomain}</span>
                <span className="text-slate-500"> CNAME </span>
                <span className="text-emerald-400">{cnameTarget}</span>
              </div>
              <button type="button" onClick={() => handleCopy(`${savedDomain} CNAME ${cnameTarget}`, 'cname')}
                className="text-slate-500 hover:text-white transition-colors cursor-pointer flex-shrink-0">
                {copiedId === 'cname' ? <Checkmark24Filled className="w-3.5 h-3.5 text-emerald-400" /> : <Copy24Filled className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {/* A Record Option */}
          <div className="space-y-2">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-[var(--text-muted)]">Option B — A Record (Apex/Root Domain)</span>
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-700 font-mono text-xs flex items-center justify-between gap-2">
              <div className="text-slate-300">
                <span className="text-blue-400">@</span>
                <span className="text-slate-500"> A </span>
                <span className="text-emerald-400">{aRecord}</span>
              </div>
              <button type="button" onClick={() => handleCopy(`@ A ${aRecord}`, 'arecord')}
                className="text-slate-500 hover:text-white transition-colors cursor-pointer flex-shrink-0">
                {copiedId === 'arecord' ? <Checkmark24Filled className="w-3.5 h-3.5 text-emerald-400" /> : <Copy24Filled className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          <p className="text-[10px] text-[var(--text-muted)]">
            TTL: 3600 (1 hour) · DNS propagation may take up to 24–48 hours.
          </p>

          {/* Verify Button */}
          <button
            type="button"
            onClick={handleVerify}
            disabled={isVerifying}
            className="w-full py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-extrabold text-xs shadow-md flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <ArrowSync24Filled className={`w-4 h-4 ${isVerifying ? 'animate-spin' : ''}`} />
            <span>{isVerifying ? t('verifyingDomain') : t('verifyDomain')}</span>
          </button>

          {/* Verify Result */}
          {verifyResult && (
            <div className={`p-3.5 rounded-xl text-xs font-semibold border ${
              verifyResult.verified
                ? 'bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-500/10 dark:border-emerald-500/20 dark:text-emerald-400'
                : 'bg-amber-50 border-amber-200 text-amber-700 dark:bg-amber-500/10 dark:border-amber-500/20 dark:text-amber-400'
            }`}>
              {verifyResult.message}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CustomDomainStudio;
