import { Pencil, Trash2, Ban } from "lucide-react";
import { useTranslation } from "react-i18next";
import { getCategoryMeta } from "../utils/categories";

function MovementsView({ transactions, accounts, handleDeleteTransaction, onEdit, onAnnul }) {
  const { t, i18n } = useTranslation();

  const grouped = transactions.reduce((acc, tx) => {
    const dateKey = new Date(tx.date).toLocaleDateString(i18n.language, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(tx);
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
            <div className="flex flex-col gap-2.5">
              {items.map((tx) => {
                const meta = getCategoryMeta(tx);
                const CatIcon = meta.icon;

                return (
                  <div
                    key={tx.id}
                    className="group flex items-center justify-between bg-white/90 dark:bg-zinc-800/70 rounded-2xl p-4 shadow-xs hover:bg-white dark:hover:bg-zinc-800 transition-all border border-zinc-200/60 dark:border-zinc-700/60 hover:border-zinc-300 dark:hover:border-zinc-600 gap-3"
                  >
                    {/* Icono de Categoría */}
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${meta.colorClass}`}>
                      <CatIcon size={18} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-1">
                        <p className="font-semibold text-zinc-900 dark:text-zinc-50 text-sm sm:text-base truncate pr-2">
                          {tx.description}
                        </p>
                        <span
                          className={`font-bold shrink-0 text-sm sm:text-base ${
                            tx.type === "ingreso"
                              ? "text-emerald-600 dark:text-emerald-400"
                              : "text-rose-600 dark:text-rose-400"
                          }`}
                        >
                          {tx.type === "ingreso" ? "+" : "-"}$
                          {Number(tx.amount).toLocaleString("es-CO")}
                        </span>
                      </div>
                      <div className="text-xs text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5 flex-wrap">
                        <span className="inline-block px-1.5 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-700/60 text-[11px] font-medium text-zinc-600 dark:text-zinc-300">
                          {meta.label}
                        </span>
                        <span>•</span>
                        <span className="font-medium text-theme-primary">{getAccountName(tx.accountId)}</span>
                        <span>•</span>
                        <span>{new Date(tx.date).toLocaleDateString()}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity ml-2 shrink-0">
                      <button
                        onClick={() => onEdit(tx)}
                        className="p-2 rounded-xl text-zinc-400 hover:bg-theme-primary-light hover:text-theme-primary transition-colors cursor-pointer"
                        title={t("crud.edit")}
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteTransaction(tx)}
                        className="p-2 rounded-xl text-zinc-400 hover:bg-rose-100 hover:text-rose-600 dark:hover:bg-rose-900/30 dark:hover:text-rose-400 transition-colors cursor-pointer"
                        title={t("crud.delete")}
                      >
                        <Trash2 size={16} />
                      </button>
                      <button
                        onClick={() => onAnnul(tx)}
                        className="p-2 rounded-xl text-zinc-400 hover:bg-amber-100 hover:text-amber-600 dark:hover:bg-amber-900/30 dark:hover:text-amber-400 transition-colors cursor-pointer"
                        title={t("crud.annul")}
                      >
                        <Ban size={16} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default MovementsView;
