'use client';

import React, { useState } from 'react';
import { SparkleBurst } from './SparkleBurst';

export interface TimeSlot {
  value: string;
  label: string;
  available?: boolean;
}

export interface TimeSlotPickerProps {
  slots: TimeSlot[];
  value: string;
  onChange: (value: string) => void;
  label?: string;
  spark?: boolean;
  className?: string;
}

/**
 * Ozone UI TimeSlotPicker primitive for AirBook appointment selection.
 */
export const TimeSlotPicker: React.FC<TimeSlotPickerProps> = ({
  slots,
  value,
  onChange,
  label,
  spark = true,
  className = '',
}) => {
  const [burstMap, setBurstMap] = useState<Record<string, number>>({});

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <div className="text-xs font-bold text-[var(--text-primary)]">{label}</div>
      )}
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
        {slots.map((slot) => {
          const isAvailable = slot.available !== false;
          const isSelected = value === slot.value;
          return (
            <button
              key={slot.value}
              type="button"
              disabled={!isAvailable}
              onClick={() => {
                if (!isAvailable) return;
                if (spark && !isSelected) {
                  setBurstMap((p) => ({ ...p, [slot.value]: (p[slot.value] || 0) + 1 }));
                }
                onChange(slot.value);
              }}
              className={`relative h-10 px-2.5 rounded-xl font-mono text-xs font-bold transition-all select-none ${
                !isAvailable
                  ? 'opacity-35 line-through cursor-not-allowed bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-[var(--text-muted)]'
                  : isSelected
                    ? 'bg-[var(--color-accent-primary)] border border-[#1A8EFF] text-white shadow-[0_4px_12px_-2px_rgba(43,181,255,0.5),inset_0_1px_1px_rgba(255,255,255,0.4)] cursor-pointer'
                    : 'bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-[var(--text-primary)] hover:border-[#2BB5FF]/50 cursor-pointer active:scale-95'
              }`}
            >
              <span>{slot.label}</span>
              {spark && (
                <SparkleBurst
                  burstKey={burstMap[slot.value] || 0}
                  shape="pill"
                  particle="stars"
                  tone="tier1"
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
