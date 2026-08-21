'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Logo, CircleCloudIcon } from '@/components/Logo';
import { useAirBookStore } from '@/lib/store';
import { useSession } from '@/lib/auth-client';
import { useTranslation } from '@/lib/i18n/useTranslation';
import {
  ArrowLeft24Filled,
  ArrowRight24Filled,
  Add24Filled,
  Dismiss24Filled,
  Cut24Regular,
  Sparkle24Regular,
  Heart24Regular,
  Emoji24Regular,
  Stethoscope24Regular,
  Edit24Regular,
  Grid24Regular,
  Mail24Regular,
  CheckmarkCircle24Regular,
} from '@fluentui/react-icons';

type Step = 1 | 2 | 3 | 4;

const BUSINESS_TYPES = [
  { id: 'salon', label: 'Hair Salon', icon: Cut24Regular },
  { id: 'barbershop', label: 'Barbershop', icon: Cut24Regular },
  { id: 'spa', label: 'Spa & Beauty', icon: Sparkle24Regular },
  { id: 'wellness', label: 'Wellness', icon: Heart24Regular },
  { id: 'aesthetics', label: 'Aesthetics', icon: Emoji24Regular },
  { id: 'medical', label: 'Medical', icon: Stethoscope24Regular },
  { id: 'tattoo', label: 'Tattoo & Art', icon: Edit24Regular },
  { id: 'other', label: 'Other', icon: Grid24Regular },
];

const STEP_LABELS = ['Identity', 'Business Type', 'Team', 'Done!'];

const slideVariants = {
  initial: (dir: number) => ({ x: dir * 48, opacity: 0 }),
  animate: { x: 0, opacity: 1, transition: { type: 'spring' as const, stiffness: 340, damping: 28 } },
  exit: (dir: number) => ({ x: -dir * 48, opacity: 0, transition: { duration: 0.14, ease: 'easeIn' as const } }),
};

