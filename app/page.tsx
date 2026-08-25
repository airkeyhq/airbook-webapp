'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Logo } from '@/components/Logo';
import { useTranslation } from '@/lib/i18n/useTranslation';
import {
  Sparkle24Regular,
  ArrowRight24Filled,
  Calendar24Regular,
  Calendar24Filled,
  Person24Regular,
  Payment24Regular,
  CheckmarkCircle24Regular,
  CheckmarkCircle24Filled,
  Globe24Regular,
  ChevronDown24Filled,
  ShieldCheckmark24Regular,
  Tag24Regular,
  Mail24Regular,
} from '@fluentui/react-icons';

export default function CalendlyMarketingWebsite() {
  const { t, language, setLanguage, availableLanguages } = useTranslation();
  const router = useRouter();
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const [signupEmail, setSignupEmail] = useState('');

  // Interactive Live Hero Booking Simulator State
  const [demoService, setDemoService] = useState<{ id: string; name: string; price: number; duration: number }>({
    id: 'haircut',
    name: 'Signature Cut & Style',
    price: 65,
    duration: 45,
  });
  const [demoSpecialist, setDemoSpecialist] = useState<{ id: string; name: string; role: string; avatar: string }>({
    id: 'roxanne',
    name: 'Roxanne',
    role: 'Color & Cut Specialist',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  });
  const [demoSlot, setDemoSlot] = useState('11:30 AM');
  const [isDemoBooked, setIsDemoBooked] = useState(false);

  // Industry Solutions Tabs State
  const [activeSolutionTab, setActiveSolutionTab] = useState<'hair' | 'barber' | 'medspa' | 'nails'>('hair');

  const currentLangObj = availableLanguages.find((l) => l.id === language) || availableLanguages[0];

  const handleHeroSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (signupEmail) {
      router.push(`/onboarding?email=${encodeURIComponent(signupEmail)}`);
    } else {
      router.push('/onboarding');
    }
  };

  const DEMO_SERVICES = [
    { id: 'haircut', name: 'Signature Cut & Style', price: 65, duration: 45 },
    { id: 'balayage', name: 'Balayage & Gloss', price: 175, duration: 120 },
    { id: 'hydrafacial', name: 'HydraFacial Glow', price: 140, duration: 60 },
    { id: 'gelnails', name: 'Gel Set & Custom Art', price: 85, duration: 60 },
  ];

  const DEMO_SPECIALISTS = [
    {
      id: 'roxanne',
      name: 'Roxanne',
      role: 'Master Stylist',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    },
    {
      id: 'alex',
      name: 'Alex',
      role: 'Lead Barber',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    },
    {
      id: 'priya',
      name: 'Priya',
      role: 'Esthetician',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    },
  ];

  const DEMO_SLOTS = ['10:00 AM', '11:30 AM', '2:00 PM', '3:30 PM', '5:00 PM'];

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] flex flex-col justify-between selection:bg-[#2BB5FF] selection:text-white relative overflow-x-hidden font-sans">
      {/* Background Soft Glow Ambience */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-gradient-to-b from-[#2BB5FF]/10 via-[#AF52DE]/5 to-transparent rounded-full blur-[140px] pointer-events-none -z-10" />

      {/* ─── STICKY HEADER NAVIGATION ─── */}
      <header className="sticky top-0 z-50 w-full backdrop-blur-2xl bg-[var(--bg-primary)]/85 border-b border-[var(--border-subtle)] transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between gap-4">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2 group flex-shrink-0">
            <Logo size={32} showText animated />
          </Link>

          {/* Center Navigation Links */}
          <nav className="hidden lg:flex items-center gap-8 text-xs font-bold text-[var(--text-secondary)]">
            <a href="#features" className="hover:text-[var(--text-primary)] transition-colors">
              {t('howItWorksNav')}
            </a>
            <a href="#solutions" className="hover:text-[var(--text-primary)] transition-colors">
              {t('solutionsNav')}
            </a>
            <a href="#crm" className="hover:text-[var(--text-primary)] transition-colors">
              {t('clientNotesNav')}
            </a>
            <a href="#pos" className="hover:text-[var(--text-primary)] transition-colors">
              {t('paymentsNav')}
            </a>
            <a href="#pricing" className="hover:text-[var(--text-primary)] transition-colors">
              {t('pricingNav')}
            </a>
          </nav>

          {/* Right Controls: Flag Language Switcher + Fast Action CTAs */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Circular Vector Flag Picker (Hatscripts) */}
            <div className="relative z-50">
              <button
                type="button"
                onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                className="h-10 flex items-center gap-2 px-3 rounded-2xl bg-[var(--bg-secondary)] hover:bg-[var(--border-subtle)] border border-[var(--border-subtle)] transition-all text-xs font-extrabold text-[var(--text-primary)] cursor-pointer"
              >
                <img
                  src={`https://hatscripts.github.io/circle-flags/flags/${currentLangObj.flagCode}.svg`}
                  alt={currentLangObj.label}
                  className="w-4 h-4 rounded-full object-cover"
                />
                <span className="uppercase text-[11px] font-black">{currentLangObj.id}</span>
                <ChevronDown24Filled className="w-3 h-3 text-[var(--text-muted)]" />
              </button>

              {isLangMenuOpen && (
                <div className="absolute right-0 mt-2 w-44 py-1.5 bg-[var(--bg-primary)] rounded-2xl shadow-2xl border border-[var(--border-subtle)] z-50 overflow-hidden">
                  {availableLanguages.map((lang) => (
                    <button
                      key={lang.id}
                      type="button"
                      onClick={() => {
                        setLanguage(lang.id);
                        setIsLangMenuOpen(false);
                      }}
                      className={`w-full flex items-center gap-2.5 px-3.5 py-2 text-xs transition-colors cursor-pointer ${
                        language === lang.id
                          ? 'bg-[var(--bg-secondary)] text-[#2BB5FF] font-extrabold'
                          : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] font-semibold'
                      }`}
                    >
                      <img
                        src={`https://hatscripts.github.io/circle-flags/flags/${lang.flagCode}.svg`}
                        alt={lang.label}
                        className="w-4 h-4 rounded-full object-cover"
                      />
                      <span>{lang.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

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
          </div>
        </div>
      </header>

      {/* ─── HERO SECTION (CALENDLY SPLIT + INTERACTIVE SIMULATOR) ─── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-12 sm:pt-20 pb-16 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Calendly-Style High-Impact Value Proposition */}
          <div className="lg:col-span-6 text-left space-y-6">
            <motion.div
              initial={{ y: 15, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-[11px] font-extrabold text-[var(--text-primary)] shadow-xs"
            >
              <Sparkle24Regular className="w-3.5 h-3.5 text-[#2BB5FF]" />
              <span>{t('heroBadge')}</span>
            </motion.div>

            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="text-4xl sm:text-6xl lg:text-[62px] font-black tracking-tight leading-[1.06] text-[var(--text-primary)]"
            >
              {t('heroTitle')}
            </motion.h1>

            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-base sm:text-lg text-[var(--text-secondary)] font-medium leading-relaxed max-w-xl"
            >
              {t('heroDesc')}
            </motion.p>

            {/* Email Fast Signup Trigger */}
            <motion.form
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              onSubmit={handleHeroSignupSubmit}
              className="flex flex-col sm:flex-row items-center gap-2.5 max-w-lg p-1.5 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] shadow-sm"
            >
              <div className="flex items-center gap-2 px-3.5 w-full">
                <Mail24Regular className="w-4 h-4 text-[var(--text-muted)] flex-shrink-0" />
                <input
                  type="email"
                  value={signupEmail}
                  onChange={(e) => setSignupEmail(e.target.value)}
                  placeholder={t('heroCtaInputPlaceholder')}
                  className="w-full bg-transparent text-xs font-semibold text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none py-2"
                />
              </div>
              <button
                type="submit"
                className="btn-primary w-full sm:w-auto px-6 py-2.5 text-xs whitespace-nowrap flex items-center justify-center gap-1.5"
              >
                <span>{t('signUpFree')}</span>
                <ArrowRight24Filled className="w-3.5 h-3.5" />
              </button>
            </motion.form>

            {/* Security Guarantee Microcopy Chips */}
            <motion.div
              initial={{ y: 15, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="flex flex-wrap items-center gap-4 text-[11px] font-bold text-[var(--text-secondary)] pt-1"
            >
              <span className="flex items-center gap-1.5">
                <CheckmarkCircle24Regular className="w-3.5 h-3.5 text-emerald-500" />
                {t('freeForeverPlan')}
              </span>
              <span className="flex items-center gap-1.5">
                <CheckmarkCircle24Regular className="w-3.5 h-3.5 text-emerald-500" />
                {t('noCreditCard')}
              </span>
              <span className="flex items-center gap-1.5">
                <ShieldCheckmark24Regular className="w-3.5 h-3.5 text-[#2BB5FF]" />
                {t('passwordlessGuarantee')}
              </span>
            </motion.div>
          </div>

          {/* Right Column: Live Interactive Booking Widget Simulator */}
          <motion.div
            initial={{ y: 30, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-6 w-full"
          >
            <div className="rounded-[32px] bg-[var(--bg-primary)] border border-[var(--border-subtle)] shadow-2xl p-5 sm:p-7 space-y-5 relative overflow-hidden">
              {/* Top Mini Header */}
              <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#2BB5FF] to-[#AF52DE] flex items-center justify-center text-white font-extrabold text-xs shadow-xs">
                    AB
                  </div>
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-wider text-[var(--text-primary)]">
                      Eduardo&apos;s Lounge &amp; Studio
                    </h3>
                    <p className="text-[11px] text-[var(--text-secondary)] font-semibold">
                      {t('demoInteractiveTitle')}
                    </p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-black uppercase tracking-wider border border-emerald-500/20">
                  {t('openStatus')}
                </span>
              </div>

              {/* Service Pills Selection */}
              <div className="space-y-2">
                <p className="text-[10px] uppercase font-bold tracking-wider text-[var(--text-muted)]">
                  1. {t('demoSelectedService')}
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {DEMO_SERVICES.map((srv) => {
                    const isSelected = demoService.id === srv.id;
                    return (
                      <button
                        key={srv.id}
                        type="button"
                        onClick={() => {
                          setDemoService(srv);
                          setIsDemoBooked(false);
                        }}
                        className={`p-2.5 rounded-2xl text-left border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[var(--bg-secondary)] border-[#2BB5FF] shadow-xs'
                            : 'bg-[var(--bg-primary)] border-[var(--border-subtle)] hover:border-[var(--text-muted)]'
                        }`}
                      >
                        <p className="text-xs font-extrabold text-[var(--text-primary)] truncate">{srv.name}</p>
                        <p className="text-[11px] font-mono font-bold text-[var(--text-secondary)] mt-0.5">
                          ${srv.price} · {srv.duration}m
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Specialist Selection */}
              <div className="space-y-2">
                <p className="text-[10px] uppercase font-bold tracking-wider text-[var(--text-muted)]">
                  2. {t('demoSpecialistLabel')}
                </p>
                <div className="flex items-center gap-2">
                  {DEMO_SPECIALISTS.map((stf) => {
                    const isSelected = demoSpecialist.id === stf.id;
                    return (
                      <button
                        key={stf.id}
                        type="button"
                        onClick={() => {
                          setDemoSpecialist(stf);
                          setIsDemoBooked(false);
                        }}
                        className={`flex-1 flex items-center gap-2 p-2 rounded-2xl border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[var(--bg-secondary)] border-[#2BB5FF] shadow-xs'
                            : 'bg-[var(--bg-primary)] border-[var(--border-subtle)] hover:border-[var(--text-muted)]'
                        }`}
                      >
                        <img
                          src={stf.avatar}
                          alt={stf.name}
                          className="w-7 h-7 rounded-xl object-cover"
                        />
                        <div className="min-w-0 text-left">
                          <p className="text-xs font-bold text-[var(--text-primary)] truncate">{stf.name}</p>
                          <p className="text-[9px] text-[var(--text-secondary)] truncate">{stf.role}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Time Slots */}
              <div className="space-y-2">
                <p className="text-[10px] uppercase font-bold tracking-wider text-[var(--text-muted)]">
                  3. {t('demoAvailableTimes')}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {DEMO_SLOTS.map((slot) => {
                    const isSelected = demoSlot === slot;
                    return (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => {
                          setDemoSlot(slot);
                          setIsDemoBooked(false);
                        }}
                        className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[var(--text-primary)] text-[var(--bg-primary)] shadow-xs'
                            : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] border border-[var(--border-subtle)] hover:text-[var(--text-primary)]'
                        }`}
                      >
                        {slot}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Interactive Booking Trigger Banner */}
              <div className="pt-2">
                {isDemoBooked ? (
                  <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 flex items-center gap-2.5"
                  >
                    <CheckmarkCircle24Filled className="w-5 h-5 flex-shrink-0" />
                    <p className="text-xs font-extrabold leading-tight">
                      {t('demoBookingSuccess')}
                    </p>
                  </motion.div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setIsDemoBooked(true)}
                    className="btn-primary w-full py-3 text-xs flex items-center justify-center gap-2"
                  >
                    <Calendar24Filled className="w-4 h-4" />
                    <span>
                      {t('demoSimulateBook')} (${(demoService.price * 0.25).toFixed(2)} Deposit)
                    </span>
                  </button>
                )}

                <p className="text-[10px] text-center text-[var(--text-muted)] font-semibold mt-2">
                  🔒 {t('demoDepositProtected')} • Apple Pay &amp; Google Pay Enabled
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── METRIC RIBBON & SOCIAL PROOF ─── */}
      <section className="border-y border-[var(--border-subtle)] bg-[var(--bg-secondary)] py-10 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="space-y-1">
              <p className="text-3xl sm:text-4xl font-black text-[var(--text-primary)] tracking-tight">99.8%</p>
              <p className="text-xs font-bold text-[var(--text-secondary)]">{t('statShowUpRate')}</p>
            </div>
            <div className="space-y-1">
              <p className="text-3xl sm:text-4xl font-black text-[#2BB5FF] tracking-tight">100%</p>
              <p className="text-xs font-bold text-[var(--text-secondary)]">{t('statDepositProtected')}</p>
            </div>
            <div className="space-y-1">
              <p className="text-3xl sm:text-4xl font-black text-[#AF52DE] tracking-tight">2.4x</p>
              <p className="text-xs font-bold text-[var(--text-secondary)]">{t('statRebookingRate')}</p>
            </div>
            <div className="space-y-1">
              <p className="text-3xl sm:text-4xl font-black text-emerald-500 tracking-tight">10+ hrs</p>
              <p className="text-xs font-bold text-[var(--text-secondary)]">{t('statTimeSaved')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── HOW AIRBOOK WORKS (4-STEP CALENDLY-STYLE WORKFLOW) ─── */}
      <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 py-20 sm:py-28 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-extrabold uppercase tracking-widest text-[#2BB5FF]">
            {t('howItWorksSubtitle')}
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-[var(--text-primary)] tracking-tight">
            {t('howItWorksTitle')}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Step 1 */}
          <div className="p-6 rounded-3xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] space-y-4 hover:border-[#2BB5FF]/50 transition-all">
            <div className="w-10 h-10 rounded-2xl bg-[#2BB5FF]/10 text-[#2BB5FF] flex items-center justify-center font-black text-xs">
              01
            </div>
            <h3 className="text-base font-extrabold text-[var(--text-primary)]">{t('step1Title')}</h3>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{t('step1Desc')}</p>
          </div>

          {/* Step 2 */}
          <div className="p-6 rounded-3xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] space-y-4 hover:border-[#2BB5FF]/50 transition-all">
            <div className="w-10 h-10 rounded-2xl bg-[#2BB5FF]/10 text-[#2BB5FF] flex items-center justify-center font-black text-xs">
              02
            </div>
            <h3 className="text-base font-extrabold text-[var(--text-primary)]">{t('step2Title')}</h3>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{t('step2Desc')}</p>
          </div>

          {/* Step 3 */}
          <div className="p-6 rounded-3xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] space-y-4 hover:border-[#2BB5FF]/50 transition-all">
            <div className="w-10 h-10 rounded-2xl bg-[#2BB5FF]/10 text-[#2BB5FF] flex items-center justify-center font-black text-xs">
              03
            </div>
            <h3 className="text-base font-extrabold text-[var(--text-primary)]">{t('step3Title')}</h3>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{t('step3Desc')}</p>
          </div>

          {/* Step 4 */}
          <div className="p-6 rounded-3xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] space-y-4 hover:border-[#2BB5FF]/50 transition-all">
            <div className="w-10 h-10 rounded-2xl bg-[#2BB5FF]/10 text-[#2BB5FF] flex items-center justify-center font-black text-xs">
              04
            </div>
            <h3 className="text-base font-extrabold text-[var(--text-primary)]">{t('step4Title')}</h3>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{t('step4Desc')}</p>
          </div>
        </div>
      </section>

      {/* ─── INDUSTRY SOLUTIONS SHOWCASE (SEGMENTED TABS) ─── */}
      <section id="solutions" className="border-t border-[var(--border-subtle)] bg-[var(--bg-secondary)]/50 py-20 sm:py-28 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#AF52DE]">
              {t('solutionsSubtitle')}
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-[var(--text-primary)] tracking-tight">
              {t('solutionsTitle')}
            </h2>
          </div>

          {/* Segmented Solution Switcher Tabs */}
          <div className="flex items-center justify-center max-w-2xl mx-auto mb-10">
            <div className="flex items-center gap-1 p-1 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] w-full overflow-x-auto">
              {[
                { id: 'hair', label: t('tabHair'), icon: Sparkle24Regular },
                { id: 'barber', label: t('tabBarber'), icon: Person24Regular },
                { id: 'medspa', label: t('tabMedspa'), icon: ShieldCheckmark24Regular },
                { id: 'nails', label: t('tabNails'), icon: Tag24Regular },
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = activeSolutionTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveSolutionTab(tab.id as any)}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs transition-all cursor-pointer whitespace-nowrap ${
                      isActive
                        ? 'bg-[var(--text-primary)] text-[var(--bg-primary)] shadow-xs font-extrabold'
                        : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] font-bold'
                    }`}
                  >
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate">{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tab Content Cards */}
          <div className="max-w-4xl mx-auto rounded-3xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] p-6 sm:p-10 shadow-lg">
            {activeSolutionTab === 'hair' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div className="space-y-4">
                  <h3 className="text-xl font-black text-[var(--text-primary)]">{t('tabHair')}</h3>
                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{t('solHairDesc')}</p>
                  <ul className="text-xs space-y-2 font-bold text-[var(--text-primary)]">
                    <li className="flex items-center gap-2">
                      <CheckmarkCircle24Regular className="w-4 h-4 text-emerald-500" />
                      Timed color processing buffer slots
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckmarkCircle24Regular className="w-4 h-4 text-emerald-500" />
                      Formula history &amp; ratio notes on profile
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckmarkCircle24Regular className="w-4 h-4 text-emerald-500" />
                      Digital patch test waiver signatures
                    </li>
                  </ul>
                </div>
                <div className="p-5 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] space-y-2 font-mono text-[11px]">
                  <p className="font-bold text-[#2BB5FF]">FORMULA NOTE #1042</p>
                  <p className="text-[var(--text-secondary)]">Root: 6N + 20vol (35m)</p>
                  <p className="text-[var(--text-secondary)]">Gloss: 9GI + 9GB (15m)</p>
                  <p className="text-emerald-500 font-bold">Logged 12 days ago by Roxanne</p>
                </div>
              </div>
            )}

            {activeSolutionTab === 'barber' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div className="space-y-4">
                  <h3 className="text-xl font-black text-[var(--text-primary)]">{t('tabBarber')}</h3>
                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{t('solBarberDesc')}</p>
                  <ul className="text-xs space-y-2 font-bold text-[var(--text-primary)]">
                    <li className="flex items-center gap-2">
                      <CheckmarkCircle24Regular className="w-4 h-4 text-emerald-500" />
                      Self-serve iPad walk-in kiosk queue
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckmarkCircle24Regular className="w-4 h-4 text-emerald-500" />
                      Tap-to-Pay contactless checkouts in &lt;5s
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckmarkCircle24Regular className="w-4 h-4 text-emerald-500" />
                      Automated 3-week haircut re-booking SMS
                    </li>
                  </ul>
                </div>
                <div className="p-5 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] space-y-2 font-mono text-[11px]">
                  <p className="font-bold text-emerald-500">LIVE QUEUE (3 IN CHAIR)</p>
                  <p className="text-[var(--text-secondary)]">#1 Marcus B. · Skin Fade (Est. 10m)</p>
                  <p className="text-[var(--text-secondary)]">#2 David R. · Beard Sculpt (Est. 20m)</p>
                  <p className="text-[#2BB5FF] font-bold">Walk-in SMS dispatched: &quot;Chair #2 ready!&quot;</p>
                </div>
              </div>
            )}

            {activeSolutionTab === 'medspa' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div className="space-y-4">
                  <h3 className="text-xl font-black text-[var(--text-primary)]">{t('tabMedspa')}</h3>
                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{t('solMedspaDesc')}</p>
                  <ul className="text-xs space-y-2 font-bold text-[var(--text-primary)]">
                    <li className="flex items-center gap-2">
                      <CheckmarkCircle24Regular className="w-4 h-4 text-emerald-500" />
                      Digital consent waivers &amp; liability signatures
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckmarkCircle24Regular className="w-4 h-4 text-emerald-500" />
                      Biometric KYC client ID verification
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckmarkCircle24Regular className="w-4 h-4 text-emerald-500" />
                      Secure client allergy &amp; contraindication charts
                    </li>
                  </ul>
                </div>
                <div className="p-5 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] space-y-2 font-mono text-[11px]">
                  <p className="font-bold text-[#AF52DE]">CONSENT LOG #8821</p>
                  <p className="text-[var(--text-secondary)]">Form: Microneedling &amp; Chemical Peel</p>
                  <p className="text-[var(--text-secondary)]">Signature: eSign Verified (IP 146.75.165.32)</p>
                  <p className="text-emerald-500 font-bold">Biometric KYC: PASSED</p>
                </div>
              </div>
            )}

            {activeSolutionTab === 'nails' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div className="space-y-4">
                  <h3 className="text-xl font-black text-[var(--text-primary)]">{t('tabNails')}</h3>
                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{t('solNailsDesc')}</p>
                  <ul className="text-xs space-y-2 font-bold text-[var(--text-primary)]">
                    <li className="flex items-center gap-2">
                      <CheckmarkCircle24Regular className="w-4 h-4 text-emerald-500" />
                      Multi-service tiered add-ons (Art, Gel, Length)
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckmarkCircle24Regular className="w-4 h-4 text-emerald-500" />
                      Group party simultaneous booking engine
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckmarkCircle24Regular className="w-4 h-4 text-emerald-500" />
                      Card deposit protection against no-shows
                    </li>
                  </ul>
                </div>
                <div className="p-5 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] space-y-2 font-mono text-[11px]">
                  <p className="font-bold text-[#2BB5FF]">PARTY BOOKING (3 GUESTS)</p>
                  <p className="text-[var(--text-secondary)]">Guest 1: Russian Manicure + Chrome</p>
                  <p className="text-[var(--text-secondary)]">Guest 2: Gel-X Full Set + Tier 3 Art</p>
                  <p className="text-emerald-500 font-bold">Deposit: $75.00 Locked in via Apple Pay</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ─── BENTO GRID FEATURE HIGHLIGHTS ─── */}
      <section id="crm" className="max-w-7xl mx-auto px-4 sm:px-6 py-20 sm:py-28 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-extrabold uppercase tracking-widest text-[#2BB5FF]">
            {t('featuresSubtitle')}
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-[var(--text-primary)] tracking-tight">
            {t('featuresTitle')}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: 24/7 Booking */}
          <div className="p-8 rounded-[32px] bg-[var(--bg-primary)] border border-[var(--border-subtle)] space-y-4 shadow-sm hover:shadow-xl transition-all">
            <div className="w-12 h-12 rounded-2xl bg-[#2BB5FF]/10 text-[#2BB5FF] flex items-center justify-center">
              <Calendar24Regular className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-[var(--text-primary)]">{t('feat1Title')}</h3>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{t('feat1Desc')}</p>
          </div>

          {/* Card 2: Formulas & CRM */}
          <div className="p-8 rounded-[32px] bg-[var(--bg-primary)] border border-[var(--border-subtle)] space-y-4 shadow-sm hover:shadow-xl transition-all">
            <div className="w-12 h-12 rounded-2xl bg-[#AF52DE]/10 text-[#AF52DE] flex items-center justify-center">
              <Person24Regular className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-[var(--text-primary)]">{t('feat2Title')}</h3>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{t('feat2Desc')}</p>
          </div>

          {/* Card 3: POS & Instant Deposits */}
          <div id="pos" className="p-8 rounded-[32px] bg-[var(--bg-primary)] border border-[var(--border-subtle)] space-y-4 shadow-sm hover:shadow-xl transition-all">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
              <Payment24Regular className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-[var(--text-primary)]">{t('feat3Title')}</h3>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{t('feat3Desc')}</p>
          </div>
        </div>
      </section>

      {/* ─── PRICING MATRIX ─── */}
      <section id="pricing" className="border-t border-[var(--border-subtle)] bg-[var(--bg-secondary)]/50 py-20 sm:py-28 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#2BB5FF]">
              {t('pricingSubtitle')}
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-[var(--text-primary)] tracking-tight">
              {t('pricingTitle')}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Solo Plan Card */}
            <div className="p-8 sm:p-10 rounded-[36px] bg-[var(--bg-primary)] border border-[var(--border-subtle)] space-y-6 shadow-md hover:shadow-2xl transition-all">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-extrabold text-[var(--text-primary)]">{t('soloPlanTitle')}</h3>
                  <p className="text-xs text-[var(--text-secondary)] mt-0.5">{t('soloPlanDesc')}</p>
                </div>
                <span className="text-3xl font-black text-[var(--text-primary)]">
                  $20 <span className="text-xs font-normal text-[var(--text-secondary)]">/mo</span>
                </span>
              </div>
              <ul className="text-xs space-y-3 text-[var(--text-secondary)] font-semibold">
                <li className="flex items-center gap-2">
                  <CheckmarkCircle24Regular className="w-4 h-4 text-emerald-500" /> Unlimited 24/7 Online Client Bookings
                </li>
                <li className="flex items-center gap-2">
                  <CheckmarkCircle24Regular className="w-4 h-4 text-emerald-500" /> Automatic Card Deposits &amp; No-Show Protection
                </li>
                <li className="flex items-center gap-2">
                  <CheckmarkCircle24Regular className="w-4 h-4 text-emerald-500" /> Client Formula Notes, Specs &amp; Photo History
                </li>
                <li className="flex items-center gap-2">
                  <CheckmarkCircle24Regular className="w-4 h-4 text-emerald-500" /> Instant Daily Cashout to your Debit Card
                </li>
              </ul>
              <Link
                href="/onboarding"
                className="btn-primary block w-full py-3.5 text-center text-xs"
              >
                {t('startFreeTrial')}
              </Link>
            </div>

            {/* Business Team Plan Card */}
            <div className="p-8 sm:p-10 rounded-[36px] bg-gradient-to-br from-[#007AFF] to-[#5856D6] text-white space-y-6 shadow-xl relative overflow-hidden">
              <div className="flex justify-between items-start">
                <div>
                  <span className="px-3 py-1 rounded-full bg-white/20 text-[10px] font-black uppercase tracking-wider mb-2 inline-block">
                    {t('mostPopular')}
                  </span>
                  <h3 className="text-lg font-extrabold text-white">{t('teamPlanTitle')}</h3>
                  <p className="text-xs text-blue-100 mt-0.5">{t('teamPlanDesc')}</p>
                </div>
                <span className="text-3xl font-black text-white">
                  $40 <span className="text-xs font-normal text-blue-200">/mo</span>
                </span>
              </div>
              <ul className="text-xs space-y-3 text-blue-100 font-semibold">
                <li className="flex items-center gap-2">
                  <CheckmarkCircle24Regular className="w-4 h-4 text-amber-300" /> Everything in Solo + Full Team Scheduling
                </li>
                <li className="flex items-center gap-2">
                  <CheckmarkCircle24Regular className="w-4 h-4 text-amber-300" /> Automated Chair Rent &amp; Commission Payouts
                </li>
                <li className="flex items-center gap-2">
                  <CheckmarkCircle24Regular className="w-4 h-4 text-amber-300" /> Smart 3-Week Client SMS Re-Booking Engine
                </li>
                <li className="flex items-center gap-2">
                  <CheckmarkCircle24Regular className="w-4 h-4 text-amber-300" /> Digital Consultation Waivers &amp; Client Forms
                </li>
              </ul>
              <Link
                href="/onboarding"
                className="block w-full py-3.5 rounded-2xl bg-white text-black font-extrabold text-xs text-center shadow-lg hover:bg-slate-100 transition-colors"
              >
                {t('getStarted')}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── HIGH CONVICTION BOTTOM CTA BANNER ─── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-20 relative z-10">
        <div className="p-8 sm:p-14 rounded-[36px] bg-gradient-to-tr from-[var(--bg-secondary)] via-[var(--bg-primary)] to-[var(--bg-secondary)] border border-[var(--border-subtle)] text-center space-y-6 shadow-xl">
          <h2 className="text-3xl sm:text-5xl font-black text-[var(--text-primary)] tracking-tight max-w-2xl mx-auto">
            {t('ctaBannerTitle')}
          </h2>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] max-w-lg mx-auto font-medium">
            {t('ctaBannerSubtitle')}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              href="/onboarding"
              className="btn-primary px-8 py-3.5 text-xs flex items-center gap-2"
            >
              <span>{t('startFreeTrialBtn')}</span>
              <ArrowRight24Filled className="w-3.5 h-3.5" />
            </Link>
            <Link
              href="/book/eduardos-lounge"
              className="px-6 py-3.5 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-xs font-extrabold text-[var(--text-primary)] hover:bg-[var(--border-subtle)] transition-colors flex items-center gap-2"
            >
              <Globe24Regular className="w-4 h-4 text-[var(--text-muted)]" />
              <span>{t('talkToSales')}</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ─── CALENDLY-STYLE STRUCTURED FOOTER ─── */}
      <footer className="border-t border-[var(--border-subtle)] bg-[var(--bg-primary)] py-12 relative z-10 text-xs text-[var(--text-secondary)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
            {/* Col 1: Brand & Security */}
            <div className="col-span-2 space-y-3">
              <Logo size={28} showText />
              <p className="text-xs text-[var(--text-secondary)] max-w-sm leading-relaxed">
                The modern booking infrastructure designed for beauty, salon, spa, and barber shops worldwide.
              </p>
              <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                <ShieldCheckmark24Regular className="w-3.5 h-3.5" />
                AirBook is 100% Passwordless.
              </p>
            </div>

            {/* Col 2: Product */}
            <div className="space-y-2.5">
              <p className="text-[11px] font-black uppercase tracking-wider text-[var(--text-primary)]">
                {t('footerProduct')}
              </p>
              <ul className="space-y-2">
                <li><a href="#features" className="hover:text-[var(--text-primary)]">{t('howItWorksNav')}</a></li>
                <li><a href="#crm" className="hover:text-[var(--text-primary)]">{t('clientNotesNav')}</a></li>
                <li><a href="#pos" className="hover:text-[var(--text-primary)]">{t('paymentsNav')}</a></li>
                <li><a href="#pricing" className="hover:text-[var(--text-primary)]">{t('pricingNav')}</a></li>
              </ul>
            </div>

            {/* Col 3: Solutions */}
            <div className="space-y-2.5">
              <p className="text-[11px] font-black uppercase tracking-wider text-[var(--text-primary)]">
                {t('footerSolutions')}
              </p>
              <ul className="space-y-2">
                <li><a href="#solutions" className="hover:text-[var(--text-primary)]">{t('tabHair')}</a></li>
                <li><a href="#solutions" className="hover:text-[var(--text-primary)]">{t('tabBarber')}</a></li>
                <li><a href="#solutions" className="hover:text-[var(--text-primary)]">{t('tabMedspa')}</a></li>
                <li><a href="#solutions" className="hover:text-[var(--text-primary)]">{t('tabNails')}</a></li>
              </ul>
            </div>

            {/* Col 4: Links */}
            <div className="space-y-2.5">
              <p className="text-[11px] font-black uppercase tracking-wider text-[var(--text-primary)]">
                {t('operatorApp')}
              </p>
              <ul className="space-y-2">
                <li><Link href="/login" className="hover:text-[var(--text-primary)]">{t('signIn')}</Link></li>
                <li><Link href="/dashboard" className="hover:text-[var(--text-primary)]">{t('openDashboard')}</Link></li>
                <li><Link href="/book/eduardos-lounge" className="hover:text-[var(--text-primary)]">{t('seeLiveDemo')}</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-[var(--border-subtle)] pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px]">
            <p>© 2026 AirBook. {t('allRightsReserved')}</p>
            <div className="flex items-center gap-4 font-bold">
              <span>English (US)</span>
              <span>·</span>
              <span>Español</span>
              <span>·</span>
              <span>Deutsch</span>
              <span>·</span>
              <span>Français</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}


