'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown24Regular, Checkmark24Filled, Search24Regular } from '@fluentui/react-icons';
import { useSmartPosition } from '@/lib/useSmartPosition';
import { Icon } from './Icon';

export interface ComboboxOption {
  value: string;
  label: string;
  sublabel?: string;
  icon?: React.ReactNode;
}

export interface ComboboxProps {
  options: ComboboxOption[];
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  /** Use 52px floating overline label matching FloatingInput */
  floating?: boolean;
  className?: string;
}

/**
 * Ozone UI space-smart Combobox (searchable select) primitive.
 */
export const Combobox: React.FC<ComboboxProps> = ({
  options,
  value,
  onChange,
  label,
  placeholder = 'Select an option...',
  searchPlaceholder = 'Search...',
  emptyMessage = 'No matches found.',
  floating = false,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const selected = options.find((o) => o.value === value);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return options;
    return options.filter(
      (o) =>
        o.label.toLowerCase().includes(q) ||
        o.sublabel?.toLowerCase().includes(q)
    );
  }, [options, query]);

  const { positionClass, motionY } = useSmartPosition({
    isOpen,
    triggerRef: containerRef,
    floatingRef: menuRef,
    estimatedWidth: 280,
    estimatedHeight: 280,
    preferredVertical: 'bottom',
    preferredHorizontal: 'left',
    offset: 8,
  });

  useEffect(() => {
    if (!isOpen) {
      setQuery('');
      return;
    }
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
    <div ref={containerRef} className={`relative w-full ${className}`}>
      {label && !floating && (
        <label className="block text-xs font-bold text-[var(--text-primary)] mb-1.5">
          {label}
        </label>
      )}

      <button
        type="button"
        onClick={() => setIsOpen((o) => !o)}
        className={`w-full px-3.5 rounded-2xl bg-[var(--bg-secondary)] border flex items-center justify-between gap-2 text-left transition-all cursor-pointer ${
          floating ? 'h-[52px]' : 'h-[var(--control-height)]'
        } ${
          isOpen
            ? 'border-[#2BB5FF] ring-2 ring-[#2BB5FF]/20 bg-[var(--bg-primary)]'
            : 'border-[var(--border-subtle)] hover:border-[#2BB5FF]/50'
        }`}
      >
        {floating && label ? (
          <div className="relative min-w-0 flex-1 h-full flex flex-col justify-center">
            <span
              className={`absolute left-0 pointer-events-none select-none transition-all duration-150 ${
                isOpen || selected
                  ? 'top-2 text-[10px] uppercase font-bold tracking-wider text-[var(--text-muted)]'
                  : 'top-1/2 -translate-y-1/2 text-xs font-medium text-[var(--text-muted)]'
              }`}
            >
              {label}
            </span>
            <span
              className={`truncate block text-xs font-bold text-[var(--text-primary)] ${
                isOpen || selected ? 'pt-3.5 opacity-100' : 'opacity-0'
              }`}
            >
              {selected ? selected.label : placeholder}
            </span>
          </div>
        ) : (
          <span className={`text-xs font-semibold truncate ${selected ? 'text-[var(--text-primary)]' : 'text-[var(--text-muted)]'}`}>
            {selected ? selected.label : placeholder}
          </span>
        )}
        <Icon
          regular={ChevronDown24Regular}
          size="md"
          tone="muted"
          className={`transition-transform duration-150 ${
            isOpen ? 'rotate-180 !text-[#2BB5FF]' : ''
          }`}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={menuRef}
            initial={{ opacity: 0, y: motionY, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: motionY, scale: 0.96 }}
            transition={{ duration: 0.14, ease: [0.16, 1, 0.3, 1] }}
            className={`absolute z-[240] w-full min-w-[240px] rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] shadow-2xl overflow-hidden ${positionClass}`}
          >
            <div className="flex items-center gap-2 px-3 h-10 border-b border-[var(--border-subtle)]">
              <Icon regular={Search24Regular} size="md" tone="muted" />
              <input
                autoFocus
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={searchPlaceholder}
                className="flex-1 bg-transparent text-xs font-medium text-[var(--text-primary)] placeholder:text-[var(--text-muted)] outline-none"
              />
            </div>

            <div className="max-h-56 overflow-y-auto p-1.5 space-y-0.5">
              {filtered.length === 0 ? (
                <div className="py-5 text-center text-xs text-[var(--text-muted)]">
                  {emptyMessage}
                </div>
              ) : (
                filtered.map((opt) => {
                  const isSelected = opt.value === value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => {
                        onChange(opt.value);
                        setIsOpen(false);
                      }}
                      className={`w-full px-2.5 py-2 rounded-xl flex items-center justify-between gap-2 text-left transition-colors cursor-pointer ${
                        isSelected
                          ? 'bg-[#2BB5FF]/10 text-[#2BB5FF]'
                          : 'text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]'
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        {opt.icon && <span className="flex-shrink-0">{opt.icon}</span>}
                        <div className="min-w-0">
                          <div className="text-xs font-bold truncate">{opt.label}</div>
                          {opt.sublabel && (
                            <div className="text-[10px] text-[var(--text-muted)] truncate">
                              {opt.sublabel}
                            </div>
                          )}
                        </div>
                      </div>
                      {isSelected && <Icon filled={Checkmark24Filled} size="sm" />}
                    </button>
                  );
                })
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
