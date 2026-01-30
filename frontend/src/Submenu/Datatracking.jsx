import React, { useState, useEffect } from "react";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./Datatracking.css";
import Loader from "../component/Loder";
import TableTracking from "../component/TableTracking.jsx";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export default function Datatracking() {
  const host = sessionStorage.getItem("host");
  const ttc = sessionStorage.getItem("ttc");

  const [date, setDate] = useState(() => {
    const today = new Date();
    return today
      .toLocaleDateString("id-ID", {
        timeZone: "Asia/Makassar",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      })
      .split("/")
      .reverse()
      .join("-"); 
  });

  const [period, setPeriod] = useState("all");
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState([]); // langsung pakai data mentah dari API

  // helper: cek numeric
  const isNumeric = (val) => {
    if (val === null || val === undefined) return false;
    return /^-?\d+(\.\d+)?$/.test(String(val).trim());
  };

  // fetch data dari API
  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${host}/api/${ttc}/data_potensi/puedashboard/${date}/${period}`
      );
      const json = await response.json();

      if (json.length > 0) {
        // optional: format numeric PUE / angka
        const formatted = json.map((item) => {
          const newItem = { ...item };
          Object.keys(newItem).forEach((k) => {
            const val = newItem[k];
            if (val === null || val === undefined) {
              newItem[k] = "-";
            } else if (isNumeric(val)) {
              newItem[k] = k.toLowerCase() === "pue"
                ? parseFloat(val).toFixed(3)
                : parseFloat(val).toFixed(2);
            }
          });
          return newItem;
        });

        setReportData(formatted);
      } else {
        setReportData([]);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setReportData([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchData();
  };

  const handleExportExcel = () => {
    if (reportData.length === 0) {
      alert("Tidak ada data untuk diexport!");
      return;
    }

    const worksheet = XLSX.utils.json_to_sheet(reportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data Monitoring");

    const filename = `data_tracking_${date}_${period}.xlsx`;
    XLSX.writeFile(workbook, filename);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div id="main-parent-tracking">
      {loading && <Loader duration={0.8} color="#E60012" />}

      <div id="main-parent-tracking-header">
        <div id="main-parent-tracking-header-controler">
          <div id="main-parent-tracking-header-controler-search">
            <form className="search-form" onSubmit={handleSearch}>
              <label htmlFor="search-date">Pilih Tanggal:</label>
              <input
                type="date"
                id="search-date"
                name="search-date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />

              <select
                id="search-period"
                name="search-period"
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
              >
                <option value="3hour">Per-3 Jam</option>
                <option value="daily">Daily</option>
                <option value="all">Semua Data</option>
                <option value="perhour">Per-Jam</option>
              </select>

              <button id="cari_tanggal" type="submit">
                <i className="bi bi-search"></i>
              </button>
            </form>
          </div>

          <div id="main-parent-tracking-header-controler-export">
            <button id="export_tanggal" type="button" onClick={handleExportExcel}>
              <i className="bi bi-download"></i>
            </button>
          </div>
        </div>
      </div>

      <div id="main-parent-tracking-header-body">
        <TableTracking data={reportData} />
      </div>
    </div>
  );
}
