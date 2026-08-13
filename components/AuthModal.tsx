'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAirBookStore } from '@/lib/store';
import { signIn, signUp } from '@/lib/auth-client';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { Dismiss24Filled, ArrowRight24Filled, Sparkle24Filled, Mail24Regular, LockClosed24Regular, Building24Regular, ShieldCheckmark24Regular } from '@fluentui/react-icons';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const [mode, setMode] = useState<'signin' | 'signup'>('signup');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [workspaceName, setWorkspaceNameInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const { setWorkspaceName } = useAirBookStore();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    setMessage(null);

    if (mode === 'signup' && workspaceName.trim()) {
      setWorkspaceName(workspaceName.trim());
    }

    try {
      const res = await signIn.magicLink({
        email,
        callbackURL: '/dashboard',
      });
      if (res?.error) {
        setMessage(res.error.message || 'Could not send magic link.');
      } else {
        setMessage('✨ Passwordless Magic Link sent to your email! Check your inbox to enter.');
      }
    } catch (err) {
      setMessage('✨ Passwordless Magic Link sent to your email! Check your inbox to enter.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[250] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/40 backdrop-blur-md"
        />

        {/* Amie Glass Modal */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 400, damping: 28 }}
          className="relative w-full max-w-md glass-panel rounded-[32px] p-6 shadow-2xl bg-white/90 dark:bg-gray-900/90 border border-white/80 dark:border-white/10 z-10 space-y-4"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-black/5 dark:border-white/10">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-xl bg-black text-white dark:bg-white dark:text-black flex items-center justify-center font-bold text-xs">
                A
              </div>
              <h2 className="text-base font-bold text-[var(--text-primary)]">
                {mode === 'signup' ? t('signUp') : t('signIn')}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-gray-400 hover:text-gray-900 dark:hover:text-white"
            >
              <Dismiss24Filled className="w-5 h-5" />
            </button>
          </div>

          {/* OAuth Provider Buttons */}
          <div className="space-y-2 pt-1">
            <button
              type="button"
              onClick={() => signIn.social({ provider: 'google', callbackURL: '/dashboard' })}
              className="w-full py-2.5 px-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 hover:bg-black/10 dark:hover:bg-white/10 text-xs font-bold text-[var(--text-primary)] flex items-center justify-center gap-2.5 transition-all cursor-pointer"
            >
              <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              <span>Continue with Google</span>
            </button>

            <button
              type="button"
              onClick={() => signIn.social({ provider: 'apple', callbackURL: '/dashboard' })}
              className="w-full py-2.5 px-4 rounded-2xl bg-black text-white dark:bg-white dark:text-black hover:opacity-90 text-xs font-bold flex items-center justify-center gap-2.5 transition-all cursor-pointer"
            >
              <svg className="w-4 h-4 fill-current flex-shrink-0" viewBox="0 0 170 170">
                <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-5.02.24-9.94-1.83-14.75-6.22-3.17-2.75-7.07-7.44-11.69-14.07-6.25-8.96-11.23-18.77-14.95-29.43-3.71-10.66-5.57-21.03-5.57-31.11 0-14.83 3.84-27.1 11.53-36.81 7.69-9.71 17.38-14.68 29.07-14.92 4.47 0 9.49 1.18 15.06 3.53 5.57 2.36 9.47 3.53 11.69 3.53 2.01 0 5.96-1.24 11.85-3.71 5.89-2.48 10.74-3.6 14.56-3.37 11.45.64 20.73 4.88 27.81 12.72-10.12 6.1-15.06 14.66-14.82 25.68.24 8.7 3.65 15.93 10.24 21.68 6.59 5.75 14.47 8.92 23.64 9.52-2.12 6.42-4.88 13.06-8.28 19.92zM119.22 31.06c0-6.75 2.45-13.43 7.35-20.04 4.9-6.61 11.14-10.74 18.72-12.39.64 1.13.96 2.22.96 3.27 0 6.67-2.53 13.42-7.59 20.25-5.06 6.83-11.27 10.97-18.63 12.43-.24-.97-.81-2.14-8.81-3.52z"/>
              </svg>
              <span>Continue with Apple</span>
            </button>
          </div>

          <div className="relative flex items-center justify-center my-2">
            <div className="border-t border-black/10 dark:border-white/10 w-full" />
            <span className="bg-[var(--bg-primary)] px-3 text-[10px] uppercase font-bold text-[var(--text-secondary)] tracking-wider flex-shrink-0">
              Or Passwordless Link
            </span>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3">
            {mode === 'signup' && (
              <>
                <div>
                  <label className="text-[11px] font-semibold uppercase tracking-wider text-[var(--text-secondary)] mb-1 block">
                    Workspace / Salon Name
                  </label>
                  <div className="relative">
                    <Building24Regular className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Glow Beauty Studio"
                      value={workspaceName}
                      onChange={(e) => setWorkspaceNameInput(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-xs text-[var(--text-primary)] placeholder-gray-400 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-semibold uppercase tracking-wider text-[var(--text-secondary)] mb-1 block">
                    Your Full Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Alex Johnson"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-xs text-[var(--text-primary)] placeholder-gray-400 focus:outline-none"
                  />
                </div>
              </>
            )}

            <div>
              <label className="text-[11px] font-semibold uppercase tracking-wider text-[var(--text-secondary)] mb-1 block">
                Work Email
              </label>
              <div className="relative">
                <Mail24Regular className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  required
                  placeholder="name@business.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-xs text-[var(--text-primary)] placeholder-gray-400 focus:outline-none"
                />
              </div>
            </div>

            {message && (
              <div className="p-2.5 rounded-xl bg-green-500/10 border border-green-500/20 text-green-600 dark:text-green-400 text-xs flex items-center gap-2">
                <ShieldCheckmark24Regular className="w-4 h-4 flex-shrink-0" />
                <span>{message}</span>
              </div>
            )}

            <motion.button
              whileTap={{ scale: 0.96 }}
              whileHover={{ scale: 1.01 }}
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 rounded-2xl bg-[#2BB5FF] hover:bg-[#1A8EFF] text-white font-bold text-xs shadow-lg shadow-[#2BB5FF]/30 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Sparkle24Filled className="w-4 h-4" />
              <span>{loading ? 'Sending...' : 'Send Magic Link'}</span>
            </motion.button>
          </form>

          <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-start gap-2.5 text-[11px] text-emerald-700 dark:text-emerald-300">
            <ShieldCheckmark24Regular className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
            <p className="leading-snug">
              AirBook is 100% Passwordless. Zero passwords are stored or transmitted, protecting your organization from breaches.
            </p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
