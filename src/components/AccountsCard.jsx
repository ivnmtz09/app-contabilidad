import { useState } from "react";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import { doc, updateDoc, deleteDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import toast from "react-hot-toast";
import ConfirmModal from "./ConfirmModal";

function AccountsCard({ accounts = [], transactions = [], onOpenAdd }) {
  const [editModal, setEditModal] = useState({ isOpen: false, account: null, name: "" });
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, account: null, message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formatter = new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
  });

  const handleOpenEdit = (acc) => {
    setEditModal({ isOpen: true, account: acc, name: acc.name });
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!auth.currentUser) {
      toast.error("Usuario no autenticado");
      return;
    }
    const newName = editModal.name.trim();
    if (!newName) {
      toast.error("El nombre de la cuenta no puede estar vacío");
      return;
    }
    setIsSubmitting(true);
    try {
      await updateDoc(doc(db, "users", auth.currentUser.uid, "accounts", editModal.account.id), {
        name: newName,
      });
      toast.success("Nombre de cuenta actualizado");
      setEditModal({ isOpen: false, account: null, name: "" });
    } catch (err) {
      console.error("Error al actualizar cuenta:", err);
      toast.error("Error al actualizar la cuenta");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenDelete = (acc) => {
    const balance = Number(acc.balance) || 0;
    if (balance !== 0) {
      toast.error(`No se puede eliminar "${acc.name}" porque tiene saldo activo (${formatter.format(balance)}). Vacía o transfiere el saldo primero.`);
      return;
    }

    const hasMovements = transactions.some((tx) => tx.accountId === acc.id);
    const message = hasMovements
      ? `La cuenta "${acc.name}" no tiene saldo actual, pero tiene movimientos registrados en tu historial. ¿Deseas eliminarla de todas formas?`
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
      await deleteDoc(doc(db, "users", auth.currentUser.uid, "accounts", deleteModal.account.id));
      toast.success(`Cuenta "${deleteModal.account.name}" eliminada`);
      setDeleteModal({ isOpen: false, account: null, message: "" });
    } catch (err) {
      console.error("Error al eliminar cuenta:", err);
      toast.error("Error al eliminar la cuenta");
    }
  };

  return (
    <div className="bg-white dark:bg-zinc-800 p-6 rounded-3xl shadow-sm flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-display font-semibold text-zinc-900 dark:text-zinc-50">
          Mis Cuentas
        </h3>
        <button
          onClick={onOpenAdd}
          className="p-2 rounded-xl text-violet-600 dark:text-violet-400 hover:bg-violet-100 dark:hover:bg-violet-900/30 transition-colors cursor-pointer"
          title="Añadir cuenta"
        >
          <Plus size={20} />
        </button>
      </div>

      <ul className="space-y-2">
        {accounts.map((acc) => (
          <li
            key={acc.id}
            className="group flex justify-between items-center py-2.5 px-3 rounded-2xl hover:bg-zinc-50 dark:hover:bg-zinc-700/40 border-b border-zinc-100 dark:border-zinc-700/50 last:border-b-0 transition-colors"
          >
            <div className="flex flex-col">
              <span className="font-sans font-medium text-sm text-zinc-800 dark:text-zinc-200">
                {acc.name}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <span className="font-display font-semibold text-sm text-zinc-900 dark:text-zinc-50">
                {formatter.format(acc.balance || 0)}
              </span>

              <div className="flex items-center gap-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => handleOpenEdit(acc)}
                  className="p-1.5 rounded-lg text-zinc-400 hover:text-violet-600 hover:bg-violet-50 dark:hover:bg-violet-900/20 transition-colors cursor-pointer"
                  title="Editar nombre"
                >
                  <Pencil size={15} />
                </button>
                <button
                  onClick={() => handleOpenDelete(acc)}
                  className="p-1.5 rounded-lg text-zinc-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors cursor-pointer"
                  title="Eliminar cuenta"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>

      {/* Edit Account Modal */}
      {editModal.isOpen && (
        <div
          className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
          onClick={() => setEditModal({ isOpen: false, account: null, name: "" })}
        >
          <div
            className="w-full max-w-sm bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden p-6 flex flex-col gap-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h3 className="font-display font-bold text-lg text-zinc-900 dark:text-zinc-50">
                Editar Cuenta
              </h3>
              <button
                onClick={() => setEditModal({ isOpen: false, account: null, name: "" })}
                className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 p-1 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider mb-2">
                  Nombre de la cuenta
                </label>
                <input
                  type="text"
                  value={editModal.name}
                  onChange={(e) => setEditModal({ ...editModal, name: e.target.value })}
                  placeholder="Ej: Bancolombia Ahorros"
                  className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-3 text-sm text-zinc-900 dark:text-zinc-50 outline-none focus:ring-2 focus:ring-violet-500"
                  autoFocus
                  required
                />
              </div>

              <div className="flex gap-2 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setEditModal({ isOpen: false, account: null, name: "" })}
                  className="px-4 py-2.5 rounded-xl text-sm font-semibold text-zinc-600 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !editModal.name.trim()}
                  className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-violet-600 hover:bg-violet-700 transition-colors disabled:opacity-50 cursor-pointer"
                >
                  {isSubmitting ? "Guardando..." : "Guardar"}
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

export default AccountsCard;
