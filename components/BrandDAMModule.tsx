'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Logo, CircleCloudIconFlat, LogoBadgeStyle, LogoFlatStyle } from './Logo';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { useAirBookStore } from '@/lib/store';
import { useToast } from '@/components/Toast';
import { FloatingInput, FloatingTextarea } from '@/components/FloatingInput';
import {
  Sparkle24Filled,
  Copy24Filled,
  Checkmark24Filled,
  ArrowDownload24Filled,
  ArrowLeft24Filled,
  Box24Filled,
  Code24Filled,
  Grid24Filled,
  Save24Filled,
  Globe24Regular,
  Image24Filled,
  Sparkle24Regular,
  Link24Filled,
  Open24Filled,
  Color24Filled,
} from '@fluentui/react-icons';
import Link from 'next/link';

type StudioTab = 'identity' | 'storefront' | 'embed' | 'badges' | 'glyphs' | 'vector';

const CURATED_COVERS = [
  {
    id: 'minimalist-salon',
    title: 'Minimalist Studio Salon',
    url: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=1200&q=80',
    category: 'Salon & Hair',
  },
  {
    id: 'luxury-medspa',
    title: 'Luxury Aesthetics & MedSpa',
    url: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=1200&q=80',
    category: 'Aesthetics & Clinic',
  },
  {
    id: 'modern-barber',
    title: 'Modern Executive Barber',
    url: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=1200&q=80',
    category: 'Barbershop',
  },
  {
    id: 'wellness-sanctuary',
    title: 'Botanical Wellness Sanctuary',
    url: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=1200&q=80',
    category: 'Spa & Massage',
  },
];

const CURATED_PALETTES = [
  { name: 'Obsidian Minimalist', primary: '#0F172A', accent: '#38BDF8' },
  { name: 'Velvet Rose Spa', primary: '#E11D48', accent: '#FFA6B9' },
  { name: 'Emerald Botanical', primary: '#059669', accent: '#34D399' },
  { name: 'Cyber Blue', primary: '#007AFF', accent: '#60A5FA' },
  { name: 'Sunset Amber Luxury', primary: '#D97706', accent: '#FBBF24' },
];

const BADGE_VARIANTS: { id: LogoBadgeStyle; title: string; desc: string; bg: string }[] = [
  { id: 'sky', title: 'Sky Blue App Badge', desc: 'Default primary AirBook app tile icon', bg: 'from-[#38BDF8] to-[#0284C7]' },
  { id: 'pink', title: 'Rose Pink App Badge', desc: 'Warm beauty & salon app variant', bg: 'from-[#FFA6B9] to-[#FF8DA1]' },
  { id: 'grey', title: 'Silver Grey App Badge', desc: 'Minimalist neutral corporate app tile', bg: 'from-[#D1D5DB] to-[#9CA3AF]' },
  { id: 'dark', title: 'Obsidian Dark Badge', desc: 'Dark theme & macOS app icon variant', bg: 'from-[#1E293B] to-[#0F172A]' },
  { id: 'blueprint', title: 'Blueprint Grid Badge', desc: 'Engineering & technical vector blueprint', bg: 'bg-[#1D61F2]' },
];

const FLAT_VARIANTS: { id: LogoFlatStyle; title: string; desc: string }[] = [
  { id: 'outline', title: 'Black Outline Glyph', desc: 'Clean vector line icon with hollow center' },
  { id: 'duotone', title: 'Duotone Fill & Stroke', desc: 'Slate grey body with black stroke outline' },
  { id: 'light-outline', title: 'Light Slate Outline', desc: 'Subtle slate grey outline icon' },
  { id: 'solid-black', title: 'Solid Black Glyph', desc: 'High-contrast solid black filled silhouette' },
  { id: 'solid-grey', title: 'Solid Medium Grey', desc: 'Neutral grey filled silhouette glyph' },
  { id: 'solid-white', title: 'Solid White Glyph', desc: 'White filled silhouette for dark backgrounds' },
];

