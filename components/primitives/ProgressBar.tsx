'use client';

import React from 'react';

export interface ProgressBarProps {
  value: number; // 0 to 100
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'emerald' | 'amber';
  showLabel?: boolean;
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  size = 'md',
  color = 'primary',
  showLabel = false,
  className = '',
}) => {
  const clampedValue = Math.min(100, Math.max(0, value));

  const sizeClasses = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-3.5',
  }[size];

  const colorClasses = {
    primary: 'bg-[#2BB5FF] shadow-[0_2px_8px_-1px_rgba(43,181,255,0.45)]',
    emerald: 'bg-emerald-500 shadow-[0_2px_8px_-1px_rgba(16,185,129,0.45)]',
    amber: 'bg-amber-500 shadow-[0_2px_8px_-1px_rgba(245,158,11,0.45)]',
  }[color];

  return (
    <div className={`w-full space-y-1.5 ${className}`}>
      {showLabel && (
        <div className="flex items-center justify-between text-xs font-semibold">
          <span className="text-[var(--text-secondary)]">Progress</span>
          <span className="text-[var(--text-primary)] font-mono">{clampedValue}%</span>
        </div>
      )}
      <div className={`w-full bg-black/5 dark:bg-white/10 rounded-full overflow-hidden ${sizeClasses}`}>
        <div
          style={{ width: `${clampedValue}%` }}
          className={`h-full rounded-full transition-all duration-300 ease-out ${colorClasses}`}
        />
      </div>
    </div>
  );
};
