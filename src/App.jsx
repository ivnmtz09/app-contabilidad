import { useState, useEffect, lazy, Suspense } from "react";
import { Menu, ArrowUpCircle, ArrowDownCircle, Pencil, Trash2, Ban, ArrowRightLeft } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate, Routes, Route, useLocation } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";
import { auth, db } from "./firebase";
import { collection, doc, setDoc, addDoc, updateDoc, deleteDoc, onSnapshot, query, orderBy, increment } from "firebase/firestore";
import Login from "./components/Login";
import Drawer from "./layout/Drawer";
import AccountsCard from "./components/AccountsCard";
import AddAccountModal from "./components/AddAccountModal";
import TransactionModal from "./components/TransactionModal";
import MovementsView from "./components/MovementsView";
import { ProgressBar, HomeSkeleton, ListSkeleton } from "./components/Loaders";
import SplashScreen from "./layout/SplashScreen";
import ProfilePage from "./pages/ProfilePage";
import BalanceChart from "./components/BalanceChart";
import Logo from "./components/Logo";
import WalletHeroSvg from "./components/WalletHeroSvg";
import LeatherWallet from "./components/LeatherWallet";

import BottomNav from "./layout/BottomNav";
import { formatCurrency } from "./utils/format";
import TransactionMenuModal from "./components/TransactionMenuModal";
import ConfirmModal from "./components/ConfirmModal";
import TransferModal from "./components/TransferModal";
import { RouteChangeLoader } from "./components/RouteChangeLoader";
import ScrollToTop from "./components/ScrollToTop";
import { useAuth } from "./context/AuthContext";


// Lazy-load vistas secundarias para reducir el bundle inicial
const RecurrentesView = lazy(() => import("./components/RecurrentesView").then(m => ({ default: m.RecurrentesView })));
const NotasView       = lazy(() => import("./components/NotasView").then(m => ({ default: m.NotasView })));
const DeudasView      = lazy(() => import("./components/DeudasView").then(m => ({ default: m.DeudasView })));
const MetasView       = lazy(() => import("./components/MetasView").then(m => ({ default: m.MetasView })));

