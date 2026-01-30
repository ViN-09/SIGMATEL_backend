import React from "react";

/* ======================================================
   HELPERS
====================================================== */
const dash = (v) =>
    v === null || v === undefined || v === "" ? "-" : v;

const formatTanggal = (tanggal) => {
    if (!tanggal) return "-";
    const d = new Date(tanggal);
    const hari = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
    const bulan = [
        "Januari", "Februari", "Maret", "April", "Mei", "Juni",
        "Juli", "Agustus", "September", "Oktober", "November", "Desember"
    ];
    return `${hari[d.getDay()]}, ${d.getDate()} ${bulan[d.getMonth()]} ${d.getFullYear()}`;
};

const GenOnDurasi = (start, off) => {
    if (!start || !off) return "-";

    // ambil HH:MM dari string waktu apapun
    const extractHM = (s) => {
        if (typeof s !== "string") return null;
        const m = s.match(/([01]?\d|2[0-3]):([0-5]\d)/);
        if (!m) return null;
        return `${m[1].padStart(2, "0")}:${m[2].padStart(2, "0")}`;
    };

    const sTime = extractHM(start);
    const oTime = extractHM(off);
    if (!sTime || !oTime) return "-";

    // pecah jam & menit
    const [sh, sm] = sTime.split(":").map(Number);
    const [oh, om] = oTime.split(":").map(Number);

    let diffMs = new Date(1970, 0, 1, oh, om) - new Date(1970, 0, 1, sh, sm);

    // urutan kebalik atau lewat tengah malam
    if (diffMs < 0 && Math.abs(diffMs) < 12 * 60 * 60 * 1000) {
        diffMs = Math.abs(diffMs);
    } else if (diffMs < 0) {
        diffMs += 24 * 60 * 60 * 1000;
    }

    const diffMenit = Math.floor(diffMs / 60000);
    const jam = Math.floor(diffMenit / 60);
    const menit = diffMenit % 60;

    if (jam > 0 && menit > 0) return `${jam} Jam ${menit} Menit`;
    if (jam > 0) return `${jam} Jam`;
    return `${menit} Menit`;
};

const formatTime = (input) => {
    if (!input) return "-";

    if (typeof input !== "string") input = String(input);

    // Cari pola HH:MM di mana pun di dalam string
    const match = input.match(/([01]?\d|2[0-3]):([0-5]\d)/);
    if (!match) return "-";

    const hh = match[1].padStart(2, "0");
    const mm = match[2].padStart(2, "0");

    return `${hh}:${mm}`;
};


const upsOcc = (kva, cap) =>
    kva && cap ? ((kva / cap) * 100).toFixed(2) : "-";

const recOcc = (load, total) =>
    load && total ? ((load / total) * 100).toFixed(2) : "-";

const totalSolar = (...vals) =>
    vals.reduce((a, b) => a + (Number(b) || 0), 0).toFixed(2);

const solarOcc = (total) =>
    ((total / 22500) * 100).toFixed(2);

const backupTime = (total) =>
    (total / 50).toFixed(2);

/* ======================================================
   REPORT TELING
====================================================== */

