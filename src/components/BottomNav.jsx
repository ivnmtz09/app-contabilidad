import { Home, List, CalendarClock, Target } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  const items = [
    { path: "/", label: "Inicio", icon: Home },
    { path: "/movimientos", label: "Movimientos", icon: List },
    { path: "/recurrentes", label: "Recurrentes", icon: CalendarClock },
    { path: "/metas", label: "Metas", icon: Target },
  ];

  return (
    <div className="fixed bottom-0 left-0 w-full backdrop-blur-md bg-zinc-50/80 dark:bg-zinc-900/80 border-t border-zinc-200/80 dark:border-zinc-800/80 pb-safe z-40">
      <div className="grid grid-cols-4 gap-2 sm:gap-4 px-4 py-3 max-w-md mx-auto">
        {items.map(({ path, label, icon: Icon }) => {
          const isActive = location.pathname === path;
          return (
            <button
              key={path}
              onClick={() => navigate(path)}
              className={`flex flex-col items-center justify-center aspect-square rounded-2xl transition-all duration-300 cursor-pointer ${
                isActive
                  ? "bg-zinc-100 dark:bg-zinc-800 shadow-sm border border-zinc-200 dark:border-zinc-700 text-violet-600 dark:text-violet-400"
                  : "bg-transparent text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 border border-transparent"
              }`}
            >
              <Icon size={24} />
              <span className="text-[10px] mt-1.5 font-medium">{label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default BottomNav;
