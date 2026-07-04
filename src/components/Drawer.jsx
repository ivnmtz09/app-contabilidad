import { useState, useEffect } from "react";
import { X, Home, PieChart, Settings, User, Moon, Sun } from "lucide-react";

function Drawer({ isOpen, onClose }) {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    setIsDarkMode(document.documentElement.classList.contains("dark"));
  }, []);

  const toggleTheme = () => {
    document.documentElement.classList.toggle("dark");
    setIsDarkMode((prev) => !prev);
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-zinc-50 dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-700 shadow-lg z-50 transform transition-transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-end p-4">
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="px-4 space-y-1">
          <a
            href="#"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-sans text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors"
          >
            <Home size={18} />
            Inicio
          </a>
          <a
            href="#"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-sans text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors"
          >
            <PieChart size={18} />
            Estadísticas
          </a>
          <a
            href="#"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-sans text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors"
          >
            <User size={18} />
            Perfil
          </a>
          <a
            href="#"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-sans text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors"
          >
            <Settings size={18} />
            Configuración
          </a>

          <hr className="my-3 border-zinc-200 dark:border-zinc-700" />

          <button
            onClick={toggleTheme}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-sans text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
            {isDarkMode ? "Modo Claro" : "Modo Oscuro"}
          </button>
        </nav>
      </aside>
    </>
  );
}

export default Drawer;
