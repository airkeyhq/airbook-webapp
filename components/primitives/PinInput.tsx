'use client';

import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { SparkleBurst } from './SparkleBurst';

export interface PinInputProps {
  /** Number of OTP / PIN digits @default 6 */
  length?: number;
  /** Controlled value */
  value?: string;
  /** Initial uncontrolled value */
  defaultValue?: string;
  onChange?: (value: string) => void;
  onComplete?: (value: string) => void;
  /** Mask digits (e.g. kiosk PIN entry) */
  mask?: boolean;
  /** Restrict input characters @default 'numeric' */
  type?: 'numeric' | 'alphanumeric';
  /** Error state */
  error?: boolean;
  /** Increment to force-replay the error shake even when `error` is already true */
  errorKey?: number;
  disabled?: boolean;
  /** Trigger SparkleBurst when all digits are filled (or when `success` becomes true) */
  spark?: boolean;
  /** Optional explicit validation success flag; when provided, sparkles only fire when `success` is true */
  success?: boolean;
  /** Called when user presses Enter */
  onSubmit?: (value: string) => void;
  label?: string;
  helperText?: string;
  className?: string;
}

/**
 * Ozone UI OTP / PIN Input primitive.
 * Supports auto-advance, backspace navigation, paste, masked mode, and completion sparkles.
 */
export const PinInput: React.FC<PinInputProps> = ({
  length = 6,
  value: controlledValue,
  defaultValue = '',
  onChange,
  onComplete,
  mask = false,
  type = 'numeric',
  error = false,
  errorKey,
  disabled = false,
  spark = false,
  success,
  onSubmit,
  label,
  helperText,
  className = '',
}) => {
  const [internalValue, setInternalValue] = useState(defaultValue.slice(0, length));
  const rawValue = controlledValue !== undefined ? controlledValue : internalValue;
  const digits = Array.from({ length }, (_, i) => rawValue[i] || '');

  const [burstKey, setBurstKey] = useState(0);
  const [shakeKey, setShakeKey] = useState(0);
  const prevErrorRef = useRef(false);
  const prevLengthRef = useRef(rawValue.length);
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => {
    if (error && !prevErrorRef.current) {
      setShakeKey((k) => k + 1);
    }
    prevErrorRef.current = error;
  }, [error]);

  useEffect(() => {
    if (error && errorKey !== undefined) {
      setShakeKey((k) => k + 1);
    }
  }, [error, errorKey]);

  useEffect(() => {
    if (!spark || error) {
      prevLengthRef.current = rawValue.length;
      return;
    }
    if (success !== undefined) {
      if (success && rawValue.length === length) {
        setBurstKey((k) => k + 1);
      }
    } else if (rawValue.length === length && prevLengthRef.current < length) {
      setBurstKey((k) => k + 1);
    }
    prevLengthRef.current = rawValue.length;
  }, [rawValue.length, length, spark, error, success]);

  useEffect(() => {
    if (controlledValue !== undefined) {
      setInternalValue(controlledValue.slice(0, length));
    }
  }, [controlledValue, length]);

  const sanitize = (char: string) => {
    if (type === 'numeric') return char.replace(/[^0-9]/g, '');
    return char.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
  };

  const commitValue = (next: string) => {
    const clipped = next.slice(0, length);
    if (controlledValue === undefined) {
      setInternalValue(clipped);
    }
    onChange?.(clipped);
    if (clipped.length === length) {
      if (error) {
        setShakeKey((k) => k + 1);
      }
      onComplete?.(clipped);
    }
  };

  const handleChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;
    const cleaned = sanitize(e.target.value);
    if (!cleaned) return;

    const char = cleaned[cleaned.length - 1];
    const nextDigits = [...digits];
    nextDigits[index] = char;
    commitValue(nextDigits.join(''));

    if (index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (disabled) return;
    if (e.key === 'Backspace') {
      e.preventDefault();
      const nextDigits = [...digits];
      if (nextDigits[index]) {
        nextDigits[index] = '';
        commitValue(nextDigits.join(''));
      } else if (index > 0) {
        nextDigits[index - 1] = '';
        commitValue(nextDigits.join(''));
        inputRefs.current[index - 1]?.focus();
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      e.preventDefault();
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < length - 1) {
      e.preventDefault();
      inputRefs.current[index + 1]?.focus();
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (error) setShakeKey((k) => k + 1);
      onSubmit?.(rawValue);
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    if (disabled) return;
    e.preventDefault();
    const pasted = sanitize(e.clipboardData.getData('text')).slice(0, length);
    if (!pasted) return;
    commitValue(pasted);
    const focusIdx = Math.min(pasted.length, length - 1);
    inputRefs.current[focusIdx]?.focus();
  };

  return (
    <div className={`inline-flex flex-col gap-2 ${className}`}>
      {label && (
        <span className="text-xs font-bold text-[var(--text-primary)]">{label}</span>
      )}

      <motion.div
        key={shakeKey}
        initial={shakeKey > 0 ? { x: 0 } : false}
        animate={shakeKey > 0 ? { x: [0, -8, 8, -6, 6, -3, 3, 0] } : undefined}
        transition={{ duration: 0.42, ease: 'easeInOut' }}
        className="relative inline-flex items-center gap-2"
      >
        {digits.map((digit, index) => {
          const isFilled = Boolean(digit);
          return (
            <input
              key={index}
              ref={(el) => {
                inputRefs.current[index] = el;
              }}
              type={mask ? 'password' : 'text'}
              inputMode={type === 'numeric' ? 'numeric' : 'text'}
              autoComplete={index === 0 ? 'one-time-code' : 'off'}
              maxLength={2}
              value={digit}
              disabled={disabled}
              aria-label={`Digit ${index + 1} of ${length}`}
              onChange={(e) => handleChange(index, e)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={handlePaste}
              onFocus={(e) => e.target.select()}
              className={`w-11 h-12 rounded-xl border text-center font-mono text-base font-extrabold tabular-nums transition-all duration-150 outline-none select-none ${
                disabled
                  ? 'opacity-40 cursor-not-allowed bg-[var(--bg-secondary)] border-[var(--border-subtle)] text-[var(--text-muted)]'
                  : error
                    ? 'bg-rose-500/5 border-rose-500 text-rose-600 dark:text-rose-400 focus:ring-2 focus:ring-rose-500/25'
                    : isFilled
                      ? 'bg-[var(--bg-primary)] border-[#2BB5FF]/60 text-[var(--text-primary)] shadow-xs focus:border-[#2BB5FF] focus:ring-2 focus:ring-[#2BB5FF]/25'
                      : 'bg-[var(--bg-secondary)] border-[var(--border-subtle)] text-[var(--text-primary)] hover:border-[#2BB5FF]/40 focus:bg-[var(--bg-primary)] focus:border-[#2BB5FF] focus:ring-2 focus:ring-[#2BB5FF]/25'
              }`}
            />
          );
        })}

        {spark && !error && (
          <SparkleBurst
            burstKey={burstKey}
            shape="pill"
            particle="mixed"
            tone="electric"
            distanceScale={1.3}
          />
        )}
      </motion.div>

      {helperText && (
        <span
          className={`text-[11px] font-medium ${
            error ? 'text-rose-500' : 'text-[var(--text-muted)]'
          }`}
        >
          {helperText}
        </span>
      )}
    </div>
  );
};
