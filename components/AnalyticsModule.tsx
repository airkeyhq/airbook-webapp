'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { DataTrending24Regular, Money24Regular, People24Regular, Sparkle24Regular, ArrowUp24Regular } from '@fluentui/react-icons';

interface AnalyticsData {
  totalRevenue: number;
  paidInvoicesCount: number;
  totalAppointments: number;
  totalClients: number;
  totalExpenses: number;
  netProfit: number;
}

export const AnalyticsModule: React.FC = () => {
  const { t } = useTranslation();
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        setLoading(true);
        const res = await fetch('/api/analytics');
        const json = await res.json();
        if (json.success && json.analytics) {
          setData(json.analytics);
        }
      } catch (err) {
        console.warn('Failed to load analytics from DB:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchAnalytics();
  }, []);

  const revNum = data ? data.totalRevenue : 0;
  const rev = revNum.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const netNum = data ? data.netProfit : 0;
  const net = netNum.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const apts = data ? data.totalAppointments : 0;
  const clientsCount = data ? data.totalClients : 0;

  return (
    <div className="w-full max-w-5xl mx-auto p-4 sm:p-6 space-y-6">
      <div>
        <h2 className="text-xl font-extrabold text-[var(--text-primary)] tracking-tight">
          {t('analyticsTitle')}
        </h2>
        <p className="text-xs text-[var(--text-secondary)] mt-0.5">
          {t('analyticsDesc')}
        </p>
      </div>

      {loading && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="p-4 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] space-y-2.5 animate-pulse shadow-xs"
            >
              <div className="h-3 w-24 rounded-full bg-black/10 dark:bg-white/10" />
              <div className="h-7 w-28 rounded-xl bg-black/15 dark:bg-white/15" />
            </div>
          ))}
        </div>
      )}

      {!loading && (
        <>
          {/* Metrics Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
            <div className="p-4 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] space-y-1">
              <div className="flex items-center gap-1.5 text-[var(--text-secondary)] text-xs font-semibold">
                <Money24Regular className="w-4 h-4 text-[var(--text-secondary)]" />
                <span>{t('metricTotalRevenue')}</span>
              </div>
              <p className="text-xl font-black text-[var(--text-primary)] font-mono">${rev.toLocaleString()}</p>
            </div>

            <div className="p-4 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] space-y-1">
              <div className="flex items-center gap-1.5 text-[var(--text-secondary)] text-xs font-semibold">
                <DataTrending24Regular className="w-4 h-4 text-[var(--text-secondary)]" />
                <span>{t('netProfit')}</span>
              </div>
              <p className="text-xl font-black text-[var(--text-primary)] font-mono">${net.toLocaleString()}</p>
            </div>

            <div className="p-4 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] space-y-1">
              <div className="flex items-center gap-1.5 text-[var(--text-secondary)] text-xs font-semibold">
                <Sparkle24Regular className="w-4 h-4 text-[var(--text-secondary)]" />
                <span>{t('appointments')}</span>
              </div>
              <p className="text-xl font-black text-[var(--text-primary)] font-mono">{apts}</p>
            </div>

            <div className="p-4 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] space-y-1">
              <div className="flex items-center gap-1.5 text-[var(--text-secondary)] text-xs font-semibold">
                <People24Regular className="w-4 h-4 text-[var(--text-secondary)]" />
                <span>{t('metricTotalClients')}</span>
              </div>
              <p className="text-xl font-black text-[var(--text-primary)] font-mono">{clientsCount}</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
