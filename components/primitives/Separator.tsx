'use client';

import React from 'react';

export interface SeparatorProps {
  orientation?: 'horizontal' | 'vertical';
  className?: string;
  label?: string;
}

export const Separator: React.FC<SeparatorProps> = ({
  orientation = 'horizontal',
  className = '',
  label,
}) => {
  if (label && orientation === 'horizontal') {
    return (
      <div className={`relative flex py-2 items-center w-full ${className}`}>
        <div className="flex-grow border-t border-[var(--border-subtle)]" />
        <span className="flex-shrink mx-3 text-[10px] uppercase font-bold tracking-wider text-[var(--text-muted)] select-none">
          {label}
        </span>
        <div className="flex-grow border-t border-[var(--border-subtle)]" />
      </div>
    );
  }

  if (orientation === 'vertical') {
    return (
      <div
        className={`w-px h-full bg-[var(--border-subtle)] self-stretch inline-block ${className}`}
      />
    );
  }

  return (
    <div
      className={`w-full h-px bg-[var(--border-subtle)] my-2 ${className}`}
    />
  );
};
