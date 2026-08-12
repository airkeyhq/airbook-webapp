'use client';

import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useAirBookStore, Appointment } from '@/lib/store';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { format, addDays, startOfWeek, isSameDay, parseISO } from 'date-fns';
import { Clock24Regular, Add24Filled, Person24Regular, Money24Regular, CheckmarkCircle24Regular } from '@fluentui/react-icons';

const HOURS = Array.from({ length: 24 }, (_, i) => i); // 0:00 to 23:00

/* Amie & Apple Calendar style high-contrast pastel mapping */
function getPastelColor(hex: string) {
  const map: Record<string, { bg: string; border: string; text: string; bar: string; badgeBg: string }> = {
    '#007AFF': {
      bg: 'bg-blue-50 dark:bg-blue-950/60',
      border: 'border-blue-200/90 dark:border-blue-800/60',
      text: 'text-blue-950 dark:text-blue-100',
      bar: 'bg-blue-500',
      badgeBg: 'bg-blue-100/80 dark:bg-blue-900/40 text-blue-900 dark:text-blue-200',
    },
    '#34C759': {
      bg: 'bg-emerald-50 dark:bg-emerald-950/60',
      border: 'border-emerald-200/90 dark:border-emerald-800/60',
      text: 'text-emerald-950 dark:text-emerald-100',
      bar: 'bg-emerald-500',
      badgeBg: 'bg-emerald-100/80 dark:bg-emerald-900/40 text-emerald-900 dark:text-emerald-200',
    },
    '#FF9500': {
      bg: 'bg-amber-50 dark:bg-amber-950/60',
      border: 'border-amber-200/90 dark:border-amber-800/60',
      text: 'text-amber-950 dark:text-amber-100',
      bar: 'bg-amber-500',
      badgeBg: 'bg-amber-100/80 dark:bg-amber-900/40 text-amber-900 dark:text-amber-200',
    },
    '#AF52DE': {
      bg: 'bg-purple-50 dark:bg-purple-950/60',
      border: 'border-purple-200/90 dark:border-purple-800/60',
      text: 'text-purple-950 dark:text-purple-100',
      bar: 'bg-purple-500',
      badgeBg: 'bg-purple-100/80 dark:bg-purple-900/40 text-purple-900 dark:text-purple-200',
    },
    '#FF2D55': {
      bg: 'bg-rose-50 dark:bg-rose-950/60',
      border: 'border-rose-200/90 dark:border-rose-800/60',
      text: 'text-rose-950 dark:text-rose-100',
      bar: 'bg-rose-500',
      badgeBg: 'bg-rose-100/80 dark:bg-rose-900/40 text-rose-900 dark:text-rose-200',
    },
  };
  return map[hex] || map['#007AFF'];
}

interface TimeGridProps {
  onSelectAppointment?: (apt: Appointment) => void;
}

