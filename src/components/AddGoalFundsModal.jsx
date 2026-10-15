import { useState } from "react";
import { X, Target, ArrowUpCircle } from "lucide-react";
import { doc, updateDoc, increment, collection, addDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import toast from "react-hot-toast";

export default function AddGoalFundsModal({ isOpen, onClose, goal, accounts = [] }) {
  const [amount, setAmount] = useState("");
  const [selectedAccountId, setSelectedAccountId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !goal) return null;

  const currentSaved = Number(goal.savedAmount) || 0;
  const target = Number(goal.targetAmount) || 1;
  const currentProgress = Math.min((currentSaved / target) * 100, 100).toFixed(0);

  const parsedAmount = Number(amount) || 0;
  const projectedSaved = currentSaved + parsedAmount;
  const projectedProgress = Math.min((projectedSaved / target) * 100, 100).toFixed(0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!auth.currentUser) {
      toast.error("Debes iniciar sesión para abonar a la meta");
      return;
    }

    const numAmount = Number(amount);
    if (!numAmount || numAmount <= 0) {
      toast.error("Ingresa un monto válido mayor a 0");
      return;
    }

    setIsSubmitting(true);
    try {
      // 1. Atomically increment the goal's savedAmount
      await updateDoc(doc(db, `users/${auth.currentUser.uid}/goals`, goal.id), {
        savedAmount: increment(numAmount),
      });

      // 2. If a real account is selected, deduct funds and record expense
      if (selectedAccountId && selectedAccountId !== "virtual") {
        const selectedAcc = accounts.find((a) => a.id === selectedAccountId);
        const accountName = selectedAcc ? selectedAcc.name : "Cuenta";

        // Atomically decrement account balance
        await updateDoc(doc(db, `users/${auth.currentUser.uid}/accounts`, selectedAccountId), {
          balance: increment(-numAmount),
        });

        // Record expense transaction
        await addDoc(collection(db, `users/${auth.currentUser.uid}/transactions`), {
          type: "egreso",
          amount: numAmount,
          description: `Abono a meta: ${goal.name}`,
          accountId: selectedAccountId,
          date: new Date().toISOString(),
        });

        toast.success(`Abonados $${numAmount.toLocaleString()} descontados de ${accountName}`);
      } else {
        toast.success(`Abono virtual de $${numAmount.toLocaleString()} registrado`);
      }

      setAmount("");
      setSelectedAccountId("");
      onClose();
    } catch (err) {
      console.error("Error al abonar fondos a la meta:", err);
      toast.error("Error al registrar el abono");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickAdd = (value) => {
    setAmount(value.toString());
  };

  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-white/95 dark:bg-zinc-900/95 backdrop-blur-2xl rounded-3xl shadow-2xl border border-zinc-200/60 dark:border-zinc-800/60 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-zinc-100 dark:border-zinc-800 flex justify-between items-center bg-zinc-50/50 dark:bg-zinc-950/50">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-2xl">
              <Target size={22} />
            </div>
            <div>
              <h2 className="font-display font-bold text-lg text-zinc-900 dark:text-zinc-50">
                Abonar a Meta
              </h2>
              <p className="text-xs text-zinc-500 font-sans">{goal.name}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 p-1.5 rounded-xl transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-5">
          {/* Progress preview card */}
          <div className="bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/50 dark:border-amber-900/30 rounded-2xl p-4">
            <div className="flex justify-between items-baseline mb-2">
              <span className="text-xs font-semibold text-amber-800 dark:text-amber-300">
                Ahorrado actualmente
              </span>
              <span className="text-sm font-bold text-amber-900 dark:text-amber-200">
                ${currentSaved.toLocaleString()} / ${target.toLocaleString()}
              </span>
            </div>
            <div className="w-full bg-amber-200/50 dark:bg-amber-900/40 rounded-full h-2.5 overflow-hidden">
              <div
                className="bg-amber-500 h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${currentProgress}%` }}
              />
            </div>
            {parsedAmount > 0 && (
              <p className="text-[11px] text-amber-700 dark:text-amber-400 mt-2 text-right">
                Con este abono alcanzarás: <strong className="font-bold">${projectedSaved.toLocaleString()} ({projectedProgress}%)</strong>
              </p>
            )}
          </div>

          {/* Amount input */}
          <div>
            <label className="block text-xs font-display font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-2">
              Monto a abonar
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 font-bold text-lg">
                $
              </span>
              <input
                type="number"
                min="1"
                step="any"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0"
                className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-2xl pl-9 pr-4 py-3.5 text-lg font-bold text-zinc-900 dark:text-zinc-50 outline-none focus:ring-2 focus:ring-amber-500 transition-all"
                autoFocus
                required
              />
            </div>
            {/* Quick buttons */}
            <div className="flex gap-2 mt-2">
              {[10000, 50000, 100000].map((val) => (
                <button
                  type="button"
                  key={val}
                  onClick={() => handleQuickAdd(val)}
                  className="text-xs py-1 px-2.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-600 dark:text-zinc-400 transition-colors cursor-pointer"
                >
                  +${val.toLocaleString()}
                </button>
              ))}
            </div>
          </div>

          {/* Account selector (optional) */}
          <div>
            <label className="block text-xs font-display font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-2">
              Origen de los fondos
            </label>
            <div className="relative">
              <select
                value={selectedAccountId}
                onChange={(e) => setSelectedAccountId(e.target.value)}
                className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-2xl px-4 py-3.5 text-sm text-zinc-900 dark:text-zinc-50 outline-none focus:ring-2 focus:ring-amber-500 transition-all cursor-pointer"
              >
                <option value="">
                  Solo abono virtual (no descontar de ninguna cuenta)
                </option>
                {accounts.map((acc) => (
                  <option key={acc.id} value={acc.id}>
                    Descontar de {acc.name} (${Number(acc.balance || 0).toLocaleString()})
                  </option>
                ))}
              </select>
            </div>
            <p className="text-[11px] text-zinc-400 dark:text-zinc-500 mt-1.5">
              {selectedAccountId
                ? "Se descontará el monto del saldo de la cuenta y se creará un movimiento de egreso."
                : "Aumentará el monto ahorrado en la meta sin afectar tus cuentas bancarias."}
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-2xl text-sm font-semibold text-zinc-600 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !amount || Number(amount) <= 0}
              className="flex-1 py-3 rounded-2xl text-sm font-semibold text-white bg-amber-600 hover:bg-amber-700 transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
            >
              <ArrowUpCircle size={18} />
              {isSubmitting ? "Abonando..." : "Confirmar Abono"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