const RAW_SVG_CODE = `<svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <filter id="cloudShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="10" stdDeviation="8" flood-color="#0F172A" flood-opacity="0.22" />
      <feDropShadow dx="0" dy="3" stdDeviation="3" flood-color="#0F172A" flood-opacity="0.14" />
    </filter>
    <linearGradient id="cloudBodyGrad" x1="50%" y1="0%" x2="50%" y2="100%">
      <stop offset="0%" stop-color="#FFFFFF" />
      <stop offset="60%" stop-color="#F1F5F9" />
      <stop offset="100%" stop-color="#CBD5E1" />
    </linearGradient>
  </defs>
  <g filter="url(#cloudShadow)">
    <path fill-rule="evenodd" clip-rule="evenodd" fill="url(#cloudBodyGrad)" d="M 68.00,45.01 Q 100.00,15.00 132.00,45.01 Q 174.05,57.12 164.00,100.00 Q 174.05,142.88 132.00,154.99 Q 100.00,185.00 68.00,154.99 Q 25.95,142.88 36.00,100.00 Q 25.95,57.12 68.00,45.01 Z M 88,72 A 12,12 0 0,1 112,72 L 112,84 A 4,4 0 0,0 116,88 L 128,88 A 12,12 0 0,1 128,112 L 116,112 A 4,4 0 0,0 112,116 L 112,128 A 12,12 0 0,1 88,128 L 88,116 A 4,4 0 0,0 84,112 L 72,112 A 12,12 0 0,1 72,88 L 84,88 A 4,4 0 0,0 88,84 Z" />
  </g>
</svg>`;

