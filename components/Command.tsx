'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search24Regular } from '@fluentui/react-icons';
import { Icon } from '@/components/primitives/Icon';
import { Kbd } from '@/components/primitives/Kbd';

export interface CommandItem {
  id: string;
  group: string;
  label: string;
  subtitle?: string;
  icon?: React.ReactNode;
  shortcut?: string;
  onSelect: () => void;
}

export interface CommandProps {
  open: boolean;
  onClose: () => void;
  items: CommandItem[];
  placeholder?: string;
}

/**
 * Ozone UI Command Palette (`⌘K`) composite.
 */
export const Command: React.FC<CommandProps> = ({
  open,
  onClose,
  items,
  placeholder = 'Type a command or search...',
}) => {
  const [mounted, setMounted] = useState(false);
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) {
      setQuery('');
      setActiveIndex(0);
    }
  }, [open]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter(
      (item) =>
        item.label.toLowerCase().includes(q) ||
        item.group.toLowerCase().includes(q) ||
        item.subtitle?.toLowerCase().includes(q)
    );
  }, [items, query]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveIndex((i) => (filtered.length ? (i + 1) % filtered.length : 0));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveIndex((i) =>
          filtered.length ? (i - 1 + filtered.length) % filtered.length : 0
        );
      } else if (e.key === 'Enter' && filtered[activeIndex]) {
        e.preventDefault();
        filtered[activeIndex].onSelect();
        onClose();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, filtered, activeIndex, onClose]);

  if (!mounted) return null;

  const groups = Array.from(new Set(filtered.map((i) => i.group)));

  return createPortal(
    <AnimatePresence>
      {open && (
        <div
          className="fixed inset-0 z-[270] flex items-start justify-center pt-[14vh] px-4 font-sans antialiased text-[var(--text-primary)]"
          style={{
            fontFamily:
              'var(--font-geist-sans, -apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", sans-serif)',
          }}
          role="dialog"
          aria-modal="true"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/35 backdrop-blur-[3px]"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -8 }}
            transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 w-full max-w-lg rounded-3xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] shadow-2xl overflow-hidden"
          >
            {/* Search Bar */}
            <div className="flex items-center gap-2.5 px-4 h-12 border-b border-[var(--border-subtle)]">
              <Icon regular={Search24Regular} size="md" tone="muted" />
              <input
                autoFocus
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={placeholder}
                className="flex-1 bg-transparent text-xs font-medium text-[var(--text-primary)] placeholder:text-[var(--text-muted)] outline-none"
              />
              <Kbd>ESC</Kbd>
            </div>

            {/* Results */}
            <div className="max-h-80 overflow-y-auto p-2 space-y-2">
              {filtered.length === 0 ? (
                <div className="py-8 text-center text-xs text-[var(--text-muted)]">
                  No matching commands found.
                </div>
              ) : (
                groups.map((group) => (
                  <div key={group}>
                    <div className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
                      {group}
                    </div>
                    {filtered
                      .filter((item) => item.group === group)
                      .map((item) => {
                        const globalIdx = filtered.indexOf(item);
                        const isActive = globalIdx === activeIndex;
                        return (
                          <button
                            key={item.id}
                            type="button"
                            onMouseEnter={() => setActiveIndex(globalIdx)}
                            onClick={() => {
                              item.onSelect();
                              onClose();
                            }}
                            className={`w-full px-3 py-2 rounded-xl flex items-center justify-between gap-3 text-left transition-colors cursor-pointer ${
                              isActive
                                ? 'bg-[#2BB5FF]/10 text-[var(--text-primary)]'
                                : 'text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)]'
                            }`}
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              {item.icon && (
                                <span className={isActive ? 'text-[#2BB5FF]' : 'text-[var(--text-muted)]'}>
                                  {item.icon}
                                </span>
                              )}
                              <div className="min-w-0">
                                <div className="text-xs font-bold truncate">{item.label}</div>
                                {item.subtitle && (
                                  <div className="text-[10px] text-[var(--text-muted)] truncate">
                                    {item.subtitle}
                                  </div>
                                )}
                              </div>
                            </div>
                            {item.shortcut && <Kbd>{item.shortcut}</Kbd>}
                          </button>
                        );
                      })}
                  </div>
                ))
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
};
