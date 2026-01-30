import React, { useState, useEffect } from "react";
import Loader from "../component/Loder";
import "./Dashboard.css";
import CardTable from "../component/CardTable";
import { DoughnutChart, LineChart, LineChartMulti, BarChartCard, BarChartCardCol } from "../component/ChartComponents";
import CardSuhu from "../component/CardSuhu";
import { fetchMonitoringData } from "../auth";
import toast from "react-hot-toast";
import { useRef } from "react";

export default function Dashboard() {
    const errorRef = useRef(false);

    const [loading, setLoading] = useState(true);
    const [pueValue, setPueValue] = useState(1.5);
    const [PUEDialy, setPUEDialy] = useState({ labels: [], values: [] });
    const [loadChart, setLoadChart] = useState({ labels: [], values: [] });
    const [dialyLoadChart, setDialyLoadChart] = useState({ labels: [], datasets: [] });
    const [weeklyPUE, setWeeklyPUE] = useState([]);
    const [tableData, setTableData] = useState([]);

    const ttc = sessionStorage.getItem("ttc");
    const host = sessionStorage.getItem("host");

    const [rooms, setRooms] = useState([]);
    const [temps, setTemps] = useState([]);
    const [humidities, setHumidities] = useState([]);


    const [genset, setGenset] = useState({
        g1harian: 0,
        g1bulanan: 0,
        g2harian: 0,
        g2bulanan: 0,
    });

    const labels = ["Harian G1", "Bulanan G1", "Harian G2", "Bulanan G2"];
    const values = [
        genset.g1harian,
        genset.g1bulanan,
        genset.g2harian,
        genset.g2bulanan,
    ];

    const color = "#f32525ff";

    // Fetch all monitoring data tiap 2 detik
    useEffect(() => {
        if (!host || !ttc) return;

        const fetchAllData = async () => {
            const data = await fetchMonitoringData(host, ttc);

            if (!data) {
                if (!errorRef.current) {
                    toast.error("❌ Gagal mengambil data monitoring. Server bermasalah.");
                    errorRef.current = true;
                }
                setLoading(false);
                return;
            }
            if (errorRef.current) {
                toast.success("✅ Koneksi monitoring kembali normal");
            }
            errorRef.current = false;



            // ================= PUE =================
            if (data.pue != null) {
                setPueValue(data.pue);
            }

            // ================= Daily PUE =================
            if (data.dailyPUE && typeof data.dailyPUE === "object") {
                setPUEDialy({
                    labels: Object.keys(data.dailyPUE),
                    values: Object.values(data.dailyPUE),
                });
            } else {
                setPUEDialy({ labels: [], values: [] });
            }

            // ================= Load Chart =================
            if (data.load && typeof data.load === "object") {
                setLoadChart({
                    labels: Object.keys(data.load),
                    values: Object.values(data.load),
                });
            } else {
                setLoadChart({ labels: [], values: [] });
            }

            // ================= Daily LOAD =================
            if (data.dailyLOAD && typeof data.dailyLOAD === "object") {
                const labels = Object.keys(data.dailyLOAD);

                setDialyLoadChart({
                    labels,
                    datasets: [
                        {
                            label: "PLN",
                            values: labels.map(t => data.dailyLOAD[t]?.PLN ?? 0),
                            color: "rgba(8, 53, 253, 1)",
                        },
                        {
                            label: "IT",
                            values: labels.map(t => data.dailyLOAD[t]?.IT ?? 0),
                            color: "rgb(0, 129, 22)",
                        },
                        {
                            label: "Facility",
                            values: labels.map(t => data.dailyLOAD[t]?.Facility ?? 0),
                            color: "rgba(221, 7, 7, 1)",
                        },
                    ],
                });
            } else {
                setDialyLoadChart({ labels: [], datasets: [] });
            }

            // ================= Weekly PUE (Table) =================
            if (data.weeklypue && typeof data.weeklypue === "object") {
                const weeklyArray = Object.entries(data.weeklypue)
                    .sort(([a], [b]) => Number(a) - Number(b))
                    .map(([_, value]) => {
                        const filtered = Object.fromEntries(
                            Object.entries(value).filter(([k]) => !k.startsWith("kva_"))
                        );

                        const formatted = {};
                        Object.entries(filtered).forEach(([k, v]) => {
                            formatted[k.replace(/_/g, " ").toUpperCase()] = v;
                        });

                        return formatted;
                    });

                setTableData(weeklyArray);
            } else {
                setTableData([]);
            }

            // ================= Suhu & Humidity =================
            if (data.suhuTemp && typeof data.suhuTemp === "object") {
                const roomNames = Object.keys(data.suhuTemp);

                setRooms(roomNames);
                setTemps(roomNames.map(r => data.suhuTemp[r]?.Suhu ?? 0));
                setHumidities(roomNames.map(r => data.suhuTemp[r]?.Humidity ?? 0));
            } else {
                setRooms([]);
                setTemps([]);
                setHumidities([]);
            }

            if (data.genset && typeof data.genset === "object") {
                setGenset(data.genset);
            }

            setLoading(false);
        };

        fetchAllData();
        const interval = setInterval(fetchAllData, 2000);
        return () => clearInterval(interval);

    }, [host, ttc]);



    return (
        <div className="dashboard-page">
            {loading ? (
                <Loader duration={0.8} color="#E60012" />
            ) : (
                <div id="main-parent-dasboard">

                    <div id="dashboard-body">

                        <div><DoughnutChart title="PUE" value={pueValue} /></div>


                        <div>
                            <LineChart
                                labels={PUEDialy.labels}
                                values={PUEDialy.values}
                                label="Daily PUE"
                            />
                        </div>

                        <div id="suhuMonitoring">
                            <CardSuhu rooms={rooms} temps={temps} humidities={humidities} />
                        </div>

                        <div>
                            <BarChartCard
                                title="Load Monitoring"
                                labels={loadChart.labels}
                                values={loadChart.values}
                                barColor={["#0400ffff", "#23a129ff", "#e90b0bff"]}
                            />
                        </div>


                        <div>
                            <LineChartMulti
                                title="Daily Load"
                                labels={dialyLoadChart.labels}
                                datasets={dialyLoadChart.datasets}
                            />
                        </div>

                        <div>
                            <BarChartCardCol
                                title="Occupancy BBM"
                                labels={labels}
                                values={values}
                                barColor={color}
                            />
                        </div>
                    </div>


                    <div id="dashboard-body2">
                        <CardTable
                            title="Weekly PUE"
                            data={tableData}
                            columns={tableData.length > 0 ? Object.keys(tableData[0]) : []}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
