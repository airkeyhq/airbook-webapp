export default function Loading() {
  return (
    <div className="flex h-screen w-screen items-center justify-center bg-[var(--canvas-bg)]">
      <div className="flex flex-col items-center gap-4">
        {/* Animated Icon / Spinner */}
        <div className="relative flex h-12 w-12 items-center justify-center">
          <div className="absolute h-full w-full animate-spin rounded-full border-4 border-black/10 dark:border-white/10 border-t-black dark:border-t-white" />
          <div className="h-2 w-2 rounded-full bg-black dark:bg-white" />
        </div>
        {/* Skeleton text */}
        <div className="h-4 w-32 animate-pulse rounded-full bg-black/10 dark:bg-white/10" />
      </div>
    </div>
  );
}
