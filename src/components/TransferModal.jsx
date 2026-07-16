import { useState, useEffect } from 'react';
import { ArrowRightLeft, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { formatCurrency } from '../utils/format';
import ConfirmModal from './ConfirmModal';

export default function TransferModal({ isOpen, onClose, onConfirm, accounts }) {
  const { t } = useTranslation();
  const [fromAccount, setFromAccount] = useState('');
  const [toAccount, setToAccount] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    if (isOpen && accounts.length >= 2) {
      setFromAccount(accounts[0].id);
      setToAccount(accounts[1].id);
    }
  }, [isOpen, accounts]);

  const handleClose = () => {
    setAmount(''); setDescription(''); setShowConfirm(false);
    onClose();
  };

  const handleSwap = () => {
    setFromAccount(toAccount);
    setToAccount(fromAccount);
  };

  if (!isOpen) return null;

  const from = accounts.find(a => a.id === fromAccount);
  const to = accounts.find(a => a.id === toAccount);
  const numAmount = Number(amount) || 0;
  const isValid = fromAccount && toAccount && fromAccount !== toAccount && numAmount > 0;

  return (
    <>
      <div className="fixed inset-0 z-[60] flex justify-center items-start sm:items-center pt-2 sm:pt-0 bg-black/40 backdrop-blur-sm px-2 sm:px-0" onClick={handleClose}>
        <div className="w-full max-w-md bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border border-zinc-200/50 dark:border-zinc-800/50 rounded-2xl sm:rounded-3xl shadow-2xl flex flex-col max-h-[90vh] mt-2 sm:mt-0 overflow-hidden" onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center justify-between p-5 pb-0">
            <div className="flex items-center gap-2">
              <div className="bg-violet-100 dark:bg-violet-900/30 p-2 rounded-xl text-violet-600 dark:text-violet-400">
                <ArrowRightLeft size={18}/>
              </div>
              <h2 className="text-lg font-display font-bold text-violet-600 dark:text-violet-400">{t('transfer.title') || 'Transferir'}</h2>
            </div>
            <button onClick={handleClose} className="p-1 rounded-lg text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
              <X size={18}/>
            </button>
          </div>

          <div className="overflow-y-auto custom-scrollbar p-5 flex-1 space-y-4">
            <div className="flex items-center gap-2">
              <div className="flex-1">
                <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wide mb-1 block">{t('transfer.from') || 'Desde'}</label>
                <select value={fromAccount} onChange={(e) => setFromAccount(e.target.value)} className="w-full px-3 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm text-zinc-900 dark:text-zinc-50 outline-none focus:ring-2 focus:ring-violet-500">
                  {accounts.map(acc => (
                    <option key={acc.id} value={acc.id}>{acc.name} (${Number(acc.balance).toLocaleString()})</option>
                  ))}
                </select>
              </div>
              <button onClick={handleSwap} className="mt-5 p-2.5 bg-zinc-100 dark:bg-zinc-800 rounded-xl hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors text-zinc-500">
                <ArrowRightLeft size={16}/>
              </button>
              <div className="flex-1">
                <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wide mb-1 block">{t('transfer.to') || 'Hacia'}</label>
                <select value={toAccount} onChange={(e) => setToAccount(e.target.value)} className="w-full px-3 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm text-zinc-900 dark:text-zinc-50 outline-none focus:ring-2 focus:ring-violet-500">
                  {accounts.map(acc => (
                    <option key={acc.id} value={acc.id}>{acc.name} (${Number(acc.balance).toLocaleString()})</option>
                  ))}
                </select>
              </div>
            </div>

            {fromAccount && toAccount && fromAccount === toAccount && (
              <p className="text-xs text-amber-500 font-semibold text-center">{t('transfer.sameAccount') || 'Selecciona cuentas diferentes'}</p>
            )}

            <input type="number" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder={t('modal.amount') || 'Monto a transferir'} className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 font-sans text-sm outline-none focus:ring-2 focus:ring-violet-500" />

            <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} placeholder={t('transfer.descPlaceholder') || 'Ej: Paso de Nequi a Daviplata'} className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 font-sans text-sm outline-none focus:ring-2 focus:ring-violet-500" />

            {from && to && numAmount > 0 && (
              <div className="bg-zinc-50 dark:bg-zinc-800/50 rounded-xl p-4 text-sm space-y-2">
                <div className="flex justify-between text-zinc-500">
                  <span>{from.name}</span><span className="font-semibold text-rose-500">-${formatCurrency(numAmount)}</span>
                </div>
                <div className="flex justify-between text-zinc-500">
                  <span>{to.name}</span><span className="font-semibold text-emerald-500">+${formatCurrency(numAmount)}</span>
                </div>
              </div>
            )}

            <button onClick={() => isValid && setShowConfirm(true)} disabled={!isValid} className="w-full font-sans font-semibold px-4 py-3 rounded-xl transition-colors text-white bg-violet-600 hover:bg-violet-700 disabled:opacity-40 disabled:cursor-not-allowed">
              {t('transfer.next') || 'Continuar'}
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
        title={t('transfer.confirmTitle') || 'Confirmar transferencia'}
        message={`${t('transfer.confirmMsg') || 'Transferir'} $${formatCurrency(numAmount)} ${t('transfer.from') || 'desde'} ${from?.name} ${t('transfer.to') || 'hacia'} ${to?.name}`}
        confirmText={t('transfer.confirm') || 'Transferir'}
        type="warning"
      />
    </>
  );
}
