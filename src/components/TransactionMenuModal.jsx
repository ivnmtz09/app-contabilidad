import { X, ArrowUpCircle, ArrowDownCircle, HandCoins, Target } from "lucide-react";

function TransactionMenuModal({ isOpen, onClose, onSelectOption }) {
  if (!isOpen) return null;

  const options = [
    {
      action: "ingreso",
      label: "Ingreso",
      icon: ArrowUpCircle,
      color: "text-emerald-500",
      bg: "bg-emerald-50 dark:bg-emerald-900/20",
    },
    {
      action: "egreso",
      label: "Egreso",
      icon: ArrowDownCircle,
      color: "text-rose-500",
      bg: "bg-rose-50 dark:bg-rose-900/20",
    },
    {
      action: "deuda",
      label: "Deuda",
      icon: HandCoins,
      color: "text-violet-500",
      bg: "bg-violet-50 dark:bg-violet-900/20",
    },
    {
      action: "meta",
      label: "Meta",
      icon: Target,
      color: "text-indigo-500",
      bg: "bg-indigo-50 dark:bg-indigo-900/20",
    },
  ];

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center">
      <div className="bg-white dark:bg-zinc-900 w-full sm:max-w-sm rounded-t-3xl sm:rounded-3xl p-6 pb-8 animate-in slide-in-from-bottom-full">
        <div className="flex items-center justify-between mb-2">
          <h2 className="font-display font-bold text-lg text-zinc-900 dark:text-zinc-50">
            Nuevo Movimiento
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-6">
          {options.map((opt) => {
            const Icon = opt.icon;
            return (
              <button
                key={opt.action}
                onClick={() => onSelectOption(opt.action)}
                className="flex flex-col items-center gap-2 p-5 rounded-2xl bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors cursor-pointer"
              >
                <Icon size={28} className={opt.color} />
                <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  {opt.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default TransactionMenuModal;
