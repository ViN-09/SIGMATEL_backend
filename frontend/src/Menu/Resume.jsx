import React, { useState, useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import ChartDataLabels from "chartjs-plugin-datalabels";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "./Resume.css";
import Loader from "../component/Loder";
import { fetchResumeProfile } from "../auth.js";

const host = sessionStorage.getItem("host");
const ttc = sessionStorage.getItem("ttc");

const ResumeDashboard = () => {
  // ================= STATE =================
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [cctvData, setCctvData] = useState({
    merk: "Loading...",
    jumlah: "Loading...",
    indoor: "Loading...",
    outdoor: "Loading...",
    recording_caps: "Loading...",
    record_duration: "Loading...",
  });

  const [pacData, setPacData] = useState({
    up_flow: "...",
    down_flow: "...",
    inrow: "...",
    total_pac: "...",
    total_kapasitas: "...",
    total_load: "...",
    occupancy: "...",
    setpoint: "...",
    age: "...",
  });

  const [upsData, setUpsData] = useState({
    total_capacity: "..",
    total_load: "..",
    total_occupancy: "..",
    total_ne: "..",
    total_system: "..",
    total_bank: "..",
    total_kapasitas: "..",
  });

  const [rectifierData, setRectifierData] = useState({
    total_capacity: "..",
    total_load: "..",
    total_occupancy: "..",
    total_ne: "..",
    total_system: "..",
    total_bank: "..",
    total_kapasitas: "..",
  });

  const [plnData, setPlnData] = useState({
    kapasitas: "",
    kapasitas_terpakai: "",
    supply: "",
    occupancy: "",
    tagihan_listrik: "",
  });

  const [travoData, setTravoData] = useState({
    jumlah: "",
    capacity: "",
    occupancy: "",
  });

  const [gensetData, setGensetData] = useState({
    load_total: 0,
    capacity_total: 0,
    total_unit: 0,
    occupancy: 0,
    details: [],
  });

  const [bbmData, setBbmData] = useState({
    kapasitas: "...",
    liter_total: "...",
    occupancy: "...",
    backup_time: "...",
  });

  const [spaceData, setSpaceData] = useState({
    total_space: 0,
    total_ruang_perangkat: "..",
    total_common_area: "..",
    total_ruangan: 0,
    lantai1: { luas: 0, ruangan: 0 },
    lantai2: { luas: 0, ruangan: 0 },
    lantai3: { luas: 0, ruangan: 0 },
  });

  const [aparData, setAparData] = useState({
    Brand: "...",
    Type: "...",
    jumlah: "...",
    aktiv: "...",
  });

  const [fssData, setFssData] = useState({
    brand: "...",
    floor: "...",
    jumlah: "...",
  });

  const [issueData, setIssueData] = useState([]);
  const [issueBuildingData, setIssueBuildingData] = useState([]);

  // ================= CHART =================
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  // ================= FETCH =================
  const fetchAllData = async () => {
  try {
    setLoading(true);
    setError(null);

    const data = await fetchResumeProfile(host, ttc);
    processApiData(data);

  } catch (err) {
    console.error("Resume fetch error:", err);
    setError(err.message);
  } finally {
    setTimeout(() => setLoading(false), 600);
  }
};


  // ================= PROCESS DATA =================
  const processApiData = (data) => {
    if (data.CCTV) {
      setCctvData({
        merk: data.CCTV.merk || "N/A",
        jumlah: data.CCTV.jumlah || 0,
        indoor: data.CCTV.indoor || 0,
        outdoor: data.CCTV.outdoor || 0,
        recording_caps: data.CCTV.recording_caps || "N/A",
        record_duration: data.CCTV.record_duration || "N/A",
      });
    }

    if (data.PAC) {
      setPacData({
        up_flow: `${data.PAC.FlowType?.up_flow?.jumlah || 0} UNIT`,
        down_flow: `${data.PAC.FlowType?.down_flow?.jumlah || 0} UNIT`,
        inrow: `${data.PAC.FlowType?.inrow?.jumlah || 0} UNIT`,
        total_pac: `${data.PAC.total_pac || 0} UNIT`,
        total_kapasitas: `${data.PAC.total_kapasitas || 0} KW`,
        total_load: `${data.PAC.total_load || 0} KW`,
        occupancy: `${data.PAC.occupancy || 0} %`,
        setpoint: `${data.PAC.setpoint || "N/A"} °C`,
        age: `<10Y : ${data.PAC.age?.under10 || 0} | >10Y : ${data.PAC.age?.upper10 || 0}`,
      });
    }

    if (data.UPS) {
      setUpsData({
        total_capacity: `${data.UPS.total_capacity || 0} kVA`,
        total_load: `${data.UPS.total_load || 0} kVA`,
        total_occupancy: `${data.UPS.occupancy || 0} %`,
        total_ne: data.UPS.total_ne || 0,
        total_system: data.UPS.total_system || 0,
        total_bank: data.UPS.total_bank || 0,
        total_kapasitas: `${data.UPS.total_battery_cap || 0} AH`,
      });
    }

    if (data.REC) {
      setRectifierData({
        total_capacity: `${data.REC.total_capacity || 0} kW`,
        total_load: `${data.REC.total_load || 0} kW`,
        total_occupancy: `${data.REC.occupancy || 0} %`,
        total_ne: data.REC.total_ne || 0,
        total_system: data.REC.total_system || 0,
        total_bank: data.REC.total_bank || 0,
        total_kapasitas: `${data.REC.total_ah || 0} AH`,
      });
    }

    if (data.PLN) {
      setPlnData({
        kapasitas: `${data.PLN.kapasitas || 0} kVA`,
        kapasitas_terpakai: `${data.PLN.kapasitas_terpakai || 0} kVA`,
        supply: data.PLN.supply || "N/A",
        occupancy: `${data.PLN.occupancy || 0} %`,
        tagihan_listrik: data.PLN.tagihan_listrik || "N/A",
      });
    }

    if (data.TRAVO) {
      setTravoData({
        jumlah: `${data.TRAVO.jumlah || 0} UNIT`,
        capacity: `${data.TRAVO.capacity || 0} kVA`,
        occupancy: `${data.TRAVO.occupancy || 0} %`,
      });
    }

    if (data.GENSET) {
      const list = Object.values(data.GENSET);
      let load = 0;
      let cap = 0;

      const details = list.map((g) => {
        load += Number(g.load || 0);
        cap += Number(g.capacity || 0);
        return {
          merk: g.merk,
          capacity: g.capacity,
          load: g.load,
          remarks: g.remarks,
        };
      });

      setGensetData({
        load_total: load,
        capacity_total: cap,
        total_unit: list.length,
        occupancy: cap ? (load / cap) * 100 : 0,
        details,
      });
    }

    if (data.BBM) {
      setBbmData({
        kapasitas: `${data.BBM.kapasitas || 0} Liter`,
        liter_total: `${data.BBM.liter_total || 0} Liter`,
        occupancy: `${data.BBM.occupancy || 0} %`,
        backup_time: `${data.BBM.backup_time || 0} Jam`,
      });
    }

    if (data.SPACE) {
      setSpaceData({
        total_space: data.SPACE.total_space || 0,
        total_ruang_perangkat: data.SPACE.total_ruang_perangkat || 0,
        total_common_area: data.SPACE.total_common_area || 0,
        total_ruangan: data.SPACE.total_ruangan || 0,
        lantai1: {
          luas: data.SPACE.total_space_lantai_1 || 0,
          ruangan: data.SPACE.total_ruangan_lantai_1 || 0,
        },
        lantai2: {
          luas: data.SPACE.total_space_lantai_2 || 0,
          ruangan: data.SPACE.total_ruangan_lantai_2 || 0,
        },
        lantai3: {
          luas: data.SPACE.total_space_lantai_3 || 0,
          ruangan: data.SPACE.total_ruangan_lantai_3 || 0,
        },
      });
    }

    if (Array.isArray(data.ISSUE)) setIssueData(data.ISSUE);
    if (Array.isArray(data.ISSUE_BUILDING)) setIssueBuildingData(data.ISSUE_BUILDING);
  };

  // ================= CHART INIT =================
  useEffect(() => {
    if (!chartRef.current || !spaceData.total_space) return;

    if (chartInstance.current) chartInstance.current.destroy();

    chartInstance.current = new Chart(chartRef.current, {
      type: "doughnut",
      data: {
        labels: ["Lantai 1", "Lantai 2", "Lantai 3"],
        datasets: [
          {
            data: [
              spaceData.lantai1.luas,
              spaceData.lantai2.luas,
              spaceData.lantai3.luas,
            ],
            backgroundColor: ["#000", "#555", "#888"],
          },
        ],
      },
      options: { responsive: true },
      plugins: [ChartDataLabels],
    });
  }, [spaceData]);

  useEffect(() => {
    fetchAllData();
    return () => chartInstance.current?.destroy();
  }, []);

  // ================= RENDER =================
  if (loading) return <Loader duration={0.9} />;
  if (error) return <div className="resume-dashboard error">Error: {error}</div>;

  return (
        <div className="resume-dashboard">

            <h1>PROFILE TTC TELING</h1>

            <div className="container">
                {/* SUMMARRY PERIZINAN */}
                <div className="content">
                    <h1>SUMMARRY PERIZINAN</h1>
                    <div className="data-content" id="perijinan">
                        <div className="box" id="CCTV">
                            <h2>CCTV <i className="fa-solid fa-video"></i></h2>
                            <a>BRAND CCTV : <strong id="merk">{cctvData.merk}</strong></a>
                            <a>JUMLAH UNIT : <strong id="jumlah">{cctvData.jumlah}</strong></a>
                            <a>INDOOR : <strong id="indoor">{cctvData.indoor}</strong></a>
                            <a>OUTDOR : <strong id="outdoor">{cctvData.outdoor}</strong></a>
                            <a>TOTAL STORAGE : <strong id="recording_caps">{cctvData.recording_caps}</strong></a>
                            <a>RECORDING DAYS : <strong id="record_duration">{cctvData.record_duration}</strong></a>

                        </div>
                        <div className="box" id="ACCESSDOOR">
                            <h2>ACCESSDOOR <i className="fa-solid fa-door-closed"></i></h2>
                            <a>BRAND : <strong id="merk">HID</strong></a>
                            <a>CARD READER TERPASANG : <strong id="indoor">10 UNIT</strong></a>
                            <a>ACCESS CARD TERDAFTAR : <strong id="jumlah">16 CARD</strong></a>

                        </div>
                    </div>
                </div>

                {/* POWER SYSTEM - UPS & RECTIFIER */}
                <div className="content">
                    <h1>POWER SYSTEM</h1>
                    <div className="data-content" id="Power-System">
                        <div className="box" id="UPS">
                            <h2>UPS <i className="fa-solid fa-box"></i></h2>
                            <a>SYSTEM <i className="fa-solid fa-gear"></i></a>
                            <a>TOTAL NE : <strong id="total_ne_ups">{upsData.total_ne}</strong></a>
                            <a>TOTAL SYSTEM : <strong id="total_system_ups">{upsData.total_system}</strong></a>
                            <a>TOTAL CAPACITY : <strong id="total_capacity_ups">{upsData.total_capacity}</strong></a>
                            <a>TOTAL LOAD : <strong id="total_load_ups">{upsData.total_load}</strong></a>
                            <a>TOTAL OCCUPANCY : <strong id="total_occupancy_ups">{upsData.total_occupancy}</strong></a>
                            <a>BATTERY <i className="fa-solid fa-car-battery"></i></a>
                            <a>TOTAL BANK : <strong id="total_bank_ups">{upsData.total_bank}</strong></a>
                            <a>TOTAL KAPASITAS : <strong id="total_kapasitas_ups">{upsData.total_kapasitas}</strong></a>
                            <a>AVG BACKUPTIME : <strong id="avg_backuptime_ups">..</strong></a>
                            {/* <a>NOTE<i className="fa-solid fa-door-closed"></i></a> */}
                        </div>
                        <div className="box" id="RECTIFIER">
                            <h2>RECTIFIER <i className="fa-solid fa-server"></i></h2>
                            <a>SYSTEM <i className="fa-solid fa-gear"></i></a>
                            <a>TOTAL NE : <strong id="total_ne_rectifier">{rectifierData.total_ne}</strong></a>
                            <a>TOTAL SYSTEM : <strong id="total_system_rectifier">{rectifierData.total_system}</strong></a>
                            <a>TOTAL CAPACITY : <strong id="total_capacity_rectifier">{rectifierData.total_capacity}</strong></a>
                            <a>TOTAL LOAD : <strong id="total_load_rectifier">{rectifierData.total_load}</strong></a>
                            <a>TOTAL OCCUPANCY : <strong id="total_occupancy_rectifier">{rectifierData.total_occupancy}</strong></a>

                            <a>BATTERY <i className="fa-solid fa-car-battery"></i></a>
                            <a>TOTAL BANK : <strong id="total_bank_rectifier">{rectifierData.total_bank}</strong></a>
                            <a>TOTAL KAPASITAS : <strong id="total_kapasitas_rectifier">{rectifierData.total_kapasitas}</strong></a>
                            <a>AVG BACKUPTIME : <strong id="avg_backuptime_rectifier">..</strong></a>

                            {/* <div>NOTE<i className="fa-solid fa-door-closed"></i></div> */}
                        </div>
                    </div>
                </div>

                {/* POWER SYSTEM - PLN, TRAFO, GENSET, BBM */}
                <div className="content" id="PLNGEN">
                    <h1>POWER SYSTEM</h1>
                    <div className="data-content" id="MAIN-POWER">
                        <div className="box" id="PLN">
                            <h2>PLN <i className="fa-solid fa-bolt"></i></h2>
                            <a>CAPACITY : <strong id="capacity_pln">{plnData.kapasitas}</strong></a>
                            <a>LOAD : <strong id="load_pln">{plnData.kapasitas_terpakai}</strong></a>
                            <a>OCCUPANCY : <strong id="occupancy_pln">{plnData.occupancy}</strong></a>
                            <a>SUPLY : <strong id="suply_pln">{plnData.supply}</strong></a>
                            <a>TAGIHAN LISTRIK : <strong id="tagihan_listrik_pln">{plnData.tagihan_listrik}</strong></a>

                        </div>

                        <div className="box" id="TRAFO">
                            <h2>TRAFO <i className="fa-solid fa-box-archive"></i></h2>
                            <a>JUMLAH : <strong id="jumlah_travo">{travoData.jumlah}</strong></a>
                            <a>KAPASITAS TRAVO : <strong id="capacity_travo">{travoData.capacity}</strong></a>
                            <a>OCCUPANCY : <strong id="occupancy_travo">{travoData.occupancy}</strong></a>

                        </div>

                        <div className="box" id="GENSET">
                            <h2>GENSET <i className="fa-solid fa-box"></i> <i className="fa-solid fa-bolt"></i></h2>
                            <a>JUMLAH : <strong id="jumlah_genset">{gensetData.total_unit} UNIT</strong></a>
                            <ul id="remark-genset-list">
                                NAMA :
                                {gensetData.details.map((item, index) => (
                                    <li key={index}>
                                        {item.remarks}({item.merk})-{item.capacity}kVA
                                    </li>
                                ))}
                            </ul>
                            <ul id="load-genset-list">
                                LOAD
                                {gensetData.details.map((item, index) => (
                                    <li key={index}>{item.load}(kVA)</li>
                                ))}
                            </ul>
                            <a>LOAD TOTAL : <strong id="load_genset">{gensetData.load_total} kVA</strong></a>
                            <a>CAPACITY TOTAL : <strong id="kapasitas_genset">{gensetData.capacity_total} kVA</strong></a>
                            <a>OCCUPANCY : <strong id="occupancy_genset">{gensetData.occupancy.toFixed(2)}%</strong></a>
                        </div>

                        <div className="box" id="BBM">
                            <h2>BBM <i className="fa-solid fa-gauge"></i></h2>
                            <a>KAPASITAS BBM : <strong id="kapasitas_bbm">{bbmData.kapasitas}</strong></a>
                            <a>TOTAL BBM : <strong id="total_liter__bbm">{bbmData.liter_total}</strong></a>
                            <a>OCCUPANCY : <strong id="occupancy_bbm">{bbmData.occupancy}</strong></a>
                            <a>RUNNING ESTIMACY : <strong id="backup_time">{bbmData.backup_time}</strong></a>
                        </div>
                    </div>
                </div>

                {/* COOLING SYSTEM */}
                <div className="content" id="CS">
                    <h1>COOLING SYSTEM</h1>
                    <div className="data-content" id="Cooling-System">
                        <div className="box" id="PAC">
                            <h2>PAC <i className="fa-solid fa-snowflake"></i></h2>
                            <div></div>
                            <div>UP FLOW : <strong id="up-flow_pac">{pacData.up_flow}</strong></div>
                            <div>DOWN FLOW : <strong id="down-flow_pac">{pacData.down_flow}</strong></div>
                            <div>INROW : <strong id="inrow_pac">{pacData.inrow}</strong></div>
                            <div>TOTAL PAC : <strong id="total-pac_pac">{pacData.total_pac}</strong></div>
                            <div>TOTAL KAPASITAS : <strong id="total-kapasitas_pac">{pacData.total_kapasitas}</strong></div>
                            <div>TOTAL LOAD : <strong id="total-load_pac">{pacData.total_load}</strong></div>
                            <div>OCCUPANCY : <strong id="occupancy_pac">{pacData.occupancy}</strong></div>
                            <div>NOTE</div>
                            <div>SET POINT : <strong id="setpoint_pac">{pacData.setpoint}</strong></div>
                            <div>AGE : <strong id="age_pac">{pacData.age}</strong></div>
                        </div>

                        <div className="box" id="ACSPLIT">
                            <h2>AC SPLIT <i className="fa-solid fa-wind"></i></h2>
                            <div><strong id="up-flow">DAPOT TIDAK ADA</strong></div>
                        </div>

                        <div className="box" id="SPLIT-DUCT">
                            <h2>SPLIT DUCT <i className="fa-solid fa-building"></i></h2>
                            <div><strong id="merk">DAPOT TIDAK ADA</strong></div>
                        </div>
                        <div className="box" id="AC-PORTABLE">
                            <h2>AC PORTABLE <i className="fa-solid fa-door-closed"></i></h2>
                            <div><strong id="merk">DAPOT TIDAK ADA</strong></div>
                        </div>
                    </div>
                </div>

                {/* SUMMARY BUILDING - LUASAN & ISSUE */}
                <div className="content" id="BUILDING">
                    <h1>SUMMARY BUILDING</h1>
                    <div className="data-content" id="Luasan-Building">
                        <div className="box" id="LUASAN">
                            <h2>LUASAN <i className="fas fa-th-large"></i></h2>
                            <div className="chart_luasan">
                                <canvas id="chartSpace" ref={chartRef}></canvas>
                            </div>
                            <div className="info_tambahan_luasan">
                                <table>
                                    <thead>
                                        <tr>
                                            <th colSpan="2">TOTAL RUANGAN</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td id="jumlah_ruang_perangkat">{spaceData.total_ruang_perangkat}</td>
                                            <td id="jumlah_ruang_common">{spaceData.total_common_area}</td>
                                        </tr>
                                        <tr>
                                            <td>Perangkat</td>
                                            <td>Common Area</td>
                                        </tr>
                                    </tbody>
                                </table>
                                <a>TOTAL LUAS BANGUNAN <strong id="total_luas_bangunan">{spaceData.total_space} m²</strong></a>
                            </div>
                        </div>

                        <div className="box" id="ISSUE-BUILDING">
                            <h2>ISSUE <i className="fa-solid fa-building"></i></h2>
                            <div className="table_base_issue_building">
                                <table className="modern-table">
                                    <thead>
                                        <tr>
                                            <th>No</th>
                                            <th>Issue</th>
                                            <th>Analisa</th>
                                            <th>Risk</th>
                                            <th>Solution</th>
                                            <th>Keterangan</th>
                                            <th>Status</th>
                                            <th>Profile Affected</th>
                                        </tr>
                                    </thead>
                                    <tbody id="issue-building-table-body">
                                        {issueBuildingData.map((item, index) => (
                                            <tr key={index}>
                                                <td>{index + 1}</td>
                                                <td>{item.issue}</td>
                                                <td>{item.analisa}</td>
                                                <td>{item.risk}</td>
                                                <td>{item.solution}</td>
                                                <td>{item.keterangan}</td>
                                                <td>{item.status}</td>
                                                <td>{item.profile_affected}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>

                {/* FIRE SAFETY SYSTEM */}
                <div className="content" id="FSS">
                    <h1>SUMMARY BUILDING</h1>
                    <div className="data-content" id="Fire-Suspend">
                        <div className="box" id="APAR">
                            <h2>APAR <i className="fa-solid fa-fire-extinguisher"></i></h2>
                           <a>BRAND <strong id="brand_apar">{aparData.Brand}</strong></a>
<a>JENIS <strong id="jenis_apar">{aparData.Type}</strong></a>
<a>JUMLAH <strong id="jumlah_apar">{aparData.jumlah}</strong></a>
<a>STATUS <strong id="status_apar">{aparData.aktiv}</strong></a>

                        </div>
                        <div className="box" id="FM200">
                            <h2>FSS <i className="fa-solid fa-fire-burner"></i></h2>
                            <a>BRAND <strong id="brand_fm200">{fssData.brand}</strong></a>
<a>FLOOR BACKUP <strong id="floor_backup_fm200">{fssData.floor}</strong></a>
<a>JUMLAH TABUNG <strong id="jumlah_tabung_fm200">{fssData.jumlah}</strong></a>
<a>NOTE <strong id="status_fm200">...</strong></a>

                        </div>
                        <div className="box" id="HYDRAND">
                            <h2>HYDRAND <i className="fa-solid fa-water"></i></h2>
                            <div><strong>DAPOT TIDAK ADA</strong></div>
                        </div>
                    </div>
                </div>

                {/* ISSUE TTC */}
                <div className="content" id="ISSUE">
                    <h1>ISSUE TTC</h1>
                    <div className="data-content" id="Issue-TTC">
                        <table className="modern-table">
                            <thead>
                                <tr>
                                    <th>No</th>
                                    <th>Issue</th>
                                    <th>Analisa</th>
                                    <th>Risk</th>
                                    <th>Solution</th>
                                    <th>Keterangan</th>
                                    <th>Status</th>
                                    <th>Profile Affected</th>
                                </tr>
                            </thead>
                            <tbody id="issue-table-body">
                                {issueData.map((item, index) => (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{item.issue}</td>
                                        <td>{item.analisa}</td>
                                        <td>{item.risk}</td>
                                        <td>{item.solution}</td>
                                        <td>{item.keterangan}</td>
                                        <td>{item.status}</td>
                                        <td>{item.profile_affected}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResumeDashboard;