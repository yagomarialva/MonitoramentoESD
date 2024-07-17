import React from "react";
import "./i18n.js"; // ts => import './i18n.ts'
import { useEffect } from "react";
import { useAuth } from "./context/AuthContext.js";
import HomePage from "./pages/HomePage/HomePage.jsx";
import DashboardPage from "./pages/DashboardPage/DashboardPage.jsx";
import Operators from "./components/ESD/Operators/Operators.jsx";
import StationList from "./components/ESD/StationList/StationList.jsx";
import Monitors from "./components/ESD/Monitors/Monitors.jsx";
import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage/LoginPage.jsx";
import SignUpPage from "./pages/SignUpPage/SignUpPage.jsx";
import ProtectedRoute from "./ProtectedRoute";
import ESDHomeDashboardPage from "./pages/ESD/ESDHome/ESDHomeDashboardPage/ESDHomeDashboardPage.jsx";

const AppRoutes = () => {
  useEffect(() => {
    document.title = "FCT Auto Test";
  }, []);

  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <ESDHomeDashboardPage />
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<SignUpPage />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/users"
          element={
            <ProtectedRoute>
              <Operators />
            </ProtectedRoute>
          }
        />
        <Route
          path="/stations"
          element={
            <ProtectedRoute>
              <StationList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/esd-dashboard"
          element={
            <ProtectedRoute>
              <ESDHomeDashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/monitors"
          element={
            <ProtectedRoute>
              <Monitors />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
};

export default AppRoutes;
