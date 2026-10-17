import Logo from '../components/Logo';

export default function SplashScreen() {
  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-zinc-50/90 dark:bg-zinc-950/95 backdrop-blur-3xl transition-colors duration-500 overflow-hidden select-none">
      {/* Orbes de luz ambiental de fondo */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-theme-primary/25 dark:bg-theme-primary/30 rounded-full blur-3xl animate-pulse-glow pointer-events-none" />
      <div
        className="absolute -bottom-32 -right-32 w-96 h-96 bg-theme-secondary/25 dark:bg-theme-secondary/30 rounded-full blur-3xl animate-pulse-glow pointer-events-none"
        style={{ animationDelay: '1.2s' }}
      />

      {/* Escudo central Glassmorphism */}
      <div className="glass-card rounded-[2.5rem] p-8 sm:p-11 border border-white/80 dark:border-white/10 shadow-2xl flex flex-col items-center max-w-xs sm:max-w-sm mx-4 relative z-10">
        {/* Logo con flotación suave y resplandor */}
        <div className="relative mb-6">
          <div className="absolute inset-0 rounded-3xl bg-theme-primary/30 blur-xl animate-pulse-glow" />
          <div className="relative animate-float p-3 bg-white/60 dark:bg-zinc-900/60 rounded-3xl border border-white/70 dark:border-white/10 shadow-lg">
            <Logo className="w-16 h-16 sm:w-20 sm:h-20 drop-shadow-xl" />
          </div>
        </div>

        {/* Marca y tipografía */}
        <h1 className="text-2xl sm:text-3xl font-display font-bold text-zinc-900 dark:text-zinc-50 tracking-tight text-center mb-1">
          MisCuenta<span className="text-theme-primary">Z</span>
        </h1>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 text-center font-medium mb-6">
          Finanzas personales inteligentes
        </p>

        {/* Indicador de carga con barra de shimmer wave */}
        <div className="w-48 h-1.5 bg-zinc-200/80 dark:bg-zinc-800/80 rounded-full overflow-hidden relative mb-3">
          <div className="h-full bg-gradient-to-r from-theme-primary via-theme-secondary to-theme-primary rounded-full animate-shimmer w-full" />
        </div>

        {/* Puntos de pulso secuenciales */}
        <div className="flex items-center gap-1.5">
          <span
            className="w-2 h-2 rounded-full bg-theme-primary animate-ping"
            style={{ animationDuration: '1.4s', animationDelay: '0ms' }}
          />
          <span
            className="w-2 h-2 rounded-full bg-theme-secondary animate-ping"
            style={{ animationDuration: '1.4s', animationDelay: '250ms' }}
          />
          <span
            className="w-2 h-2 rounded-full bg-theme-primary animate-ping"
            style={{ animationDuration: '1.4s', animationDelay: '500ms' }}
          />
        </div>
      </div>
    </div>
  );
}
