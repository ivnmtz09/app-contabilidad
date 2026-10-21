import { useState, useEffect } from "react";
import { X, Search, PlusCircle, CheckCircle2, Info } from "lucide-react";
import { ACCOUNT_TYPES } from "../utils/accountTypes";

const COLOMBIAN_BANKS = [
  { name: "Efectivo", defaultType: "efectivo" },
  { name: "Nequi", defaultType: "billetera" },
  { name: "DaviPlata", defaultType: "billetera" },
  { name: "Bancolombia", defaultType: "banco" },
  { name: "Davivienda", defaultType: "banco" },
  { name: "Nu Colombia", defaultType: "credito" },
  { name: "Tarjeta de Crédito", defaultType: "credito" },
  { name: "RappiPay", defaultType: "billetera" },
  { name: "Lulo Bank", defaultType: "banco" },
  { name: "Banco de Bogotá", defaultType: "banco" },
  { name: "Banco de Occidente", defaultType: "banco" },
  { name: "Banco Popular", defaultType: "banco" },
  { name: "Banco AV Villas", defaultType: "banco" },
  { name: "Scotiabank Colpatria", defaultType: "banco" },
  { name: "BBVA", defaultType: "banco" },
  { name: "Banco Caja Social", defaultType: "banco" },
  { name: "Banco Falabella", defaultType: "banco" },
  { name: "Itaú", defaultType: "banco" },
  { name: "dale!", defaultType: "billetera" },
  { name: "Mercado Pago", defaultType: "billetera" },
  { name: "Ualá", defaultType: "billetera" },
  { name: "Claro Pay", defaultType: "billetera" },
  { name: "Pibank (CDT / Ahorros)", defaultType: "inversion" },
  { name: "Global66", defaultType: "billetera" },
];

