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
} from '@fluentui/react-icons';

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
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/40 backdrop-blur-md"
        />

        {/* Modal Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 350 }}
          className="relative w-full max-w-md bg-white dark:bg-[#141720] border border-slate-200 dark:border-white/10 rounded-3xl shadow-2xl overflow-hidden z-10"
        >
          {/* Top Decorative Header Accent Bar */}
          <div
            className="h-2 w-full"
            style={{ backgroundColor: appointment.color || '#2BB5FF' }}
          />

          <div className="p-6 stack-lg">
            {/* Header Title & Close Button */}
            <div className="flex items-start justify-between">
              <div>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                  {t('statusConfirmed')}
                </span>
                <h3 className="text-xl font-extrabold text-[var(--text-primary)] mt-2 tracking-tight">
                  {appointment.clientName}
                </h3>
                <p className="text-xs font-bold text-[var(--text-secondary)] mt-0.5">
                  {appointment.serviceName}
                </p>
              </div>

              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-black/5 dark:bg-white/10 flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
              >
                <Dismiss24Filled className="w-4 h-4" />
              </button>
            </div>

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
                      {appointment.staffName || 'Eduardo Moreno'}
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

            {/* Action Buttons Grid (Standardized Component Tokens) */}
            <div className="stack-sm">
              {/* Charge POS Button (control-lg token) */}
              <button
                onClick={() => {
                  onClose();
                  onOpenPOS(appointment);
                }}
                className="control-lg w-full rounded-2xl btn-primary flex items-center justify-center gap-2 active:scale-98"
              >
                <Payment24Filled className="w-4 h-4 flex-shrink-0" />
                <span>{t('posCheckout')} (${appointment.price})</span>
              </button>

              <div className="grid grid-cols-2 gap-2">
                {/* Client Notes / Specs (control-md token) */}
                <button
                  onClick={() => {
                    onClose();
                    onOpenNotes();
                  }}
                  className="control-md w-full rounded-xl bg-black/5 dark:bg-white/10 hover:bg-black/10 transition-colors text-xs font-extrabold text-[var(--text-primary)] flex items-center justify-center gap-1.5 truncate"
                >
                  <DocumentText24Filled className="w-4 h-4 text-blue-500 flex-shrink-0" />
                  <span className="truncate">{t('clientNotesBtn')}</span>
                </button>

                {/* Cancel / Delete Appointment (control-md token) */}
                <button
                  onClick={handleDelete}
                  className="control-md w-full rounded-xl bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-500/20 transition-colors text-xs font-extrabold flex items-center justify-center gap-1.5 truncate"
                >
                  <Delete24Filled className="w-4 h-4 flex-shrink-0" />
                  <span className="truncate">{t('delete')}</span>
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
