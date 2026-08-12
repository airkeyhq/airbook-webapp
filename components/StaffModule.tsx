'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { useAirBookStore } from '@/lib/store';
import { Add24Filled, Dismiss24Filled, People24Regular, Person24Regular } from '@fluentui/react-icons';

interface StaffItem {
  id: string;
  name: string;
  role: string;
  avatarEmoji?: string;
  commissionPercent?: number;
  email?: string;
  phone?: string;
  isActive?: boolean;
}

export const StaffModule: React.FC = () => {
  const { t } = useTranslation();
  const [staffList, setStaffList] = useState<StaffItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [avatarEmoji, setAvatarEmoji] = useState('👨🏻‍🎨');
  const [commissionPercent, setCommissionPercent] = useState(70);
  const [submitting, setSubmitting] = useState(false);

  const isDemoMode = useAirBookStore((s) => s.isDemoMode);
  const demoStaff = useAirBookStore((s) => s.staffMembers);

  const fetchStaff = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/staff');
      const data = await res.json();
      if (data.success && Array.isArray(data.staff)) {
        setStaffList(data.staff);
      }
    } catch (err) {
      console.warn('Failed to fetch staff from DB:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isDemoMode) {
      setStaffList(demoStaff as any);
    } else {
      fetchStaff();
    }
  }, [isDemoMode, demoStaff]);

  const handleAddStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      setSubmitting(true);
      const res = await fetch('/api/staff', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          role: role.trim() || 'Stylist & Specialist',
          email: email.trim() || undefined,
          phone: phone.trim() || undefined,
          avatarEmoji: avatarEmoji || '👨🏻‍🎨',
          commissionPercent: Number(commissionPercent) || 70,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setIsAddModalOpen(false);
        setName('');
        setRole('');
        setEmail('');
        setPhone('');
        fetchStaff();
      }
    } catch (err) {
      console.error('Failed to add staff:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const EMOJI_OPTIONS = ['👨🏻‍🎨', '🧑🏼‍⚕️', '🧔🏻‍♂️', '👩🏼‍🦱', '💇🏻‍♀️', '💆🏻‍♂️', '👨🏽‍💼'];

  return (
    <div className="w-full max-w-5xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-extrabold text-[var(--text-primary)] tracking-tight">
            {t('staffTitle')}
          </h2>
          <p className="text-xs text-[var(--text-secondary)] mt-0.5">
            {t('staffDesc')}
          </p>
        </div>

        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-black text-white dark:bg-white dark:text-black font-semibold text-xs shadow-md hover:opacity-90 transition-opacity"
        >
          <Add24Filled className="w-4 h-4" />
          <span>{t('addStaffMember')}</span>
        </motion.button>
      </div>

      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="p-5 rounded-3xl glass-panel bg-white/70 dark:bg-gray-900/70 border border-white/60 dark:border-white/10 flex items-start justify-between gap-4 shadow-sm animate-pulse"
            >
              <div className="flex items-center gap-4 w-full">
                <div className="w-14 h-14 rounded-2xl bg-black/10 dark:bg-white/10 flex-shrink-0" />
                <div className="space-y-2 flex-1">
                  <div className="h-4 w-32 rounded-lg bg-black/10 dark:bg-white/10" />
                  <div className="h-3 w-24 rounded-lg bg-black/5 dark:bg-white/5" />
                  <div className="h-4 w-28 rounded-full bg-black/5 dark:bg-white/5 mt-1" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {staffList.length === 0 ? (
            <div className="col-span-2 min-h-[380px] sm:min-h-[480px] p-8 sm:p-12 rounded-3xl border-2 border-dashed border-black/10 dark:border-white/10 flex flex-col items-center justify-center text-center">
              <People24Regular className="w-10 h-10 text-[var(--text-muted)] mx-auto mb-3 opacity-50" />
              <p className="text-sm font-bold text-[var(--text-secondary)]">{t('noStaff')}</p>
              <p className="text-xs text-[var(--text-muted)] mt-1">{t('noStaffSub')}</p>
            </div>
          ) : (
            staffList.map((stf) => (
              <motion.div
                key={stf.id}
                whileHover={{ y: -2 }}
                transition={{ duration: 0.1, ease: 'easeOut' }}
                className="p-5 rounded-3xl glass-panel bg-white/70 dark:bg-gray-900/70 border border-white/60 dark:border-white/10 flex items-start justify-between gap-4 shadow-sm transition-all duration-100 ease-out"
              >
                <div className="flex items-center gap-4">
                  <span className="text-4xl p-3 rounded-2xl bg-black/5 dark:bg-white/5">{stf.avatarEmoji || '👨🏻‍🎨'}</span>
                  <div>
                    <h3 className="text-base font-bold text-[var(--text-primary)]">{stf.name}</h3>
                    <p className="text-xs text-[var(--text-secondary)]">{stf.role}</p>
                    <div className="mt-2 flex items-center gap-2 flex-wrap">
                      <span className="px-2.5 py-1 rounded-full bg-green-500/10 text-green-600 dark:text-green-400 text-[10px] font-bold">
                        {stf.commissionPercent ?? 70}% {t('commissionSplit')}
                      </span>
                      <span className="text-[10px] font-mono text-[var(--text-muted)]">
                        Mon - Fri (09:00 - 18:00)
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      )}

      {/* Add Staff Modal */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-[250] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAddModalOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-md bg-[var(--bg-primary)] border border-[var(--border-subtle)] rounded-3xl p-6 shadow-2xl z-10 space-y-4"
            >
              <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-3">
                <h3 className="text-base font-bold text-[var(--text-primary)]">{t('addStaffMember')}</h3>
                <button onClick={() => setIsAddModalOpen(false)} className="text-[var(--text-muted)] hover:text-[var(--text-primary)]">
                  <Dismiss24Filled className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddStaff} className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-[var(--text-secondary)] mb-1 block">{t('fullName')} *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Marcus Vance"
                    className="w-full px-3.5 py-2.5 rounded-2xl bg-black/5 dark:bg-white/5 border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-[var(--text-secondary)] mb-1 block">{t('role')}</label>
                  <input
                    type="text"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    placeholder="e.g. Master Barber / Color Specialist"
                    className="w-full px-3.5 py-2.5 rounded-2xl bg-black/5 dark:bg-white/5 border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-[var(--text-secondary)] mb-1 block">{t('email')}</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="staff@business.com"
                      className="w-full px-3.5 py-2.5 rounded-2xl bg-black/5 dark:bg-white/5 border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-[var(--text-secondary)] mb-1 block">{t('commissionSplit')}</label>
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={commissionPercent}
                      onChange={(e) => setCommissionPercent(Number(e.target.value))}
                      className="w-full px-3.5 py-2.5 rounded-2xl bg-black/5 dark:bg-white/5 border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-[var(--text-secondary)] mb-1 block">Avatar Emoji</label>
                  <div className="flex items-center gap-2">
                    {EMOJI_OPTIONS.map((emoji) => (
                      <button
                        type="button"
                        key={emoji}
                        onClick={() => setAvatarEmoji(emoji)}
                        className={`text-xl p-2 rounded-xl transition-transform ${avatarEmoji === emoji ? 'bg-blue-500/20 scale-110 border border-blue-500' : 'bg-black/5 dark:bg-white/5'}`}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="px-4 py-2 rounded-2xl bg-black/5 dark:bg-white/10 text-xs font-semibold text-[var(--text-secondary)]"
                  >
                    {t('cancel')}
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-4 py-2 rounded-2xl bg-blue-600 text-white text-xs font-bold shadow-md hover:bg-blue-700 disabled:opacity-50"
                  >
                    {submitting ? t('saving') : t('saveStaff')}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
