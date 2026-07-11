import { Home, List, CalendarClock, StickyNote, Plus } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

function BottomNav() {
  const location = useLocation();
  const { t } = useTranslation();

  const leftItems = [
    { path: "/", label: t("nav.home"), icon: Home },
    { path: "/movimientos", label: t("nav.movements"), icon: List },
  ];

  const rightItems = [
    { path: "/recurrentes", label: t("nav.recurrent"), icon: CalendarClock },
    { path: "/notas", label: t("nav.notes"), icon: StickyNote },
  ];

  return (
    <div className="fixed bottom-0 left-0 w-full backdrop-blur-md bg-zinc-50/80 dark:bg-zinc-900/80 border-t border-zinc-200/80 dark:border-zinc-800/80 pb-safe z-40">
      <div className="flex justify-around items-center h-16 relative px-2 max-w-md mx-auto">
        {leftItems.map(({ path, label, icon: Icon }) => {
          const isActive = location.pathname === path;
          return (
            <Link
              key={path}
              to={path}
              className={`flex flex-col items-center p-2 rounded-xl transition-all duration-300 ${
                isActive
                  ? "text-violet-600 dark:text-violet-400"
                  : "text-zinc-400 hover:text-violet-600 dark:hover:text-violet-400"
              }`}
            >
              <Icon size={22} />
              <span className="text-[10px] mt-1">{label}</span>
            </Link>
          );
        })}

        <div className="relative -top-5 flex justify-center">
          <button
            onClick={() => window.dispatchEvent(new CustomEvent('openMenuModal'))}
            className="bg-violet-600 p-4 rounded-full text-white shadow-xl hover:bg-violet-700 transition-transform hover:scale-105 border-4 border-white dark:border-zinc-950"
          >
            <Plus size={24} />
          </button>
        </div>

        {rightItems.map(({ path, label, icon: Icon }) => {
          const isActive = location.pathname === path;
          return (
            <Link
              key={path}
              to={path}
              className={`flex flex-col items-center p-2 rounded-xl transition-all duration-300 ${
                isActive
                  ? "text-violet-600 dark:text-violet-400"
                  : "text-zinc-400 hover:text-violet-600 dark:hover:text-violet-400"
              }`}
            >
              <Icon size={22} />
              <span className="text-[10px] mt-1">{label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export default BottomNav;
