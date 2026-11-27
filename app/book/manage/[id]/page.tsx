'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Card } from '@/components/primitives/Card';
import { Badge } from '@/components/primitives/Badge';
import { Icon } from '@/components/primitives/Icon';
import { CircleCloudIcon } from '@/components/Logo';
import { toast } from '@/components/primitives/Sonner';
import {
  Calendar24Regular,
  Clock24Regular,
  Person24Regular,
  CheckmarkCircle24Filled,
  DismissCircle24Filled,
} from '@fluentui/react-icons';

interface ManagedAppointment {
  id: string;
  workspaceId: string;
  dateStr: string;
  startTime: string;
  durationMinutes: number;
  priceCents: number;
  status: string;
  workspace?: { name?: string | null; slug?: string | null } | null;
  client?: { name?: string | null } | null;
  service?: { name?: string | null } | null;
  staff?: { id?: string | null; name?: string | null } | null;
}

export default function ManageAppointmentPage() {
  const params = useParams();
  const appointmentId = typeof params?.id === 'string' ? params.id : '';

  const [apt, setApt] = useState<ManagedAppointment | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState('');
  const [slots, setSlots] = useState<string[]>([]);
  const [selectedSlot, setSelectedSlot] = useState('');
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!appointmentId) return;
    fetch(`/api/appointments?id=${encodeURIComponent(appointmentId)}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.success && Array.isArray(data.appointments) && data.appointments[0]) {
          const found = data.appointments[0];
          setApt(found);
          setSelectedDate(found.dateStr);
        }
      })
      .catch((err) => console.warn('Failed to load appointment:', err))
      .finally(() => setLoading(false));
  }, [appointmentId]);

  useEffect(() => {
    if (!apt || !selectedDate) return;
    setLoadingSlots(true);
    const qs = new URLSearchParams({
      dateStr: selectedDate,
      durationMinutes: String(apt.durationMinutes || 45),
    });
    if (apt.staff?.id) qs.set('staffId', apt.staff.id);
    else qs.set('workspaceId', apt.workspaceId);

    fetch(`/api/availability?${qs.toString()}`)
      .then((r) => r.json())
      .then((data) => {
        const list = Array.isArray(data.slots) ? data.slots : [];
        setSlots(list);
        setSelectedSlot(list[0] || '');
      })
      .catch(() => setSlots([]))
      .finally(() => setLoadingSlots(false));
  }, [apt, selectedDate]);

  const handleReschedule = async () => {
    if (!apt || !selectedDate || !selectedSlot) return;
    try {
      setSubmitting(true);
      const res = await fetch('/api/appointments', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: apt.id,
          dateStr: selectedDate,
          startTime: selectedSlot,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setApt((prev) => (prev ? { ...prev, dateStr: selectedDate, startTime: selectedSlot } : prev));
        toast.success('Appointment rescheduled.');
      } else {
        toast.error(data.error || 'Could not reschedule.');
      }
    } catch {
      toast.error('Network error while rescheduling.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = async () => {
    if (!apt) return;
    try {
      setSubmitting(true);
      const res = await fetch('/api/appointments', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: apt.id,
          status: 'cancelled',
          notes: 'Cancelled by client via self-service link',
        }),
      });
      const data = await res.json();
      if (data.success) {
        setApt((prev) => (prev ? { ...prev, status: 'cancelled' } : prev));
        toast.success('Appointment cancelled.');
      } else {
        toast.error(data.error || 'Could not cancel.');
      }
    } catch {
      toast.error('Network error while cancelling.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-secondary)] flex flex-col items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-md space-y-5">
        <div className="flex items-center justify-center gap-2.5">
          <CircleCloudIcon size={32} />
          <span className="text-lg font-extrabold tracking-tight text-[var(--text-primary)]">
            {apt?.workspace?.name || 'AirBook'}
          </span>
        </div>

        <Card className="p-6 space-y-5">
          {loading ? (
            <div className="py-10 text-center text-xs text-[var(--text-secondary)] animate-pulse">
              Loading appointment...
            </div>
          ) : !apt ? (
            <div className="py-8 text-center space-y-3">
              <p className="text-sm font-bold text-[var(--text-primary)]">Appointment not found</p>
              <Link href="/" className="btn-secondary inline-flex px-4 py-2 text-xs">
                Back to AirBook
              </Link>
            </div>
          ) : (
            <>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h1 className="text-lg font-extrabold text-[var(--text-primary)]">
                    {apt.service?.name || 'Appointment'}
                  </h1>
                  <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                    {apt.client?.name || 'Guest'}
                  </p>
                </div>
                <Badge
                  variant={apt.status === 'cancelled' ? 'danger' : apt.status === 'completed' ? 'success' : 'default'}
                  size="xs"
                >
                  {apt.status}
                </Badge>
              </div>

              <div className="p-4 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] space-y-2 text-xs">
                <div className="flex items-center gap-2 text-[var(--text-primary)] font-semibold">
                  <Icon regular={Calendar24Regular} size="sm" tone="secondary" />
                  <span>{apt.dateStr}</span>
                  <span>·</span>
                  <Icon regular={Clock24Regular} size="sm" tone="secondary" />
                  <span className="font-mono">{apt.startTime} ({apt.durationMinutes} min)</span>
                </div>
                <div className="flex items-center gap-2 text-[var(--text-secondary)]">
                  <Icon regular={Person24Regular} size="sm" tone="secondary" />
                  <span>{apt.staff?.name || 'Specialist'}</span>
                </div>
              </div>

              {apt.status !== 'cancelled' && apt.status !== 'completed' && (
                <div className="space-y-4 pt-2 border-t border-[var(--border-subtle)]">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-secondary)] block">
                      Reschedule Date
                    </label>
                    <input
                      type="date"
                      value={selectedDate}
                      min={new Date().toISOString().slice(0, 10)}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="input-base w-full"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-secondary)] block">
                      Available Times
                    </label>
                    {loadingSlots ? (
                      <p className="text-xs text-[var(--text-secondary)]">Checking availability...</p>
                    ) : slots.length === 0 ? (
                      <p className="text-xs text-[var(--text-secondary)]">No open slots on this date.</p>
                    ) : (
                      <div className="grid grid-cols-3 gap-2 max-h-40 overflow-y-auto">
                        {slots.map((slot) => (
                          <button
                            key={slot}
                            type="button"
                            onClick={() => setSelectedSlot(slot)}
                            className={`py-2 px-2.5 rounded-xl text-xs font-mono font-bold border transition-all cursor-pointer ${
                              selectedSlot === slot
                                ? 'bg-[#2BB5FF] text-white border-[#2BB5FF]'
                                : 'bg-[var(--bg-primary)] text-[var(--text-primary)] border-[var(--border-subtle)] hover:border-[#2BB5FF]/50'
                            }`}
                          >
                            {slot}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col gap-2 pt-2">
                    <button
                      type="button"
                      disabled={submitting || !selectedSlot}
                      onClick={handleReschedule}
                      className="btn-primary w-full justify-center"
                    >
                      <Icon filled={CheckmarkCircle24Filled} size="sm" />
                      <span>Confirm Reschedule</span>
                    </button>
                    <button
                      type="button"
                      disabled={submitting}
                      onClick={handleCancel}
                      className="w-full py-2.5 rounded-2xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
                    >
                      <Icon filled={DismissCircle24Filled} size="sm" />
                      <span>Cancel Appointment</span>
                    </button>
                  </div>
                </div>
              )}

              {apt.workspace?.slug && (
                <div className="pt-2 text-center">
                  <Link
                    href={`/book/${apt.workspace.slug}`}
                    className="text-xs font-bold text-[#2BB5FF] hover:underline"
                  >
                    Book another appointment
                  </Link>
                </div>
              )}
            </>
          )}
        </Card>
      </div>
    </div>
  );
}
