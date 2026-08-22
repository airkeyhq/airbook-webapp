'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dismiss24Filled, Sparkle24Filled } from '@fluentui/react-icons';
import { CustomSelect } from '@/components/CustomSelect';
import { useAirBookStore } from '@/lib/store';
import { useTranslation } from '@/lib/i18n/useTranslation';

export const BookingDrawer: React.FC = () => {
  const {
    isBookingDrawerOpen,
    closeBookingDrawer,
    selectedSlotTime,
    selectedDateStr,
    services,
    staffMembers,
    addAppointment,
    workspaceId,
  } = useAirBookStore();
  const { t } = useTranslation();

  const storeSelectedStaffId = useAirBookStore((s) => s.selectedStaffId);

  const [clientName, setClientName] = useState('');
  const [selectedServiceId, setSelectedServiceId] = useState(services[0]?.id || '');
  const [selectedStaffId, setSelectedStaffId] = useState(
    storeSelectedStaffId !== 'all' ? storeSelectedStaffId : staffMembers[0]?.id || ''
  );
  const [startTime, setStartTime] = useState(selectedSlotTime || '14:00');
  const [notes, setNotes] = useState('');
  const [selectedColor, setSelectedColor] = useState('#FF4D8D');
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isBookingDrawerOpen) return null;

  const currentService = services.find((s) => s.id === selectedServiceId) || services[0];
  const currentStaff = staffMembers.find((s) => s.id === selectedStaffId) || staffMembers[0];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim()) return;

    setSubmitting(true);
    setErrorMessage(null);

    // Optimistically add to Zustand store
    addAppointment({
      clientName: clientName.trim(),
      serviceId: currentService.id,
      serviceName: currentService.name,
      staffId: currentStaff.id,
      staffName: currentStaff.name,
      dateStr: selectedDateStr,
      startTime: startTime,
      durationMinutes: currentService.durationMinutes,
      price: currentService.price,
      color: selectedColor || currentService.color,
      status: 'confirmed',
      notes: notes,
    });

    try {
      await fetch('/api/bookings/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          workspaceId,
          clientName: clientName.trim(),
          serviceId: currentService.id,
          serviceName: currentService.name,
          staffId: currentStaff.id,
          dateStr: selectedDateStr,
          startTime: startTime,
          durationMinutes: currentService.durationMinutes,
          priceCents: Math.round(currentService.price * 100),
          notes: notes,
        }),
      });
    } catch (err) {
      console.warn('Booking persisted to UI store (DB sync pending):', err);
    } finally {
      setSubmitting(false);
      setClientName('');
      setNotes('');
      closeBookingDrawer();
    }
  };

  const PASTEL_COLORS = ['#FF4D8D', '#00C7BE', '#9D50BB', '#34C759', '#FF9500', '#007AFF'];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[250] flex items-end md:items-center justify-center p-0 md:p-4">
        {/* Dark Translucent Glass Overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeBookingDrawer}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm"
        />

        {/* Drawer Panel Container */}
        <motion.div
          initial={{ y: '100%', opacity: 0.8 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '100%', opacity: 0 }}
          transition={{ type: 'spring', stiffness: 350, damping: 30 }}
          className="relative w-full max-w-lg bg-[var(--bg-primary)] border border-[var(--border-subtle)] rounded-t-[32px] md:rounded-3xl shadow-2xl z-10 flex flex-col max-h-[92vh] md:max-h-[85vh] overflow-hidden"
        >
          <form onSubmit={handleSubmit} className="flex flex-col h-full min-h-0 overflow-hidden">
            {/* Mobile & Tablet Drag Handle */}
            <div className="w-full pt-3 pb-1 flex md:hidden justify-center bg-[var(--bg-primary)] flex-shrink-0">
              <div className="w-12 h-1.5 rounded-full bg-black/20 dark:bg-white/20" />
            </div>

            {/* Header Edge-to-Edge Bar */}
            <div className="w-full px-6 py-4 flex items-center justify-between flex-shrink-0 bg-[var(--bg-primary)]">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-pink-500 animate-pulse" />
                <h2 className="text-base font-extrabold text-[var(--text-primary)]">
                  {t('bookingDrawerTitle')}
                </h2>
              </div>
              <motion.button
                whileTap={{ scale: 0.9 }}
                type="button"
                onClick={closeBookingDrawer}
                className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-[var(--text-muted)] transition-colors"
              >
                <Dismiss24Filled className="w-5 h-5" />
              </motion.button>
            </div>
            <div className="w-full h-[1px] bg-[var(--border-subtle)] flex-shrink-0" />

            {/* Scrollable Form Body */}
            <div className="p-6 overflow-y-auto space-y-4 flex-1">
            {/* Client Name Field */}
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)] mb-1 block">
                {t('fullName')}
              </label>
              <input
                type="text"
                required
                placeholder={t('clientNamePlaceholder')}
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-sm font-medium text-[var(--text-primary)] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Service Selection */}
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)] mb-1.5 block">
                {t('selectService')}
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-40 overflow-y-auto pr-1">
                {services.map((srv) => {
                  const isSelected = selectedServiceId === srv.id;
                  return (
                    <button
                      type="button"
                      key={srv.id}
                      onClick={() => {
                        setSelectedServiceId(srv.id);
                        setSelectedColor(srv.color);
                      }}
                      className={`flex items-center justify-between p-2.5 rounded-xl border text-left transition-all ${
                        isSelected
                          ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 font-semibold shadow-2xs'
                          : 'border-black/5 dark:border-white/5 bg-black/5 dark:bg-white/5 text-[var(--text-primary)]'
                      }`}
                    >
                      <div className="flex items-center gap-2 overflow-hidden">
                        <span
                          className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                          style={{ backgroundColor: srv.color }}
                        />
                        <span className="text-xs truncate">{srv.name}</span>
                      </div>
                      <span className="text-[11px] font-mono text-[var(--text-muted)] flex-shrink-0">
                        ${srv.price}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Staff Selector & Time Picker Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Staff Member */}
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)] mb-1 block">
                  {t('selectStaff')}
                </label>
                <CustomSelect
                  value={selectedStaffId}
                  onChange={setSelectedStaffId}
                  options={staffMembers.map((stf) => ({
                    value: stf.id,
                    label: stf.name,
                    sublabel: stf.role,
                  }))}
                />
              </div>

              {/* Start Time */}
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)] mb-1 block">
                  {t('time')}
                </label>
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-xs font-mono font-medium text-[var(--text-primary)] focus:outline-none"
                />
              </div>
            </div>

            </div>

            {/* Side-to-Side Bottom Action Banner */}
            <div className="w-full border-t border-[var(--border-subtle)] bg-[var(--bg-primary)] p-4 md:p-5 rounded-none flex-shrink-0 z-30">
              <motion.button
                whileTap={{ scale: 0.96 }}
                whileHover={{ scale: 1.01 }}
                type="submit"
                className="w-full py-3.5 rounded-2xl bg-black text-white dark:bg-white dark:text-black font-bold text-xs shadow-md flex items-center justify-center gap-2 transition-all"
              >
                <Sparkle24Filled className="w-4 h-4 text-white dark:text-black" />
                <span>{t('createAppointment')}</span>
              </motion.button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
