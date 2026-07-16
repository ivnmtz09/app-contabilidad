import { useState, useEffect } from 'react';
import { collection, addDoc, onSnapshot, deleteDoc, updateDoc, doc, query, orderBy } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Trash2, Plus, ArrowUpCircle, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';

export function MetasView() {
  const { t } = useTranslation();
  const navigate = useNavigate();
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
      toast.success("Meta creada exitosamente");
    } catch (err) { toast.error("Error al crear la meta"); }
    finally { setIsSubmitting(false); }
  };

  const handleAddFunds = async (goal) => {
    const amountToAdd = prompt(`${t('goals.addFunds')} - ${goal.name}:`);
    if (!amountToAdd || isNaN(amountToAdd)) return;
    const newSaved = goal.savedAmount + Number(amountToAdd);
    try {
      await updateDoc(doc(db, `users/${auth.currentUser.uid}/goals`, goal.id), { savedAmount: newSaved });
      toast.success("Fondos añadidos");
    } catch (err) { toast.error("Error al añadir fondos"); }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-6 pb-24">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => navigate(-1)} className="p-3 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-2xl shadow-sm hover:shadow-md transition-all text-zinc-700 dark:text-zinc-300">
          <ArrowLeft size={20}/>
        </button>
        <div>
          <h1 className="text-2xl font-display font-bold text-zinc-900 dark:text-zinc-50">
            {t('goals.title') || 'Metas de Ahorro'}
          </h1>
          <p className="text-sm text-zinc-500">
            {t('goals.desc') || 'Establece objetivos y ahorra para ellos.'}
          </p>
        </div>
      </div>

        <form onSubmit={handleAdd} className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl p-4 sm:p-5 rounded-3xl shadow-sm border border-zinc-200/50 dark:border-zinc-800/50 flex flex-col gap-4 mb-8">
          <div className="flex flex-col sm:flex-row gap-3">
            <input type="text" placeholder={t('module.name') || 'Nombre de la meta'} value={name} onChange={(e) => setName(e.target.value)} className="flex-1 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-amber-500" required />
            <input type="number" placeholder={t('goals.target') || 'Monto Objetivo'} value={targetAmount} onChange={(e) => setTargetAmount(e.target.value)} className="w-full sm:w-40 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-amber-500" required />
          </div>
          <button type="submit" disabled={isSubmitting} className="w-full bg-amber-600 hover:bg-amber-700 text-white rounded-xl px-5 py-3 font-semibold flex items-center justify-center gap-2 transition-colors disabled:opacity-50">
            <Plus size={20}/> {t('module.add') || 'Crear Meta'}
          </button>
        </form>

        <div className="space-y-4">
          {items.map(item => {
            const progress = Math.min((item.savedAmount / item.targetAmount) * 100, 100).toFixed(0);
            return (
              <div key={item.id} className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl p-5 rounded-3xl border border-zinc-200/50 dark:border-zinc-800/50 shadow-sm transition-all hover:shadow-md">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-zinc-900 dark:text-zinc-50 text-lg">{item.name}</h3>
                    <p className="text-sm text-zinc-500">{t('goals.saved') || 'Ahorrado'}: <span className="font-semibold text-emerald-500">${item.savedAmount.toLocaleString()}</span> /${item.targetAmount.toLocaleString()}</p>
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => handleAddFunds(item)} className="text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 p-2 rounded-xl transition-colors" title={t('goals.addFunds') || 'Abonar'}>
                      <ArrowUpCircle size={22}/>
                    </button>
                    <button onClick={() => { if(window.confirm("¿Eliminar esta meta?")) deleteDoc(doc(db, `users/${auth.currentUser.uid}/goals`, item.id)) }} className="text-zinc-400 hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-900/20 p-2 rounded-xl transition-colors">
                      <Trash2 size={20}/>
                    </button>
                  </div>
                </div>
                <div className="w-full bg-zinc-200 dark:bg-zinc-800 rounded-full h-3 mb-1 overflow-hidden">
                  <div className="bg-amber-500 h-3 rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
                </div>
                <div className="text-right text-xs font-bold text-amber-500">{progress}%</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
