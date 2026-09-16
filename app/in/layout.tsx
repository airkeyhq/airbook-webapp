'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Logo } from '@/components/Logo';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { useSession, signOut } from '@/lib/auth-client';
import { getAvatarUrl } from '@/lib/avatars';
import {
  LockClosed24Regular,
  Image24Regular,
  Code24Regular,
  Grid24Regular,
  Server24Regular,
  DocumentBulletList24Regular,
  AppsListDetail24Regular,
  Tag24Regular,
  BuildingShop24Regular,
  ArrowLeft24Filled,
  ChevronDown24Regular,
  Checkmark24Filled,
  SignOut24Filled,
  Settings24Filled,
} from '@fluentui/react-icons';

interface InternalModuleOption {
  href: string;
  label: string;
  sublabel: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

export default function InternalConsoleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { t } = useTranslation();
  const { data: session } = useSession();

  const [isOpen, setIsOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const userName = session?.user?.name || 'Eduardo Gonzalez';
  const userEmail = session?.user?.email || 'eduardo@airbook.app';
  const userAvatar = getAvatarUrl(userName, session?.user?.image, '#007AFF');

  const internalModules: InternalModuleOption[] = [
    {
      href: '/in/crm',
      label: t('crmModuleNavLabel'),
      sublabel: 'Attio Pipeline & Stripe Sync',
      icon: BuildingShop24Regular,
      badge: 'Attio Engine',
    },
    {
      href: '/in/100tasks',
      label: t('tasksModuleNavLabel'),
      sublabel: 'Venture Building Framework',
      icon: DocumentBulletList24Regular,
      badge: '100',
    },
    {
      href: '/in/competitors',
      label: 'Competitor Landscape',
      sublabel: 'Feature Teardowns & 10x Moat',
      icon: AppsListDetail24Regular,
      badge: '8 Teardowns',
    },
    {
      href: '/in/roadmap',
      label: 'Linear Roadmap',
      sublabel: 'GitHub Repo & Issue Cycles',
      icon: Tag24Regular,
      badge: 'GitHub Sync',
    },
    {
      href: '/in/brand',
      label: 'Brand DAM',
      sublabel: 'Vector & 3D Media Kit',
      icon: Image24Regular,
      badge: 'DAM v2.0',
    },
    {
      href: '/in/schema',
      label: 'Schema & SEO',
      sublabel: 'Structured Graph & AI Models',
      icon: Code24Regular,
      badge: 'JSON-LD',
    },
    {
      href: '/in/design-system',
      label: 'Design System',
      sublabel: 'Tokens & Atomic UI Lab',
      icon: Grid24Regular,
      badge: 'v2.5',
    },
    {
      href: '/in/ops',
      label: 'Telemetry & Ops',
      sublabel: 'Database Shards & Relays',
      icon: Server24Regular,
      badge: 'SOON',
    },
  ];

  // Determine current active module
  const currentModule =
    internalModules.find((item) => pathname.startsWith(item.href)) ||
    (pathname === '/in' ? internalModules[0] : internalModules[0]);

  // Close dropdowns on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (dropdownRef.current && !dropdownRef.current.contains(target)) {
        setIsOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(target)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectModule = (href: string) => {
    setIsOpen(false);
    router.push(href);
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push('/login');
    } catch (err) {
      console.warn('Sign out failed:', err);
    }
  };

