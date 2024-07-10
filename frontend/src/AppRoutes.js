import React from "react";
import "./i18n.js"; // ts => import './i18n.ts'
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import { AuthProvider } from "./context/AuthContext.js";
import HomePage from "./pages/HomePage/HomePage.jsx";
import ESDDashboardPage from "./pages/ESD/ESDHome/ESDDashboardPage/ESDDashboardPage.jsx";
import DashboardPage from "./pages/DashboardPage/DashboardPage.jsx";
import Login from "./pages/Login/LoginPage.jsx";
import Operators from "./components/ESD/Operators/Operators.jsx";
import StationList from "./components/ESD/StationList/StationList.jsx";
import Monitors from "./components/ESD/Monitors/Monitors.jsx";
import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/Login/LoginPage.jsx";

const AppRoutes = () => {
  // const { user } = useAuth();
  const isAuthenticated = localStorage.getItem("token") !== null;
  console.log("isAuthenticated", isAuthenticated);
  useEffect(() => {
    document.title = "FCT Auto Test";
  }, []);

  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route
          path="/users"
          element={isAuthenticated ? <Operators /> : <Navigate to="/login" />}
        />
        <Route path="/stations" element={<StationList />} />
        <Route path="/esd-dashboard" element={<ESDDashboardPage />} />
        <Route path="/monitors" element={<Monitors />} />
      </Routes>
    </>
  );
};

export default AppRoutes;
