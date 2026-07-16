import { useState, useEffect } from 'react';
import { collection, addDoc, onSnapshot, deleteDoc, updateDoc, doc, query, orderBy } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Trash2, Plus, ArrowLeft, CheckCircle2, CircleDollarSign, HandCoins } from 'lucide-react';
import toast from 'react-hot-toast';

export function DeudasView() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('debo');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!auth.currentUser) return;
    const q = query(collection(db, `users/${auth.currentUser.uid}/debts`), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, (snap) => setItems(snap.docs.map(d => ({ id: d.id, ...d.data() }))));
    return () => unsub();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!name.trim() || !amount) return;
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, `users/${auth.currentUser.uid}/debts`), {
        name: name.trim(),
        amount: Number(amount),
        description: description.trim(),
        type,
        paid: false,
        createdAt: new Date().toISOString()
      });
      setName(''); setAmount(''); setDescription(''); setType('debo');
      toast.success(t('debts.created') || "Deuda registrada");
    } catch (err) { toast.error("Error al registrar deuda"); }
    finally { setIsSubmitting(false); }
  };

  const handleTogglePaid = async (item) => {
    try {
      await updateDoc(doc(db, `users/${auth.currentUser.uid}/debts`, item.id), { paid: !item.paid });
      toast.success(item.paid ? (t('debts.reopened') || "Reabierta") : (t('debts.paid') || "Marcada como pagada"));
    } catch (err) { toast.error("Error al actualizar"); }
  };

  const handleDelete = async (id) => {
    if (window.confirm(t('debts.confirmDelete') || "¿Eliminar esta deuda?")) {
      await deleteDoc(doc(db, `users/${auth.currentUser.uid}/debts`, id));
    }
  };

  const pending = items.filter(i => !i.paid);
  const paid = items.filter(i => i.paid);

  const totalDebo = pending.filter(i => i.type === 'debo').reduce((s, i) => s + i.amount, 0);
  const totalMeDeben = pending.filter(i => i.type === 'me_deben').reduce((s, i) => s + i.amount, 0);

  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-6 pb-24">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => navigate(-1)} className="p-3 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-2xl shadow-sm hover:shadow-md transition-all text-zinc-700 dark:text-zinc-300">
          <ArrowLeft size={20}/>
        </button>
        <div>
          <h1 className="text-2xl font-display font-bold text-zinc-900 dark:text-zinc-50">{t('debts.title') || 'Gestión de Deudas'}</h1>
          <p className="text-sm text-zinc-500">{t('debts.desc') || 'Registra a quién le debes y quién te debe.'}</p>
        </div>
      </div>

      {items.length > 0 && (
        <div className="grid grid-cols-2 gap-3 mb-8">
          <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl p-4 rounded-2xl border border-zinc-200/50 dark:border-zinc-800/50 shadow-sm text-center">
            <p className="text-xs font-semibold text-zinc-500 uppercase mb-1">{t('debts.iOwe') || 'Yo Debo'}</p>
            <p className="text-xl font-bold text-rose-500">${totalDebo.toLocaleString()}</p>
          </div>
          <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl p-4 rounded-2xl border border-zinc-200/50 dark:border-zinc-800/50 shadow-sm text-center">
            <p className="text-xs font-semibold text-zinc-500 uppercase mb-1">{t('debts.owedToMe') || 'Me Deben'}</p>
            <p className="text-xl font-bold text-emerald-500">${totalMeDeben.toLocaleString()}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleAdd} className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl p-4 sm:p-5 rounded-3xl shadow-sm border border-zinc-200/50 dark:border-zinc-800/50 flex flex-col gap-4 mb-8">
        <div className="flex gap-2">
          <button type="button" onClick={() => setType('debo')} className={`flex-1 py-2.5 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 ${type === 'debo' ? 'bg-rose-500 text-white shadow-sm' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700'}`}>
            <CircleDollarSign size={16}/> {t('debts.iOwe') || 'Yo Debo'}
          </button>
          <button type="button" onClick={() => setType('me_deben')} className={`flex-1 py-2.5 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 ${type === 'me_deben' ? 'bg-emerald-500 text-white shadow-sm' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700'}`}>
            <HandCoins size={16}/> {t('debts.owedToMe') || 'Me Deben'}
          </button>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <input type="text" placeholder={t('debts.person') || 'Nombre de la persona'} value={name} onChange={(e) => setName(e.target.value)} className="flex-1 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-violet-500 text-sm" required />
          <input type="number" placeholder={t('debts.amount') || 'Monto'} value={amount} onChange={(e) => setAmount(e.target.value)} className="w-full sm:w-32 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-violet-500 text-sm" required />
        </div>
        <input type="text" placeholder={t('debts.description') || 'Descripción (opcional)'} value={description} onChange={(e) => setDescription(e.target.value)} className="w-full bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-violet-500 text-sm" />
        <button type="submit" disabled={isSubmitting} className="w-full bg-violet-600 hover:bg-violet-700 text-white rounded-xl px-5 py-3 font-semibold flex items-center justify-center gap-2 transition-colors disabled:opacity-50">
          <Plus size={20}/> {t('debts.add') || 'Registrar Deuda'}
        </button>
      </form>

      {pending.length > 0 && (
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-zinc-500 uppercase tracking-wide mb-3">{t('debts.pending') || 'Pendientes'}</h3>
          <div className="space-y-3">
            {pending.map(item => (
              <div key={item.id} className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl p-4 rounded-2xl border border-zinc-200/50 dark:border-zinc-800/50 shadow-sm transition-all hover:shadow-md">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-xl ${item.type === 'debo' ? 'bg-rose-100 dark:bg-rose-900/30 text-rose-500' : 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-500'}`}>
                      {item.type === 'debo' ? <CircleDollarSign size={18}/> : <HandCoins size={18}/>}
                    </div>
                    <div>
                      <h4 className="font-bold text-zinc-900 dark:text-zinc-50 text-sm">{item.name}</h4>
                      {item.description && <p className="text-xs text-zinc-500">{item.description}</p>}
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button onClick={() => handleTogglePaid(item)} className="text-zinc-400 hover:text-emerald-500 p-2 rounded-xl transition-colors" title={t('debts.markPaid') || 'Marcar pagada'}>
                      <CheckCircle2 size={20}/>
                    </button>
                    <button onClick={() => handleDelete(item.id)} className="text-zinc-400 hover:text-rose-500 p-2 rounded-xl transition-colors">
                      <Trash2 size={18}/>
                    </button>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${item.type === 'debo' ? 'bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400' : 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400'}`}>
                    {item.type === 'debo' ? (t('debts.iOwe') || 'Yo Debo') : (t('debts.owedToMe') || 'Me Deben')}
                  </span>
                  <p className={`font-bold text-lg ${item.type === 'debo' ? 'text-rose-500' : 'text-emerald-500'}`}>${item.amount.toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {paid.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-zinc-500 uppercase tracking-wide mb-3">{t('debts.paid') || 'Pagadas'} ({paid.length})</h3>
          <div className="space-y-2">
            {paid.map(item => (
              <div key={item.id} className="bg-white/50 dark:bg-zinc-900/50 backdrop-blur-xl p-3 rounded-2xl border border-zinc-200/30 dark:border-zinc-800/30 flex items-center justify-between opacity-60">
                <div className="flex items-center gap-3">
                  <CheckCircle2 size={16} className="text-emerald-500"/>
                  <div>
                    <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300 line-through">{item.name}</p>
                    {item.description && <p className="text-xs text-zinc-400 line-through">{item.description}</p>}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <p className="text-sm font-bold text-zinc-400 line-through">${item.amount.toLocaleString()}</p>
                  <button onClick={() => handleDelete(item.id)} className="text-zinc-300 hover:text-rose-500 p-1 rounded-lg transition-colors">
                    <Trash2 size={14}/>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {items.length === 0 && (
        <div className="text-center py-12">
          <CreditCard size={40} className="mx-auto text-zinc-300 dark:text-zinc-600 mb-3"/>
          <p className="text-sm text-zinc-400">{t('debts.empty') || 'No tienes deudas registradas.'}</p>
        </div>
      )}
    </div>
  );
}
