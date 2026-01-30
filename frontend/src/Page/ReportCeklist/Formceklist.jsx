import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./FormChecklist.css";
import telkomselImg2 from "../../assets/Telkomsel Logo.png";
import DynamicForm from "./DynamicForm/index.jsx";

export default function FormChecklist() {
  const navigate = useNavigate();
  const formRef = useRef(null);

  const kembali = () => {
    navigate("/Simain", { state: { menu: "Data" } });
  };

  const handleSuccessDaftar = (response) => {
    if (!response || !response.no_report) return;

    // Simpan metadata ke session
    sessionStorage.setItem("active_report_id", response.no_report);
    sessionStorage.setItem("report_property", JSON.stringify(response));

    const formMapping = {
      'KWH & Suhu': ["property", "suhu_kwh"],
      'Genset1': ["genset1"],
      'Genset2': ["genset2"],
      'Ceklist': ["property", "suhu_kwh", "power", "it_load", "coling_system"]
    };

    const targetForms = formMapping[response.report_type];

    if (targetForms) {
      navigate("/Formreport", { 
        state: { 
          formCall: targetForms, 
          no_report: response.no_report 
        } 
      });
    }
  };

  const handleSubmitAll = () => {
    // Memanggil fungsi submit yang diekspos oleh useImperativeHandle
    if (formRef.current) {
      formRef.current.submit();
    } else {
      console.error("Gagal mengakses komponen form!");
    }
  };

  return (
    <div className="form-container">
      <div className="item header-logo">
        <img src={telkomselImg2} alt="Telkomsel Logo" />
      </div>

      <div className="item form-wrapper">
        <DynamicForm
          category="staffform"
          onSubmitSuccess={handleSuccessDaftar}
          ref={formRef} 
        />
      </div>

      <div className="item footer-tag">©TTC Teling</div>

      <div className="action-buttons">
        <button id="ceklistsubmit" onClick={handleSubmitAll} className="btn-save">
          <i className="bi bi-save me-2"></i> Save & Lanjut
        </button>
        <button id="ceklistback" onClick={kembali} className="btn-back">
          <i className="bi bi-arrow-left me-2"></i> Kembali
        </button>
      </div>
    </div>
  );
}