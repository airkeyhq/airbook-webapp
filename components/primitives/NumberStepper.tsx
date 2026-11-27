'use client';

import React from 'react';
import { RollingNumber } from './RollingNumber';

export interface NumberStepperProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  prefix?: string;
  suffix?: string;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  className?: string;
}

/**
 * Ozone UI NumberStepper primitive.
 * Tactile `-` / `+` amount control with animated RollingNumber readout.
 */
export const NumberStepper: React.FC<NumberStepperProps> = ({
  value,
  onChange,
  min = 0,
  max = 99999,
  step = 1,
  prefix = '',
  suffix = '',
  label,
  size = 'md',
  disabled = false,
  className = '',
}) => {
  const canDecrement = !disabled && value - step >= min;
  const canIncrement = !disabled && value + step <= max;

  const sizeMap = {
    sm: { wrapper: 'h-9 p-1 rounded-xl', btn: 'w-7 h-7 rounded-lg text-sm', text: 'text-xs min-w-[3.25rem]' },
    md: { wrapper: 'h-11 p-1 rounded-2xl', btn: 'w-9 h-9 rounded-xl text-base', text: 'text-sm min-w-[4rem]' },
    lg: { wrapper: 'h-13 p-1.5 rounded-2xl', btn: 'w-10 h-10 rounded-xl text-lg', text: 'text-base min-w-[4.5rem]' },
  }[size];

  return (
    <div className={`inline-flex flex-col gap-1.5 ${className}`}>
      {label && (
        <span className="text-xs font-bold text-[var(--text-primary)]">{label}</span>
      )}
      <div
        className={`inline-flex items-center justify-between gap-1 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] shadow-xs select-none ${sizeMap.wrapper}`}
      >
        <button
          type="button"
          aria-label="Decrease"
          disabled={!canDecrement}
          onClick={() => canDecrement && onChange(value - step)}
          className={`flex items-center justify-center font-bold transition-all active:scale-95 ${sizeMap.btn} ${
            canDecrement
              ? 'bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-[var(--text-primary)] hover:border-[#2BB5FF]/50 cursor-pointer shadow-xs'
              : 'opacity-35 cursor-not-allowed text-[var(--text-muted)]'
          }`}
        >
          −
        </button>

        <div className={`px-2 text-center font-mono font-extrabold text-[var(--text-primary)] ${sizeMap.text}`}>
          <RollingNumber
            value={value.toLocaleString()}
            prefix={prefix}
            suffix={suffix}
            durationMs={420}
            delayMs={0}
            staggerMs={25}
          />
        </div>

        <button
          type="button"
          aria-label="Increase"
          disabled={!canIncrement}
          onClick={() => canIncrement && onChange(value + step)}
          className={`flex items-center justify-center font-bold transition-all active:scale-95 ${sizeMap.btn} ${
            canIncrement
              ? 'bg-[var(--color-accent-primary)] border border-[#1A8EFF] text-white shadow-[0_2px_8px_-1px_rgba(43,181,255,0.45),inset_0_1px_1px_rgba(255,255,255,0.4)] hover:bg-[var(--color-accent-primary-hover)] cursor-pointer'
              : 'opacity-35 cursor-not-allowed bg-[var(--bg-primary)] text-[var(--text-muted)]'
          }`}
        >
          +
        </button>
      </div>
    </div>
  );
};
