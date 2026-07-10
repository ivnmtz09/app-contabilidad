import { useTranslation } from 'react-i18next';
import { Wallet, TrendingUp, CalendarClock, Target, X } from 'lucide-react';

export default function AboutModal({ isOpen, onClose }) {
  const { t } = useTranslation();
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-3xl shadow-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-4 border-b border-zinc-100 dark:border-zinc-800 flex justify-between items-center bg-zinc-50/50 dark:bg-zinc-950/50">
          <h2 className="font-display font-bold text-lg text-zinc-900 dark:text-zinc-50">{t('drawer.about')}</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-500 transition-colors">
            <X size={20} />
          </button>
        </div>
        <div className="p-6 overflow-y-auto custom-scrollbar">
          <h3 className="text-xl font-display font-bold text-violet-600 dark:text-violet-500 mb-2">{t('about.title')}</h3>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-6">{t('about.subtitle')}</p>

          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="mt-1 bg-violet-100 dark:bg-violet-900/30 p-2.5 rounded-2xl h-fit text-violet-600 dark:text-violet-400"><Wallet size={22} /></div>
              <div>
                <h4 className="font-bold text-zinc-900 dark:text-zinc-50">{t('about.f1.title')}</h4>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">{t('about.f1.desc')}</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="mt-1 bg-emerald-100 dark:bg-emerald-900/30 p-2.5 rounded-2xl h-fit text-emerald-600 dark:text-emerald-400"><TrendingUp size={22} /></div>
              <div>
                <h4 className="font-bold text-zinc-900 dark:text-zinc-50">{t('about.f2.title')}</h4>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">{t('about.f2.desc')}</p>
              </div>
            </div>
            <div className="flex gap-4 opacity-75">
              <div className="mt-1 bg-blue-100 dark:bg-blue-900/30 p-2.5 rounded-2xl h-fit text-blue-600 dark:text-blue-400"><CalendarClock size={22} /></div>
              <div>
                <h4 className="font-bold text-zinc-900 dark:text-zinc-50">{t('about.f3.title')}</h4>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">{t('about.f3.desc')}</p>
              </div>
            </div>
            <div className="flex gap-4 opacity-75">
              <div className="mt-1 bg-rose-100 dark:bg-rose-900/30 p-2.5 rounded-2xl h-fit text-rose-600 dark:text-rose-400"><Target size={22} /></div>
              <div>
                <h4 className="font-bold text-zinc-900 dark:text-zinc-50">{t('about.f4.title')}</h4>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">{t('about.f4.desc')}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="p-4 border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/50">
          <button onClick={onClose} className="w-full py-3 bg-violet-600 hover:bg-violet-700 text-white rounded-xl font-semibold transition-colors">
            {t('about.close')}
          </button>
        </div>
      </div>
    </div>
  );
}
