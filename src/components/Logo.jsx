/**
 * Marca de MisCuentaZ.
 * Evolución del grid a un gráfico de barras ascendente para reflejar balance y finanzas.
 * Colores: violeta (ingresos), zinc (neutro), emerald (saldo positivo).
 * La "Z" se mantiene como una insignia geométrica en el espacio negativo superior izquierdo.
 */
export default function Logo({ className = "w-12 h-12" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Insignia Z (Identidad de marca) */}
      <rect
        x="2"
        y="2"
        width="6"
        height="6"
        rx="1.8"
        className="fill-zinc-100 dark:fill-zinc-800"
      />
      <path
        d="M3.5 3.5H6.5V4.2L4.5 5.8H6.5V6.5H3.5V5.8L5.5 4.2H3.5V3.5Z"
        className="fill-zinc-900 dark:fill-zinc-50"
      />

      {/* Barra 1: Ingresos / Acento primario */}
      <rect
        x="2"
        y="12"
        width="6"
        height="10"
        rx="1.8"
        className="fill-violet-600 dark:fill-violet-500"
      />

      {/* Barra 2: Neutro / Transición */}
      <rect
        x="9"
        y="7"
        width="6"
        height="15"
        rx="1.8"
        className="fill-zinc-900 dark:fill-zinc-50"
      />

      {/* Barra 3: Saldo positivo / Meta */}
      <rect
        x="16"
        y="2"
        width="6"
        height="20"
        rx="1.8"
        className="fill-emerald-500"
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
