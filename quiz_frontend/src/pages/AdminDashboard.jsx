import React from "react";
import AdminDashboard from "../components/AdminDashboard.jsx";

function DashboardPage() {
  // saved at login
  const user = JSON.parse(localStorage.getItem("user"));
  return <AdminDashboard user={user} />;
}

export default DashboardPage;