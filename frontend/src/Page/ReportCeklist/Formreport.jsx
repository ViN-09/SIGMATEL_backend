import React, { useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./FormChecklist.css";
import telkomselImg2 from "../../assets/Telkomsel Logo.png";
import DynamicForm from "./DynamicForm/index.jsx";

export default function Formreport() {
  const location = useLocation();
  const navigate = useNavigate();
  
  const formCall = location.state?.formCall || [];
  const noReport = location.state?.no_report;
  const formRefs = useRef({}); // Menyimpan banyak ref
  const [successList, setSuccessList] = useState([]);

  const handleSingleSuccess = (category) => {
    setSuccessList((prev) => {
      const updated = [...prev, category];
      if (updated.length === formCall.length) {
        sessionStorage.setItem("report_status", '"Submited"');
        setTimeout(() => navigate("/Simain", { state: { menu: "Data" } }), 1000);
      }
      return updated;
    });
  };

  const handleSubmitAll = () => {
    setSuccessList([]);
    formCall.forEach((category) => {
      if (formRefs.current[category]) {
        formRefs.current[category].submit();
      }
    });
  };

  return (
    <div className="form-container">
      <div className="item header-logo">
        <img src={telkomselImg2} alt="Telkomsel Logo" />
      </div>

      <div className="item form-wrapper">
        {formCall.map((category) => (
          <div key={category} className="card-form-wrapper" style={{ marginBottom: '20px' }}>
            <DynamicForm
              category={category}
              noReport={noReport}
              onSubmitSuccess={() => handleSingleSuccess(category)}
              // Cara mapping ref untuk komponen yang di-loop
              ref={(el) => (formRefs.current[category] = el)}
            />
          </div>
        ))}
      </div>

      <div className="action-buttons">
        <button id="ceklistsubmit" onClick={handleSubmitAll} className="btn-save">
          <i className="bi bi-cloud-upload me-2"></i> Submit Semua
        </button>
        <button id="ceklistback" onClick={() => navigate(-1)} className="btn-back">
          Kembali
        </button>
      </div>
    </div>
  );
}