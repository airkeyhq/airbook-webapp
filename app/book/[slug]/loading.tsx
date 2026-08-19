export default function BookLoading() {
  return (
    <main className="min-h-screen bg-[var(--canvas-bg)] flex items-center justify-center p-4">
      <div className="w-full max-w-lg glass-panel bg-white/70 dark:bg-gray-900/70 border border-white/60 dark:border-white/10 rounded-3xl overflow-hidden shadow-2xl p-6 sm:p-8 space-y-6">
        
        {/* Header Skeleton */}
        <div className="text-center space-y-3 pb-6 border-b border-black/5 dark:border-white/5">
          <div className="h-16 w-16 mx-auto animate-pulse rounded-full bg-black/10 dark:bg-white/10" />
          <div className="h-6 w-48 mx-auto animate-pulse rounded-full bg-black/10 dark:bg-white/10 mt-4" />
          <div className="h-4 w-32 mx-auto animate-pulse rounded-full bg-black/5 dark:bg-white/5" />
        </div>

        {/* Content Skeleton */}
        <div className="space-y-4 pt-2">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-20 w-full animate-pulse rounded-2xl bg-black/5 dark:bg-white/5" />
          ))}
        </div>
        
        {/* Footer/Button Skeleton */}
        <div className="pt-4">
          <div className="h-14 w-full animate-pulse rounded-full bg-black/10 dark:bg-white/10" />
        </div>
      </div>
    </main>
  );
}
