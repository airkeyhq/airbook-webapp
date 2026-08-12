'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { Tag24Filled, Payment24Filled, Gift24Regular, Sparkle24Regular } from '@fluentui/react-icons';

export const PackagesModule: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="w-full max-w-5xl mx-auto p-4 sm:p-6 space-y-6">
      <div>
        <h2 className="text-xl font-extrabold text-[var(--text-primary)] tracking-tight">
          {t('packagesTitle')}
        </h2>
        <p className="text-xs text-[var(--text-secondary)] mt-0.5">
          {t('packagesDesc')}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Memberships */}
        <div className="p-6 rounded-3xl glass-panel bg-white/70 dark:bg-gray-900/70 border border-white/60 dark:border-white/10 space-y-4">
          <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400 font-bold">
            <Sparkle24Regular className="w-5 h-5" />
            <h3 className="text-sm">{t('vipMemberships')}</h3>
          </div>
          <div className="p-4 rounded-2xl bg-purple-50/50 dark:bg-purple-950/30 border border-purple-500/20 space-y-2">
            <h4 className="text-xs font-bold">{t('vipGlowPass')}</h4>
            <span className="text-lg font-extrabold block">{t('vipPrice')}</span>
            <ul className="text-[11px] text-[var(--text-secondary)] space-y-1">
              <li>{t('vipBenefit1')}</li>
              <li>{t('vipBenefit2')}</li>
              <li>{t('vipBenefit3')}</li>
            </ul>
          </div>
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
        <div className="p-6 rounded-3xl glass-panel bg-white/70 dark:bg-gray-900/70 border border-white/60 dark:border-white/10 space-y-4">
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
      </div>
    </div>
  );
};
