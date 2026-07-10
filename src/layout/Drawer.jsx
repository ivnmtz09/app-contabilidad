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

            <nav className="px-4 grid grid-cols-2 gap-2">
              <button
                onClick={handleProfile}
                className="flex flex-col items-center justify-center gap-2 p-4 rounded-2xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer"
              >
                <div className="p-2 bg-violet-100 dark:bg-violet-900/30 rounded-xl text-violet-600 dark:text-violet-400">
                  <User size={20} />
                </div>
                <span className="text-xs font-sans font-medium text-zinc-700 dark:text-zinc-300">{t("profile.title")}</span>
              </button>

              <button
                onClick={() => {
                  exportToExcel(transactions, accounts);
                  onClose();
                }}
                className="flex flex-col items-center justify-center gap-2 p-4 rounded-2xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer"
              >
                <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl text-emerald-600 dark:text-emerald-400">
                  <Download size={20} />
                </div>
                <span className="text-xs font-sans font-medium text-zinc-700 dark:text-zinc-300">Exportar</span>
              </button>

            </nav>
          </div>

          <div className="border-t border-zinc-200 dark:border-zinc-800 p-4 mt-auto">
            <div className="grid grid-cols-2 gap-2 mb-3">
              <button
                onClick={() => setIsAboutOpen(true)}
                className="flex flex-col items-center justify-center gap-2 p-4 rounded-2xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer"
              >
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-xl text-blue-600 dark:text-blue-400">
                  <Info size={20} />
                </div>
                <span className="text-xs font-sans font-medium text-zinc-600 dark:text-zinc-400">{t('drawer.about')}</span>
              </button>

              <button
                onClick={() => signOut(auth)}
                className="flex flex-col items-center justify-center gap-2 p-4 rounded-2xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer"
              >
                <div className="p-2 bg-rose-100 dark:bg-rose-900/30 rounded-xl text-rose-600 dark:text-rose-400">
                  <LogOut size={20} />
                </div>
                <span className="text-xs font-sans font-medium text-rose-600 dark:text-rose-400">{t("profile.logout")}</span>
              </button>
            </div>

            <span className="block text-sm text-zinc-500 dark:text-zinc-400 font-medium">
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
