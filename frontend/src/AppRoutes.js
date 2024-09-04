import React from "react";
import "./i18n.js"; // ts => import './i18n.ts'
import { useEffect } from "react";
import { useAuth } from "./context/AuthContext.js";
import HomePage from "./pages/HomePage/HomePage.jsx";
import Operators from "./components/ESD/Operators/Operators.jsx";
import Jig from "./components/ESD/Jigs/Jig.jsx";
import Monitors from "./components/ESD/Monitors/Monitors.jsx";
import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage/LoginPage.jsx";
import SignUpPage from "./pages/SignUpPage/SignUpPage.jsx";
import ProtectedRoute from "./ProtectedRoute";
import DashboardESD from "./components/ESD/DashboardESD/DashboardESD.jsx";
import Line from "./components/ESD/Line/Line.jsx";
import NotFoundPage from "./components/NotFoundPage/NotFoundPage.jsx";
import Station from "./components/ESD/Station/Station.jsx";
import LinkStationLine from "./components/ESD/LinkStationLine/LinkStationLine.jsx";
import ESDTableView from "./pages/ESD/ESDHome/ESDHomeDashboardPage/ESDTableView.jsx";
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
              <HomePage />
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<SignUpPage />} />
        {/* <Route
          path="/register"
          element={
            <ProtectedRoute>
              <SignUpPage />
            </ProtectedRoute>
          }
        /> */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardESD />
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
          path="/jigs"
          element={
            <ProtectedRoute>
              <Jig />
            </ProtectedRoute>
          }
        />
        <Route
          path="/esd-dashboard"
          element={
            <ProtectedRoute>
              <DashboardESD />
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
        <Route
          path="/liners"
          element={
            <ProtectedRoute>
              <Line />
            </ProtectedRoute>
          }
        />
        <Route
          path="/stations"
          element={
            <ProtectedRoute>
              <Station />
            </ProtectedRoute>
          }
        />
        <Route
          path="/linkstationline"
          element={
            <ProtectedRoute>
              <LinkStationLine />
            </ProtectedRoute>
          }
        />

        <Route
          path="/mocked"
          element={
            <ProtectedRoute>
              <ESDTableView />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
};

export default AppRoutes;
