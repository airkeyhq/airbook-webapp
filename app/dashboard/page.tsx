'use client';

import React, { useState, useEffect } from 'react';
import { useAirBookStore } from '@/lib/store';
import { DesktopHeader } from '@/components/DesktopHeader';
import { DesktopSidebar, DashboardTab } from '@/components/DesktopSidebar';
import { DateStrip } from '@/components/DateStrip';
import { TimeGrid } from '@/components/TimeGrid';
import { ServicesModule } from '@/components/ServicesModule';
import { ClientsModule } from '@/components/ClientsModule';
import { POSModule } from '@/components/POSModule';
import { StaffModule } from '@/components/StaffModule';
import { WalkInKioskModule } from '@/components/WalkInKioskModule';
import { MarketingModule } from '@/components/MarketingModule';
import { InventoryModule } from '@/components/InventoryModule';
import { PackagesModule } from '@/components/PackagesModule';
import { MarketplaceModule } from '@/components/MarketplaceModule';
import { AnalyticsModule } from '@/components/AnalyticsModule';
import { SettingsModule } from '@/components/SettingsModule';
import { BrandDAMModule } from '@/components/BrandDAMModule';
import { OnlineBookingModule } from '@/components/OnlineBookingModule';
import { FloatingDock } from '@/components/FloatingDock';
import { BookingDrawer } from '@/components/BookingDrawer';
import { CommandPalette } from '@/components/CommandPalette';
import { POSCheckoutModal } from '@/components/POSCheckoutModal';
import { ClientNotesModal } from '@/components/ClientNotesModal';
import { AppointmentDetailsModal } from '@/components/AppointmentDetailsModal';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { OfflineSyncBanner } from '@/components/OfflineSyncBanner';
import { POSLockScreen } from '@/components/POSLockScreen';
import { useInactivityLock } from '@/lib/useInactivityLock';
import { motion } from 'framer-motion';
import {
  Calendar24Filled,
  Calendar24Regular,
  Add24Filled,
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
  Clock24Filled,
  Money24Regular,
} from '@fluentui/react-icons';
import type { Appointment } from '@/lib/store';



