'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { useAirBookStore, Appointment } from '@/lib/store';
import { POSCheckoutModal } from '@/components/POSCheckoutModal';
import { POSTerminalModal } from '@/components/POSTerminalModal';
import { EmptyState } from '@/components/EmptyState';
import { getAvatarUrl } from '@/lib/avatars';
import {
  Payment24Filled,
  Calendar24Regular,
  Money24Regular,
  CheckmarkCircle24Filled,
  CheckmarkCircle24Regular,
  Add24Filled,
  Receipt24Regular,
  Tag24Regular,
  Clock24Regular,
  Print24Filled,
  ChevronRight24Regular,
  Sparkle24Filled,
} from '@fluentui/react-icons';

interface InvoiceRecord {
  id: string;
  clientId: string;
  clientName: string;
  clientEmail?: string;
  appointmentId?: string;
  subtotalCents: number;
  tipCents: number;
  taxCents: number;
  discountCents: number;
  totalCents: number;
  paymentMethod: string;
  receiptNumber?: string;
  status: string;
  createdAt: string;
}

export const POSModule: React.FC = () => {
  const { t } = useTranslation();
  const { appointments, selectedDateStr, openBookingDrawer } = useAirBookStore();

  const [invoices, setInvoices] = useState<InvoiceRecord[]>([]);
  const [loadingInvoices, setLoadingInvoices] = useState(true);

  // Tab Navigation State
  const [activeTab, setActiveTab] = useState<'queue' | 'invoices'>('queue');

  // Active Checkout Modal State
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [checkoutAppointment, setCheckoutAppointment] = useState<Appointment | null>(null);

  // Stripe Terminal State
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);
  const [terminalAmountCents, setTerminalAmountCents] = useState(0);

  const fetchRecentInvoices = async () => {
    try {
      setLoadingInvoices(true);
      const res = await fetch('/api/checkout');
      const data = await res.json();
      if (data.success && Array.isArray(data.invoices)) {
        setInvoices(data.invoices);
      }
    } catch (err) {
      console.warn('Failed to load recent invoices:', err);
    } finally {
      setLoadingInvoices(false);
    }
  };

  useEffect(() => {
    fetchRecentInvoices();
  }, []);

  const todayApts = appointments.filter((a) => a.dateStr === selectedDateStr);
  const totalRevenue = todayApts.reduce((sum, a) => sum + a.price, 0);
  const completedCount = todayApts.filter((a) => a.status === 'completed').length;
  const avgTicket = completedCount > 0 ? Math.round(totalRevenue / completedCount) : totalRevenue > 0 ? totalRevenue : 0;

  const handleOpenAppointmentCheckout = (apt: Appointment) => {
    setCheckoutAppointment(apt);
    setIsCheckoutOpen(true);
  };

  const handleOpenWalkinCheckout = () => {
    setCheckoutAppointment(null);
    setIsCheckoutOpen(true);
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-[var(--text-primary)] tracking-tight">
            {t('posTitle')}
          </h2>
          <p className="text-xs text-[var(--text-secondary)] mt-0.5">
            {t('posQueueSub')}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => { setTerminalAmountCents(Math.round(totalRevenue * 100) || 5000); setIsTerminalOpen(true); }}
            className="btn-secondary h-10 px-4 rounded-2xl flex items-center justify-center gap-1.5 text-xs font-bold"
          >
            <Payment24Filled className="w-4 h-4" />
            <span>{t('terminalReader')}</span>
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleOpenWalkinCheckout}
            className="btn-primary self-start sm:self-auto"
          >
            <Payment24Filled className="w-4 h-4" />
            <span>{t('quickWalkinSale')}</span>
          </motion.button>
        </div>
      </div>

      {!loadingInvoices && todayApts.length === 0 && invoices.length === 0 ? (
        <EmptyState
          icon={Calendar24Regular}
          title={t('noAppointmentsToday')}
          description={t('processWalkinPrompt')}
          action={{
            label: t('quickWalkinSale'),
            onClick: handleOpenWalkinCheckout,
            icon: Add24Filled,
          }}
        />
      ) : (
        <div className="space-y-6">
          {/* Daily Metrics Header Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
            <div className="p-4 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] space-y-1">
              <div className="flex items-center gap-1.5 text-[var(--text-secondary)]">
                <Calendar24Regular className="w-4 h-4 text-[var(--text-secondary)]" />
                <span className="text-[10px] uppercase font-bold tracking-wider">{t('appointmentsToday')}</span>
              </div>
              <p className="text-lg font-black text-[var(--text-primary)] font-mono">{todayApts.length}</p>
            </div>

            <div className="p-4 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] space-y-1">
              <div className="flex items-center gap-1.5 text-[var(--text-secondary)]">
                <Money24Regular className="w-4 h-4 text-[var(--text-secondary)]" />
                <span className="text-[10px] uppercase font-bold tracking-wider">{t('revenueToday')}</span>
              </div>
              <p className="text-lg font-black text-[var(--text-primary)] font-mono">${totalRevenue}</p>
            </div>

            <div className="p-4 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] space-y-1">
              <div className="flex items-center gap-1.5 text-[var(--text-secondary)]">
                <CheckmarkCircle24Regular className="w-4 h-4 text-[var(--text-secondary)]" />
                <span className="text-[10px] uppercase font-bold tracking-wider">{t('completed')}</span>
              </div>
              <p className="text-lg font-black text-[var(--text-primary)] font-mono">{completedCount}</p>
            </div>

            <div className="p-4 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] space-y-1">
              <div className="flex items-center gap-1.5 text-[var(--text-secondary)]">
                <Tag24Regular className="w-4 h-4 text-[var(--text-secondary)]" />
                <span className="text-[10px] uppercase font-bold tracking-wider">{t('metricAvgTicket')}</span>
              </div>
              <p className="text-lg font-black text-[var(--text-primary)] font-mono">${avgTicket}</p>
            </div>
          </div>

          {/* Segmented Control & Content Area */}
          <div className="space-y-3.5">
            {/* Segmented Control Track */}
            <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] w-fit overflow-x-auto">
              <button
                type="button"
                onClick={() => setActiveTab('queue')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'queue'
                    ? 'bg-[var(--bg-primary)] text-[var(--text-primary)] shadow-xs font-extrabold'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                <Calendar24Regular className="w-4 h-4" />
                <span>{t('posQueueTitle')}</span>
                {todayApts.length > 0 && (
                  <span className="px-1.5 py-0.5 rounded-full bg-black/5 dark:bg-white/10 text-[10px] font-mono font-extrabold">
                    {todayApts.length}
                  </span>
                )}
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('invoices')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'invoices'
                    ? 'bg-[var(--bg-primary)] text-[var(--text-primary)] shadow-xs font-extrabold'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                <Receipt24Regular className="w-4 h-4" />
                <span>{t('recentInvoices')}</span>
                {invoices.length > 0 && (
                  <span className="px-1.5 py-0.5 rounded-full bg-black/5 dark:bg-white/10 text-[10px] font-mono font-extrabold">
                    {invoices.length}
                  </span>
                )}
              </button>
            </div>

            {/* TAB 1: Today's Appointments Queue */}
            {activeTab === 'queue' && (
              <div>
                {todayApts.length === 0 ? (
                  <EmptyState
                    icon={Calendar24Regular}
                    title={t('noAppointmentsToday')}
                    description={t('processWalkinPrompt')}
                    action={{
                      label: t('quickWalkinSale'),
                      onClick: handleOpenWalkinCheckout,
                      icon: Add24Filled,
                    }}
                  />
                ) : (
                  <div className="divide-y divide-[var(--border-subtle)] border border-[var(--border-subtle)] rounded-2xl overflow-hidden bg-[var(--bg-primary)] shadow-xs">
                    {todayApts.map((apt) => {
                      const isPaid = apt.status === 'completed' || apt.paymentStatus === 'paid';
                      return (
                        <div
                          key={apt.id}
                          className="px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                        >
                          <div className="flex items-center gap-3.5 min-w-0">
                            <img
                              src={getAvatarUrl(apt.clientName)}
                              alt={apt.clientName}
                              className="w-11 h-11 rounded-2xl object-cover border border-[var(--border-subtle)] flex-shrink-0"
                            />
                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <h4 className="text-xs font-bold text-[var(--text-primary)] truncate">
                                  {apt.clientName}
                                </h4>
                                {isPaid ? (
                                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-extrabold uppercase tracking-wider flex items-center gap-1">
                                    <CheckmarkCircle24Filled className="w-3 h-3" />
                                    <span>{t('statusPaid')}</span>
                                  </span>
                                ) : (
                                  <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[10px] font-extrabold uppercase tracking-wider">
                                    {t('statusReadyForCheckout')}
                                  </span>
                                )}
                              </div>
                              <p className="text-[11px] text-[var(--text-secondary)] mt-0.5 flex items-center gap-2">
                                <Clock24Regular className="w-3.5 h-3.5" />
                                <span>{apt.startTime}</span>
                                <span>·</span>
                                <span className="font-semibold">{apt.serviceName}</span>
                                <span>·</span>
                                <span>{apt.staffName}</span>
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center justify-between sm:justify-end gap-3 flex-shrink-0">
                            <span className="text-sm font-black text-emerald-600 dark:text-emerald-400">
                              ${apt.price}
                            </span>

                            {isPaid ? (
                              <button
                                type="button"
                                onClick={() => handleOpenAppointmentCheckout(apt)}
                                className="px-3.5 py-1.5 rounded-xl bg-black/5 dark:bg-white/5 text-[var(--text-secondary)] hover:text-[var(--text-primary)] font-bold text-xs transition-colors cursor-pointer"
                              >
                                {t('viewReceipt')}
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={() => handleOpenAppointmentCheckout(apt)}
                                className="btn-primary"
                              >
                                {t('chargeClient')}
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: Recent Transactions & Invoices */}
            {activeTab === 'invoices' && (
              <div>
                {loadingInvoices ? (
                  <div className="p-6 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-center text-xs text-[var(--text-secondary)] animate-pulse">
                    {t('loadingLedger')}
                  </div>
                ) : invoices.length === 0 ? (
                  <EmptyState
                    icon={Receipt24Regular}
                    title={t('noInvoicesYet')}
                  />
                ) : (
                  <div className="divide-y divide-[var(--border-subtle)] border border-[var(--border-subtle)] rounded-2xl overflow-hidden bg-[var(--bg-primary)] shadow-xs">
                    {invoices.slice(0, 15).map((inv) => (
                      <div
                        key={inv.id}
                        className="px-5 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-8 h-8 rounded-xl bg-black/5 dark:bg-white/5 text-[var(--text-secondary)] flex items-center justify-center flex-shrink-0">
                            <Receipt24Regular className="w-4 h-4" />
                          </div>
                          <div className="min-w-0">
                            <p className="font-bold text-[var(--text-primary)] truncate">
                              {inv.clientName || t('walkInClientFallback')}
                            </p>
                            <p className="text-[10px] font-mono text-[var(--text-secondary)] mt-0.5">
                              {inv.receiptNumber || `REC-${inv.id.slice(0, 6)}`} · {new Date(inv.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between sm:justify-end gap-3 flex-shrink-0">
                          <span className="px-2 py-0.5 rounded-full bg-black/5 dark:bg-white/5 text-[10px] font-mono uppercase font-bold text-[var(--text-secondary)]">
                            {inv.paymentMethod}
                          </span>
                          <span className="font-extrabold text-[var(--text-primary)] font-mono text-xs">
                            ${(inv.totalCents / 100).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* POS Checkout Modal */}
      <POSCheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => {
          setIsCheckoutOpen(false);
          setCheckoutAppointment(null);
        }}
        appointmentId={checkoutAppointment?.id}
        clientName={checkoutAppointment?.clientName || t('walkInGuestFallback')}
        serviceName={checkoutAppointment?.serviceName || t('customServiceFallback')}
        totalPrice={checkoutAppointment?.price || 50}
        staffName={checkoutAppointment?.staffName || t('staffSpecialistFallback')}
        onCheckoutComplete={() => {
          fetchRecentInvoices();
        }}
      />

      {/* Stripe Terminal Hardware Reader Modal */}
      <POSTerminalModal
        isOpen={isTerminalOpen}
        onClose={() => setIsTerminalOpen(false)}
        amountCents={terminalAmountCents}
        description={t('terminalPaymentDescription')}
        onPaymentCollected={() => {
          setIsTerminalOpen(false);
          fetchRecentInvoices();
        }}
      />
    </div>
  );
};
