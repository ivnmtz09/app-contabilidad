import * as XLSX from "xlsx";

export async function exportToExcel(transactions, accounts) {
  const data = transactions.map((t) => ({
    Fecha: new Date(t.date).toLocaleDateString(),
    Tipo: t.type.toUpperCase(),
    Cuenta: accounts.find((a) => a.id === t.accountId)?.name || "Desconocida",
    Descripción: t.description,
    Monto: t.type === "egreso" ? -t.amount : t.amount,
  }));

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Movimientos");
  XLSX.writeFile(workbook, "MisCuentaZ_Export.xlsx");
}
