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
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="p-5 rounded-3xl glass-panel bg-white/70 dark:bg-gray-900/70 border border-white/60 dark:border-white/10 space-y-2.5 animate-pulse"
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
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="p-5 rounded-3xl glass-panel bg-white/70 dark:bg-gray-900/70 border border-white/60 dark:border-white/10 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">Total Revenue</span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black">${rev.toLocaleString()}</span>
              </div>
            </div>

            <div className="p-5 rounded-3xl glass-panel bg-white/70 dark:bg-gray-900/70 border border-white/60 dark:border-white/10 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">Net Profit</span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black">${net.toLocaleString()}</span>
              </div>
            </div>

            <div className="p-5 rounded-3xl glass-panel bg-white/70 dark:bg-gray-900/70 border border-white/60 dark:border-white/10 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">Appointments</span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black">{apts}</span>
              </div>
            </div>

            <div className="p-5 rounded-3xl glass-panel bg-white/70 dark:bg-gray-900/70 border border-white/60 dark:border-white/10 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">Total Clients</span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black">{clientsCount}</span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
