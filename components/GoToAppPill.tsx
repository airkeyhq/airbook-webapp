'use client';

import React from 'react';
import Link from 'next/link';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { getAvatarUrl } from '@/lib/avatars';
import { ArrowRight24Filled } from '@fluentui/react-icons';

export interface GoToAppPillProps {
  name?: string | null;
  image?: string | null;
  email?: string | null;
  href?: string;
  className?: string;
  onClick?: () => void;
}

/**
 * GoToAppPill - Authentic Concentric Nested Capsule Component
 *
 * Geometric Harmony Formula:
 * Outer Radius (20px) = Inner Radius (14px) + Padding (6px)
 * Inner Radius (14px) = Outer Radius (20px) - Padding (6px)
 */
export const GoToAppPill: React.FC<GoToAppPillProps> = ({
  name,
  image,
  email,
  href = '/dashboard',
  className = '',
  onClick,
}) => {
  const { t } = useTranslation();
  const displayName = name || email || 'Account';

  return (
    <Link
      href={href}
      onClick={onClick}
      className={`h-10 flex items-center gap-2 p-[6px] rounded-full bg-[var(--bg-secondary)] hover:bg-[var(--border-subtle)]/60 border border-[var(--border-subtle)] hover:border-[#2BB5FF]/50 shadow-xs transition-all group cursor-pointer flex-shrink-0 select-none ${className}`}
      title={`${displayName} · ${t('goToApp')}`}
    >
      {/* 28px Avatar with Concentric Margin & Live Indicator */}
      <div className="relative flex-shrink-0 w-7 h-7">
        <img
          src={getAvatarUrl(name || 'User', image)}
          alt={displayName}
          className="w-7 h-7 rounded-full object-cover ring-2 ring-[var(--bg-primary)]"
        />
        <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-500 ring-1.5 ring-white dark:ring-black" />
      </div>

      {/* 28px Tactile Electric Blue Inner Pill Button */}
      <span className="btn-primary !h-7 !px-3 !rounded-full text-[11px] font-black flex items-center gap-1 shadow-xs flex-shrink-0">
        <span>{t('goToApp')}</span>
        <ArrowRight24Filled className="w-3 h-3" />
      </span>
    </Link>
  );
};
