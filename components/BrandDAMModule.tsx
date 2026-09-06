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

type StudioTab = 'identity' | 'photography' | 'storefront' | 'opengraph' | 'embed' | 'badges' | 'glyphs' | 'vector';

const CANDID_BRAND_PHOTOGRAPHY_GALLERY = [
  {
    id: 'hair-salon-candid',
    title: 'Hair Salon & Color Artistry',
    subtitle: 'Colorist in vintage denim jacket laughing with client checking fresh balayage in studio mirror.',
    category: 'Hair Salon',
    url: '/brand/photos/candid/hair-salon.jpg',
  },
  {
    id: 'barbershop-candid',
    title: 'Barbershop & Grooming Lounge',
    subtitle: 'Barber in streetwear tee & apron sharing a genuine laugh with client in vintage leather chair.',
    category: 'Barbershop',
    url: '/brand/photos/candid/barbershop.jpg',
  },
  {
    id: 'medspa-esthetician-candid',
    title: 'MedSpa & Clinical Aesthetics',
    subtitle: 'Radiant esthetician in cozy sage fleece consulting client with glowing bare skin over tea.',
    category: 'MedSpa & Esthetics',
    url: '/brand/photos/candid/medspa-esthetician.jpg',
  },
  {
    id: 'nail-studio-candid',
    title: 'Nail Art Studio & Manicure Bar',
    subtitle: 'Nail artist in denim & stacked rings showing off 3D chrome metallic manicure with client.',
    category: 'Nail Studio',
    url: '/brand/photos/candid/nail-studio.jpg',
  },
  {
    id: 'tattoo-artist-candid',
    title: 'Tattoo Atelier & Fine-Line Ink',
    subtitle: 'Fine-line tattoo artist in beanie & hoodie reviewing iPad botanical stencil with smiling client.',
    category: 'Tattoo Atelier',
    url: '/brand/photos/candid/tattoo-artist.jpg',
  },
  {
    id: 'massage-wellness-candid',
    title: 'Massage & Holistic Wellness Sanctuary',
    subtitle: 'Holistic therapist in organic linen setting heated basalt stones and aromatherapy in bamboo suite.',
    category: 'Massage & Spa',
    url: '/brand/photos/candid/massage-wellness.jpg',
  },
  {
    id: 'pet-grooming-candid',
    title: 'Pet Grooming & Canine Spa',
    subtitle: 'Friendly stylist gently grooming fluffy golden doodle on stainless steel table with mint tiles.',
    category: 'Pet Grooming',
    url: '/brand/photos/candid/pet-grooming.jpg',
  },
  {
    id: 'fitness-trainer-candid',
    title: 'Personal Training & Athletic Studio',
    subtitle: 'Charismatic trainer in slate athletic tee coaching dynamic kettlebell movement in private gym.',
    category: 'Fitness & Training',
    url: '/brand/photos/candid/fitness-trainer.jpg',
  },
];

