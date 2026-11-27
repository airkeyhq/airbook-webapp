'use client';

import React from 'react';
import {
  CheckmarkCircle24Filled,
  Warning24Filled,
  ErrorCircle24Filled,
  Info24Filled,
  Dismiss24Filled,
} from '@fluentui/react-icons';
import { Icon } from './Icon';

export type AlertVariant = 'info' | 'success' | 'warning' | 'danger';

export interface AlertProps {
  variant?: AlertVariant;
  title?: React.ReactNode;
  children: React.ReactNode;
  action?: React.ReactNode;
  onDismiss?: () => void;
  className?: string;
}

const ALERT_STYLES: Record<
  AlertVariant,
  { wrap: string; iconColor: string; icon: React.ReactNode }
> = {
  info: {
    wrap: 'bg-[#2BB5FF]/10 border-[#2BB5FF]/25 text-[var(--text-primary)]',
    iconColor: 'text-[#2BB5FF]',
    icon: <Icon filled={Info24Filled} size="md" />,
  },
  success: {
    wrap: 'bg-emerald-500/10 border-emerald-500/25 text-[var(--text-primary)]',
    iconColor: 'text-emerald-600 dark:text-emerald-400',
    icon: <Icon filled={CheckmarkCircle24Filled} size="md" />,
  },
  warning: {
    wrap: 'bg-amber-500/10 border-amber-500/25 text-[var(--text-primary)]',
    iconColor: 'text-amber-600 dark:text-amber-400',
    icon: <Icon filled={Warning24Filled} size="md" />,
  },
  danger: {
    wrap: 'bg-rose-500/10 border-rose-500/25 text-[var(--text-primary)]',
    iconColor: 'text-rose-600 dark:text-rose-400',
    icon: <Icon filled={ErrorCircle24Filled} size="md" />,
  },
};

/**
 * Ozone UI Alert / Banner primitive.
 */
export const Alert: React.FC<AlertProps> = ({
  variant = 'info',
  title,
  children,
  action,
  onDismiss,
  className = '',
}) => {
  const s = ALERT_STYLES[variant];

  return (
    <div
      role="alert"
      className={`rounded-2xl border px-4 py-3 flex items-start gap-3 ${s.wrap} ${className}`}
    >
      <span className={`mt-0.5 flex-shrink-0 ${s.iconColor}`}>{s.icon}</span>
      <div className="flex-1 min-w-0">
        {title && <div className="text-xs font-extrabold leading-tight">{title}</div>}
        <div className="text-[11px] text-[var(--text-secondary)] mt-0.5 leading-snug">
          {children}
        </div>
        {action && <div className="mt-2">{action}</div>}
      </div>
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Dismiss alert"
          className="p-1 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors cursor-pointer flex-shrink-0"
        >
          <Icon filled={Dismiss24Filled} size="sm" />
        </button>
      )}
    </div>
  );
};
