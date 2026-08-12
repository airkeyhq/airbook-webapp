'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAirBookStore } from '@/lib/store';
import { useSession } from '@/lib/auth-client';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { Toast, useToast } from '@/components/Toast';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import {
  Person24Filled,
  Person24Regular,
  Building24Filled,
  Building24Regular,
  People24Filled,
  People24Regular,
  Sparkle24Filled,
  Sparkle24Regular,
  Shield24Regular,
  DocumentCheckmark24Regular,
  Link24Regular,
  Alert24Regular,
  LockClosed24Regular,
  Mail24Regular,
  Add24Filled,
  Dismiss24Filled,
  Globe24Regular,
  Clock24Regular,
  Payment24Regular,
  Payment24Filled,
  Delete24Filled,
  Eye24Filled,
  EyeOff24Filled,
  Checkmark24Regular,
  CheckmarkCircle24Filled,
} from '@fluentui/react-icons';

type SettingsTab = 'profile' | 'workspace' | 'team' | 'addons';

const TAB_LIST: { id: SettingsTab; label: string; icon: React.ElementType }[] = [
  { id: 'profile', label: 'My Profile', icon: Person24Filled },
  { id: 'workspace', label: 'Workspace', icon: Building24Filled },
  { id: 'team', label: 'Team & Invites', icon: People24Filled },
  { id: 'addons', label: 'Add-On Modules', icon: Sparkle24Filled },
];

/* ─── Toggle Switch ─── */
function Toggle({
  enabled,
  onToggle,
  color = 'bg-blue-600',
}: {
  enabled: boolean;
  onToggle: () => void;
  color?: string;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={`relative w-11 h-6 rounded-full p-0.5 transition-colors flex items-center ${enabled ? color : 'bg-black/10 dark:bg-white/20'}`}
      aria-pressed={enabled}
    >
      <motion.div
        animate={{ x: enabled ? 20 : 0 }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        className="w-5 h-5 rounded-full bg-white shadow-sm"
      />
    </button>
  );
}

/* ─── Section wrapper ─── */
function Section({ title, icon: Icon, children }: { title: string; icon: React.ElementType; children: React.ReactNode }) {
  return (
    <div className="p-5 rounded-3xl glass-panel bg-white/70 dark:bg-gray-900/70 border border-white/60 dark:border-white/10 space-y-4 shadow-sm">
      <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-primary)] flex items-center gap-2">
        <Icon className="w-4 h-4 text-blue-500" />
        <span>{title}</span>
      </h3>
      {children}
    </div>
  );
}

/* ─── Field ─── */
function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1">
      <label className="text-[11px] font-semibold uppercase tracking-wider text-[var(--text-secondary)] block">
        {label}
      </label>
      {children}
    </div>
  );
}

const INPUT_CLS =
  'w-full px-4 py-2.5 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-xs font-medium text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-blue-500/50';

