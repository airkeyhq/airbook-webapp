'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar24Regular, ChevronLeft24Regular, ChevronRight24Regular } from '@fluentui/react-icons';
import { useSmartPosition } from '@/lib/useSmartPosition';
import { Icon } from './Icon';

export interface DatePickerProps {
  value: Date;
  onChange: (date: Date) => void;
  label?: string;
  /** Use 52px floating overline label matching FloatingInput */
  floating?: boolean;
  className?: string;
}

const WEEKDAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

/**
 * Ozone UI space-smart single DatePicker primitive.
 */
export const DatePicker: React.FC<DatePickerProps> = ({
  value,
  onChange,
  label,
  floating = false,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [viewMonth, setViewMonth] = useState(
    new Date(value.getFullYear(), value.getMonth(), 1)
  );
  const containerRef = useRef<HTMLDivElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  const { positionClass, motionY } = useSmartPosition({
    isOpen,
    triggerRef: containerRef,
    floatingRef: popoverRef,
    estimatedWidth: 288,
    estimatedHeight: 320,
    preferredVertical: 'bottom',
    preferredHorizontal: 'left',
    offset: 8,
  });

  useEffect(() => {
    if (!isOpen) return;
    const onMouseDown = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', onMouseDown);
    return () => document.removeEventListener('mousedown', onMouseDown);
  }, [isOpen]);

  const year = viewMonth.getFullYear();
  const month = viewMonth.getMonth();
  const firstDayOffset = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date();

  return (
    <div ref={containerRef} className={`relative inline-block w-full ${className}`}>
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
            <span className="absolute left-0 top-2 text-[10px] uppercase font-bold tracking-wider text-[var(--text-muted)] pointer-events-none">
              {label}
            </span>
            <span className="pt-3.5 text-xs font-mono font-bold text-[var(--text-primary)] truncate">
              {value.toLocaleDateString('en-US', {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </span>
          </div>
        ) : (
          <span className="text-xs font-mono font-bold text-[var(--text-primary)]">
            {value.toLocaleDateString('en-US', {
              weekday: 'short',
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })}
          </span>
        )}
        <Icon regular={Calendar24Regular} size="md" tone="accent" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={popoverRef}
            initial={{ opacity: 0, y: motionY, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: motionY, scale: 0.96 }}
            transition={{ duration: 0.14, ease: [0.16, 1, 0.3, 1] }}
            className={`absolute z-[240] w-72 p-4 rounded-3xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] shadow-2xl space-y-3 ${positionClass}`}
          >
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => setViewMonth(new Date(year, month - 1, 1))}
                className="p-1.5 rounded-xl hover:bg-[var(--bg-secondary)] text-[var(--text-secondary)] cursor-pointer"
              >
                <Icon regular={ChevronLeft24Regular} size="md" />
              </button>
              <span className="text-xs font-extrabold text-[var(--text-primary)]">
                {viewMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </span>
              <button
                type="button"
                onClick={() => setViewMonth(new Date(year, month + 1, 1))}
                className="p-1.5 rounded-xl hover:bg-[var(--bg-secondary)] text-[var(--text-secondary)] cursor-pointer"
              >
                <Icon regular={ChevronRight24Regular} size="md" />
              </button>
            </div>

            <div className="grid grid-cols-7 gap-1 text-center">
              {WEEKDAYS.map((w) => (
                <div key={w} className="text-[10px] font-bold text-[var(--text-muted)] py-1">
                  {w}
                </div>
              ))}
              {Array.from({ length: firstDayOffset }).map((_, i) => (
                <div key={`empty-${i}`} />
              ))}
              {Array.from({ length: daysInMonth }, (_, i) => {
                const day = i + 1;
                const d = new Date(year, month, day);
                const isSelected = isSameDay(d, value);
                const isToday = isSameDay(d, today);

                return (
                  <button
                    key={day}
                    type="button"
                    onClick={() => {
                      onChange(d);
                      setIsOpen(false);
                    }}
                    className={`relative h-8 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[var(--color-accent-primary)] border border-[#1A8EFF] text-white shadow-[0_2px_8px_-1px_rgba(43,181,255,0.45)]'
                        : 'text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]'
                    }`}
                  >
                    {day}
                    {isToday && !isSelected && (
                      <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#FF3B30]" />
                    )}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
