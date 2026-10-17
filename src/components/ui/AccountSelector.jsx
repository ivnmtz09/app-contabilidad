import { useState, useRef, useEffect, useMemo } from "react";
import { ChevronDown, Check, Search, AlertCircle, Wallet } from "lucide-react";
import { formatCurrency } from "../../utils/format";
import { getAccountTypeMeta } from "../../utils/accountTypes";

export default function AccountSelector({
  accounts = [],
  selectedAccountId,
  onChange,
  excludeAccountId = null,
  requiredAmount = 0,
  label = null,
  placeholder = "Selecciona una cuenta",
  disabled = false,
  allowAll = false,
  allLabel = "Todas las cuentas",
  className = "",
  size = "md",
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const containerRef = useRef(null);
  const searchInputRef = useRef(null);

  // Close on outside click or Escape
  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearch("");
      }
    }
    function handleKeyDown(event) {
      if (event.key === "Escape") {
        setIsOpen(false);
        setSearch("");
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const activeAccounts = useMemo(() => {
    return accounts.filter((acc) => !acc.isArchived);
  }, [accounts]);

  const selectedAccount = useMemo(() => {
    if (allowAll && selectedAccountId === "all") {
      return { id: "all", name: allLabel, isAll: true };
    }
    return accounts.find((a) => a.id === selectedAccountId);
  }, [accounts, selectedAccountId, allowAll, allLabel]);

  const filteredAccounts = useMemo(() => {
    let list = activeAccounts;
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (a) =>
          a.name.toLowerCase().includes(q) ||
          (a.type && a.type.toLowerCase().includes(q))
      );
    }
    return list;
  }, [activeAccounts, search]);

  const selectedMeta = selectedAccount && !selectedAccount.isAll
    ? getAccountTypeMeta(selectedAccount.type)
    : null;
  const SelectedIcon = selectedMeta ? selectedMeta.icon : Wallet;

  const numRequired = Number(requiredAmount) || 0;

  return (
    <div className={`relative w-full ${className}`} ref={containerRef}>
      {label && (
        <label className="block text-xs font-semibold text-zinc-600 dark:text-zinc-400 mb-1.5 uppercase tracking-wide">
          {label}
        </label>
      )}

      {/* Trigger Button */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between gap-3 ${
          size === "sm" ? "px-3 py-2 text-xs rounded-xl" : "px-3.5 py-2.5 text-sm rounded-2xl"
        } border transition-all duration-200 text-left cursor-pointer outline-none ${
          isOpen
            ? "border-theme-primary ring-2 ring-theme-primary/20 bg-white dark:bg-zinc-800"
            : "border-zinc-200 dark:border-zinc-700/80 bg-white dark:bg-zinc-800/90 hover:border-zinc-300 dark:hover:border-zinc-600"
        } ${disabled ? "opacity-50 cursor-not-allowed" : "shadow-2xs"}`}
      >

        <div className="flex items-center gap-3 min-w-0 flex-1">
          {selectedAccount ? (
            <>
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border ${
                  selectedAccount.isAll
                    ? "bg-zinc-100 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-300 border-zinc-200 dark:border-zinc-600"
                    : selectedMeta.bgClass
                }`}
              >
                <SelectedIcon size={16} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold text-sm text-zinc-900 dark:text-zinc-50 truncate">
                    {selectedAccount.name}
                  </span>
                  {selectedAccount.type === "credito" && (
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-rose-100 dark:bg-rose-900/40 text-rose-600 dark:text-rose-300 font-medium shrink-0">
                      Crédito
                    </span>
                  )}
                </div>
                {!selectedAccount.isAll && (
                  <p className="text-[11px] text-zinc-400 dark:text-zinc-500 truncate">
                    {selectedMeta.label}
                  </p>
                )}
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2 text-zinc-400 text-sm">
              <Wallet size={16} />
              <span>{placeholder}</span>
            </div>
          )}
        </div>

        {/* Balance Display */}
        {selectedAccount && !selectedAccount.isAll && (
          <div className="text-right shrink-0">
            <span
              className={`font-mono font-bold text-sm tabular-nums block ${
                Number(selectedAccount.balance) < 0
                  ? "text-rose-600 dark:text-rose-400"
                  : "text-zinc-900 dark:text-zinc-100"
              }`}
            >
              ${formatCurrency(selectedAccount.balance || 0)}
            </span>
            {numRequired > 0 &&
              Number(selectedAccount.balance) < numRequired &&
              selectedAccount.type !== "credito" && (
                <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-rose-500">
                  <AlertCircle size={10} /> Saldo bajo
                </span>
              )}
          </div>
        )}

        <ChevronDown
          size={18}
          className={`shrink-0 text-zinc-400 transition-transform duration-200 ${
            isOpen ? "rotate-180 text-theme-primary" : ""
          }`}
        />
      </button>

      {/* Popover Dropdown */}
      {isOpen && (
        <div className="absolute left-0 right-0 mt-2 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-xl border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-72">
          {/* Search bar when accounts > 3 */}
          {activeAccounts.length > 3 && (
            <div className="p-2 border-b border-zinc-100 dark:border-zinc-800">
              <div className="relative flex items-center">
                <Search size={14} className="absolute left-3 text-zinc-400" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Buscar cuenta..."
                  className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 outline-none focus:ring-1 focus:ring-theme-primary"
                />
              </div>
            </div>
          )}

          {/* List */}
          <div className="overflow-y-auto custom-scrollbar p-1.5 space-y-1 flex-1">
            {allowAll && (
              <button
                type="button"
                onClick={() => {
                  onChange("all");
                  setIsOpen(false);
                  setSearch("");
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left transition-all cursor-pointer ${
                  selectedAccountId === "all"
                    ? "bg-theme-primary/10 text-theme-primary font-semibold"
                    : "hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-500">
                    <Wallet size={15} />
                  </div>
                  <span className="text-sm font-medium">{allLabel}</span>
                </div>
                {selectedAccountId === "all" && (
                  <Check size={16} className="text-theme-primary shrink-0" />
                )}
              </button>
            )}

            {filteredAccounts.map((acc) => {
              const meta = getAccountTypeMeta(acc.type);
              const AccIcon = meta.icon;
              const isSelected = acc.id === selectedAccountId;
              const isExcluded = excludeAccountId && acc.id === excludeAccountId;
              const hasInsufficient =
                numRequired > 0 &&
                Number(acc.balance) < numRequired &&
                acc.type !== "credito";

              return (
                <button
                  key={acc.id}
                  type="button"
                  disabled={isExcluded}
                  onClick={() => {
                    onChange(acc.id);
                    setIsOpen(false);
                    setSearch("");
                  }}
                  className={`w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl text-left transition-all ${
                    isExcluded
                      ? "opacity-40 cursor-not-allowed bg-zinc-50 dark:bg-zinc-800/40"
                      : isSelected
                      ? "bg-theme-primary/10 text-theme-primary border border-theme-primary/30"
                      : "hover:bg-zinc-100 dark:hover:bg-zinc-800/80 cursor-pointer"
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    <div
                      className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border ${meta.bgClass}`}
                    >
                      <AccIcon size={16} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`text-sm truncate ${
                            isSelected ? "font-bold text-theme-primary" : "font-medium text-zinc-900 dark:text-zinc-100"
                          }`}
                        >
                          {acc.name}
                        </span>
                        {acc.type === "credito" && (
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-rose-100 dark:bg-rose-900/40 text-rose-600 dark:text-rose-300 font-medium">
                            Crédito
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-zinc-400 dark:text-zinc-500 truncate">
                        {isExcluded ? "Cuenta ya seleccionada" : meta.label}
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span
                      className={`font-mono text-xs sm:text-sm font-semibold tabular-nums block ${
                        Number(acc.balance) < 0
                          ? "text-rose-600 dark:text-rose-400"
                          : "text-zinc-800 dark:text-zinc-200"
                      }`}
                    >
                      ${formatCurrency(acc.balance || 0)}
                    </span>
                    {hasInsufficient && (
                      <span className="text-[10px] font-semibold text-rose-500 block">
                        Insuficiente
                      </span>
                    )}
                  </div>

                  {isSelected && (
                    <Check size={16} className="text-theme-primary shrink-0" />
                  )}
                </button>
              );
            })}

            {filteredAccounts.length === 0 && (
              <div className="py-6 text-center text-xs text-zinc-400">
                No se encontraron cuentas
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
