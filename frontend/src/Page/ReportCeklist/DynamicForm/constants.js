export const RESTRICTED_INPUT_MAX_2 = ["RTrafo", "RGenset", "RBattery", "RKontrol", "RRan", "RTransmissi", "RCore", "NG", "PF", "aV", "bV", "cV", "dV", "Suhu", "Kelembaban"];
export const RESTRICTED_INPUT_MAX_3 = ["R", "S", "T", "L1N", "L2N", "L3N", "R1N", "R2N", "R3N", "kw", "kva", "aA", "bA", "cA", "dA", "bp", "kvar", "TotalLoad", "RN", "SN", "TN"];
export const FORM_TO_INJECT = ["it_load", "power", "genset1", "genset2", "load_trafo", "property", "coling_system", "dcpdu_1", "dcpdu_2", "dcpdu_3", "dcpdu_4","trafof_c"];
export const INPUT_TO_INJECT = ["GensetTotal","PACTotal","RECTotal","UPSTotal","GensetF","PACF","RECF","UPSF","noDCPDU","battery","runtime","A","noDCPDU","source","Brand", "Nama", "BebanTotal", "CapsRec", "hours_mater", "Status", "NG", "PF", "TrafoCaps", "no", "brand", "type", "Tipe","Suhu", "Kelembaban","SetPoint","aV","bV","cV","dV","aA","bA","cA","dA","kw","kva","TotalLoad"];
export const FORM_TO_LOCK = ["GensetTotal","PACTotal","RECTotal","UPSTotal","noDCPDU","source","Brand", "Nama", "BebanTotal", "TrafoCaps", "no", "brand", "type", "SetPoint", "Tipe","battery","runtime","A",];
export const SELECT_OPTIONS = {
  jenis_report: ["Ceklist", "KWH & Suhu", "Genset1", "Genset2"],
  prosses: ["Auto Reharsal", "Manual Reharsal", "PLN Off"],
  Cuaca: ["Cerah", "Hujan", "Mendung"],
  Status: ["On", "Off", "Standby"]
};
export const STAFF_SELECT_FIELDS = ["petugasME", "petugasME2", "petugasME3", "petugasME4"];
export const REGEX_MAX_2 = /^\d{1,2}(\.\d+)?$/;
export const REGEX_MAX_3 = /^\d{1,3}(\.\d+)?$/;