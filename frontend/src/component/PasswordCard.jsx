import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import Swal from "sweetalert2";
import "./PasswordCard.css";

export default function PasswordCard({ id, onClose }) {
    const host = sessionStorage.getItem("host");
    const ttc = sessionStorage.getItem("ttc");

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) return;
        const fetchData = async () => {
            try {
                const res = await fetch(
                    `${host}/api/${ttc}/bank_password/${id}/decrypt`
                );
                const result = await res.json();
                if (result.status === "success") {
                    setData(result);
                } else {
                    Swal.fire({
                        icon: "error",
                        title: "Gagal ❌",
                        text: result.pesan || "Data tidak ditemukan",
                    });
                }
            } catch (error) {
                Swal.fire({
                    icon: "error",
                    title: "Error ❌",
                    text: error.message,
                });
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    return ReactDOM.createPortal(
        <div className="overlay">
            <div className="overlay-content password-card">
                <h3>Detail Password 🔑</h3>

                {loading ? (
                    <p>Sedang memuat...</p>
                ) : data ? (
                    <div className="card-body">
                        <div className="mb-2">
                            Peruntukan: <strong>{data.peruntukan}</strong>
                        </div>
                        <div className="mb-2">
                            Username: <strong>{data.username}</strong>
                        </div>
                        <div className="mb-2">
                            Password: <strong className="password-box">{data.password}</strong>
                        </div>
                        {data.tipe && (
                            <div className="mb-2">
                                Tipe: <strong>{data.tipe}</strong>
                            </div>
                        )}
                        {data.keterangan && (
                            <div className="mb-2">
                                Keterangan: <strong>{data.keterangan}</strong>
                            </div>
                        )}
                    </div>

                ) : (
                    <p>Tidak ada data.</p>
                )}

                <div className="d-flex justify-content-end gap-2 mt-3">
                    <button className="btn btn-secondary" onClick={onClose}>
                        Tutup
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
}
