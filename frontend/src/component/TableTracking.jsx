import React from "react";

export default function TableTracking({ data }) {
  if (!data || data.length === 0)
    return <div className="text-center">Tidak ada data untuk ditampilkan.</div>;

  // 🧱 Daftar key yang tidak ingin dicetak
  const skipKeys = [
    "id", "created_at", "updated_at", "no_report"
  ];

  // Ambil semua key dari data[0], kecuali yang di skip
  const columns = Object.keys(data[0] || {}).filter((key) => !skipKeys.includes(key));

  return (
    <table className="table table-bordered table-striped table-hover">
      <thead className="table-dark text-center">
        <tr>
          <th>No</th>
          <th>Tanggal</th>
          {columns
            .filter((col) => col !== "date")
            .map((col) => (
              <th key={col}>{col.toUpperCase()}</th>
            ))}
        </tr>
      </thead>

      <tbody>
        {data.map((item, idx) => (
          <tr key={idx}>
            <td className="text-center">{idx + 1}</td>
            <td>{item.date_time ?? item.date ?? "-"}</td>

            {columns
              .filter((col) => col !== "date")
              .map((col) => (
                <td key={col} className="text-end">
                  {item[col] !== null && item[col] !== undefined && item[col] !== ""
                    ? item[col]
                    : "-"}
                </td>
              ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
