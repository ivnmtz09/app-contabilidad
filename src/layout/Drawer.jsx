import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { X, User, ExternalLink, Code, Info, LogOut, Download } from "lucide-react";
import AboutModal from "../components/AboutModal";
import { useTranslation } from "react-i18next";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { exportToExcel } from "../utils/exportExcel";

function Drawer({ isOpen, onClose, transactions = [], accounts = [] }) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [isAboutOpen, setIsAboutOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleProfile = () => {
    navigate('/perfil');
    onClose();
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity"
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
              <button
                onClick={handleProfile}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-sans text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
              >
                <User size={18} />
                {t("profile.title")}
              </button>

              <button
                onClick={() => {
                  exportToExcel(transactions, accounts);
                  onClose();
                }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-sans text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
              >
                <Download size={18} />
                Exportar a Excel
              </button>

              <button
                onClick={() => setIsAboutOpen(true)}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/50 transition-colors font-medium"
              >
                <Info size={22} />
                {t('drawer.about')}
              </button>

              <button
                onClick={() => signOut(auth)}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-sans text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors cursor-pointer"
              >
                <LogOut size={18} />
                {t("profile.logout")}
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
              v 1.2.0
            </span>
          </div>
        </div>
      </aside>

      <AboutModal isOpen={isAboutOpen} onClose={() => setIsAboutOpen(false)} />
    </>
  );
}

export default Drawer;