  const ActiveIcon = currentModule.icon;

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] font-sans antialiased">
      {/* Internal Engineering Console Persistent Chrome */}
      <header className="sticky top-0 z-40 w-full bg-[var(--bg-primary)]/80 backdrop-blur-xl border-b border-[var(--border-subtle)]">
        <div className="max-w-7xl mx-auto px-3.5 sm:px-8 h-16 flex items-center justify-between gap-2.5 sm:gap-4">
          {/* Brand Identity & Internal Badge */}
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            <Link href="/in" className="flex items-center gap-2 group">
              <Logo variant="3d" size={26} />
              <div className="flex items-center gap-1.5">
                <span className="font-black text-sm tracking-tight text-[var(--text-primary)]">
                  AirBook
                </span>
                <span className="hidden sm:inline-block px-1.5 py-0.5 rounded-md text-[9px] font-mono font-extrabold uppercase tracking-wider bg-[var(--bg-secondary)] text-[var(--text-muted)] border border-[var(--border-subtle)]">
                  Internal
                </span>
              </div>
            </Link>
          </div>

          {/* Module Select Switcher Dropdown */}
          <div ref={dropdownRef} className="relative flex-1 max-w-[200px] xs:max-w-xs sm:max-w-sm mx-auto">
            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              aria-expanded={isOpen}
              aria-haspopup="listbox"
              className={`w-full h-10 px-2.5 sm:px-3.5 rounded-2xl bg-[var(--bg-secondary)] border ${
                isOpen
                  ? 'border-[var(--color-accent-primary)] ring-2 ring-[#1A8EFF]/20'
                  : 'border-[var(--border-subtle)] hover:border-black/20 dark:hover:border-white/20'
              } text-[var(--text-primary)] transition-all duration-150 flex items-center justify-between gap-1.5 sm:gap-2 cursor-pointer shadow-xs`}
            >
              <div className="flex items-center gap-2 min-w-0 flex-1">
                <div className="w-6 h-6 rounded-lg bg-[var(--bg-primary)] border border-[var(--border-subtle)] flex items-center justify-center flex-shrink-0 text-blue-500">
                  <ActiveIcon className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs font-black truncate text-[var(--text-primary)]">
                  {currentModule.label}
                </span>
                {currentModule.badge && (
                  <span className="hidden md:inline-block px-1.5 py-0.2 rounded text-[9px] font-mono font-bold uppercase bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 flex-shrink-0">
                    {currentModule.badge}
                  </span>
                )}
              </div>

              <motion.div
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={{ duration: 0.15 }}
                className="flex-shrink-0 text-[var(--text-muted)]"
              >
                <ChevronDown24Regular className="w-3.5 h-3.5" />
              </motion.div>
            </button>

            {/* Dropdown Menu Popover */}
            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -6, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -6, scale: 0.98 }}
                  transition={{ duration: 0.12, ease: 'easeOut' }}
                  className="absolute left-0 right-0 top-full mt-2 z-[100] p-1.5 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] shadow-2xl overflow-hidden divide-y divide-[var(--border-subtle)]"
                  role="listbox"
                >
                  <div className="p-1.5 space-y-1">
                    {internalModules.map((item) => {
                      const Icon = item.icon;
                      const isSelected =
                        pathname.startsWith(item.href) ||
                        (item.href === '/in/crm' && pathname === '/in');

                      return (
                        <button
                          key={item.href}
                          type="button"
                          onClick={() => handleSelectModule(item.href)}
                          role="option"
                          aria-selected={isSelected}
                          className={`w-full p-2.5 rounded-xl flex items-center justify-between gap-3 text-left transition-all duration-100 ${
                            isSelected
                              ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold'
                              : 'hover:bg-[var(--bg-secondary)] text-[var(--text-primary)]'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0 flex-1">
                            <div
                              className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 border ${
                                isSelected
                                  ? 'bg-blue-500 text-white border-blue-500'
                                  : 'bg-[var(--bg-secondary)] border-[var(--border-subtle)] text-[var(--text-secondary)]'
                              }`}
                            >
                              <Icon className="w-4 h-4" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-black truncate">
                                  {item.label}
                                </span>
                                {item.badge && (
                                  <span
                                    className={`px-1.5 py-0.2 rounded text-[8px] font-mono font-bold uppercase ${
                                      isSelected
                                        ? 'bg-blue-500/20 text-blue-700 dark:text-blue-300'
                                        : 'bg-black/5 dark:bg-white/5 text-[var(--text-muted)] border border-[var(--border-subtle)]'
                                    }`}
                                  >
                                    {item.badge}
                                  </span>
                                )}
                              </div>
                              <p className="text-[10px] text-[var(--text-secondary)] truncate">
                                {item.sublabel}
                              </p>
                            </div>
                          </div>

                          {isSelected && (
                            <Checkmark24Filled className="w-4 h-4 text-blue-500 flex-shrink-0" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Hub Link Footer */}
                  <div className="p-1 pt-1.5">
                    <Link
                      href="/in"
                      onClick={() => setIsOpen(false)}
                      className="w-full px-3 py-2 rounded-xl text-[11px] font-bold text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] transition-colors flex items-center justify-between"
                    >
                      <span>Internal Console Hub Overview</span>
                      <span className="font-mono text-[9px]">/in</span>
                    </Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* User Component & Return to Dashboard */}
          <div className="flex items-center gap-2 sm:gap-2.5 flex-shrink-0">
            {/* Tactile User Profile Pill / Dropdown */}
            <div ref={userMenuRef} className="relative z-[100]">
              <button
                type="button"
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                aria-expanded={isUserMenuOpen}
                aria-haspopup="menu"
                className="h-9.5 sm:h-10 pl-1.5 pr-2.5 sm:pr-3 rounded-full bg-[var(--bg-secondary)] border border-[var(--border-subtle)] hover:border-blue-500/40 transition-all duration-150 flex items-center gap-2 cursor-pointer shadow-xs active:scale-[0.98]"
              >
                <div className="relative flex-shrink-0">
                  <img
                    src={userAvatar}
                    alt={userName}
                    className="w-7 h-7 sm:w-7.5 sm:h-7.5 rounded-full object-cover ring-2 ring-[var(--bg-primary)]"
                  />
                  <span className="w-2 h-2 rounded-full bg-emerald-500 absolute bottom-0 right-0 ring-1.5 ring-[var(--bg-primary)]" />
                </div>
                <span className="text-xs font-black text-[var(--text-primary)] hidden sm:inline max-w-[120px] truncate">
                  {userName}
                </span>
                <ChevronDown24Regular className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[var(--text-muted)] flex-shrink-0" />
              </button>

              {/* User Dropdown Menu Popover */}
              <AnimatePresence>
                {isUserMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -6, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -6, scale: 0.98 }}
                    transition={{ duration: 0.12, ease: 'easeOut' }}
                    className="absolute right-0 top-full mt-2 w-64 p-2 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] shadow-2xl overflow-hidden divide-y divide-[var(--border-subtle)]"
                  >
                    {/* User Profile Header */}
                    <div className="p-2.5 space-y-1">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={userAvatar}
                          alt={userName}
                          className="w-9 h-9 rounded-full object-cover ring-2 ring-[var(--border-subtle)]"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-black text-[var(--text-primary)] truncate">
                            {userName}
                          </p>
                          <p className="text-[11px] text-[var(--text-secondary)] truncate">
                            {userEmail}
                          </p>
                        </div>
                      </div>
                      <div className="pt-1 flex items-center gap-1.5">
                        <span className="px-2 py-0.5 rounded-md text-[9px] font-mono font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                          Core Platform Admin
                        </span>
                      </div>
                    </div>

                    {/* Navigation Options */}
                    <div className="p-1 space-y-0.5">
                      <Link
                        href="/dashboard"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] transition-colors"
                      >
                        <BuildingShop24Regular className="w-4 h-4 text-blue-500" />
                        <span>Salon Dashboard</span>
                      </Link>
                      <Link
                        href="/dashboard?tab=settings"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] transition-colors"
                      >
                        <Settings24Filled className="w-4 h-4 text-[var(--text-muted)]" />
                        <span>Platform Settings</span>
                      </Link>
                    </div>

                    {/* Log Out Option */}
                    <div className="p-1 pt-1.5">
                      <button
                        type="button"
                        onClick={handleSignOut}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-red-500 hover:bg-red-500/10 transition-colors cursor-pointer text-left"
                      >
                        <SignOut24Filled className="w-4 h-4 text-red-500 flex-shrink-0" />
                        <span>{t('signOut')}</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Return to Dashboard CTA */}
            <Link
              href="/dashboard"
              className="btn-secondary h-9.5 sm:h-10 px-3 sm:px-3.5 rounded-2xl text-xs font-bold flex items-center gap-1.5 shadow-xs"
            >
              <ArrowLeft24Filled className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">{t('dashboard')}</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="py-6 sm:py-8">
        {children}
      </main>
    </div>
  );
}
