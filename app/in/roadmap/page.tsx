'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { useTranslation } from '@/lib/i18n/useTranslation';
import {
  ROADMAP_ISSUES,
  MILESTONE_EPICS,
  RoadmapIssue,
  IssueStatus,
  IssuePriority,
} from './data';
import {
  DocumentBulletList24Regular,
  Tag24Regular,
  Search24Regular,
  Dismiss24Filled,
  Sparkle24Regular,
  ArrowRight24Filled,
  CheckmarkCircle24Filled,
  Clock24Regular,
  Add24Filled,
  Book24Regular,
  Code24Regular,
  ArrowSync24Regular,
  Filter24Regular,
  Open24Filled,
  ShieldCheckmark24Regular,
  AppsListDetail24Regular,
  Grid24Regular,
  Checkmark24Regular,
} from '@fluentui/react-icons';

const LOCAL_STORAGE_ISSUES_KEY = 'airbook_roadmap_issues_v1';

export default function LinearRoadmapPage() {
  const { t } = useTranslation();

  const [issues, setIssues] = useState<RoadmapIssue[]>(ROADMAP_ISSUES);
  const [selectedMilestone, setSelectedMilestone] = useState<string>('all');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [viewMode, setViewMode] = useState<'board' | 'list'>('board');
  const [activeIssue, setActiveIssue] = useState<RoadmapIssue | null>(null);
  const [isGitHubSyncing, setIsGitHubSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState('Just now');

  // Load persisted issues from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_ISSUES_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Merge with any new ROADMAP_ISSUES keys
        const existingKeys = new Set(parsed.map((p: RoadmapIssue) => p.key));
        const newIssues = ROADMAP_ISSUES.filter((r) => !existingKeys.has(r.key));
        setIssues([...parsed, ...newIssues]);
      }
    } catch {
      // Ignore read errors
    }
  }, []);

  // Check URL query parameters for deep linking (?issue=AIR-XXX)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const targetKey = params.get('issue') || params.get('key') || params.get('id');
      if (targetKey) {
        const found = issues.find(
          (i) =>
            i.key.toLowerCase() === targetKey.toLowerCase() ||
            i.id.toLowerCase() === targetKey.toLowerCase()
        );
        if (found) {
          setActiveIssue(found);
          if (found.milestone) {
            setSelectedMilestone(found.milestone);
          }
        }
      }
    }
  }, [issues]);

  const saveIssues = (updated: RoadmapIssue[]) => {
    setIssues(updated);
    try {
      localStorage.setItem(LOCAL_STORAGE_ISSUES_KEY, JSON.stringify(updated));
    } catch {
      // Ignore write errors
    }
  };

  const handleUpdateStatus = (issueId: string, nextStatus: IssueStatus) => {
    const updated = issues.map((iss) =>
      iss.id === issueId ? { ...iss, status: nextStatus } : iss
    );
    saveIssues(updated);
    if (activeIssue && activeIssue.id === issueId) {
      setActiveIssue({ ...activeIssue, status: nextStatus });
    }
  };

  const handleToggleSubtask = (issueId: string, subtaskId: string) => {
    const updated = issues.map((iss) => {
      if (iss.id !== issueId) return iss;
      const updatedSubtasks = iss.subtasks.map((st) =>
        st.id === subtaskId ? { ...st, completed: !st.completed } : st
      );
      return { ...iss, subtasks: updatedSubtasks };
    });
    saveIssues(updated);
    if (activeIssue && activeIssue.id === issueId) {
      const activeUpdated = updated.find((i) => i.id === issueId);
      if (activeUpdated) setActiveIssue(activeUpdated);
    }
  };

  const handleGitHubSync = () => {
    setIsGitHubSyncing(true);
    setTimeout(() => {
      setIsGitHubSyncing(false);
      setLastSyncTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    }, 800);
  };

  // Filtered Issues
  const filteredIssues = useMemo(() => {
    return issues.filter((iss) => {
      if (selectedMilestone !== 'all' && iss.milestone !== selectedMilestone) {
        return false;
      }
      if (selectedPriority !== 'all' && iss.priority !== selectedPriority) {
        return false;
      }
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase();
        const matchesTitle = iss.title.toLowerCase().includes(query);
        const matchesKey = iss.key.toLowerCase().includes(query);
        const matchesDesc = iss.description.toLowerCase().includes(query);
        const matchesTags = iss.tags.some((t) => t.toLowerCase().includes(query));
        return matchesTitle || matchesKey || matchesDesc || matchesTags;
      }
      return true;
    });
  }, [issues, selectedMilestone, selectedPriority, searchQuery]);

  const columns: { id: IssueStatus; label: string; accent: string }[] = [
    { id: 'backlog', label: 'Backlog', accent: 'border-slate-500/20' },
    { id: 'todo', label: 'Todo', accent: 'border-blue-500/20' },
    { id: 'in_progress', label: 'In Progress', accent: 'border-amber-500/20' },
    { id: 'in_review', label: 'In Review', accent: 'border-purple-500/20' },
    { id: 'done', label: 'Done', accent: 'border-emerald-500/20' },
  ];

  const getPriorityBadge = (priority: IssuePriority) => {
    switch (priority) {
      case 'urgent':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
            Urgent
          </span>
        );
      case 'high':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
            High
          </span>
        );
      case 'medium':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
            Medium
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-black/5 dark:bg-white/5 text-[var(--text-muted)] border border-[var(--border-subtle)]">
            Low
          </span>
        );
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-8">
      {/* Linear Roadmap Header & GitHub Live Sync Banner */}
      <div className="p-6 sm:p-10 rounded-3xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] relative overflow-hidden shadow-xs space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-3 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-bold text-blue-600 dark:text-blue-400">
              <Sparkle24Regular className="w-3.5 h-3.5" />
              <span>Linear Engine · GitHub Repository Sync (airkeyhq/airbook-webapp)</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-[var(--text-primary)]">
              AirBook Engineering Roadmap & Issues
            </h1>

            <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
              Internal product backlog, sprint cycles, and architecture specifications synchronized directly with AirBook’s GitHub repository (<code className="px-1.5 py-0.5 rounded bg-[var(--bg-secondary)] border border-[var(--border-subtle)] font-mono text-[11px] text-blue-500">airkeyhq/airbook-webapp</code>).
            </p>
          </div>

          {/* GitHub Sync & Controls */}
          <div className="flex flex-wrap items-center gap-2.5 flex-shrink-0">
            <button
              onClick={handleGitHubSync}
              disabled={isGitHubSyncing}
              className="btn-secondary h-10 px-3.5 rounded-2xl text-xs font-bold flex items-center gap-2 text-[var(--text-secondary)]"
            >
              <ArrowSync24Regular className={`w-4 h-4 ${isGitHubSyncing ? 'animate-spin text-blue-500' : ''}`} />
              <span>{isGitHubSyncing ? 'Syncing GitHub…' : `GitHub Synced (${lastSyncTime})`}</span>
            </button>

            <Link
              href="/in/100tasks"
              className="btn-secondary h-10 px-4 rounded-2xl text-xs font-bold flex items-center gap-2"
            >
              <DocumentBulletList24Regular className="w-4 h-4 text-blue-500" />
              <span>100tasks Hub</span>
            </Link>
          </div>
        </div>

        {/* Milestone Epics Ribbon */}
        <div className="pt-4 border-t border-[var(--border-subtle)] space-y-3 relative z-10">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-black uppercase tracking-wider text-[var(--text-muted)] flex items-center gap-1.5">
              <Tag24Regular className="w-3.5 h-3.5 text-blue-500" />
              <span>Release Milestones & Epics</span>
            </h3>
            <span className="text-[11px] font-mono font-bold text-[var(--text-muted)]">
              Branch: <code className="text-[var(--text-primary)]">main</code>
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
            {MILESTONE_EPICS.map((epic) => {
              const isSelected = selectedMilestone === epic.version;
              return (
                <button
                  key={epic.id}
                  onClick={() => setSelectedMilestone(isSelected ? 'all' : epic.version)}
                  className={`p-3 rounded-2xl border text-left transition-all duration-150 flex flex-col justify-between space-y-2 ${
                    isSelected
                      ? 'bg-blue-500/10 border-blue-500/40 shadow-xs'
                      : 'bg-[var(--bg-secondary)] border-[var(--border-subtle)] hover:border-blue-500/30'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-black uppercase text-blue-500">
                      {epic.version}
                    </span>
                    <span className="text-[10px] font-mono font-bold text-[var(--text-muted)]">
                      {epic.progress}%
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-[var(--text-primary)] leading-tight">
                    {epic.name}
                  </h4>
                  <div className="w-full h-1 rounded-full bg-black/10 dark:bg-white/10 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        epic.progress === 100 ? 'bg-emerald-500' : 'bg-blue-500'
                      }`}
                      style={{ width: `${epic.progress}%` }}
                    />
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Ambient Glow */}
        <div className="absolute right-0 top-0 w-96 h-96 bg-gradient-to-bl from-blue-500/10 via-indigo-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Filter & View Switcher Bar */}
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          {/* Search Input */}
          <div className="md:col-span-6 relative">
            <Search24Regular className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)] pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search issues (e.g. AIR-101, Terminal, CNAME)..."
              className="w-full h-10 pl-10 pr-4 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          {/* Priority Filter */}
          <div className="md:col-span-3">
            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              aria-label="Filter by priority"
              className="w-full h-10 px-3.5 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-xs font-bold text-[var(--text-primary)] focus:outline-none focus:border-blue-500 cursor-pointer"
            >
              <option value="all">All Priorities</option>
              <option value="urgent">Urgent</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>

          {/* View Mode Toggle (Board vs List) */}
          <div className="md:col-span-3 flex items-center justify-end gap-1 p-1 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)]">
            <button
              onClick={() => setViewMode('board')}
              className={`flex-1 h-8 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                viewMode === 'board'
                  ? 'bg-[var(--bg-primary)] text-[var(--text-primary)] shadow-xs border border-[var(--border-subtle)]'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              <Grid24Regular className="w-3.5 h-3.5" />
              <span>Board</span>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`flex-1 h-8 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                viewMode === 'list'
                  ? 'bg-[var(--bg-primary)] text-[var(--text-primary)] shadow-xs border border-[var(--border-subtle)]'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              <AppsListDetail24Regular className="w-3.5 h-3.5" />
              <span>List</span>
            </button>
          </div>
        </div>

        {/* Quick Milestone Filter Chips */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          <button
            onClick={() => setSelectedMilestone('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              selectedMilestone === 'all'
                ? 'bg-blue-500 text-white shadow-xs'
                : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-subtle)]'
            }`}
          >
            All Issues ({issues.length})
          </button>
          {MILESTONE_EPICS.map((epic) => (
            <button
              key={epic.id}
              onClick={() => setSelectedMilestone(epic.version)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedMilestone === epic.version
                  ? 'bg-blue-500 text-white shadow-xs'
                  : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-subtle)]'
              }`}
            >
              {epic.version}: {epic.name}
            </button>
          ))}
        </div>
      </div>

      {/* Kanban Board View */}
      {viewMode === 'board' ? (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-start">
          {columns.map((col) => {
            const colIssues = filteredIssues.filter((iss) => iss.status === col.id);

            return (
              <div
                key={col.id}
                className="rounded-3xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] p-4 space-y-3.5 min-h-[400px] flex flex-col"
              >
                {/* Column Header */}
                <div className="flex items-center justify-between pb-2 border-b border-[var(--border-subtle)]">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black tracking-tight text-[var(--text-primary)]">
                      {col.label}
                    </span>
                    <span className="px-1.5 py-0.2 rounded-md text-[10px] font-mono font-bold bg-[var(--bg-secondary)] text-[var(--text-muted)] border border-[var(--border-subtle)]">
                      {colIssues.length}
                    </span>
                  </div>
                </div>

                {/* Issue Cards Stack */}
                <div className="space-y-3 flex-1">
                  {colIssues.map((issue) => (
                    <div
                      key={issue.id}
                      onClick={() => setActiveIssue(issue)}
                      className="group p-4 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] hover:border-blue-500/40 transition-all duration-150 space-y-3 cursor-pointer shadow-xs relative"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono font-bold text-blue-500">
                          {issue.key}
                        </span>
                        <div className="flex items-center gap-1.5">
                          {getPriorityBadge(issue.priority)}
                          <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-black/5 dark:bg-white/5 text-[var(--text-muted)] border border-[var(--border-subtle)]">
                            {issue.estimate} pts
                          </span>
                        </div>
                      </div>

                      <h4 className="text-xs font-black text-[var(--text-primary)] group-hover:text-blue-500 transition-colors leading-snug">
                        {issue.title}
                      </h4>

                      {/* Subtasks Count & GitHub Repo Spec Badge */}
                      <div className="pt-2 border-t border-[var(--border-subtle)] flex items-center justify-between text-[10px] text-[var(--text-muted)]">
                        <span className="flex items-center gap-1">
                          <Checkmark24Regular className="w-3 h-3" />
                          <span>
                            {issue.subtasks.filter((s) => s.completed).length}/{issue.subtasks.length}
                          </span>
                        </span>

                        {issue.githubSpec && (
                          <span className="inline-flex items-center gap-1 text-blue-500 font-mono font-bold text-[10px]">
                            <Code24Regular className="w-3 h-3" />
                            <span>{issue.githubSpec.branch || 'main'}</span>
                          </span>
                        )}
                      </div>
                    </div>
                  ))}

                  {colIssues.length === 0 && (
                    <div className="p-6 rounded-2xl border border-dashed border-[var(--border-subtle)] text-center text-xs text-[var(--text-muted)]">
                      No issues
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* List View */
        <div className="rounded-3xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] overflow-hidden shadow-xs divide-y divide-[var(--border-subtle)]">
          {filteredIssues.map((issue) => (
            <div
              key={issue.id}
              onClick={() => setActiveIssue(issue)}
              className="p-4 sm:p-5 hover:bg-[var(--bg-secondary)]/40 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer group"
            >
              <div className="flex items-start md:items-center gap-3 min-w-0 flex-1">
                <span className="text-xs font-mono font-bold text-blue-500 w-16 flex-shrink-0 pt-0.5 md:pt-0">
                  {issue.key}
                </span>

                <div className="space-y-0.5 min-w-0 flex-1">
                  <h4 className="text-sm font-black text-[var(--text-primary)] group-hover:text-blue-500 transition-colors leading-snug">
                    {issue.title}
                  </h4>
                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                    {issue.description}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 self-start md:self-center flex-shrink-0">
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-[var(--text-secondary)]">
                  {issue.milestone}
                </span>
                {getPriorityBadge(issue.priority)}
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-black/5 dark:bg-white/5 text-[var(--text-muted)] border border-[var(--border-subtle)] capitalize">
                  {issue.status.replace('_', ' ')}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Issue Detail Slide-Over Drawer with GitHub Panel */}
      <AnimatePresence>
        {activeIssue && (
          <div className="fixed inset-0 z-[250] flex items-end md:items-center justify-center">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveIssue(null)}
              className="fixed inset-0 bg-black/60 backdrop-blur-md"
            />

            {/* Modal Container */}
            <motion.div
              initial={{ y: '100%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '100%', opacity: 0 }}
              transition={{ type: 'spring', damping: 26, stiffness: 260 }}
              className="relative z-10 w-full md:max-w-2xl bg-[var(--bg-primary)] border-t md:border border-[var(--border-subtle)] rounded-t-[32px] md:rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              {/* Mobile Handle */}
              <div className="w-12 h-1.5 rounded-full bg-black/20 dark:bg-white/20 mx-auto mt-3 md:hidden" />

              {/* Header */}
              <div className="p-5 sm:p-6 border-b border-[var(--border-subtle)] flex items-start justify-between gap-4">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-blue-500">
                      {activeIssue.key}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-[var(--text-secondary)]">
                      {activeIssue.milestone}
                    </span>
                    {getPriorityBadge(activeIssue.priority)}
                  </div>
                  <h3 className="text-lg sm:text-xl font-black text-[var(--text-primary)]">
                    {activeIssue.title}
                  </h3>
                </div>

                <button
                  onClick={() => setActiveIssue(null)}
                  className="btn-tertiary w-9 h-9 rounded-2xl flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-primary)] flex-shrink-0"
                >
                  <Dismiss24Filled className="w-4 h-4" />
                </button>
              </div>

              {/* Body */}
              <div className="p-5 sm:p-6 space-y-6 overflow-y-auto no-scrollbar flex-1">
                {/* Description */}
                <div className="p-4 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] space-y-1.5">
                  <span className="text-[10px] font-mono font-bold uppercase text-[var(--text-muted)]">
                    Specification & Requirement
                  </span>
                  <p className="text-xs sm:text-sm text-[var(--text-primary)] leading-relaxed">
                    {activeIssue.description}
                  </p>
                </div>

                {/* GitHub Code & Architecture Spec Connection Card */}
                {activeIssue.githubSpec && (
                  <div className="p-4 rounded-2xl bg-blue-500/5 border border-blue-500/20 space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-black text-blue-600 dark:text-blue-400 flex items-center gap-1.5">
                        <Code24Regular className="w-4 h-4" />
                        <span>GitHub Code & Architecture Spec</span>
                      </h4>
                      <span className="inline-flex items-center gap-1.5 text-[10px] font-mono font-bold text-emerald-500">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span>GitHub Synced</span>
                      </span>
                    </div>

                    <div className="p-3.5 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] space-y-2">
                      <div className="flex items-start justify-between gap-3">
                        <p className="text-xs font-bold text-[var(--text-primary)]">
                          {activeIssue.githubSpec.title}
                        </p>
                        <a
                          href={activeIssue.githubSpec.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-tertiary px-2 py-1 rounded-lg text-[10px] font-bold text-blue-500 hover:text-blue-600 flex items-center gap-1 flex-shrink-0"
                        >
                          <span>Open</span>
                          <Open24Filled className="w-3 h-3" />
                        </a>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 text-[10px] font-mono text-[var(--text-muted)]">
                        <span className="px-2 py-0.5 rounded bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-[var(--text-primary)] font-bold">
                          airkeyhq/airbook-webapp
                        </span>
                        {activeIssue.githubSpec.branch && (
                          <span className="px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-500 border border-blue-500/20">
                            {activeIssue.githubSpec.branch}
                          </span>
                        )}
                        {activeIssue.githubSpec.commitSha && (
                          <span className="px-1.5 py-0.5 rounded bg-black/5 dark:bg-white/5 border border-[var(--border-subtle)]">
                            sha:{activeIssue.githubSpec.commitSha}
                          </span>
                        )}
                      </div>

                      <div className="pt-1 flex items-center gap-1.5 text-[11px] font-mono text-[var(--text-secondary)]">
                        <Code24Regular className="w-3 h-3 text-blue-500 flex-shrink-0" />
                        <span className="truncate">{activeIssue.githubSpec.repoPath}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Subtask Checklist */}
                <div className="space-y-3">
                  <h4 className="text-xs font-black uppercase tracking-wider text-[var(--text-muted)] flex items-center gap-1.5">
                    <CheckmarkCircle24Filled className="w-3.5 h-3.5 text-blue-500" />
                    <span>Implementation Subtasks</span>
                  </h4>
                  <div className="space-y-2">
                    {activeIssue.subtasks.map((st) => (
                      <div
                        key={st.id}
                        onClick={() => handleToggleSubtask(activeIssue.id, st.id)}
                        className="p-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] hover:border-blue-500/30 flex items-center gap-2.5 text-xs text-[var(--text-primary)] cursor-pointer transition-colors"
                      >
                        <button
                          type="button"
                          className={`w-5 h-5 rounded-md flex items-center justify-center transition-all ${
                            st.completed
                              ? 'bg-emerald-500 text-white'
                              : 'border border-[var(--border-subtle)] bg-[var(--bg-primary)]'
                          }`}
                        >
                          {st.completed && <Checkmark24Regular className="w-3.5 h-3.5" />}
                        </button>
                        <span className={st.completed ? 'line-through text-[var(--text-muted)]' : 'font-medium'}>
                          {st.title}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Metadata Tags */}
                <div className="space-y-2">
                  <span className="text-[10px] font-mono font-bold uppercase text-[var(--text-muted)]">
                    Tags & Components
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {activeIssue.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2.5 py-1 rounded-xl text-xs font-bold bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-[var(--text-primary)]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Drawer Bottom Bar */}
              <div className="w-full border-t border-[var(--border-subtle)] bg-[var(--bg-primary)] p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <span className="text-xs font-bold text-[var(--text-secondary)]">Status:</span>
                  <select
                    value={activeIssue.status}
                    onChange={(e) => handleUpdateStatus(activeIssue.id, e.target.value as IssueStatus)}
                    aria-label={`Status for ${activeIssue.key}`}
                    className="h-9 px-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-xs font-bold text-[var(--text-primary)] focus:outline-none focus:border-blue-500 cursor-pointer"
                  >
                    <option value="backlog">Backlog</option>
                    <option value="todo">Todo</option>
                    <option value="in_progress">In Progress</option>
                    <option value="in_review">In Review</option>
                    <option value="done">Done</option>
                  </select>
                </div>

                <button
                  onClick={() => setActiveIssue(null)}
                  className="btn-secondary w-full sm:w-auto h-10 px-5 rounded-2xl text-xs font-bold"
                >
                  Close Issue
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