export function ReportCeklist({ data }) {
    const lv1 = data?.report_lvmdp1 || {};
    const lv2 = data?.report_lvmdp2 || {};
    const load_trafo = data?.load_trafo || {};
    const info = data?.report_info || {};
    const kwh = data?.report_kwh || {};
    const suhu = data?.report_suhu || {};
    const trafof_c = data?.trafof_c || {};
    const rec1 = data?.rec1 || {};
    const rec2 = data?.rec2 || {};
    const rec3 = data?.rec3 || {};
    const rec4 = data?.rec4 || {};
    const rec5 = data?.rec5 || {};
    const rec6 = data?.rec6 || {};
    const rec7 = data?.rec7 || {};
    const rec8 = data?.rec8 || {};
    const rec9 = data?.rec9 || {};
    const rec10 = data?.rec10 || {};
    const ups1 = data?.ups1 || {};
    const ups2 = data?.ups2 || {};
    const dcpdu_1 = data?.dcpdu_1 || {};
    const dcpdu_2 = data?.dcpdu_2 || {};
    const dcpdu_3 = data?.dcpdu_3 || {};
    const dcpdu_4 = data?.dcpdu_4 || {};
    const pac1 = data?.pac1 || {};
    const pac2 = data?.pac2 || {};
    const pac3 = data?.pac3 || {};
    const pac4 = data?.pac4 || {};
    const pac5 = data?.pac5 || {};
    const pac6 = data?.pac6 || {};
    const pac7 = data?.pac7 || {};
    const pac8 = data?.pac8 || {};
    const pac9 = data?.pac9 || {};
    const pac10 = data?.pac10 || {};
    const genset1 = data?.genset.genset1 || {};
    const genset2 = data?.genset.genset2 || {};
    const apiDate = info.date_time ? new Date(info.date_time) : new Date();

    const tanggal = apiDate.toLocaleDateString("id-ID", {
        weekday: "long",
        day: "2-digit",
        month: "long",
        year: "numeric",
    });

    const waktu = apiDate.toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
    });

    const totalSolarVal = totalSolar(
        genset1.liter_bulanan,
        genset1.liter_harian,
        genset2.liter_bulanan,
        genset2.liter_harian
    );

    return (
        <pre>{`
            *Site : TTC TELING*
ME Standby
${Array.from({ length: 4 }, (_, i) => {
            const name = info[`petugasME${i === 0 ? "" : i + 1}`];
            const phone = info[`petugasME${i === 0 ? "" : i + 1}Phone`];
            return name ? ` - ${name}${phone ? " / " + phone : ""}` : null;
        })
                .filter(Boolean)
                .join("\n") || "-"}

 


Report Checklist Harian TTC Teling
Hari/Tanggal: ${tanggal}
Pukul: ${waktu} WITA

BP    : ${kwh.bp ?? "-"}
LBP   : ${kwh.lbp ?? "-"}
TOTAL : ${kwh.total ?? "-"}
KVA   : ${kwh.kvar ?? "-"}


Capacity Trafo ${trafof_c.TrafoCaps ?? "-"} KVA
Genset Failed/Total : ${trafof_c.GensetF ?? "-"}/${trafof_c.GensetTotal ?? "-"}
PAC Failled/Total : ${trafof_c.PACF ?? "-"}/${trafof_c.PACTotal ?? "-"}
Rect Failed /Total : ${trafof_c.RECF ?? "-"}/${trafof_c.RECTotal ?? "-"}
UPS Failed/Total : ${trafof_c.UPSF ?? "-"}/${trafof_c.UPSTotal ?? "-"}
---------------------------------------------
Ruang A3 (Lt1)
PAC Type : RCG 60 KW 2 UNIT
${pac1.Nama ?? "-"} : ${pac1.Status ?? "-"}
Setpoint : ${pac1.SetPoint ?? "-"}
Suhu :  ${pac1.Suhu ?? "-"}/${pac1.Kelembaban ?? "-"} %
${pac2.Nama ?? "-"} : ${pac2.Status ?? "-"}
Setpoint : ${pac2.SetPoint ?? "-"}
Suhu : ${pac2.Suhu ?? "-"}/${pac2.Kelembaban ?? "-"} %


UPS ${ups1.no ?? "-"} ${ups1.brand ?? "-"} ${ups1.type ?? "-"} KVA
LOAD
- ${ups1.A ?? "-"} A
- ${ups1.kw ?? "-"} KW/${upsOcc(ups1.kva, ups1.type)} %
- ${ups1.kva ?? "-"} KVA
- Battery : ${ups1.battery ?? "-"} V/100%
UPS ${ups2.no ?? "-"} ${ups2.brand ?? "-"} ${ups2.type ?? "-"} KVA
LOAD
- ${ups2.A ?? "-"} A
- ${ups2.kw ?? "-"} KW/${upsOcc(ups2.kva, ups2.type)} %
- ${ups2.kva ?? "-"} KVA
- Battery : ${ups2.battery ?? "-"} V/100%

Update Rectifier :
${rec1.Nama ?? "-"}
Bus Voltage : ${rec1.CapsRec ?? "-"} V
Load Curr : ${rec1.TotalLoad ?? "-"} A
Occupancy : ${recOcc(rec1.TotalLoad, rec1.BebanTotal)} %
Total modul 24
${rec2.Nama ?? "-"}
Bus Voltage : ${rec2.CapsRec ?? "-"} V
Load Curr : ${rec2.TotalLoad ?? "-"} A
Occupancy : ${recOcc(rec2.TotalLoad, rec2.BebanTotal)} %
Total modul 24
${rec3.Nama ?? "-"}
Bus Voltage : ${rec3.CapsRec ?? "-"} V
Load Curr : ${rec3.TotalLoad ?? "-"} A
Occupancy : ${recOcc(rec3.TotalLoad, rec3.BebanTotal)} %
Total modul 24
${rec4.Nama ?? "-"}
Bus Voltage : ${rec4.CapsRec ?? "-"} V
Load Curr : ${rec4.TotalLoad ?? "-"} A
Occupancy : ${recOcc(rec4.TotalLoad, rec4.BebanTotal)} %
Total modul 24
${rec5.Nama ?? "-"}
Bus Voltage : ${rec5.CapsRec ?? "-"} V
Load Curr : ${rec5.TotalLoad ?? "-"} A
Occupancy : ${recOcc(rec5.TotalLoad, rec5.BebanTotal)} %
Total modul 24
${rec6.Nama ?? "-"}
Bus Voltage : ${rec6.CapsRec ?? "-"} V
Load Curr : ${rec6.TotalLoad ?? "-"} A
Occupancy : ${recOcc(rec6.TotalLoad, rec6.BebanTotal)} %
Total modul 24
${rec7.Nama ?? "-"}
Bus Voltage : ${rec7.CapsRec ?? "-"} V
Load Curr : ${rec7.TotalLoad ?? "-"} A
Occupancy : ${recOcc(rec7.TotalLoad, rec7.BebanTotal)} %
Total modul 24
${rec8.Nama ?? "-"}
Bus Voltage : ${rec8.CapsRec ?? "-"} V
Load Curr : ${rec8.TotalLoad ?? "-"} A
Occupancy : ${recOcc(rec8.TotalLoad, rec8.BebanTotal)} %
Total modul 24
${rec9.Nama ?? "-"}
Bus Voltage : ${rec9.CapsRec ?? "-"} V
Load Curr : ${rec9.TotalLoad ?? "-"} A
Occupancy : ${recOcc(rec9.TotalLoad, rec9.BebanTotal)} %
Total modul 24

Tekanan FM200
Tabung 1 : 25 Bar/360 Psi/70 °F

Suhu Ruangan : ${suhu.RBattery ?? "-"} °C
---------------------------------------------
Ruang A4 (lt1)
PAC Type : RCG 60 KW 2 UNIT
${pac3.Nama ?? "-"} : ${pac3.Status ?? "-"}
Setpoint : ${pac3.SetPoint ?? "-"}
Suhu : ${pac3.Suhu ?? "-"}/${pac3.Kelembaban ?? "-"} %
${pac4.Nama ?? "-"} : ${pac4.Status ?? "-"}
Setpoint : ${pac4.SetPoint ?? "-"}
Suhu : ${pac4.Suhu ?? "-"}/${pac4.Kelembaban ?? "-"} %

Tekanan FM200
Tabung 1 : 24 Bar/350 Psi/60 °F

DCPDU ${dcpdu_1.noDCPDU ?? "-"}
Source
Voltage/Load
Group A : ${dcpdu_1.aV ?? "-"}/${dcpdu_1.aA ?? "-"}
Group B : ${dcpdu_1.bV ?? "-"}/${dcpdu_1.bA ?? "-"}
Group C : ${dcpdu_1.cV ?? "-"}/${dcpdu_1.cA ?? "-"}
Group D : ${dcpdu_1.dV ?? "-"}/${dcpdu_1.dA ?? "-"}

Suhu Ruangan : ${suhu.RRan ?? "-"} °C
---------------------------------------------
Ruang B2 (lt2)
PAC Type : RCG 30 KW 2 UNIT
${pac9.Nama ?? "-"} : ${pac9.Status ?? "-"}
Setpoint : ${pac9.SetPoint ?? "-"}
Suhu : ${pac9.Suhu ?? "-"}/${pac9.Kelembaban ?? "-"} %
${pac10.Nama ?? "-"} : ${pac10.Status ?? "-"}
Setpoint : ${pac10.SetPoint ?? "-"}
Suhu : ${pac10.Suhu ?? "-"}/${pac10.Kelembaban ?? "-"} %
Tekanan FM200
Tabung 1 : 25 Bar/360 psi/70 °F

Suhu Ruangan : ${suhu.RTransmissi ?? "-"} °C
---------------------------------------------
Ruang B4 (lt2)
PAC Type : RCG 60 KW 4 UNIT
${pac5.Nama ?? "-"} : ${pac5.Status ?? "-"}
Setpoint : ${pac5.SetPoint ?? "-"}
Suhu : ${pac5.Suhu ?? "-"}/${pac5.Kelembaban ?? "-"} %
${pac6.Nama ?? "-"} : ${pac6.Status ?? "-"}
Setpoint : ${pac6.SetPoint ?? "-"}
Suhu : ${pac6.Suhu ?? "-"}/${pac6.Kelembaban ?? "-"} %
${pac7.Nama ?? "-"} : ${pac7.Status ?? "-"}
Setpoint : ${pac7.SetPoint ?? "-"}
Suhu : ${pac7.Suhu ?? "-"}/${pac7.Kelembaban ?? "-"} %
${pac8.Nama ?? "-"} : ${pac8.Status ?? "-"}
Setpoint : ${pac8.SetPoint ?? "-"}
Suhu : ${pac8.Suhu ?? "-"}/${pac8.Kelembaban ?? "-"} %

Tekanan FM200
Tabung 1 : 25 Bar/360 psi/70 °F
Tabung 2 : 25 Bar/360 psi/70 °F

DCPDU ${dcpdu_2.noDCPDU ?? "-"}
Source
Voltage/Load
Group A : ${dcpdu_2.aV ?? "-"}/${dcpdu_2.aA ?? "-"}
Group B : ${dcpdu_2.bV ?? "-"}/${dcpdu_2.bA ?? "-"}
DCPDU ${dcpdu_3.noDCPDU ?? "-"}
Source
Voltage/Load
Group A : ${dcpdu_3.aV ?? "-"}/${dcpdu_3.aA ?? "-"}
Group B : ${dcpdu_3.bV ?? "-"}/${dcpdu_3.bA ?? "-"}
DCPDU ${dcpdu_4.noDCPDU ?? "-"}
Source
Voltage/Load
Group A : ${dcpdu_4.aV ?? "-"}/${dcpdu_4.aA ?? "-"}
Group B : ${dcpdu_4.bV ?? "-"}/${dcpdu_4.bA ?? "-"}

Suhu Ruangan : ${suhu.RCore ?? "-"} °C
---------------------------------------------
Ruang Genset
LVMDP 1
R-S/R-N : ${lv1.RS ?? "-"}/${lv2.RN ?? "-"} V
R-T/S-N : ${lv1.ST ?? "-"}/${lv2.SN ?? "-"} V
S-T/T-N : ${lv1.TR ?? "-"}/${lv2.TN ?? "-"} V
Arester : Baik
Load LVMPD 1
R : ${lv1.R ?? "-"} A
S : ${lv1.S ?? "-"} A
T : ${lv1.T ?? "-"} A
KW : ${lv1.kw ?? "-"}
KVA: ${lv1.kva ?? "-"}
CosQ: ${load_trafo.PF ?? "-"}

LVMDP 2
R-S/R-N : ${lv2.RS ?? "-"}/${lv2.RN ?? "-"} V
R-T/S-N : ${lv2.ST ?? "-"}/${lv2.SN ?? "-"} V
S-T/T-N : ${lv2.TR ?? "-"}/${lv2.TN ?? "-"} V
Arester : Baik
Load LVMDP 2
R : ${lv2.R ?? "-"} A
S : ${lv2.S ?? "-"} A
T : ${lv2.T ?? "-"} A
KW : ${lv2.kw ?? "-"}
KVA : ${lv2.kva ?? "-"}

Genset
Genset 01 : 500 KVA
Genset 02 : 2X350 KVA
Genset 01 (Standby Auto)
Genset 02 (Standby Auto)
SMU Genset 1 : ${genset1.hours_mater ?? "-"}
Suhu Genset 1 :  ${genset1.suhu ?? "-"} °C
SMU Genset 2A : ${genset2.hours_mater1 ?? "-"}
Suhu Genset 2A:  ${genset2.suhu ?? "-"} °C
SMU Genset 2B :  ${genset2.hours_mater2 ?? "-"}
Suhu Genset 2B: ${genset2.suhu ?? "-"} °C
Level Tangki bulanan 1 (10.000L): ${genset1.liter_bulanan ?? "-"} L
Level Tangki harian 1 (1500L) : ${genset1.liter_harian ?? "-"} L
Level Tangki bulanan 2 (10.000L): ${genset2.liter_bulanan ?? "-"} L
Level Tangki harian 2 (1000L) : ${genset2.liter_harian ?? "-"} L
Total Solar : ${totalSolar(genset1.liter_bulanan, genset1.liter_harian, genset2.liter_bulanan, genset2.liter_harian)} L
Occupancy BBM : ${solarOcc(totalSolar(genset1.liter_bulanan, genset1.liter_harian, genset2.liter_bulanan, genset2.liter_harian))} %
Backup time : ${backupTime(totalSolar(genset1.liter_bulanan, genset1.liter_harian, genset2.liter_bulanan, genset2.liter_harian))} Jam


Suhu Ruangan: 29.0 °C
---------------------------------------------
AC Portable
Lantai 1 : 5.1 KW 
Lantai 2 : 5.1 KW 
Kondisi Terakhir Rehersal Genset
Genset 1 : ${formatTanggal(genset1.date)}
Genset 2 : ${formatTanggal(genset2.date)}
`}</pre>
    );
}

