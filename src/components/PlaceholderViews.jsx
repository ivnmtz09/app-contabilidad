import { useTranslation } from "react-i18next";

export function RecurrentesView() {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col items-center justify-center h-64 text-center px-4">
      <h2 className="text-2xl font-display font-bold text-zinc-900 dark:text-zinc-50 mb-2">{t("recurrent.title")}</h2>
      <p className="text-zinc-500 dark:text-zinc-400">{t("recurrent.desc")}</p>
    </div>
  );
}

export function MetasView() {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col items-center justify-center h-64 text-center px-4">
      <h2 className="text-2xl font-display font-bold text-zinc-900 dark:text-zinc-50 mb-2">{t("goals.title")}</h2>
      <p className="text-zinc-500 dark:text-zinc-400">{t("goals.desc")}</p>
    </div>
  );
}
