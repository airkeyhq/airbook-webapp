'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AIRBOOK_PLANS } from '@/lib/stripe';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { useToast } from '@/components/Toast';
import { Dismiss24Filled, Sparkle24Filled, Checkmark24Regular } from '@fluentui/react-icons';

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PricingModal: React.FC<PricingModalProps> = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const { addToast } = useToast();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('yearly');
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSelectPlan = async (planKey: 'pro' | 'business') => {
    setLoadingPlan(planKey);
    try {
      const res = await fetch('/api/payments/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'subscription', plan: planKey, billingCycle }),
      });
      const data = await res.json();
      if (data?.url) {
        window.location.href = data.url;
      }
    } catch (e) {
      addToast('Redirecting to Stripe Checkout...', 'info');
    } finally {
      setLoadingPlan(null);
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

        {/* Amie Glass Modal Container */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 400, damping: 28 }}
          className="relative w-full max-w-2xl glass-panel rounded-[36px] p-6 sm:p-8 shadow-2xl bg-white/95 dark:bg-gray-900/95 border border-white/80 dark:border-white/10 z-10 overflow-hidden"
        >
          {/* Close Trigger */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-gray-400"
          >
            <Dismiss24Filled className="w-5 h-5" />
          </button>

          {/* Logo & Header */}
          <div className="text-center max-w-md mx-auto mb-6">
            <div className="w-10 h-10 rounded-2xl bg-black text-white dark:bg-white dark:text-black flex items-center justify-center font-bold text-sm shadow-md mx-auto mb-3">
              A
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-[var(--text-primary)]">
              {t('upgradePlan')}
            </h2>
            <p className="text-xs text-[var(--text-secondary)] mt-1">
              Pick a plan that best suits you or your team. Upgrade or downgrade at any time.
            </p>

            {/* Monthly / Yearly Toggle with Amie Green Badge */}
            <div className="mt-4 flex items-center justify-center gap-3">
              <span className={`text-xs font-semibold ${billingCycle === 'monthly' ? 'text-[var(--text-primary)]' : 'text-gray-400'}`}>
                Bill monthly
              </span>
              
              <button
                onClick={() => setBillingCycle((b) => (b === 'monthly' ? 'yearly' : 'monthly'))}
                className="w-12 h-6 rounded-full bg-black/10 dark:bg-white/15 p-1 flex items-center transition-colors"
              >
                <motion.div
                  animate={{ x: billingCycle === 'yearly' ? 24 : 0 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  className="w-4 h-4 rounded-full bg-green-500 shadow-sm"
                />
              </button>

              <div className="flex items-center gap-1.5">
                <span className={`text-xs font-semibold ${billingCycle === 'yearly' ? 'text-[var(--text-primary)]' : 'text-gray-400'}`}>
                  Bill yearly
                </span>
                <span className="px-2 py-0.5 rounded-full bg-green-500 text-white text-[9px] font-bold uppercase tracking-wider shadow-xs">
                  GET 2 MONTHS FREE
                </span>
              </div>
            </div>
          </div>

          {/* Plan Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Pro Plan */}
            <div className="p-5 rounded-3xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 flex flex-col justify-between hover:border-black/20 transition-all">
              <div>
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-[var(--text-primary)]">Pro</h3>
                  <span className="text-[10px] font-mono text-gray-400">
                    Billed {billingCycle}
                  </span>
                </div>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-2xl font-extrabold text-[var(--text-primary)]">
                    ${billingCycle === 'yearly' ? AIRBOOK_PLANS.pro.priceYearly : AIRBOOK_PLANS.pro.priceMonthly}
                  </span>
                  <span className="text-xs text-[var(--text-secondary)]">per user/month</span>
                </div>
                <p className="text-[11px] text-green-600 dark:text-green-400 font-medium mt-0.5">
                  7 day free trial
                </p>

                <ul className="mt-4 space-y-2 text-xs text-[var(--text-secondary)]">
                  {AIRBOOK_PLANS.pro.features.map((feat, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <Checkmark24Regular className="w-3.5 h-3.5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <motion.button
                whileTap={{ scale: 0.96 }}
                onClick={() => handleSelectPlan('pro')}
                className="mt-6 w-full py-2.5 rounded-2xl bg-white dark:bg-white/10 border border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/20 text-[var(--text-primary)] font-semibold text-xs transition-all shadow-sm"
              >
                {loadingPlan === 'pro' ? 'Redirecting...' : 'Select Pro'}
              </motion.button>
            </div>

            {/* Business Plan */}
            <div className="p-5 rounded-3xl border-2 border-[#2BB5FF] bg-blue-50/40 dark:bg-blue-950/20 flex flex-col justify-between shadow-lg relative">
              <span className="absolute -top-3 right-6 px-2.5 py-0.5 rounded-full bg-[#2BB5FF] text-white text-[9px] font-bold uppercase tracking-wider shadow-sm">
                POPULAR
              </span>

              <div>
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-[var(--text-primary)]">Business</h3>
                  <span className="text-[10px] font-mono text-gray-400">
                    Billed {billingCycle}
                  </span>
                </div>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-2xl font-extrabold text-[var(--text-primary)]">
                    ${billingCycle === 'yearly' ? AIRBOOK_PLANS.business.priceYearly : AIRBOOK_PLANS.business.priceMonthly}
                  </span>
                  <span className="text-xs text-[var(--text-secondary)]">per user/month</span>
                </div>
                <p className="text-[11px] text-green-600 dark:text-green-400 font-medium mt-0.5">
                  7 day free trial
                </p>

                <ul className="mt-4 space-y-2 text-xs text-[var(--text-secondary)]">
                  {AIRBOOK_PLANS.business.features.map((feat, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <Checkmark24Regular className="w-3.5 h-3.5 text-blue-500 flex-shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <motion.button
                whileTap={{ scale: 0.96 }}
                onClick={() => handleSelectPlan('business')}
                className="mt-6 w-full py-2.5 rounded-2xl bg-[#2BB5FF] hover:bg-[#1A8EFF] text-white font-bold text-xs shadow-md shadow-[#2BB5FF]/30 transition-all"
              >
                {loadingPlan === 'business' ? 'Redirecting...' : 'Select Business'}
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
