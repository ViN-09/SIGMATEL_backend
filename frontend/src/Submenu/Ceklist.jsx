import { useState, useEffect } from "react";
import Loder from "../component/Loder";
import "./Ceklist.css";
import Ceklist_menu from "../component/Ceklist_menu.jsx";
import Table_report_list from "../component/Table_report_list.jsx";
import { fetchDailyActivityList } from "../auth";
import { useNavigate } from "react-router-dom";

function Ceklist() {
  const [loading, setLoading] = useState(true);
  const [activeMenu, setActiveMenu] = useState("daily"); // default Daily
  const [dailyData, setDailyData] = useState([]);
  const [weeklyData, setWeeklyData] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();


  const menuTitles = {
    daily: "Daily Activity",
    weekly: "Weekly Activity",
  };

  const columns = [
    { key: "no_report", label: "No." },
    { key: "Petugas1", label: "Petugas1" },
    { key: "Petugas2", label: "Petugas2" },
    { key: "Petugas3", label: "Petugas3" },
    { key: "Petugas4", label: "Petugas4" },
    { key: "Report", label: "Report" },
    { key: "Date", label: "Date" },
  ];

  // fungsi klik menu
  const handleMenuClick = (menu) => {
    setActiveMenu(menu);
  };

  // fetch dan pisah data daily / weekly
  useEffect(() => {
    setLoading(true);

    fetchDailyActivityList()
      .then((res) => {
        const allData = res?.DialyActivityList || [];
        console.log("Fetched Data:", allData);
        // tentukan report yang masuk weekly (case-insensitive)
        const weeklyReports = ["genset1", "genset2"];

        const weekly = allData.filter((row) =>
          weeklyReports.includes((row.Report || "").toLowerCase())
        );
        const daily = allData.filter((row) =>
          !weeklyReports.includes((row.Report || "").toLowerCase())
        );

        setWeeklyData(weekly);
        setDailyData(daily);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError(err.message || "Gagal fetch data");
        setLoading(false);
      });
  }, []);

  if (loading) return <Loder duration={0.5} />;
  

  // pilih data yang tampil sesuai menu
  const currentData = activeMenu === "daily" ? dailyData : weeklyData;

  return (
  <div className="ceklist-content">
    {/* Menu Sidebar tetap muncul */}
    <div className="ceklist-menu-warper">
      <Ceklist_menu activeMenu={activeMenu} onSelect={handleMenuClick} />
    </div>

    <div className="ceklist-menu-content">
      <div className="content-ceklist-header">
        <h1 id="title-ceklist">
          <i className="bi bi-list-check"></i> Ceklist - {menuTitles[activeMenu]}
        </h1>
        {/* Button Add tetap muncul */}
        <button
          className="add-ceklist-button"
          onClick={() => navigate("/FormChecklist")}
        >
          <i className="bi bi-plus"></i> Add
        </button>
      </div>

      {/* Logic Kondisional di area tabel */}
      {error ? (
        <div className="ceklist-content-eror" style={{ textAlign: "center", padding: "20px" }}>
          <p style={{ color: "red", fontWeight: "bold" }}>{error}</p>
        </div>
      ) : (
        <Table_report_list columns={columns} data={currentData} />
      )}
    </div>
  </div>
);
}

export default Ceklist;
