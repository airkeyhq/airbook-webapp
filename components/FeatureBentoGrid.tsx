'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { getDemoClient } from '@/lib/i18n/demographics';
import {
  Calendar24Regular,
  Person24Regular,
  Payment24Regular,
  Sparkle24Regular,
  CheckmarkCircle24Filled,
  Clock24Regular,
  Tag24Regular,
  ShieldCheckmark24Filled,
} from '@fluentui/react-icons';

export const FeatureBentoGrid: React.FC = () => {
  const { t, language } = useTranslation();
  const client = getDemoClient(language);

  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-24 relative z-10">
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3 mb-12 sm:mb-16">
        <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-[var(--text-primary)]">
          {t('bentoSectionTitle')}
        </h2>
        <p className="text-xs sm:text-base text-[var(--text-secondary)] font-medium leading-relaxed">
          {t('bentoSectionSubtitle')}
        </p>
      </div>

      {/* 2x2 Asymmetric Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
        {/* ─── CARD 1: TOP LEFT (SKY BLUE PASTEL - LIVE APPOINTMENTS) ─── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3 }}
          className="rounded-[32px] sm:rounded-[36px] bg-gradient-to-br from-[#E0F2FE] via-[#EBF6FF] to-[#DDF0FE] dark:from-sky-950/30 dark:via-sky-900/20 dark:to-sky-950/30 border border-sky-200/80 dark:border-sky-800/40 p-6 sm:p-10 flex flex-col justify-between overflow-hidden relative shadow-none min-h-[460px]"
        >
          {/* Top Text */}
          <div className="space-y-3 z-10">
            <div className="w-12 h-12 rounded-2xl bg-white/80 dark:bg-sky-900/50 backdrop-blur-md flex items-center justify-center text-[#0284C7] shadow-xs">
              <Calendar24Regular className="w-6 h-6" />
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              {t('bentoCard1Title')}
            </h3>
            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 font-medium leading-relaxed max-w-sm">
              {t('bentoCard1Desc')}
            </p>
          </div>

          {/* Tangible Floating UI Mockup */}
          <div className="mt-8 z-10 transform translate-y-2">
            <div className="rounded-2xl bg-white dark:bg-slate-900 p-5 shadow-none border border-slate-200/80 dark:border-slate-800 space-y-3.5">
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-400">
                <span className="flex items-center gap-1">
                  <Clock24Regular className="w-3.5 h-3.5 text-[#0284C7]" />
                  {t('bentoCard1PreviewTime')}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400 text-[10px] font-extrabold flex items-center gap-1">
                  <CheckmarkCircle24Filled className="w-3 h-3" />
                  {t('bentoCard1PreviewStatus')}
                </span>
              </div>

              <div className="space-y-1">
                <h4 className="text-sm font-extrabold text-slate-900 dark:text-white">
                  {t('bentoCard1PreviewService')}
                </h4>
                <p className="text-xs text-slate-500 font-medium">60 min • Room 2 • With Alex Rivera</p>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-sky-400 to-indigo-500 text-white font-black text-[10px] flex items-center justify-center">
                    {client.initials}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900 dark:text-white leading-none">{client.name}</p>
                    <p className="text-[10px] text-slate-400 font-medium">{client.note}</p>
                  </div>
                </div>
                <span className="text-xs font-black text-slate-900 dark:text-white">$85.00</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ─── CARD 2: TOP RIGHT (FULL-BLEED LIFESTYLE ATMOSPHERE) ─── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1, duration: 0.3 }}
          className="rounded-[32px] sm:rounded-[36px] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 text-white p-6 sm:p-10 flex flex-col justify-end overflow-hidden relative shadow-none min-h-[460px] group"
        >
          {/* Ambient Lighting & Texture Background */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent z-10" />
          <div className="absolute inset-0 opacity-40 mix-blend-overlay bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]" />
          
          {/* Floating Subtle Ambient Art Orbs */}
          <div className="absolute -top-12 -right-12 w-64 h-64 rounded-full bg-gradient-to-br from-[#2BB5FF]/30 to-[#AF52DE]/30 blur-3xl group-hover:scale-110 transition-transform duration-700 pointer-events-none" />
          <div className="absolute top-1/3 -left-12 w-48 h-48 rounded-full bg-gradient-to-tr from-amber-500/20 to-pink-500/20 blur-2xl pointer-events-none" />

          {/* Centered Graphic Silhouette Icon */}
          <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
            <Sparkle24Regular className="w-56 h-56 text-white" />
          </div>

          {/* Bottom Card Content */}
          <div className="relative z-20 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white shadow-xs">
              <Sparkle24Regular className="w-6 h-6" />
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {t('bentoCard2Title')}
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed max-w-sm">
              {t('bentoCard2Desc')}
            </p>
          </div>
        </motion.div>

        {/* ─── CARD 3: BOTTOM LEFT (WARM SUNLIGHT YELLOW - CLIENT PROFILES & CLOUD MASCOT) ─── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.18, duration: 0.3 }}
          className="rounded-[32px] sm:rounded-[36px] bg-gradient-to-br from-[#FEF08A] via-[#FFF59D] to-[#FDE047] dark:from-yellow-950/30 dark:via-amber-900/20 dark:to-yellow-950/30 border border-yellow-300/80 dark:border-yellow-800/40 p-6 sm:p-10 flex flex-col justify-between overflow-hidden relative shadow-none min-h-[460px]"
        >
          {/* Top Text */}
          <div className="space-y-3 z-10">
            <div className="w-12 h-12 rounded-2xl bg-white/80 dark:bg-amber-900/50 backdrop-blur-md flex items-center justify-center text-amber-800 shadow-xs">
              <Person24Regular className="w-6 h-6" />
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              {t('bentoCard3Title')}
            </h3>
            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 font-medium leading-relaxed max-w-sm">
              {t('bentoCard3Desc')}
            </p>
          </div>

          {/* Rising Mascot Cloud Illustration */}
          <div className="relative mt-8 z-10 flex flex-col items-center justify-center">
            {/* Background layered cloud contour */}
            <div className="absolute -bottom-16 w-72 h-44 rounded-full bg-amber-200/60 dark:bg-amber-900/30 blur-sm pointer-events-none" />
            
            {/* Mascot Character Cloud */}
            <motion.svg
              whileHover={{ y: -6, scale: 1.05 }}
              transition={{ type: 'spring', stiffness: 300, damping: 18 }}
              width={160}
              height={140}
              viewBox="0 0 100 100"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="drop-shadow-xl cursor-pointer"
            >
              <defs>
                <linearGradient id="bentoCloudGrad" x1="50%" y1="0%" x2="50%" y2="100%">
                  <stop offset="0%" stopColor="#FEF08A" />
                  <stop offset="60%" stopColor="#FACC15" />
                  <stop offset="100%" stopColor="#EAB308" />
                </linearGradient>
                <linearGradient id="bentoCloudGlow" x1="50%" y1="0%" x2="50%" y2="100%">
                  <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
                </linearGradient>
              </defs>

              {/* Cloud Body Shape */}
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                fill="url(#bentoCloudGrad)"
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
              {/* Highlight Overlay */}
              <path
                fill="url(#bentoCloudGlow)"
                d="
                  M 34.0,22.5 
                  Q 50.0,7.5 66.0,22.5 
                  Q 75.0,25.0 78.0,36.0 
                  Q 50.0,28.0 22.0,36.0 
                  Q 25.0,25.0 34.0,22.5 Z
                "
                opacity="0.5"
              />
              {/* Cute Eyes & Smile */}
              <path
                d="M 36,46 Q 41,40 46,46"
                stroke="#78350F"
                strokeWidth="3.4"
                strokeLinecap="round"
                fill="none"
              />
              <path
                d="M 54,46 Q 59,40 64,46"
                stroke="#78350F"
                strokeWidth="3.4"
                strokeLinecap="round"
                fill="none"
              />
              <path
                d="M 44,55 Q 50,63 56,55"
                stroke="#78350F"
                strokeWidth="3.4"
                strokeLinecap="round"
                fill="none"
              />
            </motion.svg>

            {/* Client Preference Tags */}
            <div className="flex items-center gap-2 mt-2">
              <span className="px-3 py-1 rounded-full bg-white dark:bg-slate-900 border border-amber-200 dark:border-amber-800 text-[10px] font-extrabold text-amber-950 dark:text-amber-200 shadow-xs flex items-center gap-1">
                <Tag24Regular className="w-3 h-3 text-amber-600" />
                Formula #7B
              </span>
              <span className="px-3 py-1 rounded-full bg-white dark:bg-slate-900 border border-amber-200 dark:border-amber-800 text-[10px] font-extrabold text-amber-950 dark:text-amber-200 shadow-xs">
                No Almond Oil
              </span>
            </div>
          </div>
        </motion.div>

        {/* ─── CARD 4: BOTTOM RIGHT (SOFT LAVENDER - TAP TO PAY PHONE MOCKUP) ─── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.26, duration: 0.3 }}
          className="rounded-[32px] sm:rounded-[36px] bg-gradient-to-br from-[#F3E8FF] via-[#F8F0FF] to-[#EFE2FE] dark:from-purple-950/30 dark:via-purple-900/20 dark:to-purple-950/30 border border-purple-200/80 dark:border-purple-800/40 p-6 sm:p-10 pb-0 sm:pb-0 flex flex-col justify-between overflow-hidden relative shadow-none min-h-[460px]"
        >
          {/* Top Text */}
          <div className="space-y-3 z-10">
            <div className="w-12 h-12 rounded-2xl bg-white/80 dark:bg-purple-900/50 backdrop-blur-md flex items-center justify-center text-[#9333EA] shadow-xs">
              <Payment24Regular className="w-6 h-6" />
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              {t('bentoCard4Title')}
            </h3>
            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 font-medium leading-relaxed max-w-sm">
              {t('bentoCard4Desc')}
            </p>
          </div>

          {/* iPhone Mockup Frame (Grounded Flush to Bottom Margin) */}
          <div className="mt-8 z-10 flex justify-center w-full">
            <div className="w-full max-w-[280px] rounded-t-[36px] rounded-b-none bg-slate-900 text-white p-3.5 pt-2.5 pb-8 shadow-2xl border-t-2 border-x-2 border-slate-700/60 space-y-3">
              {/* Dynamic Island Pill */}
              <div className="w-20 h-4 bg-black rounded-full mx-auto" />

              {/* Tap to Pay Visual Screen */}
              <div className="rounded-2xl bg-slate-800/90 p-4 text-center space-y-2 border border-slate-700">
                <div className="w-9 h-9 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center">
                  <ShieldCheckmark24Filled className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
                    {t('bentoCard4Approved')}
                  </p>
                  <p className="text-2xl font-black text-white">$85.00</p>
                </div>
                <p className="text-[10px] text-emerald-400 font-bold">
                  {t('bentoCard4Payout')}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FeatureBentoGrid;
