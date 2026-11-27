'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSmartPosition } from '@/lib/useSmartPosition';
import { Drawer } from '@/components/primitives/Drawer';
import {
  Color24Regular,
  Copy24Filled,
  Checkmark24Filled,
  Sparkle24Regular,
  Dismiss24Filled,
} from '@fluentui/react-icons';
import { Icon } from '@/components/primitives/Icon';

interface ColorPickerProps {
  label?: string;
  value: string;
  onChange: (hex: string) => void;
  className?: string;
  presets?: { name: string; hex: string }[];
  /**
   * Responsive presentation mode:
   * - 'auto': Adapts automatically to mobile (<640px), tablet (640-1023px), and desktop (>=1024px)
   * - 'desktop' | 'tablet' | 'mobile': Forces a specific layout (useful for previews)
   * @default 'auto'
   */
  layoutMode?: 'auto' | 'desktop' | 'tablet' | 'mobile';
}

// Curated Luxury Salon & Spa Color DNA Presets
export const DEFAULT_AIRBOOK_PRESETS = [
  { name: 'Electric Sky', hex: '#2BB5FF' },
  { name: 'Matte Onyx', hex: '#0F172A' },
  { name: 'Rose Gold', hex: '#E07A5F' },
  { name: 'Champagne Silk', hex: '#D4A373' },
  { name: 'Emerald Sage', hex: '#2A9D8F' },
  { name: 'French Lavender', hex: '#8338EC' },
  { name: 'Coral Sunset', hex: '#FF006E' },
  { name: 'Pure Titanium', hex: '#64748B' },
];

