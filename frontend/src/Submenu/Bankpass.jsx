import React, { useState, useEffect } from "react";
import { PlainTableCrud } from "../component/CardTable";
import Add from "./AddPass";
import "./Bankpass.css";
import Loder from "../component/Loder";
import Swal from "sweetalert2";
import { fetchBankPasswords } from "../auth";

export default function Bankpass() {
  const [loading, setLoading] = useState(false);
  const [activeCard, setActiveCard] = useState("");
  const [showAdd, setShowAdd] = useState(false);

  const [passwordAPP, setPasswordAPP] = useState([]);
  const [passwordPerangkat, setPasswordPerangkat] = useState([]);
  const [refreshKey, setRefreshKey] = useState(0);

  // 🔹 FETCH DATA UTAMA
  const loadPasswords = async () => {
    try {
      setLoading(true);

      const all = await fetchBankPasswords();

      setPasswordAPP(all.filter(item => item.tipe === "Aplikasi"));
      setPasswordPerangkat(all.filter(item => item.tipe === "Perangkat"));
      setActiveCard(prev => prev || "perangkat");
    } catch (err) {
      // Swal.fire({
      //   icon: "error",
      //   title: "Error",
      //   text: err.message || "Server error",
      // });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPasswords();
  }, []);

  const refreshData = () => {
    loadPasswords();
    setRefreshKey(prev => prev + 1);
  };

  // 🔹 UPDATE LOCAL STATE
  const handleUpdate = (id, updatedRow) => {
    if (updatedRow.tipe === "Aplikasi") {
      setPasswordAPP(prev =>
        prev.map(r => (r.id === id ? updatedRow : r))
      );
    } else {
      setPasswordPerangkat(prev =>
        prev.map(r => (r.id === id ? updatedRow : r))
      );
    }
  };

  const handleDelete = (id, deletedRow) => {
    if (!deletedRow) return;

    if (deletedRow.tipe === "Aplikasi") {
      setPasswordAPP(prev => prev.filter(r => r.id !== id));
    } else {
      setPasswordPerangkat(prev => prev.filter(r => r.id !== id));
    }
  };

  const cards = [
    {
      id: "perangkat",
      label: "Password Perangkat",
      size: "—",
      items: `${passwordPerangkat.length} items`,
    },
    {
      id: "acces",
      label: "Password Aplikasi",
      size: "—",
      items: `${passwordAPP.length} items`,
    },
  ];

  const renderCardTable = (data) => (
    <PlainTableCrud
      data={data}
      onUpdate={handleUpdate}
      onDelete={(id) => {
        const deletedRow = data.find(r => r.id === id);
        handleDelete(id, deletedRow);
      }}
    />
  );

  const renderContent = () => {
    switch (activeCard) {
      case "perangkat":
        return (
          <>
            <div id="headertable">
              <h5>Password Perangkat</h5>
              <i
                className="bi bi-plus-square"
                id="pass-app-add"
                style={{ cursor: "pointer" }}
                onClick={() => setShowAdd(true)}
              />
            </div>

            {renderCardTable(passwordPerangkat)}
          </>
        );

      case "acces":
        return (
          <>
            <div id="headertable">
              <h5>Password Aplikasi</h5>
              <i
                className="bi bi-plus-square"
                id="pass-app-add"
                style={{ cursor: "pointer" }}
                onClick={() => setShowAdd(true)}
              />
            </div>

            {renderCardTable(passwordAPP)}
          </>
        );

      default:
        return <h5>Silakan pilih kategori password</h5>;
    }
  };

  return (
    <div className="bank-pass-container">
      {loading && <Loder duration={0.8} />}

      <div className="bank-pass-container-submenu-warper">
        <h5>
          <i className="bi bi-key"></i> Bank Password
        </h5>

        <div className="bank-pass-container-submenu">
          {cards.map(card => (
            <div
              key={card.id}
              className={`bankpass-card-menu ${
                activeCard === card.id ? "active" : ""
              }`}
              onClick={() => setActiveCard(card.id)}
            >
              <div className="card-label">{card.label}</div>
              <div className="card-info">• {card.items}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="selector-data">
        <div className="selector-data-warper" key={refreshKey}>
          {renderContent()}
        </div>
      </div>

      {showAdd && (
        <Add
          onClose={() => {
            setShowAdd(false);
            refreshData();
          }}
        />
      )}
    </div>
  );
}
