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
  ArrowUpCircle,
  ArrowDownCircle,
  Pencil,
  ArrowLeft,
  X,
} from "lucide-react";

import toast from "react-hot-toast";
import ConfirmModal from "./ConfirmModal";
import AddGoalFundsModal from "./AddGoalFundsModal";
import { MetasSkeleton } from "./Loaders";
import { formatCurrency } from "../utils/format";
import AccountSelector from "./ui/AccountSelector";

export function MetasView() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [name, setName] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, item: null });
  const [fundsModal, setFundsModal] = useState({ isOpen: false, goal: null });
  const [isLoaded, setIsLoaded] = useState(false);

  // Edit Goal state
  const [editModal, setEditModal] = useState({
    isOpen: false,
    goal: null,
    name: "",
    targetAmount: "",
  });

  // Withdraw funds state
  const [withdrawModal, setWithdrawModal] = useState({
    isOpen: false,
    goal: null,
    amount: "",
    destinationAccountId: "",
  });

  useEffect(() => {
    if (!user) {
      setItems([]);
      setAccounts([]);
      return;
    }

    const qGoals = query(
      collection(db, `users/${user.uid}/goals`),
      orderBy("createdAt", "desc")
    );
    const unsubGoals = onSnapshot(
      qGoals,
      (snap) => {
        setItems(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
        setIsLoaded(true);
      },
      (error) => {
        console.error("Error al cargar metas:", error);
        toast.error("Error al cargar metas");
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
    if (!name.trim()) {
      toast.error(t("goals.nameRequired") || "Ingresa un nombre para la meta");
      return;
    }
    if (!targetAmount || Number(targetAmount) <= 0) {
      toast.error(t("goals.amountRequired") || "Ingresa un monto objetivo válido");
      return;
    }
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, `users/${user.uid}/goals`), {
        name: name.trim(),
        targetAmount: Number(targetAmount),
        savedAmount: 0,
        createdAt: new Date().toISOString(),
      });
      setName("");
      setTargetAmount("");
      toast.success("Meta creada exitosamente");
    } catch (err) {
      console.error("Error al crear la meta:", err);
      toast.error("Error al crear la meta");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenEdit = (goal) => {
    setEditModal({
      isOpen: true,
      goal,
      name: goal.name,
      targetAmount: goal.targetAmount.toString(),
    });
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!user || !editModal.goal) return;
    const newName = editModal.name.trim();
    const newTarget = Number(editModal.targetAmount);
    if (!newName) {
      toast.error("El nombre no puede estar vacío");
      return;
    }
    if (!newTarget || newTarget <= 0) {
      toast.error("El monto objetivo debe ser mayor a 0");
      return;
    }
    try {
      await updateDoc(doc(db, `users/${user.uid}/goals`, editModal.goal.id), {
        name: newName,
        targetAmount: newTarget,
      });
      toast.success("Meta actualizada");
      setEditModal({ isOpen: false, goal: null, name: "", targetAmount: "" });
    } catch (err) {
      console.error("Error al editar meta:", err);
      toast.error("Error al actualizar la meta");
    }
  };

  const handleOpenWithdraw = (goal) => {
    setWithdrawModal({
      isOpen: true,
      goal,
      amount: "",
      destinationAccountId: accounts[0]?.id || "",
    });
  };

  const handleSaveWithdraw = async (e) => {
    e.preventDefault();
    if (!user || !withdrawModal.goal) return;
    const withdrawNum = Number(withdrawModal.amount);
    const savedAmount = Number(withdrawModal.goal.savedAmount) || 0;

    if (!withdrawNum || withdrawNum <= 0) {
      toast.error("Ingresa un monto válido mayor a 0");
      return;
    }
    if (withdrawNum > savedAmount) {
      toast.error(
        `No puedes retirar más de lo ahorrado ($${formatCurrency(savedAmount)})`
      );
      return;
    }

    try {
      const uid = user.uid;
      const goalId = withdrawModal.goal.id;
      const destId = withdrawModal.destinationAccountId;

      await runTransaction(db, async (tx) => {
        const goalRef = doc(db, `users/${uid}/goals`, goalId);
        const goalSnap = await tx.get(goalRef);
        if (!goalSnap.exists()) throw new Error("La meta no existe");

        const curSaved = Number(goalSnap.data().savedAmount) || 0;
        if (curSaved < withdrawNum) throw new Error("Saldo insuficiente en la meta");

        tx.update(goalRef, { savedAmount: curSaved - withdrawNum });

        if (destId && destId !== "virtual") {
          const accRef = doc(db, "users", uid, "accounts", destId);
          const accSnap = await tx.get(accRef);
          if (accSnap.exists()) {
            const curAccBal = Number(accSnap.data().balance) || 0;
            tx.update(accRef, { balance: curAccBal + withdrawNum });

            const txRef = doc(collection(db, `users/${uid}/transactions`));
            tx.set(txRef, {
              type: "ingreso",
              amount: withdrawNum,
              description: `Retiro de meta: ${withdrawModal.goal.name}`,
              category: "metas",
              accountId: destId,
              date: new Date().toISOString(),
            });
          }
        }
      });

      toast.success(`Retiro de $${formatCurrency(withdrawNum)} completado`);
      setWithdrawModal({ isOpen: false, goal: null, amount: "", destinationAccountId: "" });
    } catch (err) {
      console.error("Error al retirar fondos de la meta:", err);
      toast.error(err.message || "Error al retirar fondos");
    }
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
            {t("goals.title") || "Metas de Ahorro"}
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400">
            {t("goals.desc") || "Establece objetivos y ahorra con transferencias directas"}
          </p>
        </div>
      </div>

      {/* Formulario Crear */}
      <form
        onSubmit={handleAdd}
        className="bg-white/90 dark:bg-zinc-850/90 backdrop-blur-xl p-5 rounded-3xl shadow-xs border border-zinc-200/80 dark:border-zinc-800/80 flex flex-col gap-3"
      >
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            placeholder={t("module.name") || "Nombre de la meta (Ej: Vacaciones)"}
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="flex-1 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-zinc-900 dark:text-zinc-50 outline-none focus:ring-2 focus:ring-amber-500"
            required
          />
          <input
            type="number"
            step="any"
            placeholder={t("goals.target") || "Monto Objetivo ($ COP)"}
            value={targetAmount}
            onChange={(e) => setTargetAmount(e.target.value)}
            className="w-full sm:w-48 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-2.5 font-mono text-sm tabular-nums text-zinc-900 dark:text-zinc-50 outline-none focus:ring-2 focus:ring-amber-500"
            required
          />
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-amber-600 hover:bg-amber-700 text-white rounded-xl px-5 py-3 font-semibold text-xs flex items-center justify-center gap-2 transition-colors shadow-md disabled:opacity-50 cursor-pointer"
        >
          <Plus size={18} /> {t("module.add") || "Crear Meta"}
        </button>
      </form>

      {/* Lista de Metas */}
      <div className="space-y-4">
        {items.map((item) => {
          const target = Number(item.targetAmount) || 1;
          const saved = Number(item.savedAmount) || 0;
          const progress = Math.min((saved / target) * 100, 100).toFixed(0);

          return (
            <div
              key={item.id}
              className="bg-white dark:bg-zinc-850 p-5 rounded-3xl border border-zinc-200/80 dark:border-zinc-800/80 shadow-2xs hover:shadow-xs transition-all space-y-3"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-zinc-900 dark:text-zinc-50 text-base">
                    {item.name}
                  </h3>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    Ahorrado:{" "}
                    <strong className="font-mono text-emerald-500 font-bold tabular-nums">
                      ${formatCurrency(saved)}
                    </strong>{" "}
                    / ${formatCurrency(target)} COP
                  </p>
                </div>

                {/* Acciones */}
                <div className="flex items-center gap-1">
                  {/* Abonar */}
                  <button
                    onClick={() => setFundsModal({ isOpen: true, goal: item })}
                    className="text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 p-2 rounded-xl transition-colors cursor-pointer"
                    title="Abonar fondos"
                  >
                    <ArrowUpCircle size={20} />
                  </button>

                  {/* Retirar */}
                  {saved > 0 && (
                    <button
                      onClick={() => handleOpenWithdraw(item)}
                      className="text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-900/30 p-2 rounded-xl transition-colors cursor-pointer"
                      title="Retirar fondos ahorrados a una cuenta"
                    >
                      <ArrowDownCircle size={20} />
                    </button>
                  )}

                  {/* Editar */}
                  <button
                    onClick={() => handleOpenEdit(item)}
                    className="text-zinc-400 hover:text-theme-primary hover:bg-theme-primary/10 p-2 rounded-xl transition-colors cursor-pointer"
                    title="Editar meta"
                  >
                    <Pencil size={18} />
                  </button>

                  {/* Eliminar */}
                  <button
                    onClick={() => setConfirmModal({ isOpen: true, item })}
                    className="text-zinc-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 p-2 rounded-xl transition-colors cursor-pointer"
                    title="Eliminar meta"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>

              {/* Barra de progreso */}
              <div className="w-full bg-zinc-100 dark:bg-zinc-800 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-amber-500 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="flex justify-between items-center text-xs font-mono font-semibold">
                <span className="text-zinc-400">Progreso acumulado</span>
                <span className="text-amber-600 dark:text-amber-400">{progress}%</span>
              </div>
            </div>
          );
        })}

        {items.length === 0 && (
          <div className="py-12 text-center text-xs text-zinc-400 bg-white/40 dark:bg-zinc-850/40 rounded-3xl border border-dashed border-zinc-200 dark:border-zinc-800">
            No tienes metas de ahorro activas. Crea una para comenzar a reservar fondos.
          </div>
        )}
      </div>

      {/* Edit Goal Modal */}
      {editModal.isOpen && (
        <div
          className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-150"
          onClick={() => setEditModal({ isOpen: false, goal: null, name: "", targetAmount: "" })}
        >
          <div
            className="w-full max-w-sm bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl border border-zinc-200 dark:border-zinc-800 p-6 flex flex-col gap-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center">
              <h3 className="font-display font-bold text-lg text-zinc-900 dark:text-zinc-50">
                Editar Meta
              </h3>
              <button
                type="button"
                onClick={() =>
                  setEditModal({ isOpen: false, goal: null, name: "", targetAmount: "" })
                }
                className="text-zinc-400 hover:text-zinc-600 p-1"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider mb-1.5">
                  Nombre de la meta
                </label>
                <input
                  type="text"
                  value={editModal.name}
                  onChange={(e) => setEditModal({ ...editModal, name: e.target.value })}
                  className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-zinc-900 dark:text-zinc-50 outline-none focus:ring-2 focus:ring-amber-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider mb-1.5">
                  Monto Objetivo ($ COP)
                </label>
                <input
                  type="number"
                  step="any"
                  value={editModal.targetAmount}
                  onChange={(e) => setEditModal({ ...editModal, targetAmount: e.target.value })}
                  className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-2.5 font-mono text-sm tabular-nums text-zinc-900 dark:text-zinc-50 outline-none focus:ring-2 focus:ring-amber-500"
                  required
                />
              </div>

              <div className="flex gap-2 justify-end pt-2">
                <button
                  type="button"
                  onClick={() =>
                    setEditModal({ isOpen: false, goal: null, name: "", targetAmount: "" })
                  }
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-zinc-600 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 transition-colors shadow-md"
                >
                  Guardar Cambios
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Withdraw Funds Modal */}
      {withdrawModal.isOpen && (
        <div
          className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-150"
          onClick={() =>
            setWithdrawModal({
              isOpen: false,
              goal: null,
              amount: "",
              destinationAccountId: "",
            })
          }
        >
          <div
            className="w-full max-w-sm bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl border border-zinc-200 dark:border-zinc-800 p-6 flex flex-col gap-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-display font-bold text-lg text-zinc-900 dark:text-zinc-50">
                  Retirar Fondos
                </h3>
                <p className="text-xs text-zinc-500">
                  Ahorrado: ${formatCurrency(withdrawModal.goal?.savedAmount || 0)} COP
                </p>
              </div>
              <button
                type="button"
                onClick={() =>
                  setWithdrawModal({
                    isOpen: false,
                    goal: null,
                    amount: "",
                    destinationAccountId: "",
                  })
                }
                className="text-zinc-400 hover:text-zinc-600 p-1"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveWithdraw} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider mb-1.5">
                  Monto a Retirar ($ COP)
                </label>
                <input
                  type="number"
                  step="any"
                  value={withdrawModal.amount}
                  onChange={(e) =>
                    setWithdrawModal({ ...withdrawModal, amount: e.target.value })
                  }
                  max={withdrawModal.goal?.savedAmount || 0}
                  placeholder="0"
                  className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-2.5 font-mono text-sm tabular-nums text-zinc-900 dark:text-zinc-50 outline-none focus:ring-2 focus:ring-amber-500"
                  required
                />
              </div>

              <div>
                <AccountSelector
                  accounts={accounts}
                  selectedAccountId={withdrawModal.destinationAccountId}
                  onChange={(id) =>
                    setWithdrawModal({ ...withdrawModal, destinationAccountId: id })
                  }
                  allowAll
                  allLabel="Retiro virtual (no abonar a cuenta)"
                  label="Cuenta de Destino"
                  placeholder="Selecciona cuenta para ingresar los fondos"
                />
              </div>

              <div className="flex gap-2 justify-end pt-2">
                <button
                  type="button"
                  onClick={() =>
                    setWithdrawModal({
                      isOpen: false,
                      goal: null,
                      amount: "",
                      destinationAccountId: "",
                    })
                  }
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-zinc-600 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 transition-colors shadow-md"
                >
                  Confirmar Retiro
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirm Delete */}
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

export default MetasView;
