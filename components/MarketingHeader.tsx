'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Logo } from '@/components/Logo';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { LanguageSelector } from '@/components/LanguageSelector';
import {
  Sparkle24Filled,
  Sparkle24Regular,
  ChevronDown24Filled,
  Calendar24Filled,
  Calendar24Regular,
  BookContacts24Regular,
  Payment24Regular,
  PlugConnected24Regular,
  Alert24Regular,
  Shield24Regular,
  PeopleCommunity24Regular,
  ChatHelp24Regular,
  ShieldCheckmark24Regular,
  Person24Regular,
  Heart24Regular,
  Star24Regular,
  Clock24Regular,
  CheckmarkCircle24Regular,
  Navigation24Filled,
  Dismiss24Filled,
  Tag24Regular,
  ArrowRight24Filled,
} from '@fluentui/react-icons';

export const MarketingHeader: React.FC = () => {
  const { t, language, setLanguage, availableLanguages } = useTranslation();

  const [activeNavDropdown, setActiveNavDropdown] = useState<'product' | 'solutions' | 'resources' | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.marketing-header-container')) {
        setActiveNavDropdown(null);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const currentLangObj = availableLanguages.find((l) => l.id === language) || availableLanguages[0];

  return (
    <>
      <header className="sticky top-0 z-50 w-full backdrop-blur-2xl bg-[var(--bg-primary)]/90 border-b border-[var(--border-subtle)] transition-all marketing-header-container">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between gap-4">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2 group flex-shrink-0">
            <Logo size={32} showText animated />
          </Link>

          {/* Center Interactive Dropdown Navigation */}
          <nav className="hidden lg:flex items-center gap-2 text-xs font-bold text-[var(--text-secondary)] relative">
            {/* 1. PRODUCT DROPDOWN TRIGGER */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setActiveNavDropdown(activeNavDropdown === 'product' ? null : 'product');
                }}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-2xl transition-all cursor-pointer ${
                  activeNavDropdown === 'product'
                    ? 'bg-[var(--bg-secondary)] text-[var(--text-primary)] font-extrabold'
                    : 'hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]/60'
                }`}
              >
                <span>{t('productNav')}</span>
                <ChevronDown24Filled
                  className={`w-3 h-3 text-[var(--text-muted)] transition-transform duration-200 ${
                    activeNavDropdown === 'product' ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {/* Product Popover Dropdown Card */}
              <AnimatePresence>
                {activeNavDropdown === 'product' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.96 }}
                    transition={{ duration: 0.15, ease: 'easeOut' }}
                    className="absolute top-full left-0 mt-3 w-[560px] p-5 rounded-3xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] shadow-2xl z-50 overflow-hidden"
                  >
                    <div className="grid grid-cols-12 gap-5 text-left">
                      {/* Left Column: Products with Squircle Badges */}
                      <div className="col-span-7 space-y-1">
                        <p className="text-[10px] font-black uppercase tracking-wider text-[var(--text-muted)] px-3 mb-2">
                          {t('navProductsHeader')}
                        </p>

                        {/* Online Booking */}
                        <Link
                          href="/product/scheduling"
                          onClick={() => setActiveNavDropdown(null)}
                          className="flex items-start gap-3 p-2.5 rounded-2xl hover:bg-[var(--bg-secondary)] transition-colors group"
                        >
                          <div className="w-10 h-10 rounded-2xl bg-sky-500/15 text-[#0284C7] flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                            <Calendar24Regular className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="text-xs font-extrabold text-[var(--text-primary)]">
                              {t('navOnlineBookingTitle')}
                            </p>
                            <p className="text-[11px] text-[var(--text-secondary)] font-medium leading-snug">
                              {t('navOnlineBookingDesc')}
                            </p>
                          </div>
                        </Link>

                        {/* Team Schedules */}
                        <Link
                          href="/product/team-schedules"
                          onClick={() => setActiveNavDropdown(null)}
                          className="flex items-start gap-3 p-2.5 rounded-2xl hover:bg-[var(--bg-secondary)] transition-colors group"
                        >
                          <div className="w-10 h-10 rounded-2xl bg-purple-500/15 text-[#9333EA] flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                            <PeopleCommunity24Regular className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="text-xs font-extrabold text-[var(--text-primary)]">
                              {t('navTeamSchedulesTitle')}
                            </p>
                            <p className="text-[11px] text-[var(--text-secondary)] font-medium leading-snug">
                              {t('navTeamSchedulesDesc')}
                            </p>
                          </div>
                        </Link>

                        {/* Client Notes */}
                        <Link
                          href="/product/client-notes"
                          onClick={() => setActiveNavDropdown(null)}
                          className="flex items-start gap-3 p-2.5 rounded-2xl hover:bg-[var(--bg-secondary)] transition-colors group"
                        >
                          <div className="w-10 h-10 rounded-2xl bg-rose-500/15 text-[#E11D48] flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                            <Tag24Regular className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="text-xs font-extrabold text-[var(--text-primary)]">
                              {t('navClientNotesTitle')}
                            </p>
                            <p className="text-[11px] text-[var(--text-secondary)] font-medium leading-snug">
                              {t('navClientNotesDesc')}
                            </p>
                          </div>
                        </Link>

                        {/* Tap to Pay */}
                        <Link
                          href="/product/payments"
                          onClick={() => setActiveNavDropdown(null)}
                          className="flex items-start gap-3 p-2.5 rounded-2xl hover:bg-[var(--bg-secondary)] transition-colors group"
                        >
                          <div className="w-10 h-10 rounded-2xl bg-emerald-500/15 text-emerald-600 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                            <Payment24Regular className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="text-xs font-extrabold text-[var(--text-primary)]">
                              {t('navTapToPayTitle')}
                            </p>
                            <p className="text-[11px] text-[var(--text-secondary)] font-medium leading-snug">
                              {t('navTapToPayDesc')}
                            </p>
                          </div>
                        </Link>
                      </div>

                      {/* Right Column: Platform & Integrations */}
                      <div className="col-span-5 pl-5 border-l border-[var(--border-subtle)] space-y-1">
                        <p className="text-[10px] font-black uppercase tracking-wider text-[var(--text-muted)] px-3 mb-2">
                          {t('navPlatformHeader')}
                        </p>
                        <Link
                          href="/platform/integrations"
                          onClick={() => setActiveNavDropdown(null)}
                          className="block px-3 py-2 rounded-xl text-xs font-bold text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] transition-colors"
                        >
                          {t('navIntegrations')}
                        </Link>
                        <Link
                          href="/platform/reminders"
                          onClick={() => setActiveNavDropdown(null)}
                          className="block px-3 py-2 rounded-xl text-xs font-bold text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] transition-colors"
                        >
                          {t('navSmsReminders')}
                        </Link>
                        <Link
                          href="/platform/deposit-protection"
                          onClick={() => setActiveNavDropdown(null)}
                          className="block px-3 py-2 rounded-xl text-xs font-bold text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] transition-colors"
                        >
                          {t('navDepositSecurity')}
                        </Link>
                        <Link
                          href="/changelog"
                          onClick={() => setActiveNavDropdown(null)}
                          className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] transition-colors"
                        >
                          <span>{t('navChangelog')}</span>
                          <span className="px-1.5 py-0.5 rounded-full bg-[#2BB5FF]/15 text-[#0284C7] text-[10px] font-black">
                            v2.0
                          </span>
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* 2. SOLUTIONS DROPDOWN TRIGGER */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setActiveNavDropdown(
                    activeNavDropdown === 'solutions' ? null : 'solutions'
                  );
                }}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-2xl transition-all cursor-pointer ${
                  activeNavDropdown === 'solutions'
                    ? 'bg-[var(--bg-secondary)] text-[var(--text-primary)] font-extrabold'
                    : 'hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]/60'
                }`}
              >
                <span>{t('solutionsNav')}</span>
                <ChevronDown24Filled
                  className={`w-3 h-3 text-[var(--text-muted)] transition-transform duration-200 ${
                    activeNavDropdown === 'solutions' ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {/* Solutions Popover Dropdown Card */}
              <AnimatePresence>
                {activeNavDropdown === 'solutions' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.96 }}
                    transition={{ duration: 0.15, ease: 'easeOut' }}
                    className="absolute top-full left-0 mt-3 w-[500px] p-5 rounded-3xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] shadow-2xl z-50 overflow-hidden text-left"
                  >
                    <p className="text-[10px] font-black uppercase tracking-wider text-[var(--text-muted)] px-3 mb-2">
                      {t('solutionsTitle')}
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { slug: 'salons', label: t('tabHair'), icon: Sparkle24Regular, color: '#E11D48', bg: 'bg-rose-500/15' },
                        { slug: 'barbers', label: t('tabBarber'), icon: Person24Regular, color: '#D97706', bg: 'bg-amber-500/15' },
                        { slug: 'spas', label: t('tabMedspa'), icon: ShieldCheckmark24Regular, color: '#9333EA', bg: 'bg-purple-500/15' },
                        { slug: 'nails', label: t('tabNails'), icon: Tag24Regular, color: '#DB2777', bg: 'bg-pink-500/15' },
                        { slug: 'tattoo', label: t('tabTattoo'), icon: Star24Regular, color: '#475569', bg: 'bg-slate-500/15' },
                        { slug: 'massage', label: t('tabMassage'), icon: Heart24Regular, color: '#059669', bg: 'bg-emerald-500/15' },
                        { slug: 'pet-groomers', label: t('tabPetGrooming'), icon: Clock24Regular, color: '#0284C7', bg: 'bg-sky-500/15' },
                        { slug: 'trainers', label: t('tabFitness'), icon: CheckmarkCircle24Regular, color: '#4F46E5', bg: 'bg-indigo-500/15' },
                      ].map((item) => {
                        const Icon = item.icon;
                        return (
                          <Link
                            key={item.slug}
                            href={`/for/${item.slug}`}
                            onClick={() => setActiveNavDropdown(null)}
                            className="flex items-center gap-2.5 p-2.5 rounded-2xl hover:bg-[var(--bg-secondary)] transition-all group"
                          >
                            <div className={`w-8 h-8 rounded-xl ${item.bg} flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform`} style={{ color: item.color }}>
                              <Icon className="w-4 h-4" />
                            </div>
                            <span className="text-xs font-extrabold text-[var(--text-primary)] group-hover:text-[#2BB5FF] transition-colors leading-snug">
                              {item.label}
                            </span>
                          </Link>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* 3. RESOURCES DROPDOWN TRIGGER */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setActiveNavDropdown(
                    activeNavDropdown === 'resources' ? null : 'resources'
                  );
                }}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-2xl transition-all cursor-pointer ${
                  activeNavDropdown === 'resources'
                    ? 'bg-[var(--bg-secondary)] text-[var(--text-primary)] font-extrabold'
                    : 'hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]/60'
                }`}
              >
                <span>{t('resourcesNav')}</span>
                <ChevronDown24Filled
                  className={`w-3 h-3 text-[var(--text-muted)] transition-transform duration-200 ${
                    activeNavDropdown === 'resources' ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {/* Resources Popover Dropdown Card */}
              <AnimatePresence>
                {activeNavDropdown === 'resources' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.96 }}
                    transition={{ duration: 0.15, ease: 'easeOut' }}
                    className="absolute top-full left-0 mt-3 w-[460px] p-5 rounded-3xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] shadow-2xl z-50 overflow-hidden text-left"
                  >
                    <p className="text-[10px] font-black uppercase tracking-wider text-[var(--text-muted)] px-3 mb-2">
                      {t('navResourcesHeader')}
                    </p>

                    <div className="space-y-1.5">
                      {/* Help Center */}
                      <Link
                        href="/help"
                        onClick={() => setActiveNavDropdown(null)}
                        className="flex items-start gap-3 p-3 rounded-2xl hover:bg-[var(--bg-secondary)] transition-colors group"
                      >
                        <div className="w-10 h-10 rounded-2xl bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                          <ChatHelp24Regular className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-xs font-extrabold text-[var(--text-primary)]">
                            {t('navHelpCenterTitle')}
                          </p>
                          <p className="text-[11px] text-[var(--text-secondary)] font-medium leading-snug">
                            {t('navHelpCenterDesc')}
                          </p>
                        </div>
                      </Link>

                      {/* Changelog */}
                      <Link
                        href="/changelog"
                        onClick={() => setActiveNavDropdown(null)}
                        className="flex items-start gap-3 p-3 rounded-2xl hover:bg-[var(--bg-secondary)] transition-colors group"
                      >
                        <div className="w-10 h-10 rounded-2xl bg-[#2BB5FF]/15 text-[#0284C7] dark:text-[#2BB5FF] flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                          <Sparkle24Regular className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <p className="text-xs font-extrabold text-[var(--text-primary)]">
                              {t('navChangelog')}
                            </p>
                            <span className="px-1.5 py-0.5 rounded-full bg-[#2BB5FF]/15 text-[#0284C7] dark:text-[#2BB5FF] text-[9px] font-black uppercase">
                              v2.0
                            </span>
                          </div>
                          <p className="text-[11px] text-[var(--text-secondary)] font-medium leading-snug">
                            Product updates, roadmap, and release notes.
                          </p>
                        </div>
                      </Link>

                      {/* Data Protection */}
                      <Link
                        href="/data-protection"
                        onClick={() => setActiveNavDropdown(null)}
                        className="flex items-start gap-3 p-3 rounded-2xl hover:bg-[var(--bg-secondary)] transition-colors group"
                      >
                        <div className="w-10 h-10 rounded-2xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                          <ShieldCheckmark24Regular className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-xs font-extrabold text-[var(--text-primary)]">
                            Data Protection &amp; Security
                          </p>
                          <p className="text-[11px] text-[var(--text-secondary)] font-medium leading-snug">
                            SOC2, Passkey architecture, and GDPR commitments.
                          </p>
                        </div>
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* 4. PRICING LINK */}
            <Link
              href="/#pricing"
              className="px-3.5 py-2 rounded-2xl hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]/60 transition-all"
            >
              {t('pricingNav')}
            </Link>
          </nav>

          {/* Right Controls: Flag Language Switcher + Fast Action CTAs */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Reusable Circular Vector Flag Language Selector Component */}
            <LanguageSelector direction="down" format="code" size="md" />

            <Link
              href="/login"
              className="hidden sm:inline-flex px-4 py-2.5 rounded-2xl text-xs font-bold text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] transition-colors"
            >
              {t('signIn')}
            </Link>

            <Link
              href="/onboarding"
              className="btn-primary flex items-center gap-1.5"
            >
              <span>{t('startFreeTrialBtn')}</span>
              <ArrowRight24Filled className="w-3.5 h-3.5" />
            </Link>

            {/* Mobile Hamburger Drawer Trigger */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden h-10 w-10 flex items-center justify-center rounded-2xl bg-[var(--bg-secondary)] hover:bg-[var(--border-subtle)] border border-[var(--border-subtle)] text-[var(--text-primary)] cursor-pointer"
              aria-label="Open Navigation Menu"
            >
              <Navigation24Filled className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* ─── MOBILE BOTTOM SHEET NAVIGATION DRAWER ─── */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-[250] flex flex-col justify-end lg:hidden">
            {/* Backdrop Blur Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            />

            {/* Bottom Sheet Drawer Panel */}
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className="relative w-full max-h-[88vh] overflow-y-auto bg-[var(--bg-primary)] rounded-t-[32px] border-t border-[var(--border-subtle)] shadow-2xl p-6 space-y-6 z-10"
            >
              {/* Top Drag Handle */}
              <div className="w-12 h-1.5 rounded-full bg-black/20 dark:bg-white/20 mx-auto" />

              {/* Header Title + Close */}
              <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)]">
                <Logo size={24} showText />
                <button
                  type="button"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 rounded-full hover:bg-[var(--bg-secondary)] text-[var(--text-muted)] cursor-pointer"
                >
                  <Dismiss24Filled className="w-5 h-5" />
                </button>
              </div>

              {/* Core Products Section */}
              <div className="space-y-3">
                <p className="text-[10px] font-black uppercase tracking-wider text-[var(--text-muted)]">
                  {t('navProductsHeader')}
                </p>
                <div className="grid grid-cols-1 gap-2">
                  <Link
                    href="/product/scheduling"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-3 p-3 rounded-2xl bg-[var(--bg-secondary)]"
                  >
                    <div className="w-9 h-9 rounded-xl bg-sky-500/15 text-[#0284C7] flex items-center justify-center flex-shrink-0">
                      <Calendar24Regular className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-black text-[var(--text-primary)]">{t('navOnlineBookingTitle')}</p>
                      <p className="text-[11px] text-[var(--text-secondary)]">{t('navOnlineBookingDesc')}</p>
                    </div>
                  </Link>

                  <Link
                    href="/product/team-schedules"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-3 p-3 rounded-2xl bg-[var(--bg-secondary)]"
                  >
                    <div className="w-9 h-9 rounded-xl bg-purple-500/15 text-[#9333EA] flex items-center justify-center flex-shrink-0">
                      <PeopleCommunity24Regular className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-black text-[var(--text-primary)]">{t('navTeamSchedulesTitle')}</p>
                      <p className="text-[11px] text-[var(--text-secondary)]">{t('navTeamSchedulesDesc')}</p>
                    </div>
                  </Link>

                  <Link
                    href="/product/client-notes"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-3 p-3 rounded-2xl bg-[var(--bg-secondary)]"
                  >
                    <div className="w-9 h-9 rounded-xl bg-rose-500/15 text-[#E11D48] flex items-center justify-center flex-shrink-0">
                      <Tag24Regular className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-black text-[var(--text-primary)]">{t('navClientNotesTitle')}</p>
                      <p className="text-[11px] text-[var(--text-secondary)]">{t('navClientNotesDesc')}</p>
                    </div>
                  </Link>

                  <Link
                    href="/product/payments"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-3 p-3 rounded-2xl bg-[var(--bg-secondary)]"
                  >
                    <div className="w-9 h-9 rounded-xl bg-emerald-500/15 text-emerald-600 flex items-center justify-center flex-shrink-0">
                      <Payment24Regular className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-black text-[var(--text-primary)]">{t('navTapToPayTitle')}</p>
                      <p className="text-[11px] text-[var(--text-secondary)]">{t('navTapToPayDesc')}</p>
                    </div>
                  </Link>
                </div>
              </div>

              {/* Platform & Changelog Links */}
              <div className="space-y-3">
                <p className="text-[10px] font-black uppercase tracking-wider text-[var(--text-muted)]">
                  {t('navPlatformHeader')}
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    href="/platform/integrations"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-3 rounded-2xl bg-[var(--bg-secondary)] text-xs font-bold text-[var(--text-primary)]"
                  >
                    {t('navIntegrations')}
                  </Link>
                  <Link
                    href="/platform/reminders"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-3 rounded-2xl bg-[var(--bg-secondary)] text-xs font-bold text-[var(--text-primary)]"
                  >
                    {t('navSmsReminders')}
                  </Link>
                  <Link
                    href="/platform/deposit-protection"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-3 rounded-2xl bg-[var(--bg-secondary)] text-xs font-bold text-[var(--text-primary)]"
                  >
                    {t('navDepositSecurity')}
                  </Link>
                </div>
              </div>

              {/* Resources & Help Center */}
              <div className="space-y-3">
                <p className="text-[10px] font-black uppercase tracking-wider text-[var(--text-muted)]">
                  {t('navResourcesHeader')}
                </p>
                <div className="grid grid-cols-1 gap-2">
                  <Link
                    href="/help"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-3 p-3 rounded-2xl bg-[var(--bg-secondary)]"
                  >
                    <div className="w-8 h-8 rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center flex-shrink-0">
                      <ChatHelp24Regular className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-black text-[var(--text-primary)]">{t('navHelpCenterTitle')}</p>
                      <p className="text-[11px] text-[var(--text-secondary)]">{t('navHelpCenterDesc')}</p>
                    </div>
                  </Link>

                  <div className="grid grid-cols-2 gap-2">
                    <Link
                      href="/changelog"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="p-3 rounded-2xl bg-[var(--bg-secondary)] text-xs font-bold text-[var(--text-primary)] flex items-center justify-between"
                    >
                      <span>{t('navChangelog')}</span>
                      <span className="px-1.5 py-0.5 rounded-full bg-[#2BB5FF]/15 text-[#0284C7] text-[9px] font-black">v2.0</span>
                    </Link>

                    <Link
                      href="/data-protection"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="p-3 rounded-2xl bg-[var(--bg-secondary)] text-xs font-bold text-[var(--text-primary)]"
                    >
                      Data Protection
                    </Link>
                  </div>
                </div>
              </div>

              {/* Solutions by Specialty */}
              <div className="space-y-3">
                <p className="text-[10px] font-black uppercase tracking-wider text-[var(--text-muted)]">
                  {t('solutionsNav')}
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { slug: 'salons', label: t('tabHair'), icon: Sparkle24Regular, color: '#E11D48', bg: 'bg-rose-500/15' },
                    { slug: 'barbers', label: t('tabBarber'), icon: Person24Regular, color: '#D97706', bg: 'bg-amber-500/15' },
                    { slug: 'spas', label: t('tabMedspa'), icon: ShieldCheckmark24Regular, color: '#9333EA', bg: 'bg-purple-500/15' },
                    { slug: 'nails', label: t('tabNails'), icon: Tag24Regular, color: '#DB2777', bg: 'bg-pink-500/15' },
                    { slug: 'tattoo', label: t('tabTattoo'), icon: Star24Regular, color: '#475569', bg: 'bg-slate-500/15' },
                    { slug: 'massage', label: t('tabMassage'), icon: Heart24Regular, color: '#059669', bg: 'bg-emerald-500/15' },
                    { slug: 'pet-groomers', label: t('tabPetGrooming'), icon: Clock24Regular, color: '#0284C7', bg: 'bg-sky-500/15' },
                    { slug: 'trainers', label: t('tabFitness'), icon: CheckmarkCircle24Regular, color: '#4F46E5', bg: 'bg-indigo-500/15' },
                  ].map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.slug}
                        href={`/for/${item.slug}`}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex items-center gap-2 p-2.5 rounded-2xl bg-[var(--bg-secondary)]/80 text-xs font-extrabold text-[var(--text-primary)] hover:text-[#2BB5FF] transition-colors"
                      >
                        <div className={`w-7 h-7 rounded-lg ${item.bg} flex items-center justify-center flex-shrink-0`} style={{ color: item.color }}>
                          <Icon className="w-3.5 h-3.5" />
                        </div>
                        <span className="truncate">{item.label}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>

              {/* Fast Action CTA */}
              <div className="pt-2">
                <Link
                  href="/onboarding"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="btn-primary w-full h-12 rounded-2xl flex items-center justify-center gap-2 text-sm font-extrabold"
                >
                  <span>{t('signUpFree')}</span>
                  <ArrowRight24Filled className="w-4 h-4" />
                </Link>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default MarketingHeader;
