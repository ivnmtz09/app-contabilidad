import { Wallet } from "lucide-react";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../firebase";

function Login({ onLogin }) {
  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, provider);
      onLogin();
    } catch {
      // keep on login screen
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 p-4">
      <div className="p-8 bg-white dark:bg-zinc-800 rounded-3xl shadow-md max-w-md w-full flex flex-col items-center gap-6">
        <div className="p-3 bg-violet-100 dark:bg-violet-900/30 rounded-2xl">
          <Wallet size={32} className="text-violet-600 dark:text-violet-400" />
        </div>

        <h1 className="text-xl font-display font-bold">App Contabilidad</h1>

        <label className="flex items-start gap-3 text-sm font-sans text-zinc-600 dark:text-zinc-400">
          <input
            type="checkbox"
            className="mt-0.5 accent-violet-600 cursor-pointer"
          />
          <span>Aceptar términos y condiciones de uso</span>
        </label>

        <button
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-700 text-white font-sans font-semibold px-6 py-3 rounded-xl transition-colors cursor-pointer"
        >
          Iniciar sesión con Google
        </button>
      </div>
    </div>
  );
}

export default Login;
