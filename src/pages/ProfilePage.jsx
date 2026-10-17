import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Save,
  LogOut,
  Check,
  Palette,
  Sun,
  Moon,
  Sparkles,
  RotateCcw,
  ShieldCheck,
  Mail,
  User as UserIcon,
  Sliders,
  CheckCircle2,
} from "lucide-react";
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
    description: "Equilibrio moderno y frescura digital",
    tag: "Original",
  },
  {
    id: "ocean",
    name: "Océano & Lima",
    primary: "#0284c7",
    primaryHover: "#0369a1",
    secondary: "#84cc16",
    secondaryHover: "#65a30d",
    description: "Serenidad marina con vitalidad cítrica",
    tag: "Fresco",
  },
  {
    id: "sunset",
    name: "Atardecer Neón",
    primary: "#ec4899",
    primaryHover: "#db2777",
    secondary: "#f59e0b",
    secondaryHover: "#d97706",
    description: "Calidez vibrante, energía y pasión",
    tag: "Cálido",
  },
  {
    id: "cyber",
    name: "Cyberpunk Índigo & Menta",
    primary: "#6366f1",
    primaryHover: "#4f46e5",
    secondary: "#14b8a6",
    secondaryHover: "#0d9488",
    description: "Futurismo elegante y claridad técnica",
    tag: "Tecno",
  },
  {
    id: "forest",
    name: "Bosque Imperial & Oro",
    primary: "#059669",
    primaryHover: "#047857",
    secondary: "#eab308",
    secondaryHover: "#ca8a04",
    description: "Naturaleza rica, distinción y calma",
    tag: "Orgánico",
  },
  {
    id: "obsidian",
    name: "Obsidiana & Platino",
    primary: "#2563eb",
    primaryHover: "#1d4ed8",
    secondary: "#64748b",
    secondaryHover: "#475569",
    description: "Sobriedad ejecutiva y azul zafiro",
    tag: "Ejecutivo",
  },
  {
    id: "crimson",
    name: "Rubí & Carbón",
    primary: "#e11d48",
    primaryHover: "#be123c",
    secondary: "#475569",
    secondaryHover: "#334155",
    description: "Intensidad rubí con base pizarra",
    tag: "Audaz",
  },
  {
    id: "aurora",
    name: "Aurora Boreal",
    primary: "#9333ea",
    primaryHover: "#7e22ce",
    secondary: "#06b6d4",
    secondaryHover: "#0891b2",
    description: "Gradientes boreales púrpura y cyan",
    tag: "Místico",
  },
  {
    id: "terracotta",
    name: "Terracota & Rosa",
    primary: "#ea580c",
    primaryHover: "#c2410c",
    secondary: "#f43f5e",
    secondaryHover: "#e11d48",
    description: "Tierra cálida mediterránea y coral",
    tag: "Artesanal",
  },
  {
    id: "matrix",
    name: "Matrix Hacker",
    primary: "#10b981",
    primaryHover: "#059669",
    secondary: "#06b6d4",
    secondaryHover: "#0891b2",
    description: "Verde esmeralda terminal y cian",
    tag: "Código",
  },
];

