// src/api/auth.js

// 🔹 property global (di luar function)
// const API_HOST = "https://azure-beaver-930369.hostingersite.com";
const API_HOST = "http://127.0.0.1:8000";
const TTC_CODE = "ttc_teling";

export function sitesaperator(site) {
  const normalized = String(site || "")
    .trim()
    .toLowerCase();

  const map = {
    "TTC Teling": "ttc_teling",
    "TTC Paniki": "ttc_paniki",
  };

  console.log("sitesaperator input:", site, "normalized:", normalized, "mapped to:", map[normalized] || normalized.replace(/\s+/g, "_"));

  return map[normalized] || normalized.replace(/\s+/g, "_");
}


export async function loginRequest(username, password) {
  // simpan config global
  sessionStorage.setItem("host", API_HOST);
  sessionStorage.setItem("ttc", TTC_CODE);

  const res = await fetch(`${API_HOST}/api/user/login/try`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
    credentials: "include",
  });

  let data = {};
  try {
    data = await res.json();
  } catch {
    data = {};
  }

  if (!res.ok) {
    throw new Error(data.message || "Login gagal, cek username/password");
  }

  sessionStorage.setItem("userinfo", JSON.stringify(data.data));
  return data.data;
}

// ================= DAILY ACTIVITY LIST =================
export async function fetchDailyActivityList(month = "") {
  const host = sessionStorage.getItem("host") || API_HOST;
  const ttc = sessionStorage.getItem("ttc") || TTC_CODE;

  // Jika month ada isinya, tambahkan '/' di depannya, jika tidak kosongkan
  const monthPath = month ? `/${month}` : "";
  const url = `${host}/api/${ttc}/checklist2/dialyActivityList${monthPath}`;

  const res = await fetch(url, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });

  let data = {};
  try {
    data = await res.json();
  } catch {
    data = {};
  }

  if (!res.ok) {
    throw new Error(data.message || "Gagal fetch daily activity list");
  }

  return data;
}

// ===============================
// FETCH DAPOT
// ===============================
export async function fetchDapot() {
  const host = sessionStorage.getItem("host") || API_HOST;
  const ttc = sessionStorage.getItem("ttc") || TTC_CODE;
  const urlTest = `${host}/api/${ttc}/data_potensi2/fullDapot`;
  console.log("Fetching Dapot from URL:", urlTest);
  const res = await fetch(`${host}/api/${ttc}/data_potensi2/fullDapot`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });

  let data = {};
  try {
    data = await res.json();
  } catch {
    data = {};
  }

  if (!res.ok) throw new Error(data.message || "Gagal fetch data potensi");

  // pastikan selalu return { data_potesi_list, datapotensi }
  return {
    data_potesi_list: data.data_potesi_list || [],
    datapotensi: data.datapotensi || {},
  };
}

// ===============================
// CRUD DAPOT
// ===============================
// export async function crudDapot(payload) {
//   const host = sessionStorage.getItem("host") || API_HOST;
//   const ttc = sessionStorage.getItem("ttc") || TTC_CODE;

//   const res = await fetch(`${host}/api/${ttc}/data_potensi2/crudDapot`, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify(payload),
//   });

//   let data = {};
//   try {
//     data = await res.json();
//   } catch {
//     data = {};
//   }

//   if (!res.ok) throw new Error(data.message || "Gagal melakukan operasi CRUD");

//   return data;
// }

//for debugung
export async function crudDapot(payload) {
  const host = sessionStorage.getItem("host") || API_HOST;
  const ttc = sessionStorage.getItem("ttc") || TTC_CODE;

  try {
    const res = await fetch(`${host}/api/${ttc}/data_potensi2/crudDapot`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    let data = {};
    try {
      data = await res.json();
    } catch (e) {
      console.log("Response bukan JSON:", e);
      data = {};
    }

    if (!res.ok) {
      console.log("Error dari backend:", data);
      throw new Error(data.message || `Gagal melakukan operasi CRUD (status ${res.status})`);
    }

    return data;
  } catch (err) {
    console.log("Terjadi error fetch:", err);
    throw err; // tetap lempar biar bisa ditangkap di tempat pemanggilan
  }
}

//for debunging



// ===============================
// FETCH ACTIVITY LOG
// ===============================
export async function fetchActivityLog() {
  const host = sessionStorage.getItem("host") || API_HOST;
  const ttc = sessionStorage.getItem("ttc") || TTC_CODE;

  const res = await fetch(`${host}/api/${ttc}/activitylog/`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include", // jika endpoint butuh session
  });

  let data = {};
  try {
    data = await res.json();
  } catch {
    data = {};
  }

  if (!res.ok) {
    throw new Error(data.message || "Gagal fetch activity log");
  }

  return data.data || []; // selalu return array aktivitas
}

