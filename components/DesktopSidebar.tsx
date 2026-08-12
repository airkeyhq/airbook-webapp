'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useAirBookStore } from '@/lib/store';
import { useTranslation } from '@/lib/i18n/useTranslation';
import {
  Calendar24Filled,
  Person24Filled,
  Payment24Filled,
  People24Filled,
  Box24Filled,
  Sparkle24Filled,
  Tag24Filled,
  ShoppingBag24Filled,
  DataTrending24Filled,
  Settings24Filled,
} from '@fluentui/react-icons';

export type DashboardTab =
  | 'calendar'
  | 'crm'
  | 'pos'
  | 'team'
  | 'inventory'
  | 'marketing'
  | 'memberships'
  | 'marketplace'
  | 'analytics'
  | 'settings';

interface DesktopSidebarProps {
  activeTab: DashboardTab;
  setActiveTab: (tab: DashboardTab) => void;
}

export const DesktopSidebar: React.FC<DesktopSidebarProps> = ({ activeTab, setActiveTab }) => {
  const { appointments } = useAirBookStore();
  const { t } = useTranslation();

  const NAV_ITEMS = [
    { id: 'calendar' as DashboardTab, label: t('tabCalendar'), icon: Calendar24Filled, badge: appointments.length },
    { id: 'crm' as DashboardTab, label: t('tabCrm'), icon: Person24Filled },
    { id: 'pos' as DashboardTab, label: t('tabPos'), icon: Payment24Filled },
    { id: 'team' as DashboardTab, label: t('tabTeam'), icon: People24Filled },
    { id: 'inventory' as DashboardTab, label: t('tabInventory'), icon: Box24Filled },
    { id: 'marketing' as DashboardTab, label: t('tabMarketing'), icon: Sparkle24Filled },
    { id: 'memberships' as DashboardTab, label: t('tabPackages'), icon: Tag24Filled },
    { id: 'marketplace' as DashboardTab, label: t('tabMarketplace'), icon: ShoppingBag24Filled },
    { id: 'analytics' as DashboardTab, label: t('tabAnalytics'), icon: DataTrending24Filled },
    { id: 'settings' as DashboardTab, label: t('tabSettings'), icon: Settings24Filled },
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 bg-[var(--sidebar-bg)] border-r border-[var(--border-subtle)] p-3 space-y-6 flex-shrink-0 h-full overflow-y-auto">
      {/* Navigation Group */}
      <div className="space-y-1.5 pt-2">
        <span className="px-3 text-[10px] font-black uppercase tracking-wider text-[var(--text-muted)]">
          {t('airbookModules')}
        </span>

        <nav className="mt-2.5 stack-sm">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <motion.button
                key={item.id}
                whileTap={{ scale: 0.96 }}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-2xl text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-[var(--nav-active-bg)] text-[var(--nav-active-fg)] shadow-md'
                    : 'text-[var(--nav-inactive)] hover:text-[var(--text-primary)] hover:bg-black/5 dark:hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span className="truncate">{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-mono flex-shrink-0 ${
                      isActive
                        ? 'bg-black/20 dark:bg-black/40 text-current'
                        : 'bg-black/5 dark:bg-white/10 text-[var(--text-muted)]'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </motion.button>
            );
          })}
        </nav>
      </div>

      {/* Enterprise Promo Card */}
      <div className="mt-auto p-4 rounded-3xl glass-panel bg-gradient-to-br from-blue-500/10 via-indigo-500/5 to-pink-500/10 border border-blue-500/20 text-xs space-y-2">
        <div className="flex items-center gap-1.5 font-extrabold text-blue-600 dark:text-blue-400">
          <Sparkle24Filled className="w-4 h-4" />
          <span>{t('enterpriseTitle')}</span>
        </div>
        <p className="text-[11px] text-[var(--text-secondary)] leading-tight">
          {t('enterpriseDesc')}
        </p>
      </div>
    </aside>
  );
};
