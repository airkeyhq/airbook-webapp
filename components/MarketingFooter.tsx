'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Logo } from '@/components/Logo';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { useSession } from '@/lib/auth-client';
import { Heart24Filled, Mail24Regular, News24Regular, CheckmarkCircle24Filled } from '@fluentui/react-icons';
import { LanguageSelector } from '@/components/LanguageSelector';

export const MarketingFooter: React.FC = () => {
  const { t, language } = useTranslation();
  const { data: session } = useSession();
  const [dispatchEmail, setDispatchEmail] = useState('');
  const [hpTrap, setHpTrap] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleDispatchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dispatchEmail.trim() || submitting) return;

    try {
      setSubmitting(true);
      const res = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: dispatchEmail.trim(),
          locale: language,
          source: 'marketing_footer',
          _airbook_hp_check: hpTrap,
        }),
      });
      if (res.ok) {
        setIsSubscribed(true);
        setDispatchEmail('');
      }
    } catch (err) {
      console.error('Newsletter subscribe error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <footer className="border-t border-[var(--border-subtle)] bg-[var(--bg-secondary)] py-14 relative z-10 text-xs text-[var(--text-secondary)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
        {/* Global Platform Dispatch Newsletter Banner */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 shadow-xs">
          <div className="flex items-start gap-3.5 max-w-xl">
            <span className="w-9 h-9 rounded-xl bg-[#2BB5FF]/10 text-[#2BB5FF] flex items-center justify-center flex-shrink-0 mt-0.5 shadow-2xs">
              <News24Regular className="w-4.5 h-4.5" />
            </span>
            <div className="space-y-1">
              <h3 className="text-sm sm:text-base font-black tracking-tight text-[var(--text-primary)]">
                {t('footerDispatchTitle')}
              </h3>
              <p className="text-xs text-[var(--text-secondary)] font-medium leading-relaxed">
                {t('footerDispatchSubtitle')}
              </p>
            </div>
          </div>

          {/* Form / Success State */}
          <div className="w-full lg:w-auto flex-shrink-0">
            {isSubscribed ? (
              <div className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold shadow-xs">
                <CheckmarkCircle24Filled className="w-4 h-4 text-emerald-500" />
                <span>{t('subscribedSuccess')}</span>
              </div>
            ) : (
              <form
                onSubmit={handleDispatchSubmit}
                className="flex flex-col sm:flex-row items-center gap-2 w-full lg:w-[380px] p-1.5 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)]"
              >
                <div className="flex items-center gap-2 px-3 w-full">
                  <Mail24Regular className="w-4 h-4 text-[var(--text-muted)] flex-shrink-0" />
                  <input
                    type="email"
                    required
                    value={dispatchEmail}
                    onChange={(e) => setDispatchEmail(e.target.value)}
                    placeholder={t('footerDispatchPlaceholder')}
                    className="w-full bg-transparent text-xs font-medium text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none py-1.5"
                  />
                  {/* Invisible Honeypot Trap */}
                  <input
                    type="text"
                    name="_airbook_hp_check"
                    tabIndex={-1}
                    autoComplete="off"
                    value={hpTrap}
                    onChange={(e) => setHpTrap(e.target.value)}
                    className="hidden opacity-0 pointer-events-none absolute -z-50"
                    aria-hidden="true"
                  />
                </div>
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-primary w-full sm:w-auto h-9 px-4 rounded-xl text-xs font-extrabold whitespace-nowrap flex-shrink-0 cursor-pointer disabled:opacity-50"
                >
                  {submitting ? '...' : t('subscribe')}
                </button>
              </form>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Col 1: Brand & Security */}
          <div className="col-span-2 md:col-span-1 space-y-3">
            <Logo size={28} showText />
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              Modern booking &amp; scheduling infrastructure for studios, suites, and independent pros worldwide.
            </p>
            <p className="text-[11px] text-[var(--text-secondary)] font-medium flex items-center gap-1">
              <span>{t('builtWithHeartPart1')}</span>
              <Heart24Filled className="w-3.5 h-3.5 text-[#E11D48] fill-[#E11D48] inline-block" />
              <span>{t('builtWithHeartPart2')}</span>
            </p>
          </div>

          {/* Col 2: Products */}
          <div className="space-y-2.5">
            <p className="text-[11px] font-black uppercase tracking-wider text-[var(--text-primary)]">
              {t('navProductsHeader')}
            </p>
            <ul className="space-y-2">
              <li><Link href="/product/scheduling" className="hover:text-[var(--text-primary)] transition-colors">{t('navOnlineBookingTitle')}</Link></li>
              <li><Link href="/product/team-schedules" className="hover:text-[var(--text-primary)] transition-colors">{t('navTeamSchedulesTitle')}</Link></li>
              <li><Link href="/product/client-notes" className="hover:text-[var(--text-primary)] transition-colors">{t('navClientNotesTitle')}</Link></li>
              <li><Link href="/product/payments" className="hover:text-[var(--text-primary)] transition-colors">{t('navTapToPayTitle')}</Link></li>
            </ul>
          </div>

          {/* Col 3: Platform & Tools */}
          <div className="space-y-2.5">
            <p className="text-[11px] font-black uppercase tracking-wider text-[var(--text-primary)]">
              {t('navPlatformHeader')}
            </p>
            <ul className="space-y-2">
              <li><Link href="/platform/integrations" className="hover:text-[var(--text-primary)] transition-colors">{t('navIntegrations')}</Link></li>
              <li><Link href="/platform/reminders" className="hover:text-[var(--text-primary)] transition-colors">{t('navSmsReminders')}</Link></li>
              <li><Link href="/platform/deposit-protection" className="hover:text-[var(--text-primary)] transition-colors">{t('navDepositSecurity')}</Link></li>
              <li><Link href="/blog" className="hover:text-[var(--text-primary)] transition-colors">{t('blog')}</Link></li>
              <li><Link href="/help" className="hover:text-[var(--text-primary)] transition-colors">{t('navHelpCenterTitle')}</Link></li>
              <li>
                <Link href="/changelog" className="hover:text-[var(--text-primary)] inline-flex items-center gap-1.5 transition-colors">
                  <span>{t('navChangelog')}</span>
                  <span className="px-1.5 py-0.2 rounded-full bg-[#2BB5FF]/15 text-[#0284C7] text-[9px] font-black">v2.0</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Solutions by Specialty */}
          <div className="space-y-2.5">
            <p className="text-[11px] font-black uppercase tracking-wider text-[var(--text-primary)]">
              {t('solutionsNav')}
            </p>
            <ul className="space-y-2">
              <li><Link href="/for/salons" className="hover:text-[var(--text-primary)] transition-colors">{t('tabHair')}</Link></li>
              <li><Link href="/for/barbers" className="hover:text-[var(--text-primary)] transition-colors">{t('tabBarber')}</Link></li>
              <li><Link href="/for/spas" className="hover:text-[var(--text-primary)] transition-colors">{t('tabMedspa')}</Link></li>
              <li><Link href="/for/nails" className="hover:text-[var(--text-primary)] transition-colors">{t('tabNails')}</Link></li>
              <li><Link href="/for/tattoo" className="hover:text-[var(--text-primary)] transition-colors">{t('tabTattoo')}</Link></li>
              <li><Link href="/for/pet-groomers" className="hover:text-[var(--text-primary)] transition-colors">{t('tabPetGrooming')}</Link></li>
            </ul>
          </div>

          {/* Col 5: Platform & App */}
          <div className="space-y-2.5">
            <p className="text-[11px] font-black uppercase tracking-wider text-[var(--text-primary)]">
              {t('footerProduct')}
            </p>
            <ul className="space-y-2">
              <li><Link href="/login" className="hover:text-[var(--text-primary)] transition-colors">{t('signIn')}</Link></li>
              <li><Link href="/dashboard" className="hover:text-[var(--text-primary)] transition-colors">{t('openDashboard')}</Link></li>
              <li><Link href={session?.user ? '/book/eduardos-lounge' : `/onboarding?redirect=${encodeURIComponent('/book/eduardos-lounge')}&reason=demo_storefront`} className="hover:text-[var(--text-primary)] transition-colors">{t('seeLiveDemo')}</Link></li>
              <li><Link href="/#pricing" className="hover:text-[var(--text-primary)] transition-colors">{t('pricingNav')}</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-[var(--border-subtle)] pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px]">
          <div className="flex flex-wrap items-center gap-3">
            <p>© 2026 AirBook. {t('allRightsReserved')}</p>
            <span className="text-[var(--border-subtle)]">·</span>
            <Link href="/privacy" className="hover:text-[var(--text-primary)] transition-colors underline">Privacy</Link>
            <Link href="/terms" className="hover:text-[var(--text-primary)] transition-colors underline">Terms</Link>
            <Link href="/data-protection" className="hover:text-[var(--text-primary)] transition-colors underline">Data Protection</Link>
          </div>

          {/* Reusable Circular Vector Flag Language Selector Component */}
          <LanguageSelector direction="up" format="label" size="sm" />
        </div>
      </div>
    </footer>
  );
};

export default MarketingFooter;
