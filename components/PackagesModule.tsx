'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { Tag24Regular, Payment24Filled, Gift24Regular, Gift24Filled, Sparkle24Regular, Add24Filled, Dismiss24Filled, CheckmarkCircle24Regular } from '@fluentui/react-icons';

interface MembershipItem {
  id: string;
  name: string;
  monthlyPriceCents: number;
  includedServicesCount: number;
  discountPercentRetail: number;
}

interface GiftCardItem {
  id: string;
  code: string;
  initialBalanceCents: number;
  currentBalanceCents: number;
  recipientEmail?: string;
}

interface PromoItem {
  id: string;
  code: string;
  discountPercent: number;
  currentUses: number;
  maxUses: number;
}

export const PackagesModule: React.FC = () => {
  const { t } = useTranslation();
  const [memberships, setMemberships] = useState<MembershipItem[]>([]);
  const [giftCards, setGiftCards] = useState<GiftCardItem[]>([]);
  const [promos, setPromos] = useState<PromoItem[]>([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'membership' | 'gift' | 'promo'>('membership');

  // Form State
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('140');
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [memRes, giftRes, promoRes] = await Promise.all([
        fetch('/api/memberships').then((r) => r.json()).catch(() => ({})),
        fetch('/api/gift-cards').then((r) => r.json()).catch(() => ({})),
        fetch('/api/promotions').then((r) => r.json()).catch(() => ({})),
      ]);

      if (memRes.success && Array.isArray(memRes.memberships)) {
        setMemberships(memRes.memberships);
      }
      if (giftRes.success && Array.isArray(giftRes.giftCards)) {
        setGiftCards(giftRes.giftCards);
      }
      if (Array.isArray(promoRes.promotions)) {
        setPromos(promoRes.promotions);
      }
    } catch (err) {
      console.warn('Failed to load packages data from DB:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
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
          fetchData();
        }
      } else if (modalType === 'promo') {
        const res = await fetch('/api/promotions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            code: title.trim().toUpperCase(),
            discountPercent: Number(price) || 20,
          }),
        });
        const data = await res.json();
        if (data.promotion || data.success) {
          fetchData();
        }
      } else if (modalType === 'gift') {
        const res = await fetch('/api/gift-cards', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            code: title.trim().toUpperCase(),
            amount: Number(price) || 100,
          }),
        });
        const data = await res.json();
        if (data.success) {
          fetchData();
        }
      }

      setSuccessMsg(`${title.trim()} saved to database!`);
      setTimeout(() => {
        setSuccessMsg(null);
        setIsModalOpen(false);
        setTitle('');
      }, 1200);
    } catch (err) {
      console.error('Failed to save record:', err);
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

      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="p-6 rounded-3xl glass-panel bg-white/70 dark:bg-gray-900/70 border border-white/60 dark:border-white/10 space-y-4 animate-pulse min-h-[320px] flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-black/10 dark:bg-white/10" />
                  <div className="h-4 w-32 rounded-lg bg-black/10 dark:bg-white/10" />
                </div>
                <div className="p-4 rounded-2xl bg-black/5 dark:bg-white/5 space-y-2">
                  <div className="h-4 w-24 rounded-lg bg-black/10 dark:bg-white/10" />
                  <div className="h-6 w-20 rounded-lg bg-black/10 dark:bg-white/10" />
                  <div className="h-3 w-36 rounded-md bg-black/5 dark:bg-white/5 mt-2" />
                </div>
              </div>
              <div className="h-10 w-full rounded-xl bg-black/10 dark:bg-white/10" />
            </div>
          ))}
        </div>
      )}

      {!loading && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Memberships Column */}
          <div
            className={`p-6 rounded-3xl flex flex-col justify-between ${
              memberships.length > 0
                ? 'glass-panel bg-white/70 dark:bg-gray-900/70 border border-white/60 dark:border-white/10 space-y-4'
                : 'border-2 border-dashed border-black/10 dark:border-white/10 min-h-[360px] text-center'
            }`}
          >
            <div className="space-y-4 w-full my-auto">
              {memberships.length > 0 && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400 font-bold">
                    <Sparkle24Regular className="w-5 h-5" />
                    <h3 className="text-sm">{t('vipMemberships')}</h3>
                  </div>
                </div>
              )}

              {memberships.length > 0 ? (
                memberships.map((m) => (
                  <div key={m.id} className="p-4 rounded-2xl bg-purple-50/50 dark:bg-purple-950/30 border border-purple-500/20 space-y-2">
                    <h4 className="text-xs font-bold text-[var(--text-primary)]">{m.name}</h4>
                    <span className="text-lg font-extrabold block text-[var(--text-primary)]">${(m.monthlyPriceCents / 100).toFixed(2)}/mo</span>
                    <ul className="text-[11px] text-[var(--text-secondary)] space-y-1">
                      <li>• {m.includedServicesCount} Included Signature Treatments</li>
                      <li>• {m.discountPercentRetail}% Off All Retail Store Products</li>
                      <li>• Priority Calendar Scheduling</li>
                    </ul>
                  </div>
                ))
              ) : (
                <div className="py-6 text-center space-y-2">
                  <Sparkle24Regular className="w-10 h-10 text-[var(--text-muted)] mx-auto opacity-50 mb-2" />
                  <p className="text-sm font-bold text-[var(--text-secondary)]">No membership tiers</p>
                  <p className="text-xs text-[var(--text-muted)] max-w-xs mx-auto">Click below to create your first recurring membership plan.</p>
                </div>
              )}
            </div>

            {memberships.length === 0 && (
              <button
                onClick={() => {
                  setModalType('membership');
                  setIsModalOpen(true);
                }}
                className="w-full py-2.5 rounded-xl bg-purple-600 text-white font-bold text-xs shadow-md hover:bg-purple-700 transition-colors flex items-center justify-center gap-1.5 mt-4"
              >
                <Add24Filled className="w-4 h-4" />
                <span>New Membership Tier</span>
              </button>
            )}
          </div>

          {/* Active Promotions / Bundles Column */}
          <div
            className={`p-6 rounded-3xl flex flex-col justify-between ${
              promos.length > 0
                ? 'glass-panel bg-white/70 dark:bg-gray-900/70 border border-white/60 dark:border-white/10 space-y-4'
                : 'border-2 border-dashed border-black/10 dark:border-white/10 min-h-[360px] text-center'
            }`}
          >
            <div className="space-y-4 w-full my-auto">
              {promos.length > 0 && (
                <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold">
                  <Tag24Regular className="w-5 h-5" />
                  <h3 className="text-sm">Promotions & Bundles</h3>
                </div>
              )}

              {promos.length > 0 ? (
                promos.map((p) => (
                  <div key={p.id} className="p-4 rounded-2xl bg-blue-50/50 dark:bg-blue-950/30 border border-blue-500/20 space-y-1.5">
                    <div className="flex justify-between items-center">
                      <h4 className="text-xs font-bold font-mono text-[var(--text-primary)]">{p.code}</h4>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600">
                        {p.discountPercent}% OFF
                      </span>
                    </div>
                    <p className="text-[11px] text-[var(--text-secondary)]">
                      Used {p.currentUses} of {p.maxUses} times
                    </p>
                  </div>
                ))
              ) : (
                <div className="py-6 text-center space-y-2">
                  <Tag24Regular className="w-10 h-10 text-[var(--text-muted)] mx-auto opacity-50 mb-2" />
                  <p className="text-sm font-bold text-[var(--text-secondary)]">No active promo codes</p>
                  <p className="text-xs text-[var(--text-muted)] max-w-xs mx-auto">Create discount codes for seasonal campaigns or marketing.</p>
                </div>
              )}
            </div>

            {promos.length === 0 && (
              <button
                onClick={() => {
                  setModalType('promo');
                  setTitle('');
                  setPrice('20');
                  setIsModalOpen(true);
                }}
                className="w-full py-2.5 rounded-xl bg-blue-600 text-white font-bold text-xs shadow-md hover:bg-blue-700 transition-colors flex items-center justify-center gap-1.5 mt-4"
              >
                <Add24Filled className="w-4 h-4" />
                <span>Create Promo Code</span>
              </button>
            )}
          </div>

          {/* Digital Gift Cards Column */}
          <div
            className={`p-6 rounded-3xl flex flex-col justify-between ${
              giftCards.length > 0
                ? 'glass-panel bg-white/70 dark:bg-gray-900/70 border border-white/60 dark:border-white/10 space-y-4'
                : 'border-2 border-dashed border-black/10 dark:border-white/10 min-h-[360px] text-center'
            }`}
          >
            <div className="space-y-4 w-full my-auto">
              {giftCards.length > 0 && (
                <div className="flex items-center gap-2 text-pink-600 dark:text-pink-400 font-bold">
                  <Gift24Regular className="w-5 h-5" />
                  <h3 className="text-sm">{t('digitalGiftCards')}</h3>
                </div>
              )}

              {giftCards.length > 0 ? (
                giftCards.map((gc) => (
                  <div key={gc.id} className="p-4 rounded-2xl bg-pink-50/50 dark:bg-pink-950/30 border border-pink-500/20 space-y-1">
                    <div className="flex justify-between items-center">
                      <h4 className="text-xs font-mono font-bold text-[var(--text-primary)]">{gc.code}</h4>
                      <span className="text-xs font-black text-pink-600 dark:text-pink-400">
                        ${(gc.currentBalanceCents / 100).toFixed(2)}
                      </span>
                    </div>
                    {gc.recipientEmail && (
                      <p className="text-[10px] text-[var(--text-secondary)] truncate">Sent to: {gc.recipientEmail}</p>
                    )}
                  </div>
                ))
              ) : (
                <div className="py-6 text-center space-y-2">
                  <Gift24Regular className="w-10 h-10 text-[var(--text-muted)] mx-auto opacity-50 mb-2" />
                  <p className="text-sm font-bold text-[var(--text-secondary)]">No gift cards issued</p>
                  <p className="text-[11px] text-[var(--text-muted)] max-w-xs mx-auto">Issue custom digital vouchers for clients below.</p>
                </div>
              )}
            </div>

            <button
              onClick={() => {
                setModalType('gift');
                setTitle('');
                setPrice('100');
                setIsModalOpen(true);
              }}
              className="w-full py-2.5 rounded-xl bg-pink-500 text-white font-bold text-xs shadow-md hover:bg-pink-600 transition-colors flex items-center justify-center gap-1.5 mt-2"
            >
              <Gift24Filled className="w-4 h-4" />
              <span>Issue Gift Card</span>
            </button>
          </div>
        </div>
      )}

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
                {modalType === 'membership' ? 'Create VIP Membership Tier' : modalType === 'promo' ? 'Create Promo Code' : 'Issue Digital Gift Card'}
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
                      {modalType === 'membership' ? 'Membership Tier Title' : modalType === 'promo' ? 'Promo Code (e.g. SUMMER20)' : 'Gift Card Code / Label'}
                    </label>
                    <input
                      type="text"
                      required
                      placeholder={modalType === 'membership' ? 'e.g. Diamond Unlimited Pass' : modalType === 'promo' ? 'e.g. SUMMER20' : 'e.g. GIFT-SARAH-50'}
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-xs font-medium text-[var(--text-primary)] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold uppercase tracking-wider text-[var(--text-secondary)] mb-1 block">
                      {modalType === 'membership' ? 'Monthly Price ($)' : modalType === 'promo' ? 'Discount Percentage (%)' : 'Gift Card Value ($)'}
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
