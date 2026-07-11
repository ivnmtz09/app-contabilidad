import { useState, useEffect } from "react";
import { Menu, ArrowUpCircle, ArrowDownCircle, Pencil, Trash2, Ban } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate, Routes, Route } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "./firebase";
import { collection, doc, setDoc, addDoc, updateDoc, deleteDoc, onSnapshot, query, orderBy } from "firebase/firestore";
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
import BottomNav from "./layout/BottomNav";
import { formatCurrency } from "./utils/format";
import TransactionMenuModal from "./components/TransactionMenuModal";
import { RecurrentesView } from "./components/RecurrentesView";
import { NotasView } from "./components/NotasView";
import { DeudasView } from "./components/PlaceholderViews";

function App() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [accounts, setAccounts] = useState([]);
  const [isAddAccountOpen, setIsAddAccountOpen] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [transactionModalOpen, setTransactionModalOpen] = useState(false);
  const [transactionType, setTransactionType] = useState("ingreso");
  const [editTransaction, setEditTransaction] = useState(null);

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  const { t } = useTranslation();
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsLoading(false);
    });
    return unsubscribe;
  }, []);

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
    });

    const unsubTransactions = onSnapshot(transactionsQuery, (snapshot) => {
      const transactionsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setTransactions(transactionsData);
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
        const oldAccount = accounts.find((a) => a.id === oldTx.accountId);

        if (oldAccount) {
          const oldBal = Number(oldAccount.balance) || 0;
          const revBal = oldTx.type === "ingreso" ? oldBal - oldTx.amount : oldBal + oldTx.amount;
          await updateDoc(doc(db, "users", user.uid, "accounts", oldTx.accountId), { balance: revBal });
        }

        const newAccount = accounts.find((a) => a.id === data.accountId);
        if (newAccount) {
          const baseBal = oldAccount && oldAccount.id === newAccount.id
            ? (oldTx.type === "ingreso" ? Number(oldAccount.balance) - oldTx.amount : Number(oldAccount.balance) + oldTx.amount)
            : Number(newAccount.balance) || 0;
          const newBal = data.type === "ingreso" ? baseBal + finalAmount : baseBal - finalAmount;
          await updateDoc(doc(db, "users", user.uid, "accounts", data.accountId), { balance: newBal });
        }

        await updateDoc(doc(db, `users/${user.uid}/transactions`, data.id), transactionData);
        toast.success("Movimiento actualizado");
      } else {
        await addDoc(collection(db, `users/${user.uid}/transactions`), transactionData);

        const account = accounts.find((a) => a.id === data.accountId);
        if (account) {
          const currentBalance = Number(account.balance) || 0;
          const newBalance = transactionData.type === "ingreso"
            ? currentBalance + transactionData.amount
            : currentBalance - transactionData.amount;
          await updateDoc(doc(db, "users", user.uid, "accounts", data.accountId), { balance: newBalance });
        }
        toast.success("Movimiento registrado");
      }

      setEditTransaction(null);
      setTransactionModalOpen(false);
    } catch (err) {
      console.error("Error fatal al guardar la transacción:", err);
      toast.error("Error al guardar: " + err.message);
    }
  };

  const handleDeleteTransaction = async (transaction) => {
    if (!window.confirm(`¿Eliminar el movimiento "${transaction.description}"?`)) return;
    try {
      await deleteDoc(doc(db, `users/${user.uid}/transactions`, transaction.id));
      const account = accounts.find((a) => a.id === transaction.accountId);
      if (account) {
        const currentBalance = Number(account.balance) || 0;
        const newBalance = transaction.type === "ingreso"
          ? currentBalance - transaction.amount
          : currentBalance + transaction.amount;
        await updateDoc(doc(db, "users", user.uid, "accounts", transaction.accountId), { balance: newBalance });
      }
      toast.success("Movimiento eliminado correctamente");
    } catch (err) {
      console.error("Error al eliminar:", err);
      toast.error("Error al eliminar el movimiento");
    }
  };

  const handleAnnulTransaction = async (transaction) => {
    if (!window.confirm(`¿Anular el movimiento "${transaction.description}"?`)) return;
    try {
      await deleteDoc(doc(db, `users/${user.uid}/transactions`, transaction.id));
      const account = accounts.find((a) => a.id === transaction.accountId);
      if (account) {
        const currentBalance = Number(account.balance) || 0;
        const newBalance = transaction.type === "ingreso"
          ? currentBalance - transaction.amount
          : currentBalance + transaction.amount;
        await updateDoc(doc(db, "users", user.uid, "accounts", transaction.accountId), { balance: newBalance });
      }
      toast.success("Movimiento anulado correctamente");
    } catch (err) {
      console.error("Error al anular:", err);
      toast.error("Error al anular el movimiento");
    }
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
    } else {
      toast("Próximamente disponible");
      setIsMenuOpen(false);
    }
  };

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
    <div className="mx-auto max-w-7xl grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
      <div className="md:col-span-2">
        <header className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-display font-bold text-zinc-900 dark:text-zinc-50">MisCuentaZ</h1>
          </div>
          <button
            onClick={() => navigate('/perfil')}
            className="w-10 h-10 rounded-full overflow-hidden border-2 border-zinc-200 dark:border-zinc-700 hover:border-violet-500 transition-colors cursor-pointer"
          >
            {user?.photoURL ? (
              <img src={user.photoURL} alt="Perfil" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-violet-600 flex items-center justify-center text-white font-bold">
                {user?.displayName?.charAt(0) || 'U'}
              </div>
            )}
          </button>
        </header>
      </div>
      <div className="md:col-span-2 bg-white dark:bg-zinc-800 rounded-3xl shadow-sm p-6 md:p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 font-display font-semibold">
            {t('home.totalBalance')}
          </p>
          <p className="text-4xl md:text-5xl font-display font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            ${formatCurrency(totalBalance)}
          </p>
        </div>
        <button
          onClick={() => setIsMenuOpen(true)}
          className="w-full md:w-auto bg-violet-600 hover:bg-violet-700 text-white font-sans font-semibold px-6 py-3 rounded-xl transition-colors cursor-pointer"
        >
          {t('home.addMovement')}
        </button>
      </div>

      <div className="bg-white dark:bg-zinc-800 rounded-2xl shadow-sm p-6">
        <p className="text-sm text-zinc-500 dark:text-zinc-400 font-display font-semibold">
          {t('home.monthIncome')}
        </p>
        <p className="text-2xl md:text-3xl font-display font-bold text-emerald-500">
          ${formatCurrency(monthIncome)}
        </p>
      </div>

      <div className="bg-white dark:bg-zinc-800 rounded-2xl shadow-sm p-6">
        <p className="text-sm text-zinc-500 dark:text-zinc-400 font-display font-semibold">
          {t('home.monthExpense')}
        </p>
        <p className="text-2xl md:text-3xl font-display font-bold text-rose-500">
          ${formatCurrency(monthExpense)}
        </p>
      </div>

      <div className="md:col-span-2 bg-white dark:bg-zinc-800 rounded-2xl shadow-sm p-4 flex justify-around text-center">
        <div>
            <p className="text-xs font-display font-semibold text-zinc-400 dark:text-zinc-500 uppercase">{t('home.day')}</p>
          <p className="text-sm font-display font-bold text-zinc-800 dark:text-zinc-200">
            ${formatCurrency(todaySum)}
          </p>
        </div>
        <div>
            <p className="text-xs font-display font-semibold text-zinc-400 dark:text-zinc-500 uppercase">{t('home.week')}</p>
          <p className="text-sm font-display font-bold text-zinc-800 dark:text-zinc-200">
            ${formatCurrency(weekSum)}
          </p>
        </div>
        <div>
            <p className="text-xs font-display font-semibold text-zinc-400 dark:text-zinc-500 uppercase">{t('home.month')}</p>
          <p className="text-sm font-display font-bold text-zinc-800 dark:text-zinc-200">
            ${formatCurrency(monthSum)}
          </p>
        </div>
      </div>

      <div className="md:col-span-2 bg-white dark:bg-zinc-800 rounded-2xl shadow-sm p-6 flex items-center justify-center" style={{ minHeight: "200px" }}>
        <BalanceChart transactions={transactions} />
      </div>

      <div className="md:col-span-2 flex gap-4">
        <button
          onClick={() => abrirModal("ingreso")}
          className="flex-1 flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-sans font-semibold px-4 py-4 rounded-2xl transition-colors cursor-pointer"
        >
          <ArrowUpCircle size={22} />
          {t('home.registerIncome')}
        </button>
        <button
          onClick={() => abrirModal("egreso")}
          className="flex-1 flex items-center justify-center gap-2 bg-rose-500 hover:bg-rose-600 text-white font-sans font-semibold px-4 py-4 rounded-2xl transition-colors cursor-pointer"
        >
          <ArrowDownCircle size={22} />
          {t('home.registerExpense')}
        </button>
      </div>

      <div className="md:col-span-2 bg-white dark:bg-zinc-800 rounded-2xl shadow-sm p-6">
        <h3 className="text-lg font-display font-semibold text-zinc-900 dark:text-zinc-50 mb-4">
          {t('home.recent')}
        </h3>
        {transactions.length === 0 ? (
          <p className="text-sm font-sans text-zinc-400 dark:text-zinc-500 text-center py-8">
            {t('home.noRecent')}
          </p>
        ) : (
          <ul className="space-y-3">
            {transactions.slice(0, 5).map((tx) => (
              <li key={tx.id} className="group flex items-center justify-between p-3 bg-white dark:bg-zinc-800/50 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors border border-transparent hover:border-zinc-200 dark:hover:border-zinc-700">
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-medium text-zinc-900 dark:text-zinc-50">{tx.description}</span>
                    <span className={`font-bold ${tx.type === 'ingreso' ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                      {tx.type === 'ingreso' ? '+' : '-'}${Number(tx.amount).toLocaleString('es-CO')}
                    </span>
                  </div>
                  <div className="text-xs text-zinc-500 dark:text-zinc-400">
                    {accounts.find(a => a.id === tx.accountId)?.name || 'Desconocida'} • {new Date(tx.date).toLocaleDateString()}
                  </div>
                </div>

                <div className="flex items-center gap-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity ml-3">
                  <button
                    onClick={() => openEditModal(tx)}
                    className="p-2 rounded-lg text-zinc-400 hover:bg-violet-100 hover:text-violet-600 dark:hover:bg-violet-900/30 dark:hover:text-violet-400 transition-colors"
                    title={t('crud.edit')}
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    onClick={() => handleDeleteTransaction(tx)}
                    className="p-2 rounded-lg text-zinc-400 hover:bg-rose-100 hover:text-rose-600 dark:hover:bg-rose-900/30 dark:hover:text-rose-400 transition-colors"
                    title={t('crud.delete')}
                  >
                    <Trash2 size={16} />
                  </button>
                  <button
                    onClick={() => handleAnnulTransaction(tx)}
                    className="p-2 rounded-lg text-zinc-400 hover:bg-amber-100 hover:text-amber-600 dark:hover:bg-amber-900/30 dark:hover:text-amber-400 transition-colors"
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
          onOpenAdd={() => setIsAddAccountOpen(true)}
        />
      </div>
    </div>
  );
  };

  if (isLoading) return <SplashScreen />;
  if (!user) return <Login />;

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900 pb-24">
      <Drawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        transactions={transactions}
        accounts={accounts}
      />

      <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-zinc-50/80 dark:bg-zinc-900/80 border-b border-zinc-200 dark:border-zinc-800">
        <div className="p-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsDrawerOpen(true)}
              className="p-2 rounded-lg text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
            >
              <Menu size={22} />
            </button>
            <Logo className="w-8 h-8" />
            <span className="font-display font-bold text-zinc-900 dark:text-zinc-50">
              MisCuentaZ
            </span>
          </div>
        </div>
        <ProgressBar isLoading={isLoading} />
      </header>

      <main className="p-4 md:p-8">
        <Routes>
          <Route path="/" element={!isDataLoaded ? <HomeSkeleton /> : renderHomeDashboard()} />
          <Route path="/movimientos" element={!isDataLoaded ? <ListSkeleton /> : <MovementsView transactions={transactions} accounts={accounts} handleDeleteTransaction={handleDeleteTransaction} onEdit={openEditModal} onAnnul={handleAnnulTransaction} />} />
          <Route path="/recurrentes" element={<RecurrentesView />} />
          <Route path="/notas" element={<NotasView />} />
          <Route path="/deudas" element={<DeudasView />} />
          <Route path="/perfil" element={<ProfilePage user={user} />} />
        </Routes>
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

      <Toaster position="top-center" />
      <BottomNav />
    </div>
  );
}

export default App;
