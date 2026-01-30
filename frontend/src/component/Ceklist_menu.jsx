import { useState } from "react";
import { ClipboardCheck, CalendarWeek } from "react-bootstrap-icons";
import "./Ceklist_menu.css";

function Ceklist_menu({ onSelect }) { // terima callback dari parent
  const [activeCard, setActiveCard] = useState("daily"); // default aktif = Daily

  const handleClick = (menu) => {
    setActiveCard(menu);
    if (onSelect) onSelect(menu); // kirim info ke parent
  };

  return (
    <div className="ceklist-container">
      <h4 className="ceklist-title">
        <i className="bi bi-list-check me-2"></i>
        Select Checklist
      </h4>

      <div className="ceklist-card-wrapper">
        {/* DAILY */}
        <div
          className={`ceklist-card ${activeCard === "daily" ? "active" : ""}`}
          onClick={() => handleClick("daily")}
        >
          <div className="ceklist-icon daily">
            <ClipboardCheck size={20} />
          </div>
          <div className="ceklist-text">
            <h5>Daily Activity</h5>
            <p>Ceklist Suhu & Kwh</p>
          </div>
        </div>

        {/* WEEKLY */}
        <div
          className={`ceklist-card ${activeCard === "weekly" ? "active" : ""}`}
          onClick={() => handleClick("weekly")}
        >
          <div className="ceklist-icon weekly">
            <CalendarWeek size={20} />
          </div>
          <div className="ceklist-text">
            <h5>Weekly Activity</h5>
            <p>Ceklist Mingguan</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Ceklist_menu;
