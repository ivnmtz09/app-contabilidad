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

/* =========================================================
   SKELETONS DE VISTAS SECUNDARIAS
   Se muestran mientras Firestore carga los datos.
   ========================================================= */

/** Skeleton para RecurrentesView — lista de suscripciones */
export function RecurrentesSkeleton() {
  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-6 pb-24 animate-pulse">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <div className="w-14 h-14 bg-zinc-200 dark:bg-zinc-800 rounded-2xl" />
        <div className="flex-1 space-y-2">
          <div className="h-6 w-40 bg-zinc-200 dark:bg-zinc-800 rounded-lg" />
          <div className="h-4 w-56 bg-zinc-200 dark:bg-zinc-800 rounded-lg" />
        </div>
      </div>
      {/* Formulario placeholder */}
      <div className="h-28 w-full bg-zinc-200 dark:bg-zinc-800 rounded-3xl mb-8" />
      {/* Items */}
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex justify-between items-center h-20 bg-zinc-200 dark:bg-zinc-800 rounded-2xl mb-3 px-4">
          <div className="space-y-2">
            <div className="h-4 w-32 bg-zinc-300 dark:bg-zinc-700 rounded" />
            <div className="h-3 w-20 bg-zinc-300 dark:bg-zinc-700 rounded" />
          </div>
          <div className="h-6 w-20 bg-zinc-300 dark:bg-zinc-700 rounded-lg" />
        </div>
      ))}
    </div>
  );
}

/** Skeleton para NotasView — grid de notas */
export function NotasSkeleton() {
  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 pb-24 animate-pulse">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <div className="w-14 h-14 bg-zinc-200 dark:bg-zinc-800 rounded-2xl" />
        <div className="flex-1 space-y-2">
          <div className="h-6 w-32 bg-zinc-200 dark:bg-zinc-800 rounded-lg" />
          <div className="h-4 w-48 bg-zinc-200 dark:bg-zinc-800 rounded-lg" />
        </div>
      </div>
      {/* Botón nueva nota */}
      <div className="h-14 w-full bg-zinc-200 dark:bg-zinc-800 rounded-2xl mb-8" />
      {/* Grid de notas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-40 bg-zinc-200 dark:bg-zinc-800 rounded-3xl" />
        ))}
      </div>
    </div>
  );
}

/** Skeleton para DeudasView — lista con badges */
export function DeudasSkeleton() {
  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-6 pb-24 animate-pulse">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <div className="w-14 h-14 bg-zinc-200 dark:bg-zinc-800 rounded-2xl" />
        <div className="flex-1 space-y-2">
          <div className="h-6 w-28 bg-zinc-200 dark:bg-zinc-800 rounded-lg" />
          <div className="h-4 w-44 bg-zinc-200 dark:bg-zinc-800 rounded-lg" />
        </div>
      </div>
      {/* Resumen */}
      <div className="grid grid-cols-2 gap-3 mb-8">
        <div className="h-20 bg-zinc-200 dark:bg-zinc-800 rounded-2xl" />
        <div className="h-20 bg-zinc-200 dark:bg-zinc-800 rounded-2xl" />
      </div>
      {/* Formulario */}
      <div className="h-32 w-full bg-zinc-200 dark:bg-zinc-800 rounded-3xl mb-8" />
      {/* Items */}
      {[1, 2, 3].map((i) => (
        <div key={i} className="h-24 w-full bg-zinc-200 dark:bg-zinc-800 rounded-2xl mb-3" />
      ))}
    </div>
  );
}

/** Skeleton para MetasView — progress bars */
export function MetasSkeleton() {
  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-6 pb-24 animate-pulse">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <div className="w-14 h-14 bg-zinc-200 dark:bg-zinc-800 rounded-2xl" />
        <div className="flex-1 space-y-2">
          <div className="h-6 w-36 bg-zinc-200 dark:bg-zinc-800 rounded-lg" />
          <div className="h-4 w-52 bg-zinc-200 dark:bg-zinc-800 rounded-lg" />
        </div>
      </div>
      {/* Formulario */}
      <div className="h-24 w-full bg-zinc-200 dark:bg-zinc-800 rounded-3xl mb-8" />
      {/* Items con progress bar */}
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-zinc-200 dark:bg-zinc-800 rounded-2xl mb-3 p-4">
          <div className="flex justify-between mb-3">
            <div className="h-4 w-32 bg-zinc-300 dark:bg-zinc-700 rounded" />
            <div className="h-4 w-20 bg-zinc-300 dark:bg-zinc-700 rounded" />
          </div>
          <div className="h-2 w-full bg-zinc-300 dark:bg-zinc-700 rounded-full" />
        </div>
      ))}
    </div>
  );
}
