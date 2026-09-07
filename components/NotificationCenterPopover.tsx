'use client';

import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Alert24Filled,
  Alert24Regular,
  Mail24Regular,
  Dismiss24Filled,
  Payment24Regular,
  Checkmark24Filled,
  Calendar24Regular,
  Delete24Regular,
} from '@fluentui/react-icons';
import { useTranslation } from '@/lib/i18n/useTranslation';

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'sms' | 'email' | 'booking' | 'payment' | 'system';
  recipient?: string | null;
  metadata?: Record<string, unknown> | null;
  createdAt: string;
  isRead: boolean;
}

function formatRelativeTime(dateString: string): string {
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHours = Math.floor(diffMin / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffSec < 45) return 'Just now';
    if (diffMin < 60) return `${diffMin}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  } catch {
    return dateString;
  }
}

export const NotificationCenterPopover: React.FC = () => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'all' | 'unread' | 'logs'>('all');
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Fetch real notifications from database
  const fetchNotifications = async () => {
    try {
      const res = await fetch('/api/notifications');
      const data = await res.json();
      if (data.success && Array.isArray(data.notifications)) {
        setNotifications(
          data.notifications.map((n: any) => ({
            id: n.id,
            title: n.title,
            message: n.message,
            type: n.type || 'system',
            recipient: n.recipient || null,
            metadata: n.metadata || null,
            createdAt: n.createdAt,
            isRead: Boolean(n.isRead),
          }))
        );
      } else {
        setNotifications([]);
      }
    } catch (e) {
      console.warn('Failed to fetch notifications:', e);
      setNotifications([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [isOpen]);

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
  const readCount = notifications.filter((n) => n.isRead).length;

  const markAllRead = async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    try {
      await fetch('/api/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ all: true }),
      });
    } catch (e) {
      console.warn('Failed to mark all notifications as read:', e);
    }
  };

  const markAsRead = async (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
    try {
      await fetch('/api/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, isRead: true }),
      });
    } catch (e) {
      console.warn('Failed to mark notification as read:', e);
    }
  };

  const clearReadNotifications = async () => {
    setNotifications((prev) => prev.filter((n) => !n.isRead));
    try {
      await fetch('/api/notifications?clearAllRead=true', {
        method: 'DELETE',
      });
    } catch (e) {
      console.warn('Failed to clear read notifications:', e);
    }
  };

  const filteredNotifications = notifications.filter((n) => {
    if (activeFilter === 'unread') return !n.isRead;
    if (activeFilter === 'logs') return n.type === 'sms' || n.type === 'email';
    return true;
  });

  const renderIcon = (type: string) => {
    switch (type) {
      case 'booking':
        return <Calendar24Regular className="w-4 h-4 text-blue-500" />;
      case 'payment':
        return <Payment24Regular className="w-4 h-4 text-emerald-500" />;
      case 'sms':
      case 'email':
        return <Mail24Regular className="w-4 h-4 text-purple-500" />;
      default:
        return <Alert24Regular className="w-4 h-4 text-amber-500" />;
    }
  };

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

      {/* Desktop Popover (Lightweight anchored dropdown on desktop >= md:) */}
      {isOpen && (
        <div className="hidden md:flex absolute right-0 top-full mt-2 w-[420px] max-w-[calc(100vw-2rem)] max-h-[34rem] rounded-3xl border border-[var(--border-subtle)] bg-[var(--bg-primary)] p-4 sm:p-5 shadow-2xl z-[150] animate-in fade-in zoom-in-95 flex-col gap-3.5 overflow-hidden">
          {/* Popover Header */}
          <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)] gap-2 flex-shrink-0">
            <div className="flex items-center gap-2 min-w-0">
              <Alert24Regular className="w-4 h-4 text-blue-500 flex-shrink-0" />
              <h3 className="text-sm font-black text-[var(--text-primary)] truncate">
                {t('notificationsInbox')}
              </h3>
              {unreadCount > 0 && (
                <span className="px-1.5 py-0.5 rounded-full text-[10px] font-black bg-blue-500/15 text-blue-600 dark:text-blue-400 flex-shrink-0">
                  {unreadCount}
                </span>
              )}
            </div>
            <div className="flex items-center gap-1.5 flex-shrink-0">
              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={markAllRead}
                  className="btn-tertiary !h-7 !px-2.5 !rounded-xl text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:bg-blue-500/10 flex items-center gap-1.5 whitespace-nowrap flex-shrink-0 cursor-pointer transition-all active:scale-95"
                  title={t('markAllRead')}
                >
                  <Checkmark24Filled className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>{t('markAllRead')}</span>
                </button>
              )}
              {unreadCount === 0 && readCount > 0 && (
                <button
                  type="button"
                  onClick={clearReadNotifications}
                  className="btn-tertiary !h-7 !px-2.5 !rounded-xl text-[11px] font-bold text-[var(--text-muted)] hover:text-red-500 hover:bg-red-500/10 flex items-center gap-1.5 whitespace-nowrap flex-shrink-0 cursor-pointer transition-all active:scale-95"
                  title={t('clearAllRead')}
                >
                  <Delete24Regular className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>{t('clearAllRead')}</span>
                </button>
              )}
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-black/5 dark:bg-white/5 text-xs font-bold flex-shrink-0">
            {[
              { id: 'all', label: `${t('filterAll')} (${notifications.length})` },
              { id: 'unread', label: `${t('filterUnread')} (${unreadCount})` },
              {
                id: 'logs',
                label: `${t('filterLogs')} (${notifications.filter((n) => n.type === 'sms' || n.type === 'email').length})`,
              },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveFilter(tab.id as any)}
                className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold transition-colors cursor-pointer truncate ${
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
                  onClick={() => markAsRead(item.id)}
                  className={`p-3 rounded-2xl border transition-all cursor-pointer ${
                    item.isRead
                      ? 'bg-black/2 dark:bg-white/2 border-black/5 dark:border-white/5 opacity-75 hover:opacity-100'
                      : 'bg-blue-500/5 border-blue-500/20 hover:border-blue-500/40'
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    <div className="p-2 rounded-xl bg-black/5 dark:bg-white/10 text-[var(--text-secondary)] mt-0.5 flex-shrink-0">
                      {renderIcon(item.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <h4 className="text-xs font-bold text-[var(--text-primary)] truncate">{item.title}</h4>
                        <span className="text-[10px] font-mono text-[var(--text-muted)] flex-shrink-0">
                          {formatRelativeTime(item.createdAt)}
                        </span>
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
        </div>
      )}

      {/* Mobile/Tablet Bottom Sheet Drawer (Portaled to document.body, md:hidden) */}
      {mounted &&
        createPortal(
          <AnimatePresence>
            {isOpen && (
              <div className="fixed inset-0 z-[300] flex flex-col justify-end p-0 pointer-events-none md:hidden">
                {/* Backdrop Blur Overlay covering viewport on mobile/tablet */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setIsOpen(false)}
                  className="fixed inset-0 bg-black/60 backdrop-blur-md pointer-events-auto"
                />

                {/* Bottom Sheet Drawer Panel */}
                <motion.div
                  initial={{ y: '100%' }}
                  animate={{ y: 0 }}
                  exit={{ y: '100%' }}
                  transition={{ type: 'spring', damping: 28, stiffness: 300 }}
                  className="relative pointer-events-auto w-full h-[80vh] sm:h-[85vh] max-h-[90vh] rounded-t-[32px] rounded-b-none border-t border-[var(--border-subtle)] bg-[var(--bg-primary)] p-5 shadow-2xl flex flex-col gap-3.5 overflow-hidden z-10"
                >
                  {/* Drag Handle on mobile */}
                  <div className="w-12 h-1.5 rounded-full bg-black/20 dark:bg-white/20 mx-auto mb-1 flex-shrink-0" />

                  {/* Drawer Header */}
                  <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)] gap-2 flex-shrink-0">
                    <div className="flex items-center gap-2 min-w-0">
                      <Alert24Regular className="w-4 h-4 text-blue-500 flex-shrink-0" />
                      <h3 className="text-sm font-black text-[var(--text-primary)] truncate">
                        {t('notificationsInbox')}
                      </h3>
                      {unreadCount > 0 && (
                        <span className="px-1.5 py-0.5 rounded-full text-[10px] font-black bg-blue-500/15 text-blue-600 dark:text-blue-400 flex-shrink-0">
                          {unreadCount}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      {unreadCount > 0 && (
                        <button
                          type="button"
                          onClick={markAllRead}
                          className="btn-tertiary !h-7 !px-2.5 !rounded-xl text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:bg-blue-500/10 flex items-center gap-1.5 whitespace-nowrap cursor-pointer transition-all active:scale-95"
                          title={t('markAllRead')}
                        >
                          <Checkmark24Filled className="w-3.5 h-3.5 flex-shrink-0" />
                          <span>{t('markAllRead')}</span>
                        </button>
                      )}
                      {unreadCount === 0 && readCount > 0 && (
                        <button
                          type="button"
                          onClick={clearReadNotifications}
                          className="btn-tertiary !h-7 !px-2.5 !rounded-xl text-[11px] font-bold text-[var(--text-muted)] hover:text-red-500 hover:bg-red-500/10 flex items-center gap-1.5 whitespace-nowrap cursor-pointer transition-all active:scale-95"
                          title={t('clearAllRead')}
                        >
                          <Delete24Regular className="w-3.5 h-3.5 flex-shrink-0" />
                          <span>{t('clearAllRead')}</span>
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
                      { id: 'all', label: `${t('filterAll')} (${notifications.length})` },
                      { id: 'unread', label: `${t('filterUnread')} (${unreadCount})` },
                      {
                        id: 'logs',
                        label: `${t('filterLogs')} (${notifications.filter((n) => n.type === 'sms' || n.type === 'email').length})`,
                      },
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setActiveFilter(tab.id as any)}
                        className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold transition-colors cursor-pointer truncate ${
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
                  <div className="flex-1 overflow-y-auto space-y-2 pr-1 scroll-fade-y py-1 min-h-0 pb-8">
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
                          onClick={() => markAsRead(item.id)}
                          className={`p-3 rounded-2xl border transition-all cursor-pointer ${
                            item.isRead
                              ? 'bg-black/2 dark:bg-white/2 border-black/5 dark:border-white/5 opacity-75 hover:opacity-100'
                              : 'bg-blue-500/5 border-blue-500/20 hover:border-blue-500/40'
                          }`}
                        >
                          <div className="flex items-start gap-2.5">
                            <div className="p-2 rounded-xl bg-black/5 dark:bg-white/10 text-[var(--text-secondary)] mt-0.5 flex-shrink-0">
                              {renderIcon(item.type)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-2">
                                <h4 className="text-xs font-bold text-[var(--text-primary)] truncate">{item.title}</h4>
                                <span className="text-[10px] font-mono text-[var(--text-muted)] flex-shrink-0">
                                  {formatRelativeTime(item.createdAt)}
                                </span>
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

