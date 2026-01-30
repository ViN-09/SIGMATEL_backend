import React, { useState } from "react";
import { PlainTable } from "../component/CardTable";
import "./Summaryceklist.css";
import Summarydata from "./Summarydata";


export default function Summaryceklist() {
    const [activeSubmenu, setActiveSubmenu] = useState(null);

    const handleClick = (id) => {
        setActiveSubmenu(id);
        console.log(id)
    };

    const handleBack = () => {
        setActiveSubmenu(null);
    };

    return (
        <div id="buku-summary-warper">
            <div id="buku-summary">

                {/* kalau belum klik submenu */}
                {!activeSubmenu && (
                    <div id="summary-list">
                        <div
                            className="item-summary-list"
                            id="sub-pueceklist"
                            onClick={() => handleClick("sub-pueceklist")}
                        >
                            <i className="bi bi-lightning-charge-fill icon-summary text-warning"></i>
                            <span>PUE Ceklist</span>
                        </div>

                        <div
                            className="item-summary-list"
                            id="sub-reportceklist"
                            onClick={() => handleClick("sub-reportceklist")}
                        >
                            <i className="bi bi-file-earmark-check-fill icon-summary text-success"></i>
                            <span>Report Ceklist</span>
                        </div>

                        <div
                            className="item-summary-list"
                            id="sub-kwhpln"
                            onClick={() => handleClick("sub-kwhpln")}
                        >
                            <i className="bi bi-lightning-fill icon-summary text-primary"></i>
                            <span>KWH PLN</span>
                        </div>

                        <div
                            className="item-summary-list"
                            id="sub-suhu"
                            onClick={() => handleClick("sub-suhu")}
                        >
                            <i className="bi bi-thermometer-sun icon-summary text-danger"></i>
                            <span>Suhu</span>
                        </div>

                        <div
                            className="item-summary-list"
                            id="sub-lvmdp"
                            onClick={() => handleClick("sub-lvmdp")}
                        >
                            <i className="bi bi-diagram-3-fill icon-summary text-info"></i>
                            <span>LVMDP</span>
                        </div>

                        <div
                            className="item-summary-list"
                            id="sub-rectifier"
                            onClick={() => handleClick("sub-rectifier")}
                        >
                            <i className="bi bi-battery-charging icon-summary text-success"></i>
                            <span>Rectifier</span>
                        </div>

                        <div
                            className="item-summary-list"
                            id="sub-ups"
                            onClick={() => handleClick("sub-ups")}
                        >
                            <i className="bi bi-plug-fill icon-summary text-secondary"></i>
                            <span>UPS</span>
                        </div>

                        <div
                            className="item-summary-list"
                            id="sub-pac"
                            onClick={() => handleClick("sub-pac")}
                        >
                            <i className="bi bi-fan icon-summary text-primary"></i>
                            <span>PAC</span>
                        </div>
                    </div>
                )}

                {/* kalau submenu aktif */}
                {activeSubmenu && (
                    <div className="summary-submeu-content">
                        <button
                            className="btn btn-sm btn-outline-secondary btn-back"
                            onClick={handleBack}
                        >
                            <i className="bi bi-arrow-left"></i>
                        </button>

                        {activeSubmenu === "sub-pueceklist" && <Summarydata reportType="pue" />}
                        {activeSubmenu === "sub-reportceklist" && <Summarydata reportType="ceklist" />}
                        {activeSubmenu === "sub-kwhpln" && <Summarydata reportType="kwh" />}
                        {activeSubmenu === "sub-suhu" && <Summarydata reportType="suhu" />}
                        {activeSubmenu === "sub-lvmdp" && <Summarydata reportType="pln" />}
                        {activeSubmenu === "sub-rectifier" && <Summarydata reportType="rectifier" />}
                        {activeSubmenu === "sub-ups" && <Summarydata reportType="ups" />}
                        {activeSubmenu === "sub-pac" && <Summarydata reportType="pac" />}
                    </div>
                )}
            </div>
        </div>
    );
}
