'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAirBookStore } from '@/lib/store';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { useToast } from '@/components/Toast';
import { CustomSelect } from '@/components/CustomSelect';
import { CustomDomainStudio } from '@/components/CustomDomainStudio';
import { getAvatarUrl } from '@/lib/avatars';
import {
  Globe24Regular,
  Globe24Filled,
  Copy24Filled,
  Open24Filled,
  QrCode24Filled,
  QrCode24Regular,
  Clock24Regular,
  Clock24Filled,
  Calendar24Filled,
  Money24Regular,
  Sparkle24Regular,
  Sparkle24Filled,
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
  Color24Regular,
  Image24Regular,
  Share24Regular,
  Code24Regular,
  Link24Regular,
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
    <div className="p-5 sm:p-6 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] space-y-4 shadow-xs">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-primary)] flex items-center gap-2">
          <Icon className="w-4 h-4 text-[var(--text-secondary)]" />
          <span>{title}</span>
        </h3>
        {badge && (
          <span className="text-[10px] font-mono font-extrabold text-[var(--text-secondary)] bg-black/5 dark:bg-white/10 px-2.5 py-0.5 rounded-full border border-[var(--border-subtle)]">
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

const BRAND_PALETTES = [
  { name: 'Electric Blue', hex: '#007AFF', bg: 'bg-[#007AFF]' },
  { name: 'Obsidian Dark', hex: '#18181B', bg: 'bg-[#18181B]' },
  { name: 'Emerald Luxe', hex: '#059669', bg: 'bg-[#059669]' },
  { name: 'Rose Gold', hex: '#E11D48', bg: 'bg-[#E11D48]' },
  { name: 'Sunset Amber', hex: '#D97706', bg: 'bg-[#D97706]' },
  { name: 'Violet Prestige', hex: '#7C3AED', bg: 'bg-[#7C3AED]' },
];

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

  // Navigation Tab State
  const [activeTab, setActiveTab] = useState<'links' | 'policies' | 'branding'>('links');

  // Policy Settings State
  const [slugInput, setSlugInput] = useState(workspaceSlug || 'my-salon');
  const [cancellationNotice, setCancellationNotice] = useState('24');
  const [depositPercent, setDepositPercent] = useState('20');
  const [bookingWindowDays, setBookingWindowDays] = useState('60');
  const [minNoticeHours, setMinNoticeHours] = useState('2');
  const [allowAnyoneSpecialist, setAllowAnyoneSpecialist] = useState(true);
  const [allowPartyBooking, setAllowPartyBooking] = useState(true);

  // Branding Settings State
  const [brandColor, setBrandColor] = useState('#007AFF');
  const [coverImageUrl, setCoverImageUrl] = useState(
    'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1600&q=80'
  );
  const [bio, setBio] = useState('Premium booking experience powered by AirBook. Reserve appointments with top-rated professionals.');
  const [instagramUrl, setInstagramUrl] = useState('https://instagram.com/airbook');
  const [websiteUrl, setWebsiteUrl] = useState('https://airbook.me');
  const [bookingNotice, setBookingNotice] = useState(
    'Please arrive 5 minutes prior to your appointment. 24-hour advance notice is required for cancellations.'
  );

  // Widget & Deep-Link State
  const [widgetType, setWidgetType] = useState<'iframe' | 'button' | 'modal'>('iframe');
  const [selectedDeepService, setSelectedDeepService] = useState<string>('');
  const [selectedDeepStaff, setSelectedDeepStaff] = useState<string>('');
  const [isCopiedSnippet, setIsCopiedSnippet] = useState(false);
  const [isCopiedDeepLink, setIsCopiedDeepLink] = useState(false);

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

  // Load initial settings from API
  useEffect(() => {
    async function loadWorkspaceStudio() {
      try {
        const [studioRes, stripeRes] = await Promise.all([
          fetch('/api/booking-studio').then((r) => r.json()).catch(() => ({})),
          fetch('/api/stripe/connect/status').then((r) => r.json()).catch(() => ({})),
        ]);

        if (studioRes.workspace) {
          const ws = studioRes.workspace;
          if (ws.slug) {
            setSlugInput(ws.slug);
            setWorkspaceSlug(ws.slug);
          }
          if (ws.cancellationNoticeHours) {
            setCancellationNotice(String(ws.cancellationNoticeHours));
          }
          if (ws.depositRequiredPercent !== undefined) {
            setDepositPercent(String(ws.depositRequiredPercent));
          }
          if (ws.brandColor) setBrandColor(ws.brandColor);
          if (ws.coverImageUrl) setCoverImageUrl(ws.coverImageUrl);
          if (ws.bio) setBio(ws.bio);
          if (ws.instagramUrl) setInstagramUrl(ws.instagramUrl);
          if (ws.websiteUrl) setWebsiteUrl(ws.websiteUrl);
          if (ws.bookingNotice) setBookingNotice(ws.bookingNotice);
        }

        if (stripeRes.connected) {
          setStripeConnected(true);
        }
      } catch (err) {
        console.warn('Failed to load workspace booking studio:', err);
      }
    }
    loadWorkspaceStudio();
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

  const originUrl = 'https://getairbook.com';
  const publicUrl = `https://getairbook.com/book/${slugInput}`;

  // Deep Link Calculation
  let deepLinkUrl = publicUrl;
  const deepParams = new URLSearchParams();
  if (selectedDeepService) deepParams.append('service', selectedDeepService);
  if (selectedDeepStaff) deepParams.append('staff', selectedDeepStaff);
  const paramStr = deepParams.toString();
  if (paramStr) deepLinkUrl += `?${paramStr}`;

  // Embed Snippet Calculation
  const getWidgetSnippet = () => {
    if (widgetType === 'iframe') {
      return `<!-- AirBook Embeddable Booking Widget -->
<iframe
  src="${publicUrl}"
  width="100%"
  height="750px"
  style="border: none; border-radius: 24px; box-shadow: 0 20px 40px rgba(0,0,0,0.1);"
  title="AirBook Online Booking"
></iframe>`;
    }
    if (widgetType === 'button') {
      return `<!-- AirBook Floating Action Button -->
<script
  src="${originUrl}/widget.js"
  data-slug="${slugInput}"
  data-color="${brandColor}"
  data-position="bottom-right"
  async
></script>`;
    }
    return `<!-- AirBook Modal Trigger Button -->
<button
  onclick="window.open('${publicUrl}', 'AirBookModal', 'width=520,height=750')"
  style="background-color: ${brandColor}; color: #ffffff; padding: 14px 28px; border-radius: 9999px; font-weight: bold; border: none; cursor: pointer;"
>
  Book Online
</button>`;
  };

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

  const handleCopySnippet = async () => {
    try {
      await navigator.clipboard.writeText(getWidgetSnippet());
      setIsCopiedSnippet(true);
      addToast(t('snippetCopied'), 'success');
      setTimeout(() => setIsCopiedSnippet(false), 2000);
    } catch {
      addToast('Failed to copy snippet', 'error');
    }
  };

  const handleCopyDeepLink = async () => {
    try {
      await navigator.clipboard.writeText(deepLinkUrl);
      setIsCopiedDeepLink(true);
      addToast(t('linkCopied'), 'success');
      setTimeout(() => setIsCopiedDeepLink(false), 2000);
    } catch {
      addToast('Failed to copy deep link', 'error');
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
      const res = await fetch('/api/booking-studio', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slug: slugInput.trim(),
          cancellationNoticeHours: parseInt(cancellationNotice, 10),
          depositRequiredPercent: parseInt(depositPercent, 10),
          brandColor,
          coverImageUrl,
          bio,
          instagramUrl,
          websiteUrl,
          bookingNotice,
        }),
      });

      const data = await res.json();
      if (data.success) {
        addToast(t('studioSavedToast'), 'success');
      } else {
        addToast(data.error || 'Failed to save settings.', 'error');
      }
    } catch {
      addToast('Saved locally, error syncing to database.', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 space-y-6 pb-24">
      {/* Header Banner with Action Buttons */}
      <div className="p-5 sm:p-6 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] shadow-xs space-y-4">
        <div className="flex items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-2xl bg-black/5 dark:bg-white/5 text-[var(--text-secondary)] border border-[var(--border-subtle)] flex items-center justify-center shadow-xs">
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
        </div>
      </div>

      {/* Sub-Tab Segmented Control */}
      <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] w-fit overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab('links')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'links'
              ? 'bg-[var(--bg-primary)] text-[var(--text-primary)] shadow-xs font-extrabold'
              : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
          }`}
        >
          <Globe24Filled className="w-4 h-4" />
          <span>{t('tabStudioLinks')}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('policies')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'policies'
              ? 'bg-[var(--bg-primary)] text-[var(--text-primary)] shadow-xs font-extrabold'
              : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
          }`}
        >
          <Clock24Filled className="w-4 h-4" />
          <span>{t('tabStudioPolicies')}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('branding')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'branding'
              ? 'bg-[var(--bg-primary)] text-[var(--text-primary)] shadow-xs font-extrabold'
              : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
          }`}
        >
          <Sparkle24Filled className="w-4 h-4" />
          <span>{t('tabStudioBranding')}</span>
        </button>
      </div>

      {/* Main Studio Grid: Left Configuration & Right Live Mobile Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Studio Form Panels */}
        <div className="lg:col-span-7 space-y-6">
          {/* ─── TAB 1: LINKS, DOMAIN & WIDGETS ─── */}
          {activeTab === 'links' && (
            <div className="space-y-6">
              {/* Section 1: AirBook Direct Booking Link & Slug */}
              <StudioSection title={t('airbookDirectLink')} icon={Globe24Regular}>
                <p className="text-xs text-[var(--text-secondary)]">
                  {t('airbookDirectLinkDesc')}
                </p>
                <StudioField label={t('bookingSlug')}>
                  <div className="flex items-center bg-black/5 dark:bg-white/5 px-3.5 py-2.5 rounded-xl border border-[var(--border-subtle)] text-xs font-mono">
                    <span className="text-[var(--text-secondary)] opacity-70">getairbook.com/book/</span>
                    <input
                      type="text"
                      value={slugInput}
                      onChange={(e) => setSlugInput(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-'))}
                      className="bg-transparent font-extrabold text-[var(--text-primary)] focus:outline-none w-full ml-0.5"
                    />
                  </div>
                </StudioField>
              </StudioSection>

              {/* Section 2: White-Label Custom Domain */}
              <CustomDomainStudio />

              {/* Section 3: Embeddable Widgets */}
              <StudioSection title={t('embedWidgetsTitle')} icon={Code24Regular}>
                <p className="text-xs text-[var(--text-secondary)]">
                  {t('embedWidgetsDesc')}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
                  {[
                    { id: 'iframe', label: t('widgetTypeIframe') },
                    { id: 'button', label: t('widgetTypeButton') },
                    { id: 'modal', label: t('widgetTypeModal') },
                  ].map((w) => (
                    <button
                      key={w.id}
                      type="button"
                      onClick={() => setWidgetType(w.id as any)}
                      className={`p-3 rounded-2xl border text-xs font-bold text-center transition-all cursor-pointer ${
                        widgetType === w.id
                          ? 'border-blue-500 bg-blue-500/10 text-blue-600 dark:text-blue-400 shadow-xs'
                          : 'border-[var(--border-subtle)] bg-[var(--bg-primary)] text-[var(--text-secondary)] hover:border-blue-500/30'
                      }`}
                    >
                      {w.label}
                    </button>
                  ))}
                </div>

                {/* ─── LIVE INTERACTIVE WIDGET PREVIEW CANVAS ─── */}
                <div className="rounded-2xl border border-[var(--border-subtle)] overflow-hidden bg-[var(--bg-secondary)] shadow-xs space-y-0">
                  {/* Browser Mock Chrome Bar */}
                  <div className="px-4 py-2.5 bg-black/5 dark:bg-white/5 border-b border-[var(--border-subtle)] flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span className="w-2.5 h-2.5 rounded-full bg-red-400/80 inline-block flex-shrink-0" />
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-400/80 inline-block flex-shrink-0" />
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-400/80 inline-block flex-shrink-0" />
                      <span className="ml-2 text-[10px] font-mono font-bold text-[var(--text-secondary)] truncate">
                        yourwebsite.com/booking
                      </span>
                    </div>
                    <span className="text-[9px] font-extrabold uppercase tracking-wider text-blue-600 dark:text-blue-400 bg-blue-500/10 px-2.5 py-0.5 rounded-full border border-blue-500/20 flex-shrink-0">
                      {t('liveWidgetPreview')}
                    </span>
                  </div>

                  {/* Preview Canvas Area */}
                  <div className="p-4 sm:p-6 min-h-[220px] flex flex-col items-center justify-center bg-[var(--bg-primary)]">
                    {/* 1. IFRAME PREVIEW */}
                    {widgetType === 'iframe' && (
                      <div className="w-full max-w-sm rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)] p-4 shadow-md space-y-3">
                        <div className="flex items-center justify-between pb-2 border-b border-[var(--border-subtle)]">
                          <div className="flex items-center gap-2">
                            <div
                              className="w-7 h-7 rounded-xl flex items-center justify-center text-white text-[11px] font-black shadow-xs"
                              style={{ backgroundColor: brandColor }}
                            >
                              A
                            </div>
                            <span className="text-xs font-extrabold text-[var(--text-primary)]">
                              {workspaceSlug || 'my-salon'}
                            </span>
                          </div>
                          <span className="text-[9px] font-bold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                            Online
                          </span>
                        </div>

                        <div className="space-y-1.5">
                          <div className="p-2.5 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] flex items-center justify-between text-xs">
                            <span className="font-bold text-[var(--text-primary)]">Signature Styling</span>
                            <span className="font-mono font-bold text-[var(--text-secondary)]">$75</span>
                          </div>
                          <div className="p-2.5 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] flex items-center justify-between text-xs">
                            <span className="font-bold text-[var(--text-primary)]">Spa Ritual & Glow</span>
                            <span className="font-mono font-bold text-[var(--text-secondary)]">$120</span>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => addToast('✓ iFrame booking widget clicked (preview)', 'success')}
                          className="w-full py-2.5 rounded-xl text-white font-extrabold text-xs shadow-xs transition-opacity hover:opacity-90 cursor-pointer"
                          style={{ backgroundColor: brandColor }}
                        >
                          {t('bookNowWidgetBtn')}
                        </button>
                      </div>
                    )}

                    {/* 2. FLOATING BUTTON PREVIEW */}
                    {widgetType === 'button' && (
                      <div className="w-full h-44 rounded-xl border border-dashed border-[var(--border-subtle)] bg-[var(--bg-secondary)]/50 p-4 relative flex flex-col justify-between">
                        <div className="space-y-2 max-w-xs">
                          <div className="h-3 w-3/4 bg-black/10 dark:bg-white/10 rounded-full" />
                          <div className="h-2.5 w-1/2 bg-black/5 dark:bg-white/5 rounded-full" />
                          <div className="h-2.5 w-2/3 bg-black/5 dark:bg-white/5 rounded-full" />
                        </div>

                        <div className="flex justify-end">
                          <motion.button
                            type="button"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => addToast('✓ Floating action button triggers booking drawer (preview)', 'success')}
                            className="px-4 py-2.5 rounded-full text-white font-extrabold text-xs flex items-center gap-2 shadow-xl cursor-pointer"
                            style={{ backgroundColor: brandColor }}
                          >
                            <Calendar24Filled className="w-4 h-4" />
                            <span>{t('bookNowWidgetBtn')}</span>
                          </motion.button>
                        </div>
                      </div>
                    )}

                    {/* 3. MODAL TRIGGER BUTTON PREVIEW */}
                    {widgetType === 'modal' && (
                      <div className="w-full h-44 rounded-xl border border-dashed border-[var(--border-subtle)] bg-[var(--bg-secondary)]/50 p-4 flex flex-col items-center justify-center gap-3 text-center">
                        <div className="space-y-1">
                          <p className="text-xs font-extrabold text-[var(--text-primary)]">
                            {workspaceSlug ? workspaceSlug.toUpperCase() : 'SALON & SPA'}
                          </p>
                          <p className="text-[11px] text-[var(--text-secondary)]">
                            {t('previewMockWebsite')}
                          </p>
                        </div>

                        <motion.button
                          type="button"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => addToast('✓ Modal popup trigger clicked (preview)', 'success')}
                          className="px-5 py-2.5 rounded-full text-white font-extrabold text-xs flex items-center gap-2 shadow-xl cursor-pointer"
                          style={{ backgroundColor: brandColor }}
                        >
                          <Sparkle24Filled className="w-4 h-4" />
                          <span>{t('bookNowWidgetBtn')}</span>
                        </motion.button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Code Snippet Box */}
                <div className="p-4 rounded-2xl bg-black/90 dark:bg-black text-emerald-400 font-mono text-xs overflow-x-auto space-y-3 relative">
                  <pre className="whitespace-pre-wrap">{getWidgetSnippet()}</pre>
                  <button
                    type="button"
                    onClick={handleCopySnippet}
                    className="btn-secondary h-8 px-3 text-xs flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    {isCopiedSnippet ? (
                      <Checkmark24Filled className="w-3.5 h-3.5 text-emerald-500" />
                    ) : (
                      <Copy24Filled className="w-3.5 h-3.5 text-[var(--text-secondary)]" />
                    )}
                    <span>{isCopiedSnippet ? t('snippetCopied') : t('copySnippet')}</span>
                  </button>
                </div>
              </StudioSection>

              {/* Section 4: Direct Deep-Link Generator */}
              <StudioSection title={t('deepLinkBuilderTitle')} icon={Link24Regular}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <StudioField label={t('selectDeepService')}>
                    <CustomSelect
                      value={selectedDeepService}
                      onChange={setSelectedDeepService}
                      options={[
                        { value: '', label: t('allServicesDefault') },
                        ...services.map((svc) => ({
                          value: svc.id,
                          label: `${svc.name} ($${svc.price})`,
                        })),
                      ]}
                    />
                  </StudioField>

                  <StudioField label={t('selectDeepStaff')}>
                    <CustomSelect
                      value={selectedDeepStaff}
                      onChange={setSelectedDeepStaff}
                      options={[
                        { value: '', label: t('firstAvailableSpecialist') },
                        ...staffMembers.map((st) => ({
                          value: st.id,
                          label: `${st.name} (${st.role || t('staff')})`,
                        })),
                      ]}
                    />
                  </StudioField>
                </div>

                <div className="p-3.5 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] flex items-center justify-between gap-3 text-xs font-mono overflow-x-auto">
                  <span className="text-blue-600 dark:text-blue-400 font-extrabold truncate">{deepLinkUrl}</span>
                  <button
                    type="button"
                    onClick={handleCopyDeepLink}
                    className="btn-secondary h-9 px-3.5 flex-shrink-0"
                  >
                    {isCopiedDeepLink ? (
                      <Checkmark24Filled className="w-3.5 h-3.5 text-emerald-500" />
                    ) : (
                      <Copy24Filled className="w-3.5 h-3.5 text-[var(--text-secondary)]" />
                    )}
                    <span>{isCopiedDeepLink ? t('linkCopied') : t('copyBookingLink')}</span>
                  </button>
                </div>
              </StudioSection>
            </div>
          )}

          {/* ─── TAB 2: RULES & POLICIES ─── */}
          {activeTab === 'policies' && (
            <div className="space-y-6">
              {/* Section 1: Scheduling & Buffer Rules */}
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
                        { value: '6', label: '6 Hours before slot' },
                        { value: '24', label: '24 Hours before slot' },
                      ]}
                    />
                  </StudioField>
                </div>

                <div className="divide-y divide-[var(--border-subtle)] pt-2">
                  <div className="py-3 flex items-center justify-between gap-3">
                    <div>
                      <p className="text-xs font-bold text-[var(--text-primary)]">{t('allowAnyoneToggle')}</p>
                      <p className="text-[11px] text-[var(--text-secondary)]">{t('allowAnyoneToggleDesc')}</p>
                    </div>
                    <Toggle enabled={allowAnyoneSpecialist} onToggle={() => setAllowAnyoneSpecialist(!allowAnyoneSpecialist)} />
                  </div>

                  <div className="py-3 flex items-center justify-between gap-3">
                    <div>
                      <p className="text-xs font-bold text-[var(--text-primary)]">{t('allowPartyToggle')}</p>
                      <p className="text-[11px] text-[var(--text-secondary)]">{t('allowPartyToggleDesc')}</p>
                    </div>
                    <Toggle enabled={allowPartyBooking} onToggle={() => setAllowPartyBooking(!allowPartyBooking)} />
                  </div>
                </div>
              </StudioSection>

              {/* Section 2: Financial & Deposits */}
              <StudioSection title={t('financialPoliciesTitle')} icon={Money24Regular}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <StudioField label={t('depositPercent')}>
                    <CustomSelect
                      value={depositPercent}
                      onChange={setDepositPercent}
                      options={[
                        { value: '0', label: 'No Deposit Required (0%)' },
                        { value: '15', label: '15% Deposit' },
                        { value: '20', label: '20% Deposit (Recommended)' },
                        { value: '50', label: '50% Deposit' },
                        { value: '100', label: 'Full Upfront Prepayment (100%)' },
                      ]}
                    />
                  </StudioField>

                  <StudioField label={t('cancellationNotice')}>
                    <CustomSelect
                      value={cancellationNotice}
                      onChange={setCancellationNotice}
                      options={[
                        { value: '2', label: '2 Hours Notice' },
                        { value: '6', label: '6 Hours Notice' },
                        { value: '12', label: '12 Hours Notice' },
                        { value: '24', label: '24 Hours Notice (Recommended)' },
                        { value: '48', label: '48 Hours Notice' },
                      ]}
                    />
                  </StudioField>
                </div>

                <div className="p-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-[var(--border-subtle)] space-y-2 mt-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-[var(--text-primary)]">{t('stripePayoutsActive')}</p>
                      <p className="text-[11px] text-[var(--text-secondary)]">{t('stripePayoutsDesc')}</p>
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase border ${
                      stripeConnected
                        ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'
                        : 'bg-amber-500/10 text-amber-600 border-amber-500/20'
                    }`}>
                      {stripeConnected ? t('stripePayoutsActive') : t('connectStripeBtn')}
                    </span>
                  </div>

                  {!stripeConnected && (
                    <button
                      type="button"
                      onClick={handleConnectStripe}
                      disabled={isConnectingStripe}
                      className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer mt-2"
                    >
                      <Payment24Filled className="w-4 h-4" />
                      <span>{isConnectingStripe ? 'Connecting…' : t('connectStripeBtn')}</span>
                    </button>
                  )}
                </div>
              </StudioSection>
            </div>
          )}

          {/* ─── TAB 3: PAGE BRANDING & BIO ─── */}
          {activeTab === 'branding' && (
            <div className="space-y-6">
              {/* Color Palette Selector */}
              <StudioSection title={t('brandColorPalette')} icon={Color24Regular}>
                <div className="space-y-3">
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5">
                    {BRAND_PALETTES.map((pal) => (
                      <button
                        key={pal.hex}
                        type="button"
                        onClick={() => setBrandColor(pal.hex)}
                        className={`p-2.5 rounded-2xl border flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                          brandColor.toLowerCase() === pal.hex.toLowerCase()
                            ? 'border-blue-500 bg-blue-500/10 shadow-sm'
                            : 'border-[var(--border-subtle)] bg-[var(--bg-primary)] hover:border-black/20 dark:hover:border-white/20'
                        }`}
                      >
                        <div className={`w-6 h-6 rounded-full ${pal.bg} shadow-xs`} />
                        <span className="text-[10px] font-extrabold text-[var(--text-primary)] truncate w-full text-center">
                          {pal.name}
                        </span>
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <span className="text-[11px] font-bold text-[var(--text-secondary)]">{t('customHex')}</span>
                    <input
                      type="text"
                      value={brandColor}
                      onChange={(e) => setBrandColor(e.target.value)}
                      placeholder="#007AFF"
                      className="px-3 py-1.5 rounded-xl bg-black/5 dark:bg-white/5 border border-[var(--border-subtle)] text-xs font-mono font-bold text-[var(--text-primary)] w-32 focus:outline-none uppercase"
                    />
                  </div>
                </div>
              </StudioSection>

              {/* Cover Banner URL */}
              <StudioSection title={t('coverBannerUrl')} icon={Image24Regular}>
                <div className="space-y-2">
                  <input
                    type="url"
                    value={coverImageUrl}
                    onChange={(e) => setCoverImageUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-3.5 py-2.5 rounded-2xl bg-black/5 dark:bg-white/5 border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <div className="h-28 w-full rounded-2xl overflow-hidden border border-[var(--border-subtle)] relative">
                    <img src={coverImageUrl} alt="Cover preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-3">
                      <span className="text-white text-xs font-bold">{t('publicBannerPreview')}</span>
                    </div>
                  </div>
                </div>
              </StudioSection>

              {/* Business Bio & Welcome Greeting */}
              <StudioSection title={t('businessBio')} icon={Tag24Regular}>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Welcome to our studio! We provide high-end styling and wellness..."
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-black/5 dark:bg-white/5 border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none font-medium"
                />
              </StudioSection>

              {/* Social & Web Links */}
              <StudioSection title={t('socialLinksTitle')} icon={Share24Regular}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <StudioField label={t('instagramLabel')}>
                    <input
                      type="text"
                      value={instagramUrl}
                      onChange={(e) => setInstagramUrl(e.target.value)}
                      placeholder="https://instagram.com/your-salon"
                      className="w-full px-3.5 py-2 rounded-xl bg-black/5 dark:bg-white/5 border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] font-semibold focus:outline-none"
                    />
                  </StudioField>

                  <StudioField label={t('websiteLabel')}>
                    <input
                      type="url"
                      value={websiteUrl}
                      onChange={(e) => setWebsiteUrl(e.target.value)}
                      placeholder="https://yourwebsite.com"
                      className="w-full px-3.5 py-2 rounded-xl bg-black/5 dark:bg-white/5 border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] font-semibold focus:outline-none"
                    />
                  </StudioField>
                </div>
              </StudioSection>

              {/* Booking Notice & Disclaimer */}
              <StudioSection title={t('bookingNoticeLabel')} icon={ShieldCheckmark24Regular}>
                <textarea
                  rows={2}
                  value={bookingNotice}
                  onChange={(e) => setBookingNotice(e.target.value)}
                  placeholder="Please arrive 5 minutes prior to your appointment..."
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-black/5 dark:bg-white/5 border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none font-medium"
                />
              </StudioSection>
            </div>
          )}

          {/* Sticky Save Button */}
          <motion.button
            whileTap={{ scale: 0.98 }}
            disabled={saving}
            onClick={handleSaveSettings}
            className="w-full btn-primary h-12 text-sm shadow-xl flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
          >
            <CheckmarkCircle24Filled className="w-4 h-4 text-white" />
            <span>{saving ? t('saving') : t('saveStudioChanges')}</span>
          </motion.button>
        </div>

        {/* Right Column: Interactive Mobile Live Simulator */}
        <div className="lg:col-span-5 sticky top-6 space-y-3">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-primary)] flex items-center gap-1.5">
              <Sparkle24Regular className="w-4 h-4 text-[var(--text-secondary)]" />
              <span>{t('mobileSimulatorTitle')}</span>
            </h3>
            <span className="text-[10px] font-mono text-[var(--text-secondary)]">{t('phonePreviewModel')}</span>
          </div>

          {/* Smartphone Frame Container */}
          <div className="mx-auto w-full max-w-[340px] rounded-[44px] p-3.5 bg-slate-900 shadow-2xl border-4 border-slate-800 relative overflow-hidden">
            {/* Dynamic Island / Camera Notch */}
            <div className="w-24 h-4 bg-black rounded-full mx-auto mb-2.5 flex items-center justify-center">
              <div className="w-2.5 h-2.5 rounded-full bg-slate-950 border border-slate-800 ml-auto mr-2" />
            </div>

            {/* Inner Mobile Screen Content */}
            <div className="rounded-[32px] bg-[var(--bg-primary)] p-0 border border-black/10 dark:border-white/10 text-[var(--text-primary)] overflow-hidden min-h-[500px] flex flex-col">
              {/* Cover Banner */}
              <div className="h-24 w-full relative bg-slate-800">
                <img src={coverImageUrl} alt="Cover" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-white">
                  <span className="text-xs font-black truncate">{workspaceName || 'My Studio'}</span>
                  <span className="px-2 py-0.2 rounded-full bg-emerald-500/80 text-[8px] font-black uppercase">
                    {t('statusOpenSimulator')}
                  </span>
                </div>
              </div>

              {/* Bio & Notice */}
              <div className="p-3.5 space-y-3 flex-1 flex flex-col justify-between">
                <div className="space-y-2">
                  <p className="text-[10px] text-[var(--text-secondary)] line-clamp-2 leading-relaxed">
                    {bio}
                  </p>

                  {bookingNotice && (
                    <div className="p-2 rounded-xl bg-black/5 dark:bg-white/5 border border-[var(--border-subtle)] text-[9px] text-[var(--text-secondary)]">
                      ℹ️ {bookingNotice}
                    </div>
                  )}

                  {/* Sample Service Item Preview */}
                  <div className="p-3 rounded-xl bg-black/5 dark:bg-white/5 border border-[var(--border-subtle)] space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-[var(--text-primary)]">{t('selectedServiceLabel')}</span>
                      <span className="text-[9px] text-[var(--text-secondary)]">{t('specialistCountLabel')}</span>
                    </div>
                    <div className="p-2 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-subtle)] flex items-center justify-between text-[10px]">
                      <div className="flex items-center gap-1.5 truncate">
                        <div
                          className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                          style={{ backgroundColor: brandColor }}
                        />
                        <span className="font-bold truncate">{services[0]?.name || 'Signature Consultation'}</span>
                      </div>
                      <span className="font-extrabold">${services[0]?.price || 75}</span>
                    </div>
                  </div>

                  {/* Deposit notice badge in simulator */}
                  {parseInt(depositPercent, 10) > 0 && (
                    <div
                      className="p-2 rounded-xl text-[9px] flex items-center gap-1.5 border"
                      style={{
                        backgroundColor: `${brandColor}15`,
                        borderColor: `${brandColor}30`,
                        color: brandColor,
                      }}
                    >
                      <ShieldCheckmark24Regular className="w-3.5 h-3.5 flex-shrink-0" />
                      <span>{t('depositNoticeSimulator').replace('{percent}', String(depositPercent))}</span>
                    </div>
                  )}
                </div>

                {/* Mobile CTA Mock Button */}
                <div className="pt-2">
                  <div
                    className="w-full py-2.5 rounded-xl text-white font-bold text-[10px] text-center shadow-md flex items-center justify-center gap-1.5"
                    style={{ backgroundColor: brandColor }}
                  >
                    <span>{t('reserveAppointmentMock')}</span>
                    <ArrowRight24Filled className="w-3 h-3" />
                  </div>
                  <p className="text-[8px] text-center text-[var(--text-secondary)] italic pt-1">
                    {t('freeCancellationNotice').replace('{hours}', String(cancellationNotice))}
                  </p>
                </div>
              </div>
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
              className="w-full max-w-sm rounded-3xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] p-6 shadow-2xl space-y-4 text-center"
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
                  <rect x="0" y="0" width="100" height="100" fill="white" />
                  <rect x="10" y="10" width="24" height="24" fill="black" />
                  <rect x="14" y="14" width="16" height="16" fill="white" />
                  <rect x="18" y="18" width="8" height="8" fill="black" />
                  <rect x="66" y="10" width="24" height="24" fill="black" />
                  <rect x="70" y="14" width="16" height="16" fill="white" />
                  <rect x="74" y="18" width="8" height="8" fill="black" />
                  <rect x="10" y="66" width="24" height="24" fill="black" />
                  <rect x="14" y="70" width="16" height="16" fill="white" />
                  <rect x="18" y="74" width="8" height="8" fill="black" />
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
                getairbook.com/book/{slugInput}
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="flex-1 py-2.5 rounded-xl bg-black/5 dark:bg-white/10 text-xs font-bold text-[var(--text-primary)] flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Copy24Filled className="w-3.5 h-3.5" />
                  <span>{t('copyBookingLink')}</span>
                </button>
                <a
                  href={`/book/${slugInput}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-xs font-bold text-white flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <Open24Filled className="w-3.5 h-3.5" />
                  <span>{t('openLiveBookingPage')}</span>
                </a>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
