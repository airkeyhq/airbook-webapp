'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { useToast } from '@/components/Toast';
import {
  Building24Filled,
  Dismiss24Filled,
  Add24Filled,
  Save24Filled,
  Sparkle24Filled,
} from '@fluentui/react-icons';

interface AddLocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLocationCreated: () => void;
}

export const AddLocationModal: React.FC<AddLocationModalProps> = ({
  isOpen,
  onClose,
  onLocationCreated,
}) => {
  const { t } = useTranslation();
  const { addToast } = useToast();

  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [locationType, setLocationType] = useState<'flagship' | 'branch' | 'pop_up'>('branch');
  const [managerName, setManagerName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleNameChange = (val: string) => {
    setName(val);
    if (!slug || slug === name.toLowerCase().replace(/[^a-z0-9]/g, '-')) {
      setSlug(val.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-'));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !slug.trim()) return;

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/workspaces/locations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          slug: slug.trim(),
          address: address.trim(),
          phone: phone.trim(),
          locationType,
          managerName: managerName.trim(),
        }),
      });

      const data = await res.json();
      if (data.success) {
        addToast(t('branchProvisionedSuccess'), 'success');
        onLocationCreated();
        onClose();
      } else {
        addToast(data.error || 'Failed to provision location branch.', 'error');
      }
    } catch (err) {
      console.error('Error creating location:', err);
      addToast('Error provisioning location.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[260] flex items-end md:items-center justify-center p-0 md:p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-xs"
        />

        {/* Modal Dialog */}
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 40, scale: 0.98 }}
          transition={{ type: 'spring', damping: 28, stiffness: 380 }}
          className="relative w-full max-w-lg bg-[var(--bg-primary)] border border-[var(--border-subtle)] rounded-t-[32px] md:rounded-3xl shadow-2xl z-10 flex flex-col max-h-[92vh] md:max-h-[85vh] overflow-hidden"
        >
          {/* Mobile & Tablet Drag Handle */}
          <div className="w-full pt-3 pb-1 flex md:hidden justify-center bg-[var(--bg-primary)] flex-shrink-0">
            <div className="w-12 h-1.5 rounded-full bg-black/20 dark:bg-white/20" />
          </div>

          {/* Header */}
          <div className="w-full px-6 py-4 flex items-center justify-between flex-shrink-0 bg-[var(--bg-primary)] border-b border-[var(--border-subtle)]">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-blue-500/10 text-blue-600 flex items-center justify-center flex-shrink-0">
                <Building24Filled className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-[var(--text-primary)]">
                  {t('addNewBranchTitle')}
                </h3>
                <p className="text-xs text-[var(--text-secondary)]">
                  Multi-Location Enterprise Provisioning
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-[var(--text-secondary)] transition-colors cursor-pointer"
            >
              <Dismiss24Filled className="w-5 h-5" />
            </button>
          </div>

          {/* Body Form */}
          <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 flex-1">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[var(--text-secondary)] block">
                {t('branchNameLabel')} *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="e.g. AirBook · Soho Flagship"
                className="w-full px-4 py-2.5 rounded-xl bg-black/5 dark:bg-white/5 border border-[var(--border-subtle)] text-xs font-semibold text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[var(--text-secondary)] block">
                {t('branchSlugLabel')} *
              </label>
              <div className="flex items-center gap-1">
                <span className="text-xs font-mono text-[var(--text-muted)] bg-black/5 dark:bg-white/5 px-2.5 py-2.5 rounded-xl border border-[var(--border-subtle)]">
                  airbook.app/book/
                </span>
                <input
                  type="text"
                  required
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="soho-flagship"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/5 dark:bg-white/5 border border-[var(--border-subtle)] text-xs font-mono font-bold text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[var(--text-secondary)] block">
                {t('branchAddressLabel')}
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="e.g. 482 Broome St, New York, NY 10013"
                className="w-full px-4 py-2.5 rounded-xl bg-black/5 dark:bg-white/5 border border-[var(--border-subtle)] text-xs font-semibold text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[var(--text-secondary)] block">
                  {t('branchTypeLabel')}
                </label>
                <select
                  value={locationType}
                  onChange={(e) => setLocationType(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-xs font-semibold text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                >
                  <option value="flagship">{t('flagship')}</option>
                  <option value="branch">{t('branch')}</option>
                  <option value="pop_up">{t('popUp')}</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[var(--text-secondary)] block">
                  {t('branchManagerLabel')}
                </label>
                <input
                  type="text"
                  value={managerName}
                  onChange={(e) => setManagerName(e.target.value)}
                  placeholder="e.g. Elena Rostova"
                  className="w-full px-4 py-2.5 rounded-xl bg-black/5 dark:bg-white/5 border border-[var(--border-subtle)] text-xs font-semibold text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[var(--text-secondary)] block">
                Branch Contact Phone
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 (212) 555-0199"
                className="w-full px-4 py-2.5 rounded-xl bg-black/5 dark:bg-white/5 border border-[var(--border-subtle)] text-xs font-semibold text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              />
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-[var(--border-subtle)] flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl border border-[var(--border-subtle)] text-xs font-bold text-[var(--text-secondary)] hover:bg-black/5"
              >
                {t('cancel')}
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs shadow-md flex items-center gap-2 transition-all cursor-pointer"
              >
                <Add24Filled className="w-4 h-4" />
                <span>{isSubmitting ? 'Deploying Branch…' : 'Deploy Location Branch'}</span>
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
