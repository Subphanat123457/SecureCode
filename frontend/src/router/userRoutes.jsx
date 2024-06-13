// userRoutes.jsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "../pages/authentication/loginPage";
import RegisterPage from "../pages/register/registerPage";
import DashboardPage from "../pages/dashboard/dashboardPage";
import AdminPage from "../pages/admin/adminPage";

import PrivateRoute from "./privateRoute";

const UserRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/dashboard" element={<PrivateRoute element={<DashboardPage />} />} />
      <Route path="/admin" element={<PrivateRoute element={<AdminPage />} />} />
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
};

export default UserRoutes;
