'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  isBefore,
  startOfToday,
  addMinutes,
  parse,
} from 'date-fns';
import { useAirBookStore } from '@/lib/store';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { signIn } from '@/lib/auth-client';
import { getAvatarUrl } from '@/lib/avatars';
import GoogleColor from '@lobehub/icons/es/Google/components/Color';
import {
  Cut24Regular,
  Clock24Regular,
  Money24Regular,
  Calendar24Filled,
  Calendar24Regular,
  Person24Regular,
  PeopleTeam24Regular,
  CheckmarkCircle24Filled,
  Sparkle24Regular,
  ArrowLeft24Filled,
  ArrowRight24Filled,
  ShieldCheckmark24Regular,
  Phone24Regular,
  Location24Regular,
  Add24Filled,
  Dismiss24Filled,
  ChevronDown24Filled,
  ChevronUp24Filled,
  ChevronLeft24Filled,
  ChevronRight24Filled,
  ArrowDownload24Filled,
  Tag24Regular,
  Info24Regular,
} from '@fluentui/react-icons';

interface PublicService {
  id: string;
  name: string;
  description?: string;
  durationMinutes: number;
  price: number;
  color: string;
  category: string;
}

interface PublicStaff {
  id: string;
  name: string;
  role: string;
  avatarUrl?: string | null;
}

interface WorkspaceInfo {
  id: string;
  name: string;
  slug: string;
  address?: string | null;
  phone?: string | null;
  email?: string | null;
  brandColor?: string;
  logoUrl?: string | null;
  cancellationNoticeHours: number;
  depositRequiredPercent: number;
}

interface Guest {
  id: string;
  name: string;
  serviceId: string;
  staffId: string; // 'anyone' or specific staffId
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
  const { t, language, setLanguage, availableLanguages } = useTranslation();

  const [workspace, setWorkspace] = useState<WorkspaceInfo | null>(null);
  const [dbServices, setDbServices] = useState<PublicService[]>([]);
  const [dbStaff, setDbStaff] = useState<PublicStaff[]>([]);
  const [loadingDb, setLoadingDb] = useState(true);
  const [workspaceNotFound, setWorkspaceNotFound] = useState(false);

  // Step 1 = Build party, Step 2 = Date & Time, Step 3 = Contact & Confirm
  const [step, setStep] = useState<1 | 2 | 3>(1);

