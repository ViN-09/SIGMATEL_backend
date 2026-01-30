import { 
  ReportCeklist as ReportCeklistTeling, 
  ReportSuhuKwh as ReportSuhuKwhTeling,
  ReportGenset1 as ReportGenset1Teling,
  ReportGenset2 as ReportGenset2Teling,
} from "./ReportModelTeling";

import { 
  ReportCeklist as ReportCeklistPaniki, 
  ReportSuhuKwh as ReportSuhuKwhPaniki,
  ReportGenset1 as ReportGenset1Paniki,
  ReportGenset2 as ReportGenset2Paniki, 
} from "./ReportModelPaniki";

export default function RenderReportModel({
    ttc,
    reportType,
    data,
    loading,
    error,
}) {
    if (loading) return <div>Loading report...</div>;
    if (error) return <div className="report-error">{error}</div>;
    if (!data) return <div>Data kosong</div>;

    let reportComponent = null;
    let siteName = "";
    let reportName = "";

    // 🔹 Tentukan site dan report yang dipilih
    if (ttc === "ttc_teling") {
        siteName = "TTC TELING";

        switch(reportType) {
            case "Ceklist":
                reportComponent = <ReportCeklistTeling data={data} />;
                break;
            case "KWH_Ceklist":
                reportComponent = <ReportSuhuKwhTeling data={data} />;
                break;
            case "KWH & Suhu":
                reportComponent = <ReportSuhuKwhTeling data={data} />;
                break;
            case "Genset1":
                reportComponent = <ReportGenset1Teling data={data} />;
                break;
            case "Genset2":
                reportComponent = <ReportGenset2Teling data={data} />;
                break;
            default:
                reportComponent = <pre>Report type tidak dikenali</pre>;
        }
    } 
    else if (ttc === "ttc_paniki") {
        siteName = "TTC PANIKI";

        switch(reportType) {
            case "Ceklist":
                reportComponent = <ReportCeklistPaniki data={data} />;
                break;
            case "KWH_Ceklist":
                reportComponent = <ReportSuhuKwhPaniki data={data} />;
                break;
           case "KWH & Suhu":
                reportComponent = <ReportSuhuKwhPaniki data={data} />;
                break;
            case "Genset1":
                reportComponent = <ReportGenset1Paniki data={data} />;
                break;
            case "Genset2":
                reportComponent = <ReportGenset2Paniki data={data} />;
                break;
            default:
                reportComponent = <pre>Report type tidak dikenali</pre>;
        }
    } 
    else {
        return <pre>Site tidak dikenali</pre>;
    }

    return (
        <div>
            {reportComponent}
        </div>
    );
}
