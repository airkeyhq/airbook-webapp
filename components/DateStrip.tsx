import React from 'react';
import { useAirBookStore, DEMO_STAFF } from '@/lib/store';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { getAvatarUrl, getProviderColor } from '@/lib/avatars';
import { format, addDays, startOfWeek } from 'date-fns';
import { ArrowLeft24Filled, ArrowRight24Filled, People24Filled } from '@fluentui/react-icons';
import { motion } from 'framer-motion';

export const DateStrip: React.FC = () => {
  const {
    selectedDateStr,
    setSelectedDateStr,
    viewMode,
    setViewMode,
    selectedStaffId,
    setSelectedStaffId,
    staffMembers,
    isDemoMode,
    providerColorMode,
  } = useAirBookStore();
  const { t } = useTranslation();
  const selectedDate = new Date(selectedDateStr + 'T00:00:00');

  const activeStaff = isDemoMode || staffMembers.length === 0 ? DEMO_STAFF : staffMembers;

  // Generate current week starting from Monday
  const weekStart = startOfWeek(selectedDate, { weekStartsOn: 1 });
  const daysOfWeek = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const handlePrev = () => {
    const daysToMove = viewMode === 'week' ? -7 : -1;
    const prev = addDays(selectedDate, daysToMove);
    setSelectedDateStr(format(prev, 'yyyy-MM-dd'));
  };

  const handleNext = () => {
    const daysToMove = viewMode === 'week' ? 7 : 1;
    const next = addDays(selectedDate, daysToMove);
    setSelectedDateStr(format(next, 'yyyy-MM-dd'));
  };

  const handleToday = () => {
    setSelectedDateStr(format(new Date(), 'yyyy-MM-dd'));
  };

  return (
    <div className="w-full bg-white dark:bg-[#141720] border-b border-slate-200/80 dark:border-white/10 px-3 py-2.5 sm:px-5 sm:py-3 flex flex-col flex-shrink-0 z-20 relative gap-2.5">
      {/* Top Row: Month/Week Title (Left) + View Mode & Navigation Controls (Right) */}
      <div className="flex items-center justify-between w-full flex-wrap gap-2">
        {/* Month & Week Number Indicator */}
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          <h2 className="text-sm sm:text-base font-black text-[var(--text-primary)] tracking-tight">
            {format(selectedDate, 'MMMM yyyy')}
          </h2>
          <span className="px-2 py-0.5 rounded-md bg-black/5 dark:bg-white/10 text-[10px] font-mono text-[var(--text-muted)] font-bold hidden sm:inline-block">
            W{format(selectedDate, 'w')}
          </span>
        </div>

        {/* View Toggle & Navigation Controls (Standardized h-9 / 36px Height Token) */}
        <div className="flex items-center gap-1 sm:gap-2.5 flex-shrink-0">
          {/* View Toggle (Day / Week) */}
          <div className="h-8 sm:h-9 flex items-center bg-black/5 dark:bg-white/10 rounded-full p-1 gap-0.5">
            <button
              onClick={() => setViewMode('day')}
              className={`h-6 sm:h-7 flex items-center px-2.5 sm:px-3 rounded-full text-[11px] sm:text-xs font-extrabold transition-all ${
                viewMode === 'day' ? 'bg-white text-black shadow-sm dark:bg-white dark:text-black' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              {t('day')}
            </button>
            <button
              onClick={() => setViewMode('week')}
              className={`h-6 sm:h-7 flex items-center px-2.5 sm:px-3 rounded-full text-[11px] sm:text-xs font-extrabold transition-all ${
                viewMode === 'week' ? 'bg-white text-black shadow-sm dark:bg-white dark:text-black' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              {t('week')}
            </button>
          </div>

          <button
            onClick={handleToday}
            className="h-8 sm:h-9 flex items-center px-2.5 sm:px-3 rounded-full bg-black/5 dark:bg-white/10 hover:bg-black/10 transition-colors text-[11px] sm:text-xs font-extrabold text-[var(--text-primary)]"
          >
            {t('today')}
          </button>

          <div className="h-8 sm:h-9 flex items-center bg-black/5 dark:bg-white/10 rounded-full p-0.5 sm:p-1 gap-0.5">
            <button
              onClick={handlePrev}
              aria-label="Previous"
              className="h-7 w-7 flex items-center justify-center rounded-full hover:bg-black/10 text-[var(--text-primary)]"
            >
              <ArrowLeft24Filled className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleNext}
              aria-label="Next"
              className="h-7 w-7 flex items-center justify-center rounded-full hover:bg-black/10 text-[var(--text-primary)]"
            >
              <ArrowRight24Filled className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Second Row: Week Day Segmented Track (In Day View) */}
      {viewMode === 'day' && (
        <div className="flex flex-col gap-2">
          {/* Day Date Selector Bar */}
          <div className="w-full flex items-center justify-between gap-1 overflow-x-auto hide-scrollbar bg-black/5 dark:bg-white/5 p-1 rounded-2xl border border-black/5 dark:border-white/10">
            {daysOfWeek.map((day) => {
              const dayStr = format(day, 'yyyy-MM-dd');
              const isSelected = dayStr === selectedDateStr;
              const isToday = dayStr === format(new Date(), 'yyyy-MM-dd');

              return (
                <button
                  key={dayStr}
                  onClick={() => setSelectedDateStr(dayStr)}
                  className={`relative flex-1 flex flex-col items-center justify-center min-w-[42px] sm:min-w-[54px] pt-3.5 pb-2 px-1 rounded-xl text-xs font-bold transition-colors z-10 ${
                    isSelected
                      ? 'text-black dark:text-black font-black'
                      : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  {isSelected && (
                    <motion.div
                      layoutId="date-segmented-active"
                      transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                      className="absolute inset-0 bg-white rounded-[14px] shadow-sm border border-black/5 -z-10"
                    />
                  )}
                  
                  {/* Signature Red Line for Today */}
                  {isToday && (
                    <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-4 h-1 bg-[#FF3B30] rounded-full z-20 shadow-sm" />
                  )}

                  <span className={`text-[9px] uppercase tracking-wider mt-1 ${isSelected ? 'opacity-100' : 'opacity-75'}`}>{format(day, 'EEE')}</span>
                  <span className="text-xs sm:text-sm font-mono font-bold mt-0.5">{format(day, 'd')}</span>
                </button>
              );
            })}
          </div>

          {/* Team Staff Member Selector Pill Track */}
          <div className="w-full flex items-center gap-1.5 overflow-x-auto hide-scrollbar py-0.5">
            <span className="text-[10px] font-mono font-bold uppercase text-[var(--text-muted)] tracking-wider px-1 hidden sm:inline-block">
              Team:
            </span>

            <button
              onClick={() => setSelectedStaffId('all')}
              className={`h-7 px-3 rounded-full text-xs font-extrabold transition-all flex items-center gap-1.5 flex-shrink-0 ${
                selectedStaffId === 'all'
                  ? 'bg-black text-white dark:bg-white dark:text-black shadow-sm'
                  : 'bg-black/5 dark:bg-white/10 text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              <People24Filled className="w-3.5 h-3.5" />
              <span>All Staff ({activeStaff.length})</span>
            </button>

            {activeStaff.map((staff, idx) => {
              const isSelected = selectedStaffId === staff.id;
              const providerColor = getProviderColor(idx, staff.color, providerColorMode);
              const avatarSrc = getAvatarUrl(staff.name, (staff as any).avatarUrl, providerColor);
              const isCustomPhoto = (staff as any).avatarUrl && (staff as any).avatarUrl.startsWith('http');

              return (
                <button
                  key={staff.id}
                  onClick={() => setSelectedStaffId(staff.id)}
                  className={`h-7 px-2.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 flex-shrink-0 ${
                    isSelected
                      ? 'bg-black text-white dark:bg-white dark:text-black shadow-sm'
                      : 'bg-black/5 dark:bg-white/10 text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  <img
                    src={avatarSrc}
                    alt={staff.name}
                    className={`w-5 h-5 rounded-full object-cover flex-shrink-0 ${
                      isCustomPhoto ? 'border-2' : ''
                    }`}
                    style={isCustomPhoto ? { borderColor: providerColor } : undefined}
                  />
                  <span>{staff.name.split(' ')[0]}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
