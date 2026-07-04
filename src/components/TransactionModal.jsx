import { useState } from "react";
import { X } from "lucide-react";

function TransactionModal({ isOpen, onClose, onSave, type, accounts }) {
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [accountId, setAccountId] = useState(accounts[0]?.name || "");

  if (!isOpen) return null;

  const isIngreso = type === "ingreso";

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!amount || !description || !accountId) return;
    onSave({
      amount: Number(amount),
      description,
      accountId,
      type,
      date: new Date().toISOString(),
    });
    setAmount("");
    setDescription("");
    setAccountId(accounts[0]?.name || "");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl w-full max-w-sm mx-4 shadow-xl flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2
            className={`text-lg font-display font-bold ${isIngreso ? "text-emerald-500" : "text-rose-500"}`}
          >
            {isIngreso ? "Registrar Ingreso" : "Registrar Egreso"}
          </h2>
          <button
            onClick={onClose}
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
              <option key={acc.id} value={acc.name}>
                {acc.name}
              </option>
            ))}
          </select>

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
