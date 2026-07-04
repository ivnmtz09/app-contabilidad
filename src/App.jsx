function App() {
  const movimientos = [
    { descripcion: "Salida con amigos", monto: -45.0, tipo: "egreso" },
    { descripcion: "Compra de boli", monto: -2.5, tipo: "egreso" },
    { descripcion: "Transferencia recibida", monto: 1200.0, tipo: "ingreso" },
  ];

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="mx-auto max-w-7xl grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">

        <div className="md:col-span-2 bg-white dark:bg-zinc-800 rounded-3xl shadow-sm p-6 md:p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 font-body">Balance Total</p>
            <p className="text-4xl md:text-5xl font-heading font-bold text-zinc-900 dark:text-zinc-50">
              $0.00
            </p>
          </div>
          <button className="w-full md:w-auto bg-violet-600 hover:bg-violet-700 text-white font-body font-semibold px-6 py-3 rounded-xl transition-colors cursor-pointer">
            + Añadir movimiento
          </button>
        </div>

        <div className="bg-white dark:bg-zinc-800 rounded-2xl shadow-sm p-6">
          <p className="text-sm text-zinc-500 dark:text-zinc-400 font-body">Ingresos del mes</p>
          <p className="text-2xl md:text-3xl font-heading font-bold text-emerald-500">$0.00</p>
        </div>

        <div className="bg-white dark:bg-zinc-800 rounded-2xl shadow-sm p-6">
          <p className="text-sm text-zinc-500 dark:text-zinc-400 font-body">Egresos del mes</p>
          <p className="text-2xl md:text-3xl font-heading font-bold text-rose-500">$0.00</p>
        </div>

        <div className="md:col-span-2 bg-white dark:bg-zinc-800 rounded-2xl shadow-sm p-6 flex items-center justify-center" style={{ minHeight: "200px" }}>
          <p className="text-zinc-400 dark:text-zinc-500 font-body text-sm">Gráfico de Balance (Próximamente)</p>
        </div>

        <div className="md:col-span-2 bg-white dark:bg-zinc-800 rounded-2xl shadow-sm p-6">
          <h3 className="text-lg font-heading font-semibold text-zinc-900 dark:text-zinc-50 mb-4">
            Últimos Movimientos
          </h3>
          <ul className="space-y-3">
            {movimientos.map((mov, i) => (
              <li key={i} className="flex justify-between items-center py-2 border-b border-zinc-100 dark:border-zinc-700 last:border-b-0">
                <span className="font-body text-zinc-700 dark:text-zinc-300">{mov.descripcion}</span>
                <span className={`font-heading font-semibold ${mov.tipo === "ingreso" ? "text-emerald-500" : "text-rose-500"}`}>
                  {mov.tipo === "ingreso" ? "+" : "-"}${Math.abs(mov.monto).toFixed(2)}
                </span>
              </li>
            ))}
          </ul>
        </div>

      </div>
    </div>
  );
}

export default App;
