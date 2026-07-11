import { useEffect, useState } from "react";
import { X, ExternalLink, Code, Info, LogOut, Download } from "lucide-react";
import AboutModal from "../components/AboutModal";
import { useTranslation } from "react-i18next";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { toast } from "react-hot-toast";
import { exportToExcel } from "../utils/exportExcel";

function Drawer({ isOpen, onClose, transactions = [], accounts = [] }) {
  const { t } = useTranslation();
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [showExportConfirm, setShowExportConfirm] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

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

  const handleExport = () => setShowExportConfirm(true);

  const handleExportConfirm = async () => {
    setShowExportConfirm(false);
    try {
      await exportToExcel(transactions, accounts);
      toast.success('Reporte exportado correctamente');
      onClose();
    } catch {
      toast.error('Error al exportar el reporte');
    }
  };

  const handleLogoutConfirm = () => {
    setShowLogoutConfirm(false);
    signOut(auth);
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
        className={`fixed top-0 left-0 h-full w-72 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-2xl border-r border-zinc-200/50 dark:border-zinc-800/50 shadow-2xl z-50 transform transition-transform duration-300 flex flex-col ${
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

            <nav className="px-4 grid grid-cols-1 gap-2">
              <button
                onClick={handleExport}
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
                onClick={() => setShowLogoutConfirm(true)}
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
              v 1.3.1
            </span>
          </div>
        </div>
      </aside>

      <AboutModal isOpen={isAboutOpen} onClose={() => setIsAboutOpen(false)} />

      {showExportConfirm && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" onClick={() => setShowExportConfirm(false)}>
          <div className="w-full max-w-sm bg-white dark:bg-zinc-900 rounded-3xl shadow-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="p-6">
              <h3 className="text-lg font-display font-bold text-zinc-900 dark:text-zinc-50 mb-2">Exportar movimientos</h3>
              <p className="text-sm font-sans text-zinc-500 dark:text-zinc-400">
                ¿Estás seguro de que deseas exportar todos tus movimientos a un archivo Excel?
              </p>
            </div>
            <div className="flex gap-3 px-6 pb-6">
              <button
                onClick={() => setShowExportConfirm(false)}
                className="flex-1 py-2.5 rounded-xl text-sm font-sans font-medium text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={handleExportConfirm}
                className="flex-1 py-2.5 rounded-xl text-sm font-sans font-medium bg-emerald-600 hover:bg-emerald-700 text-white transition-colors cursor-pointer"
              >
                Exportar
              </button>
            </div>
          </div>
        </div>
      )}

      {showLogoutConfirm && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" onClick={() => setShowLogoutConfirm(false)}>
          <div className="w-full max-w-sm bg-white dark:bg-zinc-900 rounded-3xl shadow-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="p-6">
              <h3 className="text-lg font-display font-bold text-zinc-900 dark:text-zinc-50 mb-2">{t('profile.logout')}</h3>
              <p className="text-sm font-sans text-zinc-500 dark:text-zinc-400">
                ¿Estás seguro de que deseas cerrar sesión? Deberás volver a iniciar sesión con Google para acceder a tus datos.
              </p>
            </div>
            <div className="flex gap-3 px-6 pb-6">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 py-2.5 rounded-xl text-sm font-sans font-medium text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={handleLogoutConfirm}
                className="flex-1 py-2.5 rounded-xl text-sm font-sans font-medium bg-rose-600 hover:bg-rose-700 text-white transition-colors cursor-pointer"
              >
                Cerrar sesión
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Drawer;
