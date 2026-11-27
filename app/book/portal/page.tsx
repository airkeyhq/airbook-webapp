'use client';

import React, { Suspense, useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Card } from '@/components/primitives/Card';
import { Badge } from '@/components/primitives/Badge';
import { PinInput } from '@/components/primitives/PinInput';
import { Icon } from '@/components/primitives/Icon';
import { CircleCloudIcon } from '@/components/Logo';
import { toast } from '@/components/primitives/Sonner';
import {
  Mail24Regular,
  Sparkle24Filled,
  Calendar24Regular,
  Clock24Regular,
  GiftCard24Regular,
  SignOut24Regular,
  ArrowRight24Filled,
} from '@fluentui/react-icons';

interface PortalProfile {
  email: string;
  name: string;
  totalVisits: number;
  totalSpentCents: number;
  walletBalanceCents: number;
  loyaltyPoints: number;
  loyaltyTier: string;
}

interface PortalBooking {
  id: string;
  dateStr: string;
  startTime: string;
  durationMinutes: number;
  priceCents: number;
  status: string;
  workspaceName: string;
  workspaceSlug: string;
  serviceName?: string | null;
  staffName?: string | null;
}

interface PortalGiftCard {
  id: string;
  code: string;
  currentBalanceCents: number;
  workspaceName: string;
}

