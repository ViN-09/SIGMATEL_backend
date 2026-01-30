import React, { useEffect, useState, useRef } from "react";
import ReactDOM from "react-dom";
import toast, { Toaster } from "react-hot-toast"; // ✅ import toast
import "./Report.css";
import { fetchReportDetail } from "../auth";
import RenderReportModel from "./ReportResolver";

export default function Report({ open, reportId, reportType = "-", onClose }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [reportData, setReportData] = useState(null);

  const ttc = sessionStorage.getItem("ttc");
  const contentRef = useRef(null);

  /* ================= ESC TO CLOSE ================= */
  useEffect(() => {
    if (!open) return;
    const esc = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [open, onClose]);

  /* ================= FETCH REPORT ================= */
  useEffect(() => {
    if (!open || !reportId) return;

    setLoading(true);
    setError(null);
    setReportData(null);

    fetchReportDetail(reportId, reportType)
      .then((res) => setReportData(res?.data || null))
      .catch((err) =>
        setError(err?.message || "Gagal mengambil data report")
      )
      .finally(() => setLoading(false));
  }, [open, reportId, reportType]);

  /* ================= COPY FUNCTION ================= */
  const handleCopy = () => {
    if (!contentRef.current) return;

    const text = contentRef.current.innerText;

    navigator.clipboard
      .writeText(text)
      .then(() => {
        toast.success("Report berhasil disalin!"); // ✅ toast success
        setTimeout(() => onClose(), 800); // ✅ tutup popup setelah 0.8s
      })
      .catch(() => toast.error("Gagal menyalin report."));
  };

  if (!open) return null;

  return ReactDOM.createPortal(
    <>
      {/* ===== TOASTER ===== */}
      <Toaster position="top-right" reverseOrder={false} />

      <div className="report-overlay" onClick={onClose}></div>

      <div className="report-popup">
        {/* ===== HEADER ===== */}
        <div className="report-header">
          <h3>Detail Report</h3>
          <button className="btn-copy" onClick={handleCopy}>
             <i className="bi bi-clipboard"></i>
          </button>
        </div>

        {/* ===== BODY ===== */}
        <div className="report-body">
          <div className="report-row">
            <span>No Report</span>
            <strong>: {reportId}</strong>
          </div>

          <div className="report-row">
            <span>Jenis</span>
            <strong>: {reportType}</strong>
          </div>

          {loading && <div className="report-loading">Loading report...</div>}
          {error && <div className="report-error">{error}</div>}

          <div className="report-content" ref={contentRef}>
            <RenderReportModel
              ttc={ttc}
              reportType={reportType}
              data={reportData}
              loading={loading}
              error={error}
            />
          </div>
        </div>
      </div>
    </>,
    document.body
  );
}
