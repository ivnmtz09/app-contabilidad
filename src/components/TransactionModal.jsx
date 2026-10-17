import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { formatCurrency } from "../utils/format";
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES, getCategoryMeta } from "../utils/categories";

function TransactionModal({ isOpen, onClose, onSave, type, accounts, editTransaction }) {
  const { t } = useTranslation();
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [accountId, setAccountId] = useState(accounts[0]?.id || "");
  const [category, setCategory] = useState(type === "ingreso" ? "salario" : "comida");
  const [applyTax, setApplyTax] = useState(false);
  const [step, setStep] = useState(1);
  const [userSelectedCategory, setUserSelectedCategory] = useState(false);
  const [categorySearch, setCategorySearch] = useState("");

  const availableCategories = type === "ingreso" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  useEffect(() => {
    if (editTransaction) {
      setAmount(editTransaction.amount.toString());
      setDescription(editTransaction.description || "");
      setAccountId(editTransaction.accountId || accounts[0]?.id || "");
      setCategory(editTransaction.category || (editTransaction.type === "ingreso" ? "salario" : "comida"));
      setApplyTax(false);
      setStep(1);
      setUserSelectedCategory(true);
    } else {
      setCategory(type === "ingreso" ? "salario" : "comida");
      setUserSelectedCategory(false);
    }
    setCategorySearch("");
  }, [editTransaction, accounts, type]);

  useEffect(() => {
    if (isOpen && accounts.length > 0 && !accountId) {
      setAccountId(accounts[0].id);
    }
  }, [isOpen, accounts, accountId]);

  const handleClose = () => {
    setAmount("");
    setDescription("");
    setCategory(type === "ingreso" ? "salario" : "comida");
    setApplyTax(false);
    setStep(1);
    setUserSelectedCategory(false);
    setCategorySearch("");
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
    <div className="fixed inset-0 z-[60] flex justify-center items-start sm:items-center pt-2 sm:pt-0 bg-black/40 backdrop-blur-sm px-2 sm:px-0" onClick={handleClose}>
      <div className="w-full max-w-md bg-white/95 dark:bg-zinc-900/95 backdrop-blur-2xl border border-zinc-200/70 dark:border-zinc-800/70 rounded-2xl sm:rounded-3xl shadow-2xl flex flex-col max-h-[92vh] mt-2 sm:mt-0 overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-5 pb-3 border-b border-zinc-100 dark:border-zinc-800/60">
          <div className="flex items-center gap-2">
            {editTransaction && (
              <span className="text-xs font-mono font-semibold text-violet-600 dark:text-violet-400 bg-violet-100 dark:bg-violet-900/30 px-2 py-0.5 rounded-full">
                Editando
              </span>
            )}
            <h2
              className={`text-lg font-display font-bold ${isIngreso ? "text-emerald-500" : "text-rose-500"}`}
            >
              {isIngreso ? t("modal.income") : t("modal.expense")}
            </h2>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 rounded-xl text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        <div className="overflow-y-auto custom-scrollbar p-5 flex-1 space-y-4">
          {step === 1 && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!amount || Number(amount) <= 0 || !description || !accountId) return;
                setStep(2);
              }}
              className="flex flex-col gap-4"
            >
              <div>
                <label className="block text-xs font-semibold text-zinc-600 dark:text-zinc-400 mb-1.5">
                  {t("modal.amount")}
                </label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full px-4 py-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 font-sans text-base outline-none focus:ring-2 focus:ring-theme-primary transition-all shadow-2xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-600 dark:text-zinc-400 mb-1.5">
                  {t("modal.desc")}
                </label>
                <input
                  type="text"
                  required
                  value={description}
                  onChange={(e) => {
                    const val = e.target.value;
                    setDescription(val);
                    if (!userSelectedCategory && !editTransaction && val.trim().length >= 3) {
                      const suggested = getCategoryMeta({ description: val, type }, type);
                      const fallbackId = type === "ingreso" ? "otros_ingresos" : "otros";
                      if (suggested && suggested.id !== fallbackId) {
                        setCategory(suggested.id);
                      }
                    }
                  }}
                  placeholder="Ej: Mercado de la semana, Almuerzo, Uber..."
                  className="w-full px-4 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 font-sans text-sm outline-none focus:ring-2 focus:ring-theme-primary transition-all shadow-2xs"
                />
              </div>

              {/* Selector de Categorías con Iconos */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <label className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">
                      Categoría
                    </label>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-theme-primary/15 text-theme-primary border border-theme-primary/30">
                      <CategoryIcon size={12} />
                      <span>{selectedCategoryMeta.label}</span>
                    </span>
                  </div>
                  {availableCategories.length > 8 && (
                    <input
                      type="text"
                      placeholder="Buscar..."
                      value={categorySearch}
                      onChange={(e) => setCategorySearch(e.target.value)}
                      className="text-xs px-2.5 py-1 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/80 text-zinc-800 dark:text-zinc-200 outline-none focus:border-theme-primary w-24 sm:w-28 transition-colors"
                    />
                  )}
                </div>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-48 overflow-y-auto custom-scrollbar p-1">
                  {availableCategories
                    .filter((cat) => {
                      if (!categorySearch.trim()) return true;
                      const q = categorySearch.toLowerCase();
                      return cat.label.toLowerCase().includes(q) || cat.id.toLowerCase().includes(q);
                    })
                    .map((cat) => {
                      const CatIcon = cat.icon;
                      const isSelected = category === cat.id;
                      return (
                        <button
                          type="button"
                          key={cat.id}
                          onClick={() => {
                            setCategory(cat.id);
                            setUserSelectedCategory(true);
                          }}
                          className={`flex flex-col items-center justify-center gap-1.5 p-2 rounded-xl border text-xs font-medium transition-all cursor-pointer ${
                            isSelected
                              ? "bg-theme-primary text-white border-theme-primary shadow-sm scale-[1.02]"
                              : "bg-zinc-50 dark:bg-zinc-800/70 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                          }`}
                        >
                          <CatIcon size={18} className={isSelected ? "text-white" : "opacity-80"} />
                          <span className="truncate w-full text-center text-[11px]">{cat.label}</span>
                        </button>
                      );
                    })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-600 dark:text-zinc-400 mb-1.5">
                  {t("modal.account")}
                </label>
                <select
                  value={accountId}
                  onChange={(e) => setAccountId(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 font-sans text-sm outline-none focus:ring-2 focus:ring-theme-primary transition-all shadow-2xs"
                >
                  {accounts.map((acc) => (
                    <option key={acc.id} value={acc.id}>
                      {acc.name}
                    </option>
                  ))}
                </select>
              </div>

              {type === "egreso" && accountId !== "efectivo" && !editTransaction && (
                <label className="flex items-center gap-2 cursor-pointer p-3 bg-zinc-100 dark:bg-zinc-800/50 rounded-xl border border-zinc-200 dark:border-zinc-700">
                  <input
                    type="checkbox"
                    checked={applyTax}
                    onChange={(e) => setApplyTax(e.target.checked)}
                    className="w-4 h-4 text-theme-primary rounded focus:ring-theme-primary dark:bg-zinc-900 dark:border-zinc-600"
                  />
                  <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    {t("modal.tax")}
                  </span>
                </label>
              )}

              <button
                type="submit"
                className="w-full font-sans font-semibold px-4 py-3 rounded-xl transition-all cursor-pointer text-white bg-theme-primary hover:bg-theme-primary-hover shadow-md glow-primary"
              >
                {t("modal.next")}
              </button>
            </form>
          )}

          {step === 2 && (
            <div className="flex flex-col gap-4">
              <p className="text-sm font-sans text-zinc-500 dark:text-zinc-400">
                {editTransaction ? "¿Estás seguro de actualizar este movimiento?" : t("modal.confirmTitle")}
              </p>

              <div className="bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl p-4 flex flex-col gap-3 text-sm border border-zinc-200/60 dark:border-zinc-700/60">
                <div className="flex justify-between items-center">
                  <span className="text-zinc-500 dark:text-zinc-400">{t("modal.type")}</span>
                  <span className={`font-semibold ${isIngreso ? "text-emerald-500" : "text-rose-500"}`}>
                    {isIngreso ? t("menu.income") : t("menu.expense")}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-zinc-500 dark:text-zinc-400">Categoría</span>
                  <span className="inline-flex items-center gap-1.5 font-semibold text-zinc-800 dark:text-zinc-200">
                    <CategoryIcon size={16} className="text-theme-primary" />
                    <span>{selectedCategoryMeta.label}</span>
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-zinc-500 dark:text-zinc-400">{t("modal.finalAmount")}</span>
                  <span className={`font-bold text-base ${isIngreso ? "text-emerald-500" : "text-rose-500"}`}>
                    ${formatCurrency(finalAmount)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-zinc-500 dark:text-zinc-400">{t("modal.account")}</span>
                  <span className="font-semibold text-zinc-800 dark:text-zinc-200">
                    {selectedAccount?.name || accountId}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-zinc-500 dark:text-zinc-400">{t("modal.desc")}</span>
                  <span className="font-semibold text-zinc-800 dark:text-zinc-200 text-right max-w-[60%] truncate">
                    {description}
                  </span>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex-1 font-sans font-semibold px-4 py-2.5 rounded-xl transition-colors cursor-pointer bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-300 dark:hover:bg-zinc-600"
                >
                  {t("modal.back")}
                </button>
                <button
                  type="button"
                  onClick={handleConfirm}
                  className={`flex-1 font-sans font-semibold px-4 py-2.5 rounded-xl transition-colors cursor-pointer text-white shadow-md ${
                    isIngreso ? "bg-emerald-500 hover:bg-emerald-600" : "bg-rose-500 hover:bg-rose-600"
                  }`}
                >
                  {editTransaction ? "Actualizar" : t("modal.confirm")}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default TransactionModal;
