import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  LabelList,
} from "recharts";

function BalanceChart({ transactions }) {
  if (transactions.length === 0) {
    return (
      <div className="h-full w-full flex items-center justify-center text-sm font-sans text-zinc-400 dark:text-zinc-500">
        Registra movimientos para ver tu gráfico
      </div>
    );
  }

  const dailyMap = {};
  const sorted = [...transactions].sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );

  sorted.forEach((t) => {
    const day = new Date(t.date).toLocaleDateString();
    if (!dailyMap[day]) dailyMap[day] = 0;
    dailyMap[day] += t.type === "ingreso" ? t.amount : -t.amount;
  });

  let acc = 0;
  const chartData = Object.entries(dailyMap).map(([date, net]) => {
    acc += net;
    return { date, balance: acc };
  });

  return (
    <div className="h-64 w-full mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 35, right: 20, left: 10, bottom: 0 }}>
          <defs>
            <linearGradient id="balanceGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={true} stroke="currentColor" className="text-zinc-200 dark:text-zinc-800" />
          <XAxis dataKey="date" stroke="currentColor" tick={{ fontSize: 11, fill: 'currentColor' }} tickMargin={10} className="text-zinc-500" />
          <YAxis stroke="currentColor" width={75} tick={{ fontSize: 11, fill: 'currentColor' }} tickFormatter={(value) => `$${value.toLocaleString()}`} className="text-zinc-500" />
          <Area
            type="monotone"
            dataKey="balance"
            stroke="#7c3aed"
            strokeWidth={3}
            fill="url(#balanceGradient)"
            isAnimationActive={false}
            dot={{ fill: "#8b5cf6", stroke: "#fff", strokeWidth: 2, r: 5 }}
            activeDot={false}
          >
            <LabelList
              dataKey="balance"
              position="top"
              offset={15}
              formatter={(value) => `$${value.toLocaleString()}`}
              className="fill-zinc-700 dark:fill-zinc-300 text-[10px] sm:text-xs font-bold"
            />
          </Area>
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export default BalanceChart;
