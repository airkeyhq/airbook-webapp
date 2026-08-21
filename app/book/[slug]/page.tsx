'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format, addDays, isSameDay } from 'date-fns';
import { useAirBookStore } from '@/lib/store';
import { signIn } from '@/lib/auth-client';
import GoogleColor from '@lobehub/icons/es/Google/components/Color';
import {
  Cut24Regular,
  Clock24Regular,
  Money24Regular,
  Calendar24Filled,
  Calendar24Regular,
  Person24Regular,
  CheckmarkCircle24Regular,
  CheckmarkCircle24Filled,
  Sparkle24Regular,
  ArrowLeft24Filled,
  ArrowRight24Filled,
  Shield24Regular,
  Phone24Regular,
  Location24Regular,
  Add24Filled,
  Dismiss24Filled,
  PeopleTeam24Regular,
  ChevronDown24Regular,
} from '@fluentui/react-icons';

interface PublicService {
  id: string;
  name: string;
  durationMinutes: number;
  price: number;
  color: string;
  category: string;
}

interface PublicStaff {
  id: string;
  name: string;
  role: string;
  avatar: string;
}

interface Guest {
  id: string;
  name: string;
  serviceId: string;
  staffId: string;
}

let guestSeq = 0;
function newGuestId() {
  guestSeq += 1;
  return `guest-${Date.now()}-${guestSeq}`;
}

