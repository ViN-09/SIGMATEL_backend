import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import FormIssue from "../component/FormIssue";
import Swal from "sweetalert2";
import { fetchIssues, updateIssue } from "../auth.js";
import "./Issue.css";

const Issue = () => {
  const [issues, setIssues] = useState([]);
  const [selectedIssue, setSelectedIssue] = useState(null);

  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [filterStatus, setFilterStatus] = useState("");
  const [filterProfile, setFilterProfile] = useState("");

  // ======================================================
  // FETCH DATA ISSUE
  // ======================================================
  const getIssues = async () => {
    try {
      setLoading(true);
      const data = await fetchIssues();
      setIssues(data);
    } catch (err) {
      setError(err.message);
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "error",
        title: err.message,
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getIssues();
  }, []);

  // ======================================================
  // UPDATE STATUS ISSUE
  // ======================================================
  const handleUpdateIssueStatus = async () => {
    if (!selectedIssue) return;
    try {
      await updateIssue(selectedIssue);

      // Update lokal state
      setIssues((prev) =>
        prev.map((i) =>
          i.id === selectedIssue.id
            ? { ...i, status: selectedIssue.status, keterangan: selectedIssue.keterangan }
            : i
        )
      );

      setShowEditModal(false);

      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: "Status issue berhasil diperbarui",
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
      });
    } catch (err) {
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "error",
        title: err.message,
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
      });
    }
  };

  // ======================================================
  // FILTER DATA
  // ======================================================
  const filteredIssues = issues.filter((item) => {
    return (
      (filterStatus === "" ||
        item.status.toLowerCase() === filterStatus.toLowerCase()) &&
      (filterProfile === "" ||
        item.profile_affected
          .toLowerCase()
          .includes(filterProfile.toLowerCase()))
    );
  });

  // ======================================================
  // RENDER
  // ======================================================
  return (
    <div className="tsel-page-container">
      <h1 className="tsel-page-title">Issue TTC Teling</h1>

      {/* Filter */}
      <div className="issue-section-filter">
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="tsel-select"
        >
          <option value="">-- Status --</option>
          <option value="Open">Open</option>
          <option value="Onprogress">Onprogress</option>
          <option value="Closed">Closed</option>
        </select>

        <input
          type="text"
          placeholder="Profile Affected"
          value={filterProfile}
          onChange={(e) => setFilterProfile(e.target.value)}
          className="tsel-input"
        />

        <button
          className="tsel-btn-rest"
          onClick={() => {
            setFilterStatus("");
            setFilterProfile("");
          }}
        >
          <i className="bi bi-arrow-clockwise"></i>
        </button>

        {/* ADD BUTTON → OPEN MODAL */}
        <button
          className="tsel-btn tsel-add-btn"
          onClick={() => setShowAddModal(true)}
        >
          <i className="bi bi-plus"></i>
        </button>
      </div>

      {/* TABLE */}
      <table className="tsel-table">
        <thead>
          <tr>
            <th>No</th>
            <th>Issue</th>
            <th>Analisa</th>
            <th>Risk</th>
            <th>Solution</th>
            <th>Keterangan</th>
            <th>Profile Affected</th>
            <th>Status</th>
            <th>Aksi</th>
          </tr>
        </thead>

        <tbody>
          {filteredIssues.length === 0 ? (
            <tr>
              <td colSpan="9" className="tsel-empty">
                Belum ada issue.
              </td>
            </tr>
          ) : (
            filteredIssues.map((item, i) => (
              <tr key={item.id}>
                <td>{i + 1}</td>
                <td>{item.issue}</td>
                <td>{item.analisa}</td>
                <td>{item.risk}</td>
                <td>{item.solution}</td>
                <td>{item.keterangan}</td>
                <td>{item.profile_affected}</td>
                <td>
                  <span
                    className={`tsel-status tsel-${item.status.toLowerCase()}`}
                  >
                    {item.status}
                  </span>
                </td>

                <td>
                  <button
                    className="tsel-btn-icon"
                    onClick={() => {
                      setSelectedIssue(item);
                      setShowEditModal(true);
                    }}
                  >
                    <i className="bi bi-pencil-square"></i>
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* MODAL EDIT */}
      {showEditModal &&
        selectedIssue &&
        createPortal(
          <div className="tsel-modal">
            <div className="tsel-modal-content">
              <h2 className="tsel-title">Edit Issue</h2>

              <label>Status</label>
              <select
                className="tsel-select"
                value={selectedIssue.status}
                onChange={(e) =>
                  setSelectedIssue({
                    ...selectedIssue,
                    status: e.target.value,
                  })
                }
              >
                <option value="Open">Open</option>
                <option value="Onprogress">Onprogress</option>
                <option value="Closed">Closed</option>
              </select>

              <label style={{ marginTop: "10px" }}>Keterangan</label>
              <textarea
                className="tsel-textarea"
                rows={3}
                value={selectedIssue.keterangan || ""}
                onChange={(e) =>
                  setSelectedIssue({
                    ...selectedIssue,
                    keterangan: e.target.value,
                  })
                }
              ></textarea>

              <div className="tsel-modal-actions">
                <button className="tsel-btn" onClick={handleUpdateIssueStatus}>
                  Simpan
                </button>
                <button
                  className="tsel-btn"
                  onClick={() => setShowEditModal(false)}
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}

      {/* MODAL ADD ISSUE */}
      {showAddModal &&
        createPortal(
          <div className="tsel-modal">
            <div className="tsel-modal-content-add">
              <FormIssue
                onClose={() => setShowAddModal(false)}
                onSuccess={() => {
                  setShowAddModal(false);
                  getIssues(); // Refresh list
                }}
              />
            </div>
          </div>,
          document.body
        )}
    </div>
  );
};

export default Issue;
