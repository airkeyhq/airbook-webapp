'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { useToast } from '@/components/Toast';
import { useAirBookStore } from '@/lib/store';
import { CustomSelect } from '@/components/CustomSelect';
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
  const { services, staffMembers, workspaceName } = useAirBookStore();

  const [queue, setQueue] = useState<WaitlistEntry[]>([]);
  const [loading, setLoading] = useState(true);

  // Modals & Drawers
  const [isCheckInOpen, setIsCheckInOpen] = useState(false);
  const [isIpadKioskOpen, setIsIpadKioskOpen] = useState(false);

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
  }, []);

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
            <span className="px-2.5 py-0.5 rounded-full bg-black/5 dark:bg-white/10 text-[var(--text-secondary)] border border-[var(--border-subtle)] text-[10px] font-mono font-extrabold flex items-center gap-1.5 uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
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
            onClick={() => {
              setKioskStep(1);
              setIsIpadKioskOpen(true);
            }}
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

      {/* Main Queue Dashboard: Divided Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Column 1: Currently In Chair (Active) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-primary)] flex items-center gap-1.5">
              <Sparkle24Filled className="w-4 h-4 text-emerald-500" />
              <span>{t('statusInChair')} ({inChairGuests.length})</span>
            </h3>
          </div>

          {inChairGuests.length === 0 ? (
            <div className="p-8 text-center bg-[var(--bg-primary)] border border-[var(--border-subtle)] rounded-3xl space-y-2">
              <Sparkle24Regular className="w-8 h-8 text-[var(--text-muted)] mx-auto" />
              <p className="text-xs font-bold text-[var(--text-secondary)]">{t('noGuestsInChair')}</p>
              <p className="text-[11px] text-[var(--text-muted)]">{t('noGuestsInChairSub')}</p>
            </div>
          ) : (
            <div className="space-y-3">
              {inChairGuests.map((guest) => (
                <div
                  key={guest.id}
                  className="p-4 rounded-3xl bg-[var(--bg-primary)] border border-emerald-500/30 space-y-3 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-600 font-black flex items-center justify-center text-sm">
                        {guest.clientName.charAt(0)}
                      </div>
                      <div>
                        <h4 className="text-xs font-extrabold text-[var(--text-primary)]">{guest.clientName}</h4>
                        <p className="text-[11px] text-[var(--text-secondary)] font-medium">{guest.serviceName}</p>
                      </div>
                    </div>

                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 text-[10px] font-extrabold uppercase">
                      {t('statusInChair')}
                    </span>
                  </div>

                  <div className="p-2.5 rounded-2xl bg-black/5 dark:bg-white/5 border border-[var(--border-subtle)] flex items-center justify-between text-xs font-medium">
                    <span className="text-[var(--text-secondary)]">{t('specialistLabel')}:</span>
                    <span className="font-bold text-[var(--text-primary)]">{guest.staffName}</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleUpdateStatus(guest.id, 'completed')}
                    className="w-full py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <CheckmarkCircle24Filled className="w-4 h-4" />
                    <span>{t('markCompleted')}</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Column 2: Waiting in Queue */}
        <div className="lg:col-span-7 space-y-3">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-primary)] flex items-center gap-1.5">
              <Clock24Regular className="w-4 h-4 text-blue-500" />
              <span>{t('statusWaiting')} ({waitingGuests.length})</span>
            </h3>
          </div>

          {waitingGuests.length === 0 ? (
            <div className="p-8 text-center bg-[var(--bg-primary)] border border-[var(--border-subtle)] rounded-3xl space-y-2">
              <CheckmarkCircle24Regular className="w-8 h-8 text-emerald-500 mx-auto" />
              <p className="text-xs font-bold text-[var(--text-primary)]">{t('waitlistClear')}</p>
              <p className="text-[11px] text-[var(--text-secondary)]">{t('waitlistClearSub')}</p>
            </div>
          ) : (
            <div className="bg-[var(--bg-primary)] border border-[var(--border-subtle)] rounded-3xl overflow-hidden divide-y divide-[var(--border-subtle)] shadow-xs">
              {waitingGuests.map((guest, idx) => (
                <div
                  key={guest.id}
                  className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors"
                >
                  <div className="flex items-start sm:items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-600 font-mono font-black flex items-center justify-center text-xs flex-shrink-0">
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
                        {guest.serviceName} · <span className="font-semibold text-blue-600 dark:text-blue-400">{guest.staffName}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    <button
                      type="button"
                      onClick={() => handleSendReadyAlert(guest)}
                      title={t('sendReadyAlert')}
                      className="px-2.5 py-1.5 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <Phone24Filled className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">{t('smsCta')}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleUpdateStatus(guest.id, 'in_chair')}
                      className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1 shadow-xs transition-colors cursor-pointer"
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
      </div>

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
                <div className="p-6 overflow-y-auto space-y-4 flex-1">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-[var(--text-secondary)] block">
                      {t('guestName')} *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Jordan Miller"
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-2xl bg-black/5 dark:bg-white/5 border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-[var(--text-secondary)] block">
                      {t('mobilePhoneAlert')}
                    </label>
                    <input
                      type="tel"
                      placeholder="+1 (555) 234-5678"
                      value={clientPhone}
                      onChange={(e) => setClientPhone(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-2xl bg-black/5 dark:bg-white/5 border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-[var(--text-secondary)] block">
                      {t('selectService')}
                    </label>
                    <CustomSelect
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
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-[var(--text-secondary)] block">
                      {t('preferredSpecialist')}
                    </label>
                    <CustomSelect
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
                </div>

                {/* Side-to-Side Bottom Action Banner */}
                <div className="w-full border-t border-[var(--border-subtle)] bg-[var(--bg-primary)] p-4 sm:p-5 rounded-none flex-shrink-0 z-30 flex items-center justify-end gap-3">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-extrabold text-xs shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer"
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

      {/* ─── MODAL 2: FULLSCREEN IPAD KIOSK MODE ─── */}
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
                onClick={() => setIsIpadKioskOpen(false)}
                className="px-4 py-2 rounded-2xl bg-black/5 dark:bg-white/10 hover:bg-black/10 text-xs font-extrabold text-[var(--text-secondary)] transition-colors cursor-pointer"
              >
                {t('exitKiosk')}
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
                      className="w-1/3 py-3.5 rounded-2xl bg-black/5 dark:bg-white/10 text-xs font-extrabold text-[var(--text-secondary)]"
                    >
                      {t('kioskBack')}
                    </button>
                    <button
                      type="button"
                      onClick={handleAddWalkIn}
                      className="w-2/3 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs shadow-xl flex items-center justify-center gap-2"
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
                    className="w-full py-4 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black text-sm shadow-xl"
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
    </div>
  );
};
