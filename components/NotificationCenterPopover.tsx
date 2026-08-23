'use client';

import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Alert24Filled, Alert24Regular, CheckmarkCircle24Regular, Mail24Regular, Dismiss24Filled, Star24Regular, Box24Regular, Payment24Regular } from '@fluentui/react-icons';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { useAirBookStore } from '@/lib/store';

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'sms' | 'email' | 'system' | 'payment';
  timestamp: string;
  isRead: boolean;
}

const DEFAULT_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'n1',
    title: 'SMS Reminder Sent',
    message: 'Sent 24h appointment reminder to Sarah Jenkins (+1 555-0199).',
    type: 'sms',
    timestamp: '2 mins ago',
    isRead: false,
  },
  {
    id: 'n2',
    title: 'Google Review Request',
    message: 'Automated 5-star review request sent to Dennis Müller via SMS.',
    type: 'sms',
    timestamp: '1 hour ago',
    isRead: false,
  },
  {
    id: 'n3',
    title: 'Low Stock Alert',
    message: 'Kerastase Nutritive Shampoo reached low stock threshold (2 left).',
    type: 'system',
    timestamp: '3 hours ago',
    isRead: false,
  },
  {
    id: 'n4',
    title: 'Stripe Deposit Confirmed',
    message: '$25 deposit received for Hair Color & Style with Eduardo.',
    type: 'payment',
    timestamp: 'Yesterday',
    isRead: true,
  },
];

