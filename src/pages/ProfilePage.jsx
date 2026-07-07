import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Save, LogOut } from "lucide-react";
import { useTranslation } from "react-i18next";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { toast } from "react-hot-toast";

function ProfilePage({ user }) {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const [language, setLanguage] = useState(i18n.language);
  const [theme, setTheme] = useState(
    document.documentElement.classList.contains("dark") ? "dark" : "light"
  );

  const hasChanges =
    language !== i18n.language ||
    theme !==
      (document.documentElement.classList.contains("dark") ? "dark" : "light");

  const handleSavePreferences = () => {
    if (language !== i18n.language) {
      i18n.changeLanguage(language);
      localStorage.setItem("lang", language);
    }

    const currentIsDark = document.documentElement.classList.contains("dark");
    if (theme === "dark" && !currentIsDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else if (theme === "light" && currentIsDark) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }

    toast.success(t("profile.success"));
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
                {t("profile.language")}
              </label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 text-sm text-zinc-900 dark:text-zinc-50 focus:ring-2 focus:ring-violet-500 outline-none transition-all"
              >
                <option value="es">Español</option>
                <option value="en">English</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-sans font-medium text-zinc-500 dark:text-zinc-400">
                {t("profile.theme")}
              </label>
              <select
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                className="w-full p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 text-sm text-zinc-900 dark:text-zinc-50 focus:ring-2 focus:ring-violet-500 outline-none transition-all"
              >
                <option value="light">{t("profile.light")}</option>
                <option value="dark">{t("profile.dark")}</option>
              </select>
            </div>
          </div>

          <button
            onClick={handleSavePreferences}
            disabled={!hasChanges}
            className={`flex items-center justify-center gap-2 w-full p-3 rounded-xl font-semibold transition-colors mt-4 ${
              hasChanges
                ? "bg-violet-600 hover:bg-violet-700 text-white cursor-pointer"
                : "bg-zinc-300 dark:bg-zinc-800 text-zinc-500 cursor-not-allowed"
            }`}
          >
            <Save size={18} /> {t("profile.save")}
          </button>
        </div>

        <button
          onClick={() => signOut(auth)}
          className="w-full flex items-center justify-center gap-2 font-sans font-semibold px-4 py-2.5 rounded-xl transition-colors cursor-pointer text-white bg-rose-500 hover:bg-rose-600"
        >
          <LogOut size={18} /> {t("profile.logout")}
        </button>
      </main>
    </div>
  );
}

export default ProfilePage;
