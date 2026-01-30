import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import {
  fetchUserData,
  saveUserProfile,
  checkOldPassword,
  updateNewPassword
} from "../auth";
import "./Editprofile.css";

export default function EditProfile() {
  const navigate = useNavigate();
  const { id } = useParams();
  const host = sessionStorage.getItem("host");

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
    oldImage: ""
  });

  /* ===============================
     LOAD USER DATA
  =============================== */
  useEffect(() => {
    if (!id) return;

    const loadData = async () => {
      const toastId = `load-user-${id}`;
      setLoading(true);
      toast.loading("Memuat data profil...", { id: toastId });

      try {
        const result = await fetchUserData(id);
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
            oldImage: d.gambar
          });
          toast.success("Data profil dimuat", { id: toastId });
        } else {
          toast.error("Gagal memuat data", { id: toastId });
        }
      } catch (err) {
        console.error(err);
        toast.error("Terjadi kesalahan sistem", { id: toastId });
      }

      setLoading(false);
    };

    loadData();
  }, [id]);

  /* ===============================
     HANDLE INPUT CHANGE
  =============================== */
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value
    }));
  };

  /* ===============================
     SAVE PROFILE
  =============================== */
  const handleSave = async () => {
    const toastId = `save-profile-${Date.now()}`;
    setLoading(true);
    toast.loading("Menyimpan data...", { id: toastId });

    const payload = new FormData();
    Object.keys(formData).forEach((key) => {
      if (formData[key] !== null) payload.append(key, formData[key]);
    });

    try {
      const result = await saveUserProfile(id, payload);

      if (result.success) {
        toast.success("Profil berhasil disimpan", { id: toastId });
        navigate("/Simain");
      } else {
        toast.error("Gagal menyimpan profil", { id: toastId });
      }
    } catch (err) {
      console.error(err);
      toast.error("Terjadi kesalahan sistem", { id: toastId });
    }

    setLoading(false);
  };

  /* ===============================
     CHECK OLD PASSWORD
  =============================== */
  const handleCheckPassword = async () => {
    const toastId = `check-password-${Date.now()}`;
    toast.loading("Memverifikasi password...", { id: toastId });

    try {
      const data = await checkOldPassword(id, passwordLama);
      if (data.valid) {
        toast.success("Password terverifikasi", { id: toastId });
        setShowPassPopup(false);
        setShowNewPassPopup(true);
      } else {
        toast.error("Password lama salah", { id: toastId });
      }
    } catch (err) {
      toast.error("Gagal verifikasi password", { id: toastId });
    }
  };

  /* ===============================
     SAVE NEW PASSWORD
  =============================== */
  const handleSaveNewPassword = async () => {
    const toastId = `update-password-${Date.now()}`;
    toast.loading("Mengganti password...", { id: toastId });

    try {
      const data = await updateNewPassword(id, passwordBaru);
      if (data.success) {
        toast.success("Password berhasil diganti", { id: toastId });
        setShowNewPassPopup(false);
        setPasswordBaru("");
        setPasswordLama("");
      } else {
        toast.error("Gagal mengganti password", { id: toastId });
      }
    } catch (err) {
      toast.error("Terjadi kesalahan sistem", { id: toastId });
    }
  };

  /* ===============================
     RENDER
  =============================== */
  return (
    <div className="container-fluid py-4 editprofile-wrapper">
      <h3 className="mb-4 fw-semibold px-4">
        {id ? "Form - Edit Profil" : "Form - Tambah Profil"}
      </h3>

      <div className="d-flex justify-content-center">
        <div className="editprofile-card p-4 rounded-4 shadow-sm">
          <h5 className="fw-semibold mb-3">Edit Profil</h5>

          {id && (
            <button
              className="btn btn-warning w-100 mb-3"
              onClick={() => setShowPassPopup(true)}
            >
              Ganti Password
            </button>
          )}

          {[
            ["ID", "id", true],
            ["Nama", "Nama"],
            ["Jabatan", "jabatan"],
            ["Tanggal Lahir", "tl", false, "date"],
            ["Nomor Telepon", "noTELP"],
            ["Email", "email", false, "email"]
          ].map(([label, name, disabled, type = "text"]) => (
            <div className="mb-3" key={name}>
              <label className="form-label">{label}</label>
              <input
                type={type}
                className="form-control"
                name={name}
                disabled={disabled}
                value={formData[name]}
                onChange={handleChange}
              />
            </div>
          ))}

          <div className="mb-3">
            <label className="form-label">Alamat</label>
            <textarea
              className="form-control"
              name="Alamat"
              rows="2"
              value={formData.Alamat}
              onChange={handleChange}
            />
          </div>

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
              <img
                src={URL.createObjectURL(formData.gambar)}
                className="preview-img mt-2"
                alt="preview-baru"
              />
            )}

            {!formData.gambar && formData.oldImage && (
              <img
                src={`${host}/storage/profile_picture/${formData.oldImage}`}
                className="preview-img mt-2"
                alt="preview-lama"
              />
            )}
          </div>
        </div>
      </div>

      <div className="editprofile-controls">
        <button className="btn btn-secondary" onClick={() => navigate("/Simain")}>
          ← Kembali
        </button>

        <button
          className="btn btn-danger"
          onClick={handleSave}
          disabled={loading}
        >
          {loading ? "Saving..." : "Save"}
        </button>
      </div>

      {/* POPUP PASSWORD LAMA */}
      {showPassPopup && (
        <div className="popup-backdrop">
          <div className="popup-box">
            <h5>Verifikasi Password</h5>
            <input
              type="password"
              className="form-control mb-3"
              placeholder="Password lama..."
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

      {/* POPUP PASSWORD BARU */}
      {showNewPassPopup && (
        <div className="popup-backdrop">
          <div className="popup-box">
            <h5>Password Baru</h5>
            <input
              type="password"
              className="form-control mb-3"
              placeholder="Password baru..."
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
              <button
                className="btn btn-danger"
                onClick={handleSaveNewPassword}
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
