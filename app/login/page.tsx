'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Logo } from '@/components/Logo';
import { useRouter } from 'next/navigation';
import { signIn } from '@/lib/auth-client';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { FloatingInput } from '@/components/FloatingInput';
import { isPasskeySupported, signInWithPasskey } from '@/lib/passkey';
import {
  ArrowLeft24Filled,
  Mail24Regular,
  Person24Regular,
  ShieldCheckmark24Regular,
  Warning24Regular,
  Sparkle24Filled,
  Fingerprint24Filled,
} from '@fluentui/react-icons';

import GoogleColor from '@lobehub/icons/es/Google/components/Color';
import AppleMono from '@lobehub/icons/es/Apple/components/Mono';

type AuthMode = 'signin' | 'signup';

export default function LoginPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const [mode, setMode] = useState<AuthMode>('signin');
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [passkeyLoading, setPasskeyLoading] = useState(false);
  const [passkeyAvailable, setPasskeyAvailable] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    isPasskeySupported().then((supported) => setPasskeyAvailable(supported));
  }, []);

  const resetForm = () => {
    setError(null);
    setSuccessMessage(null);
  };

  const switchMode = (next: AuthMode) => {
    resetForm();
    setMode(next);
  };

  const handlePasskeySignIn = async () => {
    setPasskeyLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const result = await signInWithPasskey(email.trim() || undefined);
      if (result.success) {
        setSuccessMessage(t('passkeyAuthSuccess'));
        setTimeout(() => {
          router.push('/dashboard');
        }, 300);
      } else if (result.error) {
        setError(result.error);
      }
    } catch (err: any) {
      setError(err?.message || t('passkeyAuthFailed'));
    } finally {
      setPasskeyLoading(false);
    }
  };

  const handleMagicLinkSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const res = await signIn.magicLink({
        email,
        callbackURL: mode === 'signup' ? '/onboarding' : '/dashboard',
      });
      if (res?.error) {
        setError(res.error.message || 'Could not send magic link.');
      } else {
        setSuccessMessage('✨ Passwordless Magic Link sent! Check your inbox to enter AirBook.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not send magic link.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F6FA] dark:bg-[#0C0C10] flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Back to home */}
      <Link
        href="/"
        className="absolute top-6 left-6 flex items-center gap-1.5 text-xs font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors z-20"
      >
        <ArrowLeft24Filled className="w-3.5 h-3.5" />
        <span>{t('backToHome')}</span>
      </Link>

      {/* Animated background orb */}
      <motion.div
        animate={{ scale: [1, 1.08, 1], rotate: [0, 60, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-violet-400/10 via-blue-400/8 to-pink-400/10 rounded-full blur-3xl pointer-events-none"
      />

      {/* Auth Card */}
      <motion.div
        initial={{ y: 24, opacity: 0, scale: 0.96 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        transition={{ type: 'spring', stiffness: 340, damping: 26 }}
        className="w-full max-w-[400px] glass-panel rounded-[36px] p-7 shadow-2xl bg-white/90 dark:bg-gray-900/90 backdrop-blur-3xl border border-white/80 dark:border-white/10 z-10 relative overflow-hidden space-y-4"
      >
        {/* Brand logo */}
        <div className="text-center">
          <div className="flex justify-center mb-3">
            <Logo size={48} animated />
          </div>
          <h1 className="text-xl font-extrabold tracking-tight text-[var(--text-primary)]">
            {mode === 'signin' ? t('welcomeBack') : t('createAccount')}
          </h1>
          <p className="text-xs text-[var(--text-secondary)] mt-0.5">
            {mode === 'signin'
              ? t('signInSubtitle')
              : t('signUpSubtitle')}
          </p>
        </div>

        {/* Segmented mode switch */}
        <div className="flex items-center bg-black/5 dark:bg-white/5 p-1 rounded-2xl border border-black/5 dark:border-white/5">
          {(['signin', 'signup'] as const).map((m) => (
            <button
              key={m}
              onClick={() => switchMode(m)}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                mode === m
                  ? 'bg-white dark:bg-gray-800 text-[var(--text-primary)] shadow-sm'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              {m === 'signin' ? t('signIn') : t('signUp')}
            </button>
          ))}
        </div>

        {/* Passkey Biometric Sign-In CTA */}
        {passkeyAvailable && mode === 'signin' && (
          <motion.button
            whileTap={{ scale: 0.97 }}
            type="button"
            onClick={handlePasskeySignIn}
            disabled={passkeyLoading}
            className="w-full py-3 px-4 rounded-2xl bg-black text-white dark:bg-white dark:text-black hover:opacity-90 active:scale-98 border border-[var(--border-subtle)] text-xs font-extrabold flex items-center justify-center gap-2.5 transition-all shadow-md cursor-pointer"
          >
            <Fingerprint24Filled className="w-5 h-5 text-[var(--color-accent-primary)]" />
            <span>{passkeyLoading ? t('passkeyVerifying') : t('signInWithPasskey')}</span>
          </motion.button>
        )}

        {/* OAuth Provider Buttons */}
        <div className="space-y-2">
          <button
            type="button"
            onClick={async () => {
              const res = await signIn.social({ provider: 'google', callbackURL: '/dashboard' });
              if (res?.data?.url) window.location.href = res.data.url;
            }}
            className="w-full py-2.5 px-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 hover:bg-black/10 dark:hover:bg-white/10 text-xs font-bold text-[var(--text-primary)] flex items-center justify-center gap-2.5 transition-all cursor-pointer"
          >
            <GoogleColor size={16} />
            <span>{t('continueWithGoogle')}</span>
          </button>

          <button
            type="button"
            onClick={async () => {
              const res = await signIn.social({ provider: 'apple', callbackURL: '/dashboard' });
              if (res?.data?.url) window.location.href = res.data.url;
            }}
            className="w-full py-2.5 px-4 rounded-2xl bg-black text-white dark:bg-white dark:text-black hover:opacity-90 text-xs font-bold flex items-center justify-center gap-2.5 transition-all cursor-pointer"
          >
            <AppleMono size={16} />
            <span>{t('continueWithApple')}</span>
          </button>
        </div>

        {/* Centered Divider */}
        <div className="relative flex items-center justify-center my-3">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-black/10 dark:border-white/10" />
          </div>
          <div className="relative px-3 bg-white dark:bg-gray-900 text-center">
            <span className="text-[10px] uppercase font-extrabold text-[var(--text-secondary)] tracking-wider block">
              {t('orMagicLink')}
            </span>
          </div>
        </div>

        {/* Passwordless Form */}
        <form onSubmit={handleMagicLinkSubmit} className="space-y-3">
          {mode === 'signup' && (
            <FloatingInput
              label={t('fullName')}
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              icon={<Person24Regular className="w-4 h-4 text-[var(--text-muted)]" />}
            />
          )}

          <FloatingInput
            label={t('workEmail')}
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            icon={<Mail24Regular className="w-4 h-4 text-[var(--text-muted)]" />}
          />

          <StatusBanner error={error} success={successMessage} />

          <motion.button
            whileTap={{ scale: 0.97 }}
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-3 h-12 flex items-center justify-center gap-2 cursor-pointer"
          >
            <Sparkle24Filled className="w-4 h-4" />
            <span>{loading ? t('sendingLink') : t('sendMagicLink')}</span>
          </motion.button>
        </form>

        <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-start gap-2.5 text-[11px] text-emerald-700 dark:text-emerald-300">
          <ShieldCheckmark24Regular className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
          <p className="leading-snug">
            {t('passwordlessSecurityNotice')}
          </p>
        </div>
      </motion.div>
    </div>
  );
}

function StatusBanner({ error, success }: { error: string | null; success: string | null }) {
  if (!error && !success) return null;
  const isError = !!error;
  return (
    <motion.div
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      className={`p-3 rounded-2xl border text-xs flex items-center gap-2 ${
        isError
          ? 'bg-red-500/10 border-red-500/20 text-red-600 dark:text-red-400'
          : 'bg-green-500/10 border-green-500/20 text-green-600 dark:text-green-400'
      }`}
    >
      {isError ? (
        <Warning24Regular className="w-4 h-4 flex-shrink-0" />
      ) : (
        <ShieldCheckmark24Regular className="w-4 h-4 text-green-500 flex-shrink-0" />
      )}
      <span>{error ?? success}</span>
    </motion.div>
  );
}
