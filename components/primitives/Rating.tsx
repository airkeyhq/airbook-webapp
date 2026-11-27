'use client';

import React, { useState } from 'react';
import { Star24Filled, Star24Regular } from '@fluentui/react-icons';
import { Icon } from './Icon';
import { SparkleBurst } from './SparkleBurst';

export interface RatingProps {
  value: number;
  onChange?: (value: number) => void;
  max?: number;
  readOnly?: boolean;
  spark?: boolean;
  label?: string;
  className?: string;
}

/**
 * Ozone UI Star Rating primitive.
 */
export const Rating: React.FC<RatingProps> = ({
  value,
  onChange,
  max = 5,
  readOnly = false,
  spark = true,
  label,
  className = '',
}) => {
  const [hoverVal, setHoverVal] = useState<number | null>(null);
  const [burstKey, setBurstKey] = useState(0);

  const displayVal = hoverVal ?? value;

  return (
    <div className={`inline-flex flex-col gap-1.5 ${className}`}>
      {label && (
        <span className="text-xs font-bold text-[var(--text-primary)]">{label}</span>
      )}
      <div
        className="relative inline-flex items-center gap-1 select-none"
        onMouseLeave={() => setHoverVal(null)}
      >
        {Array.from({ length: max }, (_, i) => {
          const starNum = i + 1;
          const isFilled = starNum <= displayVal;
          return (
            <button
              key={starNum}
              type="button"
              disabled={readOnly}
              aria-label={`Rate ${starNum} of ${max}`}
              onMouseEnter={() => !readOnly && setHoverVal(starNum)}
              onClick={() => {
                if (readOnly) return;
                onChange?.(starNum);
                if (spark && starNum === max) {
                  setBurstKey((k) => k + 1);
                }
              }}
              className={`relative p-0.5 transition-transform duration-150 ${
                readOnly
                  ? 'cursor-default'
                  : 'cursor-pointer hover:scale-115 active:scale-95'
              } ${isFilled ? 'text-amber-400' : 'text-[var(--border-subtle)]'}`}
            >
              <Icon
                regular={Star24Regular}
                filled={Star24Filled}
                active={isFilled}
                size="lg"
                className={isFilled ? 'drop-shadow-[0_2px_6px_rgba(245,158,11,0.35)]' : ''}
              />
              {spark && starNum === max && (
                <SparkleBurst
                  burstKey={burstKey}
                  shape="circle"
                  particle="stars"
                  tone="gold"
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
