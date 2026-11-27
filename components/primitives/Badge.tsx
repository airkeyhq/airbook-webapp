'use client';

import React from 'react';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'subtle' | 'outline' | 'dashed-blue' | 'dashed-purple' | 'dashed-emerald';
  size?: 'xs' | 'sm' | 'md';
  dot?: boolean;
  className?: string;
}

/**
 * Ozone UI Badge primitive.
 * Use for categories and status categories (e.g. "Confirmed", "Pending Deposit", "VIP Formula").
 * Not for transient counts or live status dots (use Indicator / InlineIndicator).
 */
export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'sm',
  dot = false,
  className = '',
}) => {
  const sizeClasses = {
    xs: 'text-[10px] px-2 py-0.5 h-5 font-semibold',
    sm: 'text-xs px-2.5 py-1 h-6 font-semibold',
    md: 'text-xs px-3 py-1.5 h-7 font-bold',
  }[size];

  const variantStyles = {
    default: 'bg-[#2BB5FF]/10 text-[#2BB5FF] border border-[#2BB5FF]/20',
    success: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20',
    warning: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20',
    danger: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20',
    subtle: 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] border border-[var(--border-subtle)]',
    outline: 'bg-transparent text-[var(--text-secondary)] border border-[var(--border-subtle)]',
    'dashed-blue': 'bg-[#2BB5FF]/5 text-[#2BB5FF] border border-dashed border-[#2BB5FF]/40',
    'dashed-purple': 'bg-purple-500/5 text-purple-600 dark:text-purple-400 border border-dashed border-purple-500/40',
    'dashed-emerald': 'bg-emerald-500/5 text-emerald-600 dark:text-emerald-400 border border-dashed border-emerald-500/40',
  }[variant];

  const dotColors = {
    default: 'bg-[#2BB5FF]',
    success: 'bg-emerald-500',
    warning: 'bg-amber-500',
    danger: 'bg-rose-500',
    subtle: 'bg-slate-400',
    outline: 'bg-slate-400',
    'dashed-blue': 'bg-[#2BB5FF]',
    'dashed-purple': 'bg-purple-500',
    'dashed-emerald': 'bg-emerald-500',
  }[variant];

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full select-none whitespace-nowrap flex-shrink-0 ${sizeClasses} ${variantStyles} ${className}`}
    >
      {dot && <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${dotColors}`} />}
      <span>{children}</span>
    </span>
  );
};
