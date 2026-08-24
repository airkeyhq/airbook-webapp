'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Appointment, useAirBookStore } from '@/lib/store';
import { useTranslation } from '@/lib/i18n/useTranslation';
import {
  Dismiss24Filled,
  Clock24Filled,
  Person24Filled,
  Payment24Filled,
  DocumentText24Filled,
  Delete24Filled,
  PeopleTeam24Regular,
} from '@fluentui/react-icons';

interface PartyGuestRow {
  id: string;
  startTime: string;
  client?: { name?: string | null } | null;
  service?: { name?: string | null; colorTag?: string | null } | null;
  staff?: { name?: string | null } | null;
}

interface AppointmentDetailsModalProps {
  appointment: Appointment | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenPOS: (apt: Appointment) => void;
  onOpenNotes: () => void;
}

export const AppointmentDetailsModal: React.FC<AppointmentDetailsModalProps> = ({
  appointment,
  isOpen,
  onClose,
  onOpenPOS,
  onOpenNotes,
}) => {
  const { deleteAppointment } = useAirBookStore();
  const { t } = useTranslation();
  const [partyGuests, setPartyGuests] = React.useState<PartyGuestRow[]>([]);

  React.useEffect(() => {
    if (!appointment?.groupId) {
      setPartyGuests([]);
      return;
    }
    let cancelled = false;
    fetch(`/api/appointments?groupId=${appointment.groupId}`)
      .then((r) => r.json())
      .then((data) => {
        if (!cancelled && data.success && Array.isArray(data.appointments)) {
          setPartyGuests(data.appointments);
        }
      })
      .catch((e) => console.warn('Failed to load party guests:', e));
    return () => {
      cancelled = true;
    };
  }, [appointment?.groupId]);

  if (!isOpen || !appointment) return null;

  const handleDelete = async () => {
    deleteAppointment(appointment.id);
    try {
      await fetch(`/api/appointments?id=${appointment.id}`, { method: 'DELETE' });
    } catch (err) {
      console.warn('Failed to delete appointment from DB:', err);
    }
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[250] flex items-end md:items-center justify-center p-0 md:p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm"
        />

        {/* Modal Card Container */}
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 30, scale: 0.98 }}
          transition={{ type: 'spring', damping: 28, stiffness: 380 }}
          className="relative w-full md:max-w-md bg-[var(--bg-primary)] border-t md:border border-[var(--border-subtle)] rounded-t-[32px] md:rounded-3xl rounded-b-none md:rounded-b-3xl shadow-2xl overflow-hidden z-10 flex flex-col max-h-[92vh] md:max-h-[85vh]"
        >
          {/* Top Decorative Header Accent Bar */}
          <div
            className="h-2 w-full"
            style={{ backgroundColor: appointment.color || '#2BB5FF' }}
          />

          {/* Mobile & Tablet Drag Handle */}
          <div className="w-full pt-3 pb-1 flex md:hidden justify-center bg-[var(--bg-primary)] flex-shrink-0">
            <div className="w-12 h-1.5 rounded-full bg-black/20 dark:bg-white/20" />
          </div>

          {/* Header Edge-to-Edge Bar */}
          <div className="w-full px-6 py-4 flex items-start justify-between flex-shrink-0 bg-[var(--bg-primary)]">
            <div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                  {t('statusConfirmed')}
                </span>
                {partyGuests.length > 1 && (
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 flex items-center gap-1">
                    <PeopleTeam24Regular className="w-3 h-3" />
                    {t('partyOf')} {partyGuests.length}
                  </span>
                )}
              </div>
              <h3 className="text-xl font-extrabold text-[var(--text-primary)] mt-2 tracking-tight">
                {appointment.clientName}
              </h3>
              <p className="text-xs font-bold text-[var(--text-secondary)] mt-0.5">
                {appointment.serviceName}
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-[var(--text-muted)] transition-colors"
            >
              <Dismiss24Filled className="w-5 h-5" />
            </button>
          </div>
          <div className="w-full h-[1px] bg-[var(--border-subtle)] flex-shrink-0" />

          {/* Scrollable Body */}
          <div className="p-6 flex-1 overflow-y-auto space-y-5">

            {/* Info Grid Card */}
            <div className="p-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 stack-md">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center flex-shrink-0">
                  <Clock24Filled className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
                    {t('timeAndDuration')}
                  </p>
                  <p className="text-xs font-mono font-black text-[var(--text-primary)] mt-0.5">
                    {appointment.startTime} ({appointment.durationMinutes} min)
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-black/5 dark:border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center flex-shrink-0">
                    <Person24Filled className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
                      {t('specialist')}
                    </p>
                    <p className="text-xs font-bold text-[var(--text-primary)] mt-0.5">
                      {appointment.staffName || ''}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
                    {t('price')}
                  </p>
                  <p className="text-sm font-black text-emerald-600 dark:text-emerald-400 mt-0.5">
                    ${appointment.price}
                  </p>
                </div>
              </div>
            </div>

            {/* Party Guest List */}
            {partyGuests.length > 1 && (
              <div className="rounded-2xl border border-black/5 dark:border-white/10 divide-y divide-[var(--border-subtle)] overflow-hidden">
                <div className="px-4 py-2.5 bg-purple-500/5 flex items-center gap-2">
                  <PeopleTeam24Regular className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                  <p className="text-[10px] font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">
                    {t('guestParty')}
                  </p>
                </div>
                {partyGuests.map((g) => (
                  <div key={g.id} className="px-4 py-3 flex items-center justify-between gap-3">
                    <div>
                      <p className="text-xs font-bold text-[var(--text-primary)]">{g.client?.name || '—'}</p>
                      <p className="text-[10px] text-[var(--text-secondary)] mt-0.5">
                        {g.service?.name} · {g.staff?.name}
                      </p>
                    </div>
                    <span className="text-[10px] font-mono font-bold text-[var(--text-secondary)] flex-shrink-0">
                      {g.startTime}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Side-to-Side Bottom Action Banner with Vertical Stacking */}
          <div className="w-full border-t border-[var(--border-subtle)] bg-[var(--bg-primary)] p-4 sm:p-5 flex flex-col gap-2.5 rounded-none flex-shrink-0 z-30">
            {/* Charge POS Button */}
            <motion.button
              whileTap={{ scale: 0.96 }}
              onClick={() => {
                onClose();
                onOpenPOS(appointment);
              }}
              className="btn-primary w-full"
            >
              <Payment24Filled className="w-4 h-4 flex-shrink-0" />
              <span>{t('posCheckout')} (${appointment.price})</span>
            </motion.button>

            {/* Client Notes & Specs Button */}
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenNotes();
              }}
              className="btn-secondary w-full"
            >
              <DocumentText24Filled className="w-4 h-4 text-blue-500 flex-shrink-0" />
              <span>{t('clientNotesBtn')}</span>
            </button>

            {/* Delete Appointment Button */}
            <button
              type="button"
              onClick={handleDelete}
              className="w-full py-2.5 rounded-2xl bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Delete24Filled className="w-4 h-4 flex-shrink-0" />
              <span>{t('delete')}</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
