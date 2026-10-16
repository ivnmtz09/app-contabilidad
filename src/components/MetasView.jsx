import { useState, useEffect } from 'react';
import { collection, addDoc, onSnapshot, deleteDoc, doc, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Trash2, Plus, ArrowUpCircle, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import ConfirmModal from './ConfirmModal';
import AddGoalFundsModal from './AddGoalFundsModal';
import { MetasSkeleton } from './Loaders';

export function MetasView() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [name, setName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, item: null });
  const [fundsModal, setFundsModal] = useState({ isOpen: false, goal: null });
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Guard: esperar a que el usuario esté resuelto
    if (!user) {
      setItems([]);
      setAccounts([]);
      return;
    }

    const qGoals = query(collection(db, `users/${user.uid}/goals`), orderBy('createdAt', 'desc'));
    const unsubGoals = onSnapshot(
      qGoals,
      (snap) => {
        setItems(snap.docs.map(d => ({ id: d.id, ...d.data() })));
        setIsLoaded(true);
      },
      (error) => {
        console.error("Error al cargar metas:", error);
        toast.error("Error de permisos o conexión al cargar metas");
        setIsLoaded(true);
      }
    );

    const qAccounts = query(collection(db, `users/${user.uid}/accounts`));
    const unsubAccounts = onSnapshot(
      qAccounts,
      (snap) => {
        setAccounts(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      },
      (error) => {
        console.error("Error al cargar cuentas en metas:", error);
      }
    );

    return () => {
      unsubGoals();
      unsubAccounts();
    };
  }, [user]);

  if (!isLoaded) return <MetasSkeleton />;

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error("Debes iniciar sesión para crear metas");
      return;
    }
    if (!name.trim()) { toast.error(t('goals.nameRequired') || 'Ingresa un nombre para la meta'); return; }
    if (!targetAmount || Number(targetAmount) <= 0) { toast.error(t('goals.amountRequired') || 'Ingresa un monto objetivo válido'); return; }
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, `users/${user.uid}/goals`), {
        name: name.trim(), targetAmount: Number(targetAmount), savedAmount: 0, createdAt: new Date().toISOString()
      });
      setName(''); setTargetAmount('');
      toast.success("Meta creada exitosamente");
    } catch (err) {
      console.error("Error al crear la meta:", err);
      toast.error("Error al crear la meta");
    }
    finally { setIsSubmitting(false); }
  };

  const handleOpenFundsModal = (goal) => {
    setFundsModal({ isOpen: true, goal });
  };

  const handleDeleteGoal = async () => {
    if (!user || !confirmModal.item?.id) return;
    try {
      await deleteDoc(doc(db, `users/${user.uid}/goals`, confirmModal.item.id));
      toast.success("Meta eliminada");
    } catch (err) {
      console.error("Error al eliminar meta:", err);
      toast.error("Error al eliminar la meta");
    }
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
        <button type="submit" disabled={isSubmitting} className="w-full bg-amber-600 hover:bg-amber-700 text-white rounded-xl px-5 py-3 font-semibold flex items-center justify-center gap-2 transition-colors disabled:opacity-50 cursor-pointer">
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
                  <button onClick={() => handleOpenFundsModal(item)} className="text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 p-2 rounded-xl transition-colors cursor-pointer" title={t('goals.addFunds') || 'Abonar'}>
                    <ArrowUpCircle size={22}/>
                  </button>
                  <button onClick={() => setConfirmModal({ isOpen: true, item })} className="text-zinc-400 hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-900/20 p-2 rounded-xl transition-colors cursor-pointer">
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

      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ isOpen: false, item: null })}
        onConfirm={handleDeleteGoal}
        title="Eliminar meta"
        message={`¿Eliminar la meta "${confirmModal.item?.name}"?`}
        confirmText="Eliminar"
      />

      <AddGoalFundsModal
        isOpen={fundsModal.isOpen}
        onClose={() => setFundsModal({ isOpen: false, goal: null })}
        goal={fundsModal.goal}
        accounts={accounts}
      />
    </div>
  );
}
