'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { Tag24Filled, Payment24Filled, Gift24Regular, Sparkle24Regular, Add24Filled, Dismiss24Filled, CheckmarkCircle24Regular } from '@fluentui/react-icons';

interface MembershipItem {
  id: string;
  name: string;
  monthlyPriceCents: number;
  includedServicesCount: number;
  discountPercentRetail: number;
}

export const PackagesModule: React.FC = () => {
  const { t } = useTranslation();
  const [memberships, setMemberships] = useState<MembershipItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'membership' | 'gift'>('membership');

  // Form State
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('140');
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const fetchMemberships = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/memberships');
      const data = await res.json();
      if (data.success && Array.isArray(data.memberships)) {
        setMemberships(data.memberships);
      }
    } catch (err) {
      console.warn('Failed to load memberships from DB:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMemberships();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setSubmitting(true);
    try {
      if (modalType === 'membership') {
        const res = await fetch('/api/memberships', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: title.trim(),
            monthlyPrice: Number(price) || 140,
            includedServicesCount: 2,
            discountPercentRetail: 15,
          }),
        });
        const data = await res.json();
        if (data.success) {
          fetchMemberships();
        }
      }
      setSuccessMsg(`${title.trim()} issued & saved successfully!`);
      setTimeout(() => {
        setSuccessMsg(null);
        setIsModalOpen(false);
        setTitle('');
      }, 1200);
    } catch (err) {
      console.error('Failed to create membership:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-4 sm:p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-extrabold text-[var(--text-primary)] tracking-tight">
            {t('packagesTitle')}
          </h2>
          <p className="text-xs text-[var(--text-secondary)] mt-0.5">
            {t('packagesDesc')}
          </p>
        </div>

        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            setModalType('membership');
            setIsModalOpen(true);
          }}
          className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-black text-white dark:bg-white dark:text-black font-semibold text-xs shadow-md hover:opacity-90 transition-opacity"
        >
          <Add24Filled className="w-4 h-4" />
          <span>New Membership Tier</span>
        </motion.button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Memberships */}
        <div className="p-6 rounded-3xl glass-panel bg-white/70 dark:bg-gray-900/70 border border-white/60 dark:border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400 font-bold">
              <Sparkle24Regular className="w-5 h-5" />
              <h3 className="text-sm">{t('vipMemberships')}</h3>
            </div>
          </div>

          {memberships.length > 0 ? (
            memberships.map((m) => (
              <div key={m.id} className="p-4 rounded-2xl bg-purple-50/50 dark:bg-purple-950/30 border border-purple-500/20 space-y-2">
                <h4 className="text-xs font-bold">{m.name}</h4>
                <span className="text-lg font-extrabold block">${(m.monthlyPriceCents / 100).toFixed(2)}/mo</span>
                <ul className="text-[11px] text-[var(--text-secondary)] space-y-1">
                  <li>• {m.includedServicesCount} Included Signature Treatments</li>
                  <li>• {m.discountPercentRetail}% Off All Retail Store Products</li>
                  <li>• Priority Calendar Scheduling</li>
                </ul>
              </div>
            ))
          ) : (
            <div className="p-4 rounded-2xl bg-purple-50/50 dark:bg-purple-950/30 border border-purple-500/20 space-y-2">
              <h4 className="text-xs font-bold">{t('vipGlowPass')}</h4>
              <span className="text-lg font-extrabold block">{t('vipPrice')}</span>
              <ul className="text-[11px] text-[var(--text-secondary)] space-y-1">
                <li>{t('vipBenefit1')}</li>
                <li>{t('vipBenefit2')}</li>
                <li>{t('vipBenefit3')}</li>
              </ul>
            </div>
          )}
        </div>

        {/* Bundled Service Packages */}
        <div className="p-6 rounded-3xl glass-panel bg-white/70 dark:bg-gray-900/70 border border-white/60 dark:border-white/10 space-y-4">
          <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold">
            <Tag24Filled className="w-5 h-5" />
            <h3 className="text-sm">{t('serviceBundles')}</h3>
          </div>
          <div className="p-4 rounded-2xl bg-blue-50/50 dark:bg-blue-950/30 border border-blue-500/20 space-y-2">
            <h4 className="text-xs font-bold">{t('bundle6Sessions')}</h4>
            <span className="text-lg font-extrabold block">{t('bundlePrice')}</span>
            <p className="text-[11px] text-[var(--text-secondary)]">
              {t('bundleDesc')}
            </p>
          </div>
        </div>

        {/* Digital Gift Cards */}
        <div className="p-6 rounded-3xl glass-panel bg-white/70 dark:bg-gray-900/70 border border-white/60 dark:border-white/10 space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-pink-600 dark:text-pink-400 font-bold">
              <Gift24Regular className="w-5 h-5" />
              <h3 className="text-sm">{t('digitalGiftCards')}</h3>
            </div>
            <div className="p-4 rounded-2xl bg-pink-50/50 dark:bg-pink-950/30 border border-pink-500/20 space-y-2">
              <h4 className="text-xs font-bold">{t('customGiftVoucher')}</h4>
              <span className="text-lg font-extrabold block">{t('voucherRange')}</span>
              <p className="text-[11px] text-[var(--text-secondary)]">
                {t('voucherDesc')}
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              setModalType('gift');
              setIsModalOpen(true);
            }}
            className="w-full py-2.5 rounded-xl bg-pink-500 text-white font-bold text-xs shadow-md hover:bg-pink-600 transition-colors flex items-center justify-center gap-1.5"
          >
            <Gift24Regular className="w-4 h-4" />
            <span>Issue Gift Card</span>
          </button>
        </div>
      </div>

      {/* Creation Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[250] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            />

            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-md glass-panel rounded-[32px] p-6 bg-white/95 dark:bg-gray-900/95 border border-white/80 dark:border-white/10 z-10 space-y-4 shadow-2xl"
            >
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-5 right-5 p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-gray-400"
              >
                <Dismiss24Filled className="w-5 h-5" />
              </button>

              <h3 className="text-base font-bold text-[var(--text-primary)]">
                {modalType === 'membership' ? 'Create VIP Membership Tier' : 'Issue Digital Gift Card'}
              </h3>

              {successMsg ? (
                <div className="p-4 rounded-2xl bg-green-500/10 text-green-600 dark:text-green-400 text-xs font-bold flex items-center gap-2">
                  <CheckmarkCircle24Regular className="w-5 h-5" />
                  <span>{successMsg}</span>
                </div>
              ) : (
                <form onSubmit={handleCreate} className="space-y-3">
                  <div>
                    <label className="text-[11px] font-semibold uppercase tracking-wider text-[var(--text-secondary)] mb-1 block">
                      {modalType === 'membership' ? 'Membership Tier Title' : 'Recipient Name / Title'}
                    </label>
                    <input
                      type="text"
                      required
                      placeholder={modalType === 'membership' ? 'e.g. Diamond Unlimited Pass' : 'e.g. Birthday Voucher for Sarah'}
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-xs font-medium text-[var(--text-primary)] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold uppercase tracking-wider text-[var(--text-secondary)] mb-1 block">
                      {modalType === 'membership' ? 'Monthly Price ($)' : 'Gift Card Value ($)'}
                    </label>
                    <input
                      type="number"
                      required
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-xs font-medium text-[var(--text-primary)] focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3 rounded-2xl bg-black text-white dark:bg-white dark:text-black font-bold text-xs shadow-lg hover:opacity-90 transition-opacity"
                  >
                    {submitting ? 'Creating…' : 'Save & Publish'}
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
