'use client';

import React from 'react';

export type PulseTone = 'live' | 'success' | 'warning' | 'danger' | 'neutral';

export interface PulseDotProps {
  tone?: PulseTone;
  label?: string;
  ping?: boolean;
  className?: string;
}

const TONE_MAP: Record<PulseTone, string> = {
  live: 'bg-[#2BB5FF]',
  success: 'bg-emerald-500',
  warning: 'bg-amber-500',
  danger: 'bg-rose-500',
  neutral: 'bg-slate-400',
};

/**
 * Ozone UI PulseDot live status indicator primitive.
 */
export const PulseDot: React.FC<PulseDotProps> = ({
  tone = 'success',
  label,
  ping = true,
  className = '',
}) => {
  const color = TONE_MAP[tone];

  return (
    <span className={`inline-flex items-center gap-2 select-none ${className}`}>
      <span className="relative flex h-2.5 w-2.5">
        {ping && tone !== 'neutral' && (
          <span
            className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-60 ${color}`}
          />
        )}
        <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${color}`} />
      </span>
      {label && (
        <span className="text-xs font-semibold text-[var(--text-secondary)]">{label}</span>
      )}
    </span>
  );
};
