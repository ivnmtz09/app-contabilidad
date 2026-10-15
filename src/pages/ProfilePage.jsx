import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Save, LogOut, Check, Palette } from "lucide-react";
import { useTranslation } from "react-i18next";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { toast } from "react-hot-toast";

const THEMES = [
  {
    id: "default",
    name: "Moradito & Verdecito",
    primary: "#8b5cf6",
    primaryHover: "#7c3aed",
    secondary: "#10b981",
    secondaryHover: "#059669",
    description: "Equilibrio moderno y frescura",
  },
  {
    id: "ocean",
    name: "Océano & Lima",
    primary: "#0284c7",
    primaryHover: "#0369a1",
    secondary: "#84cc16",
    secondaryHover: "#65a30d",
    description: "Serenidad marina y vitalidad",
  },
  {
    id: "sunset",
    name: "Atardecer Neón",
    primary: "#ec4899",
    primaryHover: "#db2777",
    secondary: "#f59e0b",
    secondaryHover: "#d97706",
    description: "Calidez vibrante e intensidad",
  },
  {
    id: "cyber",
    name: "Cyberpunk Índigo & Menta",
    primary: "#6366f1",
    primaryHover: "#4f46e5",
    secondary: "#14b8a6",
    secondaryHover: "#0d9488",
    description: "Futurismo elegante y claridad",
  },
  {
    id: "forest",
    name: "Bosque Imperial & Oro",
    primary: "#059669",
    primaryHover: "#047857",
    secondary: "#eab308",
    secondaryHover: "#ca8a04",
    description: "Naturaleza rica y distinción",
  },
];

function ProfilePage({ user }) {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const [language, setLanguage] = useState(i18n.language);
  const [theme, setTheme] = useState(
    document.documentElement.classList.contains("dark") ? "dark" : "light"
  );
  const [colorTheme, setColorTheme] = useState(() => {
    return (
      document.documentElement.getAttribute("data-theme") ||
      localStorage.getItem("app-theme") ||
      "default"
    );
  });

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

  const handleSelectColorTheme = (themeId) => {
    setColorTheme(themeId);
    document.documentElement.setAttribute("data-theme", themeId);
    localStorage.setItem("app-theme", themeId);
    const themeObj = THEMES.find((th) => th.id === themeId);
    toast.success(
      `${t("profile.themeApplied") || "Tema aplicado"}: ${
        themeObj?.name || themeId
      }`,
      {
        id: "theme-toast",
        icon: "🎨",
      }
    );
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900 transition-colors duration-300">
      <main className="p-4 sm:p-6 max-w-md mx-auto space-y-6 pb-24">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate(-1)}
            className="p-3 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-2xl shadow-sm hover:shadow-md transition-all text-zinc-700 dark:text-zinc-300 cursor-pointer"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-2xl font-display font-bold text-zinc-900 dark:text-zinc-50">
            {t("drawer.profile") || "Tu Perfil"}
          </h1>
        </div>

        {/* User Card */}
        <div className="bg-white dark:bg-zinc-800 rounded-3xl p-6 shadow-sm flex flex-col items-center gap-3">
          {user?.photoURL ? (
            <img
              src={user.photoURL}
              alt=""
              className="w-20 h-20 rounded-full object-cover shadow-sm ring-2 ring-zinc-200 dark:ring-zinc-700"
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-theme-primary text-white flex items-center justify-center shadow-sm">
              <span className="text-2xl font-display font-bold">
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

        {/* Sección de Tema de Color */}
        <div className="bg-white dark:bg-zinc-800 rounded-3xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-theme-primary-light text-theme-primary">
                <Palette size={18} />
              </div>
              <div>
                <h2 className="text-sm font-display font-semibold text-zinc-900 dark:text-zinc-100">
                  {t("profile.colorTheme") || "Tema de Color"}
                </h2>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  {THEMES.find((th) => th.id === colorTheme)?.name ||
                    "Personalizado"}
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {THEMES.map((item) => {
              const isSelected = colorTheme === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleSelectColorTheme(item.id)}
                  className={`group relative p-3.5 rounded-2xl border text-left transition-all duration-200 cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? "border-theme-primary bg-zinc-50/90 dark:bg-zinc-700/40 ring-2 shadow-sm"
                      : "border-zinc-200 dark:border-zinc-700/80 bg-white dark:bg-zinc-800/60 hover:border-zinc-300 dark:hover:border-zinc-600 hover:bg-zinc-50/50 dark:hover:bg-zinc-700/20"
                  }`}
                  style={
                    isSelected
                      ? {
                          borderColor: item.primary,
                          boxShadow: `0 0 0 1px ${item.primary}`,
                        }
                      : {}
                  }
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {/* Visual swatches */}
                    <div className="flex items-center -space-x-1.5 flex-shrink-0">
                      <span
                        className="w-6 h-6 rounded-full border-2 border-white dark:border-zinc-800 shadow-sm transition-transform group-hover:scale-110"
                        style={{ backgroundColor: item.primary }}
                        title={`Primario: ${item.primary}`}
                      />
                      <span
                        className="w-6 h-6 rounded-full border-2 border-white dark:border-zinc-800 shadow-sm transition-transform group-hover:scale-110"
                        style={{ backgroundColor: item.secondary }}
                        title={`Secundario: ${item.secondary}`}
                      />
                    </div>

                    {/* Theme name & description */}
                    <div className="min-w-0">
                      <p
                        className={`text-sm font-semibold truncate ${
                          isSelected
                            ? "text-zinc-900 dark:text-zinc-50"
                            : "text-zinc-700 dark:text-zinc-300"
                        }`}
                      >
                        {t(`profile.theme.${item.id}`) || item.name}
                      </p>
                      <p className="text-[11px] text-zinc-400 dark:text-zinc-500 truncate">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  {/* Selection indicator */}
                  <div className="flex-shrink-0 ml-2">
                    {isSelected ? (
                      <div
                        className="w-6 h-6 rounded-full flex items-center justify-center text-white shadow-sm"
                        style={{ backgroundColor: item.primary }}
                      >
                        <Check size={14} strokeWidth={3} />
                      </div>
                    ) : (
                      <div className="w-5 h-5 rounded-full border border-zinc-300 dark:border-zinc-600 group-hover:border-zinc-400" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Preferencias (Idioma y Modo Claro/Oscuro) */}
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
                className="w-full p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 text-sm text-zinc-900 dark:text-zinc-50 focus:ring-2 focus:ring-violet-500 outline-none transition-all cursor-pointer"
              >
                <option value="es">Español</option>
                <option value="en">English</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-sans font-medium text-zinc-500 dark:text-zinc-400">
                {t("profile.theme")} (Modo)
              </label>
              <select
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                className="w-full p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 text-sm text-zinc-900 dark:text-zinc-50 focus:ring-2 focus:ring-violet-500 outline-none transition-all cursor-pointer"
              >
                <option value="light">{t("profile.light")}</option>
                <option value="dark">{t("profile.dark")}</option>
              </select>
            </div>
          </div>

          <button
            onClick={handleSavePreferences}
            disabled={!hasChanges}
            className={`flex items-center justify-center gap-2 w-full p-3 rounded-xl font-semibold transition-all mt-4 ${
              hasChanges
                ? "bg-theme-primary hover:bg-theme-primary-hover text-white cursor-pointer shadow-md"
                : "bg-zinc-300 dark:bg-zinc-800 text-zinc-500 cursor-not-allowed"
            }`}
          >
            <Save size={18} /> {t("profile.save")}
          </button>
        </div>

        {/* Cerrar Sesión */}
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
