'use client';

import React from 'react';

export type PillButtonVariant = 'soft' | 'primary' | 'ghost' | 'outline' | 'danger';
export type PillButtonSize = 'sm' | 'md' | 'lg';

export interface PillButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Surface and emphasis style. */
  variant?: PillButtonVariant;
  /** Highlighted / pressed state (e.g. open dropdown or active filter). */
  active?: boolean;
  /** Renders a square circular button instead of a horizontal pill. */
  iconOnly?: boolean;
  /** Size preset: 'sm' (h-8), 'md' (h-9, default for header ribbons), or 'lg' (h-10). */
  size?: PillButtonSize;
}

const VARIANT_CLASSES: Record<PillButtonVariant, string> = {
  soft: 'bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 text-[var(--text-secondary)] hover:text-[var(--text-primary)]',
  primary: 'btn-primary text-white shadow-[0_4px_12px_-2px_rgba(43,181,255,0.5)]',
  ghost: 'bg-transparent hover:bg-black/5 dark:hover:bg-white/10 text-[var(--text-secondary)] hover:text-[var(--text-primary)]',
  outline: 'bg-transparent border border-black/10 dark:border-white/15 hover:bg-black/5 dark:hover:bg-white/10 text-[var(--text-secondary)] hover:text-[var(--text-primary)]',
  danger: 'bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400',
};

const ACTIVE_CLASSES: Record<PillButtonVariant, string> = {
  soft: 'bg-black/10 dark:bg-white/20 text-[var(--text-primary)]',
  primary: 'bg-sky-600 ring-2 ring-sky-500/30',
  ghost: 'bg-black/10 dark:bg-white/15 text-[var(--text-primary)]',
  outline: 'bg-black/5 dark:bg-white/10 border-black/20 dark:border-white/25 text-[var(--text-primary)]',
  danger: 'bg-red-500/20 ring-2 ring-red-500/25',
};

const SIZE_CLASSES: Record<PillButtonSize, { pill: string; circle: string }> = {
  sm: {
    pill: 'h-8 px-2.5 gap-1 text-xs',
    circle: 'h-8 w-8',
  },
  md: {
    pill: 'h-9 px-2.5 sm:px-3 gap-1.5 text-xs',
    circle: 'h-9 w-9',
  },
  lg: {
    pill: 'h-10 px-3 sm:px-3.5 gap-2 text-sm',
    circle: 'h-10 w-10',
  },
};

/**
 * Ozone touch-first soft-surface pill / circular button.
 * Used in header ribbons, toolbars, and floating action bars.
 */
export const PillButton = React.forwardRef<HTMLButtonElement, PillButtonProps>(
  (
    {
      variant = 'soft',
      active = false,
      iconOnly = false,
      size = 'md',
      className = '',
      type = 'button',
      children,
      ...props
    },
    ref
  ) => {
    const sizeCls = iconOnly ? SIZE_CLASSES[size].circle : SIZE_CLASSES[size].pill;

    return (
      <button
        ref={ref}
        type={type}
        aria-pressed={active || undefined}
        className={[
          'inline-flex items-center justify-center !rounded-full',
          'active:scale-95 transition-all font-bold',
          'cursor-pointer flex-shrink-0 select-none',
          'disabled:opacity-50 disabled:pointer-events-none',
          VARIANT_CLASSES[variant],
          active ? ACTIVE_CLASSES[variant] : '',
          sizeCls,
          className,
        ]
          .filter(Boolean)
          .join(' ')}
        {...props}
      >
        {children}
      </button>
    );
  }
);

PillButton.displayName = 'PillButton';

export interface PillGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Size preset matching PillButton. */
  size?: PillButtonSize;
}

/**
 * Ozone soft-surface container for segmented or grouped pills (e.g. Day | Week, ← | →).
 * Place <PillButton variant="ghost" /> items inside; use `active` with `bg-white dark:bg-slate-800 shadow-sm` for segmented tabs.
 */
export const PillGroup = React.forwardRef<HTMLDivElement, PillGroupProps>(
  ({ className = '', children, ...props }, ref) => (
    <div
      ref={ref}
      role="group"
      className={[
        'inline-flex items-center gap-0.5 p-1 rounded-full',
        'bg-black/5 dark:bg-white/10',
        'flex-shrink-0',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...props}
    >
      {children}
    </div>
  )
);

PillGroup.displayName = 'PillGroup';
