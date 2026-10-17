import { useState } from "react";
import { X, Search, PlusCircle, CheckCircle2 } from "lucide-react";

const COLOMBIAN_BANKS = [
  "Efectivo",
  "Bancolombia",
  "Nequi",
  "Davivienda",
  "DaviPlata",
  "Nu",
  "RappiPay",
  "Lulo Bank",
  "Banco de Bogotá",
  "Banco de Occidente",
  "Banco Popular",
  "Banco AV Villas",
  "Scotiabank Colpatria",
  "BBVA",
  "Banco Caja Social",
  "Itaú",
  "Banco Falabella",
  "Banco Agrario",
  "Ualá",
  "dale!",
  "Mercado Pago",
  "Claro Pay",
  "Finandina",
  "Pibank",
  "Global66",
];

function AddAccountModal({ isOpen, onClose, onAddAccount, existingAccounts = [] }) {
  const [searchTerm, setSearchTerm] = useState("");

  if (!isOpen) return null;

  // Set normalizado de cuentas existentes para evitar duplicados
  const existingNamesSet = new Set(
    (existingAccounts || []).map((acc) => (acc.name || "").trim().toLowerCase())
  );

  // Filtrar entidades para descartar las que ya existen
  const availableBanks = COLOMBIAN_BANKS.filter(
    (bank) => !existingNamesSet.has(bank.trim().toLowerCase())
  );

  const cleanSearch = searchTerm.trim();
  const isCustomMatch = cleanSearch.length >= 2;
  const alreadyExistsSearch = isCustomMatch && existingNamesSet.has(cleanSearch.toLowerCase());

  // Filtrado por término de búsqueda
  const filteredBanks = availableBanks.filter((bank) =>
    bank.toLowerCase().includes(cleanSearch.toLowerCase())
  );

  const handleSelect = (bankName) => {
    const trimmed = bankName.trim();
    if (!trimmed || existingNamesSet.has(trimmed.toLowerCase())) return;
    onAddAccount(trimmed);
    setSearchTerm("");
    onClose();
  };

  const handleClose = () => {
    setSearchTerm("");
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={handleClose}
    >
      <div
        className="bg-white/95 dark:bg-zinc-900/95 backdrop-blur-2xl border border-zinc-200/70 dark:border-zinc-800/70 p-6 rounded-3xl w-full max-w-md flex flex-col gap-4 shadow-2xl transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-display font-bold text-zinc-900 dark:text-zinc-50">
              Añadir Cuenta
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Selecciona una entidad o escribe un nombre personalizado
            </p>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 rounded-xl text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Buscador de entidad */}
        <div className="relative">
          <Search
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400"
          />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar entidad o escribir nombre..."
            className="bg-zinc-100 dark:bg-zinc-800/80 text-zinc-900 dark:text-zinc-50 focus:ring-2 focus:ring-theme-primary outline-none w-full p-3 pl-10 rounded-xl font-sans text-sm transition-all border border-zinc-200/50 dark:border-zinc-700/50"
          />
        </div>

        {/* Aviso si la búsqueda coincide con una cuenta que ya existe */}
        {alreadyExistsSearch && (
          <div className="flex items-center gap-2 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-300 text-xs font-medium">
            <CheckCircle2 size={16} className="shrink-0 text-amber-600 dark:text-amber-400" />
            <span>Ya tienes registrada la cuenta <strong>"{cleanSearch}"</strong>.</span>
          </div>
        )}

        {/* Opción para crear cuenta con nombre personalizado no listado */}
        {isCustomMatch && !alreadyExistsSearch && !availableBanks.some(b => b.toLowerCase() === cleanSearch.toLowerCase()) && (
          <button
            type="button"
            onClick={() => handleSelect(cleanSearch)}
            className="flex items-center gap-2 p-3 rounded-xl bg-theme-primary/10 hover:bg-theme-primary/20 text-theme-primary font-semibold text-xs border border-theme-primary/30 transition-all cursor-pointer"
          >
            <PlusCircle size={16} />
            <span>Crear cuenta personalizada: <strong>"{cleanSearch}"</strong></span>
          </button>
        )}

        {/* Lista de entidades disponibles (excluyendo las ya creadas) */}
        <div className="max-h-64 overflow-y-auto custom-scrollbar flex flex-col gap-1 pr-1">
          {filteredBanks.length === 0 && !isCustomMatch ? (
            <div className="py-8 text-center flex flex-col items-center gap-1">
              <p className="text-sm font-sans font-medium text-zinc-500 dark:text-zinc-400">
                {availableBanks.length === 0
                  ? "Ya has añadido todas las entidades predefinidas."
                  : "No se encontraron entidades coincidentes."}
              </p>
              <p className="text-xs text-zinc-400 dark:text-zinc-500">
                Puedes escribir cualquier nombre en el buscador para crearla.
              </p>
            </div>
          ) : (
            filteredBanks.map((bank) => (
              <button
                key={bank}
                onClick={() => handleSelect(bank)}
                className="flex items-center justify-between text-left px-4 py-3 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors font-medium font-sans text-sm text-zinc-800 dark:text-zinc-200 cursor-pointer group"
              >
                <span>{bank}</span>
                <span className="text-xs text-theme-primary opacity-0 group-hover:opacity-100 transition-opacity font-semibold">
                  + Añadir
                </span>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default AddAccountModal;
