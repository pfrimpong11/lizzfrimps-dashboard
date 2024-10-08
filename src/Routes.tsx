import React from "react";
import { Routes, Route } from "react-router-dom";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";

import AdminDashboard from "./pages/AdminDashboard";



const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/RegisterPage" element={<RegisterPage />} />
      <Route path="/ForgotPasswordPage" element={<ForgotPasswordPage/>} />
      <Route path="/ResetPasswordPage" element={<ResetPasswordPage/>} />
      <Route path="/AdminDashboard" element={<AdminDashboard/>} />
    </Routes>
  );
};

export default AppRoutes;
