import React from "react";
import { Routes, Route } from "react-router-dom";
import DashboardPage from "../pages/DashboardPage/DashboardPage";
import ESDDashboardPage from "../pages/ESD/ESDHome/ESDDashboardPage/ESDDashboardPage";
import StationList from "../components/ESD/StationList/StationList";
import Operators from "../components/ESD/Operators/Operators";
import Monitors from "../components/ESD/Monitors/Monitors";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<ESDDashboardPage />} />
      {/* <Route path="/login-esd" element={<Login />} /> */}
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/users" element={<Operators />} />
      <Route path="/stations" element={<StationList />} />
      <Route path="/esd-dashboard" element={<ESDDashboardPage />} />
      <Route path="/monitors" element={<Monitors />} />
    </Routes>
  );
};

export default AppRoutes;
