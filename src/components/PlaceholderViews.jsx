import { useTranslation } from 'react-i18next';
import { CalendarClock, Target, CreditCard } from 'lucide-react';

export function RecurrentesView() {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col items-center justify-center h-[70vh] text-center px-6">
      <div className="bg-blue-100 dark:bg-blue-900/30 p-4 rounded-full text-blue-600 dark:text-blue-400 mb-4"><CalendarClock size={48} /></div>
      <h2 className="text-2xl font-display font-bold text-zinc-900 dark:text-zinc-50 mb-2">{t('recurrent.title')}</h2>
      <p className="text-zinc-500 dark:text-zinc-400 max-w-sm">{t('recurrent.desc')}</p>
    </div>
  );
}

export function MetasView() {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col items-center justify-center h-[70vh] text-center px-6">
      <div className="bg-rose-100 dark:bg-rose-900/30 p-4 rounded-full text-rose-600 dark:text-rose-400 mb-4"><Target size={48} /></div>
      <h2 className="text-2xl font-display font-bold text-zinc-900 dark:text-zinc-50 mb-2">{t('goals.title')}</h2>
      <p className="text-zinc-500 dark:text-zinc-400 max-w-sm">{t('goals.desc')}</p>
    </div>
  );
}

export function DeudasView() {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col items-center justify-center h-[70vh] text-center px-6">
      <div className="bg-amber-100 dark:bg-amber-900/30 p-4 rounded-full text-amber-600 dark:text-amber-400 mb-4"><CreditCard size={48} /></div>
      <h2 className="text-2xl font-display font-bold text-zinc-900 dark:text-zinc-50 mb-2">{t('debts.title')}</h2>
      <p className="text-zinc-500 dark:text-zinc-400 max-w-sm">{t('debts.desc')}</p>
    </div>
  );
}