// Helper: Convert HSL to Hex
function hslToHex(h: number, s: number, l: number): string {
  l /= 100;
  const a = (s * Math.min(l, 1 - l)) / 100;
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`.toUpperCase();
}

// Helper: Convert Hex to HSL
function hexToHsl(hex: string): { h: number; s: number; l: number } {
  let cleanHex = hex.replace('#', '');
  if (cleanHex.length === 3) {
    cleanHex = cleanHex
      .split('')
      .map((c) => c + c)
      .join('');
  }
  const r = parseInt(cleanHex.substring(0, 2), 16) / 255 || 0;
  const g = parseInt(cleanHex.substring(2, 4), 16) / 255 || 0;
  const b = parseInt(cleanHex.substring(4, 6), 16) / 255 || 0;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h = Math.round(h * 60);
  }

  return {
    h: Math.round(h),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

export function ColorPicker({
  label,
  value = '#2BB5FF',
  onChange,
  className = '',
  presets = DEFAULT_AIRBOOK_PRESETS,
  layoutMode = 'auto',
}: ColorPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [hexInput, setHexInput] = useState(value);
  const [viewportMode, setViewportMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const containerRef = useRef<HTMLDivElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const satValPadRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (layoutMode !== 'auto') {
      setViewportMode(layoutMode);
      return;
    }
    const updateMode = () => {
      if (window.innerWidth < 640) setViewportMode('mobile');
      else if (window.innerWidth < 1024) setViewportMode('tablet');
      else setViewportMode('desktop');
    };
    updateMode();
    window.addEventListener('resize', updateMode);
    return () => window.removeEventListener('resize', updateMode);
  }, [layoutMode]);

  const activeMode = layoutMode === 'auto' ? viewportMode : layoutMode;

  const { positionClass, motionY } = useSmartPosition({
    isOpen: isOpen && activeMode !== 'mobile',
    triggerRef: containerRef,
    floatingRef: popoverRef,
    estimatedWidth: activeMode === 'desktop' ? 460 : 320,
    estimatedHeight: activeMode === 'desktop' ? 275 : 350,
    preferredVertical: 'bottom',
    preferredHorizontal: 'left',
    offset: 8,
  });

  const hsl = hexToHsl(value);
  const [hue, setHue] = useState(hsl.h || 200);
  const [sat, setSat] = useState(hsl.s || 100);
  const [light, setLight] = useState(hsl.l || 50);

  // Sync internal state with external value changes
  useEffect(() => {
    setHexInput(value);
    const converted = hexToHsl(value);
    setHue(converted.h);
    setSat(converted.s);
    setLight(converted.l);
  }, [value]);

  // Handle outside click to close popover
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // Handle Eyedropper API
  const handleEyeDropper = async () => {
    if (typeof window !== 'undefined' && 'EyeDropper' in window) {
      try {
        // @ts-expect-error EyeDropper is experimental browser API
        const eyeDropper = new window.EyeDropper();
        const result = await eyeDropper.open();
        if (result?.sRGBHex) {
          const newHex = result.sRGBHex.toUpperCase();
          onChange(newHex);
          setHexInput(newHex);
        }
      } catch {
        // User cancelled eyedropper
      }
    }
  };

  // Copy hex code to clipboard
  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  // Drag on Spectrum Pad (Mouse + Touch)
  const updateSpectrumFromPoint = useCallback(
    (clientX: number, clientY: number) => {
      if (!satValPadRef.current) return;
      const rect = satValPadRef.current.getBoundingClientRect();
      const x = Math.max(0, Math.min(rect.width, clientX - rect.left));
      const y = Math.max(0, Math.min(rect.height, clientY - rect.top));

      const newSat = Math.round((x / rect.width) * 100);
      const brightness = 1 - y / rect.height; // 0 (bottom) to 1 (top)
      const newLight = Math.round(brightness * (100 - newSat / 2));

      setSat(newSat);
      setLight(Math.max(0, Math.min(100, newLight)));

      const newHex = hslToHex(hue, newSat, Math.max(0, Math.min(100, newLight)));
      onChange(newHex);
      setHexInput(newHex);
    },
    [hue, onChange]
  );

  const handleSpectrumMouseDown = (e: React.MouseEvent) => {
    updateSpectrumFromPoint(e.clientX, e.clientY);
    const onMouseMove = (moveEvent: MouseEvent) =>
      updateSpectrumFromPoint(moveEvent.clientX, moveEvent.clientY);
    const onMouseUp = () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  };

  const handleSpectrumTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    if (touch) updateSpectrumFromPoint(touch.clientX, touch.clientY);
  };

  const handleSpectrumTouchMove = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    if (touch) updateSpectrumFromPoint(touch.clientX, touch.clientY);
  };

  // Hue slider change
  const handleHueChange = (newHue: number) => {
    setHue(newHue);
    const newHex = hslToHex(newHue, sat, light);
    onChange(newHex);
    setHexInput(newHex);
  };

  // Manual text input change
  const handleHexInputChange = (text: string) => {
    let clean = text.toUpperCase();
    if (!clean.startsWith('#')) clean = '#' + clean;
    setHexInput(clean);

    if (/^#[0-9A-F]{6}$/i.test(clean)) {
      onChange(clean);
      const converted = hexToHsl(clean);
      setHue(converted.h);
      setSat(converted.s);
      setLight(converted.l);
    }
  };

  const studioContent = (
    <div
      className={
        activeMode === 'desktop'
          ? 'grid grid-cols-12 gap-4 pt-3 items-stretch'
          : 'space-y-3.5'
      }
    >
      {/* Left / Top: Spectrum Pad + Hue Slider */}
      <div className={activeMode === 'desktop' ? 'col-span-6 space-y-3 flex flex-col justify-between' : 'space-y-3'}>
        {/* ─── 2D Saturation/Brightness Spectrum Pad ─── */}
        <div
          ref={satValPadRef}
          onMouseDown={handleSpectrumMouseDown}
          onTouchStart={handleSpectrumTouchStart}
          onTouchMove={handleSpectrumTouchMove}
          className={`relative w-full rounded-2xl cursor-crosshair overflow-hidden border border-[var(--border-subtle)] shadow-inner select-none touch-none ${
            activeMode === 'mobile' ? 'h-40' : activeMode === 'desktop' ? 'h-36' : 'h-28'
          }`}
          style={{
            backgroundColor: `hsl(${hue}, 100%, 50%)`,
            backgroundImage: `
              linear-gradient(to top, #000, transparent),
              linear-gradient(to right, #fff, transparent)
            `,
          }}
        >
          <div
            className="absolute w-4 h-4 -ml-2 -mt-2 rounded-full border-2 border-white shadow-[0_0_4px_rgba(0,0,0,0.8)] pointer-events-none transform transition-transform"
            style={{
              left: `${sat}%`,
              top: `${100 - (light / (100 - sat / 2)) * 100}%`,
              backgroundColor: value,
            }}
          />
        </div>

        {/* ─── Rainbow Hue Slider & Live Preview ─── */}
        <div className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-xl border border-black/10 dark:border-white/20 shadow-xs flex-shrink-0"
            style={{ backgroundColor: value }}
          />
          <div className="flex-1">
            <input
              type="range"
              min="0"
              max="360"
              value={hue}
              onChange={(e) => handleHueChange(parseInt(e.target.value, 10))}
              className="w-full h-3 rounded-full appearance-none cursor-pointer border border-[var(--border-subtle)] outline-none"
              style={{
                background:
                  'linear-gradient(to right, #ff0000 0%, #ffff00 17%, #00ff00 33%, #00ffff 50%, #0000ff 67%, #ff00ff 83%, #ff0000 100%)',
              }}
            />
          </div>
          {typeof window !== 'undefined' && 'EyeDropper' in window && (
            <button
              type="button"
              onClick={handleEyeDropper}
              title="Pick Color from Screen"
              className="p-2 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--color-accent-primary)] transition-colors cursor-pointer"
            >
              <Icon regular={Color24Regular} size="md" />
            </button>
          )}
        </div>
      </div>

      {/* Right / Bottom: Presets + Hex Input + Apply */}
      <div className={activeMode === 'desktop' ? 'col-span-6 flex flex-col justify-between space-y-3' : 'space-y-3'}>
        {/* ─── Curated Luxury Salon DNA Presets ─── */}
        <div className="space-y-2">
          <span className="text-[10px] font-black uppercase tracking-wider text-[var(--text-muted)] block">
            Curated Salon DNA Presets
          </span>
          <div className="grid grid-cols-4 gap-1.5">
            {presets.map((preset) => {
              const isSelected = value.toUpperCase() === preset.hex.toUpperCase();
              return (
                <button
                  key={preset.hex}
                  type="button"
                  onClick={() => {
                    onChange(preset.hex);
                    setHexInput(preset.hex);
                  }}
                  title={`${preset.name} (${preset.hex})`}
                  aria-label={`${preset.name} ${preset.hex}`}
                  className={`group relative flex items-center justify-center p-1 rounded-xl border transition-all duration-100 cursor-pointer ${
                    isSelected
                      ? 'border-[var(--color-accent-primary)] bg-[var(--color-accent-primary)]/10 shadow-xs'
                      : 'border-[var(--border-subtle)] bg-[var(--bg-secondary)] hover:border-[var(--color-accent-primary)]/40'
                  }`}
                >
                  <div
                    className={`w-full rounded-lg border border-black/10 dark:border-white/10 shadow-xs relative flex items-center justify-center ${
                      activeMode === 'mobile' ? 'h-9' : 'h-8'
                    }`}
                    style={{ backgroundColor: preset.hex }}
                  >
                    {isSelected && (
                      <Icon filled={Checkmark24Filled} size="md" className="text-white drop-shadow-md" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* ─── Manual Hex Input & Quick Apply ─── */}
        <div className="pt-2 border-t border-[var(--border-subtle)] flex items-center gap-2">
          <div className="flex-1 relative">
            <input
              type="text"
              maxLength={7}
              value={hexInput}
              onChange={(e) => handleHexInputChange(e.target.value)}
              placeholder="#2BB5FF"
              className={`w-full px-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] font-mono text-xs font-bold text-[var(--text-primary)] uppercase focus:outline-none focus:border-[var(--color-accent-primary)] transition-colors ${
                activeMode === 'mobile' ? 'h-11' : 'h-9'
              }`}
            />
          </div>

          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className={`btn-primary px-4 rounded-xl text-xs font-bold ${
              activeMode === 'mobile' ? '!h-11' : '!h-9'
            }`}
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {label && (
        <label className="block text-xs font-bold text-[var(--text-secondary)] mb-1.5">
          {label}
        </label>
      )}

      {/* ─── Tactile Trigger Card ─── */}
      <div
        role="button"
        tabIndex={0}
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setIsOpen(!isOpen);
          }
        }}
        className={`w-full h-[52px] px-3.5 rounded-2xl bg-[var(--bg-secondary)] border transition-all duration-150 flex items-center justify-between gap-3 cursor-pointer group select-none ${
          isOpen
            ? 'border-[var(--color-accent-primary)] ring-2 ring-[#1A8EFF]/20 bg-[var(--bg-primary)]'
            : 'border-[var(--border-subtle)] hover:border-[var(--color-accent-primary)]/50'
        }`}
      >
        <div className="flex items-center gap-3">
          {/* Swatch Pill with Ambient White Ring & Inner Glow */}
          <div className="relative w-7 h-7 rounded-xl border border-black/10 dark:border-white/15 shadow-xs overflow-hidden flex-shrink-0 flex items-center justify-center">
            <div
              className="absolute inset-0 transition-colors"
              style={{ backgroundColor: value }}
            />
          </div>

          <div className="flex flex-col">
            <span className="font-mono text-xs font-black text-[var(--text-primary)] uppercase tracking-wider">
              {value}
            </span>
            <span className="text-[10px] text-[var(--text-muted)] font-medium">
              HSL({hue}°, {sat}%, {light}%)
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={handleCopy}
            title="Copy Hex Code"
            className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] transition-colors"
          >
            {copied ? (
              <Icon filled={Checkmark24Filled} size="md" tone="success" />
            ) : (
              <Icon filled={Copy24Filled} size="md" />
            )}
          </button>
          <Icon regular={Color24Regular} size="md" tone="muted" className="group-hover:text-[var(--text-primary)] transition-colors" />
        </div>
      </div>

      {/* ─── Mobile Bottom Drawer (reusing Drawer primitive) ─── */}
      {activeMode === 'mobile' ? (
        <Drawer
          open={isOpen}
          onClose={() => setIsOpen(false)}
          side="bottom"
          size="lg"
          title="AirBook Color Studio"
          headerIcon={<Icon regular={Sparkle24Regular} size="md" className="text-[var(--color-accent-primary)]" />}
        >
          {studioContent}
        </Drawer>
      ) : (
        /* ─── Desktop 2-Col / Tablet Compact Popover ─── */
        <AnimatePresence>
          {isOpen && (
            <motion.div
              ref={popoverRef}
              initial={{ opacity: 0, y: motionY, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: motionY, scale: 0.96 }}
              transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
              className={`absolute z-[250] p-4 rounded-3xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] shadow-2xl backdrop-blur-xl ${
                activeMode === 'desktop' ? 'w-[460px]' : 'w-[320px] space-y-3'
              } ${positionClass}`}
            >
              {/* Popover Header */}
              <div className="flex items-center justify-between pb-2.5 border-b border-[var(--border-subtle)]">
                <div className="flex items-center gap-1.5 text-xs font-black text-[var(--text-primary)]">
                  <Icon regular={Sparkle24Regular} size="md" className="text-[var(--color-accent-primary)]" />
                  <span>AirBook Color Studio</span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="p-1 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
                >
                  <Icon filled={Dismiss24Filled} size="sm" />
                </button>
              </div>

              {studioContent}
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
}
