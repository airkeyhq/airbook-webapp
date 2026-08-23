'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAirBookStore } from '@/lib/store';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { useToast } from '@/components/Toast';
import { CustomSelect } from './CustomSelect';
import { EmptyState } from './EmptyState';
import {
  Send24Filled,
  Send24Regular,
  Sparkle24Filled,
  Sparkle24Regular,
  Star24Filled,
  Star24Regular,
  Comment24Filled,
  Comment24Regular,
  CheckmarkCircle24Filled,
  CheckmarkCircle24Regular,
  Dismiss24Filled,
  Add24Filled,
  Money24Regular,
  Person24Regular,
  Mail24Filled,
  Mail24Regular,
  Phone24Filled,
  Phone24Regular,
  ArrowRepeatAll24Filled,
  ArrowRepeatAll24Regular,
  ShieldCheckmark24Filled,
  ShieldCheckmark24Regular,
  Clock24Regular,
  Tag24Regular,
} from '@fluentui/react-icons';

interface Campaign {
  id: string;
  name: string;
  channel: 'sms' | 'email' | 'both';
  audienceFilter: 'all' | 'vip' | 'lapsed' | 'new';
  recipientCount: number;
  creditsUsed: number;
  messageTemplate: string;
  status: 'draft' | 'scheduled' | 'sent';
  sentAt: string;
  createdAt: string;
}

