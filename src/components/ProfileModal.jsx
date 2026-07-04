import { X } from "lucide-react";

function ProfileModal({ isOpen, onClose, user }) {
  if (!isOpen) return null;

  const initial = user?.displayName?.charAt(0)?.toUpperCase() || "?";

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-white dark:bg-zinc-900 p-8 rounded-3xl w-full max-w-sm mx-4 shadow-xl flex flex-col items-center relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-lg text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
        >
          <X size={18} />
        </button>

        {user?.photoURL ? (
          <img
            src={user.photoURL}
            alt=""
            className="w-20 h-20 rounded-full object-cover"
          />
        ) : (
          <div className="w-20 h-20 rounded-full bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center">
            <span className="text-2xl font-display font-bold text-zinc-500 dark:text-zinc-400">
              {initial}
            </span>
          </div>
        )}

        <p className="font-display font-semibold text-xl text-zinc-900 dark:text-zinc-50 mt-4">
          {user?.displayName || "Usuario"}
        </p>
        <p className="font-sans text-sm text-zinc-500 dark:text-zinc-400 mt-1">
          {user?.email || ""}
        </p>
      </div>
    </div>
  );
}

export default ProfileModal;
