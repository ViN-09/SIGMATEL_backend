import { useState, useEffect } from "react";
import "./Data.css";
import "../component/Data_menu.css";
import Loder from "../component/Loder";
import Data_menu from "../component/Data_menu.jsx";
import Ceklist from "../Submenu/Ceklist"
import Sidapot from "../Submenu/Sidapot.jsx"
import Issue from "../Submenu/Issue.jsx"
import Activitylist from "../component/Activitylist.jsx";
import Bukutamu from "../Submenu/Bukutamu.jsx"
import Bankpass from "../Submenu/Bankpass.jsx"
import Summaryceklist from "../Submenu/Summaryceklist.jsx";
import Datatracking from "../Submenu/Datatracking.jsx";


function Data() {
  const [loading, setLoading] = useState(true);
  const [activeSubmenu, setActiveSubmenu] = useState("Checklist");

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  // 🔥 LOG MENU AKTIF
  const renderContent = () => {
    // console.log("Active Submenu:", activeSubmenu);
    switch (activeSubmenu) {
      case "Checklist":
        return <Ceklist />;
      case "Data-Potensi":
        return <Sidapot />;
      case "Data-Issue":
        return <Issue />;
      case "Bank-Acces":
        return <Bankpass />;
      case "Summary-Ceklist":
        return <Summaryceklist />;
      case "Buku-Tamu":
        return <Bukutamu />;
      case "Data-Dashboard":
        return <Datatracking />;
      default:
        return <div>Pilih menu</div>;
    }
  };

  return (

    <div className={`siData ${loading ? "loading" : "loaded"}`}>
      {loading && <Loder duration={0.8} />}
      {/* LEFT */}
      <div>
        <Data_menu
          activeSubmenu={activeSubmenu}
          setActiveSubmenu={setActiveSubmenu}
        />
      </div>

      {/* CENTER */}
      <div className="siData-content">
        {renderContent()}
      </div>

      {/* RIGHT */}
      <div className="warper-actvity"><Activitylist /></div>
    </div>
  );
}

export default Data;