export const MarketingModule: React.FC = () => {
  const { t } = useTranslation();
  const { addToast } = useToast();

  // Marketing & Ledger States
  const [campaignsList, setCampaignsList] = useState<Campaign[]>([]);
  const [smsCreditsRemaining, setSmsCreditsRemaining] = useState<number>(50);
  const [googleReviewUrl, setGoogleReviewUrl] = useState<string>('https://g.page/r/your-business/review');
  const [autoReviewEnabled, setAutoReviewEnabled] = useState<boolean>(true);
  const [reengagementDays, setReengagementDays] = useState<number>(21);
  const [autoReengagementEnabled, setAutoReengagementEnabled] = useState<boolean>(true);
  const [totalClientsCount, setTotalClientsCount] = useState<number>(34);
  const [loading, setLoading] = useState(true);

  // Modals & Drawers
  const [isTopUpOpen, setIsTopUpOpen] = useState(false);
  const [isCampaignDrawerOpen, setIsCampaignDrawerOpen] = useState(false);
  const [savingSettings, setSavingSettings] = useState(false);
  const [sendingCampaign, setSendingCampaign] = useState(false);
  const [buyingCredits, setBuyingCredits] = useState(false);
  const [testSmsSending, setTestSmsSending] = useState(false);

  // New Campaign Form State
  const [campName, setCampName] = useState('');
  const [campAudience, setCampAudience] = useState<'all' | 'vip' | 'lapsed' | 'new'>('all');
  const [campChannel, setCampChannel] = useState<'sms' | 'email' | 'both'>('sms');
  const [campMessage, setCampMessage] = useState(
    'Hey {clientName}! We have special promotions this week at {businessName}. Tap here to reserve: {bookingUrl}'
  );

  // Load Data
  const fetchData = async () => {
    try {
      setLoading(true);
      const [campRes, clientRes] = await Promise.all([
        fetch('/api/campaigns'),
        fetch('/api/clients'),
      ]);

      const [campData, clientData] = await Promise.all([
        campRes.json(),
        clientRes.json(),
      ]);

      if (campData.success) {
        setCampaignsList(campData.campaigns || []);
        setSmsCreditsRemaining(campData.smsCreditsRemaining ?? 50);
        setGoogleReviewUrl(campData.googleReviewUrl || 'https://g.page/r/your-business/review');
        setAutoReviewEnabled(campData.autoReviewEnabled ?? true);
        setReengagementDays(campData.reengagementDays ?? 21);
        setAutoReengagementEnabled(campData.autoReengagementEnabled ?? true);
      }

      if (clientData.success && Array.isArray(clientData.clients)) {
        setTotalClientsCount(clientData.clients.length || 34);
      }
    } catch (err) {
      console.error('Error fetching marketing data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Save Automated Trigger Rules
  const handleSaveAutomationSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSavingSettings(true);
      const res = await fetch('/api/campaigns', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          googleReviewUrl,
          autoReviewEnabled,
          reengagementDays: Number(reengagementDays),
          autoReengagementEnabled,
        }),
      });

      const data = await res.json();
      if (data.success) {
        addToast(t('settingsSaved'), 'success');
      } else {
        addToast('Failed to update automation rules.', 'error');
      }
    } catch (err) {
      addToast('Network error saving automation rules.', 'error');
    } finally {
      setSavingSettings(false);
    }
  };

  // Top Up SMS Credits Pack
  const handleBuyCredits = async (credits: number, priceDollars: number) => {
    try {
      setBuyingCredits(true);
      const res = await fetch('/api/campaigns/credits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ credits, priceDollars }),
      });

      const data = await res.json();
      if (data.success) {
        setSmsCreditsRemaining(data.smsCreditsRemaining);
        setIsTopUpOpen(false);
        addToast(t('creditsAddedSuccess'), 'success');
      } else {
        addToast(data.error || 'Failed to top up credits.', 'error');
      }
    } catch (err) {
      addToast('Network error purchasing SMS credits.', 'error');
    } finally {
      setBuyingCredits(false);
    }
  };

  // Dispatch Broadcast Campaign
  const handleLaunchCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!campName.trim() || !campMessage.trim()) return;

    const recipientCount =
      campAudience === 'all'
        ? totalClientsCount
        : campAudience === 'vip'
        ? Math.max(5, Math.round(totalClientsCount * 0.25))
        : campAudience === 'lapsed'
        ? Math.max(8, Math.round(totalClientsCount * 0.4))
        : Math.max(4, Math.round(totalClientsCount * 0.15));

    const isSms = campChannel === 'sms' || campChannel === 'both';
    if (isSms && smsCreditsRemaining < recipientCount) {
      addToast(t('insufficientCredits'), 'error');
      setIsTopUpOpen(true);
      return;
    }

    try {
      setSendingCampaign(true);
      const res = await fetch('/api/campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: campName,
          channel: campChannel,
          audienceFilter: campAudience,
          messageTemplate: campMessage,
          recipientCount,
        }),
      });

      const data = await res.json();
      if (data.success && data.campaign) {
        setCampaignsList((prev) => [data.campaign, ...prev]);
        setSmsCreditsRemaining(data.smsCreditsRemaining);
        setIsCampaignDrawerOpen(false);
        setCampName('');
        addToast(t('campaignSentSuccess'), 'success');
      } else {
        addToast(data.error || 'Failed to send campaign.', 'error');
      }
    } catch (err) {
      addToast('Network error launching broadcast campaign.', 'error');
    } finally {
      setSendingCampaign(false);
    }
  };

  // Send Test Review SMS
  const handleSendTestReviewSms = async () => {
    try {
      setTestSmsSending(true);
      const res = await fetch('/api/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'sms',
          recipient: '+1 (555) 234-5678',
          message: `Thank you for choosing us! We hope you enjoyed your service. Could you take 30 seconds to leave us a 5-star Google review? ${googleReviewUrl}`,
        }),
      });

      const data = await res.json();
      if (data.success) {
        addToast(t('testSmsSent'), 'success');
      }
    } catch (err) {
      console.warn('Test notification error:', err);
    } finally {
      setTimeout(() => setTestSmsSending(false), 1200);
    }
  };

  // Audience Count Resolution
  const getAudienceCount = (filter: 'all' | 'vip' | 'lapsed' | 'new') => {
    if (filter === 'all') return totalClientsCount;
    if (filter === 'vip') return Math.max(5, Math.round(totalClientsCount * 0.25));
    if (filter === 'lapsed') return Math.max(8, Math.round(totalClientsCount * 0.4));
    return Math.max(4, Math.round(totalClientsCount * 0.15));
  };

  // Estimated SMS segments calculation
  const previewText = campMessage
    .replace('{clientName}', 'Sarah')
    .replace('{businessName}', 'AirBook Salon')
    .replace('{bookingUrl}', 'airbook.me/book/demo')
    .replace('{staffName}', 'Elena');

  const charCount = previewText.length;
  const smsSegments = Math.ceil(charCount / 160) || 1;
  const requiredCredits = (campChannel === 'sms' || campChannel === 'both') ? getAudienceCount(campAudience) * smsSegments : 0;

  return (
    <div className="w-full max-w-5xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[var(--border-subtle)]">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-extrabold text-[var(--text-primary)] tracking-tight">
              {t('marketingTitle')}
            </h2>
            <span className="px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-[10px] font-extrabold uppercase">
              {t('retentionAndReviews')}
            </span>
          </div>
          <p className="text-xs text-[var(--text-secondary)] mt-1 max-w-2xl">
            {t('marketingDesc')}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setIsTopUpOpen(true)}
            className="px-3.5 py-2.5 rounded-2xl bg-black/5 dark:bg-white/5 hover:bg-black/10 text-[var(--text-primary)] font-extrabold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Money24Regular className="w-4 h-4 text-emerald-500" />
            <span>{t('topUpCredits')}</span>
          </button>

          <button
            type="button"
            onClick={() => setIsCampaignDrawerOpen(true)}
            className="px-4 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs shadow-md flex items-center gap-2 transition-all duration-100 cursor-pointer"
          >
            <Send24Filled className="w-4 h-4" />
            <span>{t('newBroadcastCampaign')}</span>
          </button>
        </div>
      </div>

      {/* Prepaid SMS Ledger Balance Ribbon */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        <div className="p-4 rounded-3xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] space-y-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-[var(--text-secondary)] text-xs font-semibold">
              <Phone24Regular className="w-4 h-4 text-blue-500" />
              <span>{t('smsCreditsBalance')}</span>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 text-[10px] font-bold">
              {t('prepaidLedger')}
            </span>
          </div>
          <div className="flex items-baseline justify-between pt-1">
            <p className="text-2xl font-black text-blue-600 dark:text-blue-400 font-mono">
              {smsCreditsRemaining}
            </p>
            <button
              type="button"
              onClick={() => setIsTopUpOpen(true)}
              className="text-[11px] font-extrabold text-blue-600 hover:underline cursor-pointer"
            >
              {t('topUpBtn')}
            </button>
          </div>
        </div>

        <div className="p-4 rounded-3xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] space-y-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-[var(--text-secondary)] text-xs font-semibold">
              <Mail24Regular className="w-4 h-4 text-purple-500" />
              <span>{t('emailMarketing')}</span>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-600 text-[10px] font-bold">
              {t('resendEngine')}
            </span>
          </div>
          <div className="flex items-baseline justify-between pt-1">
            <p className="text-lg font-black text-purple-600 dark:text-purple-400">
              {t('unlimited')}
            </p>
            <span className="text-[10px] font-bold text-[var(--text-muted)]">
              {t('zeroPerMessage')}
            </span>
          </div>
        </div>

        <div className="p-4 rounded-3xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] space-y-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-[var(--text-secondary)] text-xs font-semibold">
              <ShieldCheckmark24Regular className="w-4 h-4 text-emerald-500" />
              <span>{t('platformProtection')}</span>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 text-[10px] font-bold">
              {t('zeroDebtGuarantee')}
            </span>
          </div>
          <p className="text-xs text-[var(--text-secondary)] pt-1">
            {t('platformProtectionDesc')}
          </p>
        </div>
      </div>

      {/* ─── SECTION 1: AUTOMATED RETENTION & REVIEW TRIGGERS ─── */}
      <form onSubmit={handleSaveAutomationSettings} className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-extrabold text-[var(--text-primary)]">
            {t('automatedTriggers')}
          </h3>
          <button
            type="submit"
            disabled={savingSettings}
            className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-extrabold text-xs shadow-xs transition-colors cursor-pointer"
          >
            {savingSettings ? t('savingState') : t('saveSettings')}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Trigger 1: 5-Star Google Reviews */}
          <div className="p-5 rounded-3xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] space-y-3.5">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center flex-shrink-0">
                  <Star24Filled className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-extrabold text-[var(--text-primary)]">
                    {t('googleReviewTrigger')}
                  </h4>
                  <p className="text-[11px] text-[var(--text-secondary)] mt-0.5">
                    {t('googleReviewTriggerDesc')}
                  </p>
                </div>
              </div>

              <input
                type="checkbox"
                checked={autoReviewEnabled}
                onChange={(e) => setAutoReviewEnabled(e.target.checked)}
                className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
              />
            </div>

            <div className="space-y-1 pt-1">
              <label className="text-[11px] font-bold text-[var(--text-secondary)] block">
                {t('googleReviewUrlLabel')}
              </label>
              <input
                type="url"
                value={googleReviewUrl}
                onChange={(e) => setGoogleReviewUrl(e.target.value)}
                placeholder="https://g.page/r/your-id/review"
                className="w-full px-3.5 py-2 rounded-2xl bg-black/5 dark:bg-white/5 border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className={`text-[11px] font-extrabold ${autoReviewEnabled ? 'text-emerald-600' : 'text-[var(--text-muted)]'}`}>
                {autoReviewEnabled ? t('triggerActive') : t('triggerDisabled')}
              </span>
              <button
                type="button"
                onClick={handleSendTestReviewSms}
                disabled={testSmsSending}
                className="text-xs font-extrabold text-blue-600 hover:underline cursor-pointer"
              >
                {testSmsSending ? t('sendingTestState') : t('sendTestSms')}
              </button>
            </div>
          </div>

          {/* Trigger 2: Lapsed Client Re-Engagement */}
          <div className="p-5 rounded-3xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] space-y-3.5">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-2xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center flex-shrink-0">
                  <ArrowRepeatAll24Filled className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-extrabold text-[var(--text-primary)]">
                    {t('reengagementTrigger')}
                  </h4>
                  <p className="text-[11px] text-[var(--text-secondary)] mt-0.5">
                    {t('reengagementTriggerDesc')}
                  </p>
                </div>
              </div>

              <input
                type="checkbox"
                checked={autoReengagementEnabled}
                onChange={(e) => setAutoReengagementEnabled(e.target.checked)}
                className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
              />
            </div>

            <div className="space-y-1 pt-1">
              <label className="text-[11px] font-bold text-[var(--text-secondary)] block">
                {t('reengagementInterval')}
              </label>
              <CustomSelect
                value={String(reengagementDays)}
                onChange={(val) => setReengagementDays(Number(val))}
                options={[
                  { value: '14', label: t('days14') },
                  { value: '21', label: t('days21') },
                  { value: '30', label: t('days30') },
                  { value: '60', label: t('days60') },
                ]}
              />
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className={`text-[11px] font-extrabold ${autoReengagementEnabled ? 'text-emerald-600' : 'text-[var(--text-muted)]'}`}>
                {autoReengagementEnabled ? t('triggerActive') : t('triggerDisabled')}
              </span>
              <span className="text-[11px] text-[var(--text-secondary)]">
                {t('includesBookingShortlink')}
              </span>
            </div>
          </div>
        </div>
      </form>

      {/* ─── SECTION 2: SENT CAMPAIGNS HISTORY ─── */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-extrabold text-[var(--text-primary)]">
            {t('sentCampaigns')}
          </h3>
          <span className="text-xs text-[var(--text-secondary)]">
            {t('totalDispatches').replace('{count}', String(campaignsList.length))}
          </span>
        </div>

        {campaignsList.length === 0 ? (
          <EmptyState
            icon={Send24Regular}
            title={t('noCampaignsFound')}
            description={t('noCampaignsSub')}
          />
        ) : (
          <div className="bg-[var(--bg-primary)] border border-[var(--border-subtle)] rounded-3xl overflow-hidden divide-y divide-[var(--border-subtle)] shadow-xs">
            {campaignsList.map((camp) => (
              <div
                key={camp.id}
                className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors"
              >
                <div className="flex items-start sm:items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 ${
                      camp.channel === 'sms'
                        ? 'bg-blue-500/10 text-blue-600'
                        : camp.channel === 'email'
                        ? 'bg-purple-500/10 text-purple-600'
                        : 'bg-emerald-500/10 text-emerald-600'
                    }`}
                  >
                    {camp.channel === 'sms' ? (
                      <Phone24Filled className="w-5 h-5" />
                    ) : camp.channel === 'email' ? (
                      <Mail24Filled className="w-5 h-5" />
                    ) : (
                      <Send24Filled className="w-5 h-5" />
                    )}
                  </div>

                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-xs font-extrabold text-[var(--text-primary)]">{camp.name}</h4>
                      <span className="px-2 py-0.2 rounded-full bg-black/5 dark:bg-white/5 text-[10px] font-bold text-[var(--text-secondary)] uppercase">
                        {camp.channel.toUpperCase()}
                      </span>
                      <span className="px-2 py-0.2 rounded-full bg-emerald-500/10 text-emerald-600 text-[10px] font-bold">
                        {t('deliveredStatus')}
                      </span>
                    </div>
                    <p className="text-xs text-[var(--text-secondary)] line-clamp-1">
                      &quot;{camp.messageTemplate}&quot;
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto border-t sm:border-t-0 border-[var(--border-subtle)] pt-2.5 sm:pt-0 text-left sm:text-right">
                  <div>
                    <p className="text-xs font-black text-[var(--text-primary)]">
                      {t('recipientsCountLabel').replace('{count}', String(camp.recipientCount))}
                    </p>
                    <p className="text-[10px] text-[var(--text-muted)] font-mono">
                      {t('creditsUsedCount').replace('{count}', String(camp.creditsUsed))} · {new Date(camp.sentAt || camp.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ─── DRAWER 1: NEW BROADCAST CAMPAIGN COMPOSER ─── */}
      <AnimatePresence>
        {isCampaignDrawerOpen && (
          <div className="fixed inset-0 z-[200] flex items-end md:items-center justify-center p-0 md:p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCampaignDrawerOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-xs"
            />

            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 30, scale: 0.98 }}
              transition={{ type: 'spring', damping: 28, stiffness: 380 }}
              className="relative w-full md:max-w-2xl bg-[var(--bg-primary)] border-t md:border border-[var(--border-subtle)] rounded-t-[32px] md:rounded-3xl rounded-b-none md:rounded-b-3xl shadow-2xl z-10 flex flex-col max-h-[92vh] md:max-h-[85vh] overflow-hidden"
            >
              {/* Mobile & Tablet Drag Handle */}
              <div className="w-full pt-3 pb-1 flex md:hidden justify-center bg-[var(--bg-primary)] flex-shrink-0">
                <div className="w-12 h-1.5 rounded-full bg-black/20 dark:bg-white/20" />
              </div>

              {/* Header */}
              <div className="w-full px-6 py-4 flex items-center justify-between flex-shrink-0 bg-[var(--bg-primary)] border-b border-[var(--border-subtle)]">
                <div>
                  <h3 className="text-base font-extrabold text-[var(--text-primary)]">
                    {t('newBroadcastCampaign')}
                  </h3>
                  <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                    {t('blastPromotionsDesc')}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsCampaignDrawerOpen(false)}
                  className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-[var(--text-secondary)] transition-colors cursor-pointer"
                >
                  <Dismiss24Filled className="w-5 h-5" />
                </button>
              </div>

              {/* Body */}
              <form onSubmit={handleLaunchCampaign} className="flex flex-col flex-1 overflow-hidden">
                <div className="p-6 overflow-y-auto space-y-4 flex-1">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-[var(--text-secondary)] block">
                      {t('campaignName')}
                    </label>
                    <input
                      type="text"
                      required
                      placeholder={t('vipCampaignPlaceholder')}
                      value={campName}
                      onChange={(e) => setCampName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-2xl bg-black/5 dark:bg-white/5 border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-[var(--text-secondary)] block">
                        {t('targetAudience')}
                      </label>
                      <CustomSelect
                        value={campAudience}
                        onChange={(val) => setCampAudience(val as any)}
                        options={[
                          { value: 'all', label: t('audienceAll', { count: totalClientsCount }) },
                          { value: 'vip', label: t('audienceVip', { count: Math.max(5, Math.round(totalClientsCount * 0.25)) }) },
                          { value: 'lapsed', label: t('audienceLapsed', { count: Math.max(8, Math.round(totalClientsCount * 0.4)) }) },
                          { value: 'new', label: t('audienceNew', { count: Math.max(4, Math.round(totalClientsCount * 0.15)) }) },
                        ]}
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-[var(--text-secondary)] block">
                        {t('campaignChannel')}
                      </label>
                      <CustomSelect
                        value={campChannel}
                        onChange={(val) => setCampChannel(val as any)}
                        options={[
                          { value: 'sms', label: t('channelSms') },
                          { value: 'email', label: `${t('channelEmail')} (${t('freeLabel')})` },
                          { value: 'both', label: t('channelBoth') },
                        ]}
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-semibold text-[var(--text-secondary)]">
                        {t('messageComposer')}
                      </label>
                      <span className="text-[10px] font-mono text-[var(--text-muted)]">
                        {t('charCount', { chars: charCount, segments: smsSegments })}
                      </span>
                    </div>
                    <textarea
                      rows={3}
                      required
                      value={campMessage}
                      onChange={(e) => setCampMessage(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-2xl bg-black/5 dark:bg-white/5 border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none font-medium"
                    />

                    <div className="flex items-center gap-1.5 flex-wrap pt-1">
                      {['{clientName}', '{businessName}', '{bookingUrl}', '{staffName}'].map((tag) => (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => setCampMessage((prev) => `${prev} ${tag}`)}
                          className="px-2 py-0.5 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 text-[10px] font-mono font-bold transition-colors cursor-pointer"
                        >
                          + {tag}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Smartphone Live Preview Simulator */}
                  <div className="p-4 rounded-3xl bg-black/5 dark:bg-white/5 border border-[var(--border-subtle)] space-y-2">
                    <p className="text-[10px] font-extrabold uppercase tracking-wider text-[var(--text-secondary)]">
                      {t('smartphonePreview')}
                    </p>
                    <div className="p-3.5 rounded-2xl bg-blue-600 text-white text-xs font-medium max-w-sm shadow-sm space-y-1">
                      <p className="leading-relaxed">{previewText}</p>
                      <p className="text-[9px] text-blue-200 text-right">{t('deliveredViaAirbookEngine')}</p>
                    </div>
                  </div>
                </div>

                {/* Side-to-Side Bottom Action Banner */}
                <div className="w-full border-t border-[var(--border-subtle)] bg-[var(--bg-primary)] p-4 sm:p-5 rounded-none flex-shrink-0 z-30 flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs font-extrabold text-[var(--text-primary)]">
                      {requiredCredits > 0 ? t('creditsRequired', { count: requiredCredits }) : t('freeEmailDispatch')}
                    </p>
                    <p className="text-[10px] text-[var(--text-secondary)] font-mono">
                      {t('currentBalanceCredits').replace('{count}', String(smsCreditsRemaining))}
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={sendingCampaign}
                    className="px-5 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-extrabold text-xs shadow-md flex items-center gap-2 transition-all cursor-pointer"
                  >
                    <Send24Filled className="w-4 h-4" />
                    <span>{sendingCampaign ? t('dispatchingState') : t('launchCampaign')}</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ─── MODAL 2: TOP UP SMS CREDITS ─── */}
      <AnimatePresence>
        {isTopUpOpen && (
          <div className="fixed inset-0 z-[220] flex items-end md:items-center justify-center p-0 md:p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsTopUpOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-xs"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full md:max-w-md bg-[var(--bg-primary)] border-t md:border border-[var(--border-subtle)] rounded-t-[32px] md:rounded-3xl rounded-b-none md:rounded-b-3xl p-6 shadow-2xl z-10 space-y-4 max-h-[92vh] md:max-h-[85vh] overflow-y-auto"
            >
              {/* Mobile & Tablet Drag Handle */}
              <div className="w-full pt-1 pb-1 flex md:hidden justify-center bg-transparent flex-shrink-0">
                <div className="w-12 h-1.5 rounded-full bg-black/20 dark:bg-white/20" />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-extrabold text-[var(--text-primary)]">
                    {t('topUpCredits')}
                  </h3>
                  <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                    {t('prepaidDebtProtectionDesc')}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsTopUpOpen(false)}
                  className="p-1 text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                >
                  <Dismiss24Filled className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-2.5 pt-1">
                {[
                  { credits: 250, price: 5, label: t('pack250'), badge: t('packStarter') },
                  { credits: 1000, price: 18, label: t('pack1000'), badge: t('packMostPopular') },
                  { credits: 5000, price: 75, label: t('pack5000'), badge: t('packBestValue') },
                ].map((pack) => (
                  <button
                    key={pack.credits}
                    type="button"
                    disabled={buyingCredits}
                    onClick={() => handleBuyCredits(pack.credits, pack.price)}
                    className="w-full p-4 rounded-2xl bg-black/5 dark:bg-white/5 hover:bg-blue-500/10 border border-[var(--border-subtle)] hover:border-blue-500/30 text-left flex items-center justify-between transition-all cursor-pointer group"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-extrabold text-[var(--text-primary)] group-hover:text-blue-600">
                          {t('smsCreditsLabel').replace('{count}', pack.credits.toLocaleString())}
                        </span>
                        <span className="px-2 py-0.2 rounded-full bg-blue-500/10 text-blue-600 text-[10px] font-bold">
                          {pack.badge}
                        </span>
                      </div>
                      <p className="text-[11px] text-[var(--text-secondary)] mt-0.5 font-mono">
                        ${pack.price}.00 USD
                      </p>
                    </div>

                    <div className="px-3.5 py-1.5 rounded-xl bg-blue-600 text-white text-xs font-black shadow-xs">
                      {t('buyButton')}
                    </div>
                  </button>
                ))}
              </div>

              <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-800 dark:text-emerald-300">
                <strong>{t('zeroDebtGuarantee')}:</strong> {t('zeroPlatformDebtNotice')}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
