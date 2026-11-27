'use client';

import React from 'react';

export interface CardProps {
  children: React.ReactNode;
  variant?: 'surface' | 'glass' | 'dashed' | 'interactive' | 'envelope';
  /** Optional header slot rendered in the outer tray when variant="envelope" */
  trayHeader?: React.ReactNode;
  /** Optional footer slot rendered in the outer tray when variant="envelope" */
  trayFooter?: React.ReactNode;
  /** Class overrides for the inner card surface when variant="envelope" */
  innerClassName?: string;
  className?: string;
  onClick?: () => void;
}

/**
 * Ozone UI Card primitive.
 *
 * Hierarchy in AirBook:
 * 1. `envelope` — Top-level section/module frame (dashboards, POS checkout, billing, settings groups).
 * 2. `surface` / `interactive` — Individual content or clickable items inside a page or envelope tray.
 * 3. `glass` — Floating overlays over calendar/map content.
 * 4. `dashed` — Empty states and upload dropzones.
 */
export const Card: React.FC<CardProps> = ({
  children,
  variant = 'surface',
  trayHeader,
  trayFooter,
  innerClassName = '',
  className = '',
  onClick,
}) => {
  if (variant === 'envelope') {
    return (
      <div
        onClick={onClick}
        className={`rounded-3xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)]/70 p-2 shadow-xs ${className}`}
      >
        {trayHeader && <div className="px-3 pt-1.5 pb-2.5">{trayHeader}</div>}
        <div
          className={`rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-primary)] p-5 shadow-xs ${innerClassName}`}
        >
          {children}
        </div>
        {trayFooter && (
          <div className="px-3 pt-2.5 pb-1 text-xs text-[var(--text-muted)]">{trayFooter}</div>
        )}
      </div>
    );
  }

  const variantStyles = {
    surface: 'bg-[var(--bg-primary)] border border-[var(--border-subtle)] shadow-xs',
    glass: 'bg-[var(--bg-primary)]/80 backdrop-blur-xl border border-[var(--border-subtle)] shadow-sm',
    dashed: 'bg-[var(--bg-primary)]/40 border-2 border-dashed border-[var(--border-subtle)]',
    interactive: 'bg-[var(--bg-primary)] border border-[var(--border-subtle)] hover:border-[#2BB5FF]/40 hover:shadow-md cursor-pointer transition-all duration-150 active:scale-[0.99]',
  }[variant];

  return (
    <div
      onClick={onClick}
      className={`rounded-3xl p-6 ${variantStyles} ${className}`}
    >
      {children}
    </div>
  );
};
