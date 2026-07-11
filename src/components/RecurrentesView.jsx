import { useState, useEffect } from 'react';
import { collection, addDoc, onSnapshot, deleteDoc, doc, query, orderBy } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { useTranslation } from 'react-i18next';
import { CalendarClock, Trash2, Plus, Repeat } from 'lucide-react';
import toast from 'react-hot-toast';

export function RecurrentesView() {
  const { t } = useTranslation();
  const [items, setItems] = useState([]);
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [frequency, setFrequency] = useState('Mensual');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!auth.currentUser) return;
    const q = query(collection(db, `users/${auth.currentUser.uid}/recurrents`), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, (snap) => setItems(snap.docs.map(d => ({ id: d.id, ...d.data() }))));
    return () => unsub();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!name || !amount) return;
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, `users/${auth.currentUser.uid}/recurrents`), {
        name, amount: Number(amount), frequency, createdAt: new Date().toISOString()
      });
      setName(''); setAmount('');
      toast.success(t('module.saving') || "Guardado");
    } catch (err) { toast.error("Error"); }
    finally { setIsSubmitting(false); }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-6 pb-24">
      <div className="flex items-center gap-4 mb-6">
        <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-2xl text-blue-600 dark:text-blue-400"><CalendarClock size={28}/></div>
        <div>
          <h2 className="text-2xl font-display font-bold text-zinc-900 dark:text-zinc-50">{t('recurrent.title')}</h2>
          <p className="text-sm text-zinc-500">{t('recurrent.desc')}</p>
        </div>
      </div>

      <form onSubmit={handleAdd} className="bg-white dark:bg-zinc-900 p-4 rounded-3xl shadow-sm border border-zinc-200 dark:border-zinc-800 flex flex-col gap-3 mb-8">
        <div className="flex flex-col sm:flex-row gap-3">
          <input type="text" placeholder={t('module.name')} value={name} onChange={(e) => setName(e.target.value)} className="flex-1 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-violet-500" required />
          <input type="number" placeholder={t('module.amount')} value={amount} onChange={(e) => setAmount(e.target.value)} className="w-full sm:w-32 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-violet-500" required />
          <select value={frequency} onChange={(e) => setFrequency(e.target.value)} className="bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-violet-500">
            <option value="Mensual">{t('recurrent.monthly')}</option>
            <option value="Anual">{t('recurrent.yearly')}</option>
          </select>
        </div>
        <button type="submit" disabled={isSubmitting} className="w-full bg-violet-600 hover:bg-violet-700 text-white rounded-xl px-5 py-3 font-semibold flex items-center justify-center gap-2 transition-colors disabled:opacity-50">
          <Plus size={20}/> {t('module.add')}
        </button>
      </form>

      <div className="space-y-3">
        {items.map(item => (
          <div key={item.id} className="flex justify-between items-center bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
            <div>
              <h3 className="font-medium text-zinc-900 dark:text-zinc-50">{item.name}</h3>
              <span className="text-xs text-zinc-500 flex items-center gap-1 mt-1"><Repeat size={12}/> {item.frequency === 'Mensual' ? t('recurrent.monthly') : t('recurrent.yearly')}</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="font-bold text-zinc-900 dark:text-zinc-50">${item.amount.toLocaleString()}</span>
              <button onClick={() => deleteDoc(doc(db, `users/${auth.currentUser.uid}/recurrents`, item.id))} className="text-zinc-400 hover:text-rose-500 p-2"><Trash2 size={18}/></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
