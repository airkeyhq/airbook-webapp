'use client';

import React, { useRef, useState } from 'react';
import { ChevronLeft12Filled, ChevronRight12Filled } from '@fluentui/react-icons';
import { Icon } from './Icon';

export interface SliderProps {
  /** Single number or `[min, max]` range tuple */
  value: number | [number, number];
  onChange: (value: number | [number, number]) => void;
  min?: number;
  max?: number;
  step?: number;
  label?: string;
  prefix?: string;
  suffix?: string;
  /** Thumb style variant @default 'default' */
  variant?: 'default' | 'pill';
  /** Active track fill color @default 'accent' (or 'emerald' for pill) */
  trackColor?: 'accent' | 'emerald';
  showValueTooltip?: boolean;
  disabled?: boolean;
  className?: string;
}

/**
 * Ozone UI Slider primitive.
 * Supports single-thumb and dual-thumb range selection with Tier 1 Electric Sky track.
 */
export const Slider: React.FC<SliderProps> = ({
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  label,
  prefix = '',
  suffix = '',
  variant = 'default',
  trackColor,
  showValueTooltip = true,
  disabled = false,
  className = '',
}) => {
  const resolvedTrackColor = trackColor ?? (variant === 'pill' ? 'emerald' : 'accent');
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeThumb, setActiveThumb] = useState<0 | 1 | null>(null);

  const isRange = Array.isArray(value);
  const low = isRange ? value[0] : min;
  const high = isRange ? value[1] : value;

  const clampAndStep = (raw: number) => {
    const stepped = Math.round((raw - min) / step) * step + min;
    return Math.max(min, Math.min(max, Number(stepped.toFixed(4))));
  };

  const toPct = (v: number) => ((v - min) / (max - min || 1)) * 100;

  const updateFromClientX = (clientX: number, thumbIndex: 0 | 1) => {
    if (!trackRef.current || disabled) return;
    const rect = trackRef.current.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    const nextVal = clampAndStep(min + ratio * (max - min));

    if (!isRange) {
      onChange(nextVal);
      return;
    }

    if (thumbIndex === 0) {
      onChange([Math.min(nextVal, high), high]);
    } else {
      onChange([low, Math.max(nextVal, low)]);
    }
  };

  const startDrag = (clientX: number, thumbIndex?: 0 | 1) => {
    if (disabled || !trackRef.current) return;
    let targetThumb: 0 | 1 = thumbIndex ?? 1;
    if (thumbIndex === undefined && isRange) {
      const rect = trackRef.current.getBoundingClientRect();
      const clickPct = ((clientX - rect.left) / rect.width) * 100;
      targetThumb =
        Math.abs(clickPct - toPct(low)) <= Math.abs(clickPct - toPct(high)) ? 0 : 1;
    }

    setActiveThumb(targetThumb);
    updateFromClientX(clientX, targetThumb);

    const onMove = (e: MouseEvent | TouchEvent) => {
      const cx = 'touches' in e ? e.touches[0]?.clientX : e.clientX;
      if (cx !== undefined) updateFromClientX(cx, targetThumb);
    };
    const onUp = () => {
      setActiveThumb(null);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
      window.removeEventListener('touchmove', onMove);
      window.removeEventListener('touchend', onUp);
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    window.addEventListener('touchmove', onMove);
    window.addEventListener('touchend', onUp);
  };

  const leftPct = isRange ? toPct(low) : 0;
  const rightPct = toPct(high);

  const formatVal = (v: number) => `${prefix}${v}${suffix}`;

  return (
    <div className={`w-full space-y-2 select-none ${disabled ? 'opacity-45 pointer-events-none' : ''} ${className}`}>
      {(label || true) && (
        <div className="flex items-center justify-between text-xs">
          {label ? (
            <span className="font-bold text-[var(--text-primary)]">{label}</span>
          ) : (
            <span />
          )}
          <span className="font-mono font-bold text-[#2BB5FF]">
            {isRange ? `${formatVal(low)} – ${formatVal(high)}` : formatVal(high)}
          </span>
        </div>
      )}

      <div
        ref={trackRef}
        onMouseDown={(e) => startDrag(e.clientX)}
        onTouchStart={(e) => e.touches[0] && startDrag(e.touches[0].clientX)}
        className={`relative flex items-center cursor-pointer touch-none ${
          variant === 'pill' ? 'h-8' : 'h-6'
        }`}
      >
        {/* Track Background */}
        <div
          className={`w-full rounded-full bg-[var(--bg-secondary)] border border-[var(--border-subtle)] overflow-hidden ${
            variant === 'pill' ? 'h-2.5' : 'h-2'
          }`}
        >
          <div
            className={`h-full ${
              resolvedTrackColor === 'emerald'
                ? 'bg-[#58CC02] shadow-[inset_0_-1px_0_rgba(0,0,0,0.18)]'
                : 'bg-[var(--color-accent-primary)] shadow-[0_2px_8px_-1px_rgba(43,181,255,0.4)]'
            }`}
            style={{
              marginLeft: `${leftPct}%`,
              width: `${Math.max(0, rightPct - leftPct)}%`,
            }}
          />
        </div>

        {/* Low Thumb (Range mode) */}
        {isRange && (
          <div
            role="slider"
            tabIndex={disabled ? -1 : 0}
            aria-valuemin={min}
            aria-valuemax={high}
            aria-valuenow={low}
            onMouseDown={(e) => {
              e.stopPropagation();
              startDrag(e.clientX, 0);
            }}
            onTouchStart={(e) => {
              e.stopPropagation();
              if (e.touches[0]) startDrag(e.touches[0].clientX, 0);
            }}
            style={{ left: `${leftPct}%` }}
            className={`absolute -translate-x-1/2 flex items-center justify-center transition-transform ${
              variant === 'pill'
                ? `w-11 h-7 rounded-full bg-gradient-to-b from-[#3EC2FF] to-[#1DA1F2] border-2 border-[#0D8CE0] text-white shadow-[0_3px_10px_rgba(43,181,255,0.45),inset_0_1px_1px_rgba(255,255,255,0.55)] ${
                    activeThumb === 0 ? 'scale-105 ring-4 ring-[#2BB5FF]/25' : 'hover:scale-105'
                  }`
                : `w-5 h-5 rounded-full bg-white border-2 border-[#2BB5FF] shadow-md ${
                    activeThumb === 0 ? 'scale-115 ring-4 ring-[#2BB5FF]/20' : 'hover:scale-110'
                  }`
            }`}
          >
            {variant === 'pill' && (
              <span className="flex items-center -space-x-1 text-white">
                <Icon filled={ChevronLeft12Filled} size="xs" />
                <Icon filled={ChevronRight12Filled} size="xs" />
              </span>
            )}
            {showValueTooltip && activeThumb === 0 && (
              <span className="absolute -top-8 left-1/2 -translate-x-1/2 px-1.5 py-0.5 rounded-md bg-[var(--text-primary)] text-[var(--bg-primary)] text-[10px] font-mono font-bold whitespace-nowrap shadow-sm">
                {formatVal(low)}
              </span>
            )}
          </div>
        )}

        {/* High / Primary Thumb */}
        <div
          role="slider"
          tabIndex={disabled ? -1 : 0}
          aria-valuemin={isRange ? low : min}
          aria-valuemax={max}
          aria-valuenow={high}
          onMouseDown={(e) => {
            e.stopPropagation();
            startDrag(e.clientX, 1);
          }}
          onTouchStart={(e) => {
            e.stopPropagation();
            if (e.touches[0]) startDrag(e.touches[0].clientX, 1);
          }}
          style={{ left: `${rightPct}%` }}
          className={`absolute -translate-x-1/2 flex items-center justify-center transition-transform ${
            variant === 'pill'
              ? `w-11 h-7 rounded-full bg-gradient-to-b from-[#3EC2FF] to-[#1DA1F2] border-2 border-[#0D8CE0] text-white shadow-[0_3px_10px_rgba(43,181,255,0.45),inset_0_1px_1px_rgba(255,255,255,0.55)] ${
                  activeThumb === 1 ? 'scale-105 ring-4 ring-[#2BB5FF]/25' : 'hover:scale-105'
                }`
              : `w-5 h-5 rounded-full bg-white border-2 border-[#2BB5FF] shadow-md ${
                  activeThumb === 1 ? 'scale-115 ring-4 ring-[#2BB5FF]/20' : 'hover:scale-110'
                }`
          }`}
        >
          {variant === 'pill' && (
            <span className="flex items-center -space-x-1 text-white">
              <Icon filled={ChevronLeft12Filled} size="xs" />
              <Icon filled={ChevronRight12Filled} size="xs" />
            </span>
          )}
          {showValueTooltip && activeThumb === 1 && (
            <span className="absolute -top-8 left-1/2 -translate-x-1/2 px-1.5 py-0.5 rounded-md bg-[var(--text-primary)] text-[var(--bg-primary)] text-[10px] font-mono font-bold whitespace-nowrap shadow-sm">
              {formatVal(high)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
