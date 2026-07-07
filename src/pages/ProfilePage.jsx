import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Globe } from "lucide-react";
import { useTranslation } from "react-i18next";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { toast } from "react-hot-toast";

function ProfilePage({ user }) {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [currency, setCurrency] = useState("COP");
  const [language, setLanguage] = useState(i18n.language);

  const handleSavePreferences = () => {
    toast.success(t("profile.preferences") + " " + t("profile.saveChanges").toLowerCase());
  };

  const handleLanguageChange = (e) => {
    const lang = e.target.value;
    setLanguage(lang);
    i18n.changeLanguage(lang);
    localStorage.setItem("lang", lang);
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900">
      <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-zinc-50/80 dark:bg-zinc-900/80 border-b border-zinc-200 dark:border-zinc-800">
        <div className="p-4 flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-lg text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <ArrowLeft size={22} />
          </button>
          <h1 className="text-lg font-display font-bold text-zinc-900 dark:text-zinc-50">
            {t("profile.title")}
          </h1>
        </div>
      </header>

      <main className="p-4 max-w-md mx-auto space-y-6">
        <div className="bg-white dark:bg-zinc-800 rounded-3xl p-6 shadow-sm flex flex-col items-center gap-3">
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

        <div className="bg-white dark:bg-zinc-800 rounded-3xl p-6 shadow-sm">
          <h2 className="text-sm font-display font-semibold text-zinc-500 dark:text-zinc-400 mb-4 uppercase tracking-wide">
            {t("profile.preferences")}
          </h2>
          <div className="space-y-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-sans font-medium text-zinc-500 dark:text-zinc-400">
                {t("profile.currency")}
              </label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 text-sm text-zinc-900 dark:text-zinc-50 focus:ring-2 focus:ring-violet-500 outline-none transition-all"
              >
                <option value="COP">COP - Peso Colombiano</option>
                <option value="USD">USD - Dólar Estadounidense</option>
                <option value="EUR">EUR - Euro</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-sans font-medium text-zinc-500 dark:text-zinc-400">
                <Globe size={14} className="inline mr-1" />
                {t("profile.language")}
              </label>
              <select
                value={language}
                onChange={handleLanguageChange}
                className="w-full p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 text-sm text-zinc-900 dark:text-zinc-50 focus:ring-2 focus:ring-violet-500 outline-none transition-all"
              >
                <option value="es">Español</option>
                <option value="en">English</option>
              </select>
            </div>
          </div>

          <button
            onClick={handleSavePreferences}
            className="w-full font-sans font-semibold px-4 py-2.5 rounded-xl transition-colors cursor-pointer text-white bg-violet-600 hover:bg-violet-700 mt-4"
          >
            {t("profile.saveChanges")}
          </button>
        </div>

        <button
          onClick={() => signOut(auth)}
          className="w-full flex items-center justify-center gap-2 font-sans font-semibold px-4 py-2.5 rounded-xl transition-colors cursor-pointer text-white bg-rose-500 hover:bg-rose-600"
        >
          {t("profile.logout")}
        </button>
      </main>
    </div>
  );
}

export default ProfilePage;
