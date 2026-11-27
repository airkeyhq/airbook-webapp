'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  CheckmarkCircle24Filled,
  Warning24Filled,
  ErrorCircle24Filled,
  Info24Filled,
  Dismiss24Filled,
} from '@fluentui/react-icons';
import { Icon } from './Icon';

export type ToastVariant = 'default' | 'success' | 'warning' | 'danger' | 'info';

export interface ToastProps {
  title: React.ReactNode;
  description?: React.ReactNode;
  variant?: ToastVariant;
  action?: {
    label: string;
    onClick: () => void;
  };
  onDismiss?: () => void;
  className?: string;
}

const VARIANT_CONFIG: Record<
  ToastVariant,
  { icon: React.ReactNode; border: string; iconWrap: string }
> = {
  default: {
    icon: <Icon filled={Info24Filled} size="md" />,
    border: 'border-[var(--border-subtle)]',
    iconWrap: 'bg-[var(--bg-secondary)] text-[var(--text-primary)]',
  },
  success: {
    icon: <Icon filled={CheckmarkCircle24Filled} size="md" />,
    border: 'border-emerald-500/30',
    iconWrap: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400',
  },
  warning: {
    icon: <Icon filled={Warning24Filled} size="md" />,
    border: 'border-amber-500/30',
    iconWrap: 'bg-amber-500/15 text-amber-600 dark:text-amber-400',
  },
  danger: {
    icon: <Icon filled={ErrorCircle24Filled} size="md" />,
    border: 'border-rose-500/30',
    iconWrap: 'bg-rose-500/15 text-rose-600 dark:text-rose-400',
  },
  info: {
    icon: <Icon filled={Info24Filled} size="md" />,
    border: 'border-[#2BB5FF]/35',
    iconWrap: 'bg-[#2BB5FF]/15 text-[#2BB5FF]',
  },
};

/**
 * Ozone UI Toast notification primitive.
 */
export const Toast: React.FC<ToastProps> = ({
  title,
  description,
  variant = 'default',
  action,
  onDismiss,
  className = '',
}) => {
  const cfg = VARIANT_CONFIG[variant];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 12, scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 420, damping: 30 }}
      role="status"
      className={`w-full max-w-sm rounded-2xl bg-[var(--bg-primary)] border ${cfg.border} p-3.5 shadow-xl flex items-start gap-3 ${className}`}
    >
      <div className={`w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0 ${cfg.iconWrap}`}>
        {cfg.icon}
      </div>

      <div className="flex-1 min-w-0 pt-0.5">
        <div className="text-xs font-bold text-[var(--text-primary)] leading-tight">
          {title}
        </div>
        {description && (
          <p className="text-[11px] text-[var(--text-secondary)] mt-0.5 leading-snug">
            {description}
          </p>
        )}
        {action && (
          <button
            type="button"
            onClick={action.onClick}
            className="mt-2 text-[11px] font-extrabold text-[#2BB5FF] hover:underline cursor-pointer"
          >
            {action.label}
          </button>
        )}
      </div>

      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Dismiss notification"
          className="p-1 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] transition-colors cursor-pointer flex-shrink-0"
        >
          <Icon filled={Dismiss24Filled} size="sm" />
        </button>
      )}
    </motion.div>
  );
};
