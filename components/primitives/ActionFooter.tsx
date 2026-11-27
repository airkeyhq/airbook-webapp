'use client';

import React from 'react';
import { Spinner } from './Spinner';

export interface ActionFooterProps {
  /** Primary CTA label (Tier 1 or Danger) */
  primaryLabel: string;
  onPrimaryClick: () => void;
  primaryVariant?: 'primary' | 'danger';
  primaryLoading?: boolean;
  primaryDisabled?: boolean;
  /** Secondary button label (Tier 2, e.g. "Cancel") */
  secondaryLabel?: string;
  onSecondaryClick?: () => void;
  /** Optional left-side slot (helper note, status badge, or tertiary link) */
  leading?: React.ReactNode;
  /** Render with top hairline & subtle tray background (for Dialog/Drawer/Card footers) */
  bordered?: boolean;
  className?: string;
}

/**
 * Ozone UI ActionFooter (Control Footer) primitive.
 * Standardized paired Tier 2 + Tier 1 footer used across Dialogs, Drawers, and Cards.
 */
export const ActionFooter: React.FC<ActionFooterProps> = ({
  primaryLabel,
  onPrimaryClick,
  primaryVariant = 'primary',
  primaryLoading = false,
  primaryDisabled = false,
  secondaryLabel = 'Cancel',
  onSecondaryClick,
  leading,
  bordered = true,
  className = '',
}) => {
  return (
    <div
      className={`flex flex-col-reverse sm:flex-row sm:items-center justify-between gap-3 ${
        bordered
          ? 'px-6 py-4 border-t border-[var(--border-subtle)] bg-[var(--bg-secondary)]/50'
          : ''
      } ${className}`}
    >
      <div className="min-w-0 flex items-center text-xs text-[var(--text-muted)]">
        {leading}
      </div>

      <div className="flex items-center justify-end gap-2.5 flex-shrink-0">
        {onSecondaryClick && (
          <button
            type="button"
            onClick={onSecondaryClick}
            className="btn-secondary"
          >
            {secondaryLabel}
          </button>
        )}

        <button
          type="button"
          disabled={primaryDisabled || primaryLoading}
          onClick={onPrimaryClick}
          className={
            primaryVariant === 'danger'
              ? 'h-[var(--control-height)] px-4 rounded-[var(--radius-md)] bg-rose-500 border-[1.5px] border-rose-600 text-white text-xs font-extrabold shadow-[0_4px_12px_-2px_rgba(244,63,94,0.45),inset_0_1px_1px_rgba(255,255,255,0.35)] hover:bg-rose-600 inline-flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-[0.97] disabled:opacity-45 disabled:cursor-not-allowed whitespace-nowrap'
              : 'btn-primary disabled:opacity-45 disabled:cursor-not-allowed'
          }
        >
          {primaryLoading && <Spinner size="xs" color="white" />}
          <span>{primaryLabel}</span>
        </button>
      </div>
    </div>
  );
};
