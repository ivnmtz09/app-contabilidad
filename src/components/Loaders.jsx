export function ProgressBar({ isLoading }) {
  if (!isLoading) return null;
  return (
    <div className="w-full h-1 bg-zinc-200 dark:bg-zinc-800 overflow-hidden relative z-50">
      <div className="absolute top-0 left-0 h-full bg-violet-600 dark:bg-violet-500 w-1/3 animate-[progress_1.5s_ease-in-out_infinite] rounded-full"></div>
    </div>
  );
}

export function HomeSkeleton() {
  return (
    <div className="mx-auto max-w-7xl grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 animate-pulse">
      <div className="md:col-span-2 h-32 bg-zinc-200 dark:bg-zinc-800/80 rounded-3xl w-full"></div>
      <div className="h-28 bg-zinc-200 dark:bg-zinc-800/80 rounded-2xl w-full"></div>
      <div className="h-28 bg-zinc-200 dark:bg-zinc-800/80 rounded-2xl w-full"></div>
      <div className="md:col-span-2 h-16 bg-zinc-200 dark:bg-zinc-800/80 rounded-2xl w-full"></div>
      <div className="md:col-span-2 h-48 bg-zinc-200 dark:bg-zinc-800/80 rounded-2xl w-full"></div>
    </div>
  );
}

export function ListSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="h-10 w-1/3 bg-zinc-200 dark:bg-zinc-800/80 rounded-lg mb-6"></div>
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="h-16 w-full bg-zinc-200 dark:bg-zinc-800/80 rounded-2xl"></div>
      ))}
    </div>
  );
}
