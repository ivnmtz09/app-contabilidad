import { Coins, Building2, Smartphone, CreditCard, TrendingUp, Wallet } from "lucide-react";

export const ACCOUNT_TYPES = [
  {
    id: "billetera",
    label: "Billetera Digital",
    hint: "Nequi, Daviplata, Dale, etc.",
    icon: Smartphone,
    color: "violet",
    bgClass: "bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400 border-violet-200 dark:border-violet-800/40",
  },
  {
    id: "banco",
    label: "Cuenta Bancaria",
    hint: "Ahorros o Corriente (Bancolombia, etc.)",
    icon: Building2,
    color: "blue",
    bgClass: "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800/40",
  },
  {
    id: "efectivo",
    label: "Efectivo",
    hint: "Billetera o caja física",
    icon: Coins,
    color: "emerald",
    bgClass: "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/40",
  },
  {
    id: "credito",
    label: "Tarjeta de Crédito / Sobregiro",
    hint: "Línea de crédito con cupo / saldo pendiente",
    icon: CreditCard,
    color: "rose",
    bgClass: "bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-800/40",
    isCredit: true,
  },
  {
    id: "inversion",
    label: "Inversión / CDT",
    hint: "Fondos, CDT, acciones",
    icon: TrendingUp,
    color: "amber",
    bgClass: "bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800/40",
  },
];

export function getAccountTypeMeta(typeId = "efectivo") {
  const found = ACCOUNT_TYPES.find((t) => t.id === typeId);
  if (found) return found;
  // Fallback
  return {
    id: "otro",
    label: "Cuenta",
    hint: "Cuenta estándar",
    icon: Wallet,
    color: "zinc",
    bgClass: "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700",
  };
}