export const NotificationCenterPopover: React.FC = () => {
  const { t } = useTranslation();
  const isDemoMode = useAirBookStore((s) => s.isDemoMode);
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'all' | 'unread' | 'logs'>('all');
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Fetch real logs from /api/notifications when opened (or use demo entries if isDemoMode is on)
  const fetchLogs = async () => {
    if (isDemoMode) {
      setNotifications(DEFAULT_NOTIFICATIONS);
      return;
    }

    try {
      const res = await fetch('/api/notifications');
      const data = await res.json();
      if (data.success && Array.isArray(data.logs)) {
        const liveLogs: NotificationItem[] = data.logs.map((log: any) => ({
          id: log.id,
          title: log.type === 'sms' ? 'SMS Notification Dispatched' : 'Email Notification Sent',
          message: `To: ${log.recipient} — "${log.message}"`,
          type: log.type || 'sms',
          timestamp: new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isRead: false,
        }));
        setNotifications(liveLogs);
      } else {
        setNotifications([]);
      }
    } catch (e) {
      console.warn('Failed to fetch notifications logs:', e);
      setNotifications([]);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [isOpen, isDemoMode]);

  // Click outside listener
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const filteredNotifications = notifications.filter((n) => {
    if (activeFilter === 'unread') return !n.isRead;
    if (activeFilter === 'logs') return n.type === 'sms' || n.type === 'email';
    return true;
  });

  return (
    <div ref={containerRef} className="relative z-[100] group">
      {/* Bell Button Pill (Icon Only, Actionable Filled) */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-9 h-9 rounded-full flex items-center justify-center bg-black/5 dark:bg-white/10 hover:bg-black/10 transition-colors text-[var(--text-primary)] relative flex-shrink-0 cursor-pointer"
        aria-label={t('notificationsInbox')}
      >
        <Alert24Filled className="w-4 h-4 text-[var(--text-primary)]" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 px-1.5 rounded-full bg-red-500 text-white text-[10px] font-extrabold flex items-center justify-center min-w-[16px] h-[16px] shadow-sm">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Hover Tooltip */}
      {!isOpen && (
        <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 text-[11px] font-extrabold whitespace-nowrap shadow-2xl border border-white/20 dark:border-slate-300 opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-150 transform translate-y-[-2px] group-hover:translate-y-0 z-30 drop-shadow-2xl">
          <span>{t('notificationsInbox')}</span>
          <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-900 dark:bg-white rotate-45" />
        </div>
      )}

      {/* Drawer Overlay (Portaled to document.body for total backdrop occlusion over all app chrome) */}
      {mounted &&
        createPortal(
          <AnimatePresence>
            {isOpen && (
              <div className="fixed inset-0 z-[300] flex flex-col justify-end md:justify-start md:items-end p-0 md:p-4 pointer-events-none">
                {/* Backdrop Blur Overlay covering 100% of viewport and all app chrome */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setIsOpen(false)}
                  className="fixed inset-0 bg-black/60 backdrop-blur-md pointer-events-auto"
                />

                {/* Drawer / Popover Panel */}
                <motion.div
                  initial={{ opacity: 0, y: 30, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 30, scale: 0.98 }}
                  transition={{ type: 'spring', damping: 26, stiffness: 320 }}
                  className="relative pointer-events-auto w-full max-h-[85vh] md:max-h-[34rem] md:max-w-md rounded-t-[32px] md:rounded-3xl rounded-b-none md:rounded-b-3xl border-t md:border border-[var(--border-subtle)] bg-[var(--bg-primary)] p-5 md:p-6 shadow-2xl flex flex-col gap-3.5 overflow-hidden z-10 md:mt-14 md:mr-2"
                >
                  {/* Drag Handle on mobile */}
                  <div className="w-12 h-1.5 rounded-full bg-black/20 dark:bg-white/20 mx-auto md:hidden flex-shrink-0" />

                  {/* Drawer Header */}
                  <div className="flex items-center justify-between pb-2 border-b border-[var(--border-subtle)] flex-shrink-0">
                    <div className="flex items-center gap-2">
                      <Alert24Regular className="w-4 h-4 text-blue-500" />
                      <h3 className="text-sm font-extrabold text-[var(--text-primary)]">{t('notificationsInbox')}</h3>
                    </div>
                    <div className="flex items-center gap-2">
                      {unreadCount > 0 && (
                        <button
                          type="button"
                          onClick={markAllRead}
                          className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                        >
                          {t('markAllRead')}
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => setIsOpen(false)}
                        className="w-7 h-7 rounded-full bg-black/5 dark:bg-white/10 hover:bg-black/10 transition-colors flex items-center justify-center text-[var(--text-secondary)] cursor-pointer"
                        aria-label={t('close')}
                      >
                        <Dismiss24Filled className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Filter Tabs */}
                  <div className="flex items-center gap-1 p-1 rounded-xl bg-black/5 dark:bg-white/5 text-xs font-bold flex-shrink-0">
                    {[
                      { id: 'all', label: t('filterAll') },
                      { id: 'unread', label: `${t('filterUnread')} (${unreadCount})` },
                      { id: 'logs', label: t('filterLogs') },
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setActiveFilter(tab.id as any)}
                        className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                          activeFilter === tab.id
                            ? 'bg-[var(--bg-primary)] text-[var(--text-primary)] shadow-sm'
                            : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  {/* Notification List with Smooth Scroll */}
                  <div className="flex-1 overflow-y-auto space-y-2 pr-1 scroll-fade-y py-1 min-h-0">
                    {filteredNotifications.length === 0 ? (
                      <div className="py-10 px-4 text-center flex flex-col items-center justify-center space-y-2.5">
                        <div className="w-12 h-12 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 flex items-center justify-center text-[var(--text-muted)]">
                          <Alert24Regular className="w-6 h-6 opacity-60" />
                        </div>
                        <div>
                          <h4 className="text-xs font-extrabold text-[var(--text-primary)] tracking-tight">
                            {t('noNotificationsView')}
                          </h4>
                          <p className="text-[11px] text-[var(--text-muted)] mt-1 max-w-[240px] mx-auto leading-relaxed">
                            {t('noNotificationsSub')}
                          </p>
                        </div>
                      </div>
                    ) : (
                      filteredNotifications.map((item) => (
                        <div
                          key={item.id}
                          onClick={() => {
                            setNotifications((prev) =>
                              prev.map((n) => (n.id === item.id ? { ...n, isRead: true } : n))
                            );
                          }}
                          className={`p-3 rounded-2xl border transition-all cursor-pointer ${
                            item.isRead
                              ? 'bg-black/2 dark:bg-white/2 border-black/5 dark:border-white/5 opacity-75'
                              : 'bg-blue-500/5 border-blue-500/20'
                          }`}
                        >
                          <div className="flex items-start gap-2.5">
                            <div className="p-2 rounded-xl bg-black/5 dark:bg-white/10 text-blue-500 mt-0.5 flex-shrink-0">
                              {item.type === 'sms' || item.type === 'email' ? (
                                <Mail24Regular className="w-4 h-4" />
                              ) : item.type === 'payment' ? (
                                <Payment24Regular className="w-4 h-4 text-emerald-500" />
                              ) : (
                                <Box24Regular className="w-4 h-4 text-amber-500" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <h4 className="text-xs font-bold text-[var(--text-primary)] truncate">{item.title}</h4>
                                <span className="text-[10px] font-mono text-[var(--text-muted)]">{item.timestamp}</span>
                              </div>
                              <p className="text-[11px] text-[var(--text-secondary)] mt-0.5 leading-snug line-clamp-2">
                                {item.message}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </div>
  );
};
