'use client';

import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Dismiss24Filled,
  Sparkle24Filled,
  Sparkle24Regular,
  CheckmarkCircle24Filled,
} from '@fluentui/react-icons';
import { CustomSelect } from '@/components/CustomSelect';
import { FloatingInput } from '@/components/FloatingInput';
import { useAirBookStore } from '@/lib/store';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { getAvatarUrl } from '@/lib/avatars';
import type { ClientItem } from '@/components/ClientsModule';

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
    isDemoMode,
  } = useAirBookStore();
  const { t } = useTranslation();

  const storeSelectedStaffId = useAirBookStore((s) => s.selectedStaffId);

  const [clientName, setClientName] = useState('');
  const [selectedClient, setSelectedClient] = useState<ClientItem | null>(null);
  const [suggestions, setSuggestions] = useState<ClientItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  const [selectedServiceId, setSelectedServiceId] = useState(services[0]?.id || '');
  const [selectedStaffId, setSelectedStaffId] = useState(
    storeSelectedStaffId !== 'all' ? storeSelectedStaffId : staffMembers[0]?.id || ''
  );
  const [startTime, setStartTime] = useState(selectedSlotTime || '14:00');
  const [notes, setNotes] = useState('');
  const [selectedColor, setSelectedColor] = useState('#FF4D8D');
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Live debounced search for existing client profiles
  useEffect(() => {
    if (selectedClient && selectedClient.name.toLowerCase() === clientName.trim().toLowerCase()) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const query = clientName.trim();
    if (query.length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await fetch(`/api/clients?query=${encodeURIComponent(query)}`);
        const data = await res.json();
        if (data.success && Array.isArray(data.clients)) {
          setSuggestions(data.clients);
          setShowSuggestions(data.clients.length > 0);
        }
      } catch (err) {
        console.warn('Failed to search clients:', err);
      } finally {
        setIsSearching(false);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [clientName, selectedClient]);

  // Click outside to dismiss suggestions
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentService = services.find((s) => s.id === selectedServiceId) || services[0];
  const currentStaff = staffMembers.find((s) => s.id === selectedStaffId) || staffMembers[0];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim()) return;

    setSubmitting(true);
    setErrorMessage(null);

    // Optimistically add to Zustand store
    addAppointment({
      clientId: selectedClient?.id,
      clientName: clientName.trim(),
      clientAvatar: selectedClient?.avatarUrl || getAvatarUrl(clientName.trim()),
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
          clientId: selectedClient?.id,
          clientName: clientName.trim(),
          clientEmail: selectedClient?.email,
          clientPhone: selectedClient?.phone,
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
      setSelectedClient(null);
      setSuggestions([]);
      setShowSuggestions(false);
      setNotes('');
      closeBookingDrawer();
    }
  };

  const PASTEL_COLORS = ['#FF4D8D', '#00C7BE', '#9D50BB', '#34C759', '#FF9500', '#007AFF'];

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isBookingDrawerOpen && (
        <div className="fixed inset-0 z-[250] flex items-end md:items-center justify-center p-0 md:p-4">
          {/* Dark Translucent Glass Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeBookingDrawer}
            className="fixed inset-0 bg-black/60 backdrop-blur-md"
          />

          {/* Drawer Panel Container */}
          <motion.div
          initial={{ y: '100%', opacity: 0.8 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '100%', opacity: 0 }}
          transition={{ type: 'spring', stiffness: 350, damping: 30 }}
          className="relative w-full md:max-w-lg bg-[var(--bg-primary)] border-t md:border border-[var(--border-subtle)] rounded-t-[32px] md:rounded-3xl rounded-b-none md:rounded-b-3xl shadow-2xl z-10 flex flex-col max-h-[92vh] md:max-h-[85vh] overflow-hidden"
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
            <div className="p-6 pb-10 overflow-y-auto space-y-4 flex-1">
            {/* Client Name Field with Live Suggestions */}
            <div className="relative space-y-2" ref={suggestionsRef}>
              <FloatingInput
                label={t('fullName')}
                type="text"
                required
                placeholder={t('clientNamePlaceholder')}
                value={clientName}
                onChange={(e) => {
                  setClientName(e.target.value);
                  if (selectedClient && selectedClient.name !== e.target.value) {
                    setSelectedClient(null);
                  }
                }}
                onFocus={() => {
                  if (suggestions.length > 0 && !selectedClient) {
                    setShowSuggestions(true);
                  }
                }}
                rightElement={
                  isSearching ? (
                    <div className="w-3.5 h-3.5 border-2 border-[var(--text-muted)]/30 border-t-[#2BB5FF] rounded-full animate-spin" />
                  ) : selectedClient ? (
                    <CheckmarkCircle24Filled className="w-4 h-4 text-emerald-500" />
                  ) : null
                }
              />

              {/* Linked Client Pill / Confirmation */}
              {selectedClient && (
                <div className="flex items-center justify-between gap-2 px-3 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs animate-in fade-in-0 duration-150">
                  <div className="flex items-center gap-2 min-w-0">
                    <img
                      src={selectedClient.avatarUrl || getAvatarUrl(selectedClient.name)}
                      alt={selectedClient.name}
                      className="w-5 h-5 rounded-full object-cover shrink-0"
                    />
                    <span className="font-semibold text-emerald-700 dark:text-emerald-300 truncate">
                      {t('linkedClient')}: {selectedClient.name}
                    </span>
                    <span className="px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold shrink-0">
                      {selectedClient.totalVisits || 0} {t('visitsCount')}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedClient(null)}
                    className="p-1 rounded-md text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20 transition-colors text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <Dismiss24Filled className="w-3 h-3" />
                    <span>{t('unlinkClient')}</span>
                  </button>
                </div>
              )}

              {/* Suggestions Dropdown Popover */}
              {showSuggestions && suggestions.length > 0 && !selectedClient && (
                <div className="absolute z-50 left-0 right-0 top-full mt-1 max-h-60 overflow-y-auto rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-primary)] p-1.5 shadow-xl backdrop-blur-md animate-in fade-in-0 zoom-in-95 duration-150">
                  <div className="px-2.5 py-1.5 flex items-center justify-between text-[10px] font-bold tracking-wider text-[var(--text-muted)] uppercase border-b border-[var(--border-subtle)]/60 pb-1.5 mb-1">
                    <span className="flex items-center gap-1.5 text-[#2BB5FF]">
                      <Sparkle24Regular className="w-3.5 h-3.5" />
                      {t('existingClientSuggestions')}
                    </span>
                    <span className="text-[10px] font-semibold text-[var(--text-muted)] font-mono">{suggestions.length}</span>
                  </div>

                  <div className="divide-y divide-[var(--border-subtle)]/40">
                    {suggestions.map((c) => {
                      const avatarSrc = c.avatarUrl || getAvatarUrl(c.name);
                      return (
                        <button
                          key={c.id}
                          type="button"
                          onClick={() => {
                            setSelectedClient(c);
                            setClientName(c.name);
                            setShowSuggestions(false);
                            if (!notes && c.notes) setNotes(c.notes);
                          }}
                          className="w-full text-left p-2.5 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition-colors flex items-center justify-between gap-3 group cursor-pointer"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <img
                              src={avatarSrc}
                              alt={c.name}
                              className="w-8 h-8 rounded-full object-cover border border-[var(--border-subtle)] shrink-0"
                            />
                            <div className="min-w-0">
                              <div className="flex items-center gap-1.5">
                                <span className="text-xs font-bold text-[var(--text-primary)] group-hover:text-[#2BB5FF] transition-colors truncate">
                                  {c.name}
                                </span>
                                {(c.tags || []).slice(0, 1).map((tag) => (
                                  <span
                                    key={tag}
                                    className="px-1.5 py-0.2 rounded-full bg-black/5 dark:bg-white/5 text-[9px] font-bold text-[var(--text-muted)] uppercase shrink-0"
                                  >
                                    {tag}
                                  </span>
                                ))}
                              </div>
                              <div className="text-[11px] text-[var(--text-secondary)] truncate">
                                {c.email || c.phone || '—'}
                              </div>
                            </div>
                          </div>

                          <div className="shrink-0 flex items-center gap-1.5">
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#2BB5FF]/10 text-[#2BB5FF]">
                              {c.totalVisits || 0} {t('visitsCount')}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Service Selection */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)] block">
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
                      className={`flex items-center justify-between p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {/* Staff Member */}
              <CustomSelect
                label={t('selectStaff')}
                value={selectedStaffId}
                onChange={setSelectedStaffId}
                options={staffMembers.map((stf) => ({
                  value: stf.id,
                  label: stf.name,
                  sublabel: stf.role,
                }))}
              />

              {/* Start Time */}
              <FloatingInput
                label={t('time')}
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="font-mono"
              />
            </div>

            </div>

            {/* Side-to-Side Bottom Action Banner */}
            <div className="w-full border-t border-[var(--border-subtle)] bg-[var(--bg-primary)] p-4 md:p-5 rounded-none flex-shrink-0 z-30">
              <motion.button
                whileTap={{ scale: 0.96 }}
                type="submit"
                className="btn-primary w-full"
              >
                <Sparkle24Filled className="w-4 h-4" />
                <span>{t('createAppointment')}</span>
              </motion.button>
            </div>
          </form>
        </motion.div>
      </div>
      )}
    </AnimatePresence>,
    document.body
  );
};
