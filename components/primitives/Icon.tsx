'use client';

import React from 'react';

export type FluentIconComponent = React.ComponentType<{ className?: string }>;
export type IconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type IconTone =
  | 'inherit'
  | 'primary'
  | 'secondary'
  | 'muted'
  | 'accent'
  | 'success'
  | 'warning'
  | 'danger';

export interface IconProps {
  /** Outline (*Regular) icon for display or inactive states */
  regular?: FluentIconComponent;
  /** Filled (*Filled) icon for actions or active states */
  filled?: FluentIconComponent;
  /** When true, prefers `filled` over `regular` @default false */
  active?: boolean;
  /** Size token @default 'md' */
  size?: IconSize;
  /** Color tone token @default 'inherit' */
  tone?: IconTone;
  /** Spin animation (e.g. sync/refresh) */
  spin?: boolean;
  className?: string;
}

const SIZE_CLASSES: Record<IconSize, string> = {
  xs: 'w-3 h-3',
  sm: 'w-3.5 h-3.5',
  md: 'w-4 h-4',
  lg: 'w-5 h-5',
  xl: 'w-6 h-6',
};

const TONE_CLASSES: Record<IconTone, string> = {
  inherit: '',
  primary: 'text-[var(--text-primary)]',
  secondary: 'text-[var(--text-secondary)]',
  muted: 'text-[var(--text-muted)]',
  accent: 'text-[#2BB5FF]',
  success: 'text-emerald-500',
  warning: 'text-amber-500',
  danger: 'text-rose-500',
};

/**
 * Ozone UI Icon primitive.
 * Tree-shakeable wrapper enforcing the outline-for-display (`regular`) vs filled-for-actions (`filled`) rule.
 */
export const Icon: React.FC<IconProps> = ({
  regular: RegularIcon,
  filled: FilledIcon,
  active = false,
  size = 'md',
  tone = 'inherit',
  spin = false,
  className = '',
}) => {
  const Component = active
    ? FilledIcon || RegularIcon
    : RegularIcon || FilledIcon;

  if (!Component) return null;

  return (
    <Component
      className={`flex-shrink-0 ${SIZE_CLASSES[size]} ${TONE_CLASSES[tone]} ${
        spin ? 'animate-spin' : ''
      } ${className}`}
    />
  );
};
