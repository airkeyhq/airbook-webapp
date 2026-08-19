'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Logo, CircleCloudIconFlat, BlueprintBadgeIcon } from './Logo';
import { Dismiss24Filled, Sparkle24Filled, Copy24Filled, Checkmark24Filled } from '@fluentui/react-icons';

interface LogoShowcaseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LogoShowcaseModal: React.FC<LogoShowcaseModalProps> = ({ isOpen, onClose }) => {
  const [copiedIndex, setCopiedIndex] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = (codeSnippet: string, id: string) => {
    navigator.clipboard.writeText(codeSnippet);
    setCopiedIndex(id);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-md"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ scale: 0.94, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.94, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 380, damping: 28 }}
          className="relative w-full max-w-4xl bg-slate-50 dark:bg-[#141720] border border-slate-200 dark:border-white/10 rounded-[32px] p-6 sm:p-8 shadow-2xl z-10 space-y-8 max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-white/10">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
                <Sparkle24Filled className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-black tracking-tight text-[var(--text-primary)]">
                  AirBook Brand Identity & Logo System
                </h2>
                <p className="text-xs text-[var(--text-muted)]">
                  Official 3D App Tile Badges, Flat UI Monochromatic Glyphs, & Vector Assets
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-white/10 transition-colors"
            >
              <Dismiss24Filled className="w-5 h-5" />
            </button>
          </div>

          {/* Section 1: 3D App Tile Badges */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-extrabold tracking-wide uppercase text-slate-500 dark:text-slate-400">
                1. 3D App Tile Badges (iOS / macOS / Marketing)
              </h3>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-6 bg-white dark:bg-[#1C202C] rounded-3xl border border-slate-200/80 dark:border-white/5 shadow-inner justify-items-center">
              {/* Pink Tile */}
              <div className="flex flex-col items-center gap-3 group">
                <Logo variant="badge" badgeStyle="pink" size={48} animated />
                <span className="text-xs font-extrabold text-slate-700 dark:text-slate-300">Rose Pink</span>
              </div>

              {/* Light Grey Tile */}
              <div className="flex flex-col items-center gap-3 group">
                <Logo variant="badge" badgeStyle="grey" size={48} animated />
                <span className="text-xs font-extrabold text-slate-700 dark:text-slate-300">Silver Grey</span>
              </div>

              {/* Dark Obsidian Tile */}
              <div className="flex flex-col items-center gap-3 group">
                <Logo variant="badge" badgeStyle="dark" size={48} animated />
                <span className="text-xs font-extrabold text-slate-700 dark:text-slate-300">Obsidian Dark</span>
              </div>

              {/* Blueprint Grid Tile */}
              <div className="flex flex-col items-center gap-3 group">
                <Logo variant="badge" badgeStyle="blueprint" size={48} animated />
                <span className="text-xs font-extrabold text-slate-700 dark:text-slate-300">Blueprint Grid</span>
              </div>
            </div>
          </div>

          {/* Section 2: Flat UI & Monochromatic Glyphs */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-extrabold tracking-wide uppercase text-slate-500 dark:text-slate-400">
                2. Flat Monochromatic & UI Glyphs (Amie-so Style)
              </h3>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 p-8 bg-white dark:bg-[#1C202C] rounded-3xl border border-slate-200/80 dark:border-white/5 shadow-inner justify-items-center">
              {/* 1. Outline */}
              <div className="flex flex-col items-center gap-3">
                <div className="p-4 rounded-2xl bg-slate-100 dark:bg-white/5 flex items-center justify-center">
                  <CircleCloudIconFlat size={40} styleType="outline" />
                </div>
                <span className="text-xs font-bold text-slate-600 dark:text-slate-400">Outline</span>
              </div>

              {/* 2. Duotone */}
              <div className="flex flex-col items-center gap-3">
                <div className="p-4 rounded-2xl bg-slate-100 dark:bg-white/5 flex items-center justify-center">
                  <CircleCloudIconFlat size={40} styleType="duotone" />
                </div>
                <span className="text-xs font-bold text-slate-600 dark:text-slate-400">Duotone</span>
              </div>

              {/* 3. Light Outline */}
              <div className="flex flex-col items-center gap-3">
                <div className="p-4 rounded-2xl bg-slate-100 dark:bg-white/5 flex items-center justify-center">
                  <CircleCloudIconFlat size={40} styleType="light-outline" />
                </div>
                <span className="text-xs font-bold text-slate-600 dark:text-slate-400">Light Outline</span>
              </div>

              {/* 4. Solid Black */}
              <div className="flex flex-col items-center gap-3">
                <div className="p-4 rounded-2xl bg-slate-100 dark:bg-white/5 flex items-center justify-center">
                  <CircleCloudIconFlat size={40} styleType="solid-black" />
                </div>
                <span className="text-xs font-bold text-slate-600 dark:text-slate-400">Solid Black</span>
              </div>

              {/* 5. Solid Grey */}
              <div className="flex flex-col items-center gap-3">
                <div className="p-4 rounded-2xl bg-slate-100 dark:bg-white/5 flex items-center justify-center">
                  <CircleCloudIconFlat size={40} styleType="solid-grey" />
                </div>
                <span className="text-xs font-bold text-slate-600 dark:text-slate-400">Solid Grey</span>
              </div>
            </div>
          </div>

          {/* Code Usage Examples */}
          <div className="p-5 rounded-2xl bg-slate-900 text-white space-y-2 text-xs font-mono">
            <div className="flex items-center justify-between text-slate-400">
              <span>Quick Usage Snippet:</span>
              <button
                onClick={() => handleCopy(`<Logo variant="badge" badgeStyle="pink" size={48} />`, 'snippet')}
                className="flex items-center gap-1 hover:text-white transition-colors"
              >
                {copiedIndex === 'snippet' ? (
                  <Checkmark24Filled className="w-3.5 h-3.5 text-green-400" />
                ) : (
                  <Copy24Filled className="w-3.5 h-3.5" />
                )}
                <span>{copiedIndex === 'snippet' ? 'Copied!' : 'Copy React Code'}</span>
              </button>
            </div>
            <pre className="text-blue-300 overflow-x-auto">
{`import { Logo } from '@/components/Logo';

// 3D Badges: <Logo variant="badge" badgeStyle="pink" | "grey" | "dark" | "blueprint" />
// Flat Glyphs: <Logo variant="flat" flatStyle="outline" | "duotone" | "solid-black" />`}
            </pre>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
