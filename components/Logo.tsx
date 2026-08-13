'use client';

import React from 'react';
import { motion } from 'framer-motion';

export type LogoVariant = '3d' | 'flat' | 'badge';

export type LogoBadgeStyle = 'pink' | 'grey' | 'dark' | 'blueprint' | 'sky';

export type LogoFlatStyle =
  | 'outline'
  | 'duotone'
  | 'light-outline'
  | 'solid-black'
  | 'solid-grey'
  | 'solid-white';

interface LogoProps {
  size?: number | string;
  className?: string;
  variant?: LogoVariant;
  badgeStyle?: LogoBadgeStyle;
  flatStyle?: LogoFlatStyle;
  showText?: boolean;
  animated?: boolean;
}

/**
 * 3D Claymorphic Circle Cloud Icon with Plump Rounded Plus Cutout
 */
export const CircleCloudIcon3D: React.FC<{ size?: number | string; className?: string }> = ({
  size = 36,
  className = '',
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`select-none transition-transform duration-200 ${className}`}
      aria-label="AirBook 3D Circle Cloud Logo"
    >
      <defs>
        <filter id="cloudShadow3D" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="10" stdDeviation="8" floodColor="#0F172A" floodOpacity="0.22" />
          <feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#0F172A" floodOpacity="0.14" />
        </filter>

        <linearGradient id="cloudBodyGrad3D" x1="50%" y1="0%" x2="50%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="60%" stopColor="#F1F5F9" />
          <stop offset="100%" stopColor="#CBD5E1" />
        </linearGradient>

        <linearGradient id="topHighlightGrad3D" x1="50%" y1="0%" x2="50%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
        </linearGradient>

        <linearGradient id="bottomCushionGrad3D" x1="50%" y1="0%" x2="50%" y2="100%">
          <stop offset="0%" stopColor="#94A3B8" stopOpacity="0" />
          <stop offset="100%" stopColor="#64748B" stopOpacity="0.38" />
        </linearGradient>

        <linearGradient id="outerLobeRimGrad3D" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#94A3B8" stopOpacity="0.4" />
        </linearGradient>

        <linearGradient id="plusRimGrad3D" x1="50%" y1="0%" x2="50%" y2="100%">
          <stop offset="0%" stopColor="#475569" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.8" />
        </linearGradient>
      </defs>

      <g filter="url(#cloudShadow3D)">
        {/* Main Base Path with 6 Soft Outer Cloud Circles */}
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          fill="url(#cloudBodyGrad3D)"
          d="
            M 68.00,45.01 
            Q 100.00,15.00 132.00,45.01 
            Q 174.05,57.12 164.00,100.00 
            Q 174.05,142.88 132.00,154.99 
            Q 100.00,185.00 68.00,154.99 
            Q 25.95,142.88 36.00,100.00 
            Q 25.95,57.12 68.00,45.01 Z 
            
            M 88,72
            A 12,12 0 0,1 112,72
            L 112,84
            A 4,4 0 0,0 116,88
            L 128,88
            A 12,12 0 0,1 128,112
            L 116,112
            A 4,4 0 0,0 112,116
            L 112,128
            A 12,12 0 0,1 88,128
            L 88,116
            A 4,4 0 0,0 84,112
            L 72,112
            A 12,12 0 0,1 72,88
            L 84,88
            A 4,4 0 0,0 88,84
            Z
          "
        />

        {/* Top Gloss Highlight Overlay */}
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          fill="url(#topHighlightGrad3D)"
          opacity="0.85"
          d="
            M 68.00,45.01 
            Q 100.00,15.00 132.00,45.01 
            Q 174.05,57.12 164.00,100.00 
            Q 174.05,142.88 132.00,154.99 
            Q 100.00,185.00 68.00,154.99 
            Q 25.95,142.88 36.00,100.00 
            Q 25.95,57.12 68.00,45.01 Z 
            
            M 88,72
            A 12,12 0 0,1 112,72
            L 112,84
            A 4,4 0 0,0 116,88
            L 128,88
            A 12,12 0 0,1 128,112
            L 116,112
            A 4,4 0 0,0 112,116
            L 112,128
            A 12,12 0 0,1 88,128
            L 88,116
            A 4,4 0 0,0 84,112
            L 72,112
            A 12,12 0 0,1 72,88
            L 84,88
            A 4,4 0 0,0 88,84
            Z
          "
        />

        {/* Bottom Ambient Cushion Shadow */}
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          fill="url(#bottomCushionGrad3D)"
          d="
            M 68.00,45.01 
            Q 100.00,15.00 132.00,45.01 
            Q 174.05,57.12 164.00,100.00 
            Q 174.05,142.88 132.00,154.99 
            Q 100.00,185.00 68.00,154.99 
            Q 25.95,142.88 36.00,100.00 
            Q 25.95,57.12 68.00,45.01 Z 
            
            M 88,72
            A 12,12 0 0,1 112,72
            L 112,84
            A 4,4 0 0,0 116,88
            L 128,88
            A 12,12 0 0,1 128,112
            L 116,112
            A 4,4 0 0,0 112,116
            L 112,128
            A 12,12 0 0,1 88,128
            L 88,116
            A 4,4 0 0,0 84,112
            L 72,112
            A 12,12 0 0,1 72,88
            L 84,88
            A 4,4 0 0,0 88,84
            Z
          "
        />

        {/* Subtle Outer Lobe Soft Definition Rim */}
        <path
          d="
            M 68.00,45.01 
            Q 100.00,15.00 132.00,45.01 
            Q 174.05,57.12 164.00,100.00 
            Q 174.05,142.88 132.00,154.99 
            Q 100.00,185.00 68.00,154.99 
            Q 25.95,142.88 36.00,100.00 
            Q 25.95,57.12 68.00,45.01 Z
          "
          fill="none"
          stroke="url(#outerLobeRimGrad3D)"
          strokeWidth="1.5"
          opacity="0.4"
        />

        {/* Plus Cutout Inner Rim 3D Bevel Line */}
        <path
          d="
            M 88,72
            A 12,12 0 0,1 112,72
            L 112,84
            A 4,4 0 0,0 116,88
            L 128,88
            A 12,12 0 0,1 128,112
            L 116,112
            A 4,4 0 0,0 112,116
            L 112,128
            A 12,12 0 0,1 88,128
            L 88,116
            A 4,4 0 0,0 84,112
            L 72,112
            A 12,12 0 0,1 72,88
            L 84,88
            A 4,4 0 0,0 88,84
            Z
          "
          fill="none"
          stroke="url(#plusRimGrad3D)"
          strokeWidth="2.5"
          opacity="0.75"
        />
      </g>
    </svg>
  );
};