// ===============================
// FETCH ISSUE LIST
// ===============================
export async function fetchIssues() {
  const host = sessionStorage.getItem("host") || API_HOST;
  const ttc = sessionStorage.getItem("ttc") || TTC_CODE;

  const res = await fetch(`${host}/api/${ttc}/issue/`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include", // kalau butuh session
  });

  let data = {};
  try {
    data = await res.json();
  } catch {
    data = {};
  }

  if (!res.ok) {
    throw new Error(data.message || "Gagal fetch issue list");
  }

  return data.data || []; // selalu return array
}

// ===============================
// UPDATE ISSUE STATUS
// ===============================
export async function updateIssue(issue) {
  const host = sessionStorage.getItem("host") || API_HOST;
  const ttc = sessionStorage.getItem("ttc") || TTC_CODE;
  const userinfo = JSON.parse(sessionStorage.getItem("userinfo") || "{}");

  const res = await fetch(`${host}/api/${ttc}/issue/update/${issue.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "X-User-Info": JSON.stringify(userinfo),
    },
    body: JSON.stringify({
      status: issue.status,
      keterangan: issue.keterangan,
    }),
  });

  let data = {};
  try {
    data = await res.json();
  } catch {
    data = {};
  }

  if (!res.ok) {
    throw new Error(data.message || "Gagal update issue");
  }

  return data;
}


// ===============================
// ADD ISSUE
// ===============================
export async function addIssue(issue) {
  const host = sessionStorage.getItem("host") || API_HOST;
  const ttc = sessionStorage.getItem("ttc") || TTC_CODE;
  const userinfo = JSON.parse(sessionStorage.getItem("userinfo") || "{}");

  const res = await fetch(`${host}/api/${ttc}/issue/add`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-User-Info": JSON.stringify(userinfo),
    },
    body: JSON.stringify(issue),
  });

  let data = {};
  try {
    data = await res.json();
  } catch {
    data = {};
  }

  if (!res.ok) {
    throw new Error(data.message || "Gagal menambahkan issue");
  }

  return data;
}

//List Buku Tamu
export async function fetchRecentVisitors(month = null) {
  const host = sessionStorage.getItem("host");
  const ttc = sessionStorage.getItem("ttc");

  if (!host || !ttc) {
    throw new Error("Host atau TTC belum tersedia di session");
  }

  // build query param (optional)
  const query = month ? `?month=${encodeURIComponent(month)}` : "";

  const res = await fetch(
    `${host}/api/${ttc}/visitor/visitors/completed${query}`
  );

  const data = await res.json();

  if (!data.success) {
    throw new Error(data.message || "Gagal fetch data visitor");
  }

  return data.data;
}


// BankPass
export async function fetchBankPasswords() {
  const host = sessionStorage.getItem("host");
  const ttc = sessionStorage.getItem("ttc");

  if (!host || !ttc) {
    throw new Error("Host atau TTC belum tersedia di session");
  }

  const res = await fetch(`${host}/api/${ttc}/bank_password/list`);
  const data = await res.json();

  if (data.status !== "success") {
    throw new Error(data.message || "Gagal fetch bank password");
  }

  return data.data;
}


// auth.js

export async function fetchSummaryPUE({
  type = "pac",
  startDate = null,
  endDate = null,
}) {
  const host = sessionStorage.getItem("host");
  const ttc = sessionStorage.getItem("ttc");

  if (!host || !ttc) {
    throw new Error("Host atau TTC belum tersedia di session");
  }

  // base endpoint
  let url = `${host}/api/${ttc}/summary_pue/data_report/${type}`;

  // kalau pakai range tanggal
  if (startDate && endDate) {
    url += `/${startDate}/${endDate}`;
  }

  const res = await fetch(url);
  const data = await res.json();

  if (!res.ok || data?.success === false) {
    throw new Error(data?.message || "Gagal fetch summary PUE");
  }

  // support response array atau { success, data }
  return data?.data ?? data;
}


///Pull report by ID
// ===============================
// FETCH REPORT DETAIL
// ===============================
export async function fetchReportDetail(id, reportType) {
  const host = sessionStorage.getItem("host") || API_HOST;
  const ttc = sessionStorage.getItem("ttc") || TTC_CODE;

  if (!id || !reportType) {
    throw new Error("ID report atau reportType tidak valid");
  }

  const res = await fetch(
    `${host}/api/${ttc}/checklist2/pullreport/${id}/${reportType}`,
    { method: "GET" }
  );

  let data = {};
  try {
    data = await res.json();
  } catch {
    data = {};
  }

  if (!res.ok || data.success === false) {
    throw new Error(data.message || "Gagal mengambil data report");
  }

  return data; // { success, data }
}



///untuk ceklist dan formnya
// ===============================
// CHECKLIST API (tambahan)
// ===============================

// auth.js
export const getBaseConfig = () => {
  const host = sessionStorage.getItem("host");
  const ttc = sessionStorage.getItem("ttc");
  const userinfo = JSON.parse(sessionStorage.getItem("userinfo") || "{}");
  
  return { host, ttc, userinfo };
};

export async function fetchChecklistStructure(category) {
  const { host, ttc } = getBaseConfig();

  const res = await fetch(
    `${host}/api/${ttc}/checklist2/requestTableStructure/${category}`
  );

  if (!res.ok) throw new Error("Gagal ambil struktur checklist");
  return res.json();
}

export async function fetchStaffListME() {
  const { host, ttc } = getBaseConfig();

  const res = await fetch(
    `${host}/api/user/stafflist/${ttc}/ME`
  );

  if (!res.ok) throw new Error("Gagal ambil staff ME");
  return res.json();
}

export async function submitChecklistData(endpoint, payload) {
  const { host, ttc, userinfo } = getBaseConfig();

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

  const data = await res.json();
  if (!res.ok) throw data;
  return data;
}





// ================= USER PROFILE FUNCTIONS =================

export async function fetchUserData(userId) {
    const host = sessionStorage.getItem("host") || API_HOST;
    const ttc = sessionStorage.getItem("ttc") || TTC_CODE;
    
    const res = await fetch(`${host}/api/user/${userId}`);
    if (!res.ok) throw new Error("Gagal mengambil data user");
    return await res.json();
}

export async function saveUserProfile(userId, formDataPayload) {
    const host = sessionStorage.getItem("host") || API_HOST;
    const ttc = sessionStorage.getItem("ttc") || TTC_CODE;

    if (userId) formDataPayload.append("_method", "PUT");

    const url = userId
        ? `${host}/api/user/${userId}`
        : `${host}/api/user`;

    const res = await fetch(url, {
        method: "POST",
        body: formDataPayload,
    });
    
    if (!res.ok) throw new Error("Gagal menyimpan profil");
    return await res.json();
}

export async function checkOldPassword(userId, passwordLama) {
    const host = sessionStorage.getItem("host") || API_HOST;
    const ttc = sessionStorage.getItem("ttc") || TTC_CODE;

    const res = await fetch(`${host}/api/user/cekpass`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: userId, password: passwordLama }),
    });
    
    return await res.json();
}

export async function updateNewPassword(userId, passwordBaru) {
    const host = sessionStorage.getItem("host") || API_HOST;
    const ttc = sessionStorage.getItem("ttc") || TTC_CODE;

    const res = await fetch(`${host}/api/user/${userId}/update-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: userId, newpass: passwordBaru }),
    });

    if (!res.ok) throw new Error("Gagal update password");
    return await res.json();
}

//Fetch From Profile============================================================


export async function fetchResumeProfile(host, ttc) {
  if (!host || !ttc) {
    throw new Error("Host atau TTC belum tersedia");
  }

  const res = await fetch(`${host}/api/${ttc}/profiles`);

  if (!res.ok) {
    throw new Error(`HTTP Error ${res.status}`);
  }

  const json = await res.json();

  if (!json.success) {
    throw new Error(json.message || "API Error");
  }

  return json.data;
}



//fetch Realtime Dashboard-----------------------------------------
// auth.js
export async function fetchMonitoringData(host, ttc) {
    if (!host || !ttc) return null;

    try {
        const res = await fetch(`${host}/api/${ttc}/monitoring/data`);
        const data = await res.json();

        if (data.status !== "success") {
            throw new Error("Status not success");
        }

        return data;
    } catch (error) {
        console.error("fetchMonitoringData error:", error);
        return null;
    }
}


