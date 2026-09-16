'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { useTranslation } from '@/lib/i18n/useTranslation';
import {
  VENTURE_STAGES,
  VENTURE_TASKS,
  VentureTask,
  TaskStatus,
  TaskDiscipline,
  VerificationStatus,
} from './data';
import {
  DocumentBulletList24Regular,
  CheckmarkCircle24Filled,
  Clock24Regular,
  Dismiss24Filled,
  Sparkle24Regular,
  Tag24Regular,
  Search24Regular,
  ArrowRight24Filled,
  ArrowDownload24Filled,
  ArrowReset24Filled,
  Checkmark24Regular,
  Open24Filled,
  Edit24Regular,
  ChevronDown24Regular,
  ChevronRight24Regular,
  ShieldCheckmark24Regular,
  Code24Regular,
  Document24Regular,
} from '@fluentui/react-icons';

const LOCAL_STORAGE_KEY = 'airbook_100tasks_progress_v2';
const LOCAL_STORAGE_NOTES_KEY = 'airbook_100tasks_notes_v2';

// Dynamic verified baseline from actual repository implementation
const DEFAULT_TASK_STATUSES: Record<number, TaskStatus> = VENTURE_TASKS.reduce(
  (acc, task) => {
    acc[task.id] = task.initialStatus;
    return acc;
  },
  {} as Record<number, TaskStatus>
);

