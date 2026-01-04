// src/routes/ProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token"); // check if user is logged in
  if (!token) {
    // Not logged in → redirect to login
    return <Navigate to="/login" replace />;
  }
  // Logged in → allow access
  return children;
}
