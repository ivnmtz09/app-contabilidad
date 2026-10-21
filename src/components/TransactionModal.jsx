import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { formatCurrency } from "../utils/format";
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES, getCategoryMeta } from "../utils/categories";
import AccountSelector from "./ui/AccountSelector";
import AlertBanner from "./ui/AlertBanner";

export default function TransactionModal({ isOpen, onClose, onSave, type, accounts = [], editTransaction }) {
  const { t } = useTranslation();
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [accountId, setAccountId] = useState(accounts[0]?.id || "");
  const [category, setCategory] = useState(type === "ingreso" ? "salario" : "comida");
  const [applyTax, setApplyTax] = useState(false);
  const [step, setStep] = useState(1);


  const availableCategories = type === "ingreso" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  useEffect(() => {
    if (editTransaction) {
      setAmount(editTransaction.amount.toString());
      setDescription(editTransaction.description || "");
      setAccountId(editTransaction.accountId || accounts[0]?.id || "");
      setCategory(editTransaction.category || (editTransaction.type === "ingreso" ? "salario" : "comida"));
      setApplyTax(false);
      setStep(1);
    } else {
      setCategory(type === "ingreso" ? "salario" : "comida");
    }
  }, [editTransaction, accounts, type]);

  useEffect(() => {
    if (isOpen && accounts.length > 0 && !accountId) {
      setAccountId(accounts[0].id);
    }
  }, [isOpen, accounts, accountId]);

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
    setCategory(type === "ingreso" ? "salario" : "comida");
    setApplyTax(false);
    setStep(1);
    onClose();
  };


  if (!isOpen) return null;

  const isIngreso = type === "ingreso";

  const finalAmount = (() => {
    let base = Number(amount) || 0;
    if (type === "egreso" && accountId !== "efectivo" && applyTax) {
      base = base + base * 0.004;
    }
    return base;
  })();

  const selectedAccount = accounts.find((a) => a.id === accountId);
  const selectedCategoryMeta = getCategoryMeta(category, type);
  const CategoryIcon = selectedCategoryMeta.icon;

  const isCreditAccount = selectedAccount?.type === "credito";
  const accountBalance = Number(selectedAccount?.balance) || 0;
  const isOverdraft = !isIngreso && finalAmount > accountBalance;

  const handleConfirm = () => {
    if (!amount || !accountId) return;
    onSave({
      id: editTransaction?.id,
      amount: finalAmount,
      description: (description || "").trim() || "Sin descripción",
      accountId: accountId,
      category: category,
      type: type,
      date: editTransaction?.date || new Date().toISOString(),
      oldTransaction: editTransaction,
    });
    handleClose();
  };

  return (
    <div
      className="fixed inset-0 z-[60] flex justify-center items-start sm:items-center pt-2 sm:pt-0 bg-black/50 backdrop-blur-sm px-2 sm:px-0 animate-in fade-in duration-200"
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="transaction-modal-title"
    >
      <div
        className="w-full max-w-md bg-white/95 dark:bg-zinc-900/95 backdrop-blur-2xl border border-zinc-200/80 dark:border-zinc-800/80 rounded-3xl shadow-2xl flex flex-col max-h-[92vh] mt-2 sm:mt-0 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 pb-3 border-b border-zinc-100 dark:border-zinc-800/60">
          <div className="flex items-center gap-2">
            {editTransaction && (
              <span className="text-xs font-mono font-semibold text-theme-primary bg-theme-primary/10 px-2 py-0.5 rounded-full">
                Editando
              </span>
            )}
            <h2
              id="transaction-modal-title"
              className={`text-lg font-display font-bold ${
                isIngreso ? "text-emerald-500" : "text-rose-500"
              }`}
            >
              {isIngreso ? t("modal.income") : t("modal.expense")}
            </h2>
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

        <div className="overflow-y-auto custom-scrollbar p-5 flex-1 space-y-4">
          {step === 1 && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setStep(2);
              }}
              className="space-y-4"
            >
              {/* Monto */}
              <div>
                <label className="block text-xs font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wide mb-1.5">
                  {t("modal.amount")} ($ COP)
                </label>
                <input
                  type="number"
                  step="any"
                  required
                  autoFocus
                  placeholder="0"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 font-mono text-xl font-bold tabular-nums outline-none focus:ring-2 focus:ring-theme-primary transition-all shadow-xs"
                />
              </div>

              {/* Selector de Cuenta Personalizado (No nativo) */}
              <div>
                <AccountSelector
                  accounts={accounts}
                  selectedAccountId={accountId}
                  onChange={setAccountId}
                  requiredAmount={!isIngreso ? finalAmount : 0}
                  label={t("modal.account") || "Cuenta"}
                  placeholder="Selecciona la cuenta"
                />
              </div>

              {/* Alerta de Línea de Crédito o Sobregiro */}
              {isOverdraft && selectedAccount && (
                isCreditAccount ? (
                  <AlertBanner
                    type="info"
                    title="Uso de Tarjeta de Crédito"
                    message={`Este gasto se cargará a ${selectedAccount.name}. El saldo adeudado pasará a $${formatCurrency(
                      accountBalance - finalAmount
                    )} COP.`}
                  />
                ) : (
                  <AlertBanner
                    type="warning"
                    title="Advertencia de Saldo Negativo"
                    message={`El gasto ($${formatCurrency(
                      finalAmount
                    )}) supera el saldo de ${selectedAccount.name} ($${formatCurrency(
                      accountBalance
                    )}). La cuenta quedará en sobregiro con saldo negativo.`}
                  />
                )
              )}

              {/* Descripción */}
              <div>
                <label className="block text-xs font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wide mb-1.5">
                  {t("modal.desc")}
                </label>
                <input
                  type="text"
                  placeholder={isIngreso ? "Ej: Salario quincenal" : "Ej: Almuerzo de trabajo"}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 text-sm outline-none focus:ring-2 focus:ring-theme-primary transition-all shadow-2xs"
                />
              </div>

              {/* Categorías */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wide">
                    Categoría
                  </label>
                  <span className="text-[11px] text-zinc-400 font-medium">
                    {selectedCategoryMeta.label}
                  </span>
                </div>

                <div className="grid grid-cols-4 gap-2 max-h-48 overflow-y-auto custom-scrollbar p-1">
                  {availableCategories.map((cat) => {
                    const CatIcon = cat.icon;
                    const isSelected = category === cat.id;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setCategory(cat.id)}

                        className={`flex flex-col items-center justify-center gap-1.5 p-2 rounded-xl border text-xs font-medium transition-all cursor-pointer ${
                          isSelected
                            ? "bg-theme-primary text-white border-theme-primary shadow-sm scale-[1.02]"
                            : "bg-zinc-50 dark:bg-zinc-800/70 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                        }`}
                      >
                        <CatIcon size={18} className={isSelected ? "text-white" : "opacity-80"} />
                        <span className="truncate w-full text-center text-[10px]">{cat.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Gravamen 4x1000 */}
              {type === "egreso" && accountId !== "efectivo" && !editTransaction && (
                <label className="flex items-center gap-2.5 cursor-pointer p-3 bg-zinc-100 dark:bg-zinc-800/50 rounded-xl border border-zinc-200 dark:border-zinc-700">
                  <input
                    type="checkbox"
                    checked={applyTax}
                    onChange={(e) => setApplyTax(e.target.checked)}
                    className="w-4 h-4 text-theme-primary rounded focus:ring-theme-primary dark:bg-zinc-900 dark:border-zinc-600"
                  />
                  <span className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
                    {t("modal.tax") || "Aplicar 4x1000 (0.4% impuesto)"}
                  </span>
                </label>
              )}

              <button
                type="submit"
                disabled={!amount || Number(amount) <= 0 || !accountId}
                className="w-full min-h-[48px] font-sans font-semibold px-4 py-3.5 rounded-2xl transition-colors cursor-pointer text-white bg-theme-primary hover:bg-theme-primary-hover shadow-md glow-primary disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none"
              >
                {t("modal.next") || "Continuar"}
              </button>
            </form>
          )}

          {step === 2 && (
            <div className="flex flex-col gap-4">
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                {editTransaction ? "¿Deseas guardar los cambios?" : "¿Confirmar este movimiento?"}
              </p>

              <div className="bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl p-4 flex flex-col gap-3 text-sm border border-zinc-200/60 dark:border-zinc-700/60">
                <div className="flex justify-between items-center">
                  <span className="text-zinc-400 text-xs uppercase">Tipo</span>
                  <span className={`font-semibold ${isIngreso ? "text-emerald-500" : "text-rose-500"}`}>
                    {isIngreso ? "Ingreso" : "Gasto"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-zinc-400 text-xs uppercase">Categoría</span>
                  <span className="inline-flex items-center gap-1.5 font-semibold text-zinc-800 dark:text-zinc-200">
                    <CategoryIcon size={16} className="text-theme-primary" />
                    <span>{selectedCategoryMeta.label}</span>
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-zinc-400 text-xs uppercase">Monto Total</span>
                  <span className={`font-mono font-bold text-base tabular-nums ${isIngreso ? "text-emerald-500" : "text-rose-500"}`}>
                    ${formatCurrency(finalAmount)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-zinc-400 text-xs uppercase">Cuenta</span>
                  <span className="font-semibold text-zinc-800 dark:text-zinc-200">
                    {selectedAccount?.name || accountId}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-zinc-400 text-xs uppercase">Descripción</span>
                  <span className="font-medium text-zinc-700 dark:text-zinc-300 text-right max-w-[60%] truncate">
                    {description || "Sin descripción"}
                  </span>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex-1 min-h-[44px] py-3 rounded-xl font-semibold bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-300 dark:hover:bg-zinc-600 transition-colors"
                >
                  Volver
                </button>
                <button
                  type="button"
                  onClick={handleConfirm}
                  disabled={!amount || Number(amount) <= 0 || !accountId}
                  className={`flex-1 min-h-[44px] py-3 rounded-xl font-semibold text-white shadow-md transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none ${
                    isIngreso ? "bg-emerald-600 hover:bg-emerald-700" : "bg-rose-600 hover:bg-rose-700"
                  }`}
                >
                  {editTransaction ? "Actualizar" : "Confirmar"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
