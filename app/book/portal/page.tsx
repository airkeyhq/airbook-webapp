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
  Receipt24Regular,
  DocumentSignature24Regular,
  Camera24Regular,
  ShieldCheckmark24Filled,
  Save24Filled,
  PeopleTeam24Regular,
  Add24Filled,
  Delete24Filled,
  Share24Regular,
} from '@fluentui/react-icons';

interface PortalProfile {
  email: string;
  name: string;
  totalVisits: number;
  totalSpentCents: number;
  walletBalanceCents: number;
  loyaltyPoints: number;
  loyaltyTier: string;
  preferences?: string;
  allergies?: string;
  isKycVerified?: boolean;
}

interface PortalBooking {
  id: string;
  groupId?: string | null;
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

interface PortalReceipt {
  id: string;
  receiptNumber?: string | null;
  totalCents: number;
  tipCents: number;
  paymentMethod: string;
  status: string;
  createdAt: string;
  workspaceName: string;
}

interface PortalWaiver {
  id: string;
  templateTitle: string;
  createdAt: string;
  workspaceName: string;
}

interface PortalPhoto {
  id: string;
  beforeUrl?: string;
  afterUrl?: string;
  title?: string;
  date?: string;
  workspaceName: string;
}

interface PortalGiftCard {
  id: string;
  code: string;
  currentBalanceCents: number;
  workspaceName: string;
}

interface FamilyMember {
  id: string;
  name: string;
  relationship: string;
  notes?: string;
}

type PortalTab = 'bookings' | 'loyalty' | 'receipts' | 'profile';

function ClientPortalInner() {
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<PortalTab>('bookings');
  const [profile, setProfile] = useState<PortalProfile | null>(null);
  const [bookings, setBookings] = useState<PortalBooking[]>([]);
  const [receipts, setReceipts] = useState<PortalReceipt[]>([]);
  const [waivers, setWaivers] = useState<PortalWaiver[]>([]);
  const [photos, setPhotos] = useState<PortalPhoto[]>([]);
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
  const [newFamName, setNewFamName] = useState('');
  const [newFamRel, setNewFamRel] = useState('Child');
  const [newFamNotes, setNewFamNotes] = useState('');
  const [giftCards, setGiftCards] = useState<PortalGiftCard[]>([]);

  // Preferences Form
  const [preferences, setPreferences] = useState('');
  const [allergies, setAllergies] = useState('');
  const [savingPrefs, setSavingPrefs] = useState(false);

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
          setPreferences(data.profile?.preferences || '');
          setAllergies(data.profile?.allergies || '');
          setBookings(data.bookings || []);
          setReceipts(data.receipts || []);
          setWaivers(data.waivers || []);
          setPhotos(data.photos || []);
          setFamilyMembers(data.familyMembers || []);
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

  const handleSavePreferences = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSavingPrefs(true);
      const res = await fetch('/api/client-portal/me', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ preferences, allergies }),
      });
      if (res.ok) {
        toast.success('Preferences & care notes saved.');
      } else {
        toast.error('Failed to save preferences.');
      }
    } catch {
      toast.error('Network error saving preferences.');
    } finally {
      setSavingPrefs(false);
    }
  };

  const handleSaveFamily = async (nextList: FamilyMember[]) => {
    setFamilyMembers(nextList);
    try {
      const res = await fetch('/api/client-portal/me', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ familyMembers: nextList }),
      });
      if (res.ok) {
        toast.success('Family profiles updated.');
      }
    } catch {
      toast.error('Could not save family profile.');
    }
  };

  const handleAddFamilyMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFamName.trim()) return;
    const next: FamilyMember[] = [
      ...familyMembers,
      {
        id: `fam-${Date.now()}`,
        name: newFamName.trim(),
        relationship: newFamRel,
        notes: newFamNotes.trim() || undefined,
      },
    ];
    setNewFamName('');
    setNewFamNotes('');
    await handleSaveFamily(next);
  };

  const handleSignOut = async () => {
    await fetch('/api/client-portal/auth', { method: 'DELETE' });
    setProfile(null);
    setBookings([]);
    setReceipts([]);
    setWaivers([]);
    setPhotos([]);
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
                Bookings, Loyalty, Receipts & Profile
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
            Loading your AirBook client account...
          </Card>
        ) : !profile ? (
          <Card className="p-6 sm:p-8 space-y-5 max-w-md mx-auto w-full">
            <div className="space-y-1">
              <h2 className="text-base font-extrabold text-[var(--text-primary)]">
                {step === 'email' ? 'Sign in with Magic Code' : 'Enter 6-Digit Code'}
              </h2>
              <p className="text-xs text-[var(--text-secondary)]">
                {step === 'email'
                  ? 'Enter the email you used when booking to access your appointments, loyalty points, receipts, and signed waivers.'
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
            {/* Profile Banner */}
            <Card className="p-5 sm:p-6">
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <div>
                  <p className="text-xs text-[var(--text-secondary)]">{profile.email}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <h2 className="text-xl font-extrabold text-[var(--text-primary)]">{profile.name}</h2>
                    {profile.isKycVerified && (
                      <Badge variant="success" size="xs" className="gap-1">
                        <Icon filled={ShieldCheckmark24Filled} size="xs" />
                        <span>ID Verified</span>
                      </Badge>
                    )}
                  </div>
                </div>
                <Badge variant="default" size="md" className="gap-1.5">
                  <Icon filled={Sparkle24Filled} size="xs" />
                  <span>{profile.loyaltyTier} Member</span>
                </Badge>
              </div>
            </Card>

            {/* Segmented Navigation */}
            <div className="flex items-center gap-1 p-1 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] overflow-x-auto">
              {(
                [
                  { id: 'bookings', label: `Bookings (${bookings.length})` },
                  { id: 'loyalty', label: 'Loyalty & Wallet' },
                  { id: 'receipts', label: `Receipts (${receipts.length})` },
                  { id: 'profile', label: 'Profile & Waivers' },
                ] as { id: PortalTab; label: string }[]
              ).map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                    activeTab === tab.id
                      ? 'bg-[var(--bg-secondary)] text-[var(--text-primary)] shadow-xs font-extrabold'
                      : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* TAB 1: My Bookings */}
            {activeTab === 'bookings' && (
              <Card className="p-5 sm:p-6 space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-primary)] flex items-center gap-2">
                  <Icon regular={Calendar24Regular} size="sm" tone="secondary" />
                  <span>My Bookings</span>
                </h3>

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
                            <>
                              <button
                                type="button"
                                onClick={() => {
                                  const url = `${window.location.origin}/book/${b.workspaceSlug}?party=${encodeURIComponent(b.groupId || b.id)}`;
                                  navigator.clipboard.writeText(url);
                                  toast.success('Group invite link copied!');
                                }}
                                className="btn-secondary h-8 px-2.5 rounded-xl text-xs font-bold inline-flex items-center gap-1"
                                title="Invite friend to group booking"
                              >
                                <Icon regular={Share24Regular} size="xs" />
                                <span>Invite</span>
                              </button>
                              <Link
                                href={`/book/manage/${b.id}`}
                                className="btn-secondary h-8 px-3 rounded-xl text-xs font-bold inline-flex items-center"
                              >
                                Manage
                              </Link>
                            </>
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
            )}

            {/* TAB 2: Loyalty & Wallet */}
            {activeTab === 'loyalty' && (
              <Card className="p-5 sm:p-6 space-y-5">
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <p className="text-[10px] uppercase font-bold tracking-wider text-[var(--text-muted)]">
                      Loyalty Points
                    </p>
                    <p className="text-xl font-black font-mono text-[var(--text-primary)]">
                      {profile.loyaltyPoints}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold tracking-wider text-[var(--text-muted)]">
                      Wallet Credit
                    </p>
                    <p className="text-xl font-black font-mono text-emerald-600 dark:text-emerald-400">
                      ${(profile.walletBalanceCents / 100).toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold tracking-wider text-[var(--text-muted)]">
                      Total Visits
                    </p>
                    <p className="text-xl font-black font-mono text-[var(--text-primary)]">
                      {profile.totalVisits}
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-[var(--border-subtle)] space-y-2.5">
                  <p className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)] flex items-center gap-1.5">
                    <Icon regular={GiftCard24Regular} size="xs" />
                    <span>Active Gift Cards</span>
                  </p>
                  {giftCards.length === 0 ? (
                    <p className="text-xs text-[var(--text-secondary)]">No active gift cards linked to {profile.email}.</p>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {giftCards.map((gc) => (
                        <Badge key={gc.id} variant="subtle" size="sm" className="font-mono">
                          {gc.code} · ${(gc.currentBalanceCents / 100).toFixed(2)} ({gc.workspaceName})
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </Card>
            )}

            {/* TAB 3: Payment Receipts */}
            {activeTab === 'receipts' && (
              <Card className="p-5 sm:p-6 space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-primary)] flex items-center gap-2">
                  <Icon regular={Receipt24Regular} size="sm" tone="secondary" />
                  <span>Payment Receipts</span>
                </h3>

                {receipts.length === 0 ? (
                  <p className="text-xs text-[var(--text-secondary)] py-6 text-center">
                    No receipts found yet.
                  </p>
                ) : (
                  <div className="divide-y divide-[var(--border-subtle)]">
                    {receipts.map((rec) => (
                      <div key={rec.id} className="py-3 flex items-center justify-between gap-3 text-xs">
                        <div>
                          <p className="font-bold text-[var(--text-primary)]">
                            {rec.workspaceName} · {rec.receiptNumber || rec.id.slice(0, 8)}
                          </p>
                          <p className="text-[11px] text-[var(--text-secondary)] font-mono mt-0.5">
                            {new Date(rec.createdAt).toLocaleDateString()} · {rec.paymentMethod}
                          </p>
                        </div>
                        <div className="text-right font-mono">
                          <p className="font-extrabold text-[var(--text-primary)]">
                            ${(rec.totalCents / 100).toFixed(2)}
                          </p>
                          {rec.tipCents > 0 && (
                            <p className="text-[10px] text-[var(--text-muted)]">
                              Incl. ${(rec.tipCents / 100).toFixed(2)} tip
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            )}

            {/* TAB 4: Profile, Photos & Waivers */}
            {activeTab === 'profile' && (
              <div className="space-y-4">
                <Card className="p-5 sm:p-6 space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-primary)] flex items-center gap-2">
                    <Icon regular={PeopleTeam24Regular} size="sm" tone="secondary" />
                    <span>Family & Dependents ({familyMembers.length})</span>
                  </h3>
                  <p className="text-xs text-[var(--text-secondary)]">
                    Save kids or family members so you can add them in 1 tap when booking together.
                  </p>

                  {familyMembers.length > 0 && (
                    <div className="divide-y divide-[var(--border-subtle)]">
                      {familyMembers.map((fm) => (
                        <div key={fm.id} className="py-2.5 flex items-center justify-between gap-3 text-xs">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-[var(--text-primary)]">{fm.name}</span>
                              <Badge variant="subtle" size="xs">{fm.relationship}</Badge>
                            </div>
                            {fm.notes && <p className="text-[11px] text-[var(--text-secondary)] mt-0.5">{fm.notes}</p>}
                          </div>
                          <button
                            type="button"
                            onClick={() => handleSaveFamily(familyMembers.filter((m) => m.id !== fm.id))}
                            className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-rose-500 transition-colors"
                          >
                            <Icon filled={Delete24Filled} size="xs" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  <form onSubmit={handleAddFamilyMember} className="grid grid-cols-1 sm:grid-cols-4 gap-2 pt-2 border-t border-[var(--border-subtle)]">
                    <input
                      type="text"
                      required
                      placeholder="Name (e.g. Liam)"
                      value={newFamName}
                      onChange={(e) => setNewFamName(e.target.value)}
                      className="input-base text-xs"
                    />
                    <select
                      value={newFamRel}
                      onChange={(e) => setNewFamRel(e.target.value)}
                      className="input-base text-xs"
                    >
                      <option value="Child">Child</option>
                      <option value="Partner">Partner</option>
                      <option value="Parent">Parent</option>
                      <option value="Guest">Guest</option>
                    </select>
                    <input
                      type="text"
                      placeholder="Notes (optional)"
                      value={newFamNotes}
                      onChange={(e) => setNewFamNotes(e.target.value)}
                      className="input-base text-xs"
                    />
                    <button type="submit" className="btn-secondary h-10 text-xs font-bold flex items-center justify-center gap-1">
                      <Icon filled={Add24Filled} size="xs" />
                      <span>Add</span>
                    </button>
                  </form>
                </Card>

                <Card className="p-5 sm:p-6 space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-primary)]">
                    Care Preferences & Allergies
                  </h3>
                  <form onSubmit={handleSavePreferences} className="space-y-3">
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-secondary)] block">
                        Service Preferences
                      </label>
                      <textarea
                        rows={2}
                        value={preferences}
                        onChange={(e) => setPreferences(e.target.value)}
                        placeholder="Preferred stylist, water temperature, quiet appointment..."
                        className="input-base w-full text-xs"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-secondary)] block">
                        Allergies & Sensitivities
                      </label>
                      <input
                        type="text"
                        value={allergies}
                        onChange={(e) => setAllergies(e.target.value)}
                        placeholder="e.g. Fragrance-free, latex sensitivity..."
                        className="input-base w-full text-xs"
                      />
                    </div>
                    <button type="submit" disabled={savingPrefs} className="btn-primary h-9 px-4 text-xs">
                      <Icon filled={Save24Filled} size="xs" />
                      <span>{savingPrefs ? 'Saving...' : 'Save Preferences'}</span>
                    </button>
                  </form>
                </Card>

                <Card className="p-5 sm:p-6 space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-primary)] flex items-center gap-2">
                    <Icon regular={Camera24Regular} size="sm" tone="secondary" />
                    <span>Before & After Photos ({photos.length})</span>
                  </h3>
                  {photos.length === 0 ? (
                    <p className="text-xs text-[var(--text-secondary)]">No transformation photos shared yet.</p>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {photos.map((p) => (
                        <div key={p.id} className="p-3 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] space-y-2">
                          <p className="text-xs font-bold text-[var(--text-primary)]">{p.title || 'Session'}</p>
                          <div className="grid grid-cols-2 gap-2">
                            {p.beforeUrl && (
                              <img src={p.beforeUrl} alt="Before" className="w-full h-24 object-cover rounded-xl" />
                            )}
                            {p.afterUrl && (
                              <img src={p.afterUrl} alt="After" className="w-full h-24 object-cover rounded-xl" />
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </Card>

                <Card className="p-5 sm:p-6 space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-primary)] flex items-center gap-2">
                    <Icon regular={DocumentSignature24Regular} size="sm" tone="secondary" />
                    <span>Signed Waivers ({waivers.length})</span>
                  </h3>
                  {waivers.length === 0 ? (
                    <p className="text-xs text-[var(--text-secondary)]">No signed waivers on file.</p>
                  ) : (
                    <div className="divide-y divide-[var(--border-subtle)]">
                      {waivers.map((w) => (
                        <div key={w.id} className="py-2.5 flex items-center justify-between text-xs">
                          <div>
                            <p className="font-bold text-[var(--text-primary)]">{w.templateTitle}</p>
                            <p className="text-[11px] text-[var(--text-secondary)]">{w.workspaceName}</p>
                          </div>
                          <Badge variant="success" size="xs">
                            Signed · {new Date(w.createdAt).toLocaleDateString()}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  )}
                </Card>
              </div>
            )}
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