  const [guests, setGuests] = useState<Guest[]>([]);
  const [pickerFor, setPickerFor] = useState<{ guestId: string; field: 'service' | 'staff' } | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Calendar State
  const [currentMonth, setCurrentMonth] = useState<Date>(startOfToday());
  const [selectedDate, setSelectedDate] = useState<Date>(startOfToday());
  const [selectedSlotTime, setSelectedSlotTime] = useState<string>('');
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);

  // Contact Form State
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [lastBookingId, setLastBookingId] = useState<string>('');

  // Load workspace, services, and staff
  useEffect(() => {
    async function loadPublicData() {
      try {
        setLoadingDb(true);
        const wsRes = await fetch(`/api/workspaces?slug=${encodeURIComponent(slug)}`)
          .then((r) => r.json())
          .catch(() => ({}));

        const wsData = wsRes.success && wsRes.workspace ? wsRes.workspace : null;

        if (!wsData) {
          if (process.env.NODE_ENV === 'production') {
            setWorkspaceNotFound(true);
            setLoadingDb(false);
            return;
          }
        }

        const ws: WorkspaceInfo = {
          id: wsData?.id || 'ws-default',
          name: wsData?.name || workspaceName || 'Luxe Hair & Spa Studio',
          slug: wsData?.slug || slug,
          address: wsData?.address || 'Downtown District · City Suite',
          phone: wsData?.phone || '(555) 234-8900',
          email: wsData?.email || 'hello@getairbook.com',
          brandColor: wsData?.brandColor || '#007AFF',
          logoUrl: wsData?.logoUrl || null,
          cancellationNoticeHours: wsData?.cancellationNoticeHours || 24,
          depositRequiredPercent: wsData?.depositRequiredPercent || 20,
        };
        setWorkspace(ws);
        setWorkspaceNotFound(false);

        let mappedSrvs: PublicService[] = [];
        let mappedStaff: PublicStaff[] = [];

        if (wsData?.id) {
          const [srvRes, stfRes] = await Promise.all([
            fetch(`/api/services?workspaceId=${wsData.id}`).then((r) => r.json()).catch(() => ({})),
            fetch(`/api/staff?workspaceId=${wsData.id}`).then((r) => r.json()).catch(() => ({})),
          ]);

          if (srvRes.success && Array.isArray(srvRes.services) && srvRes.services.length > 0) {
            mappedSrvs = srvRes.services.map((s: any) => ({
              id: s.id,
              name: s.name,
              description: s.description,
              durationMinutes: s.durationMinutes,
              price: (s.priceCents || 0) / 100,
              color: s.colorTag || '#007AFF',
              category: s.category || 'Hair & Styling',
            }));
          }

          if (stfRes.success && Array.isArray(stfRes.staff) && stfRes.staff.length > 0) {
            mappedStaff = stfRes.staff.map((s: any) => ({
              id: s.id,
              name: s.name,
              role: s.role || 'Specialist',
              avatarUrl: s.avatarUrl || null,
            }));
          }
        }

        // Fallback default services if database services are empty
        if (mappedSrvs.length === 0) {
          mappedSrvs = [
            { id: 'srv-1', name: 'Haircut & Precision Styling', durationMinutes: 45, price: 75, color: '#FF4D8D', category: 'Hair & Styling' },
            { id: 'srv-2', name: 'Beard Sculpting & Hot Towel', durationMinutes: 30, price: 45, color: '#00C7BE', category: 'Beard & Grooming' },
            { id: 'srv-3', name: 'HydraFacial Glow Treatment', durationMinutes: 60, price: 160, color: '#9D50BB', category: 'Spa & Facial' },
            { id: 'srv-4', name: 'Deep Tissue Body Therapy', durationMinutes: 60, price: 130, color: '#34C759', category: 'Body Wellness' },
            { id: 'srv-5', name: 'Botox & Aesthetic Consultation', durationMinutes: 30, price: 220, color: '#FF9500', category: 'Aesthetics' },
          ];
        }
        setDbServices(mappedSrvs);

        // Fallback default staff if database staff is empty
        if (mappedStaff.length === 0) {
          mappedStaff = [
            { id: 'stf-1', name: 'Eduardo Moreno', role: 'Master Stylist & Owner', avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80' },
            { id: 'stf-2', name: 'Dennis Müller', role: 'Senior Aesthetician', avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80' },
            { id: 'stf-3', name: 'Ivo Silva', role: 'Therapy Specialist', avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80' },
            { id: 'stf-4', name: 'Agnes K.', role: 'Spa Director', avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80' },
          ];
        }
        setDbStaff(mappedStaff);

        if (mappedSrvs.length > 0) {
          setGuests([{ id: newGuestId(), name: '', serviceId: mappedSrvs[0].id, staffId: 'anyone' }]);
        }
      } catch (e) {
        console.warn('Error loading public booking data:', e);
      } finally {
        setLoadingDb(false);
      }
    }
    loadPublicData();
  }, [slug]);

  const serviceById = (id: string) => dbServices.find((s) => s.id === id);
  const staffById = (id: string) => dbStaff.find((s) => s.id === id);

  const categories = useMemo(() => {
    const cats = Array.from(new Set(dbServices.map((s) => s.category).filter(Boolean)));
    return ['all', ...cats];
  }, [dbServices]);

  const isParty = guests.length > 1;
  const partyTotal = guests.reduce((sum, g) => sum + (serviceById(g.serviceId)?.price || 0), 0);
  const depositAmount = Math.round((partyTotal * (workspace?.depositRequiredPercent || 20)) / 100);

  function addGuest() {
    if (dbServices.length === 0) return;
    setGuests((gs) => [...gs, { id: newGuestId(), name: '', serviceId: dbServices[0].id, staffId: 'anyone' }]);
  }

  function removeGuest(id: string) {
    setGuests((gs) => (gs.length > 1 ? gs.filter((g) => g.id !== id) : gs));
  }

  function updateGuest(id: string, patch: Partial<Guest>) {
    setGuests((gs) => gs.map((g) => (g.id === id ? { ...g, ...patch } : g)));
  }

  // Load real availability
  useEffect(() => {
    async function loadAvailability() {
      if (guests.length === 0 || !workspace) return;
      setLoadingSlots(true);
      setAvailableSlots([]);

      try {
        const dateStr = format(selectedDate, 'yyyy-MM-dd');
        const perGuestSlots = await Promise.all(
          guests.map(async (g) => {
            const duration = serviceById(g.serviceId)?.durationMinutes || 30;
            const params = new URLSearchParams({
              workspaceId: workspace.id,
              dateStr,
              durationMinutes: String(duration),
              ...(g.staffId !== 'anyone' ? { staffId: g.staffId } : { staffId: 'anyone' }),
            });
            const res = await fetch(`/api/availability?${params.toString()}`);
            const data = await res.json();
            return Array.isArray(data.slots) ? (data.slots as string[]) : [];
          })
        );

        // If multiple guests, find slots where all can be accommodated
        const intersected = perGuestSlots.reduce(
          (acc, slots) => acc.filter((t) => slots.includes(t)),
          perGuestSlots[0] || []
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

    if (step === 2) {
      loadAvailability();
    }
  }, [step, guests, selectedDate, workspace]);

  // Calendar Day Generation
  const calendarDays = useMemo(() => {
    const start = startOfMonth(currentMonth);
    const end = endOfMonth(currentMonth);
    return eachDayOfInterval({ start, end });
  }, [currentMonth]);

  const handleConfirmBooking = async () => {
    if (!clientName.trim() || !clientEmail.trim() || !selectedSlotTime || submitting || !workspace) return;
    setSubmitting(true);
    setBookingError(null);

    try {
      const res = await fetch('/api/bookings/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          workspaceId: workspace.id,
          dateStr: format(selectedDate, 'yyyy-MM-dd'),
          startTime: selectedSlotTime,
          clientName: clientName.trim(),
          clientEmail: clientEmail.trim(),
          clientPhone: clientPhone.trim(),
          notes: `Online booking via /book/${slug}`,
          guests: guests.map((g) => {
            const srv = serviceById(g.serviceId);
            const resolvedStaffId = g.staffId === 'anyone' && dbStaff.length > 0 ? dbStaff[0].id : g.staffId;
            return {
              guestName: g.name.trim() || undefined,
              staffId: resolvedStaffId,
              serviceId: g.serviceId,
              durationMinutes: srv?.durationMinutes || 30,
              priceCents: Math.round((srv?.price || 0) * 100),
            };
          }),
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok && data.success) {
        const bookingRef = data.groupId || data.booking?.id || `BK-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
        setLastBookingId(bookingRef);

        // If deposit required, request Stripe Checkout session
        if (depositAmount > 0) {
          try {
            const checkoutRes = await fetch('/api/stripe/connect/deposit-checkout', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                workspaceId: workspace.id,
                appointmentId: data.booking?.id,
                groupId: data.groupId,
                depositCents: Math.round(depositAmount * 100),
                totalDueCents: Math.round(partyTotal * 100),
                serviceName: isParty ? `Party of ${guests.length} Appointments` : (serviceById(guests[0]?.serviceId)?.name || 'Salon Service'),
                clientName: clientName.trim(),
                clientEmail: clientEmail.trim(),
                dateStr: format(selectedDate, 'yyyy-MM-dd'),
                startTime: selectedSlotTime,
                slug,
              }),
            }).then((r) => r.json());

            if (checkoutRes.url && !checkoutRes.simulated) {
              window.location.href = checkoutRes.url;
              return;
            }
          } catch (err) {
            console.warn('Deposit checkout error:', err);
          }
        }

        for (const g of guests) {
          const srv = serviceById(g.serviceId);
          const resolvedStaff = g.staffId === 'anyone' ? dbStaff[0] : staffById(g.staffId);
          addAppointment({
            clientName: g.name.trim() || clientName.trim(),
            serviceId: g.serviceId,
            serviceName: srv?.name || '',
            staffId: resolvedStaff?.id || 'staff-1',
            staffName: resolvedStaff?.name || 'Assigned Specialist',
            dateStr: format(selectedDate, 'yyyy-MM-dd'),
            startTime: selectedSlotTime,
            durationMinutes: srv?.durationMinutes || 30,
            price: srv?.price || 0,
            color: srv?.color || '#007AFF',
            status: 'confirmed',
            notes: `Public Web Booking. Phone: ${clientPhone}`,
            groupId: data.groupId || null,
            partySize: guests.length,
          });
        }
        setIsSuccess(true);
      } else {
        setBookingError(data.error || t('noSlotsAvailable'));
      }
    } catch (e) {
      console.error('Error creating public booking:', e);
      setBookingError('Something went wrong saving your booking. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Google Calendar Link Generator
  const getGoogleCalendarUrl = () => {
    if (!selectedSlotTime) return '#';
    try {
      const startDt = parse(`${format(selectedDate, 'yyyy-MM-dd')} ${selectedSlotTime}`, 'yyyy-MM-dd HH:mm', new Date());
      const maxDuration = Math.max(...guests.map((g) => serviceById(g.serviceId)?.durationMinutes || 45));
      const endDt = addMinutes(startDt, maxDuration);

      const fmtGCal = (d: Date) => format(d, "yyyyMMdd'T'HHmmss");
      const title = encodeURIComponent(`${workspace?.name || 'AirBook'} Appointment`);
      const details = encodeURIComponent(
        `Appointment with ${workspace?.name || 'AirBook'}\nServices: ${guests
          .map((g) => serviceById(g.serviceId)?.name)
          .join(', ')}\nBooked by: ${clientName}`
      );
      const location = encodeURIComponent(workspace?.address || '');

      return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${fmtGCal(startDt)}/${fmtGCal(
        endDt
      )}&details=${details}&location=${location}`;
    } catch {
      return '#';
    }
  };

  // Download .ics file
  const handleDownloadIcs = () => {
    try {
      const startDt = parse(`${format(selectedDate, 'yyyy-MM-dd')} ${selectedSlotTime}`, 'yyyy-MM-dd HH:mm', new Date());
      const maxDuration = Math.max(...guests.map((g) => serviceById(g.serviceId)?.durationMinutes || 45));
      const endDt = addMinutes(startDt, maxDuration);

      const fmtIcs = (d: Date) => format(d, "yyyyMMdd'T'HHmmss");
      const icsContent = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//AirBook//Booking System//EN',
        'CALSCALE:GREGORIAN',
        'BEGIN:VEVENT',
        `UID:${lastBookingId || Date.now()}@getairbook.com`,
        `DTSTAMP:${fmtIcs(new Date())}Z`,
        `DTSTART:${fmtIcs(startDt)}`,
        `DTEND:${fmtIcs(endDt)}`,
        `SUMMARY:${workspace?.name || 'AirBook'} Appointment`,
        `DESCRIPTION:Appointment at ${workspace?.name || 'AirBook'} for ${guests.map((g) => serviceById(g.serviceId)?.name).join(', ')}`,
        `LOCATION:${workspace?.address || 'Salon'}`,
        'STATUS:CONFIRMED',
        'END:VEVENT',
        'END:VCALENDAR',
      ].join('\r\n');

      const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `AirBook-${slug}-Appointment.ics`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (e) {
      console.error('Failed to generate .ics', e);
    }
  };

  if (loadingDb) {
    return (
      <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] flex flex-col items-center justify-center p-6 text-center gap-3">
        <div className="w-10 h-10 border-3 border-blue-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-xs font-semibold text-[var(--text-secondary)]">{t('checkingSlots')}</p>
      </div>
    );
  }

  if (workspaceNotFound) {
    return (
      <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] flex flex-col items-center justify-center p-6 text-center gap-3">
        <div className="w-14 h-14 rounded-2xl bg-red-500/10 text-red-500 flex items-center justify-center">
          <Info24Regular className="w-8 h-8" />
        </div>
        <h1 className="text-lg font-bold text-[var(--text-primary)]">{t('bookingPageNotFound')}</h1>
        <p className="text-xs text-[var(--text-secondary)] max-w-sm">{t('bookingPageNotFoundDesc')}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] flex flex-col items-center justify-start p-3 sm:p-6 relative transition-colors duration-150">
      {/* Background Decorative Blur */}
      <div className="absolute top-8 left-1/2 -translate-x-1/2 w-96 h-96 bg-blue-500/10 dark:bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-80 h-80 bg-purple-500/10 dark:bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Main Booking Container */}
      <div className="w-full max-w-xl rounded-3xl p-4 sm:p-6 shadow-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] z-10 relative mt-2 sm:mt-6">
        {/* Top Header: Brand & Language Selector */}
        <div className="flex items-start justify-between pb-5 border-b border-[var(--border-subtle)] gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-pink-500 text-white flex items-center justify-center font-extrabold text-lg shadow-md flex-shrink-0">
              {workspace?.name ? workspace.name.charAt(0).toUpperCase() : 'A'}
            </div>
            <div className="min-w-0">
              <h1 className="text-base font-extrabold text-[var(--text-primary)] tracking-tight truncate">
                {workspace?.name || workspaceName}
              </h1>
              <p className="text-[11px] text-[var(--text-secondary)] flex items-center gap-1 mt-0.5 truncate">
                <Location24Regular className="w-3.5 h-3.5 flex-shrink-0 text-blue-500" />
                <span className="truncate">{workspace?.address}</span>
              </p>
            </div>
          </div>

          {/* Language Flag Switcher */}
          <div className="flex items-center gap-1 bg-black/5 dark:bg-white/5 p-1 rounded-2xl border border-[var(--border-subtle)] flex-shrink-0">
            {availableLanguages.map((lang) => (
              <button
                key={lang.id}
                type="button"
                onClick={() => setLanguage(lang.id)}
                title={lang.label}
                className={`p-1 rounded-xl transition-all cursor-pointer ${
                  language === lang.id ? 'bg-[var(--bg-primary)] shadow-xs scale-105' : 'opacity-60 hover:opacity-100'
                }`}
              >
                <img
                  src={`https://hatscripts.github.io/circle-flags/flags/${lang.flagCode}.svg`}
                  alt={lang.label}
                  className="w-4 h-4 rounded-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Progress Step Indicator */}
        {!isSuccess && (
          <div className="flex items-center justify-between py-3.5 border-b border-[var(--border-subtle)] text-xs font-semibold text-[var(--text-secondary)]">
            <div className="flex items-center gap-1.5">
              {step > 1 && (
                <button
                  type="button"
                  onClick={() => setStep((s) => (s - 1) as any)}
                  className="p-1.5 rounded-xl hover:bg-black/5 dark:hover:bg-white/10 text-[var(--text-primary)] mr-1 cursor-pointer transition-colors"
                >
                  <ArrowLeft24Filled className="w-3.5 h-3.5" />
                </button>
              )}
              <span>{t('stepOf', { current: step, total: 3 })}</span>
            </div>
            <span className="text-blue-600 dark:text-blue-400 font-extrabold text-xs">
              {step === 1 && t('stepParty')}
              {step === 2 && t('stepDateTime')}
              {step === 3 && t('stepConfirm')}
            </span>
          </div>
        )}

        {/* SUCCESS VIEW */}
        {isSuccess ? (
          <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="py-8 text-center flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shadow-md">
              <CheckmarkCircle24Filled className="w-10 h-10" />
            </div>

            <div>
              <h2 className="text-xl font-extrabold text-[var(--text-primary)]">
                {isParty ? t('partyConfirmedTitle') : t('bookingConfirmedTitle')}
              </h2>
              <p className="text-xs text-[var(--text-secondary)] mt-1 max-w-sm">
                {isParty
                  ? t('partyConfirmedDesc', { count: guests.length, date: format(selectedDate, 'EEEE, MMM d'), time: selectedSlotTime })
                  : t('bookingConfirmedDesc', { date: format(selectedDate, 'EEEE, MMM d'), time: selectedSlotTime })}
              </p>
            </div>

            {/* Booking Recap Card */}
            <div className="p-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-[var(--border-subtle)] text-xs text-left w-full space-y-2.5">
              <div className="flex justify-between items-center pb-2 border-b border-[var(--border-subtle)]">
                <span className="text-[var(--text-secondary)] font-medium">{t('bookedBy')}</span>
                <span className="font-bold text-[var(--text-primary)]">{clientName} ({clientPhone || clientEmail})</span>
              </div>

              <div className="space-y-1.5 pt-1">
                {guests.map((g, i) => {
                  const srv = serviceById(g.serviceId);
                  const stf = g.staffId === 'anyone' ? dbStaff[0] : staffById(g.staffId);
                  return (
                    <div key={g.id} className="flex justify-between items-center">
                      <span className="text-[var(--text-secondary)]">{g.name.trim() || `${t('guestLabel')} ${i + 1}`}</span>
                      <span className="font-semibold text-[var(--text-primary)]">
                        {srv?.name} · {stf?.name || t('anyoneAvailable')}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="flex justify-between items-center pt-2 border-t border-[var(--border-subtle)]">
                <span className="text-[var(--text-secondary)] font-medium">{t('totalDue')}</span>
                <span className="font-extrabold text-[var(--text-primary)] text-sm">${partyTotal}</span>
              </div>
              <div className="flex justify-between text-[11px] text-[var(--text-secondary)]">
                <span>{t('dueAtShop')}</span>
                <span>{workspace?.address}</span>
              </div>
            </div>

            {/* Calendar Sync Actions */}
            <div className="w-full flex flex-col sm:flex-row gap-2 pt-2">
              <a
                href={getGoogleCalendarUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-2.5 px-4 rounded-2xl bg-black/5 dark:bg-white/10 hover:bg-black/10 text-xs font-bold text-[var(--text-primary)] flex items-center justify-center gap-2 transition-all shadow-xs"
              >
                <Calendar24Filled className="w-4 h-4 text-blue-500" />
                <span>{t('addToGoogleCalendar')}</span>
              </a>

              <button
                type="button"
                onClick={handleDownloadIcs}
                className="flex-1 py-2.5 px-4 rounded-2xl bg-black/5 dark:bg-white/10 hover:bg-black/10 text-xs font-bold text-[var(--text-primary)] flex items-center justify-center gap-2 transition-all shadow-xs cursor-pointer"
              >
                <ArrowDownload24Filled className="w-4 h-4 text-emerald-500" />
                <span>{t('downloadIcsCalendar')}</span>
              </button>
            </div>

            <p className="text-[11px] text-[var(--text-secondary)] italic">
              {t('rescheduleOrCancelNotice')} ({workspace?.phone})
            </p>

            <button
              type="button"
              onClick={() => {
                setIsSuccess(false);
                setStep(1);
                setClientName('');
                setClientEmail('');
                setClientPhone('');
                if (dbServices.length > 0) {
                  setGuests([{ id: newGuestId(), name: '', serviceId: dbServices[0].id, staffId: 'anyone' }]);
                }
              }}
              className="mt-2 px-6 py-2.5 rounded-2xl bg-black text-white dark:bg-white dark:text-black font-extrabold text-xs shadow-md active:scale-95 transition-transform cursor-pointer"
            >
              {t('bookAnotherBtn')}
            </button>
          </motion.div>
        ) : (
          <div className="py-4">
            {/* STEP 1: PARTY & SERVICE SELECTION */}
            {step === 1 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)] flex items-center gap-1.5">
                    <PeopleTeam24Regular className="w-4 h-4 text-blue-500" />
                    <span>{isParty ? `${t('yourParty')} (${guests.length})` : t('whoIsBookingFor')}</span>
                  </h3>
                </div>

                {/* Category Filtering Chips */}
                {categories.length > 2 && (
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                          selectedCategory === cat
                            ? 'bg-blue-600 text-white shadow-xs'
                            : 'bg-black/5 dark:bg-white/5 text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                        }`}
                      >
                        {cat === 'all' ? t('allCategories') : cat}
                      </button>
                    ))}
                  </div>
                )}

                {/* Guest List Cards */}
                <div className="space-y-3 max-h-[26rem] overflow-y-auto pr-1">
                  {guests.map((guest, idx) => {
                    const srv = serviceById(guest.serviceId);
                    const stf = guest.staffId === 'anyone' ? null : staffById(guest.staffId);
                    const filteredServices =
                      selectedCategory === 'all'
                        ? dbServices
                        : dbServices.filter((s) => s.category.toLowerCase() === selectedCategory.toLowerCase());

                    return (
                      <div
                        key={guest.id}
                        className="p-4 rounded-2xl border border-[var(--border-subtle)] bg-black/[0.02] dark:bg-white/[0.02] space-y-3"
                      >
                        {/* Guest Name Input */}
                        <div className="flex items-center justify-between gap-2">
                          <input
                            type="text"
                            placeholder={t('guestNameOptional', { number: idx + 1 })}
                            value={guest.name}
                            onChange={(e) => updateGuest(guest.id, { name: e.target.value })}
                            className="flex-1 min-w-0 px-3.5 py-2 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-xs font-semibold text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                          />
                          {guests.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeGuest(guest.id)}
                              className="p-2 rounded-xl hover:bg-red-500/10 text-red-500 transition-colors flex-shrink-0 cursor-pointer"
                              title={t('removeGuest')}
                            >
                              <Dismiss24Filled className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>

                        {/* Service Picker Trigger */}
                        <div>
                          <button
                            type="button"
                            onClick={() =>
                              setPickerFor((p) =>
                                p?.guestId === guest.id && p.field === 'service' ? null : { guestId: guest.id, field: 'service' }
                              )
                            }
                            className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-left hover:border-blue-500/50 transition-colors cursor-pointer"
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: srv?.color || '#007AFF' }} />
                              <div className="min-w-0">
                                <p className="text-xs font-bold text-[var(--text-primary)] truncate">
                                  {srv ? srv.name : t('selectService')}
                                </p>
                                <p className="text-[10px] text-[var(--text-secondary)] font-medium">
                                  {srv?.durationMinutes} {t('minsShort')} · ${srv?.price}
                                </p>
                              </div>
                            </div>
                            {pickerFor?.guestId === guest.id && pickerFor.field === 'service' ? (
                              <ChevronUp24Filled className="w-3.5 h-3.5 text-[var(--text-secondary)]" />
                            ) : (
                              <ChevronDown24Filled className="w-3.5 h-3.5 text-[var(--text-secondary)]" />
                            )}
                          </button>

                          {/* Service Options List */}
                          {pickerFor?.guestId === guest.id && pickerFor.field === 'service' && (
                            <motion.div
                              initial={{ opacity: 0, y: -4 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="mt-2 space-y-1.5 max-h-48 overflow-y-auto p-1.5 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] shadow-lg"
                            >
                              {filteredServices.map((s) => (
                                <button
                                  key={s.id}
                                  type="button"
                                  onClick={() => {
                                    updateGuest(guest.id, { serviceId: s.id });
                                    setPickerFor(null);
                                  }}
                                  className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left transition-all cursor-pointer ${
                                    s.id === guest.serviceId
                                      ? 'bg-blue-600 text-white'
                                      : 'hover:bg-black/5 dark:hover:bg-white/5 text-[var(--text-primary)]'
                                  }`}
                                >
                                  <div className="min-w-0 pr-2">
                                    <p className="text-xs font-bold truncate">{s.name}</p>
                                    <p className={`text-[10px] ${s.id === guest.serviceId ? 'text-blue-100' : 'text-[var(--text-secondary)]'}`}>
                                      {s.durationMinutes} {t('minsShort')}
                                    </p>
                                  </div>
                                  <span className="font-extrabold text-xs flex-shrink-0">${s.price}</span>
                                </button>
                              ))}
                            </motion.div>
                          )}
                        </div>

                        {/* Specialist Picker Trigger */}
                        <div>
                          <button
                            type="button"
                            onClick={() =>
                              setPickerFor((p) =>
                                p?.guestId === guest.id && p.field === 'staff' ? null : { guestId: guest.id, field: 'staff' }
                              )
                            }
                            className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-left hover:border-blue-500/50 transition-colors cursor-pointer"
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <div className="w-6 h-6 rounded-full overflow-hidden bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                                {guest.staffId === 'anyone' ? (
                                  <Sparkle24Regular className="w-3.5 h-3.5 text-blue-500" />
                                ) : (
                                  <img
                                    src={getAvatarUrl(stf?.name || 'Staff', stf?.avatarUrl)}
                                    alt={stf?.name}
                                    className="w-full h-full object-cover"
                                  />
                                )}
                              </div>
                              <div className="min-w-0">
                                <p className="text-xs font-bold text-[var(--text-primary)] truncate">
                                  {guest.staffId === 'anyone' ? t('anyoneAvailable') : stf?.name || t('selectSpecialist')}
                                </p>
                                <p className="text-[10px] text-[var(--text-secondary)] font-medium">
                                  {guest.staffId === 'anyone' ? t('anyoneAvailableDesc') : stf?.role}
                                </p>
                              </div>
                            </div>
                            {pickerFor?.guestId === guest.id && pickerFor.field === 'staff' ? (
                              <ChevronUp24Filled className="w-3.5 h-3.5 text-[var(--text-secondary)]" />
                            ) : (
                              <ChevronDown24Filled className="w-3.5 h-3.5 text-[var(--text-secondary)]" />
                            )}
                          </button>

                          {/* Specialist Options List */}
                          {pickerFor?.guestId === guest.id && pickerFor.field === 'staff' && (
                            <motion.div
                              initial={{ opacity: 0, y: -4 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="mt-2 space-y-1.5 max-h-48 overflow-y-auto p-1.5 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] shadow-lg"
                            >
                              {/* Option: First Available Specialist */}
                              <button
                                type="button"
                                onClick={() => {
                                  updateGuest(guest.id, { staffId: 'anyone' });
                                  setPickerFor(null);
                                }}
                                className={`w-full flex items-center gap-2.5 p-2.5 rounded-xl text-left transition-all cursor-pointer ${
                                  guest.staffId === 'anyone'
                                    ? 'bg-blue-600 text-white'
                                    : 'hover:bg-black/5 dark:hover:bg-white/5 text-[var(--text-primary)]'
                                }`}
                              >
                                <div className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-500 flex items-center justify-center flex-shrink-0">
                                  <Sparkle24Regular className="w-3.5 h-3.5 text-blue-400" />
                                </div>
                                <div className="min-w-0">
                                  <p className="text-xs font-bold">{t('anyoneAvailable')}</p>
                                  <p className={`text-[10px] ${guest.staffId === 'anyone' ? 'text-blue-100' : 'text-[var(--text-secondary)]'}`}>
                                    {t('anyoneAvailableDesc')}
                                  </p>
                                </div>
                              </button>

                              {/* Individual Staff Members */}
                              {dbStaff.map((s) => (
                                <button
                                  key={s.id}
                                  type="button"
                                  onClick={() => {
                                    updateGuest(guest.id, { staffId: s.id });
                                    setPickerFor(null);
                                  }}
                                  className={`w-full flex items-center gap-2.5 p-2.5 rounded-xl text-left transition-all cursor-pointer ${
                                    s.id === guest.staffId
                                      ? 'bg-blue-600 text-white'
                                      : 'hover:bg-black/5 dark:hover:bg-white/5 text-[var(--text-primary)]'
                                  }`}
                                >
                                  <img
                                    src={getAvatarUrl(s.name, s.avatarUrl)}
                                    alt={s.name}
                                    className="w-6 h-6 rounded-full object-cover flex-shrink-0"
                                  />
                                  <div className="min-w-0">
                                    <p className="text-xs font-bold truncate">{s.name}</p>
                                    <p className={`text-[10px] ${s.id === guest.staffId ? 'text-blue-100' : 'text-[var(--text-secondary)]'}`}>
                                      {s.role}
                                    </p>
                                  </div>
                                </button>
                              ))}
                            </motion.div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Add Another Guest Button */}
                <button
                  type="button"
                  onClick={addGuest}
                  className="w-full py-2.5 rounded-2xl border border-dashed border-blue-500/40 text-blue-600 dark:text-blue-400 font-bold text-xs flex items-center justify-center gap-1.5 hover:bg-blue-50/50 dark:hover:bg-blue-950/20 transition-colors cursor-pointer"
                >
                  <Add24Filled className="w-3.5 h-3.5" />
                  <span>{t('addAnotherGuest')}</span>
                </button>

                {/* Step 1 Next Button */}
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  disabled={guests.length === 0}
                  onClick={() => {
                    setPickerFor(null);
                    setStep(2);
                  }}
                  className="w-full py-3.5 rounded-2xl bg-black text-white dark:bg-white dark:text-black font-extrabold text-xs shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                >
                  <span>{t('continueToDateTime')}</span>
                  <ArrowRight24Filled className="w-4 h-4" />
                </motion.button>
              </motion.div>
            )}

            {/* STEP 2: EXPANDABLE CALENDAR & TIME SLOTS */}
            {step === 2 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)] flex items-center gap-1.5">
                    <Calendar24Regular className="w-4 h-4 text-blue-500" />
                    <span>{t('pickDateAndSlot')}</span>
                  </h3>

                  {/* Month Switcher Navigation */}
                  <div className="flex items-center gap-1 bg-black/5 dark:bg-white/5 p-1 rounded-2xl border border-[var(--border-subtle)]">
                    <button
                      type="button"
                      disabled={isSameMonth(currentMonth, startOfToday())}
                      onClick={() => setCurrentMonth((m) => subMonths(m, 1))}
                      className="p-1 rounded-xl hover:bg-black/5 dark:hover:bg-white/10 disabled:opacity-30 cursor-pointer"
                      title={t('prevMonth')}
                    >
                      <ChevronLeft24Filled className="w-3.5 h-3.5 text-[var(--text-primary)]" />
                    </button>
                    <span className="text-xs font-extrabold px-2 text-[var(--text-primary)] min-w-[85px] text-center">
                      {format(currentMonth, 'MMM yyyy')}
                    </span>
                    <button
                      type="button"
                      onClick={() => setCurrentMonth((m) => addMonths(m, 1))}
                      className="p-1 rounded-xl hover:bg-black/5 dark:hover:bg-white/10 cursor-pointer"
                      title={t('nextMonth')}
                    >
                      <ChevronRight24Filled className="w-3.5 h-3.5 text-[var(--text-primary)]" />
                    </button>
                  </div>
                </div>

                {isParty && (
                  <p className="text-[11px] text-[var(--text-secondary)] -mt-2">
                    {t('showingPartySlotsDesc')}
                  </p>
                )}

                {/* Calendar Days Grid */}
                <div className="p-3.5 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-subtle)]">
                  <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold uppercase text-[var(--text-secondary)] mb-2">
                    <span>{t('monShort')}</span>
                    <span>{t('tueShort')}</span>
                    <span>{t('wedShort')}</span>
                    <span>{t('thuShort')}</span>
                    <span>{t('friShort')}</span>
                    <span>{t('satShort')}</span>
                    <span>{t('sunShort')}</span>
                  </div>

                  <div className="grid grid-cols-7 gap-1.5">
                    {calendarDays.map((day) => {
                      const isPast = isBefore(day, startOfToday());
                      const isSelected = isSameDay(day, selectedDate);

                      return (
                        <button
                          key={day.toISOString()}
                          type="button"
                          disabled={isPast}
                          onClick={() => setSelectedDate(day)}
                          className={`py-2 rounded-xl text-center flex flex-col items-center justify-center transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-blue-600 text-white font-extrabold shadow-sm scale-105'
                              : isPast
                              ? 'opacity-25 cursor-not-allowed text-[var(--text-secondary)]'
                              : 'bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 text-[var(--text-primary)] font-semibold'
                          }`}
                        >
                          <span className="text-xs">{format(day, 'd')}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Available Slots */}
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-secondary)] mb-2.5 block">
                    {t('availableTimesOn', { date: format(selectedDate, 'MMM d') })}
                  </label>

                  {loadingSlots ? (
                    <div className="py-8 text-center text-xs font-semibold text-[var(--text-secondary)] flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                      <span>{t('checkingSlots')}</span>
                    </div>
                  ) : availableSlots.length === 0 ? (
                    <div className="py-8 text-center text-xs font-medium text-[var(--text-secondary)] p-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-[var(--border-subtle)]">
                      {t('noSlotsAvailable')}
                    </div>
                  ) : (
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                      {availableSlots.map((timeStr) => {
                        const isSelected = selectedSlotTime === timeStr;
                        return (
                          <button
                            key={timeStr}
                            type="button"
                            onClick={() => setSelectedSlotTime(timeStr)}
                            className={`py-2.5 px-3 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                              isSelected
                                ? 'bg-blue-600 text-white shadow-md scale-105'
                                : 'bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-[var(--text-primary)] hover:border-blue-500'
                            }`}
                          >
                            {timeStr}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Step 2 Next Button */}
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  disabled={!selectedSlotTime || loadingSlots}
                  onClick={() => setStep(3)}
                  className="w-full py-3.5 rounded-2xl bg-black text-white dark:bg-white dark:text-black font-extrabold text-xs shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                >
                  <span>{t('continueToConfirm')}</span>
                  <ArrowRight24Filled className="w-4 h-4" />
                </motion.button>
              </motion.div>
            )}

            {/* STEP 3: CONTACT INFORMATION & CONFIRMATION */}
            {step === 3 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">
                    {t('yourContactInfo')}
                  </h3>

                  {/* Passwordless Autofill Button */}
                  <button
                    type="button"
                    onClick={() =>
                      signIn.social({
                        provider: 'google',
                        callbackURL: typeof window !== 'undefined' ? window.location.href : '/dashboard',
                      })
                    }
                    className="py-1.5 px-3 rounded-xl bg-black/5 dark:bg-white/5 border border-[var(--border-subtle)] hover:bg-black/10 text-[11px] font-bold text-[var(--text-primary)] flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <GoogleColor size={13} />
                    <span>{t('autofillWithGoogle')}</span>
                  </button>
                </div>

                {/* Form Fields */}
                <div className="space-y-3">
                  <div>
                    <label className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-secondary)] mb-1 block">
                      {t('fullNameLabel')} {isParty && t('partyContactNote')}
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Alex Johnson"
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-xs font-semibold text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-secondary)] mb-1 block">
                        {t('emailAddressLabel')}
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="client@gmail.com"
                        value={clientEmail}
                        onChange={(e) => setClientEmail(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-xs font-semibold text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-secondary)] mb-1 block">
                        {t('phoneLabel')}
                      </label>
                      <input
                        type="tel"
                        placeholder="(555) 019-2834"
                        value={clientPhone}
                        onChange={(e) => setClientPhone(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-xs font-semibold text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                      />
                    </div>
                  </div>
                </div>

                {/* Summary & Policies Card */}
                <div className="p-4 rounded-2xl bg-blue-500/5 border border-blue-500/20 text-xs space-y-2.5">
                  <div className="space-y-1.5">
                    {guests.map((g, i) => {
                      const srv = serviceById(g.serviceId);
                      const stf = g.staffId === 'anyone' ? null : staffById(g.staffId);
                      return (
                        <div key={g.id} className="flex justify-between items-center font-semibold text-[var(--text-primary)]">
                          <span className="truncate">
                            {g.name.trim() || (isParty ? `${t('guestLabel')} ${i + 1}` : srv?.name)} {isParty && `· ${srv?.name}`}
                          </span>
                          <span className="font-extrabold flex-shrink-0">${srv?.price}</span>
                        </div>
                      );
                    })}
                  </div>

                  <div className="flex justify-between text-[11px] text-[var(--text-secondary)] pt-1 border-t border-blue-500/15">
                    <span>
                      {isParty ? `${guests.length} ${t('specialistsLabel')}` : `With ${staffById(guests[0]?.staffId)?.name || t('anyoneAvailable')}`}
                    </span>
                    <span className="font-bold text-[var(--text-primary)]">
                      {format(selectedDate, 'MMM d')} @ {selectedSlotTime}
                    </span>
                  </div>

                  <div className="border-t border-blue-500/20 pt-2 flex justify-between items-center font-extrabold text-blue-600 dark:text-blue-400 text-sm">
                    <span>{t('totalDue')}</span>
                    <span>${partyTotal}</span>
                  </div>

                  {/* Policy disclosures */}
                  <div className="pt-2 border-t border-blue-500/15 text-[10px] text-[var(--text-secondary)] space-y-1">
                    <p className="flex items-center gap-1.5">
                      <ShieldCheckmark24Regular className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                      <span>{t('cancellationPolicyNotice', { hours: workspace?.cancellationNoticeHours || 24 })}</span>
                    </p>
                    {workspace?.depositRequiredPercent ? (
                      <p className="flex items-center gap-1.5">
                        <Tag24Regular className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />
                        <span>
                          {t('depositRequiredPolicy', { percent: workspace.depositRequiredPercent })} · ${depositAmount}
                        </span>
                      </p>
                    ) : null}
                  </div>
                </div>

                {bookingError && (
                  <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-[11px] font-bold text-red-600 dark:text-red-400">
                    {bookingError}
                  </div>
                )}

                {/* Final Submit Button */}
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  disabled={submitting}
                  onClick={handleConfirmBooking}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white font-extrabold text-xs shadow-xl flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                >
                  <ShieldCheckmark24Regular className="w-4 h-4" />
                  <span>
                    {submitting
                      ? (depositAmount > 0 ? t('depositPaymentRedirect') : t('confirmingBooking'))
                      : depositAmount > 0
                      ? t('payDepositAndConfirm', { amount: `$${depositAmount}` })
                      : isParty
                      ? t('confirmPartyBtn', { count: guests.length })
                      : t('confirmBookingBtn')}
                  </span>
                </motion.button>
              </motion.div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
