'use client';

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { MarketingHeader } from '@/components/MarketingHeader';
import { MarketingFooter } from '@/components/MarketingFooter';
import { FloatingInput, FloatingTextarea } from '@/components/FloatingInput';
import { CustomSelect, SelectOption } from '@/components/CustomSelect';
import { useTranslation } from '@/lib/i18n/useTranslation';
import {
  Sparkle24Filled,
  Sparkle24Regular,
  ArrowRight24Filled,
  ArrowLeft24Filled,
  CheckmarkCircle24Filled,
  CheckmarkCircle24Regular,
  Clock24Regular,
  Calendar24Regular,
  ShieldCheckmark24Regular,
  PeopleCommunity24Regular,
  ChatMultiple24Regular,
  DataTrending24Regular,
  Tag24Regular,
  Person24Regular,
  Mail24Regular,
  Call24Regular,
  Building24Regular,
  Location24Regular,
  Globe24Regular,
  Gift24Regular,
  ClipboardCheckmark24Regular,
  Copy24Filled,
  ChevronDown24Filled,
} from '@fluentui/react-icons';

type FormStep = 1 | 2 | 3;

export default function FoundingPage() {
  const { t, language } = useTranslation();
  const formRef = useRef<HTMLDivElement>(null);

  // Form state
  const [currentStep, setCurrentStep] = useState<FormStep>(1);
  const [direction, setDirection] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Form Fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [salonName, setSalonName] = useState('');
  const [city, setCity] = useState('');
  const [instagramUrl, setInstagramUrl] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [businessType, setBusinessType] = useState('hair_salon');
  const [staffCount, setStaffCount] = useState('1');
  const [monthlyAppts, setMonthlyAppts] = useState('50-150');
  const [currentSoftware, setCurrentSoftware] = useState('pen_paper');
  const [primaryPainPoint, setPrimaryPainPoint] = useState('');
  const [feedbackFreq, setFeedbackFreq] = useState('biweekly');
  const [hpTrap, setHpTrap] = useState('');

  // Submission State
  const [submittedData, setSubmittedData] = useState<{
    id: string;
    referenceNumber: string;
    name: string;
  } | null>(null);
  const [copiedRef, setCopiedRef] = useState(false);

  // FAQ State
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const businessTypeOptions: SelectOption[] = [
    { value: 'hair_salon', label: t('foundingOptHair') },
    { value: 'barbershop', label: t('foundingOptBarber') },
    { value: 'spa_wellness', label: t('foundingOptSpa') },
    { value: 'medspa', label: t('foundingOptMedspa') },
    { value: 'nails', label: t('foundingOptNails') },
    { value: 'other', label: t('foundingOptOther') },
  ];

  const softwareOptions: SelectOption[] = [
    { value: 'pen_paper', label: t('foundingSoftPenPaper') },
    { value: 'fresha', label: t('foundingSoftFresha') },
    { value: 'vagaro', label: t('foundingSoftVagaro') },
    { value: 'square', label: t('foundingSoftSquare') },
    { value: 'booksy', label: t('foundingSoftBooksy') },
    { value: 'mindbody', label: t('foundingSoftMindbody') },
    { value: 'other', label: t('foundingSoftOther') },
  ];

  const feedbackOptions: SelectOption[] = [
    { value: 'weekly', label: t('foundingFreqWeekly') },
    { value: 'biweekly', label: t('foundingFreqBiweekly') },
    { value: 'monthly', label: t('foundingFreqMonthly') },
  ];

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const validateStep1 = () => {
    if (!fullName.trim() || !email.trim() || !phone.trim() || !salonName.trim() || !city.trim()) {
      setErrorMessage(t('foundingErrRequired'));
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setErrorMessage(t('foundingErrEmail'));
      return false;
    }
    setErrorMessage(null);
    return true;
  };

  const validateStep2 = () => {
    if (!businessType || !staffCount) {
      setErrorMessage(t('foundingErrRequired'));
      return false;
    }
    setErrorMessage(null);
    return true;
  };

  const handleNext = () => {
    if (currentStep === 1 && !validateStep1()) return;
    if (currentStep === 2 && !validateStep2()) return;

    setDirection(1);
    setCurrentStep((prev) => (prev < 3 ? ((prev + 1) as FormStep) : prev));
  };

  const handleBack = () => {
    setDirection(-1);
    setErrorMessage(null);
    setCurrentStep((prev) => (prev > 1 ? ((prev - 1) as FormStep) : prev));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (currentStep !== 3) return;

    try {
      setIsSubmitting(true);
      setErrorMessage(null);

      const response = await fetch('/api/founding-applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: fullName.trim(),
          email: email.trim(),
          phone: phone.trim(),
          businessName: salonName.trim(),
          businessType,
          city: city.trim(),
          country: 'MX',
          instagramUrl: instagramUrl.trim(),
          websiteUrl: websiteUrl.trim(),
          staffCount: parseInt(staffCount, 10) || 1,
          monthlyAppointments: monthlyAppts,
          currentSoftware,
          primaryPainPoint: primaryPainPoint.trim(),
          feedbackCommitment: feedbackFreq,
          locale: language,
          _airbook_hp_check: hpTrap,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Submission error');
      }

      setSubmittedData({
        id: data.id,
        referenceNumber: data.applicationReference || `AB-FC-${data.id.slice(0, 8).toUpperCase()}`,
        name: fullName.trim(),
      });

      // Scroll to top of confirmation card
      setTimeout(() => {
        formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
    } catch (err: any) {
      console.error('Founding application submission error:', err);
      setErrorMessage(err.message || 'Failed to submit application. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyReference = () => {
    if (submittedData?.referenceNumber) {
      navigator.clipboard.writeText(submittedData.referenceNumber);
      setCopiedRef(true);
      setTimeout(() => setCopiedRef(false), 2000);
    }
  };

  const stepVariants = {
    enter: (dir: number) => ({ x: dir > 0 ? 30 : -30, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? -30 : 30, opacity: 0 }),
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] selection:bg-[#2BB5FF]/30 selection:text-[var(--text-primary)]">
      <MarketingHeader />

      <main className="relative overflow-hidden">
        {/* Ambient Top Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[500px] pointer-events-none opacity-40 blur-3xl overflow-hidden -z-10">
          <div className="w-[600px] h-[300px] bg-gradient-to-r from-[#2BB5FF]/30 via-[#8338EC]/20 to-[#2A9D8F]/20 rounded-full mx-auto" />
        </div>

        {/* 1. HERO SECTION */}
        <section className="pt-12 sm:pt-20 pb-16 px-4 sm:px-6 max-w-5xl mx-auto text-center space-y-6">
          {/* Announcement Capsule */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[var(--bg-secondary)] border border-[#2BB5FF]/30 shadow-xs"
          >
            <span className="w-2 h-2 rounded-full bg-[#2BB5FF] animate-pulse" />
            <span className="text-[11px] font-black uppercase tracking-wider text-[#2BB5FF] whitespace-nowrap">
              {t('foundingBannerBadge')}
            </span>
          </motion.div>

          {/* Main Title */}
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-[var(--text-primary)] leading-[1.1] max-w-4xl mx-auto"
          >
            {t('foundingHeroTitle')}
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="text-sm sm:text-base md:text-lg text-[var(--text-secondary)] font-medium max-w-2xl mx-auto leading-relaxed"
          >
            {t('foundingHeroSubtitle')}
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4"
          >
            <button
              type="button"
              onClick={scrollToForm}
              className="btn-primary w-full sm:w-auto h-12 px-6 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer shadow-md"
            >
              <span>{t('foundingCtaApply')}</span>
              <ArrowRight24Filled className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={scrollToForm}
              className="btn-secondary w-full sm:w-auto h-12 px-6 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{t('foundingCtaExplore')}</span>
            </button>
          </motion.div>

          {/* Cohort Status Strip */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="pt-6 flex flex-wrap items-center justify-center gap-4 text-xs text-[var(--text-secondary)] font-medium"
          >
            <div className="flex items-center gap-1.5">
              <Sparkle24Regular className="w-4 h-4 text-[#2BB5FF]" />
              <span className="font-bold text-[var(--text-primary)]">{t('foundingSpotsLeft')}</span>
            </div>
            <span className="hidden sm:inline text-[var(--border-subtle)]">•</span>
            <div className="flex items-center gap-1.5">
              <Gift24Regular className="w-4 h-4 text-emerald-500" />
              <span>{t('foundingBenefit1Title')}</span>
            </div>
            <span className="hidden sm:inline text-[var(--border-subtle)]">•</span>
            <div className="flex items-center gap-1.5">
              <ShieldCheckmark24Regular className="w-4 h-4 text-[#2BB5FF]" />
              <span>{t('passwordlessSecurityNotice')}</span>
            </div>
          </motion.div>
        </section>

        {/* 2. VALUE PROPOSITION & BENEFITS CARDS */}
        <section className="py-12 px-4 sm:px-6 max-w-7xl mx-auto border-t border-[var(--border-subtle)]">
          <div className="text-center space-y-2 mb-10">
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-[var(--text-primary)]">
              {t('foundingBenefitsTitle')}
            </h2>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)] font-medium max-w-xl mx-auto">
              {t('foundingBenefitsSubtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Benefit 1 */}
            <div className="p-6 rounded-3xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] space-y-3 relative overflow-hidden flex flex-col justify-between hover:border-[#2BB5FF]/30 transition-all">
              <div className="w-10 h-10 rounded-2xl bg-[#2BB5FF]/10 text-[#2BB5FF] flex items-center justify-center">
                <Gift24Regular className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-black text-[var(--text-primary)]">{t('foundingBenefit1Title')}</h3>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{t('foundingBenefit1Desc')}</p>
              </div>
            </div>

            {/* Benefit 2 */}
            <div className="p-6 rounded-3xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] space-y-3 relative overflow-hidden flex flex-col justify-between hover:border-[#2BB5FF]/30 transition-all">
              <div className="w-10 h-10 rounded-2xl bg-[#8338EC]/10 text-[#8338EC] flex items-center justify-center">
                <ChatMultiple24Regular className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-black text-[var(--text-primary)]">{t('foundingBenefit2Title')}</h3>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{t('foundingBenefit2Desc')}</p>
              </div>
            </div>

            {/* Benefit 3 */}
            <div className="p-6 rounded-3xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] space-y-3 relative overflow-hidden flex flex-col justify-between hover:border-[#2BB5FF]/30 transition-all">
              <div className="w-10 h-10 rounded-2xl bg-[#2A9D8F]/10 text-[#2A9D8F] flex items-center justify-center">
                <PeopleCommunity24Regular className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-black text-[var(--text-primary)]">{t('foundingBenefit3Title')}</h3>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{t('foundingBenefit3Desc')}</p>
              </div>
            </div>

            {/* Benefit 4 */}
            <div className="p-6 rounded-3xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] space-y-3 relative overflow-hidden flex flex-col justify-between hover:border-[#2BB5FF]/30 transition-all">
              <div className="w-10 h-10 rounded-2xl bg-[#E07A5F]/10 text-[#E07A5F] flex items-center justify-center">
                <Tag24Regular className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-black text-[var(--text-primary)]">{t('foundingBenefit4Title')}</h3>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{t('foundingBenefit4Desc')}</p>
              </div>
            </div>
          </div>
        </section>

        {/* 3. 4-STEP QUALIFICATION ROADMAP (DIRECTLY MIRRORING MARIA'S LETTER) */}
        <section className="py-14 px-4 sm:px-6 max-w-7xl mx-auto border-t border-[var(--border-subtle)] bg-[var(--bg-secondary)]/30 rounded-3xl my-8">
          <div className="text-center space-y-2 mb-10 max-w-2xl mx-auto">
            <span className="text-[10px] uppercase font-black tracking-widest text-[#2BB5FF]">
              {t('foundingProcessTitle')}
            </span>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-[var(--text-primary)]">
              {t('foundingProcessSubtitle')}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Step 1 */}
            <div className="p-5 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] space-y-2.5 relative flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-black text-[#2BB5FF] px-2 py-0.5 rounded-lg bg-[#2BB5FF]/10">
                  01
                </span>
                <Clock24Regular className="w-4 h-4 text-[var(--text-muted)]" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-extrabold text-[var(--text-primary)]">{t('foundingStep1Title')}</h4>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{t('foundingStep1Desc')}</p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="p-5 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] space-y-2.5 relative flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-black text-[#8338EC] px-2 py-0.5 rounded-lg bg-[#8338EC]/10">
                  02
                </span>
                <Calendar24Regular className="w-4 h-4 text-[var(--text-muted)]" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-extrabold text-[var(--text-primary)]">{t('foundingStep2Title')}</h4>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{t('foundingStep2Desc')}</p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="p-5 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] space-y-2.5 relative flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-black text-[#2A9D8F] px-2 py-0.5 rounded-lg bg-[#2A9D8F]/10">
                  03
                </span>
                <Call24Regular className="w-4 h-4 text-[var(--text-muted)]" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-extrabold text-[var(--text-primary)]">{t('foundingStep3Title')}</h4>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{t('foundingStep3Desc')}</p>
              </div>
            </div>

            {/* Step 4 */}
            <div className="p-5 rounded-2xl bg-[var(--bg-primary)] border border-[#2BB5FF]/30 space-y-2.5 relative flex flex-col justify-between shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-black text-emerald-500 px-2 py-0.5 rounded-lg bg-emerald-500/10">
                  04
                </span>
                <Sparkle24Filled className="w-4 h-4 text-[#2BB5FF]" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-extrabold text-[var(--text-primary)]">{t('foundingStep4Title')}</h4>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{t('foundingStep4Desc')}</p>
              </div>
            </div>
          </div>
        </section>

        {/* 4. EVALUATION CRITERIA CARDS */}
        <section className="py-12 px-4 sm:px-6 max-w-5xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-[var(--text-primary)]">
              {t('foundingCriteriaTitle')}
            </h2>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)] font-medium max-w-xl mx-auto">
              {t('foundingCriteriaSubtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Criterion 1 */}
            <div className="p-6 rounded-3xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] space-y-3">
              <div className="w-9 h-9 rounded-xl bg-[#2BB5FF]/10 text-[#2BB5FF] flex items-center justify-center">
                <Sparkle24Regular className="w-4.5 h-4.5" />
              </div>
              <h3 className="text-sm font-black text-[var(--text-primary)]">{t('foundingCriterion1Title')}</h3>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{t('foundingCriterion1Desc')}</p>
            </div>

            {/* Criterion 2 */}
            <div className="p-6 rounded-3xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] space-y-3">
              <div className="w-9 h-9 rounded-xl bg-[#8338EC]/10 text-[#8338EC] flex items-center justify-center">
                <DataTrending24Regular className="w-4.5 h-4.5" />
              </div>
              <h3 className="text-sm font-black text-[var(--text-primary)]">{t('foundingCriterion2Title')}</h3>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{t('foundingCriterion2Desc')}</p>
            </div>

            {/* Criterion 3 */}
            <div className="p-6 rounded-3xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] space-y-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                <ChatMultiple24Regular className="w-4.5 h-4.5" />
              </div>
              <h3 className="text-sm font-black text-[var(--text-primary)]">{t('foundingCriterion3Title')}</h3>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{t('foundingCriterion3Desc')}</p>
            </div>
          </div>
        </section>

        {/* 5. INTERACTIVE QUALIFICATION ONBOARDING FORM & CONFIRMATION VIEW */}
        <section ref={formRef} className="py-16 px-4 sm:px-6 max-w-3xl mx-auto">
          <div className="rounded-[32px] bg-[var(--bg-primary)] border border-[var(--border-subtle)] shadow-2xl p-6 sm:p-10 relative overflow-hidden">
            {/* Background decorative corner highlight */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#2BB5FF]/10 rounded-full blur-2xl pointer-events-none" />

            {!submittedData ? (
              <div className="space-y-6">
                {/* Form Header */}
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#2BB5FF]/10 text-[#2BB5FF] text-[10px] font-black uppercase tracking-wider">
                    <ClipboardCheckmark24Regular className="w-3.5 h-3.5" />
                    <span>{t('foundingFormTitle')}</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-[var(--text-primary)] tracking-tight">
                    {t('foundingHeroTitle')}
                  </h3>
                  <p className="text-xs text-[var(--text-secondary)] font-medium">
                    {t('foundingFormSubtitle')}
                  </p>
                </div>

                {/* Progress Indicators */}
                <div className="flex items-center gap-2 pt-2">
                  {[1, 2, 3].map((s) => (
                    <div key={s} className="flex-1 space-y-1">
                      <div
                        className={`h-1.5 rounded-full transition-all duration-300 ${
                          currentStep >= s ? 'bg-[#2BB5FF]' : 'bg-[var(--border-subtle)]'
                        }`}
                      />
                      <span className="text-[10px] font-bold text-[var(--text-muted)] block truncate">
                        {s === 1
                          ? t('foundingFormStep1')
                          : s === 2
                          ? t('foundingFormStep2')
                          : t('foundingFormStep3')}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Error Banner */}
                {errorMessage && (
                  <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs font-bold">
                    {errorMessage}
                  </div>
                )}

                {/* Form Content */}
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Invisible Honeypot */}
                  <input
                    type="text"
                    name="_airbook_hp_check"
                    value={hpTrap}
                    onChange={(e) => setHpTrap(e.target.value)}
                    className="hidden"
                    tabIndex={-1}
                    autoComplete="off"
                  />

                  <AnimatePresence mode="wait" custom={direction}>
                    {/* STEP 1: CONTACT & SALON PROFILE */}
                    {currentStep === 1 && (
                      <motion.div
                        key="step-1"
                        custom={direction}
                        variants={stepVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{ duration: 0.15 }}
                        className="space-y-3.5"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                          <FloatingInput
                            label={t('foundingFormFullName')}
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            icon={<Person24Regular className="w-4 h-4" />}
                            required
                          />
                          <FloatingInput
                            label={t('foundingFormEmail')}
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            icon={<Mail24Regular className="w-4 h-4" />}
                            required
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                          <FloatingInput
                            label={t('foundingFormPhone')}
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            icon={<Call24Regular className="w-4 h-4" />}
                            placeholder="+52 55 1234 5678"
                            required
                          />
                          <FloatingInput
                            label={t('foundingFormSalonName')}
                            value={salonName}
                            onChange={(e) => setSalonName(e.target.value)}
                            icon={<Building24Regular className="w-4 h-4" />}
                            required
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                          <FloatingInput
                            label={t('foundingFormCity')}
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            icon={<Location24Regular className="w-4 h-4" />}
                            containerClassName="md:col-span-1"
                            required
                          />
                          <FloatingInput
                            label={t('foundingFormInstagram')}
                            value={instagramUrl}
                            onChange={(e) => setInstagramUrl(e.target.value)}
                            placeholder="@misalon"
                            containerClassName="md:col-span-1"
                          />
                          <FloatingInput
                            label={t('foundingFormWebsite')}
                            value={websiteUrl}
                            onChange={(e) => setWebsiteUrl(e.target.value)}
                            icon={<Globe24Regular className="w-4 h-4" />}
                            containerClassName="md:col-span-1"
                          />
                        </div>
                      </motion.div>
                    )}

                    {/* STEP 2: OPERATIONS & VOLUME */}
                    {currentStep === 2 && (
                      <motion.div
                        key="step-2"
                        custom={direction}
                        variants={stepVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{ duration: 0.15 }}
                        className="space-y-3.5"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                          <CustomSelect
                            label={t('foundingFormBusinessType')}
                            options={businessTypeOptions}
                            value={businessType}
                            onChange={setBusinessType}
                          />
                          <FloatingInput
                            label={t('foundingFormStaffCount')}
                            type="number"
                            min="1"
                            max="100"
                            value={staffCount}
                            onChange={(e) => setStaffCount(e.target.value)}
                            required
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                          <CustomSelect
                            label={t('foundingFormMonthlyAppts')}
                            options={[
                              { value: '1-50', label: '1 - 50 citas / mes' },
                              { value: '50-150', label: '50 - 150 citas / mes' },
                              { value: '150-300', label: '150 - 300 citas / mes' },
                              { value: '300+', label: '300+ citas / mes' },
                            ]}
                            value={monthlyAppts}
                            onChange={setMonthlyAppts}
                          />
                          <CustomSelect
                            label={t('foundingFormCurrentSoftware')}
                            options={softwareOptions}
                            value={currentSoftware}
                            onChange={setCurrentSoftware}
                          />
                        </div>
                      </motion.div>
                    )}

                    {/* STEP 3: GOALS & FEEDBACK COMMITMENT */}
                    {currentStep === 3 && (
                      <motion.div
                        key="step-3"
                        custom={direction}
                        variants={stepVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{ duration: 0.15 }}
                        className="space-y-3.5"
                      >
                        <FloatingTextarea
                          label={t('foundingFormPainPoint')}
                          value={primaryPainPoint}
                          onChange={(e) => setPrimaryPainPoint(e.target.value)}
                          placeholder="e.g. Comisiones excesivas del 20%, citas perdidas, falta de control en el inventario..."
                          rows={3}
                        />

                        <CustomSelect
                          label={t('foundingFormFeedbackFreq')}
                          options={feedbackOptions}
                          value={feedbackFreq}
                          onChange={setFeedbackFreq}
                        />

                        {/* Security & Guarantee Note */}
                        <div className="p-4 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] flex items-start gap-3">
                          <ShieldCheckmark24Regular className="w-5 h-5 text-[#2BB5FF] flex-shrink-0 mt-0.5" />
                          <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                            {t('passwordlessSecurityNotice')}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Form Action Controls */}
                  <div className="flex items-center justify-between gap-3 pt-4 border-t border-[var(--border-subtle)]">
                    {currentStep > 1 ? (
                      <button
                        type="button"
                        onClick={handleBack}
                        className="btn-secondary h-11 px-5 rounded-2xl text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                      >
                        <ArrowLeft24Filled className="w-3.5 h-3.5" />
                        <span>{t('foundingFormBack')}</span>
                      </button>
                    ) : (
                      <div />
                    )}

                    {currentStep < 3 ? (
                      <button
                        type="button"
                        onClick={handleNext}
                        className="btn-primary h-11 px-6 rounded-2xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-md"
                      >
                        <span>{t('foundingFormNext')}</span>
                        <ArrowRight24Filled className="w-3.5 h-3.5" />
                      </button>
                    ) : (
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="btn-primary h-11 px-6 rounded-2xl text-xs font-bold flex items-center gap-2 cursor-pointer shadow-md disabled:opacity-50"
                      >
                        {isSubmitting ? (
                          <span>{t('foundingFormSubmitting')}</span>
                        ) : (
                          <>
                            <Sparkle24Filled className="w-4 h-4" />
                            <span>{t('foundingFormSubmit')}</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </form>
              </div>
            ) : (
              /* CONFIRMATION / SUCCESS LETTER STATE (Directly mirroring Maria's letter from AirBook Mexico) */
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-6"
              >
                {/* Header Badge */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[var(--border-subtle)]">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                      <CheckmarkCircle24Filled className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-black tracking-wider text-emerald-600 dark:text-emerald-400">
                        {t('foundingSuccessBadge')}
                      </span>
                      <h3 className="text-lg font-black text-[var(--text-primary)]">
                        {t('foundingSuccessTitle')}
                      </h3>
                    </div>
                  </div>

                  {/* Reference Tag & Copy */}
                  <div className="flex items-center gap-2 bg-[var(--bg-secondary)] px-3 py-1.5 rounded-xl border border-[var(--border-subtle)]">
                    <span className="text-xs font-mono font-bold text-[var(--text-primary)]">
                      {submittedData.referenceNumber}
                    </span>
                    <button
                      type="button"
                      onClick={handleCopyReference}
                      className="p-1 rounded-lg hover:bg-[var(--bg-primary)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-all cursor-pointer"
                      title={t('foundingSuccessActionShare')}
                    >
                      <Copy24Filled className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Personalized Letter Box from Maria @ AirBook Mexico */}
                <div className="p-6 sm:p-8 rounded-3xl bg-[var(--bg-secondary)]/50 border border-[var(--border-subtle)] space-y-4 text-xs sm:text-sm text-[var(--text-primary)] leading-relaxed">
                  <div className="font-black text-sm text-[#2BB5FF]">
                    {t('foundingSuccessLetterGreeting')} {submittedData.name},
                  </div>

                  <p>{t('foundingSuccessLetterP1')}</p>
                  <p>{t('foundingSuccessLetterP2')}</p>
                  <p>{t('foundingSuccessLetterP3')}</p>
                  <p className="font-medium text-[var(--text-secondary)]">{t('foundingSuccessLetterP4')}</p>

                  <div className="pt-3 border-t border-[var(--border-subtle)]/60 text-xs">
                    <p className="text-[var(--text-muted)] font-medium">{t('foundingSuccessLetterSignoff')}</p>
                    <p className="font-extrabold text-[var(--text-primary)] mt-0.5">
                      {t('foundingSuccessLetterAuthor')}
                    </p>
                  </div>
                </div>

                {/* Timeline Status Card */}
                <div className="p-4 rounded-2xl bg-[#2BB5FF]/10 border border-[#2BB5FF]/20 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2.5">
                    <Clock24Regular className="w-5 h-5 text-[#2BB5FF]" />
                    <span className="text-xs font-bold text-[var(--text-primary)]">
                      {t('foundingSuccessStatus')}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono uppercase px-2.5 py-1 rounded-lg bg-[#2BB5FF] text-white font-black">
                    2 MONTHS FREE
                  </span>
                </div>

                {/* Return / Explore Actions */}
                <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                  <Link
                    href="/"
                    className="btn-secondary w-full sm:w-auto h-11 px-6 rounded-2xl text-xs font-bold flex items-center justify-center gap-2"
                  >
                    <span>{t('foundingSuccessActionHome')}</span>
                  </Link>
                  <Link
                    href="/dashboard"
                    className="btn-primary w-full sm:w-auto h-11 px-6 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 shadow-md"
                  >
                    <span>{t('operatorApp')}</span>
                    <ArrowRight24Filled className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </motion.div>
            )}
          </div>
        </section>

        {/* 6. FAQ ACCORDION SECTION */}
        <section className="py-14 px-4 sm:px-6 max-w-4xl mx-auto border-t border-[var(--border-subtle)] space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-[var(--text-primary)]">
              {t('foundingFaqTitle')}
            </h2>
          </div>

          <div className="space-y-3">
            {[
              { q: t('foundingFaqQ1'), a: t('foundingFaqA1') },
              { q: t('foundingFaqQ2'), a: t('foundingFaqA2') },
              { q: t('foundingFaqQ3'), a: t('foundingFaqA3') },
            ].map((faq, idx) => (
              <div
                key={idx}
                className="rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] overflow-hidden transition-all"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 cursor-pointer"
                >
                  <span className="text-xs sm:text-sm font-black text-[var(--text-primary)]">
                    {faq.q}
                  </span>
                  <ChevronDown24Filled
                    className={`w-4 h-4 text-[var(--text-muted)] flex-shrink-0 transition-transform duration-200 ${
                      openFaq === idx ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {openFaq === idx && (
                  <div className="px-5 pb-5 pt-1 text-xs text-[var(--text-secondary)] font-medium leading-relaxed border-t border-[var(--border-subtle)]/60">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      </main>

      <MarketingFooter />
    </div>
  );
}
