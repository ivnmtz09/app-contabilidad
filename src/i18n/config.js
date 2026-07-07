import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  es: {
    translation: {
      nav: {
        home: "Inicio",
        movements: "Movimientos",
        recurring: "Recurrentes",
        goals: "Metas",
      },
      profile: {
        title: "Perfil",
        language: "Idioma",
        logout: "Cerrar Sesión",
        export: "Exportar a Excel",
        stats: "Estadísticas",
        lightMode: "Modo Claro",
        darkMode: "Modo Oscuro",
        createdBy: "Creado por:",
        preferences: "Preferencias",
        accountInfo: "Información de la Cuenta",
        currency: "Moneda",
        saveChanges: "Guardar Cambios",
      },
    },
  },
  en: {
    translation: {
      nav: {
        home: "Home",
        movements: "Movements",
        recurring: "Recurring",
        goals: "Goals",
      },
      profile: {
        title: "Profile",
        language: "Language",
        logout: "Sign Out",
        export: "Export to Excel",
        stats: "Statistics",
        lightMode: "Light Mode",
        darkMode: "Dark Mode",
        createdBy: "Created by:",
        preferences: "Preferences",
        accountInfo: "Account Info",
        currency: "Currency",
        saveChanges: "Save Changes",
      },
    },
  },
};

const savedLang = localStorage.getItem("lang") || "es";

i18n.use(initReactI18next).init({
  resources,
  lng: savedLang,
  fallbackLng: "es",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
