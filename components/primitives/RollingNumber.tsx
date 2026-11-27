'use client';

import * as React from 'react';

export interface RollingNumberProps extends React.HTMLAttributes<HTMLSpanElement> {
  /**
   * The value to display and animate.
   * Can be a number (e.g. 1420, 8) or formatted string (e.g. "24,850", "98.5%").
   */
  value: string | number;
  prefix?: string;
  suffix?: string;
  /**
   * Whether to animate rolling upward.
   * @default true
   */
  animated?: boolean;
  /**
   * Base duration in milliseconds for the digit roll animation.
   * @default 900
   */
  durationMs?: number;
  /**
   * Delay in milliseconds before animation starts.
   * @default 40
   */
  delayMs?: number;
  /**
   * Stagger delay between sequential digits in milliseconds.
   * @default 45
   */
  staggerMs?: number;
  /**
   * Direction of the roll animation: 'up' (vintage odometer / clock) or 'down'.
   * @default 'up'
   */
  direction?: 'up' | 'down';
}

const DIGITS = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

function SingleDigitRoll({
  digit,
  delayMs,
  durationMs,
  direction = 'up',
}: {
  digit: number;
  delayMs: number;
  durationMs: number;
  direction?: 'up' | 'down';
}) {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    const t = setTimeout(() => setMounted(true), delayMs);
    return () => clearTimeout(t);
  }, [delayMs]);

  const targetPct = mounted ? digit * 10 : 0;
  const transform =
    direction === 'up'
      ? `translate3d(0, -${targetPct}%, 0)`
      : `translate3d(0, ${targetPct}%, 0)`;

  return (
    <span
      className="inline-block relative overflow-hidden h-[1.15em] leading-[1.15em] align-top select-none pointer-events-none"
      style={{
        maskImage:
          'linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)',
        WebkitMaskImage:
          'linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)',
      }}
      aria-hidden="true"
    >
      <span
        className="flex flex-col transition-transform will-change-transform"
        style={{
          transform,
          transitionDuration: `${durationMs}ms`,
          transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {DIGITS.map((d) => (
          <span key={d} className="h-[1.15em] flex items-center justify-center font-mono">
            {d}
          </span>
        ))}
      </span>
    </span>
  );
}

/**
 * Ozone UI RollingNumber primitive (Mosaic mechanical odometer reel).
 * Smoothly rolls each digit through 0–9 with a top/bottom fade mask gradient.
 */
export const RollingNumber = React.forwardRef<HTMLSpanElement, RollingNumberProps>(
  (
    {
      value,
      prefix = '',
      suffix = '',
      animated = true,
      durationMs = 900,
      delayMs = 40,
      staggerMs = 45,
      direction = 'up',
      className = '',
      ...props
    },
    ref
  ) => {
    const str = `${prefix}${value}${suffix}`;

    if (!animated || str === '') {
      return (
        <span
          ref={ref}
          className={`inline-block font-mono tabular-nums ${className}`}
          {...props}
        >
          {str}
        </span>
      );
    }

    const chars = str.split('');
    let digitIndex = 0;

    return (
      <span
        ref={ref}
        className={`inline-flex items-baseline font-mono tabular-nums ${className}`}
        aria-label={str}
        {...props}
      >
        {chars.map((ch, idx) => {
          const isDigit = ch >= '0' && ch <= '9';
          if (!isDigit) {
            return (
              <span key={`char-${idx}`} className="inline-block">
                {ch}
              </span>
            );
          }

          const currentDigit = parseInt(ch, 10);
          const staggerDelay = delayMs + digitIndex * staggerMs;
          digitIndex += 1;

          return (
            <SingleDigitRoll
              key={`digit-${idx}`}
              digit={currentDigit}
              delayMs={staggerDelay}
              durationMs={durationMs}
              direction={direction}
            />
          );
        })}
      </span>
    );
  }
);

RollingNumber.displayName = 'RollingNumber';
