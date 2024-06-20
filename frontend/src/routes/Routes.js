import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from '../pages/HomePage/HomePage';
import UserListPage from '../pages/UserListPage/UserListPage';
import DashboardPage from '../pages/DashboardPage/DashboardPage';
import Operator from '../pages/Operator/Operator';

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/users" element={<UserListPage />} />
            <Route path="/users/:id" element={<Operator />} />
        </Routes>
    );
};

export default AppRoutes;