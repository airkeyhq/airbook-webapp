'use client';

import React, { useState, forwardRef } from 'react';

export interface FloatingInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  variant?: 'floating' | 'stacked';
  rightElement?: React.ReactNode;
  icon?: React.ReactNode;
  containerClassName?: string;
}

export const FloatingInput = forwardRef<HTMLInputElement, FloatingInputProps>(
  (
    {
      label,
      variant = 'floating',
      rightElement,
      icon,
      containerClassName = '',
      className = '',
      value,
      defaultValue,
      placeholder,
      onFocus,
      onBlur,
      ...props
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = useState(false);

    // Check if input has value (controlled or uncontrolled)
    const hasValue =
      value !== undefined
        ? String(value).length > 0
        : defaultValue !== undefined
        ? String(defaultValue).length > 0
        : false;

    const isFloatingActive = variant === 'stacked' || isFocused || hasValue;

    return (
      <div
        className={`relative w-full h-[52px] rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] px-4 flex items-center justify-between gap-2.5 transition-all duration-150 ease-out hover:border-black/20 dark:hover:border-white/20 ${
          isFocused ? 'border-[var(--color-accent-primary)] ring-2 ring-[#1A8EFF]/20' : ''
        } ${containerClassName}`}
      >
        <div className="flex items-center gap-2.5 min-w-0 flex-1 h-full">
          {icon && <span className="flex-shrink-0 text-[var(--text-muted)]">{icon}</span>}

          <div className="relative min-w-0 flex-1 h-full flex flex-col justify-center">
            {/* Animated Floating Label */}
            <span
              className={`absolute left-0 pointer-events-none select-none transition-all duration-150 ease-out truncate max-w-full ${
                isFloatingActive
                  ? 'top-2 text-[10px] uppercase font-bold tracking-wider text-[var(--text-muted)]'
                  : 'top-1/2 -translate-y-1/2 text-xs font-medium text-[var(--text-muted)]'
              }`}
            >
              {label}
            </span>

            {/* Input field */}
            <input
              ref={ref}
              value={value}
              defaultValue={defaultValue}
              placeholder={isFloatingActive ? placeholder : ''}
              onFocus={(e) => {
                setIsFocused(true);
                onFocus?.(e);
              }}
              onBlur={(e) => {
                setIsFocused(false);
                onBlur?.(e);
              }}
              className={`w-full bg-transparent border-0 p-0 text-xs font-bold text-[var(--text-primary)] placeholder-[var(--text-muted)]/60 focus:outline-none focus:ring-0 truncate transition-all duration-150 ease-out ${
                isFloatingActive ? 'pt-3.5 opacity-100' : 'opacity-0'
              } ${className}`}
              {...props}
            />
          </div>
        </div>

        {rightElement && <div className="flex-shrink-0 flex items-center">{rightElement}</div>}
      </div>
    );
  }
);

FloatingInput.displayName = 'FloatingInput';

export interface FloatingTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  variant?: 'floating' | 'stacked';
  containerClassName?: string;
}

export const FloatingTextarea = forwardRef<HTMLTextAreaElement, FloatingTextareaProps>(
  (
    {
      label,
      variant = 'floating',
      containerClassName = '',
      className = '',
      value,
      defaultValue,
      placeholder,
      onFocus,
      onBlur,
      rows = 3,
      ...props
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = useState(false);
    const hasValue =
      value !== undefined
        ? String(value).length > 0
        : defaultValue !== undefined
        ? String(defaultValue).length > 0
        : false;

    const isFloatingActive = variant === 'stacked' || isFocused || hasValue;

    return (
      <div
        className={`relative w-full rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] px-4 py-2.5 flex flex-col transition-all duration-150 ease-out hover:border-black/20 dark:hover:border-white/20 ${
          isFocused ? 'border-[var(--color-accent-primary)] ring-2 ring-[#1A8EFF]/20' : ''
        } ${containerClassName}`}
      >
        <span
          className={`pointer-events-none select-none transition-all duration-150 ease-out truncate block ${
            isFloatingActive
              ? 'text-[10px] uppercase font-bold tracking-wider text-[var(--text-muted)] mb-1'
              : 'text-xs font-medium text-[var(--text-muted)] mb-1'
          }`}
        >
          {label}
        </span>
        <textarea
          ref={ref}
          rows={rows}
          value={value}
          defaultValue={defaultValue}
          placeholder={isFloatingActive ? placeholder : ''}
          onFocus={(e) => {
            setIsFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            onBlur?.(e);
          }}
          className={`w-full bg-transparent border-0 p-0 text-xs font-bold text-[var(--text-primary)] placeholder-[var(--text-muted)]/60 focus:outline-none focus:ring-0 resize-none ${className}`}
          {...props}
        />
      </div>
    );
  }
);

FloatingTextarea.displayName = 'FloatingTextarea';
