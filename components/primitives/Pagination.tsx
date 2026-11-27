'use client';

import React from 'react';
import { ChevronLeft24Regular, ChevronRight24Regular } from '@fluentui/react-icons';
import { Icon } from './Icon';

export interface PaginationProps {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
  className?: string;
}

/**
 * Ozone UI Pagination primitive.
 */
export const Pagination: React.FC<PaginationProps> = ({
  page,
  totalPages,
  onChange,
  className = '',
}) => {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <nav
      aria-label="Pagination"
      className={`inline-flex items-center gap-1.5 p-1 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] select-none ${className}`}
    >
      <button
        type="button"
        aria-label="Previous page"
        disabled={page <= 1}
        onClick={() => page > 1 && onChange(page - 1)}
        className="w-8 h-8 rounded-xl flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-primary)] disabled:opacity-35 disabled:cursor-not-allowed cursor-pointer transition-colors"
      >
        <Icon regular={ChevronLeft24Regular} size="md" />
      </button>

      {pages.map((p) => {
        const isActive = p === page;
        return (
          <button
            key={p}
            type="button"
            aria-current={isActive ? 'page' : undefined}
            onClick={() => onChange(p)}
            className={`w-8 h-8 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
              isActive
                ? 'bg-[var(--color-accent-primary)] border border-[#1A8EFF] text-white shadow-[0_2px_8px_-1px_rgba(43,181,255,0.45),inset_0_1px_1px_rgba(255,255,255,0.35)]'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-primary)]'
            }`}
          >
            {p}
          </button>
        );
      })}

      <button
        type="button"
        aria-label="Next page"
        disabled={page >= totalPages}
        onClick={() => page < totalPages && onChange(page + 1)}
        className="w-8 h-8 rounded-xl flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-primary)] disabled:opacity-35 disabled:cursor-not-allowed cursor-pointer transition-colors"
      >
        <Icon regular={ChevronRight24Regular} size="md" />
      </button>
    </nav>
  );
};