export default function AddAccountModal({ isOpen, onClose, onAddAccount, existingAccounts = [] }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedName, setSelectedName] = useState("");
  const [selectedType, setSelectedType] = useState("banco");
  const [initialBalance, setInitialBalance] = useState("");
  const [creditLimit, setCreditLimit] = useState("");
  const [step, setStep] = useState("select"); // "select" | "configure"

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  if (!isOpen) return null;

  const existingNamesSet = new Set(
    (existingAccounts || []).map((acc) => (acc.name || "").trim().toLowerCase())
  );

  const availableBanks = COLOMBIAN_BANKS.filter(
    (bank) => !existingNamesSet.has(bank.name.trim().toLowerCase())
  );

  const cleanSearch = searchTerm.trim();
  const isCustomMatch = cleanSearch.length >= 2;
  const alreadyExistsSearch = isCustomMatch && existingNamesSet.has(cleanSearch.toLowerCase());

  const filteredBanks = availableBanks.filter((bank) =>
    bank.name.toLowerCase().includes(cleanSearch.toLowerCase())
  );

  const handleStartConfigure = (name, defaultType = "banco") => {
    setSelectedName(name.trim());
    setSelectedType(defaultType);
    setInitialBalance("");
    setCreditLimit("");
    setStep("configure");
  };

  const handleConfirmAdd = (e) => {
    e.preventDefault();
    if (!selectedName.trim()) return;

    onAddAccount({
      name: selectedName.trim(),
      type: selectedType,
      initialBalance: Number(initialBalance) || 0,
      creditLimit: selectedType === "credito" ? Number(creditLimit) || 0 : undefined,
    });

    handleClose();
  };

  const handleClose = () => {
    setSearchTerm("");
    setSelectedName("");
    setSelectedType("banco");
    setInitialBalance("");
    setCreditLimit("");
    setStep("select");
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200"
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="add-account-modal-title"
    >
      <div
        className="bg-white/95 dark:bg-zinc-900/95 backdrop-blur-2xl border border-zinc-200/80 dark:border-zinc-800/80 p-5 sm:p-6 rounded-3xl w-full max-w-md flex flex-col gap-4 shadow-2xl transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 id="add-account-modal-title" className="text-lg font-display font-bold text-zinc-900 dark:text-zinc-50">
              {step === "select" ? "Añadir Cuenta" : "Configurar Cuenta"}
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              {step === "select"
                ? "Selecciona una entidad o escribe un nombre personalizado"
                : "Personaliza el tipo y saldo inicial"}
            </p>
          </div>
          <button
            type="button"
            onClick={handleClose}
            aria-label="Cerrar modal"
            className="w-10 h-10 flex items-center justify-center rounded-xl text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-theme-primary outline-none"
          >
            <X size={18} />
          </button>
        </div>

        {step === "select" ? (
          <>
            {/* Buscador de entidad */}
            <div className="relative">
              <Search
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400"
              />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar entidad o escribir nombre..."
                className="bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 focus:ring-2 focus:ring-theme-primary outline-none w-full p-3 pl-10 rounded-xl font-sans text-sm transition-all border border-zinc-200/60 dark:border-zinc-700/60"
              />
            </div>

            {/* Aviso si ya existe */}
            {alreadyExistsSearch && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-300 text-xs font-medium">
                <CheckCircle2 size={16} className="shrink-0 text-amber-600 dark:text-amber-400" />
                <span>
                  Ya tienes registrada la cuenta <strong>"{cleanSearch}"</strong>.
                </span>
              </div>
            )}

            {/* Crear personalizada si no existe */}
            {isCustomMatch &&
              !alreadyExistsSearch &&
              !availableBanks.some((b) => b.name.toLowerCase() === cleanSearch.toLowerCase()) && (
                <button
                  type="button"
                  onClick={() => handleStartConfigure(cleanSearch, "banco")}
                  className="flex items-center gap-2 p-3 rounded-xl bg-theme-primary/10 hover:bg-theme-primary/20 text-theme-primary font-semibold text-xs border border-theme-primary/30 transition-all cursor-pointer text-left"
                >
                  <PlusCircle size={16} className="shrink-0" />
                  <span>
                    Crear cuenta personalizada: <strong>"{cleanSearch}"</strong>
                  </span>
                </button>
              )}

            {/* Lista de entidades */}
            <div className="max-h-60 overflow-y-auto custom-scrollbar flex flex-col gap-1 pr-1">
              {filteredBanks.map((bank) => (
                <button
                  key={bank.name}
                  type="button"
                  onClick={() => handleStartConfigure(bank.name, bank.defaultType)}
                  className="flex items-center justify-between text-left px-3.5 py-2.5 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800/80 transition-colors font-medium text-sm text-zinc-800 dark:text-zinc-200 cursor-pointer group"
                >
                  <div className="flex items-center gap-2">
                    <span>{bank.name}</span>
                    {bank.defaultType === "credito" && (
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 font-medium">
                        Crédito
                      </span>
                    )}
                    {bank.defaultType === "billetera" && (
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400 font-medium">
                        Digital
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-theme-primary opacity-0 group-hover:opacity-100 transition-opacity font-semibold">
                    Configurar →
                  </span>
                </button>
              ))}
            </div>
          </>
        ) : (
          /* Step Configure */
          <form onSubmit={handleConfirmAdd} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-600 dark:text-zinc-400 mb-1">
                Nombre de la cuenta
              </label>
              <input
                type="text"
                required
                value={selectedName}
                onChange={(e) => setSelectedName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-sm font-semibold text-zinc-900 dark:text-zinc-50 outline-none focus:ring-2 focus:ring-theme-primary"
              />
            </div>

            {/* Selector de Tipo de Cuenta con Chips */}
            <div>
              <label className="block text-xs font-semibold text-zinc-600 dark:text-zinc-400 mb-2">
                Tipo de cuenta y comportamiento
              </label>
              <div className="grid grid-cols-2 gap-2">
                {ACCOUNT_TYPES.map((type) => {
                  const TypeIcon = type.icon;
                  const isSelected = selectedType === type.id;
                  return (
                    <button
                      key={type.id}
                      type="button"
                      onClick={() => setSelectedType(type.id)}
                      className={`flex items-center gap-2.5 p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                        isSelected
                          ? "border-theme-primary bg-theme-primary/10 ring-1 ring-theme-primary shadow-2xs"
                          : "border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800/60 hover:bg-zinc-50 dark:hover:bg-zinc-800"
                      }`}
                    >
                      <div
                        className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border ${type.bgClass}`}
                      >
                        <TypeIcon size={14} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <span className="text-xs font-semibold block text-zinc-900 dark:text-zinc-100 truncate">
                          {type.label}
                        </span>
                        <span className="text-[10px] text-zinc-400 truncate block">
                          {type.hint}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Saldo inicial y cupo de crédito */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-zinc-600 dark:text-zinc-400 mb-1">
                  Saldo Inicial ($ COP)
                </label>
                <input
                  type="number"
                  step="any"
                  value={initialBalance}
                  onChange={(e) => setInitialBalance(e.target.value)}
                  placeholder="0"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm font-mono tabular-nums text-zinc-900 dark:text-zinc-50 outline-none focus:ring-2 focus:ring-theme-primary"
                />
              </div>

              {selectedType === "credito" && (
                <div>
                  <label className="block text-xs font-semibold text-zinc-600 dark:text-zinc-400 mb-1">
                    Cupo Total Límite ($ COP)
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={creditLimit}
                    onChange={(e) => setCreditLimit(e.target.value)}
                    placeholder="Ej: 2000000"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm font-mono tabular-nums text-zinc-900 dark:text-zinc-50 outline-none focus:ring-2 focus:ring-theme-primary"
                  />
                </div>
              )}
            </div>

            {/* Nota de comportamiento según el tipo */}
            <div className="p-3 rounded-xl bg-zinc-100 dark:bg-zinc-800/70 border border-zinc-200 dark:border-zinc-700 text-xs text-zinc-600 dark:text-zinc-400 flex items-start gap-2">
              <Info size={16} className="shrink-0 text-theme-primary mt-0.5" />
              <span>
                {selectedType === "credito"
                  ? "Tarjeta de Crédito: Permite registrar egresos acumulando deuda (saldo negativo o cupo utilizado) sin ser bloqueada por falta de saldo positivo."
                  : "Cuenta Ordinaria: Requiere saldo suficiente antes de transferir o sacar dinero hacia otras cuentas."}
              </span>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setStep("select")}
                className="flex-1 min-h-[44px] py-2.5 rounded-xl text-sm font-semibold text-zinc-600 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
              >
                Volver
              </button>
              <button
                type="submit"
                disabled={!selectedName.trim() || (selectedType === "credito" && (creditLimit === "" || Number(creditLimit) < 0))}
                className="flex-1 min-h-[44px] py-2.5 rounded-xl text-sm font-semibold text-white bg-theme-primary hover:bg-theme-primary-hover shadow-md transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none cursor-pointer"
              >
                Guardar Cuenta
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
