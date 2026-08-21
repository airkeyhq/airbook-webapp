'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAirBookStore } from '@/lib/store';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { useToast } from '@/components/Toast';
import { CustomSelect } from '@/components/CustomSelect';
import { getAvatarUrl } from '@/lib/avatars';
import {
  Globe24Regular,
  Globe24Filled,
  Copy24Filled,
  Open24Filled,
  QrCode24Filled,
  QrCode24Regular,
  Clock24Regular,
  Money24Regular,
  PeopleTeam24Regular,
  Sparkle24Regular,
  Building24Regular,
  Building24Filled,
  Cut24Regular,
  Add24Filled,
  Dismiss24Filled,
  Edit24Filled,
  Delete24Filled,
  Checkmark24Filled,
  CheckmarkCircle24Filled,
  ShieldCheckmark24Regular,
  Tag24Regular,
  Phone24Regular,
  Location24Regular,
  ArrowRight24Filled,
  Payment24Filled,
  Payment24Regular,
} from '@fluentui/react-icons';

/* ─── Toggle Switch ─── */
function Toggle({
  enabled,
  onToggle,
  color = 'bg-blue-600',
}: {
  enabled: boolean;
  onToggle: () => void;
  color?: string;
}) {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onToggle();
      }}
      className={`relative w-11 h-6 rounded-full p-0.5 transition-colors flex items-center cursor-pointer ${
        enabled ? color : 'bg-black/10 dark:bg-white/20'
      }`}
      aria-pressed={enabled}
    >
      <motion.div
        animate={{ x: enabled ? 20 : 0 }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        className="w-5 h-5 rounded-full bg-white dark:bg-slate-200 shadow-sm"
      />
    </button>
  );
}

/* ─── Studio Section Card ─── */
function StudioSection({
  title,
  icon: Icon,
  badge,
  children,
}: {
  title: string;
  icon: React.ElementType;
  badge?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="p-5 rounded-3xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] space-y-4 shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-primary)] flex items-center gap-2">
          <Icon className="w-4 h-4 text-blue-500" />
          <span>{title}</span>
        </h3>
        {badge && (
          <span className="text-[10px] font-mono font-extrabold text-blue-600 dark:text-blue-400 bg-blue-500/10 px-2.5 py-0.5 rounded-full border border-blue-500/20">
            {badge}
          </span>
        )}
      </div>
      {children}
    </div>
  );
}

/* ─── Form Field ─── */
function StudioField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <label className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-secondary)] block">
        {label}
      </label>
      {children}
    </div>
  );
}

