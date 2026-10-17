import i18n from "../i18n/config";

const localeMap = {
  es: "es-CO",
  en: "en-US",
};

export function formatCurrency(amount) {
  const lang = i18n.language || "es";
  const locale = localeMap[lang] || "es-CO";
  const num = typeof amount === "number" ? amount : Number(amount);
  if (isNaN(num)) return "0";
  return num.toLocaleString(locale);
}

