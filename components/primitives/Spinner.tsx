'use client';

import React from 'react';

export interface SpinnerProps {
  size?: 'xs' | 'sm' | 'md' | 'lg';
  color?: 'primary' | 'white' | 'muted';
  className?: string;
}

export const Spinner: React.FC<SpinnerProps> = ({
  size = 'md',
  color = 'primary',
  className = '',
}) => {
  const sizeClasses = {
    xs: 'w-3.5 h-3.5 border-2',
    sm: 'w-4 h-4 border-2',
    md: 'w-5 h-5 border-[2.5px]',
    lg: 'w-8 h-8 border-3',
  }[size];

  const colorClasses = {
    primary: 'border-[#2BB5FF] border-t-transparent',
    white: 'border-white border-t-transparent',
    muted: 'border-[var(--text-muted)] border-t-transparent',
  }[color];

  return (
    <div
      role="status"
      aria-label="Loading"
      className={`rounded-full animate-spin ${sizeClasses} ${colorClasses} ${className}`}
    />
  );
};
