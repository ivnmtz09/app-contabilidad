import { AlertTriangle, AlertCircle, CheckCircle2, Info, X } from "lucide-react";

export default function AlertBanner({
  type = "warning",
  title,
  message,
  onDismiss,
  action,
  className = "",
}) {
  const configs = {
    danger: {
      border: "border-rose-500/30 dark:border-rose-500/40",
      bg: "bg-rose-50/90 dark:bg-rose-950/30",
      iconBg: "bg-rose-100 dark:bg-rose-900/50",
      iconColor: "text-rose-600 dark:text-rose-400",
      titleColor: "text-rose-900 dark:text-rose-200",
      textColor: "text-rose-700 dark:text-rose-300",
      Icon: AlertCircle,
    },
    warning: {
      border: "border-amber-500/30 dark:border-amber-500/40",
      bg: "bg-amber-50/90 dark:bg-amber-950/30",
      iconBg: "bg-amber-100 dark:bg-amber-900/50",
      iconColor: "text-amber-600 dark:text-amber-400",
      titleColor: "text-amber-900 dark:text-amber-200",
      textColor: "text-amber-700 dark:text-amber-300",
      Icon: AlertTriangle,
    },
    info: {
      border: "border-sky-500/30 dark:border-sky-500/40",
      bg: "bg-sky-50/90 dark:bg-sky-950/30",
      iconBg: "bg-sky-100 dark:bg-sky-900/50",
      iconColor: "text-sky-600 dark:text-sky-400",
      titleColor: "text-sky-900 dark:text-sky-200",
      textColor: "text-sky-700 dark:text-sky-300",
      Icon: Info,
    },
    success: {
      border: "border-emerald-500/30 dark:border-emerald-500/40",
      bg: "bg-emerald-50/90 dark:bg-emerald-950/30",
      iconBg: "bg-emerald-100 dark:bg-emerald-900/50",
      iconColor: "text-emerald-600 dark:text-emerald-400",
      titleColor: "text-emerald-900 dark:text-emerald-200",
      textColor: "text-emerald-700 dark:text-emerald-300",
      Icon: CheckCircle2,
    },
  };

  const c = configs[type] || configs.warning;
  const { Icon } = c;

  return (
    <div
      className={`flex items-start gap-3 p-3.5 sm:p-4 rounded-2xl border ${c.border} ${c.bg} backdrop-blur-sm transition-all duration-200 ${className}`}
      role="alert"
    >
      <div className={`p-2 rounded-xl shrink-0 ${c.iconBg} ${c.iconColor}`}>
        <Icon size={18} />
      </div>

      <div className="flex-1 min-w-0 pt-0.5">
        {title && (
          <h4 className={`text-xs sm:text-sm font-semibold tracking-tight ${c.titleColor}`}>
            {title}
          </h4>
        )}
        <div className={`text-xs sm:text-xs font-medium leading-relaxed mt-0.5 ${c.textColor}`}>
          {message}
        </div>
        {action && <div className="mt-2">{action}</div>}
      </div>

      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          className="p-1 rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          aria-label="Cerrar alerta"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
}
