'use client';

import React from 'react';
import { ChevronRight24Regular } from '@fluentui/react-icons';
import { Icon } from './Icon';

export interface BreadcrumbItem {
  label: string;
  href?: string;
  onClick?: () => void;
}

export interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

/**
 * Ozone UI Breadcrumbs navigation primitive.
 */
export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items, className = '' }) => {
  return (
    <nav aria-label="Breadcrumb" className={`inline-flex items-center flex-wrap gap-1.5 ${className}`}>
      {items.map((item, idx) => {
        const isLast = idx === items.length - 1;
        return (
          <React.Fragment key={`${item.label}-${idx}`}>
            {isLast ? (
              <span
                aria-current="page"
                className="px-2.5 py-1 rounded-full bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-[11px] font-bold text-[var(--text-primary)]"
              >
                {item.label}
              </span>
            ) : item.href ? (
              <a
                href={item.href}
                onClick={item.onClick}
                className="text-xs font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
              >
                {item.label}
              </a>
            ) : (
              <button
                type="button"
                onClick={item.onClick}
                className="text-xs font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
              >
                {item.label}
              </button>
            )}
            {!isLast && (
              <Icon regular={ChevronRight24Regular} size="sm" tone="muted" />
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};
