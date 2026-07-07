import { useState, useEffect } from "react";
import { Menu, ArrowUpCircle, ArrowDownCircle } from "lucide-react";
import { Routes, Route } from "react-router-dom";
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
import TransactionMenuModal from "./components/TransactionMenuModal";
import { RecurrentesView, MetasView } from "./components/PlaceholderViews";

function App() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [accounts, setAccounts] = useState([]);
  const [isAddAccountOpen, setIsAddAccountOpen] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [transactionModalOpen, setTransactionModalOpen] = useState(false);
  const [transactionType, setTransactionType] = useState("ingreso");

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDataLoaded, setIsDataLoaded] = useState(false);

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
      const transactionData = {
        amount: Number(data.amount),
        description: data.description || "Sin descripción",
        accountId: data.accountId,
        type: data.type,
        date: data.date || new Date().toISOString()
      };

      console.log("Intentando guardar en Firestore:", transactionData);
      await addDoc(collection(db, `users/${user.uid}/transactions`), transactionData);

      const account = accounts.find((a) => a.id === data.accountId);
      if (account) {
        const currentBalance = Number(account.balance) || 0;
        const newBalance = transactionData.type === "ingreso"
          ? currentBalance + transactionData.amount
          : currentBalance - transactionData.amount;

        const accountRef = doc(db, "users", user.uid, "accounts", data.accountId);
        await updateDoc(accountRef, { balance: newBalance });
      } else {
        console.warn("No se actualizó el saldo: ID de cuenta no encontrado en el estado local", data.accountId);
      }

      toast.success("Movimiento registrado");
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

  const renderHomeDashboard = () => (
    <div className="mx-auto max-w-7xl grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
      <div className="md:col-span-2 bg-white dark:bg-zinc-800 rounded-3xl shadow-sm p-6 md:p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 font-display font-semibold">
            Balance Total
          </p>
          <p className="text-4xl md:text-5xl font-display font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            ${totalBalance.toLocaleString("es-CO")}
          </p>
        </div>
        <button
          onClick={() => setIsMenuOpen(true)}
          className="w-full md:w-auto bg-violet-600 hover:bg-violet-700 text-white font-sans font-semibold px-6 py-3 rounded-xl transition-colors cursor-pointer"
        >
          + Añadir movimiento
        </button>
      </div>

      <div className="bg-white dark:bg-zinc-800 rounded-2xl shadow-sm p-6">
        <p className="text-sm text-zinc-500 dark:text-zinc-400 font-display font-semibold">
          Ingresos del mes
        </p>
        <p className="text-2xl md:text-3xl font-display font-bold text-emerald-500">
          ${monthIncome.toLocaleString("es-CO")}
        </p>
      </div>

      <div className="bg-white dark:bg-zinc-800 rounded-2xl shadow-sm p-6">
        <p className="text-sm text-zinc-500 dark:text-zinc-400 font-display font-semibold">
          Egresos del mes
        </p>
        <p className="text-2xl md:text-3xl font-display font-bold text-rose-500">
          ${monthExpense.toLocaleString("es-CO")}
        </p>
      </div>

      <div className="md:col-span-2 bg-white dark:bg-zinc-800 rounded-2xl shadow-sm p-4 flex justify-around text-center">
        <div>
          <p className="text-xs font-display font-semibold text-zinc-400 dark:text-zinc-500 uppercase">Día</p>
          <p className="text-sm font-display font-bold text-zinc-800 dark:text-zinc-200">
            ${todaySum.toLocaleString("es-CO")}
          </p>
        </div>
        <div>
          <p className="text-xs font-display font-semibold text-zinc-400 dark:text-zinc-500 uppercase">Semana</p>
          <p className="text-sm font-display font-bold text-zinc-800 dark:text-zinc-200">
            ${weekSum.toLocaleString("es-CO")}
          </p>
        </div>
        <div>
          <p className="text-xs font-display font-semibold text-zinc-400 dark:text-zinc-500 uppercase">Mes</p>
          <p className="text-sm font-display font-bold text-zinc-800 dark:text-zinc-200">
            ${monthSum.toLocaleString("es-CO")}
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
          Registrar Ingreso
        </button>
        <button
          onClick={() => abrirModal("egreso")}
          className="flex-1 flex items-center justify-center gap-2 bg-rose-500 hover:bg-rose-600 text-white font-sans font-semibold px-4 py-4 rounded-2xl transition-colors cursor-pointer"
        >
          <ArrowDownCircle size={22} />
          Registrar Egreso
        </button>
      </div>

      <div className="md:col-span-2 bg-white dark:bg-zinc-800 rounded-2xl shadow-sm p-6">
        <h3 className="text-lg font-display font-semibold text-zinc-900 dark:text-zinc-50 mb-4">
          Últimos Movimientos
        </h3>
        {transactions.length === 0 ? (
          <p className="text-sm font-sans text-zinc-400 dark:text-zinc-500 text-center py-8">
            Sin transacciones recientes
          </p>
        ) : (
          <ul className="space-y-3">
            {transactions.slice(0, 5).map((t) => (
              <li
                key={t.id}
                onClick={() => handleDeleteTransaction(t)}
                className="flex justify-between items-center py-2 border-b border-zinc-100 dark:border-zinc-700 last:border-b-0 cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-800/50 rounded-lg p-2 transition-colors"
              >
                <div>
                  <p className="font-sans text-sm text-zinc-700 dark:text-zinc-300">
                    {t.description}
                  </p>
                  <p className="font-sans text-xs text-zinc-400">
                    {accounts.find(a => a.id === t.accountId)?.name || 'Desconocida'}
                  </p>
                </div>
                <span
                  className={`font-display font-semibold text-sm ${t.type === "ingreso" ? "text-emerald-500" : "text-rose-500"}`}
                >
                  {t.type === "ingreso" ? "+" : "-"}$
                  {t.amount.toLocaleString("es-CO")}
                </span>
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
          <Route path="/movimientos" element={!isDataLoaded ? <ListSkeleton /> : <MovementsView transactions={transactions} accounts={accounts} />} />
          <Route path="/recurrentes" element={<RecurrentesView />} />
          <Route path="/metas" element={<MetasView />} />
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
        onClose={() => setTransactionModalOpen(false)}
        onSave={handleSaveTransaction}
        type={transactionType}
        accounts={accounts}
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
