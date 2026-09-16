'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { useTranslation } from '@/lib/i18n/useTranslation';
import {
  COMPETITORS,
  CompetitorProfile,
  CompetitorTier,
  AIRBOOK_MOAT_PILLARS,
  FULL_FEATURE_MATRIX,
  MATRIX_CATEGORIES,
  MatrixFeatureItem,
  GAP_ANALYSIS_FEATURES,
  FeatureAirBookStatus,
} from './data';
import {
  ShieldCheckmark24Regular,
  Tag24Regular,
  Search24Regular,
  Dismiss24Filled,
  Sparkle24Regular,
  ArrowRight24Filled,
  ChevronRight24Regular,
  Key24Regular,
  Globe24Regular,
  Payment24Regular,
  Star24Filled,
  Warning24Regular,
  CheckmarkCircle24Filled,
  AppsListDetail24Regular,
  DocumentBulletList24Regular,
  PeopleCommunity24Regular,
  Filter24Regular,
  Open24Filled,
  Clock24Regular,
  ArrowSync24Regular,
} from '@fluentui/react-icons';

import {
  SALON_ARCHETYPES,
  calculateCompetitorTco,
  UNIT_ECONOMICS_METRICS,
  MONETIZATION_VECTORS,
  PRICING_SENSITIVITY_ANALYSIS,
  PricingArchetype,
  CompetitorTcoBreakdown,
} from './pricingStudyData';

function CompetitorLogo({
  comp,
  sizeClass = 'w-11 h-11',
  textSize = 'text-base',
  rounded = 'rounded-2xl',
}: {
  comp: { name: string; logoUrl?: string; logoInitial: string; accentColor: string };
  sizeClass?: string;
  textSize?: string;
  rounded?: string;
}) {
  const [hasError, setHasError] = useState(false);

  return (
    <div
      className={`${sizeClass} ${rounded} bg-[var(--bg-secondary)] border border-[var(--border-subtle)] p-1.5 flex items-center justify-center shadow-xs overflow-hidden flex-shrink-0 group-hover:scale-105 transition-transform`}
    >
      {comp.logoUrl && !hasError ? (
        <img
          src={comp.logoUrl}
          alt={`${comp.name} logo`}
          onError={() => setHasError(true)}
          className="w-full h-full object-contain rounded-xl"
        />
      ) : (
        <div
          className={`w-full h-full rounded-xl flex items-center justify-center font-black text-white ${textSize}`}
          style={{ backgroundColor: comp.accentColor }}
        >
          {comp.logoInitial}
        </div>
      )}
    </div>
  );
}

