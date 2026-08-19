'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { Send24Filled, Sparkle24Regular, Star24Regular, Comment24Regular, CheckmarkCircle24Regular, Flash24Regular } from '@fluentui/react-icons';

export const MarketingModule: React.FC = () => {
  const { t } = useTranslation();
  const [rebookingDays, setRebookingDays] = useState('21');
  const [googleReviewEnabled, setGoogleReviewEnabled] = useState(true);
  const [isSent, setIsSent] = useState(false);
  const [lastNotificationLog, setLastNotificationLog] = useState<{ recipient: string; provider: string; timestamp: string } | null>(null);

  const handleTestCampaign = async () => {
    setIsSent(true);
    try {
      const res = await fetch('/api/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'sms',
          recipient: '+1 (555) 234-5678',
          message: t('smsPreviewText').replace('{days}', rebookingDays),
        }),
      });
      const data = await res.json();
      if (data.log) {
        setLastNotificationLog({
          recipient: data.log.recipient,
          provider: data.provider || 'AirBook Notification Engine',
          timestamp: new Date(data.log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        });
      }
    } catch (e) {
      console.warn('Failed to call notification API:', e);
    }
    setTimeout(() => setIsSent(false), 2500);
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[var(--border-subtle)]">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-extrabold text-[var(--text-primary)] tracking-tight">
              {t('marketingTitle')}
            </h2>
            <span className="px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30 text-[10px] font-mono font-extrabold uppercase">
              {t('comingSoonV11')}
            </span>
          </div>
          <p className="text-xs text-[var(--text-secondary)] mt-1 max-w-xl">
            {t('marketingDesc')}
          </p>
        </div>
      </div>

      {/* Honest Roadmap Teaser Card */}
      <div className="p-8 rounded-3xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-center space-y-4 shadow-sm">
        <div className="w-14 h-14 rounded-3xl bg-purple-500/15 text-purple-600 dark:text-purple-400 flex items-center justify-center mx-auto">
          <Sparkle24Regular className="w-7 h-7" />
        </div>

        <div className="max-w-md mx-auto space-y-2">
          <h3 className="text-base font-extrabold text-[var(--text-primary)]">
            {t('marketingRoadmapTitle')}
          </h3>
          <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
            {t('marketingRoadmapDesc')}
          </p>
        </div>

        <div className="pt-3 max-w-lg mx-auto grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
          <div className="p-3.5 rounded-2xl bg-black/5 dark:bg-white/5 border border-[var(--border-subtle)] flex items-start gap-2.5">
            <CheckmarkCircle24Regular className="w-4 h-4 text-purple-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-[var(--text-primary)]">{t('marketingFeature1Title')}</p>
              <p className="text-[11px] text-[var(--text-secondary)]">{t('marketingFeature1Desc')}</p>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-black/5 dark:bg-white/5 border border-[var(--border-subtle)] flex items-start gap-2.5">
            <CheckmarkCircle24Regular className="w-4 h-4 text-purple-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-[var(--text-primary)]">{t('marketingFeature2Title')}</p>
              <p className="text-[11px] text-[var(--text-secondary)]">{t('marketingFeature2Desc')}</p>
            </div>
          </div>
        </div>

        <div className="pt-2">
          <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-purple-500/15 text-purple-700 dark:text-purple-300 text-xs font-extrabold">
            <Sparkle24Regular className="w-3.5 h-3.5" />
            <span>{t('marketingScheduledFor')}</span>
          </span>
        </div>
      </div>
    </div>
  );
};
