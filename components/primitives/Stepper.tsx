'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Checkmark24Filled } from '@fluentui/react-icons';
import { Icon } from './Icon';
import { SparkleBurst } from './SparkleBurst';

export interface StepItem {
  id: string;
  label: string;
  description?: string;
  meta?: string;
  icon?: React.ReactNode;
}

export interface StepperProps {
  steps: StepItem[];
  /** 0-based active step index (set >= steps.length when all steps are completed) */
  currentStep: number;
  orientation?: 'horizontal' | 'vertical';
  /** Allow clicking steps to navigate */
  onStepClick?: (index: number) => void;
  /** Trigger SparkleBurst when a step completes */
  spark?: boolean;
  className?: string;
}

/**
 * Ozone UI Stepper / Timeline primitive.
 * Supports horizontal booking wizards and vertical status timelines.
 */
export const Stepper: React.FC<StepperProps> = ({
  steps,
  currentStep,
  orientation = 'horizontal',
  onStepClick,
  spark = false,
  className = '',
}) => {
  const [burstMap, setBurstMap] = useState<Record<number, number>>({});
  const prevStepRef = useRef(currentStep);

  useEffect(() => {
    if (spark && currentStep > prevStepRef.current) {
      const completedIdx = currentStep - 1;
      setBurstMap((prev) => ({
        ...prev,
        [completedIdx]: (prev[completedIdx] || 0) + 1,
      }));
    }
    prevStepRef.current = currentStep;
  }, [currentStep, spark]);

  if (orientation === 'vertical') {
    return (
      <div className={`flex flex-col ${className}`} role="list">
        {steps.map((step, index) => {
          const isCompleted = index < currentStep;
          const isActive = index === currentStep;
          const isLast = index === steps.length - 1;
          const isClickable = Boolean(onStepClick) && index <= currentStep;

          return (
            <div key={step.id} className="relative flex gap-3.5" role="listitem">
              {/* Left Rail: Indicator + Vertical Connector */}
              <div className="flex flex-col items-center">
                <button
                  type="button"
                  disabled={!isClickable}
                  onClick={() => isClickable && onStepClick?.(index)}
                  className={`relative z-10 flex items-center justify-center w-7 h-7 rounded-full text-xs font-extrabold transition-all duration-200 flex-shrink-0 ${
                    isClickable ? 'cursor-pointer' : 'cursor-default'
                  } ${
                    isCompleted
                      ? 'bg-[var(--color-accent-primary)] border border-[#1A8EFF] text-white shadow-[0_2px_8px_-1px_rgba(43,181,255,0.45),inset_0_1px_1px_rgba(255,255,255,0.35)]'
                      : isActive
                        ? 'bg-[var(--bg-primary)] border-2 border-[#2BB5FF] text-[#2BB5FF] ring-4 ring-[#2BB5FF]/15'
                        : 'bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-[var(--text-muted)]'
                  }`}
                >
                  {isCompleted ? (
                    <Icon filled={Checkmark24Filled} size="sm" />
                  ) : step.icon ? (
                    <span className="w-3.5 h-3.5 flex items-center justify-center [&>svg]:w-full [&>svg]:h-full">
                      {step.icon}
                    </span>
                  ) : (
                    <span>{index + 1}</span>
                  )}
                  {spark && (
                    <SparkleBurst
                      burstKey={burstMap[index] || 0}
                      shape="circle"
                      particle="mixed"
                      tone="electric"
                    />
                  )}
                </button>

                {!isLast && (
                  <div className="w-0.5 flex-1 min-h-[28px] my-1 rounded-full bg-[var(--border-subtle)] overflow-hidden">
                    <motion.div
                      initial={false}
                      animate={{ height: isCompleted ? '100%' : '0%' }}
                      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                      className="w-full bg-[#2BB5FF]"
                    />
                  </div>
                )}
              </div>

              {/* Right Content */}
              <div className={`min-w-0 flex-1 ${isLast ? 'pb-0' : 'pb-6'} pt-0.5`}>
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={`text-xs font-bold tracking-tight ${
                      isActive || isCompleted
                        ? 'text-[var(--text-primary)]'
                        : 'text-[var(--text-muted)]'
                    }`}
                  >
                    {step.label}
                  </span>
                  {step.meta && (
                    <span className="text-[10px] font-mono text-[var(--text-muted)] flex-shrink-0">
                      {step.meta}
                    </span>
                  )}
                </div>
                {step.description && (
                  <p className="text-[11px] text-[var(--text-secondary)] mt-0.5 leading-snug">
                    {step.description}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className={`w-full flex items-start ${className}`} role="list">
      {steps.map((step, index) => {
        const isCompleted = index < currentStep;
        const isActive = index === currentStep;
        const isLast = index === steps.length - 1;
        const isClickable = Boolean(onStepClick) && index <= currentStep;

        return (
          <React.Fragment key={step.id}>
            <div className="flex flex-col items-center text-center min-w-[72px]" role="listitem">
              <button
                type="button"
                disabled={!isClickable}
                onClick={() => isClickable && onStepClick?.(index)}
                className={`relative z-10 flex items-center justify-center w-8 h-8 rounded-full text-xs font-extrabold transition-all duration-200 ${
                  isClickable ? 'cursor-pointer' : 'cursor-default'
                } ${
                  isCompleted
                    ? 'bg-[var(--color-accent-primary)] border border-[#1A8EFF] text-white shadow-[0_2px_8px_-1px_rgba(43,181,255,0.45),inset_0_1px_1px_rgba(255,255,255,0.35)]'
                    : isActive
                      ? 'bg-[var(--bg-primary)] border-2 border-[#2BB5FF] text-[#2BB5FF] ring-4 ring-[#2BB5FF]/15'
                      : 'bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-[var(--text-muted)]'
                }`}
              >
                {isCompleted ? (
                  <Icon filled={Checkmark24Filled} size="md" />
                ) : step.icon ? (
                  <span className="w-4 h-4 flex items-center justify-center [&>svg]:w-full [&>svg]:h-full">
                    {step.icon}
                  </span>
                ) : (
                  <span>{index + 1}</span>
                )}
                {spark && (
                  <SparkleBurst
                    burstKey={burstMap[index] || 0}
                    shape="circle"
                    particle="mixed"
                    tone="electric"
                  />
                )}
              </button>

              <span
                className={`mt-2 text-[11px] font-bold leading-tight ${
                  isActive || isCompleted
                    ? 'text-[var(--text-primary)]'
                    : 'text-[var(--text-muted)]'
                }`}
              >
                {step.label}
              </span>
              {step.description && (
                <span className="text-[10px] text-[var(--text-secondary)] mt-0.5 leading-tight max-w-[110px]">
                  {step.description}
                </span>
              )}
            </div>

            {!isLast && (
              <div className="flex-1 h-0.5 mt-4 mx-1 rounded-full bg-[var(--border-subtle)] overflow-hidden">
                <motion.div
                  initial={false}
                  animate={{ width: isCompleted ? '100%' : '0%' }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  className="h-full bg-[#2BB5FF]"
                />
              </div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};
