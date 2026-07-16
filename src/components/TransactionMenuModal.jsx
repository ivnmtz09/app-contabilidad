import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, TrendingDown, StickyNote, CalendarClock, ArrowRightLeft, X } from 'lucide-react';

export default function TransactionMenuModal({ isOpen, onClose, onSelectOption }) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleNavigate = (path) => {
    onClose();
    navigate(path);
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="w-full max-w-sm bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border border-white/50 dark:border-zinc-800/50 rounded-[2.5rem] p-6 shadow-2xl animate-fade-up pb-10 sm:pb-6">
        <div className="flex justify-between items-center mb-6 px-2">
          <h2 className="font-display font-bold text-xl text-zinc-900 dark:text-zinc-50">{t('menu.newMovement')}</h2>
          <button onClick={onClose} className="p-2 bg-zinc-100 dark:bg-zinc-800 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 rounded-full transition-colors">
            <X size={20}/>
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button onClick={() => { onSelectOption('ingreso'); onClose(); }} className="flex flex-col items-center justify-center gap-3 bg-white dark:bg-zinc-800/80 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 p-6 rounded-3xl border border-zinc-100 dark:border-zinc-700/50 transition-all hover:scale-[1.02] hover:border-emerald-200 dark:hover:border-emerald-800 group">
            <div className="bg-emerald-100 dark:bg-emerald-900/30 p-4 rounded-2xl text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform">
              <TrendingUp size={28}/>
            </div>
            <span className="font-bold text-sm text-zinc-700 dark:text-zinc-300">{t('menu.income')}</span>
          </button>

          <button onClick={() => { onSelectOption('egreso'); onClose(); }} className="flex flex-col items-center justify-center gap-3 bg-white dark:bg-zinc-800/80 hover:bg-rose-50 dark:hover:bg-rose-900/20 p-6 rounded-3xl border border-zinc-100 dark:border-zinc-700/50 transition-all hover:scale-[1.02] hover:border-rose-200 dark:hover:border-rose-800 group">
            <div className="bg-rose-100 dark:bg-rose-900/30 p-4 rounded-2xl text-rose-600 dark:text-rose-400 group-hover:scale-110 transition-transform">
              <TrendingDown size={28}/>
            </div>
            <span className="font-bold text-sm text-zinc-700 dark:text-zinc-300">{t('menu.expense')}</span>
          </button>

          <button onClick={() => handleNavigate('/recurrentes')} className="flex flex-col items-center justify-center gap-3 bg-white dark:bg-zinc-800/80 hover:bg-blue-50 dark:hover:bg-blue-900/20 p-6 rounded-3xl border border-zinc-100 dark:border-zinc-700/50 transition-all hover:scale-[1.02] hover:border-blue-200 dark:hover:border-blue-800 group">
            <div className="bg-blue-100 dark:bg-blue-900/30 p-4 rounded-2xl text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
              <CalendarClock size={28}/>
            </div>
            <span className="font-bold text-sm text-zinc-700 dark:text-zinc-300">{t('menu.recurrent')}</span>
          </button>

          <button onClick={() => { onSelectOption('transfer'); onClose(); }} className="flex flex-col items-center justify-center gap-3 bg-white dark:bg-zinc-800/80 hover:bg-violet-50 dark:hover:bg-violet-900/20 p-6 rounded-3xl border border-zinc-100 dark:border-zinc-700/50 transition-all hover:scale-[1.02] hover:border-violet-200 dark:hover:border-violet-800 group">
            <div className="bg-violet-100 dark:bg-violet-900/30 p-4 rounded-2xl text-violet-600 dark:text-violet-400 group-hover:scale-110 transition-transform">
              <ArrowRightLeft size={28}/>
            </div>
            <span className="font-bold text-sm text-zinc-700 dark:text-zinc-300">{t('menu.transfer')}</span>
          </button>

          <button onClick={() => handleNavigate('/notas')} className="flex flex-col items-center justify-center gap-3 bg-white dark:bg-zinc-800/80 hover:bg-amber-50 dark:hover:bg-amber-900/20 p-6 rounded-3xl border border-zinc-100 dark:border-zinc-700/50 transition-all hover:scale-[1.02] hover:border-amber-200 dark:hover:border-amber-800 group">
            <div className="bg-amber-100 dark:bg-amber-900/30 p-4 rounded-2xl text-amber-600 dark:text-amber-400 group-hover:scale-110 transition-transform">
              <StickyNote size={28}/>
            </div>
            <span className="font-bold text-sm text-zinc-700 dark:text-zinc-300">{t('menu.note')}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
