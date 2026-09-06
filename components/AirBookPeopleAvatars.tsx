'use client';

import React from 'react';
import { motion } from 'framer-motion';

/**
 * 3 Signature AirBook Cloud Character Avatars overlapping horizontally.
 * Designed with smooth claymorphic gradients, soft depth, and friendly smiling faces.
 */
export const AirBookPeopleAvatars: React.FC<{ size?: number; className?: string }> = ({
  size = 48,
  className = '',
}) => {
  return (
    <span
      className={`inline-flex items-center -space-x-4 sm:-space-x-5 align-middle select-none mx-2 ${className}`}
      aria-label="AirBook Team Character Avatars"
    >
      {/* Avatar 1: Soft Lavender Cloud with Cute Happy Smile */}
      <motion.svg
        whileHover={{ y: -3, scale: 1.15, zIndex: 40 }}
        transition={{ type: 'spring', stiffness: 400, damping: 20 }}
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="relative z-10 drop-shadow-[0_4px_8px_rgba(0,0,0,0.12)] cursor-pointer flex-shrink-0"
      >
        <defs>
          <linearGradient id="cloudGradLavender" x1="50%" y1="0%" x2="50%" y2="100%">
            <stop offset="0%" stopColor="#C4B5FD" />
            <stop offset="50%" stopColor="#A78BFA" />
            <stop offset="100%" stopColor="#8B5CF6" />
          </linearGradient>
          <linearGradient id="cloudHighlight" x1="50%" y1="0%" x2="50%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Cloud Body Shape */}
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          fill="url(#cloudGradLavender)"
          d="
            M 34.0,22.5 
            Q 50.0,7.5 66.0,22.5 
            Q 87.0,28.5 82.0,50.0 
            Q 87.0,71.5 66.0,77.5 
            Q 50.0,92.5 34.0,77.5 
            Q 13.0,71.5 18.0,50.0 
            Q 13.0,28.5 34.0,22.5 Z
          "
        />
        {/* Soft Highlight Top */}
        <path
          fill="url(#cloudHighlight)"
          d="
            M 34.0,22.5 
            Q 50.0,7.5 66.0,22.5 
            Q 75.0,25.0 78.0,36.0 
            Q 50.0,28.0 22.0,36.0 
            Q 25.0,25.0 34.0,22.5 Z
          "
          opacity="0.6"
        />
        {/* Friendly Face: Curved Closed Eyes */}
        <path
          d="M 36,46 Q 41,41 46,46"
          stroke="#3B0764"
          strokeWidth="3.2"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M 54,46 Q 59,41 64,46"
          stroke="#3B0764"
          strokeWidth="3.2"
          strokeLinecap="round"
          fill="none"
        />
        {/* Gentle Happy Smile */}
        <path
          d="M 44,55 Q 50,62 56,55"
          stroke="#3B0764"
          strokeWidth="3.2"
          strokeLinecap="round"
          fill="none"
        />
      </motion.svg>

      {/* Avatar 2: Coral / Peach Cloud with Serene Eyes (Elevated Center Layer) */}
      <motion.svg
        whileHover={{ y: -3, scale: 1.15, zIndex: 40 }}
        transition={{ type: 'spring', stiffness: 400, damping: 20 }}
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="relative z-20 drop-shadow-[0_4px_12px_rgba(0,0,0,0.18)] cursor-pointer flex-shrink-0"
      >
        <defs>
          <linearGradient id="cloudGradCoral" x1="50%" y1="0%" x2="50%" y2="100%">
            <stop offset="0%" stopColor="#FDA4AF" />
            <stop offset="50%" stopColor="#FB7185" />
            <stop offset="100%" stopColor="#F43F5E" />
          </linearGradient>
        </defs>

        {/* Cloud Body Shape */}
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          fill="url(#cloudGradCoral)"
          d="
            M 34.0,22.5 
            Q 50.0,7.5 66.0,22.5 
            Q 87.0,28.5 82.0,50.0 
            Q 87.0,71.5 66.0,77.5 
            Q 50.0,92.5 34.0,77.5 
            Q 13.0,71.5 18.0,50.0 
            Q 13.0,28.5 34.0,22.5 Z
          "
        />
        {/* Soft Highlight Top */}
        <path
          fill="url(#cloudHighlight)"
          d="
            M 34.0,22.5 
            Q 50.0,7.5 66.0,22.5 
            Q 75.0,25.0 78.0,36.0 
            Q 50.0,28.0 22.0,36.0 
            Q 25.0,25.0 34.0,22.5 Z
          "
          opacity="0.6"
        />
        {/* Friendly Face: Closed Eyes */}
        <path
          d="M 37,47 Q 42,43 47,47"
          stroke="#4C0519"
          strokeWidth="3.2"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M 53,47 Q 58,43 63,47"
          stroke="#4C0519"
          strokeWidth="3.2"
          strokeLinecap="round"
          fill="none"
        />
        {/* Gentle Happy Smile */}
        <path
          d="M 45,56 Q 50,62 55,56"
          stroke="#4C0519"
          strokeWidth="3.2"
          strokeLinecap="round"
          fill="none"
        />
      </motion.svg>

      {/* Avatar 3: Signature Electric Sky Blue Cloud with Playful Smile */}
      <motion.svg
        whileHover={{ y: -3, scale: 1.15, zIndex: 40 }}
        transition={{ type: 'spring', stiffness: 400, damping: 20 }}
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="relative z-10 drop-shadow-[0_4px_8px_rgba(0,0,0,0.12)] cursor-pointer flex-shrink-0"
      >
        <defs>
          <linearGradient id="cloudGradSky" x1="50%" y1="0%" x2="50%" y2="100%">
            <stop offset="0%" stopColor="#38BDF8" />
            <stop offset="50%" stopColor="#0EA5E9" />
            <stop offset="100%" stopColor="#0284C7" />
          </linearGradient>
        </defs>

        {/* Cloud Body Shape */}
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          fill="url(#cloudGradSky)"
          d="
            M 34.0,22.5 
            Q 50.0,7.5 66.0,22.5 
            Q 87.0,28.5 82.0,50.0 
            Q 87.0,71.5 66.0,77.5 
            Q 50.0,92.5 34.0,77.5 
            Q 13.0,71.5 18.0,50.0 
            Q 13.0,28.5 34.0,22.5 Z
          "
        />
        {/* Soft Highlight Top */}
        <path
          fill="url(#cloudHighlight)"
          d="
            M 34.0,22.5 
            Q 50.0,7.5 66.0,22.5 
            Q 75.0,25.0 78.0,36.0 
            Q 50.0,28.0 22.0,36.0 
            Q 25.0,25.0 34.0,22.5 Z
          "
          opacity="0.6"
        />
        {/* Friendly Face: Winking / Curved Closed Eyes */}
        <path
          d="M 37,46 Q 42,41 47,46"
          stroke="#082F49"
          strokeWidth="3.2"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M 53,46 Q 58,41 63,46"
          stroke="#082F49"
          strokeWidth="3.2"
          strokeLinecap="round"
          fill="none"
        />
        {/* Big Happy Smile */}
        <path
          d="M 44,54 Q 50,62 56,54"
          stroke="#082F49"
          strokeWidth="3.2"
          strokeLinecap="round"
          fill="none"
        />
      </motion.svg>
    </span>
  );
};

export default AirBookPeopleAvatars;
