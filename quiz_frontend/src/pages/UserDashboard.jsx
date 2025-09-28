// src/pages/DashboardPage.js
import React from "react";
import UserDashboard from "../components/UserDashboard.jsx";

function DashboardPage() {
  // saved at login
  const user = JSON.parse(localStorage.getItem("user"));
  return <UserDashboard user={user} />;
}

export default DashboardPage;
