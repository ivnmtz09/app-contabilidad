import { useState } from "react";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../firebase";
import Logo from "./Logo";
import { Wallet, TrendingUp, ShieldCheck } from "lucide-react";

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
    <div className="min-h-screen bg-gradient-to-br from-zinc-100 to-zinc-200 dark:from-zinc-900 dark:to-zinc-950 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl rounded-3xl shadow-xl border border-zinc-200/50 dark:border-zinc-800/50 overflow-hidden grid grid-cols-1 md:grid-cols-2">

        {/* Left Column - Value Proposition */}
        <div className="p-8 md:p-12 flex flex-col justify-center">
          <h1 className="text-4xl md:text-5xl font-display font-bold text-zinc-900 dark:text-zinc-50 leading-tight">
            Toma el control de tus finanzas personales
          </h1>
          <div className="flex flex-col gap-6 mt-8">
            <div className="flex items-start gap-4">
              <Wallet className="w-6 h-6 text-violet-500 flex-shrink-0 mt-1" />
              <p className="text-base font-sans text-zinc-600 dark:text-zinc-400">
                Registra tus ingresos y egresos diarios al instante.
              </p>
            </div>
            <div className="flex items-start gap-4">
              <TrendingUp className="w-6 h-6 text-emerald-500 flex-shrink-0 mt-1" />
              <p className="text-base font-sans text-zinc-600 dark:text-zinc-400">
                Visualiza estadísticas claras de tu balance y rendimiento.
              </p>
            </div>
            <div className="flex items-start gap-4">
              <ShieldCheck className="w-6 h-6 text-blue-500 flex-shrink-0 mt-1" />
              <p className="text-base font-sans text-zinc-600 dark:text-zinc-400">
                Tus datos respaldados de forma segura en la nube.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column - Access */}
        <div className="bg-zinc-50/50 dark:bg-zinc-950/50 p-8 md:p-12 flex flex-col items-center justify-center text-center">
          <div className="p-3 bg-violet-100 dark:bg-violet-900/30 rounded-2xl">
            <Logo className="w-10 h-10" />
          </div>
          <h2 className="text-xl font-display font-bold text-zinc-900 dark:text-zinc-50 mt-4">
            MisCuentaZ
          </h2>
          <p className="text-sm font-sans text-zinc-500 dark:text-zinc-400 mt-2 max-w-xs">
            Inicia sesión para comenzar a gestionar tu dinero de forma inteligente.
          </p>

          <label className="flex items-start gap-3 text-sm font-sans text-zinc-600 dark:text-zinc-400 mt-6 text-left max-w-sm">
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
            className="w-full max-w-sm mt-6 flex items-center justify-center gap-3 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white px-6 py-4 rounded-2xl font-sans font-semibold shadow-sm hover:shadow-md transition-all border border-zinc-200 dark:border-zinc-700 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Iniciar sesión con Google
          </button>

          <p className="mt-12 text-xs font-mono text-zinc-400 dark:text-zinc-500">
            Creado por Iván Mtz | v 1.2.0
          </p>
        </div>

      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-zinc-800 rounded-3xl shadow-xl max-w-md w-full p-6 flex flex-col gap-4">
            <h2 className="text-lg font-display font-bold text-zinc-900 dark:text-zinc-50">
              Términos y Condiciones de Uso
            </h2>
            <p className="text-sm font-sans text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Al utilizar MisCuentaZ, aceptas que esta es una herramienta
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
