'use client';

import React, { useId, useState } from 'react';

export interface FloatingTextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  helperText?: string;
  error?: boolean;
}

/**
 * Ozone UI FloatingTextarea primitive.
 * Multiline companion to FloatingInput with micro overline label and character counter.
 */
export const FloatingTextarea = React.forwardRef<HTMLTextAreaElement, FloatingTextareaProps>(
  (
    {
      id: customId,
      label,
      helperText,
      error = false,
      disabled = false,
      maxLength,
      value,
      defaultValue,
      onChange,
      onFocus,
      onBlur,
      className = '',
      rows = 3,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const textareaId = customId || generatedId;
    const [isFocused, setIsFocused] = useState(false);
    const [charCount, setCharCount] = useState(() => {
      if (value !== undefined && value !== null) return String(value).length;
      if (defaultValue !== undefined && defaultValue !== null) return String(defaultValue).length;
      return 0;
    });

    const isFloated = isFocused || charCount > 0;

    return (
      <div className="flex flex-col w-full">
        <div
          className={`relative w-full min-h-[104px] rounded-2xl border bg-[var(--bg-secondary)] transition-all duration-150 ${
            disabled
              ? 'opacity-45 cursor-not-allowed border-[var(--border-subtle)]'
              : error
                ? 'border-rose-500 ring-2 ring-rose-500/20 bg-[var(--bg-primary)]'
                : isFocused
                  ? 'border-[#2BB5FF] ring-2 ring-[#2BB5FF]/20 bg-[var(--bg-primary)]'
                  : 'border-[var(--border-subtle)] hover:border-[#2BB5FF]/50'
          } ${className}`}
        >
          <label
            htmlFor={textareaId}
            className={`absolute left-3.5 pointer-events-none transition-all duration-150 ${
              isFloated
                ? 'top-2.5 text-[10px] font-bold uppercase tracking-wider'
                : 'top-4 text-xs font-medium'
            } ${
              error
                ? 'text-rose-500'
                : isFocused
                  ? 'text-[#2BB5FF]'
                  : 'text-[var(--text-muted)]'
            }`}
          >
            {label}
          </label>

          <textarea
            id={textareaId}
            ref={ref}
            rows={rows}
            disabled={disabled}
            maxLength={maxLength}
            value={value}
            defaultValue={defaultValue}
            onFocus={(e) => {
              setIsFocused(true);
              onFocus?.(e);
            }}
            onBlur={(e) => {
              setIsFocused(false);
              onBlur?.(e);
            }}
            onChange={(e) => {
              setCharCount(e.target.value.length);
              onChange?.(e);
            }}
            className="w-full bg-transparent px-3.5 pt-7 pb-3 text-xs font-medium text-[var(--text-primary)] outline-none resize-y min-h-[96px]"
            {...props}
          />
        </div>

        {(helperText || maxLength !== undefined) && (
          <div className="mt-1.5 flex items-center justify-between gap-2 px-1 text-[11px]">
            <span className={error ? 'text-rose-500 font-medium' : 'text-[var(--text-muted)]'}>
              {helperText}
            </span>
            {maxLength !== undefined && (
              <span className="font-mono text-[10px] text-[var(--text-muted)] flex-shrink-0">
                {charCount}/{maxLength}
              </span>
            )}
          </div>
        )}
      </div>
    );
  }
);

FloatingTextarea.displayName = 'FloatingTextarea';
