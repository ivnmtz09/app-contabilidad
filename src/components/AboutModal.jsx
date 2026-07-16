import { useTranslation } from 'react-i18next';
import { Wallet, TrendingUp, Target, CreditCard, StickyNote, CalendarClock, X } from 'lucide-react';

const colorMap = {
  violet: { bg: 'bg-violet-100 dark:bg-violet-900/30', text: 'text-violet-600 dark:text-violet-400' },
  emerald: { bg: 'bg-emerald-100 dark:bg-emerald-900/30', text: 'text-emerald-600 dark:text-emerald-400' },
  amber: { bg: 'bg-amber-100 dark:bg-amber-900/30', text: 'text-amber-600 dark:text-amber-400' },
  rose: { bg: 'bg-rose-100 dark:bg-rose-900/30', text: 'text-rose-600 dark:text-rose-400' },
  blue: { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-600 dark:text-blue-400' },
  zinc: { bg: 'bg-zinc-100 dark:bg-zinc-800', text: 'text-zinc-600 dark:text-zinc-400' },
};

export default function AboutModal({ isOpen, onClose }) {
  const { t } = useTranslation();
  if (!isOpen) return null;

  const features = [
    { key: 'f1', icon: Wallet, color: 'violet' },
    { key: 'f2', icon: TrendingUp, color: 'emerald' },
    { key: 'f3', icon: Target, color: 'amber' },
    { key: 'f4', icon: CreditCard, color: 'rose' },
    { key: 'f5', icon: StickyNote, color: 'blue' },
    { key: 'f6', icon: CalendarClock, color: 'blue' },
  ];

  const comingSoon = [];

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="w-full max-w-md bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border border-zinc-200/50 dark:border-zinc-800/50 rounded-3xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        <div className="p-4 border-b border-zinc-200/50 dark:border-zinc-800/50 flex justify-between items-center bg-white/50 dark:bg-zinc-900/50">
          <h2 className="font-display font-bold text-lg text-zinc-900 dark:text-zinc-50">{t('drawer.about')}</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-500 transition-colors">
            <X size={20} />
          </button>
        </div>
        <div className="p-6 overflow-y-auto custom-scrollbar">
          <h3 className="text-xl font-display font-bold text-violet-600 dark:text-violet-500 mb-2">{t('about.title')}</h3>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-6">{t('about.subtitle')}</p>

          <div className="space-y-5">
            {features.map(({ key, icon: Icon, color }) => (
              <div key={key} className="flex gap-4">
                <div className={`mt-1 p-2.5 rounded-2xl h-fit ${colorMap[color].bg} ${colorMap[color].text}`}><Icon size={22} /></div>
                <div>
                  <h4 className="font-bold text-zinc-900 dark:text-zinc-50">{t(`about.${key}.title`)}</h4>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">{t(`about.${key}.desc`)}</p>
                </div>
              </div>
            ))}
          </div>

          {comingSoon.length > 0 && (
            <>
              <div className="flex items-center gap-3 my-6">
                <div className="h-px flex-1 bg-zinc-200 dark:bg-zinc-800"/>
                <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Próximamente</span>
                <div className="h-px flex-1 bg-zinc-200 dark:bg-zinc-800"/>
              </div>
              <div className="space-y-5 opacity-60">
                {comingSoon.map(({ key, icon: Icon, color }) => (
                  <div key={key} className="flex gap-4">
                    <div className={`mt-1 p-2.5 rounded-2xl h-fit ${colorMap[color].bg} ${colorMap[color].text}`}><Icon size={22} /></div>
                    <div>
                      <h4 className="font-bold text-zinc-900 dark:text-zinc-50">{t(`about.${key}.title`)}</h4>
                      <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">{t(`about.${key}.desc`)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
        <div className="p-4 border-t border-zinc-200/50 dark:border-zinc-800/50 bg-white/50 dark:bg-zinc-900/50">
          <button onClick={onClose} className="w-full py-3 bg-violet-600 hover:bg-violet-700 text-white rounded-xl font-semibold transition-colors">
            {t('about.close')}
          </button>
        </div>
      </div>
    </div>
  );
}
