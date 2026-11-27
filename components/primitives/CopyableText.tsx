'use client';

import React, { useState } from 'react';
import { Copy24Filled, Checkmark24Filled } from '@fluentui/react-icons';
import { SparkleBurst } from './SparkleBurst';
import { Icon } from './Icon';

export interface CopyableTextProps {
  value: string;
  label?: string;
  spark?: boolean;
  className?: string;
}

/**
 * Ozone UI CopyableText primitive.
 */
export const CopyableText: React.FC<CopyableTextProps> = ({
  value,
  label,
  spark = true,
  className = '',
}) => {
  const [copied, setCopied] = useState(false);
  const [burstKey, setBurstKey] = useState(0);

  const handleCopy = () => {
    navigator.clipboard?.writeText(value);
    setCopied(true);
    if (spark) setBurstKey((k) => k + 1);
    setTimeout(() => setCopied(false), 1600);
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      title="Click to copy"
      className={`relative inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--bg-secondary)] border border-[var(--border-subtle)] hover:border-[#2BB5FF]/50 text-xs font-mono font-bold text-[var(--text-primary)] transition-all cursor-pointer active:scale-97 select-none ${className}`}
    >
      {label && <span className="font-sans text-[var(--text-muted)] font-semibold">{label}</span>}
      <span className="truncate max-w-[240px]">{value}</span>
      {copied ? (
        <Icon filled={Checkmark24Filled} size="sm" tone="success" />
      ) : (
        <Icon filled={Copy24Filled} size="sm" tone="muted" />
      )}
      {spark && (
        <SparkleBurst
          burstKey={burstKey}
          shape="pill"
          particle="stars"
          tone="emerald"
        />
      )}
    </button>
  );
};
