import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';


const ProtectedRoute = ({ children, role }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  console.log("ProtectedRoute: user from localStorage", user);
  console.log("ProtectedRoute: required role", role);
  if (!user) {
    console.log("ProtectedRoute: No user found, redirecting to /");
    return <Navigate to="/" />;
  }
  if (role && (!user.role || user.role !== role)) {
  console.log(`ProtectedRoute: Role mismatch (user.role=${user.role}, required=${role}), redirecting to /`);
    return <Navigate to="/" />;
  }
  console.log("ProtectedRoute: Access granted");
  return children;
};

export default ProtectedRoute;