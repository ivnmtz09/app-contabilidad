import { Plus } from "lucide-react";

function AccountsCard({ accounts, onOpenAdd }) {
  const formatter = new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
  });

  return (
    <div className="bg-white dark:bg-zinc-800 p-6 rounded-3xl shadow-sm flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-display font-semibold text-zinc-900 dark:text-zinc-50">
          Mis Cuentas
        </h3>
        <button
          onClick={onOpenAdd}
          className="p-2 rounded-xl text-violet-600 dark:text-violet-400 hover:bg-violet-100 dark:hover:bg-violet-900/30 transition-colors cursor-pointer"
        >
          <Plus size={20} />
        </button>
      </div>

      <ul className="space-y-2">
        {accounts.map((acc) => (
          <li
            key={acc.id}
            className="flex justify-between items-center py-2 border-b border-zinc-100 dark:border-zinc-700 last:border-b-0"
          >
            <span className="font-sans text-sm text-zinc-700 dark:text-zinc-300">
              {acc.name}
            </span>
            <span className="font-display font-semibold text-sm text-zinc-900 dark:text-zinc-50">
              {formatter.format(acc.balance)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AccountsCard;
