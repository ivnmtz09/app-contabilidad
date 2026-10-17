import { useState } from "react";
import { X, Target, ArrowUpCircle } from "lucide-react";
import { doc, updateDoc, increment, collection, runTransaction } from "firebase/firestore";
import { auth, db } from "../firebase";
import toast from "react-hot-toast";
import { formatCurrency } from "../utils/format";
import AccountSelector from "./ui/AccountSelector";
import AlertBanner from "./ui/AlertBanner";

export default function AddGoalFundsModal({ isOpen, onClose, goal, accounts = [] }) {
  const [amount, setAmount] = useState("");
  const [selectedAccountId, setSelectedAccountId] = useState("virtual");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !goal) return null;

  const currentSaved = Number(goal.savedAmount) || 0;
  const target = Number(goal.targetAmount) || 1;
  const currentProgress = Math.min((currentSaved / target) * 100, 100).toFixed(0);

  const parsedAmount = Number(amount) || 0;
  const projectedSaved = currentSaved + parsedAmount;
  const projectedProgress = Math.min((projectedSaved / target) * 100, 100).toFixed(0);

  const selectedAcc = accounts.find((a) => a.id === selectedAccountId);
  const isRealAccount = selectedAccountId && selectedAccountId !== "virtual";
  const accBalance = Number(selectedAcc?.balance) || 0;
  const isCredit = selectedAcc?.type === "credito";
  const hasInsufficientFunds = isRealAccount && !isCredit && parsedAmount > accBalance;

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

    if (hasInsufficientFunds) {
      toast.error(`Saldo insuficiente en "${selectedAcc?.name}"`);
      return;
    }

    setIsSubmitting(true);
    try {
      const uid = auth.currentUser.uid;

      if (isRealAccount) {
        // Ejecución atómica: verificar saldo, decrementar cuenta, incrementar meta, registrar transacción
        await runTransaction(db, async (tx) => {
          const accRef = doc(db, "users", uid, "accounts", selectedAccountId);
          const goalRef = doc(db, `users/${uid}/goals`, goal.id);

          const accSnap = await tx.get(accRef);
          if (!accSnap.exists()) {
            throw new Error("La cuenta seleccionada no existe");
          }

          const currentAccBal = Number(accSnap.data().balance) || 0;
          if (accSnap.data().type !== "credito" && currentAccBal < numAmount) {
            throw new Error(`Saldo insuficiente en "${accSnap.data().name}". Disponible: $${currentAccBal}`);
          }

          // Actualizar cuenta
          tx.update(accRef, { balance: currentAccBal - numAmount });

          // Actualizar meta
          const goalSnap = await tx.get(goalRef);
          const currentGoalSaved = Number(goalSnap.data().savedAmount) || 0;
          tx.update(goalRef, { savedAmount: currentGoalSaved + numAmount });

          // Registrar egreso
          const txRef = doc(collection(db, `users/${uid}/transactions`));
          tx.set(txRef, {
            type: "egreso",
            amount: numAmount,
            description: `Abono a meta: ${goal.name}`,
            category: "metas",
            accountId: selectedAccountId,
            date: new Date().toISOString(),
          });
        });

        toast.success(`Abonados $${formatCurrency(numAmount)} descontados de ${selectedAcc.name}`);
      } else {
        // Abono virtual sin cuenta
        await updateDoc(doc(db, `users/${uid}/goals`, goal.id), {
          savedAmount: increment(numAmount),
        });
        toast.success(`Abono virtual de $${formatCurrency(numAmount)} registrado`);
      }

      setAmount("");
      setSelectedAccountId("virtual");
      onClose();
    } catch (err) {
      console.error("Error al abonar fondos a la meta:", err);
      toast.error(err.message || "Error al registrar el abono");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickAdd = (value) => {
    setAmount(value.toString());
  };

  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-white/95 dark:bg-zinc-900/95 backdrop-blur-2xl rounded-3xl shadow-2xl border border-zinc-200/80 dark:border-zinc-800/80 overflow-hidden p-6 flex flex-col gap-5"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
              <Target size={20} />
            </div>
            <div>
              <h3 className="font-display font-bold text-lg text-zinc-900 dark:text-zinc-50">
                Abonar Fondos
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Meta: <strong>{goal.name}</strong>
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 p-1 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Progress Preview */}
        <div className="bg-zinc-50 dark:bg-zinc-800/60 rounded-2xl p-4 border border-zinc-200/60 dark:border-zinc-700/60 flex flex-col gap-2">
          <div className="flex justify-between text-xs">
            <span className="text-zinc-500">Ahorrado actual:</span>
            <span className="font-mono font-semibold text-zinc-800 dark:text-zinc-200">
              ${formatCurrency(currentSaved)} / ${formatCurrency(target)} ({currentProgress}%)
            </span>
          </div>

          <div className="w-full bg-zinc-200 dark:bg-zinc-700 h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-amber-500 h-full rounded-full transition-all duration-300"
              style={{ width: `${currentProgress}%` }}
            />
          </div>

          {parsedAmount > 0 && (
            <div className="flex justify-between items-center text-xs pt-1 border-t border-zinc-200/60 dark:border-zinc-700/60 text-amber-600 dark:text-amber-400 font-medium">
              <span>Proyección:</span>
              <span className="font-mono font-bold">
                ${formatCurrency(projectedSaved)} ({projectedProgress}%)
              </span>
            </div>
          )}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wide mb-1.5">
              Monto a Abonar ($ COP)
            </label>
            <input
              type="number"
              step="any"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0"
              className={`w-full px-4 py-3 rounded-2xl border font-mono text-lg font-bold tabular-nums outline-none transition-all ${
                hasInsufficientFunds
                  ? "border-rose-500 ring-2 ring-rose-500/20 bg-white dark:bg-zinc-800"
                  : "border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 focus:ring-2 focus:ring-amber-500 text-zinc-900 dark:text-zinc-50"
              }`}
              autoFocus
              required
            />

            {/* Quick buttons */}
            <div className="flex gap-1.5 mt-2">
              {[20000, 50000, 100000, 200000].map((val) => (
                <button
                  type="button"
                  key={val}
                  onClick={() => handleQuickAdd(val)}
                  className="text-xs py-1 px-2.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-600 dark:text-zinc-300 font-mono transition-colors cursor-pointer"
                >
                  +${formatCurrency(val)}
                </button>
              ))}
            </div>
          </div>

          {/* Account selector using custom AccountSelector */}
          <div>
            <AccountSelector
              accounts={accounts}
              selectedAccountId={selectedAccountId}
              onChange={setSelectedAccountId}
              allowAll
              allLabel="Abono virtual (no descontar de cuenta)"
              requiredAmount={parsedAmount}
              label="Origen de los Fondos"
              placeholder="Seleccionar cuenta origen"
            />
          </div>

          {/* Alerta si no alcanza el saldo */}
          {hasInsufficientFunds && selectedAcc && (
            <AlertBanner
              type="danger"
              title="Saldo insuficiente en cuenta origen"
              message={`"${selectedAcc.name}" tiene un saldo de $${formatCurrency(
                accBalance
              )} y quieres abonar $${formatCurrency(parsedAmount)}. Selecciona otra cuenta o ajusta el monto.`}
            />
          )}

          {/* Buttons */}
          <div className="flex gap-2.5 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-xl text-sm font-semibold text-zinc-600 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !amount || Number(amount) <= 0 || hasInsufficientFunds}
              className="flex-1 py-3 rounded-xl text-sm font-semibold text-white bg-amber-600 hover:bg-amber-700 transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shadow-md"
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
