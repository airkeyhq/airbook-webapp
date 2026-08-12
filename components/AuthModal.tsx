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
    setLoading(true);
    setMessage(null);

    if (mode === 'signup') {
      if (workspaceName.trim()) {
        setWorkspaceName(workspaceName.trim());
      }
      const res = await signUp.email({
        email,
        password,
        name: name || 'Provider Owner',
      });
      if (res?.error) {
        setMessage(res.error.message || 'Could not create account.');
        setLoading(false);
        return;
      }
      setMessage('Account & Workspace created successfully!');
    } else {
      const res = await signIn.email({
        email,
        password,
      });
      if (res?.error) {
        setMessage(res.error.message || 'Invalid credentials.');
        setLoading(false);
        return;
      }
      setMessage('Signed in successfully!');
    }
    setTimeout(() => {
      onClose();
    }, 600);
    setLoading(false);
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
          className="relative w-full max-w-md glass-panel rounded-[32px] p-6 shadow-2xl bg-white/90 dark:bg-gray-900/90 border border-white/80 dark:border-white/10 z-10"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-black/5 dark:border-white/10">
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

          {/* Mode Selector Tabs */}
          <div className="flex items-center bg-black/5 dark:bg-white/5 p-1 rounded-2xl my-4">
            <button
              onClick={() => setMode('signup')}
              className={`flex-1 py-2 text-xs font-semibold rounded-xl transition-all ${
                mode === 'signup'
                  ? 'bg-white dark:bg-gray-800 text-[var(--text-primary)] shadow-sm'
                  : 'text-[var(--text-secondary)]'
              }`}
            >
              {t('signUp')}
            </button>
            <button
              onClick={() => setMode('signin')}
              className={`flex-1 py-2 text-xs font-semibold rounded-xl transition-all ${
                mode === 'signin'
                  ? 'bg-white dark:bg-gray-800 text-[var(--text-primary)] shadow-sm'
                  : 'text-[var(--text-secondary)]'
              }`}
            >
              {t('signIn')}
            </button>
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
                      placeholder="e.g. Eduardo's Spa & Haircut Lounge"
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
                    placeholder="e.g. Eduardo Moreno"
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

            <div>
              <label className="text-[11px] font-semibold uppercase tracking-wider text-[var(--text-secondary)] mb-1 block">
                Password
              </label>
              <div className="relative">
                <LockClosed24Regular className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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
              className="w-full mt-2 py-3 rounded-2xl bg-[#2BB5FF] hover:bg-[#1A8EFF] text-white font-bold text-xs shadow-lg shadow-[#2BB5FF]/30 flex items-center justify-center gap-2 transition-all"
            >
              <span>{loading ? 'Processing...' : mode === 'signup' ? 'Create Workspace' : 'Sign In'}</span>
              <ArrowRight24Filled className="w-3.5 h-3.5" />
            </motion.button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