export default function DashboardPage() {
  useInactivityLock();
  const { theme, workspaceId, setWorkspaceId } = useAirBookStore();
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

  const setStaffMembers = useAirBookStore((s) => s.setStaffMembers);
  const setServices = useAirBookStore((s) => s.setServices);

  // Bootstrap workspace context, real staff, and real services from DB
  useEffect(() => {
    if (!workspaceId) {
      fetch('/api/workspaces')
        .then((r) => r.json())
        .then((data) => {
          if (data?.success && Array.isArray(data.workspaces) && data.workspaces[0]?.id) {
            setWorkspaceId(data.workspaces[0].id);
          }
        })
        .catch((e) => console.warn('Failed to bootstrap workspace context:', e));
    }

    fetch('/api/staff')
      .then((r) => r.json())
      .then((data) => {
        if (data?.success && Array.isArray(data.staff) && data.staff.length > 0) {
          const mappedStaff = data.staff.map((st: any) => ({
            id: st.id,
            name: st.name,
            role: st.role || 'Specialist',
            color: st.color || '#007AFF',
            avatarUrl: st.avatarUrl || st.avatarEmoji || '',
            stationName: st.stationName || undefined,
          }));
          setStaffMembers(mappedStaff);
        }
      })
      .catch((e) => console.warn('Failed to bootstrap staff:', e));

    fetch('/api/services')
      .then((r) => r.json())
      .then((data) => {
        if (data?.success && Array.isArray(data.services) && data.services.length > 0) {
          const mappedServices = data.services.map((sv: any) => ({
            id: sv.id,
            name: sv.name,
            category: sv.category,
            duration: sv.durationMinutes,
            price: sv.priceCents / 100,
            color: sv.colorTag || '#00C7BE',
          }));
          setServices(mappedServices);
        }
      })
      .catch((e) => console.warn('Failed to bootstrap services:', e));
  }, [workspaceId, setWorkspaceId, setStaffMembers, setServices]);

  return (
    <main className="app-shell bg-[var(--canvas-bg)] text-[var(--canvas-fg)] flex flex-col h-screen w-screen overflow-hidden p-2.5 sm:p-3.5 gap-2.5 sm:gap-3.5">
      {/* Global Offline Sync Banner & Service Worker */}
      <OfflineSyncBanner />

      {/* Top Full-Width Header */}
      <DesktopHeader />

      {/* Main Full-Width Flex Body */}
      <div className="flex-1 flex w-full h-full min-h-0 overflow-hidden relative gap-2.5 sm:gap-3.5">
        {/* Desktop Left Floating Sidebar */}
        <DesktopSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Center Floating Viewport */}
        <section className="flex-1 flex flex-col h-full min-h-0 overflow-hidden relative rounded-2xl sm:rounded-[24px] bg-white dark:bg-[#141720] border border-slate-200/80 dark:border-white/10 shadow-md shadow-black/5 dark:shadow-black/30">
          {/* Mobile Module Navigation Bar */}
          <div className="md:hidden flex items-center justify-start px-3 py-2.5 border-b border-slate-200/80 dark:border-white/10 bg-slate-50/80 dark:bg-white/5 overflow-x-auto gap-1.5 hide-scrollbar rounded-t-2xl sm:rounded-t-[24px]">
            {[
              { id: 'calendar', label: t('tabCalendar'), icon: Calendar24Filled },
              { id: 'crm', label: t('tabCrm'), icon: Person24Filled },
              { id: 'pos', label: t('tabPos'), icon: Payment24Filled },
              { id: 'kiosk', label: t('tabKiosk'), icon: Clock24Filled },
              { id: 'team', label: t('tabTeam'), icon: People24Filled },
              { id: 'inventory', label: t('tabInventory'), icon: Box24Filled },
              { id: 'marketing', label: t('tabMarketing'), icon: Sparkle24Filled },
              { id: 'memberships', label: t('tabPackages'), icon: Tag24Filled },
              { id: 'marketplace', label: t('tabMarketplace'), icon: ShoppingBag24Filled },
              { id: 'analytics', label: t('tabAnalytics'), icon: DataTrending24Filled },
              { id: 'settings', label: t('tabSettings'), icon: Settings24Filled },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as DashboardTab)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors flex-shrink-0 ${
                    isActive
                      ? 'bg-[#2BB5FF] text-white shadow-sm'
                      : 'text-[var(--text-secondary)] bg-black/5 dark:bg-white/5 hover:bg-black/10'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 flex-shrink-0" />
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
            <div className="flex-1 overflow-y-auto p-4">
              <ClientsModule />
            </div>
          )}

          {/* Module 3: POS & Omnichannel Checkout */}
          {activeTab === 'pos' && (
            <div className="flex-1 overflow-y-auto p-4">
              <POSModule />
            </div>
          )}

          {/* Module: Walk-in Reception Kiosk & Live Queue */}
          {activeTab === 'kiosk' && (
            <div className="flex-1 overflow-y-auto p-4">
              <WalkInKioskModule />
            </div>
          )}

          {/* Module 4: Team, Shifts & Payroll */}
          {activeTab === 'team' && (
            <div className="flex-1 overflow-y-auto p-4">
              <StaffModule onNavigateToCalendar={() => setActiveTab('calendar')} />
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

          {/* Module 10: Brand & DAM Asset Management */}
          {activeTab === 'brand' && (
            <div className="flex-1 overflow-y-auto p-4">
              <BrandDAMModule />
            </div>
          )}

          {/* Module 11: Dedicated Online Booking Studio */}
          {activeTab === 'onlineBooking' && (
            <div className="flex-1 overflow-y-auto p-4">
              <OnlineBookingModule />
            </div>
          )}

          {/* Module 12: Settings */}
          {activeTab === 'settings' && (
            <div className="flex-1 overflow-y-auto p-4">
              <SettingsModule />
            </div>
          )}
        </section>
      </div>

      {/* Floating Action Dock */}
      <FloatingDock activeTab={activeTab} />

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
        appointmentId={posAppointment?.id}
        clientName={posAppointment?.clientName}
        serviceName={posAppointment?.serviceName}
        totalPrice={posAppointment?.price || 75}
        depositPaid={posAppointment?.depositPaidCents ? posAppointment.depositPaidCents / 100 : 0}
        staffName={posAppointment?.staffName || 'Staff Specialist'}
      />

      {/* Technical Notes Modal */}
      <ClientNotesModal isOpen={isNotesOpen} onClose={() => setIsNotesOpen(false)} />

      {/* POS Station Inactivity Lock Screen */}
      <POSLockScreen />
    </main>
  );
}
