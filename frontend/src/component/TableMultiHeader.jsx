import React from "react";

export default function TableMultiHeader({ data }) {
  if (!data || data.length === 0)
    return <div className="text-center">Tidak ada data untuk ditampilkan.</div>;

  // 🧱 Daftar key yang tidak ingin dicetak
  const skipKeys = [
    "id_report_lvmdp1",
    "id_report_lvmdp2",
    "id_report_load_trafo",
    "id_report_rectifier",
    "id_report_pue", "id_report_kwh",
    "id_report_suhu",
    "created_at",
    "updated_at",
    "id",
    "no_report",
    "Nama","Brand","BebanTotal","CapsRec","Status","no","type","battery","runtime","A","brand","Nama","Nama",
  ];

  // Ambil semua key unik yang berupa objek
  const nestedKeys = Object.keys(data[0] || {}).filter(
    (key) =>
      typeof data[0][key] === "object" &&
      data[0][key] !== null &&
      !skipKeys.includes(key)
  );

  // Buat mapping key utama ke subkey-nya
  const subKeysMap = {};
  nestedKeys.forEach((key) => {
    const subKeys = Object.keys(data[0][key] || {}).filter(
      (sub) => !skipKeys.includes(sub)
    );
    subKeysMap[key] = subKeys;
  });

  return (
      <table className="">
        <thead className="table-dark text-center">
          {/* Header utama */}
          <tr>
            <th rowSpan="2">No</th>
            <th rowSpan="2">Tanggal</th>
            {nestedKeys.map((key) => (
              <th key={key} colSpan={subKeysMap[key].length}>
                {key.replace("report_", "").toUpperCase()}
              </th>
            ))}
          </tr>

          {/* Sub-header */}
          <tr>
            {nestedKeys.map((key) =>
              subKeysMap[key].map((sub) => (
                <th key={`${key}-${sub}`}>{sub.toUpperCase()}</th>
              ))
            )}
          </tr>
        </thead>

        <tbody>
          {data.map((item, idx) => (
            <tr key={idx}>
              <td className="text-center">{idx + 1}</td>
              <td>{item.date_time ?? item.date ?? "-"}</td>


              {nestedKeys.map((key) =>
                subKeysMap[key].map((sub) => (
                  <td
                    key={`${idx}-${key}-${sub}`}
                    className="text-end"
                  >
                    {item[key]?.[sub] !== null &&
                    item[key]?.[sub] !== undefined &&
                    item[key]?.[sub] !== ""
                      ? item[key][sub]
                      : "-"}
                  </td>
                ))
              )}
            </tr>
          ))}
        </tbody>
      </table>
  );
}
