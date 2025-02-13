import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import App from './App';
import Login from './components/dashboard/login';
import AdminLayout from './components/dashboard/AdminLayout';
import ReservationsDashboard from './components/dashboard/ReservationsDashboard';
import { useAuth } from './context/AuthContext';

function AppRouter() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/admin" />} />
      <Route path="/admin" element={isAuthenticated ? <AdminLayout /> : <Navigate to="/login" />}>
        <Route index element={<ReservationsDashboard />} />
      </Route>
      <Route path="/*" element={<App />} />
    </Routes>
  );
}

export default AppRouter;
