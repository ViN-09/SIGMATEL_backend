import React, { useState, useEffect } from "react";
import { TableDapot } from "../component/CardTable";
import ReactDOM from "react-dom";
import Loder from "../component/Loder";
import "./Sidapot.css";
import * as XLSX from "xlsx";
import { fetchDapot, crudDapot } from "../auth"; // Import fungsi dari auth.js

// Komponen Loader Portal
const LoaderPortal = ({ isVisible, text = "Memuat..." }) => {
  if (!isVisible) return null;

  return ReactDOM.createPortal(
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(255, 255, 255, 0.8)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      backdropFilter: 'blur(2px)'
    }}>
      <div style={{ textAlign: 'center' }}>
        <Loder duration={1} color="#007bff" />
        <p style={{ marginTop: '10px', color: '#666' }}>{text}</p>
      </div>
    </div>,
    document.body
  );
};

const SmallLoaderPortal = ({ isVisible, text = "" }) => {
  if (!isVisible) return null;

  return ReactDOM.createPortal(
    <div style={{
      position: 'fixed',
      top: '20px',
      right: '20px',
      zIndex: 10000,
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      background: 'rgba(255, 255, 255, 0.9)',
      padding: '10px 15px',
      borderRadius: '8px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
      border: '1px solid #ddd'
    }}>
      <small style={{ color: '#666' }}>{text}</small>
      <div style={{ width: '20px', height: '20px' }}>
        <Loder duration={0.8} color="#007bff" />
      </div>
    </div>,
    document.body
  );
};