export default function Venture100TasksPage() {
  const { t } = useTranslation();

  const [taskStatuses, setTaskStatuses] = useState<Record<number, TaskStatus>>(DEFAULT_TASK_STATUSES);
  const [taskNotes, setTaskNotes] = useState<Record<number, string>>({});
  const [selectedStageId, setSelectedStageId] = useState<number | 'all'>('all');
  const [selectedDiscipline, setSelectedDiscipline] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedVerification, setSelectedVerification] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeTask, setActiveTask] = useState<VentureTask | null>(null);
  const [expandedStages, setExpandedStages] = useState<Record<number, boolean>>({
    1: true,
    2: true,
    3: true,
    4: true,
    5: true,
  });

  // Load persisted progress from localStorage
  useEffect(() => {
    try {
      const savedStatuses = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (savedStatuses) {
        setTaskStatuses(JSON.parse(savedStatuses));
      }
      const savedNotes = localStorage.getItem(LOCAL_STORAGE_NOTES_KEY);
      if (savedNotes) {
        setTaskNotes(JSON.parse(savedNotes));
      }
    } catch {
      // Ignore storage read issues
    }
  }, []);

  // Persist task statuses
  const updateTaskStatus = (taskId: number, status: TaskStatus) => {
    const updated = { ...taskStatuses, [taskId]: status };
    setTaskStatuses(updated);
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // Ignore storage write issues
    }
  };

  // Persist task notes
  const updateTaskNote = (taskId: number, note: string) => {
    const updated = { ...taskNotes, [taskId]: note };
    setTaskNotes(updated);
    try {
      localStorage.setItem(LOCAL_STORAGE_NOTES_KEY, JSON.stringify(updated));
    } catch {
      // Ignore storage write issues
    }
  };

  // Reset to default verified baseline
  const handleReset = () => {
    if (window.confirm(t('tasksResetConfirm'))) {
      setTaskStatuses(DEFAULT_TASK_STATUSES);
      setTaskNotes({});
      try {
        localStorage.removeItem(LOCAL_STORAGE_KEY);
        localStorage.removeItem(LOCAL_STORAGE_NOTES_KEY);
      } catch {
        // Ignore
      }
    }
  };

  // Export progress summary as JSON
  const handleExport = () => {
    const exportData = {
      exportDate: new Date().toISOString(),
      framework: '100tasks Venture Building Framework',
      venture: 'AirBook Web Application',
      summary: {
        completed: Object.values(taskStatuses).filter((s) => s === 'completed').length,
        inProgress: Object.values(taskStatuses).filter((s) => s === 'in_progress').length,
        blocked: Object.values(taskStatuses).filter((s) => s === 'blocked').length,
        notStarted: Object.values(taskStatuses).filter((s) => s === 'not_started').length,
      },
      tasks: VENTURE_TASKS.map((task) => ({
        id: task.id,
        stage: task.stageId,
        title: task.title,
        discipline: task.discipline,
        status: taskStatuses[task.id] || 'not_started',
        verificationStatus: task.verificationStatus,
        exactImplementation: task.exactImplementation || 'N/A',
        deliverables: task.deliverableItems,
        notes: taskNotes[task.id] || '',
      })),
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `airbook-100tasks-progress-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Aggregate Metrics
  const stats = useMemo(() => {
    const total = 100;
    let completed = 0;
    let inProgress = 0;
    let blocked = 0;
    let notStarted = 0;
    let codebaseVerified = 0;

    VENTURE_TASKS.forEach((t) => {
      const st = taskStatuses[t.id] || 'not_started';
      if (st === 'completed') completed++;
      else if (st === 'in_progress') inProgress++;
      else if (st === 'blocked') blocked++;
      else notStarted++;

      if (t.verificationStatus === 'verified_codebase') {
        codebaseVerified++;
      }
    });

    const percent = Math.round((completed / total) * 100);

    const stageBreakdown = VENTURE_STAGES.map((st) => {
      const stageTasks = VENTURE_TASKS.filter((t) => t.stageId === st.id);
      const stageCompleted = stageTasks.filter(
        (t) => (taskStatuses[t.id] || 'not_started') === 'completed'
      ).length;
      return {
        ...st,
        completed: stageCompleted,
        percent: Math.round((stageCompleted / stageTasks.length) * 100),
      };
    });

    return { total, completed, inProgress, blocked, notStarted, codebaseVerified, percent, stageBreakdown };
  }, [taskStatuses]);

  // Unique Disciplines
  const disciplines: TaskDiscipline[] = useMemo(() => {
    const set = new Set<TaskDiscipline>();
    VENTURE_TASKS.forEach((t) => set.add(t.discipline));
    return Array.from(set);
  }, []);

  // Filtered Tasks
  const filteredTasks = useMemo(() => {
    return VENTURE_TASKS.filter((task) => {
      // Stage filter
      if (selectedStageId !== 'all' && task.stageId !== selectedStageId) {
        return false;
      }
      // Discipline filter
      if (selectedDiscipline !== 'all' && task.discipline !== selectedDiscipline) {
        return false;
      }
      // Status filter
      const currentStatus = taskStatuses[task.id] || 'not_started';
      if (selectedStatus !== 'all' && currentStatus !== selectedStatus) {
        return false;
      }
      // Verification filter
      if (selectedVerification !== 'all' && task.verificationStatus !== selectedVerification) {
        return false;
      }
      // Search query
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase();
        const matchesTitle = task.title.toLowerCase().includes(query);
        const matchesSummary = task.summary.toLowerCase().includes(query);
        const matchesDiscipline = task.discipline.toLowerCase().includes(query);
        const matchesDeliverables = task.deliverables.some((d) =>
          d.toLowerCase().includes(query)
        );
        const matchesImplementation = task.exactImplementation?.toLowerCase().includes(query);
        return matchesTitle || matchesSummary || matchesDiscipline || matchesDeliverables || matchesImplementation;
      }
      return true;
    });
  }, [selectedStageId, selectedDiscipline, selectedStatus, selectedVerification, searchQuery, taskStatuses]);

  const toggleStageExpand = (stageId: number) => {
    setExpandedStages((prev) => ({ ...prev, [stageId]: !prev[stageId] }));
  };

  const renderVerificationBadge = (vStatus: VerificationStatus) => {
    switch (vStatus) {
      case 'verified_codebase':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 whitespace-nowrap">
            <ShieldCheckmark24Regular className="w-3 h-3" />
            <span>{t('tasksVerifiedInCodebase')}</span>
          </span>
        );
      case 'pending_founder_action':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 whitespace-nowrap">
            <Clock24Regular className="w-3 h-3" />
            <span>{t('tasksPendingFounderAction')}</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 whitespace-nowrap">
            <Clock24Regular className="w-3 h-3" />
            <span>In Pipeline</span>
          </span>
        );
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-8">
      {/* Hero Header & Executive Progress Summary */}
      <div className="p-6 sm:p-10 rounded-3xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] relative overflow-hidden shadow-xs space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-bold text-blue-600 dark:text-blue-400">
              <DocumentBulletList24Regular className="w-3.5 h-3.5" />
              <span>Venture Builder Methodology · Evidence-Verified</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-[var(--text-primary)]">
              {t('tasksHubTitle')}
            </h1>

            <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
              {t('tasksHubSubtitle')}
            </p>
          </div>

          {/* Quick Action Controls */}
          <div className="flex flex-wrap items-center gap-2.5 flex-shrink-0">
            <button
              onClick={handleExport}
              className="btn-secondary h-10 px-4 rounded-2xl text-xs font-bold flex items-center gap-2"
            >
              <ArrowDownload24Filled className="w-4 h-4" />
              <span>{t('tasksExportSummary')}</span>
            </button>
            <button
              onClick={handleReset}
              className="btn-tertiary h-10 px-3.5 rounded-2xl text-xs font-bold flex items-center gap-1.5 text-[var(--text-muted)] hover:text-rose-500"
              title={t('tasksResetProgress')}
            >
              <ArrowReset24Filled className="w-3.5 h-3.5" />
              <span>{t('tasksResetProgress')}</span>
            </button>
          </div>
        </div>

        {/* Global Progress Gauge Ribbon */}
        <div className="space-y-3 pt-4 border-t border-[var(--border-subtle)] relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-[var(--text-primary)]">
                {t('tasksTotalProgress')}
              </span>
              <span className="px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-600 dark:text-blue-400 font-mono font-bold text-[11px]">
                {stats.percent}% ({stats.completed}/100 Verified Complete)
              </span>
            </div>
            <div className="flex items-center gap-3 text-[11px] text-[var(--text-secondary)] font-medium">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>{stats.completed} {t('tasksStatusCompleted')}</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-blue-500" />
                <span>{stats.inProgress} {t('tasksStatusInProgress')}</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                <span>{stats.notStarted} Pending Action</span>
              </span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-3 rounded-full bg-[var(--bg-secondary)] border border-[var(--border-subtle)] overflow-hidden flex">
            <div
              className="h-full bg-emerald-500 transition-all duration-300"
              style={{ width: `${(stats.completed / stats.total) * 100}%` }}
            />
            <div
              className="h-full bg-blue-500 transition-all duration-300"
              style={{ width: `${(stats.inProgress / stats.total) * 100}%` }}
            />
            <div
              className="h-full bg-rose-500 transition-all duration-300"
              style={{ width: `${(stats.blocked / stats.total) * 100}%` }}
            />
          </div>
        </div>

        {/* 5-Stage Breakdown Grid Ribbon */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-2 relative z-10">
          {stats.stageBreakdown.map((st) => {
            const isSelected = selectedStageId === st.id;
            return (
              <button
                key={st.id}
                onClick={() => setSelectedStageId(isSelected ? 'all' : st.id)}
                className={`p-3.5 rounded-2xl border text-left transition-all duration-150 flex flex-col justify-between space-y-2.5 ${
                  isSelected
                    ? 'bg-blue-500/10 border-blue-500/40 shadow-xs'
                    : 'bg-[var(--bg-secondary)] border-[var(--border-subtle)] hover:border-blue-500/30'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-black uppercase tracking-wider text-[var(--text-muted)]">
                    Stage {st.number}
                  </span>
                  <span className="text-[11px] font-mono font-black text-[var(--text-primary)]">
                    {st.completed}/{st.taskCount}
                  </span>
                </div>
                <div>
                  <h4 className="text-xs font-black text-[var(--text-primary)] leading-tight">
                    {st.name}
                  </h4>
                  <p className="text-[10px] text-[var(--text-muted)]">{st.range}</p>
                </div>
                <div className="w-full h-1.5 rounded-full bg-black/10 dark:bg-white/10 overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                    style={{ width: `${st.percent}%` }}
                  />
                </div>
              </button>
            );
          })}
        </div>

        {/* Ambient Glow */}
        <div className="absolute right-0 top-0 w-96 h-96 bg-gradient-to-bl from-blue-500/10 via-indigo-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Filter & Search Bar */}
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          {/* Search Input */}
          <div className="md:col-span-5 relative">
            <Search24Regular className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)] pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('tasksSearchPlaceholder')}
              className="w-full h-10 pl-10 pr-4 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          {/* Discipline Filter */}
          <div className="md:col-span-3">
            <select
              value={selectedDiscipline}
              onChange={(e) => setSelectedDiscipline(e.target.value)}
              aria-label={t('tasksDisciplineLabel')}
              className="w-full h-10 px-3.5 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-xs font-bold text-[var(--text-primary)] focus:outline-none focus:border-blue-500 transition-colors cursor-pointer"
            >
              <option value="all">{t('tasksFilterAllDisciplines')}</option>
              {disciplines.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="md:col-span-2">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              aria-label={t('tasksStatusLabel')}
              className="w-full h-10 px-3.5 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-xs font-bold text-[var(--text-primary)] focus:outline-none focus:border-blue-500 transition-colors cursor-pointer"
            >
              <option value="all">{t('tasksAllTasksFilter', { count: VENTURE_TASKS.length })}</option>
              <option value="completed">{t('tasksStatusCompleted')}</option>
              <option value="in_progress">{t('tasksStatusInProgress')}</option>
              <option value="blocked">{t('tasksStatusBlocked')}</option>
              <option value="not_started">{t('tasksStatusNotStarted')}</option>
            </select>
          </div>

          {/* Verification Status Filter */}
          <div className="md:col-span-2">
            <select
              value={selectedVerification}
              onChange={(e) => setSelectedVerification(e.target.value)}
              aria-label={t('tasksVerificationStatus')}
              className="w-full h-10 px-3.5 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-xs font-bold text-[var(--text-primary)] focus:outline-none focus:border-blue-500 transition-colors cursor-pointer"
            >
              <option value="all">All Verification ({VENTURE_TASKS.length})</option>
              <option value="verified_codebase">Verified in Codebase</option>
              <option value="pending_founder_action">Pending Founder Action</option>
              <option value="in_progress_pipeline">In Pipeline</option>
            </select>
          </div>
        </div>

        {/* Stage Filter Chips (Quick Switcher) */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          <button
            onClick={() => setSelectedStageId('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              selectedStageId === 'all'
                ? 'bg-blue-500 text-white shadow-xs'
                : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-subtle)]'
            }`}
          >
            {t('tasksFilterAllStages')}
          </button>
          {VENTURE_STAGES.map((st) => (
            <button
              key={st.id}
              onClick={() => setSelectedStageId(st.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedStageId === st.id
                  ? 'bg-blue-500 text-white shadow-xs'
                  : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-subtle)]'
              }`}
            >
              Stage {st.number}: {st.name}
            </button>
          ))}
        </div>
      </div>

      {/* Task List Grouped by Stage */}
      <div className="space-y-6">
        {VENTURE_STAGES.filter(
          (st) => selectedStageId === 'all' || selectedStageId === st.id
        ).map((stage) => {
          const stageTasks = filteredTasks.filter((t) => t.stageId === stage.id);
          if (stageTasks.length === 0) return null;

          const isExpanded = expandedStages[stage.id] ?? true;
          const stageCompleted = stageTasks.filter(
            (t) => (taskStatuses[t.id] || 'not_started') === 'completed'
          ).length;

          return (
            <div
              key={stage.id}
              className="rounded-3xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] overflow-hidden shadow-xs"
            >
              {/* Stage Collapsible Header */}
              <button
                onClick={() => toggleStageExpand(stage.id)}
                className="w-full p-5 sm:p-6 bg-[var(--bg-secondary)]/60 hover:bg-[var(--bg-secondary)] border-b border-[var(--border-subtle)] flex items-center justify-between gap-4 text-left transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2.5">
                    <span className="px-2.5 py-0.5 rounded-md bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 font-mono font-black text-[10px] uppercase">
                      Stage {stage.number}
                    </span>
                    <h3 className="text-base sm:text-lg font-black text-[var(--text-primary)]">
                      {stage.name}
                    </h3>
                  </div>
                  <p className="text-xs text-[var(--text-secondary)]">
                    {stage.subtitle} · {stage.range}
                  </p>
                </div>

                <div className="flex items-center gap-3 flex-shrink-0">
                  <span className="text-xs font-mono font-black text-[var(--text-secondary)]">
                    {stageCompleted}/{stageTasks.length} Done
                  </span>
                  {isExpanded ? (
                    <ChevronDown24Regular className="w-4 h-4 text-[var(--text-muted)]" />
                  ) : (
                    <ChevronRight24Regular className="w-4 h-4 text-[var(--text-muted)]" />
                  )}
                </div>
              </button>

              {/* Tasks Divided List */}
              {isExpanded && (
                <div className="divide-y divide-[var(--border-subtle)]">
                  {stageTasks.map((task) => {
                    const currentStatus = taskStatuses[task.id] || 'not_started';
                    const hasNotes = Boolean(taskNotes[task.id]);

                    return (
                      <div
                        key={task.id}
                        className="p-4 sm:p-5 hover:bg-[var(--bg-secondary)]/40 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer group"
                        onClick={() => setActiveTask(task)}
                      >
                        {/* Task Number & Title Details */}
                        <div className="flex items-start gap-3.5 flex-1 min-w-0">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              const nextStatus: TaskStatus =
                                currentStatus === 'completed'
                                  ? 'not_started'
                                  : currentStatus === 'not_started'
                                  ? 'in_progress'
                                  : 'completed';
                              updateTaskStatus(task.id, nextStatus);
                            }}
                            className={`w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0 transition-all ${
                              currentStatus === 'completed'
                                ? 'bg-emerald-500 text-white'
                                : currentStatus === 'in_progress'
                                ? 'bg-blue-500/20 text-blue-500 border border-blue-500/40'
                                : 'bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-[var(--text-muted)] hover:border-blue-500/40'
                            }`}
                            title="Click to advance status"
                          >
                            {currentStatus === 'completed' ? (
                              <Checkmark24Regular className="w-4 h-4" />
                            ) : (
                              <span className="text-[11px] font-mono font-bold">
                                {task.id}
                              </span>
                            )}
                          </button>

                          <div className="space-y-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <h4 className="text-sm font-black text-[var(--text-primary)] group-hover:text-blue-500 transition-colors">
                                {task.title}
                              </h4>
                              <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-black/5 dark:bg-white/5 text-[var(--text-secondary)] border border-[var(--border-subtle)]">
                                {task.discipline}
                              </span>
                              {renderVerificationBadge(task.verificationStatus)}
                              {hasNotes && (
                                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-amber-500/10 text-amber-600 dark:text-amber-400">
                                  <Edit24Regular className="w-3 h-3" />
                                  <span>Notes</span>
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                              {task.summary}
                            </p>
                          </div>
                        </div>

                        {/* Status Badge & Actions */}
                        <div
                          className="flex items-center gap-2.5 self-start md:self-center flex-shrink-0"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <select
                            value={currentStatus}
                            onChange={(e) =>
                              updateTaskStatus(task.id, e.target.value as TaskStatus)
                            }
                            aria-label={`Status for task ${task.id}`}
                            className="h-8 px-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-xs font-bold text-[var(--text-primary)] focus:outline-none focus:border-blue-500 cursor-pointer"
                          >
                            <option value="not_started">{t('tasksStatusNotStarted')}</option>
                            <option value="in_progress">{t('tasksStatusInProgress')}</option>
                            <option value="completed">{t('tasksStatusCompleted')}</option>
                            <option value="blocked">{t('tasksStatusBlocked')}</option>
                          </select>

                          {task.airbookModuleLink && (
                            <Link
                              href={task.airbookModuleLink.href}
                              className="btn-secondary h-8 px-2.5 rounded-xl text-[11px] font-bold flex items-center gap-1 text-blue-500"
                              title={task.airbookModuleLink.label}
                            >
                              <Open24Filled className="w-3 h-3" />
                              <span className="hidden sm:inline">
                                {task.airbookModuleLink.label}
                              </span>
                            </Link>
                          )}

                          <button
                            onClick={() => setActiveTask(task)}
                            className="btn-tertiary h-8 w-8 rounded-xl flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                          >
                            <ChevronRight24Regular className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Task Detail Slide-Over / Bottom-Sheet Drawer */}
      <AnimatePresence>
        {activeTask && (
          <div className="fixed inset-0 z-[250] flex items-end md:items-center justify-center">
            {/* Backdrop Blur */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveTask(null)}
              className="fixed inset-0 bg-black/60 backdrop-blur-md"
            />

            {/* Drawer Modal Panel */}
            <motion.div
              initial={{ y: '100%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '100%', opacity: 0 }}
              transition={{ type: 'spring', damping: 26, stiffness: 260 }}
              className="relative z-10 w-full md:max-w-2xl bg-[var(--bg-primary)] border-t md:border border-[var(--border-subtle)] rounded-t-[32px] md:rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              {/* Mobile Drag Handle */}
              <div className="w-12 h-1.5 rounded-full bg-black/20 dark:bg-white/20 mx-auto mt-3 md:hidden" />

              {/* Drawer Header */}
              <div className="p-5 sm:p-6 border-b border-[var(--border-subtle)] flex items-start justify-between gap-4">
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-md bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 font-mono font-black text-[10px] uppercase">
                      Task #{activeTask.id} · Stage {activeTask.stageId}
                    </span>
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-[var(--text-secondary)]">
                      {activeTask.discipline}
                    </span>
                    {renderVerificationBadge(activeTask.verificationStatus)}
                  </div>
                  <h3 className="text-lg sm:text-xl font-black tracking-tight text-[var(--text-primary)]">
                    {activeTask.title}
                  </h3>
                </div>

                <button
                  onClick={() => setActiveTask(null)}
                  className="btn-tertiary w-9 h-9 rounded-2xl flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-primary)] flex-shrink-0"
                >
                  <Dismiss24Filled className="w-4 h-4" />
                </button>
              </div>

              {/* Drawer Scrollable Body */}
              <div className="p-5 sm:p-6 space-y-6 overflow-y-auto no-scrollbar flex-1">
                {/* Summary Box */}
                <div className="p-4 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] space-y-1.5">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[var(--text-muted)]">
                    Objective & Scope
                  </span>
                  <p className="text-xs sm:text-sm text-[var(--text-primary)] leading-relaxed">
                    {activeTask.summary}
                  </p>
                </div>

                {/* Resolution & Verification Evidence Audit */}
                <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                      <ShieldCheckmark24Regular className="w-4 h-4" />
                      <span>{t('tasksResolutionAudit')}</span>
                    </h4>
                    {renderVerificationBadge(activeTask.verificationStatus)}
                  </div>

                  {activeTask.exactImplementation && (
                    <div className="space-y-1 pt-1">
                      <span className="text-[10px] font-mono font-bold uppercase text-[var(--text-muted)]">
                        {t('tasksExactImplementation')}
                      </span>
                      <p className="text-xs text-[var(--text-primary)] leading-relaxed font-medium">
                        {activeTask.exactImplementation}
                      </p>
                    </div>
                  )}
                </div>

                {/* Deliverables & Subtask Evidence Breakdown */}
                <div className="space-y-3">
                  <h4 className="text-xs font-black uppercase tracking-wider text-[var(--text-muted)] flex items-center gap-1.5">
                    <Tag24Regular className="w-3.5 h-3.5" />
                    <span>{t('tasksDeliverablesAnswers')}</span>
                  </h4>
                  <div className="space-y-2.5">
                    {activeTask.deliverableItems.map((item, idx) => (
                      <div
                        key={idx}
                        className="p-3.5 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] space-y-2"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            {item.status === 'completed' ? (
                              <CheckmarkCircle24Filled className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                            ) : item.status === 'in_progress' ? (
                              <Clock24Regular className="w-4 h-4 text-blue-500 flex-shrink-0" />
                            ) : (
                              <Document24Regular className="w-4 h-4 text-[var(--text-muted)] flex-shrink-0" />
                            )}
                            <span className="text-xs font-bold text-[var(--text-primary)]">
                              {item.name}
                            </span>
                          </div>

                          {item.fileRef && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                              <Code24Regular className="w-3 h-3" />
                              <span>{item.fileRef}</span>
                            </span>
                          )}
                        </div>

                        <p className="text-xs text-[var(--text-secondary)] leading-relaxed pl-6">
                          {item.answer}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Execution Advice */}
                {activeTask.tips && (
                  <div className="p-4 rounded-2xl bg-blue-500/5 border border-blue-500/20 space-y-1.5">
                    <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1.5">
                      <Sparkle24Regular className="w-3.5 h-3.5" />
                      <span>{t('tasksProTips')}</span>
                    </h4>
                    <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                      {activeTask.tips}
                    </p>
                  </div>
                )}

                {/* Recommended Stack & Tools */}
                {activeTask.recommendedTools && activeTask.recommendedTools.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-xs font-black uppercase tracking-wider text-[var(--text-muted)]">
                      {t('tasksRecommendedTools')}
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {activeTask.recommendedTools.map((tool) => (
                        <span
                          key={tool}
                          className="px-2.5 py-1 rounded-xl text-xs font-bold bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-[var(--text-primary)]"
                        >
                          {tool}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* AirBook Deep Link Shortcut */}
                {activeTask.airbookModuleLink && (
                  <div className="p-4 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] flex items-center justify-between gap-4">
                    <div className="space-y-0.5">
                      <span className="text-[10px] font-mono font-bold uppercase text-blue-500">
                        {t('tasksAirBookShortcut')}
                      </span>
                      <p className="text-xs font-bold text-[var(--text-primary)]">
                        {activeTask.airbookModuleLink.label}
                      </p>
                    </div>
                    <Link
                      href={activeTask.airbookModuleLink.href}
                      className="btn-primary h-9 px-3.5 rounded-xl text-xs font-bold flex items-center gap-1.5"
                    >
                      <span>Open</span>
                      <ArrowRight24Filled className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                )}

                {/* Execution Scratchpad Notes */}
                <div className="space-y-2">
                  <h4 className="text-xs font-black uppercase tracking-wider text-[var(--text-muted)] flex items-center gap-1.5">
                    <Edit24Regular className="w-3.5 h-3.5" />
                    <span>{t('tasksNotesTitle')}</span>
                  </h4>
                  <textarea
                    value={taskNotes[activeTask.id] || ''}
                    onChange={(e) => updateTaskNote(activeTask.id, e.target.value)}
                    placeholder={t('tasksNotesPlaceholder')}
                    rows={4}
                    className="w-full p-3 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>
              </div>

              {/* Drawer Flat Bottom Action Bar */}
              <div className="w-full border-t border-[var(--border-subtle)] bg-[var(--bg-primary)] p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <span className="text-xs font-bold text-[var(--text-secondary)]">Status:</span>
                  <select
                    value={taskStatuses[activeTask.id] || 'not_started'}
                    onChange={(e) =>
                      updateTaskStatus(activeTask.id, e.target.value as TaskStatus)
                    }
                    aria-label={`Update status for task ${activeTask.id}`}
                    className="h-9 px-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-xs font-bold text-[var(--text-primary)] focus:outline-none focus:border-blue-500 cursor-pointer"
                  >
                    <option value="not_started">{t('tasksStatusNotStarted')}</option>
                    <option value="in_progress">{t('tasksStatusInProgress')}</option>
                    <option value="completed">{t('tasksStatusCompleted')}</option>
                    <option value="blocked">{t('tasksStatusBlocked')}</option>
                  </select>
                </div>

                <button
                  onClick={() => {
                    const current = taskStatuses[activeTask.id] || 'not_started';
                    const next: TaskStatus =
                      current === 'completed' ? 'not_started' : 'completed';
                    updateTaskStatus(activeTask.id, next);
                  }}
                  className={`w-full sm:w-auto h-10 px-5 rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 transition-all ${
                    taskStatuses[activeTask.id] === 'completed'
                      ? 'btn-secondary text-[var(--text-secondary)]'
                      : 'btn-primary'
                  }`}
                >
                  <Checkmark24Regular className="w-4 h-4" />
                  <span>
                    {taskStatuses[activeTask.id] === 'completed'
                      ? 'Mark Incomplete'
                      : 'Mark Completed'}
                  </span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
