export function ProgressBar({ isLoading }) {
  if (!isLoading) return null;
  return (
    <div className="w-full h-1 bg-zinc-200 dark:bg-zinc-800 overflow-hidden relative z-50">
      <div className="absolute top-0 left-0 h-full bg-violet-600 dark:bg-violet-500 w-1/3 animate-[progress_1.5s_ease-in-out_infinite] rounded-full"></div>
    </div>
  );
}

export function SkeletonPage() {
  return (
    <div className="p-4 space-y-4 animate-pulse">
      <div className="h-32 bg-zinc-200 dark:bg-zinc-800 rounded-3xl w-full"></div>
      <div className="flex gap-4">
        <div className="h-24 bg-zinc-200 dark:bg-zinc-800 rounded-3xl w-1/2"></div>
        <div className="h-24 bg-zinc-200 dark:bg-zinc-800 rounded-3xl w-1/2"></div>
      </div>
      <div className="h-64 bg-zinc-200 dark:bg-zinc-800 rounded-3xl w-full mt-4"></div>
    </div>
  );
}
