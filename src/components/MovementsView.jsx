function MovementsView({ transactions, accounts }) {
  const grouped = transactions.reduce((acc, t) => {
    const dateKey = new Date(t.date).toLocaleDateString("es-CO", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(t);
    return acc;
  }, {});

  const getAccountName = (id) => {
    const acc = accounts.find((a) => a.id === id);
    return acc ? acc.name : id;
  };

  const todayStr = new Date().toLocaleDateString("es-CO", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toLocaleDateString("es-CO", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const formatLabel = (key) => {
    if (key === todayStr) return "Hoy";
    if (key === yesterdayStr) return "Ayer";
    return key;
  };

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-xl font-display font-bold text-zinc-900 dark:text-zinc-50">
        Todos los Movimientos
      </h2>

      {transactions.length === 0 ? (
        <p className="text-sm font-sans text-zinc-400 dark:text-zinc-500 text-center py-8">
          Sin movimientos registrados
        </p>
      ) : (
        Object.entries(grouped).map(([dateKey, items]) => (
          <div key={dateKey}>
            <p className="text-xs font-display font-semibold text-zinc-400 dark:text-zinc-500 uppercase mb-2">
              {formatLabel(dateKey)}
            </p>
            <div className="flex flex-col gap-2">
              {items.map((t) => (
                <div
                  key={t.id}
                  className="flex items-center justify-between bg-white dark:bg-zinc-800 rounded-2xl p-4 shadow-sm"
                >
                  <div className="flex flex-col gap-0.5">
                    <p className="font-sans text-sm font-medium text-zinc-800 dark:text-zinc-200">
                      {t.description}
                    </p>
                    <p className="font-sans text-xs text-zinc-400">
                      {getAccountName(t.accountId)}
                    </p>
                  </div>
                  <span
                    className={`font-display font-semibold text-sm ${
                      t.type === "ingreso" ? "text-emerald-500" : "text-rose-500"
                    }`}
                  >
                    {t.type === "ingreso" ? "+" : "-"}$
                    {t.amount.toLocaleString("es-CO")}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default MovementsView;
