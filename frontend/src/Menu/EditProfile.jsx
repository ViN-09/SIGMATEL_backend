import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./editprofile.css";

export default function EditProfile() {
    const navigate = useNavigate();
    const { id } = useParams();

    const host = sessionStorage.getItem("host");
    const ttc = sessionStorage.getItem("ttc");

    const [loading, setLoading] = useState(false);
    const [showPassPopup, setShowPassPopup] = useState(false);
    const [showNewPassPopup, setShowNewPassPopup] = useState(false);

    const [passwordLama, setPasswordLama] = useState("");
    const [passwordBaru, setPasswordBaru] = useState("");

    const [formData, setFormData] = useState({
        id: "",
        Nama: "",
        jabatan: "",
        tl: "",
        Alamat: "",
        noTELP: "",
        email: "",
        gambar: null,
        oldImage: "",
    });

    // Load Data
    useEffect(() => {
        if (id) fetchUserData(id);
    }, [id]);

    const fetchUserData = async (userId) => {
        setLoading(true);
        try {
            const res = await fetch(`${host}/api/${ttc}/user/${userId}`);
            const result = await res.json();

            if (result.success) {
                const d = result.data;

                setFormData({
                    id: d.id,
                    Nama: d.Nama,
                    jabatan: d.jabatan,
                    tl: d.tl,
                    Alamat: d.Alamat,
                    noTELP: d.noTELP,
                    email: d.email,
                    gambar: null,
                    oldImage: d.gambar,
                });
            }
        } catch (err) {
            console.log("Gagal load data user", err);
        }
        setLoading(false);
    };

    // Change Handler
    const handleChange = (e) => {
        const { name, value, files } = e.target;
        setFormData({
            ...formData,
            [name]: files ? files[0] : value,
        });
    };

    // Save Data
    const handleSave = async () => {
        setLoading(true);

        const payload = new FormData();
        Object.keys(formData).forEach((key) => {
            if (formData[key] !== null) {
                payload.append(key, formData[key]);
            }
        });

        if (id) payload.append("_method", "PUT");

        const url = id
            ? `${host}/api/${ttc}/user/${id}`
            : `${host}/api/${ttc}/user`;

        try {
            const res = await fetch(url, {
                method: "POST",
                body: payload,
            });

            const result = await res.json();

            if (result.success) {
                alert("Data berhasil disimpan!");
                navigate("/Simain");
            } else {
                alert("Gagal menyimpan data.");
            }
        } catch (error) {
            console.error(error);
        }

        setLoading(false);
    };

    // ===================================
    //     CEK PASSWORD LAMA
    // ===================================
    const handleCheckPassword = async () => {
        const res = await fetch(`${host}/api/${ttc}/user/cekpass`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id, password: passwordLama }),
        });

        const data = await res.json();

        if (data.valid === true) {
            setShowPassPopup(false);
            setShowNewPassPopup(true);
        } else {
            alert("Password lama salah!");
        }
    };

    // ===================================
    //    SIMPAN PASSWORD BARU
    // ===================================
    const handleSaveNewPassword = async () => {
        const res = await fetch(`${host}/api/${ttc}/user/${id}/update-password`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id, newpass: passwordBaru }),
        });

        const data = await res.json();

        if (data.success) {
            alert("Password berhasil diganti!");
            setShowNewPassPopup(false);
            setPasswordBaru("");
            setPasswordLama("");
        } else {
            alert("Gagal mengganti password.");
        }
    };

    return (
        <div className="container-fluid py-4 editprofile-wrapper">
            <h3 className="mb-4 fw-semibold px-4">
                {id ? "Form - Edit Profil" : "Form - Tambah Profil"}
            </h3>

            {/* CARD */}
            <div className="d-flex justify-content-center">
                <div className="editprofile-card p-4 rounded-4 shadow-sm">
                    <h5 className="fw-semibold mb-3">
                        {id ? "Edit Profil" : "Tambah Profil"}
                    </h5>

                    {/* BUTTON GANTI PASSWORD */}
                    {id && (
                        <button
                            className="btn btn-warning w-100 mb-3"
                            onClick={() => setShowPassPopup(true)}
                        >
                            Ganti Password
                        </button>
                    )}

                    {/* ID */}
                    <div className="mb-3">
                        <label className="form-label">ID</label>
                        <input
                            type="text"
                            className="form-control"
                            name="id"
                            disabled={id}
                            value={formData.id}
                            onChange={handleChange}
                        />
                    </div>

                    {/* Nama */}
                    <div className="mb-3">
                        <label className="form-label">Nama</label>
                        <input
                            type="text"
                            className="form-control"
                            name="Nama"
                            value={formData.Nama}
                            onChange={handleChange}
                        />
                    </div>

                    {/* Jabatan */}
                    <div className="mb-3">
                        <label className="form-label">Jabatan</label>
                        <input
                            type="text"
                            className="form-control"
                            name="jabatan"
                            value={formData.jabatan}
                            onChange={handleChange}
                        />
                    </div>

                    {/* Tanggal Lahir */}
                    <div className="mb-3">
                        <label className="form-label">Tanggal Lahir</label>
                        <input
                            type="date"
                            className="form-control"
                            name="tl"
                            value={formData.tl}
                            onChange={handleChange}
                        />
                    </div>

                    {/* Alamat */}
                    <div className="mb-3">
                        <label className="form-label">Alamat</label>
                        <textarea
                            className="form-control"
                            name="Alamat"
                            rows="2"
                            value={formData.Alamat}
                            onChange={handleChange}
                        ></textarea>
                    </div>

                    {/* No Telp */}
                    <div className="mb-3">
                        <label className="form-label">Nomor Telepon</label>
                        <input
                            type="text"
                            className="form-control"
                            name="noTELP"
                            value={formData.noTELP}
                            onChange={handleChange}
                        />
                    </div>

                    {/* Email */}
                    <div className="mb-3">
                        <label className="form-label">Email</label>
                        <input
                            type="email"
                            className="form-control"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                        />
                    </div>

                    {/* Foto Profil */}
                    <div className="mb-3">
                        <label className="form-label">Foto Profil</label>
                        <input
                            type="file"
                            className="form-control"
                            name="gambar"
                            accept="image/*"
                            onChange={handleChange}
                        />

                        {formData.gambar && (
                            <div className="preview-img-wrapper">
                                <img
                                    src={URL.createObjectURL(formData.gambar)}
                                    alt="preview-baru"
                                    className="preview-img"
                                />
                            </div>
                        )}

                        {!formData.gambar && formData.oldImage && (
                            <div className="preview-img-wrapper">
                                <img
                                    src={`${host}/storage/profile_picture/${formData.oldImage}`}
                                    alt="preview-lama"
                                    className="preview-img"
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* BUTTONS */}
            <div className="editprofile-controls">
                <button
                    className="btn btn-secondary px-4"
                    onClick={() => navigate("/Simain")}
                >
                    ← Kembali
                </button>

                <button
                    className="btn btn-danger px-4"
                    onClick={handleSave}
                    disabled={loading}
                >
                    {loading ? "Saving..." : <i className="bi bi-box-arrow-up-right"></i>}
                    &nbsp; Save
                </button>
            </div>

            {/* ================= POPUP PASSWORD LAMA ================= */}
            {showPassPopup && (
                <div className="popup-backdrop">
                    <div className="popup-box">
                        <h5>Verifikasi Password</h5>
                        <input
                            type="password"
                            className="form-control mb-3"
                            placeholder="Masukkan password lama..."
                            value={passwordLama}
                            onChange={(e) => setPasswordLama(e.target.value)}
                        />

                        <div className="d-flex justify-content-end gap-2">
                            <button
                                className="btn btn-secondary"
                                onClick={() => setShowPassPopup(false)}
                            >
                                Batal
                            </button>
                            <button className="btn btn-danger" onClick={handleCheckPassword}>
                                Lanjut
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ================= POPUP PASSWORD BARU ================= */}
            {showNewPassPopup && (
                <div className="popup-backdrop">
                    <div className="popup-box">
                        <h5>Password Baru</h5>
                        <input
                            type="password"
                            className="form-control mb-3"
                            placeholder="Masukkan password baru..."
                            value={passwordBaru}
                            onChange={(e) => setPasswordBaru(e.target.value)}
                        />

                        <div className="d-flex justify-content-end gap-2">
                            <button
                                className="btn btn-secondary"
                                onClick={() => setShowNewPassPopup(false)}
                            >
                                Batal
                            </button>
                            <button className="btn btn-danger" onClick={handleSaveNewPassword}>
                                Simpan
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
