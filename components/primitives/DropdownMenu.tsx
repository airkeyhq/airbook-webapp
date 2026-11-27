'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSmartPosition } from '@/lib/useSmartPosition';

export type DropdownMenuItem =
  | {
      type?: 'item';
      id: string;
      label: React.ReactNode;
      icon?: React.ReactNode;
      shortcut?: string;
      danger?: boolean;
      disabled?: boolean;
      onClick?: () => void;
    }
  | { type: 'separator'; id: string }
  | { type: 'label'; id: string; label: string };

export interface DropdownMenuProps {
  trigger: React.ReactNode;
  items: DropdownMenuItem[];
  preferredHorizontal?: 'left' | 'right';
  className?: string;
}

/**
 * Ozone UI space-smart DropdownMenu primitive.
 * Automatically flips top/bottom and left/right based on viewport & scroll container space.
 */
export const DropdownMenu: React.FC<DropdownMenuProps> = ({
  trigger,
  items,
  preferredHorizontal = 'left',
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const { positionClass, motionY } = useSmartPosition({
    isOpen,
    triggerRef: containerRef,
    floatingRef: menuRef,
    estimatedWidth: 210,
    estimatedHeight: Math.min(items.length * 36 + 16, 320),
    preferredVertical: 'bottom',
    preferredHorizontal,
    offset: 8,
  });

  useEffect(() => {
    if (!isOpen) return;
    const onMouseDown = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    document.addEventListener('mousedown', onMouseDown);
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [isOpen]);

  return (
    <div ref={containerRef} className={`relative inline-block ${className}`}>
      <div
        onClick={() => setIsOpen((o) => !o)}
        className="inline-flex cursor-pointer"
      >
        {trigger}
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={menuRef}
            role="menu"
            initial={{ opacity: 0, y: motionY, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: motionY, scale: 0.96 }}
            transition={{ duration: 0.14, ease: [0.16, 1, 0.3, 1] }}
            className={`absolute z-[240] min-w-[210px] p-1.5 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] shadow-2xl ${positionClass}`}
          >
            {items.map((entry) => {
              if (entry.type === 'separator') {
                return <div key={entry.id} className="my-1 h-px bg-[var(--border-subtle)]" />;
              }
              if (entry.type === 'label') {
                return (
                  <div
                    key={entry.id}
                    className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]"
                  >
                    {entry.label}
                  </div>
                );
              }

              return (
                <button
                  key={entry.id}
                  type="button"
                  role="menuitem"
                  disabled={entry.disabled}
                  onClick={() => {
                    if (entry.disabled) return;
                    entry.onClick?.();
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between gap-3 px-2.5 py-2 rounded-xl text-xs font-semibold transition-colors select-none ${
                    entry.disabled
                      ? 'opacity-40 cursor-not-allowed'
                      : entry.danger
                        ? 'text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 cursor-pointer'
                        : 'text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] cursor-pointer'
                  }`}
                >
                  <span className="flex items-center gap-2 min-w-0">
                    {entry.icon && (
                      <span className="w-4 h-4 flex items-center justify-center flex-shrink-0 [&>svg]:w-full [&>svg]:h-full">
                        {entry.icon}
                      </span>
                    )}
                    <span className="truncate">{entry.label}</span>
                  </span>
                  {entry.shortcut && (
                    <span className="text-[10px] font-mono text-[var(--text-muted)] flex-shrink-0">
                      {entry.shortcut}
                    </span>
                  )}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
