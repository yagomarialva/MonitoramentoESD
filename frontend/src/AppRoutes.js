import React from "react";
import "./i18n.js"; // ts => import './i18n.ts'
import { useEffect } from "react";
import {  useAuth } from "./context/AuthContext.js";
import HomePage from "./pages/HomePage/HomePage.jsx";
import ESDDashboardPage from "./pages/ESD/ESDHome/ESDDashboardPage/ESDDashboardPage.jsx";
import DashboardPage from "./pages/DashboardPage/DashboardPage.jsx";
import Operators from "./components/ESD/Operators/Operators.jsx";
import StationList from "./components/ESD/StationList/StationList.jsx";
import Monitors from "./components/ESD/Monitors/Monitors.jsx";
import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage/LoginPage.jsx";
import SignUpPage from "./pages/SignUpPage/SignUpPage.jsx";

const AppRoutes = () => {
  const { user} = useAuth()
  useEffect(() => {
    document.title = "FCT Auto Test";
  }, []);

  return (
    <>
      <Routes>
        <Route path="/" element={user ? <HomePage /> : <Navigate to="/login" />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<SignUpPage />} />
        <Route path="/dashboard" element={user ? <DashboardPage /> : <Navigate to="/login" />}/>
        <Route
          path="/users"
          element={user ? <Operators /> : <Navigate to="/login" />}
        />
        <Route path="/stations" element={user ? <StationList /> : <Navigate to="/login" />} />
        <Route path="/esd-dashboard"  element={user ? <ESDDashboardPage /> : <Navigate to="/login" />} />
        <Route path="/monitors"  element={user ? <Monitors /> : <Navigate to="/login" />}/>
      </Routes>
    </>
  );
};

export default AppRoutes;
