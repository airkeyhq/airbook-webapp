'use client';

import React from 'react';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { ShoppingBag24Regular, CheckmarkCircle24Regular } from '@fluentui/react-icons';

export const MarketplaceModule: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="w-full max-w-4xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-extrabold text-[var(--text-primary)] tracking-tight">
              {t('marketplaceTitle')}
            </h2>
            <span className="px-2.5 py-0.5 rounded-full bg-black/5 dark:bg-white/10 text-[var(--text-secondary)] border border-[var(--border-subtle)] text-[10px] font-mono font-extrabold uppercase">
              {t('comingSoonV12')}
            </span>
          </div>
          <p className="text-xs text-[var(--text-secondary)] mt-1 max-w-xl">
            {t('marketplaceDesc')}
          </p>
        </div>
      </div>

      {/* Honest Roadmap Teaser Card */}
      <div className="p-8 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-center space-y-4 shadow-xs">
        <div className="w-14 h-14 rounded-2xl bg-black/5 dark:bg-white/5 text-[var(--text-secondary)] flex items-center justify-center mx-auto">
          <ShoppingBag24Regular className="w-7 h-7" />
        </div>

        <div className="max-w-md mx-auto space-y-2">
          <h3 className="text-base font-extrabold text-[var(--text-primary)]">
            {t('marketplaceRoadmapTitle')}
          </h3>
          <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
            {t('marketplaceRoadmapDesc')}
          </p>
        </div>

        <div className="pt-3 max-w-lg mx-auto grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-left">
          <div className="p-3.5 rounded-2xl bg-black/5 dark:bg-white/5 border border-[var(--border-subtle)] flex items-start gap-2.5">
            <CheckmarkCircle24Regular className="w-4 h-4 text-[var(--text-secondary)] flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-[var(--text-primary)]">{t('marketplaceFeature1Title')}</p>
              <p className="text-[11px] text-[var(--text-secondary)]">{t('marketplaceFeature1Desc')}</p>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-black/5 dark:bg-white/5 border border-[var(--border-subtle)] flex items-start gap-2.5">
            <CheckmarkCircle24Regular className="w-4 h-4 text-[var(--text-secondary)] flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-[var(--text-primary)]">{t('marketplaceFeature2Title')}</p>
              <p className="text-[11px] text-[var(--text-secondary)]">{t('marketplaceFeature2Desc')}</p>
            </div>
          </div>
        </div>

        <div className="pt-2">
          <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-black/5 dark:bg-white/10 text-[var(--text-secondary)] border border-[var(--border-subtle)] text-xs font-extrabold">
            <ShoppingBag24Regular className="w-3.5 h-3.5" />
            <span>{t('marketplaceScheduledFor')}</span>
          </span>
        </div>
      </div>
    </div>
  );
};
