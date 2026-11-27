'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown24Regular } from '@fluentui/react-icons';
import { Icon } from './Icon';

export interface AccordionItem {
  id: string;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  badge?: React.ReactNode;
  icon?: React.ReactNode;
  content: React.ReactNode;
}

export interface AccordionProps {
  items: AccordionItem[];
  type?: 'single' | 'multiple';
  defaultOpenIds?: string[];
  className?: string;
}

/**
 * Ozone UI Accordion / Collapsible primitive.
 * Smooth Framer Motion height transitions for FAQs, service categories, and settings.
 */
export const Accordion: React.FC<AccordionProps> = ({
  items,
  type = 'single',
  defaultOpenIds = [],
  className = '',
}) => {
  const [openIds, setOpenIds] = useState<string[]>(defaultOpenIds);

  const toggle = (id: string) => {
    setOpenIds((prev) => {
      const isOpen = prev.includes(id);
      if (type === 'single') {
        return isOpen ? [] : [id];
      }
      return isOpen ? prev.filter((x) => x !== id) : [...prev, id];
    });
  };

  return (
    <div
      className={`rounded-3xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] divide-y divide-[var(--border-subtle)] overflow-hidden shadow-xs ${className}`}
    >
      {items.map((item) => {
        const isOpen = openIds.includes(item.id);
        return (
          <div key={item.id}>
            <button
              type="button"
              aria-expanded={isOpen}
              onClick={() => toggle(item.id)}
              className="w-full px-5 py-4 flex items-center justify-between gap-3 text-left hover:bg-[var(--bg-secondary)]/60 transition-colors cursor-pointer select-none"
            >
              <div className="flex items-center gap-3 min-w-0">
                {item.icon && (
                  <span className="w-5 h-5 flex items-center justify-center text-[#2BB5FF] flex-shrink-0 [&>svg]:w-full [&>svg]:h-full">
                    {item.icon}
                  </span>
                )}
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-bold text-[var(--text-primary)]">
                      {item.title}
                    </span>
                    {item.badge}
                  </div>
                  {item.subtitle && (
                    <p className="text-[11px] text-[var(--text-secondary)] mt-0.5 truncate">
                      {item.subtitle}
                    </p>
                  )}
                </div>
              </div>

              <motion.span
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="text-[var(--text-muted)] flex-shrink-0"
              >
                <Icon regular={ChevronDown24Regular} size="md" />
              </motion.span>
            </button>

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                  className="overflow-hidden"
                >
                  <div className="px-5 pb-4 pt-1 text-xs text-[var(--text-secondary)] leading-relaxed">
                    {item.content}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
};
