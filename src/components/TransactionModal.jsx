import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { formatCurrency } from "../utils/format";

function TransactionModal({ isOpen, onClose, onSave, type, accounts }) {
  const { t } = useTranslation();
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [accountId, setAccountId] = useState(accounts[0]?.id || "");
  const [applyTax, setApplyTax] = useState(false);
  const [step, setStep] = useState(1);

  useEffect(() => {
    if (isOpen && accounts.length > 0 && !accountId) {
      setAccountId(accounts[0].id);
    }
  }, [isOpen, accounts]);

  const handleClose = () => {
    setAmount('');
    setDescription('');
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

  const handleConfirm = () => {
    if (!amount || !accountId) return;
    console.log("Datos enviados desde el Modal:", { amount, description, accountId, type });
    onSave({
      amount: Number(amount),
      description: (description || "").trim() || "Sin descripción",
      accountId: accountId,
      type: type,
      date: new Date().toISOString()
    });
    setAccountId(accounts[0]?.id || "");
    handleClose();
  };

  return (
    <div className="fixed inset-0 z-[60] flex justify-center items-start sm:items-center pt-2 sm:pt-0 bg-black/40 backdrop-blur-sm px-2 sm:px-0" onClick={handleClose}>
      <div className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-2xl sm:rounded-3xl shadow-xl flex flex-col max-h-[90vh] mt-2 sm:mt-0 overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-5 pb-0">
          <h2
            className={`text-lg font-display font-bold ${isIngreso ? "text-emerald-500" : "text-rose-500"}`}
          >
            {isIngreso ? t("modal.income") : t("modal.expense")}
          </h2>
          <button
            onClick={handleClose}
            className="p-1 rounded-lg text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
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
              <input
                type="number"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder={t("modal.amount")}
                className="w-full px-4 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 font-sans text-sm outline-none focus:ring-2 focus:ring-violet-500 transition-all"
              />

              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={t("modal.desc")}
                className="w-full px-4 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 font-sans text-sm outline-none focus:ring-2 focus:ring-violet-500 transition-all"
              />

              <select
                value={accountId}
                onChange={(e) => setAccountId(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 font-sans text-sm outline-none focus:ring-2 focus:ring-violet-500 transition-all"
              >
                {accounts.map((acc) => (
                  <option key={acc.id} value={acc.id}>
                    {acc.name}
                  </option>
                ))}
              </select>

              {type === "egreso" && accountId !== "efectivo" && (
                <label className="flex items-center gap-2 cursor-pointer mt-2 p-3 bg-zinc-100 dark:bg-zinc-800/50 rounded-xl border border-zinc-200 dark:border-zinc-700">
                  <input
                    type="checkbox"
                    checked={applyTax}
                    onChange={(e) => setApplyTax(e.target.checked)}
                    className="w-4 h-4 text-violet-600 rounded focus:ring-violet-600 dark:bg-zinc-900 dark:border-zinc-600"
                  />
                  <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    {t("modal.tax")}
                  </span>
                </label>
              )}

              <button
                type="submit"
                className="w-full font-sans font-semibold px-4 py-2.5 rounded-xl transition-colors cursor-pointer text-white bg-violet-600 hover:bg-violet-700"
              >
                {t("modal.next")}
              </button>
            </form>
          )}

          {step === 2 && (
            <div className="flex flex-col gap-4">
              <p className="text-sm font-sans text-zinc-500 dark:text-zinc-400">
                {t("modal.confirmTitle")}
              </p>

              <div className="bg-zinc-50 dark:bg-zinc-800/50 rounded-xl p-4 flex flex-col gap-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-zinc-500 dark:text-zinc-400">{t("modal.type")}</span>
                  <span className={`font-semibold ${isIngreso ? "text-emerald-500" : "text-rose-500"}`}>
                    {isIngreso ? t("menu.income") : t("menu.expense")}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500 dark:text-zinc-400">{t("modal.finalAmount")}</span>
                  <span className={`font-semibold ${isIngreso ? "text-emerald-500" : "text-rose-500"}`}>
                    ${formatCurrency(finalAmount)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500 dark:text-zinc-400">{t("modal.account")}</span>
                  <span className="font-semibold text-zinc-800 dark:text-zinc-200">
                    {selectedAccount?.name || accountId}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500 dark:text-zinc-400">{t("modal.desc")}</span>
                  <span className="font-semibold text-zinc-800 dark:text-zinc-200 text-right max-w-[60%]">
                    {description}
                  </span>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 font-sans font-semibold px-4 py-2.5 rounded-xl transition-colors cursor-pointer bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-300 dark:hover:bg-zinc-600"
                >
                  {t("modal.back")}
                </button>
                <button
                  onClick={handleConfirm}
                  className={`flex-1 font-sans font-semibold px-4 py-2.5 rounded-xl transition-colors cursor-pointer text-white ${isIngreso ? "bg-emerald-500 hover:bg-emerald-600" : "bg-rose-500 hover:bg-rose-600"}`}
                >
                  {t("modal.confirm")}
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
