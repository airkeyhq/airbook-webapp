'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { SparkleBurst } from './SparkleBurst';

export interface RadioOption {
  value: string;
  label: React.ReactNode;
  description?: React.ReactNode;
  badge?: React.ReactNode;
  meta?: React.ReactNode;
  disabled?: boolean;
}

export interface RadioGroupProps {
  options: RadioOption[];
  value: string;
  onChange: (value: string) => void;
  variant?: 'list' | 'cards';
  orientation?: 'vertical' | 'horizontal';
  /** Trigger SparkleBurst micro-interaction when selecting an option */
  spark?: boolean;
  label?: string;
  className?: string;
}

/**
 * Ozone UI RadioGroup primitive.
 * Supports classic tactile radio lists and card-style selection with Tier 1 active styling.
 */
export const RadioGroup: React.FC<RadioGroupProps> = ({
  options,
  value,
  onChange,
  variant = 'list',
  orientation = 'vertical',
  spark = false,
  label,
  className = '',
}) => {
  const [burstMap, setBurstMap] = useState<Record<string, number>>({});

  const handleSelect = (opt: RadioOption) => {
    if (opt.disabled) return;
    if (spark && opt.value !== value) {
      setBurstMap((prev) => ({
        ...prev,
        [opt.value]: (prev[opt.value] || 0) + 1,
      }));
    }
    onChange(opt.value);
  };

  return (
    <div role="radiogroup" aria-label={label} className={`space-y-2.5 ${className}`}>
      {label && (
        <div className="text-xs font-bold text-[var(--text-primary)]">{label}</div>
      )}

      <div
        className={
          orientation === 'horizontal'
            ? 'grid grid-cols-1 sm:grid-cols-3 gap-2.5'
            : variant === 'cards'
              ? 'flex flex-col gap-2.5'
              : 'flex flex-col gap-3'
        }
      >
        {options.map((opt) => {
          const isSelected = value === opt.value;
          const isCard = variant === 'cards';

          const indicator = (
            <span
              className={`relative flex items-center justify-center w-5 h-5 rounded-full flex-shrink-0 transition-all duration-150 ${
                isSelected
                  ? 'bg-[var(--color-accent-primary)] border-[1.5px] border-[#1A8EFF] shadow-[0_4px_12px_-2px_rgba(43,181,255,0.5),inset_0_1px_1px_rgba(255,255,255,0.4)]'
                  : 'bg-[var(--bg-primary)] border border-[var(--border-subtle)] group-hover:border-[#2BB5FF]/50'
              }`}
            >
              <motion.span
                initial={false}
                animate={{ scale: isSelected ? 1 : 0, opacity: isSelected ? 1 : 0 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                className="w-2 h-2 rounded-full bg-white shadow-xs"
              />
              {spark && (
                <SparkleBurst
                  burstKey={burstMap[opt.value] || 0}
                  shape="circle"
                  particle="mixed"
                  tone="electric"
                />
              )}
            </span>
          );

          return (
            <button
              key={opt.value}
              type="button"
              role="radio"
              aria-checked={isSelected}
              disabled={opt.disabled}
              onClick={() => handleSelect(opt)}
              className={`group text-left transition-all duration-150 select-none ${
                opt.disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'
              } ${
                isCard
                  ? `p-3.5 rounded-2xl border flex items-start justify-between gap-3 ${
                      isSelected
                        ? 'bg-[#2BB5FF]/5 border-[#2BB5FF] ring-2 ring-[#2BB5FF]/15 shadow-xs'
                        : 'bg-[var(--bg-primary)] border-[var(--border-subtle)] hover:border-[#2BB5FF]/40'
                    }`
                  : 'flex items-start gap-2.5'
              }`}
            >
              {isCard ? (
                <>
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="pt-0.5">{indicator}</div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-[var(--text-primary)]">
                          {opt.label}
                        </span>
                        {opt.badge}
                      </div>
                      {opt.description && (
                        <p className="text-[11px] text-[var(--text-secondary)] mt-0.5 leading-snug">
                          {opt.description}
                        </p>
                      )}
                    </div>
                  </div>
                  {opt.meta && (
                    <span className="text-xs font-mono font-bold text-[var(--text-primary)] flex-shrink-0">
                      {opt.meta}
                    </span>
                  )}
                </>
              ) : (
                <>
                  <div className="pt-0.5">{indicator}</div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-[var(--text-primary)] leading-tight">
                        {opt.label}
                      </span>
                      {opt.badge}
                    </div>
                    {opt.description && (
                      <p className="text-[11px] text-[var(--text-secondary)] mt-0.5 leading-snug">
                        {opt.description}
                      </p>
                    )}
                  </div>
                </>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
