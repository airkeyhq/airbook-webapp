'use client';

import * as React from 'react';
import { Tooltip } from './Tooltip';

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The image URL for the avatar.
   */
  src?: string;
  /**
   * Alt text for the avatar image.
   */
  alt?: string;
  /**
   * Text or initials shown when image is missing or failed to load.
   */
  fallback?: string;
  /**
   * Proportional dimension size token:
   * - `xs`: 24px (w-6 h-6)
   * - `sm`: 32px (w-8 h-8)
   * - `md`: 40px (w-10 h-10)
   * - `lg`: 48px (w-12 h-12)
   * - `xl`: 64px (w-16 h-16)
   */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  /**
   * Live availability status indicator ring.
   */
  status?: 'online' | 'busy' | 'offline';
  /**
   * Whether to show a tooltip on hover (uses `tooltip`, `alt`, or `fallback`).
   */
  showTooltip?: boolean;
  /**
   * Custom tooltip content shown when `showTooltip` is true.
   */
  tooltip?: React.ReactNode;
}

const sizeClasses = {
  xs: 'w-6 h-6 text-[10px]',
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-xs',
  lg: 'w-12 h-12 text-sm',
  xl: 'w-16 h-16 text-base',
};

const statusClasses = {
  xs: 'w-1.5 h-1.5 ring-1',
  sm: 'w-2 h-2 ring-[1.5px]',
  md: 'w-2.5 h-2.5 ring-2',
  lg: 'w-3 h-3 ring-2',
  xl: 'w-3.5 h-3.5 ring-2',
};

const statusColors = {
  online: 'bg-emerald-500',
  busy: 'bg-amber-500',
  offline: 'bg-slate-400',
};

export const Avatar: React.FC<AvatarProps> = ({
  src,
  alt = '',
  fallback = 'U',
  size = 'md',
  status,
  showTooltip = false,
  tooltip,
  className = '',
  ...props
}) => {
  const [hasError, setHasError] = React.useState(!src);

  React.useEffect(() => {
    setHasError(!src);
  }, [src]);

  const tooltipContent = tooltip ?? (alt || fallback);

  const avatarNode = (
    <div
      className={`group/avatar relative inline-flex items-center justify-center flex-shrink-0 select-none rounded-full ${sizeClasses[size]} ${className}`}
      {...props}
    >
      <div className="w-full h-full overflow-hidden rounded-full border border-[var(--border-subtle)] bg-[var(--bg-secondary)] flex items-center justify-center">
        {src && !hasError ? (
          <img
            src={src}
            alt={alt}
            onError={() => setHasError(true)}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full text-[var(--text-primary)] font-bold flex items-center justify-center">
            {fallback || alt.slice(0, 2).toUpperCase() || 'U'}
          </div>
        )}
      </div>
      {status && (
        <span
          className={`absolute bottom-0 right-0 rounded-full ring-[var(--bg-primary)] ${statusColors[status]} ${statusClasses[size]}`}
        />
      )}
    </div>
  );

  if (showTooltip && tooltipContent) {
    return <Tooltip content={tooltipContent}>{avatarNode}</Tooltip>;
  }

  return avatarNode;
};

export interface AvatarGroupItem {
  id?: string;
  src?: string;
  alt?: string;
  fallback?: string;
  status?: 'online' | 'busy' | 'offline';
  tooltip?: React.ReactNode;
}

export interface AvatarGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  items: AvatarGroupItem[];
  size?: AvatarProps['size'];
  max?: number;
  extraCount?: number;
  /**
   * Show tooltips when hovering over avatars in the group.
   */
  showTooltip?: boolean;
  /**
   * Show the "+#" overflow avatar badge when there are more items or `extraCount` is set.
   * @default true
   */
  showOverflow?: boolean;
}

const overflowSizeClasses: Record<NonNullable<AvatarProps['size']>, string> = {
  xs: 'w-6 h-6 text-[10px]',
  sm: 'w-8 h-8 text-[11px]',
  md: 'w-10 h-10 text-xs',
  lg: 'w-12 h-12 text-sm',
  xl: 'w-16 h-16 text-base',
};

export const AvatarGroup: React.FC<AvatarGroupProps> = ({
  items,
  size = 'md',
  max,
  extraCount,
  showTooltip = false,
  showOverflow = true,
  className = '',
  ...props
}) => {
  const visibleItems = max !== undefined ? items.slice(0, max) : items;
  const remaining =
    extraCount !== undefined
      ? extraCount
      : max !== undefined && items.length > max
        ? items.length - max
        : 0;

  return (
    <div className={`inline-flex items-center -space-x-2.5 ${className}`} {...props}>
      {visibleItems.map((item, idx) => (
        <Avatar
          key={item.id ?? item.alt ?? idx}
          src={item.src}
          alt={item.alt}
          fallback={item.fallback}
          size={size}
          status={item.status}
          showTooltip={showTooltip}
          tooltip={item.tooltip ?? item.alt ?? item.fallback}
          className="ring-2 ring-[var(--bg-primary)] shadow-xs hover:z-20 hover:scale-110 transition-transform"
        />
      ))}
      {showOverflow && remaining > 0 && (
        <div
          className={`${overflowSizeClasses[size]} rounded-full bg-[var(--bg-secondary)] border-2 border-[var(--bg-primary)] ring-2 ring-[var(--border-subtle)] text-[var(--text-primary)] font-bold flex items-center justify-center select-none shadow-xs`}
        >
          +{remaining}
        </div>
      )}
    </div>
  );
};
