import { useState } from "react";
import { X } from "lucide-react";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { toast } from "react-hot-toast";

function ProfileModal({ isOpen, onClose, user }) {
  const [currency, setCurrency] = useState("COP");
  const [language, setLanguage] = useState("es");

  const handleSavePreferences = () => {
    toast.success("Preferencias actualizadas");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl w-full max-w-md mx-4 shadow-xl flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-display font-bold text-zinc-900 dark:text-zinc-50">
            Perfil y Preferencias
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex flex-col items-center gap-2">
          {user?.photoURL ? (
            <img
              src={user.photoURL}
              alt=""
              className="w-20 h-20 rounded-full object-cover"
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center">
              <span className="text-2xl font-display font-bold text-zinc-500 dark:text-zinc-400">
                {user?.displayName?.charAt(0)?.toUpperCase() || "?"}
              </span>
            </div>
          )}
          <p className="font-display font-semibold text-xl text-zinc-900 dark:text-zinc-50">
            {user?.displayName || "Usuario"}
          </p>
          <p className="font-sans text-sm text-zinc-500 dark:text-zinc-400">
            {user?.email || ""}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-sans font-medium text-zinc-500 dark:text-zinc-400">
              Moneda
            </label>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="w-full p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-sm text-zinc-900 dark:text-zinc-50 focus:ring-2 focus:ring-violet-500 outline-none transition-all"
            >
              <option value="COP">COP - Peso Colombiano</option>
              <option value="USD">USD - Dólar Estadounidense</option>
              <option value="EUR">EUR - Euro</option>
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-sans font-medium text-zinc-500 dark:text-zinc-400">
              Idioma
            </label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-sm text-zinc-900 dark:text-zinc-50 focus:ring-2 focus:ring-violet-500 outline-none transition-all"
            >
              <option value="es">Español</option>
              <option value="en">Inglés</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <button
            onClick={() => signOut(auth)}
            className="w-full font-sans font-semibold px-4 py-2.5 rounded-xl transition-colors cursor-pointer text-white bg-rose-500 hover:bg-rose-600"
          >
            Cerrar Sesión
          </button>
          <button
            onClick={handleSavePreferences}
            className="w-full font-sans font-semibold px-4 py-2.5 rounded-xl transition-colors cursor-pointer text-white bg-violet-600 hover:bg-violet-700"
          >
            Guardar Cambios
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProfileModal;
