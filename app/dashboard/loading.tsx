import React from 'react';

export default function DashboardLoading() {
  return (
    <div className="flex-1 flex w-full overflow-hidden bg-[var(--canvas-bg)]">
      {/* Desktop Left Sidebar Skeleton */}
      <aside className="hidden md:flex flex-col w-64 h-full border-r border-[var(--border-subtle)] bg-[var(--header-bg)] p-4">
        {/* Logo skeleton */}
        <div className="h-8 w-32 animate-pulse rounded-lg bg-black/10 dark:bg-white/10 mb-8" />
        
        {/* Nav items skeletons */}
        <div className="space-y-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-10 w-full animate-pulse rounded-xl bg-black/5 dark:bg-white/5" />
          ))}
        </div>
        
        <div className="mt-auto space-y-3">
          <div className="h-10 w-full animate-pulse rounded-xl bg-black/5 dark:bg-white/5" />
          <div className="h-10 w-full animate-pulse rounded-xl bg-black/5 dark:bg-white/5" />
        </div>
      </aside>

      {/* Center Viewport */}
      <section className="flex-1 w-full flex flex-col h-full overflow-hidden relative p-4">
        {/* Mobile Header Skeleton */}
        <div className="md:hidden flex items-center justify-between mb-4">
          <div className="h-8 w-24 animate-pulse rounded-lg bg-black/10 dark:bg-white/10" />
          <div className="h-8 w-8 animate-pulse rounded-full bg-black/10 dark:bg-white/10" />
        </div>
        
        {/* Module Header Skeleton */}
        <div className="mb-6 flex justify-between items-center">
          <div>
            <div className="h-8 w-48 animate-pulse rounded-lg bg-black/10 dark:bg-white/10 mb-2" />
            <div className="h-4 w-64 animate-pulse rounded-full bg-black/5 dark:bg-white/5" />
          </div>
          <div className="hidden sm:block h-10 w-32 animate-pulse rounded-xl bg-black/10 dark:bg-white/10" />
        </div>

        {/* Content Skeleton */}
        <div className="flex-1 overflow-y-auto">
          {/* Daily summary / stat cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-32 animate-pulse rounded-2xl bg-black/5 dark:bg-white/5" />
            ))}
          </div>

          {/* List items skeleton */}
          <div className="space-y-3 max-w-3xl">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 w-full animate-pulse rounded-2xl bg-black/5 dark:bg-white/5" />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
