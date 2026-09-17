'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Logo } from '@/components/Logo';
import { LanguageSelector } from '@/components/LanguageSelector';
import { FloatingInput, FloatingTextarea } from '@/components/FloatingInput';
import { CustomSelect, SelectOption } from '@/components/CustomSelect';
import { useTranslation } from '@/lib/i18n/useTranslation';
import {
  Sparkle24Filled,
  ArrowRight24Filled,
  ArrowLeft24Filled,
  CheckmarkCircle24Filled,
  Clock24Regular,
  ShieldCheckmark24Regular,
  Person24Regular,
  Mail24Regular,
  Call24Regular,
  Building24Regular,
  Location24Regular,
  Globe24Regular,
  ClipboardCheckmark24Regular,
  Copy24Filled,
  Dismiss24Filled,
} from '@fluentui/react-icons';

type FormStep = 1 | 2 | 3;

export default function FoundingFormPage() {
  const { t, language } = useTranslation();

  // Step state
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
    } catch (err: any) {
      console.error('Founding form error:', err);
      setErrorMessage(err.message || 'Failed to submit application.');
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
    enter: (dir: number) => ({ x: dir > 0 ? 40 : -40, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? -40 : 40, opacity: 0 }),
  };

  return (
    <div className="min-h-screen bg-[var(--bg-secondary)]/50 text-[var(--text-primary)] flex flex-col justify-between selection:bg-[#2BB5FF]/30">
      {/* Minimal Focused Header */}
      <header className="w-full border-b border-[var(--border-subtle)] bg-[var(--bg-primary)] py-4 px-4 sm:px-8">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2">
              <Logo size={28} showText animated />
            </Link>
            <span className="text-[var(--border-subtle)] font-light hidden sm:inline">|</span>
            <Link
              href="/founding"
              className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#2BB5FF]/10 text-[#0284C7] dark:text-[#2BB5FF] text-[11px] font-black uppercase tracking-wider hover:bg-[#2BB5FF]/20 transition-colors"
            >
              <span>{t('foundingNav')}</span>
              <span className="text-[10px] opacity-70">· 2M Free</span>
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <LanguageSelector direction="down" format="code" size="sm" />
            <Link
              href="/founding"
              className="text-xs font-bold text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
            >
              {t('foundingCtaExplore')}
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-2xl w-full mx-auto p-4 sm:p-8 flex flex-col justify-center my-6">
        <div className="rounded-[32px] bg-[var(--bg-primary)] border border-[var(--border-subtle)] shadow-2xl p-6 sm:p-10 relative overflow-hidden">
          {/* Subtle Ambient glow */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#2BB5FF]/10 rounded-full blur-2xl pointer-events-none" />

          {!submittedData ? (
            <div className="space-y-6">
              {/* Form Title & Stepper */}
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#2BB5FF]/10 text-[#2BB5FF] text-[10px] font-black uppercase tracking-wider">
                  <ClipboardCheckmark24Regular className="w-3.5 h-3.5" />
                  <span>{t('foundingFormTitle')}</span>
                </div>
                <h1 className="text-xl sm:text-2xl font-black text-[var(--text-primary)] tracking-tight">
                  {t('foundingHeroTitle')}
                </h1>
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

              {/* Error Alert */}
              {errorMessage && (
                <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs font-bold">
                  {errorMessage}
                </div>
              )}

              {/* Step Forms */}
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Honeypot */}
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
                  {/* STEP 1: CONTACT & SALON */}
                  {currentStep === 1 && (
                    <motion.div
                      key="form-step-1"
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
                      key="form-step-2"
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

                  {/* STEP 3: GOALS & COMMITMENT */}
                  {currentStep === 3 && (
                    <motion.div
                      key="form-step-3"
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
                        placeholder="e.g. Comisiones del 20%, citas perdidas, falta de control en el inventario..."
                        rows={3}
                      />

                      <CustomSelect
                        label={t('foundingFormFeedbackFreq')}
                        options={feedbackOptions}
                        value={feedbackFreq}
                        onChange={setFeedbackFreq}
                      />

                      <div className="p-4 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] flex items-start gap-3">
                        <ShieldCheckmark24Regular className="w-5 h-5 text-[#2BB5FF] flex-shrink-0 mt-0.5" />
                        <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                          {t('passwordlessSecurityNotice')}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Stepper Controls */}
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
            /* SUCCESS CONFIRMATION STATE */
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

              {/* Timeline Status */}
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

              {/* Actions */}
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
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-[var(--border-subtle)] bg-[var(--bg-primary)] py-4 text-center text-xs text-[var(--text-muted)]">
        <p>© {new Date().getFullYear()} AirBook · {t('passwordlessSecurityNotice')}</p>
      </footer>
    </div>
  );
}
