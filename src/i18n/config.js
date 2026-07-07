import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  es: {
    translation: {
      "profile.title": "Tu Perfil",
      "profile.preferences": "Preferencias",
      "profile.language": "Idioma",
      "profile.theme": "Tema",
      "profile.light": "Claro",
      "profile.dark": "Oscuro",
      "profile.save": "Guardar Cambios",
      "profile.logout": "Cerrar Sesión",
      "profile.success": "Preferencias actualizadas",
      "nav.home": "Inicio",
      "nav.movements": "Movimientos",
      "nav.recurrent": "Recurrentes",
      "nav.goals": "Metas",
      "home.totalBalance": "Balance Total",
      "home.addMovement": "+ Añadir movimiento",
      "home.monthIncome": "Ingresos del mes",
      "home.monthExpense": "Egresos del mes",
      "home.day": "Día",
      "home.week": "Semana",
      "home.month": "Mes",
      "home.recent": "Últimos Movimientos",
      "home.noRecent": "Sin transacciones recientes",
      "movements.title": "Todos los Movimientos",
      "movements.today": "Hoy",
      "movements.yesterday": "Ayer",
      "recurrent.title": "Gastos Recurrentes",
      "recurrent.desc": "Próximamente: Gestiona tus suscripciones y recibos aquí.",
      "goals.title": "Metas de Ahorro",
      "goals.desc": "Próximamente: Establece objetivos y ahorra para ellos."
    }
  },
  en: {
    translation: {
      "profile.title": "Your Profile",
      "profile.preferences": "Preferences",
      "profile.language": "Language",
      "profile.theme": "Theme",
      "profile.light": "Light",
      "profile.dark": "Dark",
      "profile.save": "Save Changes",
      "profile.logout": "Log Out",
      "profile.success": "Preferences updated",
      "nav.home": "Home",
      "nav.movements": "Movements",
      "nav.recurrent": "Recurrent",
      "nav.goals": "Goals",
      "home.totalBalance": "Total Balance",
      "home.addMovement": "+ Add movement",
      "home.monthIncome": "Monthly Income",
      "home.monthExpense": "Monthly Expense",
      "home.day": "Day",
      "home.week": "Week",
      "home.month": "Month",
      "home.recent": "Recent Movements",
      "home.noRecent": "No recent transactions",
      "movements.title": "All Movements",
      "movements.today": "Today",
      "movements.yesterday": "Yesterday",
      "recurrent.title": "Recurring Expenses",
      "recurrent.desc": "Coming soon: Manage your subscriptions and bills here.",
      "goals.title": "Savings Goals",
      "goals.desc": "Coming soon: Set objectives and save for them."
    }
  }
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
