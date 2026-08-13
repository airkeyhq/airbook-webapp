'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Logo, CircleCloudIcon3D, CircleCloudIconFlat, BlueprintBadgeIcon, LogoBadgeStyle, LogoFlatStyle } from './Logo';
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
  Filter24Filled,
} from '@fluentui/react-icons';
import Link from 'next/link';

type DAMCategory = 'all' | 'badges' | 'glyphs' | 'vector' | 'colors';

export const BrandDAMModule: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<DAMCategory>('all');
  const [previewSize, setPreviewSize] = useState<number>(64);
  const [bgTheme, setBgTheme] = useState<'light' | 'cream' | 'dark' | 'grid'>('cream');
  const [copiedId, setCopiedId] = useState<string | null>(null);

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

  const getCanvasBgClass = () => {
    switch (bgTheme) {
      case 'light': return 'bg-white text-slate-900 border-slate-200/80';
      case 'dark': return 'bg-[#0F172A] text-white border-white/10';
      case 'grid': return 'bg-[#1E293B] text-white border-white/10 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:16px_16px]';
      default: return 'bg-[#FAFAFC] text-slate-900 border-slate-200/80 dark:bg-[#141720] dark:text-white dark:border-white/10';
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8 p-4 sm:p-8">
      {/* Top Header & Breadcrumb */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-white/10">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
            <Link href="/dashboard" className="hover:text-blue-500 flex items-center gap-1 transition-colors">
              <ArrowLeft24Filled className="w-3.5 h-3.5" /> Dashboard
            </Link>
            <span>/</span>
            <span>Digital Asset Management (DAM)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[var(--text-primary)] flex items-center gap-3">
            <Logo variant="3d" size={36} />
            AirBook Digital Asset Management (DAM) Hub
          </h1>
          <p className="text-xs sm:text-sm text-[var(--text-muted)] max-w-2xl">
            Official Brand Identity System — inspect, customize, preview, and download 3D app tile badges, flat UI glyphs, and vector SVG specifications.
          </p>
        </div>

        {/* Global Download Button */}
        <button
          onClick={() => handleDownloadSVG('airbook-logo-primary.svg', RAW_SVG_CODE)}
          className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-black text-white dark:bg-white dark:text-black font-extrabold text-xs shadow-lg hover:opacity-90 transition-opacity flex-shrink-0"
        >
          <ArrowDownload24Filled className="w-4 h-4" />
          <span>Download Primary SVG</span>
        </button>
      </div>

      {/* Control Bar: Category Filters + Size Slider + Background Switcher */}
      <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-[#181C28] border border-slate-200/80 dark:border-white/10 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Categories */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {[
            { id: 'all', label: 'All Brand Assets' },
            { id: 'badges', label: '3D App Tiles' },
            { id: 'glyphs', label: 'Flat UI Glyphs' },
            { id: 'vector', label: 'Vector SVG' },
            { id: 'colors', label: 'Brand Palette' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id as DAMCategory)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                activeCategory === cat.id
                  ? 'bg-black text-white dark:bg-white dark:text-black shadow-md scale-105'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-black/5 dark:hover:bg-white/5'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Dynamic Controls */}
        <div className="flex flex-wrap items-center gap-4 border-t md:border-t-0 pt-3 md:pt-0 border-slate-200 dark:border-white/10">
          {/* Size Slider */}
          <div className="flex items-center gap-3">
            <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">
              Scale ({previewSize}px):
            </span>
            <input
              type="range"
              min="24"
              max="160"
              step="8"
              value={previewSize}
              onChange={(e) => setPreviewSize(Number(e.target.value))}
              className="w-28 accent-blue-500 cursor-pointer"
            />
          </div>

          {/* Theme Switcher */}
          <div className="flex items-center gap-1 bg-black/5 dark:bg-white/5 p-1 rounded-xl">
            {(['cream', 'light', 'dark', 'grid'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setBgTheme(t)}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-extrabold uppercase transition-all ${
                  bgTheme === t
                    ? 'bg-white dark:bg-slate-700 text-black dark:text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* GALLERY SECTIONS */}
      {(activeCategory === 'all' || activeCategory === 'badges') && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-black tracking-tight text-[var(--text-primary)] flex items-center gap-2">
              <Box24Filled className="w-5 h-5 text-blue-500" />
              3D App Tile Badges (iOS, macOS & Landing Page Assets)
            </h2>
            <span className="text-xs font-bold text-slate-400">{BADGE_VARIANTS.length} Badges</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {BADGE_VARIANTS.map((badge) => (
              <div
                key={badge.id}
                className={`p-6 rounded-3xl border transition-all duration-200 flex flex-col justify-between gap-6 shadow-sm hover:shadow-md ${getCanvasBgClass()}`}
              >
                {/* Visual Centered Display */}
                <div className="min-h-[160px] flex items-center justify-center relative p-4">
                  <Logo variant="badge" badgeStyle={badge.id} size={previewSize} animated />
                </div>

                {/* Information & Action Footer */}
                <div className="pt-4 border-t border-slate-200/60 dark:border-white/10 space-y-3">
                  <div>
                    <h3 className="text-sm font-black text-[var(--text-primary)]">{badge.title}</h3>
                    <p className="text-xs text-[var(--text-muted)] mt-0.5">{badge.desc}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleCopy(`<Logo variant="badge" badgeStyle="${badge.id}" size={${previewSize}} />`, badge.id)}
                      className="flex-1 py-2 px-3 rounded-xl bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 text-xs font-extrabold flex items-center justify-center gap-1.5 transition-colors"
                    >
                      {copiedId === badge.id ? (
                        <>
                          <Checkmark24Filled className="w-3.5 h-3.5 text-green-500" />
                          <span>Copied Code</span>
                        </>
                      ) : (
                        <>
                          <Copy24Filled className="w-3.5 h-3.5" />
                          <span>Copy React Code</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {(activeCategory === 'all' || activeCategory === 'glyphs') && (
        <section className="space-y-4 pt-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-black tracking-tight text-[var(--text-primary)] flex items-center gap-2">
              <Grid24Filled className="w-5 h-5 text-violet-500" />
              Flat Monochromatic & UI Glyphs (Amie-so Style Vector Icons)
            </h2>
            <span className="text-xs font-bold text-slate-400">{FLAT_VARIANTS.length} Glyphs</span>
          </div>

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
                    onClick={() => handleCopy(`<Logo variant="flat" flatStyle="${flat.id}" size={${previewSize}} />`, flat.id)}
                    className="w-full py-1.5 px-2 rounded-lg bg-black/5 dark:bg-white/10 hover:bg-black/10 text-[10px] font-extrabold flex items-center justify-center gap-1 transition-colors"
                  >
                    {copiedId === flat.id ? (
                      <Checkmark24Filled className="w-3 h-3 text-green-500" />
                    ) : (
                      <Copy24Filled className="w-3 h-3" />
                    )}
                    <span>{copiedId === flat.id ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {(activeCategory === 'all' || activeCategory === 'vector') && (
        <section className="space-y-4 pt-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-black tracking-tight text-[var(--text-primary)] flex items-center gap-2">
              <Code24Filled className="w-5 h-5 text-emerald-500" />
              Raw Vector SVG Code Specifications
            </h2>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900 text-slate-100 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400 pb-3 border-b border-slate-800">
              <span>public/logo.svg (200x200 Vector Definition)</span>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleCopy(RAW_SVG_CODE, 'raw-svg')}
                  className="flex items-center gap-1.5 hover:text-white transition-colors"
                >
                  {copiedId === 'raw-svg' ? (
                    <Checkmark24Filled className="w-4 h-4 text-green-400" />
                  ) : (
                    <Copy24Filled className="w-4 h-4" />
                  )}
                  <span>{copiedId === 'raw-svg' ? 'Copied SVG Code!' : 'Copy SVG Code'}</span>
                </button>
                <button
                  onClick={() => handleDownloadSVG('airbook-logo.svg', RAW_SVG_CODE)}
                  className="flex items-center gap-1.5 text-blue-400 hover:text-blue-300 transition-colors"
                >
                  <ArrowDownload24Filled className="w-4 h-4" />
                  <span>Download File</span>
                </button>
              </div>
            </div>

            <pre className="text-xs font-mono text-blue-300 overflow-x-auto p-4 bg-slate-950 rounded-2xl border border-slate-800 max-h-48 overflow-y-auto">
              {RAW_SVG_CODE}
            </pre>
          </div>
        </section>
      )}

      {(activeCategory === 'all' || activeCategory === 'colors') && (
        <section className="space-y-4 pt-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-black tracking-tight text-[var(--text-primary)] flex items-center gap-2">
              <Color24Filled className="w-5 h-5 text-pink-500" />
              AirBook Brand Palette & Tokens
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
            {[
              { name: 'Sky Blue (Primary)', hex: '#0284C7', bg: 'bg-[#0284C7]' },
              { name: 'Rose Pink (Beauty)', hex: '#FF8DA1', bg: 'bg-[#FF8DA1]' },
              { name: 'Obsidian (Dark)', hex: '#0F172A', bg: 'bg-[#0F172A]' },
              { name: 'Silver Grey (Neutral)', hex: '#CBD5E1', bg: 'bg-[#CBD5E1]' },
              { name: 'Blueprint Electric', hex: '#1D61F2', bg: 'bg-[#1D61F2]' },
            ].map((col) => (
              <div key={col.hex} className="p-4 rounded-3xl bg-white dark:bg-[#1C202C] border border-slate-200/80 dark:border-white/5 space-y-3">
                <div className={`h-16 w-full rounded-2xl ${col.bg} shadow-md`} />
                <div>
                  <span className="text-xs font-extrabold text-[var(--text-primary)] block">{col.name}</span>
                  <span className="text-[10px] font-mono text-[var(--text-muted)] block">{col.hex}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default BrandDAMModule;
