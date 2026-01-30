import React, { useState, useEffect, useRef } from "react";
import "./Simain.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import Loader from "../component/Loder";
import { useNavigate } from "react-router-dom";
import Data from "../Menu/Data";
import { sitesaperator } from "../auth.js";
import ResumeDashboard from "../Menu/Resume.jsx";
import Dashboard from "../Menu/Dashboard.jsx";


export default function Simain() {
  const navigate = useNavigate();
  const host = sessionStorage.getItem("host");
  const userinfo = JSON.parse(sessionStorage.getItem("userinfo") || "{}");
  const isUserRole = userinfo.jabatan === "User";
  
  useEffect(() => {
    if (!sessionStorage.getItem("ttc") && userinfo.site) {
      sessionStorage.setItem("ttc", sitesaperator(userinfo.site));
      console.log("Site set to:", sessionStorage.getItem("ttc"));
    }
  }, [userinfo.site]);

  const ttc = sessionStorage.getItem("ttc");
  console.log("TTC:", ttc);

  const menuRef = useRef(null);

  // ===== STATE =====
  const [showLoader, setShowLoader] = useState(true);
  const [activeMenu, setActiveMenu] = useState("Data");
  const [showMenu, setShowMenu] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const [refreshKey, setRefreshKey] = useState(0);

  // ===== SESSION =====
  
  
  // ===== INIT TTC (HANYA SEKALI) =====

  // ===== SITE LABEL =====
  const getSiteLabel = (key) => {
    switch (key) {
      case "ttc_teling":
        return "si - teling";
      case "ttc_paniki":
        return "si - paniki";
      default:
        return "si";
    }
  };

  const siteLabel = getSiteLabel(ttc);

  // ===== MENU =====
  const menuItems = [
    { label: "Data", icon: "bi-folder2-open" },
    { label: "Facilty-Profile", icon: "bi-building" },
    { label: "Facilty-Monitoring", icon: "bi-graph-up-arrow" },
  ];

  // ===== EFFECT =====
  useEffect(() => {
    const timer = setTimeout(() => setShowLoader(false), 800);
    return () => clearTimeout(timer);
  }, []);

  // ===== HANDLER =====
  const handleContextMenu = (e) => {
    e.preventDefault();
    setMenuPosition({ x: e.pageX, y: e.pageY });
    setShowMenu(true);
  };

  const handleLogout = () => {
    sessionStorage.clear();
    navigate("/SIGMATEL");
  };

  const handleChangeSite = (e) => {
    sessionStorage.setItem("ttc", e.target.value);
    setRefreshKey((prev) => prev + 1);
  };

  // ===== CONTENT =====
  const renderContent = () => {
    switch (activeMenu) {
      case "Data":
        return <Data />;
      case "Facilty-Profile":
        return <ResumeDashboard/>;
      case "Facilty-Monitoring":
        return <Dashboard/>;
      default:
        return null;
    }
  };

  // ===== RENDER =====
  return (
    <div className="simain-container">
      {showLoader ? (
        <Loader duration={0.8} />
      ) : (
        <div className="simain-content">
          {/* ===== SIDEBAR ===== */}
          <div className="simain-nav">
            <div className="nav-header">
              <h1 className="nav-label">{siteLabel}</h1>
            </div>

            <ul className="submenu">
              {/* ===== SITE SELECT ===== */}
              {isUserRole && (
  <li className="site-select-wrapper">
    <select
      className="site-select-only-arrow"
      value={ttc}
      onChange={handleChangeSite}
    >
      <option value="ttc_teling">TTC Teling</option>
      <option value="ttc_paniki">TTC Paniki</option>
    </select>

    <i className="bi bi-chevron-down site-select-icon"></i>
  </li>
)}


              {/* ===== MENU ===== */}
              {menuItems.map((item) => (
                <li
                  key={item.label}
                  className={activeMenu === item.label ? "active" : ""}
                  onClick={() => setActiveMenu(item.label)}
                >
                  <i className={`bi ${item.icon} me-2`} />
                  {item.label}
                </li>
              ))}
            </ul>

            {/* ===== PROFILE ===== */}
            <div
              className="profile-pic-warper"
              onContextMenu={handleContextMenu}
            >
              <img
                className="profile-pic"
                src={`${host}/storage/profile_picture/${userinfo.gambar}`}
                alt="Profile"
              />
            </div>

            {/* ===== CONTEXT MENU ===== */}
            {showMenu && (
              <ul
                ref={menuRef}
                className="profil-menu"
                style={{
                  top: menuPosition.y,
                  left: menuPosition.x - 150,
                }}
              >
                <li onClick={() => navigate(`/profile/form/${userinfo.id}`)}>
                  <i className="bi bi-pencil-square me-2"></i>
                  Edit
                </li>
                <li onClick={handleLogout}>
                  <i className="bi bi-box-arrow-right me-2"></i>
                  Log Out
                </li>
              </ul>
            )}
          </div>

          {/* ===== MAIN ===== */}
          <div className="main-body-si" key={refreshKey}>
            {renderContent()}
          </div>
        </div>
      )}
    </div>
  );
}
