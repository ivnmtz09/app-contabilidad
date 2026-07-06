import { useState } from "react";
import { X, Search } from "lucide-react";

const COLOMBIAN_BANKS = [
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

function AddAccountModal({ isOpen, onClose, onAddAccount }) {
  const [searchTerm, setSearchTerm] = useState("");

  if (!isOpen) return null;

  const filteredBanks = COLOMBIAN_BANKS.filter((bank) =>
    bank.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (bank) => {
    onAddAccount(bank);
    setSearchTerm("");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl w-full max-w-md mx-4 flex flex-col gap-4 shadow-xl">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-display font-bold text-zinc-900 dark:text-zinc-50">
            Añadir Cuenta
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        <div className="relative">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"
          />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar entidad..."
            className="bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 focus:ring-2 focus:ring-violet-600 outline-none w-full p-3 pl-10 rounded-xl font-sans text-sm transition-all"
          />
        </div>

        <div className="max-h-64 overflow-y-auto flex flex-col gap-1 mt-2">
          {filteredBanks.length === 0 ? (
            <p className="text-sm font-sans text-zinc-400 dark:text-zinc-500 text-center py-6">
              No se encontraron cuentas
            </p>
          ) : (
            filteredBanks.map((bank) => (
              <button
                key={bank}
                onClick={() => handleSelect(bank)}
                className="text-left px-4 py-3 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors font-medium font-sans text-sm text-zinc-800 dark:text-zinc-200 cursor-pointer"
              >
                {bank}
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default AddAccountModal;