// Komponen EditFormPortal (tetap sama)
const EditFormPortal = ({ tableId, editingRow, onClose, onSubmit, mode = "edit" }) => {
  const [formData, setFormData] = useState(
    mode === "edit" 
      ? { ...editingRow } 
      : editingRow 
        ? Object.keys(editingRow).reduce((acc, key) => ({ ...acc, [key]: "" }), {})
        : {}
  );

  const [newId, setNewId] = useState("");

  useEffect(() => {
    if (mode === "add") {
      const timestamp = Date.now();
      const random = Math.floor(Math.random() * 1000);
      const generatedId = `${timestamp}_${random}`;
      setNewId(generatedId);
      setFormData(prev => ({
        ...prev,
        id: generatedId
      }));
    }
  }, [mode]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (key, value) => {
    setFormData(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const getFormFields = () => {
    if (!editingRow) return [];
    const keys = Object.keys(editingRow);
    return keys.filter(key => key !== 'id');
  };

  const formFields = getFormFields();

  return ReactDOM.createPortal(
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999
    }} onClick={onClose}>
      <div style={{
        background: 'white',
        padding: '20px',
        borderRadius: '8px',
        minWidth: '400px',
        maxWidth: '90%',
        maxHeight: '80vh',
        overflow: 'auto',
        boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
      }} onClick={(e) => e.stopPropagation()}>
        <h3 style={{ marginBottom: '20px' }}>
          {mode === "edit" ? 'Edit' : 'Tambah'} Data - {tableId?.replace(/^dp_/, "").toUpperCase()}
        </h3>
        <form onSubmit={handleSubmit}>
          <input 
            type="hidden" 
            name="id"
            value={mode === "add" ? newId : (editingRow?.id || '')} 
          />

          {formFields.map((key) => (
            <div key={key} style={{ marginBottom: '15px' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '5px',
                fontWeight: 'bold',
                textTransform: 'capitalize'
              }}>
                {key}:
              </label>
              {["List_NE", "listNE", "Address"].includes(key) ? (
                <textarea
                  value={formData[key] || ''}
                  onChange={(e) => handleChange(key, e.target.value)}
                  style={{
                    width: '100%',
                    minHeight: '100px',
                    padding: '8px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '14px',
                    resize: 'vertical'
                  }}
                  placeholder={`Masukkan ${key}...`}
                />
              ) : (
                <input
                  type="text"
                  value={formData[key] || ''}
                  onChange={(e) => handleChange(key, e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '14px'
                  }}
                  placeholder={`Masukkan ${key}...`}
                />
              )}
            </div>
          ))}
          
          <div style={{ 
            display: 'flex', 
            gap: '10px', 
            justifyContent: 'flex-end',
            marginTop: '20px'
          }}>
            <button 
              type="button" 
              onClick={onClose}
              style={{
                padding: '8px 16px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                background: 'white',
                cursor: 'pointer'
              }}
            >
              Batal
            </button>
            <button 
              type="submit"
              style={{
                padding: '8px 16px',
                border: 'none',
                borderRadius: '4px',
                background: '#007bff',
                color: 'white',
                cursor: 'pointer'
              }}
            >
              {mode === "add" ? 'Tambah' : 'Simpan'}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
};

// Komponen Utama Sidapot
export default function Sidapot() {
  const userinfo = JSON.parse(sessionStorage.getItem("userinfo") || "{}");
  
  const [activeCard, setActiveCard] = useState(""); 
  const [dapotList, setDapotList] = useState([]);
  const [dapotDataRaw, setDapotData] = useState([]);
  const [refreshKey, setRefreshKey] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [editingRow, setEditingRow] = useState(null);
  const [formMode, setFormMode] = useState("edit");
  const [loading, setLoading] = useState(false);
  const [operationType, setOperationType] = useState("");
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await fetchDapot(); // Gunakan fungsi dari auth.js
      
      if (data.data_potesi_list) {
        setDapotList(data.data_potesi_list);
        console.log("Dapot List:", data.data_potesi_list);
      }

      if (data.datapotensi) {
        const formatted = Object.entries(data.datapotensi);
        setDapotData(formatted);
        if (formatted.length > 0 && !activeCard) {
          setActiveCard(formatted[0][0]);
        }
      }
    } catch (err) {
      console.error("Error fetch:", err);
      // Anda bisa tambahkan notifikasi error di sini
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (rowData) => {
    setEditingRow(rowData);
    setFormMode("edit");
    setShowForm(true);
  };

  const handleAdd = () => {
    const dapotData = Object.fromEntries(dapotDataRaw || []);

    const selectedData = dapotData[activeCard];
    
    if (selectedData && selectedData.length > 0) {
      const sampleRow = selectedData?.[0] || {};
      setEditingRow(sampleRow);
    } else {
      setEditingRow({});
    }
    
    setFormMode("add");
    setShowForm(true);
  };

  const updateLocalData = (tableName, newData) => {
    setDapotData(prev => {
      const newDapotData = [...prev];
      const tableIndex = newDapotData.findIndex(([table]) => table === tableName);
      
      if (tableIndex !== -1) {
        newDapotData[tableIndex] = [tableName, newData];
      }
      
      return newDapotData;
    });
  };

   const handleFormSubmit = async (formData) => {
    setLoading(true);
    setOperationType(formMode);
    
    const payload = {
      table: activeCard,
      mode: formMode,
      id: formMode === "edit" ? editingRow.id : formData.id,
      data: formData,
      user_id: userinfo.id
    };

    const dapotData = Object.fromEntries(dapotDataRaw);
    const currentTableData = dapotData[activeCard] || [];
    let updatedData;

    if (formMode === "add") {
      updatedData = [...currentTableData, formData];
    } else if (formMode === "edit") {
      updatedData = currentTableData.map(item => 
        item.id === editingRow.id ? formData : item
      );
    }

    if (updatedData) {
      updateLocalData(activeCard, updatedData);
    }

    try {
      const data = await crudDapot(payload); // Gunakan fungsi dari auth.js
      console.log('Success:', data);
      setShowForm(false);
      
      if (data.error) {
        console.error('API Error:', data.error);
        fetchData(); // Refresh data jika ada error
      }
    } catch (error) {
      console.error('Error:', error);
      fetchData(); // Refresh data jika ada error
    } finally {
      setLoading(false);
      setOperationType("");
    }
  };

  const handleDelete = async (rowData) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus data ini?')) {
      return;
    }

    setLoading(true);
    setOperationType("delete");
    
    const payload = {
      table: activeCard,
      mode: 'delete',
      id: rowData.id,
      user_id: userinfo.id
    };

    const dapotData = Object.fromEntries(dapotDataRaw);
    const currentTableData = dapotData[activeCard] || [];
    const updatedData = currentTableData.filter(item => item.id !== rowData.id);
    
    updateLocalData(activeCard, updatedData);

    try {
      const data = await crudDapot(payload); // Gunakan fungsi dari auth.js
      console.log('Success:', data);
      if (data.error) {
        fetchData(); // Refresh data jika ada error
      }
    } catch (error) {
      console.error('Error:', error);
      fetchData(); // Refresh data jika ada error
    } finally {
      setLoading(false);
      setOperationType("");
    }
  };

  // Fungsi Export Excel dengan XLSX
  const handleExportExcel = () => {
    setExporting(true);
    
    const dapotData = Object.fromEntries(dapotDataRaw);
    const selectedData = dapotData[activeCard];
    
    if (!selectedData || selectedData.length === 0) {
      alert('Tidak ada data untuk di-export');
      setExporting(false);
      return;
    }

    try {
      // Siapkan data untuk export (exclude kolom id)
      const exportData = selectedData.map(item => {
        const { id, ...rest } = item;
        return rest;
      });

      // Buat worksheet dari data
      const ws = XLSX.utils.json_to_sheet(exportData);
      
      // Atur lebar kolom otomatis
      const colWidths = [];
      if (exportData.length > 0) {
        Object.keys(exportData[0]).forEach(key => {
          const maxLength = Math.max(
            key.length,
            ...exportData.map(item => String(item[key] || '').length)
          );
          colWidths.push({ wch: Math.min(maxLength + 2, 50) }); // Maksimal lebar 50
        });
        ws['!cols'] = colWidths;
      }
      
      // Buat workbook dan tambahkan worksheet
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Data");
      
      // Generate nama file
      const tableName = activeCard.replace(/^dp_/, "").toUpperCase();
      const date = new Date().toISOString().split('T')[0];
      const fileName = `${tableName}_${date}.xlsx`;
      
      // Export ke file Excel
      XLSX.writeFile(wb, fileName);
      
    } catch (error) {
      console.error('Error exporting to Excel:', error);
      alert('Terjadi error saat mengexport data');
    } finally {
      setExporting(false);
    }
  };

  // Fungsi Export Excel dengan styling lebih baik
  const handleExportExcelWithStyle = () => {
    setExporting(true);
    
    const dapotData = Object.fromEntries(dapotDataRaw);
    const selectedData = dapotData[activeCard];
    
    if (!selectedData || selectedData.length === 0) {
      alert('Tidak ada data untuk di-export');
      setExporting(false);
      return;
    }

    try {
      // Siapkan data untuk export
      const exportData = selectedData.map(item => {
        const { id, ...rest } = item;
        return rest;
      });

      // Buat worksheet
      const ws = XLSX.utils.json_to_sheet(exportData);
      
      // Styling untuk header
      if (ws['!ref']) {
        const range = XLSX.utils.decode_range(ws['!ref']);
        
        // Style untuk header (baris pertama)
        for (let C = range.s.c; C <= range.e.c; ++C) {
          const cellAddress = XLSX.utils.encode_cell({ r: 0, c: C });
          if (!ws[cellAddress]) continue;
          
          // Tambahkan style bold untuk header
          ws[cellAddress].s = {
            font: { bold: true },
            fill: { fgColor: { rgb: "D3D3D3" } },
            alignment: { horizontal: "center" }
          };
        }
        
        // Atur lebar kolom
        const colWidths = [];
        if (exportData.length > 0) {
          Object.keys(exportData[0]).forEach(key => {
            const maxLength = Math.max(
              key.length,
              ...exportData.map(item => String(item[key] || '').length)
            );
            colWidths.push({ wch: Math.min(maxLength + 2, 50) });
          });
          ws['!cols'] = colWidths;
        }
      }
      
      // Buat workbook
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Data");
      
      // Generate nama file
      const tableName = activeCard.replace(/^dp_/, "").toUpperCase();
      const date = new Date().toISOString().split('T')[0];
      const fileName = `${tableName}_Export_${date}.xlsx`;
      
      // Export file
      XLSX.writeFile(wb, fileName);
      
    } catch (error) {
      console.error('Error exporting to Excel:', error);
      alert('Terjadi error saat mengexport data');
    } finally {
      setExporting(false);
    }
  };

  const cards = dapotList.map((item) => ({
    id: item.nama_tabel,
    label: item.nama_tabel.replace(/^dp_/, ""),
    size: "Potensi",
    items: `${item.length} Data`,
  }));

  const dapotData = Object.fromEntries(dapotDataRaw);
  console.log("Dapot Data:", dapotData);


  const renderContent = () => {
    if (!activeCard) return <h2>Memuat data...</h2>;

    const selectedData = dapotData[activeCard];
    if (!selectedData) return <h2>Data untuk {activeCard} tidak ditemukan.</h2>;

    return (
      <div>
        <div
          id="headertable"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "10px 0",
            marginBottom: "20px",
            borderBottom: "1px solid #eee"
          }}
        >
          <h5 style={{ margin: 0, color: "#333" }}>
            {activeCard.replace(/^dp_/, "").toUpperCase()}
          </h5>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {loading && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginRight: '15px' }}>
                <small style={{ color: '#666', fontSize: '12px' }}>
                  {operationType === 'add' && 'Menambah data...' ||
                   operationType === 'edit' && 'Menyimpan...' ||
                   operationType === 'delete' && 'Menghapus...' ||
                   'Memproses...'}
                </small>
              </div>
            )}
            <button 
              onClick={handleExportExcelWithStyle}
              disabled={exporting || selectedData.length === 0}
              style={{
                padding: '8px 16px',
                border: 'none',
                borderRadius: '4px',
                background: exporting ? '#6c757d' : '#28a745',
                color: 'white',
                cursor: (exporting || selectedData.length === 0) ? 'not-allowed' : 'pointer',
                fontSize: '14px',
                fontWeight: '500',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                opacity: selectedData.length === 0 ? 0.6 : 1
              }}
              title={selectedData.length === 0 ? 'Tidak ada data untuk di-export' : 'Export ke Excel'}
            >
              {exporting ? (
                <>
                  <span>Exporting...</span>
                </>
              ) : (
                <>
                  <i className="bi bi-upload"></i>
                </>
              )}
            </button>
          </div>
        </div>
        <TableDapot 
          data={selectedData} 
          onEdit={handleEdit}
          onAdd={handleAdd}
          onDelete={handleDelete}
          hideColumns={['id']}
        />
      </div>
    );
  };

  return (
    <div className="simain-dashboard-sub-content1-dapot">
      {/* Loader Portal untuk loading utama */}
      <LoaderPortal 
        isVisible={loading && !operationType} 
        text="Memuat data..." 
      />
      
      {/* Loader Portal untuk operasi CRUD */}
      <SmallLoaderPortal 
        isVisible={loading && operationType} 
        text={
          operationType === 'add' && 'Menambah data...' ||
          operationType === 'edit' && 'Menyimpan perubahan...' ||
          operationType === 'delete' && 'Menghapus data...' ||
          'Memproses...'
        }
      />
      
      {/* Loader Portal untuk export */}
      <SmallLoaderPortal 
        isVisible={exporting} 
        text="Mengexport data ke Excel..." 
      />

      <div className="division-selector">
        <div className="division-selector-warper-dapot">
          <div className="division-selector-menu-dapot">
            {cards.map((card) => (
              <div
                id={card.id}
                key={card.id}
                className={`division-card-dapot ${
                  activeCard === card.id ? "active" : ""
                }`}
                onClick={() => setActiveCard(card.id)}
              >
                <div className="card-label-dapot">{card.label}</div>
                <div className="card-info-dapot">
                  {card.size} • {card.items}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="selector-data">
        <div className="selector-data-warper" key={refreshKey}>
          {renderContent()}
        </div>
      </div>

      {showForm && (
        <EditFormPortal
          tableId={activeCard}
          editingRow={editingRow}
          onClose={() => setShowForm(false)}
          onSubmit={handleFormSubmit}
          mode={formMode}
        />
      )}
    </div>
  );
}