export default function CompetitorsPage() {
  const { t } = useTranslation();

  // Main Page View Tab: 'matrix' | 'pricing'
  const [activeMainTab, setActiveMainTab] = useState<'matrix' | 'pricing'>('matrix');

  // Competitor Card Grid State
  const [selectedTier, setSelectedTier] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeCompetitor, setActiveCompetitor] = useState<CompetitorProfile | null>(null);

  // Matrix State
  const [selectedMatrixCategory, setSelectedMatrixCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [matrixSearchQuery, setMatrixSearchQuery] = useState<string>('');

  // Pricing Study & TCO Simulator State
  const [selectedArchetypeId, setSelectedArchetypeId] = useState<string>('boutique');
  const [simMonthlyGmv, setSimMonthlyGmv] = useState<number>(24000);
  const [simStaffCount, setSimStaffCount] = useState<number>(4);
  const [simMonthlyBookings, setSimMonthlyBookings] = useState<number>(320);
  const [simNewClientRatio, setSimNewClientRatio] = useState<number>(0.18);

  const handleSelectArchetype = (arch: PricingArchetype) => {
    setSelectedArchetypeId(arch.id);
    setSimMonthlyGmv(arch.monthlyGmv);
    setSimStaffCount(arch.staffCount);
    setSimMonthlyBookings(arch.monthlyBookings);
    setSimNewClientRatio(arch.newClientRatio);
  };

  // Compute TCO across all 8 competitors + AirBook in real time
  const competitorTcoOrder = ['airbook', 'fresha', 'mindbody', 'vagaro', 'boulevard', 'square', 'glossgenius', 'booksy', 'mangomint'];
  const tcoResults: CompetitorTcoBreakdown[] = useMemo(() => {
    return competitorTcoOrder.map((id) =>
      calculateCompetitorTco(id, simMonthlyGmv, simStaffCount, simMonthlyBookings, simNewClientRatio)
    );
  }, [simMonthlyGmv, simStaffCount, simMonthlyBookings, simNewClientRatio]);

  const airbookTco = useMemo(() => {
    return tcoResults.find((r) => r.id === 'airbook') || tcoResults[0];
  }, [tcoResults]);

  // Filtered Competitors
  const filteredCompetitors = useMemo(() => {
    return COMPETITORS.filter((comp) => {
      if (selectedTier !== 'all' && comp.tier !== selectedTier) {
        return false;
      }
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase();
        const matchesName = comp.name.toLowerCase().includes(query);
        const matchesTagline = comp.tagline.toLowerCase().includes(query);
        const matchesOverview = comp.overview.toLowerCase().includes(query);
        const matchesPricing = comp.pricingModel.basePrice.toLowerCase().includes(query);
        return matchesName || matchesTagline || matchesOverview || matchesPricing;
      }
      return true;
    });
  }, [selectedTier, searchQuery]);

  // Filtered Matrix Features
  const filteredMatrixFeatures = useMemo(() => {
    return FULL_FEATURE_MATRIX.filter((item) => {
      if (selectedMatrixCategory !== 'all' && item.category !== selectedMatrixCategory) {
        return false;
      }
      if (selectedStatus !== 'all' && item.airbookStatus !== selectedStatus) {
        return false;
      }
      if (matrixSearchQuery.trim() !== '') {
        const q = matrixSearchQuery.toLowerCase();
        return (
          item.name.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q) ||
          item.airbook.toLowerCase().includes(q) ||
          item.airbookAdvantage.toLowerCase().includes(q) ||
          (item.roadmapKey && item.roadmapKey.toLowerCase().includes(q)) ||
          item.fresha.toLowerCase().includes(q) ||
          item.mindbody.toLowerCase().includes(q) ||
          item.vagaro.toLowerCase().includes(q) ||
          item.boulevard.toLowerCase().includes(q) ||
          item.square.toLowerCase().includes(q) ||
          item.glossgenius.toLowerCase().includes(q) ||
          item.booksy.toLowerCase().includes(q) ||
          item.mangomint.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [selectedMatrixCategory, selectedStatus, matrixSearchQuery]);

  const liveCount = useMemo(() => FULL_FEATURE_MATRIX.filter((f) => f.airbookStatus === 'live').length, []);
  const inProgressCount = useMemo(() => FULL_FEATURE_MATRIX.filter((f) => f.airbookStatus === 'in_progress').length, []);
  const missingCount = useMemo(() => FULL_FEATURE_MATRIX.filter((f) => f.airbookStatus === 'missing' || f.airbookStatus === 'planned').length, []);

  const getTierBadge = (tier: CompetitorTier) => {
    switch (tier) {
      case 'Aggregator':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
            Marketplace Aggregator
          </span>
        );
      case 'Enterprise':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
            Enterprise
          </span>
        );
      case 'Solo Mobile':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-pink-500/10 text-pink-600 dark:text-pink-400 border border-pink-500/20">
            Solo Mobile
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
            Mid-Market
          </span>
        );
    }
  };

  const renderAirBookStatusBadge = (item: MatrixFeatureItem) => {
    if (item.airbookStatus === 'live') {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
          <CheckmarkCircle24Filled className="w-3 h-3 text-emerald-500 flex-shrink-0" />
          <span>Live in AirBook</span>
        </span>
      );
    }

    if (item.airbookStatus === 'in_progress') {
      return (
        <Link
          href={`/in/roadmap?issue=${item.roadmapKey || ''}`}
          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-500/10 border border-blue-500/30 text-[10px] font-bold text-blue-600 dark:text-blue-400 hover:bg-blue-500/20 transition-colors"
          title={`View spec in Roadmap: ${item.roadmapTitle || item.roadmapKey}`}
        >
          <span>⚡ In Progress</span>
          {item.roadmapKey && <span className="underline font-mono">({item.roadmapKey}) ↗</span>}
        </Link>
      );
    }

    return (
      <Link
        href={`/in/roadmap?issue=${item.roadmapKey || ''}`}
        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold transition-colors ${
          item.airbookStatus === 'missing'
            ? 'bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 hover:bg-rose-500/20'
            : 'bg-purple-500/10 border border-purple-500/30 text-purple-600 dark:text-purple-400 hover:bg-purple-500/20'
        }`}
        title={`View spec in Roadmap: ${item.roadmapTitle || item.roadmapKey}`}
      >
        <span>{item.airbookStatus === 'missing' ? '🎯 Missing / Planned' : '📌 Planned'}</span>
        {item.roadmapKey && <span className="underline font-mono">({item.roadmapKey}) ↗</span>}
      </Link>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-8">
      {/* Hero Intelligence Header */}
      <div className="p-6 sm:p-10 rounded-3xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] relative overflow-hidden shadow-xs space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-3 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-bold text-blue-600 dark:text-blue-400">
              <AppsListDetail24Regular className="w-3.5 h-3.5" />
              <span>Competitive Intelligence & Financial Pricing Suite</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-[var(--text-primary)]">
              Competitor Landscape & Financial Pricing Study
            </h1>

            <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
              Institutional-grade market teardown and unit economics engine analyzing SaaS monetization vectors, take-rate spreads, total cost of ownership (TCO), and AirBook’s 10x defensible moat across 8 industry competitors.
            </p>
          </div>

          <div className="flex items-center gap-3 flex-shrink-0">
            <Link
              href="/in/100tasks"
              className="btn-secondary h-10 px-4 rounded-2xl text-xs font-bold flex items-center gap-2"
            >
              <DocumentBulletList24Regular className="w-4 h-4 text-blue-500" />
              <span>View 100tasks Tracker</span>
            </Link>
          </div>
        </div>

        {/* AirBook 10x Moat Ribbon */}
        <div className="pt-4 border-t border-[var(--border-subtle)] space-y-3 relative z-10">
          <h3 className="text-xs font-black uppercase tracking-wider text-[var(--text-muted)] flex items-center gap-1.5">
            <Sparkle24Regular className="w-3.5 h-3.5 text-blue-500" />
            <span>AirBook Core Moat Pillars</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {AIRBOOK_MOAT_PILLARS.map((pillar, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] space-y-2.5 flex flex-col justify-between hover:border-blue-500/30 transition-colors"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 text-emerald-500">
                      <CheckmarkCircle24Filled className="w-4 h-4 flex-shrink-0" />
                      <span className="text-[10px] font-mono font-bold uppercase text-emerald-600 dark:text-emerald-400">
                        Moat Pillar #{idx + 1}
                      </span>
                    </div>
                    {pillar.metric && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 whitespace-nowrap flex-shrink-0">
                        {pillar.metric}
                      </span>
                    )}
                  </div>
                  <h4 className="text-xs font-black text-[var(--text-primary)] leading-snug">
                    {pillar.title}
                  </h4>
                </div>
                <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed">
                  {pillar.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Main View Mode Tab Switcher */}
        <div className="pt-4 border-t border-[var(--border-subtle)] flex flex-wrap items-center gap-2.5 relative z-10">
          <button
            onClick={() => setActiveMainTab('matrix')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-black transition-all flex items-center gap-2 ${
              activeMainTab === 'matrix'
                ? 'bg-blue-500 text-white shadow-md'
                : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-subtle)]'
            }`}
          >
            <AppsListDetail24Regular className="w-4 h-4" />
            <span>Competitive Matrix & 35-Feature Teardown</span>
          </button>

          <button
            onClick={() => setActiveMainTab('pricing')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-black transition-all flex items-center gap-2 ${
              activeMainTab === 'pricing'
                ? 'bg-blue-500 text-white shadow-md'
                : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-subtle)]'
            }`}
          >
            <Payment24Regular className="w-4 h-4" />
            <span>Financial Pricing Study & Unit Economics Suite</span>
            <span className={`px-2 py-0.5 rounded-full text-[9px] font-mono font-bold uppercase tracking-wider ${
              activeMainTab === 'pricing' ? 'bg-white/20 text-white' : 'bg-emerald-500/20 text-emerald-500'
            }`}>
              PE/VC MODEL
            </span>
          </button>
        </div>

        {/* Ambient Glow */}
        <div className="absolute right-0 top-0 w-96 h-96 bg-gradient-to-bl from-blue-500/10 via-indigo-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* VIEW 1: COMPETITIVE MATRIX & FEATURE TEARDOWN */}
      {activeMainTab === 'matrix' && (
        <div className="space-y-8">
          {/* Filter & Search Bar */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
              {/* Search Input */}
              <div className="md:col-span-8 relative">
                <Search24Regular className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)] pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search competitors by name, pricing, weakness, or tier..."
                  className="w-full h-10 pl-10 pr-4 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>

              {/* Tier Filter Dropdown */}
              <div className="md:col-span-4">
                <select
                  value={selectedTier}
                  onChange={(e) => setSelectedTier(e.target.value)}
                  className="w-full h-10 px-3.5 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-xs font-bold text-[var(--text-primary)] focus:outline-none focus:border-blue-500 cursor-pointer"
                >
                  <option value="all">All Market Segments ({COMPETITORS.length})</option>
                  <option value="Aggregator">Marketplace Aggregators (Fresha, Booksy)</option>
                  <option value="Enterprise">Enterprise Spas (Mindbody, Boulevard, Mangomint)</option>
                  <option value="Mid-Market">Mid-Market (Vagaro, Square Appointments)</option>
                  <option value="Solo Mobile">Solo Stylists (GlossGenius)</option>
                </select>
              </div>
            </div>

            {/* Quick Tier Switcher Chips */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
              <button
                onClick={() => setSelectedTier('all')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  selectedTier === 'all'
                    ? 'bg-blue-500 text-white shadow-xs'
                    : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-subtle)]'
                }`}
              >
                All Competitors ({COMPETITORS.length})
              </button>
              {['Aggregator', 'Enterprise', 'Mid-Market', 'Solo Mobile'].map((tier) => (
                <button
                  key={tier}
                  onClick={() => setSelectedTier(tier)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                    selectedTier === tier
                      ? 'bg-blue-500 text-white shadow-xs'
                      : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-subtle)]'
                  }`}
                >
                  {tier}
                </button>
              ))}
            </div>
          </div>

          {/* Competitor Profile Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredCompetitors.map((comp) => {
              return (
                <div
                  key={comp.id}
                  onClick={() => setActiveCompetitor(comp)}
                  className="group p-6 rounded-3xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] hover:border-blue-500/40 transition-all duration-150 flex flex-col justify-between space-y-6 shadow-xs relative cursor-pointer overflow-hidden"
                >
                  <div className="space-y-4">
                    {/* Header Badge & Webclip Logo */}
                    <div className="flex items-center justify-between">
                      <CompetitorLogo comp={comp} />
                      {getTierBadge(comp.tier)}
                    </div>

                    {/* Name & Tagline */}
                    <div className="space-y-1">
                      <h3 className="text-lg font-black tracking-tight text-[var(--text-primary)] group-hover:text-blue-500 transition-colors flex items-center gap-1.5">
                        <span>{comp.name}</span>
                      </h3>
                      <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                        {comp.tagline}
                      </p>
                    </div>

                    {/* Pricing Highlight Box */}
                    <div className="p-3.5 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] space-y-1">
                      <span className="text-[10px] font-mono font-bold uppercase text-[var(--text-muted)]">
                        Pricing Model
                      </span>
                      <p className="text-xs font-black text-[var(--text-primary)] leading-snug">
                        {comp.pricingModel.basePrice}
                      </p>
                      <p className="text-[10px] text-rose-500 font-medium leading-relaxed">
                        {comp.pricingModel.hiddenFeesNote}
                      </p>
                    </div>
                  </div>

                  {/* Action Trigger Footer */}
                  <div className="pt-3.5 border-t border-[var(--border-subtle)] flex items-center justify-between text-xs font-bold text-[var(--text-muted)] group-hover:text-[var(--text-primary)] transition-colors">
                    <span>Inspect Teardown</span>
                    <ChevronRight24Regular className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Side-by-Side Comprehensive Feature Matrix */}
          <div className="rounded-3xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] overflow-hidden shadow-xs space-y-6 p-6 sm:p-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-bold text-blue-600 dark:text-blue-400">
                  <Sparkle24Regular className="w-3.5 h-3.5" />
                  <span>Full Industry Benchmark · 35 Core Capabilities</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black tracking-tight text-[var(--text-primary)]">
                  Complete Side-by-Side Capability Comparison Matrix
                </h2>
                <p className="text-xs text-[var(--text-secondary)]">
                  Detailed breakdown of AirBook’s architectural advantages and active roadmap vs. all 8 industry competitors across pricing, booking UX, branding, operations, POS hardware, marketing, and security.
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs font-mono font-bold text-[var(--text-muted)] bg-[var(--bg-secondary)] px-3.5 py-1.5 rounded-2xl border border-[var(--border-subtle)] self-start md:self-center flex-shrink-0">
                <span>Showing {filteredMatrixFeatures.length} of {FULL_FEATURE_MATRIX.length} Features</span>
              </div>
            </div>

            {/* Status Filter Bar & Search */}
            <div className="space-y-3.5 pt-2 border-t border-[var(--border-subtle)]">
              {/* Quick Status Filter Tabs */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => setSelectedStatus('all')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                    selectedStatus === 'all'
                      ? 'bg-blue-500 text-white shadow-xs'
                      : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-subtle)]'
                  }`}
                >
                  <span>All Statuses</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                    selectedStatus === 'all' ? 'bg-white/20 text-white' : 'bg-black/5 dark:bg-white/5 text-[var(--text-muted)]'
                  }`}>
                    {FULL_FEATURE_MATRIX.length}
                  </span>
                </button>

                <button
                  onClick={() => setSelectedStatus('live')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                    selectedStatus === 'live'
                      ? 'bg-emerald-500 text-white shadow-xs'
                      : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-subtle)]'
                  }`}
                >
                  <CheckmarkCircle24Filled className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Live in AirBook</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                    selectedStatus === 'live' ? 'bg-white/20 text-white' : 'bg-black/5 dark:bg-white/5 text-[var(--text-muted)]'
                  }`}>
                    {liveCount}
                  </span>
                </button>

                <button
                  onClick={() => setSelectedStatus('in_progress')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                    selectedStatus === 'in_progress'
                      ? 'bg-blue-500 text-white shadow-xs'
                      : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-subtle)]'
                  }`}
                >
                  <span>⚡ In Progress</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                    selectedStatus === 'in_progress' ? 'bg-white/20 text-white' : 'bg-black/5 dark:bg-white/5 text-[var(--text-muted)]'
                  }`}>
                    {inProgressCount}
                  </span>
                </button>

                <button
                  onClick={() => setSelectedStatus(selectedStatus === 'missing' ? 'all' : 'missing')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                    selectedStatus === 'missing'
                      ? 'bg-rose-500 text-white shadow-xs'
                      : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-subtle)]'
                  }`}
                >
                  <span>🎯 Missing / Roadmapped</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                    selectedStatus === 'missing' ? 'bg-white/20 text-white' : 'bg-black/5 dark:bg-white/5 text-[var(--text-muted)]'
                  }`}>
                    {missingCount}
                  </span>
                </button>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                {/* Category Filter Chips */}
                <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
                  {MATRIX_CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedMatrixCategory(cat.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                        selectedMatrixCategory === cat.id
                          ? 'bg-[var(--text-primary)] text-[var(--bg-primary)] shadow-xs'
                          : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-subtle)]'
                      }`}
                    >
                      <span>{cat.name}</span>
                      <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                        selectedMatrixCategory === cat.id ? 'bg-white/20 dark:bg-black/20' : 'bg-black/5 dark:bg-white/5 text-[var(--text-muted)]'
                      }`}>
                        {cat.id === 'all'
                          ? FULL_FEATURE_MATRIX.length
                          : FULL_FEATURE_MATRIX.filter((f) => f.category === cat.id).length}
                      </span>
                    </button>
                  ))}
                </div>

                {/* Matrix Search Input */}
                <div className="relative sm:w-72 flex-shrink-0">
                  <Search24Regular className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--text-muted)] pointer-events-none" />
                  <input
                    type="text"
                    value={matrixSearchQuery}
                    onChange={(e) => setMatrixSearchQuery(e.target.value)}
                    placeholder="Search capabilities or AIR-XXX..."
                    className="w-full h-9 pl-9 pr-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Feature Matrix Table */}
            <div className="overflow-x-auto no-scrollbar border border-[var(--border-subtle)] rounded-2xl">
              <table className="w-full text-left border-collapse min-w-[1300px]">
                <thead>
                  <tr className="border-b border-[var(--border-subtle)] text-[11px] font-mono font-bold uppercase text-[var(--text-muted)] bg-[var(--bg-secondary)]/50">
                    <th className="py-4 px-4 min-w-[220px]">Feature Dimension</th>
                    <th className="py-4 px-4 bg-blue-500/15 text-blue-600 dark:text-blue-400 font-black min-w-[240px] border-x border-blue-500/20">
                      <div className="flex items-center gap-1.5">
                        <Sparkle24Regular className="w-4 h-4 text-blue-500" />
                        <span>AirBook (Ours)</span>
                      </div>
                    </th>
                    <th className="py-4 px-4 min-w-[150px]">
                      <div className="flex items-center gap-1.5">
                        <img src="/images/competitors/fresha.png" alt="Fresha" className="w-4 h-4 rounded-md object-contain" />
                        <span>Fresha</span>
                      </div>
                    </th>
                    <th className="py-4 px-4 min-w-[150px]">
                      <div className="flex items-center gap-1.5">
                        <img src="/images/competitors/mindbody.png" alt="Mindbody" className="w-4 h-4 rounded-md object-contain" />
                        <span>Mindbody</span>
                      </div>
                    </th>
                    <th className="py-4 px-4 min-w-[150px]">
                      <div className="flex items-center gap-1.5">
                        <img src="/images/competitors/vagaro.svg" alt="Vagaro" className="w-4 h-4 rounded-md object-contain" />
                        <span>Vagaro</span>
                      </div>
                    </th>
                    <th className="py-4 px-4 min-w-[150px]">
                      <div className="flex items-center gap-1.5">
                        <img src="/images/competitors/boulevard.png" alt="Boulevard" className="w-4 h-4 rounded-md object-contain" />
                        <span>Boulevard</span>
                      </div>
                    </th>
                    <th className="py-4 px-4 min-w-[150px]">
                      <div className="flex items-center gap-1.5">
                        <img src="/images/competitors/square.svg" alt="Square" className="w-4 h-4 rounded-md object-contain" />
                        <span>Square</span>
                      </div>
                    </th>
                    <th className="py-4 px-4 min-w-[150px]">
                      <div className="flex items-center gap-1.5">
                        <img src="/images/competitors/glossgenius.jpg" alt="GlossGenius" className="w-4 h-4 rounded-md object-contain" />
                        <span>GlossGenius</span>
                      </div>
                    </th>
                    <th className="py-4 px-4 min-w-[150px]">
                      <div className="flex items-center gap-1.5">
                        <img src="/images/competitors/booksy.png" alt="Booksy" className="w-4 h-4 rounded-md object-contain" />
                        <span>Booksy</span>
                      </div>
                    </th>
                    <th className="py-4 px-4 min-w-[150px]">
                      <div className="flex items-center gap-1.5">
                        <img src="/images/competitors/mangomint.png" alt="Mangomint" className="w-4 h-4 rounded-md object-contain" />
                        <span>Mangomint</span>
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border-subtle)] text-xs">
                  {filteredMatrixFeatures.map((item) => {
                    const getCompClass = (text: string) => {
                      const t = text.toLowerCase();
                      if (
                        t.includes('20%') ||
                        t.includes('50%') ||
                        t.includes('fails') ||
                        t.includes('legacy') ||
                        t.includes('poaching') ||
                        t.includes('locked') ||
                        t.includes('mandatory') ||
                        t.includes('surcharge') ||
                        t.includes('hijack') ||
                        t.includes('$300') ||
                        t.includes('$400+') ||
                        t.includes('us only') ||
                        t.includes('app-install')
                      ) {
                        return 'text-rose-500 font-semibold';
                      }
                      if (
                        t.includes('supported') ||
                        t.includes('included') ||
                        t.includes('0%') ||
                        t.includes('free') ||
                        t.includes('instant') ||
                        t.includes('seamless') ||
                        t.includes('precision')
                      ) {
                        return 'text-emerald-600 dark:text-emerald-400 font-semibold';
                      }
                      return 'text-[var(--text-secondary)]';
                    };

                    return (
                      <tr key={item.id} className="hover:bg-[var(--bg-secondary)]/40 transition-colors">
                        {/* Feature Dimension & Description */}
                        <td className="py-3.5 px-4 space-y-1">
                          <p className="font-black text-[var(--text-primary)]">
                            {item.name}
                          </p>
                          <p className="text-[10px] text-[var(--text-muted)] leading-relaxed">
                            {item.description}
                          </p>
                        </td>

                        {/* AirBook (Ours) with Status Badge & Roadmap link */}
                        <td className="py-3.5 px-4 bg-blue-500/5 border-x border-blue-500/20 space-y-1.5">
                          <div className="flex flex-wrap items-center justify-between gap-1.5">
                            <span className="font-extrabold text-[var(--text-primary)]">
                              {item.airbook}
                            </span>
                            {renderAirBookStatusBadge(item)}
                          </div>
                          <p className="text-[10px] text-[var(--text-secondary)] leading-relaxed">
                            {item.airbookAdvantage}
                          </p>
                        </td>

                        {/* Competitors */}
                        <td className={`py-3.5 px-4 ${getCompClass(item.fresha)}`}>
                          {item.fresha}
                        </td>
                        <td className={`py-3.5 px-4 ${getCompClass(item.mindbody)}`}>
                          {item.mindbody}
                        </td>
                        <td className={`py-3.5 px-4 ${getCompClass(item.vagaro)}`}>
                          {item.vagaro}
                        </td>
                        <td className={`py-3.5 px-4 ${getCompClass(item.boulevard)}`}>
                          {item.boulevard}
                        </td>
                        <td className={`py-3.5 px-4 ${getCompClass(item.square)}`}>
                          {item.square}
                        </td>
                        <td className={`py-3.5 px-4 ${getCompClass(item.glossgenius)}`}>
                          {item.glossgenius}
                        </td>
                        <td className={`py-3.5 px-4 ${getCompClass(item.booksy)}`}>
                          {item.booksy}
                        </td>
                        <td className={`py-3.5 px-4 ${getCompClass(item.mangomint)}`}>
                          {item.mangomint}
                        </td>
                      </tr>
                    );
                  })}

                  {filteredMatrixFeatures.length === 0 && (
                    <tr>
                      <td colSpan={10} className="py-12 text-center text-xs text-[var(--text-muted)]">
                        No capability dimensions match the active filters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Feature Gap Analysis & Roadmap Tracker Section */}
          <div className="p-6 sm:p-8 rounded-3xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] relative overflow-hidden shadow-xs space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-xs font-bold text-amber-600 dark:text-amber-400">
                  <Warning24Regular className="w-3.5 h-3.5" />
                  <span>Feature Gap Analysis & Roadmap Tracker ({GAP_ANALYSIS_FEATURES.length} Identified Gaps)</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black tracking-tight text-[var(--text-primary)]">
                  Competitor Capabilities Linked to AirBook Engineering Roadmap
                </h3>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed max-w-3xl">
                  Mapping every single capability where competitors currently hold market share, our competitive analysis, and direct links to corresponding engineering issues in <code className="text-blue-500 font-mono">airkeyhq/airbook-webapp</code>.
                </p>
              </div>

              <Link
                href="/in/roadmap"
                className="btn-primary h-10 px-4 rounded-2xl text-xs font-bold flex items-center gap-2 flex-shrink-0"
              >
                <span>View All Issues on Linear Roadmap</span>
                <ArrowRight24Filled className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
              {GAP_ANALYSIS_FEATURES.map((gap) => (
                <div
                  key={gap.id}
                  className="p-5 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] hover:border-blue-500/40 transition-all flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[var(--text-muted)] bg-black/5 dark:bg-white/5 px-2 py-0.5 rounded">
                        {gap.category}
                      </span>
                      {renderAirBookStatusBadge(gap)}
                    </div>

                    <div className="space-y-1">
                      <h4 className="text-sm font-black text-[var(--text-primary)] leading-tight">
                        {gap.name}
                      </h4>
                      <p className="text-[11px] text-[var(--text-muted)] leading-relaxed">
                        {gap.description}
                      </p>
                    </div>

                    {gap.gapReason && (
                      <div className="p-3 rounded-xl bg-amber-500/5 border border-amber-500/20 text-[11px] text-amber-700 dark:text-amber-300 leading-relaxed">
                        <strong className="block text-[10px] font-mono uppercase text-amber-600 dark:text-amber-400 mb-0.5">
                          Competitor Baseline & Strategy:
                        </strong>
                        {gap.gapReason}
                      </div>
                    )}
                  </div>

                  <div className="pt-3 border-t border-[var(--border-subtle)] flex items-center justify-between">
                    <div className="space-y-0.5">
                      <span className="text-[10px] font-mono font-bold text-blue-500 block">
                        {gap.roadmapKey}
                      </span>
                      <span className="text-[10px] text-[var(--text-muted)] truncate max-w-[160px] block">
                        {gap.roadmapTitle}
                      </span>
                    </div>

                    <Link
                      href={`/in/roadmap?issue=${gap.roadmapKey || ''}`}
                      className="btn-secondary h-8 px-3 rounded-xl text-[11px] font-bold flex items-center gap-1.5 text-blue-600 dark:text-blue-400 hover:border-blue-500"
                    >
                      <span>Open Spec</span>
                      <Open24Filled className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: FINANCIAL PRICING STUDY & TCO SIMULATOR */}
      {activeMainTab === 'pricing' && (
        <div className="space-y-8">
          {/* Institutional KPI Strip */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-3xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] shadow-xs space-y-1">
              <span className="text-[10px] font-mono uppercase font-bold text-[var(--text-muted)] block">
                Blended Gross Margin
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400">
                  91.2%
                </span>
                <span className="text-[11px] text-[var(--text-muted)] font-mono">
                  (vs 74% SaaS avg)
                </span>
              </div>
              <p className="text-[11px] text-[var(--text-secondary)] leading-tight pt-1">
                Near-zero marginal cost on edge serverless + direct Stripe interchange pass-through.
              </p>
            </div>

            <div className="p-5 rounded-3xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] shadow-xs space-y-1">
              <span className="text-[10px] font-mono uppercase font-bold text-[var(--text-muted)] block">
                Net Payments Spread
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-black text-blue-600 dark:text-blue-400">
                  +45 bps
                </span>
                <span className="text-[11px] text-[var(--text-muted)] font-mono">
                  net take-rate
                </span>
              </div>
              <p className="text-[11px] text-[var(--text-secondary)] leading-tight pt-1">
                2.2% + 15¢ interchange-plus pricing yields recurring cash-flow as salons grow GMV.
              </p>
            </div>

            <div className="p-5 rounded-3xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] shadow-xs space-y-1">
              <span className="text-[10px] font-mono uppercase font-bold text-[var(--text-muted)] block">
                LTV : CAC Capital Ratio
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-black text-purple-600 dark:text-purple-400">
                  35.4x
                </span>
                <span className="text-[11px] text-[var(--text-muted)] font-mono">
                  (vs 3.5x standard)
                </span>
              </div>
              <p className="text-[11px] text-[var(--text-secondary)] leading-tight pt-1">
                Product-led freemium viral loop on booking checkout delivers $165 blended CAC.
              </p>
            </div>

            <div className="p-5 rounded-3xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] shadow-xs space-y-1">
              <span className="text-[10px] font-mono uppercase font-bold text-[var(--text-muted)] block">
                CAC Payback Velocity
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-black text-amber-600 dark:text-amber-400">
                  1.3 mo
                </span>
                <span className="text-[11px] text-[var(--text-muted)] font-mono">
                  (vs 14 mo avg)
                </span>
              </div>
              <p className="text-[11px] text-[var(--text-secondary)] leading-tight pt-1">
                First-month subscription + initial card processing spread repays acquisition instantly.
              </p>
            </div>
          </div>

          {/* Interactive Total Cost of Ownership (TCO) Simulator */}
          <div className="p-6 sm:p-8 rounded-3xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] shadow-xs space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-bold text-blue-600 dark:text-blue-400">
                  <Payment24Regular className="w-3.5 h-3.5" />
                  <span>Real-Time Financial Simulator</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black tracking-tight text-[var(--text-primary)]">
                  Salon Total Cost of Ownership (TCO) & Take-Rate Benchmark
                </h3>
                <p className="text-xs text-[var(--text-secondary)]">
                  Simulate exact dollar costs, payment fees, and hidden aggregator penalty taxes across all 9 platforms for any salon scale.
                </p>
              </div>

              {/* Archetype Quick Selector */}
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar self-start md:self-center">
                {SALON_ARCHETYPES.map((arch) => (
                  <button
                    key={arch.id}
                    onClick={() => handleSelectArchetype(arch)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                      selectedArchetypeId === arch.id
                        ? 'bg-blue-500 text-white shadow-xs'
                        : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-subtle)]'
                    }`}
                  >
                    {arch.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Interactive Simulation Sliders */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-5 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)]">
              {/* Monthly GMV Slider */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-[var(--text-secondary)]">Monthly Salon GMV</span>
                  <span className="font-mono font-black text-blue-500">
                    ${simMonthlyGmv.toLocaleString()}
                  </span>
                </div>
                <input
                  type="range"
                  min="2000"
                  max="200000"
                  step="1000"
                  value={simMonthlyGmv}
                  onChange={(e) => {
                    setSelectedArchetypeId('custom');
                    setSimMonthlyGmv(Number(e.target.value));
                  }}
                  className="w-full accent-blue-500 cursor-pointer"
                />
                <span className="text-[10px] text-[var(--text-muted)] block">
                  Range: $2k – $200k / mo
                </span>
              </div>

              {/* Staff Count Slider */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-[var(--text-secondary)]">Staff Chairs</span>
                  <span className="font-mono font-black text-blue-500">
                    {simStaffCount} {simStaffCount === 1 ? 'Chair' : 'Chairs'}
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="30"
                  step="1"
                  value={simStaffCount}
                  onChange={(e) => {
                    setSelectedArchetypeId('custom');
                    setSimStaffCount(Number(e.target.value));
                  }}
                  className="w-full accent-blue-500 cursor-pointer"
                />
                <span className="text-[10px] text-[var(--text-muted)] block">
                  Range: 1 – 30 Stylists
                </span>
              </div>

              {/* Monthly Bookings Slider */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-[var(--text-secondary)]">Monthly Bookings</span>
                  <span className="font-mono font-black text-blue-500">
                    {simMonthlyBookings} Appts
                  </span>
                </div>
                <input
                  type="range"
                  min="30"
                  max="3000"
                  step="10"
                  value={simMonthlyBookings}
                  onChange={(e) => {
                    setSelectedArchetypeId('custom');
                    setSimMonthlyBookings(Number(e.target.value));
                  }}
                  className="w-full accent-blue-500 cursor-pointer"
                />
                <span className="text-[10px] text-[var(--text-muted)] block">
                  Avg Ticket: ${(simMonthlyGmv / (simMonthlyBookings || 1)).toFixed(1)}
                </span>
              </div>

              {/* % First-Time Clients Discovered Slider */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-[var(--text-secondary)]">% Discovered Clients</span>
                  <span className="font-mono font-black text-rose-500">
                    {Math.round(simNewClientRatio * 100)}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="0.40"
                  step="0.02"
                  value={simNewClientRatio}
                  onChange={(e) => {
                    setSelectedArchetypeId('custom');
                    setSimNewClientRatio(Number(e.target.value));
                  }}
                  className="w-full accent-rose-500 cursor-pointer"
                />
                <span className="text-[10px] text-rose-500 font-medium block">
                  Triggers Fresha (20%) / Booksy (35%) Tax
                </span>
              </div>
            </div>

            {/* TCO Real-Time Matrix Table */}
            <div className="overflow-x-auto no-scrollbar border border-[var(--border-subtle)] rounded-2xl">
              <table className="w-full text-left border-collapse min-w-[1100px]">
                <thead>
                  <tr className="border-b border-[var(--border-subtle)] text-[11px] font-mono font-bold uppercase text-[var(--text-muted)] bg-[var(--bg-secondary)]/50">
                    <th className="py-3.5 px-4">Platform</th>
                    <th className="py-3.5 px-3">Base SaaS</th>
                    <th className="py-3.5 px-3">Staff Fees</th>
                    <th className="py-3.5 px-3">Payment Fees</th>
                    <th className="py-3.5 px-3 text-rose-500">Marketplace Tax</th>
                    <th className="py-3.5 px-3">Add-Ons</th>
                    <th className="py-3.5 px-3 font-black text-[var(--text-primary)]">Total / Mo</th>
                    <th className="py-3.5 px-3 font-black">Effective Take-Rate</th>
                    <th className="py-3.5 px-4 font-black text-emerald-600 dark:text-emerald-400">Annual Savings vs AirBook</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border-subtle)] text-xs">
                  {tcoResults.map((res) => {
                    const isAirBook = res.id === 'airbook';
                    return (
                      <tr
                        key={res.id}
                        className={`transition-colors ${
                          isAirBook
                            ? 'bg-blue-500/10 font-bold'
                            : 'hover:bg-[var(--bg-secondary)]/40'
                        }`}
                      >
                        <td className="py-3.5 px-4 flex items-center gap-2">
                          {res.logoUrl ? (
                            <img src={res.logoUrl} alt={res.name} className="w-5 h-5 rounded object-contain" />
                          ) : (
                            <div className="w-5 h-5 rounded bg-blue-500 text-white font-black text-[10px] flex items-center justify-center">
                              A
                            </div>
                          )}
                          <span className={isAirBook ? 'text-blue-600 dark:text-blue-400 font-black' : 'text-[var(--text-primary)]'}>
                            {res.name}
                          </span>
                        </td>

                        <td className="py-3.5 px-3 font-mono">
                          ${res.baseSaaS.toFixed(0)}
                        </td>

                        <td className="py-3.5 px-3 font-mono text-[var(--text-secondary)]">
                          {res.staffSurcharge > 0 ? `+$${res.staffSurcharge.toFixed(0)}` : '$0'}
                        </td>

                        <td className="py-3.5 px-3 font-mono text-[var(--text-secondary)]">
                          ${res.paymentFees.toFixed(0)}
                        </td>

                        <td className="py-3.5 px-3 font-mono text-rose-500 font-bold">
                          {res.marketplaceFees > 0 ? `+$${res.marketplaceFees.toFixed(0)}` : '$0'}
                        </td>

                        <td className="py-3.5 px-3 font-mono text-[var(--text-secondary)]">
                          {res.mandatoryAddOns > 0 ? `+$${res.mandatoryAddOns.toFixed(0)}` : '$0'}
                        </td>

                        <td className="py-3.5 px-3 font-mono font-black text-[var(--text-primary)]">
                          ${res.totalMonthlyCost.toFixed(0)} / mo
                        </td>

                        <td className="py-3.5 px-3 font-mono font-black">
                          <span className={`px-2 py-0.5 rounded text-[11px] ${
                            res.effectiveTakeRatePct > 3.5
                              ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                              : 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
                          }`}>
                            {res.effectiveTakeRatePct.toFixed(2)}%
                          </span>
                        </td>

                        <td className="py-3.5 px-4 font-mono font-black text-emerald-600 dark:text-emerald-400">
                          {isAirBook ? (
                            <span className="text-blue-500 font-bold">Baseline ($0)</span>
                          ) : res.annualSavingsWithAirBook > 0 ? (
                            <span className="inline-flex items-center gap-1">
                              <span>+${res.annualSavingsWithAirBook.toLocaleString('en-US', { maximumFractionDigits: 0 })} / yr</span>
                            </span>
                          ) : (
                            <span className="text-[var(--text-muted)]">$0</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Financial Analysis Callout Box */}
            <div className="p-4 rounded-2xl bg-blue-500/5 border border-blue-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
              <div className="space-y-1 max-w-3xl">
                <span className="text-[10px] font-mono font-bold uppercase text-blue-600 dark:text-blue-400">
                  Financial Analyst TCO Takeaway
                </span>
                <p className="text-[var(--text-primary)] leading-relaxed">
                  On a standard boutique salon doing <strong>${simMonthlyGmv.toLocaleString()} monthly GMV</strong> with {simStaffCount} stylists, Fresha extracts <strong>${tcoResults.find(r => r.id === 'fresha')?.totalMonthlyCost.toFixed(0)}/mo</strong> (due to their 20% discovery tax) and Mindbody costs <strong>${tcoResults.find(r => r.id === 'mindbody')?.totalMonthlyCost.toFixed(0)}/mo</strong>. AirBook delivers the identical full feature set for only <strong>${airbookTco.totalMonthlyCost.toFixed(0)}/mo</strong>, saving the salon up to <strong>${Math.max(...tcoResults.map(r => r.annualSavingsWithAirBook)).toLocaleString('en-US', { maximumFractionDigits: 0 })} annually</strong>.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-[var(--bg-primary)] border border-emerald-500/30 text-center flex-shrink-0">
                <span className="text-[10px] font-mono uppercase text-[var(--text-muted)] block">
                  AirBook Effective Take-Rate
                </span>
                <span className="text-xl font-black text-emerald-500 font-mono">
                  {airbookTco.effectiveTakeRatePct.toFixed(2)}%
                </span>
              </div>
            </div>
          </div>

          {/* Unit Economics Waterfall & Cost-to-Serve */}
          <div className="p-6 sm:p-8 rounded-3xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] shadow-xs space-y-6">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                <CheckmarkCircle24Filled className="w-3.5 h-3.5" />
                <span>Institutional Unit Economics Model</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black tracking-tight text-[var(--text-primary)]">
                AirBook Unit Economics & Cost-to-Serve Architecture
              </h3>
              <p className="text-xs text-[var(--text-secondary)]">
                Direct variable cost breakdown per active salon, contribution margins, and benchmarking against vertical SaaS standards.
              </p>
            </div>

            {/* Direct Variable COGS Waterfall */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3.5">
              <div className="p-4 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] space-y-1">
                <span className="text-[10px] font-mono uppercase text-[var(--text-muted)] font-bold">
                  Twilio Programmable SMS
                </span>
                <span className="text-base font-black text-[var(--text-primary)] block font-mono">
                  $0.95 / mo
                </span>
                <p className="text-[10px] text-[var(--text-secondary)]">
                  ~120 reminder & waitlist SMS segments at $0.0079 pass-through.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] space-y-1">
                <span className="text-[10px] font-mono uppercase text-[var(--text-muted)] font-bold">
                  Edge Bandwidth & CNAME SSL
                </span>
                <span className="text-base font-black text-[var(--text-primary)] block font-mono">
                  $0.08 / mo
                </span>
                <p className="text-[10px] text-[var(--text-secondary)]">
                  Edge routing and automated wildcard SSL verification per custom domain.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] space-y-1">
                <span className="text-[10px] font-mono uppercase text-[var(--text-muted)] font-bold">
                  Database & Cloud DAM Storage
                </span>
                <span className="text-base font-black text-[var(--text-primary)] block font-mono">
                  $0.22 / mo
                </span>
                <p className="text-[10px] text-[var(--text-secondary)]">
                  Neon PostgreSQL multi-tenant queries & S3 brand lookbook media.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 space-y-1">
                <span className="text-[10px] font-mono uppercase text-emerald-600 dark:text-emerald-400 font-bold">
                  Total Technical COGS
                </span>
                <span className="text-base font-black text-emerald-600 dark:text-emerald-400 block font-mono">
                  $1.25 / mo
                </span>
                <p className="text-[10px] text-[var(--text-secondary)]">
                  Against $131.50+ monthly revenue = <strong>91.2% Gross Margin</strong>.
                </p>
              </div>
            </div>

            {/* PE / VC Institutional Benchmarks Table */}
            <div className="overflow-x-auto no-scrollbar border border-[var(--border-subtle)] rounded-2xl">
              <table className="w-full text-left border-collapse min-w-[700px]">
                <thead>
                  <tr className="border-b border-[var(--border-subtle)] text-[11px] font-mono font-bold uppercase text-[var(--text-muted)] bg-[var(--bg-secondary)]/50">
                    <th className="py-3 px-4">Financial Metric</th>
                    <th className="py-3 px-4 bg-blue-500/10 text-blue-600 dark:text-blue-400 font-black">AirBook Model</th>
                    <th className="py-3 px-4">Industry Benchmark</th>
                    <th className="py-3 px-4">Financial & Strategic Rationale</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border-subtle)] text-xs">
                  {UNIT_ECONOMICS_METRICS.map((ue, idx) => (
                    <tr key={idx} className="hover:bg-[var(--bg-secondary)]/40 transition-colors">
                      <td className="py-3 px-4 font-bold text-[var(--text-primary)]">
                        {ue.metric}
                      </td>
                      <td className="py-3 px-4 font-mono font-black text-emerald-600 dark:text-emerald-400 bg-blue-500/5">
                        {ue.airbookValue}
                      </td>
                      <td className="py-3 px-4 font-mono text-[var(--text-muted)]">
                        {ue.industryBenchmark}
                      </td>
                      <td className="py-3 px-4 text-[11px] text-[var(--text-secondary)] leading-relaxed">
                        {ue.financialRationale}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Monetization Architecture & Van Westendorp Price Defense */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 4 Monetization Vectors */}
            <div className="p-6 rounded-3xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] shadow-xs space-y-4">
              <div className="space-y-1">
                <span className="text-[10px] font-mono uppercase font-bold text-blue-500">
                  Revenue Architecture
                </span>
                <h4 className="text-lg font-black text-[var(--text-primary)]">
                  The 4 AirBook Monetization Vectors
                </h4>
              </div>

              <div className="space-y-3">
                {MONETIZATION_VECTORS.map((vec) => (
                  <div
                    key={vec.id}
                    className="p-3.5 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <h5 className="text-xs font-black text-[var(--text-primary)]">
                        {vec.name}
                      </h5>
                      <span className="text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                        {vec.marginProfile}
                      </span>
                    </div>
                    <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed">
                      {vec.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Van Westendorp Price Sensitivity Defense */}
            <div className="p-6 rounded-3xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] shadow-xs space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="space-y-1">
                  <span className="text-[10px] font-mono uppercase font-bold text-purple-500">
                    Scientific Price Formulation
                  </span>
                  <h4 className="text-lg font-black text-[var(--text-primary)]">
                    Van Westendorp Price Sensitivity Defense
                  </h4>
                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                    Why AirBook is priced at <strong>$0 / $29 / $79 / $199</strong> rather than arbitrary figures:
                  </p>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="p-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] flex items-start gap-2">
                    <span className="text-rose-500 font-bold">•</span>
                    <div>
                      <strong className="text-[var(--text-primary)] block text-[11px]">Too Cheap Floor (&lt;$15/mo):</strong>
                      <span className="text-[11px] text-[var(--text-secondary)]">{PRICING_SENSITIVITY_ANALYSIS.tooCheapThreshold}</span>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] flex items-start gap-2">
                    <span className="text-blue-500 font-bold">•</span>
                    <div>
                      <strong className="text-[var(--text-primary)] block text-[11px]">Optimal Solo Sweet Spot ($29/mo):</strong>
                      <span className="text-[11px] text-[var(--text-secondary)]">{PRICING_SENSITIVITY_ANALYSIS.optimalPoint}</span>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] flex items-start gap-2">
                    <span className="text-emerald-500 font-bold">•</span>
                    <div>
                      <strong className="text-[var(--text-primary)] block text-[11px]">Team Expansion Point ($79/mo):</strong>
                      <span className="text-[11px] text-[var(--text-secondary)]">{PRICING_SENSITIVITY_ANALYSIS.teamPoint}</span>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] flex items-start gap-2">
                    <span className="text-purple-500 font-bold">•</span>
                    <div>
                      <strong className="text-[var(--text-primary)] block text-[11px]">Enterprise Ceiling ($199/mo):</strong>
                      <span className="text-[11px] text-[var(--text-secondary)]">{PRICING_SENSITIVITY_ANALYSIS.enterpriseFloor}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 text-[11px] text-purple-700 dark:text-purple-300">
                {PRICING_SENSITIVITY_ANALYSIS.conclusion}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Competitor Teardown Detail Slide-Over Drawer */}
      <AnimatePresence>
        {activeCompetitor && (
          <div className="fixed inset-0 z-[250] flex items-end md:items-center justify-center">
            {/* Backdrop Blur */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveCompetitor(null)}
              className="fixed inset-0 bg-black/60 backdrop-blur-md"
            />

            {/* Modal Container */}
            <motion.div
              initial={{ y: '100%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '100%', opacity: 0 }}
              transition={{ type: 'spring', damping: 26, stiffness: 260 }}
              className="relative z-10 w-full md:max-w-2xl bg-[var(--bg-primary)] border-t md:border border-[var(--border-subtle)] rounded-t-[32px] md:rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              {/* Mobile Pull Bar */}
              <div className="w-12 h-1.5 rounded-full bg-black/20 dark:bg-white/20 mx-auto mt-3 md:hidden" />

              {/* Drawer Header */}
              <div className="p-5 sm:p-6 border-b border-[var(--border-subtle)] flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <CompetitorLogo
                    comp={activeCompetitor}
                    sizeClass="w-13 h-13"
                    textSize="text-xl"
                  />
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl font-black text-[var(--text-primary)]">
                        {activeCompetitor.name}
                      </h3>
                      {getTierBadge(activeCompetitor.tier)}
                    </div>
                    <p className="text-xs text-[var(--text-secondary)]">
                      {activeCompetitor.tagline}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setActiveCompetitor(null)}
                  className="btn-tertiary w-9 h-9 rounded-2xl flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-primary)] flex-shrink-0"
                >
                  <Dismiss24Filled className="w-4 h-4" />
                </button>
              </div>

              {/* Drawer Scrollable Body */}
              <div className="p-5 sm:p-6 space-y-6 overflow-y-auto no-scrollbar flex-1">
                {/* Overview */}
                <div className="p-4 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] space-y-1.5">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[var(--text-muted)]">
                    Market Overview & Strategy
                  </span>
                  <p className="text-xs text-[var(--text-primary)] leading-relaxed">
                    {activeCompetitor.overview}
                  </p>
                </div>

                {/* Pricing Breakdown Card */}
                <div className="p-4 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] space-y-3">
                  <h4 className="text-xs font-black uppercase tracking-wider text-[var(--text-muted)] flex items-center gap-1.5">
                    <Payment24Regular className="w-3.5 h-3.5" />
                    <span>Pricing & Contract Terms</span>
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="p-3 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-subtle)]">
                      <span className="text-[10px] font-mono text-[var(--text-muted)] block">
                        Base Monthly SaaS
                      </span>
                      <span className="font-black text-[var(--text-primary)]">
                        {activeCompetitor.pricingModel.basePrice}
                      </span>
                    </div>
                    <div className="p-3 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-subtle)]">
                      <span className="text-[10px] font-mono text-[var(--text-muted)] block">
                        Card Processing
                      </span>
                      <span className="font-black text-[var(--text-primary)]">
                        {activeCompetitor.pricingModel.processingRate}
                      </span>
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-600 dark:text-rose-400 font-medium">
                    <strong className="block text-[10px] uppercase font-mono mb-0.5">
                      Hidden Fees & Lock-In
                    </strong>
                    {activeCompetitor.pricingModel.hiddenFeesNote}
                  </div>
                </div>

                {/* Dark Patterns & Anti-Pattern Forensics */}
                {activeCompetitor.darkPatterns.length > 0 && (
                  <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/20 space-y-2">
                    <h4 className="text-xs font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                      <Warning24Regular className="w-3.5 h-3.5" />
                      <span>Dark Pattern & Lock-In Forensics</span>
                    </h4>
                    <ul className="space-y-1.5 text-xs text-[var(--text-secondary)]">
                      {activeCompetitor.darkPatterns.map((dp, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-amber-500 font-bold">•</span>
                          <span>{dp}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* AirBook 10x Moat Advantage */}
                <div className="p-4 rounded-2xl bg-blue-500/5 border border-blue-500/20 space-y-2">
                  <h4 className="text-xs font-black text-blue-600 dark:text-blue-400 flex items-center gap-1.5">
                    <Sparkle24Regular className="w-3.5 h-3.5" />
                    <span>How AirBook Wins (10x Advantage)</span>
                  </h4>
                  <p className="text-xs text-[var(--text-primary)] font-medium leading-relaxed">
                    {activeCompetitor.airbookMoatAdvantage}
                  </p>
                </div>

                {/* Strengths & Weaknesses Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h5 className="text-xs font-black text-emerald-500 uppercase tracking-wider">
                      Competitor Strengths
                    </h5>
                    <ul className="space-y-1 text-xs text-[var(--text-secondary)]">
                      {activeCompetitor.strengths.map((str, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <CheckmarkCircle24Filled className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0 mt-0.5" />
                          <span>{str}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-2">
                    <h5 className="text-xs font-black text-rose-500 uppercase tracking-wider">
                      Competitor Weaknesses
                    </h5>
                    <ul className="space-y-1 text-xs text-[var(--text-secondary)]">
                      {activeCompetitor.weaknesses.map((wk, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <Dismiss24Filled className="w-3.5 h-3.5 text-rose-500 flex-shrink-0 mt-0.5" />
                          <span>{wk}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Drawer Bottom Bar */}
              <div className="w-full border-t border-[var(--border-subtle)] bg-[var(--bg-primary)] p-4 sm:p-5 flex items-center justify-between">
                <Link
                  href="/in/100tasks"
                  className="btn-primary h-10 px-5 rounded-2xl text-xs font-bold flex items-center gap-2"
                >
                  <span>Review Task #4 in 100tasks</span>
                  <ArrowRight24Filled className="w-4 h-4" />
                </Link>
                <button
                  onClick={() => setActiveCompetitor(null)}
                  className="btn-secondary h-10 px-4 rounded-2xl text-xs font-bold"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