const EDITORIAL_BRAND_PHOTOGRAPHY_GALLERY = [
  {
    id: 'hair-salon-editorial',
    title: 'Hair Salon & Color Artistry',
    subtitle: 'Master colorist in warm olive linen presenting glossy balayage finish in bespoke studio.',
    category: 'Hair Salon',
    url: '/brand/photos/hair-salon.jpg',
  },
  {
    id: 'barbershop-editorial',
    title: 'Barbershop & Grooming Lounge',
    subtitle: 'Master barber in dark craft apron beside classic vintage leather chair with precision skin fade.',
    category: 'Barbershop',
    url: '/brand/photos/barbershop.jpg',
  },
  {
    id: 'medspa-esthetician-editorial',
    title: 'MedSpa & Clinical Aesthetics',
    subtitle: 'Licensed esthetician in minimalist wrap top conducting skincare consultation in limestone suite.',
    category: 'MedSpa & Esthetics',
    url: '/brand/photos/medspa-esthetician.jpg',
  },
  {
    id: 'nail-studio-editorial',
    title: 'Nail Art Studio & Manicure Bar',
    subtitle: 'Artistic nail designer at travertine marble workstation crafting bespoke chrome art manicure.',
    category: 'Nail Studio',
    url: '/brand/photos/nail-studio.jpg',
  },
  {
    id: 'tattoo-artist-editorial',
    title: 'Tattoo Atelier & Fine-Line Ink',
    subtitle: 'Fine-line tattoo artist sketching botanical stencil on iPad in natural sunlit loft studio.',
    category: 'Tattoo Atelier',
    url: '/brand/photos/tattoo-artist.jpg',
  },
  {
    id: 'massage-wellness-editorial',
    title: 'Massage & Holistic Wellness Sanctuary',
    subtitle: 'Holistic therapist in organic linen setting heated basalt stones and aromatherapy in bamboo suite.',
    category: 'Massage & Spa',
    url: '/brand/photos/massage-wellness.jpg',
  },
  {
    id: 'pet-grooming-editorial',
    title: 'Pet Grooming & Canine Spa',
    subtitle: 'Friendly stylist gently grooming fluffy golden doodle on stainless steel table with mint tiles.',
    category: 'Pet Grooming',
    url: '/brand/photos/pet-grooming.jpg',
  },
  {
    id: 'fitness-trainer-editorial',
    title: 'Personal Training & Athletic Studio',
    subtitle: 'Charismatic trainer in slate athletic tee coaching dynamic kettlebell movement in private gym.',
    category: 'Fitness & Training',
    url: '/brand/photos/fitness-trainer.jpg',
  },
];

