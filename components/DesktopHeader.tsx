'use client';

import React, { useState } from 'react';
import { useAirBookStore } from '@/lib/store';
import { PricingModal } from './PricingModal';
import { AuthModal } from './AuthModal';
import { useSession, signOut } from '@/lib/auth-client';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { ChevronDown24Filled, Share24Filled, Sparkle24Filled, SignOut24Filled, Person24Filled } from '@fluentui/react-icons';
import { useRouter } from 'next/navigation';

export const DesktopHeader: React.FC = () => {
  const { workspaceName } = useAirBookStore();
  const { data: session } = useSession();
  const { t, language, setLanguage, availableLanguages } = useTranslation();
  const router = useRouter();
  const [isPricingOpen, setIsPricingOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);

  const handleShareLink = () => {
    navigator.clipboard.writeText(`https://airbook.app/book/eduardos-lounge`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSignOut = async () => {
    await signOut();
    router.push('/login');
  };

  const userName = session?.user?.name || 'Eduardo Moreno';
  const userEmail = session?.user?.email;

  return (
    <>
      <header className="w-full h-14 bg-[var(--header-bg)] border-b border-[var(--border-subtle)] px-4 flex items-center justify-between flex-shrink-0 z-[70] relative">
        {/* Left: Workspace Dropdown Pill */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsAuthOpen(true)}
            className="h-9 flex items-center gap-2.5 px-3 rounded-full bg-black/5 dark:bg-white/10 hover:bg-black/10 transition-colors text-xs font-extrabold text-[var(--text-primary)]"
          >
            <div className="w-5 h-5 rounded-full bg-black text-white dark:bg-white dark:text-black flex items-center justify-center font-bold text-[10px]">
              {workspaceName.charAt(0)}
            </div>
            <span className="truncate max-w-[110px] sm:max-w-[200px]">{workspaceName}</span>
            <ChevronDown24Filled className="w-3.5 h-3.5 text-[var(--text-muted)] flex-shrink-0" />
          </button>
        </div>

        {/* Right Action Pills */}
        <div className="flex items-center gap-1.5 sm:gap-2.5">
          {/* Language Switcher Pill */}
          <div className="relative z-[80]">
            <button
              onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
              className="h-9 flex items-center gap-1.5 px-3 rounded-full bg-black/5 dark:bg-white/10 hover:bg-black/10 transition-colors text-xs font-bold text-[var(--text-primary)]"
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
              <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-[#141720] border border-slate-200 dark:border-white/10 rounded-2xl shadow-2xl p-1.5 z-[90] animate-in fade-in zoom-in-95 flex flex-col gap-1">
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

          {/* Demo Mode Toggle Pill */}
          <button
            onClick={useAirBookStore.getState().toggleDemoMode}
            className={`h-9 flex items-center gap-1.5 px-3 rounded-full transition-all text-xs font-extrabold border ${
              useAirBookStore((s) => s.isDemoMode)
                ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30'
                : 'bg-black/5 dark:bg-white/10 text-[var(--text-secondary)] border-transparent hover:bg-black/10'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${useAirBookStore((s) => s.isDemoMode) ? 'bg-amber-500 animate-pulse' : 'bg-gray-400'}`} />
            <span>{useAirBookStore((s) => s.isDemoMode) ? '⚡ Demo Mode: ON' : 'Demo Mode'}</span>
          </button>

          {/* Upgrade Plan Pill */}
          <button
            onClick={() => setIsPricingOpen(true)}
            className="h-9 hidden sm:flex items-center gap-1.5 px-3.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 transition-all text-xs font-extrabold"
          >
            <Sparkle24Filled className="w-3.5 h-3.5" />
            <span>{t('upgradePlan')}</span>
          </button>

          {/* User Profile Pill / Dropdown */}
          <div className="relative z-[80]">
            <button
              onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
              className="h-9 flex items-center gap-2 px-3 rounded-full bg-black/5 dark:bg-white/10 hover:bg-black/10 transition-colors text-xs font-bold text-[var(--text-primary)]"
            >
              <div className="w-5 h-5 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold text-[10px]">
                {userName.charAt(0).toUpperCase()}
              </div>
              <span className="hidden md:inline">{userName}</span>
            </button>

            {isUserDropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-[#141720] border border-slate-200 dark:border-white/10 rounded-2xl shadow-2xl p-2 z-[90] animate-in fade-in zoom-in-95 flex flex-col gap-1">
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

          {/* Share Booking Link Button */}
          <button
            onClick={handleShareLink}
            className="h-9 flex items-center gap-1.5 px-3.5 sm:px-4 rounded-full bg-[#2BB5FF] hover:bg-[#1A8EFF] text-white font-extrabold text-xs shadow-md shadow-[#2BB5FF]/30 transition-all active:scale-95 flex-shrink-0"
          >
            <Share24Filled className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="hidden sm:inline">{copied ? t('linkCopied') : t('shareLink')}</span>
          </button>
        </div>
      </header>

      <PricingModal isOpen={isPricingOpen} onClose={() => setIsPricingOpen(false)} />
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </>
  );
};
