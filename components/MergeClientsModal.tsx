'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { useToast } from '@/components/Toast';
import { getAvatarUrl } from '@/lib/avatars';
import {
  Dismiss24Filled,
  Sparkle24Regular,
  CheckmarkCircle24Filled,
  Mail24Regular,
  Phone24Regular,
  Person24Regular,
} from '@fluentui/react-icons';
import type { ClientItemLike } from '@/lib/client-duplicates';

export interface MergeClientsModalProps<T extends ClientItemLike = ClientItemLike> {
  open: boolean;
  onClose: () => void;
  clientsToMerge: T[];
  currency?: string;
  onSuccess?: (mergedTargetId: string) => void;
  isDemoMode?: boolean;
  onLocalMerge?: (targetId: string, sourceIds: string[]) => void;
}

export const MergeClientsModal = <T extends ClientItemLike>({
  open,
  onClose,
  clientsToMerge,
  onSuccess,
  isDemoMode = false,
  onLocalMerge,
}: MergeClientsModalProps<T>) => {
  const { t } = useTranslation();
  const { addToast } = useToast();
  const [mounted, setMounted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Determine smart default primary profile
  const defaultPrimaryId = useMemo(() => {
    if (!clientsToMerge || clientsToMerge.length === 0) return '';
    const sorted = [...clientsToMerge].sort((a, b) => {
      if ((b.totalVisits || 0) !== (a.totalVisits || 0)) {
        return (b.totalVisits || 0) - (a.totalVisits || 0);
      }
      if ((b.totalSpentCents || 0) !== (a.totalSpentCents || 0)) {
        return (b.totalSpentCents || 0) - (a.totalSpentCents || 0);
      }
      const bContact = (b.email ? 1 : 0) + (b.phone ? 1 : 0);
      const aContact = (a.email ? 1 : 0) + (a.phone ? 1 : 0);
      if (bContact !== aContact) {
        return bContact - aContact;
      }
      return b.name.length - a.name.length;
    });
    return sorted[0]?.id || clientsToMerge[0]?.id || '';
  }, [clientsToMerge]);

  const [primaryId, setPrimaryId] = useState<string>(defaultPrimaryId);

  useEffect(() => {
    if (defaultPrimaryId) {
      setPrimaryId(defaultPrimaryId);
    }
  }, [defaultPrimaryId]);

  const primaryClient = useMemo(() => {
    return clientsToMerge.find((c) => c.id === (primaryId || defaultPrimaryId)) || clientsToMerge[0];
  }, [clientsToMerge, primaryId, defaultPrimaryId]);

  const sourceClientIds = useMemo(() => {
    if (!primaryClient) return [];
    return clientsToMerge.filter((c) => c.id !== primaryClient.id).map((c) => c.id);
  }, [clientsToMerge, primaryClient]);

  // Aggregate metrics
  const totalVisitsCombined = useMemo(() => {
    return clientsToMerge.reduce((sum, c) => sum + (c.totalVisits || 0), 0);
  }, [clientsToMerge]);

  const totalSpentCentsCombined = useMemo(() => {
    return clientsToMerge.reduce((sum, c) => sum + (c.totalSpentCents || 0), 0);
  }, [clientsToMerge]);

  const handleMerge = async () => {
    if (!primaryClient || sourceClientIds.length === 0) return;
    setError(null);
    setSubmitting(true);

    try {
      if (isDemoMode) {
        // Local in-memory merge for demo environments
        if (onLocalMerge) {
          onLocalMerge(primaryClient.id, sourceClientIds);
        }
        addToast(t('mergeSuccess'), 'success');
        onSuccess?.(primaryClient.id);
        onClose();
        return;
      }

      // Persist to database via API
      const res = await fetch('/api/clients/merge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetClientId: primaryClient.id,
          sourceClientIds,
        }),
      });

      const data = await res.json();
      if (data.success) {
        addToast(t('mergeSuccess'), 'success');
        onSuccess?.(primaryClient.id);
        onClose();
      } else {
        setError(data.error || t('mergeError'));
        addToast(data.error || t('mergeError'), 'error');
      }
    } catch (err: any) {
      console.error('Error merging client records:', err);
      setError(t('mergeError'));
      addToast(t('mergeError'), 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (!mounted || !open || clientsToMerge.length < 2) return null;

  return createPortal(
    <AnimatePresence>
      <div className="fixed inset-0 z-[250] flex items-end md:items-center justify-center">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        />

        {/* Modal / Drawer Dialog */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          transition={{ duration: 0.15, ease: 'easeOut' }}
          className="relative z-10 w-full md:max-w-2xl bg-[var(--bg-primary)] border-t md:border border-[var(--border-subtle)] rounded-t-[32px] md:rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] md:max-h-[85vh]"
        >
          {/* Mobile Top Drag Pull Bar */}
          <div className="w-12 h-1.5 rounded-full bg-black/20 dark:bg-white/20 mx-auto md:hidden my-2.5 flex-shrink-0" />

          {/* Dialog Header */}
          <div className="p-5 md:p-6 border-b border-[var(--border-subtle)] flex items-start justify-between gap-4 flex-shrink-0">
            <div>
              <h3 className="text-base sm:text-lg font-extrabold text-[var(--text-primary)] tracking-tight">
                {t('mergeClients')}
              </h3>
              <p className="text-xs text-[var(--text-secondary)] mt-0.5 leading-relaxed">
                {t('mergeClientsDesc')}
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="p-1.5 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors cursor-pointer flex-shrink-0"
              aria-label="Close"
            >
              <Dismiss24Filled className="w-5 h-5" />
            </button>
          </div>

          {/* Dialog Body */}
          <div className="p-5 md:p-6 overflow-y-auto space-y-4">
            {/* Explanatory Notice */}
            <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-[var(--color-accent-primary)]/10 border border-[var(--color-accent-primary)]/20 text-xs">
              <Sparkle24Regular className="w-4 h-4 text-[#2BB5FF] shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <p className="font-bold text-[var(--text-primary)]">
                  {t('selectPrimary')}
                </p>
                <p className="text-[var(--text-secondary)] leading-relaxed">
                  {t('selectPrimaryDesc')}
                </p>
              </div>
            </div>

            {/* Profile Selection Grid */}
            <div className="space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)] block">
                {t('profilesToMerge')} ({clientsToMerge.length})
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {clientsToMerge.map((c) => {
                  const isSelected = c.id === (primaryId || defaultPrimaryId);
                  const avatarSrc = c.avatarUrl || getAvatarUrl(c.name);

                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setPrimaryId(c.id)}
                      className={`relative flex flex-col justify-between text-left p-3.5 rounded-2xl border transition-all cursor-pointer group ${
                        isSelected
                          ? 'border-[#2BB5FF] ring-2 ring-[#2BB5FF]/30 bg-[#2BB5FF]/5 shadow-xs'
                          : 'border-[var(--border-subtle)] bg-[var(--bg-secondary)] hover:border-black/20 dark:hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-2 w-full">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <img
                            src={avatarSrc}
                            alt={c.name}
                            className="w-8 h-8 rounded-full object-cover border border-[var(--border-subtle)] shrink-0"
                          />
                          <div className="min-w-0">
                            <p className="font-bold text-xs sm:text-sm text-[var(--text-primary)] truncate">
                              {c.name}
                            </p>
                            <p className="text-[11px] text-[var(--text-secondary)] truncate">
                              {c.email || c.phone || '—'}
                            </p>
                          </div>
                        </div>

                        <span
                          className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold shrink-0 whitespace-nowrap ${
                            isSelected
                              ? 'bg-[#2BB5FF] text-white shadow-xs'
                              : 'bg-black/5 dark:bg-white/5 text-[var(--text-muted)]'
                          }`}
                        >
                          {isSelected ? t('primaryBadge') : t('secondaryBadge')}
                        </span>
                      </div>

                      <div className="flex items-center justify-between border-t border-[var(--border-subtle)] pt-2 mt-1 text-[11px] text-[var(--text-secondary)] w-full">
                        <span>
                          {c.totalVisits || 0} {t('visits').toLowerCase()}
                        </span>
                        <span className="font-bold text-[var(--text-primary)] font-mono">
                          ${((c.totalSpentCents || 0) / 100).toFixed(0)}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Combined Result Summary Box */}
            {primaryClient && (
              <div className="rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] p-4 space-y-2 text-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <span className="font-bold text-[var(--text-primary)] flex items-center gap-1.5">
                    <CheckmarkCircle24Filled className="w-4 h-4 text-emerald-500 shrink-0" />
                    {t('mergedResult')}
                  </span>
                  <span className="text-[var(--text-secondary)]">
                    {t('totalVisitsCombined')}:{' '}
                    <strong className="text-[var(--text-primary)] font-mono">{totalVisitsCombined}</strong> |{' '}
                    {t('totalSpentCombined')}:{' '}
                    <strong className="text-[var(--text-primary)] font-mono">
                      ${(totalSpentCentsCombined / 100).toFixed(0)}
                    </strong>
                  </span>
                </div>
                <p className="text-[var(--text-secondary)] leading-relaxed">
                  <strong className="text-[var(--text-primary)]">{primaryClient.name}</strong> {t('mergeRetainNotice')}
                </p>
              </div>
            )}

            {error && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-xs font-semibold text-red-600 dark:text-red-400">
                {error}
              </div>
            )}
          </div>

          {/* Dialog Footer Actions */}
          <div className="p-4 sm:p-5 border-t border-[var(--border-subtle)] bg-[var(--bg-primary)] flex items-center justify-end gap-3 flex-shrink-0">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="btn-secondary text-xs h-10 px-4"
            >
              {t('cancel')}
            </button>
            <button
              type="button"
              onClick={handleMerge}
              disabled={submitting || !primaryClient || sourceClientIds.length === 0}
              className="btn-primary text-xs h-10 px-5 flex items-center gap-1.5"
            >
              {submitting ? (
                <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : null}
              <span>{t('mergeAction')}</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>,
    document.body
  );
};
