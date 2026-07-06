import * as XLSX from "xlsx";

export async function exportToExcel(transactions, accounts) {
  const data = transactions.map((t) => ({
    Fecha: new Date(t.date).toLocaleDateString(),
    Tipo: t.type.toUpperCase(),
    Cuenta: accounts.find((a) => a.id === t.accountId)?.name || "Desconocida",
    Descripción: t.description,
    Monto: t.type === "egreso" ? -t.amount : t.amount,
  }));

  const total = data.reduce((sum, row) => sum + row.Monto, 0);
  data.push({ Fecha: "", Tipo: "", Cuenta: "", Descripción: "BALANCE TOTAL", Monto: total });

  const worksheet = XLSX.utils.json_to_sheet(data);

  const wscols = [
    { wch: 15 },
    { wch: 12 },
    { wch: 20 },
    { wch: 40 },
    { wch: 18 }
  ];
  worksheet["!cols"] = wscols;

  const range = XLSX.utils.decode_range(worksheet['!ref']);
  for (let R = 1; R <= range.e.r; ++R) {
    const cellAddress = XLSX.utils.encode_cell({ c: 4, r: R });
    if (!worksheet[cellAddress]) continue;
    worksheet[cellAddress].z = '"$"#,##0.00';
  }

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Historial");
  XLSX.writeFile(workbook, "Reporte_Financiero_de_Iván.xlsx");
}
