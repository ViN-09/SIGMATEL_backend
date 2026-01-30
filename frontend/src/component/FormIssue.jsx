import React, { useState } from "react";
import Swal from "sweetalert2";
import { addIssue } from "../auth.js"; // ← pakai auth.js
import "./FormIssue.css";

const FormIssue = ({ onClose, onSuccess }) => {
  const [form, setForm] = useState({
    profile_affected: "",
    issue: "",
    analisa: "",
    risk: "",
    solution: "",
    keterangan: "",
    status: "Open",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await addIssue(form); // ← pakai fungsi auth.js

      Swal.fire({
        toast: true,
        icon: "success",
        title: "Issue berhasil ditambahkan",
        position: "top-end",
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
      });

      // Tutup popup + trigger reload
      onSuccess && onSuccess();
    } catch (error) {
      Swal.fire({
        toast: true,
        icon: "error",
        title: error.message,
        position: "top-end",
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="tsel-issue-container">
      <div className="tsel-card">
        <h2 className="tsel-title">Form Input Issue</h2>

        <form onSubmit={handleSubmit} className="tsel-form">
          <div className="tsel-form-group">
            <label className="tsel-label">Profile Affected</label>
            <select
              name="profile_affected"
              value={form.profile_affected}
              onChange={handleChange}
              className="tsel-select"
            >
              <option value="">-- Pilih Profile --</option>
              <option value="Building / Sipil">Building / Sipil</option>
              <option value="Power System">Power System</option>
              <option value="Cooling System">Cooling System</option>
              <option value="Security & Safety">Security & Safety</option>
            </select>
          </div>

          {["issue", "analisa", "risk", "solution", "keterangan"].map((field) => (
            <div className="tsel-form-group" key={field}>
              <label className="tsel-label">{field.charAt(0).toUpperCase() + field.slice(1)}</label>
              <textarea
                name={field}
                value={form[field]}
                onChange={handleChange}
                className="tsel-textarea"
              />
            </div>
          ))}

          <div className="tsel-form-group">
            <label className="tsel-label">Status</label>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="tsel-select"
            >
              <option value="Open">Open</option>
              <option value="Onprogress">Onprogress</option>
              <option value="Closed">Closed</option>
            </select>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <button
              type="button"
              className="tsel-btn"
              onClick={onClose}
              disabled={loading}
            >
              Kembali
            </button>

            <button type="submit" className="tsel-btn" disabled={loading}>
              {loading ? "Menyimpan..." : "Simpan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FormIssue;
