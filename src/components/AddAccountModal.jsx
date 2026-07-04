import { useState } from "react";
import { X } from "lucide-react";

function AddAccountModal({ isOpen, onClose, onAddAccount }) {
  const [name, setName] = useState("");

  if (!isOpen) return null;

  const handleSave = () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    onAddAccount(trimmed);
    setName("");
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl w-full max-w-sm shadow-xl flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-display font-bold text-zinc-900 dark:text-zinc-50">
            Nueva Cuenta
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ej. Nu, Bancolombia"
          className="w-full px-4 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 font-sans text-sm outline-none focus:ring-2 focus:ring-violet-500 transition-all"
        />

        <button
          onClick={handleSave}
          className="w-full bg-violet-600 hover:bg-violet-700 text-white font-sans font-semibold px-4 py-2.5 rounded-xl transition-colors cursor-pointer"
        >
          Guardar
        </button>
      </div>
    </div>
  );
}

export default AddAccountModal;
