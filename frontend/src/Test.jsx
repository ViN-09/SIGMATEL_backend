import React, { useRef } from "react";
import DynamicForm from "./Page/ReportCeklist/DynamicForm/index.jsx";

function Test() {
  const formRef = useRef();

  const handleBerhasil = () => {
    console.log("Mantap! Data sudah tersimpan.");
    // Kamu bisa arahkan user ke halaman lain atau reset state di sini
  };

  const pemicuSubmitLuar = () => {
    // Memanggil fungsi handleSubmit yang ada di dalam DynamicForm via ref
    if (formRef.current) {
      formRef.current.submit();
    }
  };

  return (
    <div className="container">
      <h1>Input Data Maintenance</h1>
      
      {/* 1. Panggil Komponennya */}
      <DynamicForm 
        category="power"           // Sesuai category API kamu
        onSubmitSuccess={handleBerhasil} 
        formRef={formRef}          // Hubungkan ref-nya
      />
      <DynamicForm 
        category="power"           // Sesuai category API kamu
        onSubmitSuccess={handleBerhasil} 
        formRef={formRef}          // Hubungkan ref-nya
      />

      <div className="button-group" style={{ marginTop: '20px', textAlign: 'center' }}>
        {/* 2. Tombol ini ada di luar form tapi bisa nge-submit form di dalam */}
        <button 
          onClick={pemicuSubmitLuar}
          style={{ padding: '10px 30px', backgroundColor: '#28a745', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
        >
          Simpan Laporan
        </button>
      </div>
    </div>
  );
}

export default Test;