import { useState, useEffect } from "react";
import Swal from "sweetalert2";

import {
  RESTRICTED_INPUT_MAX_2,
  RESTRICTED_INPUT_MAX_3,
  REGEX_MAX_2,
  REGEX_MAX_3,
  FORM_TO_INJECT,
  INPUT_TO_INJECT
} from "./constants";

/* ===============================
   HELPER: SweetAlert2 toast kecil
=============================== */
const toastAlert = (message, icon = "success", duration = 2000) => {
  Swal.fire({
    toast: true,
    position: "top-end",
    icon: icon, // 'success', 'error', 'info', 'warning'
    title: message,
    showConfirmButton: false,
    timer: duration,
    timerProgressBar: true,
    background: "#fff",
    color: "#000",
  });
};

export const useFormLogic = (category, onSubmitSuccess) => {
  const [formStructure, setFormStructure] = useState({});
  const [formData, setFormData] = useState({});
  const [errorField, setErrorField] = useState(null);
  const [staffListME, setStaffListME] = useState([]);

  const host = sessionStorage.getItem("host");
  const ttc = sessionStorage.getItem("ttc");
  const userinfo = JSON.parse(sessionStorage.getItem("userinfo") || "{}");

  /* ===============================
     FETCH FORM STRUCTURE + STAFF
  =============================== */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [structRes, staffRes] = await Promise.all([
          fetch(`${host}/api/${ttc}/checklist2/requestTableStructure/${category}`),
          fetch(`${host}/api/user/stafflist/${ttc}/ME`)
        ]);

        const structData = await structRes.json();
        const staffData = await staffRes.json();

        setFormStructure(structData);
        setStaffListME(staffData);

        if (FORM_TO_INJECT.includes(category)) {
          const prefill = {};
          Object.entries(structData).forEach(([tableName, columns]) => {
            prefill[tableName] = {};
            columns.forEach(col => {
              prefill[tableName][col.Field] =
                INPUT_TO_INJECT.includes(col.Field)
                  ? col.latestValue || ""
                  : "";
            });
          });
          setFormData(prefill);
        }
      } catch (err) {
        console.error("Fetch Error:", err);
        toastAlert("Gagal memuat form", "error");
      }
    };

    if (host && ttc && category) {
      fetchData();
    }
  }, [category, host, ttc]);

  /* ===============================
     VALIDATION
  =============================== */
  const validateField = (name, value) => {
    if (!value) return true;
    if (RESTRICTED_INPUT_MAX_2.includes(name)) return REGEX_MAX_2.test(value);
    if (RESTRICTED_INPUT_MAX_3.includes(name)) return REGEX_MAX_3.test(value);
    return true;
  };

  /* ===============================
     HANDLE CHANGE
  =============================== */
  const handleChange = (table, field, value) => {
    setFormData(prev => {
      const updated = {
        ...prev,
        [table]: {
          ...prev[table],
          [field]: value
        }
      };

      sessionStorage.setItem(
        `dataceklist-${category}`,
        JSON.stringify(updated)
      );

      return updated;
    });

    if (!validateField(field, value)) {
      setErrorField(`${table}_${field}`);
    } else {
      setErrorField(null);
    }
  };

  /* ===============================
     HANDLE SUBMIT
  =============================== */
  const handleSubmit = async (noReportExternal) => {
    let firstError = null;

    for (const [table, fields] of Object.entries(formData)) {
      for (const [field, val] of Object.entries(fields)) {
        if (!validateField(field, val)) {
          firstError = `${table}_${field}`;
          break;
        }
      }
      if (firstError) break;
    }

    if (firstError) {
      setErrorField(firstError);
      toastAlert("Format angka salah", "error");
      return;
    }

    const reportProperty = JSON.parse(
      sessionStorage.getItem("report_property") || "{}"
    );

    let payload;
    let endpoint;

    if (category === "staffform") {
      payload = formData;
      endpoint = "cereateReportID";
    } else {
      payload = {
        ...formData,
        no_report: noReportExternal || reportProperty.no_report,
        report_type: reportProperty.report_type
      };
      endpoint = "cereateReport";
    }

    try {
      const res = await fetch(
        `${host}/api/${ttc}/checklist2/${endpoint}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-User-Info": JSON.stringify(userinfo)
          },
          body: JSON.stringify(payload)
        }
      );

      const result = await res.json();

      if (!res.ok) {
        console.error("Server Error:", result);
        toastAlert(
          result.debug?.error ||
          result.message ||
          "Gagal simpan data",
          "error"
        );
        return;
      }

      toastAlert("Data tersimpan", "success");

      onSubmitSuccess?.(result);

    } catch (err) {
      console.error("Network Error:", err);
      toastAlert("Koneksi terputus", "error");
    }
  };

  return {
    formStructure,
    formData,
    staffListME,
    errorField,
    handleChange,
    handleSubmit
  };
};
