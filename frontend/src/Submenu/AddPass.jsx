import React from "react";
import ReactDOM from "react-dom";
import Swal from "sweetalert2";
import "./AddPass.css";

export default function AddPass({ onClose }) {
    const host = sessionStorage.getItem("host");
    const ttc = sessionStorage.getItem("ttc");
    const userinfo = JSON.parse(sessionStorage.getItem("userinfo")); // data user login

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData(e.target);

        try {
            const response = await fetch(
                `${host}/api/${ttc}/bank_password/add`,
                {
                    method: "POST",
                    body: formData,
                }
            );

            const result = await response.json();

            if (result.status === "success") {
                onClose();
                Swal.fire({
                    toast: true,
                    position: "top-end",
                    icon: "success",
                    title: result.pesan || "Data berhasil disimpan!",
                    showConfirmButton: false,
                    timer: 2000,
                    timerProgressBar: true,
                });
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Gagal ❌",
                    text: result.pesan || "Terjadi kesalahan",
                });
            }
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Error ❌",
                text: error.message,
            });
        }
    };

    return ReactDOM.createPortal(
        <div className="overlay">
            <div className="overlay-content">
                <h3>Tambah Password Baru 🚀</h3>

                <form className="addpass-form" onSubmit={handleSubmit}>
                    {/* hidden user_id */}
                    <input
                        type="hidden"
                        name="user_id"
                        value={userinfo?.id || ""}
                    />

                    <div className="form-group mb-3">
                        <label htmlFor="peruntukan" className="form-label">
                            Peruntukan
                        </label>
                        <input
                            type="text"
                            id="peruntukan"
                            name="peruntukan"
                            className="form-control"
                            placeholder="Masukkan peruntukan"
                            required
                        />
                    </div>

                    <div className="form-group mb-3">
                        <label htmlFor="username" className="form-label">
                            Username / ID
                        </label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            className="form-control"
                            placeholder="Masukkan username atau ID"
                            required
                        />
                    </div>

                    <div className="form-group mb-3">
                        <label htmlFor="password" className="form-label">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            className="form-control"
                            placeholder="Masukkan password"
                            required
                        />
                    </div>

                    <div className="form-group mb-3">
                        <label htmlFor="tipe" className="form-label">
                            Tipe
                        </label>
                        <input
                            type="text"
                            id="tipe"
                            name="tipe"
                            className="form-control"
                            placeholder="Masukkan tipe"
                        />
                    </div>

                    <div className="form-group mb-3">
                        <label htmlFor="keterangan" className="form-label">
                            Keterangan
                        </label>
                        <textarea
                            id="keterangan"
                            name="keterangan"
                            className="form-control"
                            placeholder="Tambahkan keterangan"
                        ></textarea>
                    </div>

                    <div className="d-flex justify-content-end gap-2 mt-3">
                        <button
                            className="btn btn-secondary"
                            type="button"
                            onClick={onClose}
                        >
                            Batal
                        </button>
                        <button className="btn btn-primary" type="submit">
                            Simpan
                        </button>
                    </div>
                </form>
            </div>
        </div>,
        document.body
    );
}
