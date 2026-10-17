/**
 * Componente atómico SkeletonBlock con animación Shimmer Wave integrada.
 */
function SkeletonBlock({ className = "", rounded = "rounded-2xl" }) {
  return (
    <div
      className={`bg-zinc-200/80 dark:bg-zinc-800/70 animate-shimmer relative overflow-hidden ${rounded} ${className}`}
    />
  );
}

export function ProgressBar({ isLoading }) {
  if (!isLoading) return null;
  return (
    <div className="w-full h-1 bg-zinc-200 dark:bg-zinc-800 overflow-hidden relative z-50">
      <div className="absolute top-0 left-0 h-full bg-gradient-to-r from-theme-primary to-theme-secondary w-1/3 animate-[progress_1.5s_ease-in-out_infinite] rounded-full shadow-xs"></div>
    </div>
  );
}

export function HomeSkeleton() {
  return (
    <div className="mx-auto max-w-7xl grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
      {/* Hero Card Skeleton */}
      <div className="md:col-span-2 glass-hero rounded-[2.25rem] p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 border border-zinc-200/70 dark:border-white/10">
        <div className="flex-1 w-full space-y-4">
          <SkeletonBlock className="h-6 w-36 rounded-full" />
          <div className="flex gap-2.5">
            <SkeletonBlock className="h-8 w-28 rounded-xl" />
            <SkeletonBlock className="h-8 w-28 rounded-xl" />
          </div>
          <div className="flex gap-3 pt-2">
            <SkeletonBlock className="h-12 w-40 rounded-2xl" />
            <SkeletonBlock className="h-12 w-32 rounded-2xl" />
          </div>
        </div>
        {/* Placeholder tarjetero */}
        <div className="w-64 h-56 rounded-3xl bg-zinc-200/60 dark:bg-zinc-800/50 animate-shimmer border border-zinc-200/60 dark:border-white/5" />
      </div>

      {/* Ingresos vs Egresos del Mes */}
      <div className="bg-white/60 dark:bg-zinc-900/60 backdrop-blur-xl border border-zinc-200/70 dark:border-white/10 rounded-3xl p-6 shadow-sm flex flex-col justify-between space-y-3">
        <SkeletonBlock className="h-4 w-32 rounded-lg" />
        <SkeletonBlock className="h-9 w-44 rounded-xl" />
      </div>

      <div className="bg-white/60 dark:bg-zinc-900/60 backdrop-blur-xl border border-zinc-200/70 dark:border-white/10 rounded-3xl p-6 shadow-sm flex flex-col justify-between space-y-3">
        <SkeletonBlock className="h-4 w-32 rounded-lg" />
        <SkeletonBlock className="h-9 w-44 rounded-xl" />
      </div>

      {/* Desglose de Rendimiento Día / Semana / Mes */}
      <div className="md:col-span-2 bg-white/60 dark:bg-zinc-900/60 backdrop-blur-xl border border-zinc-200/70 dark:border-white/10 rounded-3xl p-5 flex justify-around text-center shadow-sm">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex flex-col items-center gap-2">
            <SkeletonBlock className="h-3 w-14 rounded-md" />
            <SkeletonBlock className="h-5 w-20 rounded-lg" />
          </div>
        ))}
      </div>

      {/* Gráfico de Balance Skeleton */}
      <div className="md:col-span-2 bg-white/60 dark:bg-zinc-900/60 backdrop-blur-xl border border-zinc-200/70 dark:border-white/10 rounded-3xl shadow-sm p-6 flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <SkeletonBlock className="h-5 w-36 rounded-lg" />
          <SkeletonBlock className="h-4 w-24 rounded-lg" />
        </div>
        <div className="h-44 w-full rounded-2xl bg-zinc-200/50 dark:bg-zinc-800/40 animate-shimmer flex items-end justify-between p-4 gap-2">
          {[40, 65, 30, 85, 50, 70, 95].map((h, i) => (
            <div
              key={i}
              className="flex-1 rounded-t-lg bg-zinc-300/70 dark:bg-zinc-700/60 animate-pulse"
              style={{ height: `${h}%` }}
            />
          ))}
        </div>
      </div>

      {/* Movimientos Recientes Skeleton */}
      <div className="md:col-span-2 bg-white/60 dark:bg-zinc-900/60 backdrop-blur-xl border border-zinc-200/70 dark:border-white/10 rounded-3xl shadow-sm p-6 space-y-3">
        <div className="flex justify-between items-center mb-2">
          <SkeletonBlock className="h-5 w-40 rounded-lg" />
          <SkeletonBlock className="h-4 w-16 rounded-lg" />
        </div>
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="flex items-center justify-between p-3.5 bg-white/70 dark:bg-zinc-800/50 rounded-2xl border border-zinc-200/60 dark:border-white/5"
          >
            <div className="flex items-center gap-3">
              <SkeletonBlock className="w-10 h-10 rounded-xl" />
              <div className="space-y-1.5">
                <SkeletonBlock className="h-4 w-36 rounded-md" />
                <SkeletonBlock className="h-3 w-24 rounded-md" />
              </div>
            </div>
            <SkeletonBlock className="h-5 w-20 rounded-md" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function ListSkeleton() {
  return (
    <div className="max-w-4xl mx-auto space-y-5">
      {/* Header y Filtros Skeleton */}
      <div className="bg-white/60 dark:bg-zinc-900/60 backdrop-blur-xl border border-zinc-200/70 dark:border-white/10 p-5 rounded-3xl shadow-xs space-y-4">
        <div className="flex justify-between items-center">
          <SkeletonBlock className="h-7 w-48 rounded-xl" />
          <SkeletonBlock className="h-9 w-28 rounded-xl" />
        </div>
        <SkeletonBlock className="h-11 w-full rounded-2xl" />
        <div className="flex gap-2 overflow-x-auto pb-1">
          {[1, 2, 3, 4].map((i) => (
            <SkeletonBlock key={i} className="h-8 w-20 rounded-xl shrink-0" />
          ))}
        </div>
      </div>

      {/* Lista de Movimientos Skeleton */}
      <div className="space-y-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="flex items-center justify-between p-4 bg-white/70 dark:bg-zinc-850/60 backdrop-blur-xl rounded-2xl border border-zinc-200/70 dark:border-white/10 shadow-xs"
          >
            <div className="flex items-center gap-3.5">
              <SkeletonBlock className="w-11 h-11 rounded-xl" />
              <div className="space-y-2">
                <SkeletonBlock className="h-4 w-40 sm:w-56 rounded-md" />
                <SkeletonBlock className="h-3 w-28 rounded-md" />
              </div>
            </div>
            <SkeletonBlock className="h-6 w-24 rounded-lg" />
          </div>
        ))}
      </div>
    </div>
  );
}

