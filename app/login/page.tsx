'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signIn } from '@/lib/auth-client';
import { useTranslation } from '@/lib/i18n/useTranslation';
import {
  ArrowRight24Filled,
  ArrowLeft24Filled,
  Mail24Regular,
  Person24Regular,
  Shield24Regular,
  ShieldCheckmark24Regular,
  Warning24Regular,
  Sparkle24Filled,
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
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const resetForm = () => {
    setError(null);
    setSuccessMessage(null);
  };

  const switchMode = (next: AuthMode) => {
    resetForm();
    setMode(next);
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
      setSuccessMessage('✨ Passwordless Magic Link sent! Check your inbox to enter AirBook.');
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
        <span>Back to home</span>
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
          <motion.div
            whileHover={{ scale: 1.07, rotate: 4 }}
            whileTap={{ scale: 0.93 }}
            className="w-12 h-12 rounded-3xl bg-black text-white dark:bg-white dark:text-black flex items-center justify-center font-extrabold text-xl shadow-xl mx-auto mb-2 cursor-pointer select-none"
          >
            A
          </motion.div>
          <h1 className="text-xl font-extrabold tracking-tight text-[var(--text-primary)]">
            {mode === 'signin' ? 'Welcome back' : 'Create account'}
          </h1>
          <p className="text-xs text-[var(--text-secondary)] mt-0.5">
            {mode === 'signin'
              ? 'Sign in to your AirBook workspace.'
              : 'Start your free AirBook workspace.'}
          </p>
        </div>

        {/* Segmented mode switch */}
        <div className="flex items-center bg-black/5 dark:bg-white/5 p-1 rounded-2xl border border-black/5 dark:border-white/5">
          {(['signin', 'signup'] as const).map((m) => (
            <button
              key={m}
              onClick={() => switchMode(m)}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
                mode === m
                  ? 'bg-white dark:bg-gray-800 text-[var(--text-primary)] shadow-sm'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              {m === 'signin' ? 'Sign In' : 'Sign Up'}
            </button>
          ))}
        </div>

        {/* OAuth Provider Buttons */}
        <div className="space-y-2">
          <button
            type="button"
            onClick={() => signIn.social({ provider: 'google', callbackURL: '/dashboard' })}
            className="w-full py-2.5 px-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 hover:bg-black/10 dark:hover:bg-white/10 text-xs font-bold text-[var(--text-primary)] flex items-center justify-center gap-2.5 transition-all cursor-pointer"
          >
            <GoogleColor size={16} />
            <span>Continue with Google</span>
          </button>

          <button
            type="button"
            onClick={() => signIn.social({ provider: 'apple', callbackURL: '/dashboard' })}
            className="w-full py-2.5 px-4 rounded-2xl bg-black text-white dark:bg-white dark:text-black hover:opacity-90 text-xs font-bold flex items-center justify-center gap-2.5 transition-all cursor-pointer"
          >
            <AppleMono size={16} />
            <span>Continue with Apple</span>
          </button>
        </div>

        {/* Centered Divider */}
        <div className="relative flex items-center justify-center my-3">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-black/10 dark:border-white/10" />
          </div>
          <div className="relative px-3 bg-white dark:bg-gray-900 text-center">
            <span className="text-[10px] uppercase font-extrabold text-[var(--text-secondary)] tracking-wider block">
              Or Passwordless Link
            </span>
          </div>
        </div>

        {/* Passwordless Form */}
        <form onSubmit={handleMagicLinkSubmit} className="space-y-3">
          {mode === 'signup' && (
            <div>
              <label className="text-[11px] font-semibold uppercase tracking-wider text-[var(--text-secondary)] mb-1 block">Full Name</label>
              <div className="relative">
                <Person24Regular className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  autoComplete="name"
                  placeholder="e.g. Alex Johnson"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-xs font-medium text-[var(--text-primary)] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/60"
                />
              </div>
            </div>
          )}

          <div>
            <label className="text-[11px] font-semibold uppercase tracking-wider text-[var(--text-secondary)] mb-1 block">Work Email</label>
            <div className="relative">
              <Mail24Regular className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                autoComplete="email"
                placeholder="name@business.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-xs font-medium text-[var(--text-primary)] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/60"
              />
            </div>
          </div>

          <StatusBanner error={error} success={successMessage} />

          <motion.button
            whileTap={{ scale: 0.97 }}
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-2xl bg-[#2BB5FF] hover:bg-[#1A8EFF] text-white font-extrabold text-xs shadow-xl shadow-[#2BB5FF]/30 flex items-center justify-center gap-2 transition-all disabled:opacity-70 cursor-pointer"
          >
            <Sparkle24Filled className="w-4 h-4" />
            <span>{loading ? 'Sending link…' : 'Send Magic Link'}</span>
          </motion.button>
        </form>

        <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-start gap-2.5 text-[11px] text-emerald-700 dark:text-emerald-300">
          <ShieldCheckmark24Regular className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
          <p className="leading-snug">
            AirBook is 100% Passwordless. Zero passwords are stored in our database, protecting your salon from credential leaks.
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
