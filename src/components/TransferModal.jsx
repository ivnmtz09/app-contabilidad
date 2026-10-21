import { useState, useEffect } from "react";
import { ArrowRightLeft, X } from "lucide-react";

import { useTranslation } from "react-i18next";
import { formatCurrency } from "../utils/format";
import ConfirmModal from "./ConfirmModal";
import AccountSelector from "./ui/AccountSelector";
import AlertBanner from "./ui/AlertBanner";

export default function TransferModal({ isOpen, onClose, onConfirm, accounts = [] }) {
  const { t } = useTranslation();
  const [fromAccount, setFromAccount] = useState("");
  const [toAccount, setToAccount] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [isSwapping, setIsSwapping] = useState(false);

  // Filter active accounts
  const activeAccounts = accounts.filter((a) => !a.isArchived);

  useEffect(() => {
    if (isOpen && activeAccounts.length >= 2) {
      if (!fromAccount || !activeAccounts.some((a) => a.id === fromAccount)) {
        setFromAccount(activeAccounts[0].id);
      }
      if (!toAccount || !activeAccounts.some((a) => a.id === toAccount) || toAccount === fromAccount) {
        const other = activeAccounts.find((a) => a.id !== activeAccounts[0].id);
        if (other) setToAccount(other.id);
      }
    } else if (isOpen && activeAccounts.length === 1) {
      setFromAccount(activeAccounts[0].id);
    }
  }, [isOpen, activeAccounts]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const handleClose = () => {
    setAmount("");
    setDescription("");
    setShowConfirm(false);
    onClose();
  };

  const handleSwap = () => {
    setIsSwapping(true);
    const temp = fromAccount;
    setFromAccount(toAccount);
    setToAccount(temp);
    setTimeout(() => setIsSwapping(false), 300);
  };

  if (!isOpen) return null;

  const from = accounts.find((a) => a.id === fromAccount);
  const to = accounts.find((a) => a.id === toAccount);
  const numAmount = Number(amount) || 0;
  const fromBalance = Number(from?.balance) || 0;
  const toBalance = Number(to?.balance) || 0;

  // Credit card accounts allow overdraft/negative, but standard accounts do not
  const isCreditAccount = from?.type === "credito";
  const hasInsufficientFunds = !isCreditAccount && numAmount > fromBalance;
  const deficit = Math.max(0, numAmount - fromBalance);

  const isSameAccount = fromAccount && toAccount && fromAccount === toAccount;
  const isValid =
    fromAccount &&
    toAccount &&
    !isSameAccount &&
    numAmount > 0 &&
    !hasInsufficientFunds;

  const handleQuickPercent = (pct) => {
    if (!from || fromBalance <= 0) return;
    const calculated = Math.round((fromBalance * pct) / 100);
    setAmount(calculated.toString());
  };

  return (
    <>
      <div
        className="fixed inset-0 z-[60] flex justify-center items-start sm:items-center pt-2 sm:pt-0 bg-black/50 backdrop-blur-sm px-2 sm:px-0 animate-in fade-in duration-200"
        onClick={handleClose}
        role="dialog"
        aria-modal="true"
        aria-labelledby="transfer-modal-title"
      >
        <div
          className="w-full max-w-lg bg-white/95 dark:bg-zinc-900/95 backdrop-blur-2xl border border-zinc-200/80 dark:border-zinc-800/80 rounded-3xl shadow-2xl flex flex-col max-h-[92vh] mt-2 sm:mt-0 overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-5 pb-3 border-b border-zinc-100 dark:border-zinc-800/60">
            <div className="flex items-center gap-2.5">
              <div className="bg-theme-primary/10 p-2.5 rounded-2xl text-theme-primary">
                <ArrowRightLeft size={20} />
              </div>
              <div>
                <h2 id="transfer-modal-title" className="text-base sm:text-lg font-display font-bold text-zinc-900 dark:text-zinc-50">
                  {t("transfer.title") || "Transferencia entre Cuentas"}
                </h2>
                <p className="text-xs text-zinc-400">
                  Mueve fondos de manera segura e instantánea
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleClose}
              aria-label="Cerrar modal"
              className="w-10 h-10 flex items-center justify-center rounded-xl text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors focus-visible:ring-2 focus-visible:ring-theme-primary outline-none cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>

          <div className="overflow-y-auto custom-scrollbar p-5 space-y-4">
            {/* Account Selectors with Swap */}
            <div className="space-y-3 bg-zinc-50/70 dark:bg-zinc-850/50 p-4 rounded-2xl border border-zinc-200/60 dark:border-zinc-800/60">
              {/* Origen */}
              <div>
                <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider block mb-1">
                  Cuenta de Origen (Sale dinero)
                </span>
                <AccountSelector
                  accounts={activeAccounts}
                  selectedAccountId={fromAccount}
                  onChange={setFromAccount}
                  excludeAccountId={toAccount}
                  requiredAmount={numAmount}
                  placeholder="Selecciona cuenta de origen"
                />
              </div>

              {/* Botón de Intercambio */}
              <div className="flex justify-center -my-1">
                <button
                  type="button"
                  onClick={handleSwap}
                  aria-label="Intercambiar cuentas origen y destino"
                  className={`w-10 h-10 flex items-center justify-center rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-500 hover:text-theme-primary hover:border-theme-primary shadow-xs transition-all cursor-pointer ${
                    isSwapping ? "rotate-180 duration-300" : ""
                  }`}
                  title="Intercambiar cuentas origen y destino"
                >
                  <ArrowRightLeft size={16} />
                </button>
              </div>

              {/* Destino */}
              <div>
                <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider block mb-1">
                  Cuenta de Destino (Ingresa dinero)
                </span>
                <AccountSelector
                  accounts={activeAccounts}
                  selectedAccountId={toAccount}
                  onChange={setToAccount}
                  excludeAccountId={fromAccount}
                  placeholder="Selecciona cuenta de destino"
                />
              </div>
            </div>

            {/* Error si son la misma cuenta */}
            {isSameAccount && (
              <AlertBanner
                type="warning"
                title="Cuentas idénticas"
                message="Debes seleccionar dos cuentas diferentes para completar una transferencia."
              />
            )}

            {/* Input de Monto */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wide">
                  Monto a Transferir ($ COP)
                </label>
                {from && (
                  <span className="text-xs text-zinc-500 font-mono">
                    Disponible:{" "}
                    <strong
                      className={
                        fromBalance <= 0
                          ? "text-rose-500"
                          : "text-zinc-800 dark:text-zinc-200 font-bold"
                      }
                    >
                      ${formatCurrency(fromBalance)}
                    </strong>
                  </span>
                )}
              </div>

              <div className="relative">
                <input
                  type="number"
                  step="any"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0"
                  className={`w-full px-4 py-3.5 rounded-2xl border bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 font-mono text-base font-bold tabular-nums outline-none transition-all shadow-xs ${
                    hasInsufficientFunds
                      ? "border-rose-500 ring-2 ring-rose-500/20"
                      : "border-zinc-200 dark:border-zinc-700 focus:ring-2 focus:ring-theme-primary"
                  }`}
                />
              </div>

              {/* Atajos de porcentaje rápido */}
              {from && fromBalance > 0 && (
                <div className="flex items-center gap-1.5 mt-2">
                  <span className="text-[11px] text-zinc-400 font-medium">Rápido:</span>
                  {[25, 50, 75, 100].map((pct) => (
                    <button
                      key={pct}
                      type="button"
                      onClick={() => handleQuickPercent(pct)}
                      className="px-2.5 py-1 text-xs font-mono font-medium rounded-lg bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-600 dark:text-zinc-300 transition-colors cursor-pointer"
                    >
                      {pct === 100 ? "Todo" : `${pct}%`}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Alerta de Saldo Insuficiente */}
            {hasInsufficientFunds && (
              <AlertBanner
                type="danger"
                title="Saldo Insuficiente en Cuenta Origen"
                message={`No puedes transferir $${formatCurrency(
                  numAmount
                )} porque "${from?.name}" solo tiene $${formatCurrency(
                  fromBalance
                )}. Faltante: $${formatCurrency(deficit)} COP.`}
              />
            )}

            {/* Descripción */}
            <div>
              <label className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wide block mb-1.5">
                Nota o Descripción (Opcional)
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Ej: Pago de tarjeta, Ahorro mensual, etc."
                className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 text-sm outline-none focus:ring-2 focus:ring-theme-primary transition-all"
              />
            </div>

            {/* Previsualización Financiera (Gravitas) */}
            {from && to && numAmount > 0 && !isSameAccount && (
              <div className="bg-zinc-900 text-zinc-100 dark:bg-black/60 rounded-2xl p-4 space-y-3 border border-zinc-800 shadow-md">
                <div className="flex items-center justify-between text-xs text-zinc-400 pb-2 border-b border-zinc-800">
                  <span className="font-semibold uppercase tracking-wider">
                    Desglose de Operación
                  </span>
                  <span className="text-emerald-400 font-mono font-semibold">
                    Comisión: $0 COP
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-zinc-400">{from.name} (Origen):</span>
                    <span className="font-mono tabular-nums">
                      <span className="text-zinc-400">${formatCurrency(fromBalance)}</span>
                      {" → "}
                      <strong
                        className={
                          fromBalance - numAmount < 0 ? "text-rose-400" : "text-zinc-200"
                        }
                      >
                        ${formatCurrency(fromBalance - numAmount)}
                      </strong>
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-zinc-400">{to.name} (Destino):</span>
                    <span className="font-mono tabular-nums">
                      <span className="text-zinc-400">${formatCurrency(toBalance)}</span>
                      {" → "}
                      <strong className="text-emerald-400">
                        ${formatCurrency(toBalance + numAmount)}
                      </strong>
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Botón de Continuar */}
            <button
              type="button"
              onClick={() => isValid && setShowConfirm(true)}
              disabled={!isValid}
              className="w-full min-h-[48px] font-sans font-semibold px-4 py-3.5 rounded-2xl transition-colors cursor-pointer text-white bg-theme-primary hover:bg-theme-primary-hover disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none shadow-md glow-primary"
            >
              {hasInsufficientFunds
                ? "Fondos Insuficientes"
                : isSameAccount
                ? "Selecciona cuentas distintas"
                : !numAmount || numAmount <= 0
                ? "Ingresa un monto a transferir"
                : "Continuar a Confirmación"}
            </button>
          </div>
        </div>
      </div>

      <ConfirmModal
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={() => {
          onConfirm({
            fromAccountId: fromAccount,
            toAccountId: toAccount,
            amount: numAmount,
            description: description.trim() || `${from?.name} → ${to?.name}`,
          });
          handleClose();
        }}
        title="Confirmar Transferencia"
        message={`¿Deseas transferir $${formatCurrency(numAmount)} COP desde "${
          from?.name
        }" hacia "${to?.name}"?`}
        confirmText="Transferir ahora"
        type="warning"
      />
    </>
  );
}
