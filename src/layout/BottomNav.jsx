import { Link, useLocation } from 'react-router-dom';
import { Home, List, Plus, CalendarClock, StickyNote } from 'lucide-react';

export default function BottomNav({ hidden }) {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  if (hidden) return null;

  return (
    <div className="fixed bottom-4 sm:bottom-6 left-4 right-4 z-50 flex justify-center pointer-events-none">
      <div className="w-full max-w-md bg-white/70 dark:bg-zinc-900/70 backdrop-blur-2xl border border-white/50 dark:border-zinc-700/50 shadow-2xl rounded-[2rem] p-2 flex justify-between items-center pointer-events-auto">

        <Link
          to="/"
          aria-label="Inicio"
          className={`flex flex-col h-14 w-14 items-center justify-center rounded-2xl shadow-sm transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-theme-primary outline-none ${
            isActive('/') ? 'bg-white dark:bg-zinc-800 text-theme-primary' : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-300'
          }`}
        >
          <Home size={22} strokeWidth={isActive('/') ? 2.5 : 2}/>
        </Link>

        <Link
          to="/movimientos"
          aria-label="Movimientos"
          className={`flex flex-col h-14 w-14 items-center justify-center rounded-2xl shadow-sm transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-theme-primary outline-none ${
            isActive('/movimientos') ? 'bg-white dark:bg-zinc-800 text-theme-primary' : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-300'
          }`}
        >
          <List size={22} strokeWidth={isActive('/movimientos') ? 2.5 : 2}/>
        </Link>

        <button
          type="button"
          aria-label="Nuevo movimiento"
          onClick={() => window.dispatchEvent(new CustomEvent('openMenuModal'))}
          className="w-14 h-14 bg-theme-primary hover:bg-theme-primary-hover glow-primary text-white rounded-2xl flex items-center justify-center shadow-lg transition-transform duration-150 hover:scale-105 active:scale-95 cursor-pointer focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-theme-primary outline-none"
        >
          <Plus size={26} strokeWidth={2.5}/>
        </button>

        <Link
          to="/recurrentes"
          aria-label="Pagos recurrentes"
          className={`flex flex-col h-14 w-14 items-center justify-center rounded-2xl shadow-sm transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-theme-primary outline-none ${
            isActive('/recurrentes') ? 'bg-white dark:bg-zinc-800 text-theme-primary' : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-300'
          }`}
        >
          <CalendarClock size={22} strokeWidth={isActive('/recurrentes') ? 2.5 : 2}/>
        </Link>

        <Link
          to="/notas"
          aria-label="Notas"
          className={`flex flex-col h-14 w-14 items-center justify-center rounded-2xl shadow-sm transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-theme-primary outline-none ${
            isActive('/notas') ? 'bg-white dark:bg-zinc-800 text-theme-primary' : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-300'
          }`}
        >
          <StickyNote size={22} strokeWidth={isActive('/notas') ? 2.5 : 2}/>
        </Link>

      </div>
    </div>
  );
}
