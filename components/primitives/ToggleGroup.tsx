'use client';

import React, { useId } from 'react';
import { motion } from 'framer-motion';

export interface ToggleGroupOption {
  value: string;
  label: React.ReactNode;
  icon?: React.ReactNode;
  disabled?: boolean;
}

export interface ToggleGroupProps {
  options: ToggleGroupOption[];
  /** String for single-select, string[] for multi-select */
  value: string | string[];
  onChange: (value: string | string[]) => void;
  type?: 'single' | 'multiple';
  variant?: 'segmented' | 'pills';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  className?: string;
}

/**
 * Ozone UI ToggleGroup / SegmentedControl primitive.
 * Smooth spring-animated active pill for switching views, filters, or multi-select options.
 */
export const ToggleGroup: React.FC<ToggleGroupProps> = ({
  options,
  value,
  onChange,
  type = 'single',
  variant = 'segmented',
  size = 'md',
  fullWidth = false,
  className = '',
}) => {
  const layoutGroupId = useId();
  const selectedValues = Array.isArray(value) ? value : [value];

  const handleToggle = (optValue: string, disabled?: boolean) => {
    if (disabled) return;
    if (type === 'single') {
      onChange(optValue);
      return;
    }
    const exists = selectedValues.includes(optValue);
    const next = exists
      ? selectedValues.filter((v) => v !== optValue)
      : [...selectedValues, optValue];
    onChange(next);
  };

  const sizeMap = {
    sm: 'h-7 px-2.5 text-[11px]',
    md: 'h-8 px-3.5 text-xs',
    lg: 'h-10 px-4 text-xs',
  }[size];

  if (variant === 'pills') {
    return (
      <div
        role="group"
        className={`inline-flex flex-wrap items-center gap-1.5 ${fullWidth ? 'w-full' : ''} ${className}`}
      >
        {options.map((opt) => {
          const isActive = selectedValues.includes(opt.value);
          return (
            <button
              key={opt.value}
              type="button"
              disabled={opt.disabled}
              aria-pressed={isActive}
              onClick={() => handleToggle(opt.value, opt.disabled)}
              className={`inline-flex items-center justify-center gap-1.5 rounded-full font-bold transition-all duration-150 select-none ${sizeMap} ${
                opt.disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer active:scale-95'
              } ${
                isActive
                  ? 'bg-[var(--color-accent-primary)] border border-[#1A8EFF] text-white shadow-[0_2px_8px_-1px_rgba(43,181,255,0.45),inset_0_1px_1px_rgba(255,255,255,0.35)]'
                  : 'bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[#2BB5FF]/40'
              }`}
            >
              {opt.icon && (
                <span className="w-3.5 h-3.5 flex items-center justify-center [&>svg]:w-full [&>svg]:h-full">
                  {opt.icon}
                </span>
              )}
              {opt.label && (
                <span className="inline-flex items-center justify-center leading-none">{opt.label}</span>
              )}
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div
      role="group"
      className={`inline-flex items-center gap-1 p-1 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] ${
        fullWidth ? 'w-full' : ''
      } ${className}`}
    >
      {options.map((opt) => {
        const isActive = selectedValues.includes(opt.value);
        return (
          <button
            key={opt.value}
            type="button"
            disabled={opt.disabled}
            aria-pressed={isActive}
            onClick={() => handleToggle(opt.value, opt.disabled)}
            className={`relative inline-flex items-center justify-center gap-1.5 rounded-xl font-bold transition-colors duration-150 select-none ${
              fullWidth ? 'flex-1' : ''
            } ${sizeMap} ${
              opt.disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'
            } ${
              isActive
                ? 'text-[var(--text-primary)]'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            {isActive && type === 'single' && (
              <motion.span
                layoutId={`toggle-pill-${layoutGroupId}`}
                transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                className="absolute inset-0 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] shadow-xs"
              />
            )}
            {isActive && type === 'multiple' && (
              <span className="absolute inset-0 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] shadow-xs" />
            )}
            <span className="relative z-10 inline-flex items-center justify-center gap-1.5 leading-none">
              {opt.icon && (
                <span className="w-3.5 h-3.5 flex items-center justify-center [&>svg]:w-full [&>svg]:h-full">
                  {opt.icon}
                </span>
              )}
              {opt.label && (
                <span className="inline-flex items-center justify-center leading-none">{opt.label}</span>
              )}
            </span>
          </button>
        );
      })}
    </div>
  );
};