function App() {
  const { user, isAuthLoading } = useAuth();
  const isLoading = isAuthLoading;
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [accounts, setAccounts] = useState([]);
  const [isAddAccountOpen, setIsAddAccountOpen] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [transactionModalOpen, setTransactionModalOpen] = useState(false);
  const [transactionType, setTransactionType] = useState("ingreso");
  const [editTransaction, setEditTransaction] = useState(null);

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, title: '', message: '', onConfirm: () => {}, type: 'danger' });
  const [isTransferOpen, setIsTransferOpen] = useState(false);

  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!user) return;

    const accountsQuery = query(
      collection(db, `users/${user.uid}/accounts`),
      orderBy("name")
    );

    const transactionsQuery = query(
      collection(db, `users/${user.uid}/transactions`),
      orderBy("date", "desc")
    );

    const unsubAccounts = onSnapshot(accountsQuery, async (snapshot) => {
      const accountsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      const hasEfectivo = accountsData.some(acc => acc.id === "efectivo");
      if (!hasEfectivo && accountsData.length === 0) {
        try {
          await setDoc(doc(db, "users", user.uid, "accounts", "efectivo"), { name: "Efectivo", balance: 0 });
        } catch (e) { console.error("Error creando efectivo:", e); }
      } else {
        setAccounts(accountsData);
      }
    }, (error) => {
      console.error("Error en cuentas de Firestore:", error);
      if (error.code === 'permission-denied') {
        toast.error("Permisos de Firestore insuficientes. Asegúrate de publicar las reglas de seguridad en Firebase.");
      }
      setIsDataLoaded(true);
    });

    const unsubTransactions = onSnapshot(transactionsQuery, (snapshot) => {
      const transactionsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setTransactions(transactionsData);
      setIsDataLoaded(true);
    }, (error) => {
      console.error("Error en transacciones de Firestore:", error);
      if (error.code === 'permission-denied') {
        toast.error("Permisos de lectura insuficientes en Firestore.");
      }
      setIsDataLoaded(true);
    });

    return () => {
      unsubAccounts();
      unsubTransactions();
    };
  }, [user]);

  const handleAddAccount = async (name) => {
    if (!user) return;
    try {
      await addDoc(collection(db, "users", user.uid, "accounts"), {
        name,
        balance: 0,
      });
      setIsAddAccountOpen(false);
    } catch (err) {
      console.error("Error adding account:", err);
    }
  };

  const handleSaveTransaction = async (data) => {
    if (!user) return;
    try {
      const finalAmount = Number(data.amount);
      const isEditing = !!data.id;

      const transactionData = {
        amount: finalAmount,
        description: data.description || "Sin descripción",
        accountId: data.accountId,
        type: data.type,
        date: data.date || new Date().toISOString(),
      };

      if (isEditing) {
        const oldTx = data.oldTransaction;
        if (oldTx?.accountId) {
          const revertAmount = oldTx.type === "ingreso" ? -oldTx.amount : oldTx.amount;
          await updateDoc(doc(db, "users", user.uid, "accounts", oldTx.accountId), {
            balance: increment(revertAmount)
          });
        }

        const newDelta = transactionData.type === "ingreso" ? finalAmount : -finalAmount;
        await updateDoc(doc(db, "users", user.uid, "accounts", data.accountId), {
          balance: increment(newDelta)
        });

        await updateDoc(doc(db, `users/${user.uid}/transactions`, data.id), transactionData);
        toast.success("Movimiento actualizado");
      } else {
        await addDoc(collection(db, `users/${user.uid}/transactions`), transactionData);

        const delta = transactionData.type === "ingreso" ? finalAmount : -finalAmount;
        await updateDoc(doc(db, "users", user.uid, "accounts", data.accountId), {
          balance: increment(delta)
        });
        toast.success("Movimiento registrado");
      }

      setEditTransaction(null);
      setTransactionModalOpen(false);
    } catch (err) {
      console.error("Error fatal al guardar la transacción:", err);
      toast.error("Error al guardar: " + err.message);
    }
  };

  const handleDeleteTransaction = (transaction) => {
    const isTransfer = !!transaction.transferId;
    setConfirmModal({
      isOpen: true,
      title: 'Eliminar movimiento',
      message: isTransfer
        ? `Este movimiento es parte de una transferencia. ¿Deseas eliminar la transferencia completa?`
        : `¿Eliminar el movimiento "${transaction.description}"?`,
      type: 'danger',
      onConfirm: async () => {
        try {
          if (isTransfer) {
            const related = transactions.filter(t => t.transferId === transaction.transferId);
            for (const rel of related) {
              await deleteDoc(doc(db, `users/${user.uid}/transactions`, rel.id));
              const delta = rel.type === "ingreso" ? -rel.amount : rel.amount;
              await updateDoc(doc(db, "users", user.uid, "accounts", rel.accountId), {
                balance: increment(delta)
              });
            }
          } else {
            await deleteDoc(doc(db, `users/${user.uid}/transactions`, transaction.id));
            const delta = transaction.type === "ingreso" ? -transaction.amount : transaction.amount;
            await updateDoc(doc(db, "users", user.uid, "accounts", transaction.accountId), {
              balance: increment(delta)
            });
          }
          toast.success("Movimiento eliminado correctamente");
        } catch (err) {
          console.error("Error al eliminar:", err);
          toast.error("Error al eliminar el movimiento");
        }
      }
    });
  };

  const handleAnnulTransaction = (transaction) => {
    const isTransfer = !!transaction.transferId;
    setConfirmModal({
      isOpen: true,
      title: 'Anular movimiento',
      message: isTransfer
        ? `Este movimiento es parte de una transferencia. ¿Deseas anular la transferencia completa?`
        : `¿Anular el movimiento "${transaction.description}"?`,
      type: 'warning',
      onConfirm: async () => {
        try {
          if (isTransfer) {
            const related = transactions.filter(t => t.transferId === transaction.transferId);
            for (const rel of related) {
              await deleteDoc(doc(db, `users/${user.uid}/transactions`, rel.id));
              const delta = rel.type === "ingreso" ? -rel.amount : rel.amount;
              await updateDoc(doc(db, "users", user.uid, "accounts", rel.accountId), {
                balance: increment(delta)
              });
            }
          } else {
            await deleteDoc(doc(db, `users/${user.uid}/transactions`, transaction.id));
            const delta = transaction.type === "ingreso" ? -transaction.amount : transaction.amount;
            await updateDoc(doc(db, "users", user.uid, "accounts", transaction.accountId), {
              balance: increment(delta)
            });
          }
          toast.success("Movimiento anulado correctamente");
        } catch (err) {
          console.error("Error al anular:", err);
          toast.error("Error al anular el movimiento");
        }
      }
    });
  };

  const openEditModal = (transaction) => {
    setEditTransaction(transaction);
    setTransactionType(transaction.type);
    setTransactionModalOpen(true);
  };

  const handleSelectAction = (type) => {
    if (type === "ingreso" || type === "egreso") {
      setTransactionType(type);
      setTransactionModalOpen(true);
      setIsMenuOpen(false);
    } else if (type === "transfer") {
      setIsTransferOpen(true);
      setIsMenuOpen(false);
    } else {
      toast("Próximamente disponible");
      setIsMenuOpen(false);
    }
  };

  const handleTransfer = async ({ fromAccountId, toAccountId, amount, description }) => {
    if (!user) return;
    try {
      const fromAcc = accounts.find(a => a.id === fromAccountId);
      const toAcc = accounts.find(a => a.id === toAccountId);
      if (!fromAcc || !toAcc) return;

      const numAmount = Number(amount);
      const transferId = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `tr-${Date.now()}`;
      const nowIso = new Date().toISOString();

      await updateDoc(doc(db, "users", user.uid, "accounts", fromAccountId), {
        balance: increment(-numAmount)
      });
      await updateDoc(doc(db, "users", user.uid, "accounts", toAccountId), {
        balance: increment(numAmount)
      });

      await addDoc(collection(db, `users/${user.uid}/transactions`), {
        type: 'egreso', amount: numAmount, description: `Transferencia → ${toAcc.name}: ${description}`,
        accountId: fromAccountId, date: nowIso, transferId
      });
      await addDoc(collection(db, `users/${user.uid}/transactions`), {
        type: 'ingreso', amount: numAmount, description: `Transferencia ← ${fromAcc.name}: ${description}`,
        accountId: toAccountId, date: nowIso, transferId
      });

      toast.success("Transferencia realizada");
    } catch (err) {
      console.error("Error en transferencia:", err);
      toast.error("Error al transferir");
    }
  };

  useEffect(() => {
    const handleOpenMenu = () => setIsMenuOpen(true);
    window.addEventListener('openMenuModal', handleOpenMenu);
    return () => window.removeEventListener('openMenuModal', handleOpenMenu);
  }, []);

  const abrirModal = (tipo) => {
    setTransactionType(tipo);
    setTransactionModalOpen(true);
  };

  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const weekStart = new Date(todayStart);
  weekStart.setDate(weekStart.getDate() - weekStart.getDay());
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  const calcSum = (filterFn) =>
    transactions
      .filter(filterFn)
      .reduce((acc, t) => acc + (t.type === "ingreso" ? t.amount : -t.amount), 0);

  const todaySum = calcSum((t) => new Date(t.date) >= todayStart);
  const weekSum = calcSum((t) => new Date(t.date) >= weekStart);
  const monthSum = calcSum((t) => new Date(t.date) >= monthStart);

  const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);
  const monthIncome = transactions
    .filter((t) => t.type === "ingreso" && new Date(t.date) >= monthStart)
    .reduce((sum, t) => sum + t.amount, 0);
  const monthExpense = transactions
    .filter((t) => t.type === "egreso" && new Date(t.date) >= monthStart)
    .reduce((sum, t) => sum + t.amount, 0);

  const renderHomeDashboard = () => {
    return (
    <div className="mx-auto max-w-7xl grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
      <div className="md:col-span-2">
        <header className="flex justify-between items-center mb-2">
          <div>
            <h1 className="text-2xl sm:text-3xl font-display font-bold text-zinc-900 dark:text-zinc-50 tracking-tight">
              MisCuenta<span className="text-theme-primary">Z</span>
            </h1>
            <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400">
              Control inteligente de tus finanzas personales
            </p>
          </div>
          <button
            onClick={() => navigate('/perfil')}
            className="w-11 h-11 rounded-2xl overflow-hidden border-2 border-white/60 dark:border-zinc-700 hover:border-theme-primary transition-all shadow-sm hover:scale-105 cursor-pointer"
            title="Ir a Perfil"
          >
            {user?.photoURL ? (
              <img src={user.photoURL} alt="Perfil" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-theme-primary flex items-center justify-center text-white font-bold text-sm">
                {user?.displayName?.charAt(0) || 'U'}
              </div>
            )}
          </button>
        </header>
      </div>

      {/* ── HERO CARD — BILLETERA DE CUERO + TARJETA ────────────── */}
      <div className="md:col-span-2 bg-gradient-to-br from-amber-950/90 via-stone-900/95 to-amber-950/90 dark:from-zinc-950 dark:via-zinc-900 dark:to-amber-950/20 backdrop-blur-2xl border border-amber-800/30 dark:border-amber-900/20 rounded-[2rem] shadow-2xl shadow-amber-950/30 p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">

        {/* Fondo textura cuero sutil */}
        <div className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage: `repeating-linear-gradient(
              45deg,
              transparent,
              transparent 2px,
              rgba(139,69,19,0.15) 2px,
              rgba(139,69,19,0.15) 4px
            )`,
          }}
        />
        {/* Orbe ambiental */}
        <div className="absolute -right-16 -bottom-16 w-72 h-72 bg-amber-800/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-10 -top-10 w-48 h-48 bg-amber-900/15 rounded-full blur-2xl pointer-events-none" />

        {/* Columna Izquierda: Info y Acciones */}
        <div className="flex-1 z-10 w-full text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-800/30 border border-amber-700/30 text-amber-300 text-xs font-semibold uppercase tracking-wider mb-4">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            {t('home.totalBalance')}
          </div>

          {/* Ingresos / Egresos del mes */}
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5 sm:gap-3 mb-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-950/50 border border-emerald-800/40 text-emerald-400 text-xs sm:text-sm font-bold">
              <span>+${formatCurrency(monthIncome)}</span>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-950/50 border border-rose-800/40 text-rose-400 text-xs sm:text-sm font-bold">
              <span>-${formatCurrency(monthExpense)}</span>
            </div>
          </div>


          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <button
              onClick={() => setIsMenuOpen(true)}
              className="w-full sm:w-auto bg-theme-primary hover:bg-theme-primary-hover text-white font-sans font-semibold px-6 py-3.5 rounded-2xl transition-all shadow-md glow-primary flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>{t('home.addMovement')}</span>
            </button>
            <button
              onClick={() => setIsTransferOpen(true)}
              className="w-full sm:w-auto bg-amber-900/40 hover:bg-amber-800/50 text-amber-200 border border-amber-700/40 font-sans font-semibold px-5 py-3.5 rounded-2xl transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer hover:border-amber-500/60"
            >
              <ArrowRightLeft size={18} className="text-amber-400" />
              <span>Transferir</span>
            </button>
          </div>
        </div>

        {/* Columna Derecha: Billetera de Cuero Interactiva */}
        <div className="w-full md:w-auto z-10 flex items-center justify-center pt-4 md:pt-0" style={{ minWidth: 240, minHeight: 280 }}>
          <LeatherWallet
            totalBalance={totalBalance}
            userName={user?.displayName || user?.email?.split('@')[0]}
          />
        </div>
      </div>


      {/* Ingresos vs Egresos del Mes */}
      <div className="bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl border border-white/60 dark:border-zinc-800/60 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
        <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 font-display font-semibold uppercase tracking-wider">
          {t('home.monthIncome')}
        </p>
        <p className="text-2xl sm:text-3xl font-display font-bold text-emerald-500 mt-2">
          +${formatCurrency(monthIncome)}
        </p>
      </div>

      <div className="bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl border border-white/60 dark:border-zinc-800/60 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
        <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 font-display font-semibold uppercase tracking-wider">
          {t('home.monthExpense')}
        </p>
        <p className="text-2xl sm:text-3xl font-display font-bold text-rose-500 mt-2">
          -${formatCurrency(monthExpense)}
        </p>
      </div>

      {/* Desglose de Rendimiento Día / Semana / Mes */}
      <div className="md:col-span-2 bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl border border-white/60 dark:border-zinc-800/60 rounded-3xl p-4 sm:p-5 flex justify-around text-center shadow-sm">
        <div>
          <p className="text-xs font-display font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">{t('home.day')}</p>
          <p className="text-sm sm:text-base font-display font-bold text-zinc-800 dark:text-zinc-200 mt-0.5">
            ${formatCurrency(todaySum)}
          </p>
        </div>
        <div className="w-px bg-zinc-200/60 dark:bg-zinc-800/60"></div>
        <div>
          <p className="text-xs font-display font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">{t('home.week')}</p>
          <p className="text-sm sm:text-base font-display font-bold text-zinc-800 dark:text-zinc-200 mt-0.5">
            ${formatCurrency(weekSum)}
          </p>
        </div>
        <div className="w-px bg-zinc-200/60 dark:bg-zinc-800/60"></div>
        <div>
          <p className="text-xs font-display font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">{t('home.month')}</p>
          <p className="text-sm sm:text-base font-display font-bold text-zinc-800 dark:text-zinc-200 mt-0.5">
            ${formatCurrency(monthSum)}
          </p>
        </div>
      </div>

      {/* Gráfico de Balance */}
      <div className="md:col-span-2 bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl border border-white/60 dark:border-zinc-800/60 rounded-3xl shadow-sm p-6 flex items-center justify-center" style={{ minHeight: "220px" }}>
        <BalanceChart transactions={transactions} />
      </div>

      {/* Botones de Registro Rápido */}
      <div className="md:col-span-2 flex flex-col sm:flex-row gap-4">
        <button
          onClick={() => abrirModal("ingreso")}
          className="flex-1 flex items-center justify-center gap-2 bg-theme-secondary hover:bg-theme-secondary-hover text-white font-sans font-semibold px-4 py-4 rounded-2xl transition-all shadow-md glow-secondary cursor-pointer hover:scale-[1.01] active:scale-[0.99]"
        >
          <ArrowUpCircle size={22} />
          {t('home.registerIncome')}
        </button>
        <button
          onClick={() => abrirModal("egreso")}
          className="flex-1 flex items-center justify-center gap-2 bg-rose-500 hover:bg-rose-600 text-white font-sans font-semibold px-4 py-4 rounded-2xl transition-all shadow-md cursor-pointer hover:scale-[1.01] active:scale-[0.99]"
        >
          <ArrowDownCircle size={22} />
          {t('home.registerExpense')}
        </button>
      </div>

      {/* Últimos Movimientos */}
      <div className="md:col-span-2 bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl border border-white/60 dark:border-zinc-800/60 rounded-3xl shadow-sm p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-display font-bold text-zinc-900 dark:text-zinc-50">
            {t('home.recent')}
          </h3>
          {transactions.length > 5 && (
            <button
              onClick={() => navigate('/movimientos')}
              className="text-xs font-semibold text-theme-primary hover:underline cursor-pointer"
            >
              Ver todos
            </button>
          )}
        </div>
        {transactions.length === 0 ? (
          <p className="text-sm font-sans text-zinc-400 dark:text-zinc-500 text-center py-8">
            {t('home.noRecent')}
          </p>
        ) : (
          <ul className="space-y-3">
            {transactions.slice(0, 5).map((tx) => (
              <li key={tx.id} className="group flex items-center justify-between p-3.5 bg-white/80 dark:bg-zinc-800/50 rounded-2xl hover:bg-white dark:hover:bg-zinc-800 transition-all border border-transparent hover:border-zinc-200 dark:hover:border-zinc-700 shadow-sm">
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-semibold text-zinc-900 dark:text-zinc-50 text-sm sm:text-base">{tx.description}</span>
                    <span className={`font-bold ${tx.type === 'ingreso' ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                      {tx.type === 'ingreso' ? '+' : '-'}${Number(tx.amount).toLocaleString('es-CO')}
                    </span>
                  </div>
                  <div className="text-xs text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5">
                    <span className="font-medium text-theme-primary">{accounts.find(a => a.id === tx.accountId)?.name || 'Cuenta'}</span>
                    <span>•</span>
                    <span>{new Date(tx.date).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity ml-3">
                  <button
                    onClick={() => openEditModal(tx)}
                    className="p-2 rounded-xl text-zinc-400 hover:bg-theme-primary-light hover:text-theme-primary transition-colors"
                    title={t('crud.edit')}
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    onClick={() => handleDeleteTransaction(tx)}
                    className="p-2 rounded-xl text-zinc-400 hover:bg-rose-100 hover:text-rose-600 dark:hover:bg-rose-900/30 dark:hover:text-rose-400 transition-colors"
                    title={t('crud.delete')}
                  >
                    <Trash2 size={16} />
                  </button>
                  <button
                    onClick={() => handleAnnulTransaction(tx)}
                    className="p-2 rounded-xl text-zinc-400 hover:bg-amber-100 hover:text-amber-600 dark:hover:bg-amber-900/30 dark:hover:text-amber-400 transition-colors"
                    title={t('crud.annul')}
                  >
                    <Ban size={16} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="md:col-span-2">
        <AccountsCard
          accounts={accounts}
          transactions={transactions}
          onOpenAdd={() => setIsAddAccountOpen(true)}
        />
      </div>
    </div>
  );
  };

  if (isLoading) return <SplashScreen />;
  if (!user) return <Login />;

  return (
    <div className="min-h-screen bg-zinc-50/80 dark:bg-zinc-950 pb-32 relative overflow-x-hidden transition-colors duration-300">
      {/* Orbes de luz ambiental Glassmorphism */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-96 sm:w-[500px] h-96 sm:h-[500px] bg-theme-primary/10 dark:bg-theme-primary/15 rounded-full blur-3xl transform-gpu"></div>
        <div className="absolute top-1/3 -right-40 w-96 sm:w-[500px] h-96 sm:h-[500px] bg-theme-secondary/10 dark:bg-theme-secondary/15 rounded-full blur-3xl transform-gpu"></div>
        <div className="absolute -bottom-40 left-1/3 w-96 sm:w-[450px] h-96 sm:h-[450px] bg-theme-primary/8 dark:bg-theme-primary/12 rounded-full blur-3xl transform-gpu"></div>
      </div>

      <ScrollToTop />

      <Drawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        transactions={transactions}
        accounts={accounts}
      />


      <header className="sticky top-0 z-40 bg-white/70 dark:bg-zinc-950/70 backdrop-blur-2xl border-b border-white/60 dark:border-zinc-800/60 px-4 sm:px-6 py-4 flex justify-between items-center shadow-xs">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsDrawerOpen(true)}
            className="p-2.5 rounded-xl text-zinc-600 dark:text-zinc-400 hover:bg-white/80 dark:hover:bg-zinc-800 transition-colors cursor-pointer border border-transparent hover:border-zinc-200 dark:hover:border-zinc-700"
            aria-label="Abrir menú"
          >
            <Menu size={22} />
          </button>
          <Logo className="w-8 h-8" />
          <span className="font-display font-bold text-lg sm:text-xl text-zinc-900 dark:text-zinc-50 tracking-tight">
            MisCuenta<span className="text-theme-primary">Z</span>
          </span>
        </div>
        <RouteChangeLoader />
      </header>

      <main key={location.pathname} className="page-enter p-4 md:p-8">
        <Suspense fallback={<ListSkeleton />}>
          <Routes>
            <Route path="/" element={!isDataLoaded ? <HomeSkeleton /> : renderHomeDashboard()} />
            <Route path="/movimientos" element={!isDataLoaded ? <ListSkeleton /> : <MovementsView transactions={transactions} accounts={accounts} handleDeleteTransaction={handleDeleteTransaction} onEdit={openEditModal} onAnnul={handleAnnulTransaction} />} />
            <Route path="/recurrentes" element={<RecurrentesView />} />
            <Route path="/notas" element={<NotasView />} />
            <Route path="/deudas" element={<DeudasView />} />
            <Route path="/metas" element={<MetasView />} />
            <Route path="/perfil" element={<ProfilePage user={user} />} />
          </Routes>
        </Suspense>
      </main>


      <AddAccountModal
        isOpen={isAddAccountOpen}
        onClose={() => setIsAddAccountOpen(false)}
        onAddAccount={handleAddAccount}
      />

      <TransactionModal
        isOpen={transactionModalOpen}
        onClose={() => {
          setTransactionModalOpen(false);
          setEditTransaction(null);
        }}
        onSave={handleSaveTransaction}
        type={transactionType}
        accounts={accounts}
        editTransaction={editTransaction}
      />

      <TransactionMenuModal
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        onSelectOption={handleSelectAction}
      />

      <TransferModal
        isOpen={isTransferOpen}
        onClose={() => setIsTransferOpen(false)}
        onConfirm={handleTransfer}
        accounts={accounts}
      />

      <Toaster position="top-center" />
      <BottomNav hidden={isDrawerOpen} />
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ ...confirmModal, isOpen: false })}
        onConfirm={confirmModal.onConfirm}
        title={confirmModal.title}
        message={confirmModal.message}
        type={confirmModal.type}
        confirmText="Confirmar"
      />
    </div>
  );
}

export default App;
