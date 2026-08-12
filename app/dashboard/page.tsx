'use client';

import React, { useState, useEffect } from 'react';
import { useAirBookStore } from '@/lib/store';
import { DesktopHeader } from '@/components/DesktopHeader';
import { DesktopSidebar, DashboardTab } from '@/components/DesktopSidebar';
import { DateStrip } from '@/components/DateStrip';
import { TimeGrid } from '@/components/TimeGrid';
import { ServicesModule } from '@/components/ServicesModule';
import { ClientsModule } from '@/components/ClientsModule';
import { StaffModule } from '@/components/StaffModule';
import { WalkInKioskModule } from '@/components/WalkInKioskModule';
import { MarketingModule } from '@/components/MarketingModule';
import { InventoryModule } from '@/components/InventoryModule';
import { PackagesModule } from '@/components/PackagesModule';
import { MarketplaceModule } from '@/components/MarketplaceModule';
import { AnalyticsModule } from '@/components/AnalyticsModule';
import { SettingsModule } from '@/components/SettingsModule';
import { FloatingDock } from '@/components/FloatingDock';
import { BookingDrawer } from '@/components/BookingDrawer';
import { CommandPalette } from '@/components/CommandPalette';
import { POSCheckoutModal } from '@/components/POSCheckoutModal';
import { ClientNotesModal } from '@/components/ClientNotesModal';
import { AppointmentDetailsModal } from '@/components/AppointmentDetailsModal';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { motion } from 'framer-motion';
import {
  Calendar24Filled,
  Calendar24Regular,
  Person24Filled,
  Payment24Filled,
  People24Filled,
  Box24Filled,
  Sparkle24Filled,
  Tag24Filled,
  ShoppingBag24Filled,
  DataTrending24Filled,
  Settings24Filled,
  CheckmarkCircle24Regular,
  Clock24Regular,
  Money24Regular,
} from '@fluentui/react-icons';
import type { Appointment } from '@/lib/store';

