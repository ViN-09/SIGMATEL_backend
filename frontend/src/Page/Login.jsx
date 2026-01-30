import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./Login.css";
import telkomselImg2 from "../assets/Telkomsel Logo.png";

import { loginRequest, sitesaperator } from "../auth.js";

export default function Login({ onLoginSuccess }) {
  // ✅ CLEAR SESSION HANYA SEKALI SAAT HALAMAN LOGIN MOUNT
  useEffect(() => {
    sessionStorage.clear();
    // console.log("SESSION CLEARED ON LOGIN PAGE LOAD");
  }, []);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleExit = () => {
    try {
      window.close();
    } catch (e) {
      console.error("Tidak bisa menutup window:", e);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // console.log("===== LOGIN START =====");

      const res = await loginRequest(username, password);
// console.log("LOGIN RESPONSE:", res);

// ✅ VALIDASI YANG BENAR
if (!res?.site) {
  throw new Error("Data login tidak valid (site kosong)");
}

// ✅ SIMPAN USER
sessionStorage.setItem("userinfo", JSON.stringify(res));

// ✅ HITUNG TTC
const ttcValue = sitesaperator(res.site);
sessionStorage.setItem("ttc", ttcValue);

console.log("SESSION AFTER LOGIN:", {
  // userinfo: sessionStorage.getItem("userinfo"),
  ttc: sessionStorage.getItem("ttc"),
});

      console.log("===== LOGIN END =====");

      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: "Login berhasil!",
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
      });

      onLoginSuccess?.();
    } catch (err) {
      console.error("LOGIN ERROR:", err);

      const msg = err.message || "Terjadi kesalahan jaringan";
      setError(msg);

      Swal.fire({
        icon: "error",
        title: msg,
        confirmButtonText: "OK",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="loginbasewarp">
      <div className="login-wrapper">
        <div className="login-card position-relative">
          <button
            type="button"
            className="btn btn-link position-absolute top-0 end-0 m-2 p-0"
            id="exit"
            onClick={handleExit}
            style={{ color: "#ff0000ff", fontSize: "1.5rem" }}
          >
            <i className="bi bi-x-circle-fill"></i>
          </button>

          <div className="logo-header">
            <img src={telkomselImg2} alt="Telkomsel Logo" />
          </div>

          <h2 className="title">Login</h2>
          <p className="subtitle">Masukkan username dan password Anda</p>

          {error && <div className="alert alert-danger">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="input-box">
              <i className="bi bi-person-fill"></i>
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoFocus
                required
              />
            </div>

            <div className="input-box">
              <i className="bi bi-lock-fill"></i>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn-login" disabled={loading}>
              {loading ? (
                <span className="spinner-border spinner-border-sm"></span>
              ) : (
                <span>Login</span>
              )}
            </button>
          </form>

          <a href="#" className="forgot-password">
            Lupa Password?
          </a>
        </div>
      </div>
    </div>
  );
}
