'use client';

import React from 'react';

export interface SkeletonProps {
  className?: string;
  variant?: 'rectangular' | 'circular' | 'pill';
  width?: string | number;
  height?: string | number;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className = '',
  variant = 'rectangular',
  width,
  height,
}) => {
  const variantRadius = {
    rectangular: 'rounded-2xl',
    circular: 'rounded-full',
    pill: 'rounded-full',
  }[variant];

  return (
    <div
      style={{ width, height }}
      className={`animate-pulse bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 ${variantRadius} ${className}`}
    />
  );
};
