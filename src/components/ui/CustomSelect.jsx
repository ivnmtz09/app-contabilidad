import { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";

export default function CustomSelect({
  value,
  onChange,
  options = [],
  placeholder = "Seleccionar...",
  disabled = false,
  className = "",
  size = "md",
  align = "left",
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    function handleKeyDown(event) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const normalizedOptions = options.map((opt) =>
    typeof opt === "object" ? opt : { value: opt, label: opt }
  );

  const selectedOption = normalizedOptions.find((opt) => opt.value === value);

  const sizeClasses = {
    sm: "px-2.5 py-1.5 text-xs rounded-xl",
    md: "px-3.5 py-2.5 text-sm rounded-xl",
    lg: "px-4 py-3 text-sm rounded-2xl",
  }[size] || "px-3.5 py-2.5 text-sm rounded-xl";

  const SelectedIcon = selectedOption?.icon;

  return (
    <div className={`relative inline-block w-full ${className}`} ref={containerRef}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between gap-2 border bg-white dark:bg-zinc-800/90 text-zinc-900 dark:text-zinc-100 border-zinc-200 dark:border-zinc-700/80 shadow-2xs hover:border-zinc-300 dark:hover:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-theme-primary transition-all duration-150 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${sizeClasses}`}
      >
        <span className="flex items-center gap-2 truncate">
          {SelectedIcon && (
            <SelectedIcon size={16} className="shrink-0 text-zinc-500 dark:text-zinc-400" />
          )}
          <span className="truncate">
            {selectedOption ? selectedOption.label : placeholder}
          </span>

          {selectedOption?.badge && (
            <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-300 font-medium">
              {selectedOption.badge}
            </span>
          )}
        </span>
        <ChevronDown
          size={16}
          className={`shrink-0 text-zinc-400 transition-transform duration-200 ${
            isOpen ? "rotate-180 text-theme-primary" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div
          className={`absolute ${
            align === "right" ? "right-0" : "left-0"
          } mt-1.5 w-full min-w-[160px] max-h-60 overflow-y-auto custom-scrollbar bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-xl z-50 p-1.5 backdrop-blur-xl animate-in fade-in zoom-in-95 duration-100`}
        >
          {normalizedOptions.map((opt) => {
            const isSelected = opt.value === value;
            const OptIcon = opt.icon;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  onChange(opt.value);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center justify-between gap-2 px-3 py-2 text-xs sm:text-sm rounded-xl text-left transition-colors cursor-pointer ${
                  isSelected
                    ? "bg-theme-primary/10 text-theme-primary font-semibold"
                    : "text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800/80"
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  {OptIcon && (
                    <OptIcon
                      size={15}
                      className={isSelected ? "text-theme-primary" : "text-zinc-400"}
                    />
                  )}
                  <span className="truncate">{opt.label}</span>
                  {opt.badge && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-500 font-normal">
                      {opt.badge}
                    </span>
                  )}
                </div>
                {isSelected && <Check size={14} className="shrink-0 text-theme-primary" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