function ClientPortalInner() {
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<PortalProfile | null>(null);
  const [bookings, setBookings] = useState<PortalBooking[]>([]);
  const [giftCards, setGiftCards] = useState<PortalGiftCard[]>([]);

  // OTP Auth State
  const [email, setEmail] = useState('');
  const [step, setStep] = useState<'email' | 'code'>('email');
  const [otpCode, setOtpCode] = useState('');
  const [otpError, setOtpError] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const loadPortal = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/client-portal/me');
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setProfile(data.profile);
          setBookings(data.bookings || []);
          setGiftCards(data.giftCards || []);
          return;
        }
      }
      setProfile(null);
    } catch {
      setProfile(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const verifyOtp = useCallback(
    async (targetEmail: string, code: string) => {
      try {
        setSubmitting(true);
        setOtpError(false);
        const res = await fetch('/api/client-portal/auth', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'verify', email: targetEmail, code }),
        });
        const data = await res.json();
        if (res.ok && data.success) {
          toast.success('Signed in to AirBook Client Portal');
          await loadPortal();
        } else {
          setOtpError(true);
          toast.error(data.error || 'Invalid or expired code.');
        }
      } catch {
        setOtpError(true);
        toast.error('Network error verifying code.');
      } finally {
        setSubmitting(false);
      }
    },
    [loadPortal]
  );

  useEffect(() => {
    const qEmail = searchParams.get('email');
    const qCode = searchParams.get('code');
    if (qEmail && qCode && qCode.length === 6) {
      setEmail(qEmail);
      verifyOtp(qEmail, qCode);
    } else {
      loadPortal();
    }
  }, [searchParams, verifyOtp, loadPortal]);

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    try {
      setSubmitting(true);
      const res = await fetch('/api/client-portal/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'request', email: email.trim() }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setStep('code');
        toast.success('6-digit sign-in code sent to your email.');
      } else {
        toast.error(data.error || 'Could not send code.');
      }
    } catch {
      toast.error('Network error sending code.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSignOut = async () => {
    await fetch('/api/client-portal/auth', { method: 'DELETE' });
    setProfile(null);
    setBookings([]);
    setGiftCards([]);
    setStep('email');
    setOtpCode('');
  };

  return (
    <div className="min-h-screen bg-[var(--bg-secondary)] py-8 px-4 sm:px-6 flex flex-col items-center">
      <div className="w-full max-w-2xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <CircleCloudIcon size={32} />
            <div>
              <h1 className="text-lg font-extrabold text-[var(--text-primary)] tracking-tight">
                AirBook Client Portal
              </h1>
              <p className="text-[11px] text-[var(--text-secondary)]">
                My Bookings & Loyalty Wallet
              </p>
            </div>
          </div>

          {profile && (
            <button
              type="button"
              onClick={handleSignOut}
              className="btn-secondary h-9 px-3 rounded-xl text-xs font-bold flex items-center gap-1.5"
            >
              <Icon regular={SignOut24Regular} size="xs" />
              <span>Sign Out</span>
            </button>
          )}
        </div>

        {loading ? (
          <Card className="p-8 text-center text-xs text-[var(--text-secondary)] animate-pulse">
            Loading your bookings and loyalty wallet...
          </Card>
        ) : !profile ? (
          <Card className="p-6 sm:p-8 space-y-5 max-w-md mx-auto w-full">
            <div className="space-y-1">
              <h2 className="text-base font-extrabold text-[var(--text-primary)]">
                {step === 'email' ? 'Sign in with Magic Code' : 'Enter 6-Digit Code'}
              </h2>
              <p className="text-xs text-[var(--text-secondary)]">
                {step === 'email'
                  ? 'Enter the email you used when booking to view upcoming appointments, reschedule, and track loyalty points.'
                  : `We sent a 6-digit verification code to ${email}.`}
              </p>
            </div>

            {step === 'email' ? (
              <form onSubmit={handleRequestOtp} className="space-y-3.5">
                <div className="relative">
                  <input
                    type="email"
                    required
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input-base w-full pl-10"
                  />
                  <Icon
                    regular={Mail24Regular}
                    size="sm"
                    tone="muted"
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                  />
                </div>
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-primary w-full justify-center"
                >
                  <span>{submitting ? 'Sending...' : 'Send 6-Digit Code'}</span>
                  <Icon filled={ArrowRight24Filled} size="xs" />
                </button>
              </form>
            ) : (
              <div className="space-y-4">
                <PinInput
                  length={6}
                  value={otpCode}
                  onChange={(val) => {
                    setOtpCode(val);
                    setOtpError(false);
                  }}
                  onComplete={(val) => verifyOtp(email, val)}
                  error={otpError}
                  disabled={submitting}
                  spark
                />
                <div className="flex items-center justify-between text-xs">
                  <button
                    type="button"
                    onClick={() => {
                      setStep('email');
                      setOtpCode('');
                      setOtpError(false);
                    }}
                    className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] font-semibold"
                  >
                    Change email
                  </button>
                  <button
                    type="button"
                    onClick={() => verifyOtp(email, otpCode)}
                    disabled={submitting || otpCode.length !== 6}
                    className="font-bold text-[#2BB5FF] disabled:opacity-40"
                  >
                    {submitting ? 'Verifying...' : 'Verify Code'}
                  </button>
                </div>
              </div>
            )}
          </Card>
        ) : (
          <>
            {/* Loyalty & Wallet Summary */}
            <Card className="p-5 sm:p-6 space-y-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs text-[var(--text-secondary)]">{profile.email}</p>
                  <h2 className="text-xl font-extrabold text-[var(--text-primary)]">{profile.name}</h2>
                </div>
                <Badge variant="default" size="md" className="gap-1.5">
                  <Icon filled={Sparkle24Filled} size="xs" />
                  <span>{profile.loyaltyTier} Member</span>
                </Badge>
              </div>

              <div className="grid grid-cols-3 gap-3 pt-2 border-t border-[var(--border-subtle)]">
                <div>
                  <p className="text-[10px] uppercase font-bold tracking-wider text-[var(--text-muted)]">
                    Loyalty Points
                  </p>
                  <p className="text-lg font-black font-mono text-[var(--text-primary)]">
                    {profile.loyaltyPoints}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold tracking-wider text-[var(--text-muted)]">
                    Wallet Credit
                  </p>
                  <p className="text-lg font-black font-mono text-emerald-600 dark:text-emerald-400">
                    ${(profile.walletBalanceCents / 100).toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold tracking-wider text-[var(--text-muted)]">
                    Total Visits
                  </p>
                  <p className="text-lg font-black font-mono text-[var(--text-primary)]">
                    {profile.totalVisits}
                  </p>
                </div>
              </div>

              {giftCards.length > 0 && (
                <div className="pt-3 border-t border-[var(--border-subtle)] space-y-2">
                  <p className="text-[10px] uppercase font-bold tracking-wider text-[var(--text-secondary)] flex items-center gap-1.5">
                    <Icon regular={GiftCard24Regular} size="xs" />
                    <span>Active Gift Cards</span>
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {giftCards.map((gc) => (
                      <Badge key={gc.id} variant="subtle" size="sm" className="font-mono">
                        {gc.code} · ${(gc.currentBalanceCents / 100).toFixed(2)} ({gc.workspaceName})
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </Card>

            {/* My Bookings */}
            <Card className="p-5 sm:p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-primary)] flex items-center gap-2">
                  <Icon regular={Calendar24Regular} size="sm" tone="secondary" />
                  <span>My Bookings ({bookings.length})</span>
                </h3>
              </div>

              {bookings.length === 0 ? (
                <p className="text-xs text-[var(--text-secondary)] py-6 text-center">
                  No appointments found for {profile.email} yet.
                </p>
              ) : (
                <div className="divide-y divide-[var(--border-subtle)]">
                  {bookings.map((b) => (
                    <div
                      key={b.id}
                      className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-extrabold text-[var(--text-primary)]">
                            {b.serviceName || 'Appointment'}
                          </span>
                          <Badge
                            variant={
                              b.status === 'cancelled'
                                ? 'danger'
                                : b.status === 'completed'
                                ? 'success'
                                : b.status === 'no_show'
                                ? 'warning'
                                : 'default'
                            }
                            size="xs"
                          >
                            {b.status}
                          </Badge>
                        </div>
                        <p className="text-xs text-[var(--text-secondary)] flex items-center gap-2 flex-wrap">
                          <span>{b.workspaceName}</span>
                          <span>·</span>
                          <span className="font-mono flex items-center gap-1">
                            <Icon regular={Clock24Regular} size="xs" />
                            {b.dateStr} {b.startTime}
                          </span>
                          {b.staffName && (
                            <>
                              <span>·</span>
                              <span>{b.staffName}</span>
                            </>
                          )}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 flex-shrink-0">
                        {b.status !== 'cancelled' && b.status !== 'completed' && b.status !== 'no_show' && (
                          <Link
                            href={`/book/manage/${b.id}`}
                            className="btn-secondary h-8 px-3 rounded-xl text-xs font-bold inline-flex items-center"
                          >
                            Manage / Reschedule
                          </Link>
                        )}
                        <Link
                          href={`/book/${b.workspaceSlug}`}
                          className="text-xs font-bold text-[#2BB5FF] hover:underline px-2"
                        >
                          Book Again
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </>
        )}
      </div>
    </div>
  );
}

export default function ClientPortalPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[var(--bg-secondary)] flex items-center justify-center text-xs text-[var(--text-secondary)]">
          Loading Client Portal...
        </div>
      }
    >
      <ClientPortalInner />
    </Suspense>
  );
}