/** Skeleton para RecurrentesView — lista de suscripciones */
export function RecurrentesSkeleton() {
  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-6 pb-24 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <SkeletonBlock className="w-14 h-14 rounded-2xl" />
        <div className="flex-1 space-y-2">
          <SkeletonBlock className="h-6 w-44 rounded-lg" />
          <SkeletonBlock className="h-4 w-60 rounded-lg" />
        </div>
      </div>
      {/* Formulario placeholder */}
      <div className="h-28 w-full bg-white/60 dark:bg-zinc-900/60 backdrop-blur-xl rounded-3xl border border-zinc-200/70 dark:border-white/10 p-5 space-y-3">
        <SkeletonBlock className="h-5 w-32 rounded-lg" />
        <SkeletonBlock className="h-10 w-full rounded-xl" />
      </div>
      {/* Items */}
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="flex justify-between items-center p-4 bg-white/70 dark:bg-zinc-850/60 backdrop-blur-xl rounded-2xl border border-zinc-200/70 dark:border-white/10 shadow-xs"
          >
            <div className="space-y-2">
              <SkeletonBlock className="h-4 w-36 rounded-md" />
              <SkeletonBlock className="h-3 w-24 rounded-md" />
            </div>
            <SkeletonBlock className="h-6 w-20 rounded-xl" />
          </div>
        ))}
      </div>
    </div>
  );
}

