'use client';

import React, { useState, useEffect, useRef } from 'react';
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
  const [activeFilter, setActiveFilter] = useState<'all' | 'unread' | 'logs'>('all');
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  const containerRef = useRef<HTMLDivElement>(null);

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
    <div ref={containerRef} className="relative z-40">
      {/* Bell Button Pill */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="relative control-md gap-2 px-3 sm:px-4 bg-black/5 dark:bg-white/10 hover:bg-black/10 transition-colors text-[var(--text-primary)] flex-shrink-0"
        aria-label={t('notificationsInbox')}
      >
        <Alert24Regular className="w-4 h-4 text-[var(--text-primary)]" />
        <span className="hidden sm:inline">{t('inboxLabel')}</span>
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 sm:static sm:top-auto sm:right-auto px-1.5 rounded-full bg-red-500 text-white text-[10px] font-extrabold flex items-center justify-center min-w-[18px] h-[18px] shadow-sm">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Popover Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-80 sm:w-96 glass-panel bg-white/95 dark:bg-[#141720]/95 rounded-3xl shadow-2xl p-4 z-50 stack-3 overflow-hidden"
          >
            {/* Popover Header */}
            <div className="flex items-center justify-between pb-2 border-b border-black/5 dark:border-white/10">
              <div className="flex items-center gap-2">
                <Alert24Filled className="w-4 h-4 text-blue-500" />
                <h3 className="text-sm font-extrabold text-[var(--text-primary)]">{t('notificationsInbox')}</h3>
              </div>
              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={markAllRead}
                  className="text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:underline"
                >
                  {t('markAllRead')}
                </button>
              )}
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1 p-1 rounded-xl bg-black/5 dark:bg-white/5 text-xs font-bold">
              {[
                { id: 'all', label: t('filterAll') },
                { id: 'unread', label: `${t('filterUnread')} (${unreadCount})` },
                { id: 'logs', label: t('filterLogs') },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveFilter(tab.id as any)}
                  className={`flex-1 py-1 px-2 rounded-lg text-[11px] font-bold transition-colors ${
                    activeFilter === tab.id
                      ? 'bg-white dark:bg-gray-800 text-[var(--text-primary)] shadow-sm'
                      : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Notification List with Smooth Scroll Fade */}
            <div className="max-h-72 overflow-y-auto space-y-2 pr-1 scroll-fade-y py-1">
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
        )}
      </AnimatePresence>
    </div>
  );
};
