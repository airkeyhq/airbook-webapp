'use client';

import * as React from 'react';
import { Info24Regular, Sparkle24Regular } from '@fluentui/react-icons';
import { Tooltip } from '@/components/primitives/Tooltip';
import { Icon } from '@/components/primitives/Icon';

export interface MetricTabItem {
  id: string;
  label: string;
  value: string | number;
  period: string;
  tooltip?: string;
  chartData?: MetricChartDataPoint[];
  series?: MetricsSeriesItem[];
}

export interface MetricChartDataPoint {
  date: string;
  [key: string]: string | number | undefined;
}

export interface MetricsSeriesItem {
  key: string;
  label: string;
  color: string;
}

export interface MetricsDashboardProps extends React.HTMLAttributes<HTMLDivElement> {
  metrics: MetricTabItem[];
  selectedMetricId: string;
  onSelectMetric: (id: string) => void;
  chartData: MetricChartDataPoint[];
  series?: MetricsSeriesItem[];
  footerHint?: React.ReactNode;
  onBarClick?: (dataPoint: MetricChartDataPoint) => void;
}

const DEFAULT_SERIES: MetricsSeriesItem[] = [
  { key: 'new', label: 'New', color: '#7DD3FC' },
  { key: 'reactivated', label: 'Reactivated', color: '#38BDF8' },
  { key: 'retained', label: 'Retained', color: '#2BB5FF' },
  { key: 'churned', label: 'Churned', color: '#64748B' },
];

/**
 * Ozone UI MetricsDashboard composite (ported from Mosaic).
 * Segmented KPI metric cards above a stacked SVG/CSS bar chart envelope.
 */
