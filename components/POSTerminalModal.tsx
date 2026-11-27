'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { useToast } from '@/components/Toast';
import { FloatingInput } from '@/components/FloatingInput';
import { Icon } from '@/components/primitives/Icon';
import { Dialog } from '@/components/primitives/Dialog';
import { Alert } from '@/components/primitives/Alert';
import { Badge } from '@/components/primitives/Badge';
import { Card } from '@/components/primitives/Card';
import { EmptyState } from '@/components/EmptyState';
import {
  Payment24Filled,
  Payment24Regular,
  Phone24Regular,
  Add24Filled,
  ArrowSync24Filled,
  ArrowSync24Regular,
  Wifi124Regular,
  WifiOff24Regular,
} from '@fluentui/react-icons';

interface POSTerminalModalProps {
  isOpen: boolean;
  onClose: () => void;
  amountCents: number;
  description?: string;
  onPaymentCollected?: (paymentIntentId: string) => void;
}

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
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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
        body: JSON.stringify({
          registrationCode: registrationCode.trim(),
          label: readerLabel.trim() || 'Countertop Reader',
        }),
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

  if (!mounted) return null;

  const dialogFooter =
    paymentStatus === 'idle' ? (
      <div className="w-full flex items-center gap-3">
        <button type="button" onClick={onClose} className="btn-secondary flex-1">
          {t('cancel')}
        </button>
        <button
          type="button"
          onClick={handleCollectPayment}
          disabled={!selectedReaderId || isCollecting}
          className="btn-primary flex-1 disabled:opacity-50"
        >
          <Icon filled={Payment24Filled} size="sm" />
          <span>
            {t('terminalCollectPayment')} · ${(amountCents / 100).toFixed(2)}
          </span>
        </button>
      </div>
    ) : paymentStatus === 'success' ? (
      <button type="button" onClick={onClose} className="btn-primary w-full">
        Done — Close
      </button>
    ) : undefined;

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      size="lg"
      title={t('terminalTitle')}
      description={t('terminalDesc')}
      headerIcon={
        <div className="w-9 h-9 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] flex items-center justify-center">
          <Icon regular={Payment24Regular} size="md" tone="secondary" />
        </div>
      }
      footer={dialogFooter}
    >
      <div className="space-y-5">
        {/* Demo Mode Notice */}
        {isDemo && (
          <Alert variant="warning">
            Demo Mode — Simulated readers shown. Complete Stripe Connect onboarding and pair a physical reader to accept live in-person payments.
          </Alert>
        )}

        {/* Payment Status Feedback */}
        {paymentStatus === 'collecting' && (
          <Alert variant="info" title={t('terminalCollecting')}>
            <div className="flex items-center gap-2.5 pt-1">
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}>
                <Icon regular={ArrowSync24Regular} className="w-5 h-5 text-blue-600" />
              </motion.div>
              <span>Ask your client to tap, insert, or swipe their card on the reader.</span>
            </div>
          </Alert>
        )}

        {paymentStatus === 'success' && (
          <Alert variant="success" title={t('terminalPaymentSuccess')}>
            ${(amountCents / 100).toFixed(2)} collected in-person.
          </Alert>
        )}

            {paymentStatus === 'idle' && (
              <>
                {/* Reader Selection */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold uppercase tracking-wider text-[var(--text-muted)]">{t('terminalSelectReader')}</span>
                    <div className="flex items-center gap-2">
                      <button type="button" onClick={fetchReaders} className="p-1.5 rounded-lg hover:bg-black/5 transition-colors cursor-pointer">
                        <Icon filled={ArrowSync24Filled} size="sm" tone="muted" className={`w-3.5 h-3.5 ${isLoadingReaders ? 'animate-spin' : ''}`} />
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowPairForm(!showPairForm)}
                        className="btn-secondary h-8 px-3 rounded-xl text-xs font-bold flex items-center gap-1.5"
                      >
                        <Icon filled={Add24Filled} size="xs" />
                        <span>{t('terminalPairNew')}</span>
                      </button>
                    </div>
                  </div>

                  {isLoadingReaders ? (
                    <div className="py-6 text-center text-xs text-[var(--text-muted)]">Scanning for readers…</div>
                  ) : readers.length === 0 ? (
                    <EmptyState
                      icon={Payment24Regular}
                      title="No readers paired yet"
                      description="Click Pair New Reader to add one."
                      className="!min-h-[160px] !p-6"
                    />
                  ) : (
                    <div className="space-y-2">
                      {readers.map((reader) => {
                        const isSelected = selectedReaderId === reader.id;
                        return (
                          <Card
                            key={reader.id}
                            variant="interactive"
                            onClick={() => setSelectedReaderId(reader.id)}
                            className={`!p-3.5 !rounded-2xl flex items-center gap-3 ${
                              isSelected
                                ? '!border-[#2BB5FF] ring-1 ring-[#2BB5FF]/25'
                                : ''
                            }`}
                          >
                            <div className="w-9 h-9 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] flex items-center justify-center flex-shrink-0">
                              <Icon
                                regular={reader.device_type === 'tap_to_pay' ? Phone24Regular : Payment24Regular}
                                size="sm"
                                tone={isSelected ? 'accent' : 'secondary'}
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-extrabold text-[var(--text-primary)] truncate">{reader.label}</p>
                              <p className="text-[10px] text-[var(--text-muted)] capitalize">{reader.device_type?.replace(/_/g, ' ')}</p>
                            </div>
                            <Badge
                              variant={reader.status === 'online' ? 'success' : 'subtle'}
                              size="xs"
                              className="uppercase gap-1"
                            >
                              {reader.status === 'online' ? <Icon regular={Wifi124Regular} className="w-2.5 h-2.5" /> : <Icon regular={WifiOff24Regular} className="w-2.5 h-2.5" />}
                              <span>{reader.status}</span>
                            </Badge>
                          </Card>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Pair New Reader Form */}
                <AnimatePresence>
                  {showPairForm && (
                    <motion.form initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                      onSubmit={handlePairReader}
                      className="space-y-3.5 p-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-[var(--border-subtle)] overflow-hidden">
                      <p className="text-xs font-extrabold text-[var(--text-primary)]">{t('terminalPairNew')}</p>
                      <FloatingInput
                        label={t('terminalPairNew')}
                        type="text"
                        value={readerLabel}
                        onChange={(e) => setReaderLabel(e.target.value)}
                        placeholder="e.g. Register 1 — Front Desk"
                      />
                      <FloatingInput
                        label="Registration Code"
                        type="text"
                        required
                        value={registrationCode}
                        onChange={(e) => setRegistrationCode(e.target.value)}
                        placeholder="Registration Code (on device screen)"
                        className="font-mono font-bold uppercase"
                      />
                      <button type="submit" disabled={isPairing}
                        className="btn-primary w-full disabled:opacity-50">
                        {isPairing ? 'Pairing…' : 'Pair This Reader'}
                      </button>
                    </motion.form>
                  )}
                </AnimatePresence>
              </>
            )}
      </div>
    </Dialog>
  );
};

export default POSTerminalModal;
