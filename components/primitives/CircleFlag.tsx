'use client';

import * as React from 'react';

export interface CircleFlagProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  /**
   * Two-letter ISO 3166-1 alpha-2 country code (e.g. 'mx', 'us', 'gb', 'es', 'ca', 'de', 'jp', 'br').
   */
  countryCode: string;
  /**
   * Size in pixels or CSS size string.
   * @default 16
   */
  size?: number | string;
  /**
   * CDN base URL for SVG flags.
   * @default 'https://hatscripts.github.io/circle-flags/flags'
   */
  cdnUrl?: string;
}

/**
 * Ozone UI CircleFlag primitive (ported from Mosaic).
 * Renders crisp circular SVG country flags with hairline ring contrast and fallback.
 */
export const CircleFlag = React.forwardRef<HTMLImageElement, CircleFlagProps>(
  (
    {
      countryCode,
      size = 16,
      cdnUrl = 'https://hatscripts.github.io/circle-flags/flags',
      className = '',
      alt,
      ...props
    },
    ref
  ) => {
    const code = countryCode ? countryCode.toLowerCase().trim() : 'xx';
    const src = `${cdnUrl}/${code}.svg`;
    const dimension = typeof size === 'number' ? `${size}px` : size;

    return (
      <span
        className={`inline-flex shrink-0 items-center justify-center rounded-full overflow-hidden select-none ring-1 ring-black/[0.08] dark:ring-white/[0.12] bg-[var(--bg-secondary)] ${className}`}
        style={{ width: dimension, height: dimension }}
      >
        <img
          ref={ref}
          src={src}
          alt={alt || `${countryCode.toUpperCase()} flag`}
          loading="lazy"
          className="h-full w-full object-cover rounded-full"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = `${cdnUrl}/xx.svg`;
          }}
          {...props}
        />
      </span>
    );
  }
);

CircleFlag.displayName = 'CircleFlag';
