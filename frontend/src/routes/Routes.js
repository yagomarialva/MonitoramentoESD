import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from '../pages/HomePage/HomePage';
import UserListPage from '../pages/UserListPage/UserListPage';
import DashboardPage from '../pages/DashboardPage/DashboardPage';
import BraceletList from '../components/ESD/BraceletList/BraceletList';
import ESDDashboardPage from '../pages/ESD/ESDHome/ESDDashboardPage/ESDDashboardPage';

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/users" element={<UserListPage />} />
            <Route path="/bracelets" element={<BraceletList />}/>
            <Route path="/esd-dashboard" element={<ESDDashboardPage />}/>
        </Routes>
    );
};

export default AppRoutes;