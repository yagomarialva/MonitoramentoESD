import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from '../modules/FacialRecognition/HomePage/HomePage';
import UserListPage from '../modules/FacialRecognition/UserListPage/UserListPage';
import DashboardPage from '../modules/DashboardPage/DashboardPage';
import Operator from '../modules/FacialRecognition/Operator/Operator';

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