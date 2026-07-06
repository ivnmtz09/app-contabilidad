import { useState } from "react";
import { X } from "lucide-react";

function TransactionModal({ isOpen, onClose, onSave, type, accounts }) {
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [accountId, setAccountId] = useState(accounts[0]?.id || "");
  const [applyTax, setApplyTax] = useState(false);

  const handleClose = () => {
    setAmount('');
    setDescription('');
    setApplyTax(false);
    onClose();
  };

  if (!isOpen) return null;

  const isIngreso = type === "ingreso";

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!amount || !description || !accountId) return;
    let finalAmount = Number(amount);
    if (type === "egreso" && accountId !== "efectivo" && applyTax) {
      finalAmount = finalAmount + finalAmount * 0.004;
    }
    onSave({
      amount: finalAmount,
      description,
      accountId,
      type,
      date: new Date().toISOString(),
    });
    setAccountId(accounts[0]?.name || "");
    handleClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center" onClick={handleClose}>
      <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl w-full max-w-sm mx-4 shadow-xl flex flex-col gap-4" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between">
          <h2
            className={`text-lg font-display font-bold ${isIngreso ? "text-emerald-500" : "text-rose-500"}`}
          >
            {isIngreso ? "Registrar Ingreso" : "Registrar Egreso"}
          </h2>
          <button
            onClick={handleClose}
            className="p-1 rounded-lg text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="number"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Monto"
            className="w-full px-4 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 font-sans text-sm outline-none focus:ring-2 focus:ring-violet-500 transition-all"
          />

          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Descripción"
            className="w-full px-4 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 font-sans text-sm outline-none focus:ring-2 focus:ring-violet-500 transition-all"
          />

          <select
            value={accountId}
            onChange={(e) => setAccountId(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 font-sans text-sm outline-none focus:ring-2 focus:ring-violet-500 transition-all"
          >
            {accounts.map((acc) => (
              <option key={acc.id} value={acc.id}>
                {acc.name}
              </option>
            ))}
          </select>

          {type === "egreso" && accountId !== "efectivo" && (
            <label className="flex items-center gap-2 cursor-pointer mt-2 p-3 bg-zinc-100 dark:bg-zinc-800/50 rounded-xl border border-zinc-200 dark:border-zinc-700">
              <input
                type="checkbox"
                checked={applyTax}
                onChange={(e) => setApplyTax(e.target.checked)}
                className="w-4 h-4 text-violet-600 rounded focus:ring-violet-600 dark:bg-zinc-900 dark:border-zinc-600"
              />
              <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Aplicar impuesto 4x1000
              </span>
            </label>
          )}

          <button
            type="submit"
            className={`w-full font-sans font-semibold px-4 py-2.5 rounded-xl transition-colors cursor-pointer text-white ${isIngreso ? "bg-emerald-500 hover:bg-emerald-600" : "bg-rose-500 hover:bg-rose-600"}`}
          >
            Guardar
          </button>
        </form>
      </div>
    </div>
  );
}

export default TransactionModal;