/**
 * Flat Monochromatic / Outline Vector Icon Variant
 */
export const CircleCloudIconFlat: React.FC<{
  size?: number | string;
  styleType?: LogoFlatStyle;
  className?: string;
}> = ({ size = 36, styleType = 'outline', className = '' }) => {
  const outerPath = `
    M 68.00,45.01 
    Q 100.00,15.00 132.00,45.01 
    Q 174.05,57.12 164.00,100.00 
    Q 174.05,142.88 132.00,154.99 
    Q 100.00,185.00 68.00,154.99 
    Q 25.95,142.88 36.00,100.00 
    Q 25.95,57.12 68.00,45.01 Z
  `;

  const plusPath = `
    M 88,72
    A 12,12 0 0,1 112,72
    L 112,84
    A 4,4 0 0,0 116,88
    L 128,88
    A 12,12 0 0,1 128,112
    L 116,112
    A 4,4 0 0,0 112,116
    L 112,128
    A 12,12 0 0,1 88,128
    L 88,116
    A 4,4 0 0,0 84,112
    L 72,112
    A 12,12 0 0,1 72,88
    L 84,88
    A 4,4 0 0,0 88,84
    Z
  `;

  const combinedCompoundPath = `${outerPath} ${plusPath}`;

  if (styleType === 'outline') {
    return (
      <svg width={size} height={size} viewBox="0 0 200 200" fill="none" className={className}>
        <path
          d={outerPath}
          fill="none"
          stroke="#0F172A"
          strokeWidth="12"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d={plusPath}
          fill="none"
          stroke="#0F172A"
          strokeWidth="12"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  if (styleType === 'duotone') {
    return (
      <svg width={size} height={size} viewBox="0 0 200 200" fill="none" className={className}>
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d={combinedCompoundPath}
          fill="#475569"
          stroke="#0F172A"
          strokeWidth="12"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  if (styleType === 'light-outline') {
    return (
      <svg width={size} height={size} viewBox="0 0 200 200" fill="none" className={className}>
        <path
          d={outerPath}
          fill="none"
          stroke="#CBD5E1"
          strokeWidth="12"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d={plusPath}
          fill="none"
          stroke="#0F172A"
          strokeWidth="12"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  if (styleType === 'solid-black') {
    return (
      <svg width={size} height={size} viewBox="0 0 200 200" fill="none" className={className}>
        <path fillRule="evenodd" clipRule="evenodd" d={combinedCompoundPath} fill="#0F172A" />
      </svg>
    );
  }

  if (styleType === 'solid-grey') {
    return (
      <svg width={size} height={size} viewBox="0 0 200 200" fill="none" className={className}>
        <path fillRule="evenodd" clipRule="evenodd" d={combinedCompoundPath} fill="#94A3B8" />
      </svg>
    );
  }

  // solid-white
  return (
    <svg width={size} height={size} viewBox="0 0 200 200" fill="none" className={className}>
      <path fillRule="evenodd" clipRule="evenodd" d={combinedCompoundPath} fill="#FFFFFF" />
    </svg>
  );
};

/**
 * Blueprint Grid App Badge Container Component
 */
export const BlueprintBadgeIcon: React.FC<{ size?: number }> = ({ size = 64 }) => {
  const outerPath = `
    M 68.00,45.01 
    Q 100.00,15.00 132.00,45.01 
    Q 174.05,57.12 164.00,100.00 
    Q 174.05,142.88 132.00,154.99 
    Q 100.00,185.00 68.00,154.99 
    Q 25.95,142.88 36.00,100.00 
    Q 25.95,57.12 68.00,45.01 Z
  `;
  const plusPath = `
    M 88,72
    A 12,12 0 0,1 112,72
    L 112,84
    A 4,4 0 0,0 116,88
    L 128,88
    A 12,12 0 0,1 128,112
    L 116,112
    A 4,4 0 0,0 112,116
    L 112,128
    A 12,12 0 0,1 88,128
    L 88,116
    A 4,4 0 0,0 84,112
    L 72,112
    A 12,12 0 0,1 72,88
    L 84,88
    A 4,4 0 0,0 88,84
    Z
  `;

  return (
    <div
      className="relative rounded-2xl sm:rounded-[24px] bg-[#1D61F2] p-3 shadow-xl overflow-hidden flex items-center justify-center border border-white/20 select-none"
      style={{ width: size, height: size }}
    >
      {/* Blueprint Grid Lines Overlay */}
      <svg
        className="absolute inset-0 w-full h-full opacity-30 pointer-events-none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern id="blueprintGrid" width="16" height="16" patternUnits="userSpaceOnUse">
            <path d="M 16 0 L 0 0 0 16" fill="none" stroke="#FFFFFF" strokeWidth="0.8" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#blueprintGrid)" />
        {/* Diagonal Blueprint Guide Lines */}
        <line x1="0" y1="0" x2="100%" y2="100%" stroke="#FFFFFF" strokeWidth="0.8" />
        <line x1="100%" y1="0" x2="0" y2="100%" stroke="#FFFFFF" strokeWidth="0.8" />
        <circle cx="50%" cy="50%" r="35%" fill="none" stroke="#FFFFFF" strokeWidth="0.8" strokeDasharray="3 3" />
      </svg>

      {/* Blueprint Vector Line Icon */}
      <svg width={size * 0.65} height={size * 0.65} viewBox="0 0 200 200" fill="none" className="relative z-10">
        <path d={outerPath} fill="none" stroke="#FFFFFF" strokeWidth="6" opacity="0.9" />
        <path d={plusPath} fill="none" stroke="#FFFFFF" strokeWidth="6" opacity="0.9" />
      </svg>
    </div>
  );
};

export const CircleCloudIcon = CircleCloudIcon3D;

/**
 * Main Flexible Logo Component with 3D, Badge, and Flat UI Variants
 */
export const Logo: React.FC<LogoProps> = ({
  size = 36,
  className = '',
  variant = '3d',
  badgeStyle = 'sky',
  flatStyle = 'outline',
  showText = false,
  animated = true,
}) => {
  const numericSize = typeof size === 'number' ? size : 36;

  let IconContent: React.ReactNode;

  if (variant === 'badge') {
    if (badgeStyle === 'pink') {
      IconContent = (
        <div
          className="rounded-2xl sm:rounded-[24px] p-2 bg-gradient-to-b from-[#FFA6B9] to-[#FF8DA1] shadow-xl flex items-center justify-center border border-white/30"
          style={{ width: numericSize + 24, height: numericSize + 24 }}
        >
          <CircleCloudIcon3D size={numericSize} />
        </div>
      );
    } else if (badgeStyle === 'grey') {
      IconContent = (
        <div
          className="rounded-2xl sm:rounded-[24px] p-2 bg-gradient-to-b from-[#D1D5DB] to-[#9CA3AF] shadow-xl flex items-center justify-center border border-white/40"
          style={{ width: numericSize + 24, height: numericSize + 24 }}
        >
          <CircleCloudIcon3D size={numericSize} />
        </div>
      );
    } else if (badgeStyle === 'dark') {
      IconContent = (
        <div
          className="rounded-2xl sm:rounded-[24px] p-2 bg-gradient-to-b from-[#1E293B] to-[#0F172A] shadow-xl flex items-center justify-center border border-white/10"
          style={{ width: numericSize + 24, height: numericSize + 24 }}
        >
          <CircleCloudIcon3D size={numericSize} />
        </div>
      );
    } else if (badgeStyle === 'blueprint') {
      IconContent = <BlueprintBadgeIcon size={numericSize + 24} />;
    } else {
      // sky
      IconContent = (
        <div
          className="rounded-2xl sm:rounded-[24px] p-2 bg-gradient-to-b from-[#38BDF8] via-[#0284C7] to-[#0369A1] shadow-xl flex items-center justify-center border border-white/20"
          style={{ width: numericSize + 24, height: numericSize + 24 }}
        >
          <CircleCloudIcon3D size={numericSize} />
        </div>
      );
    }
  } else if (variant === 'flat') {
    IconContent = <CircleCloudIconFlat size={size} styleType={flatStyle} className={className} />;
  } else {
    // 3d
    IconContent = <CircleCloudIcon3D size={size} className={className} />;
  }

  if (animated) {
    return (
      <div className="inline-flex items-center gap-3 group select-none">
        <motion.div
          whileHover={{ scale: 1.08, rotate: 4 }}
          whileTap={{ scale: 0.94 }}
          transition={{ type: 'spring', stiffness: 400, damping: 22 }}
          className="flex-shrink-0 cursor-pointer"
        >
          {IconContent}
        </motion.div>
        {showText && (
          <span className="font-extrabold text-lg tracking-tight text-[var(--text-primary)] group-hover:opacity-90 transition-opacity">
            AirBook
          </span>
        )}
      </div>
    );
  }

  return (
    <div className="inline-flex items-center gap-3 select-none">
      <div className="flex-shrink-0">{IconContent}</div>
      {showText && (
        <span className="font-extrabold text-lg tracking-tight text-[var(--text-primary)]">
          AirBook
        </span>
      )}
    </div>
  );
};

export default Logo;
