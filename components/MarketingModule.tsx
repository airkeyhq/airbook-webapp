'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { Send24Filled, Sparkle24Filled, Star24Regular, Comment24Regular, CheckmarkCircle24Regular, Flash24Regular } from '@fluentui/react-icons';

export const MarketingModule: React.FC = () => {
  const { t } = useTranslation();
  const [rebookingDays, setRebookingDays] = useState('21');
  const [googleReviewEnabled, setGoogleReviewEnabled] = useState(true);
  const [isSent, setIsSent] = useState(false);

  const handleTestCampaign = () => {
    setIsSent(true);
    setTimeout(() => setIsSent(false), 2500);
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-extrabold text-[var(--text-primary)] tracking-tight">
          {t('marketingTitle')}
        </h2>
        <p className="text-xs text-[var(--text-secondary)] mt-0.5">
          {t('marketingDesc')}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Campaign 1: 3-Week Re-Booking Automation */}
        <div className="p-6 rounded-3xl glass-panel bg-white/70 dark:bg-gray-900/70 border border-white/60 dark:border-white/10 space-y-4 shadow-sm">
          <div className="flex items-center gap-2">
            <Flash24Regular className="w-5 h-5 text-amber-500" />
            <h3 className="text-sm font-bold text-[var(--text-primary)]">
              {t('rebookingTriggerTitle')}
            </h3>
          </div>
          <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
            {t('rebookingTriggerDesc')}
          </p>

          <div className="space-y-3 pt-2">
            <div>
              <label className="text-[11px] font-semibold uppercase tracking-wider text-[var(--text-secondary)] mb-1 block">
                {t('triggerTiming')}
              </label>
              <select
                value={rebookingDays}
                onChange={(e) => setRebookingDays(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-xs font-medium text-[var(--text-primary)] focus:outline-none"
              >
                <option value="14">{t('days14')}</option>
                <option value="21">{t('days21')}</option>
                <option value="30">{t('days30')}</option>
              </select>
            </div>

            {/* Preview Box */}
            <div className="p-3.5 rounded-2xl bg-blue-50/50 dark:bg-blue-950/30 border border-blue-500/20 text-xs font-mono space-y-1">
              <span className="text-[10px] text-blue-600 dark:text-blue-400 font-bold block uppercase">
                {t('smsPreviewHeader')}
              </span>
              <p className="text-[11px] text-[var(--text-primary)]">
                {t('smsPreviewText').replace('{days}', rebookingDays)}
              </p>
            </div>
          </div>
        </div>

        {/* Campaign 2: Google Review Automation */}
        <div className="p-6 rounded-3xl glass-panel bg-white/70 dark:bg-gray-900/70 border border-white/60 dark:border-white/10 space-y-4 shadow-sm">
          <div className="flex items-center gap-2">
            <Star24Regular className="w-5 h-5 text-amber-500" />
            <h3 className="text-sm font-bold text-[var(--text-primary)]">
              {t('googleReviewTitle')}
            </h3>
          </div>
          <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
            {t('googleReviewDesc')}
          </p>

          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between p-3 rounded-2xl bg-black/5 dark:bg-white/5">
              <span className="text-xs font-semibold text-[var(--text-primary)]">
                {t('autoSendReviews')}
              </span>
              <button
                type="button"
                onClick={() => setGoogleReviewEnabled(!googleReviewEnabled)}
                className={`w-12 h-6 rounded-full p-1 transition-colors ${
                  googleReviewEnabled ? 'bg-green-500' : 'bg-black/10 dark:bg-white/20'
                }`}
              >
                <motion.div
                  animate={{ x: googleReviewEnabled ? 24 : 0 }}
                  className="w-4 h-4 rounded-full bg-white shadow-sm"
                />
              </button>
            </div>

            <motion.button
              whileTap={{ scale: 0.96 }}
              onClick={handleTestCampaign}
              className="w-full py-3 rounded-2xl bg-black text-white dark:bg-white dark:text-black font-semibold text-xs shadow-md flex items-center justify-center gap-2"
            >
              {isSent ? (
                <>
                  <CheckmarkCircle24Regular className="w-4 h-4 text-green-500" />
                  <span>{t('testSmsSent')}</span>
                </>
              ) : (
                <>
                  <Send24Filled className="w-4 h-4" />
                  <span>{t('sendTestSms')}</span>
                </>
              )}
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
};
