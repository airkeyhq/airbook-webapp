'use client';

import React from 'react';
import { RollingNumber } from './RollingNumber';

export interface ProgressRingProps {
  /** Percentage from 0 to 100 */
  value: number;
  size?: number;
  strokeWidth?: number;
  color?: 'primary' | 'emerald' | 'amber' | 'rose';
  label?: string;
  showValue?: boolean;
  className?: string;
}

const COLOR_MAP: Record<NonNullable<ProgressRingProps['color']>, string> = {
  primary: '#2BB5FF',
  emerald: '#10B981',
  amber: '#F59E0B',
  rose: '#F43F5E',
};

/**
 * Ozone UI ProgressRing gauge primitive.
 */
export const ProgressRing: React.FC<ProgressRingProps> = ({
  value,
  size = 76,
  strokeWidth = 7,
  color = 'primary',
  label,
  showValue = true,
  className = '',
}) => {
  const clamped = Math.max(0, Math.min(100, value));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - clamped / 100);

  return (
    <div className={`inline-flex flex-col items-center gap-1.5 ${className}`}>
      <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            className="text-[var(--bg-secondary)]"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={COLOR_MAP[color]}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="transition-[stroke-dashoffset] duration-500 ease-out"
          />
        </svg>
        {showValue && (
          <span className="absolute text-xs font-mono font-black text-[var(--text-primary)]">
            <RollingNumber value={`${Math.round(clamped)}%`} durationMs={500} delayMs={0} />
          </span>
        )}
      </div>
      {label && (
        <span className="text-[11px] font-semibold text-[var(--text-secondary)]">{label}</span>
      )}
    </div>
  );
};