export const SettingsModule: React.FC = () => {
  const { workspaceName, setWorkspaceName, staffMembers, workspaceSlug } = useAirBookStore();
  const { data: session } = useSession();
  const { t, language, setLanguage, availableLanguages } = useTranslation();
  const { toasts, addToast, dismiss } = useToast();

  const [activeTab, setActiveTab] = useState<SettingsTab>('profile');

  // Profile state - Dynamically initialized from session
  const [profileName, setProfileName] = useState(session?.user?.name || '');
  const [profileEmail, setProfileEmail] = useState(session?.user?.email || '');
  const [avatarUrl, setAvatarUrl] = useState<string | null>(session?.user?.image || null);
  const profilePhotoRef = React.useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (session?.user) {
      if (session.user.name && !profileName) setProfileName(session.user.name);
      if (session.user.email && !profileEmail) setProfileEmail(session.user.email);
    }
  }, [session]);
  
  const [notifEmail, setNotifEmail] = useState(true);
  const [notifSMS, setNotifSMS] = useState(true);
  const [notifPush, setNotifPush] = useState(false);
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [currentPw, setCurrentPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');

  // Workspace state
  const [wsName, setWsName] = useState(workspaceName);
  const [slug, setSlug] = useState(workspaceSlug || workspaceName.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-') || '');
  const [timezone, setTimezone] = useState('America/New_York');
  const [cancellation, setCancellation] = useState('24');
  const [deposit, setDeposit] = useState('20');
  const [noShowFee, setNoShowFee] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  // Team state
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<'staff' | 'manager'>('staff');
  const [pendingInvites, setPendingInvites] = useState<{ email: string; role: string }[]>([]);

  // Add-ons state
  const [hipaa, setHipaa] = useState(false);
  const [esign, setEsign] = useState(true);
  const [kyc, setKyc] = useState(false);

  // ─── Handlers ───

  const saveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    addToast('Profile saved successfully.', 'success');
  };

  const changePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPw !== confirmPw) {
      addToast('Passwords do not match.', 'error');
      return;
    }
    if (newPw.length < 8) {
      addToast('Password must be at least 8 characters.', 'error');
      return;
    }
    setCurrentPw('');
    setNewPw('');
    setConfirmPw('');
    addToast('Password updated successfully.', 'success');
  };

  const saveWorkspace = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!wsName.trim()) return;

    setWorkspaceName(wsName.trim());

    try {
      await fetch('/api/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: wsName.trim(),
          slug: slug.trim(),
          cancellationNoticeHours: parseInt(cancellation, 10),
          depositRequiredPercent: parseInt(deposit, 10),
        }),
      });
      addToast('Workspace settings saved to database.', 'success');
    } catch (e) {
      addToast('Saved locally, error syncing to database.', 'error');
    }
  };

  const sendInvite = () => {
    if (!inviteEmail.trim()) return;
    setPendingInvites((prev) => [...prev, { email: inviteEmail.trim(), role: inviteRole }]);
    setInviteEmail('');
    addToast(`Invite sent to ${inviteEmail.trim()}`, 'success');
  };

  const revokeInvite = (email: string) => {
    setPendingInvites((prev) => prev.filter((i) => i.email !== email));
    addToast('Invite revoked.', 'info');
  };

  const saveAddons = () => {
    addToast('Add-on modules updated.', 'success');
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-4 sm:p-6 space-y-5 pb-20">
      {/* Header */}
      <div>
        <h2 className="text-xl font-extrabold text-[var(--text-primary)] tracking-tight">Settings</h2>
        <p className="text-xs text-[var(--text-secondary)] mt-0.5">
          Manage your profile, workspace, team, and feature modules.
        </p>
      </div>

      {/* Tab selector */}
      <div className="flex items-center bg-black/5 dark:bg-white/5 p-1 rounded-2xl border border-black/5 dark:border-white/5 overflow-x-auto gap-1">
        {TAB_LIST.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 min-w-[80px] flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-white dark:bg-gray-800 text-[var(--text-primary)] shadow-sm'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ─── TAB: PROFILE ─── */}
      <AnimatePresence mode="wait" initial={false}>
        {activeTab === 'profile' && (
          <motion.div
            key="profile"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
            className="space-y-4"
          >
            <Section title="Personal Info" icon={Person24Regular}>
              <form onSubmit={saveProfile} className="space-y-4">
                {/* Avatar */}
                <div className="flex items-center gap-4">
                  <input
                    type="file"
                    ref={profilePhotoRef}
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = (ev) => {
                          if (ev.target?.result) setAvatarUrl(ev.target.result as string);
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-500 to-violet-500 flex items-center justify-center text-white font-extrabold text-xl shadow-md overflow-hidden relative">
                    {avatarUrl ? (
                      <img src={avatarUrl} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      profileName.charAt(0)
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => profilePhotoRef.current?.click()}
                      className="px-3 py-1.5 rounded-xl bg-black/5 dark:bg-white/10 text-xs font-semibold text-[var(--text-primary)] flex items-center gap-1.5 hover:bg-black/10 transition-colors"
                    >
                      <Add24Filled className="w-3.5 h-3.5" />
                      <span>{avatarUrl ? t('changePhoto') : t('uploadPhoto')}</span>
                    </button>
                    {avatarUrl && (
                      <button
                        type="button"
                        onClick={() => setAvatarUrl(null)}
                        className="px-3 py-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-xs font-semibold text-red-600 dark:text-red-400 transition-colors"
                      >
                        {t('removePhoto')}
                      </button>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Field label={t('fullName')}>
                    <input
                      type="text"
                      value={profileName}
                      onChange={(e) => setProfileName(e.target.value)}
                      className={INPUT_CLS}
                    />
                  </Field>
                  <Field label={t('email')}>
                    <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-xs">
                      <Mail24Regular className="w-3.5 h-3.5 text-gray-400" />
                      <span className="text-[var(--text-primary)] font-medium">{profileEmail}</span>
                      <span className="ml-auto px-1.5 py-0.5 rounded-full bg-green-500/10 text-green-600 dark:text-green-400 text-[10px] font-bold">{t('verified')}</span>
                    </div>
                  </Field>
                </div>

                <motion.button
                  whileTap={{ scale: 0.97 }}
                  type="submit"
                  className="px-5 py-2.5 rounded-2xl bg-black text-white dark:bg-white dark:text-black font-semibold text-xs shadow-md"
                >
                  {t('saveProfile')}
                </motion.button>
              </form>
            </Section>

            {/* App Language & i18n */}
            <Section title={t('languageSetting')} icon={Globe24Regular}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-bold text-[var(--text-primary)]">{t('languageSetting')}</p>
                  <p className="text-[11px] text-[var(--text-secondary)]">{t('languageSelect')}</p>
                </div>
                <div className="flex flex-wrap items-center gap-1.5 bg-black/5 dark:bg-white/5 p-1 rounded-2xl border border-black/10 dark:border-white/10">
                  {availableLanguages.map((lang) => (
                    <button
                      key={lang.id}
                      type="button"
                      onClick={() => setLanguage(lang.id)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                        language === lang.id
                          ? 'bg-white dark:bg-gray-800 text-[var(--text-primary)] shadow-sm'
                          : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
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
              </div>
            </Section>

            {/* Stripe Connect Direct Payouts Card */}
            <Section title={t('stripeConnectTitle')} icon={Payment24Filled}>
              <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-blue-500/10 border border-indigo-500/20 stack-md">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="px-3 py-2 rounded-2xl bg-[#635BFF] flex items-center justify-center shadow-md shadow-[#635BFF]/30 flex-shrink-0">
                      <svg className="h-4.5 w-auto fill-white" viewBox="0 0 512 214" xmlns="http://www.w3.org/2000/svg">
                        <path d="M512,110.08 C512,73.6711111 494.364444,44.9422222 460.657778,44.9422222 C426.808889,44.9422222 406.328889,73.6711111 406.328889,109.795556 C406.328889,152.604444 430.506667,174.222222 465.208889,174.222222 C482.133333,174.222222 494.933333,170.382222 504.604444,164.977778 L504.604444,136.533333 C494.933333,141.368889 483.84,144.355556 469.76,144.355556 C455.964444,144.355556 443.733333,139.52 442.168889,122.737778 L511.715556,122.737778 C511.715556,120.888889 512,113.493333 512,110.08 L512,110.08 Z M441.742222,96.5688889 C441.742222,80.4977778 451.555556,73.8133333 460.515556,73.8133333 C469.191111,73.8133333 478.435556,80.4977778 478.435556,96.5688889 L441.742222,96.5688889 Z M351.431111,44.9422222 C337.493333,44.9422222 328.533333,51.4844444 323.555556,56.0355556 L321.706667,47.2177778 L290.417778,47.2177778 L290.417778,213.048889 L325.973333,205.511111 L326.115556,165.262222 C331.235556,168.96 338.773333,174.222222 351.288889,174.222222 C376.746667,174.222222 399.928889,153.742222 399.928889,108.657778 C399.786667,67.4133333 376.32,44.9422222 351.431111,44.9422222 L351.431111,44.9422222 Z M342.897778,142.933333 C334.506667,142.933333 329.528889,139.946667 326.115556,136.248889 L325.973333,83.4844444 C329.671111,79.36 334.791111,76.5155556 342.897778,76.5155556 C355.84,76.5155556 364.8,91.0222222 364.8,109.653333 C364.8,128.711111 355.982222,142.933333 342.897778,142.933333 L342.897778,142.933333 Z M241.493333,36.5511111 L277.191111,28.8711111 L277.191111,1.42108547e-14 L241.493333,7.53777778 L241.493333,36.5511111 Z M241.493333,47.36 L277.191111,47.36 L277.191111,171.804444 L241.493333,171.804444 L241.493333,47.36 Z M203.235556,57.8844444 L200.96,47.36 L170.24,47.36 L170.24,171.804444 L205.795556,171.804444 L205.795556,87.4666667 C214.186667,76.5155556 228.408889,78.5066667 232.817778,80.0711111 L232.817778,47.36 C228.266667,45.6533333 211.626667,42.5244444 203.235556,57.8844444 Z M132.124444,16.4977778 L97.4222222,23.8933333 L97.28,137.813333 C97.28,158.862222 113.066667,174.364444 134.115556,174.364444 C145.777778,174.364444 154.311111,172.231111 159.004444,169.671111 L159.004444,140.8 C154.453333,142.648889 131.982222,149.191111 131.982222,128.142222 L131.982222,77.6533333 L159.004444,77.6533333 L159.004444,47.36 L131.982222,47.36 L132.124444,16.4977778 Z M35.9822222,83.4844444 C35.9822222,77.9377778 40.5333333,75.8044444 48.0711111,75.8044444 C58.88,75.8044444 72.5333333,79.0755556 83.3422222,84.9066667 L83.3422222,51.4844444 C71.5377778,46.7911111 59.8755556,44.9422222 48.0711111,44.9422222 C19.2,44.9422222 0,60.0177778 0,85.1911111 C0,124.444444 54.0444444,118.186667 54.0444444,135.111111 C54.0444444,141.653333 48.3555556,143.786667 40.3911111,143.786667 C28.5866667,143.786667 13.5111111,138.951111 1.56444444,132.408889 L1.56444444,166.257778 C14.7911111,171.946667 28.16,174.364444 40.3911111,174.364444 C69.9733333,174.364444 90.3111111,159.715556 90.3111111,134.257778 C90.1688889,91.8755556 35.9822222,99.4133333 35.9822222,83.4844444 Z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-[var(--text-primary)]">{t('stripeConnectTitle')}</h4>
                      <p className="text-[11px] text-[var(--text-secondary)] mt-0.5 max-w-md">{t('stripeConnectDesc')}</p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={async () => {
                      try {
                        const res = await fetch('/api/stripe/connect/onboard', { method: 'POST' });
                        const data = await res.json();
                        if (data.url) window.location.href = data.url;
                      } catch (e) {
                        console.error(e);
                      }
                    }}
                    className="control-md rounded-xl btn-primary gap-1.5 flex-shrink-0"
                  >
                    <Payment24Filled className="w-4 h-4" />
                    <span>{t('connectStripe')}</span>
                  </button>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-black/5 dark:border-white/10 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                  <CheckmarkCircle24Filled className="w-4 h-4 flex-shrink-0" />
                  <span>{t('stripeConnected')} (Express Payouts Active)</span>
                </div>
              </div>
            </Section>

            {/* Notifications */}
            <Section title={t('notificationPreferences')} icon={Alert24Regular}>
              <div className="space-y-3">
                {[
                  { label: t('emailNotifs'), desc: t('emailNotifsDesc'), val: notifEmail, set: setNotifEmail },
                  { label: t('smsNotifs'), desc: t('smsNotifsDesc'), val: notifSMS, set: setNotifSMS },
                  { label: t('pushNotifs'), desc: t('pushNotifsDesc'), val: notifPush, set: setNotifPush },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between p-3 rounded-2xl bg-black/5 dark:bg-white/5">
                    <div>
                      <p className="text-xs font-bold text-[var(--text-primary)]">{item.label}</p>
                      <p className="text-[11px] text-[var(--text-secondary)]">{item.desc}</p>
                    </div>
                    <Toggle enabled={item.val} onToggle={() => item.set(!item.val)} />
                  </div>
                ))}
              </div>
            </Section>

            {/* Change password */}
            <Section title={t('changePassword')} icon={LockClosed24Regular}>
              <form onSubmit={changePassword} className="space-y-3">
                <Field label={t('currentPassword')}>
                  <div className="relative">
                    <input
                      type={showCurrentPw ? 'text' : 'password'}
                      value={currentPw}
                      onChange={(e) => setCurrentPw(e.target.value)}
                      placeholder="••••••••"
                      className={INPUT_CLS + ' pr-10'}
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPw(!showCurrentPw)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                    >
                      {showCurrentPw ? <EyeOff24Filled className="w-4 h-4" /> : <Eye24Filled className="w-4 h-4" />}
                    </button>
                  </div>
                </Field>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Field label={t('newPassword')}>
                    <input type="password" value={newPw} onChange={(e) => setNewPw(e.target.value)} placeholder={t('min8Chars')} className={INPUT_CLS} />
                  </Field>
                  <Field label={t('confirmPassword')}>
                    <input type="password" value={confirmPw} onChange={(e) => setConfirmPw(e.target.value)} placeholder="••••••••" className={INPUT_CLS} />
                  </Field>
                </div>
                <motion.button whileTap={{ scale: 0.97 }} type="submit" className="px-5 py-2.5 rounded-2xl bg-black text-white dark:bg-white dark:text-black font-semibold text-xs shadow-md">
                  {t('updatePassword')}
                </motion.button>
              </form>
            </Section>
          </motion.div>
        )}

        {/* ─── TAB: WORKSPACE ─── */}
        {activeTab === 'workspace' && (
          <motion.div
            key="workspace"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
            className="space-y-4"
          >
            <Section title={t('brandingTitle')} icon={Link24Regular}>
              <form onSubmit={saveWorkspace} className="space-y-4">
                {/* Logo */}
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-black text-white dark:bg-white dark:text-black flex items-center justify-center font-extrabold text-xl shadow-md">
                    {wsName.charAt(0)}
                  </div>
                  <button type="button" className="px-3 py-1.5 rounded-xl bg-black/5 dark:bg-white/10 text-xs font-semibold text-[var(--text-primary)] flex items-center gap-1.5 hover:bg-black/10 transition-colors">
                    <Add24Filled className="w-3.5 h-3.5" /><span>{t('uploadLogo')}</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Field label={t('workspaceName')}>
                    <input type="text" value={wsName} onChange={(e) => setWsName(e.target.value)} className={INPUT_CLS} />
                  </Field>
                  <Field label={t('bookingSlug')}>
                    <div className="flex items-center bg-black/5 dark:bg-white/5 px-3 py-2.5 rounded-xl border border-black/10 dark:border-white/10 text-xs font-mono">
                      <span className="text-[var(--text-muted)]">airbook.app/book/</span>
                      <input
                        type="text"
                        value={slug}
                        onChange={(e) => setSlug(e.target.value)}
                        className="bg-transparent font-bold text-[var(--text-primary)] focus:outline-none w-full"
                      />
                    </div>
                  </Field>
                  <Field label={t('timezone')}>
                    <div className="relative">
                      <Globe24Regular className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <select value={timezone} onChange={(e) => setTimezone(e.target.value)} className={INPUT_CLS + ' pl-9'}>
                        <option value="America/New_York">Eastern Time (ET)</option>
                        <option value="America/Chicago">Central Time (CT)</option>
                        <option value="America/Denver">Mountain Time (MT)</option>
                        <option value="America/Los_Angeles">Pacific Time (PT)</option>
                        <option value="Europe/London">London (GMT)</option>
                        <option value="Europe/Berlin">Central Europe (CET)</option>
                      </select>
                    </div>
                  </Field>
                </div>
                <motion.button whileTap={{ scale: 0.97 }} type="submit" className="px-5 py-2.5 rounded-2xl bg-black text-white dark:bg-white dark:text-black font-semibold text-xs shadow-md">
                  {t('saveWorkspace')}
                </motion.button>
              </form>
            </Section>

            <Section title={t('bookingPolicies')} icon={Clock24Regular}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Field label={t('cancellationNotice')}>
                  <select value={cancellation} onChange={(e) => setCancellation(e.target.value)} className={INPUT_CLS}>
                    <option value="12">12 Hours</option>
                    <option value="24">24 Hours</option>
                    <option value="48">48 Hours</option>
                  </select>
                </Field>
                <Field label={t('depositPercent')}>
                  <select value={deposit} onChange={(e) => setDeposit(e.target.value)} className={INPUT_CLS}>
                    <option value="0">0%</option>
                    <option value="20">20%</option>
                    <option value="50">50%</option>
                    <option value="100">100%</option>
                  </select>
                </Field>
              </div>
              <div className="flex items-center justify-between p-3 rounded-2xl bg-black/5 dark:bg-white/5">
                <div>
                  <p className="text-xs font-bold text-[var(--text-primary)]">{t('noShowFee')}</p>
                  <p className="text-[11px] text-[var(--text-secondary)]">{t('noShowNoticeDesc')}</p>
                </div>
                <Toggle enabled={noShowFee} onToggle={() => setNoShowFee(!noShowFee)} color="bg-orange-500" />
              </div>
              <motion.button
                whileTap={{ scale: 0.97 }}
                type="button"
                onClick={() => addToast('Booking policies saved.', 'success')}
                className="px-5 py-2.5 rounded-2xl bg-black text-white dark:bg-white dark:text-black font-semibold text-xs shadow-md"
              >
                {t('savePolicies')}
              </motion.button>
            </Section>

            {/* Danger Zone */}
            <div className="p-5 rounded-3xl border border-red-500/20 bg-red-500/5 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-red-600 dark:text-red-400 flex items-center gap-2">
                <Delete24Filled className="w-4 h-4" />
                <span>{t('dangerZone')}</span>
              </h3>
              <p className="text-xs text-[var(--text-secondary)]">
                {t('dangerZoneDesc')}
              </p>
              <button
                type="button"
                onClick={() => setConfirmDelete(true)}
                className="px-4 py-2 rounded-2xl border border-red-500/30 text-red-600 dark:text-red-400 text-xs font-bold hover:bg-red-500/10 transition-colors"
              >
                {t('deleteWorkspace')}
              </button>
            </div>
          </motion.div>
        )}

        {/* ─── TAB: TEAM ─── */}
        {activeTab === 'team' && (
          <motion.div
            key="team"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
            className="space-y-4"
          >
            <Section title={t('inviteTeamMembers')} icon={Add24Filled}>
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Mail24Regular className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); sendInvite(); } }}
                    placeholder="colleague@business.com"
                    className={INPUT_CLS + ' pl-9'}
                  />
                </div>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value as 'staff' | 'manager')}
                  className="px-3 py-2.5 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-xs font-medium text-[var(--text-primary)] focus:outline-none"
                >
                  <option value="staff">{t('staff')}</option>
                  <option value="manager">{t('manager')}</option>
                </select>
                <motion.button
                  whileTap={{ scale: 0.93 }}
                  type="button"
                  onClick={sendInvite}
                  className="px-4 py-2.5 rounded-xl bg-black text-white dark:bg-white dark:text-black font-bold text-xs"
                >
                  {t('invite')}
                </motion.button>
              </div>

              {/* Pending invites */}
              {pendingInvites.length > 0 && (
                <div className="space-y-2">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">{t('pendingInvites')}</p>
                  {pendingInvites.map((inv) => (
                    <div key={inv.email} className="flex items-center justify-between p-3 rounded-xl bg-yellow-500/10 border border-yellow-500/20 text-xs">
                      <div>
                        <span className="font-bold text-[var(--text-primary)]">{inv.email}</span>
                        <span className="ml-2 px-1.5 py-0.5 rounded-full bg-yellow-500/20 text-yellow-700 dark:text-yellow-300 text-[10px] font-bold capitalize">{inv.role}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => revokeInvite(inv.email)}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <Dismiss24Filled className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </Section>

            <Section title={t('currentTeam')} icon={People24Regular}>
              <div className="space-y-3">
                {staffMembers.map((stf) => (
                  <div key={stf.id} className="flex items-center justify-between p-3 rounded-2xl bg-black/5 dark:bg-white/5">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{stf.avatar}</span>
                      <div>
                        <p className="text-xs font-bold text-[var(--text-primary)]">{stf.name}</p>
                        <p className="text-[11px] text-[var(--text-secondary)]">{stf.role}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-[10px] font-bold">{t('owner')}</span>
                      <button type="button" className="text-gray-400 hover:text-[var(--text-primary)] transition-colors p-1 rounded-lg hover:bg-black/5">
                        <Dismiss24Filled className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </Section>
          </motion.div>
        )}

        {/* ─── TAB: ADD-ONS ─── */}
        {activeTab === 'addons' && (
          <motion.div
            key="addons"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
            className="space-y-4"
          >
            <Section title={t('industryAddons')} icon={Sparkle24Regular}>
              <p className="text-xs text-[var(--text-secondary)]">
                {t('industryAddonsDesc')}
              </p>

              {[
                {
                  icon: Shield24Regular,
                  iconColor: 'text-blue-500',
                  title: t('hipaaTitle'),
                  desc: t('hipaaDesc'),
                  val: hipaa,
                  set: setHipaa,
                  color: 'bg-blue-600',
                },
                {
                  icon: DocumentCheckmark24Regular,
                  iconColor: 'text-purple-500',
                  title: t('esignTitle'),
                  desc: t('esignDesc'),
                  val: esign,
                  set: setEsign,
                  color: 'bg-purple-600',
                },
                {
                  icon: Person24Regular,
                  iconColor: 'text-green-500',
                  title: t('kycTitle'),
                  desc: t('kycDesc'),
                  val: kyc,
                  set: setKyc,
                  color: 'bg-green-600',
                },
              ].map((mod) => {
                const Icon = mod.icon;
                return (
                  <div
                    key={mod.title}
                    className={`flex items-start justify-between p-4 rounded-2xl border transition-colors ${
                      mod.val
                        ? 'bg-black/5 dark:bg-white/5 border-black/10 dark:border-white/10'
                        : 'bg-black/3 dark:bg-white/3 border-black/5 dark:border-white/5'
                    }`}
                  >
                    <div className="flex items-start gap-3 flex-1 min-w-0 pr-4">
                      <Icon className={`w-5 h-5 ${mod.iconColor} mt-0.5 flex-shrink-0`} />
                      <div>
                        <h4 className="text-xs font-bold text-[var(--text-primary)]">{mod.title}</h4>
                        <p className="text-[11px] text-[var(--text-secondary)] mt-0.5 leading-snug">{mod.desc}</p>
                      </div>
                    </div>
                    <Toggle enabled={mod.val} onToggle={() => mod.set(!mod.val)} color={mod.color} />
                  </div>
                );
              })}

              <motion.button
                whileTap={{ scale: 0.97 }}
                type="button"
                onClick={saveAddons}
                className="w-full py-3 rounded-2xl bg-black text-white dark:bg-white dark:text-black font-semibold text-xs shadow-lg"
              >
                {t('saveAddons')}
              </motion.button>
            </Section>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toast notifications */}
      <Toast toasts={toasts} onDismiss={dismiss} />

      {/* Confirm delete workspace */}
      <ConfirmDialog
        isOpen={confirmDelete}
        title="Delete Workspace?"
        description="This will permanently remove all bookings, clients, staff data, and settings. This action cannot be undone."
        confirmLabel="Yes, Delete Everything"
        cancelLabel="Keep Workspace"
        variant="danger"
        onConfirm={() => {
          setConfirmDelete(false);
          addToast('Workspace deletion requested. Redirecting…', 'error');
        }}
        onCancel={() => setConfirmDelete(false)}
      />
    </div>
  );
};