/* ─── POS Panel ─── */
function POSPanel({ onOpenModal }: { onOpenModal: (apt: Appointment) => void }) {
  const { appointments, selectedDateStr } = useAirBookStore();
  const { t } = useTranslation();
  const todayApts = appointments.filter((a) => a.dateStr === selectedDateStr);
  const revenue = todayApts.reduce((sum, a) => sum + a.price, 0);
  const completed = todayApts.filter((a) => a.status === 'completed').length;

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 max-w-3xl mx-auto w-full">
      {/* Header */}
      <div>
        <h2 className="text-xl font-extrabold text-[var(--text-primary)] tracking-tight">{t('posTitle')}</h2>
        <p className="text-xs text-[var(--text-secondary)] mt-0.5">
          {t('posDesc')}
        </p>
      </div>

      {/* Daily summary */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: t('appointmentsToday'), value: todayApts.length, icon: Calendar24Regular, color: 'text-blue-500' },
          { label: t('revenueToday'), value: `$${revenue}`, icon: Money24Regular, color: 'text-green-500' },
          { label: t('completed'), value: completed, icon: CheckmarkCircle24Regular, color: 'text-violet-500' },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="p-4 rounded-2xl glass-panel bg-white/70 dark:bg-gray-900/70 border border-white/60 dark:border-white/10 text-center">
              <Icon className={`w-5 h-5 mx-auto mb-1 ${stat.color}`} />
              <p className="text-lg font-extrabold text-[var(--text-primary)]">{stat.value}</p>
              <p className="text-[10px] text-[var(--text-muted)] font-semibold uppercase tracking-wider">{stat.label}</p>
            </div>
          );
        })}
      </div>

      {/* Appointment list */}
      <div className="space-y-2">
        <p className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)]">{t('appointmentsToday')}</p>
        {todayApts.length === 0 && (
          <div className="py-12 text-center text-xs text-[var(--text-muted)]">
            {t('noAppointmentsToday')}
          </div>
        )}
        {todayApts.map((apt) => (
          <motion.button
            key={apt.id}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onOpenModal(apt)}
            className="w-full flex items-center justify-between p-4 rounded-2xl glass-panel bg-white/70 dark:bg-gray-900/70 border border-white/60 dark:border-white/10 text-left hover:shadow-md transition-all"
          >
            <div className="flex items-center gap-3">
              <div
                className="w-3 h-10 rounded-full flex-shrink-0"
                style={{ backgroundColor: apt.color }}
              />
              <div>
                <p className="text-sm font-bold text-[var(--text-primary)]">{apt.clientName}</p>
                <p className="text-[11px] text-[var(--text-secondary)]">{apt.serviceName} · {apt.staffName}</p>
                <p className="text-[10px] text-[var(--text-muted)] flex items-center gap-1 mt-0.5">
                  <Clock24Regular className="w-3 h-3" />
                  <span>{apt.startTime}</span>
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  apt.status === 'completed'
                    ? 'bg-green-500/10 text-green-600 dark:text-green-400'
                    : 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
                }`}
              >
                {apt.status === 'completed' ? t('completed') : apt.status === 'confirmed' ? t('statusConfirmed') : apt.status === 'pending' ? t('statusPending') : apt.status}
              </span>
              <span className="text-sm font-extrabold text-[var(--text-primary)]">${apt.price}</span>
              <div className="px-3 py-1.5 rounded-xl bg-black text-white dark:bg-white dark:text-black text-xs font-bold">
                {t('checkout')}
              </div>
            </div>
          </motion.button>
        ))}
      </div>

      {/* Manual checkout */}
      <motion.button
        whileTap={{ scale: 0.97 }}
        onClick={() => onOpenModal({ id: 'manual', clientName: 'Walk-in Client', serviceName: 'Manual Charge', staffName: '', price: 0, color: '#007AFF' } as Appointment)}
        className="w-full py-3 rounded-2xl border border-dashed border-black/20 dark:border-white/20 text-xs font-bold text-[var(--text-secondary)] hover:bg-black/5 dark:hover:bg-white/5 transition-colors flex items-center justify-center gap-2"
      >
        <Payment24Filled className="w-4 h-4" />
        <span>{t('manualCheckout')}</span>
      </motion.button>
    </div>
  );
}

export default function DashboardPage() {
  const { theme } = useAirBookStore();
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<DashboardTab>('calendar');

  const [isPOSOpen, setIsPOSOpen] = useState(false);
  const [isNotesOpen, setIsNotesOpen] = useState(false);
  const [posAppointment, setPOSAppointment] = useState<Appointment | null>(null);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  return (
    <main className="app-shell bg-[var(--canvas-bg)] text-[var(--canvas-fg)]">
      {/* Top Full-Width Header */}
      <DesktopHeader />

      {/* Main Full-Width Flex Body */}
      <div className="flex-1 flex w-full overflow-hidden relative">
        {/* Desktop Left Sidebar */}
        <DesktopSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Center Viewport */}
        <section className="flex-1 w-full flex flex-col h-full overflow-hidden relative">
          {/* Mobile Module Navigation Bar */}
          <div className="md:hidden flex items-center justify-between px-3 py-2 border-b border-[var(--border-subtle)] bg-[var(--header-bg)] overflow-x-auto gap-1">
            {[
              { id: 'calendar', label: 'Calendar', icon: Calendar24Filled },
              { id: 'crm', label: 'CRM', icon: Person24Filled },
              { id: 'pos', label: 'POS', icon: Payment24Filled },
              { id: 'team', label: 'Team', icon: People24Filled },
              { id: 'inventory', label: 'Inventory', icon: Box24Filled },
              { id: 'marketing', label: 'AI Marketing', icon: Sparkle24Filled },
              { id: 'memberships', label: 'Packages', icon: Tag24Filled },
              { id: 'marketplace', label: 'Marketplace', icon: ShoppingBag24Filled },
              { id: 'analytics', label: 'Analytics', icon: DataTrending24Filled },
              { id: 'settings', label: 'Settings', icon: Settings24Filled },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as DashboardTab)}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                    isActive
                      ? 'bg-[var(--nav-active-bg)] text-[var(--nav-active-fg)] shadow-sm'
                      : 'text-[var(--text-secondary)] bg-black/5 dark:bg-white/5'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Module 1: Calendar & Resources */}
          {activeTab === 'calendar' && (
            <div className="flex-1 flex flex-col h-full overflow-hidden">
              <DateStrip />
              <TimeGrid onSelectAppointment={(apt) => setSelectedAppointment(apt)} />
            </div>
          )}

          {/* Module 2: Client CRM & Unified Inbox */}
          {activeTab === 'crm' && (
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              <ClientsModule />
              <div className="max-w-5xl mx-auto px-6 flex justify-end">
                <button
                  onClick={() => setIsNotesOpen(true)}
                  className="px-4 py-2 rounded-xl bg-pink-500/10 text-pink-600 dark:text-pink-400 font-semibold text-xs border border-pink-500/20"
                >
                  {t('openSpecs')}
                </button>
              </div>
            </div>
          )}

          {/* Module 3: POS & Omnichannel Checkout */}
          {activeTab === 'pos' && (
            <POSPanel onOpenModal={(apt) => {
              setPOSAppointment(apt);
              setIsPOSOpen(true);
            }} />
          )}

          {/* Module 4: Team, Shifts & Payroll */}
          {activeTab === 'team' && (
            <div className="flex-1 overflow-y-auto p-4">
              <StaffModule />
            </div>
          )}

          {/* Module 5: Inventory & Omnichannel Retail */}
          {activeTab === 'inventory' && (
            <div className="flex-1 overflow-y-auto p-4">
              <InventoryModule />
            </div>
          )}

          {/* Module 6: AI Marketing & Loyalty */}
          {activeTab === 'marketing' && (
            <div className="flex-1 overflow-y-auto p-4">
              <MarketingModule />
            </div>
          )}

          {/* Module 7: Packages, Memberships & Gift Cards */}
          {activeTab === 'memberships' && (
            <div className="flex-1 overflow-y-auto p-4">
              <PackagesModule />
            </div>
          )}

          {/* Module 8: Online Booking Engine & Marketplace API */}
          {activeTab === 'marketplace' && (
            <div className="flex-1 overflow-y-auto p-4">
              <MarketplaceModule />
            </div>
          )}

          {/* Module 9: Analytics & Finance */}
          {activeTab === 'analytics' && (
            <div className="flex-1 overflow-y-auto p-4">
              <AnalyticsModule />
            </div>
          )}

          {/* Module 10: Settings */}
          {activeTab === 'settings' && (
            <div className="flex-1 overflow-y-auto p-4">
              <SettingsModule />
            </div>
          )}
        </section>
      </div>

      {/* Floating Action Dock */}
      <FloatingDock />

      {/* Booking Drawer */}
      <BookingDrawer />

      {/* Command Palette */}
      <CommandPalette />

      {/* Appointment Details Modal */}
      <AppointmentDetailsModal
        appointment={selectedAppointment}
        isOpen={!!selectedAppointment}
        onClose={() => setSelectedAppointment(null)}
        onOpenPOS={(apt) => {
          setPOSAppointment(apt);
          setIsPOSOpen(true);
        }}
        onOpenNotes={() => setIsNotesOpen(true)}
      />

      {/* POS Modal */}
      <POSCheckoutModal
        isOpen={isPOSOpen}
        onClose={() => { setIsPOSOpen(false); setPOSAppointment(null); }}
        clientName={posAppointment?.clientName}
        serviceName={posAppointment?.serviceName}
        totalPrice={posAppointment?.price || 75}
        staffName={posAppointment?.staffName || 'Staff Member'}
      />

      {/* Technical Notes Modal */}
      <ClientNotesModal isOpen={isNotesOpen} onClose={() => setIsNotesOpen(false)} />
    </main>
  );
}
