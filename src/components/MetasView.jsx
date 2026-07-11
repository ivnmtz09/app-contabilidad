import { useState, useEffect } from 'react';
import { collection, addDoc, onSnapshot, deleteDoc, updateDoc, doc, query, orderBy } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { useTranslation } from 'react-i18next';
import { Target, Trash2, Plus, ArrowUpCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export function MetasView() {
  const { t } = useTranslation();
  const [items, setItems] = useState([]);
  const [name, setName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!auth.currentUser) return;
    const q = query(collection(db, `users/${auth.currentUser.uid}/goals`), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, (snap) => setItems(snap.docs.map(d => ({ id: d.id, ...d.data() }))));
    return () => unsub();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!name || !targetAmount) return;
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, `users/${auth.currentUser.uid}/goals`), {
        name, targetAmount: Number(targetAmount), savedAmount: 0, createdAt: new Date().toISOString()
      });
      setName(''); setTargetAmount('');
      toast.success("Meta creada");
    } catch (err) { toast.error("Error"); }
    finally { setIsSubmitting(false); }
  };

  const handleAddFunds = async (goal) => {
    const amountToAdd = prompt(`${t('goals.addFunds')} - ${goal.name}:`);
    if (!amountToAdd || isNaN(amountToAdd)) return;
    const newSaved = goal.savedAmount + Number(amountToAdd);
    try {
      await updateDoc(doc(db, `users/${auth.currentUser.uid}/goals`, goal.id), { savedAmount: newSaved });
      toast.success("Fondos añadidos");
    } catch (err) { toast.error("Error"); }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-6 pb-24">
      <div className="flex items-center gap-4 mb-6">
        <div className="bg-rose-100 dark:bg-rose-900/30 p-3 rounded-2xl text-rose-600 dark:text-rose-400"><Target size={28}/></div>
        <div>
          <h2 className="text-2xl font-display font-bold text-zinc-900 dark:text-zinc-50">{t('goals.title')}</h2>
          <p className="text-sm text-zinc-500">{t('goals.desc')}</p>
        </div>
      </div>

      <form onSubmit={handleAdd} className="bg-white dark:bg-zinc-900 p-4 rounded-3xl shadow-sm border border-zinc-200 dark:border-zinc-800 flex flex-col gap-3 mb-8">
        <div className="flex flex-col sm:flex-row gap-3">
          <input type="text" placeholder={t('module.name')} value={name} onChange={(e) => setName(e.target.value)} className="flex-1 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-violet-500" required />
          <input type="number" placeholder={t('goals.target')} value={targetAmount} onChange={(e) => setTargetAmount(e.target.value)} className="w-full sm:w-40 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-violet-500" required />
        </div>
        <button type="submit" disabled={isSubmitting} className="w-full bg-violet-600 hover:bg-violet-700 text-white rounded-xl px-5 py-3 font-semibold flex items-center justify-center gap-2 transition-colors">
          <Plus size={20}/> Crear Meta
        </button>
      </form>

      <div className="space-y-4">
        {items.map(item => {
          const progress = Math.min((item.savedAmount / item.targetAmount) * 100, 100).toFixed(0);
          return (
            <div key={item.id} className="bg-white dark:bg-zinc-900 p-5 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-bold text-zinc-900 dark:text-zinc-50 text-lg">{item.name}</h3>
                  <p className="text-sm text-zinc-500">{t('goals.saved')}: <span className="font-semibold text-emerald-500">${item.savedAmount.toLocaleString()}</span> /${item.targetAmount.toLocaleString()}</p>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => handleAddFunds(item)} className="text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 p-2 rounded-xl transition-colors" title={t('goals.addFunds')}><ArrowUpCircle size={22}/></button>
                  <button onClick={() => deleteDoc(doc(db, `users/${auth.currentUser.uid}/goals`, item.id))} className="text-zinc-400 hover:text-rose-500 p-2 rounded-xl transition-colors"><Trash2 size={20}/></button>
                </div>
              </div>
              <div className="w-full bg-zinc-100 dark:bg-zinc-800 rounded-full h-3 mb-1 overflow-hidden">
                <div className="bg-violet-500 h-3 rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
              </div>
              <div className="text-right text-xs font-bold text-violet-500">{progress}%</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
