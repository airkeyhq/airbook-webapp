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
  ChevronLeft24Filled,
  ChevronRight24Filled,
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
  const { appointments, isSidebarCollapsed, toggleSidebar } = useAirBookStore();
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
    <aside
      className={`hidden md:flex flex-col bg-white dark:bg-[#141720] border border-slate-200/80 dark:border-white/10 rounded-2xl sm:rounded-[24px] p-3 flex-shrink-0 h-full shadow-md shadow-black/5 dark:shadow-black/30 transition-all duration-300 ease-in-out relative ${
        isSidebarCollapsed ? 'w-[72px] overflow-visible z-[99999]' : 'w-64 overflow-y-auto z-20'
      }`}
    >
      {/* Header & Toggle Button */}
      <div className={`flex items-center pt-1 pb-2 ${isSidebarCollapsed ? 'justify-center' : 'justify-between px-1'}`}>
        {!isSidebarCollapsed && (
          <span className="text-[10px] font-black uppercase tracking-wider text-[var(--text-muted)] truncate">
            {t('airbookModules')}
          </span>
        )}

        <div className="relative group">
          <motion.button
            whileTap={{ scale: 0.9 }}
            whileHover={{ scale: 1.08 }}
            onClick={toggleSidebar}
            aria-label={isSidebarCollapsed ? t('expandSidebar') : t('collapseSidebar')}
            className="w-8 h-8 rounded-xl bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 text-[var(--text-primary)] flex items-center justify-center transition-colors flex-shrink-0"
          >
            {isSidebarCollapsed ? (
              <ChevronRight24Filled className="w-4 h-4" />
            ) : (
              <ChevronLeft24Filled className="w-4 h-4" />
            )}
          </motion.button>

          {isSidebarCollapsed && (
            <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 px-3.5 py-1.5 rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 text-xs font-extrabold whitespace-nowrap shadow-2xl border border-white/20 dark:border-slate-300 opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-150 transform -translate-x-1 group-hover:translate-x-0 z-[99999] drop-shadow-2xl">
              <span>{t('expandSidebar')}</span>
              <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-2 h-2 bg-slate-900 dark:bg-white rotate-45" />
            </div>
          )}
        </div>
      </div>

      {/* Navigation Links */}
      <nav className={`mt-2 space-y-1.5 flex-1 pr-0.5 ${isSidebarCollapsed ? 'overflow-visible' : 'overflow-y-auto'}`}>
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <div key={item.id} className="relative group">
              <motion.button
                whileTap={{ scale: 0.96 }}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center ${
                  isSidebarCollapsed ? 'justify-center py-3' : 'justify-between px-3 py-2.5'
                } rounded-2xl text-xs font-bold transition-all relative ${
                  isActive
                    ? 'bg-[var(--nav-active-bg)] text-[var(--nav-active-fg)] shadow-md'
                    : 'text-[var(--nav-inactive)] hover:text-[var(--text-primary)] hover:bg-black/5 dark:hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  {!isSidebarCollapsed && <span className="truncate">{item.label}</span>}
                </div>

                {!isSidebarCollapsed && item.badge !== undefined && (
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

                {/* Collapsed Badge Dot Indicator */}
                {isSidebarCollapsed && item.badge !== undefined && item.badge > 0 && (
                  <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-pink-500 ring-2 ring-white dark:ring-[#141720]" />
                )}
              </motion.button>

              {/* Floating Tooltip when Collapsed */}
              {isSidebarCollapsed && (
                <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 px-3.5 py-1.5 rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 text-xs font-extrabold whitespace-nowrap shadow-2xl border border-white/20 dark:border-slate-300 opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-150 transform -translate-x-1 group-hover:translate-x-0 z-[99999] flex items-center gap-2 drop-shadow-2xl">
                  <span>{item.label}</span>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="px-1.5 py-0.5 rounded-full text-[9px] font-mono font-bold bg-pink-500 text-white">
                      {item.badge}
                    </span>
                  )}
                  <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-2 h-2 bg-slate-900 dark:bg-white rotate-45" />
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Enterprise Promo Card */}
      {!isSidebarCollapsed ? (
        <div className="mt-auto p-4 rounded-3xl glass-panel bg-gradient-to-br from-blue-500/10 via-indigo-500/5 to-pink-500/10 border border-blue-500/20 text-xs space-y-2">
          <div className="flex items-center gap-1.5 font-extrabold text-blue-600 dark:text-blue-400">
            <Sparkle24Filled className="w-4 h-4 flex-shrink-0" />
            <span className="truncate">{t('enterpriseTitle')}</span>
          </div>
          <p className="text-[11px] text-[var(--text-secondary)] leading-tight">
            {t('enterpriseDesc')}
          </p>
        </div>
      ) : (
        <div className="relative group mt-auto">
          <div className="mx-auto w-10 h-10 rounded-2xl glass-panel bg-gradient-to-br from-blue-500/10 to-pink-500/10 border border-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400 cursor-pointer">
            <Sparkle24Filled className="w-4 h-4" />
          </div>

          <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 px-3.5 py-1.5 rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 text-xs font-extrabold whitespace-nowrap shadow-2xl border border-white/20 dark:border-slate-300 opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-150 transform -translate-x-1 group-hover:translate-x-0 z-[99999] drop-shadow-2xl">
            <span>{t('enterpriseTitle')}</span>
            <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-2 h-2 bg-slate-900 dark:bg-white rotate-45" />
          </div>
        </div>
      )}
    </aside>
  );
};