export default function OnboardingPage() {
  const router = useRouter();
  const { setWorkspaceName, setBusinessType, setWorkspaceSlug, setWorkspaceId } = useAirBookStore();
  const { data: session } = useSession();
  const { t } = useTranslation();
  const userFirstName = session?.user?.name ? session.user.name.split(' ')[0] : '';

  const [step, setStep] = useState<Step>(1);
  const [direction, setDirection] = useState(1);

  // Step 1 state
  const [nameInput, setNameInput] = useState('');
  const [slugInput, setSlugInput] = useState('');
  const [iconUrl, setIconUrl] = useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setIconUrl(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Step 2 state
  const [selectedType, setSelectedType] = useState<string>('');

  // Step 3 state
  const [inviteEmails, setInviteEmails] = useState<string[]>([]);
  const [emailInput, setEmailInput] = useState('');

  const goTo = (next: Step) => {
    setDirection(next > step ? 1 : -1);
    setStep(next);
  };

  const handleAddEmail = () => {
    const trimmed = emailInput.trim();
    if (trimmed && !inviteEmails.includes(trimmed)) {
      setInviteEmails((prev) => [...prev, trimmed]);
      setEmailInput('');
    }
  };

  const [submitting, setSubmitting] = useState(false);

  const handleFinish = async () => {
    setSubmitting(true);
    const wsName = nameInput.trim() || 'My Business';
    setWorkspaceName(wsName);
    if (selectedType) setBusinessType(selectedType);

    try {
      const slugValue = slugInput.trim() || wsName.toLowerCase().replace(/[^a-z0-9-]/g, '-');
      const res = await fetch('/api/workspaces', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: wsName,
          slug: slugValue,
          businessType: selectedType || 'salon',
          ownerName: session?.user?.name || 'Owner',
        }),
      });
      const data = await res.json();
      if (data?.workspace?.slug) {
        setWorkspaceSlug(data.workspace.slug);
      } else {
        setWorkspaceSlug(slugValue);
      }
      if (data?.workspace?.id) {
        setWorkspaceId(data.workspace.id);
      }
    } catch (err) {
      console.error('Failed to create workspace in DB:', err);
    } finally {
      setSubmitting(false);
      router.push('/dashboard');
    }
  };

  const progressPercent = ((step - 1) / 3) * 100;

  return (
    <div className="min-h-screen bg-[#F5F6FA] dark:bg-[#0C0C10] flex flex-col items-center justify-center p-4 sm:p-6 relative overflow-hidden">
      {/* Back to login */}
      <Link
        href="/login"
        className="absolute top-6 left-6 flex items-center gap-1.5 text-xs font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors z-20"
      >
        <ArrowLeft24Filled className="w-3.5 h-3.5" />
        <span>Back to login</span>
      </Link>

      {/* Background glow */}
      <motion.div
        animate={{ scale: [1, 1.06, 1] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-gradient-to-tr from-blue-500/8 via-violet-500/6 to-pink-500/8 rounded-full blur-3xl pointer-events-none"
      />

      {/* Onboarding Card */}
      <motion.div
        initial={{ y: 24, opacity: 0, scale: 0.97 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        transition={{ type: 'spring', stiffness: 340, damping: 26 }}
        className="w-full max-w-2xl glass-panel rounded-[36px] shadow-2xl bg-white/95 dark:bg-gray-900/95 border border-white/80 dark:border-white/10 z-10 relative flex flex-col overflow-hidden"
        style={{ minHeight: 540 }}
      >
        {/* Progress bar */}
        <div className="h-1 w-full bg-black/5 dark:bg-white/10">
          <motion.div
            animate={{ width: `${progressPercent}%` }}
            transition={{ type: 'spring', stiffness: 200, damping: 28 }}
            className="h-full bg-gradient-to-r from-blue-500 to-violet-500"
          />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-8 pt-6 pb-2">
          {/* Brand logo */}
          <CircleCloudIcon size={38} />

          {/* Step dots */}
          <div className="flex items-center gap-2">
            {([1, 2, 3, 4] as Step[]).map((s) => (
              <div
                key={s}
                className={`transition-all duration-300 rounded-full ${
                  s === step
                    ? 'w-5 h-2 bg-black dark:bg-white'
                    : s < step
                    ? 'w-2 h-2 bg-black/30 dark:bg-white/40'
                    : 'w-2 h-2 bg-black/10 dark:bg-white/10'
                }`}
              />
            ))}
          </div>

          {/* Step label */}
          <span className="text-[11px] font-semibold text-[var(--text-muted)]">
            Step {step} of 4
          </span>
        </div>

        {/* Animated step content */}
        <div className="flex-1 px-8 py-4 overflow-hidden">
          <AnimatePresence mode="wait" custom={direction} initial={false}>
            {/* ─── STEP 1: WORKSPACE IDENTITY ─── */}
            {step === 1 && (
              <motion.div
                key="step1"
                custom={direction}
                variants={slideVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="space-y-6"
              >
                <div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[var(--text-primary)]">
                    {nameInput ? nameInput : 'Your Workspace'}
                  </h1>
                  <p className="text-sm text-[var(--text-secondary)] mt-1">
                    Let's start with your workspace identity.
                  </p>
                </div>

                {/* Icon */}
                <div className="space-y-2">
                  <label className="text-sm font-bold text-[var(--text-primary)] block">Workspace Icon</label>
                  <p className="text-xs text-[var(--text-secondary)]">Shown in notifications and share links.</p>
                  <div className="flex items-center gap-4 pt-1">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleImageUpload}
                      accept="image/*"
                      className="hidden"
                    />
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center text-2xl font-bold text-gray-700 dark:text-gray-200 shadow-inner overflow-hidden relative">
                      {iconUrl ? (
                        <img src={iconUrl} alt="Workspace Icon" className="w-full h-full object-cover" />
                      ) : (
                        nameInput.charAt(0).toUpperCase() || '?'
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="px-4 py-2 rounded-xl bg-black/5 dark:bg-white/10 hover:bg-black/10 text-xs font-semibold text-[var(--text-primary)] transition-colors flex items-center gap-1.5"
                      >
                        <Add24Filled className="w-3.5 h-3.5" />
                        <span>{iconUrl ? 'Change Image' : 'Upload Image'}</span>
                      </button>
                      {iconUrl && (
                        <button
                          type="button"
                          onClick={() => setIconUrl(null)}
                          className="px-3 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-xs font-semibold text-red-600 dark:text-red-400 transition-colors"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  </div>
                  <span className="text-[10px] text-[var(--text-muted)]">Recommended: 256×256px</span>
                </div>

                <div className="h-px w-full bg-black/5 dark:bg-white/10" />

                {/* Workspace name */}
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-[var(--text-primary)] block">Workspace Name *</label>
                  <input
                    type="text"
                    required
                    placeholder={userFirstName ? `e.g. ${userFirstName}'s Lounge` : 'e.g. Glow Studio & Lounge'}
                    value={nameInput}
                    onChange={(e) => {
                      setNameInput(e.target.value);
                      setSlugInput(e.target.value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''));
                    }}
                    className="w-full max-w-sm px-4 py-2.5 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-sm font-semibold text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  />
                </div>

                {/* Booking slug preview */}
                {slugInput && (
                  <div className="flex items-center gap-1.5 text-[11px] font-mono text-[var(--text-muted)]">
                    <span>airbook.app/book/</span>
                    <span className="font-bold text-[var(--text-primary)]">{slugInput}</span>
                  </div>
                )}
              </motion.div>
            )}

            {/* ─── STEP 2: BUSINESS TYPE ─── */}
            {step === 2 && (
              <motion.div
                key="step2"
                custom={direction}
                variants={slideVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="space-y-5"
              >
                <div>
                  <h2 className="text-2xl font-extrabold tracking-tight text-[var(--text-primary)]">
                    What kind of business?
                  </h2>
                  <p className="text-sm text-[var(--text-secondary)] mt-1">
                    We'll tailor your AirBook experience to your industry.
                  </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {BUSINESS_TYPES.map((type) => {
                    const Icon = type.icon;
                    const isSelected = selectedType === type.id;
                    return (
                      <motion.button
                        key={type.id}
                        whileTap={{ scale: 0.95 }}
                        whileHover={{ scale: 1.02 }}
                        type="button"
                        onClick={() => setSelectedType(type.id)}
                        className={`p-4 rounded-2xl border flex flex-col items-center gap-2 text-xs font-bold transition-all ${
                          isSelected
                            ? 'bg-black text-white dark:bg-white dark:text-black border-transparent shadow-lg'
                            : 'bg-black/5 dark:bg-white/5 border-black/5 dark:border-white/10 text-[var(--text-primary)] hover:bg-black/8'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        <span>{type.label}</span>
                        {isSelected && <CheckmarkCircle24Regular className="w-3.5 h-3.5" />}
                      </motion.button>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* ─── STEP 3: TEAM INVITES ─── */}
            {step === 3 && (
              <motion.div
                key="step3"
                custom={direction}
                variants={slideVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="space-y-5"
              >
                <div>
                  <h2 className="text-2xl font-extrabold tracking-tight text-[var(--text-primary)]">
                    Invite your team
                  </h2>
                  <p className="text-sm text-[var(--text-secondary)] mt-1">
                    Add your staff members. They'll receive an invitation email.
                  </p>
                </div>

                {/* Email input */}
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <Mail24Regular className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      placeholder="colleague@business.com"
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddEmail();
                        }
                      }}
                      className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-xs font-medium text-[var(--text-primary)] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleAddEmail}
                    className="p-2.5 rounded-xl bg-black text-white dark:bg-white dark:text-black hover:opacity-80 transition-opacity"
                  >
                    <Add24Filled className="w-4 h-4" />
                  </button>
                </div>

                {/* Invite chips */}
                {inviteEmails.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {inviteEmails.map((em) => (
                      <div
                        key={em}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 text-xs font-semibold"
                      >
                        <span>{em}</span>
                        <button
                          type="button"
                          onClick={() => setInviteEmails((prev) => prev.filter((e) => e !== em))}
                          className="hover:opacity-70"
                        >
                          <Dismiss24Filled className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <p className="text-[11px] text-[var(--text-muted)]">
                  You can always add team members later in Settings → Team.
                </p>
              </motion.div>
            )}

            {/* ─── STEP 4: CELEBRATION ─── */}
            {step === 4 && (
              <motion.div
                key="step4"
                custom={direction}
                variants={slideVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="flex flex-col items-center justify-center text-center space-y-5 py-8"
              >
                <motion.div
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 18, delay: 0.1 }}
                  className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-blue-500 via-violet-500 to-pink-500 flex items-center justify-center shadow-2xl shadow-blue-500/25"
                >
                  <Sparkle24Regular className="w-9 h-9 text-white" />
                </motion.div>

                <div>
                  <h2 className="text-3xl font-extrabold tracking-tight text-[var(--text-primary)]">
                    You're all set! 🎉
                  </h2>
                  <p className="text-sm text-[var(--text-secondary)] mt-2 max-w-xs mx-auto leading-relaxed">
                    {nameInput ? <><strong>{nameInput}</strong> is ready.</> : 'Your workspace is ready.'}{' '}
                    {inviteEmails.length > 0 && `Invites sent to ${inviteEmails.length} team member${inviteEmails.length > 1 ? 's' : ''}.`}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 w-full max-w-xs text-xs">
                  {[
                    { label: '📅 Calendar', desc: 'Real-time booking grid' },
                    { label: '💳 POS', desc: 'Omnichannel checkout' },
                    { label: '👥 Team', desc: 'Shifts & commissions' },
                    { label: '📊 Analytics', desc: 'Revenue dashboard' },
                  ].map((f) => (
                    <div key={f.label} className="p-3 rounded-2xl bg-black/5 dark:bg-white/5 text-left">
                      <p className="font-bold text-[var(--text-primary)]">{f.label}</p>
                      <p className="text-[10px] text-[var(--text-secondary)] mt-0.5">{f.desc}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Bottom nav bar */}
        <div className="px-8 py-6 border-t border-black/5 dark:border-white/10 flex items-center justify-between">
          {/* Back */}
          <div>
            {step > 1 && step < 4 ? (
              <button
                type="button"
                onClick={() => goTo((step - 1) as Step)}
                className="flex items-center gap-1.5 text-xs font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
              >
                <ArrowLeft24Filled className="w-3.5 h-3.5" />
                <span>{t('back')}</span>
              </button>
            ) : (
              <span />
            )}
          </div>

          {/* Right CTAs */}
          <div className="flex items-center gap-3">
            {/* Skip (only step 3) */}
            {step === 3 && (
              <button
                type="button"
                onClick={() => goTo(4)}
                className="text-xs font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
              >
                {t('skip')}
              </button>
            )}

            {/* Primary CTA */}
            {step < 4 ? (
              <motion.button
                whileTap={{ scale: 0.96 }}
                whileHover={{ scale: 1.02 }}
                type="button"
                onClick={() => {
                  if (step === 1 && !nameInput.trim()) return;
                  goTo((step + 1) as Step);
                }}
                disabled={step === 1 && !nameInput.trim()}
                className="px-6 py-2.5 rounded-2xl bg-[#2BB5FF] hover:bg-[#1A8EFF] text-white font-extrabold text-xs shadow-lg shadow-[#2BB5FF]/30 flex items-center gap-2 disabled:opacity-40 transition-all"
              >
                <span>{step === 2 && !selectedType ? t('skip') : t('continue')}</span>
                <ArrowRight24Filled className="w-4 h-4" />
              </motion.button>
            ) : (
              <motion.button
                whileTap={{ scale: 0.96 }}
                whileHover={{ scale: 1.02 }}
                type="button"
                onClick={handleFinish}
                className="px-8 py-3 rounded-2xl bg-[#2BB5FF] hover:bg-[#1A8EFF] text-white font-extrabold text-xs shadow-xl shadow-[#2BB5FF]/30 flex items-center gap-2 transition-all"
              >
                <span>{t('openDashboard')}</span>
                <ArrowRight24Filled className="w-4 h-4" />
              </motion.button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
