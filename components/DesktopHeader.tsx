'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useAirBookStore } from '@/lib/store';
import { PricingModal } from './PricingModal';
import { CircleCloudIcon } from './Logo';
import { AuthModal } from './AuthModal';
import { NotificationCenterPopover } from './NotificationCenterPopover';
import { useSession, signOut } from '@/lib/auth-client';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { getAvatarUrl } from '@/lib/avatars';
import {
  ChevronDown24Filled,
  Share24Filled,
  Sparkle24Filled,
  SignOut24Filled,
  Person24Filled,
  Globe24Filled,
  Copy24Filled,
  Checkmark24Filled,
  QrCode24Filled,
  Dismiss24Filled,
} from '@fluentui/react-icons';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';

export const DesktopHeader: React.FC = () => {
  const { workspaceName, workspaceSlug, isSidebarCollapsed, toggleSidebar, isDemoMode, toggleDemoMode, isPricingModalOpen, closePricingModal } = useAirBookStore();
  const { data: session } = useSession();
  const { t, language, setLanguage, availableLanguages } = useTranslation();
  const router = useRouter();
  const [isPricingOpen, setIsPricingOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const [isWorkspaceMenuOpen, setIsWorkspaceMenuOpen] = useState(false);
  const [isShareMenuOpen, setIsShareMenuOpen] = useState(false);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [workspaces, setWorkspaces] = useState<any[]>([]);

  const [mounted, setMounted] = useState(false);
  const langMenuRef = useRef<HTMLDivElement>(null);
  const userDropdownRef = useRef<HTMLDivElement>(null);
  const workspaceDropdownRef = useRef<HTMLDivElement>(null);
  const shareMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch('/api/workspaces')
      .then(res => res.json())
      .then(data => {
        if (data.success) setWorkspaces(data.workspaces || []);
      })
      .catch(err => console.error('Failed to fetch workspaces', err));
  }, []);

  useEffect(() => {
    setMounted(true);
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (langMenuRef.current && !langMenuRef.current.contains(target)) {
        setIsLangMenuOpen(false);
      }
      if (userDropdownRef.current && !userDropdownRef.current.contains(target)) {
        setIsUserDropdownOpen(false);
      }
      if (workspaceDropdownRef.current && !workspaceDropdownRef.current.contains(target)) {
        setIsWorkspaceMenuOpen(false);
      }
      if (shareMenuRef.current && !shareMenuRef.current.contains(target)) {
        setIsShareMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentSlug = workspaceSlug || workspaceName.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');
  const publicBookingUrl = `https://getairbook.com/book/${currentSlug}`;

  const handleCopyDirectLink = () => {
    navigator.clipboard.writeText(publicBookingUrl);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
      setIsShareMenuOpen(false);
    }, 1500);
  };

  const handleSignOut = async () => {
    await signOut();
    router.push('/login');
  };

  const userName = session?.user?.name || '';
  const userEmail = session?.user?.email;

  return (
    <>
      <header
        className="w-full h-14 bg-white dark:bg-[#141720] border border-slate-200/80 dark:border-white/10 rounded-2xl sm:rounded-[20px] px-2.5 sm:px-4 flex items-center justify-between flex-shrink-0 z-40 relative shadow-sm gap-1.5 overflow-visible"
      >
        {/* Left: Workspace Dropdown Pill & Sidebar Toggle */}
        <div ref={workspaceDropdownRef} className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0 relative z-[100]">
          <button
            onClick={() => setIsWorkspaceMenuOpen(!isWorkspaceMenuOpen)}
            className="h-9 flex items-center gap-2 px-2.5 sm:px-3 rounded-full bg-black/5 dark:bg-white/10 hover:bg-black/10 transition-colors text-xs font-extrabold text-[var(--text-primary)] flex-shrink-0"
          >
            <CircleCloudIcon size={20} className="flex-shrink-0" />
            <span className="truncate max-w-[85px] sm:max-w-[200px]">{workspaceName}</span>
            <ChevronDown24Filled className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[var(--text-muted)] flex-shrink-0" />
          </button>

          {isWorkspaceMenuOpen && (
            <div className="absolute left-0 top-11 mt-1 w-64 bg-[var(--bg-primary)] border border-[var(--border-subtle)] rounded-2xl shadow-2xl p-2 z-[150] animate-in fade-in zoom-in-95 flex flex-col gap-1">
              
              <div className="max-h-60 overflow-y-auto space-y-1">
                {workspaces.map((ws) => (
                  <button
                    key={ws.id}
                    onClick={() => {
                      useAirBookStore.getState().setWorkspaceName(ws.name);
                      useAirBookStore.getState().setWorkspaceSlug(ws.slug);
                      setIsWorkspaceMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left hover:bg-black/5 dark:hover:bg-white/5 transition-colors group"
                  >
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs text-white" style={{ backgroundColor: ws.brandColor || '#007AFF' }}>
                      {ws.name.charAt(0)}
                    </div>
                    <div className="flex flex-col flex-1 truncate">
                      <span className="text-xs font-bold text-[var(--text-primary)] truncate">{ws.name}</span>
                      <span className="text-[10px] text-[var(--text-muted)] truncate">getairbook.com/book/{ws.slug}</span>
                    </div>
                  </button>
                ))}
              </div>

              <div className="pt-1 mt-1 border-t border-[var(--border-subtle)] space-y-0.5">
                <button
                  onClick={() => {
                    setIsWorkspaceMenuOpen(false);
                    setIsAuthOpen(true);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-blue-600 dark:text-blue-400 hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                >
                  <Sparkle24Filled className="w-4 h-4" />
                  <span>{t('createNewWorkspace')}</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Action Pills */}
        <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0 relative">
          {/* Notifications Inbox Popover */}
          <NotificationCenterPopover />

          {/* Language Switcher Pill */}
          <div ref={langMenuRef} className="relative z-[100]">
            <button
              onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
              className="h-9 flex items-center gap-1.5 px-2.5 sm:px-3 rounded-full bg-black/5 dark:bg-white/10 hover:bg-black/10 transition-colors text-xs font-bold text-[var(--text-primary)]"
            >
              <img
                src={`https://hatscripts.github.io/circle-flags/flags/${availableLanguages.find((l) => l.id === language)?.flagCode || 'us'}.svg`}
                alt={language}
                className="w-4 h-4 rounded-full object-cover flex-shrink-0"
              />
              <span className="uppercase text-[10px] tracking-wider hidden sm:inline">{language}</span>
              <ChevronDown24Filled className="w-3 h-3 text-[var(--text-muted)] flex-shrink-0" />
            </button>

            {isLangMenuOpen && (
              <div className="absolute right-0 mt-2 w-44 bg-white dark:bg-[#141720] border border-slate-200/90 dark:border-white/10 rounded-2xl shadow-2xl p-1.5 z-[150] animate-in fade-in zoom-in-95 flex flex-col gap-1">
                {availableLanguages.map((lang) => (
                  <button
                    key={lang.id}
                    onClick={() => {
                      setLanguage(lang.id);
                      setIsLangMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition-colors ${
                      language === lang.id
                        ? 'bg-black/5 dark:bg-white/10 text-blue-600 dark:text-blue-400 font-extrabold'
                        : 'text-[var(--text-primary)] hover:bg-black/5 dark:hover:bg-white/5'
                    }`}
                  >
                    <img
                      src={`https://hatscripts.github.io/circle-flags/flags/${lang.flagCode}.svg`}
                      alt={lang.label}
                      className="w-4 h-4 rounded-full object-cover flex-shrink-0"
                    />
                    <span>{lang.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Demo Mode Toggle Pill (ONLY rendered in Local Dev environment) */}
          {mounted && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') && (
            <button
              onClick={toggleDemoMode}
              className={`h-9 flex items-center gap-1.5 px-2.5 sm:px-3 rounded-full transition-all text-xs font-extrabold border ${
                isDemoMode
                  ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30'
                  : 'bg-black/5 dark:bg-white/10 text-[var(--text-secondary)] border-transparent hover:bg-black/10'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${isDemoMode ? 'bg-amber-500 animate-pulse' : 'bg-gray-400'}`} />
              <span className="hidden sm:inline">{isDemoMode ? t('demoModeOn') : t('demoMode')}</span>
              <span className="sm:hidden text-[10px]">{isDemoMode ? '⚡ Demo' : 'Demo'}</span>
            </button>
          )}


          {/* User Profile Pill / Dropdown */}
          <div ref={userDropdownRef} className="relative z-[100]">
            <button
              onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
              className="h-9 flex items-center gap-2 px-2.5 sm:px-3 rounded-full bg-black/5 dark:bg-white/10 hover:bg-black/10 transition-colors text-xs font-bold text-[var(--text-primary)]"
            >
              <img
                src={getAvatarUrl(userName || 'Operator', session?.user?.image)}
                alt={userName || 'User'}
                className="w-5 h-5 rounded-full object-cover flex-shrink-0"
              />
              <span className="hidden md:inline">{userName}</span>
            </button>

            {isUserDropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-[#141720] border border-slate-200/90 dark:border-white/10 rounded-2xl shadow-2xl p-2 z-[150] animate-in fade-in zoom-in-95 flex flex-col gap-1">
                <div className="px-3 py-2 border-b border-slate-100 dark:border-white/10 mb-1">
                  <p className="text-xs font-bold text-[#0F172A] dark:text-white truncate">{userName}</p>
                  {userEmail && <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{userEmail}</p>}
                </div>
                {session ? (
                  <button
                    onClick={handleSignOut}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-red-500 hover:bg-red-500/10 transition-colors"
                  >
                    <SignOut24Filled className="w-4 h-4" />
                    <span>{t('signOut')}</span>
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setIsUserDropdownOpen(false);
                      setIsAuthOpen(true);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-[var(--text-primary)] hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                  >
                    <Person24Filled className="w-4 h-4" />
                    <span>{t('signIn')}</span>
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Share Booking Dropdown */}
          <div ref={shareMenuRef} className="relative z-[100]">
            <button
              onClick={() => setIsShareMenuOpen(!isShareMenuOpen)}
              className="h-9 flex items-center justify-center gap-1.5 px-3 sm:px-4 rounded-full bg-[#2BB5FF] hover:bg-[#1A8EFF] text-white font-extrabold text-xs shadow-md shadow-[#2BB5FF]/30 transition-all active:scale-95 flex-shrink-0 cursor-pointer"
            >
              <Share24Filled className="w-3.5 h-3.5 flex-shrink-0" />
              <span>{t('shareLink')}</span>
            </button>

            {isShareMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-[var(--bg-primary)] border border-[var(--border-subtle)] rounded-2xl shadow-2xl p-1.5 z-[150] animate-in fade-in zoom-in-95 flex flex-col gap-0.5">
                {/* Option 1: Open Live Page */}
                <a
                  href={`/book/${currentSlug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setIsShareMenuOpen(false)}
                  className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold text-[var(--text-primary)] hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
                >
                  <Globe24Filled className="w-4 h-4 text-blue-500 flex-shrink-0" />
                  <span>{t('openLiveBookingPage')}</span>
                </a>

                {/* Option 2: Copy Link */}
                <button
                  onClick={handleCopyDirectLink}
                  className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold text-[var(--text-primary)] hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
                >
                  {copied ? (
                    <Checkmark24Filled className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  ) : (
                    <Copy24Filled className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  )}
                  <span>{copied ? t('linkCopied') : t('copyBookingLink')}</span>
                </button>

                {/* Option 3: QR Code */}
                <button
                  onClick={() => {
                    setIsShareMenuOpen(false);
                    setIsQrModalOpen(true);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold text-[var(--text-primary)] hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
                >
                  <QrCode24Filled className="w-4 h-4 text-purple-500 flex-shrink-0" />
                  <span>{t('qrCodeModalTitle')}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* QR Code Modal */}
      <AnimatePresence>
        {isQrModalOpen && (
          <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-sm rounded-3xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] p-6 shadow-2xl space-y-4 text-center"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-extrabold text-[var(--text-primary)] flex items-center gap-2">
                  <QrCode24Filled className="w-4 h-4 text-purple-500" />
                  <span>{t('qrCodeModalTitle')}</span>
                </h3>
                <button
                  type="button"
                  onClick={() => setIsQrModalOpen(false)}
                  className="p-1 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-[var(--text-secondary)] cursor-pointer"
                >
                  <Dismiss24Filled className="w-4 h-4" />
                </button>
              </div>

              <p className="text-xs text-[var(--text-secondary)]">{t('qrCodeModalDesc')}</p>

              {/* High-Resolution QR Vector Card */}
              <div className="p-6 bg-white rounded-2xl border border-slate-200 flex flex-col items-center justify-center shadow-md mx-auto w-48 h-48">
                <svg viewBox="0 0 100 100" className="w-36 h-36">
                  <rect x="0" y="0" width="100" height="100" fill="white" />
                  <rect x="10" y="10" width="24" height="24" fill="black" />
                  <rect x="14" y="14" width="16" height="16" fill="white" />
                  <rect x="18" y="18" width="8" height="8" fill="black" />
                  <rect x="66" y="10" width="24" height="24" fill="black" />
                  <rect x="70" y="14" width="16" height="16" fill="white" />
                  <rect x="74" y="18" width="8" height="8" fill="black" />
                  <rect x="10" y="66" width="24" height="24" fill="black" />
                  <rect x="14" y="70" width="16" height="16" fill="white" />
                  <rect x="18" y="74" width="8" height="8" fill="black" />
                  <rect x="40" y="10" width="8" height="8" fill="black" />
                  <rect x="52" y="14" width="8" height="8" fill="black" />
                  <rect x="40" y="26" width="8" height="8" fill="black" />
                  <rect x="48" y="38" width="8" height="8" fill="black" />
                  <rect x="14" y="44" width="8" height="8" fill="black" />
                  <rect x="28" y="48" width="8" height="8" fill="black" />
                  <rect x="66" y="44" width="8" height="8" fill="black" />
                  <rect x="78" y="52" width="8" height="8" fill="black" />
                  <rect x="40" y="66" width="8" height="8" fill="black" />
                  <rect x="54" y="74" width="8" height="8" fill="black" />
                  <rect x="62" y="66" width="8" height="8" fill="black" />
                  <rect x="78" y="80" width="8" height="8" fill="black" />
                </svg>
              </div>

              <div className="space-y-2">
                <p className="text-[11px] font-mono text-blue-500 font-bold truncate">
                  {publicBookingUrl}
                </p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleCopyDirectLink}
                    className="flex-1 py-2.5 rounded-2xl bg-black/5 dark:bg-white/10 hover:bg-black/10 text-xs font-bold text-[var(--text-primary)] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    {copied ? <Checkmark24Filled className="w-3.5 h-3.5 text-emerald-500" /> : <Copy24Filled className="w-3.5 h-3.5" />}
                    <span>{copied ? t('linkCopied') : t('copyBookingLink')}</span>
                  </button>
                  <a
                    href={`/book/${currentSlug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-xs font-bold text-white flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Globe24Filled className="w-3.5 h-3.5" />
                    <span>{t('openLiveBookingPage')}</span>
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal Dialogs */}
      <PricingModal isOpen={isPricingOpen || isPricingModalOpen} onClose={() => { setIsPricingOpen(false); closePricingModal(); }} />
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </>
  );
};
