import { useState } from "react";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../firebase";
import Logo from "./Logo";

function Login() {
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, provider);
    } catch {
      // keep on login screen
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 p-4">
      <div className="p-8 bg-white dark:bg-zinc-800 rounded-3xl shadow-md max-w-md w-full flex flex-col items-center gap-6">
        <div className="p-3 bg-violet-100 dark:bg-violet-900/30 rounded-2xl">
          <Logo className="w-10 h-10" />
        </div>

        <h1 className="text-xl font-display font-bold">FinanGrid</h1>

        <label className="flex items-start gap-3 text-sm font-sans text-zinc-600 dark:text-zinc-400">
          <input
            type="checkbox"
            checked={acceptedTerms}
            onChange={(e) => setAcceptedTerms(e.target.checked)}
            className="mt-0.5 accent-violet-600 cursor-pointer"
          />
          <span>
            Aceptar términos y condiciones de uso{" "}
            <button
              type="button"
              onClick={() => setShowModal(true)}
              className="text-violet-600 dark:text-violet-400 underline hover:no-underline cursor-pointer"
            >
              Ver Términos
            </button>
          </span>
        </label>

        <button
          onClick={handleGoogleLogin}
          disabled={!acceptedTerms}
          className={`w-full flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-sans font-semibold px-6 py-3 rounded-xl transition-colors cursor-pointer`}
        >
          Iniciar sesión con Google
        </button>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-zinc-800 rounded-3xl shadow-xl max-w-md w-full p-6 flex flex-col gap-4">
            <h2 className="text-lg font-display font-bold text-zinc-900 dark:text-zinc-50">
              Términos y Condiciones de Uso
            </h2>
            <p className="text-sm font-sans text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Al utilizar FinanGrid, aceptas que esta es una herramienta
              personal de gestión financiera. Los datos se almacenan de forma
              segura en Firebase y no se comparten con terceros. Eres
              responsable de la veracidad de la información registrada. Esta
              aplicación se proporciona "tal cual", sin garantías de ningún
              tipo. Te recomendamos no compartir tu sesión con otras personas.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded-xl text-sm font-sans font-medium text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors cursor-pointer"
              >
                Cerrar
              </button>
              <button
                onClick={() => {
                  setAcceptedTerms(true);
                  setShowModal(false);
                }}
                className="px-4 py-2 rounded-xl text-sm font-sans font-medium bg-violet-600 hover:bg-violet-700 text-white transition-colors cursor-pointer"
              >
                Aceptar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Login;
