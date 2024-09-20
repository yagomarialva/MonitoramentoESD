import React, { useEffect } from "react";
import "./i18n"; // ts => import './i18n.ts'
import { useAuth } from "./context/AuthContext"; // Remova a extensão do arquivo em imports no TS
import HomePage from "./pages/HomePage/HomePage";
import Operators from "./components/ESD/Operators/Operators";
import Jig from "./components/ESD/Jigs/Jig";
import Monitors from "./components/ESD/Monitors/Monitors";
import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage/LoginPage";
import SignUpPage from "./pages/SignUpPage/SignUpPage";
import ProtectedRoute from "./ProtectedRoute";
import DashboardESD from "./components/ESD/DashboardESD/DashboardESD";
import Line from "./components/ESD/Line/Line";
import NotFoundPage from "./components/NotFoundPage/NotFoundPage";
import Station from "./components/ESD/Station/Station";
import LinkStationLine from "./components/ESD/LinkStationLine/LinkStationLine";
import ESDTableView from "./pages/ESD/ESDHome/ESDHomeDashboardPage/ESDTableView";

const AppRoutes: React.FC = () => {
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
        {/* Se quiser proteger a rota de registro */}
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
