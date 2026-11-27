'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar24Regular, ChevronLeft24Regular, ChevronRight24Regular } from '@fluentui/react-icons';
import { useSmartPosition } from '@/lib/useSmartPosition';
import { Icon } from '@/components/primitives/Icon';

export interface DateRange {
  start: Date;
  end: Date;
}

export interface DateRangePickerProps {
  value: DateRange;
  onChange: (range: DateRange) => void;
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

function formatShort(d: Date) {
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

/**
 * Ozone UI space-smart DateRangePicker composite.
 */
export const DateRangePicker: React.FC<DateRangePickerProps> = ({
  value,
  onChange,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [viewMonth, setViewMonth] = useState(
    new Date(value.start.getFullYear(), value.start.getMonth(), 1)
  );
  const [draftStart, setDraftStart] = useState<Date | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  const { positionClass, motionY } = useSmartPosition({
    isOpen,
    triggerRef: containerRef,
    floatingRef: popoverRef,
    estimatedWidth: 360,
    estimatedHeight: 340,
    preferredVertical: 'bottom',
    preferredHorizontal: 'left',
    offset: 8,
  });

  useEffect(() => {
    if (!isOpen) return;
    const onMouseDown = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setDraftStart(null);
      }
    };
    document.addEventListener('mousedown', onMouseDown);
    return () => document.removeEventListener('mousedown', onMouseDown);
  }, [isOpen]);

  const year = viewMonth.getFullYear();
  const month = viewMonth.getMonth();
  const firstDayOffset = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const handleDayClick = (day: number) => {
    const clicked = new Date(year, month, day);
    if (!draftStart) {
      setDraftStart(clicked);
      return;
    }
    const start = clicked < draftStart ? clicked : draftStart;
    const end = clicked < draftStart ? draftStart : clicked;
    onChange({ start, end });
    setDraftStart(null);
    setIsOpen(false);
  };

  const applyPreset = (days: number) => {
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - days);
    onChange({ start, end });
    setDraftStart(null);
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className={`relative inline-block ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen((o) => !o)}
        className="btn-secondary flex items-center gap-2.5"
      >
        <Icon regular={Calendar24Regular} size="md" tone="accent" />
        <span className="font-mono text-xs">
          {formatShort(value.start)} – {formatShort(value.end)}
        </span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={popoverRef}
            initial={{ opacity: 0, y: motionY, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: motionY, scale: 0.96 }}
            transition={{ duration: 0.14, ease: [0.16, 1, 0.3, 1] }}
            className={`absolute z-[240] w-[360px] p-4 rounded-3xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] shadow-2xl space-y-3 ${positionClass}`}
          >
            {/* Quick Presets */}
            <div className="flex items-center gap-1.5 flex-wrap">
              {[
                { label: 'Last 7d', days: 6 },
                { label: 'Last 14d', days: 13 },
                { label: 'Last 30d', days: 29 },
              ].map((p) => (
                <button
                  key={p.label}
                  type="button"
                  onClick={() => applyPreset(p.days)}
                  className="px-2.5 py-1 rounded-full bg-[var(--bg-secondary)] border border-[var(--border-subtle)] hover:border-[#2BB5FF]/50 text-[11px] font-bold text-[var(--text-secondary)] hover:text-[var(--text-primary)] cursor-pointer transition-colors"
                >
                  {p.label}
                </button>
              ))}
            </div>

            {/* Month Header */}
            <div className="flex items-center justify-between pt-1">
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

            {/* Weekday Grid */}
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
                const dateObj = new Date(year, month, day);
                const isStart = draftStart
                  ? isSameDay(dateObj, draftStart)
                  : isSameDay(dateObj, value.start);
                const isEnd = !draftStart && isSameDay(dateObj, value.end);
                const inRange =
                  !draftStart && dateObj > value.start && dateObj < value.end;

                return (
                  <button
                    key={day}
                    type="button"
                    onClick={() => handleDayClick(day)}
                    className={`h-8 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                      isStart || isEnd
                        ? 'bg-[var(--color-accent-primary)] border border-[#1A8EFF] text-white shadow-[0_2px_8px_-1px_rgba(43,181,255,0.45)]'
                        : inRange
                          ? 'bg-[#2BB5FF]/15 text-[#2BB5FF]'
                          : 'text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]'
                    }`}
                  >
                    {day}
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
