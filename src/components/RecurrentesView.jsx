import { useState, useEffect } from "react";
import {
  collection,
  addDoc,
  updateDoc,
  onSnapshot,
  deleteDoc,
  doc,
  query,
  orderBy,
  runTransaction,
} from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";
import { useTranslation } from "react-i18next";
import { CalendarClock, Trash2, Plus, Repeat, Pencil, CreditCard, X, CalendarDays } from "lucide-react";
import toast from "react-hot-toast";
import ConfirmModal from "./ConfirmModal";
import { RecurrentesSkeleton } from "./Loaders";
import { formatCurrency } from "../utils/format";
import AccountSelector from "./ui/AccountSelector";
import CustomSelect from "./ui/CustomSelect";
import AlertBanner from "./ui/AlertBanner";

export function RecurrentesView() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Form states
  const [editingId, setEditingId] = useState(null);
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [frequency, setFrequency] = useState("Mensual");
  const [billingDate, setBillingDate] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, id: null });

  // Payment Modal states
  const [paymentModal, setPaymentModal] = useState({ isOpen: false, item: null, accountId: "" });

  useEffect(() => {
    if (!user) {
      setItems([]);
      setAccounts([]);
      return;
    }

    const qRecurrents = query(
      collection(db, `users/${user.uid}/recurrents`),
      orderBy("createdAt", "desc")
    );
    const unsubRecurrents = onSnapshot(
      qRecurrents,
      (snap) => {
        setItems(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
        setIsLoaded(true);
      },
      (error) => {
        console.error("Error al cargar suscripciones recurrentes:", error);
        toast.error("Error al cargar suscripciones");
        setIsLoaded(true);
      }
    );

    const qAccounts = query(collection(db, `users/${user.uid}/accounts`));
    const unsubAccounts = onSnapshot(
      qAccounts,
      (snap) => {
        setAccounts(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      },
      (error) => {
        console.error("Error al cargar cuentas:", error);
      }
    );

    return () => {
      unsubRecurrents();
      unsubAccounts();
    };
  }, [user]);

  useEffect(() => {
    if (!paymentModal.isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") setPaymentModal({ isOpen: false, item: null, accountId: "" });
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [paymentModal.isOpen]);

  if (!isLoaded) return <RecurrentesSkeleton />;

  const handleAddOrUpdate = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error("Debes iniciar sesión para realizar esta acción");
      return;
    }
    if (!name.trim()) {
      toast.error(t("recurrent.nameRequired") || "Ingresa un nombre para la suscripción");
      return;
    }
    if (!amount || Number(amount) <= 0) {
      toast.error(t("recurrent.amountRequired") || "Ingresa un monto válido");
      return;
    }
    if (!billingDate) {
      toast.error(t("recurrent.dateRequired") || "Selecciona una fecha de cobro");
      return;
    }
    setIsSubmitting(true);
    try {
      if (editingId) {
        await updateDoc(doc(db, `users/${user.uid}/recurrents`, editingId), {
          name: name.trim(),
          amount: Number(amount),
          frequency,
          billingDate,
        });
        setEditingId(null);
        toast.success("Suscripción actualizada");
      } else {
        await addDoc(collection(db, `users/${user.uid}/recurrents`), {
          name: name.trim(),
          amount: Number(amount),
          frequency,
          billingDate,
          createdAt: new Date().toISOString(),
        });
        toast.success("Suscripción guardada");
      }
      setName("");
      setAmount("");
      setFrequency("Mensual");
      setBillingDate("");
    } catch (err) {
      console.error("Error guardando suscripción:", err);
      toast.error("Error al guardar suscripción");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setName(item.name);
    setAmount(item.amount);
    setFrequency(item.frequency || "Mensual");
    setBillingDate(item.billingDate || "");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setName("");
    setAmount("");
    setFrequency("Mensual");
    setBillingDate("");
  };

  const confirmPayment = async () => {
    if (!user) return;
    if (!paymentModal.accountId || !paymentModal.item) {
      toast.error(t("recurrent.selectAccount") || "Selecciona una cuenta");
      return;
    }
    const payAmount = Number(paymentModal.item.amount);
    if (!payAmount || payAmount <= 0) {
      toast.error("El monto de la suscripción es inválido");
      return;
    }

    try {
      await runTransaction(db, async (tx) => {
        const accRef = doc(db, "users", user.uid, "accounts", paymentModal.accountId);
        const accSnap = await tx.get(accRef);
        if (!accSnap.exists()) {
          throw new Error("La cuenta no existe");
        }

        const currentBal = Number(accSnap.data().balance) || 0;
        if (accSnap.data().type !== "credito" && currentBal < payAmount) {
          throw new Error(
            `Saldo insuficiente en "${accSnap.data().name}". Disponible: $${formatCurrency(
              currentBal
            )}`
          );
        }

        tx.update(accRef, { balance: currentBal - payAmount });

        const txRef = doc(collection(db, `users/${user.uid}/transactions`));
        tx.set(txRef, {
          type: "egreso",
          amount: payAmount,
          description: `Pago suscripción: ${paymentModal.item.name}`,
          category: "suscripciones",
          accountId: paymentModal.accountId,
          date: new Date().toISOString(),
        });
      });

      toast.success(t("recurrent.paidSuccess") || "Pago registrado y debitado de tu cuenta");
      setPaymentModal({ isOpen: false, item: null, accountId: "" });
    } catch (err) {
      console.error("Error en pago recurrente:", err);
      toast.error(err.message || "Error al registrar el pago");
    }
  };

  const handleDelete = async () => {
    if (!user || !confirmModal.id) return;
    try {
      await deleteDoc(doc(db, `users/${user.uid}/recurrents`, confirmModal.id));
      toast.success("Suscripción eliminada");
    } catch (err) {
      console.error("Error eliminando suscripción:", err);
      toast.error("Error al eliminar");
    } finally {
      setConfirmModal({ isOpen: false, id: null });
    }
  };

  const selectedPaymentAccount = accounts.find((a) => a.id === paymentModal.accountId);
  const paymentAmountNum = Number(paymentModal.item?.amount) || 0;
  const payAccountBalance = Number(selectedPaymentAccount?.balance) || 0;
  const paymentHasInsufficient =
    selectedPaymentAccount &&
    selectedPaymentAccount.type !== "credito" &&
    paymentAmountNum > payAccountBalance;

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-3 bg-theme-primary/10 rounded-2xl text-theme-primary">
          <CalendarClock size={28} />
        </div>
        <div>
          <h2 className="text-xl sm:text-2xl font-display font-bold text-zinc-900 dark:text-zinc-50">
            {t("recurrent.title") || "Suscripciones y Pagos Recurrentes"}
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400">
            {t("recurrent.desc") || "Administra servicios, seguros y pagos fijos periódicos"}
          </p>
        </div>
      </div>

      {/* Formulario */}
      <form
        onSubmit={handleAddOrUpdate}
        className="bg-white dark:bg-zinc-850 p-5 rounded-3xl shadow-xs border border-zinc-200/80 dark:border-zinc-800/80 flex flex-col gap-4"
      >
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <input
            type="text"
            placeholder={t("module.name") || "Nombre (Netflix, Gym, etc.)"}
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-zinc-900 dark:text-zinc-50 outline-none focus:ring-2 focus:ring-theme-primary"
            required
          />
          <input
            type="number"
            step="any"
            placeholder={t("module.amount") || "Monto ($ COP)"}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-2.5 font-mono text-sm tabular-nums text-zinc-900 dark:text-zinc-50 outline-none focus:ring-2 focus:ring-theme-primary"
            required
          />
          <CustomSelect
            value={frequency}
            onChange={setFrequency}
            options={[
              { value: "Mensual", label: "Mensual" },
              { value: "Quincenal", label: "Quincenal" },
              { value: "Semanal", label: "Semanal" },
              { value: "Anual", label: "Anual" },
            ]}
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 flex items-center gap-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-2.5">
            <CalendarDays size={16} className="text-zinc-400 shrink-0" />
            <input
              type="date"
              value={billingDate}
              onChange={(e) => setBillingDate(e.target.value)}
              className="flex-1 bg-transparent outline-none text-xs sm:text-sm text-zinc-900 dark:text-zinc-50"
            />
          </div>

          <div className="flex gap-2 w-full sm:w-auto">
            {editingId && (
              <button
                type="button"
                onClick={handleCancelEdit}
                className="px-4 py-2.5 min-h-[44px] bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded-xl font-semibold text-xs transition-colors cursor-pointer"
              >
                Cancelar
              </button>
            )}
            <button
              type="submit"
              disabled={isSubmitting || !name.trim() || !amount || Number(amount) <= 0 || !billingDate}
              className="flex-1 sm:flex-initial min-h-[44px] px-6 py-2.5 bg-theme-primary hover:bg-theme-primary-hover text-white rounded-xl font-semibold text-xs flex items-center justify-center gap-2 transition-colors shadow-sm glow-primary disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none cursor-pointer"
            >
              {editingId ? <Pencil size={16} /> : <Plus size={16} />}
              {isSubmitting ? (editingId ? "Actualizando…" : "Guardando…") : (editingId ? "Actualizar" : "Añadir Suscripción")}
            </button>
          </div>
        </div>
      </form>

      {/* Lista */}
      <div className="space-y-3">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 bg-white dark:bg-zinc-850 p-4 rounded-2xl border border-zinc-200/70 dark:border-zinc-800/70 shadow-2xs hover:shadow-xs transition-all"
          >
            <div>
              <h3 className="font-bold text-zinc-900 dark:text-zinc-50 text-base">{item.name}</h3>
              <div className="flex flex-wrap items-center gap-2 mt-1">
                <span className="text-xs text-zinc-400 flex items-center gap-1">
                  <Repeat size={12} /> {item.frequency || "Mensual"}
                </span>
                {item.billingDate && (
                  <span className="text-xs bg-theme-primary/10 text-theme-primary px-2 py-0.5 rounded-full flex items-center gap-1 font-medium">
                    <CalendarDays size={11} />
                    {new Date(item.billingDate + "T00:00:00").toLocaleDateString()}
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto">
              <span className="font-mono font-bold text-zinc-900 dark:text-zinc-50 text-base tabular-nums">
                ${formatCurrency(item.amount)}
              </span>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() =>
                    setPaymentModal({
                      isOpen: true,
                      item,
                      accountId: accounts[0]?.id || "",
                    })
                  }
                  className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center text-emerald-600 bg-emerald-100 hover:bg-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 rounded-xl transition-colors cursor-pointer"
                  title="Pagar / Registrar egreso"
                  aria-label={`Pagar suscripción ${item.name}`}
                >
                  <CreditCard size={16} />
                </button>
                <button
                  type="button"
                  onClick={() => handleEdit(item)}
                  className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center text-zinc-400 hover:text-theme-primary hover:bg-theme-primary/10 rounded-xl transition-colors cursor-pointer"
                  title="Editar"
                  aria-label={`Editar suscripción ${item.name}`}
                >
                  <Pencil size={16} />
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmModal({ isOpen: true, id: item.id })}
                  className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center text-zinc-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-xl transition-colors cursor-pointer"
                  title="Eliminar"
                  aria-label={`Eliminar suscripción ${item.name}`}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}

        {items.length === 0 && (
          <div className="py-12 text-center text-xs text-zinc-400 bg-white/40 dark:bg-zinc-850/40 rounded-3xl border border-dashed border-zinc-200 dark:border-zinc-800">
            No tienes pagos recurrentes registrados.
          </div>
        )}
      </div>

      {/* Modal de Pago / Débito de Suscripción */}
      {paymentModal.isOpen && (
        <div
          className="fixed inset-0 z-[60] flex justify-center items-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-150"
          onClick={() => setPaymentModal({ isOpen: false, item: null, accountId: "" })}
          role="dialog"
          aria-modal="true"
          aria-labelledby="pay-recurrent-title"
        >
          <div
            className="w-full max-w-sm bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden p-6 flex flex-col gap-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center pb-2 border-b border-zinc-100 dark:border-zinc-800">
              <h2 id="pay-recurrent-title" className="font-bold text-base text-zinc-900 dark:text-zinc-50">
                Pagar Suscripción
              </h2>
              <button
                type="button"
                onClick={() => setPaymentModal({ isOpen: false, item: null, accountId: "" })}
                aria-label="Cerrar modal"
                className="w-10 h-10 flex items-center justify-center text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors focus-visible:ring-2 focus-visible:ring-theme-primary outline-none cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3">
              <p className="text-zinc-500 text-xs">
                Selecciona la cuenta de la cual se debitará este pago de suscripción:
              </p>

              <div className="bg-zinc-50 dark:bg-zinc-800/60 p-3.5 rounded-2xl border border-zinc-200/60 dark:border-zinc-700/60 flex justify-between items-center">
                <span className="font-semibold text-sm text-zinc-900 dark:text-zinc-100">
                  {paymentModal.item?.name}
                </span>
                <span className="text-rose-600 font-mono font-bold text-base tabular-nums">
                  ${formatCurrency(paymentAmountNum)}
                </span>
              </div>

              {/* Selector de cuenta personalizado */}
              <AccountSelector
                accounts={accounts}
                selectedAccountId={paymentModal.accountId}
                onChange={(id) => setPaymentModal({ ...paymentModal, accountId: id })}
                requiredAmount={paymentAmountNum}
                label="Cuenta de Débito"
                placeholder="Selecciona la cuenta"
              />

              {paymentHasInsufficient && (
                <AlertBanner
                  type="danger"
                  title="Saldo insuficiente"
                  message={`La cuenta no tiene suficientes fondos para pagar $${formatCurrency(
                    paymentAmountNum
                  )}.`}
                />
              )}

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setPaymentModal({ isOpen: false, item: null, accountId: "" })}
                  className="flex-1 py-2.5 min-h-[44px] rounded-xl font-semibold text-xs bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={confirmPayment}
                  disabled={paymentHasInsufficient || !paymentModal.accountId || !paymentModal.item || paymentAmountNum <= 0}
                  className="flex-1 py-2.5 min-h-[44px] rounded-xl font-semibold text-xs bg-theme-primary hover:bg-theme-primary-hover text-white transition-colors shadow-md disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none cursor-pointer"
                >
                  Confirmar Pago
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Delete */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ isOpen: false, id: null })}
        onConfirm={handleDelete}
        title="Eliminar suscripción"
        message="¿Estás seguro de que deseas eliminar esta suscripción recurrente?"
        confirmText="Eliminar"
        type="danger"
      />
    </div>
  );
}

export default RecurrentesView;
