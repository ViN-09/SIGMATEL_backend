import { Routes, Route, useNavigate } from "react-router-dom";
import Login from "./Page/Login.jsx";
import Simain from "./Page/Simain.jsx";
import FormChecklist from "./Page/ReportCeklist/Formceklist.jsx";
import Formreport from "./Page/ReportCeklist/Formreport.jsx";
import EditProfile from "./Page/EditProfile.jsx";
import ProtectedRoute from "./ProtectedRoute";
import "./colorpalet.css"
function Motherparent() {
  const navigate = useNavigate();

  const handleLoginSI = () => {
    sessionStorage.setItem("isLogin", "true"); // penting
    navigate("/Simain");
  };

  return (
    <div className="Motherparent">
      <Routes>
        {/* PUBLIC ROUTE */}
        <Route path="/FM" element={<Login onLoginSuccess={handleLoginSI} />} />
        <Route path="/Visitor" element={<Login onLoginSuccess={handleLoginSI} />} />
        <Route path="/SIGMATEL" element={<Login onLoginSuccess={handleLoginSI} />} />

        {/* PROTECTED ROUTE */}
        <Route
          path="/Simain"
          element={
            <ProtectedRoute>
              <Simain />
            </ProtectedRoute>
          }
        />

        <Route
          path="/FormChecklist"
          element={
            <ProtectedRoute>
              <FormChecklist />
            </ProtectedRoute>
          }
        />

        <Route
          path="/Formreport"
          element={
            <ProtectedRoute>
              <Formreport />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile/form/:id"
          element={
            <ProtectedRoute>
              <EditProfile />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}

export default Motherparent;
