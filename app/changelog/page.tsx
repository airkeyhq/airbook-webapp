'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { MarketingHeader } from '@/components/MarketingHeader';
import { MarketingFooter } from '@/components/MarketingFooter';
import { useTranslation } from '@/lib/i18n/useTranslation';
import {
  ArrowRight24Filled,
  Calendar24Regular,
  Payment24Regular,
  Tag24Regular,
  Sparkle24Regular,
  ShieldCheckmark24Regular,
  CheckmarkCircle24Regular,
} from '@fluentui/react-icons';

export default function ChangelogPage() {
  const { t } = useTranslation();

  const RELEASES = [
    {
      version: 'v2.0',
      date: 'September 2026',
      badge: 'Major Release',
      title: 'AirBook 2.0: Instant Mobile Bookings & Re-imagined Flow',
      description:
        'A ground-up redesign of the booking experience with frictionless 3-tap scheduling, automated SMS confirmations, and direct Stripe payouts.',
      highlights: [
        {
          icon: Calendar24Regular,
          title: '3-Tap Frictionless Client Scheduling',
          desc: 'Clients pick an available time in seconds with zero apps to download or passwords to remember.',
        },
        {
          icon: Payment24Regular,
          title: 'Direct Card Deposits & Tap-to-Pay',
          desc: 'Automatic deposit pre-authorizations protect against no-shows, with instant daily Stripe payouts.',
        },
        {
          icon: Sparkle24Regular,
          title: 'Smart SMS Rebooking Prompts',
          desc: 'Gentle, automated text reminders invite clients back at the exact right moment to keep calendars full.',
        },
        {
          icon: Tag24Regular,
          title: 'Custom Client Specs & Notes',
          desc: 'Save technical specs, preferences, and session notes directly on each guest profile.',
        },
      ],
    },
    {
      version: 'v1.5',
      date: 'August 2026',
      badge: 'Feature Update',
      title: 'Team Workspaces & Shift Coordination',
      description:
        'Multi-staff calendars, live room buffer times, and automated chair rental / commission payout tracking.',
      highlights: [
        {
          icon: ShieldCheckmark24Regular,
          title: 'Real-Time Schedule Sync',
          desc: 'Synchronized live floor schedules and room turnover buffers prevent double bookings.',
        },
        {
          icon: CheckmarkCircle24Regular,
          title: 'Automated Commission Splits',
          desc: 'Transparent payout calculations for booth renters and multi-practitioner studios.',
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] flex flex-col justify-between selection:bg-[#2BB5FF] selection:text-white font-sans">
      {/* Sticky Master Header */}
      <MarketingHeader />

      {/* Main Changelog Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-20 space-y-12">
        {/* Header Title */}
        <div className="space-y-3 text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#2BB5FF]/10 text-[#2BB5FF] text-xs font-extrabold">
            <Sparkle24Regular className="w-3.5 h-3.5" />
            <span>Product Updates</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-[var(--text-primary)]">
            What's new in AirBook
          </h1>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] max-w-xl leading-relaxed">
            Follow our latest updates, improvements, and releases as we build the most delightful booking platform.
          </p>
        </div>

        {/* Releases Timeline */}
        <div className="space-y-12">
          {RELEASES.map((rel, idx) => (
            <motion.article
              key={rel.version}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="p-6 sm:p-10 rounded-3xl bg-gradient-to-br from-[#FFF0F5]/70 via-[#FDF2F8]/40 to-[#F6F3FF]/70 dark:from-pink-950/20 dark:via-purple-950/20 dark:to-sky-950/20 border border-pink-100/80 dark:border-pink-900/30 shadow-md space-y-6 text-left"
            >
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--border-subtle)] pb-4">
                <div className="flex items-center gap-3">
                  <span className="text-lg font-black text-[var(--text-primary)]">{rel.version}</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#2BB5FF] text-white text-[10px] font-black uppercase tracking-wider">
                    {rel.badge}
                  </span>
                </div>
                <span className="text-xs font-semibold text-[var(--text-secondary)]">{rel.date}</span>
              </div>

              <div className="space-y-2">
                <h2 className="text-xl sm:text-2xl font-extrabold text-[var(--text-primary)] tracking-tight">
                  {rel.title}
                </h2>
                <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
                  {rel.description}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                {rel.highlights.map((h, hIdx) => {
                  const Icon = h.icon;
                  return (
                    <div
                      key={hIdx}
                      className="p-4 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] space-y-1.5 shadow-xs"
                    >
                      <div className="flex items-center gap-2 font-extrabold text-xs text-[var(--text-primary)]">
                        <Icon className="w-4 h-4 text-[#2BB5FF]" />
                        <span>{h.title}</span>
                      </div>
                      <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed">{h.desc}</p>
                    </div>
                  );
                })}
              </div>
            </motion.article>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="p-8 rounded-3xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-center space-y-4">
          <h3 className="text-xl font-extrabold text-[var(--text-primary)]">
            Experience the latest version of AirBook
          </h3>
          <p className="text-xs text-[var(--text-secondary)] max-w-md mx-auto">
            Get your link live in less than 5 minutes. Free to start, no credit card required.
          </p>
          <div className="pt-2">
            <Link href="/onboarding" className="btn-primary inline-flex items-center gap-2 px-6 py-3 text-xs">
              <span>Try AirBook Free</span>
              <ArrowRight24Filled className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </main>

      {/* Master Footer */}
      <MarketingFooter />
    </div>
  );
}
