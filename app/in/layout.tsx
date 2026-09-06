'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Logo } from '@/components/Logo';
import { useTranslation } from '@/lib/i18n/useTranslation';
import {
  LockClosed24Regular,
  Image24Regular,
  Code24Regular,
  Grid24Regular,
  Server24Regular,
  ArrowLeft24Filled,
} from '@fluentui/react-icons';

export default function InternalConsoleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { t } = useTranslation();

  const internalNavItems = [
    {
      href: '/in/brand',
      label: 'Brand DAM',
      icon: Image24Regular,
      isActive: pathname.startsWith('/in/brand') || pathname === '/in',
    },
    {
      href: '/in/schema',
      label: 'Schema & SEO',
      icon: Code24Regular,
      isActive: pathname.startsWith('/in/schema'),
    },
    {
      href: '/in/design-system',
      label: 'Design System',
      icon: Grid24Regular,
      isActive: pathname.startsWith('/in/design-system'),
      badge: 'v2.5',
    },
    {
      href: '/in/ops',
      label: 'Telemetry',
      icon: Server24Regular,
      isActive: pathname.startsWith('/in/ops'),
      badge: 'SOON',
    },
  ];

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] font-sans antialiased">
      {/* Internal Engineering Console Persistent Chrome */}
      <header className="sticky top-0 z-40 w-full bg-[var(--bg-primary)]/80 backdrop-blur-xl border-b border-[var(--border-subtle)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 h-16 flex items-center justify-between gap-4">
          {/* Brand Identity & Internal Badge */}
          <div className="flex items-center gap-3">
            <Link href="/in" className="flex items-center gap-2.5 group">
              <Logo variant="3d" size={26} />
              <div className="flex items-center gap-2">
                <span className="font-black text-sm tracking-tight text-[var(--text-primary)]">
                  AirBook
                </span>
                <span className="px-2 py-0.5 rounded-lg text-[10px] font-mono font-extrabold uppercase tracking-wider bg-[var(--bg-secondary)] text-[var(--text-muted)] border border-[var(--border-subtle)]">
                  Internal
                </span>
              </div>
            </Link>
          </div>

          {/* Module Switcher Tabs (Desktop) */}
          <nav className="hidden md:flex items-center gap-1 p-1 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)]">
            {internalNavItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all duration-100 ${
                    item.isActive
                      ? 'bg-[var(--bg-primary)] text-[var(--text-primary)] shadow-xs border border-[var(--border-subtle)]'
                      : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-transparent'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${item.isActive ? 'text-blue-500' : 'text-[var(--text-muted)]'}`} />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className={`px-1.5 py-0.5 rounded text-[9px] font-mono font-extrabold uppercase ${
                      item.isActive
                        ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
                        : 'bg-black/5 dark:bg-white/5 text-[var(--text-muted)]'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Security Status & Return to Dashboard */}
          <div className="flex items-center gap-2.5">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-xs font-bold text-[var(--text-secondary)]">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Team Access</span>
            </div>

            <Link
              href="/dashboard"
              className="btn-secondary h-9 px-3.5 rounded-xl text-xs font-bold flex items-center gap-1.5"
            >
              <ArrowLeft24Filled className="w-3.5 h-3.5" />
              <span>{t('dashboard')}</span>
            </Link>
          </div>
        </div>

        {/* Mobile Sub-Navigation Bar */}
        <div className="md:hidden flex items-center gap-1.5 px-4 py-2 border-t border-[var(--border-subtle)] overflow-x-auto no-scrollbar bg-[var(--bg-secondary)]/50">
          {internalNavItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap flex-shrink-0 transition-all ${
                  item.isActive
                    ? 'bg-[var(--bg-primary)] text-[var(--text-primary)] shadow-xs border border-[var(--border-subtle)]'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${item.isActive ? 'text-blue-500' : 'text-[var(--text-muted)]'}`} />
                <span>{item.label}</span>
                {item.badge && (
                  <span className="px-1 py-0.2 rounded text-[8px] font-mono font-extrabold bg-blue-500/10 text-blue-600 dark:text-blue-400">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </header>

      {/* Main Content Area */}
      <main className="py-6 sm:py-8">
        {children}
      </main>
    </div>
  );
}

