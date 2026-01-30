import React, { useState } from "react";
import "./Table_report_list.css";
import Report from "./Report"; // sesuaikan path

function Table_report_list({ columns = [], data = [] }) {
  const [openReport, setOpenReport] = useState(false);
  const [reportId, setReportId] = useState(null);
  const [reportType, setReportType] = useState("");

  const handleRowClick = (row) => {
    if (!row?.no_report) return;

    setReportId(row.no_report);
    setReportType(row.Report || "");
    setOpenReport(true);
  };

  return (
    <>
      <div className="table-report-list-warper">
        <table className="table-report-list">
          <thead>
            <tr>
              <th>No.</th>
              <th>No Report</th>
              {columns
                .filter((col) => col.key !== "no_report")
                .map((col) => (
                  <th key={col.key}>{col.label}</th>
                ))}
            </tr>
          </thead>

          <tbody>
            {data.map((row, index) => (
              <tr
                key={`${row.no_report}-${index}`}
                className="clickable-row"
                onClick={() => handleRowClick(row)}
              >
                <td>{index + 1}</td>
                <td>{row.no_report || "-"}</td>
                <td>{row.Petugas1 || "-"}</td>
                <td>{row.Petugas2 || "-"}</td>
                <td>{row.Petugas3 || "-"}</td>
                <td>{row.Petugas4 || "-"}</td>
                <td>{row.Report || "-"}</td>
                <td>{row.Date || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ===== POPUP REPORT ===== */}
      <Report
        open={openReport}
        reportId={reportId}
        reportType={reportType}
        onClose={() => setOpenReport(false)}
      />

    </>
  );
}

export default Table_report_list;
