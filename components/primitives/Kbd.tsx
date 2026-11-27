'use client';

import React from 'react';

export interface KbdProps {
  children: React.ReactNode;
  className?: string;
}

export const Kbd: React.FC<KbdProps> = ({ children, className = '' }) => {
  return (
    <kbd
      className={`inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 text-[10px] font-mono font-bold text-[var(--text-secondary)] bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-[6px] shadow-xs select-none ${className}`}
    >
      {children}
    </kbd>
  );
};
