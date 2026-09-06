'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Logo } from '@/components/Logo';
import { AirBookPeopleAvatars } from '@/components/AirBookPeopleAvatars';
import { FeatureBentoGrid } from '@/components/FeatureBentoGrid';
import { MarketingHeader } from '@/components/MarketingHeader';
import { MarketingFooter } from '@/components/MarketingFooter';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { getDemoSpecialists, getDemoClient } from '@/lib/i18n/demographics';
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
  ChevronLeft24Filled,
  ChevronRight24Filled,
  ShieldCheckmark24Regular,
  Tag24Regular,
  Mail24Regular,
  Clock24Regular,
  Chat24Regular,
  Heart24Regular,
  Star24Regular,
  Star24Filled,
  LockClosed24Regular,
  CursorClick24Regular,
  PeopleCommunity24Regular,
  Navigation24Filled,
  ArrowUp24Filled,
  Dismiss24Filled,
} from '@fluentui/react-icons';

type IndustryTabKey =
  | 'hair'
  | 'barber'
  | 'medspa'
  | 'nails'
  | 'tattoo'
  | 'massage'
  | 'petgrooming'
  | 'fitness';

const DEMO_SERVICES = [
  { id: 'signature', name: 'Signature Consultation & Service', price: 75, duration: 60 },
  { id: 'express', name: 'Express Session', price: 45, duration: 30 },
  { id: 'comprehensive', name: 'Comprehensive Appointment', price: 150, duration: 90 },
  { id: 'followup', name: 'Follow-up & Review', price: 60, duration: 45 },
];

const DEMO_SLOTS = ['10:00 AM', '11:30 AM', '2:00 PM', '3:30 PM', '5:00 PM'];

const AUTO_SCENARIOS = [
  { serviceIndex: 0, specialistIndex: 0, slot: '11:30 AM' },
  { serviceIndex: 2, specialistIndex: 1, slot: '2:00 PM' },
  { serviceIndex: 1, specialistIndex: 2, slot: '3:30 PM' },
];

