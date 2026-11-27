'use client';

import React, { useState, useEffect } from 'react';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { Icon } from '@/components/primitives/Icon';
import { Card } from '@/components/primitives/Card';
import { Badge } from '@/components/primitives/Badge';
import { ToggleGroup } from '@/components/primitives/ToggleGroup';
import { StatCard } from '@/components/StatCard';
import {
  DataTrending24Regular,
  Money24Regular,
  People24Regular,
  Sparkle24Regular,
  ArrowDownload24Filled,
  Add24Filled,
  Delete24Filled,
  Receipt24Regular,
} from '@fluentui/react-icons';
import { useAirBookStore } from '@/lib/store';
import { useToast } from '@/components/Toast';
import { CustomSelect } from '@/components/CustomSelect';
import { FloatingInput } from '@/components/FloatingInput';

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

interface ExpenseItem {
  id: string;
  category: string;
  amountCents: number;
  description?: string | null;
  dateStr: string;
}

type DateRangeKey = '7d' | '30d' | '90d' | 'all';

export const AnalyticsModule: React.FC = () => {
  const { t } = useTranslation();
  const { addToast } = useToast();
  const workspaceId = useAirBookStore((s) => s.workspaceId);
  const checkoutNonce = useAirBookStore((s) => s.checkoutNonce);
  const bumpCheckoutNonce = useAirBookStore((s) => s.bumpCheckoutNonce);
  const [range, setRange] = useState<DateRangeKey>('30d');
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [expensesList, setExpensesList] = useState<ExpenseItem[]>([]);
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [expCategory, setExpCategory] = useState('supplies');
  const [expAmount, setExpAmount] = useState('');
  const [expDesc, setExpDesc] = useState('');
  const [savingExpense, setSavingExpense] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        setLoading(true);
        const params = new URLSearchParams({ range });
        if (workspaceId) params.set('workspaceId', workspaceId);
        const [analyticsRes, expensesRes] = await Promise.all([
          fetch(`/api/analytics?${params.toString()}`),
          fetch(workspaceId ? `/api/expenses?workspaceId=${encodeURIComponent(workspaceId)}` : '/api/expenses'),
        ]);
        const json = await analyticsRes.json();
        if (json.success && json.analytics) {
          setData(json.analytics);
        } else {
          setData(null);
        }
        const expJson = await expensesRes.json();
        if (expJson.success && Array.isArray(expJson.expenses)) {
          setExpensesList(expJson.expenses);
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

  const handleAddExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    const amt = Number(expAmount);
    if (!workspaceId || !amt || amt <= 0) return;
    try {
      setSavingExpense(true);
      const res = await fetch('/api/expenses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          workspaceId,
          category: expCategory,
          amountCents: Math.round(amt * 100),
          description: expDesc.trim() || undefined,
        }),
      });
      const json = await res.json();
      if (json.success) {
        setExpAmount('');
        setExpDesc('');
        setShowExpenseForm(false);
        addToast(t('expenseSavedToast'), 'success');
        bumpCheckoutNonce();
      } else {
        addToast(json.error || 'Failed to log expense.', 'error');
      }
    } catch {
      addToast('Network error logging expense.', 'error');
    } finally {
      setSavingExpense(false);
    }
  };

  const handleDeleteExpense = async (id: string) => {
    try {
      const res = await fetch(`/api/expenses?id=${encodeURIComponent(id)}`, { method: 'DELETE' });
      if (res.ok) {
        bumpCheckoutNonce();
      }
    } catch (err) {
      console.warn('Failed to delete expense:', err);
    }
  };

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
        <ToggleGroup
          variant="segmented"
          size="sm"
          value={range}
          onChange={(val) => setRange(val as DateRangeKey)}
          options={rangeOptions.map((opt) => ({
            value: opt.key,
            label: opt.label,
          }))}
        />
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
          <Card
            variant="envelope"
            trayHeader={
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
            }
            innerClassName="p-5 space-y-4"
          >
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
          <Card
            variant="envelope"
            trayHeader={
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
            }
            innerClassName="p-5 space-y-4"
          >
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

          {/* Studio Expenses & Tax-Ready P&L Ledger */}
          <Card
            variant="envelope"
            trayHeader={
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Icon regular={Receipt24Regular} size="sm" tone="secondary" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-primary)]">
                    {t('expensesTitle')}
                  </h3>
                </div>

                <button
                  type="button"
                  onClick={() => setShowExpenseForm((v) => !v)}
                  className="btn-secondary h-8 px-3 rounded-xl text-xs font-bold flex items-center gap-1.5"
                >
                  <Icon filled={Add24Filled} size="xs" />
                  <span>{t('addExpenseBtn')}</span>
                </button>
              </div>
            }
            innerClassName="p-5 space-y-4"
          >
            {showExpenseForm && (
              <form onSubmit={handleAddExpense} className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-2 border-t border-[var(--border-subtle)]">
                <CustomSelect
                  value={expCategory}
                  onChange={setExpCategory}
                  options={[
                    { value: 'rent', label: t('catRent') },
                    { value: 'supplies', label: t('expCatSupplies') },
                    { value: 'payroll', label: t('catPayroll') },
                    { value: 'marketing', label: t('catMarketing') },
                  ]}
                />
                <FloatingInput
                  label={t('expenseAmountLabel')}
                  type="number"
                  required
                  value={expAmount}
                  onChange={(e) => setExpAmount(e.target.value)}
                />
                <FloatingInput
                  label={t('expenseDescriptionLabel')}
                  value={expDesc}
                  onChange={(e) => setExpDesc(e.target.value)}
                />
                <button type="submit" disabled={savingExpense} className="btn-primary h-11">
                  {savingExpense ? t('saving') : t('save')}
                </button>
              </form>
            )}

            {expensesList.length === 0 ? (
              <p className="text-xs text-[var(--text-secondary)] py-4 text-center">
                {t('noExpensesYet')}
              </p>
            ) : (
              <div className="divide-y divide-[var(--border-subtle)]">
                {expensesList.slice(0, 10).map((exp) => (
                  <div key={exp.id} className="py-2.5 flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Badge variant="subtle" size="xs" className="uppercase font-mono">
                        {exp.category}
                      </Badge>
                      <span className="font-semibold text-[var(--text-primary)] truncate">
                        {exp.description || exp.dateStr}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <span className="font-mono font-bold text-[var(--text-primary)]">
                        -${(exp.amountCents / 100).toFixed(2)}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleDeleteExpense(exp.id)}
                        className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-rose-500 transition-colors"
                      >
                        <Icon filled={Delete24Filled} size="xs" />
                      </button>
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
