import { AlertTriangle, Trash2, X } from 'lucide-react';

export default function ConfirmModal({ isOpen, onClose, onConfirm, title, message, confirmText = 'Confirmar', type = 'danger' }) {
  if (!isOpen) return null;

  const styles = {
    danger: {
      icon: <Trash2 size={24} />,
      iconBg: 'bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400',
      confirmBtn: 'bg-rose-600 hover:bg-rose-700',
    },
    warning: {
      icon: <AlertTriangle size={24} />,
      iconBg: 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400',
      confirmBtn: 'bg-amber-600 hover:bg-amber-700',
    },
  };

  const s = styles[type] || styles.danger;

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <div className="w-full max-w-sm bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="p-6 text-center">
          <div className={`inline-flex p-3 rounded-2xl mb-4 ${s.iconBg}`}>{s.icon}</div>
          <h3 className="text-lg font-display font-bold text-zinc-900 dark:text-zinc-50 mb-2">{title}</h3>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">{message}</p>
        </div>
        <div className="flex gap-3 px-6 pb-6">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
            Cancelar
          </button>
          <button onClick={() => { onConfirm(); onClose(); }} className={`flex-1 py-2.5 rounded-xl text-sm font-semibold text-white transition-colors ${s.confirmBtn}`}>
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
