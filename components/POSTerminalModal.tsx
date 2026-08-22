'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { useToast } from '@/components/Toast';
import {
  Payment24Filled,
  Dismiss24Filled,
  Add24Filled,
  CheckmarkCircle24Filled,
  Warning24Filled,
  Wifi124Filled,
  WifiOff24Filled,
  ArrowSync24Filled,
} from '@fluentui/react-icons';

interface POSTerminalModalProps {
  isOpen: boolean;
  onClose: () => void;
  amountCents: number;
  description?: string;
  onPaymentCollected?: (paymentIntentId: string) => void;
}

const READER_ICONS: Record<string, string> = {
  bbpos_wisepad3: '🔷',
  stripe_s700: '🟦',
  bbpos_chipper2x: '🔹',
  tap_to_pay: '📱',
};

export const POSTerminalModal: React.FC<POSTerminalModalProps> = ({
  isOpen,
  onClose,
  amountCents,
  description,
  onPaymentCollected,
}) => {
  const { t } = useTranslation();
  const { addToast } = useToast();

  const [readers, setReaders] = useState<any[]>([]);
  const [selectedReaderId, setSelectedReaderId] = useState<string | null>(null);
  const [isLoadingReaders, setIsLoadingReaders] = useState(false);
  const [isCollecting, setIsCollecting] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'collecting' | 'success' | 'error'>('idle');
  const [registrationCode, setRegistrationCode] = useState('');
  const [readerLabel, setReaderLabel] = useState('');
  const [showPairForm, setShowPairForm] = useState(false);
  const [isPairing, setIsPairing] = useState(false);
  const [isDemo, setIsDemo] = useState(false);

  const fetchReaders = async () => {
    setIsLoadingReaders(true);
    try {
      const res = await fetch('/api/stripe/terminal/readers');
      const data = await res.json();
      if (data.success) {
        setReaders(data.readers || []);
        setIsDemo(data.isDemo || false);
        if (data.readers?.length > 0 && !selectedReaderId) {
          setSelectedReaderId(data.readers[0].id);
        }
      }
    } catch (err) {
      console.error('Failed to load readers:', err);
    } finally {
      setIsLoadingReaders(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchReaders();
      setPaymentStatus('idle');
    }
  }, [isOpen]);

  const handleCollectPayment = async () => {
    if (!selectedReaderId) {
      addToast('Please select a terminal reader.', 'error');
      return;
    }
    setIsCollecting(true);
    setPaymentStatus('collecting');
    try {
      if (isDemo) {
        // Simulate in-person payment flow for demo mode
        await new Promise((r) => setTimeout(r, 2800));
        setPaymentStatus('success');
        addToast(t('terminalPaymentSuccess'), 'success');
        onPaymentCollected?.('pi_demo_' + Date.now());
        return;
      }
      const res = await fetch('/api/stripe/terminal/collect-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amountCents, readerId: selectedReaderId, description }),
      });
      const data = await res.json();
      if (data.success) {
        setPaymentStatus('success');
        addToast(t('terminalPaymentSuccess'), 'success');
        onPaymentCollected?.(data.paymentIntentId);
      } else {
        setPaymentStatus('error');
        addToast(data.error || 'Terminal payment failed.', 'error');
      }
    } catch (err) {
      setPaymentStatus('error');
      addToast('Terminal connection error.', 'error');
    } finally {
      setIsCollecting(false);
    }
  };

  const handlePairReader = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!registrationCode.trim()) return;
    setIsPairing(true);
    try {
      const res = await fetch('/api/stripe/terminal/readers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ registrationCode: registrationCode.trim(), label: readerLabel || 'POS Register' }),
      });
      const data = await res.json();
      if (data.success) {
        addToast(`Reader "${data.reader.label}" paired successfully!`, 'success');
        setShowPairForm(false);
        setRegistrationCode('');
        setReaderLabel('');
        fetchReaders();
      } else {
        addToast(data.error || 'Failed to pair reader.', 'error');
      }
    } catch {
      addToast('Pairing error. Check your registration code.', 'error');
    } finally {
      setIsPairing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[270] flex items-end sm:items-center justify-center p-0 sm:p-4">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={onClose} className="fixed inset-0 bg-black/60 backdrop-blur-xs" />

        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 40, scale: 0.98 }}
          transition={{ type: 'spring', damping: 28, stiffness: 380 }}
          className="relative w-full max-w-lg bg-[var(--bg-primary)] border border-[var(--border-subtle)] rounded-t-[32px] sm:rounded-3xl shadow-2xl z-10 flex flex-col max-h-[92vh] sm:max-h-[85vh] overflow-hidden"
        >
          {/* Mobile Drag Handle */}
          <div className="w-full pt-3 pb-1 flex sm:hidden justify-center flex-shrink-0">
            <div className="w-12 h-1.5 rounded-full bg-black/20 dark:bg-white/20" />
          </div>

          {/* Header */}
          <div className="px-6 py-4 flex items-center justify-between flex-shrink-0 border-b border-[var(--border-subtle)]">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-blue-500/10 flex items-center justify-center">
                <Payment24Filled className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-[var(--text-primary)]">{t('terminalTitle')}</h3>
                <p className="text-xs text-[var(--text-secondary)]">
                  {t('terminalDesc')} · <span className="font-bold text-emerald-600">${(amountCents / 100).toFixed(2)}</span>
                </p>
              </div>
            </div>
            <button type="button" onClick={onClose} className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-[var(--text-secondary)] transition-colors cursor-pointer">
              <Dismiss24Filled className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 overflow-y-auto flex-1 space-y-5">
            {/* Demo Mode Notice */}
            {isDemo && (
              <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 flex items-start gap-2.5">
                <Warning24Filled className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-amber-700 dark:text-amber-400 font-semibold">
                  Demo Mode — Simulated readers shown. Complete Stripe Connect onboarding and pair a physical reader to accept live in-person payments.
                </p>
              </div>
            )}

            {/* Payment Status Feedback */}
            {paymentStatus === 'collecting' && (
              <div className="p-5 rounded-3xl bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 flex flex-col items-center gap-3 text-center">
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}>
                  <ArrowSync24Filled className="w-8 h-8 text-blue-600" />
                </motion.div>
                <div>
                  <p className="text-sm font-extrabold text-blue-700 dark:text-blue-400">{t('terminalCollecting')}</p>
                  <p className="text-xs text-blue-600/70 dark:text-blue-400/70">Ask your client to tap, insert, or swipe their card on the reader.</p>
                </div>
              </div>
            )}

            {paymentStatus === 'success' && (
              <div className="p-5 rounded-3xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 flex flex-col items-center gap-3 text-center">
                <CheckmarkCircle24Filled className="w-8 h-8 text-emerald-600" />
                <div>
                  <p className="text-sm font-extrabold text-emerald-700 dark:text-emerald-400">{t('terminalPaymentSuccess')}</p>
                  <p className="text-xs text-emerald-600/70">${(amountCents / 100).toFixed(2)} collected in-person.</p>
                </div>
              </div>
            )}

            {paymentStatus === 'idle' && (
              <>
                {/* Reader Selection */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold uppercase tracking-wider text-[var(--text-muted)]">{t('terminalSelectReader')}</span>
                    <div className="flex items-center gap-2">
                      <button type="button" onClick={fetchReaders} className="p-1.5 rounded-lg hover:bg-black/5 transition-colors cursor-pointer">
                        <ArrowSync24Filled className={`w-3.5 h-3.5 text-[var(--text-muted)] ${isLoadingReaders ? 'animate-spin' : ''}`} />
                      </button>
                      <button type="button" onClick={() => setShowPairForm(!showPairForm)}
                        className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-extrabold cursor-pointer">
                        <Add24Filled className="w-3 h-3" />
                        <span>{t('terminalPairNew')}</span>
                      </button>
                    </div>
                  </div>

                  {isLoadingReaders ? (
                    <div className="py-6 text-center text-xs text-[var(--text-muted)]">Scanning for readers…</div>
                  ) : readers.length === 0 ? (
                    <div className="py-6 text-center text-xs text-[var(--text-muted)] border border-dashed border-[var(--border-subtle)] rounded-2xl">
                      No readers paired yet. Click "Pair New Reader" to add one.
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {readers.map((reader) => (
                        <button key={reader.id} type="button" onClick={() => setSelectedReaderId(reader.id)}
                          className={`w-full p-3.5 rounded-2xl border text-left flex items-center gap-3 transition-all cursor-pointer ${
                            selectedReaderId === reader.id
                              ? 'border-blue-500 bg-blue-500/5 ring-1 ring-blue-500/20'
                              : 'border-[var(--border-subtle)] hover:border-black/20'
                          }`}>
                          <span className="text-xl">{READER_ICONS[reader.device_type] || '🔷'}</span>
                          <div className="flex-1">
                            <p className="text-xs font-extrabold text-[var(--text-primary)]">{reader.label}</p>
                            <p className="text-[10px] text-[var(--text-muted)] capitalize">{reader.device_type?.replace(/_/g, ' ')}</p>
                          </div>
                          <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-black uppercase ${
                            reader.status === 'online' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500 dark:bg-white/10 dark:text-slate-400'
                          }`}>
                            {reader.status === 'online' ? <Wifi124Filled className="w-2.5 h-2.5" /> : <WifiOff24Filled className="w-2.5 h-2.5" />}
                            <span>{reader.status}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Pair New Reader Form */}
                <AnimatePresence>
                  {showPairForm && (
                    <motion.form initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                      onSubmit={handlePairReader}
                      className="space-y-3 p-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-[var(--border-subtle)] overflow-hidden">
                      <p className="text-xs font-extrabold text-[var(--text-primary)]">{t('terminalPairNew')}</p>
                      <input type="text" value={readerLabel} onChange={(e) => setReaderLabel(e.target.value)}
                        placeholder="e.g. Register 1 — Front Desk"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-xs font-semibold text-[var(--text-primary)]" />
                      <input type="text" required value={registrationCode} onChange={(e) => setRegistrationCode(e.target.value)}
                        placeholder="Registration Code (on device screen)"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-xs font-mono font-bold text-[var(--text-primary)] uppercase" />
                      <button type="submit" disabled={isPairing}
                        className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs transition-colors cursor-pointer">
                        {isPairing ? 'Pairing…' : 'Pair This Reader'}
                      </button>
                    </motion.form>
                  )}
                </AnimatePresence>
              </>
            )}
          </div>

          {/* Bottom Action Bar */}
          {paymentStatus === 'idle' && (
            <div className="w-full p-4 bg-[var(--bg-primary)] border-t border-[var(--border-subtle)] flex items-center gap-3 flex-shrink-0">
              <button type="button" onClick={onClose}
                className="flex-1 py-3 rounded-2xl border border-[var(--border-subtle)] text-xs font-extrabold text-[var(--text-secondary)] hover:bg-black/5">
                {t('cancel')}
              </button>
              <button type="button" onClick={handleCollectPayment}
                disabled={!selectedReaderId || isCollecting}
                className="flex-1 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-extrabold text-xs shadow-md flex items-center justify-center gap-2 cursor-pointer">
                <Payment24Filled className="w-4 h-4" />
                <span>{t('terminalCollectPayment')} · ${(amountCents / 100).toFixed(2)}</span>
              </button>
            </div>
          )}
          {paymentStatus === 'success' && (
            <div className="w-full p-4 bg-[var(--bg-primary)] border-t border-[var(--border-subtle)] flex-shrink-0">
              <button type="button" onClick={onClose}
                className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-md">
                Done — Close
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default POSTerminalModal;
