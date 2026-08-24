import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { useAirBookStore } from '@/lib/store';
import { useToast } from '@/components/Toast';
import { getAvatarUrl, getProviderColor } from '@/lib/avatars';
import { CustomSelect } from '@/components/CustomSelect';
import { EmptyState } from '@/components/EmptyState';
import { Add24Filled, Add24Regular, Dismiss24Filled, People24Regular, Person24Regular, Color24Regular, Sparkle24Filled, Edit24Filled, Calendar24Filled, CheckmarkCircle24Filled, MoreHorizontal24Filled, Print24Filled, DismissCircle24Filled, Delete24Filled, Mail24Regular, Mail24Filled, ChevronDown24Regular, Clock24Regular } from '@fluentui/react-icons';

interface StaffItem {
  id: string;
  name: string;
  role: string;
  color?: string;
  avatarEmoji?: string;
  avatarUrl?: string;
  stationName?: string;
  stationId?: string;
  commissionPercent?: number;
  workingHours?: Record<string, { enabled: boolean; start: string; end: string }>;
  email?: string;
  phone?: string;
  isActive?: boolean;
}

export interface ShiftDayConfig {
  key: string;
  labelKey: string;
  active: boolean;
  startTime: string;
  endTime: string;
}

export const INITIAL_SCHEDULE: ShiftDayConfig[] = [
  { key: 'mon', labelKey: 'monShort', active: true, startTime: '09:00', endTime: '18:00' },
  { key: 'tue', labelKey: 'tueShort', active: true, startTime: '09:00', endTime: '18:00' },
  { key: 'wed', labelKey: 'wedShort', active: true, startTime: '09:00', endTime: '18:00' },
  { key: 'thu', labelKey: 'thuShort', active: true, startTime: '09:00', endTime: '18:00' },
  { key: 'fri', labelKey: 'friShort', active: true, startTime: '09:00', endTime: '18:00' },
  { key: 'sat', labelKey: 'satShort', active: false, startTime: '10:00', endTime: '16:00' },
  { key: 'sun', labelKey: 'sunShort', active: false, startTime: '10:00', endTime: '16:00' },
];

export const scheduleToWorkingHours = (sched: ShiftDayConfig[]) => {
  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  const obj: Record<string, { enabled: boolean; start: string; end: string }> = {};
  sched.forEach((item, idx) => {
    const dayKey = days[idx] || item.key;
    obj[dayKey] = { enabled: item.active, start: item.startTime, end: item.endTime };
  });
  return obj;
};

export const workingHoursToSchedule = (wh?: Record<string, { enabled: boolean; start: string; end: string }>): ShiftDayConfig[] => {
  if (!wh) return INITIAL_SCHEDULE;
  const days = [
    { key: 'mon', full: 'monday', labelKey: 'monShort' },
    { key: 'tue', full: 'tuesday', labelKey: 'tueShort' },
    { key: 'wed', full: 'wednesday', labelKey: 'wedShort' },
    { key: 'thu', full: 'thursday', labelKey: 'thuShort' },
    { key: 'fri', full: 'friday', labelKey: 'friShort' },
    { key: 'sat', full: 'saturday', labelKey: 'satShort' },
    { key: 'sun', full: 'sunday', labelKey: 'sunShort' },
  ];
  return days.map((d) => {
    const conf = wh[d.full] || { enabled: d.key !== 'sat' && d.key !== 'sun', start: '09:00', end: '18:00' };
    return {
      key: d.key,
      labelKey: d.labelKey,
      active: conf.enabled ?? true,
      startTime: conf.start || '09:00',
      endTime: conf.end || '18:00',
    };
  });
};

const TIME_SLOTS = [
  '07:00', '07:30', '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
  '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
  '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30',
  '19:00', '19:30', '20:00', '20:30', '21:00'
];

interface StaffScheduleConfiguratorProps {
  schedule: ShiftDayConfig[];
  onChange: (newSchedule: ShiftDayConfig[]) => void;
}

