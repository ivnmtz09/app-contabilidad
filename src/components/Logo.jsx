/**
 * Marca de MisCuentaZ.
 * Grid bento 2x2: violeta (ingresos/acento primario), zinc (neutro/dark mode),
 * emerald (positivo/saldo) y una cuarta celda que resuelve la "Z" del nombre
 * como una pieza más del grid, en vez de un trazo suelto.
 */
export default function Logo({ className = "w-12 h-12" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Ingresos / acento primario */}
      <rect
        x="3"
        y="3"
        width="7"
        height="7"
        rx="2.2"
        className="fill-violet-600 dark:fill-violet-500"
      />
      {/* Neutro */}
      <rect
        x="14"
        y="3"
        width="7"
        height="7"
        rx="2.2"
        className="fill-zinc-900 dark:fill-zinc-50"
      />
      {/* Saldo positivo */}
      <rect
        x="14"
        y="14"
        width="7"
        height="7"
        rx="2.2"
        className="fill-emerald-500"
      />
      {/* Celda de marca: fondo + letra "Z" */}
      <rect
        x="3"
        y="14"
        width="7"
        height="7"
        rx="2.2"
        className="fill-zinc-100 dark:fill-zinc-800"
      />
      <path
        d="M4.3 15.4H8.7V16.55L5.95 19.6H8.7V20.75H4.3V19.6L7.05 16.55H4.3V15.4Z"
        className="fill-zinc-900 dark:fill-zinc-50"
      />
    </svg>
  );
}

/**
 * Variante con wordmark, para headers, splash screen o login.
 * showBeta controla el badge "Beta" que aparece en la descripción del proyecto.
 */
export function LogoWithText({ className = "w-10 h-10", showBeta = true }) {
  return (
    <div className="flex items-center gap-2.5">
      <Logo className={className} />
      <div className="flex items-center gap-2">
        <span className="text-xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
          MisCuenta
          <span className="text-violet-600 dark:text-violet-500">Z</span>
        </span>
        {showBeta && (
          <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400">
            Beta
          </span>
        )}
      </div>
    </div>
  );
}
