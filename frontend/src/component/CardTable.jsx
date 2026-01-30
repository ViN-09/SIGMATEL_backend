import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import PasswordCard from "./Passwordcard";

/**
 * @param {string} title 
 * @param {Array<Object>} data
 * @param {Array<string>} columns
 * @param {function} onDelete → update local state parent
 * @param {function} onUpdate → update local state parent
 */
export default function CardTable({ title, data = [], columns }) {
  if (!data || data.length === 0) {
    return (
      <div className="card shadow-sm h-100 w-100" style={{ borderRadius: 12, overflow: "hidden" }}>
        <div className="card-body d-flex flex-column align-items-center justify-content-center" style={{ padding: 10 }}>
          <p className="text-muted">No data available</p>
        </div>
      </div>
    );
  }

  const cols = columns || Object.keys(data[0]);

  return (
    <div className="card shadow-sm h-100 w-100" style={{ borderRadius: 12, overflow: "auto" }}>
      <div className="card-body" style={{ padding: 10 }}>
        <div style={{ width: "100%", overflowX: "auto" }}>
          <table className="table-hover mb-0">
            <thead className="table-light">
              <tr>
                {cols.map((col) => (
                  <th key={col}>{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((row, idx) => (
                <tr key={idx}>
                  {cols.map((col) => (
                    <td key={col}>{row[col]}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/**
 * PlainTable → sama kayak CardTable tapi tanpa card wrapper
 */
export function PlainTable({ title, data = [], columns }) {
  const [modalData, setModalData] = useState(null);
  const host = sessionStorage.getItem("host");

  if (!data || data.length === 0) {
    return (
      <div style={{ padding: 10, textAlign: "center" }}>
        <p className="text-muted">No data available</p>
      </div>
    );
  }

  // kolom yang ingin tampil di tabel utama
  const hiddenCols = ["signature", "dukumentasi_in", "dukumentasi_out", "id"];
  const cols = columns || Object.keys(data[0]).filter((c) => !hiddenCols.includes(c));

  const handleRowClick = (row) => setModalData(row);
  const handleCloseModal = () => setModalData(null);

  // Modal component
  const Modal = ({ data, onClose }) => {
    return ReactDOM.createPortal(
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          backgroundColor: "rgba(0,0,0,0.5)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 9999
        }}
        onClick={onClose}
      >
        <div
          style={{
            background: "white",
            padding: 20,
            borderRadius: 8,
            minWidth: 300,
            maxWidth: "80%",
            maxHeight: "80%",
            overflowY: "auto",
            boxShadow: "0 4px 15px rgba(0,0,0,0.3)"
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <h5 style={{ marginBottom: 15 }}>Keterangan Tamu</h5>
          <table className="table table-bordered">
            <tbody>
              {Object.entries(data).map(([key, value]) => (
                <tr key={key}>
                  <th style={{ width: "30%" }}>{key}</th>
                  <td>
                    {key === "signature" && value ? (
                      <img
                        src={`${host}/storage/signatures/${value}`}
                        alt="signature"
                        style={{ maxWidth: "150px", maxHeight: "100px" }}
                      />
                    ) : key === "dukumentasi_in" && value ? (
                      <img
                        src={`${host}/storage/visitors/${value}`}
                        alt="dukumentasi_in"
                        style={{ maxWidth: "500px", maxHeight: "auto" }}
                      />
                    ) : key === "dukumentasi_out" && value ? (
                      <img
                        src={`${host}/storage/visitors/${value}`}
                        alt="dukumentasi_out"
                        style={{ maxWidth: "500px", maxHeight: "auto" }}
                      />
                    ) : (
                      value?.toString()
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ marginTop: 10, textAlign: "right" }}>
            <button
              onClick={onClose}
              style={{
                padding: "5px 10px",
                border: "1px solid #ccc",
                borderRadius: 4,
                cursor: "pointer"
              }}
            >
              Close
            </button>
          </div>
        </div>
      </div>,
      document.body
    );
  };

  return (
    <>
      <div style={{ width: "100%", overflowX: "auto" }}>
        {title && <h5 className="mb-3">{title}</h5>}

        <table className="">
          <thead className="table-light">
            <tr>
              <th>No</th> {/* kolom No paling kiri */}
              {cols.map((col) => (
                <th key={col}>{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, idx) => (
              <tr
                key={idx}
                onClick={() => handleRowClick(row)}
                style={{ cursor: "pointer" }}
              >
                <td>{idx + 1}</td> {/* nomor otomatis */}
                {cols.map((col) => (
                  <td key={col}>{row[col]}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modalData && <Modal data={modalData} onClose={handleCloseModal} />}
    </>
  );
}







export function PlainTableCrud({ title, data = [], columns, onDelete, onUpdate }) {
  const [editRowId, setEditRowId] = useState(null);
  const [editValues, setEditValues] = useState({});
  const [showPasswordCard, setShowPasswordCard] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const host = sessionStorage.getItem("host") || "";
  const ttc = sessionStorage.getItem("ttc") || "";
  const userinfo = JSON.parse(sessionStorage.getItem("userinfo") || "{}");
  const apiUrl = `${host}/api/${ttc}/bank_password`;

  if (!data || data.length === 0) {
    return (
      <div style={{ padding: 10, textAlign: "center" }}>
        <p className="text-muted">No data available</p>
      </div>
    );
  }

  // Filter kolom agar tidak tampilkan id & password
  const cols = (columns || Object.keys(data[0])).filter(
    (c) => c !== "id" && c !== "password"
  );

  const handleChange = (e, col) =>
    setEditValues((prev) => ({ ...prev, [col]: e.target.value }));

  /** === UPDATE === */
  const handleSave = async (id) => {
    const originalRow = data.find((r) => r.id === id);
    if (!originalRow) return alert("Data not found");

    const updatedRow = { ...originalRow, ...editValues };

    // Hapus user_id dari versi lokal
    const updatedRowClean = { ...updatedRow };
    delete updatedRowClean.user_id;

    // Payload API tetap kirim user_id
    const payload = {
      peruntukan: updatedRow.peruntukan,
      username: updatedRow.username,
      password: updatedRow.password || undefined,
      tipe: updatedRow.tipe,
      keterangan: updatedRow.keterangan,
      user_id: userinfo.id, // tetap dikirim ke API
    };

    try {
      const res = await fetch(`${apiUrl}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      if (result.status === "success") {
        onUpdate?.(id, updatedRowClean); // update tampilan tanpa user_id
        setEditRowId(null);
        setEditValues({});
      } else {
        alert("Update failed: " + result.pesan);
      }
    } catch (err) {
      console.error(err);
      alert("Update failed, check console");
    }
  };

  /** === DELETE === */
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    try {
      const res = await fetch(`${apiUrl}/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userinfo.id }),
      });
      const result = await res.json();
      if (result.status === "success") onDelete?.(id);
      else alert("Delete failed: " + result.pesan);
    } catch (err) {
      console.error(err);
      alert("Delete failed, check console");
    }
  };

  return (
    <div style={{ width: "100%", overflowX: "auto" }}>
      {title && <h5 className="mb-3">{title}</h5>}

      <table className="">
        <thead className="table-light">
          <tr>
            {cols.map((col) => (
              <th key={col}>{col}</th>
            ))}
            <th>Password</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {data.map((row) => {
            const isEditing = editRowId === row.id;
            return (
              <tr key={row.id}>
                {cols.map((col) => (
                  <td key={col}>
                    {isEditing ? (
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        value={editValues[col] ?? row[col] ?? ""}
                        onChange={(e) => handleChange(e, col)}
                      />
                    ) : (
                      row[col]
                    )}
                  </td>
                ))}

                <td>
                  {isEditing ? (
                    <input
                      type="password"
                      className="form-control form-control-sm"
                      value={editValues.password ?? row.password ?? ""}
                      onChange={(e) => handleChange(e, "password")}
                    />
                  ) : (
                    <button
                      className="btn btn-sm btn-outline-primary"
                      onClick={() => {
                        if (!row.id) return alert("ID tidak valid!");
                        setSelectedId(row.id);
                        setShowPasswordCard(true);
                      }}
                    >
                      <i className="bi bi-eye"></i>
                    </button>
                  )}
                </td>

                <td>
                  {isEditing ? (
                    <div className="d-flex gap-1 justify-content-center">
                      <button
                        className="btn btn-sm btn-outline-success"
                        onClick={() => handleSave(row.id)}
                      >
                        <i className="bi bi-check-lg"></i>
                      </button>
                      <button
                        className="btn btn-sm btn-outline-secondary"
                        onClick={() => setEditRowId(null)}
                      >
                        <i className="bi bi-x-lg"></i>
                      </button>
                    </div>
                  ) : (
                    <div className="d-flex gap-1 justify-content-center">
                      <button
                        className="btn btn-sm btn-outline-warning"
                        onClick={() => {
                          setEditRowId(row.id);
                          setEditValues(row);
                        }}
                      >
                        <i className="bi bi-pencil"></i>
                      </button>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleDelete(row.id)}
                      >
                        <i className="bi bi-trash"></i>
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {showPasswordCard && (
        <PasswordCard
          id={selectedId}
          onClose={() => setShowPasswordCard(false)}
        />
      )}
    </div>
  );
}


export function TableDapot({ title, data = [], columns, onEdit, onAdd, onDelete, hideColumns = [] }) {
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState("");
  const [contextMenu, setContextMenu] = useState(null);

  // HANDLE DATA KOSONG
  if (!Array.isArray(data) || data.length === 0) {
    return (
      <div style={{ padding: 10, textAlign: "center" }}>
        <p className="text-muted">Data kosong atau tidak valid.</p>
      </div>
    );
  }

  // DETEKSI KOLOM DARI DATA
  const detectedCols = new Set();
  data.forEach((row) => {
    if (row && typeof row === "object") {
      Object.keys(row).forEach((key) => detectedCols.add(key));
    }
  });

  let cols = columns?.length ? columns : Array.from(detectedCols);
  cols = cols.filter(col => !hideColumns.includes(col));

  if (cols.length === 0) {
    return (
      <div style={{ padding: 10, textAlign: "center" }}>
        <p className="text-muted">Tidak ada kolom untuk ditampilkan.</p>
      </div>
    );
  }

  // MODAL DETAIL
  const handleShow = (value) => {
    setModalContent(value);
    setShowModal(true);
  };
  const handleClose = () => setShowModal(false);

  // CONTEXT MENU
  const handleContextMenu = (e, row) => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenu({
      x: e.pageX,
      y: e.pageY,
      row: row || null,
    });
  };

  const handleEmptyAreaContextMenu = (e) => {
    e.preventDefault();
    setContextMenu({
      x: e.pageX,
      y: e.pageY,
      row: null,
    });
  };

  useEffect(() => {
    const closeMenu = () => setContextMenu(null);
    window.addEventListener("click", closeMenu);
    return () => window.removeEventListener("click", closeMenu);
  }, []);

  const handleEdit = () => {
    if (onEdit && contextMenu?.row) {
      onEdit(contextMenu.row);
    }
    setContextMenu(null);
  };

  const handleAdd = () => {
    if (onAdd) onAdd();
    setContextMenu(null);
  };

  const handleDelete = () => {
    if (onDelete && contextMenu?.row) {
      onDelete(contextMenu.row);
    } else if (contextMenu?.row) {
      if (window.confirm("Yakin hapus data ini?")) {
        alert("Deleted ID: " + contextMenu.row?.id ?? "N/A");
      }
    }
    setContextMenu(null);
  };

  return (
    <>
      <div
        style={{ width: "100%", overflowX: "auto" }}
        className="plain-table-crud"
        onContextMenu={handleEmptyAreaContextMenu}
      >
        {title && <h5 className="mb-3">{title}</h5>}

        <table style={{ borderRadius: "12px", overflow: "hidden" }}>
          <thead
            className="table-light"
            style={{
              backgroundColor: "var(--accent--primary)",
              color: "black",
            }}
          >
            <tr>
              {cols.map((key) => (
                <th key={key} style={{ textTransform: "capitalize", fontWeight: "600" }}>
                  {key}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {data.map((row, idx) => (
              <tr
                key={row?.id || idx}
                id={row?.id || ""}
                onContextMenu={(e) => handleContextMenu(e, row)}
                style={{ cursor: "context-menu" }}
              >
                {cols.map((key) => (
                  <td
                    key={key}
                    style={{
                      borderBottom: "1px solid #ececec",
                      padding: "8px 12px",
                      fontSize: "13px",
                      verticalAlign: "middle",
                    }}
                    onDoubleClick={() => onEdit && row && onEdit(row)}
                  >
                    {["List_NE", "listNE", "Address"].includes(key) && row?.[key] ? (
                      <button
                        className="btn btn-sm btn-outline-primary"
                        onClick={() => handleShow(row[key])}
                        title="Lihat Detail"
                      >
                        <i className="bi bi-eye"></i>
                      </button>
                    ) : (
                      String(row?.[key] ?? "-")
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* CONTEXT MENU */}
      {contextMenu &&
        ReactDOM.createPortal(
          <div
            style={{
              position: "absolute",
              top: contextMenu.y,
              left: contextMenu.x,
              background: "white",
              border: "1px solid #ccc",
              borderRadius: "8px",
              boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
              zIndex: 3000,
              overflow: "hidden",
              animation: "fadeInScale 0.15s ease",
            }}
          >
            {contextMenu.row ? (
              <>
                <div onClick={handleEdit} style={menuStyle("#333")}>
                  ✏️ Edit
                </div>
                <div onClick={handleAdd} style={menuStyle("#28a745")}>
                  ➕ Add New
                </div>
                <div onClick={handleDelete} style={menuStyle("crimson")}>
                  🗑️ Delete
                </div>
              </>
            ) : (
              <div onClick={handleAdd} style={menuStyle("#28a745")}>
                ➕ Add New
              </div>
            )}
          </div>,
          document.body
        )}

      {/* MODAL */}
      {showModal &&
        ReactDOM.createPortal(
          <div
            style={{
              position: "fixed",
              inset: 0,
              backdropFilter: "blur(8px)",
              backgroundColor: "rgba(0,0,0,0.25)",
              zIndex: 2000,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              animation: "fadeInBg 0.25s ease",
            }}
            onClick={handleClose}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              style={{
                background: "rgba(255, 255, 255, 0.85)",
                borderRadius: "18px",
                width: "min(90%, 700px)",
                overflow: "hidden",
                animation: "fadeInScale 0.3s ease",
              }}
            >
              <div style={{
                background: "var(--accent--primary)",
                color: "white",
                padding: "12px 18px",
                display: "flex",
                justifyContent: "space-between",
              }}>
                <span>Detail List_NE</span>
                <button className="btn-close" style={{ filter: "invert(1)" }} onClick={handleClose}></button>
              </div>

              <div style={{
                padding: "20px",
                maxHeight: "65vh",
                overflowY: "auto",
                fontFamily: "monospace",
                whiteSpace: "pre-wrap",
              }}>
                {modalContent}
              </div>

              <div style={{ padding: "10px 20px", textAlign: "right" }}>
                <button
                  className="btn"
                  onClick={handleClose}
                  style={{
                    backgroundColor: "var(--accent--primary)",
                    color: "white",
                    borderRadius: "10px",
                    padding: "6px 16px",
                  }}
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}

// Helper untuk style context menu
const menuStyle = (color) => ({
  padding: "8px 16px",
  cursor: "pointer",
  borderBottom: "1px solid #eee",
  color: color,
  transition: "background 0.2s",
  onMouseEnter: (e) => (e.currentTarget.style.background = "#f0f0f0"),
  onMouseLeave: (e) => (e.currentTarget.style.background = "white"),
});


