'use client';

import * as React from 'react';
import { Avatar } from '@/components/primitives/Avatar';
import { Badge } from '@/components/primitives/Badge';

export interface CardViewItem {
  id: string;
  title: string;
  subtitle?: string;
  avatarFallback?: string;
  avatarSrc?: string;
  status?: {
    label: string;
    variant?: 'default' | 'subtle' | 'success' | 'warning' | 'danger';
  };
  metadata?: {
    label: string;
    value: string;
    icon?: React.ReactNode;
  }[];
  tags?: string[];
  onClick?: () => void;
}

export interface CardViewProps extends React.HTMLAttributes<HTMLDivElement> {
  items: CardViewItem[];
  columns?: 1 | 2 | 3 | 4;
  onItemClick?: (item: CardViewItem) => void;
}

/**
 * Ozone UI CardView composite (ported from Mosaic).
 * Responsive grid of tactile cards with avatar, status badge, metadata rows, and tags.
 */
export const CardView: React.FC<CardViewProps> = ({
  items,
  columns = 3,
  onItemClick,
  className = '',
  ...props
}) => {
  const gridColsClass = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
  }[columns];

  return (
    <div className={`grid gap-3.5 ${gridColsClass} ${className}`} {...props}>
      {items.map((item) => (
        <div
          key={item.id}
          role={item.onClick || onItemClick ? 'button' : undefined}
          tabIndex={item.onClick || onItemClick ? 0 : undefined}
          onClick={() => {
            item.onClick?.();
            onItemClick?.(item);
          }}
          onKeyDown={(e) => {
            if ((item.onClick || onItemClick) && (e.key === 'Enter' || e.key === ' ')) {
              e.preventDefault();
              item.onClick?.();
              onItemClick?.(item);
            }
          }}
          className="group relative flex flex-col justify-between rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-primary)] p-4 text-[var(--text-primary)] shadow-xs transition-all duration-150 hover:border-[#2BB5FF]/50 hover:-translate-y-0.5 cursor-pointer select-none"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              {(item.avatarFallback || item.avatarSrc) && (
                <Avatar
                  fallback={item.avatarFallback || item.title.slice(0, 2).toUpperCase()}
                  src={item.avatarSrc}
                  size="md"
                  className="shrink-0"
                />
              )}
              <div className="flex flex-col min-w-0">
                <span className="font-bold text-xs sm:text-sm text-[var(--text-primary)] leading-tight truncate">
                  {item.title}
                </span>
                {item.subtitle && (
                  <span className="text-[11px] text-[var(--text-secondary)] leading-tight mt-0.5 truncate">
                    {item.subtitle}
                  </span>
                )}
              </div>
            </div>

            {item.status && (
              <Badge
                variant={item.status.variant || 'default'}
                size="xs"
                dot
                className="shrink-0"
              >
                {item.status.label}
              </Badge>
            )}
          </div>

          {item.metadata && item.metadata.length > 0 && (
            <div className="mt-3.5 pt-3 border-t border-[var(--border-subtle)]/70 flex flex-col gap-1.5 text-xs">
              {item.metadata.map((meta, idx) => (
                <div key={idx} className="flex items-center justify-between gap-2">
                  <span className="flex items-center gap-1.5 text-[var(--text-muted)] text-[11px]">
                    {meta.icon}
                    <span>{meta.label}</span>
                  </span>
                  <span className="font-mono font-semibold text-[var(--text-primary)] text-[11px] tabular-nums">
                    {meta.value}
                  </span>
                </div>
              ))}
            </div>
          )}

          {item.tags && item.tags.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5 pt-2.5 border-t border-[var(--border-subtle)]/50">
              {item.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-subtle)] px-2 py-0.5 text-[10px] font-semibold text-[var(--text-secondary)]"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
