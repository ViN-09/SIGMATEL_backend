import React, { useState, useEffect } from "react";
import "./Bukutamu.css";
import { PlainTable } from "../component/CardTable";
import Swal from "sweetalert2";
import { fetchRecentVisitors } from "../auth";
import Loder from "../component/Loder";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

function Bukutamu() {
    const [bukuTamu, setBukuTamu] = useState([]);
    const [month, setMonth] = useState("");
    const [loading, setLoading] = useState(false);

    const handleExport = () => {
        if (!bukuTamu || bukuTamu.length === 0) {
            Swal.fire("Info", "Tidak ada data untuk diexport", "info");
            return;
        }

        // Mapping data sesuai kebutuhan Excel
        const exportData = bukuTamu.map((item, index) => ({
            No: index + 1,
            Nama: item.name,
            Perusahaan: item.company,
            "No. Telepon": item.phone,
            Aktivitas: item.activity,
            "Ruang Kerja": item.ruang_kerja,
            Status: item.status,
            "Waktu Masuk": item.created_at
                ? new Date(item.created_at).toLocaleString("id-ID")
                : "-",
            "Waktu Keluar": item.updated_at
                ? new Date(item.updated_at).toLocaleString("id-ID")
                : "-",
        }));

        // Buat worksheet
        const worksheet = XLSX.utils.json_to_sheet(exportData);

        // Buat workbook
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Buku Tamu");

        // Generate file
        const excelBuffer = XLSX.write(workbook, {
            bookType: "xlsx",
            type: "array",
        });

        // Simpan file
        const blob = new Blob([excelBuffer], {
            type:
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });

        const fileName = month
            ? `Buku_Tamu_${month}.xlsx`
            : "Buku_Tamu_Bulan_Sekarang.xlsx";

        saveAs(blob, fileName);
    };


    const loadData = async (selectedMonth = null) => {
        try {
            setLoading(true);
            const data = await fetchRecentVisitors(selectedMonth);
            setBukuTamu(data);
        } catch (err) {
            // Swal.fire({
            //     icon: "error",
            //     title: "Error",
            //     text: err.message || "Server error",
            // });
        } finally {
            setLoading(false);
        }
    };

    // 🔹 FIRST LOAD
    useEffect(() => {
        loadData();
    }, []);

    // 🔹 AUTO LOAD SAAT MONTH DIPILIH
    useEffect(() => {
        if (!month) return;

        const debounce = setTimeout(() => {
            loadData(month);
        }, 500);

        return () => clearTimeout(debounce);
    }, [month]);

    const handleReset = () => {
        setMonth("");
        loadData(); // backend otomatis pakai bulan sekarang
    };

    return (
        <div className="Buku-tamu">
            {loading && <Loder duration={0.8} />}

            <div className="Buku-tamu-search-box">
                <div className="date-selector">
                    <input
                        type="month"
                        value={month}
                        onChange={(e) => setMonth(e.target.value)}
                        disabled={loading}
                    />

                    <button
                        className="btn btn-secondary btn-sm"
                        title="Reset"
                        onClick={handleReset}
                        disabled={loading}
                    >
                        <i className="bi bi-arrow-clockwise"></i>
                    </button>
                </div>

                <div className="export-selector">
                    <button
                        className="btn btn-success btn-sm"
                        title="Export"
                        onClick={handleExport}
                        disabled={loading}
                    >
                        <i className="bi bi-file-earmark-excel"></i>
                    </button>

                </div>
            </div>

            <div className="Buku-tamu-content">
                <PlainTable data={bukuTamu} />
            </div>
        </div>
    );
}

export default Bukutamu;