/** Skeleton para NotasView — grid de notas */
export function NotasSkeleton() {
  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 pb-24 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <SkeletonBlock className="w-14 h-14 rounded-2xl" />
        <div className="flex-1 space-y-2">
          <SkeletonBlock className="h-6 w-36 rounded-lg" />
          <SkeletonBlock className="h-4 w-52 rounded-lg" />
        </div>
      </div>
      {/* Botón nueva nota */}
      <SkeletonBlock className="h-14 w-full rounded-2xl" />
      {/* Grid de notas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-44 bg-white/60 dark:bg-zinc-900/60 backdrop-blur-xl rounded-3xl border border-zinc-200/70 dark:border-white/10 p-5 flex flex-col justify-between shadow-xs"
          >
            <div className="space-y-2.5">
              <SkeletonBlock className="h-5 w-40 rounded-lg" />
              <SkeletonBlock className="h-3 w-full rounded-md" />
              <SkeletonBlock className="h-3 w-4/5 rounded-md" />
            </div>
            <SkeletonBlock className="h-3 w-24 rounded-md" />
          </div>
        ))}
      </div>
    </div>
  );
}

/** Skeleton para DeudasView — lista con badges */
export function DeudasSkeleton() {
  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-6 pb-24 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <SkeletonBlock className="w-14 h-14 rounded-2xl" />
        <div className="flex-1 space-y-2">
          <SkeletonBlock className="h-6 w-36 rounded-lg" />
          <SkeletonBlock className="h-4 w-48 rounded-lg" />
        </div>
      </div>
      {/* Resumen */}
      <div className="grid grid-cols-2 gap-3">
        <div className="h-20 bg-white/60 dark:bg-zinc-900/60 backdrop-blur-xl rounded-2xl border border-zinc-200/70 dark:border-white/10 p-3 flex flex-col justify-between shadow-xs">
          <SkeletonBlock className="h-3 w-20 rounded-md" />
          <SkeletonBlock className="h-6 w-28 rounded-lg" />
        </div>
        <div className="h-20 bg-white/60 dark:bg-zinc-900/60 backdrop-blur-xl rounded-2xl border border-zinc-200/70 dark:border-white/10 p-3 flex flex-col justify-between shadow-xs">
          <SkeletonBlock className="h-3 w-20 rounded-md" />
          <SkeletonBlock className="h-6 w-28 rounded-lg" />
        </div>
      </div>
      {/* Formulario */}
      <div className="h-28 w-full bg-white/60 dark:bg-zinc-900/60 backdrop-blur-xl rounded-3xl border border-zinc-200/70 dark:border-white/10 p-4 space-y-3 shadow-xs">
        <SkeletonBlock className="h-4 w-32 rounded-lg" />
        <SkeletonBlock className="h-10 w-full rounded-xl" />
      </div>
      {/* Items */}
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="p-4 bg-white/70 dark:bg-zinc-850/60 backdrop-blur-xl rounded-2xl border border-zinc-200/70 dark:border-white/10 shadow-xs space-y-3"
          >
            <div className="flex justify-between items-center">
              <SkeletonBlock className="h-4 w-36 rounded-md" />
              <SkeletonBlock className="h-5 w-24 rounded-lg" />
            </div>
            <SkeletonBlock className="h-2 w-full rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );
}

/** Skeleton para MetasView — progress bars */
export function MetasSkeleton() {
  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-6 pb-24 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <SkeletonBlock className="w-14 h-14 rounded-2xl" />
        <div className="flex-1 space-y-2">
          <SkeletonBlock className="h-6 w-40 rounded-lg" />
          <SkeletonBlock className="h-4 w-56 rounded-lg" />
        </div>
      </div>
      {/* Formulario */}
      <div className="h-24 w-full bg-white/60 dark:bg-zinc-900/60 backdrop-blur-xl rounded-3xl border border-zinc-200/70 dark:border-white/10 p-4 space-y-2 shadow-xs">
        <SkeletonBlock className="h-4 w-28 rounded-lg" />
        <SkeletonBlock className="h-9 w-full rounded-xl" />
      </div>
      {/* Items con progress bar */}
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="p-4 bg-white/70 dark:bg-zinc-850/60 backdrop-blur-xl rounded-2xl border border-zinc-200/70 dark:border-white/10 shadow-xs space-y-3"
          >
            <div className="flex justify-between items-center">
              <SkeletonBlock className="h-4 w-36 rounded-md" />
              <SkeletonBlock className="h-4 w-24 rounded-md" />
            </div>
            <SkeletonBlock className="h-2.5 w-full rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );
}
