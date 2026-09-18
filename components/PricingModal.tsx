'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { useToast } from '@/components/Toast';
import { useAirBookStore } from '@/lib/store';
import { normalizePlanTier, PlanTier } from '@/lib/plans';
import { CurrencySelector } from '@/components/CurrencySelector';
import {
  Dismiss24Filled,
  Sparkle24Filled,
  Sparkle24Regular,
  Checkmark24Regular,
  ArrowRight24Filled,
} from '@fluentui/react-icons';

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialPlan?: PlanTier;
}

export const PricingModal: React.FC<PricingModalProps> = ({
  isOpen,
  onClose,
  initialPlan,
}) => {
  const { t, currency, formatPrice, getTierPricing } = useTranslation();
  const { addToast } = useToast();
  const { workspaceId, workspacePlan } = useAirBookStore();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('yearly');
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  if (!isOpen) return null;

  const currentTier = normalizePlanTier(workspacePlan);

  const handleSelectPlan = async (planKey: 'solo' | 'team' | 'scale') => {
    setLoadingPlan(planKey);
    try {
      const res = await fetch('/api/payments/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'subscription',
          plan: planKey,
          billingCycle,
          currency,
          workspaceId,
        }),
      });
      const data = await res.json();
      if (data?.url) {
        window.location.href = data.url;
        return;
      }
      addToast(data?.error || t('somethingWentWrong'), 'error');
    } catch (e) {
      addToast(t('somethingWentWrong'), 'error');
    } finally {
      setLoadingPlan(null);
    }
  };

  const soloRates = getTierPricing('solo');
  const teamRates = getTierPricing('team');
  const scaleRates = getTierPricing('scale');

  const plans: {
    key: 'solo' | 'team' | 'scale';
    title: string;
    desc: string;
    priceMonthly: number;
    priceYearly: number;
    popular?: boolean;
    features: string[];
  }[] = [
    {
      key: 'solo',
      title: t('soloPlanTitle'),
      desc: t('soloPlanDesc'),
      priceMonthly: soloRates.monthly,
      priceYearly: soloRates.yearly,
      features: [
        t('soloFeat1'),
        t('soloFeat2'),
        t('soloFeat3'),
        t('soloFeat4'),
        t('soloFeat5'),
      ],
    },
    {
      key: 'team',
      title: t('teamPlanTitle'),
      desc: t('teamPlanDesc'),
      priceMonthly: teamRates.monthly,
      priceYearly: teamRates.yearly,
      popular: true,
      features: [
        t('teamFeat1'),
        t('teamFeat2'),
        t('teamFeat3'),
        t('teamFeat4'),
        t('teamFeat5'),
      ],
    },
    {
      key: 'scale',
      title: t('scalePlanTitle'),
      desc: t('scalePlanDesc'),
      priceMonthly: scaleRates.monthly,
      priceYearly: scaleRates.yearly,
      features: [
        t('scaleFeat1'),
        t('scaleFeat2'),
        t('scaleFeat3'),
        t('scaleFeat4'),
        t('scaleFeat5'),
      ],
    },
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[300] flex items-end md:items-center justify-center p-0 md:p-4">
        {/* Total Occlusion Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-md"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 30, scale: 0.98 }}
          transition={{ type: 'spring', damping: 28, stiffness: 380 }}
          className="relative w-full md:max-w-5xl bg-[var(--bg-primary)] border-t md:border border-[var(--border-subtle)] rounded-t-[32px] md:rounded-3xl rounded-b-none md:rounded-b-3xl shadow-2xl z-10 flex flex-col max-h-[92vh] md:max-h-[90vh] overflow-y-auto p-5 sm:p-8"
        >
          {/* Mobile Drag Handle */}
          <div className="w-12 h-1.5 rounded-full bg-black/20 dark:bg-white/20 mx-auto -mt-1 mb-4 md:hidden" />

          {/* Close Trigger */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-[var(--text-muted)] cursor-pointer"
          >
            <Dismiss24Filled className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="text-center max-w-xl mx-auto mb-6 sm:mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#2BB5FF]/10 text-[#2BB5FF] text-[11px] font-black uppercase tracking-wider mb-2 border border-[#2BB5FF]/20">
              <Sparkle24Filled className="w-3.5 h-3.5" />
              <span>{t('pricingSubtitle')}</span>
            </div>
            <h2 className="text-xl sm:text-3xl font-black tracking-tight text-[var(--text-primary)]">
              {t('upgradePlan')}
            </h2>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-1.5 font-medium leading-relaxed">
              {t('pricingModalSubtitle')}
            </p>

            {/* Monthly / Yearly Toggle & Currency Picker */}
            <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
              <div className="inline-flex items-center p-1 rounded-full bg-[var(--bg-secondary)] border border-[var(--border-subtle)] shadow-inner">
                <button
                  type="button"
                  onClick={() => setBillingCycle('monthly')}
                  className={`px-4 py-1.5 rounded-full text-xs font-black transition-all cursor-pointer ${
                    billingCycle === 'monthly'
                      ? 'bg-[var(--bg-primary)] text-[var(--text-primary)] shadow-sm'
                      : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  {t('billingMonthly')}
                </button>
                <button
                  type="button"
                  onClick={() => setBillingCycle('yearly')}
                  className={`px-4 py-1.5 rounded-full text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer ${
                    billingCycle === 'yearly'
                      ? 'bg-[var(--bg-primary)] text-[var(--text-primary)] shadow-sm'
                      : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  <span>{t('billingAnnual')}</span>
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                    {t('saveTwoMonths')}
                  </span>
                </button>
              </div>

              <CurrencySelector size="sm" direction="down" />
            </div>
          </div>

          {/* 3-Plan Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-stretch">
            {plans.map((p) => {
              const isCurrent = currentTier === p.key;
              const displayPrice = billingCycle === 'yearly' ? p.priceYearly : p.priceMonthly;

              return (
                <div
                  key={p.key}
                  className={`p-6 rounded-3xl border transition-all flex flex-col justify-between relative ${
                    p.popular
                      ? 'border-2 border-[#2BB5FF] bg-blue-50/20 dark:bg-blue-950/10 shadow-lg ring-2 ring-[#2BB5FF]/20'
                      : 'border-[var(--border-subtle)] bg-[var(--bg-primary)] hover:border-[#2BB5FF]/40'
                  }`}
                >
                  {/* Floating Top Badge */}
                  {p.popular && (
                    <div className="absolute -top-3 left-6 z-20">
                      <span className="inline-flex items-center gap-1 px-3 py-0.5 rounded-full bg-[#2BB5FF] text-white text-[9px] font-black uppercase tracking-wider shadow-sm border border-white/40">
                        <Sparkle24Regular className="w-3 h-3 text-white" />
                        {t('mostPopular')}
                      </span>
                    </div>
                  )}

                  {isCurrent && (
                    <div className="absolute -top-3 right-6 z-20">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500 text-white text-[9px] font-black uppercase tracking-wider shadow-sm">
                        {t('activePlanBadge')}
                      </span>
                    </div>
                  )}

                  <div className="space-y-4">
                    {/* Title & Description */}
                    <div>
                      <h3 className="text-base font-black text-[var(--text-primary)]">
                        {p.title}
                      </h3>
                      <p className="text-[11px] text-[var(--text-secondary)] font-medium mt-0.5 min-h-[32px]">
                        {p.desc}
                      </p>
                    </div>

                    {/* Price Row */}
                    <div>
                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl sm:text-4xl font-black text-[var(--text-primary)] font-mono">
                          {formatPrice(displayPrice)}
                        </span>
                        <span className="text-xs font-bold text-[var(--text-secondary)]">
                          {t('pricingPerMonth')}
                        </span>
                      </div>
                      <div className="min-h-[16px] mt-0.5">
                        {billingCycle === 'yearly' && (
                          <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                            {formatPrice(displayPrice * 12)} {t('billedYearlyNote')}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Divider */}
                    <div className="h-px bg-[var(--border-subtle)] w-full" />

                    {/* Feature List */}
                    <ul className="space-y-2.5 text-xs text-[var(--text-secondary)] font-semibold">
                      {p.features.map((feat, i) => (
                        <li key={i} className="flex items-start gap-2 min-h-[18px]">
                          <Checkmark24Regular className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0 mt-0.5" />
                          <span className="text-[11px] leading-tight">{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* CTA Button */}
                  <div className="pt-6">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.97 }}
                      disabled={loadingPlan !== null || isCurrent}
                      onClick={() => handleSelectPlan(p.key)}
                      className={`w-full h-11 rounded-2xl text-xs font-black flex items-center justify-center gap-2 cursor-pointer ${
                        p.popular ? 'btn-primary' : 'btn-secondary'
                      } ${isCurrent ? 'opacity-60 cursor-not-allowed' : ''}`}
                    >
                      {loadingPlan === p.key ? (
                        <span>{t('redirectingToStripe')}</span>
                      ) : isCurrent ? (
                        <span>{t('currentPlanBadge')}</span>
                      ) : (
                        <>
                          <span>{t('selectPlanBtn')}</span>
                          <ArrowRight24Filled className="w-3.5 h-3.5" />
                        </>
                      )}
                    </motion.button>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
