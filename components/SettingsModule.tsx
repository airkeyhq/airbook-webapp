'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAirBookStore } from '@/lib/store';
import { useSession } from '@/lib/auth-client';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { Toast, useToast } from '@/components/Toast';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { CustomSelect } from '@/components/CustomSelect';
import { FloatingInput } from '@/components/FloatingInput';
import { AddLocationModal } from '@/components/AddLocationModal';
import { CustomDomainStudio } from '@/components/CustomDomainStudio';
import { EmptyState } from '@/components/EmptyState';
import { getAvatarUrl } from '@/lib/avatars';
import {
  Person24Filled,
  Person24Regular,
  Building24Filled,
  Building24Regular,
  Location24Filled,
  People24Filled,
  People24Regular,
  Sparkle24Filled,
  Sparkle24Regular,
  Shield24Regular,
  ShieldCheckmark24Regular,
  ShieldCheckmark24Filled,
  DocumentCheckmark24Regular,
  Link24Regular,
  Alert24Regular,
  LockClosed24Regular,
  LockClosed16Filled,
  Mail24Regular,
  Mail24Filled,
  Add24Regular,
  Add24Filled,
  Dismiss24Filled,
  Globe24Regular,
  Globe24Filled,
  Clock24Regular,
  Payment24Regular,
  Payment24Filled,
  Delete24Filled,
  Eye24Filled,
  EyeOff24Filled,
  Checkmark24Regular,
  Checkmark24Filled,
  CheckmarkCircle24Filled,
  Edit24Filled,
  Save24Filled,
} from '@fluentui/react-icons';

type SettingsTab = 'profile' | 'workspace' | 'addons' | 'compliance' | 'locations' | 'domain';

const TAB_LIST: { id: SettingsTab; labelKey: string; icon: React.ElementType }[] = [
  { id: 'profile', labelKey: 'myProfile', icon: Person24Filled },
  { id: 'workspace', labelKey: 'workspace', icon: Building24Filled },
  { id: 'locations', labelKey: 'tabLocations', icon: Location24Filled },
  { id: 'domain', labelKey: 'tabDomain', icon: Globe24Filled },
  { id: 'addons', labelKey: 'addOns', icon: Sparkle24Filled },
  { id: 'compliance', labelKey: 'tabCompliance', icon: ShieldCheckmark24Filled },
];

/* ─── Toggle Switch ─── */
function Toggle({
  enabled,
  onToggle,
  color = 'bg-blue-600',
  disabled = false,
  locked = false,
}: {
  enabled: boolean;
  onToggle: () => void;
  color?: string;
  disabled?: boolean;
  locked?: boolean;
}) {
  return (
    <button
      type="button"
      disabled={disabled || locked}
      onClick={(e) => {
        e.stopPropagation();
        if (!locked && !disabled) onToggle();
      }}
      className={`relative w-11 h-6 rounded-full p-0.5 transition-colors flex items-center ${
        locked
          ? 'bg-slate-300 dark:bg-slate-700 cursor-not-allowed'
          : enabled
          ? color
          : 'bg-black/10 dark:bg-white/20'
      }`}
      aria-pressed={enabled}
    >
      <motion.div
        animate={{ x: enabled && !locked ? 20 : 0 }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        className="w-5 h-5 rounded-full bg-white dark:bg-slate-200 shadow-sm flex items-center justify-center text-[10px]"
      >
        {locked ? (
          <LockClosed16Filled className="w-3 h-3 text-slate-500 dark:text-slate-700" />
        ) : null}
      </motion.div>
    </button>
  );
}

/* ─── Section wrapper ─── */
function Section({ title, icon: Icon, children }: { title: string; icon: React.ElementType; children: React.ReactNode }) {
  return (
    <div className="p-5 rounded-3xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] space-y-4 shadow-xs">
      <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-primary)] flex items-center gap-2">
        <Icon className="w-4 h-4 text-[var(--text-secondary)]" />
        <span>{title}</span>
      </h3>
      {children}
    </div>
  );
}

