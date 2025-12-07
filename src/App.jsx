import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './Login';
import MainLayout from './MainLayout';
import Dashboard from './pages/Dashboard';
import Employee from './pages/Employee';
import Branch from './pages/Branch';
import Shift from './pages/Shift';
import Chat from './pages/Chat';
import Schedule from './pages/Schedule';
import Profile from './pages/Profile'; // ✅ 1. Nhớ Import file này

// Component bảo vệ (giữ nguyên)
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/" replace />;
  }
  return children;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Trang Login */}
        <Route path="/" element={<Login />} />

        {/* Cụm trang Admin (Có Menu bên trái) */}
        <Route
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/employees" element={<Employee />} />
          <Route path="/branches" element={<Branch />} />
          <Route path="/shifts" element={<Shift />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/schedule" element={<Schedule />} />
          
          {/* ✅ 2. THÊM DÒNG NÀY VÀO ĐÂY */}
          <Route path="/profile" element={<Profile />} /> 

        </Route>

        {/* Nếu gõ linh tinh thì đá về Login */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;