const CURATED_COVERS = [
  ...CANDID_BRAND_PHOTOGRAPHY_GALLERY.map(item => ({
    id: item.id,
    title: item.title,
    url: item.url,
    category: item.category,
  })),
  ...EDITORIAL_BRAND_PHOTOGRAPHY_GALLERY.map(item => ({
    id: item.id,
    title: `${item.title} (Editorial)`,
    url: item.url,
    category: item.category,
  })),
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
  const [photoStyle, setPhotoStyle] = useState<'candid' | 'editorial'>('candid');

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
    { id: 'photography' as const, label: t('tabBrandPhotography'), icon: Image24Filled },
    { id: 'storefront' as const, label: t('tabLiveStorefront'), icon: Globe24Regular },
    { id: 'opengraph' as const, label: t('tabOpenGraph'), icon: Image24Filled },
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

      {/* TAB 2: BRAND PHOTOGRAPHY GALLERY */}
      {activeTab === 'photography' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <div className="p-6 sm:p-8 rounded-3xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] space-y-6 shadow-xs">
            {/* Gallery Header & Style Guidelines Callout */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[var(--border-subtle)]">
              <div className="space-y-1">
                <h3 className="text-base font-black uppercase tracking-wider text-[var(--text-primary)] flex items-center gap-2">
                  <Image24Filled className="w-5 h-5 text-blue-500" />
                  <span>
                    {photoStyle === 'candid'
                      ? t('brandPhotographyCandidTitle')
                      : t('brandPhotographyEditorialTitle')}
                  </span>
                </h3>
                <p className="text-xs sm:text-sm text-[var(--text-secondary)] max-w-2xl">
                  {photoStyle === 'candid'
                    ? t('brandPhotographyCandidDesc')
                    : t('brandPhotographyEditorialDesc')}
                </p>
              </div>

              <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-xs font-bold">
                <Sparkle24Regular className="w-4 h-4 flex-shrink-0" />
                <span>
                  {photoStyle === 'candid'
                    ? t('brandPhotographyCandidGuidelinesNote')
                    : t('brandPhotographyEditorialGuidelinesNote')}
                </span>
              </div>
            </div>

            {/* Photo Style Collection Toggle Selector */}
            <div className="flex flex-wrap items-center justify-between gap-3 p-2 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)]">
              <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-subtle)]">
                <button
                  type="button"
                  onClick={() => setPhotoStyle('candid')}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
                    photoStyle === 'candid'
                      ? 'bg-blue-500 text-white shadow-xs'
                      : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  <Sparkle24Filled className="w-3.5 h-3.5" />
                  <span>{t('brandPhotographyCandidTab')}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPhotoStyle('editorial')}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
                    photoStyle === 'editorial'
                      ? 'bg-blue-500 text-white shadow-xs'
                      : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  <Color24Filled className="w-3.5 h-3.5" />
                  <span>{t('brandPhotographyEditorialTab')}</span>
                </button>
              </div>

              <span className="text-[11px] font-bold text-[var(--text-secondary)] px-2">
                {photoStyle === 'candid' ? '8 Bespoke Realism Assets' : '8 Classic Editorial Studio Assets'}
              </span>
            </div>

            {/* 8-Photo Curated Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {(photoStyle === 'candid' ? CANDID_BRAND_PHOTOGRAPHY_GALLERY : EDITORIAL_BRAND_PHOTOGRAPHY_GALLERY).map((item) => {
                const isCurrentCover = coverUrl === item.url;
                const isCopied = copiedId === item.id;

                return (
                  <div
                    key={item.id}
                    className="group flex flex-col rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] overflow-hidden transition-all duration-150 hover:border-blue-500/40 hover:shadow-lg"
                  >
                    {/* Image Thumbnail Container */}
                    <div className="relative aspect-4/3 overflow-hidden bg-black/5 dark:bg-white/5">
                      <img
                        src={item.url}
                        alt={item.title}
                        className="w-full h-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                      
                      {/* Category Badge */}
                      <div className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-xl bg-black/60 backdrop-blur-md border border-white/20 text-[10px] font-black uppercase tracking-wider text-white">
                        {item.category}
                      </div>

                      {/* Open Full Image Action */}
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noreferrer"
                        className="absolute top-2.5 right-2.5 p-2 rounded-xl bg-black/60 backdrop-blur-md border border-white/20 text-white hover:bg-black/80 transition-colors opacity-0 group-hover:opacity-100"
                        title="View Full Resolution"
                      >
                        <Open24Filled className="w-3.5 h-3.5" />
                      </a>

                      {/* Active Cover Indicator Badge */}
                      {isCurrentCover && (
                        <div className="absolute bottom-2.5 left-2.5 px-2.5 py-1 rounded-xl bg-emerald-500 text-white text-[10px] font-black uppercase tracking-wider flex items-center gap-1 shadow-sm">
                          <Checkmark24Filled className="w-3 h-3" />
                          <span>Active Cover</span>
                        </div>
                      )}
                    </div>

                    {/* Metadata & Actions */}
                    <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                      <div className="space-y-1">
                        <h4 className="text-xs font-black text-[var(--text-primary)] line-clamp-1">
                          {item.title}
                        </h4>
                        <p className="text-[11px] text-[var(--text-secondary)] line-clamp-2 leading-relaxed">
                          {item.subtitle}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-[var(--border-subtle)] flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setCoverUrl(item.url);
                            addToast('Set as cover banner! Remember to click Save.', 'info');
                          }}
                          className={`flex-1 py-1.5 px-2.5 rounded-xl text-[11px] font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                            isCurrentCover
                              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                              : 'bg-[var(--bg-primary)] hover:bg-black/5 dark:hover:bg-white/10 text-[var(--text-primary)] border border-[var(--border-subtle)]'
                          }`}
                        >
                          {isCurrentCover ? (
                            <>
                              <Checkmark24Filled className="w-3.5 h-3.5 text-emerald-500" />
                              <span>Selected</span>
                            </>
                          ) : (
                            <>
                              <Image24Filled className="w-3.5 h-3.5" />
                              <span>{t('useAsCover')}</span>
                            </>
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={() => handleCopy(item.url, item.id)}
                          className="p-1.5 rounded-xl bg-[var(--bg-primary)] hover:bg-black/5 dark:hover:bg-white/10 text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-subtle)] transition-colors cursor-pointer"
                          title={t('copyPhotoUrl')}
                        >
                          {isCopied ? (
                            <Checkmark24Filled className="w-3.5 h-3.5 text-emerald-500" />
                          ) : (
                            <Copy24Filled className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>
      )}

      {/* TAB 3: LIVE STOREFRONT PREVIEW */}
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

      {/* TAB 3: OPEN GRAPH SOCIAL CARDS (CLIENT-FACING & BRAND) */}
      {activeTab === 'opengraph' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <div className="p-6 rounded-3xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] space-y-6 shadow-xs">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[var(--border-subtle)]">
              <div>
                <h3 className="text-sm font-black uppercase tracking-wider text-[var(--text-primary)] flex items-center gap-2">
                  <Image24Filled className="w-4 h-4 text-[#FF6347]" />
                  <span>{t('ogPreviewTitle')}</span>
                </h3>
                <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                  {t('ogPreviewDesc')}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href="/opengraph-image"
                  target="_blank"
                  rel="noreferrer"
                  className="h-9 px-3.5 rounded-xl border border-[var(--border-subtle)] hover:bg-black/5 dark:hover:bg-white/10 text-xs font-bold text-[var(--text-primary)] transition-colors flex items-center gap-1.5"
                >
                  <Open24Filled className="w-3.5 h-3.5" />
                  <span>{t('ogDownloadCard')}</span>
                </a>
              </div>
            </div>

            {/* Visual 1200x630 Card Canvas Simulator */}
            <div className="w-full max-w-4xl mx-auto rounded-3xl border border-[var(--border-subtle)] bg-white text-slate-900 shadow-2xl overflow-hidden relative p-6 sm:p-12 text-center aspect-[1.91/1] flex flex-col items-center justify-center select-none">
              {/* Diffuse Glow Top-Left */}
              <div className="absolute -top-12 -left-12 w-64 h-64 rounded-full bg-red-400/30 blur-3xl pointer-events-none" />
              {/* Diffuse Glow Bottom-Right */}
              <div className="absolute -bottom-16 -right-12 w-72 h-72 rounded-full bg-pink-400/25 blur-3xl pointer-events-none" />
              {/* Diffuse Glow Top-Right */}
              <div className="absolute -top-12 right-12 w-56 h-56 rounded-full bg-sky-400/20 blur-3xl pointer-events-none" />

              {/* Central Copy */}
              <div className="z-10 space-y-1 sm:space-y-2 mb-6 sm:mb-10">
                <h2 className="text-xl sm:text-4xl md:text-5xl font-black text-slate-950 tracking-tight leading-tight">
                  The <span className="text-[#FF6347]">frictionless workspace</span>
                  <br />
                  for independent pros.
                </h2>
              </div>

              {/* Master Tool Dock */}
              <div className="z-10 inline-flex items-center gap-2 sm:gap-5 p-2.5 sm:p-4 rounded-2xl sm:rounded-[36px] bg-[#18181B] shadow-2xl border border-white/10">
                {/* 1. Calendar (Scheduling) */}
                <div className="w-12 h-12 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-xl sm:rounded-2xl md:rounded-[24px] bg-white shadow-md overflow-hidden flex flex-col border border-slate-100 flex-shrink-0 relative">
                  <div className="w-full h-3.5 sm:h-6 md:h-7 bg-[#0284C7] relative flex items-center justify-center">
                    <span className="absolute left-2.5 sm:left-4 top-1 w-1 sm:w-1.5 h-1.5 sm:h-2.5 rounded-full bg-white/90 shadow-xs" />
                    <span className="absolute right-2.5 sm:right-4 top-1 w-1 sm:w-1.5 h-1.5 sm:h-2.5 rounded-full bg-white/90 shadow-xs" />
                  </div>
                  <div className="flex-1 flex flex-col items-center justify-center pb-1">
                    <span className="font-black text-lg sm:text-3xl md:text-4xl text-slate-900 leading-none tracking-tight">01</span>
                    <span className="w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full bg-[#0284C7] mt-0.5 sm:mt-1" />
                  </div>
                </div>

                {/* 2. Booking Page (Storefront Sheet with Dog-Ear) */}
                <div className="w-12 h-12 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-xl sm:rounded-2xl md:rounded-[24px] bg-white shadow-md relative overflow-hidden flex flex-col justify-between p-2 sm:p-3.5 border border-slate-100 flex-shrink-0">
                  {/* Top Right Dog-Ear Fold */}
                  <div className="absolute top-0 right-0 w-3.5 sm:w-6 md:w-7 h-3.5 sm:h-6 md:h-7 bg-[#FF6347] rounded-bl-lg sm:rounded-bl-xl shadow-xs" />
                  
                  {/* Traffic Dots */}
                  <div className="flex items-center gap-1 sm:gap-1.5">
                    <span className="w-1 sm:w-1.5 h-1 sm:h-1.5 rounded-full bg-red-400" />
                    <span className="w-1 sm:w-1.5 h-1 sm:h-1.5 rounded-full bg-amber-400" />
                    <span className="w-1 sm:w-1.5 h-1 sm:h-1.5 rounded-full bg-emerald-400" />
                  </div>

                  {/* Abstract Layout Bars */}
                  <div className="space-y-1 sm:space-y-1.5 mt-1 sm:mt-2">
                    <div className="w-5 sm:w-9 h-1 sm:h-1.5 rounded-full bg-[#FF6347]" />
                    <div className="w-7 sm:w-12 h-0.5 sm:h-1 rounded-full bg-slate-300" />
                    <div className="w-6 sm:w-10 h-0.5 sm:h-1 rounded-full bg-slate-200" />
                    <div className="w-4 sm:w-7 h-1 sm:h-2 rounded-full bg-[#0284C7] mt-1" />
                  </div>
                </div>

                {/* 3. POS (Deeply Arched Tap to Pay Terminal) */}
                <div className="w-12 h-12 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-xl sm:rounded-2xl md:rounded-[24px] bg-gradient-to-br from-[#064E3B] to-[#059669] shadow-md relative flex flex-col justify-between items-center p-1 sm:p-2 border border-emerald-400/40 flex-shrink-0 overflow-hidden">
                  {/* Top Speaker Slit */}
                  <div className="w-4 sm:w-7 h-0.5 sm:h-1 rounded-full bg-[#022C22] mt-0.5" />

                  {/* Payment Screen with Deeply Arched Tap to Pay NFC Wave Symbol */}
                  <div className="w-full h-8 sm:h-12 md:h-14 rounded-md sm:rounded-xl bg-[#065F46] border border-emerald-400/30 flex items-center justify-center relative shadow-inner">
                    <svg
                      viewBox="0 0 60 44"
                      fill="none"
                      className="w-7 sm:w-11 md:w-12 h-5 sm:h-8 md:h-9"
                    >
                      <path
                        d="M 16,34 A 12,12 0 0,1 16,10"
                        stroke="#34D399"
                        strokeWidth="4"
                        strokeLinecap="round"
                      />
                      <path
                        d="M 24,38 A 18,18 0 0,1 24,6"
                        stroke="#34D399"
                        strokeWidth="4"
                        strokeLinecap="round"
                      />
                      <path
                        d="M 32,41 A 24,24 0 0,1 32,3"
                        stroke="#A7F3D0"
                        strokeWidth="4"
                        strokeLinecap="round"
                      />
                      <path
                        d="M 40,43 A 30,30 0 0,1 40,1"
                        stroke="#FFFFFF"
                        strokeWidth="4.5"
                        strokeLinecap="round"
                      />
                    </svg>
                    {/* Status LED */}
                    <span className="absolute top-1 right-1 sm:top-1.5 sm:right-1.5 w-1 sm:w-1.5 h-1 sm:h-1.5 rounded-full bg-[#6EE7B7] shadow-[0_0_6px_#34D399]" />
                  </div>

                  {/* Bottom Swipe Groove */}
                  <div className="w-6 sm:w-10 h-0.5 rounded-full bg-[#022C22] mb-0.5" />
                </div>

                {/* 4. Contact List (CRM / Iconic Leather Agenda with Tabs & Debossed Silhouette) */}
                <div className="w-12 h-12 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-xl sm:rounded-2xl md:rounded-[24px] overflow-hidden relative flex flex-shrink-0 shadow-md border border-amber-900/30 bg-[#0F172A]">
                  {/* Left Leather Book Body */}
                  <div className="flex-1 h-full bg-gradient-to-br from-[#E28C2B] to-[#C26E17] shadow-inner relative flex items-center justify-center border-r border-black/25">
                    {/* Spine Shadow Crease */}
                    <div className="absolute left-0 top-0 bottom-0 w-1 sm:w-2 bg-gradient-to-r from-black/25 to-transparent border-r border-black/15" />

                    {/* Debossed Contact Profile Glyph */}
                    <svg
                      viewBox="0 0 60 60"
                      fill="none"
                      className="w-6 sm:w-11 md:w-13 h-6 sm:h-11 md:h-13 ml-0.5"
                    >
                      <circle
                        cx="30"
                        cy="30"
                        r="25"
                        stroke="#8A4605"
                        strokeWidth="3"
                        strokeOpacity="0.65"
                      />
                      <circle
                        cx="30"
                        cy="31"
                        r="25"
                        stroke="#FED7AA"
                        strokeWidth="1.5"
                        strokeOpacity="0.45"
                      />
                      <circle
                        cx="30"
                        cy="23"
                        r="8.5"
                        fill="#9A4E06"
                        fillOpacity="0.6"
                      />
                      <path
                        d="M 16,43 C 16,34 22,33 30,33 C 38,33 44,34 44,43"
                        fill="#9A4E06"
                        fillOpacity="0.6"
                      />
                    </svg>
                  </div>

                  {/* Right Vertical Column of 4 Protruding Index Tabs (Contained Inside Squircle) */}
                  <div className="w-1.5 sm:w-3 md:w-3.5 h-full bg-slate-100 flex flex-col justify-between py-1 sm:py-2 shadow-inner">
                    <span className="w-full h-1.5 sm:h-3 rounded-r-xs bg-[#CBD5E1] shadow-xs" />
                    <span className="w-full h-1.5 sm:h-3 rounded-r-xs bg-[#38BDF8] shadow-xs" />
                    <span className="w-full h-1.5 sm:h-3 rounded-r-xs bg-[#F59E0B] shadow-xs" />
                    <span className="w-full h-1.5 sm:h-3 rounded-r-xs bg-[#34D399] shadow-xs" />
                  </div>
                </div>
              </div>

              {/* Bottom Subtle Brand Mark */}
              <div className="absolute bottom-3 sm:bottom-6 text-[9px] sm:text-xs font-extrabold uppercase tracking-widest text-slate-400">
                AirBook • getairbook.com
              </div>
            </div>

            {/* Action Buttons & Meta Snippets */}
            <div className="space-y-4 pt-4 border-t border-[var(--border-subtle)]">
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <input
                  type="text"
                  readOnly
                  value="https://getairbook.com/opengraph-image"
                  className="w-full h-11 px-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-[var(--border-subtle)] font-mono text-xs text-[var(--text-primary)] select-all"
                />

                <button
                  type="button"
                  onClick={() => handleCopy('https://getairbook.com/opengraph-image', 'og-url')}
                  className="btn-primary h-11 px-5 flex items-center justify-center gap-1.5 text-xs font-bold cursor-pointer whitespace-nowrap w-full sm:w-auto"
                >
                  <Copy24Filled className="w-4 h-4" />
                  <span>{copiedId === 'og-url' ? t('linkCopied') : t('copyLink')}</span>
                </button>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3">
                <input
                  type="text"
                  readOnly
                  value='<meta property="og:image" content="https://getairbook.com/opengraph-image" />'
                  className="w-full h-11 px-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-[var(--border-subtle)] font-mono text-xs text-[var(--text-primary)] select-all"
                />

                <button
                  type="button"
                  onClick={() => handleCopy('<meta property="og:image" content="https://getairbook.com/opengraph-image" />', 'og-meta')}
                  className="h-11 px-5 rounded-2xl border border-[var(--border-subtle)] hover:bg-black/5 dark:hover:bg-white/10 text-xs font-bold text-[var(--text-primary)] transition-colors flex items-center justify-center gap-1.5 whitespace-nowrap w-full sm:w-auto cursor-pointer"
                >
                  <Code24Filled className="w-4 h-4" />
                  <span>{copiedId === 'og-meta' ? t('badgeCopied') : t('ogCopyMetaTag')}</span>
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* TAB 4: EMBED WIDGET & DIRECT LINKS (CLIENT-FACING) */}
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
