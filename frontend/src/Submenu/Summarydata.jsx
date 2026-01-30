import React, { useState, useEffect } from "react";
import TableMultiHeader from "../component/TableMultiHeader";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import "./Summarypue.css";
import { fetchSummaryPUE, fetchDailyActivityList } from "../auth";
import Loder from "../component/Loder";
import Table_report_list from "../component/Table_report_list";

export default function Summarydata({ reportType }) {
  const [reportData, setReportData] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [month, setMonth] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const columns = [
    { key: "no_report", label: "No." },
    { key: "Petugas1", label: "Petugas1" },
    { key: "Petugas2", label: "Petugas2" },
    { key: "Petugas3", label: "Petugas3" },
    { key: "Petugas4", label: "Petugas4" },
    { key: "Report", label: "Report" },
    { key: "Date", label: "Date" },
  ];

  // 🔹 AUTO FETCH SAAT reportType BERUBAH
  useEffect(() => {
    if (!reportType) return;
    loadInitial();
  }, [reportType]);

 useEffect(() => {
  if (reportType === "ceklist") {
    loadInitial();
  }
}, [month]);  

  const loadInitial = async () => {
  setLoading(true);
  setError(null);

  try {
    let data;

    if (reportType === "ceklist") {
      data = await fetchDailyActivityList(month); // ⬅️ pakai month
      setReportData(data?.DialyActivityList || []);
    } else {
      data = await fetchSummaryPUE({ type: reportType });
      setReportData(data);
    }

    console.log("INITIAL DATA:", data);

  } catch (err) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
};




  // 🔹 FETCH RANGE
  const fetchByRange = async () => {
    if (!startDate || !endDate) {
      setError("Tanggal awal dan akhir harus diisi");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const data = await fetchSummaryPUE({
        type: reportType,
        startDate,
        endDate,
      });
      setReportData(data);
      console.log("ini adalah data ceklist",reportData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 EXPORT EXCEL
  const exportToExcel = () => {
    if (!reportData.length) return;

    const flattenObject = (obj, parent = "", res = {}) => {
      for (let key in obj) {
        const value = obj[key];
        const newKey = parent ? `${parent}_${key}` : key;

        if (value && typeof value === "object" && !Array.isArray(value)) {
          flattenObject(value, newKey, res);
        } else {
          res[newKey] = value ?? "";
        }
      }
      return res;
    };

    const flatData = reportData.map(item => flattenObject(item));
    const worksheet = XLSX.utils.json_to_sheet(flatData);

    worksheet["!cols"] = Object.keys(flatData[0]).map(key => ({
      wch: Math.max(key.length, 12),
    }));

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, reportType);

    const buffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const file = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    saveAs(
      file,
      `summary_${reportType}_${Date.now()}.xlsx`
    );
  };

  return (
    <div className="summary-container">
      {loading && <Loder duration={0.8} />}

      <h4 className="summary-title">
        Summary {reportType?.toUpperCase()}
      </h4>

      {/* FILTER */}
      <div className="summary-filter">

  {reportType === "ceklist" ? (
  <>
    <div>
      <label>Month</label>
      <input
        type="month"
        value={month}
        onChange={e => setMonth(e.target.value)}
        disabled={loading}
      />
    </div>
    <div></div>
    <div></div>
  </>
)  : (
    <>
      <div>
        <label>Start Date</label>
        <input
          type="date"
          value={startDate}
          onChange={e => setStartDate(e.target.value)}
          disabled={loading}
        />
      </div>

      <div>
        <label>End Date</label>
        <input
          type="date"
          value={endDate}
          onChange={e => setEndDate(e.target.value)}
          disabled={loading}
        />
      </div>

      <button
        className="btn btn-primary"
        onClick={fetchByRange}
        disabled={loading}
      >
        <i className="bi bi-search"></i>
      </button>
    </>
  )}
  <div></div>
  <button
    className="btn btn-success"
    onClick={exportToExcel}
    disabled={!reportData.length || loading}
  >
    <i className="bi bi-file-earmark-excel"></i>
  </button>

</div>


      {/* ERROR */}
      {error && (
        <div className="alert alert-danger text-center">{error}</div>
      )}

     {/* TABLE */}
{!loading && reportData.length > 0 && (
  <div className="summary-table">

    {reportType === "ceklist" ? (
      <Table_report_list
        columns={columns}
        data={reportData}
      />
    ) : (
      <TableMultiHeader data={reportData} />
    )}

  </div>
)}


      {!loading && !reportData.length && (
        <div className="text-muted text-center mt-3">
          Tidak ada data
        </div>
      )}
    </div>
  );
}
