import { useState } from "react";
import { Plus, Pencil, Trash2, X, SlidersHorizontal, Archive, ArchiveRestore } from "lucide-react";
import { doc, updateDoc, deleteDoc, addDoc, collection } from "firebase/firestore";
import { auth, db } from "../firebase";
import toast from "react-hot-toast";
import ConfirmModal from "./ConfirmModal";
import { formatCurrency } from "../utils/format";
import { ACCOUNT_TYPES, getAccountTypeMeta } from "../utils/accountTypes";

export default function AccountsCard({ accounts = [], transactions = [], onOpenAdd }) {
  const [editModal, setEditModal] = useState({
    isOpen: false,
    account: null,
    name: "",
    type: "banco",
    creditLimit: "",
  });
  const [adjustModal, setAdjustModal] = useState({
    isOpen: false,
    account: null,
    newBalance: "",
    reason: "",
  });
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    account: null,
    message: "",
  });
  const [showArchived, setShowArchived] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const activeAccounts = accounts.filter((a) => !a.isArchived);
  const archivedAccounts = accounts.filter((a) => a.isArchived);

  const handleOpenEdit = (acc) => {
    setEditModal({
      isOpen: true,
      account: acc,
      name: acc.name || "",
      type: acc.type || "banco",
      creditLimit: acc.creditLimit || "",
    });
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!auth.currentUser) return;
    const newName = editModal.name.trim();
    if (!newName) {
      toast.error("El nombre no puede estar vacío");
      return;
    }
    setIsSubmitting(true);
    try {
      const updatePayload = {
        name: newName,
        type: editModal.type,
      };
      if (editModal.type === "credito") {
        updatePayload.creditLimit = Number(editModal.creditLimit) || 0;
      }
      await updateDoc(
        doc(db, "users", auth.currentUser.uid, "accounts", editModal.account.id),
        updatePayload
      );
      toast.success("Cuenta actualizada correctamente");
      setEditModal({ isOpen: false, account: null, name: "", type: "banco", creditLimit: "" });
    } catch (err) {
      console.error("Error al actualizar cuenta:", err);
      toast.error("Error al actualizar");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenAdjust = (acc) => {
    setAdjustModal({
      isOpen: true,
      account: acc,
      newBalance: acc.balance.toString(),
      reason: "Ajuste manual de saldo",
    });
  };

  const handleSaveAdjust = async (e) => {
    e.preventDefault();
    if (!auth.currentUser || !adjustModal.account) return;
    const targetBalance = Number(adjustModal.newBalance);
    if (isNaN(targetBalance)) {
      toast.error("Ingresa un monto válido");
      return;
    }

    const currentBalance = Number(adjustModal.account.balance) || 0;
    const diff = targetBalance - currentBalance;

    if (diff === 0) {
      toast("El saldo no cambió");
      setAdjustModal({ isOpen: false, account: null, newBalance: "", reason: "" });
      return;
    }

    setIsSubmitting(true);
    try {
      const uid = auth.currentUser.uid;
      // Actualizar saldo de cuenta
      await updateDoc(doc(db, "users", uid, "accounts", adjustModal.account.id), {
        balance: targetBalance,
      });

      // Registrar movimiento de auditoría/ajuste
      await addDoc(collection(db, `users/${uid}/transactions`), {
        type: diff > 0 ? "ingreso" : "egreso",
        amount: Math.abs(diff),
        description: `Ajuste de saldo: ${adjustModal.reason || "Reconciliación manual"}`,
        category: "ajuste",
        accountId: adjustModal.account.id,
        date: new Date().toISOString(),
      });

      toast.success(`Saldo ajustado a $${formatCurrency(targetBalance)}`);
      setAdjustModal({ isOpen: false, account: null, newBalance: "", reason: "" });
    } catch (err) {
      console.error("Error al ajustar saldo:", err);
      toast.error("Error al ajustar saldo");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleArchive = async (acc) => {
    if (!auth.currentUser) return;
    try {
      const newStatus = !acc.isArchived;
      await updateDoc(doc(db, "users", auth.currentUser.uid, "accounts", acc.id), {
        isArchived: newStatus,
      });
      toast.success(newStatus ? `Cuenta "${acc.name}" archivada` : `Cuenta "${acc.name}" restaurada`);
    } catch (err) {
      console.error("Error al archivar:", err);
      toast.error("Error al cambiar estado");
    }
  };

  const handleOpenDelete = (acc) => {
    const balance = Number(acc.balance) || 0;
    if (balance !== 0) {
      toast.error(
        `No se puede eliminar "${acc.name}" porque tiene saldo activo ($${formatCurrency(
          balance
        )}). Vacía, transfiere o ajusta el saldo primero.`
      );
      return;
    }

    const hasMovements = transactions.some((tx) => tx.accountId === acc.id);
    const message = hasMovements
      ? `La cuenta "${acc.name}" tiene movimientos registrados en tu historial. ¿Deseas eliminarla? Se recomienda archivarla en su lugar para mantener los reportes históricos.`
      : `¿Estás seguro de que deseas eliminar la cuenta "${acc.name}"? Esta acción no se puede deshacer.`;

    setDeleteModal({
      isOpen: true,
      account: acc,
      message,
    });
  };

  const handleConfirmDelete = async () => {
    if (!auth.currentUser || !deleteModal.account) return;
    try {
      await deleteDoc(
        doc(db, "users", auth.currentUser.uid, "accounts", deleteModal.account.id)
      );
      toast.success(`Cuenta "${deleteModal.account.name}" eliminada`);
      setDeleteModal({ isOpen: false, account: null, message: "" });
    } catch (err) {
      console.error("Error al eliminar cuenta:", err);
      toast.error("Error al eliminar cuenta");
    }
  };

  const getSublabel = (acc, meta) => {
    const isNameSameAsType = acc.name.trim().toLowerCase() === meta.label.trim().toLowerCase();

    if (acc.type === "credito") {
      const limitStr = acc.creditLimit ? ` • Cupo: $${formatCurrency(acc.creditLimit)}` : "";
      return isNameSameAsType ? `Línea de crédito rotativa${limitStr}` : `${meta.label}${limitStr}`;
    }

    if (isNameSameAsType) {
      switch (acc.type) {
        case "efectivo":
          return "Dinero en efectivo disponible";
        case "banco":
          return "Cuenta bancaria de ahorros";
        case "billetera":
          return "Billetera digital móvil";
        case "inversion":
          return "Fondo o portafolio de inversión";
        default:
          return "Cuenta activa";
      }
    }

    return meta.label;
  };

  const renderAccountItem = (acc) => {
    const meta = getAccountTypeMeta(acc.type);
    const AccIcon = meta.icon;
    const balanceNum = Number(acc.balance) || 0;

    return (
      <li
        key={acc.id}
        className={`group flex justify-between items-center py-3 px-3.5 rounded-2xl border transition-all duration-200 ${
          acc.isArchived
            ? "bg-zinc-100/40 dark:bg-zinc-800/20 border-dashed border-zinc-200 dark:border-zinc-800/80 opacity-60"
            : "bg-white/60 dark:bg-zinc-800/40 hover:bg-white/90 dark:hover:bg-zinc-800/80 border-zinc-200/70 dark:border-white/10 hover:border-theme-primary/40 dark:hover:border-theme-primary/40 shadow-xs hover:shadow-md"
        }`}
      >
        <div className="flex items-center gap-3 min-w-0">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border shadow-xs ${meta.bgClass}`}
          >
            <AccIcon size={18} />
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm text-zinc-900 dark:text-zinc-50 truncate">
                {acc.name}
              </span>
              {acc.type === "credito" && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 font-semibold shrink-0">
                  Crédito
                </span>
              )}
            </div>
            <p className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400 truncate mt-0.5">
              {getSublabel(acc, meta)}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span
            className={`font-mono font-bold text-sm sm:text-base tabular-nums ${
              balanceNum < 0
                ? "text-rose-600 dark:text-rose-400"
                : "text-zinc-900 dark:text-zinc-50"
            }`}
          >
            ${formatCurrency(balanceNum)}
          </span>

          <div className="flex items-center gap-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
            {/* Ajustar saldo */}
            <button
              type="button"
              onClick={() => handleOpenAdjust(acc)}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-theme-primary hover:bg-theme-primary/10 transition-colors cursor-pointer"
              title="Ajustar / Reconciliar saldo"
            >
              <SlidersHorizontal size={14} />
            </button>

            {/* Editar */}
            <button
              type="button"
              onClick={() => handleOpenEdit(acc)}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-theme-primary hover:bg-theme-primary/10 transition-colors cursor-pointer"
              title="Editar cuenta"
            >
              <Pencil size={14} />
            </button>

            {/* Archivar / Desarchivar */}
            <button
              type="button"
              onClick={() => handleToggleArchive(acc)}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-colors cursor-pointer"
              title={acc.isArchived ? "Restaurar cuenta" : "Archivar cuenta"}
            >
              {acc.isArchived ? <ArchiveRestore size={14} /> : <Archive size={14} />}
            </button>

            {/* Eliminar */}
            <button
              type="button"
              onClick={() => handleOpenDelete(acc)}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors cursor-pointer"
              title="Eliminar cuenta"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>
      </li>
    );
  };

  return (
    <div className="bg-white/75 dark:bg-zinc-900/65 backdrop-blur-2xl p-5 sm:p-6 rounded-3xl shadow-sm border border-white/80 dark:border-white/10 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-display font-bold text-zinc-900 dark:text-zinc-50 tracking-tight">
            Mis Cuentas
          </h3>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              {activeAccounts.length} activa{activeAccounts.length === 1 ? "" : "s"}
            </span>
            {archivedAccounts.length > 0 && (
              <span className="text-[11px] font-medium text-zinc-400 dark:text-zinc-500">
                • {archivedAccounts.length} archivada(s)
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {archivedAccounts.length > 0 && (
            <button
              type="button"
              onClick={() => setShowArchived(!showArchived)}
              className="text-xs font-semibold px-3 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-700/80 text-zinc-600 dark:text-zinc-300 bg-white/50 dark:bg-zinc-800/50 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
            >
              {showArchived ? "Ocultar archivadas" : "Ver archivadas"}
            </button>
          )}

          <button
            type="button"
            onClick={onOpenAdd}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-theme-primary text-white hover:bg-theme-primary-hover transition-all shadow-xs glow-primary cursor-pointer active:scale-95"
            title="Añadir nueva cuenta"
          >
            <Plus size={16} strokeWidth={2.5} />
            <span className="hidden sm:inline">Nueva cuenta</span>
          </button>
        </div>
      </div>

      <ul className="space-y-2.5">
        {activeAccounts.map(renderAccountItem)}

        {showArchived && archivedAccounts.length > 0 && (
          <>
            <li className="pt-3 pb-1 text-xs font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-2">
              <span>Cuentas Archivadas</span>
              <span className="h-px bg-zinc-200 dark:bg-zinc-800 flex-1" />
            </li>
            {archivedAccounts.map(renderAccountItem)}
          </>
        )}

        {accounts.length === 0 && (
          <li className="py-8 text-center rounded-2xl border border-dashed border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/30 p-6 flex flex-col items-center justify-center gap-2">
            <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
              No tienes cuentas registradas
            </p>
            <p className="text-xs text-zinc-400 dark:text-zinc-500 max-w-xs">
              Crea tu primera cuenta en efectivo, bancaria o billetera digital para organizar tus finanzas.
            </p>
            <button
              type="button"
              onClick={onOpenAdd}
              className="mt-2 text-xs font-bold text-theme-primary hover:underline cursor-pointer flex items-center gap-1"
            >
              <Plus size={14} /> Crear cuenta ahora
            </button>
          </li>
        )}
      </ul>

      {/* Edit Account Modal */}
      {editModal.isOpen && (
        <div
          className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-150"
          onClick={() =>
            setEditModal({ isOpen: false, account: null, name: "", type: "banco", creditLimit: "" })
          }
        >
          <div
            className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden p-6 flex flex-col gap-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h3 className="font-display font-bold text-lg text-zinc-900 dark:text-zinc-50">
                Editar Cuenta
              </h3>
              <button
                type="button"
                onClick={() =>
                  setEditModal({
                    isOpen: false,
                    account: null,
                    name: "",
                    type: "banco",
                    creditLimit: "",
                  })
                }
                className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 p-1 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider mb-1.5">
                  Nombre de la cuenta
                </label>
                <input
                  type="text"
                  value={editModal.name}
                  onChange={(e) => setEditModal({ ...editModal, name: e.target.value })}
                  placeholder="Ej: Bancolombia Ahorros"
                  className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-3 text-sm font-semibold text-zinc-900 dark:text-zinc-50 outline-none focus:ring-2 focus:ring-theme-primary"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider mb-2">
                  Tipo de Cuenta
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {ACCOUNT_TYPES.map((type) => {
                    const TypeIcon = type.icon;
                    const isSelected = editModal.type === type.id;
                    return (
                      <button
                        key={type.id}
                        type="button"
                        onClick={() => setEditModal({ ...editModal, type: type.id })}
                        className={`flex items-center gap-2 p-2 rounded-xl border text-left transition-all cursor-pointer ${
                          isSelected
                            ? "border-theme-primary bg-theme-primary/10 ring-1 ring-theme-primary"
                            : "border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800/60"
                        }`}
                      >
                        <div
                          className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 border ${type.bgClass}`}
                        >
                          <TypeIcon size={13} />
                        </div>
                        <span className="text-xs font-medium text-zinc-900 dark:text-zinc-100 truncate">
                          {type.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {editModal.type === "credito" && (
                <div>
                  <label className="block text-xs font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider mb-1.5">
                    Cupo Límite de Crédito ($ COP)
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={editModal.creditLimit}
                    onChange={(e) => setEditModal({ ...editModal, creditLimit: e.target.value })}
                    placeholder="Ej: 2000000"
                    className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-3 text-sm font-mono text-zinc-900 dark:text-zinc-50 outline-none focus:ring-2 focus:ring-theme-primary"
                  />
                </div>
              )}

              <div className="flex gap-2 justify-end pt-2">
                <button
                  type="button"
                  onClick={() =>
                    setEditModal({
                      isOpen: false,
                      account: null,
                      name: "",
                      type: "banco",
                      creditLimit: "",
                    })
                  }
                  className="px-4 py-2.5 rounded-xl text-sm font-semibold text-zinc-600 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !editModal.name.trim()}
                  className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-theme-primary hover:bg-theme-primary-hover shadow-md transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? "Guardando..." : "Guardar Cambios"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Adjust Balance Modal */}
      {adjustModal.isOpen && (
        <div
          className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-150"
          onClick={() =>
            setAdjustModal({ isOpen: false, account: null, newBalance: "", reason: "" })
          }
        >
          <div
            className="w-full max-w-sm bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden p-6 flex flex-col gap-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h3 className="font-display font-bold text-lg text-zinc-900 dark:text-zinc-50">
                Ajustar Saldo Real
              </h3>
              <button
                type="button"
                onClick={() =>
                  setAdjustModal({ isOpen: false, account: null, newBalance: "", reason: "" })
                }
                className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 p-1 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <p className="text-xs text-zinc-500">
              Ajusta el saldo de <strong>{adjustModal.account?.name}</strong> al valor real. Se
              generará automáticamente un movimiento contable de conciliación.
            </p>

            <form onSubmit={handleSaveAdjust} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider mb-1.5">
                  Nuevo Saldo Real ($ COP)
                </label>
                <input
                  type="number"
                  step="any"
                  value={adjustModal.newBalance}
                  onChange={(e) => setAdjustModal({ ...adjustModal, newBalance: e.target.value })}
                  className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-3 text-sm font-mono font-bold tabular-nums text-zinc-900 dark:text-zinc-50 outline-none focus:ring-2 focus:ring-theme-primary"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider mb-1.5">
                  Motivo / Nota
                </label>
                <input
                  type="text"
                  value={adjustModal.reason}
                  onChange={(e) => setAdjustModal({ ...adjustModal, reason: e.target.value })}
                  placeholder="Ej: Conteo de efectivo en billetera"
                  className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-3 text-sm text-zinc-900 dark:text-zinc-50 outline-none focus:ring-2 focus:ring-theme-primary"
                />
              </div>

              <div className="flex gap-2 justify-end pt-2">
                <button
                  type="button"
                  onClick={() =>
                    setAdjustModal({ isOpen: false, account: null, newBalance: "", reason: "" })
                  }
                  className="px-4 py-2.5 rounded-xl text-sm font-semibold text-zinc-600 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-theme-primary hover:bg-theme-primary-hover shadow-md transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? "Ajustando..." : "Confirmar Ajuste"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, account: null, message: "" })}
        onConfirm={handleConfirmDelete}
        title="Eliminar Cuenta"
        message={deleteModal.message}
        confirmText="Eliminar"
        type="danger"
      />
    </div>
  );
}