export default function PublicBookingPage({ params }: { params: Promise<{ slug?: string }> }) {
  const unwrappedParams = React.use(params);
  const slug = unwrappedParams?.slug || 'default';
  const { workspaceName, addAppointment } = useAirBookStore();

  const [dbServices, setDbServices] = useState<PublicService[]>([]);
  const [dbStaff, setDbStaff] = useState<PublicStaff[]>([]);
  const [loadingDb, setLoadingDb] = useState(true);
  const [workspace, setWorkspace] = useState<{ id: string; name: string } | null>(null);
  const [workspaceNotFound, setWorkspaceNotFound] = useState(false);

  // Booking Flow Steps: 1 = Build your party, 2 = Date & Time, 3 = Confirm & Contact
  const [step, setStep] = useState<1 | 2 | 3>(1);

  const [guests, setGuests] = useState<Guest[]>([]);
  const [pickerFor, setPickerFor] = useState<{ guestId: string; field: 'service' | 'staff' } | null>(null);

  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedSlotTime, setSelectedSlotTime] = useState<string>('');
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  React.useEffect(() => {
    async function loadPublicData() {
      try {
        setLoadingDb(true);

        const wsRes = await fetch(`/api/workspaces?slug=${encodeURIComponent(slug)}`)
          .then((r) => r.json())
          .catch(() => ({}));

        if (!wsRes.success || !wsRes.workspace) {
          setWorkspaceNotFound(true);
          setLoadingDb(false);
          return;
        }

        const ws = { id: wsRes.workspace.id, name: wsRes.workspace.name };
        setWorkspace(ws);

        const [srvRes, stfRes] = await Promise.all([
          fetch(`/api/services?workspaceId=${ws.id}`).then((r) => r.json()).catch(() => ({})),
          fetch(`/api/staff?workspaceId=${ws.id}`).then((r) => r.json()).catch(() => ({})),
        ]);

        let mappedSrvs: PublicService[] = [];
        let mappedStaff: PublicStaff[] = [];

        if (srvRes.success && Array.isArray(srvRes.services)) {
          mappedSrvs = srvRes.services.map((s: any) => ({
            id: s.id,
            name: s.name,
            durationMinutes: s.durationMinutes,
            price: (s.priceCents || 0) / 100,
            color: s.colorTag || '#00C7BE',
            category: s.category || 'Service',
          }));
          setDbServices(mappedSrvs);
        }

        if (stfRes.success && Array.isArray(stfRes.staff)) {
          mappedStaff = stfRes.staff.map((s: any) => ({
            id: s.id,
            name: s.name,
            role: s.role,
            avatar: s.avatarEmoji || '👨🏻‍🎨',
          }));
          setDbStaff(mappedStaff);
        }

        if (mappedSrvs.length > 0 && mappedStaff.length > 0) {
          setGuests([{ id: newGuestId(), name: '', serviceId: mappedSrvs[0].id, staffId: mappedStaff[0].id }]);
        }
      } catch (e) {
        console.warn('Error loading public booking data:', e);
      } finally {
        setLoadingDb(false);
      }
    }
    loadPublicData();
  }, [slug]);

  const services = dbServices;
  const staffMembers = dbStaff;

  const serviceById = (id: string) => services.find((s) => s.id === id);
  const staffById = (id: string) => staffMembers.find((s) => s.id === id);

  const DATE_OPTIONS = Array.from({ length: 7 }, (_, i) => addDays(new Date(), i));
  const isParty = guests.length > 1;
  const partyTotal = guests.reduce((sum, g) => sum + (serviceById(g.serviceId)?.price || 0), 0);

  function addGuest() {
    if (services.length === 0 || staffMembers.length === 0) return;
    setGuests((gs) => [...gs, { id: newGuestId(), name: '', serviceId: services[0].id, staffId: staffMembers[0].id }]);
  }

  function removeGuest(id: string) {
    setGuests((gs) => (gs.length > 1 ? gs.filter((g) => g.id !== id) : gs));
  }

  function updateGuest(id: string, patch: Partial<Guest>) {
    setGuests((gs) => gs.map((g) => (g.id === id ? { ...g, ...patch } : g)));
  }

  // Load real availability whenever the party or date changes — intersected across every staff member the party needs
  React.useEffect(() => {
    async function loadAvailability() {
      if (guests.length === 0) return;
      setLoadingSlots(true);
      setAvailableSlots([]);
      try {
        const neededByStaff = new Map<string, number>();
        for (const g of guests) {
          const duration = serviceById(g.serviceId)?.durationMinutes || 30;
          neededByStaff.set(g.staffId, Math.max(neededByStaff.get(g.staffId) || 0, duration));
        }

        const dateStr = format(selectedDate, 'yyyy-MM-dd');
        const perStaffSlots = await Promise.all(
          Array.from(neededByStaff.entries()).map(async ([staffId, durationMinutes]) => {
            const params = new URLSearchParams({ staffId, dateStr, durationMinutes: String(durationMinutes) });
            const res = await fetch(`/api/availability?${params.toString()}`);
            const data = await res.json();
            return Array.isArray(data.slots) ? (data.slots as string[]) : [];
          })
        );

        const intersected = perStaffSlots.reduce(
          (acc, slots) => acc.filter((t) => slots.includes(t)),
          perStaffSlots[0] || []
        );

        setAvailableSlots(intersected);
        setSelectedSlotTime((prev) => (intersected.includes(prev) ? prev : intersected[0] || ''));
      } catch (e) {
        console.warn('Error loading availability:', e);
        setAvailableSlots([]);
      } finally {
        setLoadingSlots(false);
      }
    }
    if (step === 2) loadAvailability();
  }, [step, guests, selectedDate]);

  const handleConfirmBooking = async () => {
    if (!clientName.trim() || !clientEmail.trim() || !selectedSlotTime || submitting) return;
    setSubmitting(true);
    setBookingError(null);

    try {
      const res = await fetch('/api/bookings/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          workspaceId: workspace?.id,
          dateStr: format(selectedDate, 'yyyy-MM-dd'),
          startTime: selectedSlotTime,
          clientName: clientName.trim(),
          clientEmail: clientEmail.trim(),
          clientPhone: clientPhone.trim(),
          notes: `Public online booking via /book/${slug}`,
          guests: guests.map((g) => {
            const srv = serviceById(g.serviceId);
            return {
              guestName: g.name.trim() || undefined,
              staffId: g.staffId,
              serviceId: g.serviceId,
              durationMinutes: srv?.durationMinutes || 30,
              priceCents: Math.round((srv?.price || 0) * 100),
            };
          }),
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok && data.success) {
        for (const g of guests) {
          const srv = serviceById(g.serviceId);
          const stf = staffById(g.staffId);
          addAppointment({
            clientName: g.name.trim() || clientName.trim(),
            serviceId: g.serviceId,
            serviceName: srv?.name || '',
            staffId: g.staffId,
            staffName: stf?.name || '',
            dateStr: format(selectedDate, 'yyyy-MM-dd'),
            startTime: selectedSlotTime,
            durationMinutes: srv?.durationMinutes || 30,
            price: srv?.price || 0,
            color: srv?.color || '#007AFF',
            status: 'confirmed',
            notes: `Booked via Public Web Link. Phone: ${clientPhone}`,
            groupId: data.groupId || null,
            partySize: guests.length,
          });
        }
        setIsSuccess(true);
      } else {
        setBookingError(data.error || 'One of these time slots may have just been taken. Please pick another.');
      }
    } catch (e) {
      console.error('Error creating public booking:', e);
      setBookingError('Something went wrong saving your booking. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (workspaceNotFound) {
    return (
      <div className="min-h-screen bg-[var(--canvas-bg)] text-[var(--canvas-fg)] flex flex-col items-center justify-center p-6 text-center gap-3">
        <h1 className="text-lg font-bold text-[var(--text-primary)]">Booking page not found</h1>
        <p className="text-xs text-[var(--text-secondary)] max-w-sm">
          We couldn&apos;t find a business at this link. Double-check the URL, or ask the business for their correct booking link.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--canvas-bg)] text-[var(--canvas-fg)] flex flex-col items-center justify-start p-4 sm:p-6 relative">
      {/* Background Glass Blobs */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-1/3 w-80 h-80 bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Booking Container */}
      <div className="w-full max-w-xl glass-panel rounded-[32px] p-6 shadow-2xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-3xl border border-white/80 dark:border-white/10 z-10 relative mt-4 sm:mt-8">

        {/* Workspace Brand Header */}
        <div className="flex items-center justify-between pb-6 border-b border-black/5 dark:border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-500 to-pink-500 text-white flex items-center justify-center font-bold text-lg shadow-md">
              A
            </div>
            <div>
              <h1 className="text-base font-bold text-[var(--text-primary)]">
                {workspace?.name || workspaceName}
              </h1>
              <p className="text-xs text-[var(--text-secondary)] flex items-center gap-1 mt-0.5">
                <Location24Regular className="w-3 h-3" />
                <span>Downtown District • Instant Web Booking</span>
              </p>
            </div>
          </div>

          <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20">
            Open
          </span>
        </div>

        {/* Progress Step Indicator */}
        {!isSuccess && (
          <div className="flex items-center justify-between py-4 border-b border-black/5 dark:border-white/5 text-xs font-semibold text-[var(--text-secondary)]">
            <div className="flex items-center gap-1.5">
              {step > 1 && (
                <button
                  onClick={() => setStep((s) => (s - 1) as any)}
                  className="p-1 rounded-full hover:bg-black/5 dark:hover:bg-white/10 mr-1"
                >
                  <ArrowLeft24Filled className="w-4 h-4" />
                </button>
              )}
              <span>Step {step} of 3</span>
            </div>
            <span className="text-blue-600 dark:text-blue-400 font-bold">
              {step === 1 && 'Build Your Party'}
              {step === 2 && 'Pick Date & Time'}
              {step === 3 && 'Confirm & Contact'}
            </span>
          </div>
        )}

        {/* Success View */}
        {isSuccess ? (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="py-10 text-center flex flex-col items-center gap-4"
          >
            <div className="w-16 h-16 rounded-full bg-green-500/20 text-green-500 flex items-center justify-center">
              <CheckmarkCircle24Regular className="w-10 h-10 stroke-[2.5]" />
            </div>
            <h2 className="text-xl font-bold text-[var(--text-primary)]">
              {isParty ? 'Party Booked!' : 'Appointment Confirmed!'}
            </h2>
            <p className="text-xs text-[var(--text-secondary)] max-w-sm">
              {isParty ? (
                <>Your party of <strong className="text-[var(--text-primary)]">{guests.length}</strong> is booked for <strong className="text-[var(--text-primary)]">{format(selectedDate, 'EEEE, MMM d')} at {selectedSlotTime}</strong>.</>
              ) : (
                <>Your booking for <strong className="text-[var(--text-primary)]">{serviceById(guests[0]?.serviceId)?.name}</strong> with <strong className="text-[var(--text-primary)]">{staffById(guests[0]?.staffId)?.name}</strong> on <strong className="text-[var(--text-primary)]">{format(selectedDate, 'EEEE, MMM d')} at {selectedSlotTime}</strong> has been saved.</>
              )}
            </p>
            <div className="p-4 rounded-2xl bg-black/5 dark:bg-white/5 text-xs text-left w-full space-y-2 mt-2">
              <div className="flex justify-between">
                <span className="text-[var(--text-secondary)]">Booked by:</span>
                <span className="font-bold text-[var(--text-primary)]">{clientName} ({clientPhone})</span>
              </div>
              {isParty && (
                <div className="space-y-1 pt-1 border-t border-black/5 dark:border-white/10">
                  {guests.map((g, i) => (
                    <div key={g.id} className="flex justify-between">
                      <span className="text-[var(--text-secondary)]">{g.name.trim() || `Guest ${i + 1}`}</span>
                      <span className="font-semibold text-[var(--text-primary)]">{serviceById(g.serviceId)?.name} · {staffById(g.staffId)?.name}</span>
                    </div>
                  ))}
                </div>
              )}
              <div className="flex justify-between pt-1 border-t border-black/5 dark:border-white/10">
                <span className="text-[var(--text-secondary)]">Total Due:</span>
                <span className="font-bold text-[var(--text-primary)]">${partyTotal}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--text-secondary)]">Payment:</span>
                <span className="font-bold text-[var(--text-primary)]">Due at the shop</span>
              </div>
            </div>
            <button
              onClick={() => {
                setIsSuccess(false);
                setStep(1);
                setClientName('');
                setClientEmail('');
                setClientPhone('');
                if (services.length > 0 && staffMembers.length > 0) {
                  setGuests([{ id: newGuestId(), name: '', serviceId: services[0].id, staffId: staffMembers[0].id }]);
                }
              }}
              className="mt-4 px-6 py-2.5 rounded-2xl bg-black text-white dark:bg-white dark:text-black font-semibold text-xs shadow-md"
            >
              Book Another Appointment
            </button>
          </motion.div>
        ) : (
          <div className="py-4">
            {/* Step 1: Build Your Party */}
            {step === 1 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] flex items-center gap-1.5">
                    <PeopleTeam24Regular className="w-3.5 h-3.5" />
                    {isParty ? `Your Party (${guests.length})` : 'Who Is This Booking For?'}
                  </h3>
                </div>

                <div className="space-y-3 max-h-[26rem] overflow-y-auto pr-1">
                  {guests.map((guest, idx) => {
                    const srv = serviceById(guest.serviceId);
                    const stf = staffById(guest.staffId);
                    return (
                      <div key={guest.id} className="p-3.5 rounded-2xl border border-black/5 dark:border-white/5 bg-black/5 dark:bg-white/5 space-y-2.5">
                        <div className="flex items-center justify-between gap-2">
                          <input
                            type="text"
                            placeholder={`Guest ${idx + 1} name (optional)`}
                            value={guest.name}
                            onChange={(e) => updateGuest(guest.id, { name: e.target.value })}
                            className="flex-1 min-w-0 px-3 py-2 rounded-xl bg-white/70 dark:bg-black/20 border border-black/10 dark:border-white/10 text-xs font-semibold text-[var(--text-primary)] focus:outline-none"
                          />
                          {guests.length > 1 && (
                            <button
                              onClick={() => removeGuest(guest.id)}
                              className="p-2 rounded-full hover:bg-black/10 dark:hover:bg-white/10 text-[var(--text-secondary)] flex-shrink-0"
                              aria-label="Remove guest"
                            >
                              <Dismiss24Filled className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>

                        <button
                          onClick={() => setPickerFor((p) => (p?.guestId === guest.id && p.field === 'service' ? null : { guestId: guest.id, field: 'service' }))}
                          className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl bg-white/70 dark:bg-black/20 border border-black/10 dark:border-white/10 text-left"
                        >
                          <span className="flex items-center gap-2 text-xs font-semibold text-[var(--text-primary)]">
                            <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: srv?.color }} />
                            {srv ? `${srv.name} · $${srv.price}` : 'Select service'}
                          </span>
                          <ChevronDown24Regular className="w-3.5 h-3.5 text-[var(--text-secondary)]" />
                        </button>
                        {pickerFor?.guestId === guest.id && pickerFor.field === 'service' && (
                          <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                            {services.map((s) => (
                              <button
                                key={s.id}
                                onClick={() => { updateGuest(guest.id, { serviceId: s.id }); setPickerFor(null); }}
                                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left text-[11px] font-medium transition-all ${
                                  s.id === guest.serviceId ? 'bg-blue-600 text-white' : 'bg-white/70 dark:bg-black/20 text-[var(--text-primary)] hover:bg-black/10 dark:hover:bg-white/10'
                                }`}
                              >
                                <span>{s.name}</span>
                                <span>${s.price}</span>
                              </button>
                            ))}
                          </div>
                        )}

                        <button
                          onClick={() => setPickerFor((p) => (p?.guestId === guest.id && p.field === 'staff' ? null : { guestId: guest.id, field: 'staff' }))}
                          className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl bg-white/70 dark:bg-black/20 border border-black/10 dark:border-white/10 text-left"
                        >
                          <span className="flex items-center gap-2 text-xs font-semibold text-[var(--text-primary)]">
                            <span>{stf?.avatar}</span>
                            {stf ? stf.name : 'Select specialist'}
                          </span>
                          <ChevronDown24Regular className="w-3.5 h-3.5 text-[var(--text-secondary)]" />
                        </button>
                        {pickerFor?.guestId === guest.id && pickerFor.field === 'staff' && (
                          <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                            {staffMembers.map((s) => (
                              <button
                                key={s.id}
                                onClick={() => { updateGuest(guest.id, { staffId: s.id }); setPickerFor(null); }}
                                className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-left text-[11px] font-medium transition-all ${
                                  s.id === guest.staffId ? 'bg-blue-600 text-white' : 'bg-white/70 dark:bg-black/20 text-[var(--text-primary)] hover:bg-black/10 dark:hover:bg-white/10'
                                }`}
                              >
                                <span>{s.avatar}</span>
                                <span>{s.name}</span>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={addGuest}
                  className="w-full py-2.5 rounded-2xl border border-dashed border-blue-500/40 text-blue-600 dark:text-blue-400 font-semibold text-xs flex items-center justify-center gap-1.5 hover:bg-blue-50/50 dark:hover:bg-blue-950/20"
                >
                  <Add24Filled className="w-3.5 h-3.5" />
                  <span>Add Another Guest</span>
                </motion.button>

                <motion.button
                  whileTap={{ scale: 0.96 }}
                  disabled={guests.length === 0}
                  onClick={() => { setPickerFor(null); setStep(2); }}
                  className="w-full mt-1 py-3 rounded-2xl bg-black text-white dark:bg-white dark:text-black font-semibold text-xs shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <span>Continue to Date & Time</span>
                  <ArrowRight24Filled className="w-4 h-4" />
                </motion.button>
              </motion.div>
            )}

            {/* Step 2: Date & Time Picker */}
            {step === 2 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">
                  Pick Available Date & Slot
                </h3>
                {isParty && (
                  <p className="text-[11px] text-[var(--text-secondary)] -mt-2">
                    Showing times when all {guests.length} specialists are free together.
                  </p>
                )}

                {/* Date Options Strip */}
                <div className="grid grid-cols-7 gap-1">
                  {DATE_OPTIONS.map((d) => {
                    const isSelected = isSameDay(d, selectedDate);
                    return (
                      <button
                        key={d.toISOString()}
                        onClick={() => setSelectedDate(d)}
                        className={`py-2 px-1 rounded-xl text-center flex flex-col items-center transition-all ${
                          isSelected
                            ? 'bg-black text-white dark:bg-white dark:text-black font-bold shadow-md'
                            : 'bg-black/5 dark:bg-white/5 text-[var(--text-secondary)]'
                        }`}
                      >
                        <span className="text-[9px] uppercase">{format(d, 'EEE')}</span>
                        <span className="text-xs">{format(d, 'd')}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Time Slots */}
                <div>
                  <label className="text-[11px] font-semibold uppercase tracking-wider text-[var(--text-secondary)] mb-2 block">
                    Available Times ({format(selectedDate, 'MMM d')})
                  </label>
                  {loadingSlots ? (
                    <div className="py-6 text-center text-[11px] text-[var(--text-secondary)]">
                      Checking availability...
                    </div>
                  ) : availableSlots.length === 0 ? (
                    <div className="py-6 text-center text-[11px] text-[var(--text-secondary)]">
                      {isParty
                        ? `No time on ${format(selectedDate, 'MMM d')} works for everyone in your party. Try another date.`
                        : `No open times with ${staffById(guests[0]?.staffId)?.name} on ${format(selectedDate, 'MMM d')}. Try another date.`}
                    </div>
                  ) : (
                    <div className="grid grid-cols-3 gap-2">
                      {availableSlots.map((t) => {
                        const isSelected = selectedSlotTime === t;
                        return (
                          <button
                            key={t}
                            onClick={() => setSelectedSlotTime(t)}
                            className={`py-2 rounded-xl text-xs font-mono font-medium transition-all ${
                              isSelected
                                ? 'bg-blue-600 text-white font-bold shadow-md'
                                : 'bg-black/5 dark:bg-white/5 text-[var(--text-primary)] hover:bg-black/10'
                            }`}
                          >
                            {t}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                <motion.button
                  whileTap={{ scale: 0.96 }}
                  disabled={!selectedSlotTime}
                  onClick={() => setStep(3)}
                  className="w-full mt-4 py-3 rounded-2xl bg-black text-white dark:bg-white dark:text-black font-semibold text-xs shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <span>Continue to Confirmation</span>
                  <ArrowRight24Filled className="w-4 h-4" />
                </motion.button>
              </motion.div>
            )}

            {/* Step 3: Contact & Confirmation */}
            {step === 3 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">
                    Your Information
                  </h3>
                  <button
                    type="button"
                    onClick={() => signIn.social({ provider: 'google', callbackURL: typeof window !== 'undefined' ? window.location.href : '/dashboard' })}
                    className="py-1.5 px-3 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 hover:bg-black/10 dark:hover:bg-white/10 text-[11px] font-bold text-[var(--text-primary)] flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <GoogleColor size={14} />
                    <span>Autofill with Google</span>
                  </button>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="text-[11px] font-semibold uppercase tracking-wider text-[var(--text-secondary)] mb-1 block">
                      Full Name {isParty && '(party contact)'}
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Alex Johnson"
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-xs text-[var(--text-primary)] focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[11px] font-semibold uppercase tracking-wider text-[var(--text-secondary)] mb-1 block">
                        Email
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="client@gmail.com"
                        value={clientEmail}
                        onChange={(e) => setClientEmail(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-xs text-[var(--text-primary)] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold uppercase tracking-wider text-[var(--text-secondary)] mb-1 block">
                        Mobile Phone
                      </label>
                      <input
                        type="tel"
                        placeholder="(555) 019-2834"
                        value={clientPhone}
                        onChange={(e) => setClientPhone(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-xs text-[var(--text-primary)] focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Booking Summary Box */}
                <div className="p-4 rounded-2xl bg-blue-50/50 dark:bg-blue-950/30 border border-blue-500/20 text-xs space-y-1.5">
                  {guests.map((g, i) => {
                    const srv = serviceById(g.serviceId);
                    const stf = staffById(g.staffId);
                    return (
                      <div key={g.id} className="flex justify-between font-semibold text-[var(--text-primary)]">
                        <span>{g.name.trim() || (isParty ? `Guest ${i + 1}` : srv?.name)} {isParty && `· ${srv?.name}`}</span>
                        <span>${srv?.price}</span>
                      </div>
                    );
                  })}
                  <div className="flex justify-between text-[var(--text-secondary)] text-[11px]">
                    <span>{isParty ? `${guests.length} specialists` : `With ${staffById(guests[0]?.staffId)?.name}`}</span>
                    <span>{format(selectedDate, 'MMM d')} @ {selectedSlotTime}</span>
                  </div>
                  <div className="border-t border-blue-500/20 pt-1.5 flex justify-between font-bold text-blue-600 dark:text-blue-400">
                    <span>Total · Due at the shop</span>
                    <span>${partyTotal}</span>
                  </div>
                </div>

                {bookingError && (
                  <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-500/20 text-[11px] font-semibold text-red-600 dark:text-red-400">
                    {bookingError}
                  </div>
                )}

                <motion.button
                  whileTap={{ scale: 0.96 }}
                  disabled={submitting}
                  onClick={handleConfirmBooking}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-xs shadow-xl flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Shield24Regular className="w-4 h-4" />
                  <span>{submitting ? 'Confirming Booking...' : isParty ? `Confirm Party of ${guests.length}` : 'Confirm Appointment'}</span>
                </motion.button>
              </motion.div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
