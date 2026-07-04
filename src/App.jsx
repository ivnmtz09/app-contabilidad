import { useState } from "react";
import { Menu, LogOut } from "lucide-react";
import Login from "./components/Login";
import Drawer from "./components/Drawer";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const movimientos = [
    { descripcion: "Salida con amigos", monto: -45.0, tipo: "egreso" },
    { descripcion: "Compra de boli", monto: -2.5, tipo: "egreso" },
    { descripcion: "Transferencia recibida", monto: 1200.0, tipo: "ingreso" },
  ];

  const handleLogin = () => setIsAuthenticated(true);
  const handleLogout = () => setIsAuthenticated(false);

  if (!isAuthenticated) return <Login onLogin={handleLogin} />;

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900">
      <Drawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />

      <header className="flex items-center justify-between px-4 py-3 md:px-8 border-b border-zinc-200 dark:border-zinc-700">
        <button
          onClick={() => setIsDrawerOpen(true)}
          className="p-2 rounded-lg text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
        >
          <Menu size={22} />
        </button>

        <h1 className="text-lg font-display font-bold text-zinc-900 dark:text-zinc-50">
          App Contabilidad
        </h1>

        <button
          onClick={handleLogout}
          className="p-2 rounded-lg text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
        >
          <LogOut size={20} />
        </button>
      </header>

      <main className="p-4 md:p-8">
        <div className="mx-auto max-w-7xl grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <div className="md:col-span-2 bg-white dark:bg-zinc-800 rounded-3xl shadow-sm p-6 md:p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 font-sans">
                Balance Total
              </p>
              <p className="text-4xl md:text-5xl font-display font-bold text-zinc-900 dark:text-zinc-50">
                $0.00
              </p>
            </div>
            <button className="w-full md:w-auto bg-violet-600 hover:bg-violet-700 text-white font-sans font-semibold px-6 py-3 rounded-xl transition-colors cursor-pointer">
              + Añadir movimiento
            </button>
          </div>

          <div className="bg-white dark:bg-zinc-800 rounded-2xl shadow-sm p-6">
            <p className="text-sm text-zinc-500 dark:text-zinc-400 font-sans">
              Ingresos del mes
            </p>
            <p className="text-2xl md:text-3xl font-display font-bold text-emerald-500">
              $0.00
            </p>
          </div>

          <div className="bg-white dark:bg-zinc-800 rounded-2xl shadow-sm p-6">
            <p className="text-sm text-zinc-500 dark:text-zinc-400 font-sans">
              Egresos del mes
            </p>
            <p className="text-2xl md:text-3xl font-display font-bold text-rose-500">
              $0.00
            </p>
          </div>

          <div
            className="md:col-span-2 bg-white dark:bg-zinc-800 rounded-2xl shadow-sm p-6 flex items-center justify-center"
            style={{ minHeight: "200px" }}
          >
            <p className="text-zinc-400 dark:text-zinc-500 font-sans text-sm">
              Gráfico de Balance (Próximamente)
            </p>
          </div>

          <div className="md:col-span-2 bg-white dark:bg-zinc-800 rounded-2xl shadow-sm p-6">
            <h3 className="text-lg font-display font-semibold text-zinc-900 dark:text-zinc-50 mb-4">
              Últimos Movimientos
            </h3>
            <ul className="space-y-3">
              {movimientos.map((mov, i) => (
                <li
                  key={i}
                  className="flex justify-between items-center py-2 border-b border-zinc-100 dark:border-zinc-700 last:border-b-0"
                >
                  <span className="font-sans text-zinc-700 dark:text-zinc-300">
                    {mov.descripcion}
                  </span>
                  <span
                    className={`font-display font-semibold ${mov.tipo === "ingreso" ? "text-emerald-500" : "text-rose-500"}`}
                  >
                    {mov.tipo === "ingreso" ? "+" : "-"}$
                    {Math.abs(mov.monto).toFixed(2)}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
