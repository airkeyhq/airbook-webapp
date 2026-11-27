'use client';

import React from 'react';
import { RollingNumber } from './RollingNumber';

export type IndicatorPosition = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
export type IndicatorColor = 'primary' | 'danger' | 'success' | 'warning' | 'neutral';
export type InlineIndicatorVariant = 'soft-blue' | 'outlined' | 'pill-solid' | 'pill-muted';

export interface IndicatorProps {
  children: React.ReactNode;
  /** Numeric count or short label (omit for a compact dot indicator) */
  label?: React.ReactNode;
  /** Show/hide the indicator @default true */
  show?: boolean;
  position?: IndicatorPosition;
  color?: IndicatorColor;
  /** Animate a live pulse ring (e.g. online status or incoming message) */
  ping?: boolean;
  /** Animate numeric label changes with RollingNumber @default false */
  rolling?: boolean;
  className?: string;
}

const POSITION_CLASSES: Record<IndicatorPosition, string> = {
  'top-right': '-top-1 -right-1',
  'top-left': '-top-1 -left-1',
  'bottom-right': '-bottom-1 -right-1',
  'bottom-left': '-bottom-1 -left-1',
};

const COLOR_CLASSES: Record<IndicatorColor, string> = {
  primary: 'bg-[#2BB5FF] text-white',
  danger: 'bg-[#FF3B30] text-white',
  success: 'bg-emerald-500 text-white',
  warning: 'bg-amber-500 text-white',
  neutral: 'bg-slate-500 text-white',
};

/**
 * Ozone UI Indicator primitive.
 * Use for transient amounts (unread counts, item totals) and live status signals
 * (online dot, new message pulse) — not for category/status labels (use Badge).
 */
export const Indicator: React.FC<IndicatorProps> = ({
  children,
  label,
  show = true,
  position = 'top-right',
  color = 'danger',
  ping = false,
  rolling = false,
  className = '',
}) => {
  const hasLabel = label !== undefined && label !== null && label !== '';
  const isRollable = rolling && (typeof label === 'number' || typeof label === 'string');

  return (
    <div className={`relative inline-flex flex-shrink-0 ${className}`}>
      {children}
      {show && (
        <span
          className={`pointer-events-none absolute z-10 flex items-center justify-center rounded-full ring-2 ring-[var(--bg-primary)] ${
            POSITION_CLASSES[position]
          } ${COLOR_CLASSES[color]} ${
            hasLabel
              ? 'min-w-[18px] h-[18px] px-1 text-[10px] font-mono font-extrabold leading-none shadow-xs'
              : 'w-2.5 h-2.5'
          }`}
        >
          {ping && (
            <span
              className={`animate-ping absolute inset-0 rounded-full opacity-60 ${COLOR_CLASSES[color]}`}
            />
          )}
          {hasLabel && (
            <span className="relative">
              {isRollable ? (
                <RollingNumber value={label} durationMs={450} delayMs={0} staggerMs={30} />
              ) : (
                label
              )}
            </span>
          )}
        </span>
      )}
    </div>
  );
};

export interface InlineIndicatorProps {
  value: number | string;
  variant?: InlineIndicatorVariant;
  /** Animate count changes with RollingNumber @default false */
  rolling?: boolean;
  className?: string;
}

const INLINE_VARIANT_CLASSES: Record<InlineIndicatorVariant, string> = {
  'soft-blue':
    'bg-blue-500/15 text-blue-600 dark:text-blue-400 px-1.5 py-0.5 font-black',
  outlined:
    'bg-[var(--bg-primary)] text-[var(--text-secondary)] border border-[var(--border-subtle)] px-2 py-0.5 font-bold',
  'pill-solid':
    'bg-[#2BB5FF] text-white px-1.5 py-0.5 font-bold shadow-[0_1px_4px_rgba(43,181,255,0.35)]',
  'pill-muted':
    'bg-black/10 dark:bg-white/10 text-[var(--text-muted)] px-1.5 py-0.5 font-bold',
};

/**
 * Inline count indicator for transient amounts (notifications, tab/tree/column item counts).
 * Supports RollingNumber animation via `rolling`.
 */
export const InlineIndicator: React.FC<InlineIndicatorProps> = ({
  value,
  variant = 'pill-muted',
  rolling = false,
  className = '',
}) => {
  return (
    <span
      className={`inline-flex items-center justify-center min-w-[20px] rounded-full text-[10px] leading-none tabular-nums select-none flex-shrink-0 ${INLINE_VARIANT_CLASSES[variant]} ${className}`}
    >
      {rolling ? (
        <RollingNumber value={value} durationMs={450} delayMs={0} staggerMs={30} />
      ) : (
        value
      )}
    </span>
  );
};
