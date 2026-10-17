import { useState, useMemo } from "react";
import {
  Pencil,
  Trash2,
  Ban,
  Search,
  Copy,
  ArrowRightLeft,
  Filter,
  X,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { getCategoryMeta } from "../utils/categories";
import { formatCurrency } from "../utils/format";
import AccountSelector from "./ui/AccountSelector";
import CustomSelect from "./ui/CustomSelect";


export default function MovementsView({
  transactions = [],
  accounts = [],
  handleDeleteTransaction,
  onEdit,
  onAnnul,
  onDuplicate,
}) {
  const { t, i18n } = useTranslation();
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all"); // "all" | "ingreso" | "egreso" | "transfer"
  const [accountFilter, setAccountFilter] = useState("all");
  const [periodFilter, setPeriodFilter] = useState("all"); // "all" | "today" | "week" | "month"

  // Filter transactions
  const filteredTransactions = useMemo(() => {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekStart = new Date(todayStart);
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    return transactions.filter((tx) => {
      // Type
      if (typeFilter === "ingreso" && tx.type !== "ingreso") return false;
      if (typeFilter === "egreso" && tx.type !== "egreso") return false;
      if (typeFilter === "transfer" && !tx.transferId) return false;

      // Account
      if (accountFilter !== "all" && tx.accountId !== accountFilter) return false;

      // Period
      if (periodFilter === "today" && new Date(tx.date) < todayStart) return false;
      if (periodFilter === "week" && new Date(tx.date) < weekStart) return false;
      if (periodFilter === "month" && new Date(tx.date) < monthStart) return false;

      // Search
      if (search.trim()) {
        const q = search.toLowerCase();
        const matchesDesc = (tx.description || "").toLowerCase().includes(q);
        const matchesCat = (tx.category || "").toLowerCase().includes(q);
        const matchesAmt = (tx.amount || "").toString().includes(q);
        if (!matchesDesc && !matchesCat && !matchesAmt) return false;
      }

      return true;
    });
  }, [transactions, typeFilter, accountFilter, periodFilter, search]);


  // Group by date
  const grouped = useMemo(() => {
    return filteredTransactions.reduce((acc, tx) => {
      const dateKey = new Date(tx.date).toLocaleDateString(i18n.language, {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
      if (!acc[dateKey]) acc[dateKey] = [];
      acc[dateKey].push(tx);
      return acc;
    }, {});
  }, [filteredTransactions, i18n.language]);

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
    if (key === todayStr) return t("movements.today") || "Hoy";
    if (key === yesterdayStr) return t("movements.yesterday") || "Ayer";
    return key;
  };

  const hasActiveFilters =
    search.trim() !== "" ||
    typeFilter !== "all" ||
    accountFilter !== "all" ||
    periodFilter !== "all";

  const clearFilters = () => {
    setSearch("");
    setTypeFilter("all");
    setAccountFilter("all");
    setPeriodFilter("all");
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-display font-bold text-zinc-900 dark:text-zinc-50 tracking-tight">
            {t("movements.title") || "Historial de Movimientos"}
          </h2>
          <p className="text-xs text-zinc-400">
            {filteredTransactions.length} de {transactions.length} registros
          </p>
        </div>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={clearFilters}
            className="self-start sm:self-auto inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/40 hover:bg-rose-100 transition-colors cursor-pointer"
          >
            <X size={14} />
            <span>Limpiar filtros</span>
          </button>
        )}
      </div>

      {/* Filter and Search Controls */}
      <div className="bg-white/80 dark:bg-zinc-850/80 backdrop-blur-xl border border-zinc-200/80 dark:border-zinc-800/80 p-4 rounded-3xl shadow-xs space-y-3">
        {/* Search Input */}
        <div className="relative">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por descripción, categoría o monto..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-zinc-100 dark:bg-zinc-800 text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 outline-none focus:ring-2 focus:ring-theme-primary transition-all border border-zinc-200/60 dark:border-zinc-700/60"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Filter Pills */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
          {/* Tipo */}
          <div className="flex bg-zinc-100 dark:bg-zinc-800 p-1 rounded-2xl">
            {[
              { id: "all", label: "Todos" },
              { id: "ingreso", label: "Ingresos" },
              { id: "egreso", label: "Gastos" },
              { id: "transfer", label: "Transfers" },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setTypeFilter(tab.id)}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-xl transition-all cursor-pointer truncate ${
                  typeFilter === tab.id
                    ? "bg-white dark:bg-zinc-700 text-theme-primary shadow-xs font-bold"
                    : "text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Periodo */}
          <CustomSelect
            value={periodFilter}
            onChange={setPeriodFilter}
            options={[
              { value: "all", label: "Todo el tiempo" },
              { value: "today", label: "Solo hoy" },
              { value: "week", label: "Esta semana" },
              { value: "month", label: "Este mes" },
            ]}
            size="sm"
          />

          {/* Cuenta */}
          <AccountSelector
            accounts={accounts}
            selectedAccountId={accountFilter}
            onChange={setAccountFilter}
            allowAll
            allLabel="Todas las cuentas"
            size="sm"
          />
        </div>
      </div>

      {/* Movements List */}
      {filteredTransactions.length === 0 ? (
        <div className="bg-white/50 dark:bg-zinc-850/40 rounded-3xl border border-dashed border-zinc-200 dark:border-zinc-800 p-10 text-center flex flex-col items-center gap-2">
          <Filter size={32} className="text-zinc-300 dark:text-zinc-600" />
          <p className="text-sm font-semibold text-zinc-500 dark:text-zinc-400">
            No se encontraron movimientos
          </p>
          <p className="text-xs text-zinc-400">
            {hasActiveFilters
              ? "Prueba cambiando o limpiando los filtros de búsqueda."
              : "Registra tu primer ingreso o gasto con el botón principal."}
          </p>
        </div>
      ) : (
        Object.entries(grouped).map(([dateKey, items]) => (
          <div key={dateKey} className="space-y-2">
            <p className="text-xs font-display font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider px-1">
              {formatLabel(dateKey)}
            </p>
            <div className="flex flex-col gap-2">
              {items.map((tx) => {
                const meta = getCategoryMeta(tx.category || tx);
                const CatIcon = tx.transferId ? ArrowRightLeft : meta.icon;
                const isTransfer = !!tx.transferId;

                return (
                  <div
                    key={tx.id}
                    className="group flex items-center justify-between bg-white dark:bg-zinc-850 rounded-2xl p-3.5 sm:p-4 shadow-2xs hover:shadow-xs transition-all border border-zinc-200/70 dark:border-zinc-800/70 hover:border-zinc-300 dark:hover:border-zinc-700 gap-3"
                  >
                    {/* Icono */}
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${
                        isTransfer
                          ? "bg-theme-primary/10 text-theme-primary border-theme-primary/20"
                          : meta.colorClass
                      }`}
                    >
                      <CatIcon size={18} />
                    </div>

                    {/* Contenido */}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-0.5">
                        <div className="flex items-center gap-2 min-w-0 pr-2">
                          <p className="font-semibold text-zinc-900 dark:text-zinc-50 text-sm truncate">
                            {tx.description}
                          </p>
                          {isTransfer && (
                            <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-theme-primary/10 text-theme-primary font-bold shrink-0">
                              Transferencia
                            </span>
                          )}
                        </div>
                        <span
                          className={`font-mono font-bold shrink-0 text-sm sm:text-base tabular-nums ${
                            tx.type === "ingreso"
                              ? "text-emerald-600 dark:text-emerald-400"
                              : "text-rose-600 dark:text-rose-400"
                          }`}
                        >
                          {tx.type === "ingreso" ? "+" : "-"}${formatCurrency(tx.amount || 0)}
                        </span>
                      </div>

                      <div className="text-[11px] text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5 flex-wrap">
                        <span className="inline-block px-1.5 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 font-medium text-zinc-600 dark:text-zinc-300">
                          {isTransfer ? "Transferencia" : meta.label}
                        </span>
                        <span>•</span>
                        <span className="font-medium text-theme-primary">
                          {getAccountName(tx.accountId)}
                        </span>
                        <span>•</span>
                        <span>
                          {new Date(tx.date).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    </div>

                    {/* Acciones */}
                    <div className="flex items-center gap-0.5 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity ml-1 shrink-0">
                      {/* Duplicar */}
                      {!isTransfer && onDuplicate && (
                        <button
                          type="button"
                          onClick={() => onDuplicate(tx)}
                          className="p-1.5 rounded-lg text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors cursor-pointer"
                          title="Duplicar movimiento"
                        >
                          <Copy size={15} />
                        </button>
                      )}

                      {/* Editar (solo si no es transferencia para evitar romper par) */}
                      {!isTransfer && (
                        <button
                          type="button"
                          onClick={() => onEdit(tx)}
                          className="p-1.5 rounded-lg text-zinc-400 hover:bg-theme-primary/10 hover:text-theme-primary transition-colors cursor-pointer"
                          title={t("crud.edit") || "Editar"}
                        >
                          <Pencil size={15} />
                        </button>
                      )}

                      {/* Anular */}
                      <button
                        type="button"
                        onClick={() => onAnnul(tx)}
                        className="p-1.5 rounded-lg text-zinc-400 hover:bg-amber-100 dark:hover:bg-amber-900/30 hover:text-amber-600 dark:hover:text-amber-400 transition-colors cursor-pointer"
                        title={t("crud.annul") || "Anular"}
                      >
                        <Ban size={15} />
                      </button>

                      {/* Eliminar */}
                      <button
                        type="button"
                        onClick={() => handleDeleteTransaction(tx)}
                        className="p-1.5 rounded-lg text-zinc-400 hover:bg-rose-100 dark:hover:bg-rose-900/30 hover:text-rose-600 dark:hover:text-rose-400 transition-colors cursor-pointer"
                        title={t("crud.delete") || "Eliminar"}
                      >
                        <Trash2 size={15} />
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
