'use client';

import React from 'react';
import Link from 'next/link';
import { Logo } from '@/components/Logo';
import {
  Image24Regular,
  Code24Regular,
  Grid24Regular,
  Server24Regular,
  DocumentBulletList24Regular,
  AppsListDetail24Regular,
  Tag24Regular,
  BuildingShop24Regular,
  ArrowRight24Filled,
  LockClosed24Regular,
  Sparkle24Regular,
} from '@fluentui/react-icons';

export default function InternalHubPage() {
  const internalModules = [
    {
      title: 'Founding Client Pilot Approvals',
      href: '/in/founding',
      description: 'Review and qualify incoming Founding Client applications, score pilot readiness, schedule alignment calls with Eduardo, and activate 2-month free workspaces.',
      icon: Sparkle24Regular,
      accent: 'from-sky-500/20 to-blue-500/20',
      tag: 'Founding Cohort',
      badgeColor: 'text-[#2BB5FF] border-[#2BB5FF]/30',
    },
    {
      title: 'Attio-Style CRM & Sales Pipeline',
      href: '/in/crm',
      description: 'Relational CRM tracking salon inbound pilots, competitor replacements (Fresha, Vagaro, Boulevard), and Stripe Connect GMV activation.',
      icon: BuildingShop24Regular,
      accent: 'from-blue-500/20 to-cyan-500/20',
      tag: 'Attio CRM',
      badgeColor: 'text-cyan-500 border-cyan-500/20',
    },
    {
      title: '100tasks Venture Building Framework',
      href: '/in/100tasks',
      description: 'Martin Bell’s 100-step venture blueprint to systematically validate, engineer, launch, and scale AirBook to market leadership.',
      icon: DocumentBulletList24Regular,
      accent: 'from-blue-600/20 to-indigo-600/20',
      tag: '100 Tasks',
      badgeColor: 'text-blue-500 border-blue-500/20',
    },
    {
      title: 'Competitor Landscape & Feature Teardown',
      href: '/in/competitors',
      description: 'Deep teardown of 8 competitors (Fresha, Mindbody, Vagaro, Boulevard, Square) analyzing fee traps, dark patterns, and AirBook’s 10x moat.',
      icon: AppsListDetail24Regular,
      accent: 'from-emerald-600/20 to-teal-600/20',
      tag: '8 Teardowns',
      badgeColor: 'text-emerald-500 border-emerald-500/20',
    },
    {
      title: 'Linear Roadmap & GitHub Issues',
      href: '/in/roadmap',
      description: 'Linear-inspired sprint cycles, milestone epics (v1.2 to v3.0), and bi-directional architecture specifications synced to the GitHub repository (airkeyhq/airbook-webapp).',
      icon: Tag24Regular,
      accent: 'from-purple-600/20 to-pink-600/20',
      tag: 'GitHub Sync',
      badgeColor: 'text-purple-500 border-purple-500/20',
    },
    {
      title: 'Brand DAM & Visual Assets',
      href: '/in/brand',
      description: 'AirBook master vector SVG specifications, 3D app icon tiles, candid photography library, and brand design kit.',
      icon: Image24Regular,
      accent: 'from-blue-500/20 to-sky-500/20',
      tag: 'DAM v2.0',
      badgeColor: 'text-blue-500 border-blue-500/20',
    },
    {
      title: 'Schema.org & Semantic Graph',
      href: '/in/schema',
      description: 'Structured JSON-LD schemas, Google Rich Result simulators, and AI search crawler models for ChatGPT and Perplexity.',
      icon: Code24Regular,
      accent: 'from-purple-500/20 to-indigo-500/20',
      tag: 'JSON-LD 1.1',
      badgeColor: 'text-purple-500 border-purple-500/20',
    },
    {
      title: 'Design System & Token Lab',
      href: '/in/design-system',
      description: 'CSS variables, atomic floating form physics, skeuomorphic tactile buttons, and 4-language typography rules.',
      icon: Grid24Regular,
      accent: 'from-emerald-500/20 to-teal-500/20',
      tag: 'Tokens v2.5',
      badgeColor: 'text-emerald-500 border-emerald-500/20',
    },
    {
      title: 'Platform Telemetry & Ops',
      href: '/in/ops',
      description: 'Multi-tenant database shard health, Stripe Connect Express payouts, push notification relays, and compliance audit logs.',
      icon: Server24Regular,
      accent: 'from-amber-500/20 to-orange-500/20',
      tag: 'Telemetry SOON',
      badgeColor: 'text-amber-500 border-amber-500/20',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-8">
      {/* Hero Welcome Banner */}
      <div className="p-8 sm:p-12 rounded-3xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] relative overflow-hidden shadow-xs">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-bold text-blue-600 dark:text-blue-400">
            <LockClosed24Regular className="w-3.5 h-3.5" />
            <span>AirBook Engineering & Product Suite</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-[var(--text-primary)] flex items-center gap-3">
            <Logo variant="3d" size={44} />
            <span>Internal Platform Console</span>
          </h1>

          <p className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed">
            Welcome to the internal engineering and design control room for AirBook. Access the platform Digital Asset Management (DAM), semantic Schema.org engines, token architectures, and infrastructure telemetry.
          </p>
        </div>

        {/* Decorative Background Glow */}
        <div className="absolute right-0 top-0 w-96 h-96 bg-gradient-to-bl from-blue-500/10 via-sky-400/5 to-transparent rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Internal Module Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {internalModules.map((mod) => {
          const Icon = mod.icon;
          return (
            <Link
              key={mod.href}
              href={mod.href}
              className="group p-6 sm:p-8 rounded-3xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] hover:border-blue-500/40 transition-all duration-150 flex flex-col justify-between space-y-6 shadow-xs relative overflow-hidden"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] flex items-center justify-center text-[var(--text-primary)] group-hover:scale-105 transition-transform duration-150">
                    <Icon className="w-6 h-6 text-blue-500" />
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-black/5 dark:bg-white/5 border ${mod.badgeColor}`}>
                    {mod.tag}
                  </span>
                </div>

                <div className="space-y-1.5">
                  <h3 className="text-lg font-black tracking-tight text-[var(--text-primary)] group-hover:text-blue-500 transition-colors flex items-center gap-2">
                    <span>{mod.title}</span>
                  </h3>
                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                    {mod.description}
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-[var(--border-subtle)] flex items-center justify-between text-xs font-bold text-[var(--text-muted)] group-hover:text-[var(--text-primary)] transition-colors">
                <span>Launch Workspace</span>
                <ArrowRight24Filled className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
