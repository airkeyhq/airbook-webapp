'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export type SparkShape = 'circle' | 'square-rounded' | 'pill';
export type SparkParticleType = 'dots' | 'stars' | 'mixed';
export type SparkTone = 'electric' | 'tier1' | 'emerald' | 'gold';

export const SPARK_TONES: Record<SparkTone, { ring: string; colors: string[] }> = {
  electric: {
    ring: '#2BB5FF',
    colors: ['#2BB5FF', '#7DD3FC', '#F59E0B', '#10B981', '#1A8EFF'],
  },
  tier1: {
    ring: '#FFFFFF',
    colors: ['#FFFFFF', '#FDE047', '#BAE6FD', '#FFFFFF', '#7DD3FC'],
  },
  emerald: {
    ring: '#10B981',
    colors: ['#10B981', '#34D399', '#A7F3D0', '#FFFFFF', '#059669'],
  },
  gold: {
    ring: '#F59E0B',
    colors: ['#F59E0B', '#FDE047', '#FEF08A', '#FFFFFF', '#D97706'],
  },
};

const BASE_PARTICLES = [
  { angle: -160, distance: 22, size: 4.5 },
  { angle: -125, distance: 27, size: 4 },
  { angle: -90, distance: 24, size: 4.5 },
  { angle: -50, distance: 27, size: 3.5 },
  { angle: -15, distance: 23, size: 4.5 },
  { angle: 20, distance: 24, size: 4 },
  { angle: 55, distance: 26, size: 4.5 },
  { angle: 125, distance: 25, size: 3.5 },
  { angle: 160, distance: 22, size: 4 },
  { angle: 190, distance: 24, size: 4.5 },
];

export interface SparkleBurstProps {
  /** Incrementing counter; each increment > 0 triggers a fresh burst */
  burstKey: number;
  /** Geometry of the burst & expanding ripple ring */
  shape?: SparkShape;
  /** Particle rendering style */
  particle?: SparkParticleType;
  /** Color palette token */
  tone?: SparkTone;
  /** Optional custom radius class for square-rounded shapes */
  radiusClass?: string;
  /** Multiplier for particle travel distance */
  distanceScale?: number;
}

function FourPointStar({ size, color }: { size: number; color: string }) {
  return (
    <svg
      width={size * 2}
      height={size * 2}
      viewBox="0 0 16 16"
      fill="none"
      style={{ filter: `drop-shadow(0 0 4px ${color})` }}
    >
      <path
        d="M8 0L9.8 6.2L16 8L9.8 9.8L8 16L6.2 9.8L0 8L6.2 6.2L8 0Z"
        fill={color}
      />
    </svg>
  );
}

/**
 * Registered Ozone UI SparkleBurst micro-interaction primitive.
 * Adapts ripple & particle trajectory to circle, square-rounded, or pill containers.
 */
export const SparkleBurst: React.FC<SparkleBurstProps> = ({
  burstKey,
  shape = 'circle',
  particle = 'mixed',
  tone = 'electric',
  radiusClass,
  distanceScale = 1,
}) => {
  const palette = SPARK_TONES[tone];

  const ringRadiusClass =
    radiusClass ||
    (shape === 'pill' || shape === 'circle' ? 'rounded-full' : 'rounded-[6.5px]');

  const ringInitial =
    shape === 'pill'
      ? { scaleX: 0.95, scaleY: 0.85, opacity: 0.85 }
      : { scale: 0.6, opacity: 0.8 };

  const ringAnimate =
    shape === 'pill'
      ? { scaleX: 1.28, scaleY: 1.75, opacity: 0 }
      : { scale: 2.3, opacity: 0 };

  return (
    <AnimatePresence>
      {burstKey > 0 && (
        <span
          key={burstKey}
          className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-visible"
        >
          {/* Shape-Matched Expanding Ripple */}
          <motion.span
            initial={ringInitial}
            animate={ringAnimate}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45, ease: 'easeOut' }}
            style={{ borderColor: palette.ring }}
            className={`absolute inset-0 border-2 ${ringRadiusClass}`}
          />

          {/* Radiating Sparkles */}
          {BASE_PARTICLES.map((item, i) => {
            const rad = (item.angle * Math.PI) / 180;
            const dist = item.distance * distanceScale;
            const tx = Math.cos(rad) * (shape === 'pill' ? dist * 2.2 : dist);
            const ty = Math.sin(rad) * (shape === 'pill' ? dist * 1.1 : dist);
            const startX = shape === 'pill' ? tx * 0.45 : 0;
            const startY = shape === 'pill' ? ty * 0.35 : 0;
            const color = palette.colors[i % palette.colors.length];
            const isStar =
              particle === 'stars' || (particle === 'mixed' && i % 2 === 0);

            return (
              <motion.span
                key={i}
                initial={{ x: startX, y: startY, scale: 1, opacity: 1, rotate: 0 }}
                animate={{
                  x: tx,
                  y: ty,
                  scale: 0,
                  opacity: 0,
                  rotate: isStar ? 45 : 0,
                }}
                transition={{
                  duration: 0.48,
                  delay: (i % 3) * 0.02,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="absolute flex items-center justify-center"
              >
                {isStar ? (
                  <FourPointStar size={item.size} color={color} />
                ) : (
                  <span
                    style={{
                      width: item.size,
                      height: item.size,
                      backgroundColor: color,
                      boxShadow: `0 0 6px ${color}`,
                    }}
                    className="rounded-full block"
                  />
                )}
              </motion.span>
            );
          })}
        </span>
      )}
    </AnimatePresence>
  );
};
