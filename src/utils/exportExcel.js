import * as XLSX from "xlsx-js-style";

const COLOR_HEADER_BG = "1F2937";
const COLOR_HEADER_TEXT = "FFFFFF";
const COLOR_ROW_ALT = "F3F4F6";
const COLOR_TOTAL_BG = "111827";
const COLOR_TOTAL_TEXT = "FFFFFF";
const COLOR_POSITIVE = "15803D";
const COLOR_NEGATIVE = "B91C1C";

const thinBorder = {
  top: { style: "thin", color: { rgb: "D1D5DB" } },
  bottom: { style: "thin", color: { rgb: "D1D5DB" } },
  left: { style: "thin", color: { rgb: "D1D5DB" } },
  right: { style: "thin", color: { rgb: "D1D5DB" } },
};

export async function exportToExcel(transactions, accounts) {
  const data = transactions.map((t) => ({
    Fecha: new Date(t.date).toLocaleDateString(),
    Tipo: t.type.toUpperCase(),
    Cuenta: accounts.find((a) => a.id === t.accountId)?.name || "Desconocida",
    Descripción: t.description,
    Monto: t.type === "egreso" ? -t.amount : t.amount,
  }));

  const total = data.reduce((sum, row) => sum + row.Monto, 0);
  data.push({
    Fecha: "",
    Tipo: "",
    Cuenta: "",
    Descripción: "BALANCE TOTAL",
    Monto: total,
  });

  const worksheet = XLSX.utils.json_to_sheet(data);

  const wscols = [
    { wch: 15 },
    { wch: 12 },
    { wch: 20 },
    { wch: 40 },
    { wch: 18 },
  ];
  worksheet["!cols"] = wscols;

  const range = XLSX.utils.decode_range(worksheet["!ref"]);
  const lastRow = range.e.r;
  const headerRow = 0;

  for (let C = range.s.c; C <= range.e.c; ++C) {
    const cellAddress = XLSX.utils.encode_cell({ c: C, r: headerRow });
    if (!worksheet[cellAddress]) continue;
    worksheet[cellAddress].s = {
      font: { bold: true, color: { rgb: COLOR_HEADER_TEXT }, sz: 11 },
      fill: { fgColor: { rgb: COLOR_HEADER_BG } },
      alignment: { horizontal: "center", vertical: "center" },
      border: thinBorder,
    };
  }

  for (let R = 1; R <= range.e.r; ++R) {
    const isTotalRow = R === lastRow;
    const isAltRow = !isTotalRow && R % 2 === 0;

    for (let C = range.s.c; C <= range.e.c; ++C) {
      const cellAddress = XLSX.utils.encode_cell({ c: C, r: R });
      if (!worksheet[cellAddress]) continue;

      const isMontoCol = C === 4;
      const value = worksheet[cellAddress].v;

      const baseStyle = {
        border: thinBorder,
        alignment: {
          horizontal: isMontoCol ? "right" : C === 3 ? "left" : "center",
          vertical: "center",
        },
        font: { sz: 10 },
      };

      if (isTotalRow) {
        worksheet[cellAddress].s = {
          ...baseStyle,
          font: { bold: true, color: { rgb: COLOR_TOTAL_TEXT }, sz: 11 },
          fill: { fgColor: { rgb: COLOR_TOTAL_BG } },
        };
      } else {
        worksheet[cellAddress].s = {
          ...baseStyle,
          fill: isAltRow ? { fgColor: { rgb: COLOR_ROW_ALT } } : undefined,
          font: {
            ...baseStyle.font,
            color:
              isMontoCol && typeof value === "number"
                ? { rgb: value < 0 ? COLOR_NEGATIVE : COLOR_POSITIVE }
                : undefined,
          },
        };
      }

      if (isMontoCol) {
        worksheet[cellAddress].z = '"$"#,##0.00;[Red]-"$"#,##0.00';
      }
    }
  }

  worksheet["!freeze"] = { xSplit: 0, ySplit: 1 };
  worksheet["!autofilter"] = { ref: `A1:E${lastRow}` };

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Historial");
  XLSX.writeFile(workbook, "Reporte_Financiero.xlsx");
}