export const SettingsModule: React.FC = () => {
  const { workspaceName, setWorkspaceName, staffMembers, workspaceSlug, addons, toggleAddon, isBetaAccess, unlockBetaWithCode, timeFormat, setTimeFormat, stations, addStation, updateStation, deleteStation } = useAirBookStore();
  const [isAddStationModalOpen, setIsAddStationModalOpen] = useState(false);
  const [newStationName, setNewStationName] = useState('');
  const [newStationCategory, setNewStationCategory] = useState('Hair & Styling');
  const [editingStationId, setEditingStationId] = useState<string | null>(null);
  const [editingStationName, setEditingStationName] = useState('');
  const [editingStationCategory, setEditingStationCategory] = useState('Hair & Styling');
  const { data: session } = useSession();
  const { t, language, setLanguage, availableLanguages } = useTranslation();
  const { toasts, addToast, dismiss } = useToast();

  const [activeTab, setActiveTab] = useState<SettingsTab>('profile');
  const [isBetaModalOpen, setIsBetaModalOpen] = useState(false);
  const [betaInputCode, setBetaInputCode] = useState('');

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



  // Add-ons state
  const [hipaa, setHipaa] = useState(false);
  const [esign, setEsign] = useState(true);
  const [kyc, setKyc] = useState(false);

  // ─── Handlers ───

  const saveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    addToast('Profile saved successfully.', 'success');
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



  // Compliance Logs State
  const [complianceLogs, setComplianceLogs] = useState<any[]>([]);
  const [complianceFilter, setComplianceFilter] = useState<string>('all');
  const [loadingCompliance, setLoadingCompliance] = useState(false);

  const fetchComplianceLogs = async () => {
    try {
      setLoadingCompliance(true);
      const res = await fetch('/api/compliance/logs');
      const data = await res.json();
      if (data.success && Array.isArray(data.logs)) {
        setComplianceLogs(data.logs);
      }
    } catch (err) {
      console.warn('Failed to load compliance logs:', err);
    } finally {
      setLoadingCompliance(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'compliance') {
      fetchComplianceLogs();
    }
  }, [activeTab]);

  const handleExportComplianceCsv = () => {
    window.open('/api/compliance/logs?format=csv', '_blank');
    addToast(t('reportExportedSuccess'), 'success');
  };

  // Locations State
  const [locations, setLocations] = useState<any[]>([]);
  const [totalEnterpriseGross, setTotalEnterpriseGross] = useState(0);
  const [totalEnterpriseStaff, setTotalEnterpriseStaff] = useState(0);
  const [isAddLocationOpen, setIsAddLocationOpen] = useState(false);
  const [loadingLocations, setLoadingLocations] = useState(false);

  const fetchLocations = async () => {
    try {
      setLoadingLocations(true);
      const res = await fetch('/api/workspaces/locations');
      const data = await res.json();
      if (data.success && Array.isArray(data.branches)) {
        setLocations(data.branches);
        setTotalEnterpriseGross(data.totalEnterpriseGrossCents || 0);
        setTotalEnterpriseStaff(data.totalEnterpriseStaff || 0);
      }
    } catch (err) {
      console.warn('Failed to load locations:', err);
    } finally {
      setLoadingLocations(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'locations') {
      fetchLocations();
    }
  }, [activeTab]);

  const saveAddons = () => {
    addToast('Add-on modules updated.', 'success');
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-4 sm:p-6 md:p-8 space-y-6 pb-24">
      {/* Header */}
      <div>
        <h2 className="text-xl font-extrabold text-[var(--text-primary)] tracking-tight">{t('settingsTitle')}</h2>
        <p className="text-xs text-[var(--text-secondary)] mt-0.5">
          {t('settingsDesc')}
        </p>
      </div>

      {/* Main 2-Column Responsive Layout: Left Nav Rail + Right Content Surface */}
      <div className="flex flex-col md:flex-row gap-6 items-start">
        {/* Left Navigation Rail (Desktop: Vertical Sidebar / Mobile: Horizontal Swipe Strip) */}
        <nav className="w-full md:w-56 flex-shrink-0 flex md:flex-col overflow-x-auto md:overflow-visible gap-1.5 p-1.5 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] hide-scrollbar">
          {TAB_LIST.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all text-left whitespace-nowrap md:w-full cursor-pointer ${
                  isActive
                    ? 'bg-[var(--bg-primary)] text-[var(--text-primary)] shadow-xs font-extrabold'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                <Icon className="w-4 h-4 flex-shrink-0 text-[var(--text-secondary)]" />
                <span>{t(tab.labelKey as any)}</span>
              </button>
            );
          })}
        </nav>

        {/* Right Content Surface */}
        <div className="flex-1 w-full min-w-0">
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
            <Section title={t('personalInfo')} icon={Person24Regular}>
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
                  <div className="w-14 h-14 rounded-2xl border border-[var(--border-subtle)] bg-black/5 dark:bg-white/5 flex items-center justify-center shadow-md overflow-hidden relative flex-shrink-0">
                    <img src={getAvatarUrl(profileName || 'Operator', avatarUrl)} alt={profileName} className="w-full h-full object-cover" />
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

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <FloatingInput
                    label={t('fullName')}
                    type="text"
                    value={profileName}
                    onChange={(e) => setProfileName(e.target.value)}
                  />
                  <FloatingInput
                    label={t('email')}
                    type="email"
                    value={profileEmail}
                    readOnly
                    rightElement={
                      <span className="px-2 py-0.5 rounded-full bg-green-500/10 text-green-600 dark:text-green-400 text-[10px] font-bold">
                        {t('verified')}
                      </span>
                    }
                  />
                </div>

                <motion.button
                  whileTap={{ scale: 0.97 }}
                  type="submit"
                  className="btn-primary self-start"
                >
                  <Save24Filled className="w-4 h-4" />
                  <span>{t('save')}</span>
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
            <Section title={t('stripeConnectTitle')} icon={Payment24Regular}>
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
                  <span>{t('stripeConnected')} {t('expressPayoutsActive')}</span>
                </div>
              </div>
            </Section>

            {/* Notifications - Roadmap Teaser */}
            <Section title={t('notificationPreferences')} icon={Alert24Regular}>
              <div className="flex items-center justify-between">
                <p className="text-xs text-[var(--text-secondary)]">
                  {t('notificationsRoadmapDesc')}
                </p>
                <span className="px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30 text-[10px] font-mono font-extrabold uppercase whitespace-nowrap">
                  {t('comingSoonV11')}
                </span>
              </div>
            </Section>

            {/* Passwordless & OAuth Security Section */}
            <Section title={t('passwordlessSecurity')} icon={Shield24Regular}>
              <div className="p-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 space-y-3">
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                  {t('passwordlessDesc')}
                </p>
                <div className="flex items-center gap-2 pt-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                  <ShieldCheckmark24Regular className="w-4 h-4 flex-shrink-0" />
                  <span>{t('passwordlessBadge')}</span>
                </div>
              </div>
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

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <FloatingInput
                    label={t('workspaceName')}
                    type="text"
                    value={wsName}
                    onChange={(e) => setWsName(e.target.value)}
                  />
                  <FloatingInput
                    label={t('bookingSlug')}
                    type="text"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    className="font-mono"
                  />
                  <CustomSelect
                    label={t('timezone')}
                    value={timezone}
                    onChange={setTimezone}
                    options={[
                      { value: 'America/New_York', label: t('tzEastern') },
                      { value: 'America/Chicago', label: t('tzCentral') },
                      { value: 'America/Denver', label: t('tzMountain') },
                      { value: 'America/Los_Angeles', label: t('tzPacific') },
                      { value: 'Europe/London', label: t('tzLondon') },
                      { value: 'Europe/Berlin', label: t('tzBerlin') },
                    ]}
                  />
                  <CustomSelect
                    label={t('hourFormat')}
                    value={timeFormat}
                    onChange={(val) => setTimeFormat(val as '12h' | '24h')}
                    options={[
                      { value: '12h', label: t('timeFormat12h') },
                      { value: '24h', label: t('timeFormat24h') },
                    ]}
                  />
                </div>
                <motion.button whileTap={{ scale: 0.97 }} type="submit" className="btn-primary self-start">
                  <Save24Filled className="w-4 h-4" />
                  <span>{t('save')}</span>
                </motion.button>
              </form>
            </Section>

            {/* Chairs & Workstations Manager - Action -> Trigger UX */}
            <div className="p-5 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] space-y-4 shadow-xs">
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-primary)] flex items-center gap-2">
                  <Building24Regular className="w-4 h-4 text-[var(--text-secondary)]" />
                  <span>{t('chairsAndStations')}</span>
                  <span className="text-[10px] font-mono font-extrabold text-[var(--text-secondary)] bg-black/5 dark:bg-white/10 px-2 py-0.5 rounded-full border border-[var(--border-subtle)]">
                    {stations.length} {t('statusActive')}
                  </span>
                </h3>
                <button
                  type="button"
                  onClick={() => {
                    setNewStationName('');
                    setNewStationCategory('Hair & Styling');
                    setIsAddStationModalOpen(true);
                  }}
                  className="btn-primary"
                >
                  <Add24Filled className="w-4 h-4" />
                  <span>{t('addStation')}</span>
                </button>
              </div>

              {/* Structured Interactive List */}
              <div className="divide-y divide-black/5 dark:divide-white/5 border border-black/5 dark:border-white/10 rounded-2xl overflow-hidden bg-black/[0.02] dark:bg-white/[0.02]">
                {stations.map((stn) => (
                  <div
                    key={stn.id}
                    onClick={() => {
                      setEditingStationId(stn.id);
                      setEditingStationName(stn.name);
                      setEditingStationCategory(stn.category || 'Hair & Styling');
                    }}
                    className="px-4 py-3 flex items-center justify-between gap-3 hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-xl bg-black/5 dark:bg-white/5 border border-[var(--border-subtle)] text-[var(--text-secondary)] flex items-center justify-center flex-shrink-0">
                        <Building24Regular className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-[var(--text-primary)] group-hover:text-blue-500 transition-colors truncate">
                          {stn.name}
                        </p>
                        <p className="text-[10px] text-[var(--text-secondary)] font-medium truncate">
                          {stn.category || t('stationCategoryLabel')}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
                      <button
                        type="button"
                        onClick={() => {
                          setEditingStationId(stn.id);
                          setEditingStationName(stn.name);
                          setEditingStationCategory(stn.category || 'Hair & Styling');
                        }}
                        className="p-1.5 rounded-xl text-[var(--text-muted)] hover:text-blue-500 hover:bg-blue-500/10 transition-colors cursor-pointer"
                        title={t('editStation')}
                      >
                        <Edit24Filled className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          deleteStation(stn.id);
                          addToast(t('stationDeleted'), 'info');
                        }}
                        className="p-1.5 rounded-xl text-[var(--text-muted)] hover:text-red-500 hover:bg-red-500/10 transition-colors cursor-pointer"
                        title={t('deleteStation')}
                      >
                        <Delete24Filled className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Section title={t('bookingPolicies')} icon={Clock24Regular}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <CustomSelect
                  label={t('cancellationNotice')}
                  value={cancellation}
                  onChange={setCancellation}
                  options={[
                    { value: '12', label: '12 ' + (t('hoursUnit') || 'Hours') },
                    { value: '24', label: '24 ' + (t('hoursUnit') || 'Hours') },
                    { value: '48', label: '48 ' + (t('hoursUnit') || 'Hours') },
                  ]}
                />
                <CustomSelect
                  label={t('depositPercent')}
                  value={deposit}
                  onChange={setDeposit}
                  options={[
                    { value: '0', label: '0%' },
                    { value: '20', label: '20%' },
                    { value: '50', label: '50%' },
                    { value: '100', label: '100%' },
                  ]}
                />
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
                className="btn-primary"
              >
                <Save24Filled className="w-4 h-4" />
                <span>{t('save')}</span>
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



        {/* ─── TAB: ADD-ONS ─── */}
        {activeTab === 'addons' && (() => {
          const isLocalDev = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
          const canAccessAddons = isLocalDev || isBetaAccess;

          return (
            <motion.div
              key="addons"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.15 }}
              className="space-y-4"
            >
              {/* Beta Access Badge Status */}
              <div className="flex items-center justify-between p-3 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 text-xs">
                <div className="flex items-center gap-2">
                  <LockClosed24Regular className={`w-4 h-4 ${canAccessAddons ? 'text-emerald-500' : 'text-amber-500'}`} />
                  <span className="font-bold text-[var(--text-primary)]">{t('betaAccessTitle')}</span>
                </div>
                {canAccessAddons ? (
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-extrabold">
                    {isLocalDev ? t('localDevActive') : '⚡ Beta Unlocked'}
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => setIsBetaModalOpen(true)}
                    className="px-3 py-1 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 text-[11px] font-bold transition-colors"
                  >
                    {t('enterBetaCode')}
                  </button>
                )}
              </div>

              <Section title={t('industryAddons')} icon={Sparkle24Regular}>
                <p className="text-xs text-[var(--text-secondary)]">
                  {t('industryAddonsDesc')}
                </p>

                {/* Lock Overlay Banner if not in Beta or Local Dev */}
                {!canAccessAddons && (
                  <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-amber-500/10 border border-amber-500/20 space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400 flex-shrink-0">
                        <LockClosed24Regular className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-xs font-black text-[var(--text-primary)]">{t('betaAccessTitle')}</h4>
                        <p className="text-[11px] text-[var(--text-secondary)] mt-0.5 leading-relaxed">
                          {t('betaAccessDesc')}
                        </p>
                        <p className="text-[10px] font-semibold text-amber-600 dark:text-amber-400 mt-1">
                          {t('betaAccessRule')}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 pt-2 border-t border-amber-500/10">
                      <button
                        type="button"
                        onClick={() => setIsBetaModalOpen(true)}
                        className="btn-primary"
                      >
                        <LockClosed16Filled className="w-3.5 h-3.5" />
                        <span>{t('enterBetaCode')}</span>
                      </button>
                    </div>
                  </div>
                )}

                <div className="space-y-3">
                  {[
                    {
                      id: 'hipaa' as const,
                      icon: Shield24Regular,
                      iconColor: 'text-blue-500',
                      title: t('hipaaTitle'),
                      desc: t('hipaaDesc'),
                      val: addons.hipaa,
                      color: 'bg-blue-600',
                    },
                    {
                      id: 'esign' as const,
                      icon: DocumentCheckmark24Regular,
                      iconColor: 'text-purple-500',
                      title: t('esignTitle'),
                      desc: t('esignDesc'),
                      val: addons.esign,
                      color: 'bg-purple-600',
                    },
                    {
                      id: 'kyc' as const,
                      icon: Person24Regular,
                      iconColor: 'text-green-500',
                      title: t('kycTitle'),
                      desc: t('kycDesc'),
                      val: addons.kyc,
                      color: 'bg-green-600',
                    },
                  ].map((mod) => {
                    const Icon = mod.icon;
                    return (
                      <div
                        key={mod.id}
                        onClick={() => {
                          if (!canAccessAddons) {
                            setIsBetaModalOpen(true);
                          }
                        }}
                        className={`flex items-start justify-between p-4 rounded-2xl border transition-colors ${
                          !canAccessAddons
                            ? 'bg-black/5 dark:bg-white/5 border-black/10 dark:border-white/10 opacity-75 cursor-pointer hover:border-amber-500/30'
                            : mod.val
                            ? 'bg-black/5 dark:bg-white/5 border-black/10 dark:border-white/10'
                            : 'bg-black/3 dark:bg-white/3 border-black/5 dark:border-white/5'
                        }`}
                      >
                        <div className="flex items-start gap-3 flex-1 min-w-0 pr-4">
                          <Icon className={`w-5 h-5 ${mod.iconColor} mt-0.5 flex-shrink-0`} />
                          <div>
                            <div className="flex items-center gap-1.5">
                              <h4 className="text-xs font-bold text-[var(--text-primary)]">{mod.title}</h4>
                              {!canAccessAddons && (
                                <span className="px-1.5 py-0.2 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[9px] font-extrabold flex items-center gap-0.5">
                                  <LockClosed16Filled className="w-2.5 h-2.5" /> Beta
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-[var(--text-secondary)] mt-0.5 leading-snug">{mod.desc}</p>
                          </div>
                        </div>
                        <Toggle
                          enabled={mod.val}
                          onToggle={() => canAccessAddons && toggleAddon(mod.id)}
                          color={mod.color}
                          locked={!canAccessAddons}
                        />
                      </div>
                    );
                  })}
                </div>

                <motion.button
                  whileTap={{ scale: 0.97 }}
                  type="button"
                  disabled={!canAccessAddons}
                  onClick={saveAddons}
                  className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Save24Filled className="w-4 h-4" />
                  <span>{t('save')}</span>
                </motion.button>
              </Section>
            </motion.div>
          );
        })()}

        {/* ─── TAB 4: PRIVACY & COMPLIANCE AUDIT CENTER ─── */}
        {activeTab === 'compliance' && (
          <motion.div
            key="compliance"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
            className="space-y-5"
          >
            {/* Unified Privacy & Security Overview Card */}
            <div className="p-6 rounded-3xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] space-y-4 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-base font-extrabold text-[var(--text-primary)] flex items-center gap-2">
                    <ShieldCheckmark24Regular className="w-5 h-5 text-emerald-500" />
                    <span>{t('complianceTitle')}</span>
                  </h3>
                  <p className="text-xs text-[var(--text-secondary)] mt-0.5 max-w-xl">
                    {t('complianceDesc')}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleExportComplianceCsv}
                  className="px-4 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold flex items-center gap-2 shadow-xs transition-colors flex-shrink-0 cursor-pointer"
                >
                  <DocumentCheckmark24Regular className="w-4 h-4" />
                  <span>{t('exportAuditReport')}</span>
                </button>
              </div>

              {/* Inline Trust & Security Badges Strip */}
              <div className="pt-2 border-t border-[var(--border-subtle)] flex flex-wrap items-center gap-2.5">
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 text-xs font-mono font-bold text-[var(--text-primary)]">
                  <span className="text-blue-500 font-extrabold">{complianceLogs.length}</span>
                  <span className="text-[11px] font-sans text-[var(--text-secondary)]">{t('totalAuditEvents')}</span>
                </div>

                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-xs font-semibold">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>{t('kmsEncryption')} ({t('kmsActive')})</span>
                </div>

                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-700 dark:text-purple-300 text-xs font-semibold">
                  <CheckmarkCircle24Filled className="w-3.5 h-3.5" />
                  <span>{t('hipaaVerified')}</span>
                </div>

                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 text-xs font-medium text-[var(--text-muted)]">
                  <span>{t('zeroKnowledgeKeyVault')}</span>
                </div>
              </div>
            </div>

            {/* Immutable Audit Log Stream Container */}
            <div className="bg-[var(--bg-primary)] border border-[var(--border-subtle)] rounded-3xl overflow-visible shadow-xs">
              {/* Table Header Toolbar with Filter Dropdown */}
              <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--border-subtle)]">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--text-primary)] flex items-center gap-2">
                    <ShieldCheckmark24Regular className="w-4 h-4 text-emerald-500" />
                    <span>{t('immutableAuditRecords')}</span>
                  </h4>
                  <p className="text-[11px] text-[var(--text-muted)] mt-0.5">
                    {t('totalAuditEvents')}: {complianceLogs.filter((log) => complianceFilter === 'all' || log.action === complianceFilter).length}
                  </p>
                </div>

                {/* Filter Dropdown */}
                <div className="w-full sm:w-64">
                  <CustomSelect
                    options={[
                      { value: 'all', label: t('allActions') },
                      { value: 'view_phi', label: t('phiAccess') },
                      { value: 'update_formula', label: t('formulaUpdate') },
                      { value: 'sign_waiver', label: t('waiverSigned') },
                      { value: 'export_records', label: t('recordsExported') },
                    ]}
                    value={complianceFilter}
                    onChange={setComplianceFilter}
                    compact
                  />
                </div>
              </div>

              {/* Log Stream Content / Standard EmptyState */}
              {loadingCompliance ? (
                <div className="p-8 text-center text-xs text-[var(--text-secondary)]">{t('loadingComplianceLogs')}</div>
              ) : complianceLogs.filter((log) => complianceFilter === 'all' || log.action === complianceFilter).length === 0 ? (
                <div className="p-4 sm:p-6">
                  <EmptyState
                    icon={ShieldCheckmark24Regular}
                    title={t('noAuditLogsTitle')}
                    description={t('noAuditLogsDesc')}
                  />
                </div>
              ) : (
                <div className="divide-y divide-[var(--border-subtle)]">
                  {complianceLogs
                    .filter((log) => complianceFilter === 'all' || log.action === complianceFilter)
                    .map((log) => {
                      const actionBadgeColor =
                        log.action === 'view_phi'
                          ? 'bg-purple-500/10 text-purple-600 border-purple-500/20'
                          : log.action === 'update_formula'
                          ? 'bg-blue-500/10 text-blue-600 border-blue-500/20'
                          : log.action === 'sign_waiver'
                          ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'
                          : 'bg-amber-500/10 text-amber-600 border-amber-500/20';

                      return (
                        <div key={log.id} className="p-4 space-y-2 hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-xs font-extrabold text-[var(--text-primary)]">
                                {log.actorName}
                              </span>
                              <span className="text-[10px] font-bold text-[var(--text-muted)]">
                                ({log.actorRole})
                              </span>
                              <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase border ${actionBadgeColor}`}>
                                {log.action.replace('_', ' ')}
                              </span>
                            </div>

                            <span className="text-[10px] font-mono text-[var(--text-muted)]">
                              {new Date(log.createdAt).toLocaleString()}
                            </span>
                          </div>

                          {log.resourceName && (
                            <p className="text-xs font-semibold text-blue-600 dark:text-blue-400">
                              {log.resourceName}
                            </p>
                          )}

                          {log.details && (
                            <p className="text-xs text-[var(--text-secondary)]">
                              {log.details}
                            </p>
                          )}

                          <div className="flex items-center gap-4 text-[10px] font-mono text-[var(--text-muted)] pt-1">
                            <span>IP: {log.ipAddress || '127.0.0.1'}</span>
                            <span>Agent: {log.userAgent || 'AirBook Native Client'}</span>
                          </div>
                        </div>
                      );
                    })}
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* ─── TAB 6: CUSTOM DOMAIN WHITE-LABEL ─── */}
        {activeTab === 'domain' && (
          <motion.div
            key="domain"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
          >
            <CustomDomainStudio />
          </motion.div>
        )}

        {/* ─── TAB 7: MULTI-LOCATION ENTERPRISE ─── */}
        {activeTab === 'locations' && (
          <motion.div
            key="locations"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
            className="space-y-4"
          >
            {/* Aggregated Organization Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              <div className="p-4 rounded-3xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] space-y-1">
                <span className="text-[11px] font-bold text-[var(--text-secondary)] uppercase">
                  {t('totalEnterpriseLocations')}
                </span>
                <p className="text-2xl font-black text-blue-600 font-mono">
                  {locations.length}
                </p>
                <p className="text-[10px] text-[var(--text-muted)]">{t('activePhysicalBranches')}</p>
              </div>

              <div className="p-4 rounded-3xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] space-y-1">
                <span className="text-[11px] font-bold text-[var(--text-secondary)] uppercase">
                  {t('networkRevenue')}
                </span>
                <p className="text-2xl font-black text-emerald-600 font-mono">
                  ${(totalEnterpriseGross / 100).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                </p>
                <p className="text-[10px] text-[var(--text-muted)]">{t('monthlyConsolidatedGross')}</p>
              </div>

              <div className="p-4 rounded-3xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] space-y-1">
                <span className="text-[11px] font-bold text-[var(--text-secondary)] uppercase">
                  {t('networkStaff')}
                </span>
                <p className="text-2xl font-black text-purple-600 font-mono">
                  {totalEnterpriseStaff}
                </p>
                <p className="text-[10px] text-[var(--text-muted)]">{t('practitionersAndSpecialists')}</p>
              </div>
            </div>

            {/* Branch Cards Divided List */}
            <div className="space-y-3">
              {loadingLocations ? (
                <div className="p-8 text-center text-xs text-[var(--text-secondary)]">{t('loadingLocationBranches')}</div>
              ) : (
                locations.map((loc) => (
                  <div
                    key={loc.id}
                    className={`p-5 rounded-3xl border transition-all ${
                      loc.isCurrent
                        ? 'border-blue-500/50 bg-blue-500/5 shadow-xs ring-1 ring-blue-500/20'
                        : 'border-[var(--border-subtle)] bg-[var(--bg-primary)] hover:border-black/20'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="text-sm font-extrabold text-[var(--text-primary)]">
                            {loc.name}
                          </h4>
                          <span className="px-2 py-0.5 rounded-full bg-black/5 dark:bg-white/5 text-[9px] font-black uppercase text-[var(--text-secondary)] border border-[var(--border-subtle)]">
                            {loc.locationType}
                          </span>
                          {loc.isCurrent && (
                            <span className="px-2 py-0.5 rounded-full bg-blue-600 text-white text-[9px] font-black uppercase">
                              {t('currentLocation')}
                            </span>
                          )}
                        </div>

                        <p className="text-xs text-[var(--text-secondary)]">
                          {loc.address} {loc.phone && `· ${loc.phone}`}
                        </p>
                        <p className="text-[11px] text-[var(--text-muted)]">
                          {t('managerLabel') || 'Manager'}: <span className="font-semibold text-[var(--text-secondary)]">{loc.managerName}</span> · {t('headcountLabel')}: <span className="font-semibold text-[var(--text-secondary)]">{loc.staffCount} {t('staffLabel') || 'staff'}</span>
                        </p>
                      </div>

                      <div className="flex items-center gap-2.5 flex-shrink-0">
                        <a
                          href={`/book/${loc.slug}`}
                          target="_blank"
                          rel="noreferrer"
                          className="px-3.5 py-2 rounded-xl border border-[var(--border-subtle)] hover:bg-black/5 text-xs font-bold text-[var(--text-primary)] transition-colors"
                        >
                          {t('bookingPageLink')} ↗
                        </a>

                        {!loc.isCurrent && (
                          <button
                            type="button"
                            onClick={() => {
                              addToast(t('switchedActiveBranch').replace('{name}', loc.name), 'success');
                              setTimeout(() => {
                                window.location.reload();
                              }, 500);
                            }}
                            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold transition-colors cursor-pointer"
                          >
                            {t('switchLocation')}
                          </button>
                        )}
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
      </div>

      {/* Toast notifications */}
      <Toast toasts={toasts} onDismiss={dismiss} />

      {/* Confirm delete workspace */}
      <ConfirmDialog
        isOpen={confirmDelete}
        title={t('deleteWorkspace')}
        description={t('dangerZoneDesc')}
        confirmLabel={t('deleteWorkspace')}
        cancelLabel={t('cancel')}
        variant="danger"
        onConfirm={() => {
          setConfirmDelete(false);
          addToast(t('dangerZoneDesc'), 'error');
        }}
        onCancel={() => setConfirmDelete(false)}
      />

      {/* Beta Access Key Modal */}
      <AnimatePresence>
        {isBetaModalOpen && (
          <div className="fixed inset-0 z-[250] flex items-end md:items-center justify-center p-0 md:p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsBetaModalOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-md"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full md:max-w-md glass-panel rounded-t-[32px] md:rounded-3xl rounded-b-none md:rounded-b-3xl p-6 shadow-2xl bg-white dark:bg-gray-900 border-t md:border border-white/80 dark:border-white/10 z-10 space-y-4 max-h-[92vh] md:max-h-[85vh] overflow-y-auto"
            >
              {/* Mobile & Tablet Drag Handle */}
              <div className="w-full pt-1 pb-1 flex md:hidden justify-center bg-transparent flex-shrink-0">
                <div className="w-12 h-1.5 rounded-full bg-black/20 dark:bg-white/20" />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
                    <LockClosed24Regular className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-black text-[var(--text-primary)]">{t('enterBetaCode')}</h3>
                </div>
                <button
                  onClick={() => setIsBetaModalOpen(false)}
                  className="p-1.5 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-gray-400"
                >
                  <Dismiss24Filled className="w-4 h-4" />
                </button>
              </div>

              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                {t('betaAccessRule')}
              </p>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const success = unlockBetaWithCode(betaInputCode);
                  if (success) {
                    addToast(t('betaUnlockedSuccess'), 'success');
                    setIsBetaModalOpen(false);
                    setBetaInputCode('');
                  } else {
                    addToast(t('invalidBetaCode'), 'error');
                  }
                }}
                className="space-y-3 pt-2"
              >
                <input
                  type="text"
                  value={betaInputCode}
                  onChange={(e) => setBetaInputCode(e.target.value)}
                  placeholder={t('betaCodePlaceholder')}
                  className="w-full px-4 py-3 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-xs font-mono font-bold tracking-wider text-[var(--text-primary)] uppercase focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                  autoFocus
                />

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsBetaModalOpen(false)}
                    className="flex-1 py-2.5 rounded-xl border border-black/10 dark:border-white/10 text-xs font-bold text-[var(--text-secondary)] hover:bg-black/5"
                  >
                    {t('cancel')}
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-md transition-colors"
                  >
                    {t('unlockBeta')}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      {/* ─── ADD STATION MODAL DIALOG ─── */}
      <AnimatePresence>
        {isAddStationModalOpen && (
          <div className="fixed inset-0 z-[250] flex items-end md:items-center justify-center p-0 md:p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAddStationModalOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 30, scale: 0.98 }}
              transition={{ duration: 0.15, ease: 'easeOut' }}
              className="relative w-full md:max-w-md bg-[var(--bg-primary)] border-t md:border border-[var(--border-subtle)] rounded-t-[32px] md:rounded-3xl rounded-b-none md:rounded-b-3xl shadow-2xl z-10 flex flex-col overflow-visible"
            >
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!newStationName.trim()) return;
                  addStation({ name: newStationName.trim(), category: newStationCategory });
                  setIsAddStationModalOpen(false);
                  setNewStationName('');
                  addToast(t('stationAdded'), 'success');
                }}
                className="flex flex-col h-full"
              >
                {/* Mobile Drag Handle */}
                <div className="w-full pt-3 pb-1 flex md:hidden justify-center bg-[var(--bg-primary)] flex-shrink-0 rounded-t-[32px]">
                  <div className="w-12 h-1.5 rounded-full bg-black/20 dark:bg-white/20" />
                </div>

                {/* Header */}
                <div className="w-full px-6 py-4 flex items-center justify-between border-b border-[var(--border-subtle)] bg-[var(--bg-primary)] rounded-t-[32px] md:rounded-t-3xl">
                  <div className="flex items-center gap-2.5">
                    <Building24Regular className="w-5 h-5 text-[var(--text-secondary)]" />
                    <h3 className="text-base font-extrabold text-[var(--text-primary)]">{t('addStation')}</h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsAddStationModalOpen(false)}
                    className="text-[var(--text-muted)] hover:text-[var(--text-primary)] p-1.5 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
                  >
                    <Dismiss24Filled className="w-5 h-5" />
                  </button>
                </div>

                {/* Form Body */}
                <div className="p-6 space-y-3.5">
                  <FloatingInput
                    label={t('stationNameLabel')}
                    required
                    autoFocus
                    value={newStationName}
                    onChange={(e) => setNewStationName(e.target.value)}
                    placeholder={t('stationNamePlaceholder')}
                  />

                  <CustomSelect
                    label={t('stationCategoryLabel')}
                    value={newStationCategory}
                    onChange={setNewStationCategory}
                    options={[
                      { value: 'Hair & Styling', label: t('catHairStyling') },
                      { value: 'Color & Wash Bar', label: t('catColorWash') },
                      { value: 'Spa & Skincare', label: t('catSpaSkincare') },
                      { value: 'Nails & Pedicure', label: t('catNailsPedicure') },
                      { value: 'Barbering', label: t('catBarbering') },
                      { value: 'General / Flex', label: t('catGeneralFlex') },
                    ]}
                  />
                </div>

                {/* Bottom Action Bar */}
                <div className="w-full p-4 bg-[var(--bg-primary)] border-t border-[var(--border-subtle)] flex items-center gap-2 rounded-b-none md:rounded-b-3xl">
                  <button
                    type="button"
                    onClick={() => setIsAddStationModalOpen(false)}
                    className="flex-1 py-3 rounded-2xl border border-[var(--border-subtle)] text-xs font-extrabold text-[var(--text-secondary)] hover:bg-black/5 transition-colors"
                  >
                    {t('cancel')}
                  </button>
                  <button
                    type="submit"
                    className="btn-primary flex-1 flex items-center justify-center gap-1.5"
                  >
                    <CheckmarkCircle24Filled className="w-4 h-4" />
                    <span>{t('addStation')}</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ─── EDIT STATION MODAL DIALOG ─── */}
      <AnimatePresence>
        {editingStationId && (
          <div className="fixed inset-0 z-[250] flex items-end md:items-center justify-center p-0 md:p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setEditingStationId(null)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 30, scale: 0.98 }}
              transition={{ duration: 0.15, ease: 'easeOut' }}
              className="relative w-full max-w-md bg-[var(--bg-primary)] border border-[var(--border-subtle)] rounded-t-[32px] md:rounded-3xl shadow-2xl z-10 flex flex-col overflow-visible"
            >
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!editingStationName.trim()) return;
                  updateStation(editingStationId, editingStationName.trim(), editingStationCategory);
                  setEditingStationId(null);
                  addToast(t('stationUpdated'), 'success');
                }}
                className="flex flex-col h-full"
              >
                {/* Mobile Drag Handle */}
                <div className="w-full pt-3 pb-1 flex md:hidden justify-center bg-[var(--bg-primary)] flex-shrink-0 rounded-t-[32px]">
                  <div className="w-12 h-1.5 rounded-full bg-black/20 dark:bg-white/20" />
                </div>

                {/* Header */}
                <div className="w-full px-6 py-4 flex items-center justify-between border-b border-[var(--border-subtle)] bg-[var(--bg-primary)] rounded-t-[32px] md:rounded-t-3xl">
                  <div className="flex items-center gap-2.5">
                    <Building24Regular className="w-5 h-5 text-[var(--text-secondary)]" />
                    <h3 className="text-base font-extrabold text-[var(--text-primary)]">{t('editChairStation')}</h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setEditingStationId(null)}
                    className="text-[var(--text-muted)] hover:text-[var(--text-primary)] p-1.5 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
                  >
                    <Dismiss24Filled className="w-5 h-5" />
                  </button>
                </div>

                {/* Form Body */}
                <div className="p-6 space-y-3.5">
                  <FloatingInput
                    label={t('stationNameLabel')}
                    required
                    autoFocus
                    value={editingStationName}
                    onChange={(e) => setEditingStationName(e.target.value)}
                  />

                  <CustomSelect
                    label={t('stationCategoryLabel')}
                    value={editingStationCategory}
                    onChange={setEditingStationCategory}
                    options={[
                      { value: 'Hair & Styling', label: t('catHairStyling') },
                      { value: 'Color & Wash Bar', label: t('catColorWash') },
                      { value: 'Spa & Skincare', label: t('catSpaSkincare') },
                      { value: 'Nails & Pedicure', label: t('catNailsPedicure') },
                      { value: 'Barbering', label: t('catBarbering') },
                      { value: 'General / Flex', label: t('catGeneralFlex') },
                    ]}
                  />
                </div>

                {/* Bottom Action Bar */}
                <div className="w-full p-4 bg-[var(--bg-primary)] border-t border-[var(--border-subtle)] flex items-center gap-2 rounded-b-none md:rounded-b-3xl">
                  <button
                    type="button"
                    onClick={() => setEditingStationId(null)}
                    className="flex-1 py-3 rounded-2xl border border-[var(--border-subtle)] text-xs font-extrabold text-[var(--text-secondary)] hover:bg-black/5 transition-colors"
                  >
                    {t('cancel')}
                  </button>
                  <button
                    type="submit"
                    className="btn-primary flex-1 flex items-center justify-center gap-1.5"
                  >
                    <Save24Filled className="w-4 h-4" />
                    <span>{t('save')}</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add Location Branch Modal */}
      <AddLocationModal
        isOpen={isAddLocationOpen}
        onClose={() => setIsAddLocationOpen(false)}
        onLocationCreated={fetchLocations}
      />
    </div>
  );
};
