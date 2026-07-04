import { useState, useEffect } from "react";
import { X, Home, PieChart, Settings, User, Moon, Sun, ExternalLink, Code, LogOut } from "lucide-react";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";

function Drawer({ isOpen, onClose, onOpenProfile }) {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const shouldBeDark = stored === "dark" || (!stored && prefersDark);
    if (shouldBeDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    setIsDarkMode(shouldBeDark);
  }, []);

  const toggleTheme = () => {
    const isDark = document.documentElement.classList.toggle("dark");
    localStorage.setItem("theme", isDark ? "dark" : "light");
    setIsDarkMode(isDark);
  };

  const handleProfile = () => {
    onOpenProfile();
    onClose();
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
        <div className="flex flex-col h-full justify-between">
          <div>
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
              <button
                onClick={handleProfile}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-sans text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
              >
                <User size={18} />
                Perfil
              </button>
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

              <button
                onClick={() => signOut(auth)}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-sans text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors cursor-pointer"
              >
                <LogOut size={18} />
                Cerrar Sesión
              </button>
            </nav>
          </div>

          <div className="border-t border-zinc-200 dark:border-zinc-800 p-6 mt-auto">
            <span className="block text-sm text-zinc-500 dark:text-zinc-400 mb-2 font-medium">
              Creado por:{" "}
              <a href="https://www.instagram.com/ivjmm.0109/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300 transition-colors">
                <ExternalLink size={14} strokeWidth={2} />
                Ivn Mtz
              </a>
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs text-zinc-400 dark:text-zinc-500 font-mono">
              <Code size={12} strokeWidth={2} />
              Version 1.0.0
            </span>
          </div>
        </div>
      </aside>
    </>
  );
}

export default Drawer;