export function ReportSuhuKwh({ data }) {
    const info = data?.report_info || {};
    const kwh = data?.report_kwh || {};
    const suhu = data?.report_suhu || {};
    const trafof_c = data?.trafof_c || {};

    const apiDate = info.date_time ? new Date(info.date_time) : new Date(); // <-- Tambahkan ini

    const tanggal = apiDate.toLocaleDateString("id-ID", {
        weekday: "long",
        day: "2-digit",
        month: "long",
        year: "numeric",
    });

    const waktu = apiDate.toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
    });
    return (
        <pre>{`
            
Report Kwh dan Suhu TTC Teling
Hari/Tanggal: ${tanggal}
Pukul: ${waktu} WITA

STATUS
PLN    : On
Genset : 3 Standby

KWH
BP    : ${kwh.bp ?? "-"}
LBP   : ${kwh.lbp ?? "-"}
TOTAL : ${kwh.total ?? "-"}
KVA   : ${kwh.kvar ?? "-"}

Suhu
R. Trafo        : ${suhu.RTrafo ?? "-"}
R. Genset       : ${suhu.RGenset ?? "-"}
R. Ran          : ${suhu.RRan ?? "-"}
R. Control      : ${suhu.RKontrol ?? "-"}
R. Battery      : ${suhu.RBattery ?? "-"}
R. Transmissi   : ${suhu.RTransmissi ?? "-"}
R. Core         : ${suhu.RCore ?? "-"}

ME :
${[info.petugasME, info.petugasME2, info.petugasME3, info.petugasME4]
                    .filter(Boolean)
                    .map((n) => ` - ${n}`)
                    .join("\n") || "-"}

Cuaca : ${trafof_c.Cuaca ?? "-"}
${info.catatan ? "\n" + info.catatan : "\nPower dan suhu ruangan aman."}

`}</pre>
    );
}

