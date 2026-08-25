'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAirBookStore } from '@/lib/store';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { CircleCloudIcon } from '@/components/Logo';
import {
  LockClosed24Filled,
  Dismiss24Filled,
  Backspace24Filled,
  ShieldCheckmark24Regular,
} from '@fluentui/react-icons';

export const POSLockScreen: React.FC = () => {
  const { isPosLocked, unlockPos, workspaceName } = useAirBookStore();
  const { t } = useTranslation();

  const [pin, setPin] = useState<string>('');
  const [errorShake, setErrorShake] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleDigit = useCallback(
    (digit: string) => {
      if (pin.length >= 4) return;
      const nextPin = pin + digit;
      setPin(nextPin);
      setErrorMsg(null);

      if (nextPin.length === 4) {
        // Auto-validate on 4th digit
        setTimeout(() => {
          const success = unlockPos(nextPin);
          if (success) {
            setPin('');
            setErrorMsg(null);
          } else {
            setErrorShake(true);
            setErrorMsg(t('posLockIncorrect'));
            setTimeout(() => {
              setPin('');
              setErrorShake(false);
            }, 600);
          }
        }, 120);
      }
    },
    [pin, unlockPos, t]
  );

  const handleBackspace = useCallback(() => {
    setPin((prev) => prev.slice(0, -1));
    setErrorMsg(null);
  }, []);

  const handleClear = useCallback(() => {
    setPin('');
    setErrorMsg(null);
  }, []);

  // Handle Physical Keyboard Inputs
  useEffect(() => {
    if (!isPosLocked) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key >= '0' && e.key <= '9') {
        handleDigit(e.key);
      } else if (e.key === 'Backspace') {
        handleBackspace();
      } else if (e.key === 'Escape' || e.key === 'c' || e.key === 'C') {
        handleClear();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPosLocked, handleDigit, handleBackspace, handleClear]);

  if (!isPosLocked) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/60 dark:bg-black/80 backdrop-blur-2xl p-4 select-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="w-full max-w-sm rounded-[32px] bg-[var(--bg-primary)] border border-[var(--border-subtle)] shadow-2xl p-6 sm:p-8 flex flex-col items-center text-center space-y-6 relative overflow-hidden"
        >
          {/* Top Logo & Station Lock Badge */}
          <div className="flex flex-col items-center space-y-2">
            <div className="relative">
              <div className="w-14 h-14 rounded-2xl bg-black/5 dark:bg-white/5 border border-[var(--border-subtle)] flex items-center justify-center shadow-inner">
                <CircleCloudIcon size={32} />
              </div>
              <div className="absolute -bottom-1.5 -right-1.5 w-6 h-6 rounded-full bg-[var(--color-accent-primary)] text-white flex items-center justify-center border-2 border-[var(--bg-primary)] shadow-sm">
                <LockClosed24Filled className="w-3.5 h-3.5" />
              </div>
            </div>

            <div className="space-y-0.5 pt-1">
              <h2 className="text-base font-extrabold text-[var(--text-primary)] tracking-tight">
                {workspaceName || t('posLockTitle')}
              </h2>
              <p className="text-xs text-[var(--text-secondary)] font-medium">
                {t('posLockSubtitle')}
              </p>
            </div>
          </div>

          {/* 4-Digit PIN Visual Indicators with Shake Animation */}
          <motion.div
            animate={errorShake ? { x: [-10, 10, -8, 8, -4, 4, 0] } : { x: 0 }}
            transition={{ duration: 0.4 }}
            className="flex items-center justify-center gap-4 py-2"
          >
            {[0, 1, 2, 3].map((index) => {
              const isFilled = pin.length > index;
              return (
                <motion.div
                  key={index}
                  animate={{ scale: isFilled ? 1.15 : 1 }}
                  transition={{ duration: 0.12 }}
                  className={`w-4 h-4 rounded-full border-2 transition-all ${
                    isFilled
                      ? 'bg-[var(--color-accent-primary)] border-[var(--color-accent-primary)] shadow-[0_0_12px_rgba(43,181,255,0.6)]'
                      : 'bg-transparent border-[var(--border-subtle)]'
                  }`}
                />
              );
            })}
          </motion.div>

          {/* Error Message */}
          <div className="h-4 flex items-center justify-center">
            {errorMsg && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-xs font-bold text-red-500"
              >
                {errorMsg}
              </motion.p>
            )}
          </div>

          {/* 3x4 Touch Numeric Keypad */}
          <div className="grid grid-cols-3 gap-3 w-full max-w-[260px] mx-auto">
            {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((num) => (
              <button
                key={num}
                type="button"
                onClick={() => handleDigit(num)}
                className="h-14 rounded-2xl bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 active:scale-95 border border-[var(--border-subtle)] text-xl font-bold font-mono text-[var(--text-primary)] transition-all flex items-center justify-center cursor-pointer shadow-xs"
              >
                {num}
              </button>
            ))}

            {/* Clear Button */}
            <button
              type="button"
              onClick={handleClear}
              className="h-14 rounded-2xl bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 active:scale-95 border border-[var(--border-subtle)] text-xs font-extrabold uppercase text-[var(--text-secondary)] transition-all flex items-center justify-center cursor-pointer"
            >
              <Dismiss24Filled className="w-4 h-4" />
            </button>

            {/* Zero Button */}
            <button
              type="button"
              onClick={() => handleDigit('0')}
              className="h-14 rounded-2xl bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 active:scale-95 border border-[var(--border-subtle)] text-xl font-bold font-mono text-[var(--text-primary)] transition-all flex items-center justify-center cursor-pointer shadow-xs"
            >
              0
            </button>

            {/* Backspace Button */}
            <button
              type="button"
              onClick={handleBackspace}
              className="h-14 rounded-2xl bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 active:scale-95 border border-[var(--border-subtle)] text-xs font-extrabold text-[var(--text-secondary)] transition-all flex items-center justify-center cursor-pointer"
            >
              <Backspace24Filled className="w-5 h-5" />
            </button>
          </div>

          {/* Master Unlock / Hint */}
          <div className="pt-2 border-t border-[var(--border-subtle)] w-full flex items-center justify-center text-[10px] text-[var(--text-muted)] gap-1.5">
            <ShieldCheckmark24Regular className="w-3.5 h-3.5 opacity-60" />
            <span>{t('emergencyUnlock')}</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
