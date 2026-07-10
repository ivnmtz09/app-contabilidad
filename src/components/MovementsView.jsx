import { Pencil, Trash2 } from "lucide-react";
import { toast } from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { formatCurrency } from "../utils/format";

function MovementsView({ transactions, accounts, handleDeleteTransaction }) {
  const { t, i18n } = useTranslation();

  const grouped = transactions.reduce((acc, t) => {
    const dateKey = new Date(t.date).toLocaleDateString(i18n.language, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(t);
    return acc;
  }, {});

  const getAccountName = (id) => {
    const acc = accounts.find((a) => a.id === id);
    return acc ? acc.name : id;
  };

  const todayStr = new Date().toLocaleDateString(i18n.language, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toLocaleDateString(i18n.language, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const formatLabel = (key) => {
    if (key === todayStr) return t("movements.today");
    if (key === yesterdayStr) return t("movements.yesterday");
    return key;
  };

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-xl font-display font-bold text-zinc-900 dark:text-zinc-50">
        {t("movements.title")}
      </h2>

      {transactions.length === 0 ? (
        <p className="text-sm font-sans text-zinc-400 dark:text-zinc-500 text-center py-8">
          Sin movimientos registrados
        </p>
      ) : (
        Object.entries(grouped).map(([dateKey, items]) => (
          <div key={dateKey}>
            <p className="text-xs font-display font-semibold text-zinc-400 dark:text-zinc-500 uppercase mb-2">
              {formatLabel(dateKey)}
            </p>
            <div className="flex flex-col gap-2">
              {items.map((tx) => (
                <div
                  key={tx.id}
                  className="group flex items-center justify-between bg-white dark:bg-zinc-800 rounded-2xl p-4 shadow-sm hover:bg-zinc-50 dark:hover:bg-zinc-800/80 transition-colors border border-transparent hover:border-zinc-200 dark:hover:border-zinc-700"
                >
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-1">
                      <p className="font-medium text-zinc-900 dark:text-zinc-50">
                        {tx.description}
                      </p>
                      <span
                        className={`font-bold ${tx.type === "ingreso" ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}`}
                      >
                        {tx.type === "ingreso" ? "+" : "-"}$
                        {Number(tx.amount).toLocaleString("es-CO")}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">
                      {getAccountName(tx.accountId)} • {new Date(tx.date).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="flex items-center gap-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity ml-3">
                    <button
                      onClick={() => toast.error("Edición en desarrollo")}
                      className="p-2 rounded-lg text-zinc-400 hover:bg-violet-100 hover:text-violet-600 dark:hover:bg-violet-900/30 dark:hover:text-violet-400 transition-colors"
                      title={t("crud.edit")}
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => handleDeleteTransaction(tx)}
                      className="p-2 rounded-lg text-zinc-400 hover:bg-rose-100 hover:text-rose-600 dark:hover:bg-rose-900/30 dark:hover:text-rose-400 transition-colors"
                      title={t("crud.delete")}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default MovementsView;