export default function MarketingWebsite() {
  const { t, language, setLanguage, availableLanguages } = useTranslation();
  const router = useRouter();
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const [signupEmail, setSignupEmail] = useState('');

  // Interactive Live Hero Booking Simulator State
  const [demoService, setDemoService] = useState(DEMO_SERVICES[0]);
  const demoSpecialists = getDemoSpecialists(language);
  const [demoSpecialist, setDemoSpecialist] = useState(demoSpecialists[0]);
  const [demoSlot, setDemoSlot] = useState('11:30 AM');
  const [isDemoBooked, setIsDemoBooked] = useState(false);

  // Multi-Step Motion Simulation with Mockup Cursor Engine
  const [isUserHoveringDemo, setIsUserHoveringDemo] = useState(false);
  const [cursorPos, setCursorPos] = useState<{ x: number; y: number }>({ x: 120, y: 130 });
  const [isCursorVisible, setIsCursorVisible] = useState(false);
  const [isCursorClicking, setIsCursorClicking] = useState(false);
  const [motionStepBadge, setMotionStepBadge] = useState<string>('demoCursorSelecting');

  const demoStageRef = useRef<HTMLDivElement>(null);
  const serviceRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const specialistRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const slotRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const ctaBtnRef = useRef<HTMLButtonElement | null>(null);

  // Synchronize specialist profile when language changes
  useEffect(() => {
    const specialists = getDemoSpecialists(language);
    setDemoSpecialist(specialists[0]);
    setIsDemoBooked(false);
  }, [language]);

  // Automated Multi-Step Motion Simulation Timeline Loop
  useEffect(() => {
    let isMounted = true;
    let scenarioIdx = 0;
    let timerChain: NodeJS.Timeout[] = [];

    const clearAllTimers = () => {
      timerChain.forEach((t) => clearTimeout(t));
      timerChain = [];
    };

    if (isUserHoveringDemo) {
      setIsCursorVisible(false);
      setIsCursorClicking(false);
      return () => clearAllTimers();
    }

    const addTimer = (fn: () => void, delayMs: number) => {
      const id = setTimeout(() => {
        if (isMounted) fn();
      }, delayMs);
      timerChain.push(id);
      return id;
    };

    const getCenterPos = (el: HTMLElement | null) => {
      if (!el || !demoStageRef.current) return null;
      const stageRect = demoStageRef.current.getBoundingClientRect();
      const elRect = el.getBoundingClientRect();
      return {
        x: elRect.left - stageRect.left + elRect.width * 0.5,
        y: elRect.top - stageRect.top + elRect.height * 0.5,
      };
    };

    const runMotionSequence = (idx: number) => {
      if (!isMounted) return;
      const scenario = AUTO_SCENARIOS[idx % AUTO_SCENARIOS.length];
      const targetSrv = DEMO_SERVICES[scenario.serviceIndex];
      const specialists = getDemoSpecialists(language);
      const targetSpec = specialists[scenario.specialistIndex] || specialists[0];
      const targetSlot = scenario.slot;

      // ── Step 1: Glide to Selected Service ──
      setMotionStepBadge('demoCursorSelecting');
      setIsCursorVisible(true);
      const srvEl = serviceRefs.current[targetSrv.id];
      const srvPos = getCenterPos(srvEl);
      if (srvPos) setCursorPos(srvPos);

      // Click Service
      addTimer(() => {
        setIsCursorClicking(true);
        setDemoService(targetSrv);
        setIsDemoBooked(false);

        addTimer(() => {
          setIsCursorClicking(false);

          // ── Step 2: Glide to Specialist ──
          addTimer(() => {
            setMotionStepBadge('demoCursorProvider');
            const specEl = specialistRefs.current[targetSpec.id];
            const specPos = getCenterPos(specEl);
            if (specPos) setCursorPos(specPos);

            // Click Specialist
            addTimer(() => {
              setIsCursorClicking(true);
              setDemoSpecialist(targetSpec);

              addTimer(() => {
                setIsCursorClicking(false);

                // ── Step 3: Glide to Time Slot ──
                addTimer(() => {
                  setMotionStepBadge('demoCursorSlot');
                  const slotEl = slotRefs.current[targetSlot];
                  const slotPos = getCenterPos(slotEl);
                  if (slotPos) setCursorPos(slotPos);

                  // Click Time Slot
                  addTimer(() => {
                    setIsCursorClicking(true);
                    setDemoSlot(targetSlot);

                    addTimer(() => {
                      setIsCursorClicking(false);

                      // ── Step 4: Glide to CTA Button ──
                      addTimer(() => {
                        setMotionStepBadge('demoCursorBooking');
                        const ctaPos = getCenterPos(ctaBtnRef.current);
                        if (ctaPos) setCursorPos(ctaPos);

                        // Click CTA Button
                        addTimer(() => {
                          setIsCursorClicking(true);
                          setIsDemoBooked(true);

                          addTimer(() => {
                            setIsCursorClicking(false);

                            // Hold Confirmed View (3.6s) then advance to next scenario
                            addTimer(() => {
                              scenarioIdx++;
                              runMotionSequence(scenarioIdx);
                            }, 3600);
                          }, 250);
                        }, 750);
                      }, 350);
                    }, 250);
                  }, 750);
                }, 350);
              }, 250);
            }, 750);
          }, 350);
        }, 250);
      }, 850);
    };

    // Initial warm-up start
    addTimer(() => {
      runMotionSequence(0);
    }, 700);

    return () => {
      isMounted = false;
      clearAllTimers();
    };
  }, [isUserHoveringDemo, language]);

  // Retention Simulator Tab State
  const [activeRetentionTab, setActiveRetentionTab] = useState<'rebook' | 'review'>('rebook');

  const INDUSTRY_TABS: { id: IndustryTabKey; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'hair', label: t('tabHair'), icon: Sparkle24Regular },
    { id: 'barber', label: t('tabBarber'), icon: Person24Regular },
    { id: 'medspa', label: t('tabMedspa'), icon: ShieldCheckmark24Regular },
    { id: 'nails', label: t('tabNails'), icon: Tag24Regular },
    { id: 'tattoo', label: t('tabTattoo'), icon: Star24Regular },
    { id: 'massage', label: t('tabMassage'), icon: Heart24Regular },
    { id: 'petgrooming', label: t('tabPetGrooming'), icon: Clock24Regular },
    { id: 'fitness', label: t('tabFitness'), icon: CheckmarkCircle24Regular },
  ];

  // Industry Solutions Carousel State & Auto-Advance Timer
  const [activeSolutionIndex, setActiveSolutionIndex] = useState(0);
  const [solutionProgress, setSolutionProgress] = useState(0);
  const [isSolutionHovered, setIsSolutionHovered] = useState(false);

  // Pricing Matrix State
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');

  const SOLUTION_TAB_DURATION = 5000;
  const SOLUTION_STEP_MS = 50;

  useEffect(() => {
    if (isSolutionHovered) return;

    const timer = setInterval(() => {
      setSolutionProgress((prev) => {
        const nextProgress = prev + (SOLUTION_STEP_MS / SOLUTION_TAB_DURATION) * 100;
        if (nextProgress >= 100) {
          setActiveSolutionIndex((curr) => (curr + 1) % INDUSTRY_TABS.length);
          return 0;
        }
        return nextProgress;
      });
    }, SOLUTION_STEP_MS);

    return () => clearInterval(timer);
  }, [isSolutionHovered, INDUSTRY_TABS.length]);

  const handleNextSolution = () => {
    setActiveSolutionIndex((curr) => (curr + 1) % INDUSTRY_TABS.length);
    setSolutionProgress(0);
  };

  const handlePrevSolution = () => {
    setActiveSolutionIndex((curr) => (curr - 1 + INDUSTRY_TABS.length) % INDUSTRY_TABS.length);
    setSolutionProgress(0);
  };

  const activeTabObj = INDUSTRY_TABS[activeSolutionIndex] || INDUSTRY_TABS[0];
  const activeSolutionTab = activeTabObj.id;
  const ActiveSolutionIcon = activeTabObj.icon;

  // Kinetic Hero Rotating Trades State
  const trades = [
    t('heroTrade1'),
    t('heroTrade2'),
    t('heroTrade3'),
    t('heroTrade4'),
    t('heroTrade5'),
    t('heroTrade6'),
    t('heroTrade7'),
  ];
  const [currentTradeIndex, setCurrentTradeIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTradeIndex((prev) => (prev + 1) % trades.length);
    }, 2800);
    return () => clearInterval(timer);
  }, [trades.length]);

  // Header Navigation Popover & Mobile Drawer State
  const [activeNavDropdown, setActiveNavDropdown] = useState<'product' | 'solutions' | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.nav-dropdown-container')) {
        setActiveNavDropdown(null);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const currentLangObj = availableLanguages.find((l) => l.id === language) || availableLanguages[0];

  const handleHeroSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (signupEmail) {
      router.push(`/onboarding?email=${encodeURIComponent(signupEmail)}`);
    } else {
      router.push('/onboarding');
    }
  };


  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] flex flex-col justify-between selection:bg-[#2BB5FF] selection:text-white relative overflow-x-hidden font-sans">
      {/* ─── STICKY MASTER HEADER NAVIGATION ─── */}
      <MarketingHeader />

      {/* ─── HERO SECTION (ABOARD-STYLE LIGHT PASTEL STAGE) ─── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-10 sm:pt-16 pb-12 relative z-10">
        {/* Top Text & Value Proposition */}
        <div className="text-center max-w-3xl mx-auto space-y-5 mb-10 sm:mb-14">
          <motion.div
            initial={{ y: 12, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
          >
            <Link
              href="/changelog"
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--bg-secondary)] border border-[var(--border-subtle)] hover:border-[#2BB5FF]/50 transition-all text-[11px] font-extrabold text-[var(--text-primary)] shadow-xs group"
            >
              <Sparkle24Regular className="w-3.5 h-3.5 text-[#2BB5FF]" />
              <span>{t('heroBadge')}</span>
              <ArrowRight24Filled className="w-3 h-3 text-[var(--text-muted)] group-hover:text-[#2BB5FF] group-hover:translate-x-0.5 transition-all" />
            </Link>
          </motion.div>

          <motion.h1
            initial={{ y: 16, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.08 }}
            className="text-4xl sm:text-6xl lg:text-[66px] font-black tracking-tight leading-[1.08] text-[var(--text-primary)] min-h-[120px] sm:min-h-[148px] flex flex-col items-center justify-center"
          >
            <span>{t('heroTitleLine1')}</span>
            <div className="h-[1.25em] relative overflow-visible flex items-center justify-center px-4">
              <AnimatePresence mode="wait">
                <motion.span
                  key={currentTradeIndex}
                  initial={{ y: 32, opacity: 0, filter: 'blur(6px)' }}
                  animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
                  exit={{ y: -32, opacity: 0, filter: 'blur(6px)' }}
                  transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                  className="relative inline-block whitespace-nowrap overflow-visible"
                >
                  {/* Free-Overflowing Ambient Glow Aura (Diffuses softly across the canvas) */}
                  <motion.div
                    initial={{ opacity: 0.75, scale: 0.95 }}
                    animate={{ opacity: 0, scale: 1.08 }}
                    transition={{
                      duration: 1.0,
                      delay: 0.25,
                      ease: [0.4, 0, 0.2, 1],
                    }}
                    className="absolute -inset-x-12 -inset-y-6 rounded-full bg-gradient-to-r from-[#2BB5FF]/40 via-[#AF52DE]/30 to-[#FF2D55]/40 blur-2xl pointer-events-none -z-10 select-none"
                    aria-hidden="true"
                  />

                  {/* Base Solid Text Layer (Always crisp and lands on solid color) */}
                  <span className="text-[var(--text-primary)]">
                    {trades[currentTradeIndex]}
                  </span>

                  {/* Top Gradient Flash Layer (Smoothly dissolves into solid layer) */}
                  <motion.span
                    initial={{ opacity: 1 }}
                    animate={{ opacity: 0 }}
                    transition={{
                      duration: 0.9,
                      delay: 0.25,
                      ease: [0.4, 0, 0.2, 1],
                    }}
                    className="absolute inset-0 pointer-events-none bg-gradient-to-r from-[#2BB5FF] via-[#AF52DE] to-[#FF2D55] bg-clip-text text-transparent select-none"
                    aria-hidden="true"
                  >
                    {trades[currentTradeIndex]}
                  </motion.span>
                </motion.span>
              </AnimatePresence>
            </div>
          </motion.h1>

          <motion.p
            initial={{ y: 16, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.16 }}
            className="text-sm sm:text-base text-[var(--text-secondary)] font-medium leading-relaxed max-w-xl mx-auto"
          >
            {t('heroDesc')}
          </motion.p>

          {/* Email Fast Signup Trigger */}
          <motion.form
            initial={{ y: 16, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.22 }}
            onSubmit={handleHeroSignupSubmit}
            className="flex flex-col sm:flex-row items-center gap-2.5 max-w-md mx-auto p-1.5 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] shadow-sm"
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
              className="btn-primary w-full sm:w-auto h-10 px-6 rounded-xl text-xs font-extrabold whitespace-nowrap flex items-center justify-center gap-1.5 flex-shrink-0"
            >
              <span>{t('signUpFree')}</span>
              <ArrowRight24Filled className="w-3.5 h-3.5" />
            </button>
          </motion.form>

          {/* Trust Guarantee Chips */}
          <motion.div
            initial={{ y: 12, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.28 }}
            className="flex flex-wrap items-center justify-center gap-4 text-[11px] font-bold text-[var(--text-secondary)] pt-1"
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
              <Sparkle24Regular className="w-3.5 h-3.5 text-[#2BB5FF]" />
              {t('passwordlessGuarantee')}
            </span>
          </motion.div>
        </div>

        {/* ─── ABOARD-STYLE PASTEL FRAMED UI CANVAS STAGE ─── */}
        <motion.div
          initial={{ y: 24, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.32 }}
          className="p-4 sm:p-8 lg:p-10 rounded-[36px] sm:rounded-[48px] bg-gradient-to-br from-[#FFF0F5]/80 via-[#FDF2F8]/60 to-[#F5F3FF]/80 dark:from-pink-950/20 dark:via-purple-950/20 dark:to-sky-950/20 border border-pink-100/80 dark:border-pink-900/30 shadow-xl"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Client Storefront Perspective */}
            <div className="lg:col-span-7 space-y-3">
              {/* Perspective Header Badge */}
              <div className="flex items-center justify-between px-1">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--bg-primary)]/90 backdrop-blur-md border border-[var(--border-subtle)] text-[11px] font-black tracking-wide text-[var(--text-primary)] shadow-xs">
                  <Globe24Regular className="w-3.5 h-3.5 text-[#2BB5FF]" />
                  <span>{t('demoClientPerspective')}</span>
                </div>
                <span className="text-[10px] font-mono font-bold text-[var(--text-secondary)] hidden sm:inline-flex items-center gap-1">
                  <span>getairbook.com/book/lelegance</span>
                </span>
              </div>

              {/* Left Stage: Live Client Booking Flow Simulator */}
              <div
                ref={demoStageRef}
                onMouseEnter={() => setIsUserHoveringDemo(true)}
                onMouseLeave={() => setIsUserHoveringDemo(false)}
                className="bg-[var(--bg-primary)] rounded-[32px] border border-[var(--border-subtle)] p-5 sm:p-7 shadow-xl space-y-4 relative overflow-hidden"
              >
              {/* Animated Mockup Cursor */}
              <motion.div
                className="absolute z-30 pointer-events-none -ml-1 -mt-1 flex items-start"
                animate={{
                  x: cursorPos.x,
                  y: cursorPos.y,
                  opacity: isCursorVisible && !isUserHoveringDemo ? 1 : 0,
                  scale: isCursorClicking ? 0.86 : 1,
                }}
                transition={{
                  x: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
                  y: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
                  opacity: { duration: 0.25 },
                  scale: { duration: 0.12 },
                }}
              >
                {/* Click Ripple Wave */}
                {isCursorClicking && (
                  <span className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-[#2BB5FF]/50 border-2 border-[#2BB5FF] animate-ping pointer-events-none" />
                )}

                {/* Sleek Vector Cursor */}
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="drop-shadow-[0_4px_10px_rgba(0,0,0,0.45)] flex-shrink-0"
                >
                  <path
                    d="M5.5 3.21V20.8c0 .45.54.67.85.35l4.86-4.86a.5.5 0 0 1 .35-.15h6.88c.45 0 .67-.54.35-.85L5.85 2.86a.5.5 0 0 0-.35.35Z"
                    fill="#0F172A"
                    stroke="#FFFFFF"
                    strokeWidth="1.5"
                    strokeLinejoin="round"
                  />
                </svg>

                {/* Animated Step Badge */}
                <motion.span
                  key={motionStepBadge}
                  initial={{ opacity: 0, scale: 0.85, x: -4 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  className="ml-1.5 -mt-1 px-2 py-0.5 rounded-full bg-black/85 dark:bg-white/90 text-white dark:text-black text-[9px] font-black uppercase tracking-wider shadow-md backdrop-blur-xs whitespace-nowrap"
                >
                  {t(motionStepBadge as any)}
                </motion.span>
              </motion.div>

              <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-3.5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#2BB5FF] to-[#AF52DE] flex items-center justify-center text-white font-black text-xs shadow-xs">
                    AB
                  </div>
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-wider text-[var(--text-primary)]">
                      L&apos;Élégance Studio &amp; Spa
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

              {/* Service Pills */}
              <div className="space-y-1.5">
                <p className="text-[10px] uppercase font-bold tracking-wider text-[var(--text-muted)]">
                  1. {t('demoSelectedService')}
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {DEMO_SERVICES.map((srv) => {
                    const isSelected = demoService.id === srv.id;
                    return (
                      <button
                        key={srv.id}
                        ref={(el) => {
                          serviceRefs.current[srv.id] = el;
                        }}
                        type="button"
                        onClick={() => {
                          setDemoService(srv);
                          setIsDemoBooked(false);
                        }}
                        className={`p-2.5 rounded-2xl text-left border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[var(--bg-secondary)] border-[#2BB5FF] shadow-xs ring-1 ring-[#2BB5FF]/30'
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
              <div className="space-y-1.5">
                <p className="text-[10px] uppercase font-bold tracking-wider text-[var(--text-muted)]">
                  2. {t('demoSpecialistLabel')}
                </p>
                <div className="flex items-center gap-2">
                  {demoSpecialists.map((stf) => {
                    const isSelected = demoSpecialist.id === stf.id;
                    return (
                      <button
                        key={stf.id}
                        ref={(el) => {
                          specialistRefs.current[stf.id] = el;
                        }}
                        type="button"
                        onClick={() => {
                          setDemoSpecialist(stf);
                          setIsDemoBooked(false);
                        }}
                        className={`flex-1 flex items-center gap-2 p-2 rounded-2xl border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[var(--bg-secondary)] border-[#2BB5FF] shadow-xs ring-1 ring-[#2BB5FF]/30'
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
              <div className="space-y-1.5">
                <p className="text-[10px] uppercase font-bold tracking-wider text-[var(--text-muted)]">
                  3. {t('demoAvailableTimes')}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {DEMO_SLOTS.map((slot) => {
                    const isSelected = demoSlot === slot;
                    return (
                      <button
                        key={slot}
                        ref={(el) => {
                          slotRefs.current[slot] = el;
                        }}
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

              {/* Booking Trigger CTA */}
              <div className="pt-2">
                {isDemoBooked ? (
                  <motion.div
                    initial={{ scale: 0.96, opacity: 0 }}
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
                    ref={ctaBtnRef}
                    type="button"
                    onClick={() => setIsDemoBooked(true)}
                    className="btn-primary w-full h-11 rounded-2xl text-xs font-extrabold flex items-center justify-center gap-2"
                  >
                    <Calendar24Filled className="w-4 h-4" />
                    <span>
                      {t('demoSimulateBook')} (${(demoService.price * 0.25).toFixed(2)} Deposit)
                    </span>
                  </button>
                )}
                <p className="text-[10px] text-center text-[var(--text-muted)] font-semibold mt-2 flex items-center justify-center gap-1">
                  <LockClosed24Regular className="w-3 h-3 text-[var(--text-muted)]" />
                  <span>{t('demoDepositProtected')} • Apple Pay &amp; Google Pay</span>
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Provider Command Center Perspective with Divider */}
          <div className="lg:col-span-5 space-y-3 pt-6 lg:pt-0 border-t lg:border-t-0 lg:border-l border-pink-200/50 dark:border-pink-900/30 lg:pl-8">
              {/* Perspective Header Badge */}
              <div className="flex items-center justify-between px-1">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--bg-primary)]/90 backdrop-blur-md border border-[var(--border-subtle)] text-[11px] font-black tracking-wide text-[var(--text-primary)] shadow-xs">
                  <ShieldCheckmark24Regular className="w-3.5 h-3.5 text-[#AF52DE]" />
                  <span>{t('demoOperatorPerspective')}</span>
                </div>
                <span className="text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  {t('demoRealtimeSyncBadge')}
                </span>
              </div>

              {/* Right Stage: Floating Operator Schedule & Client Spec Cards */}
              <div className="space-y-4">
                {/* Card 1: Live Chair Dispatch & Schedule Roster */}
                <div className="bg-[var(--bg-primary)] rounded-[28px] border border-[var(--border-subtle)] p-4 sm:p-5 shadow-xl space-y-3.5">
                {/* Live Header with Pulse Radar */}
                <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-3">
                  <div className="flex items-center gap-2">
                    <Clock24Regular className="w-4 h-4 text-[var(--text-secondary)]" />
                    <span className="text-[11px] font-black uppercase tracking-wider text-[var(--text-primary)]">
                      {t('demoRosterTitle')}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                    </span>
                    <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                      {isDemoBooked ? '3' : '2'} {t('demoStationsActive')}
                    </span>
                  </div>
                </div>

                {/* Real-Time Station Rows */}
                <div className="space-y-2.5">
                  {/* Station 1: In Progress */}
                  <div className="p-3 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <img
                          src={demoSpecialists[0].avatar}
                          alt={demoSpecialists[0].name}
                          className="w-8 h-8 rounded-xl object-cover border border-[var(--border-subtle)] flex-shrink-0"
                        />
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <p className="text-xs font-extrabold text-[var(--text-primary)] truncate">
                              {demoSpecialists[0].station}
                            </p>
                            <span className="text-[9px] font-bold text-[var(--text-muted)]">•</span>
                            <p className="text-[10px] font-semibold text-[var(--text-secondary)] truncate">
                              {demoSpecialists[0].name}
                            </p>
                          </div>
                          <p className="text-[10px] font-medium text-[var(--text-secondary)] truncate">
                            {DEMO_SERVICES[2].name} · Elena R.
                          </p>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0 pl-2">
                        <span className="text-xs font-mono font-black text-[var(--text-primary)]">$150</span>
                        <span className="block text-[9px] font-bold text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded-md mt-0.5">
                          {t('demoStatusInSession')}
                        </span>
                      </div>
                    </div>
                    {/* Progress Bar */}
                    <div className="space-y-1">
                      <div className="w-full bg-[var(--bg-primary)] h-1.5 rounded-full overflow-hidden border border-[var(--border-subtle)]">
                        <div className="bg-gradient-to-r from-[#2BB5FF] to-emerald-400 h-full rounded-full w-[65%]" />
                      </div>
                      <div className="flex items-center justify-between text-[9px] text-[var(--text-muted)] font-mono font-medium">
                        <span>11:00 AM</span>
                        <span>55 / 90 min</span>
                        <span>12:30 PM</span>
                      </div>
                    </div>
                  </div>

                  {/* Station 2: Finishing */}
                  <div className="p-3 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <img
                          src={demoSpecialists[1].avatar}
                          alt={demoSpecialists[1].name}
                          className="w-8 h-8 rounded-xl object-cover border border-[var(--border-subtle)] flex-shrink-0"
                        />
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <p className="text-xs font-extrabold text-[var(--text-primary)] truncate">
                              {demoSpecialists[1].station}
                            </p>
                            <span className="text-[9px] font-bold text-[var(--text-muted)]">•</span>
                            <p className="text-[10px] font-semibold text-[var(--text-secondary)] truncate">
                              {demoSpecialists[1].name}
                            </p>
                          </div>
                          <p className="text-[10px] font-medium text-[var(--text-secondary)] truncate">
                            {DEMO_SERVICES[1].name} · David K.
                          </p>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0 pl-2">
                        <span className="text-xs font-mono font-black text-[var(--text-primary)]">$45</span>
                        <span className="block text-[9px] font-bold text-amber-500 bg-amber-500/10 px-1.5 py-0.5 rounded-md mt-0.5">
                          {t('demoStatusFinishing')}
                        </span>
                      </div>
                    </div>
                    {/* Progress Bar */}
                    <div className="space-y-1">
                      <div className="w-full bg-[var(--bg-primary)] h-1.5 rounded-full overflow-hidden border border-[var(--border-subtle)]">
                        <div className="bg-gradient-to-r from-amber-400 to-emerald-400 h-full rounded-full w-[85%]" />
                      </div>
                      <div className="flex items-center justify-between text-[9px] text-[var(--text-muted)] font-mono font-medium">
                        <span>11:15 AM</span>
                        <span>25 / 30 min</span>
                        <span>11:45 AM</span>
                      </div>
                    </div>
                  </div>

                  {/* Interactive Reaction: Dynamic Booked Slot */}
                  <AnimatePresence>
                    {isDemoBooked && (
                      <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.96 }}
                        transition={{ duration: 0.25, ease: 'easeOut' }}
                        className="p-3 rounded-2xl bg-sky-500/5 dark:bg-sky-950/20 border-2 border-[#2BB5FF] shadow-[0_4px_16px_-2px_rgba(43,181,255,0.25)] space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2.5 min-w-0">
                            <img
                              src={demoSpecialist.avatar}
                              alt={demoSpecialist.name}
                              className="w-8 h-8 rounded-xl object-cover border border-[#2BB5FF]/50 flex-shrink-0"
                            />
                            <div className="min-w-0">
                              <div className="flex items-center gap-1.5">
                                <p className="text-xs font-extrabold text-[var(--text-primary)] truncate">
                                  {demoSpecialist.station}
                                </p>
                                <span className="text-[9px] font-bold text-[#2BB5FF]">•</span>
                                <p className="text-[10px] font-semibold text-[#2BB5FF] truncate">
                                  {demoSpecialist.name}
                                </p>
                              </div>
                              <p className="text-[10px] font-medium text-[var(--text-secondary)] truncate">
                                {demoService.name} · {getDemoClient(language).name}
                              </p>
                            </div>
                          </div>
                          <div className="text-right flex-shrink-0 pl-2">
                            <span className="text-xs font-mono font-black text-[#2BB5FF]">${demoService.price}</span>
                            <span className="block text-[9px] font-extrabold text-[#2BB5FF] bg-[#2BB5FF]/10 px-1.5 py-0.5 rounded-md mt-0.5 border border-[#2BB5FF]/20">
                              {demoSlot}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between pt-1 border-t border-[#2BB5FF]/20 text-[10px] font-bold">
                          <span className="flex items-center gap-1 text-[#2BB5FF]">
                            <Sparkle24Regular className="w-3 h-3" />
                            {t('demoUpcomingBooking')}
                          </span>
                          <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[9px] border border-emerald-500/20">
                            {t('demoDepositBadge')}
                          </span>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
      </section>

      {/* ─── BUILT FOR PEOPLE SECTION (ABOARD-STYLE CLEAN MINIMALIST SECTION) ─── */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-16 sm:py-24 relative z-10 text-center">
        {/* Headline with Inline Overlapping Cloud Avatars */}
        <motion.h2
          initial={{ y: 16, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3 }}
          className="text-3xl sm:text-5xl lg:text-6xl font-black text-[var(--text-primary)] tracking-tight leading-[1.18] max-w-4xl mx-auto"
        >
          {t('builtForPeopleHeadlinePrefix')}{' '}
          <AirBookPeopleAvatars size={52} className="align-middle inline-flex my-1" />{' '}
          {t('builtForPeopleHeadlineSuffix')}
        </motion.h2>

        {/* 3 Clean Spaced Icon Columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 sm:gap-14 mt-12 sm:mt-16 max-w-4xl mx-auto">
          {/* Column 1: Easy to use */}
          <motion.div
            initial={{ y: 16, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.3 }}
            className="flex flex-col items-center text-center space-y-4"
          >
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-[var(--text-primary)]">
              <CursorClick24Regular className="w-10 h-10 stroke-[1.2]" />
            </div>
            <p className="text-sm sm:text-base font-bold text-[var(--text-secondary)] max-w-[220px] leading-snug">
              {t('peopleValue1')}
            </p>
          </motion.div>

          {/* Column 2: Bring teams together */}
          <motion.div
            initial={{ y: 16, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.18, duration: 0.3 }}
            className="flex flex-col items-center text-center space-y-4"
          >
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-[var(--text-primary)]">
              <PeopleCommunity24Regular className="w-10 h-10 stroke-[1.2]" />
            </div>
            <p className="text-sm sm:text-base font-bold text-[var(--text-secondary)] max-w-[220px] leading-snug">
              {t('peopleValue2')}
            </p>
          </motion.div>

          {/* Column 3: Grow with your business */}
          <motion.div
            initial={{ y: 16, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.26, duration: 0.3 }}
            className="flex flex-col items-center text-center space-y-4"
          >
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-[var(--text-primary)]">
              <Sparkle24Regular className="w-10 h-10 stroke-[1.2]" />
            </div>
            <p className="text-sm sm:text-base font-bold text-[var(--text-secondary)] max-w-[220px] leading-snug">
              {t('peopleValue3')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* ─── ASYMMETRIC PASTEL FEATURE BENTO SHOWCASE ─── */}
      <FeatureBentoGrid />

      {/* ─── SECTION 1: THE COMPLETE 4-STEP BOOKING JOURNEY (LAVENDER STAGE) ─── */}
      <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-20 relative z-10">
        <div className="p-6 sm:p-12 lg:p-14 rounded-[36px] sm:rounded-[48px] bg-gradient-to-br from-[#F6F3FF] via-[#FAF8FF] to-[#EFF6FF] dark:from-purple-950/20 dark:via-purple-900/10 dark:to-sky-950/20 border border-purple-100/80 dark:border-purple-900/30 shadow-xl space-y-10">
          <div className="max-w-2xl space-y-3 text-left">
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#AF52DE]">
              {t('howItWorksSubtitle')}
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-[var(--text-primary)] tracking-tight">
              {t('basicsTitle')}
            </h2>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed font-medium">
              {t('basicsDesc')}
            </p>
          </div>

          {/* Connected 4-Step Progressive Timeline */}
          <div className="relative">
            {/* Desktop Connector Track Line */}
            <div className="hidden lg:block absolute top-7 left-12 right-12 h-0.5 bg-[var(--border-subtle)] z-0" />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 relative z-10">
              {/* Step 01 */}
              <div className="p-6 rounded-3xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] space-y-3.5 shadow-sm hover:border-[#2BB5FF]/50 transition-all flex flex-col justify-start group">
                <div className="flex items-center justify-between">
                  <span className="w-9 h-9 rounded-2xl bg-[#2BB5FF]/10 text-[#2BB5FF] font-black text-xs flex items-center justify-center border border-[#2BB5FF]/20 shadow-xs">
                    01
                  </span>
                  <div className="w-8 h-8 rounded-full bg-[var(--bg-secondary)] border border-[var(--border-subtle)] flex items-center justify-center text-[var(--text-muted)] group-hover:text-[#2BB5FF] transition-colors">
                    <Globe24Regular className="w-4 h-4" />
                  </div>
                </div>
                <h3 className="text-sm font-extrabold text-[var(--text-primary)] tracking-tight">{t('step1Title')}</h3>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{t('step1Desc')}</p>
              </div>

              {/* Step 02 */}
              <div className="p-6 rounded-3xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] space-y-3.5 shadow-sm hover:border-[#2BB5FF]/50 transition-all flex flex-col justify-start group">
                <div className="flex items-center justify-between">
                  <span className="w-9 h-9 rounded-2xl bg-[#2BB5FF]/10 text-[#2BB5FF] font-black text-xs flex items-center justify-center border border-[#2BB5FF]/20 shadow-xs">
                    02
                  </span>
                  <div className="w-8 h-8 rounded-full bg-[var(--bg-secondary)] border border-[var(--border-subtle)] flex items-center justify-center text-[var(--text-muted)] group-hover:text-[#2BB5FF] transition-colors">
                    <Calendar24Regular className="w-4 h-4" />
                  </div>
                </div>
                <h3 className="text-sm font-extrabold text-[var(--text-primary)] tracking-tight">{t('step2Title')}</h3>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{t('step2Desc')}</p>
              </div>

              {/* Step 03 */}
              <div className="p-6 rounded-3xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] space-y-3.5 shadow-sm hover:border-[#2BB5FF]/50 transition-all flex flex-col justify-start group">
                <div className="flex items-center justify-between">
                  <span className="w-9 h-9 rounded-2xl bg-[#2BB5FF]/10 text-[#2BB5FF] font-black text-xs flex items-center justify-center border border-[#2BB5FF]/20 shadow-xs">
                    03
                  </span>
                  <div className="w-8 h-8 rounded-full bg-[var(--bg-secondary)] border border-[var(--border-subtle)] flex items-center justify-center text-[var(--text-muted)] group-hover:text-[#2BB5FF] transition-colors">
                    <Chat24Regular className="w-4 h-4" />
                  </div>
                </div>
                <h3 className="text-sm font-extrabold text-[var(--text-primary)] tracking-tight">{t('step3Title')}</h3>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{t('step3Desc')}</p>
              </div>

              {/* Step 04 */}
              <div className="p-6 rounded-3xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] space-y-3.5 shadow-sm hover:border-[#2BB5FF]/50 transition-all flex flex-col justify-start group">
                <div className="flex items-center justify-between">
                  <span className="w-9 h-9 rounded-2xl bg-amber-500/10 text-amber-500 font-black text-xs flex items-center justify-center border border-amber-500/20 shadow-xs">
                    04
                  </span>
                  <div className="w-8 h-8 rounded-full bg-[var(--bg-secondary)] border border-[var(--border-subtle)] flex items-center justify-center text-[var(--text-muted)] group-hover:text-amber-500 transition-colors">
                    <Star24Regular className="w-4 h-4" />
                  </div>
                </div>
                <h3 className="text-sm font-extrabold text-[var(--text-primary)] tracking-tight">{t('step4Title')}</h3>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{t('step4Desc')}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── SECTION: CLIENT TECHNICAL RECORDS & CRM (WARM AMBER / ROSE STAGE) ─── */}
      <section id="records" className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-20 relative z-10">
        <div className="p-6 sm:p-12 lg:p-14 rounded-[36px] sm:rounded-[48px] bg-gradient-to-br from-[#FFF8F3] via-[#FAF5FF] to-[#F0F8FF] dark:from-amber-950/20 dark:via-purple-950/15 dark:to-sky-950/20 border border-amber-100/80 dark:border-amber-900/30 shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Column: Editorial Value Proposition & 3 Feature Bullets */}
            <div className="lg:col-span-6 space-y-6">
              <span className="text-xs font-extrabold uppercase tracking-widest text-[#AF52DE]">
                {t('recordsEyebrow')}
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-[var(--text-primary)] tracking-tight">
                {t('recordsTitle')}
              </h2>
              <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed font-medium">
                {t('recordsDesc')}
              </p>

              {/* 3 Value Pillars */}
              <div className="space-y-3.5 pt-2">
                {/* Pillar 1: Formulas & Dwell Times */}
                <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-[var(--bg-primary)]/80 border border-[var(--border-subtle)] shadow-xs">
                  <div className="w-9 h-9 rounded-xl bg-[#AF52DE]/10 text-[#AF52DE] flex items-center justify-center flex-shrink-0 mt-0.5 border border-[#AF52DE]/20">
                    <Tag24Regular className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-xs font-black text-[var(--text-primary)]">
                      {t('recordsFeature1Title')}
                    </h3>
                    <p className="text-[11px] text-[var(--text-secondary)] leading-snug">
                      {t('recordsFeature1Desc')}
                    </p>
                  </div>
                </div>

                {/* Pillar 2: Digital Waivers & Allergy Intake */}
                <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-[var(--bg-primary)]/80 border border-[var(--border-subtle)] shadow-xs">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center flex-shrink-0 mt-0.5 border border-emerald-500/20">
                    <ShieldCheckmark24Regular className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-xs font-black text-[var(--text-primary)]">
                      {t('recordsFeature2Title')}
                    </h3>
                    <p className="text-[11px] text-[var(--text-secondary)] leading-snug">
                      {t('recordsFeature2Desc')}
                    </p>
                  </div>
                </div>

                {/* Pillar 3: Loyalty Credit & VIP Status */}
                <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-[var(--bg-primary)]/80 border border-[var(--border-subtle)] shadow-xs">
                  <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center flex-shrink-0 mt-0.5 border border-amber-500/20">
                    <Star24Regular className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-xs font-black text-[var(--text-primary)]">
                      {t('recordsFeature3Title')}
                    </h3>
                    <p className="text-[11px] text-[var(--text-secondary)] leading-snug">
                      {t('recordsFeature3Desc')}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Tactile Client Technical Ticket Showcase Widget */}
            <div className="lg:col-span-6 flex justify-center">
              <div className="w-full max-w-[460px] bg-[var(--bg-primary)] rounded-[32px] border border-[var(--border-subtle)] p-5 sm:p-6 shadow-2xl space-y-4 relative overflow-hidden">
                {/* Ambient Top Glow */}
                <div className="absolute top-0 right-0 w-48 h-48 bg-[#AF52DE]/5 rounded-full blur-3xl pointer-events-none" />

                {/* Client Ticket Header */}
                <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-3">
                  <div className="flex items-center gap-2">
                    <Person24Regular className="w-4 h-4 text-[var(--text-secondary)]" />
                    <span className="text-xs font-black uppercase tracking-wider text-[var(--text-primary)]">
                      {t('demoClientRecordTitle')}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[10px] font-black tracking-wide border border-amber-500/20 shadow-xs">
                      <Star24Regular className="w-3.5 h-3.5 text-amber-500" />
                      {t('demoClientVipBadge')}
                    </span>
                    <span className="text-[10px] font-mono font-bold text-[#AF52DE] bg-[#AF52DE]/10 px-2.5 py-1 rounded-full border border-[#AF52DE]/20">
                      #AB-1042
                    </span>
                  </div>
                </div>

                {/* Client Identity & Loyalty Capsule */}
                <div className="flex items-center justify-between p-3 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)]">
                  <div className="flex items-center gap-3">
                    <img
                      src={getDemoClient(language).avatar}
                      alt={getDemoClient(language).name}
                      className="w-11 h-11 rounded-2xl object-cover border border-[var(--border-subtle)] flex-shrink-0 shadow-xs"
                    />
                    <div>
                      <p className="text-xs sm:text-sm font-black text-[var(--text-primary)]">
                        {getDemoClient(language).name}
                      </p>
                      <p className="text-[10px] text-[var(--text-secondary)] font-mono">
                        +1 •••• 8492 · {getDemoClient(language).note}
                      </p>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0 pl-2">
                    <span className="text-[10px] font-black text-[#AF52DE] bg-[#AF52DE]/10 px-2.5 py-1 rounded-full border border-[#AF52DE]/20 block">
                      {t('demoLoyaltyBalance')}
                    </span>
                  </div>
                </div>

                {/* Technical Service Spec / Formula Swatch Capsule */}
                <div className="p-3.5 sm:p-4 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] space-y-2.5 text-[11px]">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-[var(--text-muted)] flex items-center gap-1.5">
                      <Tag24Regular className="w-3.5 h-3.5 text-[var(--text-secondary)]" />
                      {t('demoFormulaLabel')}
                    </span>
                    {/* Formulation Color Swatch Dots */}
                    <div className="flex items-center -space-x-1.5">
                      <div className="w-4 h-4 rounded-full bg-[#7A4B3A] border-2 border-white dark:border-black shadow-xs" />
                      <div className="w-4 h-4 rounded-full bg-[#D4A373] border-2 border-white dark:border-black shadow-xs" />
                      <div className="w-4 h-4 rounded-full bg-[#E8C5A5] border-2 border-white dark:border-black shadow-xs" />
                    </div>
                  </div>
                  <p className="text-xs font-mono font-medium text-[var(--text-secondary)] leading-relaxed">
                    {t('demoFormulaCode')}
                  </p>
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold border border-emerald-500/20">
                      {t('demoPatchTested')}
                    </span>
                    <span className="px-2.5 py-1 rounded-lg bg-[var(--bg-primary)] text-[var(--text-secondary)] text-[10px] font-bold border border-[var(--border-subtle)]">
                      {t('demoPrefQuiet')}
                    </span>
                  </div>
                </div>

                {/* Security & Instant Sync Footer */}
                <div className="pt-2.5 border-t border-[var(--border-subtle)] flex flex-wrap items-center justify-between gap-2 text-[10px] font-bold text-[var(--text-secondary)]">
                  <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                    <ShieldCheckmark24Regular className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                    {t('demoStripeProtected')}
                  </span>
                  <span className="flex items-center gap-1.5 text-[#2BB5FF]">
                    <CheckmarkCircle24Regular className="w-3.5 h-3.5 text-[#2BB5FF] flex-shrink-0" />
                    {t('demoCalendarSynced')}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── SECTION 2: RETENTION & CLIENT SATISFACTION (SKY STAGE) ─── */}
      <section id="crm" className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-20 relative z-10">
        <div className="p-6 sm:p-12 lg:p-14 rounded-[36px] sm:rounded-[48px] bg-gradient-to-br from-[#F0F8FF] via-[#F4F9FF] to-[#F5F3FF] dark:from-sky-950/20 dark:via-sky-900/10 dark:to-purple-950/20 border border-sky-100/80 dark:border-sky-900/30 shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Column: Value Proposition & Interactive Triggers */}
            <div className="lg:col-span-6 space-y-5">
              <span className="text-xs font-extrabold uppercase tracking-widest text-[#2BB5FF]">
                {t('retentionEyebrow')}
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-[var(--text-primary)] tracking-tight">
                {t('retentionTitle')}
              </h2>
              <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed font-medium">
                {t('retentionDesc')}
              </p>

              {/* Interactive Workflow Triggers */}
              <div className="space-y-3 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveRetentionTab('rebook')}
                  className={`w-full text-left flex items-center gap-3.5 p-4 rounded-2xl border transition-all cursor-pointer ${
                    activeRetentionTab === 'rebook'
                      ? 'bg-[var(--bg-primary)] border-[#2BB5FF] shadow-md ring-2 ring-[#2BB5FF]/20'
                      : 'bg-[var(--bg-primary)]/70 border-[var(--border-subtle)] hover:border-[#2BB5FF]/40 shadow-xs'
                  }`}
                >
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors ${
                    activeRetentionTab === 'rebook' ? 'bg-[#2BB5FF] text-white shadow-xs' : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                  }`}>
                    <Chat24Regular className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="text-xs font-black text-[var(--text-primary)]">{t('retentionTabRebook')}</span>
                      <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">3 Weeks</span>
                    </div>
                    <p className="text-[11px] text-[var(--text-secondary)] leading-snug">
                      {t('retentionPoint1')}
                    </p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveRetentionTab('review')}
                  className={`w-full text-left flex items-center gap-3.5 p-4 rounded-2xl border transition-all cursor-pointer ${
                    activeRetentionTab === 'review'
                      ? 'bg-[var(--bg-primary)] border-amber-500 shadow-md ring-2 ring-amber-500/20'
                      : 'bg-[var(--bg-primary)]/70 border-[var(--border-subtle)] hover:border-amber-500/40 shadow-xs'
                  }`}
                >
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors ${
                    activeRetentionTab === 'review' ? 'bg-amber-500 text-white shadow-xs' : 'bg-amber-500/10 text-amber-500'
                  }`}>
                    <Star24Regular className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="text-xs font-black text-[var(--text-primary)]">{t('retentionTabReview')}</span>
                      <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full">+1 Hour</span>
                    </div>
                    <p className="text-[11px] text-[var(--text-secondary)] leading-snug">
                      {t('retentionPoint2')}
                    </p>
                  </div>
                </button>
              </div>
            </div>

            {/* Right Column: Realistic iPhone Mockup with Messages UI */}
            <div className="lg:col-span-6 flex justify-center">
              <div className="w-full max-w-[370px] sm:max-w-[390px] rounded-[50px] p-3 sm:p-3.5 bg-neutral-900 border-[3.5px] border-neutral-700/80 dark:border-neutral-800 shadow-[0_30px_70px_-15px_rgba(0,0,0,0.4),0_0_0_1px_rgba(255,255,255,0.08)] relative">
                {/* Phone Inner Screen */}
                <div className="rounded-[40px] bg-[var(--bg-primary)] overflow-hidden border border-black/10 dark:border-white/5 flex flex-col justify-between min-h-[480px] sm:min-h-[500px]">
                  
                  {/* iOS Status Bar & Dynamic Island */}
                  <div className="pt-3 px-5 pb-2 border-b border-[var(--border-subtle)] bg-[var(--bg-primary)]">
                    <div className="flex items-center justify-between text-[11px] font-bold text-[var(--text-primary)]">
                      <span>9:41</span>
                      {/* Dynamic Island */}
                      <div className="w-20 h-4 rounded-full bg-black flex items-center justify-end px-1.5 shadow-inner">
                        <span className="w-1.5 h-1.5 rounded-full bg-neutral-800" />
                      </div>
                      <div className="flex items-center gap-1.5 text-[10px]">
                        {/* Cellular Signal Bars */}
                        <div className="flex items-end gap-[1.5px] h-2.5">
                          <span className="w-[2.5px] h-1 bg-[var(--text-primary)] rounded-xs" />
                          <span className="w-[2.5px] h-1.5 bg-[var(--text-primary)] rounded-xs" />
                          <span className="w-[2.5px] h-2 bg-[var(--text-primary)] rounded-xs" />
                          <span className="w-[2.5px] h-2.5 bg-[var(--text-primary)] rounded-xs" />
                        </div>
                        {/* Battery Icon */}
                        <div className="w-4.5 h-2.5 rounded-[3px] border border-[var(--text-primary)] p-[1px] flex items-center">
                          <div className="w-full h-full bg-[var(--text-primary)] rounded-[1.5px]" />
                        </div>
                      </div>
                    </div>

                      {/* Messages Navigation Header */}
                    <div className="flex items-center justify-between pt-3 pb-1">
                      <div className="flex items-center gap-1 w-9">
                        <ChevronLeft24Filled className="w-4 h-4 text-[#2BB5FF] cursor-pointer" />
                        <span className="text-xs font-semibold text-[#2BB5FF]">12</span>
                      </div>
                      
                      <div className="flex flex-col items-center">
                        <div className="relative">
                          <img
                            src={
                              activeRetentionTab === 'rebook'
                                ? 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&auto=format&fit=crop&q=80'
                                : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'
                            }
                            alt={activeRetentionTab === 'rebook' ? t('retentionRebookSender') : t('retentionReviewSender')}
                            className="w-9 h-9 rounded-full object-cover border border-[var(--border-subtle)] shadow-xs"
                          />
                          <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-[var(--bg-primary)]" />
                        </div>
                        <div className="flex items-center gap-1 pt-1">
                          <p className="text-xs font-black text-[var(--text-primary)]">
                            {activeRetentionTab === 'rebook' ? t('retentionRebookSender') : t('retentionReviewSender')}
                          </p>
                          <CheckmarkCircle24Filled className="w-3.5 h-3.5 text-[#2BB5FF]" />
                        </div>
                        <p className="text-[9px] text-[var(--text-muted)] font-medium">
                          {activeRetentionTab === 'rebook' ? t('retentionRebookStudio') : t('retentionReviewStudio')}
                        </p>
                      </div>

                      {/* Optical Balance Spacer */}
                      <div className="w-9" />
                    </div>
                  </div>

                  {/* Messages Thread Body */}
                  <div className="p-4 sm:p-5 flex-1 flex flex-col justify-start space-y-3">
                    {/* Centered Timestamp */}
                    <div className="text-center">
                      <span className="text-[10px] font-semibold text-[var(--text-muted)] tracking-wide">
                        {t('retentionImessageHeaderToday')}
                      </span>
                    </div>

                    {/* Animated Speech Bubble / Rich Card */}
                    <AnimatePresence mode="wait">
                      {activeRetentionTab === 'rebook' ? (
                        <motion.div
                          key="rebook"
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -6 }}
                          transition={{ duration: 0.18 }}
                          className="space-y-2"
                        >
                          {/* Rich Card Container */}
                          <div className="rounded-[20px] rounded-bl-[4px] bg-[var(--bg-secondary)] border border-[var(--border-subtle)] overflow-hidden shadow-xs">
                            {/* Top Hero Visual Banner */}
                            <div className="relative h-28 sm:h-32 w-full overflow-hidden bg-neutral-800">
                              <img
                                src="https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=600&auto=format&fit=crop&q=80"
                                alt={t('retentionRebookCardBannerTitle')}
                                className="w-full h-full object-cover opacity-90 hover:scale-105 transition-transform duration-500"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-3">
                                <span className="text-[10px] font-bold text-white bg-black/50 backdrop-blur-md px-2 py-0.5 rounded-md border border-white/20">
                                  {t('retentionRebookStudio')} · Chair #2
                                </span>
                              </div>
                            </div>

                            {/* Card Content & Native OS Action */}
                            <div className="p-3.5 sm:p-4 space-y-3">
                              <div className="space-y-1">
                                <h4 className="text-xs sm:text-sm font-extrabold text-[var(--text-primary)]">
                                  {t('retentionRebookCardBannerTitle')}
                                </h4>
                                <p className="text-[11px] sm:text-xs leading-relaxed text-[var(--text-secondary)] font-medium">
                                  {t('retentionRebookMessage')}
                                </p>
                              </div>

                              {/* Native OS Neutral Action Pill */}
                              <div className="w-full py-2 px-3.5 rounded-full bg-black/10 dark:bg-white/10 hover:bg-black/15 dark:hover:bg-white/15 border border-black/5 dark:border-white/5 flex items-center justify-between text-xs font-bold text-[var(--text-primary)] transition-all cursor-pointer group shadow-xs">
                                <span>{t('retentionRebookActionPill')}</span>
                                <ChevronRight24Filled className="w-3.5 h-3.5 opacity-60 group-hover:translate-x-0.5 group-hover:opacity-100 transition-all" />
                              </div>
                            </div>
                          </div>

                          <p className="text-[9px] text-[var(--text-muted)] pl-2 font-medium">
                            {t('retentionRebookFootnote')}
                          </p>
                        </motion.div>
                      ) : (
                        <motion.div
                          key="review"
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -6 }}
                          transition={{ duration: 0.18 }}
                          className="space-y-2"
                        >
                          {/* Rich Card Container */}
                          <div className="rounded-[20px] rounded-bl-[4px] bg-[var(--bg-secondary)] border border-[var(--border-subtle)] overflow-hidden shadow-xs">
                            {/* Top Hero Visual Banner */}
                            <div className="relative h-28 sm:h-32 w-full overflow-hidden bg-neutral-800">
                              <img
                                src="https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600&auto=format&fit=crop&q=80"
                                alt={t('retentionReviewCardBannerTitle')}
                                className="w-full h-full object-cover opacity-90 hover:scale-105 transition-transform duration-500"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end justify-between p-3">
                                <span className="text-[10px] font-bold text-white bg-black/50 backdrop-blur-md px-2 py-0.5 rounded-md border border-white/20">
                                  {t('retentionReviewStudio')}
                                </span>
                                <span className="text-[10px] font-bold text-amber-400 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-md border border-amber-400/30 flex items-center gap-1">
                                  <span>5.0</span>
                                  <span>★★★★★</span>
                                </span>
                              </div>
                            </div>

                            {/* Card Content & Native OS Action */}
                            <div className="p-3.5 sm:p-4 space-y-3">
                              <div className="space-y-1">
                                <h4 className="text-xs sm:text-sm font-extrabold text-[var(--text-primary)]">
                                  {t('retentionReviewCardBannerTitle')}
                                </h4>
                                <p className="text-[11px] sm:text-xs leading-relaxed text-[var(--text-secondary)] font-medium">
                                  {t('retentionReviewMessage')}
                                </p>
                              </div>

                              {/* Native OS Neutral Action Pill */}
                              <div className="w-full py-2 px-3.5 rounded-full bg-black/10 dark:bg-white/10 hover:bg-black/15 dark:hover:bg-white/15 border border-black/5 dark:border-white/5 flex items-center justify-between text-xs font-bold text-[var(--text-primary)] transition-all cursor-pointer group shadow-xs">
                                <span>{t('retentionReviewActionPill')}</span>
                                <ChevronRight24Filled className="w-3.5 h-3.5 opacity-60 group-hover:translate-x-0.5 group-hover:opacity-100 transition-all" />
                              </div>
                            </div>
                          </div>

                          <p className="text-[9px] text-[var(--text-muted)] pl-2 font-medium">
                            {t('retentionReviewFootnote')}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* iOS Message Input Bar & Home Indicator */}
                  <div className="p-3 bg-[var(--bg-primary)] border-t border-[var(--border-subtle)]">
                    <div className="flex items-center gap-2 p-2 rounded-full bg-[var(--bg-secondary)] border border-[var(--border-subtle)] px-3 text-xs text-[var(--text-muted)]">
                      <span className="flex-1 font-medium">iMessage</span>
                      <div className="w-5 h-5 rounded-full bg-[#2BB5FF] text-white flex items-center justify-center flex-shrink-0 shadow-xs">
                        <ArrowUp24Filled className="w-3.5 h-3.5" />
                      </div>
                    </div>
                    {/* Home Indicator Bar */}
                    <div className="w-28 h-1 rounded-full bg-neutral-400/40 dark:bg-neutral-600/40 mx-auto mt-2.5" />
                  </div>

                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── INDUSTRY SOLUTIONS SHOWCASE (SEGMENTED TABS) ─── */}
      <section id="solutions" className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-3">
          <span className="text-xs font-extrabold uppercase tracking-widest text-[#AF52DE]">
            {t('solutionsSubtitle')}
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-[var(--text-primary)] tracking-tight">
            {t('solutionsTitle')}
          </h2>
        </div>

        {/* Compact Active Tab Navigator with Side Arrows & Progress Timer Bar */}
        <div 
          className="flex flex-col items-center justify-center max-w-md mx-auto mb-8 px-4"
          onMouseEnter={() => setIsSolutionHovered(true)}
          onMouseLeave={() => setIsSolutionHovered(false)}
        >
          <div className="w-full flex items-center justify-between p-1.5 rounded-full bg-[var(--bg-secondary)] border border-[var(--border-subtle)] shadow-sm relative overflow-hidden">
            {/* Left Cycle Arrow Button */}
            <button
              type="button"
              onClick={handlePrevSolution}
              aria-label="Previous specialty"
              className="w-9 h-9 rounded-full bg-[var(--bg-primary)] hover:bg-black/5 dark:hover:bg-white/10 text-[var(--text-primary)] border border-[var(--border-subtle)] flex items-center justify-center transition-all active:scale-95 cursor-pointer flex-shrink-0 z-10 shadow-xs"
            >
              <ChevronLeft24Filled className="w-4 h-4" />
            </button>

            {/* Active Specialty Pill & Label with Slide Transition */}
            <div className="flex-1 flex items-center justify-center px-3 z-10 min-w-0">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTabObj.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.18 }}
                  className="flex items-center gap-2 max-w-full"
                >
                  <div className="w-6 h-6 rounded-full bg-black text-white dark:bg-white dark:text-black flex items-center justify-center flex-shrink-0 shadow-xs">
                    <ActiveSolutionIcon className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs sm:text-sm font-extrabold text-[var(--text-primary)] truncate">
                    {activeTabObj.label}
                  </span>
                  <span className="text-[10px] font-bold text-[var(--text-muted)] bg-[var(--bg-primary)] px-2 py-0.5 rounded-full border border-[var(--border-subtle)] flex-shrink-0">
                    {activeSolutionIndex + 1}/{INDUSTRY_TABS.length}
                  </span>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Right Cycle Arrow Button */}
            <button
              type="button"
              onClick={handleNextSolution}
              aria-label="Next specialty"
              className="w-9 h-9 rounded-full bg-[var(--bg-primary)] hover:bg-black/5 dark:hover:bg-white/10 text-[var(--text-primary)] border border-[var(--border-subtle)] flex items-center justify-center transition-all active:scale-95 cursor-pointer flex-shrink-0 z-10 shadow-xs"
            >
              <ChevronRight24Filled className="w-4 h-4" />
            </button>

            {/* Continuous Linear Progress Bar indicating Auto-Advance Timer */}
            <div
              className="absolute bottom-0 left-0 h-[2.5px] bg-gradient-to-r from-[#2BB5FF] via-[#AF52DE] to-[#2BB5FF] transition-all duration-75 rounded-full"
              style={{ width: `${solutionProgress}%` }}
            />
          </div>
        </div>

        {/* Tab Content Display */}
        <div 
          className="max-w-5xl mx-auto rounded-[32px] sm:rounded-[36px] bg-[var(--bg-secondary)] border border-[var(--border-subtle)] p-0 shadow-xl min-h-[300px] overflow-hidden"
          onMouseEnter={() => setIsSolutionHovered(true)}
          onMouseLeave={() => setIsSolutionHovered(false)}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSolutionTab}
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
            >
              {activeSolutionTab === 'hair' && (
                <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch min-h-[480px]">
                  {/* Left: Value Proposition & Live AirBook Ticket */}
                  <div className="lg:col-span-6 p-6 sm:p-8 lg:p-10 flex flex-col justify-between space-y-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-[var(--text-primary)]">{t('tabHair')}</h3>
                        <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">{t('solHairDesc')}</p>
                      </div>

                      <ul className="text-xs sm:text-sm space-y-2 font-bold text-[var(--text-primary)]">
                        <li className="flex items-center gap-2.5">
                          <CheckmarkCircle24Regular className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                          <span>Client formula history &amp; processing timers</span>
                        </li>
                        <li className="flex items-center gap-2.5">
                          <CheckmarkCircle24Regular className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                          <span>Color swatch ratio &amp; developer logs</span>
                        </li>
                        <li className="flex items-center gap-2.5">
                          <CheckmarkCircle24Regular className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                          <span>Digital patch test waiver signatures</span>
                        </li>
                      </ul>
                    </div>

                    {/* Live Contextual AirBook UI Card */}
                    <div className="p-4 sm:p-5 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] shadow-sm flex flex-col justify-between gap-3 transition-all hover:border-[var(--color-accent-primary)]/40 hover:shadow-md">
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-[var(--text-primary)] flex items-center justify-center font-bold text-xs shadow-xs">
                            ER
                          </div>
                          <div>
                            <p className="text-xs font-bold text-[var(--text-primary)]">Elena Rostova</p>
                            <p className="text-[10px] text-[var(--text-muted)]">Balayage Client</p>
                          </div>
                        </div>
                        <span className="px-2.5 py-1 rounded-full bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-[10px] font-bold text-[var(--text-secondary)]">
                          Formula #1042
                        </span>
                      </div>

                      <div className="p-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] flex flex-col gap-1.5 w-full">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-[var(--text-primary)]">6N Dark Blonde + 20vol Matrix</span>
                          <span className="text-[10px] font-bold text-[var(--color-accent-primary)]">35 min</span>
                        </div>
                        <p className="text-[11px] text-[var(--text-secondary)]">Light Master 1:2 ratio with 15m Gloss Glaze</p>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-[var(--border-subtle)] text-[11px] w-full">
                        <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-semibold">
                          <CheckmarkCircle24Filled className="w-3.5 h-3.5 flex-shrink-0" />
                          <span>Logged by Roxanne V.</span>
                        </div>
                        <span className="text-[10px] text-[var(--text-muted)]">Profile Synced</span>
                      </div>
                    </div>
                  </div>

                  {/* Right: 100% Unobstructed High-Resolution Editorial Photograph extending Top-to-Bottom */}
                  <div className="lg:col-span-6 relative h-[340px] sm:h-[400px] lg:h-auto min-h-full overflow-hidden border-t lg:border-t-0 lg:border-l border-[var(--border-subtle)] group bg-[var(--bg-primary)]">
                    <img
                      src="/brand/photos/candid/hair-salon.jpg"
                      alt={t('tabHair')}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />

                    <div className="absolute top-4 right-4 z-10">
                      <span className="text-[10px] font-bold text-white bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20 shadow-sm flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        <span>Salon Station #4</span>
                      </span>
                    </div>

                    <div className="absolute bottom-4 left-4 right-4 z-10 p-3 rounded-2xl bg-black/55 backdrop-blur-md border border-white/15 text-white flex items-center justify-between shadow-lg">
                      <div className="flex items-center gap-2">
                        <Sparkle24Regular className="w-4 h-4 text-[#2BB5FF]" />
                        <span className="text-xs font-bold tracking-tight">Master Color Artistry</span>
                      </div>
                      <span className="text-[10px] text-white/80 font-medium">Bespoke Suite</span>
                    </div>
                  </div>
                </div>
              )}

              {activeSolutionTab === 'barber' && (
                <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch min-h-[480px]">
                  {/* Left: Value Proposition & Live AirBook Ticket */}
                  <div className="lg:col-span-6 p-6 sm:p-8 lg:p-10 flex flex-col justify-between space-y-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-[var(--text-primary)]">{t('tabBarber')}</h3>
                        <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">{t('solBarberDesc')}</p>
                      </div>

                      <ul className="text-xs sm:text-sm space-y-2 font-bold text-[var(--text-primary)]">
                        <li className="flex items-center gap-2.5">
                          <CheckmarkCircle24Regular className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                          <span>Self-serve iPad walk-in kiosk queue</span>
                        </li>
                        <li className="flex items-center gap-2.5">
                          <CheckmarkCircle24Regular className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                          <span>Tap-to-Pay contactless checkouts in &lt;5s</span>
                        </li>
                        <li className="flex items-center gap-2.5">
                          <CheckmarkCircle24Regular className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                          <span>Automated 3-week haircut re-booking SMS</span>
                        </li>
                      </ul>
                    </div>

                    {/* Live Contextual AirBook UI Card */}
                    <div className="p-4 sm:p-5 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] shadow-sm flex flex-col justify-between gap-3 transition-all hover:border-[var(--color-accent-primary)]/40 hover:shadow-md">
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-[var(--text-primary)] flex items-center justify-center font-bold text-xs shadow-xs">
                            MB
                          </div>
                          <div>
                            <p className="text-xs font-bold text-[var(--text-primary)]">Marcus B.</p>
                            <p className="text-[10px] text-[var(--text-muted)]">Skin Fade &amp; Lineup</p>
                          </div>
                        </div>
                        <span className="px-2.5 py-1 rounded-full bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-[10px] font-bold text-[var(--text-secondary)] flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          <span>Chair #1</span>
                        </span>
                      </div>

                      <div className="p-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] flex flex-col gap-2 w-full">
                        <div className="flex items-center justify-between text-xs font-bold">
                          <span className="text-[var(--text-primary)]">Service Progress</span>
                          <span className="text-emerald-600 dark:text-emerald-400 font-semibold">5 min left</span>
                        </div>
                        <div className="w-full h-2 bg-[var(--bg-primary)] rounded-full overflow-hidden border border-[var(--border-subtle)]">
                          <div className="h-full bg-emerald-500 rounded-full w-[80%]" />
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-[var(--border-subtle)] text-[11px] w-full">
                        <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-semibold">
                          <CheckmarkCircle24Filled className="w-3.5 h-3.5 flex-shrink-0" />
                          <span>Next Client SMS Dispatched</span>
                        </div>
                        <span className="text-[10px] text-[var(--text-muted)]">Live Kiosk</span>
                      </div>
                    </div>
                  </div>

                  {/* Right: 100% Unobstructed High-Resolution Editorial Photograph extending Top-to-Bottom */}
                  <div className="lg:col-span-6 relative h-[340px] sm:h-[400px] lg:h-auto min-h-full overflow-hidden border-t lg:border-t-0 lg:border-l border-[var(--border-subtle)] group bg-[var(--bg-primary)]">
                    <img
                      src="/brand/photos/candid/barbershop.jpg"
                      alt={t('tabBarber')}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />

                    <div className="absolute top-4 right-4 z-10">
                      <span className="text-[10px] font-bold text-white bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20 shadow-sm flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        <span>Barber Chair #1</span>
                      </span>
                    </div>

                    <div className="absolute bottom-4 left-4 right-4 z-10 p-3 rounded-2xl bg-black/55 backdrop-blur-md border border-white/15 text-white flex items-center justify-between shadow-lg">
                      <div className="flex items-center gap-2">
                        <Sparkle24Regular className="w-4 h-4 text-[#2BB5FF]" />
                        <span className="text-xs font-bold tracking-tight">Precision Fade &amp; Shave</span>
                      </div>
                      <span className="text-[10px] text-white/80 font-medium">Walk-In Kiosk</span>
                    </div>
                  </div>
                </div>
              )}

              {activeSolutionTab === 'medspa' && (
                <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch min-h-[480px]">
                  {/* Left: Value Proposition & Live AirBook Ticket */}
                  <div className="lg:col-span-6 p-6 sm:p-8 lg:p-10 flex flex-col justify-between space-y-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-[var(--text-primary)]">{t('tabMedspa')}</h3>
                        <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">{t('solMedspaDesc')}</p>
                      </div>

                      <ul className="text-xs sm:text-sm space-y-2 font-bold text-[var(--text-primary)]">
                        <li className="flex items-center gap-2.5">
                          <CheckmarkCircle24Regular className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                          <span>Digital consent waivers with finger signatures</span>
                        </li>
                        <li className="flex items-center gap-2.5">
                          <CheckmarkCircle24Regular className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                          <span>Client allergy &amp; contraindication charts</span>
                        </li>
                        <li className="flex items-center gap-2.5">
                          <CheckmarkCircle24Regular className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                          <span>Before and after photo comparison records</span>
                        </li>
                      </ul>
                    </div>

                    {/* Live Contextual AirBook UI Card */}
                    <div className="p-4 sm:p-5 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] shadow-sm flex flex-col justify-between gap-3 transition-all hover:border-[var(--color-accent-primary)]/40 hover:shadow-md">
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-[var(--text-primary)] flex items-center justify-center font-bold text-xs shadow-xs">
                            SM
                          </div>
                          <div>
                            <p className="text-xs font-bold text-[var(--text-primary)]">Sophia Montgomery</p>
                            <p className="text-[10px] text-[var(--text-muted)]">Microneedling &amp; Peel</p>
                          </div>
                        </div>
                        <span className="px-2.5 py-1 rounded-full bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-[10px] font-bold text-[var(--text-secondary)]">
                          Consent #8821
                        </span>
                      </div>

                      <div className="p-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] flex items-center justify-between w-full">
                        <span className="font-serif italic text-sm text-[var(--text-primary)] border-b border-[var(--text-primary)] pb-0.5">
                          Sophia Montgomery
                        </span>
                        <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                          <LockClosed24Regular className="w-3.5 h-3.5" />
                          <span>eSign Verified</span>
                        </span>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-[var(--border-subtle)] text-[11px] w-full">
                        <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-semibold">
                          <CheckmarkCircle24Filled className="w-3.5 h-3.5 flex-shrink-0" />
                          <span>$140.00 Deposit Secured</span>
                        </div>
                        <span className="text-[10px] text-[var(--text-muted)]">Direct Payout</span>
                      </div>
                    </div>
                  </div>

                  {/* Right: 100% Unobstructed High-Resolution Editorial Photograph extending Top-to-Bottom */}
                  <div className="lg:col-span-6 relative h-[340px] sm:h-[400px] lg:h-auto min-h-full overflow-hidden border-t lg:border-t-0 lg:border-l border-[var(--border-subtle)] group bg-[var(--bg-primary)]">
                    <img
                      src="/brand/photos/candid/medspa-esthetician.jpg"
                      alt={t('tabMedspa')}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />

                    <div className="absolute top-4 right-4 z-10">
                      <span className="text-[10px] font-bold text-white bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20 shadow-sm flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        <span>Esthetics Suite</span>
                      </span>
                    </div>

                    <div className="absolute bottom-4 left-4 right-4 z-10 p-3 rounded-2xl bg-black/55 backdrop-blur-md border border-white/15 text-white flex items-center justify-between shadow-lg">
                      <div className="flex items-center gap-2">
                        <Sparkle24Regular className="w-4 h-4 text-[#2BB5FF]" />
                        <span className="text-xs font-bold tracking-tight">Clinical Skincare &amp; Esthetics</span>
                      </div>
                      <span className="text-[10px] text-white/80 font-medium">eSign Intake</span>
                    </div>
                  </div>
                </div>
              )}

              {activeSolutionTab === 'nails' && (
                <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch min-h-[480px]">
                  {/* Left: Value Proposition & Live AirBook Ticket */}
                  <div className="lg:col-span-6 p-6 sm:p-8 lg:p-10 flex flex-col justify-between space-y-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-[var(--text-primary)]">{t('tabNails')}</h3>
                        <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">{t('solNailsDesc')}</p>
                      </div>

                      <ul className="text-xs sm:text-sm space-y-2 font-bold text-[var(--text-primary)]">
                        <li className="flex items-center gap-2.5">
                          <CheckmarkCircle24Regular className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                          <span>Multi-service tiered add-ons (Art, Gel, Length)</span>
                        </li>
                        <li className="flex items-center gap-2.5">
                          <CheckmarkCircle24Regular className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                          <span>Group party simultaneous booking engine</span>
                        </li>
                        <li className="flex items-center gap-2.5">
                          <CheckmarkCircle24Regular className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                          <span>Card deposit protection against no-shows</span>
                        </li>
                      </ul>
                    </div>

                    {/* Live Contextual AirBook UI Card */}
                    <div className="p-4 sm:p-5 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] shadow-sm flex flex-col justify-between gap-3 transition-all hover:border-[var(--color-accent-primary)]/40 hover:shadow-md">
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-[var(--text-primary)] flex items-center justify-center font-bold text-xs shadow-xs">
                            CM
                          </div>
                          <div>
                            <p className="text-xs font-bold text-[var(--text-primary)]">Chloe M. &amp; Guests</p>
                            <p className="text-[10px] text-[var(--text-muted)]">Bridal Group</p>
                          </div>
                        </div>
                        <span className="px-2.5 py-1 rounded-full bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-[10px] font-bold text-[var(--text-secondary)]">
                          3 Guests · 2:00 PM
                        </span>
                      </div>

                      <div className="p-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] flex flex-col gap-1.5 w-full text-xs">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-[var(--text-primary)]">Russian Manicure + Gel-X Art</span>
                          <span className="font-bold text-[var(--text-primary)]">$205.00</span>
                        </div>
                        <p className="text-[11px] text-[var(--text-secondary)]">Simultaneous booking across 3 styling bays</p>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-[var(--border-subtle)] text-[11px] w-full">
                        <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-semibold">
                          <CheckmarkCircle24Filled className="w-3.5 h-3.5 flex-shrink-0" />
                          <span>$75.00 Deposit Captured</span>
                        </div>
                        <span className="text-[10px] text-[var(--text-muted)]">No-Show Guard</span>
                      </div>
                    </div>
                  </div>

                  {/* Right: 100% Unobstructed High-Resolution Editorial Photograph extending Top-to-Bottom */}
                  <div className="lg:col-span-6 relative h-[340px] sm:h-[400px] lg:h-auto min-h-full overflow-hidden border-t lg:border-t-0 lg:border-l border-[var(--border-subtle)] group bg-[var(--bg-primary)]">
                    <img
                      src="/brand/photos/candid/nail-studio.jpg"
                      alt={t('tabNails')}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />

                    <div className="absolute top-4 right-4 z-10">
                      <span className="text-[10px] font-bold text-white bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20 shadow-sm flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        <span>Nail Bar Bay #3</span>
                      </span>
                    </div>

                    <div className="absolute bottom-4 left-4 right-4 z-10 p-3 rounded-2xl bg-black/55 backdrop-blur-md border border-white/15 text-white flex items-center justify-between shadow-lg">
                      <div className="flex items-center gap-2">
                        <Sparkle24Regular className="w-4 h-4 text-[#2BB5FF]" />
                        <span className="text-xs font-bold tracking-tight">Artistic Nail Styling</span>
                      </div>
                      <span className="text-[10px] text-white/80 font-medium">Group Party Engine</span>
                    </div>
                  </div>
                </div>
              )}

              {activeSolutionTab === 'tattoo' && (
                <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch min-h-[480px]">
                  {/* Left: Value Proposition & Live AirBook Ticket */}
                  <div className="lg:col-span-6 p-6 sm:p-8 lg:p-10 flex flex-col justify-between space-y-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-[var(--text-primary)]">{t('tabTattoo')}</h3>
                        <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">{t('solTattooDesc')}</p>
                      </div>

                      <ul className="text-xs sm:text-sm space-y-2 font-bold text-[var(--text-primary)]">
                        <li className="flex items-center gap-2.5">
                          <CheckmarkCircle24Regular className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                          <span>Multi-hour block session scheduling</span>
                        </li>
                        <li className="flex items-center gap-2.5">
                          <CheckmarkCircle24Regular className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                          <span>Consultation deposit lock &amp; design notes</span>
                        </li>
                        <li className="flex items-center gap-2.5">
                          <CheckmarkCircle24Regular className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                          <span>Digital liability waiver signatures</span>
                        </li>
                      </ul>
                    </div>

                    {/* Live Contextual AirBook UI Card */}
                    <div className="p-4 sm:p-5 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] shadow-sm flex flex-col justify-between gap-3 transition-all hover:border-[var(--color-accent-primary)]/40 hover:shadow-md">
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-[var(--text-primary)] flex items-center justify-center font-bold text-xs shadow-xs">
                            AL
                          </div>
                          <div>
                            <p className="text-xs font-bold text-[var(--text-primary)]">Custom Sleeve Project</p>
                            <p className="text-[10px] text-[var(--text-muted)]">Left Forearm Block</p>
                          </div>
                        </div>
                        <span className="px-2.5 py-1 rounded-full bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-[10px] font-bold text-[var(--text-secondary)]">
                          Session 2 of 4
                        </span>
                      </div>

                      <div className="p-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] flex flex-col gap-1.5 w-full">
                        <div className="flex items-center justify-between text-xs font-bold">
                          <span className="text-[var(--text-primary)]">4h Dedicated Session Block</span>
                          <span className="text-[var(--color-accent-primary)] font-bold">1:00 – 5:00 PM</span>
                        </div>
                        <p className="text-[11px] text-[var(--text-secondary)]">3RL Fine Line contour + Dynamic Greywash</p>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-[var(--border-subtle)] text-[11px] w-full">
                        <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-semibold">
                          <CheckmarkCircle24Filled className="w-3.5 h-3.5 flex-shrink-0" />
                          <span>Waiver Signed &amp; $200 Held</span>
                        </div>
                        <span className="text-[10px] text-[var(--text-muted)]">Deposit Guard</span>
                      </div>
                    </div>
                  </div>

                  {/* Right: 100% Unobstructed High-Resolution Editorial Photograph extending Top-to-Bottom */}
                  <div className="lg:col-span-6 relative h-[340px] sm:h-[400px] lg:h-auto min-h-full overflow-hidden border-t lg:border-t-0 lg:border-l border-[var(--border-subtle)] group bg-[var(--bg-primary)]">
                    <img
                      src="/brand/photos/candid/tattoo-artist.jpg"
                      alt={t('tabTattoo')}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />

                    <div className="absolute top-4 right-4 z-10">
                      <span className="text-[10px] font-bold text-white bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20 shadow-sm flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        <span>Private Studio</span>
                      </span>
                    </div>

                    <div className="absolute bottom-4 left-4 right-4 z-10 p-3 rounded-2xl bg-black/55 backdrop-blur-md border border-white/15 text-white flex items-center justify-between shadow-lg">
                      <div className="flex items-center gap-2">
                        <Sparkle24Regular className="w-4 h-4 text-[#2BB5FF]" />
                        <span className="text-xs font-bold tracking-tight">Fine-Line Atelier</span>
                      </div>
                      <span className="text-[10px] text-white/80 font-medium">Deposit Guard</span>
                    </div>
                  </div>
                </div>
              )}

              {activeSolutionTab === 'massage' && (
                <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch min-h-[480px]">
                  {/* Left: Value Proposition & Live AirBook Ticket */}
                  <div className="lg:col-span-6 p-6 sm:p-8 lg:p-10 flex flex-col justify-between space-y-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-[var(--text-primary)]">{t('tabMassage')}</h3>
                        <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">{t('solMassageDesc')}</p>
                      </div>

                      <ul className="text-xs sm:text-sm space-y-2 font-bold text-[var(--text-primary)]">
                        <li className="flex items-center gap-2.5">
                          <CheckmarkCircle24Regular className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                          <span>Treatment room prep &amp; cleanup buffer times</span>
                        </li>
                        <li className="flex items-center gap-2.5">
                          <CheckmarkCircle24Regular className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                          <span>Intake health notes &amp; pressure preferences</span>
                        </li>
                        <li className="flex items-center gap-2.5">
                          <CheckmarkCircle24Regular className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                          <span>Recurring wellness packages &amp; gift cards</span>
                        </li>
                      </ul>
                    </div>

                    {/* Live Contextual AirBook UI Card */}
                    <div className="p-4 sm:p-5 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] shadow-sm flex flex-col justify-between gap-3 transition-all hover:border-[var(--color-accent-primary)]/40 hover:shadow-md">
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-[var(--text-primary)] flex items-center justify-center font-bold text-xs shadow-xs">
                            S3
                          </div>
                          <div>
                            <p className="text-xs font-bold text-[var(--text-primary)]">Suite #3 (Zen Suite)</p>
                            <p className="text-[10px] text-[var(--text-muted)]">Deep Tissue Session</p>
                          </div>
                        </div>
                        <span className="px-2.5 py-1 rounded-full bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-[10px] font-bold text-[var(--text-secondary)]">
                          90m Block
                        </span>
                      </div>

                      <div className="p-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] flex flex-col gap-1.5 w-full">
                        <div className="flex items-center justify-between text-xs font-bold">
                          <span className="text-[var(--text-primary)]">Automated Room Turnover</span>
                          <span className="text-emerald-600 dark:text-emerald-400 font-semibold">+15m Buffer</span>
                        </div>
                        <p className="text-[11px] text-[var(--text-secondary)]">Pressure Level 4 · French Lavender Oil</p>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-[var(--border-subtle)] text-[11px] w-full">
                        <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-semibold">
                          <CheckmarkCircle24Filled className="w-3.5 h-3.5 flex-shrink-0" />
                          <span>Wellness Pass Active</span>
                        </div>
                        <span className="text-[10px] text-[var(--text-muted)]">3 / 6 Remaining</span>
                      </div>
                    </div>
                  </div>

                  {/* Right: 100% Unobstructed High-Resolution Editorial Photograph extending Top-to-Bottom */}
                  <div className="lg:col-span-6 relative h-[340px] sm:h-[400px] lg:h-auto min-h-full overflow-hidden border-t lg:border-t-0 lg:border-l border-[var(--border-subtle)] group bg-[var(--bg-primary)]">
                    <img
                      src="/brand/photos/candid/massage-wellness.jpg"
                      alt={t('tabMassage')}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />

                    <div className="absolute top-4 right-4 z-10">
                      <span className="text-[10px] font-bold text-white bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20 shadow-sm flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        <span>Zen Suite #3</span>
                      </span>
                    </div>

                    <div className="absolute bottom-4 left-4 right-4 z-10 p-3 rounded-2xl bg-black/55 backdrop-blur-md border border-white/15 text-white flex items-center justify-between shadow-lg">
                      <div className="flex items-center gap-2">
                        <Sparkle24Regular className="w-4 h-4 text-[#2BB5FF]" />
                        <span className="text-xs font-bold tracking-tight">Holistic Therapy &amp; Sanctuary</span>
                      </div>
                      <span className="text-[10px] text-white/80 font-medium">Turnover Buffer</span>
                    </div>
                  </div>
                </div>
              )}

              {activeSolutionTab === 'petgrooming' && (
                <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch min-h-[480px]">
                  {/* Left: Value Proposition & Live AirBook Ticket */}
                  <div className="lg:col-span-6 p-6 sm:p-8 lg:p-10 flex flex-col justify-between space-y-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-[var(--text-primary)]">{t('tabPetGrooming')}</h3>
                        <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">{t('solPetGroomingDesc')}</p>
                      </div>

                      <ul className="text-xs sm:text-sm space-y-2 font-bold text-[var(--text-primary)]">
                        <li className="flex items-center gap-2.5">
                          <CheckmarkCircle24Regular className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                          <span>Service tiers by breed &amp; pet weight</span>
                        </li>
                        <li className="flex items-center gap-2.5">
                          <CheckmarkCircle24Regular className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                          <span>Coat care notes &amp; rabies cert tracking</span>
                        </li>
                        <li className="flex items-center gap-2.5">
                          <CheckmarkCircle24Regular className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                          <span>Automated &quot;Pet is ready for pickup&quot; SMS</span>
                        </li>
                      </ul>
                    </div>

                    {/* Live Contextual AirBook UI Card */}
                    <div className="p-4 sm:p-5 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] shadow-sm flex flex-col justify-between gap-3 transition-all hover:border-[var(--color-accent-primary)]/40 hover:shadow-md">
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-[var(--text-primary)] flex items-center justify-center font-bold text-xs shadow-xs">
                            M
                          </div>
                          <div>
                            <p className="text-xs font-bold text-[var(--text-primary)]">Milo (Golden Doodle)</p>
                            <p className="text-[10px] text-[var(--text-muted)]">45 lbs · Large Breed</p>
                          </div>
                        </div>
                        <span className="px-2.5 py-1 rounded-full bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-[10px] font-bold text-[var(--text-secondary)]">
                          Bay #1
                        </span>
                      </div>

                      <div className="p-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] flex flex-col gap-1.5 w-full">
                        <div className="flex items-center justify-between text-xs font-bold">
                          <span className="text-[var(--text-primary)]">De-shedding + Blueberry Facial</span>
                          <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Rabies Valid</span>
                        </div>
                        <p className="text-[11px] text-[var(--text-secondary)]">Sanitary trim &amp; organic paw balm completed</p>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-[var(--border-subtle)] text-[11px] w-full">
                        <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-semibold">
                          <CheckmarkCircle24Filled className="w-3.5 h-3.5 flex-shrink-0" />
                          <span>Pickup SMS Dispatched</span>
                        </div>
                        <span className="text-[10px] text-[var(--text-muted)]">Auto Notification</span>
                      </div>
                    </div>
                  </div>

                  {/* Right: 100% Unobstructed High-Resolution Editorial Photograph extending Top-to-Bottom */}
                  <div className="lg:col-span-6 relative h-[340px] sm:h-[400px] lg:h-auto min-h-full overflow-hidden border-t lg:border-t-0 lg:border-l border-[var(--border-subtle)] group bg-[var(--bg-primary)]">
                    <img
                      src="/brand/photos/candid/pet-grooming.jpg"
                      alt={t('tabPetGrooming')}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />

                    <div className="absolute top-4 right-4 z-10">
                      <span className="text-[10px] font-bold text-white bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20 shadow-sm flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        <span>Grooming Bay #1</span>
                      </span>
                    </div>

                    <div className="absolute bottom-4 left-4 right-4 z-10 p-3 rounded-2xl bg-black/55 backdrop-blur-md border border-white/15 text-white flex items-center justify-between shadow-lg">
                      <div className="flex items-center gap-2">
                        <Sparkle24Regular className="w-4 h-4 text-[#2BB5FF]" />
                        <span className="text-xs font-bold tracking-tight">Canine Spa &amp; Styling</span>
                      </div>
                      <span className="text-[10px] text-white/80 font-medium">Pickup SMS</span>
                    </div>
                  </div>
                </div>
              )}

              {activeSolutionTab === 'fitness' && (
                <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch min-h-[480px]">
                  {/* Left: Value Proposition & Live AirBook Ticket */}
                  <div className="lg:col-span-6 p-6 sm:p-8 lg:p-10 flex flex-col justify-between space-y-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-[var(--text-primary)]">{t('tabFitness')}</h3>
                        <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">{t('solFitnessDesc')}</p>
                      </div>

                      <ul className="text-xs sm:text-sm space-y-2 font-bold text-[var(--text-primary)]">
                        <li className="flex items-center gap-2.5">
                          <CheckmarkCircle24Regular className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                          <span>1-on-1 personal training slot reservations</span>
                        </li>
                        <li className="flex items-center gap-2.5">
                          <CheckmarkCircle24Regular className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                          <span>10-session punch card credit tracking</span>
                        </li>
                        <li className="flex items-center gap-2.5">
                          <CheckmarkCircle24Regular className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                          <span>24h cancellation cutoff enforcement</span>
                        </li>
                      </ul>
                    </div>

                    {/* Live Contextual AirBook UI Card */}
                    <div className="p-4 sm:p-5 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] shadow-sm flex flex-col justify-between gap-3 transition-all hover:border-[var(--color-accent-primary)]/40 hover:shadow-md">
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-[var(--text-primary)] flex items-center justify-center font-bold text-xs shadow-xs">
                            SJ
                          </div>
                          <div>
                            <p className="text-xs font-bold text-[var(--text-primary)]">Sarah Jenkins</p>
                            <p className="text-[10px] text-[var(--text-muted)]">12-Week Transformation</p>
                          </div>
                        </div>
                        <span className="px-2.5 py-1 rounded-full bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-[10px] font-bold text-[var(--text-secondary)]">
                          8 / 10 Sessions
                        </span>
                      </div>

                      <div className="p-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] flex flex-col gap-2 w-full">
                        <div className="flex items-center justify-between text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider">
                          <span>Punch Pass Credits</span>
                          <span className="text-[var(--text-primary)]">2 Left</span>
                        </div>
                        <div className="flex items-center gap-1.5 justify-between">
                          {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                            <div
                              key={n}
                              className="w-5 h-5 rounded-full bg-[var(--text-primary)] text-[var(--bg-primary)] flex items-center justify-center text-[9px] font-black shadow-xs"
                            >
                              ✓
                            </div>
                          ))}
                          {[9, 10].map((n) => (
                            <div
                              key={n}
                              className="w-5 h-5 rounded-full border border-dashed border-[var(--border-subtle)] text-[var(--text-muted)] flex items-center justify-center text-[9px] font-bold"
                            >
                              {n}
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-[var(--border-subtle)] text-[11px] w-full">
                        <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-semibold">
                          <CheckmarkCircle24Filled className="w-3.5 h-3.5 flex-shrink-0" />
                          <span>Auto-Deducted via GPS</span>
                        </div>
                        <span className="text-[10px] text-[var(--text-muted)]">Session #8 of 10</span>
                      </div>
                    </div>
                  </div>

                  {/* Right: 100% Unobstructed High-Resolution Editorial Photograph extending Top-to-Bottom */}
                  <div className="lg:col-span-6 relative h-[340px] sm:h-[400px] lg:h-auto min-h-full overflow-hidden border-t lg:border-t-0 lg:border-l border-[var(--border-subtle)] group bg-[var(--bg-primary)]">
                    <img
                      src="/brand/photos/candid/fitness-trainer.jpg"
                      alt={t('tabFitness')}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />

                    <div className="absolute top-4 right-4 z-10">
                      <span className="text-[10px] font-bold text-white bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20 shadow-sm flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        <span>Private Training Studio</span>
                      </span>
                    </div>

                    <div className="absolute bottom-4 left-4 right-4 z-10 p-3 rounded-2xl bg-black/55 backdrop-blur-md border border-white/15 text-white flex items-center justify-between shadow-lg">
                      <div className="flex items-center gap-2">
                        <Sparkle24Regular className="w-4 h-4 text-[#2BB5FF]" />
                        <span className="text-xs font-bold tracking-tight">Athletic Conditioning</span>
                      </div>
                      <span className="text-[10px] text-white/80 font-medium">Punch Passbook</span>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* ─── PRICING MATRIX ─── */}
      <section id="pricing" className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24 relative z-10">
        <div className="text-center max-w-xl mx-auto mb-10 sm:mb-14 space-y-3">
          <span className="text-xs font-black uppercase tracking-widest text-[#2BB5FF]">
            {t('pricingSubtitle')}
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-[var(--text-primary)] tracking-tight">
            {t('pricingTitle')}
          </h2>

          {/* Interactive Tactile Billing Cycle Toggle */}
          <div className="pt-4 flex justify-center">
            <div className="inline-flex items-center p-1.5 rounded-full bg-[var(--bg-secondary)] border border-[var(--border-subtle)] shadow-inner">
              <button
                type="button"
                onClick={() => setBillingCycle('monthly')}
                className={`px-4 sm:px-5 py-2 rounded-full text-xs font-extrabold transition-all cursor-pointer ${
                  billingCycle === 'monthly'
                    ? 'bg-[var(--bg-primary)] text-[var(--text-primary)] shadow-md'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                {t('billingMonthly')}
              </button>
              <button
                type="button"
                onClick={() => setBillingCycle('annual')}
                className={`px-4 sm:px-5 py-2 rounded-full text-xs font-extrabold transition-all flex items-center gap-1.5 cursor-pointer ${
                  billingCycle === 'annual'
                    ? 'bg-[var(--bg-primary)] text-[var(--text-primary)] shadow-md'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                <span>{t('billingAnnual')}</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  {t('saveTwoMonths')}
                </span>
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto items-stretch">
          {/* Card 1: Solo Pro / Independent Plan (Standard Tier) */}
          <div className="p-8 sm:p-10 rounded-[36px] bg-[var(--bg-primary)] border border-[var(--border-subtle)] space-y-8 shadow-xl hover:shadow-2xl hover:border-[#2BB5FF]/40 transition-all flex flex-col justify-between relative group">
            <div className="space-y-6">
              {/* Header & Price */}
              <div className="flex justify-between items-start gap-4">
                <div>
                  <h3 className="text-xl font-black text-[var(--text-primary)] tracking-tight">
                    {t('soloPlanTitle')}
                  </h3>
                  <p className="text-xs text-[var(--text-secondary)] mt-1 font-medium leading-relaxed max-w-[280px]">
                    {t('soloPlanDesc')}
                  </p>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="flex items-baseline justify-end gap-1">
                    <span className="text-4xl sm:text-5xl font-black text-[var(--text-primary)] tracking-tight font-mono">
                      {billingCycle === 'annual' ? '$16' : '$20'}
                    </span>
                    <span className="text-xs font-bold text-[var(--text-secondary)]">
                      {t('pricingPerMonth')}
                    </span>
                  </div>
                  {billingCycle === 'annual' && (
                    <span className="block text-[10px] font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
                      $192 {t('billedYearlyNote')}
                    </span>
                  )}
                </div>
              </div>

              {/* Divider */}
              <div className="h-px bg-[var(--border-subtle)] w-full" />

              {/* Features List */}
              <ul className="text-xs space-y-3.5 text-[var(--text-secondary)] font-semibold">
                <li className="flex items-center gap-2.5">
                  <CheckmarkCircle24Regular className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  <span>{t('soloFeat1')}</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckmarkCircle24Regular className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  <span>{t('soloFeat2')}</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckmarkCircle24Regular className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  <span>{t('soloFeat3')}</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckmarkCircle24Regular className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  <span>{t('soloFeat4')}</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckmarkCircle24Regular className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  <span>{t('soloFeat5')}</span>
                </li>
              </ul>
            </div>

            <Link
              href="/onboarding"
              className="btn-secondary w-full h-12 rounded-2xl text-xs font-extrabold flex items-center justify-center gap-2 shadow-xs"
            >
              <span>{t('startFreeTrial')}</span>
              <ArrowRight24Filled className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Card 2: Business & Multi-Staff Team Plan (Featured Tier) */}
          <div className="p-8 sm:p-10 rounded-[36px] bg-[var(--bg-primary)] border-2 border-[#2BB5FF] space-y-8 shadow-2xl hover:shadow-[0_20px_60px_-15px_rgba(43,181,255,0.3)] transition-all flex flex-col justify-between relative overflow-hidden group ring-4 ring-[#2BB5FF]/10">
            {/* Ambient Lighting */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#2BB5FF]/5 rounded-full blur-3xl pointer-events-none" />

            <div className="space-y-6 relative z-10">
              {/* Header & Price */}
              <div className="flex justify-between items-start gap-4">
                <div>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#2BB5FF]/10 text-[#2BB5FF] border border-[#2BB5FF]/20 text-[10px] font-black uppercase tracking-wider mb-2 shadow-xs">
                    <Sparkle24Regular className="w-3 h-3 text-[#2BB5FF]" />
                    {t('mostPopular')}
                  </span>
                  <h3 className="text-xl font-black text-[var(--text-primary)] tracking-tight">
                    {t('teamPlanTitle')}
                  </h3>
                  <p className="text-xs text-[var(--text-secondary)] mt-1 font-medium leading-relaxed max-w-[280px]">
                    {t('teamPlanDesc')}
                  </p>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="flex items-baseline justify-end gap-1">
                    <span className="text-4xl sm:text-5xl font-black text-[var(--text-primary)] tracking-tight font-mono">
                      {billingCycle === 'annual' ? '$32' : '$40'}
                    </span>
                    <span className="text-xs font-bold text-[var(--text-secondary)]">
                      {t('pricingPerMonth')}
                    </span>
                  </div>
                  {billingCycle === 'annual' && (
                    <span className="block text-[10px] font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
                      $384 {t('billedYearlyNote')}
                    </span>
                  )}
                </div>
              </div>

              {/* Divider */}
              <div className="h-px bg-[var(--border-subtle)] w-full" />

              {/* Features List */}
              <ul className="text-xs space-y-3.5 text-[var(--text-secondary)] font-semibold">
                <li className="flex items-center gap-2.5">
                  <CheckmarkCircle24Regular className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  <span>{t('teamFeat1')}</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckmarkCircle24Regular className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  <span>{t('teamFeat2')}</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckmarkCircle24Regular className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  <span>{t('teamFeat3')}</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckmarkCircle24Regular className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  <span>{t('teamFeat4')}</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckmarkCircle24Regular className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  <span>{t('teamFeat5')}</span>
                </li>
              </ul>
            </div>

            <Link
              href="/onboarding"
              className="btn-primary w-full h-12 rounded-2xl text-xs font-black tracking-wide flex items-center justify-center gap-2"
            >
              <span>{t('startFreeTrialBtn')}</span>
              <ArrowRight24Filled className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Bottom Trust & Guarantee Ribbon */}
        <div className="max-w-4xl mx-auto mt-12 p-4 sm:p-5 rounded-3xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] flex flex-wrap items-center justify-around gap-4 text-xs font-bold text-[var(--text-secondary)] shadow-xs">
          <div className="flex items-center gap-2">
            <ShieldCheckmark24Regular className="w-4 h-4 text-emerald-500 flex-shrink-0" />
            <span>{t('pricingGuarantee1')}</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckmarkCircle24Regular className="w-4 h-4 text-[#2BB5FF] flex-shrink-0" />
            <span>{t('pricingGuarantee2')}</span>
          </div>
          <div className="flex items-center gap-2">
            <Payment24Regular className="w-4 h-4 text-[#AF52DE] flex-shrink-0" />
            <span>{t('pricingGuarantee3')}</span>
          </div>
          <div className="flex items-center gap-2">
            <LockClosed24Regular className="w-4 h-4 text-amber-500 flex-shrink-0" />
            <span>{t('pricingGuarantee4')}</span>
          </div>
        </div>
      </section>

      {/* ─── LAUNCH IN LESS THAN AN AFTERNOON ─── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 relative z-10">
        <div className="text-center max-w-xl mx-auto mb-10 space-y-2">
          <h2 className="text-2xl sm:text-3xl font-black text-[var(--text-primary)] tracking-tight">
            {t('launchFastTitle')}
          </h2>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] font-medium">
            {t('launchFastSubtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto text-center">
          <div className="space-y-1.5 p-4">
            <CheckmarkCircle24Regular className="w-6 h-6 text-emerald-500 mx-auto" />
            <h4 className="text-xs font-extrabold text-[var(--text-primary)]">{t('launchFastPoint1')}</h4>
            <p className="text-[11px] text-[var(--text-secondary)]">{t('launchFastPoint1Desc')}</p>
          </div>
          <div className="space-y-1.5 p-4">
            <CheckmarkCircle24Regular className="w-6 h-6 text-emerald-500 mx-auto" />
            <h4 className="text-xs font-extrabold text-[var(--text-primary)]">{t('launchFastPoint2')}</h4>
            <p className="text-[11px] text-[var(--text-secondary)]">{t('launchFastPoint2Desc')}</p>
          </div>
          <div className="space-y-1.5 p-4">
            <CheckmarkCircle24Regular className="w-6 h-6 text-emerald-500 mx-auto" />
            <h4 className="text-xs font-extrabold text-[var(--text-primary)]">{t('launchFastPoint3')}</h4>
            <p className="text-[11px] text-[var(--text-secondary)]">{t('launchFastPoint3Desc')}</p>
          </div>
          <div className="space-y-1.5 p-4">
            <CheckmarkCircle24Regular className="w-6 h-6 text-emerald-500 mx-auto" />
            <h4 className="text-xs font-extrabold text-[var(--text-primary)]">{t('launchFastPoint4')}</h4>
            <p className="text-[11px] text-[var(--text-secondary)]">{t('launchFastPoint4Desc')}</p>
          </div>
        </div>
      </section>

      {/* ─── BOTTOM HIGH IMPACT CTA BANNER ─── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-20 relative z-10">
        <div className="p-8 sm:p-14 rounded-[36px] sm:rounded-[48px] bg-gradient-to-br from-[#FFF0F5] via-[#FDF2F8] to-[#EFF6FF] dark:from-pink-950/20 dark:via-purple-950/20 dark:to-sky-950/20 border border-pink-100/80 dark:border-pink-900/30 text-center space-y-6 shadow-xl">
          <h2 className="text-3xl sm:text-5xl font-black text-[var(--text-primary)] tracking-tight max-w-2xl mx-auto">
            {t('ctaBannerTitle')}
          </h2>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] max-w-lg mx-auto font-medium">
            {t('ctaBannerSubtitle')}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              href="/onboarding"
              className="btn-primary h-12 px-8 rounded-2xl text-xs font-extrabold flex items-center justify-center gap-2"
            >
              <span>{t('startFreeTrialBtn')}</span>
              <ArrowRight24Filled className="w-3.5 h-3.5" />
            </Link>
            <Link
              href="/book/eduardos-lounge"
              className="btn-secondary h-12 px-6 rounded-2xl text-xs font-extrabold flex items-center justify-center gap-2 shadow-xs"
            >
              <Globe24Regular className="w-4 h-4 text-[var(--text-muted)]" />
              <span>{t('talkToSales')}</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ─── MASTER FOOTER ─── */}
      <MarketingFooter />
    </div>
  );
}

