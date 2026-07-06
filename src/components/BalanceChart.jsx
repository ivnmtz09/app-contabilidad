import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
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
        <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="balanceGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={true} horizontal={true} stroke="#52525b" opacity={0.2} />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 11, fill: "#a1a1aa" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 11, fill: "#a1a1aa" }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "var(--tooltip-bg, #fff)",
              border: "none",
              borderRadius: "12px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              fontSize: "13px",
            }}
            labelStyle={{ fontWeight: 600 }}
          />
          <Area
            type="monotone"
            dataKey="balance"
            stroke="#7c3aed"
            strokeWidth={2}
            fill="url(#balanceGradient)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export default BalanceChart;