export const BrandDAMModule: React.FC = () => {
  const { t } = useTranslation();
  const { workspaceName, workspaceSlug } = useAirBookStore();
  const { addToast } = useToast();

  const [activeTab, setActiveTab] = useState<StudioTab>('identity');
  const [showInternalAssets, setShowInternalAssets] = useState(false);

  // Brand State
  const [brandName, setBrandName] = useState(workspaceName || 'AirBook Studio');
  const [tagline, setTagline] = useState('Bespoke Aesthetics, Hair Artistry & Precision Styling');
  const [logoUrl, setLogoUrl] = useState('');
  const [coverUrl, setCoverUrl] = useState(CURATED_COVERS[0].url);
  const [primaryColor, setPrimaryColor] = useState('#007AFF');
  const [accentColor, setAccentColor] = useState('#60A5FA');
  const [instagramUrl, setInstagramUrl] = useState('');
  const [tiktokUrl, setTiktokUrl] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [googleReviewUrl, setGoogleReviewUrl] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Asset DAM State
  const [previewSize, setPreviewSize] = useState<number>(64);
  const [bgTheme, setBgTheme] = useState<'light' | 'cream' | 'dark' | 'grid'>('cream');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Fetch initial brand settings from API
  useEffect(() => {
    const fetchBrand = async () => {
      try {
        const res = await fetch('/api/brand');
        const data = await res.json();
        if (data.success && data.brand) {
          if (data.brand.name) setBrandName(data.brand.name);
          if (data.brand.bio) setTagline(data.brand.bio);
          if (data.brand.logoUrl) setLogoUrl(data.brand.logoUrl);
          if (data.brand.coverImageUrl) setCoverUrl(data.brand.coverImageUrl);
          if (data.brand.brandColor) setPrimaryColor(data.brand.brandColor);
          if (data.brand.accentColor) setAccentColor(data.brand.accentColor);
          if (data.brand.instagramUrl) setInstagramUrl(data.brand.instagramUrl);
          if (data.brand.tiktokUrl) setTiktokUrl(data.brand.tiktokUrl);
          if (data.brand.websiteUrl) setWebsiteUrl(data.brand.websiteUrl);
          if (data.brand.googleReviewUrl) setGoogleReviewUrl(data.brand.googleReviewUrl);
        }
      } catch (err) {
        console.warn('Failed to load brand data:', err);
      }
    };
    fetchBrand();
  }, []);

  const handleSaveBrandKit = async () => {
    setIsSaving(true);
    try {
      const res = await fetch('/api/brand', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: brandName,
          bio: tagline,
          logoUrl,
          coverImageUrl: coverUrl,
          brandColor: primaryColor,
          accentColor,
          instagramUrl,
          tiktokUrl,
          websiteUrl,
          googleReviewUrl,
        }),
      });

      const data = await res.json();
      if (data.success) {
        addToast(t('brandKitSaved'), 'success');
      } else {
        addToast(data.error || 'Failed to save brand kit.', 'error');
      }
    } catch (err) {
      console.error('Error saving brand kit:', err);
      addToast('Error syncing brand kit to server.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCopy = (content: string, id: string) => {
    navigator.clipboard.writeText(content);
    setCopiedId(id);
    addToast(t('badgeCopied'), 'success');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDownloadSVG = (filename: string, svgContent: string) => {
    const blob = new Blob([svgContent], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getCanvasBgClass = () => {
    switch (bgTheme) {
      case 'light': return 'bg-white text-slate-900 border-slate-200/80';
      case 'dark': return 'bg-[#0F172A] text-white border-white/10';
      case 'grid': return 'bg-[#1E293B] text-white border-white/10 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:16px_16px]';
      default: return 'bg-[#FAFAFC] text-slate-900 border-slate-200/80 dark:bg-[#141720] dark:text-white dark:border-white/10';
    }
  };

  const bookingSlug = workspaceSlug || brandName.toLowerCase().replace(/[^a-z0-9]/g, '-');
  const fullBookingUrl = `https://getairbook.com/book/${bookingSlug}`;
  const embedBadgeHtml = `<a href="${fullBookingUrl}" target="_blank" style="display:inline-flex;align-items:center;gap:8px;padding:10px 18px;background:${primaryColor};color:#ffffff;border-radius:12px;text-decoration:none;font-family:sans-serif;font-weight:700;font-size:13px;box-shadow:0 4px 12px rgba(0,0,0,0.15);">📅 Book on AirBook</a>`;

  // Client-facing tabs for salon & spa owners
  const clientTabs = [
    { id: 'identity' as const, label: t('tabBrandIdentity'), icon: Sparkle24Filled },
    { id: 'storefront' as const, label: t('tabLiveStorefront'), icon: Globe24Regular },
    { id: 'embed' as const, label: t('tabEmbedWidget'), icon: Link24Filled },
  ];

  // Internal AirBook DAM tabs
  const internalTabs = [
    { id: 'badges' as const, label: t('tabAppBadges'), icon: Box24Filled },
    { id: 'glyphs' as const, label: t('tabVectorGlyphs'), icon: Grid24Filled },
    { id: 'vector' as const, label: t('tabRawVectorCode'), icon: Code24Filled },
  ];

  const activeTabsList = showInternalAssets ? [...clientTabs, ...internalTabs] : clientTabs;

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8 p-4 sm:p-8">
      {/* Top Header & Breadcrumb */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-[var(--border-subtle)]">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">
            <Link href="/dashboard" className="hover:text-blue-500 flex items-center gap-1 transition-colors">
              <ArrowLeft24Filled className="w-3.5 h-3.5" /> {t('dashboard')}
            </Link>
            <span>/</span>
            <span>{t('brandStudioTitle')}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[var(--text-primary)] flex items-center gap-3">
            <Logo variant="3d" size={36} />
            {t('brandStudioTitle')}
          </h1>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] max-w-2xl">
            {t('brandStudioDesc')}
          </p>
        </div>

        {/* Global Action Buttons */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <button
            type="button"
            onClick={handleSaveBrandKit}
            disabled={isSaving}
            className="btn-primary px-6"
          >
            <Save24Filled className="w-4 h-4" />
            <span>{isSaving ? t('savingState') : t('save')}</span>
          </button>
        </div>
      </div>

      {/* Tab Navigation Bar */}
      <div className="flex items-center justify-between gap-2 p-1 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] overflow-x-auto">
        <div className="flex items-center gap-1.5">
          {activeTabsList.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all duration-100 whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-[var(--bg-primary)] text-[var(--text-primary)] shadow-xs'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Dev Mode DAM Switch */}
        <button
          type="button"
          onClick={() => setShowInternalAssets(!showInternalAssets)}
          className={`text-[10px] font-bold px-2.5 py-1 rounded-lg border transition-colors flex-shrink-0 cursor-pointer ${
            showInternalAssets
              ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20'
              : 'text-[var(--text-muted)] border-transparent hover:border-[var(--border-subtle)]'
          }`}
          title="AirBook Internal Assets"
        >
          {showInternalAssets ? 'DAM Assets Active' : '+ Internal DAM'}
        </button>
      </div>

      {/* TAB 1: BRAND IDENTITY STUDIO */}
      {activeTab === 'identity' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
          {/* Main Brand Form Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left: General Brand Identity */}
            <div className="p-6 rounded-3xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] space-y-5 shadow-xs">
              <h3 className="text-sm font-black uppercase tracking-wider text-[var(--text-primary)] flex items-center gap-2">
                <Sparkle24Regular className="w-4 h-4 text-[var(--text-secondary)]" />
                <span>{t('identityBio')}</span>
              </h3>

              <FloatingInput
                label={t('brandNameLabel')}
                type="text"
                value={brandName}
                onChange={(e) => setBrandName(e.target.value)}
              />

              <FloatingTextarea
                label={t('taglineLabel')}
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                rows={3}
              />

              <FloatingInput
                label={t('logoUploadLabel')}
                type="text"
                value={logoUrl}
                onChange={(e) => setLogoUrl(e.target.value)}
                placeholder="https://..."
              />

              {/* Social Channels */}
              <div className="pt-4 border-t border-[var(--border-subtle)] space-y-3">
                <h4 className="text-xs font-black uppercase tracking-wider text-[var(--text-secondary)]">
                  {t('socialLinksLabel')}
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <FloatingInput
                    label="Instagram URL"
                    type="text"
                    value={instagramUrl}
                    onChange={(e) => setInstagramUrl(e.target.value)}
                    placeholder="https://instagram.com/..."
                  />
                  <FloatingInput
                    label={t('tiktokLabel')}
                    type="text"
                    value={tiktokUrl}
                    onChange={(e) => setTiktokUrl(e.target.value)}
                    placeholder="https://tiktok.com/@..."
                  />
                  <FloatingInput
                    label="Website URL"
                    type="text"
                    value={websiteUrl}
                    onChange={(e) => setWebsiteUrl(e.target.value)}
                    placeholder="https://..."
                  />
                  <FloatingInput
                    label="Google Reviews URL"
                    type="text"
                    value={googleReviewUrl}
                    onChange={(e) => setGoogleReviewUrl(e.target.value)}
                    placeholder="https://g.page/r/..."
                  />
                </div>
              </div>
            </div>

            {/* Right: Colors & Cover Gallery */}
            <div className="space-y-6">
              {/* Color Customizer */}
              <div className="p-6 rounded-3xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] space-y-4 shadow-xs">
                <h3 className="text-sm font-black uppercase tracking-wider text-[var(--text-primary)] flex items-center gap-2">
                  <Color24Filled className="w-4 h-4 text-[var(--color-accent-primary)]" />
                  <span>{t('primaryBrandColor')}</span>
                </h3>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-[var(--text-secondary)]">{t('primaryBrandColor')}</label>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={primaryColor}
                        onChange={(e) => setPrimaryColor(e.target.value)}
                        className="w-10 h-10 rounded-xl cursor-pointer border border-[var(--border-subtle)] bg-transparent"
                      />
                      <span className="text-xs font-mono font-bold text-[var(--text-primary)] uppercase">{primaryColor}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-[var(--text-secondary)]">{t('accentBrandColor')}</label>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={accentColor}
                        onChange={(e) => setAccentColor(e.target.value)}
                        className="w-10 h-10 rounded-xl cursor-pointer border border-[var(--border-subtle)] bg-transparent"
                      />
                      <span className="text-xs font-mono font-bold text-[var(--text-primary)] uppercase">{accentColor}</span>
                    </div>
                  </div>
                </div>

                {/* Preset Palettes */}
                <div className="pt-3 border-t border-[var(--border-subtle)] space-y-2">
                  <span className="text-[11px] font-bold text-[var(--text-secondary)]">{t('curatedPalettes')}</span>
                  <div className="flex flex-wrap gap-2">
                    {CURATED_PALETTES.map((pal) => (
                      <button
                        key={pal.name}
                        type="button"
                        onClick={() => {
                          setPrimaryColor(pal.primary);
                          setAccentColor(pal.accent);
                        }}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/5 dark:bg-white/5 hover:bg-black/10 text-xs font-bold text-[var(--text-primary)] border border-[var(--border-subtle)] transition-colors cursor-pointer"
                      >
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: pal.primary }} />
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: pal.accent }} />
                        <span>{pal.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Curated 4K Studio Covers */}
              <div className="p-6 rounded-3xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] space-y-4 shadow-xs">
                <h3 className="text-sm font-black uppercase tracking-wider text-[var(--text-primary)] flex items-center gap-2">
                  <Image24Filled className="w-4 h-4 text-[var(--color-accent-primary)]" />
                  <span>{t('curatedCovers')}</span>
                </h3>

                <div className="grid grid-cols-2 gap-3">
                  {CURATED_COVERS.map((cov) => (
                    <button
                      key={cov.id}
                      type="button"
                      onClick={() => setCoverUrl(cov.url)}
                      className={`group relative h-24 rounded-2xl overflow-hidden border-2 transition-all cursor-pointer ${
                        coverUrl === cov.url ? 'border-blue-500 ring-2 ring-blue-500/20' : 'border-transparent opacity-80 hover:opacity-100'
                      }`}
                    >
                      <img src={cov.url} alt={cov.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-2">
                        <span className="text-[10px] font-bold text-white leading-tight block text-left">{cov.title}</span>
                      </div>
                    </button>
                  ))}
                </div>

                <FloatingInput
                  label="Custom Cover Image URL"
                  type="text"
                  value={coverUrl}
                  onChange={(e) => setCoverUrl(e.target.value)}
                  placeholder="https://..."
                />
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* TAB 2: LIVE STOREFRONT PREVIEW */}
      {activeTab === 'storefront' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs font-bold text-blue-600 dark:text-blue-400">
            <div className="flex items-center gap-2">
              <Globe24Regular className="w-4 h-4" />
              <span>{t('tabLiveStorefront')}: <code>https://getairbook.com/book/{bookingSlug}</code></span>
            </div>
            <Link
              href={`/book/${bookingSlug}`}
              target="_blank"
              className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition-colors flex items-center gap-1"
            >
              <span>{t('viewAll')}</span>
              <Open24Filled className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Interactive Mock Storefront */}
          <div className="w-full max-w-2xl mx-auto rounded-3xl overflow-hidden border border-[var(--border-subtle)] bg-[var(--bg-primary)] shadow-2xl">
            <div className="relative h-48 sm:h-56 w-full bg-slate-900">
              <img src={coverUrl} alt="Storefront Cover" className="w-full h-full object-cover opacity-90" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              <div className="absolute bottom-4 left-6 right-6 flex items-end gap-4">
                <div className="w-16 h-16 rounded-2xl bg-white p-1 border-2 border-white/20 shadow-lg flex items-center justify-center flex-shrink-0">
                  {logoUrl ? (
                    <img src={logoUrl} alt="Logo" className="w-full h-full object-contain rounded-xl" />
                  ) : (
                    <Logo variant="flat" flatStyle="solid-black" size={32} />
                  )}
                </div>
                <div className="text-white space-y-0.5">
                  <h2 className="text-xl font-black">{brandName}</h2>
                  <p className="text-xs text-white/80 line-clamp-1">{tagline}</p>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-[var(--border-subtle)]">
                <span className="text-xs font-black uppercase tracking-wider text-[var(--text-secondary)]">{t('popularServices')}</span>
                <span className="text-xs font-bold" style={{ color: primaryColor }}>4.9 ★ (120+ Reviews)</span>
              </div>

              <div className="space-y-3">
                {[
                  { name: 'Signature Precision Cut & Styling', price: '$85', duration: '45 min' },
                  { name: 'Balayage & Color Refresh Therapy', price: '$195', duration: '120 min' },
                  { name: 'Hydrafacial Luxe Glow Treatment', price: '$140', duration: '60 min' },
                ].map((s) => (
                  <div key={s.name} className="flex items-center justify-between p-3.5 rounded-2xl bg-black/5 dark:bg-white/5 border border-[var(--border-subtle)]">
                    <div>
                      <h4 className="text-xs font-extrabold text-[var(--text-primary)]">{s.name}</h4>
                      <p className="text-[11px] text-[var(--text-secondary)]">{s.duration}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-black text-[var(--text-primary)]">{s.price}</span>
                      <button
                        type="button"
                        className="px-3 py-1.5 rounded-xl text-xs font-extrabold text-white shadow-xs"
                        style={{ backgroundColor: primaryColor }}
                      >
                        Book
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* TAB 3: EMBED WIDGET & DIRECT LINKS (CLIENT-FACING) */}
      {activeTab === 'embed' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          {/* Direct Booking Link Card */}
          <div className="p-6 rounded-3xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] space-y-4 shadow-xs">
            <div>
              <h3 className="text-sm font-black uppercase tracking-wider text-[var(--text-primary)] flex items-center gap-2">
                <Link24Filled className="w-4 h-4 text-[var(--color-accent-primary)]" />
                <span>{t('directBookingUrl')}</span>
              </h3>
              <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                {t('embedSubtitle')}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3">
              <input
                type="text"
                readOnly
                value={fullBookingUrl}
                className="w-full h-11 px-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-[var(--border-subtle)] font-mono text-xs text-[var(--text-primary)] select-all"
              />

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => handleCopy(fullBookingUrl, 'direct-link')}
                  className="btn-primary h-11 px-4 flex-1 sm:flex-none flex items-center justify-center gap-1.5 text-xs font-bold cursor-pointer"
                >
                  <Copy24Filled className="w-4 h-4" />
                  <span>{copiedId === 'direct-link' ? t('linkCopied') : t('copyLink')}</span>
                </button>

                <Link
                  href={`/book/${bookingSlug}`}
                  target="_blank"
                  className="h-11 px-4 rounded-2xl border border-[var(--border-subtle)] hover:bg-black/5 dark:hover:bg-white/10 text-xs font-bold text-[var(--text-primary)] transition-colors flex items-center justify-center gap-1.5"
                >
                  <Open24Filled className="w-4 h-4" />
                  <span>Open</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Embed Button Badge Generator */}
          <div className="p-6 rounded-3xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] space-y-4 shadow-xs">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-black uppercase tracking-wider text-[var(--text-primary)] flex items-center gap-2">
                  <Code24Filled className="w-4 h-4 text-[var(--color-accent-primary)]" />
                  <span>{t('bookOnAirBookBadge')}</span>
                </h3>
                <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                  {t('embedSubtitle')}
                </p>
              </div>

              <button
                type="button"
                onClick={() => handleCopy(embedBadgeHtml, 'embed-badge')}
                className="btn-primary h-10 px-4 text-xs font-extrabold flex items-center gap-1.5 cursor-pointer"
              >
                {copiedId === 'embed-badge' ? (
                  <>
                    <Checkmark24Filled className="w-3.5 h-3.5" />
                    <span>{t('badgeCopied')}</span>
                  </>
                ) : (
                  <>
                    <Copy24Filled className="w-3.5 h-3.5" />
                    <span>{t('copyEmbedBadge')}</span>
                  </>
                )}
              </button>
            </div>

            {/* Badge Preview */}
            <div className="p-8 rounded-2xl bg-black/5 dark:bg-white/5 border border-[var(--border-subtle)] flex items-center justify-center">
              <div dangerouslySetInnerHTML={{ __html: embedBadgeHtml }} />
            </div>

            <pre className="p-4 rounded-2xl bg-slate-950 text-blue-300 font-mono text-xs overflow-x-auto border border-slate-800">
              {embedBadgeHtml}
            </pre>
          </div>
        </motion.div>
      )}

      {/* TAB 4 (INTERNAL DEV ONLY): 3D APP TILES */}
      {activeTab === 'badges' && showInternalAssets && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs font-bold text-amber-600 dark:text-amber-400">
            <span>{t('internalAirBookAssets')}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {BADGE_VARIANTS.map((badge) => (
              <div key={badge.id} className="p-6 rounded-3xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] flex flex-col items-center text-center space-y-4 shadow-xs">
                <div className="w-24 h-24 rounded-3xl flex items-center justify-center shadow-lg" style={{ background: badge.bg }}>
                  <Logo variant="3d" size={48} />
                </div>
                <div>
                  <h4 className="text-xs font-black text-[var(--text-primary)]">{badge.title}</h4>
                  <p className="text-[11px] text-[var(--text-secondary)]">{badge.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* TAB 5 (INTERNAL DEV ONLY): FLAT UI GLYPHS */}
      {activeTab === 'glyphs' && showInternalAssets && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs font-bold text-amber-600 dark:text-amber-400">
            <span>{t('internalAirBookAssets')}</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {FLAT_VARIANTS.map((flat) => (
              <div key={flat.id} className="p-4 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] flex flex-col items-center text-center space-y-3 shadow-xs">
                <div className="w-16 h-16 flex items-center justify-center">
                  <CircleCloudIconFlat size={40} styleType={flat.id} />
                </div>
                <h4 className="text-[11px] font-bold text-[var(--text-primary)] truncate w-full">{flat.title}</h4>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* TAB 6 (INTERNAL DEV ONLY): RAW VECTOR CODE */}
      {activeTab === 'vector' && showInternalAssets && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs font-bold text-amber-600 dark:text-amber-400">
            <span>{t('internalAirBookAssets')}</span>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900 text-slate-100 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400 pb-3 border-b border-slate-800">
              <span>public/logo.svg (200x200 Master Vector Spec)</span>
              <button
                type="button"
                onClick={() => handleDownloadSVG('airbook-logo-raw.svg', RAW_SVG_CODE)}
                className="px-4 py-2 rounded-xl bg-black/5 dark:bg-white/10 hover:bg-black/10 text-xs font-extrabold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <ArrowDownload24Filled className="w-3.5 h-3.5" />
                <span>{t('downloadFile')}</span>
              </button>
            </div>

            <pre className="text-xs font-mono text-blue-300 overflow-x-auto p-4 bg-slate-950 rounded-2xl border border-slate-800 max-h-48 overflow-y-auto">
              {RAW_SVG_CODE}
            </pre>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default BrandDAMModule;