export const TimeGrid: React.FC<TimeGridProps> = ({ onSelectAppointment }) => {
  const { appointments, selectedDateStr, viewMode, setViewMode, openBookingDrawer, setSelectedDateStr, setAppointments } = useAirBookStore();
  const { t } = useTranslation();
  
  const [now, setNow] = React.useState<Date | null>(null);

  React.useEffect(() => {
    setNow(new Date());
    const interval = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(interval);
  }, []);

  const nowOffsetPx = now ? (now.getHours() + now.getMinutes() / 60) * 80 : null;
  const todayStr = format(new Date(), 'yyyy-MM-dd');
  
  const selectedDate = new Date(selectedDateStr + 'T00:00:00');
  
  // Calculate days to render
  const daysToRender = React.useMemo(() => {
    if (viewMode === 'day') return [selectedDate];
    const start = startOfWeek(selectedDate, { weekStartsOn: 1 });
    return Array.from({ length: 7 }, (_, i) => addDays(start, i));
  }, [viewMode, selectedDateStr]);

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Fetch real appointments from Neon DB when selected date changes
  useEffect(() => {
    async function loadDbAppointments() {
      try {
        const res = await fetch(`/api/appointments?dateStr=${selectedDateStr}`);
        const data = await res.json();
        if (data.success && Array.isArray(data.appointments) && data.appointments.length > 0) {
          const mapped: Appointment[] = data.appointments.map((a: any) => ({
            id: a.id,
            clientName: a.client?.name || 'Client',
            serviceId: a.service?.id || 'srv-1',
            serviceName: a.service?.name || 'Service',
            staffId: a.staff?.id || 'stf-1',
            staffName: a.staff?.name || 'Staff Specialist',
            dateStr: a.dateStr,
            startTime: a.startTime,
            durationMinutes: a.durationMinutes,
            price: (a.priceCents || 0) / 100,
            color: a.service?.colorTag || '#007AFF',
            status: a.status as any,
            notes: a.notes,
          }));

          // Merge DB appointments with existing state (avoiding duplicates)
          const currentApts = useAirBookStore.getState().appointments;
          const merged = [...currentApts];
          for (const dbApt of mapped) {
            if (!merged.some((existing) => existing.id === dbApt.id)) {
              merged.push(dbApt);
            }
          }
          setAppointments(merged);
        }
      } catch (err) {
        console.warn('DB appointments load fallback:', err);
      }
    }
    loadDbAppointments();
  }, [selectedDateStr, setAppointments]);

  // Auto-switch to single day view on narrow mobile & tablet screens
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768 && viewMode === 'week') {
        setViewMode('day');
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [viewMode, setViewMode]);

  // Auto-scroll to current time on mount
  useEffect(() => {
    if (scrollContainerRef.current) {
      const currentHour = new Date().getHours();
      const offset = currentHour * 80;
      scrollContainerRef.current.scrollTop = Math.max(0, offset - 100);
    }
  }, []);

  return (
    <div className="flex-1 w-full bg-[var(--grid-bg)] relative flex flex-col overflow-hidden">
      {/* Scrollable Container (Vertical Only, No Horizontal Scroll) */}
      <div ref={scrollContainerRef} className="flex-1 overflow-y-auto overflow-x-hidden hide-scrollbar">
        
        {/* STICKY HEADER ROW (Corner + Day Headers) */}
        {appointments.length === 0 && (
          <div className="bg-blue-500/10 border-b border-blue-500/20 px-4 py-2 flex items-center justify-between z-[55] relative text-xs">
            <span className="font-semibold text-blue-600 dark:text-blue-400">
              🗓️ No appointments scheduled in database yet. Click any slot to add a booking, or load sample demo data.
            </span>
            <button
              onClick={useAirBookStore.getState().loadDemoData}
              className="px-3 py-1 rounded-full bg-blue-500 text-white font-bold text-[11px] hover:bg-blue-600 transition-colors shadow-sm"
            >
              ⚡ Load Sample Demo Data
            </button>
          </div>
        )}

        {viewMode === 'week' && (
          <div className="sticky top-0 z-50 flex w-full bg-[var(--bg-primary)] border-b border-[var(--border-subtle)] shadow-sm">
            {/* Corner Cell (Sticky Left inside Sticky Top) */}
            <div className="sticky left-0 w-14 sm:w-16 flex-shrink-0 z-[60] bg-[var(--bg-primary)] border-r border-[var(--border-subtle)]" />
            
            {/* Day Headers (7 Columns Responsively Filling Viewport) */}
            <div className="flex flex-1 min-w-0">
              {daysToRender.map((day) => {
                const dayStr = format(day, 'yyyy-MM-dd');
                const isToday = dayStr === todayStr;
                
                return (
                  <div 
                    key={`header-${dayStr}`}
                    onClick={() => setSelectedDateStr(dayStr)}
                    className={`flex-1 min-w-0 h-16 flex flex-col items-center justify-center cursor-pointer transition-colors border-r border-[var(--border-subtle)] ${
                      isToday ? 'bg-black/5 dark:bg-white/10' : 'bg-[var(--bg-primary)] hover:bg-black/5 dark:hover:bg-white/5'
                    }`}
                  >
                    <span className={`text-[10px] font-bold uppercase tracking-wider truncate max-w-full px-1 ${isToday ? 'text-[var(--text-primary)]' : 'text-[var(--text-secondary)]'}`}>
                      {t(format(day, 'EEE').toLowerCase() as any)}
                    </span>
                    <div className={`mt-0.5 w-7 h-7 flex items-center justify-center rounded-full text-sm font-black font-mono ${
                      isToday ? 'bg-[#FF3B30] text-white shadow-sm' : 'text-[var(--text-primary)]'
                    }`}>
                      {format(day, 'd')}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* GRID BODY ROW (Time Axis + Columns) */}
        <div className="flex w-full relative">
          
          {/* Time Axis (Sticky Left) */}
          <div className="sticky left-0 w-14 sm:w-16 flex-shrink-0 z-40 bg-[var(--grid-bg)] border-r border-[var(--border-subtle)]">
            {/* Current Time Dot */}
            {nowOffsetPx !== null && (
              <div 
                className="absolute right-0 z-50 flex items-center justify-center translate-x-[4px] -translate-y-1/2 opacity-90 pointer-events-none"
                style={{ top: `${nowOffsetPx}px` }}
              >
                <span className="absolute w-3.5 h-3.5 rounded-full bg-[#FF3B30]/40 animate-ping" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#FF3B30] shadow-sm z-10" />
              </div>
            )}

            {/* Time Labels */}
            {HOURS.map((hour) => {
              const timeLabel = hour === 0 ? '12 AM' : hour > 12 ? `${hour - 12} PM` : hour === 12 ? '12 PM' : `${hour} AM`;
              return (
                <div key={`time-${hour}`} className="h-20 relative border-b border-transparent">
                  <span className="absolute -top-2.5 right-2 sm:right-3 text-[10px] sm:text-[11px] font-mono font-bold text-[var(--text-muted)] select-none">
                    {timeLabel}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Day Columns (7 Columns Responsively Filling Viewport) */}
          <div className="flex flex-1 min-w-0 relative">
            {daysToRender.map((day) => {
              const dayStr = format(day, 'yyyy-MM-dd');
              const dayApts = appointments.filter((a) => a.dateStr === dayStr);
              const isSelected = dayStr === selectedDateStr;
              const isToday = dayStr === todayStr;

              return (
                <div
                  key={`col-${dayStr}`}
                  className={`flex-1 min-w-0 relative border-r border-[var(--border-subtle)] transition-colors ${
                    isSelected && viewMode === 'week' ? 'bg-black/[0.02] dark:bg-white/[0.02]' : ''
                  }`}
                >
                  {/* Current Time Line (ONLY on Today Column) */}
                  {isToday && nowOffsetPx !== null && (
                    <div 
                      className="absolute left-0 right-0 z-30 -translate-y-1/2 pointer-events-none"
                      style={{ top: `${nowOffsetPx}px` }}
                    >
                      <div className="h-[2px] w-full bg-[#FF3B30] shadow-sm" />
                    </div>
                  )}

                  {/* Grid Lines */}
                  <div className="relative w-full">
                    {HOURS.map((hour) => {
                      const slotStr = `${hour.toString().padStart(2, '0')}:00`;
                      return (
                        <div
                          key={`${dayStr}-${hour}`}
                          onClick={() => openBookingDrawer(slotStr)}
                          className="group h-20 w-full border-b border-[var(--border-subtle)] relative cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 transition-colors flex items-center justify-center"
                        >
                          <span className="opacity-0 group-hover:opacity-100 transition-opacity absolute px-2 py-1 rounded-md bg-black/80 text-white text-[10px] font-bold flex items-center gap-1 shadow-sm z-20">
                            <Add24Filled className="w-3 h-3" /> New
                          </span>
                        </div>
                      );
                    })}

                    {/* Appointments */}
                    {dayApts.map((apt) => {
                      const hourNum = parseInt(apt.startTime.split(':')[0], 10);
                      const minuteNum = parseInt(apt.startTime.split(':')[1], 10);
                      
                      const topOffset = (hourNum + (minuteNum / 60)) * 80;
                      const height = (apt.durationMinutes / 60) * 80;
                      const styleClass = getPastelColor(apt.color || '#007AFF');

                      return (
                        <motion.div
                          key={apt.id}
                          initial={{ scale: 0.95, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          whileHover={{ scale: 1.02, zIndex: 30 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectAppointment?.(apt);
                          }}
                          style={{
                            top: `${topOffset + 2}px`,
                            height: `${Math.max(height - 4, 30)}px`,
                          }}
                          className={`absolute left-1 right-2 sm:right-3 pl-3.5 pr-2.5 py-2 rounded-2xl border ${styleClass.bg} ${styleClass.border} ${styleClass.text} shadow-sm z-10 flex flex-col overflow-hidden backdrop-blur-sm cursor-pointer`}
                        >
                          {/* Left Accent Bar */}
                          <div className={`absolute left-0 top-2 bottom-2 w-1 rounded-r-full ${styleClass.bar}`} />

                          <div className="flex items-start justify-between gap-1">
                            <h4 className="text-[11px] font-black tracking-tight leading-tight truncate">{apt.clientName}</h4>
                          </div>
                          {height > 50 && (
                            <div className="mt-0.5 flex-1">
                              <p className="text-[10px] font-bold opacity-90 leading-snug truncate">{apt.serviceName}</p>
                              <p className="text-[9px] font-mono font-extrabold opacity-75 mt-0.5">{apt.startTime} ({apt.durationMinutes}m)</p>
                            </div>
                          )}
                          {height > 70 && (
                            <div className="mt-auto pt-1 flex items-center justify-between">
                              <span className="text-[10px] font-black">${apt.price}</span>
                              <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full ${styleClass.badgeBg}`}>
                                {apt.staffName.split(' ')[0]}
                              </span>
                            </div>
                          )}
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
