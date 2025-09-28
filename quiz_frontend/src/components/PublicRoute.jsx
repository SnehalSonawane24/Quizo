// src/components/PublicRoute.jsx
import { Navigate } from "react-router-dom";

export default function PublicRoute({ children }) {
  const token = localStorage.getItem("access_token");
  const role = localStorage.getItem("role");

  // If token exists, redirect based on role
  if (token) {
    if (role === "admin") return <Navigate to="/admin/dashboard" replace />;
    return <Navigate to="/user/dashboard" replace />;
  }

  return children;
}
