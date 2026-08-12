'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signIn, signUp } from '@/lib/auth-client';
import { useTranslation } from '@/lib/i18n/useTranslation';
import {
  ArrowRight24Filled,
  ArrowLeft24Filled,
  LockClosed24Regular,
  Mail24Regular,
  Person24Regular,
  Shield24Regular,
  Warning24Regular,
  Eye24Filled,
  EyeOff24Filled,
} from '@fluentui/react-icons';

type AuthMode = 'signin' | 'signup' | 'forgot';

export default function LoginPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const [mode, setMode] = useState<AuthMode>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const resetForm = () => {
    setError(null);
    setSuccessMessage(null);
    setPassword('');
    setConfirmPassword('');
  };

  const switchMode = (next: AuthMode) => {
    resetForm();
    setMode(next);
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await signIn.email({ email, password });
    if (res?.error) {
      setError(res.error.message || 'Invalid email or password.');
      setLoading(false);
      return;
    }

    setSuccessMessage('Welcome back! Taking you to your dashboard…');
    setTimeout(() => {
      window.location.href = '/dashboard';
    }, 400);
    setLoading(false);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    setLoading(true);
    setError(null);

    const res = await signUp.email({ email, password, name: fullName });
    if (res?.error) {
      setError(res.error.message || 'Could not create account. Please try again.');
      setLoading(false);
      return;
    }

    setSuccessMessage('Account created! Setting up your workspace…');
    setTimeout(() => {
      window.location.href = '/onboarding';
    }, 400);
    setLoading(false);
  };

  const handleForgot = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    setLoading(false);
    setSuccessMessage('If that email exists, a reset link is on its way.');
  };

  const slideVariants = {
    initial: (dir: number) => ({ x: dir * 40, opacity: 0 }),
    animate: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: -dir * 40, opacity: 0 }),
  };

  const modeDir = mode === 'forgot' ? 1 : mode === 'signup' ? 1 : -1;

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
        className="w-full max-w-[400px] glass-panel rounded-[36px] p-8 shadow-2xl bg-white/90 dark:bg-gray-900/90 backdrop-blur-3xl border border-white/80 dark:border-white/10 z-10 relative overflow-hidden"
      >
        {/* Brand logo */}
        <div className="text-center mb-6">
          <motion.div
            whileHover={{ scale: 1.07, rotate: 4 }}
            whileTap={{ scale: 0.93 }}
            className="w-14 h-14 rounded-3xl bg-black text-white dark:bg-white dark:text-black flex items-center justify-center font-extrabold text-xl shadow-xl mx-auto mb-3 cursor-pointer select-none"
          >
            A
          </motion.div>
          <h1 className="text-2xl font-extrabold tracking-tight text-[var(--text-primary)]">
            {mode === 'signin' ? 'Welcome back' : mode === 'signup' ? 'Create account' : 'Reset password'}
          </h1>
          <p className="text-xs text-[var(--text-secondary)] mt-1">
            {mode === 'signin'
              ? 'Sign in to your AirBook workspace.'
              : mode === 'signup'
              ? 'Start your free AirBook workspace.'
              : "We'll email you a reset link."}
          </p>
        </div>

        {/* Segmented mode switch (only sign-in / sign-up) */}
        {mode !== 'forgot' && (
          <div className="flex items-center bg-black/5 dark:bg-white/5 p-1 rounded-2xl mb-5 border border-black/5 dark:border-white/5">
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
        )}

        {/* Animated form area */}
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={mode}
            custom={modeDir}
            variants={slideVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.18, ease: 'easeInOut' }}
          >
            {/* ─── SIGN IN ─── */}
            {mode === 'signin' && (
              <form onSubmit={handleSignIn} className="space-y-3.5">
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
                      className="w-full pl-10 pr-4 py-3 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-xs font-medium text-[var(--text-primary)] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/60"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[11px] font-semibold uppercase tracking-wider text-[var(--text-secondary)]">Password</label>
                    <button
                      type="button"
                      onClick={() => switchMode('forgot')}
                      className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <LockClosed24Regular className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      autoComplete="current-password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 pr-10 py-3 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-xs font-medium text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-blue-500/60"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff24Filled className="w-4 h-4" /> : <Eye24Filled className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <StatusBanner error={error} success={successMessage} />

                <motion.button
                  whileTap={{ scale: 0.97 }}
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-2xl bg-[#2BB5FF] hover:bg-[#1A8EFF] text-white font-extrabold text-xs shadow-xl shadow-[#2BB5FF]/30 flex items-center justify-center gap-2 mt-1 disabled:opacity-70 transition-all"
                >
                  <span>{loading ? 'Signing in…' : 'Sign In'}</span>
                  <ArrowRight24Filled className="w-4 h-4" />
                </motion.button>
              </form>
            )}

            {/* ─── SIGN UP ─── */}
            {mode === 'signup' && (
              <form onSubmit={handleSignUp} className="space-y-3.5">
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
                      className="w-full pl-10 pr-4 py-3 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-xs font-medium text-[var(--text-primary)] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/60"
                    />
                  </div>
                </div>

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
                      className="w-full pl-10 pr-4 py-3 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-xs font-medium text-[var(--text-primary)] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/60"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-semibold uppercase tracking-wider text-[var(--text-secondary)] mb-1 block">Password</label>
                  <div className="relative">
                    <LockClosed24Regular className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      autoComplete="new-password"
                      placeholder="Min. 8 characters"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 pr-10 py-3 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-xs font-medium text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-blue-500/60"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff24Filled className="w-4 h-4" /> : <Eye24Filled className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-semibold uppercase tracking-wider text-[var(--text-secondary)] mb-1 block">Confirm Password</label>
                  <div className="relative">
                    <LockClosed24Regular className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      autoComplete="new-password"
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-xs font-medium text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-blue-500/60"
                    />
                  </div>
                </div>

                <StatusBanner error={error} success={successMessage} />

                <motion.button
                  whileTap={{ scale: 0.97 }}
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-2xl bg-[#2BB5FF] hover:bg-[#1A8EFF] text-white font-extrabold text-xs shadow-xl shadow-[#2BB5FF]/30 flex items-center justify-center gap-2 mt-1 disabled:opacity-70 transition-all"
                >
                  <span>{loading ? 'Creating account…' : 'Create Account'}</span>
                  <ArrowRight24Filled className="w-4 h-4" />
                </motion.button>

                <p className="text-[10px] text-center text-[var(--text-muted)]">
                  By signing up you agree to our Terms & Privacy Policy.
                </p>
              </form>
            )}

            {/* ─── FORGOT PASSWORD ─── */}
            {mode === 'forgot' && (
              <form onSubmit={handleForgot} className="space-y-3.5">
                <button
                  type="button"
                  onClick={() => switchMode('signin')}
                  className="flex items-center gap-1.5 text-xs font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors mb-2"
                >
                  <ArrowLeft24Filled className="w-3.5 h-3.5" />
                  <span>Back to sign in</span>
                </button>

                <div>
                  <label className="text-[11px] font-semibold uppercase tracking-wider text-[var(--text-secondary)] mb-1 block">Your Email</label>
                  <div className="relative">
                    <Mail24Regular className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      autoComplete="email"
                      placeholder="name@business.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-xs font-medium text-[var(--text-primary)] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/60"
                    />
                  </div>
                </div>

                <StatusBanner error={error} success={successMessage} />

                <motion.button
                  whileTap={{ scale: 0.97 }}
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-2xl bg-[#2BB5FF] hover:bg-[#1A8EFF] text-white font-extrabold text-xs shadow-xl shadow-[#2BB5FF]/30 flex items-center justify-center gap-2 transition-all disabled:opacity-70"
                >
                  <span>{loading ? 'Sending…' : 'Send Reset Link'}</span>
                  <ArrowRight24Filled className="w-4 h-4" />
                </motion.button>
              </form>
            )}
          </motion.div>
        </AnimatePresence>
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
        <Shield24Regular className="w-4 h-4 text-green-500 flex-shrink-0" />
      )}
      <span>{error ?? success}</span>
    </motion.div>
  );
}
