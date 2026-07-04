import Logo from "./Logo";

function SplashScreen() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-50 dark:bg-zinc-900">
      <Logo className="w-20 h-20 animate-pulse mb-4" />
      <p className="text-lg font-display font-semibold text-zinc-600 dark:text-zinc-400">
        Cargando FinanGrid...
      </p>
    </div>
  );
}

export default SplashScreen;
