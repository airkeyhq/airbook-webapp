'use client';

import React from 'react';
import { Avatar } from '@/components/primitives/Avatar';
import { Tooltip } from '@/components/primitives/Tooltip';
import { NowLine } from '@/components/primitives/NowLine';

export interface GanttTask {
  id: string;
  title: string;
  subtitle?: string;
  /** Start position on the axis (e.g. hour 9.5 for 9:30 AM) */
  start: number;
  /** End position on the axis (e.g. hour 11 for 11:00 AM) */
  end: number;
  color?: 'blue' | 'emerald' | 'amber' | 'rose' | 'subtle';
  assignee?: { name: string; src?: string };
  meta?: string;
}

export interface GanttChartProps {
  tasks: GanttTask[];
  /** Axis start value (e.g. 9 for 9 AM) @default 9 */
  min?: number;
  /** Axis end value (e.g. 19 for 7 PM) @default 19 */
  max?: number;
  /** Optional current-time marker on the axis (e.g. 13.5 for 1:30 PM) */
  now?: number;
  /** Custom axis tick formatter */
  formatTick?: (value: number) => string;
  onTaskClick?: (task: GanttTask) => void;
  className?: string;
}

const BAR_COLORS: Record<NonNullable<GanttTask['color']>, string> = {
  blue: 'bg-[#2BB5FF] text-white border-[#1A8EFF]/30 shadow-[0_2px_8px_-2px_rgba(43,181,255,0.45)]',
  emerald: 'bg-emerald-500 text-white border-emerald-600/30 shadow-[0_2px_8px_-2px_rgba(16,185,129,0.4)]',
  amber: 'bg-amber-500 text-white border-amber-600/30 shadow-[0_2px_8px_-2px_rgba(245,158,11,0.4)]',
  rose: 'bg-rose-500 text-white border-rose-600/30 shadow-[0_2px_8px_-2px_rgba(244,63,94,0.4)]',
  subtle: 'bg-slate-500 text-white border-slate-600/30',
};

function defaultFormatHour(h: number): string {
  const whole = Math.floor(h);
  if (whole === 0 || whole === 24) return '12a';
  if (whole === 12) return '12p';
  return whole > 12 ? `${whole - 12}p` : `${whole}a`;
}

/**
 * Ozone UI GanttChart composite.
 * Renders horizontal time-range bars along a configurable axis.
 */
export const GanttChart: React.FC<GanttChartProps> = ({
  tasks,
  min = 9,
  max = 19,
  now,
  formatTick = defaultFormatHour,
  onTaskClick,
  className = '',
}) => {
  const span = Math.max(1, max - min);
  const ticks = Array.from({ length: Math.floor(span) + 1 }, (_, i) => min + i);

  return (
    <div
      className={`w-full max-w-full min-w-0 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)]/30 overflow-x-auto ${className}`}
    >
      <div className="min-w-[560px]">
        {/* Header Axis */}
        <div className="grid grid-cols-[128px_1fr] sm:grid-cols-[165px_1fr] lg:grid-cols-[190px_1fr] border-b border-[var(--border-subtle)] bg-[var(--bg-secondary)]/60">
          <div className="sticky left-0 z-10 bg-[var(--bg-secondary)] px-3 sm:px-3.5 py-2.5 text-[10.5px] font-bold uppercase tracking-wider text-[var(--text-muted)] border-r border-[var(--border-subtle)]">
            Schedule
          </div>
          <div className="relative h-9 flex items-center">
            {ticks.map((tick) => {
              const leftPct = ((tick - min) / span) * 100;
              return (
                <div
                  key={tick}
                  style={{ left: `${leftPct}%` }}
                  className="absolute -translate-x-1/2 text-[10px] font-mono font-bold text-[var(--text-muted)] select-none"
                >
                  {formatTick(tick)}
                </div>
              );
            })}
          </div>
        </div>

        {/* Task Rows */}
        <div className="divide-y divide-[var(--border-subtle)]">
          {tasks.map((task, idx) => {
            const clampedStart = Math.max(min, Math.min(max, task.start));
            const clampedEnd = Math.max(clampedStart + 0.35, Math.min(max, task.end));
            const leftPct = ((clampedStart - min) / span) * 100;
            const widthPct = Math.max(6, ((clampedEnd - clampedStart) / span) * 100);

            return (
              <div
                key={task.id}
                className="grid grid-cols-[128px_1fr] sm:grid-cols-[165px_1fr] lg:grid-cols-[190px_1fr] items-center hover:bg-[var(--bg-secondary)]/40 transition-colors"
              >
                {/* Left Label (sticky on phone/tablet horizontal scroll) */}
                <div className="sticky left-0 z-10 bg-[var(--bg-primary)] px-3 sm:px-3.5 py-2.5 border-r border-[var(--border-subtle)] flex items-center gap-2 min-w-0">
                  {task.assignee && (
                    <Avatar
                      size="xs"
                      src={task.assignee.src}
                      fallback={task.assignee.name.slice(0, 2).toUpperCase()}
                      className="!w-5 !h-5 !text-[9px] flex-shrink-0"
                    />
                  )}
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-[var(--text-primary)] truncate">
                      {task.title}
                    </div>
                    {task.subtitle && (
                      <div className="text-[10px] text-[var(--text-muted)] truncate">
                        {task.subtitle}
                      </div>
                    )}
                  </div>
                </div>

                {/* Bar Track */}
                <div className="relative h-11 flex items-center">
                  {ticks.map((tick) => (
                    <div
                      key={tick}
                      style={{ left: `${((tick - min) / span) * 100}%` }}
                      className="absolute inset-y-0 w-px bg-[var(--border-subtle)]/50 pointer-events-none"
                    />
                  ))}

                  {now !== undefined && now >= min && now <= max && (
                    <NowLine
                      orientation="vertical"
                      offset={`${((now - min) / span) * 100}%`}
                      showDot={idx === 0}
                      ping={idx === 0}
                    />
                  )}

                  <div
                    style={{ left: `${leftPct}%`, width: `${widthPct}%` }}
                    className="absolute px-1"
                  >
                    <Tooltip
                      preferredVertical={idx === 0 ? 'bottom' : 'top'}
                      content={
                        <div className="text-[11px] space-y-0.5">
                          <div className="font-bold">{task.title}</div>
                          {task.subtitle && <div className="opacity-80">{task.subtitle}</div>}
                          {task.meta && <div className="font-mono opacity-80">{task.meta}</div>}
                        </div>
                      }
                      className="w-full block"
                    >
                      <button
                        type="button"
                        onClick={() => onTaskClick?.(task)}
                        className={`w-full h-7 px-2 rounded-full border text-[10.5px] font-bold flex items-center justify-between gap-1.5 overflow-hidden transition-transform hover:scale-[1.01] cursor-pointer ${
                          BAR_COLORS[task.color || 'blue']
                        }`}
                      >
                        {widthPct < 20 && task.meta ? (
                          <span className="truncate w-full text-center font-mono text-[10px]">
                            {task.meta}
                          </span>
                        ) : (
                          <>
                            <span className="truncate">{task.subtitle || task.title}</span>
                            {task.meta && (
                              <span className="text-[10px] font-mono opacity-90 flex-shrink-0">
                                {task.meta}
                              </span>
                            )}
                          </>
                        )}
                      </button>
                    </Tooltip>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
