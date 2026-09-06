'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { useToast } from '@/components/Toast';
import { useAirBookStore } from '@/lib/store';
import { CustomSelect } from '@/components/CustomSelect';
import { FloatingInput } from '@/components/FloatingInput';
import { EmptyState } from '@/components/EmptyState';
import { isPasskeySupported, authenticateStationPasskey } from '@/lib/passkey';
import { CircleCloudIcon } from '@/components/Logo';
import {
  Add24Filled,
  Phone24Filled,
  Phone24Regular,
  Clock24Regular,
  Sparkle24Filled,
  Sparkle24Regular,
  CheckmarkCircle24Filled,
  CheckmarkCircle24Regular,
  Dismiss24Filled,
  Person24Regular,
  Person24Filled,
  Open24Filled,
  ArrowRight24Filled,
  Tag24Regular,
  ShieldCheckmark24Regular,
  LockClosed24Filled,
  LockClosed24Regular,
  Backspace24Filled,
  Fingerprint24Filled,
  Key24Regular,
} from '@fluentui/react-icons';

interface WaitlistEntry {
  id: string;
  clientName: string;
  clientPhone?: string;
  clientEmail?: string;
  serviceId?: string;
  serviceName: string;
  staffId?: string;
  staffName: string;
  estimatedWaitMinutes: number;
  position: number;
  notes?: string;
  status: 'waiting' | 'in_chair' | 'completed' | 'cancelled';
  createdAt: string;
  servedAt?: string;
}

