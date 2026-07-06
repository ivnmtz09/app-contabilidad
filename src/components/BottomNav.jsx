import { Home, List, CalendarClock, Target } from "lucide-react";

function BottomNav({ currentView, setCurrentView }) {
  const items = [
    { view: "home", label: "Inicio", icon: Home },
    { view: "movimientos", label: "Movimientos", icon: List },
    { view: "recurrentes", label: "Recurrentes", icon: CalendarClock },
    { view: "metas", label: "Metas", icon: Target },
  ];

  return (
    <div className="fixed bottom-0 left-0 w-full bg-white dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800 pb-safe z-40">
      <div className="flex justify-between items-center px-6 py-3 max-w-md mx-auto">
        {items.map(({ view, label, icon: Icon }) => {
          const isActive = currentView === view;
          return (
            <button
              key={view}
              onClick={() => setCurrentView(view)}
              className={`flex flex-col items-center transition-colors ${
                isActive
                  ? "text-violet-600 dark:text-violet-400"
                  : "text-zinc-400 hover:text-violet-600"
              }`}
            >
              <Icon size={24} />
              <span className="text-[10px] mt-1 font-medium">{label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default BottomNav;
