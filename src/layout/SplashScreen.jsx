import Logo from '../components/Logo';

export default function SplashScreen() {
  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-zinc-50 dark:bg-zinc-950 transition-colors duration-300">
      <div className="animate-pulse flex flex-col items-center">
        <Logo className="w-20 h-20 mb-6 drop-shadow-lg"/>
        <h1 className="text-3xl font-display font-bold text-zinc-900 dark:text-zinc-50 tracking-tight">
          MisCuentaZ
        </h1>
      </div>
    </div>
  );
}
