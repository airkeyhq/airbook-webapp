'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Checkmark24Filled } from '@fluentui/react-icons';

export interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: React.ReactNode;
  description?: React.ReactNode;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'square-rounded' | 'rounded' | 'circle';
  accent?: 'primary' | 'emerald' | 'dark';
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
  className = '',
  id,
  name,
}) => {
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
      active: 'bg-[#2BB5FF] border-[#1A8EFF] text-white shadow-[0_2px_8px_-1px_rgba(43,181,255,0.45)] hover:bg-[#1A8EFF]',
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

  const handleToggle = () => {
    if (!disabled) {
      onChange(!checked);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
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
        <Checkmark24Filled className={`${iconSizes} text-white`} />
      </motion.div>
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