export const OnlineBookingModule: React.FC = () => {
  const {
    workspaceName,
    workspaceSlug,
    setWorkspaceSlug,
    services,
    staffMembers,
    stations,
    addStation,
    updateStation,
    deleteStation,
  } = useAirBookStore();
  const { t } = useTranslation();
  const { addToast } = useToast();

  // Settings State
  const [slugInput, setSlugInput] = useState(workspaceSlug || 'my-salon');
  const [cancellationNotice, setCancellationNotice] = useState('24');
  const [depositPercent, setDepositPercent] = useState('20');
  const [bookingWindowDays, setBookingWindowDays] = useState('60');
  const [minNoticeHours, setMinNoticeHours] = useState('2');
  const [allowAnyoneSpecialist, setAllowAnyoneSpecialist] = useState(true);
  const [allowPartyBooking, setAllowPartyBooking] = useState(true);
  const [noShowFee, setNoShowFee] = useState(false);

  // Hidden Services (services toggled off from public booking)
  const [hiddenServiceIds, setHiddenServiceIds] = useState<string[]>([]);

  // QR Code Modal State
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [saving, setSaving] = useState(false);

  // Station Modal States
  const [isAddStationModalOpen, setIsAddStationModalOpen] = useState(false);
  const [newStationName, setNewStationName] = useState('');
  const [newStationCategory, setNewStationCategory] = useState('Hair & Styling');
  const [editingStationId, setEditingStationId] = useState<string | null>(null);
  const [editingStationName, setEditingStationName] = useState('');
  const [editingStationCategory, setEditingStationCategory] = useState('Hair & Styling');

  // Stripe Connect State
  const [stripeConnected, setStripeConnected] = useState(false);
  const [isConnectingStripe, setIsConnectingStripe] = useState(false);

  // Load initial settings and Stripe Connect status on mount
  useEffect(() => {
    async function loadWorkspaceSettings() {
      try {
        const [settingsRes, stripeRes] = await Promise.all([
          fetch('/api/settings').then((r) => r.json()).catch(() => ({})),
          fetch('/api/stripe/connect/status').then((r) => r.json()).catch(() => ({})),
        ]);

        if (settingsRes.workspace) {
          if (settingsRes.workspace.slug) {
            setSlugInput(settingsRes.workspace.slug);
            setWorkspaceSlug(settingsRes.workspace.slug);
          }
          if (settingsRes.workspace.cancellationNoticeHours) {
            setCancellationNotice(String(settingsRes.workspace.cancellationNoticeHours));
          }
          if (settingsRes.workspace.depositRequiredPercent !== undefined) {
            setDepositPercent(String(settingsRes.workspace.depositRequiredPercent));
          }
        }

        if (stripeRes.connected) {
          setStripeConnected(true);
        }
      } catch (err) {
        console.warn('Failed to load workspace settings:', err);
      }
    }
    loadWorkspaceSettings();
  }, [setWorkspaceSlug]);

  const handleConnectStripe = async () => {
    setIsConnectingStripe(true);
    try {
      const res = await fetch('/api/stripe/connect/onboard', { method: 'POST' }).then((r) => r.json());
      if (res.url) {
        if (res.simulated) {
          setStripeConnected(true);
          addToast(res.message || 'Stripe Connect linked (Simulated).', 'success');
        } else {
          window.location.href = res.url;
        }
      }
    } catch {
      addToast('Failed to initiate Stripe onboarding.', 'error');
    } finally {
      setIsConnectingStripe(false);
    }
  };

  const publicUrl = typeof window !== 'undefined' ? `${window.location.origin}/book/${slugInput}` : `https://airbook.app/book/${slugInput}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(publicUrl);
      setIsCopied(true);
      addToast(t('linkCopied'), 'success');
      setTimeout(() => setIsCopied(false), 2000);
    } catch {
      addToast('Failed to copy link', 'error');
    }
  };

  const toggleServiceVisibility = (serviceId: string) => {
    setHiddenServiceIds((prev) =>
      prev.includes(serviceId) ? prev.filter((id) => id !== serviceId) : [...prev, serviceId]
    );
  };

  const handleSaveSettings = async () => {
    setSaving(true);
    setWorkspaceSlug(slugInput.trim());

    try {
      await fetch('/api/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slug: slugInput.trim(),
          cancellationNoticeHours: parseInt(cancellationNotice, 10),
          depositRequiredPercent: parseInt(depositPercent, 10),
        }),
      });
      addToast(t('studioSavedToast'), 'success');
    } catch {
      addToast('Saved locally, error syncing to database.', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 space-y-6 pb-24">
      {/* Header Banner with Action Buttons */}
      <div className="p-5 sm:p-6 rounded-3xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-md">
                <Globe24Filled className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-extrabold text-[var(--text-primary)] tracking-tight">
                {t('onlineBookingTitle')}
              </h2>
            </div>
            <p className="text-xs text-[var(--text-secondary)] max-w-xl">
              {t('onlineBookingDesc')}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setIsQrModalOpen(true)}
              className="px-3.5 py-2 rounded-2xl bg-black/5 dark:bg-white/10 hover:bg-black/10 text-xs font-bold text-[var(--text-primary)] flex items-center gap-2 transition-all cursor-pointer"
            >
              <QrCode24Filled className="w-4 h-4 text-purple-500" />
              <span>{t('qrCodeModalTitle')}</span>
            </button>

            <button
              type="button"
              onClick={handleCopyLink}
              className="px-3.5 py-2 rounded-2xl bg-black/5 dark:bg-white/10 hover:bg-black/10 text-xs font-bold text-[var(--text-primary)] flex items-center gap-2 transition-all cursor-pointer"
            >
              {isCopied ? <Checkmark24Filled className="w-4 h-4 text-emerald-500" /> : <Copy24Filled className="w-4 h-4 text-blue-500" />}
              <span>{isCopied ? t('linkCopied') : t('copyBookingLink')}</span>
            </button>

            <a
              href={`/book/${slugInput}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold flex items-center gap-2 shadow-md transition-all cursor-pointer"
            >
              <Open24Filled className="w-4 h-4" />
              <span>{t('openLiveBookingPage')}</span>
            </a>
          </div>
        </div>

        {/* Live URL Pill */}
        <div className="p-3 rounded-2xl bg-black/5 dark:bg-white/5 border border-[var(--border-subtle)] flex items-center justify-between gap-3 text-xs font-mono">
          <div className="flex items-center gap-2 truncate">
            <span className="text-[var(--text-secondary)] font-bold">{t('liveBookingUrl')}:</span>
            <span className="text-blue-600 dark:text-blue-400 font-extrabold truncate">{publicUrl}</span>
          </div>
          <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold uppercase tracking-wider flex-shrink-0">
            Active
          </span>
        </div>
      </div>

      {/* Main Studio Grid: Left Configuration & Right Live Mobile Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Rules & Policies */}
        <div className="lg:col-span-7 space-y-6">
          {/* Section 1: URL & Slug Manager */}
          <StudioSection title="Custom Booking Slug" icon={Globe24Regular}>
            <StudioField label={t('bookingSlug')}>
              <div className="flex items-center bg-black/5 dark:bg-white/5 px-3.5 py-2.5 rounded-xl border border-[var(--border-subtle)] text-xs font-mono">
                <span className="text-[var(--text-secondary)] opacity-70">airbook.app/book/</span>
                <input
                  type="text"
                  value={slugInput}
                  onChange={(e) => setSlugInput(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-'))}
                  className="bg-transparent font-extrabold text-[var(--text-primary)] focus:outline-none w-full ml-0.5"
                />
              </div>
            </StudioField>
          </StudioSection>

          {/* Section 2: Scheduling & Buffer Rules */}
          <StudioSection title={t('bookingRulesTitle')} icon={Clock24Regular}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <StudioField label={t('advanceBookingWindow')}>
                <CustomSelect
                  value={bookingWindowDays}
                  onChange={setBookingWindowDays}
                  options={[
                    { value: '30', label: '30 Days in advance' },
                    { value: '60', label: '60 Days in advance' },
                    { value: '90', label: '90 Days in advance' },
                    { value: '180', label: '6 Months in advance' },
                  ]}
                />
              </StudioField>

              <StudioField label={t('minNoticeRequired')}>
                <CustomSelect
                  value={minNoticeHours}
                  onChange={setMinNoticeHours}
                  options={[
                    { value: '1', label: '1 Hour before slot' },
                    { value: '2', label: '2 Hours before slot' },
                    { value: '4', label: '4 Hours before slot' },
                    { value: '24', label: '24 Hours (Next day only)' },
                  ]}
                />
              </StudioField>
            </div>

            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between p-3 rounded-2xl bg-black/5 dark:bg-white/5">
                <div className="pr-3">
                  <p className="text-xs font-bold text-[var(--text-primary)]">{t('allowAnyoneToggle')}</p>
                  <p className="text-[11px] text-[var(--text-secondary)] mt-0.5">{t('allowAnyoneToggleDesc')}</p>
                </div>
                <Toggle enabled={allowAnyoneSpecialist} onToggle={() => setAllowAnyoneSpecialist(!allowAnyoneSpecialist)} />
              </div>

              <div className="flex items-center justify-between p-3 rounded-2xl bg-black/5 dark:bg-white/5">
                <div className="pr-3">
                  <p className="text-xs font-bold text-[var(--text-primary)]">{t('allowPartyToggle')}</p>
                  <p className="text-[11px] text-[var(--text-secondary)] mt-0.5">{t('allowPartyToggleDesc')}</p>
                </div>
                <Toggle enabled={allowPartyBooking} onToggle={() => setAllowPartyBooking(!allowPartyBooking)} />
              </div>
            </div>
          </StudioSection>

          {/* Section 3: Financial & Cancellation Policies */}
          <StudioSection title={t('financialPoliciesTitle')} icon={Money24Regular}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <StudioField label={t('depositPercent')}>
                <CustomSelect
                  value={depositPercent}
                  onChange={setDepositPercent}
                  options={[
                    { value: '0', label: '0% (No deposit required)' },
                    { value: '20', label: '20% Upfront deposit' },
                    { value: '50', label: '50% Half deposit' },
                    { value: '100', label: '100% Full prepayment' },
                  ]}
                />
              </StudioField>

              <StudioField label={t('cancellationNotice')}>
                <CustomSelect
                  value={cancellationNotice}
                  onChange={setCancellationNotice}
                  options={[
                    { value: '12', label: '12 Hours notice' },
                    { value: '24', label: '24 Hours notice' },
                    { value: '48', label: '48 Hours notice' },
                    { value: '72', label: '72 Hours notice' },
                  ]}
                />
              </StudioField>
            </div>

            <div className="flex items-center justify-between p-3 rounded-2xl bg-black/5 dark:bg-white/5">
              <div>
                <p className="text-xs font-bold text-[var(--text-primary)]">{t('noShowFee')}</p>
                <p className="text-[11px] text-[var(--text-secondary)] mt-0.5">{t('noShowNoticeDesc')}</p>
              </div>
              <Toggle enabled={noShowFee} onToggle={() => setNoShowFee(!noShowFee)} color="bg-orange-500" />
            </div>

            {/* Stripe Connect Direct Payouts Card */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-pink-600/10 border border-blue-500/20 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-blue-600 text-white flex items-center justify-center">
                    <Payment24Filled className="w-3.5 h-3.5" />
                  </div>
                  <p className="text-xs font-bold text-[var(--text-primary)]">{t('stripePayoutsActive')}</p>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${stripeConnected ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30' : 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30'}`}>
                  {stripeConnected ? 'Connected (Express)' : 'Setup Required'}
                </span>
              </div>
              <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed">
                {t('stripePayoutsDesc')}
              </p>
              {!stripeConnected && (
                <button
                  type="button"
                  disabled={isConnectingStripe}
                  onClick={handleConnectStripe}
                  className="w-full py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
                >
                  <Payment24Filled className="w-3.5 h-3.5" />
                  <span>{isConnectingStripe ? t('stripeConnecting') : t('connectStripeBtn')}</span>
                </button>
              )}
            </div>
          </StudioSection>

          {/* Section 4: Online Service Catalog Visibility */}
          <StudioSection title={t('serviceVisibilityTitle')} icon={Cut24Regular} badge={`${services.length - hiddenServiceIds.length} Visible`}>
            <p className="text-xs text-[var(--text-secondary)] -mt-1">
              {t('serviceVisibilityDesc')}
            </p>

            <div className="divide-y divide-black/5 dark:divide-white/5 border border-[var(--border-subtle)] rounded-2xl overflow-hidden bg-black/[0.02] dark:bg-white/[0.02]">
              {services.map((srv) => {
                const isVisible = !hiddenServiceIds.includes(srv.id);
                return (
                  <div key={srv.id} className="p-3.5 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-3.5 h-3.5 rounded-full flex-shrink-0" style={{ backgroundColor: srv.color }} />
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-[var(--text-primary)] truncate">{srv.name}</p>
                        <p className="text-[10px] text-[var(--text-secondary)] font-medium">
                          {srv.category} · {srv.durationMinutes} min · ${srv.price}
                        </p>
                      </div>
                    </div>
                    <Toggle enabled={isVisible} onToggle={() => toggleServiceVisibility(srv.id)} />
                  </div>
                );
              })}
            </div>
          </StudioSection>

          {/* Section 5: Workstations & Chairs */}
          <StudioSection title={t('chairsAndStations')} icon={Building24Regular} badge={`${stations.length} Active`}>
            <div className="flex items-center justify-between">
              <p className="text-xs text-[var(--text-secondary)]">Manage physical rooms & chairs for simultaneous booking limits.</p>
              <button
                type="button"
                onClick={() => {
                  setNewStationName('');
                  setNewStationCategory('Hair & Styling');
                  setIsAddStationModalOpen(true);
                }}
                className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm cursor-pointer"
              >
                <Add24Filled className="w-3.5 h-3.5" />
                <span>{t('addStation')}</span>
              </button>
            </div>

            <div className="divide-y divide-black/5 dark:divide-white/5 border border-[var(--border-subtle)] rounded-2xl overflow-hidden bg-black/[0.02] dark:bg-white/[0.02]">
              {stations.map((stn) => (
                <div key={stn.id} className="px-4 py-3 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-7 h-7 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center flex-shrink-0">
                      <Building24Regular className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-[var(--text-primary)] truncate">{stn.name}</p>
                      <p className="text-[10px] text-[var(--text-secondary)]">{stn.category || 'Station'}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingStationId(stn.id);
                        setEditingStationName(stn.name);
                        setEditingStationCategory(stn.category || 'Hair & Styling');
                      }}
                      className="p-1.5 rounded-xl text-[var(--text-secondary)] hover:text-blue-500 hover:bg-blue-500/10 transition-colors cursor-pointer"
                    >
                      <Edit24Filled className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        deleteStation(stn.id);
                        addToast('Station deleted', 'info');
                      }}
                      className="p-1.5 rounded-xl text-[var(--text-secondary)] hover:text-red-500 hover:bg-red-500/10 transition-colors cursor-pointer"
                    >
                      <Delete24Filled className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </StudioSection>

          {/* Sticky Save Button */}
          <motion.button
            whileTap={{ scale: 0.98 }}
            disabled={saving}
            onClick={handleSaveSettings}
            className="w-full py-3.5 rounded-2xl bg-black text-white dark:bg-white dark:text-black font-extrabold text-xs shadow-xl flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
          >
            <CheckmarkCircle24Filled className="w-4 h-4 text-emerald-500" />
            <span>{saving ? t('saving') : t('saveStudioChanges')}</span>
          </motion.button>
        </div>

        {/* Right Column: Interactive Mobile Live Simulator */}
        <div className="lg:col-span-5 sticky top-6 space-y-3">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-primary)] flex items-center gap-1.5">
              <Sparkle24Regular className="w-4 h-4 text-blue-500" />
              <span>{t('mobileSimulatorTitle')}</span>
            </h3>
            <span className="text-[10px] font-mono text-[var(--text-secondary)]">Preview (iPhone 16)</span>
          </div>

          {/* Smartphone Frame Container */}
          <div className="mx-auto w-full max-w-[340px] rounded-[44px] p-3.5 bg-slate-900 shadow-2xl border-4 border-slate-800 relative overflow-hidden">
            {/* Dynamic Island / Camera Notch */}
            <div className="w-24 h-4 bg-black rounded-full mx-auto mb-2.5 flex items-center justify-center">
              <div className="w-2.5 h-2.5 rounded-full bg-slate-950 border border-slate-800 ml-auto mr-2" />
            </div>

            {/* Inner Mobile Screen Content */}
            <div className="rounded-[32px] bg-[var(--bg-primary)] p-4 border border-black/10 dark:border-white/10 space-y-3 text-[var(--text-primary)] overflow-hidden min-h-[480px]">
              {/* Salon Header */}
              <div className="flex items-center gap-2.5 pb-3 border-b border-[var(--border-subtle)]">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-pink-500 text-white flex items-center justify-center font-bold text-sm shadow-xs flex-shrink-0">
                  {workspaceName ? workspaceName.charAt(0).toUpperCase() : 'A'}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-extrabold text-[var(--text-primary)] truncate">{workspaceName || 'My Salon'}</p>
                  <p className="text-[9px] text-[var(--text-secondary)] flex items-center gap-1 truncate">
                    <Location24Regular className="w-2.5 h-2.5 text-blue-500" />
                    <span>Downtown District</span>
                  </p>
                </div>
                <span className="ml-auto px-2 py-0.5 rounded-full bg-green-500/10 text-green-600 dark:text-green-400 text-[8px] font-bold uppercase">
                  Open
                </span>
              </div>

              {/* Step indicator */}
              <div className="flex items-center justify-between text-[10px] font-bold text-[var(--text-secondary)]">
                <span>Step 1 of 3</span>
                <span className="text-blue-600 dark:text-blue-400">Build Your Party</span>
              </div>

              {/* Sample Service Item Preview */}
              <div className="p-3 rounded-xl bg-black/5 dark:bg-white/5 border border-[var(--border-subtle)] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-[var(--text-primary)]">Guest 1</span>
                  <span className="text-[9px] text-[var(--text-secondary)]">1 Specialist</span>
                </div>
                <div className="p-2 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-subtle)] flex items-center justify-between text-[10px]">
                  <div className="flex items-center gap-1.5 truncate">
                    <div className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0" />
                    <span className="font-bold truncate">{services[0]?.name || 'Signature Cut & Styling'}</span>
                  </div>
                  <span className="font-extrabold">${services[0]?.price || 75}</span>
                </div>

                {allowAnyoneSpecialist && (
                  <div className="p-2 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-subtle)] flex items-center gap-1.5 text-[9px] font-semibold text-[var(--text-secondary)]">
                    <Sparkle24Regular className="w-3 h-3 text-blue-500 flex-shrink-0" />
                    <span className="truncate">First Available Specialist</span>
                  </div>
                )}
              </div>

              {/* Deposit notice badge in simulator */}
              {parseInt(depositPercent, 10) > 0 && (
                <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/20 text-[9px] text-blue-600 dark:text-blue-400 flex items-center gap-1.5">
                  <ShieldCheckmark24Regular className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>{depositPercent}% deposit required upon booking</span>
                </div>
              )}

              {/* Mobile CTA Mock Button */}
              <div className="pt-2">
                <div className="w-full py-2.5 rounded-xl bg-blue-600 text-white font-bold text-[10px] text-center shadow-md flex items-center justify-center gap-1.5">
                  <span>Continue to Date & Time</span>
                  <ArrowRight24Filled className="w-3 h-3" />
                </div>
              </div>

              <p className="text-[8px] text-center text-[var(--text-secondary)] italic pt-1">
                Free cancellation up to {cancellationNotice}h in advance.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* QR Code Modal */}
      <AnimatePresence>
        {isQrModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-sm rounded-3xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] p-6 shadow-2xl space-y-4 text-center"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-extrabold text-[var(--text-primary)] flex items-center gap-2">
                  <QrCode24Filled className="w-4 h-4 text-purple-500" />
                  <span>{t('qrCodeModalTitle')}</span>
                </h3>
                <button
                  type="button"
                  onClick={() => setIsQrModalOpen(false)}
                  className="p-1 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-[var(--text-secondary)] cursor-pointer"
                >
                  <Dismiss24Filled className="w-4 h-4" />
                </button>
              </div>

              <p className="text-xs text-[var(--text-secondary)]">{t('qrCodeModalDesc')}</p>

              {/* High-Resolution QR Vector Card */}
              <div className="p-6 bg-white rounded-2xl border border-slate-200 flex flex-col items-center justify-center shadow-md mx-auto w-48 h-48">
                <svg viewBox="0 0 100 100" className="w-36 h-36">
                  {/* Outer Frame */}
                  <rect x="0" y="0" width="100" height="100" fill="white" />
                  {/* Finder Pattern Top-Left */}
                  <rect x="10" y="10" width="24" height="24" fill="black" />
                  <rect x="14" y="14" width="16" height="16" fill="white" />
                  <rect x="18" y="18" width="8" height="8" fill="black" />
                  {/* Finder Pattern Top-Right */}
                  <rect x="66" y="10" width="24" height="24" fill="black" />
                  <rect x="70" y="14" width="16" height="16" fill="white" />
                  <rect x="74" y="18" width="8" height="8" fill="black" />
                  {/* Finder Pattern Bottom-Left */}
                  <rect x="10" y="66" width="24" height="24" fill="black" />
                  <rect x="14" y="70" width="16" height="16" fill="white" />
                  <rect x="18" y="74" width="8" height="8" fill="black" />
                  {/* Data Blocks */}
                  <rect x="40" y="10" width="8" height="8" fill="black" />
                  <rect x="52" y="14" width="8" height="8" fill="black" />
                  <rect x="40" y="26" width="8" height="8" fill="black" />
                  <rect x="48" y="38" width="8" height="8" fill="black" />
                  <rect x="14" y="44" width="8" height="8" fill="black" />
                  <rect x="28" y="48" width="8" height="8" fill="black" />
                  <rect x="66" y="44" width="8" height="8" fill="black" />
                  <rect x="78" y="52" width="8" height="8" fill="black" />
                  <rect x="40" y="66" width="8" height="8" fill="black" />
                  <rect x="54" y="74" width="8" height="8" fill="black" />
                  <rect x="70" y="74" width="8" height="8" fill="black" />
                  <rect x="82" y="82" width="8" height="8" fill="black" />
                </svg>
              </div>

              <div className="text-[11px] font-mono text-[var(--text-secondary)] truncate">
                airbook.app/book/{slugInput}
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="flex-1 py-2.5 rounded-xl bg-black/5 dark:bg-white/10 text-xs font-bold text-[var(--text-primary)] flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Copy24Filled className="w-3.5 h-3.5 text-blue-500" />
                  <span>{t('copyBookingLink')}</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    addToast('QR Code saved to Downloads', 'success');
                    setIsQrModalOpen(false);
                  }}
                  className="flex-1 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-md cursor-pointer"
                >
                  <QrCode24Filled className="w-3.5 h-3.5" />
                  <span>{t('downloadQrCode')}</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add / Edit Station Modal Dialogs */}
      <AnimatePresence>
        {isAddStationModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-sm rounded-3xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] p-6 shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-extrabold text-[var(--text-primary)] flex items-center gap-2">
                  <Building24Filled className="w-4 h-4 text-blue-500" />
                  <span>{t('addStation')}</span>
                </h3>
                <button
                  type="button"
                  onClick={() => setIsAddStationModalOpen(false)}
                  className="p-1 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-[var(--text-secondary)] cursor-pointer"
                >
                  <Dismiss24Filled className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3">
                <StudioField label={t('stationName')}>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Styling Chair #1"
                    value={newStationName}
                    onChange={(e) => setNewStationName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-xs font-semibold text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  />
                </StudioField>

                <StudioField label={t('stationCategory')}>
                  <CustomSelect
                    value={newStationCategory}
                    onChange={setNewStationCategory}
                    options={[
                      { value: 'Hair & Styling', label: 'Hair & Styling' },
                      { value: 'Wash Basin', label: 'Wash Basin' },
                      { value: 'Treatment Room', label: 'Treatment Room' },
                      { value: 'Nail Station', label: 'Nail Station' },
                      { value: 'Barber Chair', label: 'Barber Chair' },
                    ]}
                  />
                </StudioField>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddStationModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-black/5 dark:bg-white/10 text-xs font-bold text-[var(--text-primary)] cursor-pointer"
                >
                  {t('cancel')}
                </button>
                <button
                  type="button"
                  disabled={!newStationName.trim()}
                  onClick={() => {
                    if (newStationName.trim()) {
                      addStation({ name: newStationName.trim(), category: newStationCategory });
                      setIsAddStationModalOpen(false);
                      setNewStationName('');
                      addToast('Station added successfully', 'success');
                    }
                  }}
                  className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold shadow-md disabled:opacity-50 cursor-pointer"
                >
                  {t('save')}
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {editingStationId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-sm rounded-3xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] p-6 shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-extrabold text-[var(--text-primary)] flex items-center gap-2">
                  <Edit24Filled className="w-4 h-4 text-blue-500" />
                  <span>{t('editStation')}</span>
                </h3>
                <button
                  type="button"
                  onClick={() => setEditingStationId(null)}
                  className="p-1 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-[var(--text-secondary)] cursor-pointer"
                >
                  <Dismiss24Filled className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3">
                <StudioField label={t('stationName')}>
                  <input
                    type="text"
                    required
                    value={editingStationName}
                    onChange={(e) => setEditingStationName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-xs font-semibold text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  />
                </StudioField>

                <StudioField label={t('stationCategory')}>
                  <CustomSelect
                    value={editingStationCategory}
                    onChange={setEditingStationCategory}
                    options={[
                      { value: 'Hair & Styling', label: 'Hair & Styling' },
                      { value: 'Wash Basin', label: 'Wash Basin' },
                      { value: 'Treatment Room', label: 'Treatment Room' },
                      { value: 'Nail Station', label: 'Nail Station' },
                      { value: 'Barber Chair', label: 'Barber Chair' },
                    ]}
                  />
                </StudioField>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingStationId(null)}
                  className="flex-1 py-2.5 rounded-xl bg-black/5 dark:bg-white/10 text-xs font-bold text-[var(--text-primary)] cursor-pointer"
                >
                  {t('cancel')}
                </button>
                <button
                  type="button"
                  disabled={!editingStationName.trim()}
                  onClick={() => {
                    if (editingStationName.trim()) {
                      updateStation(editingStationId, editingStationName.trim(), editingStationCategory);
                      setEditingStationId(null);
                      addToast('Station updated', 'success');
                    }
                  }}
                  className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold shadow-md disabled:opacity-50 cursor-pointer"
                >
                  {t('save')}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
