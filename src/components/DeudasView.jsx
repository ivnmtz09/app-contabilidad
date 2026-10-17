import { useState, useEffect } from "react";
import {
  collection,
  addDoc,
  onSnapshot,
  deleteDoc,
  updateDoc,
  doc,
  query,
  orderBy,
  runTransaction,
} from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import {
  Trash2,
  Plus,
  ArrowLeft,
  CheckCircle2,

  CircleDollarSign,
  HandCoins,
  Pencil,
  X,
  Coins,
} from "lucide-react";
import toast from "react-hot-toast";
import ConfirmModal from "./ConfirmModal";
import { DeudasSkeleton } from "./Loaders";
import { formatCurrency } from "../utils/format";
import AccountSelector from "./ui/AccountSelector";

export function DeudasView() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("debo");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, id: null });
  const [isLoaded, setIsLoaded] = useState(false);

  // Edit Debt modal state
  const [editModal, setEditModal] = useState({
    isOpen: false,
    item: null,
    name: "",
    amount: "",
    description: "",
    type: "debo",
  });

  // Partial Payment modal state
  const [paymentModal, setPaymentModal] = useState({
    isOpen: false,
    item: null,
    amount: "",
    accountId: "",
  });

  useEffect(() => {
    if (!user) {
      setItems([]);
      setAccounts([]);
      return;
    }

    const q = query(collection(db, `users/${user.uid}/debts`), orderBy("createdAt", "desc"));
    const unsubDebts = onSnapshot(
      q,
      (snap) => {
        setItems(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
        setIsLoaded(true);
      },
      (error) => {
        console.error("Error al cargar deudas:", error);
        toast.error("Error al cargar deudas");
        setIsLoaded(true);
      }
    );

    const qAccounts = query(collection(db, `users/${user.uid}/accounts`));
    const unsubAccounts = onSnapshot(qAccounts, (snap) => {
      setAccounts(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });

    return () => {
      unsubDebts();
      unsubAccounts();
    };
  }, [user]);

  if (!isLoaded) return <DeudasSkeleton />;

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error("Debes iniciar sesión para registrar deudas");
      return;
    }
    if (!name.trim()) {
      toast.error(t("debts.nameRequired") || "Ingresa el nombre de la persona");
      return;
    }
    if (!amount || Number(amount) <= 0) {
      toast.error(t("debts.amountRequired") || "Ingresa un monto válido");
      return;
    }
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, `users/${user.uid}/debts`), {
        name: name.trim(),
        amount: Number(amount),
        description: description.trim(),
        type,
        paid: false,
        createdAt: new Date().toISOString(),
      });
      setName("");
      setAmount("");
      setDescription("");
      setType("debo");
      toast.success(t("debts.created") || "Deuda registrada");
    } catch (err) {
      console.error("Error al registrar deuda:", err);
      toast.error("Error al registrar deuda");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenEdit = (item) => {
    setEditModal({
      isOpen: true,
      item,
      name: item.name,
      amount: item.amount.toString(),
      description: item.description || "",
      type: item.type || "debo",
    });
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!user || !editModal.item) return;
    const newName = editModal.name.trim();
    const newAmount = Number(editModal.amount);
    if (!newName || !newAmount || newAmount <= 0) {
      toast.error("Datos inválidos");
      return;
    }
    try {
      await updateDoc(doc(db, `users/${user.uid}/debts`, editModal.item.id), {
        name: newName,
        amount: newAmount,
        description: editModal.description.trim(),
        type: editModal.type,
      });
      toast.success("Deuda actualizada");
      setEditModal({
        isOpen: false,
        item: null,
        name: "",
        amount: "",
        description: "",
        type: "debo",
      });
    } catch (err) {
      console.error("Error al actualizar deuda:", err);
      toast.error("Error al actualizar");
    }
  };

  const handleOpenPayment = (item) => {
    setPaymentModal({
      isOpen: true,
      item,
      amount: "",
      accountId: accounts[0]?.id || "",
    });
  };

  const handleSavePayment = async (e) => {
    e.preventDefault();
    if (!user || !paymentModal.item) return;
    const pAmount = Number(paymentModal.amount);
    const isDebo = paymentModal.item.type === "debo";


    if (!pAmount || pAmount <= 0) {
      toast.error("Ingresa un monto válido");
      return;
    }

    try {
      const uid = user.uid;
      const debtId = paymentModal.item.id;
      const accId = paymentModal.accountId;

      await runTransaction(db, async (tx) => {
        const debtRef = doc(db, `users/${uid}/debts`, debtId);
        const debtSnap = await tx.get(debtRef);
        if (!debtSnap.exists()) throw new Error("La deuda no existe");

        const curDebtAmount = Number(debtSnap.data().amount) || 0;
        const newDebtAmount = Math.max(0, curDebtAmount - pAmount);
        const isFullyPaid = newDebtAmount <= 0;

        tx.update(debtRef, {
          amount: newDebtAmount,
          paid: isFullyPaid,
        });

        // Si se vinculó una cuenta real
        if (accId && accId !== "virtual") {
          const accRef = doc(db, "users", uid, "accounts", accId);
          const accSnap = await tx.get(accRef);
          if (accSnap.exists()) {
            const curAccBal = Number(accSnap.data().balance) || 0;
            // Si yo debo y pago -> egreso de mi cuenta
            // Si me deben y me pagan -> ingreso a mi cuenta
            const delta = isDebo ? -pAmount : pAmount;
            tx.update(accRef, { balance: curAccBal + delta });

            const txRef = doc(collection(db, `users/${uid}/transactions`));
            tx.set(txRef, {
              type: isDebo ? "egreso" : "ingreso",
              amount: pAmount,
              description: isDebo
                ? `Abono de deuda a: ${paymentModal.item.name}`
                : `Cobro de deuda de: ${paymentModal.item.name}`,
              category: "deudas",
              accountId: accId,
              date: new Date().toISOString(),
            });
          }
        }
      });

      toast.success(`Abono de $${formatCurrency(pAmount)} registrado exitosamente`);
      setPaymentModal({ isOpen: false, item: null, amount: "", accountId: "" });
    } catch (err) {
      console.error("Error al registrar abono:", err);
      toast.error(err.message || "Error al procesar el abono");
    }
  };

  const handleTogglePaid = async (item) => {
    if (!user) return;
    try {
      await updateDoc(doc(db, `users/${user.uid}/debts`, item.id), { paid: !item.paid });
      toast.success(item.paid ? "Deuda reabierta" : "Deuda marcada como pagada");
    } catch (err) {
      console.error("Error al actualizar deuda:", err);
      toast.error("Error al actualizar");
    }
  };

  const handleDeleteConfirm = async () => {
    if (!user || !confirmModal.id) return;
    try {
      await deleteDoc(doc(db, `users/${user.uid}/debts`, confirmModal.id));
      toast.success("Deuda eliminada");
    } catch (err) {
      console.error("Error al eliminar deuda:", err);
      toast.error("Error al eliminar");
    }
  };

  const pending = items.filter((i) => !i.paid);
  const paid = items.filter((i) => i.paid);

  const totalDebo = pending.filter((i) => i.type === "debo").reduce((s, i) => s + i.amount, 0);
  const totalMeDeben = pending
    .filter((i) => i.type === "me_deben")
    .reduce((s, i) => s + i.amount, 0);

  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-6 pb-24 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className="p-3 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-2xl shadow-xs hover:shadow-sm transition-all text-zinc-700 dark:text-zinc-300 cursor-pointer"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-xl sm:text-2xl font-display font-bold text-zinc-900 dark:text-zinc-50">
            {t("debts.title") || "Gestión de Deudas y Cobros"}
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400">
            {t("debts.desc") || "Control de cuentas por pagar y cuentas por cobrar"}
          </p>
        </div>
      </div>

      {/* Tarjetas Resumen */}
      {items.length > 0 && (
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white dark:bg-zinc-850 p-4 rounded-3xl border border-zinc-200/80 dark:border-zinc-800/80 shadow-2xs text-center">
            <p className="text-xs font-semibold text-zinc-400 uppercase mb-1">Yo Debo</p>
            <p className="text-xl font-display font-bold text-rose-500 font-mono tabular-nums">
              ${formatCurrency(totalDebo)}
            </p>
          </div>
          <div className="bg-white dark:bg-zinc-850 p-4 rounded-3xl border border-zinc-200/80 dark:border-zinc-800/80 shadow-2xs text-center">
            <p className="text-xs font-semibold text-zinc-400 uppercase mb-1">Me Deben</p>
            <p className="text-xl font-display font-bold text-emerald-500 font-mono tabular-nums">
              ${formatCurrency(totalMeDeben)}
            </p>
          </div>
        </div>
      )}

      {/* Formulario Registrar */}
      <form
        onSubmit={handleAdd}
        className="bg-white dark:bg-zinc-850 p-5 rounded-3xl shadow-xs border border-zinc-200/80 dark:border-zinc-800/80 flex flex-col gap-3"
      >
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setType("debo")}
            className={`flex-1 py-2.5 rounded-xl font-semibold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer ${
              type === "debo"
                ? "bg-rose-500 text-white shadow-xs"
                : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400"
            }`}
          >
            <CircleDollarSign size={16} /> Yo Debo
          </button>
          <button
            type="button"
            onClick={() => setType("me_deben")}
            className={`flex-1 py-2.5 rounded-xl font-semibold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer ${
              type === "me_deben"
                ? "bg-emerald-500 text-white shadow-xs"
                : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400"
            }`}
          >
            <HandCoins size={16} /> Me Deben
          </button>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            placeholder={t("debts.person") || "Nombre de la persona o entidad"}
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="flex-1 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-zinc-900 dark:text-zinc-50 outline-none focus:ring-2 focus:ring-theme-primary"
            required
          />
          <input
            type="number"
            step="any"
            placeholder={t("debts.amount") || "Monto ($ COP)"}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full sm:w-40 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-2.5 font-mono text-sm tabular-nums text-zinc-900 dark:text-zinc-50 outline-none focus:ring-2 focus:ring-theme-primary"
            required
          />
        </div>

        <input
          type="text"
          placeholder={t("debts.description") || "Motivo o nota (opcional)"}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-2.5 text-xs text-zinc-900 dark:text-zinc-50 outline-none focus:ring-2 focus:ring-theme-primary"
        />

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-theme-primary hover:bg-theme-primary-hover text-white rounded-xl px-5 py-3 font-semibold text-xs flex items-center justify-center gap-2 transition-colors shadow-md glow-primary disabled:opacity-50 cursor-pointer"
        >
          <Plus size={18} /> Registrar Deuda
        </button>
      </form>

      {/* Lista Pendientes */}
      {pending.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider px-1">
            Pendientes ({pending.length})
          </h3>
          {pending.map((item) => (
            <div
              key={item.id}
              className="bg-white dark:bg-zinc-850 p-4 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 shadow-2xs hover:shadow-xs transition-all space-y-2"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`p-2 rounded-xl shrink-0 ${
                      item.type === "debo"
                        ? "bg-rose-100 dark:bg-rose-950/40 text-rose-500"
                        : "bg-emerald-100 dark:bg-emerald-950/40 text-emerald-500"
                    }`}
                  >
                    {item.type === "debo" ? (
                      <CircleDollarSign size={18} />
                    ) : (
                      <HandCoins size={18} />
                    )}
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-bold text-zinc-900 dark:text-zinc-50 text-sm truncate">
                      {item.name}
                    </h4>
                    {item.description && (
                      <p className="text-xs text-zinc-400 truncate">{item.description}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  {/* Abonar */}
                  <button
                    onClick={() => handleOpenPayment(item)}
                    className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 transition-colors cursor-pointer"
                    title="Abonar a deuda"
                  >
                    <Coins size={16} />
                  </button>

                  {/* Editar */}
                  <button
                    onClick={() => handleOpenEdit(item)}
                    className="p-1.5 rounded-lg text-zinc-400 hover:text-theme-primary hover:bg-theme-primary/10 transition-colors cursor-pointer"
                    title="Editar deuda"
                  >
                    <Pencil size={16} />
                  </button>

                  {/* Marcar pagada */}
                  <button
                    onClick={() => handleTogglePaid(item)}
                    className="p-1.5 rounded-lg text-zinc-400 hover:text-emerald-500 transition-colors cursor-pointer"
                    title="Marcar totalmente pagada"
                  >
                    <CheckCircle2 size={18} />
                  </button>

                  {/* Eliminar */}
                  <button
                    onClick={() => setConfirmModal({ isOpen: true, id: item.id })}
                    className="p-1.5 rounded-lg text-zinc-400 hover:text-rose-500 transition-colors cursor-pointer"
                    title="Eliminar deuda"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1 border-t border-zinc-100 dark:border-zinc-800">
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    item.type === "debo"
                      ? "bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400"
                      : "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400"
                  }`}
                >
                  {item.type === "debo" ? "Yo Debo" : "Me Deben"}
                </span>
                <p
                  className={`font-mono font-bold text-base tabular-nums ${
                    item.type === "debo" ? "text-rose-500" : "text-emerald-500"
                  }`}
                >
                  ${formatCurrency(item.amount)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Lista Pagadas */}
      {paid.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider px-1">
            Pagadas ({paid.length})
          </h3>
          {paid.map((item) => (
            <div
              key={item.id}
              className="bg-white/50 dark:bg-zinc-850/50 p-3 rounded-2xl border border-zinc-200/50 dark:border-zinc-800/50 flex items-center justify-between opacity-60 hover:opacity-100 transition-opacity"
            >
              <div className="flex items-center gap-3">
                <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                <div>
                  <p className="text-xs font-medium text-zinc-700 dark:text-zinc-300 line-through">
                    {item.name}
                  </p>
                  {item.description && (
                    <p className="text-[10px] text-zinc-400 line-through">{item.description}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <p className="font-mono text-xs font-bold text-zinc-400 line-through tabular-nums">
                  ${formatCurrency(item.amount)}
                </p>
                <button
                  onClick={() => handleTogglePaid(item)}
                  className="text-xs text-theme-primary hover:underline cursor-pointer"
                >
                  Reabrir
                </button>
                <button
                  onClick={() => setConfirmModal({ isOpen: true, id: item.id })}
                  className="text-zinc-300 hover:text-rose-500 p-1"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Modal */}
      {editModal.isOpen && (
        <div
          className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-150"
          onClick={() =>
            setEditModal({
              isOpen: false,
              item: null,
              name: "",
              amount: "",
              description: "",
              type: "debo",
            })
          }
        >
          <div
            className="w-full max-w-sm bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl border border-zinc-200 dark:border-zinc-800 p-6 flex flex-col gap-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center">
              <h3 className="font-display font-bold text-lg text-zinc-900 dark:text-zinc-50">
                Editar Deuda
              </h3>
              <button
                type="button"
                onClick={() =>
                  setEditModal({
                    isOpen: false,
                    item: null,
                    name: "",
                    amount: "",
                    description: "",
                    type: "debo",
                  })
                }
                className="text-zinc-400 hover:text-zinc-600 p-1"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setEditModal({ ...editModal, type: "debo" })}
                  className={`flex-1 py-2 rounded-xl text-xs font-semibold ${
                    editModal.type === "debo"
                      ? "bg-rose-500 text-white"
                      : "bg-zinc-100 dark:bg-zinc-800 text-zinc-500"
                  }`}
                >
                  Yo Debo
                </button>
                <button
                  type="button"
                  onClick={() => setEditModal({ ...editModal, type: "me_deben" })}
                  className={`flex-1 py-2 rounded-xl text-xs font-semibold ${
                    editModal.type === "me_deben"
                      ? "bg-emerald-500 text-white"
                      : "bg-zinc-100 dark:bg-zinc-800 text-zinc-500"
                  }`}
                >
                  Me Deben
                </button>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider mb-1">
                  Persona
                </label>
                <input
                  type="text"
                  value={editModal.name}
                  onChange={(e) => setEditModal({ ...editModal, name: e.target.value })}
                  className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-zinc-900 dark:text-zinc-50 outline-none focus:ring-2 focus:ring-theme-primary"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider mb-1">
                  Monto ($ COP)
                </label>
                <input
                  type="number"
                  step="any"
                  value={editModal.amount}
                  onChange={(e) => setEditModal({ ...editModal, amount: e.target.value })}
                  className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-2.5 font-mono text-sm tabular-nums text-zinc-900 dark:text-zinc-50 outline-none focus:ring-2 focus:ring-theme-primary"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider mb-1">
                  Descripción
                </label>
                <input
                  type="text"
                  value={editModal.description}
                  onChange={(e) => setEditModal({ ...editModal, description: e.target.value })}
                  className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-2.5 text-xs text-zinc-900 dark:text-zinc-50 outline-none focus:ring-2 focus:ring-theme-primary"
                />
              </div>

              <div className="flex gap-2 justify-end pt-2">
                <button
                  type="button"
                  onClick={() =>
                    setEditModal({
                      isOpen: false,
                      item: null,
                      name: "",
                      amount: "",
                      description: "",
                      type: "debo",
                    })
                  }
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-zinc-600 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-theme-primary hover:bg-theme-primary-hover shadow-md transition-colors"
                >
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Partial Payment Modal */}
      {paymentModal.isOpen && (
        <div
          className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-150"
          onClick={() =>
            setPaymentModal({ isOpen: false, item: null, amount: "", accountId: "" })
          }
        >
          <div
            className="w-full max-w-sm bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl border border-zinc-200 dark:border-zinc-800 p-6 flex flex-col gap-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-display font-bold text-lg text-zinc-900 dark:text-zinc-50">
                  {paymentModal.item?.type === "debo" ? "Abonar a Deuda" : "Registrar Cobro"}
                </h3>
                <p className="text-xs text-zinc-400">
                  Saldo pendiente: ${formatCurrency(paymentModal.item?.amount || 0)} COP
                </p>
              </div>
              <button
                type="button"
                onClick={() =>
                  setPaymentModal({ isOpen: false, item: null, amount: "", accountId: "" })
                }
                className="text-zinc-400 hover:text-zinc-600 p-1"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSavePayment} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider mb-1.5">
                  Monto a Abonar ($ COP)
                </label>
                <input
                  type="number"
                  step="any"
                  value={paymentModal.amount}
                  onChange={(e) => setPaymentModal({ ...paymentModal, amount: e.target.value })}
                  placeholder="0"
                  max={paymentModal.item?.amount || 0}
                  className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-2.5 font-mono text-sm tabular-nums text-zinc-900 dark:text-zinc-50 outline-none focus:ring-2 focus:ring-theme-primary"
                  required
                />
              </div>

              <div>
                <AccountSelector
                  accounts={accounts}
                  selectedAccountId={paymentModal.accountId}
                  onChange={(id) => setPaymentModal({ ...paymentModal, accountId: id })}
                  allowAll
                  allLabel="Solo ajuste (no registrar en cuentas)"
                  label={
                    paymentModal.item?.type === "debo"
                      ? "Cuenta de Pago (Se debita)"
                      : "Cuenta de Depósito (Se abona)"
                  }
                  placeholder="Seleccionar cuenta vinculada"
                />
              </div>

              <div className="flex gap-2 justify-end pt-2">
                <button
                  type="button"
                  onClick={() =>
                    setPaymentModal({ isOpen: false, item: null, amount: "", accountId: "" })
                  }
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-zinc-600 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-theme-primary hover:bg-theme-primary-hover shadow-md transition-colors"
                >
                  Confirmar Abono
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ isOpen: false, id: null })}
        onConfirm={handleDeleteConfirm}
        title="Eliminar deuda"
        message="¿Estás seguro de que deseas eliminar este registro de deuda?"
        confirmText="Eliminar"
      />
    </div>
  );
}

export default DeudasView;
