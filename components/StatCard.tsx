'use client';

import React from 'react';
import { RollingNumber } from '@/components/primitives/RollingNumber';
import { Badge } from '@/components/primitives/Badge';

export interface StatCardProps {
  title: string;
  value: string | number;
  prefix?: string;
  suffix?: string;
  subtitle?: string;
  trend?: {
    value: string;
    direction: 'up' | 'down' | 'neutral';
  };
  sparkline?: number[];
  icon?: React.ReactNode;
  className?: string;
}

/**
 * Ozone UI StatCard composite.
 * Pairs RollingNumber KPI readout with trend badge and optional SVG sparkline.
 */
export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  prefix = '',
  suffix = '',
  subtitle,
  trend,
  sparkline,
  icon,
  className = '',
}) => {
  const renderSparkline = () => {
    if (!sparkline || sparkline.length < 2) return null;
    const min = Math.min(...sparkline);
    const max = Math.max(...sparkline);
    const span = max - min || 1;
    const w = 120;
    const h = 36;
    const pts = sparkline
      .map((v, i) => {
        const x = (i / (sparkline.length - 1)) * w;
        const y = h - ((v - min) / span) * (h - 6) - 3;
        return `${x.toFixed(1)},${y.toFixed(1)}`;
      })
      .join(' ');

    return (
      <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="overflow-visible flex-shrink-0">
        <polyline
          fill="none"
          stroke="#2BB5FF"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={pts}
        />
      </svg>
    );
  };

  return (
    <div
      className={`p-5 rounded-3xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] shadow-xs flex flex-col justify-between gap-4 ${className}`}
    >
      <div className="flex items-start justify-between gap-2">
        <span className="text-xs font-bold text-[var(--text-secondary)]">{title}</span>
        {icon && (
          <span className="w-8 h-8 rounded-xl bg-[#2BB5FF]/10 text-[#2BB5FF] flex items-center justify-center flex-shrink-0">
            {icon}
          </span>
        )}
      </div>

      <div className="flex items-end justify-between gap-3">
        <div>
          <div className="text-3xl font-black text-[var(--text-primary)] tracking-tight">
            <RollingNumber value={value} prefix={prefix} suffix={suffix} />
          </div>
          <div className="flex items-center gap-2 mt-1.5">
            {trend && (
              <Badge
                size="xs"
                variant={
                  trend.direction === 'up'
                    ? 'success'
                    : trend.direction === 'down'
                      ? 'danger'
                      : 'subtle'
                }
              >
                {trend.value}
              </Badge>
            )}
            {subtitle && (
              <span className="text-[11px] text-[var(--text-muted)]">{subtitle}</span>
            )}
          </div>
        </div>
        {renderSparkline()}
      </div>
    </div>
  );
};
