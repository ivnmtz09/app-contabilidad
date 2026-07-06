import { Home, List, CalendarClock, Target } from "lucide-react";

function BottomNav() {
  return (
    <div className="fixed bottom-0 left-0 w-full bg-white dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800 pb-safe z-40">
      <div className="flex justify-between items-center px-6 py-3 max-w-md mx-auto">
        <button className="flex flex-col items-center text-violet-600 dark:text-violet-400">
          <Home size={24} />
          <span className="text-[10px] mt-1 font-medium">Inicio</span>
        </button>
        <button className="flex flex-col items-center text-zinc-400 hover:text-violet-600 transition-colors">
          <List size={24} />
          <span className="text-[10px] mt-1 font-medium">Movimientos</span>
        </button>
        <button className="flex flex-col items-center text-zinc-400 hover:text-violet-600 transition-colors">
          <CalendarClock size={24} />
          <span className="text-[10px] mt-1 font-medium">Recurrentes</span>
        </button>
        <button className="flex flex-col items-center text-zinc-400 hover:text-violet-600 transition-colors">
          <Target size={24} />
          <span className="text-[10px] mt-1 font-medium">Metas</span>
        </button>
      </div>
    </div>
  );
}

export default BottomNav;