export const MetricsDashboard: React.FC<MetricsDashboardProps> = ({
  metrics,
  selectedMetricId,
  onSelectMetric,
  chartData,
  series = DEFAULT_SERIES,
  footerHint,
  onBarClick,
  className = '',
  ...props
}) => {
  const [hoveredIndex, setHoveredIndex] = React.useState<number | null>(null);

  const activeMetric = metrics.find((m) => m.id === selectedMetricId);
  const resolvedChartData = activeMetric?.chartData ?? chartData;
  const resolvedSeries = activeMetric?.series ?? series;

  const maxValue = React.useMemo(() => {
    let max = 1;
    resolvedChartData.forEach((d) => {
      const total = resolvedSeries.reduce((sum, s) => sum + (Number(d[s.key]) || 0), 0);
      if (total > max) max = total;
    });
    return Math.max(max, 1);
  }, [resolvedChartData, resolvedSeries]);

  const formatYTick = (val: number) => {
    if (val >= 1000000) return `${(val / 1000000).toFixed(1)}M`;
    if (val >= 1000) return `${(val / 1000).toFixed(0)}k`;
    if (val >= 10) return String(Math.round(val));
    return val % 1 === 0 ? String(val) : val.toFixed(1);
  };

  return (
    <div
      className={`w-full rounded-3xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)]/70 p-2 text-[var(--text-primary)] shadow-xs select-none ${className}`}
      {...props}
    >
      {/* 1. Metric Segmented Cards Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-1.5 p-1 mb-1.5">
        {metrics.map((m) => {
          const isSelected = selectedMetricId === m.id;
          return (
            <button
              key={m.id}
              type="button"
              onClick={() => onSelectMetric(m.id)}
              className={`group relative flex flex-col items-start rounded-2xl p-3.5 sm:p-4 text-left transition-all duration-150 cursor-pointer ${
                isSelected
                  ? 'border border-[var(--border-subtle)] bg-[var(--bg-primary)] shadow-xs'
                  : 'border border-transparent bg-transparent hover:bg-black/[0.03] dark:hover:bg-white/[0.04]'
              }`}
            >
              <div className="flex items-center gap-1.5 text-xs font-bold text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]">
                <span>{m.label}</span>
                {m.tooltip && (
                  <Tooltip content={m.tooltip}>
                    <span className="text-[var(--text-muted)] hover:text-[var(--text-primary)] cursor-help inline-flex">
                      <Icon regular={Info24Regular} size="sm" />
                    </span>
                  </Tooltip>
                )}
              </div>

              <div className="mt-1.5 font-mono text-xl sm:text-2xl font-extrabold tracking-tight text-[var(--text-primary)]">
                {m.value}
              </div>

              <div className="mt-1 text-[11px] text-[var(--text-muted)]">{m.period}</div>
            </button>
          );
        })}
      </div>

      {/* 2. Main Chart Container */}
      <div className="w-full rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-primary)] p-4 sm:p-6 shadow-xs">
        {/* Top Legend */}
        <div className="flex flex-wrap items-center gap-4 sm:gap-5 text-xs font-semibold text-[var(--text-secondary)] mb-6 sm:mb-8">
          {resolvedSeries.map((s) => (
            <div key={s.key} className="flex items-center gap-2">
              <span
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: s.color }}
              />
              <span>{s.label}</span>
            </div>
          ))}
        </div>

        {/* Chart Viewport */}
        <div className="relative w-full h-[240px] sm:h-[270px]">
          {/* Y-Axis dashed reference lines */}
          <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pb-7">
            {[maxValue, maxValue * 0.75, maxValue * 0.4, 0].map((tick, i) => (
              <div key={i} className="flex items-center gap-3 w-full">
                <span className="text-[10.5px] font-mono text-[var(--text-muted)] w-7 text-right">
                  {tick === 0 ? '0' : formatYTick(tick)}
                </span>
                <div
                  className={`flex-1 ${
                    tick === 0
                      ? 'h-[1.5px] bg-[var(--border-subtle)]'
                      : 'h-[1px] border-b border-dashed border-[var(--border-subtle)]'
                  }`}
                />
              </div>
            ))}
          </div>

          {/* Bar Columns Container */}
          <div className="absolute inset-0 pl-10 pb-7 flex items-end justify-between gap-1.5 sm:gap-2">
            {resolvedChartData.map((d, idx) => {
              const totalVal = resolvedSeries.reduce((sum, s) => sum + (Number(d[s.key]) || 0), 0);
              const heightPct = Math.min((totalVal / maxValue) * 100, 100);
              const isHovered = hoveredIndex === idx;

              return (
                <div
                  key={d.date}
                  onMouseEnter={() => setHoveredIndex(idx)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  onClick={() => onBarClick?.(d)}
                  className="group relative flex-1 h-full flex flex-col justify-end items-center cursor-pointer"
                >
                  {isHovered && totalVal > 0 && (
                    <div
                      style={{ bottom: `calc(${heightPct}% + 10px)` }}
                      className={`absolute z-30 flex flex-col rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-primary)] p-2.5 shadow-xl text-xs w-max min-w-[165px] pointer-events-none ${
                        idx === 0
                          ? 'left-0'
                          : idx === resolvedChartData.length - 1
                            ? 'right-0'
                            : 'left-1/2 -translate-x-1/2'
                      }`}
                    >
                      <div className="font-bold text-[var(--text-primary)] pb-1.5 border-b border-[var(--border-subtle)] flex items-center justify-between gap-4 whitespace-nowrap">
                        <span>{d.date}</span>
                        <span className="font-mono text-[var(--text-muted)] text-[11px]">
                          Total: {totalVal}
                        </span>
                      </div>
                      <div className="flex flex-col gap-1.5 pt-2 text-[11px]">
                        {resolvedSeries.map((s) => {
                          const val = d[s.key];
                          if (val === undefined || val === null) return null;
                          return (
                            <div
                              key={s.key}
                              className="flex justify-between items-center gap-4 whitespace-nowrap"
                            >
                              <span className="flex items-center gap-1.5 text-[var(--text-secondary)]">
                                <span
                                  className="h-2 w-2 rounded-full shrink-0"
                                  style={{ backgroundColor: s.color }}
                                />
                                <span>{s.label}</span>
                              </span>
                              <span className="font-mono font-bold text-[var(--text-primary)]">
                                {val}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  <div
                    className={`w-full max-w-[28px] rounded-t-md transition-all duration-300 overflow-hidden flex flex-col justify-end ${
                      isHovered ? 'brightness-110 shadow-[0_0_10px_rgba(43,181,255,0.45)]' : ''
                    }`}
                    style={{ height: `${heightPct}%` }}
                  >
                    {resolvedSeries.map((s) => {
                      const val = Number(d[s.key]) || 0;
                      if (!val) return null;
                      return (
                        <div
                          key={s.key}
                          className="w-full"
                          style={{
                            backgroundColor: s.color,
                            height: `${(val / totalVal) * 100}%`,
                          }}
                        />
                      );
                    })}
                  </div>

                  <span className="absolute -bottom-6 text-[10px] font-mono text-[var(--text-muted)] whitespace-nowrap">
                    {d.date}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 3. Footer Hint */}
      <div className="px-3.5 pt-2.5 pb-1 flex items-center gap-2 text-xs text-[var(--text-muted)]">
        {footerHint || (
          <>
            <Icon regular={Sparkle24Regular} size="sm" tone="accent" />
            <span>Click any bar above to inspect cohort details</span>
          </>
        )}
      </div>
    </div>
  );
};