export function ReportGenset1({ data }) {
    const genset1 = data?.genset.genset1 || {};
    const info = data?.report_info || {};
    const apiDate = info.date_time ? new Date(info.date_time) : new Date();

    const tanggal = apiDate.toLocaleDateString("id-ID", {
        weekday: "long",
        day: "2-digit",
        month: "long",
        year: "numeric",
    });

    const waktu = apiDate.toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
    });


    return (
        <pre>{`
BERITA ACARA RUNING G1

Petugas ME:
${info.petugasME ?? "-"}/${info.petugasME2 ?? "-"}

Proses: ${genset1.prosses ?? "-"}

Gedung: TTC Teling
Hari/Tanggal: ${formatTanggal(genset1.date)}

Running Time(WITA)
Genset On : ${formatTime(genset1.gen_on) ?? "-"}
Genset Off : ${formatTime(genset1.gen_off) ?? "-"}
Durasi : ${GenOnDurasi(genset1.gen_on, genset1.gen_off,)}

Level BBM(Liter)
Tanki Bulanan Genset 1: ${genset1.liter_bulanan ?? "-"} L
Tanki Harian Genset 1: ${genset1.liter_harian ?? "-"} L

Suhu: ${genset1.suhu ?? "-"} °C

Hours Matter : ${genset1.hours_mater ?? "-"}
`}</pre>
    );
}

