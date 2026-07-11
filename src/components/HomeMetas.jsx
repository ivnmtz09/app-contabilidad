import { useState, useEffect } from 'react';
import { collection, addDoc, onSnapshot, deleteDoc, updateDoc, doc, query, orderBy } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { useTranslation } from 'react-i18next';
import { Target, Trash2, Plus, ArrowUpCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function HomeMetas() {
  const { t } = useTranslation();
  const [goals, setGoals] = useState([]);
  const [name, setName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');

  useEffect(() => {
    if (!auth.currentUser) return;
    const q = query(collection(db, `users/${auth.currentUser.uid}/goals`), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, (snap) => setGoals(snap.docs.map(d => ({ id: d.id, ...d.data() }))));
    return () => unsub();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!name || !targetAmount) return;
    try {
      await addDoc(collection(db, `users/${auth.currentUser.uid}/goals`), { name, targetAmount: Number(targetAmount), savedAmount: 0, createdAt: new Date().toISOString() });
      setName(''); setTargetAmount(''); toast.success("Meta creada");
    } catch (err) { toast.error("Error"); }
  };

  const handleAddFunds = async (goal) => {
    const amountToAdd = prompt(`${t('goals.addFunds')} - ${goal.name}:`);
    if (!amountToAdd || isNaN(amountToAdd)) return;
    try {
      await updateDoc(doc(db, `users/${auth.currentUser.uid}/goals`, goal.id), { savedAmount: goal.savedAmount + Number(amountToAdd) });
      toast.success("Fondos añadidos");
    } catch (err) { toast.error("Error"); }
  };

  return (
    <div className="mb-8">
      <div className="flex items-center gap-2 mb-4"><Target className="text-rose-500" size={20}/><h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">{t('goals.title') || "Metas de Ahorro"}</h2></div>
      <form onSubmit={handleAdd} className="flex gap-2 mb-4">
        <input type="text" placeholder={t('module.name')} value={name} onChange={(e) => setName(e.target.value)} className="flex-1 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-violet-500" required />
        <input type="number" placeholder={t('goals.target') || "Objetivo"} value={targetAmount} onChange={(e) => setTargetAmount(e.target.value)} className="w-24 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-violet-500" required />
        <button type="submit" className="bg-rose-500 text-white rounded-xl px-3 py-2"><Plus size={18}/></button>
      </form>
      <div className="flex overflow-x-auto gap-4 pb-2 custom-scrollbar snap-x">
        {goals.map(item => {
          const progress = Math.min((item.savedAmount / item.targetAmount) * 100, 100).toFixed(0);
          return (
            <div key={item.id} className="min-w-[260px] bg-white dark:bg-zinc-900 p-4 rounded-3xl border border-zinc-200 dark:border-zinc-800 snap-center shrink-0">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-zinc-900 dark:text-zinc-50 truncate">{item.name}</h3>
                <div className="flex gap-1">
                  <button onClick={() => handleAddFunds(item)} className="text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 p-1 rounded-lg"><ArrowUpCircle size={18}/></button>
                  <button onClick={() => { if(window.confirm("¿Eliminar?")) deleteDoc(doc(db, `users/${auth.currentUser.uid}/goals`, item.id)) }} className="text-zinc-400 hover:text-rose-500 p-1 rounded-lg"><Trash2 size={18}/></button>
                </div>
              </div>
              <p className="text-xs text-zinc-500 mb-2">${item.savedAmount.toLocaleString()} /${item.targetAmount.toLocaleString()}</p>
              <div className="w-full bg-zinc-100 dark:bg-zinc-800 rounded-full h-2 mb-1 overflow-hidden"><div className="bg-rose-500 h-2 rounded-full transition-all" style={{ width: `${progress}%` }}></div></div>
              <div className="text-right text-[10px] font-bold text-rose-500">{progress}%</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
