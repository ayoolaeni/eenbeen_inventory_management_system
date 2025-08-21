

import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './components/dashboard';
import Admin from './components/admin';
import Sidebar from './components/navigation';
import Products from './components/product';
import Inventory from './components/inventory';
import Purchase from './components/purchase';
import Warehouses from './components/warehouse';
import Sales from './components/sales';
import Customer from './components/customer';
import UserManagement from './components/UserManagement'; // ✅ add new page

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState(null); // ✅ store role

  // ✅ Check localStorage on page load
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('role');
    if (token && userRole) {
      setIsAuthenticated(true);
      setRole(userRole);
    }
  }, []);

  // ✅ Set auth + role on login
  const handleLogin = () => {
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('role');

    if (token && userRole) {
      setIsAuthenticated(true);
      setRole(userRole);
    }
  };

  // ✅ Remove auth on logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    setIsAuthenticated(false);
    setRole(null);
  };

  // ✅ Protect routes by role
  const PrivateRoute = ({ children, allowedRoles }) => {
    if (!isAuthenticated) {
      return <Navigate to="/admin-login" />;
    }
    if (allowedRoles && !allowedRoles.includes(role)) {
      return <Navigate to="/dashboard" />; // redirect if role not allowed
    }
    return children;
  };

  return (
    <Router>
      <div className="d-flex">
        {isAuthenticated && <Sidebar onLogout={handleLogout} role={role} />} 
        {/* ✅ pass role to sidebar */}

        <div className="flex-grow-1 p-3">
          <Routes>

            {/* ✅ Login page */}
            <Route
              path="/admin-login"
              element={
                isAuthenticated
                  ? <Navigate to="/dashboard" />
                  : <Admin onLogin={handleLogin} />
              }
            />

            {/* ✅ Shared routes (admin + sales) */}
            <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
            <Route path="/products" element={<PrivateRoute><Products /></PrivateRoute>} />
            <Route path="/inventory-management" element={<PrivateRoute><Inventory /></PrivateRoute>} />
            <Route path="/sales-management" element={<PrivateRoute><Sales /></PrivateRoute>} />

            {/* ✅ Admin-only routes */}
           
            <Route
              path="/warehouse-management"
              element={<PrivateRoute allowedRoles={['admin']}><Warehouses /></PrivateRoute>}
            />
            <Route
              path="/customer-management"
              element={<PrivateRoute allowedRoles={['admin']}><Customer /></PrivateRoute>}
            />
            <Route
              path="/purchase-management"
              element={<PrivateRoute allowedRoles={['admin']}><Purchase /></PrivateRoute>}
            />
            <Route
              path="/user-management"
              element={<PrivateRoute allowedRoles={['admin']}><UserManagement /></PrivateRoute>}
            />

            {/* ✅ Default route */}
            <Route
              path="*"
              element={<Navigate to={isAuthenticated ? "/dashboard" : "/admin-login"} />}
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;

