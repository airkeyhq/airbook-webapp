'use client';

import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Dismiss24Filled,
  Sparkle24Filled,
  Sparkle24Regular,
  CheckmarkCircle24Filled,
  Add24Filled,
  Delete24Filled,
  PeopleTeam24Regular,
} from '@fluentui/react-icons';
import { Icon } from '@/components/primitives/Icon';
import { CustomSelect } from '@/components/CustomSelect';
import { FloatingInput } from '@/components/FloatingInput';
import { useAirBookStore } from '@/lib/store';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { useToast } from '@/components/Toast';
import { getAvatarUrl } from '@/lib/avatars';
import type { ClientItem } from '@/components/ClientsModule';

interface ExtraGuestRow {
  id: string;
  guestName: string;
  serviceId: string;
  staffId: string;
}

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
  const { addToast } = useToast();

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
  const [extraGuests, setExtraGuests] = useState<ExtraGuestRow[]>([]);
  const [selectedAddonIds, setSelectedAddonIds] = useState<string[]>([]);
  const [repeatInterval, setRepeatInterval] = useState<'none' | 'weekly' | 'biweekly' | 'monthly'>('none');
  const [repeatCount, setRepeatCount] = useState<number>(3);
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

  const handleAddExtraGuest = () => {
    if (extraGuests.length >= 5) return;
    setExtraGuests((prev) => [
      ...prev,
      {
        id: `eg-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`,
        guestName: '',
        serviceId: currentService?.id || services[0]?.id || '',
        staffId: staffMembers[Math.min(prev.length + 1, Math.max(0, staffMembers.length - 1))]?.id || currentStaff?.id || '',
      },
    ]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim()) return;

    setSubmitting(true);
    setErrorMessage(null);

    const selectedAddons = services.filter((s) => selectedAddonIds.includes(s.id) && s.id !== currentService.id);
    const addonDuration = selectedAddons.reduce((sum, a) => sum + a.durationMinutes, 0);
    const addonPrice = selectedAddons.reduce((sum, a) => sum + a.price, 0);
    const combinedNotes = [
      notes.trim(),
      selectedAddons.length > 0 ? `Add-ons: ${selectedAddons.map((a) => a.name).join(', ')}` : '',
    ]
      .filter(Boolean)
      .join(' · ');

    const allGuests = [
      {
        guestName: clientName.trim(),
        serviceId: currentService.id,
        serviceName:
          selectedAddons.length > 0
            ? `${currentService.name} + ${selectedAddons.map((a) => a.name).join(', ')}`
            : currentService.name,
        staffId: currentStaff.id,
        staffName: currentStaff.name,
        durationMinutes: currentService.durationMinutes + addonDuration,
        price: currentService.price + addonPrice,
        priceCents: Math.round((currentService.price + addonPrice) * 100),
        startTime,
        color: selectedColor || currentService.color,
      },
      ...extraGuests.map((eg, idx) => {
        const srv = services.find((s) => s.id === eg.serviceId) || currentService;
        const stf = staffMembers.find((st) => st.id === eg.staffId) || currentStaff;
        return {
          guestName: eg.guestName.trim() || `${clientName.trim()} (${t('partyGuestLabel')} ${idx + 2})`,
          serviceId: srv.id,
          serviceName: srv.name,
          staffId: stf.id,
          staffName: stf.name,
          durationMinutes: srv.durationMinutes,
          price: srv.price,
          priceCents: Math.round(srv.price * 100),
          startTime,
          color: srv.color || selectedColor,
        };
      }),
    ];

    const intervalDays =
      repeatInterval === 'weekly' ? 7 : repeatInterval === 'biweekly' ? 14 : repeatInterval === 'monthly' ? 28 : 0;
    const totalOccurrences = intervalDays > 0 ? Math.max(2, Math.min(8, repeatCount)) : 1;
    const targetDates = Array.from({ length: totalOccurrences }, (_, idx) => {
      const base = new Date(`${selectedDateStr}T12:00:00`);
      base.setDate(base.getDate() + idx * intervalDays);
      return base.toISOString().slice(0, 10);
    });

    // Optimistically add each guest appointment across all recurring dates
    for (const targetDate of targetDates) {
      const optimisticGroupId = allGuests.length > 1 ? `grp-${Date.now()}-${targetDate}` : null;
      for (const g of allGuests) {
        addAppointment({
          clientId: selectedClient?.id,
          clientName: g.guestName,
          clientAvatar: selectedClient?.avatarUrl || getAvatarUrl(g.guestName),
          serviceId: g.serviceId,
          serviceName: g.serviceName,
          staffId: g.staffId,
          staffName: g.staffName,
          dateStr: targetDate,
          startTime: g.startTime,
          durationMinutes: g.durationMinutes,
          price: g.price,
          color: g.color,
          status: 'confirmed',
          notes: combinedNotes,
          groupId: optimisticGroupId,
          partySize: allGuests.length,
        });
      }
    }

    try {
      for (const targetDate of targetDates) {
        await fetch('/api/bookings/create', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            workspaceId,
            clientId: selectedClient?.id,
            clientName: clientName.trim(),
            clientEmail: selectedClient?.email,
            clientPhone: selectedClient?.phone,
            dateStr: targetDate,
            startTime,
            notes: combinedNotes,
            guests: allGuests.map((g) => ({
              guestName: g.guestName,
              staffId: g.staffId,
              serviceId: g.serviceId,
              durationMinutes: g.durationMinutes,
              priceCents: g.priceCents,
              startTime: g.startTime,
            })),
          }),
        });
      }
      if (allGuests.length > 1) {
        addToast(t('partyBookingCreatedToast'), 'success');
      }
    } catch (err) {
      console.warn('Booking persisted to UI store (DB sync pending):', err);
    } finally {
      setSubmitting(false);
      setClientName('');
      setSelectedClient(null);
      setSuggestions([]);
      setShowSuggestions(false);
      setNotes('');
      setExtraGuests([]);
      setSelectedAddonIds([]);
      setRepeatInterval('none');
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
                <Icon filled={Dismiss24Filled} size="lg" />
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
                    <Icon filled={CheckmarkCircle24Filled} size="md" tone="success" />
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
                    <Icon filled={Dismiss24Filled} size="xs" />
                    <span>{t('unlinkClient')}</span>
                  </button>
                </div>
              )}

              {/* Suggestions Dropdown Popover */}
              {showSuggestions && suggestions.length > 0 && !selectedClient && (
                <div className="absolute z-50 left-0 right-0 top-full mt-1 max-h-60 overflow-y-auto rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-primary)] p-1.5 shadow-xl backdrop-blur-md animate-in fade-in-0 zoom-in-95 duration-150">
                  <div className="px-2.5 py-1.5 flex items-center justify-between text-[10px] font-bold tracking-wider text-[var(--text-muted)] uppercase border-b border-[var(--border-subtle)]/60 pb-1.5 mb-1">
                    <span className="flex items-center gap-1.5 text-[#2BB5FF]">
                      <Icon regular={Sparkle24Regular} size="sm" />
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
              <CustomSelect
                label={t('time')}
                value={startTime}
                onChange={setStartTime}
                options={Array.from({ length: 25 }, (_, i) => {
                  const totalMins = 8 * 60 + i * 30;
                  const h = Math.floor(totalMins / 60);
                  const m = totalMins % 60;
                  const val = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
                  const hour12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
                  const ampm = h >= 12 ? 'PM' : 'AM';
                  return {
                    value: val,
                    label: `${hour12}:${String(m).padStart(2, '0')} ${ampm}`,
                  };
                })}
              />
            </div>

            {/* Multi-Guest Party Builder */}
            <div className="space-y-2.5 pt-2 border-t border-[var(--border-subtle)]">
              {extraGuests.map((eg, idx) => (
                <div
                  key={eg.id}
                  className="p-3 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] space-y-2.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-secondary)] flex items-center gap-1.5">
                      <Icon regular={PeopleTeam24Regular} size="xs" />
                      {t('partyGuestLabel')} {idx + 2}
                    </span>
                    <button
                      type="button"
                      onClick={() => setExtraGuests((prev) => prev.filter((item) => item.id !== eg.id))}
                      className="p-1 rounded-lg text-[var(--text-muted)] hover:text-rose-500 transition-colors"
                    >
                      <Icon filled={Delete24Filled} size="xs" />
                    </button>
                  </div>

                  <input
                    type="text"
                    placeholder={t('partyGuestNameOptional')}
                    value={eg.guestName}
                    onChange={(e) =>
                      setExtraGuests((prev) =>
                        prev.map((item) => (item.id === eg.id ? { ...item, guestName: e.target.value } : item))
                      )
                    }
                    className="input-base w-full text-xs"
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <CustomSelect
                      value={eg.serviceId}
                      onChange={(val) =>
                        setExtraGuests((prev) =>
                          prev.map((item) => (item.id === eg.id ? { ...item, serviceId: val } : item))
                        )
                      }
                      options={services.map((s) => ({
                        value: s.id,
                        label: `${s.name} ($${s.price})`,
                      }))}
                    />
                    <CustomSelect
                      value={eg.staffId}
                      onChange={(val) =>
                        setExtraGuests((prev) =>
                          prev.map((item) => (item.id === eg.id ? { ...item, staffId: val } : item))
                        )
                      }
                      options={staffMembers.map((st) => ({
                        value: st.id,
                        label: st.name,
                      }))}
                    />
                  </div>
                </div>
              ))}

              {extraGuests.length < 5 && (
                <button
                  type="button"
                  onClick={handleAddExtraGuest}
                  className="btn-secondary w-full h-9 text-xs font-bold flex items-center justify-center gap-1.5"
                >
                  <Icon filled={Add24Filled} size="xs" />
                  <span>{t('addPartyGuestBtn')}</span>
                </button>
              )}
            </div>

            {/* Service Add-Ons */}
            {services.length > 1 && (
              <div className="space-y-1.5 pt-2 border-t border-[var(--border-subtle)]">
                <label className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)] block">
                  {t('addonsLabel')}
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {services
                    .filter((s) => s.id !== currentService?.id)
                    .map((addon) => {
                      const active = selectedAddonIds.includes(addon.id);
                      return (
                        <button
                          key={addon.id}
                          type="button"
                          onClick={() =>
                            setSelectedAddonIds((prev) =>
                              active ? prev.filter((id) => id !== addon.id) : [...prev, addon.id]
                            )
                          }
                          className={`px-2.5 py-1 rounded-xl text-[11px] font-bold border transition-all cursor-pointer ${
                            active
                              ? 'bg-[#2BB5FF]/15 text-[#2BB5FF] border-[#2BB5FF]/40'
                              : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] border-[var(--border-subtle)]'
                          }`}
                        >
                          + {addon.name} (${addon.price})
                        </button>
                      );
                    })}
                </div>
              </div>
            )}

            {/* Recurring Appointment */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-[var(--border-subtle)]">
              <CustomSelect
                label={t('repeatLabel')}
                value={repeatInterval}
                onChange={(v) => setRepeatInterval(v as any)}
                options={[
                  { value: 'none', label: t('repeatNone') },
                  { value: 'weekly', label: t('repeatWeekly') },
                  { value: 'biweekly', label: t('repeatBiweekly') },
                  { value: 'monthly', label: t('repeatMonthly') },
                ]}
              />
              {repeatInterval !== 'none' && (
                <CustomSelect
                  label={t('occurrencesLabel')}
                  value={String(repeatCount)}
                  onChange={(v) => setRepeatCount(Number(v))}
                  options={[2, 3, 4, 5, 6, 8].map((n) => ({
                    value: String(n),
                    label: `${n}x`,
                  }))}
                />
              )}
            </div>

            </div>

            {/* Side-to-Side Bottom Action Banner */}
            <div className="w-full border-t border-[var(--border-subtle)] bg-[var(--bg-primary)] p-4 md:p-5 rounded-none flex-shrink-0 z-30">
              <motion.button
                whileTap={{ scale: 0.96 }}
                type="submit"
                className="btn-primary w-full"
              >
                <Icon filled={Sparkle24Filled} size="md" />
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