const StaffScheduleConfigurator: React.FC<StaffScheduleConfiguratorProps> = ({ schedule, onChange }) => {
  const { t } = useTranslation();
  const timeFormat = useAirBookStore((s) => s.timeFormat);

  const formatTimeLabel = (tVal: string) => {
    if (timeFormat === '24h') return tVal;
    const [hStr, mStr] = tVal.split(':');
    let h = parseInt(hStr, 10);
    const ampm = h >= 12 ? 'PM' : 'AM';
    h = h % 12;
    if (h === 0) h = 12;
    return `${h}:${mStr} ${ampm}`;
  };

  const timeOptions = TIME_SLOTS.map((tVal) => ({
    value: tVal,
    label: formatTimeLabel(tVal),
  }));

  const handleToggleDay = (index: number) => {
    const next = [...schedule];
    next[index] = { ...next[index], active: !next[index].active };
    onChange(next);
  };

  const handleTimeChange = (index: number, field: 'startTime' | 'endTime', val: string) => {
    const next = [...schedule];
    next[index] = { ...next[index], [field]: val };
    onChange(next);
  };

  const applyDefaultWeekdays = () => {
    const next = schedule.map((d, idx) => {
      if (idx < 5) return { ...d, active: true, startTime: '09:00', endTime: '18:00' };
      return { ...d, active: false };
    });
    onChange(next);
  };

  const copyMonToWeekdays = () => {
    const mon = schedule[0];
    const next = schedule.map((d, idx) => {
      if (idx < 5) return { ...d, active: mon.active, startTime: mon.startTime, endTime: mon.endTime };
      return d;
    });
    onChange(next);
  };

  const markWeekendsOff = () => {
    const next = schedule.map((d, idx) => {
      if (idx >= 5) return { ...d, active: false };
      return d;
    });
    onChange(next);
  };

  const activeDays = schedule.filter((d) => d.active);
  const totalHours = schedule.reduce((acc, d) => {
    if (!d.active) return acc;
    const [startH, startM] = d.startTime.split(':').map(Number);
    const [endH, endM] = d.endTime.split(':').map(Number);
    const diff = (endH + endM / 60) - (startH + startM / 60);
    return acc + (diff > 0 ? diff : 0);
  }, 0);

  return (
    <div className="p-4 rounded-3xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 space-y-3.5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <label className="text-xs font-extrabold text-[var(--text-primary)] flex items-center gap-1.5">
          <Clock24Regular className="w-4 h-4 text-blue-500" />
          <span>{t('workingShiftsAndHours')}</span>
        </label>
        <span className="text-[10px] font-mono font-extrabold text-blue-600 dark:text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded-full border border-blue-500/20">
          {t('weeklySummary')
            .replace('{workingDays}', String(activeDays.length))
            .replace('{totalHours}', totalHours.toFixed(1))}
        </span>
      </div>

      {/* Quick Action Presets */}
      <div className="flex flex-wrap items-center gap-1.5 pt-1">
        <button
          type="button"
          onClick={applyDefaultWeekdays}
          className="px-2.5 py-1 rounded-xl text-[10px] font-extrabold bg-blue-500/10 text-blue-600 dark:text-blue-400 hover:bg-blue-500/20 transition-colors flex items-center gap-1"
        >
          <Sparkle24Filled className="w-3 h-3 text-blue-500" />
          <span>{t('applyDefaultWeekdays')}</span>
        </button>
        <button
          type="button"
          onClick={copyMonToWeekdays}
          className="px-2.5 py-1 rounded-xl text-[10px] font-extrabold bg-black/5 dark:bg-white/10 text-[var(--text-secondary)] hover:bg-black/10 transition-colors"
        >
          {t('copyMonToWeekdays')}
        </button>
        <button
          type="button"
          onClick={markWeekendsOff}
          className="px-2.5 py-1 rounded-xl text-[10px] font-extrabold bg-black/5 dark:bg-white/10 text-[var(--text-secondary)] hover:bg-black/10 transition-colors"
        >
          {t('markWeekendsOff')}
        </button>
      </div>

      {/* 7-Day Schedule List */}
      <div className="space-y-2.5 pt-1">
        {schedule.map((day, idx) => (
          <div
            key={day.key}
            className={`p-3 rounded-2xl border transition-all flex flex-col min-[520px]:flex-row min-[520px]:items-center justify-between gap-2.5 ${
              day.active
                ? 'bg-white dark:bg-gray-800/80 border-black/10 dark:border-white/10 shadow-sm'
                : 'bg-black/5 dark:bg-white/5 border-transparent opacity-60'
            }`}
          >
            {/* Day label & Working toggle */}
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => handleToggleDay(idx)}
                className={`w-9 h-7 rounded-xl font-mono text-xs font-black flex items-center justify-center transition-all ${
                  day.active
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-black/10 dark:bg-white/10 text-[var(--text-muted)]'
                }`}
              >
                {t(day.labelKey as any)}
              </button>

              {/* Custom Spring-Animated Switch Toggle */}
              <button
                type="button"
                role="switch"
                aria-checked={day.active}
                onClick={() => handleToggleDay(idx)}
                className={`w-11 h-6 rounded-full p-0.5 transition-colors duration-200 ease-in-out flex items-center flex-shrink-0 cursor-pointer ${
                  day.active ? 'bg-blue-600' : 'bg-black/15 dark:bg-white/20'
                }`}
              >
                <motion.div
                  animate={{ x: day.active ? 20 : 0 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  className="w-5 h-5 rounded-full bg-white shadow-md"
                />
              </button>

              <span className={`text-xs font-extrabold ${day.active ? 'text-[var(--text-primary)]' : 'text-[var(--text-muted)]'}`}>
                {day.active ? t('workingDay') : t('offDay')}
              </span>
            </div>

            {/* Custom Coded Compact Time Pickers when active */}
            {day.active && (
              <div className="flex items-center justify-between min-[520px]:justify-end gap-1.5 w-full min-[520px]:w-auto pt-2 min-[520px]:pt-0 border-t min-[520px]:border-t-0 border-black/5 dark:border-white/5">
                <CustomSelect
                  value={day.startTime}
                  onChange={(val) => handleTimeChange(idx, 'startTime', val)}
                  options={timeOptions}
                  compact
                  className="flex-1 min-[520px]:w-[105px]"
                />
                <span className="text-xs font-bold text-[var(--text-muted)] flex-shrink-0">→</span>
                <CustomSelect
                  value={day.endTime}
                  onChange={(val) => handleTimeChange(idx, 'endTime', val)}
                  options={timeOptions}
                  compact
                  className="flex-1 min-[520px]:w-[105px]"
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

interface StaffModuleProps {
  onNavigateToCalendar?: () => void;
}

export const StaffModule: React.FC<StaffModuleProps> = ({ onNavigateToCalendar }) => {
  const { t } = useTranslation();
  const { addToast } = useToast();
  const [activeTab, setActiveTab] = useState<'roster' | 'invites'>('roster');
  const [staffList, setStaffList] = useState<StaffItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedStaffForEdit, setSelectedStaffForEdit] = useState<StaffItem | null>(null);
  const [showMoreActions, setShowMoreActions] = useState(false);

  // Invite Team State
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<'staff' | 'manager' | 'receptionist'>('staff');
  const [pendingInvitesList, setPendingInvitesList] = useState<any[]>([]);
  const [sendingInvite, setSendingInvite] = useState(false);

  // Add Staff Form State
  const [name, setName] = useState('');
  const [role, setRole] = useState('Hair Stylist');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [avatarEmoji, setAvatarEmoji] = useState('👨🏻‍🎨');
  const [commissionPercent, setCommissionPercent] = useState(70);
  const [addSchedule, setAddSchedule] = useState<ShiftDayConfig[]>(INITIAL_SCHEDULE);
  const [submitting, setSubmitting] = useState(false);

  // Edit Modal Form State
  const [editName, setEditName] = useState('');
  const [editRole, setEditRole] = useState('');
  const [editCommission, setEditCommission] = useState(70);
  const [editSchedule, setEditSchedule] = useState<ShiftDayConfig[]>(INITIAL_SCHEDULE);
  const [editChair, setEditChair] = useState('Sillón #1 / Station 1');

  const isDemoMode = useAirBookStore((s) => s.isDemoMode);
  const demoStaff = useAirBookStore((s) => s.staffMembers);
  const setSelectedStaffId = useAirBookStore((s) => s.setSelectedStaffId);
  const setViewMode = useAirBookStore((s) => s.setViewMode);
  const providerColorMode = useAirBookStore((s) => s.providerColorMode);
  const setProviderColorMode = useAirBookStore((s) => s.setProviderColorMode);
  const stations = useAirBookStore((s) => s.stations);

  const fetchStaff = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/staff');
      const data = await res.json();
      if (data.success && Array.isArray(data.staff)) {
        setStaffList(data.staff);
      }
    } catch (err) {
      console.warn('Failed to fetch staff from DB:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchInvitations = async () => {
    try {
      const res = await fetch('/api/invitations');
      const data = await res.json();
      if (data.success) {
        setPendingInvitesList(data.invitations || []);
      }
    } catch (err) {
      console.error('Failed to load invitations:', err);
    }
  };

  useEffect(() => {
    if (isDemoMode) {
      setStaffList(demoStaff as any);
    } else {
      fetchStaff();
      fetchInvitations();
    }
  }, [isDemoMode, demoStaff]);

  const handleSendInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail || !inviteEmail.includes('@')) return;

    try {
      setSendingInvite(true);
      const res = await fetch('/api/invitations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: inviteEmail, role: inviteRole }),
      });
      const data = await res.json();
      if (data.success) {
        addToast(t('inviteSentSuccess'), 'success');
        setInviteEmail('');
        fetchInvitations();
      } else {
        addToast(data.error || 'Failed to send invitation', 'error');
      }
    } catch (err) {
      addToast('Error sending invitation', 'error');
    } finally {
      setSendingInvite(false);
    }
  };

  const handleRevokeInvite = async (id: string) => {
    try {
      const res = await fetch(`/api/invitations?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        addToast(t('inviteRevokedSuccess'), 'success');
        fetchInvitations();
      }
    } catch (err) {
      addToast('Failed to revoke invitation', 'error');
    }
  };

  const handleCardClick = (stf: StaffItem) => {
    setSelectedStaffForEdit(stf);
    setEditName(stf.name);
    setEditRole(stf.role);
    setEditCommission(stf.commissionPercent ?? 70);
    setEditSchedule(workingHoursToSchedule(stf.workingHours));
    setEditChair(stf.stationName || 'Station 1 (Master Suite)');
  };

  const handleViewCalendar = (staffId: string) => {
    setSelectedStaffId(staffId);
    setViewMode('day');
    setSelectedStaffForEdit(null);
    onNavigateToCalendar?.();
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStaffForEdit) return;

    try {
      const res = await fetch('/api/staff', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: selectedStaffForEdit.id,
          name: editName,
          role: editRole,
          commissionPercent: editCommission,
          stationName: editChair,
          workingHours: scheduleToWorkingHours(editSchedule),
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSelectedStaffForEdit(null);
        addToast(t('staffScheduleUpdated'), 'success');
        fetchStaff();
      }
    } catch (err) {
      console.error('Failed to update staff:', err);
    }
  };

  const handleAddStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      setSubmitting(true);
      const res = await fetch('/api/staff', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          role: role.trim() || 'Specialist',
          email: email.trim() || undefined,
          phone: phone.trim() || undefined,
          avatarEmoji: avatarEmoji || '👨🏻‍🎨',
          commissionPercent: Number(commissionPercent) || 70,
          workingHours: scheduleToWorkingHours(addSchedule),
        }),
      });

      const data = await res.json();
      if (data.success) {
        setIsAddModalOpen(false);
        setName('');
        setRole('');
        setEmail('');
        setPhone('');
        addToast(t('staffSpecialistAdded'), 'success');
        fetchStaff();
      }
    } catch (err) {
      console.error('Failed to add staff:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const EMOJI_OPTIONS = ['👨🏻‍🎨', '🧑🏼‍⚕️', '🧔🏻‍♂️', '👩🏼‍🦱', '💇🏻‍♀️', '💆🏻‍♂️', '👨🏽‍💼'];

  return (
    <div className="w-full max-w-5xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-extrabold text-[var(--text-primary)] tracking-tight">
            {t('staffTitle')}
          </h2>
          <p className="text-xs text-[var(--text-secondary)] mt-0.5 max-w-xl">
            {t('staffDesc')}
          </p>
        </div>

        {activeTab === 'roster' && (
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsAddModalOpen(true)}
            className="btn-primary self-start sm:self-auto"
          >
            <Add24Filled className="w-4 h-4 flex-shrink-0" />
            <span>{t('addStaffMember')}</span>
          </motion.button>
        )}
      </div>

      {!loading && staffList.length === 0 && pendingInvitesList.length === 0 ? (
        <EmptyState
          icon={People24Regular}
          title={t('noStaff')}
          description={t('noStaffSub')}
          action={{
            label: t('addStaffMember'),
            onClick: () => setIsAddModalOpen(true),
            icon: Add24Filled,
          }}
        />
      ) : (
        <div className="space-y-6">
          {/* Sub Navigation Tabs */}
          <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] w-fit">
            <button
              type="button"
              onClick={() => setActiveTab('roster')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'roster'
                  ? 'bg-[var(--bg-primary)] text-[var(--text-primary)] shadow-xs font-extrabold'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              <People24Regular className="w-4 h-4" />
              <span>{t('currentTeam')}</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('invites')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'invites'
                  ? 'bg-[var(--bg-primary)] text-[var(--text-primary)] shadow-xs font-extrabold'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              <Mail24Regular className="w-4 h-4" />
              <span>{t('pendingInvites')}</span>
              {pendingInvitesList.length > 0 && (
                <span className="px-1.5 py-0.5 rounded-full bg-[var(--color-accent-primary)] text-white text-[10px] font-extrabold">
                  {pendingInvitesList.length}
                </span>
              )}
            </button>
          </div>

          {/* Roster Tab View */}
          {activeTab === 'roster' && (
            <div className="space-y-3.5">
          {/* Calendar Provider Color Setting Control Banner */}
          <div className="p-4 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-subtle)]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start sm:items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-black/5 dark:bg-white/5 text-[var(--text-secondary)] flex-shrink-0">
                  <Color24Regular className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xs font-extrabold text-[var(--text-primary)] uppercase tracking-wider">
                    {t('calendarColorPaletteTitle')}
                  </h3>
                  <p className="text-[11px] text-[var(--text-secondary)] mt-0.5">
                    {t('calendarColorPaletteDesc')}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1 p-1 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-xs font-bold w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => setProviderColorMode('auto')}
                  className={`flex-1 sm:flex-initial px-3.5 py-2 rounded-xl transition-all duration-100 flex items-center justify-center gap-1.5 whitespace-nowrap ${
                    providerColorMode === 'auto'
                      ? 'bg-[var(--bg-primary)] text-[var(--text-primary)] shadow-xs font-extrabold'
                      : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  <Sparkle24Filled className="w-3.5 h-3.5" />
                  <span>{t('colorModeAutoBalanced')}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setProviderColorMode('custom')}
                  className={`flex-1 sm:flex-initial px-3.5 py-2 rounded-xl transition-all duration-100 flex items-center justify-center gap-1.5 whitespace-nowrap ${
                    providerColorMode === 'custom'
                      ? 'bg-[var(--bg-primary)] text-[var(--text-primary)] shadow-xs font-extrabold'
                      : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  <Edit24Filled className="w-3.5 h-3.5" />
                  <span>{t('colorModeCustom')}</span>
                </button>
              </div>
            </div>
          </div>

          {loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="p-5 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] flex items-center gap-4 animate-pulse shadow-xs"
                >
                  <div className="w-14 h-14 rounded-2xl bg-black/10 dark:bg-white/10 flex-shrink-0" />
                  <div className="space-y-2 flex-1">
                    <div className="h-4 w-1/2 rounded bg-black/10 dark:bg-white/10" />
                    <div className="h-3 w-1/3 rounded bg-black/5 dark:bg-white/5" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && (
            <div>
              {staffList.length === 0 ? (
                <EmptyState
                  icon={People24Regular}
                  title={t('noStaff')}
                  description={t('noStaffSub')}
                  action={{
                    label: t('addStaffMember'),
                    onClick: () => setIsAddModalOpen(true),
                    icon: Add24Filled,
                  }}
                />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {staffList.map((stf, idx) => {
                  const providerColor = getProviderColor(idx, (stf as any).color, providerColorMode);
                  const avatarSrc = getAvatarUrl(stf.name, (stf as any).avatarUrl, providerColor);
                  const isCustomPhoto = (stf as any).avatarUrl && (stf as any).avatarUrl.startsWith('http');

                  return (
                    <motion.div
                      key={stf.id}
                      whileHover={{ y: -2, scale: 1.008 }}
                      whileTap={{ scale: 0.98 }}
                      transition={{ duration: 0.08, ease: 'easeOut' }}
                      onClick={() => handleCardClick(stf)}
                      className="p-5 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] flex items-start justify-between gap-4 shadow-xs hover:border-black/20 dark:hover:border-white/20 cursor-pointer transition-all duration-100 ease-out group"
                    >
                      <div className="flex items-center gap-4">
                        <div className="relative p-1 rounded-2xl bg-black/5 dark:bg-white/5 flex-shrink-0 group-hover:scale-105 transition-transform">
                          <img
                            src={avatarSrc}
                            alt={stf.name}
                            className={`w-14 h-14 rounded-2xl object-cover shadow-sm ${
                              isCustomPhoto ? 'border-2' : ''
                            }`}
                            style={isCustomPhoto ? { borderColor: providerColor } : undefined}
                          />
                          <span
                            className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white dark:border-[#141720]"
                            style={{ backgroundColor: providerColor }}
                          />
                        </div>

                        <div>
                          <h3 className="text-sm font-extrabold text-[var(--text-primary)] group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                            {stf.name}
                          </h3>
                          <p className="text-xs text-[var(--text-secondary)] mt-0.5">{stf.role}</p>
                          <div className="flex flex-wrap items-center gap-2 mt-2 text-[11px] text-[var(--text-secondary)] font-semibold">
                            {stf.stationName && (
                              <span className="px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold text-[10px]">
                                {stf.stationName}
                              </span>
                            )}
                            <span>{stf.commissionPercent ?? 70}{t('commissionSuffix')}</span>
                            <span>•</span>
                            <span className="text-emerald-600 dark:text-emerald-400 font-bold">{t('onShift')}</span>
                          </div>
                        </div>
                      </div>

                    </motion.div>
                  );
                })}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Invites Tab View */}
      {activeTab === 'invites' && (
        <div className="space-y-6">
          {/* Invite Form Card */}
          <div className="p-5 sm:p-6 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] space-y-4 shadow-xs">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-primary)] flex items-center gap-2">
              <Add24Regular className="w-4 h-4 text-[var(--text-secondary)]" />
              <span>{t('inviteTeamMembers')}</span>
            </h3>
            <form onSubmit={handleSendInvite} className="space-y-3.5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold uppercase tracking-wider text-[var(--text-secondary)] block">
                    {t('emailAddress')}
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="teammate@salon.com"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    className="w-full h-10 px-4 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-xs font-medium text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-black/10 dark:focus:ring-white/10"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold uppercase tracking-wider text-[var(--text-secondary)] block">
                    {t('selectRole')}
                  </label>
                  <CustomSelect
                    value={inviteRole}
                    onChange={(val) => setInviteRole(val as any)}
                    options={[
                      { value: 'staff', label: t('staff') },
                      { value: 'manager', label: t('manager') },
                      { value: 'receptionist', label: t('roleReceptionist') },
                    ]}
                  />
                </div>
              </div>
              <div className="flex justify-end pt-1">
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  type="submit"
                  disabled={sendingInvite}
                  className="btn-primary"
                >
                  <Mail24Filled className="w-4 h-4" />
                  <span>{sendingInvite ? t('saving') : t('invite')}</span>
                </motion.button>
              </div>
            </form>
          </div>

          {/* Pending Invites List & Empty State */}
          <div className="p-5 sm:p-6 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] space-y-4 shadow-xs">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-primary)] flex items-center gap-2">
              <Mail24Regular className="w-4 h-4 text-[var(--text-secondary)]" />
              <span>{t('pendingInvites')}</span>
            </h3>

            {pendingInvitesList.length === 0 ? (
              <EmptyState
                icon={Mail24Regular}
                title={t('noPendingInvites')}
                description={t('inviteFormHint')}
              />
            ) : (
              <div className="space-y-2.5">
                {pendingInvitesList.map((inv) => (
                  <div
                    key={inv.id}
                    className="flex items-center justify-between p-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-[var(--border-subtle)] hover:border-blue-500/30 transition-colors"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="w-9 h-9 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center font-extrabold text-xs shadow-xs">
                        {inv.email.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-[var(--text-primary)]">{inv.email}</p>
                        <p className="text-[11px] text-[var(--text-secondary)] capitalize mt-0.5">
                          {inv.role} • {t('statusPending')}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRevokeInvite(inv.id)}
                      className="px-3.5 py-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 text-xs font-bold transition-colors flex items-center gap-1.5"
                    >
                      <Dismiss24Filled className="w-3.5 h-3.5" />
                      <span>{t('revokeInvite')}</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
        </div>
      )}

      {/* Staff Card Interactive Details & Edit Modal */}
      <AnimatePresence>
        {selectedStaffForEdit && (
          <div className="fixed inset-0 z-[250] flex items-end md:items-center justify-center p-0 md:p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedStaffForEdit(null)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 30, scale: 0.98 }}
              transition={{ duration: 0.15, ease: 'easeOut' }}
              className="relative w-full md:max-w-2xl bg-[var(--bg-primary)] border-t md:border border-[var(--border-subtle)] rounded-t-[32px] md:rounded-3xl rounded-b-none md:rounded-b-3xl shadow-2xl z-10 flex flex-col max-h-[92vh] md:max-h-[85vh] overflow-hidden"
            >
              <form onSubmit={handleSaveEdit} className="flex flex-col h-full min-h-0 overflow-hidden">
                {/* Mobile & Tablet Drag Handle */}
                <div className="w-full pt-3 pb-1 flex md:hidden justify-center bg-[var(--bg-primary)] flex-shrink-0">
                  <div className="w-12 h-1.5 rounded-full bg-black/20 dark:bg-white/20" />
                </div>

                {/* Header Edge-to-Edge Bar */}
                <div className="w-full px-6 py-4 flex items-center justify-between flex-shrink-0 bg-[var(--bg-primary)]">
                  <div className="flex items-center gap-3">
                    {(() => {
                      const editIdx = staffList.findIndex((s) => s.id === selectedStaffForEdit.id);
                      const editProviderColor = getProviderColor(editIdx >= 0 ? editIdx : 0, (selectedStaffForEdit as any).color, providerColorMode);
                      const editAvatarSrc = getAvatarUrl(selectedStaffForEdit.name, (selectedStaffForEdit as any).avatarUrl, editProviderColor);
                      const isCustomPhoto = (selectedStaffForEdit as any).avatarUrl && (selectedStaffForEdit as any).avatarUrl.startsWith('http');

                      return (
                        <div className="relative flex-shrink-0">
                          <img
                            src={editAvatarSrc}
                            alt={selectedStaffForEdit.name}
                            className={`w-14 h-14 rounded-2xl object-cover shadow-sm ${
                              isCustomPhoto ? 'border-2' : ''
                            }`}
                            style={isCustomPhoto ? { borderColor: editProviderColor } : undefined}
                          />
                          <span
                            className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white dark:border-[#141720]"
                            style={{ backgroundColor: editProviderColor }}
                          />
                        </div>
                      );
                    })()}
                    <div>
                      <h3 className="text-base font-extrabold text-[var(--text-primary)]">
                        {selectedStaffForEdit.name}
                      </h3>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs font-medium text-[var(--text-secondary)]">
                          {selectedStaffForEdit.role}
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold">
                          {t('activeOnShift')}
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setSelectedStaffForEdit(null)}
                    className="text-[var(--text-muted)] hover:text-[var(--text-primary)] p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
                  >
                    <Dismiss24Filled className="w-5 h-5" />
                  </button>
                </div>
                <div className="w-full h-[1px] bg-[var(--border-subtle)] flex-shrink-0" />

                {/* Scrollable Drawer Body */}
                <div className="p-5 md:p-6 overflow-y-auto space-y-4 md:space-y-5 flex-1 scroll-fade-b">

              {/* Form Content */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  <div>
                    <label className="text-xs font-semibold text-[var(--text-secondary)] mb-1 block">
                      {t('fullName')}
                    </label>
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-2xl bg-black/5 dark:bg-white/5 border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-[var(--text-secondary)] mb-1 block">
                      {t('role')}
                    </label>
                    <input
                      type="text"
                      value={editRole}
                      onChange={(e) => setEditRole(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-2xl bg-black/5 dark:bg-white/5 border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Detailed Working Shifts & Hours Configurator */}
                <StaffScheduleConfigurator schedule={editSchedule} onChange={setEditSchedule} />

                <div>
                  <label className="text-xs font-semibold text-[var(--text-secondary)] mb-1 block">
                    {t('chairStation')}
                  </label>
                  <CustomSelect
                    value={editChair}
                    onChange={(val) => setEditChair(val)}
                    options={[
                      ...stations.map((stn) => ({ value: stn.name, label: stn.name })),
                      { value: 'Unassigned / Floating', label: t('unassignedFloating') },
                    ]}
                  />
                </div>

                {/* Commission Split & Payout Status */}
                <div className="p-5 pb-5 rounded-3xl bg-black/5 dark:bg-white/5 space-y-3.5 border border-black/5 dark:border-white/10">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[var(--text-primary)]">
                      {t('commissionSplit')}
                    </span>
                    <span className="text-xs font-mono font-extrabold text-green-600 dark:text-green-400">
                      {t('commissionSplitDisplay').replace('{staffPercent}', String(editCommission)).replace('{housePercent}', String(100 - editCommission))}
                    </span>
                  </div>

                  <div className="py-2">
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={editCommission}
                      onChange={(e) => setEditCommission(Number(e.target.value))}
                      className="w-full cursor-pointer h-2.5 rounded-full"
                      style={{
                        background: `linear-gradient(to right, #2BB5FF 0%, #2BB5FF ${editCommission}%, rgba(148, 163, 184, 0.25) ${editCommission}%, rgba(148, 163, 184, 0.25) 100%)`,
                      }}
                    />
                  </div>

                  <div className="pt-3.5 pb-1 flex items-center justify-between border-t border-black/10 dark:border-white/10 text-[11px]">
                    <span className="text-[var(--text-secondary)] font-semibold">{t('payoutMethod')}</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> {t('stripeInstantPayoutActive')}
                    </span>
                  </div>
                </div>
              </div>

              {/* SIDE-TO-SIDE BOTTOM ACTION BANNER (FLUSH TO BOTTOM OF DRAWER PANEL) */}
              <div className="w-full p-4 md:p-5 bg-[var(--bg-primary)] border-t border-[var(--border-subtle)] space-y-2.5 z-30 flex-shrink-0">
                {/* Primary Action */}
                <button
                  type="button"
                  onClick={handleSaveEdit as any}
                  className="w-full py-3.5 px-4 rounded-2xl bg-black text-white dark:bg-white dark:text-black text-xs font-extrabold shadow-md hover:opacity-90 active:scale-98 transition-all duration-100 ease-out flex items-center justify-center gap-2"
                >
                  <CheckmarkCircle24Filled className="w-4 h-4" />
                  <span>{t('saveStaff')}</span>
                </button>

                {/* Secondary Navigation Shortcut */}
                <button
                  type="button"
                  onClick={() => handleViewCalendar(selectedStaffForEdit.id)}
                  className="w-full py-3 px-4 rounded-2xl bg-black/5 dark:bg-white/10 text-[var(--text-primary)] text-xs font-bold border border-black/5 dark:border-white/10 hover:bg-black/10 active:scale-98 transition-all duration-100 ease-out flex items-center justify-center gap-2"
                >
                  <Calendar24Filled className="w-4 h-4 text-blue-500" />
                  <span>{t('viewCalendarSchedule')}</span>
                </button>

                {/* Tertiary Action: "Más Acciones..." Overflow Trigger */}
                <button
                  type="button"
                  onClick={() => setShowMoreActions(!showMoreActions)}
                  className="w-full py-2.5 px-4 rounded-2xl bg-black/5 dark:bg-white/5 text-[var(--text-secondary)] hover:text-[var(--text-primary)] text-xs font-semibold hover:bg-black/10 dark:hover:bg-white/10 active:scale-98 transition-all duration-100 ease-out flex items-center justify-center gap-2"
                >
                  <MoreHorizontal24Filled className="w-4 h-4" />
                  <span>{showMoreActions ? t('hideActions') : t('moreActions')}</span>
                </button>

                {/* Collapsible Extended Overflow Actions */}
                <AnimatePresence>
                  {showMoreActions && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden pt-2 space-y-2 border-t border-black/5 dark:border-white/10"
                    >
                      <button
                        type="button"
                        onClick={() => addToast(t('generatingPdf'), 'info')}
                        className="w-full py-2.5 px-4 rounded-2xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-600 dark:text-purple-400 text-xs font-bold transition-all flex items-center justify-center gap-2"
                      >
                        <Print24Filled className="w-4 h-4" />
                        <span>{t('printMemberProfile')}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setSelectedStaffForEdit(null);
                          setShowMoreActions(false);
                        }}
                        className="w-full py-2.5 px-4 rounded-2xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 text-xs font-bold transition-all flex items-center justify-center gap-2"
                      >
                        <DismissCircle24Filled className="w-4 h-4" />
                        <span>{t('temporarilyDeactivate')}</span>
                      </button>

                      <button
                        type="button"
                        onClick={async () => {
                          if (!selectedStaffForEdit) return;
                          try {
                            const res = await fetch(`/api/staff?id=${selectedStaffForEdit.id}`, {
                              method: 'DELETE',
                            });
                            const data = await res.json();
                            if (data.success) {
                              setSelectedStaffForEdit(null);
                              setShowMoreActions(false);
                              fetchStaff();
                            }
                          } catch (err) {
                            console.error('Failed to delete staff:', err);
                          }
                        }}
                        className="w-full py-2.5 px-4 rounded-2xl bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 text-xs font-bold transition-all flex items-center justify-center gap-2"
                      >
                        <Delete24Filled className="w-4 h-4" />
                        <span>{t('removeTeamMember')}</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add Staff Modal / Drawer */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-[250] flex items-end md:items-center justify-center p-0 md:p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAddModalOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 30, scale: 0.98 }}
              transition={{ duration: 0.15, ease: 'easeOut' }}
              className="relative w-full md:max-w-lg bg-[var(--bg-primary)] border-t md:border border-[var(--border-subtle)] rounded-t-[32px] md:rounded-3xl rounded-b-none md:rounded-b-3xl shadow-2xl z-10 flex flex-col max-h-[92vh] md:max-h-[85vh] overflow-hidden"
            >
              <form onSubmit={handleAddStaff} className="flex flex-col h-full min-h-0 overflow-hidden">
                {/* Mobile & Tablet Drag Handle */}
                <div className="w-full pt-3 pb-1 flex md:hidden justify-center bg-[var(--bg-primary)] flex-shrink-0">
                  <div className="w-12 h-1.5 rounded-full bg-black/20 dark:bg-white/20" />
                </div>

                {/* Header Edge-to-Edge Bar */}
                <div className="w-full px-6 py-4 flex items-center justify-between flex-shrink-0 bg-[var(--bg-primary)]">
                  <h3 className="text-base font-extrabold text-[var(--text-primary)]">{t('addStaffMember')}</h3>
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="text-[var(--text-muted)] hover:text-[var(--text-primary)] p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
                  >
                    <Dismiss24Filled className="w-5 h-5" />
                  </button>
                </div>
                <div className="w-full h-[1px] bg-[var(--border-subtle)] flex-shrink-0" />

                {/* Scrollable Form Body */}
                <div className="p-5 md:p-6 overflow-y-auto space-y-4 flex-1 scroll-fade-b">

                  <div>
                    <label className="text-xs font-semibold text-[var(--text-secondary)] mb-1 block">{t('fullName')} *</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Marcus Vance"
                      className="w-full px-3.5 py-2.5 rounded-2xl bg-black/5 dark:bg-white/5 border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-[var(--text-secondary)] mb-1 block">{t('role')}</label>
                    <input
                      type="text"
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      placeholder="e.g. Master Barber / Color Specialist"
                      className="w-full px-3.5 py-2.5 rounded-2xl bg-black/5 dark:bg-white/5 border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-3.5">
                    <div>
                      <label className="text-xs font-semibold text-[var(--text-secondary)] mb-1 block">{t('email')}</label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="staff@business.com"
                        className="w-full px-3.5 py-2.5 rounded-2xl bg-black/5 dark:bg-white/5 border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  {/* Detailed Working Shifts & Hours Configurator */}
                  <StaffScheduleConfigurator schedule={addSchedule} onChange={setAddSchedule} />

                  {/* Commission Split Slider Container */}
                  <div className="p-5 pb-5 rounded-3xl bg-black/5 dark:bg-white/5 space-y-3.5 border border-black/5 dark:border-white/10">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[var(--text-primary)]">
                        {t('commissionSplit')} (%)
                      </span>
                      <span className="text-xs font-mono font-extrabold text-green-600 dark:text-green-400">
                        {t('commissionSplitDisplay').replace('{staffPercent}', String(commissionPercent)).replace('{housePercent}', String(100 - commissionPercent))}
                      </span>
                    </div>

                    <div className="py-2">
                      <input
                        type="range"
                        min={0}
                        max={100}
                        value={commissionPercent}
                        onChange={(e) => setCommissionPercent(Number(e.target.value))}
                        className="w-full cursor-pointer h-2.5 rounded-full"
                        style={{
                          background: `linear-gradient(to right, #2BB5FF 0%, #2BB5FF ${commissionPercent}%, rgba(148, 163, 184, 0.25) ${commissionPercent}%, rgba(148, 163, 184, 0.25) 100%)`,
                        }}
                      />
                    </div>

                    <div className="pt-3.5 pb-1 flex items-center justify-between border-t border-black/10 dark:border-white/10 text-[11px]">
                      <span className="text-[var(--text-secondary)] font-semibold">{t('payoutMethod')}</span>
                      <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> {t('stripeInstantPayoutActive')}
                      </span>
                    </div>
                  </div>
                </div>

                {/* SIDE-TO-SIDE BOTTOM ACTION BANNER (FLUSH TO BOTTOM OF DRAWER PANEL) */}
                <div className="w-full p-4 md:p-5 bg-[var(--bg-primary)] border-t border-[var(--border-subtle)] z-30 flex-shrink-0">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3.5 px-4 rounded-2xl bg-black text-white dark:bg-white dark:text-black text-xs font-extrabold shadow-md hover:opacity-90 active:scale-98 disabled:opacity-50 transition-all duration-100 ease-out flex items-center justify-center gap-2"
                  >
                    <CheckmarkCircle24Filled className="w-4 h-4" />
                    <span>{submitting ? t('saving') : t('saveStaff')}</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
