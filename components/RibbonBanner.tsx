'use client';

import React from 'react';
import { Dismiss24Filled } from '@fluentui/react-icons';
import { Icon } from '@/components/primitives/Icon';

export type RibbonVariant = 'info' | 'warning' | 'success' | 'danger';

export interface RibbonBannerProps {
  variant?: RibbonVariant;
  badge?: React.ReactNode;
  children: React.ReactNode;
  action?: React.ReactNode;
  onDismiss?: () => void;
  className?: string;
}

const RIBBON_GRADIENTS: Record<RibbonVariant, { bg: string; border: string }> = {
  info: {
    bg: 'repeating-linear-gradient(135deg, rgba(43,181,255,0.08) 0px, rgba(43,181,255,0.08) 10px, rgba(43,181,255,0.02) 10px, rgba(43,181,255,0.02) 20px)',
    border: 'border-[#2BB5FF]/25',
  },
  warning: {
    bg: 'repeating-linear-gradient(135deg, rgba(245,158,11,0.09) 0px, rgba(245,158,11,0.09) 10px, rgba(245,158,11,0.02) 10px, rgba(245,158,11,0.02) 20px)',
    border: 'border-amber-500/25',
  },
  success: {
    bg: 'repeating-linear-gradient(135deg, rgba(16,185,129,0.09) 0px, rgba(16,185,129,0.09) 10px, rgba(16,185,129,0.02) 10px, rgba(16,185,129,0.02) 20px)',
    border: 'border-emerald-500/25',
  },
  danger: {
    bg: 'repeating-linear-gradient(135deg, rgba(244,63,94,0.09) 0px, rgba(244,63,94,0.09) 10px, rgba(244,63,94,0.02) 10px, rgba(244,63,94,0.02) 20px)',
    border: 'border-rose-500/25',
  },
};

/**
 * Ozone UI RibbonBanner composite.
 */
export const RibbonBanner: React.FC<RibbonBannerProps> = ({
  variant = 'info',
  badge,
  children,
  action,
  onDismiss,
  className = '',
}) => {
  const style = RIBBON_GRADIENTS[variant];

  return (
    <div
      style={{ backgroundImage: style.bg }}
      className={`w-full rounded-2xl border ${style.border} px-4 py-2.5 flex items-center justify-between gap-3 ${className}`}
    >
      <div className="flex items-center justify-center gap-2.5 flex-wrap flex-1 text-xs font-medium text-[var(--text-primary)]">
        {badge}
        <span>{children}</span>
        {action && (
          <span className="font-bold text-[#2BB5FF] hover:underline cursor-pointer">
            {action}
          </span>
        )}
      </div>

      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Dismiss banner"
          className="p-1 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors cursor-pointer flex-shrink-0"
        >
          <Icon filled={Dismiss24Filled} size="sm" />
        </button>
      )}
    </div>
  );
};
