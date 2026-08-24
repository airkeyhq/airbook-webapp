'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAirBookStore } from '@/lib/store';
import { CircleCloudIcon } from './Logo';
import { signIn, signUp } from '@/lib/auth-client';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { Dismiss24Filled, ArrowRight24Filled, Sparkle24Filled, Mail24Regular, LockClosed24Regular, Building24Regular, ShieldCheckmark24Regular } from '@fluentui/react-icons';
import GoogleColor from '@lobehub/icons/es/Google/components/Color';
import AppleMono from '@lobehub/icons/es/Apple/components/Mono';

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
      setMessage(err instanceof Error ? err.message : 'Could not send magic link.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[250] flex items-end md:items-center justify-center p-0 md:p-4">
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
          className="relative w-full md:max-w-md glass-panel rounded-t-[32px] md:rounded-[32px] rounded-b-none md:rounded-b-[32px] p-6 shadow-2xl bg-white/90 dark:bg-gray-900/90 border-t md:border border-white/80 dark:border-white/10 z-10 space-y-4 max-h-[92vh] md:max-h-[85vh] overflow-y-auto"
        >
          {/* Mobile & Tablet Drag Handle */}
          <div className="w-full pt-1 pb-1 flex md:hidden justify-center bg-transparent flex-shrink-0">
            <div className="w-12 h-1.5 rounded-full bg-black/20 dark:bg-white/20" />
          </div>

          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-black/5 dark:border-white/10">
            <div className="flex items-center gap-2">
              <CircleCloudIcon size={26} />
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
              onClick={async () => {
                const res = await signIn.social({ provider: 'google', callbackURL: '/dashboard' });
                if (res?.data?.url) window.location.href = res.data.url;
              }}
              className="w-full py-2.5 px-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 hover:bg-black/10 dark:hover:bg-white/10 text-xs font-bold text-[var(--text-primary)] flex items-center justify-center gap-2.5 transition-all cursor-pointer"
            >
              <GoogleColor size={16} />
              <span>Continue with Google</span>
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

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3">
            {mode === 'signup' && (
              <>
                <div>
                  <label className="text-[11px] font-semibold uppercase tracking-wider text-[var(--text-secondary)] mb-1 block">
                    Workspace / Salon Name
                  </label>
                  <div className="relative">
                    <Building24Regular className="w-4 h-4 text-[var(--text-muted)] absolute left-3.5 top-3 z-10" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Glow Beauty Studio"
                      value={workspaceName}
                      onChange={(e) => setWorkspaceNameInput(e.target.value)}
                      className="input-base w-full pl-10"
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
                    className="input-base w-full"
                  />
                </div>
              </>
            )}

            <div>
              <label className="text-[11px] font-semibold uppercase tracking-wider text-[var(--text-secondary)] mb-1 block">
                Work Email
              </label>
              <div className="relative">
                <Mail24Regular className="w-4 h-4 text-[var(--text-muted)] absolute left-3.5 top-3 z-10" />
                <input
                  type="email"
                  required
                  placeholder="name@business.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-base w-full pl-10"
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
              type="submit"
              disabled={loading}
              className="btn-primary w-full disabled:opacity-50 mt-2"
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
