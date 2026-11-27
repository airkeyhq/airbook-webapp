'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Checkmark24Filled } from '@fluentui/react-icons';
import { Icon } from '@/components/primitives/Icon';
import { SparkleBurst } from '@/components/primitives/SparkleBurst';

export interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: React.ReactNode;
  description?: React.ReactNode;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'square-rounded' | 'rounded' | 'circle';
  accent?: 'primary' | 'emerald' | 'dark';
  /**
   * Releases a radial spark burst micro-interaction when toggled.
   * @default false
   */
  spark?: boolean;
  className?: string;
  id?: string;
  name?: string;
}

export const Checkbox: React.FC<CheckboxProps> = ({
  checked,
  onChange,
  label,
  description,
  disabled = false,
  size = 'md',
  variant = 'square-rounded',
  accent = 'primary',
  spark = false,
  className = '',
  id,
  name,
}) => {
  const [burstKey, setBurstKey] = React.useState(0);
  // Geometric variant corner radiuses
  const radiusClasses = {
    'square-rounded': {
      sm: 'rounded-[5px]',
      md: 'rounded-[6.5px]',
      lg: 'rounded-[8px]',
    },
    rounded: {
      sm: 'rounded-md',
      md: 'rounded-lg',
      lg: 'rounded-xl',
    },
    circle: {
      sm: 'rounded-full',
      md: 'rounded-full',
      lg: 'rounded-full',
    },
  }[variant][size];

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  }[size];

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-3.5 h-3.5',
    lg: 'w-4 h-4',
  }[size];

  const accentStyles = {
    primary: {
      active:
        'bg-[var(--color-accent-primary)] border-[1.5px] border-[#1A8EFF] text-white shadow-[0_4px_12px_-2px_rgba(43,181,255,0.5),inset_0_1px_1px_rgba(255,255,255,0.4)] hover:bg-[var(--color-accent-primary-hover)] hover:shadow-[0_6px_16px_-2px_rgba(43,181,255,0.7),inset_0_1px_1px_rgba(255,255,255,0.4)]',
      focusRing: 'focus-visible:ring-[#2BB5FF]/40',
      hoverBorder: 'hover:border-[#2BB5FF]/50',
    },
    emerald: {
      active: 'bg-emerald-500 border-emerald-600 text-white shadow-[0_2px_8px_-1px_rgba(16,185,129,0.45)] hover:bg-emerald-600',
      focusRing: 'focus-visible:ring-emerald-500/40',
      hoverBorder: 'hover:border-emerald-500/50',
    },
    dark: {
      active: 'bg-slate-900 dark:bg-white border-slate-950 dark:border-white text-white dark:text-black shadow-xs hover:opacity-90',
      focusRing: 'focus-visible:ring-slate-500/40',
      hoverBorder: 'hover:border-slate-500/50',
    },
  }[accent];

  const handleToggle = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (!disabled) {
      if (spark) {
        setBurstKey((prev) => prev + 1);
      }
      onChange(!checked);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      if (spark) {
        setBurstKey((prev) => prev + 1);
      }
      onChange(!checked);
    }
  };

  const box = (
    <div
      role="checkbox"
      aria-checked={checked}
      aria-disabled={disabled}
      tabIndex={disabled ? -1 : 0}
      onKeyDown={handleKeyDown}
      onClick={handleToggle}
      className={`${sizeClasses} ${radiusClasses} flex items-center justify-center transition-all cursor-pointer select-none flex-shrink-0 relative outline-none focus-visible:ring-2 ${accentStyles.focusRing} ${
        disabled
          ? 'opacity-40 cursor-not-allowed bg-black/5 dark:bg-white/5 border border-[var(--border-subtle)]'
          : checked
          ? accentStyles.active
          : `bg-[var(--bg-primary)] border border-[var(--border-subtle)] ${accentStyles.hoverBorder} text-transparent`
      }`}
    >
      <input
        type="checkbox"
        id={id}
        name={name}
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange(e.target.checked)}
        className="sr-only"
        tabIndex={-1}
        aria-hidden="true"
      />
      <motion.div
        initial={false}
        animate={{
          scale: checked ? 1 : 0,
          opacity: checked ? 1 : 0,
        }}
        transition={{ type: 'spring', damping: 20, stiffness: 400 }}
        className="flex items-center justify-center"
      >
        <Icon filled={Checkmark24Filled} className={`${iconSizes} text-white`} />
      </motion.div>
      {spark && (
        <SparkleBurst
          burstKey={burstKey}
          shape={variant === 'circle' ? 'circle' : 'square-rounded'}
          radiusClass={radiusClasses}
          particle="mixed"
          tone={accent === 'emerald' ? 'emerald' : 'electric'}
        />
      )}
    </div>
  );

  if (!label && !description) {
    return <div className={className}>{box}</div>;
  }

  return (
    <div
      onClick={handleToggle}
      className={`flex items-start gap-2.5 ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer group'} ${className}`}
    >
      {box}
      <div className="min-w-0 select-none">
        {label && (
          <span className="text-xs font-semibold text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-colors block leading-tight">
            {label}
          </span>
        )}
        {description && (
          <span className="text-[11px] text-[var(--text-secondary)] block mt-0.5 leading-snug">
            {description}
          </span>
        )}
      </div>
    </div>
  );
};
