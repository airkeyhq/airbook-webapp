'use client';

import React, { useId } from 'react';
import { motion } from 'framer-motion';
import { InlineIndicator } from './Indicator';

export interface TabsProps {
  tabs: { id: string; label: string; icon?: React.ReactNode; count?: number }[];
  activeTab: string;
  onChange: (id: string) => void;
  variant?: 'pill' | 'segmented';
  className?: string;
}

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  activeTab,
  onChange,
  variant = 'pill',
  className = '',
}) => {
  const layoutGroupId = useId();

  return (
    <div
      role="tablist"
      className={`inline-flex items-center gap-1 p-1 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] ${className}`}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(tab.id)}
            className={`relative inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors duration-150 select-none cursor-pointer ${
              isActive
                ? 'text-[var(--text-primary)]'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            {isActive && (
              <motion.span
                layoutId={`tabs-pill-${layoutGroupId}`}
                transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                className="absolute inset-0 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] shadow-xs"
              />
            )}
            <span className="relative z-10 inline-flex items-center gap-2">
              {tab.icon && (
                <span className="inline-flex items-center justify-center shrink-0 w-3.5 h-3.5 [&>svg]:w-full [&>svg]:h-full">
                  {tab.icon}
                </span>
              )}
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <InlineIndicator value={tab.count} variant={isActive ? 'pill-solid' : 'pill-muted'} />
              )}
            </span>
          </button>
        );
      })}
    </div>
  );
};