export function ReportGenset2({ data }) {
    const genset2 = data?.genset.genset2 || {};
    const info = data?.report_info || {};
    const apiDate = info.date_time ? new Date(info.date_time) : new Date();

    const tanggal = apiDate.toLocaleDateString("id-ID", {
        weekday: "long",
        day: "2-digit",
        month: "long",
        year: "numeric",
    });

    const waktu = apiDate.toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
    });


    return (
        <pre>{`
BERITA ACARA RUNING G2a & G2b

Petugas ME:
${info.petugasME ?? "-"}/${info.petugasME2 ?? "-"}

Proses: ${genset2.prosses ?? "-"}

Gedung: TTC Teling
Hari/Tanggal: ${formatTanggal(genset2.date)}

Running Time(WITA)
Genset On : ${formatTime(genset2.gen_on) ?? "-"}
Genset Off : ${formatTime(genset2.gen_off) ?? "-"}
Durasi : ${GenOnDurasi(genset2.gen_on, genset2.gen_off,)}

Level BBM(Liter)
Tanki Bulanan Genset 2: ${genset2.liter_bulanan ?? "-"} L
Tanki Harian Genset 2: ${genset2.liter_harian ?? "-"} L

Suhu: ${genset2.suhu ?? "-"} °C

Hours Matter 1 : ${genset2.hours_mater1 ?? "-"}
Hours Matter 2 : ${genset2.hours_mater2 ?? "-"}
`}</pre>
    );
}