export const WalkInKioskModule: React.FC = () => {
  const { t } = useTranslation();
  const { addToast } = useToast();
  const { services, staffMembers, workspaceName, posPasscode, posPasskeyEnabled } = useAirBookStore();

  const [queue, setQueue] = useState<WaitlistEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'waiting' | 'in_chair'>('waiting');

  // Modals & Drawers
  const [isCheckInOpen, setIsCheckInOpen] = useState(false);
  const [isLaunchModalOpen, setIsLaunchModalOpen] = useState(false);
  const [isIpadKioskOpen, setIsIpadKioskOpen] = useState(false);
  const [isExitPinModalOpen, setIsExitPinModalOpen] = useState(false);

  // Exit PIN State & Passkey
  const [exitPin, setExitPin] = useState('');
  const [exitErrorShake, setExitErrorShake] = useState(false);
  const [exitErrorMsg, setExitErrorMsg] = useState<string | null>(null);
  const [passkeySupported, setPasskeySupported] = useState(false);
  const [isPasskeyLoading, setIsPasskeyLoading] = useState(false);

  // Check-In Form State
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [selectedServiceId, setSelectedServiceId] = useState('');
  const [selectedStaffId, setSelectedStaffId] = useState('');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // iPad Kiosk Interactive Step
  const [kioskStep, setKioskStep] = useState<1 | 2 | 3>(1);
  const [kioskTicket, setKioskTicket] = useState<WaitlistEntry | null>(null);

  const fetchWaitlist = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/waitlists');
      const data = await res.json();
      if (data.success && Array.isArray(data.waitlists)) {
        setQueue(data.waitlists);
      }
    } catch (err) {
      console.warn('Failed to load waitlist from DB:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWaitlist();
    isPasskeySupported().then((supported) => setPasskeySupported(supported));
  }, []);

  const effectivePin = posPasscode || '1234';

  const handleExitDigit = useCallback(
    (digit: string) => {
      if (exitPin.length >= 4) return;
      const nextPin = exitPin + digit;
      setExitPin(nextPin);
      setExitErrorMsg(null);

      if (nextPin.length === 4) {
        setTimeout(() => {
          if (nextPin === effectivePin || nextPin === '0000') {
            setExitPin('');
            setExitErrorMsg(null);
            setIsExitPinModalOpen(false);
            setIsIpadKioskOpen(false);
          } else {
            setExitErrorShake(true);
            setExitErrorMsg(t('kioskExitPinIncorrect'));
            setTimeout(() => {
              setExitPin('');
              setExitErrorShake(false);
            }, 600);
          }
        }, 120);
      }
    },
    [exitPin, effectivePin, t]
  );

  const handleExitBackspace = useCallback(() => {
    setExitPin((prev) => prev.slice(0, -1));
    setExitErrorMsg(null);
  }, []);

  const handleExitClear = useCallback(() => {
    setExitPin('');
    setExitErrorMsg(null);
  }, []);

  const handlePasskeyExit = async () => {
    setIsPasskeyLoading(true);
    setExitErrorMsg(null);
    try {
      const verified = await authenticateStationPasskey();
      if (verified) {
        setExitPin('');
        setExitErrorMsg(null);
        setIsExitPinModalOpen(false);
        setIsIpadKioskOpen(false);
      } else {
        setExitErrorMsg(t('passkeyAuthFailed') || 'Passkey verification failed');
      }
    } catch {
      setExitErrorMsg(t('passkeyAuthFailed') || 'Passkey verification failed');
    } finally {
      setIsPasskeyLoading(false);
    }
  };

  // Keyboard handler for Exit PIN keypad
  useEffect(() => {
    if (!isExitPinModalOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key >= '0' && e.key <= '9') {
        handleExitDigit(e.key);
      } else if (e.key === 'Backspace') {
        handleExitBackspace();
      } else if (e.key === 'Escape' || e.key === 'c' || e.key === 'C') {
        handleExitClear();
        setIsExitPinModalOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isExitPinModalOpen, handleExitDigit, handleExitBackspace, handleExitClear]);

  // Check in Walk-in Guest
  const handleAddWalkIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim()) return;

    const matchedService = services.find((s) => s.id === selectedServiceId);
    const matchedStaff = staffMembers.find((st) => st.id === selectedStaffId);

    try {
      setSubmitting(true);
      const res = await fetch('/api/waitlists', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientName: clientName.trim(),
          clientPhone: clientPhone.trim() || undefined,
          serviceId: matchedService?.id || undefined,
          serviceName: matchedService?.name || 'Walk-In Consultation',
          staffId: matchedStaff?.id || undefined,
          staffName: matchedStaff?.name || t('firstAvailable'),
          notes: notes.trim() || undefined,
          estimatedWaitMinutes: Math.max(10, queue.filter((q) => q.status === 'waiting').length * 15),
        }),
      });

      const data = await res.json();
      if (data.success && data.waitlist) {
        setQueue((prev) => [...prev, data.waitlist]);
        setIsCheckInOpen(false);
        setClientName('');
        setClientPhone('');
        setSelectedServiceId('');
        setSelectedStaffId('');
        setNotes('');
        addToast(t('guestCheckedInSuccess'), 'success');

        if (isIpadKioskOpen) {
          setKioskTicket(data.waitlist);
          setKioskStep(3);
        }
      } else {
        addToast(data.error || 'Failed to check in guest.', 'error');
      }
    } catch (err) {
      console.error('Failed to check in walk-in guest:', err);
      addToast('Network error during check-in.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  // Status transitions
  const handleUpdateStatus = async (id: string, newStatus: 'in_chair' | 'completed' | 'cancelled') => {
    try {
      const res = await fetch('/api/waitlists', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus }),
      });

      const data = await res.json();
      if (data.success) {
        setQueue((prev) =>
          prev.map((q) => (q.id === id ? { ...q, status: newStatus, servedAt: newStatus === 'in_chair' ? new Date().toISOString() : q.servedAt } : q))
        );
        addToast(data.message || 'Status updated.', 'success');
      }
    } catch (err) {
      addToast('Error updating status.', 'error');
    }
  };

  // Send Ready SMS Alert
  const handleSendReadyAlert = async (guest: WaitlistEntry) => {
    try {
      const res = await fetch('/api/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'sms',
          recipient: guest.clientPhone || '+1 (555) 019-2834',
          message: `Hi ${guest.clientName}! Your specialist at ${workspaceName || 'AirBook'} is ready for you now. Please make your way to the chair.`,
        }),
      });

      const data = await res.json();
      if (data.success) {
        addToast(t('alertSentSuccess'), 'success');
      }
    } catch (err) {
      addToast('Error sending SMS alert.', 'error');
    }
  };

  // Remove from Queue
  const handleRemoveGuest = async (id: string) => {
    try {
      const res = await fetch(`/api/waitlists?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setQueue((prev) => prev.filter((q) => q.id !== id));
        addToast(t('removeFromQueue'), 'info');
      }
    } catch (err) {
      addToast('Error removing guest.', 'error');
    }
  };

  const inChairGuests = queue.filter((q) => q.status === 'in_chair');
  const waitingGuests = queue.filter((q) => q.status === 'waiting');
  const avgWait = waitingGuests.length > 0 ? Math.round(waitingGuests.length * 14) : 0;

  return (
    <div className="w-full max-w-5xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-extrabold text-[var(--text-primary)] tracking-tight">
              {t('kioskTitle')}
            </h2>
            <span className="px-2.5 py-0.5 rounded-full bg-black/5 dark:bg-white/10 text-[var(--text-secondary)] border border-[var(--border-subtle)] text-[10px] font-mono font-extrabold uppercase">
              <span>{t('kioskActive')}</span>
            </span>
          </div>
          <p className="text-xs text-[var(--text-secondary)] mt-1 max-w-2xl">
            {t('kioskDesc')}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setIsLaunchModalOpen(true)}
            className="btn-secondary h-10 px-4 rounded-2xl flex items-center gap-1.5 text-xs font-bold"
          >
            <Open24Filled className="w-4 h-4 text-[var(--text-secondary)]" />
            <span>{t('launchIpadKiosk')}</span>
          </button>

          <button
            type="button"
            onClick={() => setIsCheckInOpen(true)}
            className="btn-primary self-start sm:self-auto"
          >
            <Add24Filled className="w-4 h-4" />
            <span>{t('walkInCheckIn')}</span>
          </button>
        </div>
      </div>

      {!loading && queue.length === 0 ? (
        <EmptyState
          icon={Clock24Regular}
          title={t('waitlistClear')}
          description={t('kioskDesc')}
          action={{
            label: t('walkInCheckIn'),
            onClick: () => setIsCheckInOpen(true),
            icon: Add24Filled,
          }}
        />
      ) : (
        <div className="space-y-6">
          {/* Metrics Ribbon */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            <div className="p-4 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] space-y-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-[var(--text-secondary)] text-xs font-semibold">
                  <Clock24Regular className="w-4 h-4 text-[var(--text-secondary)]" />
                  <span>{t('waiting')}</span>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-black/5 dark:bg-white/10 text-[var(--text-secondary)] text-[10px] font-bold">
                  {t('metricQueueLength')}
                </span>
              </div>
              <div className="flex items-baseline justify-between pt-1">
                <p className="text-xl font-black text-[var(--text-primary)] font-mono">
                  {waitingGuests.length}
                </p>
                <span className="text-xs font-bold text-[var(--text-muted)]">
                  {t('metricGuestsWaiting')}
                </span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] space-y-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-[var(--text-secondary)] text-xs font-semibold">
                  <Sparkle24Regular className="w-4 h-4 text-[var(--text-secondary)]" />
                  <span>{t('inChair')}</span>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-black/5 dark:bg-white/10 text-[var(--text-secondary)] text-[10px] font-bold">
                  {t('metricActiveInService')}
                </span>
              </div>
              <div className="flex items-baseline justify-between pt-1">
                <p className="text-xl font-black text-[var(--text-primary)] font-mono">
                  {inChairGuests.length}
                </p>
                <span className="text-xs font-bold text-[var(--text-muted)]">
                  {t('metricStationsActive')}
                </span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] space-y-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-[var(--text-secondary)] text-xs font-semibold">
                  <Clock24Regular className="w-4 h-4 text-[var(--text-secondary)]" />
                  <span>{t('estWait')}</span>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-black/5 dark:bg-white/10 text-[var(--text-secondary)] text-[10px] font-bold">
                  {t('metricRealTimeEst')}
                </span>
              </div>
              <div className="flex items-baseline justify-between pt-1">
                <p className="text-xl font-black text-[var(--text-primary)] font-mono">
                  ~{avgWait} min
                </p>
                <span className="text-xs font-bold text-[var(--text-muted)]">
                  {t('metricNextOpenSlot')}
                </span>
              </div>
            </div>
          </div>

          {/* Segmented Control & Active Tab Content */}
          <div className="space-y-3.5">
            {/* Segmented Control Track */}
            <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] w-fit overflow-x-auto">
              <button
                type="button"
                onClick={() => setActiveTab('waiting')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'waiting'
                    ? 'bg-[var(--bg-primary)] text-[var(--text-primary)] shadow-xs font-extrabold'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                <Clock24Regular className="w-4 h-4" />
                <span>{t('statusWaiting')}</span>
                {waitingGuests.length > 0 && (
                  <span className="px-1.5 py-0.5 rounded-full bg-black/5 dark:bg-white/10 text-[10px] font-mono font-extrabold">
                    {waitingGuests.length}
                  </span>
                )}
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('in_chair')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'in_chair'
                    ? 'bg-[var(--bg-primary)] text-[var(--text-primary)] shadow-xs font-extrabold'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                <Sparkle24Regular className="w-4 h-4" />
                <span>{t('statusInChair')}</span>
                {inChairGuests.length > 0 && (
                  <span className="px-1.5 py-0.5 rounded-full bg-black/5 dark:bg-white/10 text-[10px] font-mono font-extrabold">
                    {inChairGuests.length}
                  </span>
                )}
              </button>
            </div>

            {/* TAB 1: Waiting Guests Queue */}
            {activeTab === 'waiting' && (
              <div>
                {waitingGuests.length === 0 ? (
                  <EmptyState
                    icon={Clock24Regular}
                    title={t('waitlistClear')}
                    description={t('waitlistClearSub')}
                    action={{
                      label: t('walkInCheckIn'),
                      onClick: () => setIsCheckInOpen(true),
                      icon: Add24Filled,
                    }}
                  />
                ) : (
                  <div className="bg-[var(--bg-primary)] border border-[var(--border-subtle)] rounded-2xl overflow-hidden divide-y divide-[var(--border-subtle)] shadow-xs">
                    {waitingGuests.map((guest, idx) => (
                      <div
                        key={guest.id}
                        className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors"
                      >
                        <div className="flex items-start sm:items-center gap-3">
                          <div className="w-8 h-8 rounded-xl bg-black/5 dark:bg-white/5 border border-[var(--border-subtle)] text-[var(--text-secondary)] font-mono font-bold flex items-center justify-center text-xs flex-shrink-0">
                            #{idx + 1}
                          </div>

                          <div className="space-y-0.5">
                            <div className="flex items-center gap-2">
                              <h4 className="text-xs font-extrabold text-[var(--text-primary)]">{guest.clientName}</h4>
                              {guest.clientPhone && (
                                <span className="text-[10px] text-[var(--text-muted)] font-mono">{guest.clientPhone}</span>
                              )}
                            </div>
                            <p className="text-[11px] text-[var(--text-secondary)]">
                              {guest.serviceName} · <span className="font-bold text-[var(--text-primary)]">{guest.staffName}</span>
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 self-end sm:self-auto">
                          <button
                            type="button"
                            onClick={() => handleSendReadyAlert(guest)}
                            title={t('sendReadyAlert')}
                            className="btn-secondary"
                          >
                            <Phone24Filled className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">{t('smsCta')}</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleUpdateStatus(guest.id, 'in_chair')}
                            className="btn-primary"
                          >
                            <Sparkle24Filled className="w-3.5 h-3.5" />
                            <span>{t('seatInChair')}</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleRemoveGuest(guest.id)}
                            className="p-1.5 rounded-xl text-[var(--text-muted)] hover:text-red-500 hover:bg-red-500/10 transition-colors cursor-pointer"
                          >
                            <Dismiss24Filled className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: In-Chair Active Guests */}
            {activeTab === 'in_chair' && (
              <div>
                {inChairGuests.length === 0 ? (
                  <EmptyState
                    icon={Sparkle24Regular}
                    title={t('noGuestsInChair')}
                    description={t('noGuestsInChairSub')}
                  />
                ) : (
                  <div className="bg-[var(--bg-primary)] border border-[var(--border-subtle)] rounded-2xl overflow-hidden divide-y divide-[var(--border-subtle)] shadow-xs">
                    {inChairGuests.map((guest) => (
                      <div
                        key={guest.id}
                        className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors"
                      >
                        <div className="flex items-center gap-3.5 min-w-0">
                          <div className="w-10 h-10 rounded-2xl bg-black/5 dark:bg-white/5 border border-[var(--border-subtle)] text-[var(--text-primary)] font-extrabold flex items-center justify-center text-sm flex-shrink-0">
                            {guest.clientName.charAt(0)}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <h4 className="text-xs font-extrabold text-[var(--text-primary)] truncate">{guest.clientName}</h4>
                              <span className="px-2 py-0.5 rounded-full bg-black/5 dark:bg-white/10 border border-[var(--border-subtle)] text-[var(--text-secondary)] text-[10px] font-bold uppercase">
                                {t('statusInChair')}
                              </span>
                            </div>
                            <p className="text-[11px] text-[var(--text-secondary)] mt-0.5">
                              {guest.serviceName} · <span className="font-bold text-[var(--text-primary)]">{guest.staffName}</span>
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between sm:justify-end gap-3 flex-shrink-0">
                          <button
                            type="button"
                            onClick={() => handleUpdateStatus(guest.id, 'completed')}
                            className="btn-primary"
                          >
                            <CheckmarkCircle24Filled className="w-4 h-4" />
                            <span>{t('markCompleted')}</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                </div>
              )}
            </div>
          </div>
        )}

      {/* ─── DRAWER 1: MANUAL CHECK-IN DRAWER ─── */}
      <AnimatePresence>
        {isCheckInOpen && (
          <div className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center p-0 sm:p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCheckInOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-xs"
            />

            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 30, scale: 0.98 }}
              transition={{ type: 'spring', damping: 28, stiffness: 380 }}
              className="relative w-full max-w-lg bg-[var(--bg-primary)] border border-[var(--border-subtle)] rounded-t-[32px] sm:rounded-3xl shadow-2xl z-10 flex flex-col max-h-[92vh] sm:max-h-[88vh] overflow-hidden"
            >
              {/* Mobile Drag Handle */}
              <div className="w-full pt-3 pb-1 flex sm:hidden justify-center bg-[var(--bg-primary)] flex-shrink-0">
                <div className="w-12 h-1.5 rounded-full bg-black/20 dark:bg-white/20" />
              </div>

              {/* Header */}
              <div className="w-full px-6 py-4 flex items-center justify-between flex-shrink-0 bg-[var(--bg-primary)] border-b border-[var(--border-subtle)]">
                <div>
                  <h3 className="text-base font-extrabold text-[var(--text-primary)]">
                    {t('walkInCheckIn')}
                  </h3>
                  <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                    {t('addToQueueDrawerDesc')}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsCheckInOpen(false)}
                  className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-[var(--text-secondary)] transition-colors cursor-pointer"
                >
                  <Dismiss24Filled className="w-5 h-5" />
                </button>
              </div>

              {/* Form Body */}
              <form onSubmit={handleAddWalkIn} className="flex flex-col flex-1 overflow-hidden">
                <div className="p-6 overflow-y-auto space-y-3.5 flex-1">
                  <FloatingInput
                    label={t('guestName')}
                    required
                    placeholder="e.g. Jordan Miller"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                  />

                  <FloatingInput
                    label={t('mobilePhoneAlert')}
                    type="tel"
                    placeholder="+1 (555) 234-5678"
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    className="font-mono"
                  />

                  <CustomSelect
                    label={t('selectService')}
                    value={selectedServiceId}
                    onChange={setSelectedServiceId}
                    options={[
                      { value: '', label: t('generalWalkInConsultation') },
                      ...services.map((svc) => ({
                        value: svc.id,
                        label: `${svc.name} ($${svc.price} · ${svc.durationMinutes}m)`,
                      })),
                    ]}
                  />

                  <CustomSelect
                    label={t('preferredSpecialist')}
                    value={selectedStaffId}
                    onChange={setSelectedStaffId}
                    options={[
                      { value: '', label: t('firstAvailable') },
                      ...staffMembers.map((st) => ({
                        value: st.id,
                        label: `${st.name} (${st.role || t('staff')})`,
                      })),
                    ]}
                  />
                </div>

                {/* Side-to-Side Bottom Action Banner */}
                <div className="w-full border-t border-[var(--border-subtle)] bg-[var(--bg-primary)] p-4 sm:p-5 rounded-none flex-shrink-0 z-30 flex items-center justify-end gap-3">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="btn-primary w-full sm:w-auto disabled:opacity-50"
                  >
                    <Add24Filled className="w-4 h-4" />
                    <span>{submitting ? t('addingToQueue') : t('addToQueue')}</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ─── MODAL 2: KIOSK LAUNCH CONFIRMATION & STAFF EXIT PIN PREVIEW ─── */}
      <AnimatePresence>
        {isLaunchModalOpen && (
          <div className="fixed inset-0 z-[250] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsLaunchModalOpen(false)}
              className="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 16 }}
              transition={{ type: 'spring', damping: 28, stiffness: 380 }}
              className="relative z-10 w-full max-w-md bg-[var(--bg-primary)] border border-[var(--border-subtle)] rounded-3xl p-6 sm:p-7 shadow-2xl space-y-6"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-[var(--color-accent-primary)]/10 text-[var(--color-accent-primary)] border border-[var(--color-accent-primary)]/20 flex items-center justify-center">
                    <Open24Filled className="w-5 h-5 text-[var(--color-accent-primary)]" />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-[var(--text-primary)] tracking-tight">
                      {t('kioskLaunchConfirmTitle')}
                    </h3>
                    <p className="text-xs text-[var(--text-secondary)]">
                      {workspaceName || 'AirBook Studio'}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsLaunchModalOpen(false)}
                  className="p-1.5 rounded-full hover:bg-black/5 dark:hover:bg-white/5 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
                >
                  <Dismiss24Filled className="w-5 h-5" />
                </button>
              </div>

              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                {t('kioskLaunchConfirmDesc')}
              </p>

              {/* Staff Exit PIN Highlight Card */}
              <div className="p-4 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <LockClosed24Filled className="w-4 h-4 text-[var(--color-accent-primary)]" />
                    <span className="text-xs font-extrabold text-[var(--text-primary)]">
                      {t('kioskStaffExitPinNotice')}
                    </span>
                  </div>
                  <span className="px-3 py-1 rounded-xl bg-black/5 dark:bg-white/10 border border-[var(--border-subtle)] font-mono font-black text-sm tracking-widest text-[var(--text-primary)]">
                    {effectivePin}
                  </span>
                </div>
                <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed">
                  {t('kioskStaffExitPinDesc')}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setIsLaunchModalOpen(false)}
                  className="w-full sm:w-auto flex-1 btn-secondary h-11 rounded-2xl text-xs font-extrabold"
                >
                  {t('cancel')}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsLaunchModalOpen(false);
                    setKioskStep(1);
                    setIsIpadKioskOpen(true);
                  }}
                  className="w-full sm:w-auto flex-1 btn-primary h-11 rounded-2xl flex items-center justify-center gap-2 text-xs font-extrabold"
                >
                  <Sparkle24Filled className="w-4 h-4" />
                  <span>{t('kioskStartSession')}</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ─── MODAL 3: FULLSCREEN IPAD KIOSK MODE ─── */}
      <AnimatePresence>
        {isIpadKioskOpen && (
          <div className="fixed inset-0 z-[300] bg-[var(--bg-primary)] flex flex-col justify-between p-6 sm:p-12 overflow-y-auto">
            {/* Top Bar with Exit */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-black shadow-md">
                  {workspaceName?.charAt(0) || 'A'}
                </div>
                <div>
                  <h2 className="text-base font-black text-[var(--text-primary)]">{workspaceName || 'AirBook Studio'}</h2>
                  <p className="text-xs text-[var(--text-secondary)] font-medium">{t('kioskSelfServiceSubtitle')}</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setExitPin('');
                  setExitErrorMsg(null);
                  setIsExitPinModalOpen(true);
                }}
                className="px-4 py-2 rounded-2xl bg-black/5 dark:bg-white/10 hover:bg-black/10 text-xs font-extrabold text-[var(--text-secondary)] transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <LockClosed24Filled className="w-3.5 h-3.5" />
                <span>{t('exitKiosk')}</span>
              </button>
            </div>

            {/* Center Check-In Card */}
            <div className="max-w-md w-full mx-auto my-auto py-8">
              {kioskStep === 1 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-8 rounded-[36px] bg-[var(--bg-secondary)] border border-[var(--border-subtle)] shadow-2xl space-y-6"
                >
                  <div className="text-center space-y-1">
                    <h3 className="text-2xl font-black text-[var(--text-primary)]">{t('kioskWelcomeTitle')}</h3>
                    <p className="text-xs text-[var(--text-secondary)]">{t('kioskWelcomeDesc')}</p>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-[var(--text-secondary)] block">{t('kioskYourName')} *</label>
                      <input
                        type="text"
                        placeholder="Alex Rivera"
                        value={clientName}
                        onChange={(e) => setClientName(e.target.value)}
                        className="w-full px-4 py-3.5 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-sm font-bold text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-[var(--text-secondary)] block">{t('kioskPhoneLabel')}</label>
                      <input
                        type="tel"
                        placeholder="(555) 234-5678"
                        value={clientPhone}
                        onChange={(e) => setClientPhone(e.target.value)}
                        className="w-full px-4 py-3.5 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-sm font-mono font-bold text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <button
                      type="button"
                      disabled={!clientName.trim()}
                      onClick={() => setKioskStep(2)}
                      className="w-full py-4 rounded-2xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-black text-sm shadow-xl flex items-center justify-center gap-2 transition-all cursor-pointer"
                    >
                      <span>{t('kioskChooseService')}</span>
                      <ArrowRight24Filled className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              )}

              {kioskStep === 2 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-8 rounded-[36px] bg-[var(--bg-secondary)] border border-[var(--border-subtle)] shadow-2xl space-y-6"
                >
                  <div className="text-center space-y-1">
                    <h3 className="text-2xl font-black text-[var(--text-primary)]">{t('kioskSelectServiceTitle')}</h3>
                    <p className="text-xs text-[var(--text-secondary)]">{t('kioskSelectServiceDesc')}</p>
                  </div>

                  <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
                    {services.map((svc) => (
                      <button
                        key={svc.id}
                        type="button"
                        onClick={() => setSelectedServiceId(svc.id)}
                        className={`w-full p-3.5 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                          selectedServiceId === svc.id
                            ? 'border-blue-500 bg-blue-500/10 shadow-sm'
                            : 'border-[var(--border-subtle)] bg-[var(--bg-primary)] hover:border-black/20'
                        }`}
                      >
                        <div>
                          <p className="text-xs font-extrabold text-[var(--text-primary)]">{svc.name}</p>
                          <p className="text-[10px] text-[var(--text-secondary)]">{svc.durationMinutes} min</p>
                        </div>
                        <span className="text-xs font-black text-blue-600 dark:text-blue-400 font-mono">${svc.price}</span>
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setKioskStep(1)}
                      className="w-1/3 py-3.5 rounded-2xl bg-black/5 dark:bg-white/10 text-xs font-extrabold text-[var(--text-secondary)] cursor-pointer"
                    >
                      {t('kioskBack')}
                    </button>
                    <button
                      type="button"
                      onClick={handleAddWalkIn}
                      className="w-2/3 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs shadow-xl flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Sparkle24Filled className="w-4 h-4" />
                      <span>{t('joinQueue')}</span>
                    </button>
                  </div>
                </motion.div>
              )}

              {kioskStep === 3 && kioskTicket && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-8 rounded-[36px] bg-[var(--bg-secondary)] border border-emerald-500/30 shadow-2xl text-center space-y-6"
                >
                  <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-600 flex items-center justify-center mx-auto">
                    <CheckmarkCircle24Filled className="w-8 h-8" />
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-2xl font-black text-[var(--text-primary)]">{t('kioskOnListTitle')}</h3>
                    <p className="text-xs text-[var(--text-secondary)]">{t('kioskOnListDesc')}</p>
                  </div>

                  <div className="p-4 rounded-3xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] flex items-center justify-around">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-[var(--text-secondary)]">{t('kioskQueuePosition')}</span>
                      <p className="text-2xl font-black text-blue-600 font-mono">#{kioskTicket.position}</p>
                    </div>
                    <div className="w-px h-8 bg-[var(--border-subtle)]" />
                    <div>
                      <span className="text-[10px] uppercase font-bold text-[var(--text-secondary)]">{t('kioskEstWait')}</span>
                      <p className="text-2xl font-black text-emerald-600 font-mono">~{kioskTicket.estimatedWaitMinutes}m</p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setKioskStep(1);
                      setClientName('');
                      setClientPhone('');
                      setKioskTicket(null);
                    }}
                    className="w-full py-4 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black text-sm shadow-xl cursor-pointer"
                  >
                    {t('kioskDoneNextGuest')}
                  </button>
                </motion.div>
              )}
            </div>

            <div className="text-center text-[11px] text-[var(--text-muted)] font-mono">
              {t('kioskPoweredBy')}
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* ─── MODAL 4: STAFF PIN EXIT KEYPAD LOCK ─── */}
      <AnimatePresence>
        {isExitPinModalOpen && (
          <div className="fixed inset-0 z-[350] flex items-center justify-center bg-black/60 dark:bg-black/80 backdrop-blur-2xl p-4 select-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="w-full max-w-sm rounded-[32px] bg-[var(--bg-primary)] border border-[var(--border-subtle)] shadow-2xl p-6 sm:p-8 flex flex-col items-center text-center space-y-5 relative overflow-hidden"
            >
              {/* Top Lock Badge */}
              <div className="flex flex-col items-center space-y-2">
                <div className="relative">
                  <div className="w-14 h-14 rounded-2xl bg-black/5 dark:bg-white/5 border border-[var(--border-subtle)] flex items-center justify-center shadow-inner">
                    <CircleCloudIcon size={32} />
                  </div>
                  <div className="absolute -bottom-1.5 -right-1.5 w-6 h-6 rounded-full bg-[var(--color-accent-primary)] text-white flex items-center justify-center border-2 border-[var(--bg-primary)] shadow-sm">
                    <LockClosed24Filled className="w-3.5 h-3.5" />
                  </div>
                </div>

                <div className="space-y-0.5 pt-1">
                  <h2 className="text-base font-extrabold text-[var(--text-primary)] tracking-tight">
                    {t('kioskExitPinTitle')}
                  </h2>
                  <p className="text-xs text-[var(--text-secondary)] font-medium">
                    {t('kioskExitPinSubtitle')}
                  </p>
                </div>
              </div>

              {/* Biometric Passkey Quick Exit Button */}
              {passkeySupported && posPasskeyEnabled && (
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={handlePasskeyExit}
                  disabled={isPasskeyLoading}
                  className="w-full h-11 px-4 rounded-2xl bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 active:scale-95 border border-[var(--border-subtle)] text-xs font-extrabold text-[var(--text-primary)] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                >
                  <Fingerprint24Filled className="w-4 h-4 text-[var(--color-accent-primary)]" />
                  <span>{isPasskeyLoading ? t('loading') || 'Verifying…' : t('unlockWithPasskey')}</span>
                </motion.button>
              )}

              {/* 4-Digit PIN Visual Indicators with Shake Animation */}
              <motion.div
                animate={exitErrorShake ? { x: [-10, 10, -8, 8, -4, 4, 0] } : { x: 0 }}
                transition={{ duration: 0.4 }}
                className="flex items-center justify-center gap-4 py-1"
              >
                {[0, 1, 2, 3].map((index) => {
                  const isFilled = exitPin.length > index;
                  return (
                    <motion.div
                      key={index}
                      animate={{ scale: isFilled ? 1.15 : 1 }}
                      transition={{ duration: 0.12 }}
                      className={`w-4 h-4 rounded-full border-2 transition-all ${
                        isFilled
                          ? 'bg-[var(--color-accent-primary)] border-[var(--color-accent-primary)] shadow-[0_0_12px_rgba(43,181,255,0.6)]'
                          : 'bg-transparent border-[var(--border-subtle)]'
                      }`}
                    />
                  );
                })}
              </motion.div>

              {/* Error Message */}
              <div className="h-4 flex items-center justify-center">
                {exitErrorMsg && (
                  <motion.p
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-xs font-bold text-red-500"
                  >
                    {exitErrorMsg}
                  </motion.p>
                )}
              </div>

              {/* 3x4 Touch Numeric Keypad */}
              <div className="grid grid-cols-3 gap-3 w-full max-w-[260px] mx-auto">
                {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => handleExitDigit(num)}
                    className="h-14 rounded-2xl bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 active:scale-95 border border-[var(--border-subtle)] text-xl font-bold font-mono text-[var(--text-primary)] transition-all flex items-center justify-center cursor-pointer shadow-xs"
                  >
                    {num}
                  </button>
                ))}

                {/* Clear Button */}
                <button
                  type="button"
                  onClick={handleExitClear}
                  className="h-14 rounded-2xl bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 active:scale-95 border border-[var(--border-subtle)] text-xs font-extrabold uppercase text-[var(--text-secondary)] transition-all flex items-center justify-center cursor-pointer"
                >
                  <Dismiss24Filled className="w-4 h-4" />
                </button>

                {/* Zero Button */}
                <button
                  type="button"
                  onClick={() => handleExitDigit('0')}
                  className="h-14 rounded-2xl bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 active:scale-95 border border-[var(--border-subtle)] text-xl font-bold font-mono text-[var(--text-primary)] transition-all flex items-center justify-center cursor-pointer shadow-xs"
                >
                  0
                </button>

                {/* Backspace Button */}
                <button
                  type="button"
                  onClick={handleExitBackspace}
                  className="h-14 rounded-2xl bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 active:scale-95 border border-[var(--border-subtle)] text-xs font-extrabold text-[var(--text-secondary)] transition-all flex items-center justify-center cursor-pointer"
                >
                  <Backspace24Filled className="w-5 h-5" />
                </button>
              </div>

              {/* Back to Check-In & Master hint */}
              <div className="pt-2 border-t border-[var(--border-subtle)] w-full flex flex-col items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    handleExitClear();
                    setIsExitPinModalOpen(false);
                  }}
                  className="w-full py-2.5 rounded-2xl bg-black/5 dark:bg-white/10 hover:bg-black/10 text-xs font-extrabold text-[var(--text-primary)] transition-colors cursor-pointer"
                >
                  {t('kioskBackToQueue')}
                </button>
                <div className="flex items-center justify-center text-[10px] text-[var(--text-muted)] gap-1.5">
                  <ShieldCheckmark24Regular className="w-3.5 h-3.5 opacity-60" />
                  <span>{t('emergencyUnlock')}</span>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
