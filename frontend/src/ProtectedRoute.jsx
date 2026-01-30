import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const isLogin = sessionStorage.getItem("isLogin"); // atau token

  if (!isLogin) {
    return <Navigate to="/SIGMATEL" replace />;
  }

  return children;
}
