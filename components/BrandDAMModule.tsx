'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Logo, CircleCloudIcon3D, CircleCloudIconFlat, BlueprintBadgeIcon, LogoBadgeStyle, LogoFlatStyle } from './Logo';
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
  Color24Filled,
  Code24Filled,
  Grid24Filled,
  Save24Filled,
  Globe24Regular,
  Image24Filled,
  Calendar24Filled,
  Sparkle24Regular,
} from '@fluentui/react-icons';
import Link from 'next/link';

type StudioTab = 'identity' | 'storefront' | 'badges' | 'glyphs' | 'vector';

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
  const embedBadgeHtml = `<a href="https://getairbook.com/book/${bookingSlug}" target="_blank" style="display:inline-flex;align-items:center;gap:8px;padding:10px 18px;background:${primaryColor};color:#ffffff;border-radius:12px;text-decoration:none;font-family:sans-serif;font-weight:700;font-size:13px;box-shadow:0 4px 12px rgba(0,0,0,0.15);">📅 Book on AirBook</a>`;

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
            <span>{t('brandDamBreadcrumb')}</span>
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
            onClick={() => handleDownloadSVG('airbook-logo-primary.svg', RAW_SVG_CODE)}
            className="btn-secondary h-10 px-4 rounded-2xl flex items-center gap-1.5 text-xs font-bold"
          >
            <ArrowDownload24Filled className="w-4 h-4" />
            <span>{t('downloadSvg')}</span>
          </button>

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

      {/* 5-Tab Navigation Bar */}
      <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] overflow-x-auto">
        {[
          { id: 'identity' as const, label: t('tabBrandIdentity'), icon: Sparkle24Filled },
          { id: 'storefront' as const, label: t('tabLiveStorefront'), icon: Globe24Regular },
          { id: 'badges' as const, label: t('tabAppBadges'), icon: Box24Filled },
          { id: 'glyphs' as const, label: t('tabVectorGlyphs'), icon: Grid24Filled },
          { id: 'vector' as const, label: t('tabRawVectorCode'), icon: Code24Filled },
        ].map((tab) => {
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
                rows={3}
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                placeholder={t('taglinePlaceholder')}
              />

              <FloatingInput
                label={`${t('logoUploadLabel')} (Image / SVG URL)`}
                type="url"
                value={logoUrl}
                onChange={(e) => setLogoUrl(e.target.value)}
                placeholder="https://your-domain.com/logo.svg"
              />
            </div>

            {/* Right: Color Palette Engine */}
            <div className="p-6 rounded-3xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] space-y-5 shadow-xs">
              <h3 className="text-sm font-black uppercase tracking-wider text-[var(--text-primary)] flex items-center gap-2">
                <Color24Filled className="w-4 h-4 text-pink-500" />
                <span>Color Palette & Theme</span>
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[var(--text-secondary)] block">
                    {t('primaryBrandColor')}
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={primaryColor}
                      onChange={(e) => setPrimaryColor(e.target.value)}
                      className="w-10 h-10 rounded-xl cursor-pointer border-0 bg-transparent"
                    />
                    <input
                      type="text"
                      value={primaryColor}
                      onChange={(e) => setPrimaryColor(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl bg-black/5 dark:bg-white/5 border border-[var(--border-subtle)] text-xs font-mono font-bold text-[var(--text-primary)] uppercase"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[var(--text-secondary)] block">
                    {t('accentBrandColor')}
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={accentColor}
                      onChange={(e) => setAccentColor(e.target.value)}
                      className="w-10 h-10 rounded-xl cursor-pointer border-0 bg-transparent"
                    />
                    <input
                      type="text"
                      value={accentColor}
                      onChange={(e) => setAccentColor(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl bg-black/5 dark:bg-white/5 border border-[var(--border-subtle)] text-xs font-mono font-bold text-[var(--text-primary)] uppercase"
                    />
                  </div>
                </div>
              </div>

              {/* Curated Luxury Palettes */}
              <div className="space-y-2 pt-2">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-[var(--text-muted)] block">
                  {t('curatedPalettes')}
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {CURATED_PALETTES.map((pal) => (
                    <button
                      key={pal.name}
                      type="button"
                      onClick={() => {
                        setPrimaryColor(pal.primary);
                        setAccentColor(pal.accent);
                      }}
                      className="p-2.5 rounded-xl border border-[var(--border-subtle)] bg-black/5 dark:bg-white/5 hover:border-blue-500/50 flex items-center justify-between transition-colors cursor-pointer"
                    >
                      <span className="text-xs font-bold text-[var(--text-primary)]">{pal.name}</span>
                      <div className="flex items-center gap-1">
                        <span className="w-4 h-4 rounded-full border border-black/10 shadow-xs" style={{ backgroundColor: pal.primary }} />
                        <span className="w-4 h-4 rounded-full border border-black/10 shadow-xs" style={{ backgroundColor: pal.accent }} />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Curated Hero Covers Selection */}
          <div className="p-6 rounded-3xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] space-y-4 shadow-xs">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-black uppercase tracking-wider text-[var(--text-primary)] flex items-center gap-2">
                  <Image24Filled className="w-4 h-4 text-emerald-500" />
                  <span>{t('coverBannerLabel')}</span>
                </h3>
                <p className="text-xs text-[var(--text-secondary)]">
                  {t('curatedCovers')}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {CURATED_COVERS.map((cov) => (
                <button
                  key={cov.id}
                  type="button"
                  onClick={() => setCoverUrl(cov.url)}
                  className={`group relative rounded-2xl overflow-hidden border-2 text-left transition-all cursor-pointer ${
                    coverUrl === cov.url ? 'border-blue-600 shadow-md ring-2 ring-blue-500/30' : 'border-transparent hover:border-black/20'
                  }`}
                >
                  <img src={cov.url} alt={cov.title} className="w-full h-28 object-cover group-hover:scale-105 transition-transform duration-300" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-3 flex flex-col justify-end">
                    <span className="text-[10px] font-extrabold text-white uppercase tracking-wider">{cov.category}</span>
                    <p className="text-xs font-bold text-white leading-tight">{cov.title}</p>
                  </div>
                  {coverUrl === cov.url && (
                    <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-md">
                      <Checkmark24Filled className="w-3.5 h-3.5" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Social Channels */}
          <div className="p-6 rounded-3xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] space-y-4 shadow-xs">
            <h3 className="text-sm font-black uppercase tracking-wider text-[var(--text-primary)]">
              {t('socialLinksLabel')}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              <FloatingInput
                label="Instagram Profile URL"
                type="url"
                value={instagramUrl}
                onChange={(e) => setInstagramUrl(e.target.value)}
                placeholder="https://instagram.com/yourhandle"
              />

              <FloatingInput
                label={t('tiktokLabel')}
                type="url"
                value={tiktokUrl}
                onChange={(e) => setTiktokUrl(e.target.value)}
                placeholder="https://tiktok.com/@yourhandle"
              />

              <FloatingInput
                label="Official Website URL"
                type="url"
                value={websiteUrl}
                onChange={(e) => setWebsiteUrl(e.target.value)}
                placeholder="https://yourwebsite.com"
              />
            </div>
          </div>
        </motion.div>
      )}

      {/* TAB 2: LIVE STOREFRONT SIMULATOR */}
      {activeTab === 'storefront' && (
        <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6">
          <div className="text-center space-y-1">
            <h3 className="text-lg font-black text-[var(--text-primary)]">{t('tabLiveStorefront')}</h3>
            <p className="text-xs text-[var(--text-secondary)]">
              This is how clients experience your branded storefront on mobile and desktop devices.
            </p>
          </div>

          {/* iPhone 16 Mockup Simulator */}
          <div className="max-w-md mx-auto rounded-[44px] p-3.5 bg-slate-900 border-4 border-slate-700 shadow-2xl overflow-hidden">
            {/* Dynamic Island */}
            <div className="w-28 h-5 bg-black rounded-full mx-auto mb-2 flex items-center justify-center">
              <div className="w-2.5 h-2.5 rounded-full bg-slate-800 ml-auto mr-2" />
            </div>

            {/* Screen Content */}
            <div className="rounded-[32px] bg-[var(--bg-primary)] overflow-hidden border border-[var(--border-subtle)] flex flex-col min-h-[580px]">
              {/* Hero Banner */}
              <div className="relative h-40 w-full overflow-hidden">
                <img src={coverUrl} alt="Storefront Cover" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-3 left-4 right-4 flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-white p-1 shadow-md border flex items-center justify-center">
                    {logoUrl ? (
                      <img src={logoUrl} alt="Logo" className="w-full h-full object-contain" />
                    ) : (
                      <Logo variant="3d" size={32} />
                    )}
                  </div>
                  <div className="text-white min-w-0">
                    <h4 className="text-sm font-black truncate">{brandName}</h4>
                    <p className="text-[10px] text-slate-200 line-clamp-1">{tagline}</p>
                  </div>
                </div>
              </div>

              {/* Storefront Services Showcase */}
              <div className="p-4 space-y-3 flex-1">
                <div className="flex items-center justify-between text-xs font-extrabold text-[var(--text-primary)]">
                  <span>{t('popularServices')}</span>
                  <span className="text-[10px] text-blue-500 font-bold">{t('viewAll')}</span>
                </div>

                {[
                  { name: 'Signature Treatment & Consultation', price: '$120', time: '60 min' },
                  { name: 'Deluxe Rejuvenation Session', price: '$185', time: '90 min' },
                  { name: 'Express Touch-Up & Spec Tune', price: '$65', time: '30 min' },
                ].map((s, idx) => (
                  <div key={idx} className="p-3 rounded-2xl bg-black/5 dark:bg-white/5 border border-[var(--border-subtle)] flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-[var(--text-primary)]">{s.name}</p>
                      <p className="text-[10px] text-[var(--text-secondary)]">{s.time} · {t('instantConfirmation') || 'Instant Confirmation'}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-extrabold text-[var(--text-primary)]">{s.price}</span>
                      <button
                        type="button"
                        className="mt-1 px-3 py-1 rounded-lg text-white text-[10px] font-black block cursor-pointer"
                        style={{ backgroundColor: primaryColor }}
                      >
                        {t('bookNow') || 'Book'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Bottom Sticky Action */}
              <div className="p-4 bg-[var(--bg-primary)] border-t border-[var(--border-subtle)]">
                <button
                  type="button"
                  className="w-full py-3 rounded-2xl text-white font-extrabold text-xs shadow-md flex items-center justify-center gap-2 cursor-pointer"
                  style={{ backgroundColor: primaryColor }}
                >
                  <Calendar24Filled className="w-4 h-4" />
                  <span>{t('bookAppointmentNow')}</span>
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* TAB 3: 3D APP TILES (ALL 5 VARIATIONS) */}
      {activeTab === 'badges' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          {/* Controls */}
          <div className="p-4 sm:p-5 rounded-3xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-xs font-extrabold text-[var(--text-muted)] uppercase tracking-wider">
                Scale ({previewSize}px):
              </span>
              <input
                type="range"
                min="24"
                max="160"
                step="8"
                value={previewSize}
                onChange={(e) => setPreviewSize(Number(e.target.value))}
                className="w-32 accent-blue-600 cursor-pointer"
              />
            </div>

            <div className="flex items-center gap-1 bg-black/5 dark:bg-white/5 p-1 rounded-xl">
              {(['cream', 'light', 'dark', 'grid'] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setBgTheme(t)}
                  className={`px-3 py-1 rounded-lg text-[10px] font-extrabold uppercase transition-all cursor-pointer ${
                    bgTheme === t
                      ? 'bg-white dark:bg-slate-700 text-black dark:text-white shadow-xs'
                      : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* 3D Badges Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {BADGE_VARIANTS.map((badge) => (
              <div
                key={badge.id}
                className={`p-6 rounded-3xl border transition-all duration-200 flex flex-col justify-between gap-6 shadow-xs hover:shadow-md ${getCanvasBgClass()}`}
              >
                <div className="min-h-[160px] flex items-center justify-center relative p-4">
                  <Logo variant="badge" badgeStyle={badge.id} size={previewSize} animated />
                </div>

                <div className="pt-4 border-t border-black/10 dark:border-white/10 space-y-3">
                  <div>
                    <h3 className="text-sm font-black text-[var(--text-primary)]">{badge.title}</h3>
                    <p className="text-xs text-[var(--text-secondary)] mt-0.5">{badge.desc}</p>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleCopy(`<Logo variant="badge" badgeStyle="${badge.id}" size={${previewSize}} />`, badge.id)}
                    className="w-full py-2 px-3 rounded-xl bg-black/5 dark:bg-white/10 hover:bg-black/10 text-xs font-extrabold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    {copiedId === badge.id ? (
                      <>
                        <Checkmark24Filled className="w-3.5 h-3.5 text-emerald-500" />
                        <span>{t('copiedReactCode')}</span>
                      </>
                    ) : (
                      <>
                        <Copy24Filled className="w-3.5 h-3.5" />
                        <span>{t('copyReactCode')}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* TAB 4: FLAT UI GLYPHS & ICONS (ALL 6 VARIATIONS) */}
      {activeTab === 'glyphs' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          {/* Controls */}
          <div className="p-4 sm:p-5 rounded-3xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-xs font-extrabold text-[var(--text-muted)] uppercase tracking-wider">
                Scale ({previewSize}px):
              </span>
              <input
                type="range"
                min="24"
                max="160"
                step="8"
                value={previewSize}
                onChange={(e) => setPreviewSize(Number(e.target.value))}
                className="w-32 accent-blue-600 cursor-pointer"
              />
            </div>

            <div className="flex items-center gap-1 bg-black/5 dark:bg-white/5 p-1 rounded-xl">
              {(['cream', 'light', 'dark', 'grid'] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setBgTheme(t)}
                  className={`px-3 py-1 rounded-lg text-[10px] font-extrabold uppercase transition-all cursor-pointer ${
                    bgTheme === t
                      ? 'bg-white dark:bg-slate-700 text-black dark:text-white shadow-xs'
                      : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* 6 Glyphs Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {FLAT_VARIANTS.map((flat) => (
              <div
                key={flat.id}
                className={`p-5 rounded-3xl border flex flex-col items-center justify-between text-center gap-4 transition-all ${getCanvasBgClass()}`}
              >
                <div className="min-h-[100px] flex items-center justify-center p-2">
                  <CircleCloudIconFlat size={previewSize} styleType={flat.id} />
                </div>

                <div className="w-full pt-3 border-t border-slate-200/60 dark:border-white/10 space-y-2">
                  <span className="text-xs font-extrabold text-[var(--text-primary)] block truncate">{flat.title}</span>
                  <button
                    type="button"
                    onClick={() => handleCopy(`<Logo variant="flat" flatStyle="${flat.id}" size={${previewSize}} />`, flat.id)}
                    className="w-full py-1.5 px-2 rounded-lg bg-black/5 dark:bg-white/10 hover:bg-black/10 text-[10px] font-extrabold flex items-center justify-center gap-1 transition-colors cursor-pointer"
                  >
                    {copiedId === flat.id ? (
                      <Checkmark24Filled className="w-3 h-3 text-emerald-500" />
                    ) : (
                      <Copy24Filled className="w-3 h-3" />
                    )}
                    <span>{copiedId === flat.id ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* TAB 5: VECTOR SVG & EMBED BADGE */}
      {activeTab === 'vector' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          {/* Embed Button Badge Generator */}
          <div className="p-6 rounded-3xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] space-y-4 shadow-xs">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-black uppercase tracking-wider text-[var(--text-primary)]">
                  {t('bookOnAirBookBadge')}
                </h3>
                <p className="text-xs text-[var(--text-secondary)]">
                  Embed this responsive button badge into your website header, footer, or Linktree.
                </p>
              </div>

              <button
                type="button"
                onClick={() => handleCopy(embedBadgeHtml, 'embed-badge')}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
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

            <pre className="p-4 rounded-xl bg-slate-900 text-blue-300 font-mono text-xs overflow-x-auto border border-slate-800">
              {embedBadgeHtml}
            </pre>
          </div>

          {/* Master Vector SVG Code */}
          <div className="p-6 rounded-3xl bg-slate-900 text-slate-100 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400 pb-3 border-b border-slate-800">
              <span>public/logo.svg (200x200 Master Vector Spec)</span>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => handleCopy(RAW_SVG_CODE, 'raw-svg')}
                  className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer"
                >
                  {copiedId === 'raw-svg' ? (
                    <Checkmark24Filled className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Copy24Filled className="w-4 h-4" />
                  )}
                  <span>{copiedId === 'raw-svg' ? 'Copied SVG Code!' : 'Copy SVG Code'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleDownloadSVG('airbook-logo-raw.svg', RAW_SVG_CODE)}
                  className="px-4 py-2 rounded-xl bg-black/5 dark:bg-white/10 hover:bg-black/10 text-xs font-extrabold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <ArrowDownload24Filled className="w-3.5 h-3.5" />
                  <span>{t('downloadFile')}</span>
                </button>
              </div>
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
