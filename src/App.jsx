import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './Login';
import MainLayout from './MainLayout';
import Dashboard from './pages/Dashboard';
import Employee from './pages/Employee';
import Branch from './pages/Branch';
import Shift from './pages/Shift'; 

// Component bảo vệ (giữ nguyên nếu bạn đã có)
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
      {/* --- BẮT ĐẦU CỤM ROUTES (QUAN TRỌNG) --- */}
      <Routes>
        
        {/* Trang Login */}
        <Route path="/" element={<Login />} />

        {/* Các trang Admin */}
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
        </Route>

      </Routes> 
      {/* --- KẾT THÚC CỤM ROUTES (Bạn hay bị thiếu cái này) --- */}
    </BrowserRouter>
  );
}

export default App;