'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useAirBookStore } from '@/lib/store';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { PlanFeature, canAccessFeature, getRequiredTierForFeature, AIRBOOK_PLAN_DEFINITIONS } from '@/lib/plans';
import {
  LockClosed24Filled,
  Sparkle24Filled,
  ArrowRight24Filled,
} from '@fluentui/react-icons';

interface PlanGateProps {
  feature: PlanFeature;
  children: React.ReactNode;
  fallbackTitle?: string;
  fallbackDescription?: string;
}

export const PlanGate: React.FC<PlanGateProps> = ({
  feature,
  children,
  fallbackTitle,
  fallbackDescription,
}) => {
  const { workspacePlan, openPricingModal } = useAirBookStore();
  const { t } = useTranslation();

  const isAllowed = canAccessFeature(workspacePlan, feature);

  if (isAllowed) {
    return <>{children}</>;
  }

  const requiredTier = getRequiredTierForFeature(feature);
  const planInfo = AIRBOOK_PLAN_DEFINITIONS[requiredTier];

  return (
    <div className="w-full rounded-3xl border border-[var(--border-subtle)] bg-[var(--bg-primary)] p-6 sm:p-10 text-center relative overflow-hidden shadow-sm">
      {/* Ambient Radial Highlight */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-[#2BB5FF]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-md mx-auto space-y-4">
        {/* Tier Lock Badge */}
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#2BB5FF]/10 text-[#2BB5FF] dark:text-[#2BB5FF] border border-[#2BB5FF]/30 text-[11px] font-black uppercase tracking-wider">
          <LockClosed24Filled className="w-3.5 h-3.5" />
          <span>{planInfo.name}</span>
        </div>

        {/* Header */}
        <div className="space-y-1.5">
          <h3 className="text-lg sm:text-xl font-black text-[var(--text-primary)] tracking-tight">
            {fallbackTitle || t('featureLockedTitle')}
          </h3>
          <p className="text-xs text-[var(--text-secondary)] font-medium leading-relaxed">
            {fallbackDescription || t('featureLockedDesc')}
          </p>
        </div>

        {/* CTA Button */}
        <div className="pt-2">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={openPricingModal}
            className="btn-primary inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl text-xs font-black tracking-wide"
          >
            <Sparkle24Filled className="w-4 h-4 text-white" />
            <span>{t('upgradeToAccess')}</span>
            <ArrowRight24Filled className="w-3.5 h-3.5 text-white" />
          </motion.button>
        </div>
      </div>
    </div>
  );
};
