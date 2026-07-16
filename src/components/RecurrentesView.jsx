import { useState, useEffect } from 'react';
import { collection, addDoc, updateDoc, onSnapshot, deleteDoc, doc, query, orderBy } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { useTranslation } from 'react-i18next';
import { CalendarClock, Trash2, Plus, Repeat, Pencil, CreditCard, X, CalendarDays } from 'lucide-react';
import toast from 'react-hot-toast';
import ConfirmModal from './ConfirmModal';

export function RecurrentesView() {
  const { t } = useTranslation();
  const [items, setItems] = useState([]);
  const [accounts, setAccounts] = useState([]);

  // Form states
  const [editingId, setEditingId] = useState(null);
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [frequency, setFrequency] = useState('Mensual');
  const [billingDate, setBillingDate] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, id: null });

  // Payment Modal states
  const [paymentModal, setPaymentModal] = useState({ isOpen: false, item: null, accountId: '' });

  useEffect(() => {
    if (!auth.currentUser) return;

    const qRecurrents = query(collection(db, `users/${auth.currentUser.uid}/recurrents`), orderBy('createdAt', 'desc'));
    const unsubRecurrents = onSnapshot(qRecurrents, (snap) => setItems(snap.docs.map(d => ({ id: d.id, ...d.data() }))));

    const qAccounts = query(collection(db, `users/${auth.currentUser.uid}/accounts`));
    const unsubAccounts = onSnapshot(qAccounts, (snap) => setAccounts(snap.docs.map(d => ({ id: d.id, ...d.data() }))));

    return () => {
      unsubRecurrents();
      unsubAccounts();
    };
  }, []);

  const handleAddOrUpdate = async (e) => {
    e.preventDefault();
    if (!name.trim()) { toast.error(t('recurrent.nameRequired') || 'Ingresa un nombre para la suscripción'); return; }
    if (!amount || Number(amount) <= 0) { toast.error(t('recurrent.amountRequired') || 'Ingresa un monto válido'); return; }
    if (!billingDate) { toast.error(t('recurrent.dateRequired') || 'Selecciona una fecha de cobro'); return; }
    setIsSubmitting(true);
    try {
      if (editingId) {
        await updateDoc(doc(db, `users/${auth.currentUser.uid}/recurrents`, editingId), {
          name, amount: Number(amount), frequency, billingDate
        });
        setEditingId(null);
        toast.success(t('profile.success') || "Actualizado");
      } else {
        await addDoc(collection(db, `users/${auth.currentUser.uid}/recurrents`), {
          name, amount: Number(amount), frequency, billingDate, createdAt: new Date().toISOString()
        });
        toast.success(t('module.saving') || "Guardado");
      }
      setName(''); setAmount(''); setFrequency('Mensual'); setBillingDate('');
    } catch (err) {
      toast.error("Error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setName(item.name);
    setAmount(item.amount);
    setFrequency(item.frequency);
    setBillingDate(item.billingDate || '');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setName(''); setAmount(''); setFrequency('Mensual'); setBillingDate('');
  };

  const confirmPayment = async () => {
    if (!paymentModal.accountId) {
      toast.error(t('recurrent.selectAccount'));
      return;
    }
    try {
      await addDoc(collection(db, `users/${auth.currentUser.uid}/transactions`), {
        type: 'egreso',
        amount: Number(paymentModal.item.amount),
        description: `Pago suscripción: ${paymentModal.item.name}`,
        accountId: paymentModal.accountId,
        date: new Date().toISOString()
      });
      toast.success(t('recurrent.paymentSuccess'));
      setPaymentModal({ isOpen: false, item: null, accountId: '' });
    } catch(e) {
      toast.error("Error");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-6 pb-24 relative">
      <div className="flex items-center gap-4 mb-6">
        <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-2xl text-blue-600 dark:text-blue-400">
          <CalendarClock size={28}/>
        </div>
        <div>
          <h2 className="text-2xl font-display font-bold text-zinc-900 dark:text-zinc-50">{t('recurrent.title')}</h2>
          <p className="text-sm text-zinc-500">{t('recurrent.desc')}</p>
        </div>
      </div>

      <form onSubmit={handleAddOrUpdate} className="bg-white dark:bg-zinc-900 p-4 sm:p-5 rounded-3xl shadow-sm border border-zinc-200 dark:border-zinc-800 flex flex-col gap-4 mb-8">
        <div className="flex flex-col sm:flex-row gap-3">
          <input type="text" placeholder={t('module.name')} value={name} onChange={(e) => setName(e.target.value)} className="flex-1 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-violet-500" required />
          <input type="number" placeholder={t('module.amount')} value={amount} onChange={(e) => setAmount(e.target.value)} className="w-full sm:w-32 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-violet-500" required />
          <select value={frequency} onChange={(e) => setFrequency(e.target.value)} className="bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-violet-500">
            <option value="Mensual">{t('recurrent.monthly')}</option>
            <option value="Anual">{t('recurrent.yearly')}</option>
          </select>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 flex items-center gap-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-3">
            <CalendarDays size={16} className="text-zinc-400 shrink-0"/>
            <input type="date" value={billingDate} onChange={(e) => setBillingDate(e.target.value)} className="flex-1 bg-transparent outline-none text-sm text-zinc-900 dark:text-zinc-50"/>
          </div>
        </div>
        <div className="flex gap-2">
          {editingId && (
            <button type="button" onClick={handleCancelEdit} className="w-1/3 bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 rounded-xl px-5 py-3 font-semibold transition-colors">
              {t('recurrent.cancelEdit')}
            </button>
          )}
          <button type="submit" disabled={isSubmitting} className={`${editingId ? 'w-2/3' : 'w-full'} bg-violet-600 hover:bg-violet-700 text-white rounded-xl px-5 py-3 font-semibold flex items-center justify-center gap-2 transition-colors disabled:opacity-50`}>
            {editingId ? <Pencil size={20}/> : <Plus size={20}/>}
            {editingId ? t('recurrent.update') : t('module.add')}
          </button>
        </div>
      </form>

      <div className="space-y-3">
        {items.map(item => (
          <div key={item.id} className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
            <div>
              <h3 className="font-bold text-zinc-900 dark:text-zinc-50 text-lg">{item.name}</h3>
              <div className="flex flex-wrap items-center gap-2 mt-1">
                <span className="text-sm text-zinc-500 flex items-center gap-1">
                  <Repeat size={14}/> {item.frequency === 'Mensual' ? t('recurrent.monthly') : t('recurrent.yearly')}
                </span>
                {item.billingDate && (
                  <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <CalendarDays size={12}/> {new Date(item.billingDate + 'T00:00:00').toLocaleDateString()}
                  </span>
                )}
              </div>
            </div>
            <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto">
              <span className="font-bold text-zinc-900 dark:text-zinc-50 text-lg">${item.amount.toLocaleString()}</span>
              <div className="flex items-center gap-1">
                <button onClick={() => setPaymentModal({ isOpen: true, item, accountId: accounts[0]?.id || '' })} className="text-emerald-600 bg-emerald-100 hover:bg-emerald-200 dark:bg-emerald-900/30 dark:hover:bg-emerald-900/50 dark:text-emerald-400 p-2 rounded-lg transition-colors" title={t('recurrent.pay')}>
                  <CreditCard size={18}/>
                </button>
                <button onClick={() => handleEdit(item)} className="text-zinc-400 hover:text-violet-500 hover:bg-violet-50 dark:hover:bg-violet-900/20 p-2 rounded-lg transition-colors">
                  <Pencil size={18}/>
                </button>
                <button onClick={() => setConfirmModal({ isOpen: true, id: item.id })} className="text-zinc-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 p-2 rounded-lg transition-colors">
                  <Trash2 size={18}/>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {paymentModal.isOpen && (
        <div className="fixed inset-0 z-[60] flex justify-center items-start sm:items-center pt-2 sm:pt-0 bg-black/40 backdrop-blur-sm px-2 sm:px-0">
          <div className="w-full max-w-sm bg-white dark:bg-zinc-900 rounded-3xl shadow-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden mt-2 sm:mt-0">
            <div className="p-4 border-b border-zinc-100 dark:border-zinc-800 flex justify-between items-center bg-zinc-50 dark:bg-zinc-950">
              <h2 className="font-bold text-lg text-zinc-900 dark:text-zinc-50">{t('recurrent.payConfirmTitle')}</h2>
              <button onClick={() => setPaymentModal({ isOpen: false, item: null, accountId: '' })} className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200">
                <X size={20}/>
              </button>
            </div>
            <div className="p-5">
              <p className="text-zinc-600 dark:text-zinc-400 text-sm mb-4">{t('recurrent.payConfirmDesc')}</p>
              <div className="bg-zinc-50 dark:bg-zinc-800 p-3 rounded-xl mb-4 border border-zinc-200 dark:border-zinc-700">
                <p className="font-semibold text-zinc-900 dark:text-zinc-50">{paymentModal.item?.name}</p>
                <p className="text-rose-600 font-bold">${paymentModal.item?.amount.toLocaleString()}</p>
              </div>
              <select
                value={paymentModal.accountId}
                onChange={(e) => setPaymentModal({...paymentModal, accountId: e.target.value})}
                className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-3 mb-6 outline-none focus:ring-2 focus:ring-violet-500"
              >
                <option value="" disabled>{t('recurrent.selectAccount')}</option>
                {accounts.map(acc => (
                  <option key={acc.id} value={acc.id}>{acc.name} (${acc.balance.toLocaleString()})</option>
                ))}
              </select>
              <div className="flex gap-3">
                <button onClick={() => setPaymentModal({ isOpen: false, item: null, accountId: '' })} className="flex-1 py-3 rounded-xl font-semibold bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors">
                  {t('recurrent.cancel')}
                </button>
                <button onClick={confirmPayment} className="flex-1 py-3 rounded-xl font-semibold bg-violet-600 hover:bg-violet-700 text-white transition-colors">
                  {t('recurrent.confirm')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ isOpen: false, id: null })}
        onConfirm={() => deleteDoc(doc(db, `users/${auth.currentUser.uid}/recurrents`, confirmModal.id))}
        title="Eliminar suscripción"
        message="¿Estás seguro de que deseas eliminar esta suscripción?"
        confirmText="Eliminar"
      />
    </div>
  );
}
