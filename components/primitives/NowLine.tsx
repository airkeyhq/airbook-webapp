'use client';

import React from 'react';

export interface NowLineProps {
  /** Line direction: horizontal for calendar day grids, vertical for Gantt charts @default 'horizontal' */
  orientation?: 'horizontal' | 'vertical';
  /** CSS offset (`top` for horizontal, `left` for vertical), e.g. `120` (px) or `'42%'` */
  offset?: string | number;
  /** Optional live timestamp label badge */
  label?: string;
  /** Show pulsing halo on the anchor dot @default true */
  ping?: boolean;
  /** Show the anchor dot @default true */
  showDot?: boolean;
  /** Show the continuous line @default true */
  showLine?: boolean;
  className?: string;
}

/**
 * Ozone UI NowLine primitive.
 * Renders the pulsing `#FF3B30` live current-time dot and continuous hairline across TimeGrid and GanttChart.
 */
export const NowLine: React.FC<NowLineProps> = ({
  orientation = 'horizontal',
  offset,
  label,
  ping = true,
  showDot = true,
  showLine = true,
  className = '',
}) => {
  const styleOffset =
    offset === undefined
      ? undefined
      : orientation === 'horizontal'
        ? { top: typeof offset === 'number' ? `${offset}px` : offset }
        : { left: typeof offset === 'number' ? `${offset}px` : offset };

  if (orientation === 'vertical') {
    return (
      <div
        aria-hidden="true"
        style={styleOffset}
        className={`pointer-events-none absolute inset-y-0 z-20 -translate-x-1/2 flex flex-col items-center ${className}`}
      >
        {showDot && (
          <div className="relative flex items-center justify-center -mt-1.5 flex-shrink-0">
            {ping && (
              <span className="absolute w-3.5 h-3.5 rounded-full bg-[#FF3B30]/40 animate-ping" />
            )}
            <span className="w-2.5 h-2.5 rounded-full bg-[#FF3B30] shadow-sm relative z-10" />
          </div>
        )}
        {label && (
          <span className="mt-1 px-1.5 py-0.5 rounded-full bg-[#FF3B30] text-white text-[9px] font-mono font-extrabold leading-none shadow-xs whitespace-nowrap">
            {label}
          </span>
        )}
        {showLine && <div className="w-[2px] flex-1 bg-[#FF3B30] shadow-sm" />}
      </div>
    );
  }

  return (
    <div
      aria-hidden="true"
      style={styleOffset}
      className={`pointer-events-none absolute left-0 right-0 z-30 -translate-y-1/2 flex items-center ${className}`}
    >
      {showDot && (
        <div className="relative flex items-center justify-center -ml-[5px] flex-shrink-0">
          {ping && (
            <span className="absolute w-3.5 h-3.5 rounded-full bg-[#FF3B30]/40 animate-ping" />
          )}
          <span className="w-2.5 h-2.5 rounded-full bg-[#FF3B30] shadow-sm relative z-10" />
        </div>
      )}
      {label && (
        <span className="ml-1.5 px-1.5 py-0.5 rounded-full bg-[#FF3B30] text-white text-[9px] font-mono font-extrabold leading-none shadow-xs whitespace-nowrap flex-shrink-0">
          {label}
        </span>
      )}
      {showLine && <div className="h-[2px] flex-1 bg-[#FF3B30] shadow-sm" />}
    </div>
  );
};
