'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAirBookStore } from '@/lib/store';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { useToast } from '@/components/Toast';
import { CustomSelect } from '@/components/CustomSelect';
import { FloatingInput, FloatingTextarea } from '@/components/FloatingInput';
import { CustomDomainStudio } from '@/components/CustomDomainStudio';
import { QRCodeCard } from '@/components/QRCodeCard';
import { getAvatarUrl } from '@/lib/avatars';
import { Icon } from '@/components/primitives/Icon';
import { Card } from '@/components/primitives/Card';
import { Badge } from '@/components/primitives/Badge';
import { PillButton, PillGroup } from '@/components/primitives/PillButton';
import { Dialog } from '@/components/primitives/Dialog';
import { Avatar } from '@/components/primitives/Avatar';
import { Switch } from '@/components/primitives/Switch';
import { Input } from '@/components/primitives/Input';
import { Breadcrumbs } from '@/components/primitives/Breadcrumbs';
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
  Save24Filled,
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
  Eye24Regular,
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
    <Card
      variant="envelope"
      innerClassName="space-y-4"
      trayHeader={
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-primary)] flex items-center gap-2">
            <Icon className="w-4 h-4 text-[var(--text-secondary)]" />
            <span>{title}</span>
          </h3>
          {badge && (
            <Badge variant="subtle" size="xs" className="font-mono">
              {badge}
            </Badge>
          )}
        </div>
      }
    >
      {children}
    </Card>
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
  { name: 'Blue', hex: '#007AFF', bg: 'bg-[#007AFF]' },
  { name: 'Obsidian', hex: '#18181B', bg: 'bg-[#18181B]' },
  { name: 'Emerald', hex: '#059669', bg: 'bg-[#059669]' },
  { name: 'Rose', hex: '#E11D48', bg: 'bg-[#E11D48]' },
  { name: 'Amber', hex: '#D97706', bg: 'bg-[#D97706]' },
  { name: 'Violet', hex: '#7C3AED', bg: 'bg-[#7C3AED]' },
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
  const [websiteUrl, setWebsiteUrl] = useState('https://getairbook.com');
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
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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
    <div className="w-full p-4 sm:p-6 space-y-6 pb-24">
      {/* Header */}
      <div className="sticky top-0 z-30 -mx-4 sm:-mx-6 -mt-4 sm:-mt-6 px-4 sm:px-6 py-3 bg-[var(--bg-secondary)]/85 backdrop-blur-md border-b border-[var(--border-subtle)] flex items-center justify-between flex-wrap gap-3">
        <Breadcrumbs
          items={[
            { label: t('onlineBookingTitle') },
            {
              label:
                activeTab === 'links'
                  ? t('tabStudioLinks')
                  : activeTab === 'policies'
                    ? t('tabStudioPolicies')
                    : t('tabStudioBranding'),
            },
          ]}
        />
      </div>

      {/* Sub-Tab Segmented Control */}
      <PillGroup className="w-fit overflow-x-auto">
        {(
          [
            { id: 'links', label: t('tabStudioLinks'), regular: Globe24Regular, filled: Globe24Filled },
            { id: 'policies', label: t('tabStudioPolicies'), regular: Clock24Regular, filled: Clock24Filled },
            { id: 'branding', label: t('tabStudioBranding'), regular: Sparkle24Regular, filled: Sparkle24Filled },
          ] as const
        ).map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <PillButton
              key={tab.id}
              variant="ghost"
              size="sm"
              active={isActive}
              onClick={() => setActiveTab(tab.id)}
              className={`relative !bg-transparent ${isActive ? '!text-[var(--text-primary)] font-extrabold' : ''}`}
            >
              {isActive && (
                <motion.span
                  layoutId="onlineBookingTab"
                  transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                  className="absolute inset-0 rounded-full bg-[var(--bg-primary)] shadow-xs"
                />
              )}
              <span className="relative z-10 flex items-center gap-2">
                <Icon regular={tab.regular} filled={tab.filled} active={isActive} size="sm" />
                <span>{tab.label}</span>
              </span>
            </PillButton>
          );
        })}
      </PillGroup>

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

                <PillGroup className="w-full overflow-x-auto hide-scrollbar">
                  {[
                    { id: 'iframe', label: 'iFrame' },
                    { id: 'button', label: 'Button' },
                    { id: 'modal', label: 'Popup' },
                  ].map((w) => {
                    const isActive = widgetType === w.id;
                    return (
                      <PillButton
                        key={w.id}
                        variant="ghost"
                        size="sm"
                        active={isActive}
                        onClick={() => setWidgetType(w.id as any)}
                        className={`relative flex-1 !bg-transparent whitespace-nowrap ${
                          isActive ? '!text-[var(--text-primary)] font-extrabold' : ''
                        }`}
                      >
                        {isActive && (
                          <motion.span
                            layoutId="widgetTypeTab"
                            transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                            className="absolute inset-0 rounded-full bg-[var(--bg-primary)] shadow-xs"
                          />
                        )}
                        <span className="relative z-10">{w.label}</span>
                      </PillButton>
                    );
                  })}
                </PillGroup>

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
                    <Badge variant="default" size="xs" className="flex-shrink-0">
                      {t('liveWidgetPreview')}
                    </Badge>
                  </div>

                  {/* Preview Canvas Area */}
                  <div className="p-4 sm:p-6 min-h-[220px] flex flex-col items-center justify-center bg-[var(--bg-primary)]">
                    {/* 1. IFRAME PREVIEW */}
                    {widgetType === 'iframe' && (
                      <div className="w-full max-w-sm rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)] p-4 shadow-md space-y-3">
                        <div className="flex items-center justify-between pb-2 border-b border-[var(--border-subtle)]">
                          <div className="flex items-center gap-2">
                            <Avatar
                              size="xs"
                              fallback="A"
                              style={{ backgroundColor: brandColor }}
                            />
                            <span className="text-xs font-extrabold text-[var(--text-primary)]">
                              {workspaceSlug || 'my-salon'}
                            </span>
                          </div>
                          <Badge variant="success" size="xs" dot>
                            Online
                          </Badge>
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

                        <PillButton
                          variant="primary"
                          onClick={() => addToast('iFrame booking widget clicked (preview)', 'success')}
                          className="w-full"
                        >
                          {t('bookNowWidgetBtn')}
                        </PillButton>
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
                          <PillButton
                            variant="primary"
                            size="lg"
                            onClick={() => addToast('Floating action button triggers booking drawer (preview)', 'success')}
                          >
                            <Icon filled={Calendar24Filled} size="sm" />
                            <span>{t('bookNowWidgetBtn')}</span>
                          </PillButton>
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

                        <PillButton
                          variant="primary"
                          size="lg"
                          onClick={() => addToast('Modal popup trigger clicked (preview)', 'success')}
                        >
                          <Icon filled={Sparkle24Filled} size="sm" />
                          <span>{t('bookNowWidgetBtn')}</span>
                        </PillButton>
                      </div>
                    )}
                  </div>
                </div>

                {/* Code Snippet Box */}
                <div className="p-4 rounded-2xl bg-black/90 dark:bg-black text-emerald-400 font-mono text-xs overflow-x-auto space-y-3 relative">
                  <pre className="whitespace-pre-wrap">{getWidgetSnippet()}</pre>
                  <PillButton
                    size="sm"
                    onClick={handleCopySnippet}
                    className="!bg-white/15 !text-white hover:!bg-white/25"
                  >
                    {isCopiedSnippet ? (
                      <Icon filled={Checkmark24Filled} size="sm" className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Icon filled={Copy24Filled} size="sm" className="w-3.5 h-3.5" />
                    )}
                    <span>{isCopiedSnippet ? t('snippetCopied') : t('copySnippet')}</span>
                  </PillButton>
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
                  <span className="text-sky-500 font-extrabold truncate">{deepLinkUrl}</span>
                  <PillButton
                    onClick={handleCopyDeepLink}
                    className="flex-shrink-0"
                  >
                    {isCopiedDeepLink ? (
                      <Icon filled={Checkmark24Filled} size="sm" className="w-3.5 h-3.5 text-emerald-500" />
                    ) : (
                      <Icon filled={Copy24Filled} size="sm" tone="secondary" className="w-3.5 h-3.5" />
                    )}
                    <span>{isCopiedDeepLink ? t('linkCopied') : t('copyBookingLink')}</span>
                  </PillButton>
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
                    <Switch checked={allowAnyoneSpecialist} onChange={setAllowAnyoneSpecialist} />
                  </div>

                  <div className="py-3 flex items-center justify-between gap-3">
                    <div>
                      <p className="text-xs font-bold text-[var(--text-primary)]">{t('allowPartyToggle')}</p>
                      <p className="text-[11px] text-[var(--text-secondary)]">{t('allowPartyToggleDesc')}</p>
                    </div>
                    <Switch checked={allowPartyBooking} onChange={setAllowPartyBooking} />
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
                    <Badge variant={stripeConnected ? 'success' : 'warning'} size="sm">
                      {stripeConnected ? t('stripePayoutsActive') : t('connectStripeBtn')}
                    </Badge>
                  </div>

                  {!stripeConnected && (
                    <PillButton
                      variant="primary"
                      size="lg"
                      onClick={handleConnectStripe}
                      disabled={isConnectingStripe}
                      className="w-full mt-2"
                    >
                      <Icon filled={Payment24Filled} size="sm" />
                      <span>{isConnectingStripe ? 'Connecting…' : t('connectStripeBtn')}</span>
                    </PillButton>
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
                  <div className="flex flex-wrap gap-2">
                    {BRAND_PALETTES.map((pal) => {
                      const isSelected = brandColor.toLowerCase() === pal.hex.toLowerCase();
                      return (
                        <PillButton
                          key={pal.hex}
                          variant={isSelected ? 'outline' : 'soft'}
                          active={isSelected}
                          onClick={() => setBrandColor(pal.hex)}
                          className={`!pl-2 gap-2 ${isSelected ? '!border-sky-500 !bg-sky-500/10 !text-[var(--text-primary)]' : ''}`}
                        >
                          <span className={`w-4 h-4 rounded-full ${pal.bg} flex-shrink-0`} />
                          <span>{pal.name}</span>
                        </PillButton>
                      );
                    })}
                  </div>

                  <div className="pt-1 max-w-xs">
                    <FloatingInput
                      label={t('customHex')}
                      type="text"
                      value={brandColor}
                      onChange={(e) => setBrandColor(e.target.value)}
                      placeholder="#007AFF"
                      className="font-mono uppercase"
                    />
                  </div>
                </div>
              </StudioSection>

              {/* Cover Banner URL */}
              <StudioSection title={t('coverBannerUrl')} icon={Image24Regular}>
                <div className="space-y-3">
                  <FloatingInput
                    label={t('coverBannerUrl')}
                    type="url"
                    value={coverImageUrl}
                    onChange={(e) => setCoverImageUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="font-mono"
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
                <FloatingTextarea
                  label={t('businessBio')}
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Welcome to our studio! We provide high-end styling and wellness..."
                />
              </StudioSection>

              {/* Social & Web Links */}
              <StudioSection title={t('socialLinksTitle')} icon={Share24Regular}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <FloatingInput
                    label={t('instagramLabel')}
                    type="text"
                    value={instagramUrl}
                    onChange={(e) => setInstagramUrl(e.target.value)}
                    placeholder="https://instagram.com/your-salon"
                  />

                  <FloatingInput
                    label={t('websiteLabel')}
                    type="url"
                    value={websiteUrl}
                    onChange={(e) => setWebsiteUrl(e.target.value)}
                    placeholder="https://yourwebsite.com"
                  />
                </div>
              </StudioSection>

              {/* Booking Notice & Disclaimer */}
              <StudioSection title={t('bookingNoticeLabel')} icon={ShieldCheckmark24Regular}>
                <FloatingTextarea
                  label={t('bookingNoticeLabel')}
                  rows={2}
                  value={bookingNotice}
                  onChange={(e) => setBookingNotice(e.target.value)}
                  placeholder="Please arrive 5 minutes prior to your appointment..."
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
            <Icon filled={Save24Filled} size="sm" className="text-white" />
            <span>{saving ? t('saving') : t('save')}</span>
          </motion.button>
        </div>

        {/* Right Column: Interactive Mobile Live Preview */}
        <div className="lg:col-span-5 sticky top-6">
          <Card
            variant="envelope-flush"
            className="mx-auto w-full max-w-[360px]"
            trayHeader={
              <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-primary)] flex items-center gap-2">
                <Icon regular={Eye24Regular} size="sm" tone="secondary" />
                <span>Preview</span>
              </span>
            }
          >
            <div className="text-[var(--text-primary)] flex flex-col">
              {/* Cover Banner */}
              <div className="h-28 w-full relative bg-slate-800">
                <img src={coverImageUrl} alt="Cover" className="w-full h-full object-cover" />
              </div>

              {/* Content */}
              <div className="p-4 space-y-4 flex-1 flex flex-col justify-between">
                <div className="space-y-3">
                  {/* Studio Header */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Avatar
                        size="sm"
                        fallback={(workspaceName || 'M').charAt(0).toUpperCase()}
                        style={{ backgroundColor: brandColor }}
                      />
                      <span className="text-sm font-extrabold text-[var(--text-primary)] truncate">
                        {workspaceName || 'My Studio'}
                      </span>
                    </div>
                    <Badge variant="success" size="xs" dot className="flex-shrink-0">
                      {t('statusOpenSimulator')}
                    </Badge>
                  </div>

                  <p className="text-xs text-[var(--text-secondary)] line-clamp-2 leading-relaxed">
                    {bio}
                  </p>

                  {/* Sample Service Card */}
                  <Card className="p-3.5 flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-xs font-extrabold text-[var(--text-primary)] truncate">
                        {services[0]?.name || 'Signature Consultation'}
                      </p>
                      <p className="text-[11px] text-[var(--text-muted)]">
                        {t('specialistCountLabel')}
                      </p>
                    </div>
                    <span className="text-xs font-extrabold text-[var(--text-primary)] flex-shrink-0">
                      ${services[0]?.price || 75}
                    </span>
                  </Card>
                </div>

                {/* Mobile CTA Mock Button */}
                <div className="pt-2">
                  <PillButton
                    variant="primary"
                    size="lg"
                    className="w-full"
                  >
                    <span>{t('reserveAppointmentMock')}</span>
                    <Icon filled={ArrowRight24Filled} size="xs" />
                  </PillButton>
                  <p className="text-[8px] text-center text-[var(--text-secondary)] italic pt-1">
                    {t('freeCancellationNotice').replace('{hours}', String(cancellationNotice))}
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* QR Code Modal */}
      <Dialog
        open={isQrModalOpen}
        onClose={() => setIsQrModalOpen(false)}
        title={t('qrCodeModalTitle')}
      >
        <QRCodeCard
          description={t('qrCodeModalDesc')}
          url={`getairbook.com/book/${slugInput}`}
          openHref={`/book/${slugInput}`}
          copyLabel={t('copyBookingLink')}
          openLabel={t('openLiveBookingPage')}
          onCopy={handleCopyLink}
          downloadable
        />
      </Dialog>
    </div>
  );
};
