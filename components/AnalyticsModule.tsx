'use client';

import React, { useState, useEffect } from 'react';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { Icon } from '@/components/primitives/Icon';
import { Card } from '@/components/primitives/Card';
import { Badge } from '@/components/primitives/Badge';
import { StatCard } from '@/components/StatCard';
import {
  DataTrending24Regular,
  Money24Regular,
  People24Regular,
  Sparkle24Regular,
  ArrowDownload24Filled,
} from '@fluentui/react-icons';
import { useAirBookStore } from '@/lib/store';

interface DailyRevenuePoint {
  date: string;
  revenue: number;
  count: number;
}

interface StaffPayrollRow {
  staffId: string;
  staffName: string;
  role: string;
  appointmentsCount: number;
  grossRevenue: number;
  commissionPercent: number;
  payoutOwed: number;
}

interface AnalyticsData {
  totalRevenue: number;
  paidInvoicesCount: number;
  totalAppointments: number;
  totalClients: number;
  totalExpenses: number;
  netProfit: number;
  dailyRevenue?: DailyRevenuePoint[];
  staffPayroll?: StaffPayrollRow[];
}

type DateRangeKey = '7d' | '30d' | '90d' | 'all';

export const AnalyticsModule: React.FC = () => {
  const { t } = useTranslation();
  const workspaceId = useAirBookStore((s) => s.workspaceId);
  const checkoutNonce = useAirBookStore((s) => s.checkoutNonce);
  const [range, setRange] = useState<DateRangeKey>('30d');
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        setLoading(true);
        const params = new URLSearchParams({ range });
        if (workspaceId) params.set('workspaceId', workspaceId);
        const res = await fetch(`/api/analytics?${params.toString()}`);
        const json = await res.json();
        if (json.success && json.analytics) {
          setData(json.analytics);
        } else {
          setData(null);
        }
      } catch (err) {
        console.warn('Failed to load analytics from DB:', err);
        setData(null);
      } finally {
        setLoading(false);
      }
    }
    fetchAnalytics();
  }, [workspaceId, checkoutNonce, range]);

  const revNum = data ? data.totalRevenue : 0;
  const rev = revNum.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const netNum = data ? data.netProfit : 0;
  const net = netNum.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const apts = data ? data.totalAppointments : 0;
  const clientsCount = data ? data.totalClients : 0;
  const dailySeries = data?.dailyRevenue || [];
  const maxDailyRev = Math.max(1, ...dailySeries.map((d) => d.revenue));
  const payrollRows = data?.staffPayroll || [];

  const handleExportPayrollCsv = () => {
    const header = 'Specialist,Role,Appointments,Gross Revenue ($),Commission (%),Payout Owed ($)\n';
    const body = payrollRows
      .map(
        (r) =>
          `"${r.staffName.replace(/"/g, '""')}","${r.role.replace(/"/g, '""')}",${r.appointmentsCount},${r.grossRevenue.toFixed(2)},${r.commissionPercent},${r.payoutOwed.toFixed(2)}`
      )
      .join('\n');
    const blob = new Blob([header + body], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `airbook-payroll-${range}-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const rangeOptions: { key: DateRangeKey; label: string }[] = [
    { key: '7d', label: t('range7d') },
    { key: '30d', label: t('range30d') },
    { key: '90d', label: t('range90d') },
    { key: 'all', label: t('rangeAll') },
  ];

  return (
    <div className="w-full max-w-5xl mx-auto p-4 sm:p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-[var(--text-primary)] tracking-tight">
            {t('analyticsTitle')}
          </h2>
          <p className="text-xs text-[var(--text-secondary)] mt-0.5">
            {t('analyticsDesc')}
          </p>
        </div>

        {/* Date-Range Segmented Control */}
        <div className="flex items-center gap-1 p-1 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] w-fit">
          {rangeOptions.map((opt) => (
            <button
              key={opt.key}
              type="button"
              onClick={() => setRange(opt.key)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                range === opt.key
                  ? 'bg-[var(--bg-primary)] text-[var(--text-primary)] shadow-xs font-extrabold'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
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
            <StatCard
              title={t('metricTotalRevenue')}
              value={rev}
              prefix="$"
              icon={<Icon regular={Money24Regular} size="sm" tone="secondary" />}
            />

            <StatCard
              title={t('netProfit')}
              value={net}
              prefix="$"
              icon={<Icon regular={DataTrending24Regular} size="sm" tone="secondary" />}
            />

            <StatCard
              title={t('appointments')}
              value={apts}
              icon={<Icon regular={Sparkle24Regular} size="sm" tone="secondary" />}
            />

            <StatCard
              title={t('metricTotalClients')}
              value={clientsCount}
              icon={<Icon regular={People24Regular} size="sm" tone="secondary" />}
            />
          </div>

          {/* Daily Revenue Trend Chart */}
          <Card className="p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Icon regular={DataTrending24Regular} size="sm" tone="secondary" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-primary)]">
                  {t('revenueTrendTitle')}
                </h3>
              </div>
              <Badge variant="subtle" size="xs" className="font-mono">
                {dailySeries.length}d
              </Badge>
            </div>

            {dailySeries.length === 0 ? (
              <p className="text-xs text-[var(--text-secondary)] py-6 text-center">
                {t('noRevenueDataRange')}
              </p>
            ) : (
              <div className="flex items-end gap-1.5 h-36 pt-4 overflow-x-auto">
                {dailySeries.map((pt) => {
                  const pct = Math.max(8, Math.round((pt.revenue / maxDailyRev) * 100));
                  return (
                    <div
                      key={pt.date}
                      title={`${pt.date}: $${pt.revenue.toFixed(2)} (${pt.count})`}
                      className="flex-1 min-w-[18px] h-full flex flex-col items-center justify-end gap-1.5 group"
                    >
                      <div
                        className="w-full rounded-t-lg bg-[#2BB5FF]/80 group-hover:bg-[#2BB5FF] transition-colors"
                        style={{ height: `${pct}%` }}
                      />
                      <span className="text-[9px] font-mono text-[var(--text-muted)] truncate max-w-full">
                        {pt.date.slice(5)}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </Card>

          {/* Staff Commission & Payroll Breakdown */}
          <Card className="p-5 space-y-4">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Icon regular={People24Regular} size="sm" tone="secondary" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-primary)]">
                  {t('staffPayrollTitle')}
                </h3>
              </div>

              {payrollRows.length > 0 && (
                <button
                  type="button"
                  onClick={handleExportPayrollCsv}
                  className="btn-secondary h-8 px-3 rounded-xl text-xs font-bold flex items-center gap-1.5"
                >
                  <Icon filled={ArrowDownload24Filled} size="xs" />
                  <span>{t('exportPayrollCsv')}</span>
                </button>
              )}
            </div>

            {payrollRows.length === 0 ? (
              <p className="text-xs text-[var(--text-secondary)] py-6 text-center">
                {t('noPayrollData')}
              </p>
            ) : (
              <div className="divide-y divide-[var(--border-subtle)]">
                {payrollRows.map((row) => (
                  <div
                    key={row.staffId}
                    className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
                  >
                    <div>
                      <p className="font-bold text-[var(--text-primary)]">{row.staffName}</p>
                      <p className="text-[11px] text-[var(--text-secondary)]">
                        {row.role} · {row.appointmentsCount} {t('appointments')}
                      </p>
                    </div>

                    <div className="flex items-center gap-4 font-mono">
                      <Badge variant="subtle" size="xs">
                        {t('commissionRateLabel')}: {row.commissionPercent}%
                      </Badge>
                      <span className="text-[var(--text-secondary)]">
                        ${row.grossRevenue.toFixed(2)}
                      </span>
                      <span className="font-extrabold text-[var(--text-primary)]">
                        {t('payoutOwedLabel')}: ${row.payoutOwed.toFixed(2)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </>
      )}
    </div>
  );
};