function ProfilePage({ user }) {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const [language, setLanguage] = useState(i18n.language);
  const [themeMode, setThemeMode] = useState(
    document.documentElement.classList.contains("dark") ? "dark" : "light"
  );

  // Tema persistido actual
  const [activeTheme, setActiveTheme] = useState(() => {
    return (
      document.documentElement.getAttribute("data-theme") ||
      localStorage.getItem("app-theme") ||
      "default"
    );
  });

  // Tema en vista previa (no aplicado globalmente hasta que se guarde)
  const [stagedTheme, setStagedTheme] = useState(activeTheme);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const activeThemeObj = THEMES.find((th) => th.id === activeTheme) || THEMES[0];
  const stagedThemeObj = THEMES.find((th) => th.id === stagedTheme) || THEMES[0];
  const isThemeChanged = stagedTheme !== activeTheme;

  const hasPrefChanges =
    language !== i18n.language ||
    themeMode !== (document.documentElement.classList.contains("dark") ? "dark" : "light");

  const handleSavePreferences = () => {
    if (language !== i18n.language) {
      i18n.changeLanguage(language);
      localStorage.setItem("lang", language);
    }

    const currentIsDark = document.documentElement.classList.contains("dark");
    if (themeMode === "dark" && !currentIsDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else if (themeMode === "light" && currentIsDark) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }

    toast.success(t("profile.success") || "Preferencias guardadas");
  };

  const handleSelectStagedTheme = (themeId) => {
    setStagedTheme(themeId);
  };

  const handleApplyTheme = () => {
    document.documentElement.setAttribute("data-theme", stagedTheme);
    localStorage.setItem("app-theme", stagedTheme);
    setActiveTheme(stagedTheme);
    toast.success(`Tema aplicado: ${stagedThemeObj.name}`, { id: "theme-applied" });
  };

  const handleRevertTheme = () => {
    setStagedTheme(activeTheme);
    toast("Vista previa restablecida al tema actual");
  };

  return (
    <div className="min-h-screen bg-transparent transition-colors duration-300">
      <main className="max-w-3xl mx-auto space-y-6 pb-28 pt-2">
        {/* Header con botón de volver */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <button
              onClick={() => navigate(-1)}
              className="p-2.5 bg-white/70 dark:bg-zinc-800/70 backdrop-blur-xl border border-white/80 dark:border-white/10 rounded-2xl shadow-xs hover:shadow-md hover:border-theme-primary/40 transition-all text-zinc-700 dark:text-zinc-300 cursor-pointer"
              title="Volver"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-2xl font-display font-bold text-zinc-900 dark:text-zinc-50 tracking-tight">
                {t("drawer.profile") || "Mi Perfil & Ajustes"}
              </h1>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Personalización, identidad y preferencias de tu cuenta
              </p>
            </div>
          </div>
        </div>

        {/* Tarjeta de Usuario Glassmorphism */}
        <div className="glass-card rounded-[2rem] p-6 sm:p-7 flex flex-col sm:flex-row items-center sm:items-start gap-5 relative overflow-hidden">
          <div
            className="absolute -right-10 -bottom-10 w-44 h-44 rounded-full blur-3xl pointer-events-none opacity-20"
            style={{ backgroundColor: activeThemeObj.primary }}
          />

          <div className="relative shrink-0">
            <div
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl p-1 shadow-md flex items-center justify-center overflow-hidden"
              style={{
                background: `linear-gradient(135deg, ${activeThemeObj.primary}, ${activeThemeObj.secondary})`,
              }}
            >
              {user?.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={user?.displayName || "Perfil"}
                  className="w-full h-full rounded-[1.25rem] object-cover bg-white dark:bg-zinc-900"
                />
              ) : (
                <div className="w-full h-full rounded-[1.25rem] bg-zinc-900 flex items-center justify-center text-white">
                  <UserIcon size={36} />
                </div>
              )}
            </div>
            <div className="absolute -bottom-1 -right-1 p-1 bg-white dark:bg-zinc-900 rounded-full shadow-xs">
              <span className="w-3.5 h-3.5 rounded-full bg-emerald-500 block ring-2 ring-white dark:ring-zinc-900" />
            </div>
          </div>

          <div className="flex-1 text-center sm:text-left min-w-0">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1">
              <h2 className="font-display font-bold text-xl sm:text-2xl text-zinc-900 dark:text-zinc-50 tracking-tight truncate">
                {user?.displayName || "Usuario MisCuentaZ"}
              </h2>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                <ShieldCheck size={13} />
                Activo
              </span>
            </div>

            <p className="font-sans text-sm text-zinc-500 dark:text-zinc-400 flex items-center justify-center sm:justify-start gap-1.5 truncate">
              <Mail size={14} className="shrink-0" />
              {user?.email || "Sin correo asociado"}
            </p>

            <div className="mt-4 flex flex-wrap items-center justify-center sm:justify-start gap-2 text-xs">
              <div className="px-3 py-1 rounded-xl bg-zinc-100/70 dark:bg-zinc-800/60 border border-zinc-200/60 dark:border-zinc-700/60 text-zinc-600 dark:text-zinc-300 font-medium">
                Tema activo: <strong className="text-zinc-900 dark:text-zinc-100">{activeThemeObj.name}</strong>
              </div>
              <div className="px-3 py-1 rounded-xl bg-zinc-100/70 dark:bg-zinc-800/60 border border-zinc-200/60 dark:border-zinc-700/60 text-zinc-600 dark:text-zinc-300 font-medium">
                ID: <span className="font-mono text-[11px]">{user?.uid?.substring(0, 8)}...</span>
              </div>
            </div>
          </div>
        </div>

        {/* Sección: Personalización de Colores y Temas */}
        <div className="glass-card rounded-[2rem] p-6 sm:p-7 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-theme-primary-light text-theme-primary border border-theme-primary-subtle">
                <Palette size={20} />
              </div>
              <div>
                <h2 className="text-base font-display font-bold text-zinc-900 dark:text-zinc-50">
                  {t("profile.colorTheme") || "Temas de Color del Sistema"}
                </h2>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  10 paletas cuidadosamente diseñadas con armonía de contraste light & dark
                </p>
              </div>
            </div>

            {/* Estado de tema */}
            {isThemeChanged && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 self-start sm:self-auto animate-pulse">
                <Sparkles size={13} />
                Cambios sin guardar
              </span>
            )}
          </div>

          {/* ── TARJETA INTERACTIVA DE VISTA PREVIA EN VIVO ────────────────────────────── */}
          <div
            className="rounded-3xl p-5 border transition-all duration-300 relative overflow-hidden"
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.4)",
              borderColor: stagedThemeObj.primary + "40",
              boxShadow: `0 8px 30px -4px ${stagedThemeObj.primary}20`,
            }}
          >
            <div
              className="absolute -right-16 -top-16 w-48 h-48 rounded-full blur-3xl pointer-events-none opacity-30"
              style={{ backgroundColor: stagedThemeObj.primary }}
            />
            <div
              className="absolute -left-10 -bottom-10 w-44 h-44 rounded-full blur-3xl pointer-events-none opacity-25"
              style={{ backgroundColor: stagedThemeObj.secondary }}
            />

            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                    Vista Previa en Tiempo Real
                  </span>
                  <span
                    className="text-[10px] font-bold px-2 py-0.5 rounded-full text-white"
                    style={{ backgroundColor: stagedThemeObj.primary }}
                  >
                    {stagedThemeObj.tag}
                  </span>
                </div>
                <h3 className="text-lg font-display font-bold text-zinc-900 dark:text-zinc-100">
                  {stagedThemeObj.name}
                </h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                  {stagedThemeObj.description}
                </p>
              </div>

              {/* Muestra interactiva de botones y chips con los colores staged */}
              <div className="flex flex-wrap items-center gap-2.5">
                {/* Chip con secundario */}
                <span
                  className="px-3 py-1.5 rounded-xl text-xs font-bold border transition-all"
                  style={{
                    backgroundColor: stagedThemeObj.secondary + "15",
                    borderColor: stagedThemeObj.secondary + "40",
                    color: stagedThemeObj.secondary,
                  }}
                >
                  +{stagedThemeObj.name.split("&")[1] || "Secundario"}
                </span>

                {/* Botón simulado */}
                <button
                  type="button"
                  className="px-4 py-2 rounded-xl text-xs font-bold text-white shadow-sm transition-transform active:scale-95 cursor-default"
                  style={{
                    backgroundColor: stagedThemeObj.primary,
                    boxShadow: `0 4px 14px ${stagedThemeObj.primary}40`,
                  }}
                >
                  Botón Demo
                </button>
              </div>
            </div>

            {/* Barra de acción de Guardar / Revertir */}
            <div className="mt-4 pt-4 border-t border-zinc-200/50 dark:border-zinc-700/50 flex flex-col sm:flex-row items-center justify-between gap-3 relative z-10">
              <p className="text-xs text-zinc-500 dark:text-zinc-400 text-center sm:text-left">
                {isThemeChanged
                  ? "Toca 'Guardar y Aplicar Tema' para fijar esta paleta a toda la aplicación."
                  : "Este es el tema actualmente aplicado en tu cuenta."}
              </p>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                {isThemeChanged && (
                  <button
                    type="button"
                    onClick={handleRevertTheme}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-zinc-600 dark:text-zinc-300 bg-white/70 dark:bg-zinc-800/70 border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                  >
                    <RotateCcw size={14} />
                    Revertir
                  </button>
                )}

                <button
                  type="button"
                  onClick={handleApplyTheme}
                  disabled={!isThemeChanged}
                  className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm ${
                    isThemeChanged
                      ? "text-white cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
                      : "bg-zinc-200/80 dark:bg-zinc-800/80 text-zinc-400 dark:text-zinc-500 cursor-not-allowed"
                  }`}
                  style={
                    isThemeChanged
                      ? {
                          backgroundColor: stagedThemeObj.primary,
                          boxShadow: `0 4px 16px ${stagedThemeObj.primary}50`,
                        }
                      : {}
                  }
                >
                  {isThemeChanged ? (
                    <>
                      <Save size={15} />
                      Guardar y Aplicar Tema
                    </>
                  ) : (
                    <>
                      <CheckCircle2 size={15} />
                      Tema Actual Activo
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Grilla de los 10 temas */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {THEMES.map((item, index) => {
              const isStaged = stagedTheme === item.id;
              const isPersisted = activeTheme === item.id;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleSelectStagedTheme(item.id)}
                  className={`group relative p-4 rounded-2xl border text-left transition-all duration-200 cursor-pointer flex flex-col justify-between gap-3 ${
                    isStaged
                      ? "bg-white dark:bg-zinc-800/90 shadow-md ring-2"
                      : "bg-white/50 dark:bg-zinc-850/40 hover:bg-white/80 dark:hover:bg-zinc-800/60 border-zinc-200/80 dark:border-white/10 hover:border-zinc-300 dark:hover:border-zinc-700"
                  }`}
                  style={
                    isStaged
                      ? {
                          borderColor: item.primary,
                          boxShadow: `0 4px 20px -2px ${item.primary}30`,
                        }
                      : {}
                  }
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-3 min-w-0">
                      {/* Swatches dobles con efecto de capas */}
                      <div className="flex items-center -space-x-2 shrink-0">
                        <span
                          className="w-7 h-7 rounded-full border-2 border-white dark:border-zinc-900 shadow-sm transition-transform group-hover:scale-105"
                          style={{ backgroundColor: item.primary }}
                          title={`Primario: ${item.primary}`}
                        />
                        <span
                          className="w-7 h-7 rounded-full border-2 border-white dark:border-zinc-900 shadow-sm transition-transform group-hover:scale-105"
                          style={{ backgroundColor: item.secondary }}
                          title={`Secundario: ${item.secondary}`}
                        />
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs text-zinc-400 font-mono">#{index + 1}</span>
                          <p className="text-sm font-bold text-zinc-900 dark:text-zinc-50 truncate">
                            {item.name}
                          </p>
                        </div>
                        <p className="text-[11px] text-zinc-400 dark:text-zinc-500 truncate mt-0.5">
                          {item.description}
                        </p>
                      </div>
                    </div>

                    {/* Indicador de estado */}
                    <div className="shrink-0 flex items-center gap-1">
                      {isPersisted && (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                          Activo
                        </span>
                      )}

                      {isStaged ? (
                        <div
                          className="w-6 h-6 rounded-full flex items-center justify-center text-white shadow-xs"
                          style={{ backgroundColor: item.primary }}
                        >
                          <Check size={14} strokeWidth={3} />
                        </div>
                      ) : (
                        <div className="w-5 h-5 rounded-full border border-zinc-300 dark:border-zinc-600 group-hover:border-zinc-400 transition-colors" />
                      )}
                    </div>
                  </div>

                  {/* Barra inferior decorativa del tema */}
                  <div className="w-full h-1.5 rounded-full overflow-hidden flex bg-zinc-200/50 dark:bg-zinc-800">
                    <div className="w-1/2 h-full" style={{ backgroundColor: item.primary }} />
                    <div className="w-1/2 h-full" style={{ backgroundColor: item.secondary }} />
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Sección: Preferencias de Idioma y Modo Claro/Oscuro */}
        <div className="glass-card rounded-[2rem] p-6 sm:p-7 space-y-5">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700">
              <Sliders size={20} />
            </div>
            <div>
              <h2 className="text-base font-display font-bold text-zinc-900 dark:text-zinc-50">
                {t("profile.preferences") || "Preferencias de Interfaz"}
              </h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Ajusta el idioma y el modo visual del sistema
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
            {/* Idioma */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider">
                {t("profile.language") || "Idioma"}
              </label>
              <div className="grid grid-cols-2 gap-2" role="radiogroup">
                {[
                  { id: "es", label: "Español", flag: "🇪🇸" },
                  { id: "en", label: "English", flag: "🇺🇸" },
                ].map((item) => {
                  const isSelected = language === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setLanguage(item.id)}
                      className={`flex items-center justify-between p-3 rounded-2xl border transition-all cursor-pointer ${
                        isSelected
                          ? "border-theme-primary bg-theme-primary-light text-theme-primary ring-1 ring-theme-primary font-bold shadow-xs"
                          : "border-zinc-200/80 dark:border-zinc-700/80 bg-white/50 dark:bg-zinc-800/40 text-zinc-700 dark:text-zinc-300 hover:border-zinc-300 dark:hover:border-zinc-600"
                      }`}
                    >
                      <span className="text-xs flex items-center gap-1.5">
                        <span>{item.flag}</span>
                        <span>{item.label}</span>
                      </span>
                      <div
                        className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                          isSelected ? "border-theme-primary" : "border-zinc-300 dark:border-zinc-600"
                        }`}
                      >
                        {isSelected && <div className="w-2 h-2 rounded-full bg-theme-primary" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Modo Claro / Oscuro */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider">
                {t("profile.theme") || "Modo Visual"}
              </label>
              <div className="grid grid-cols-2 gap-2" role="radiogroup">
                {[
                  { id: "light", label: t("profile.light") || "Claro", icon: Sun },
                  { id: "dark", label: t("profile.dark") || "Oscuro", icon: Moon },
                ].map((item) => {
                  const isSelected = themeMode === item.id;
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setThemeMode(item.id)}
                      className={`flex items-center justify-between p-3 rounded-2xl border transition-all cursor-pointer ${
                        isSelected
                          ? "border-theme-primary bg-theme-primary-light text-theme-primary ring-1 ring-theme-primary font-bold shadow-xs"
                          : "border-zinc-200/80 dark:border-zinc-700/80 bg-white/50 dark:bg-zinc-800/40 text-zinc-700 dark:text-zinc-300 hover:border-zinc-300 dark:hover:border-zinc-600"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Icon size={16} className={isSelected ? "text-theme-primary" : "text-zinc-400"} />
                        <span className="text-xs font-semibold">{item.label}</span>
                      </div>
                      <div
                        className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                          isSelected ? "border-theme-primary" : "border-zinc-300 dark:border-zinc-600"
                        }`}
                      >
                        {isSelected && <div className="w-2 h-2 rounded-full bg-theme-primary" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <button
            onClick={handleSavePreferences}
            disabled={!hasPrefChanges}
            className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-2xl font-bold text-xs sm:text-sm transition-all mt-4 ${
              hasPrefChanges
                ? "bg-theme-primary hover:bg-theme-primary-hover text-white shadow-md glow-primary cursor-pointer active:scale-[0.99]"
                : "bg-zinc-200/70 dark:bg-zinc-800/70 text-zinc-400 dark:text-zinc-500 cursor-not-allowed"
            }`}
          >
            <Save size={16} />
            {t("profile.save") || "Guardar Preferencias de Interfaz"}
          </button>
        </div>

        {/* Zona de Seguridad / Cerrar Sesión */}
        <div className="glass-card rounded-[2rem] p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4 border-rose-200/50 dark:border-rose-900/30">
          <div>
            <h3 className="font-display font-bold text-sm text-zinc-900 dark:text-zinc-50">
              Cerrar Sesión Activa
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Desconecta tu sesión en este navegador de forma segura
            </p>
          </div>

          <button
            onClick={() => setShowLogoutConfirm(true)}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl font-semibold text-xs sm:text-sm text-rose-600 dark:text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 transition-all cursor-pointer active:scale-95"
          >
            <LogOut size={16} />
            {t("profile.logout") || "Cerrar Sesión"}
          </button>
        </div>

        {/* Modal de confirmación de Logout */}
        {showLogoutConfirm && (
          <div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-150"
            onClick={() => setShowLogoutConfirm(false)}
          >
            <div
              className="w-full max-w-sm glass-card bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-display font-bold text-zinc-900 dark:text-zinc-50 mb-2">
                {t("profile.logout") || "Cerrar Sesión"}
              </h3>
              <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mb-6">
                ¿Estás seguro de que deseas salir? Tus datos están protegidos en Firestore y podrás
                volver a ingresar cuando desees.
              </p>
              <div className="flex gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowLogoutConfirm(false)}
                  className="flex-1 py-2.5 rounded-xl text-xs font-semibold text-zinc-600 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowLogoutConfirm(false);
                    signOut(auth);
                  }}
                  className="flex-1 py-2.5 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white transition-colors cursor-pointer shadow-sm"
                >
                  Confirmar Salida
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default ProfilePage;
