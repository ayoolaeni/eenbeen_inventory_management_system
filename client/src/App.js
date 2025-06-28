import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './components/dashboard';
import Admin from './components/admin';
import Sidebar from './components/navigation';
import Products from './components/product';
import Categories from './components/category';
import Inventory from './components/inventory';
import Purchase from './components/purchase';
import Warehouses from './components/warehouse';
import Sales from './components/sales';
import Customer from './components/customer';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // ✅ Check localStorage on page load
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  // ✅ Set auth on login
  const handleLogin = () => {
    localStorage.setItem('authToken', 'example_token'); // Replace with real token if available
    setIsAuthenticated(true);
  };

  // ✅ Remove auth on logout
  const handleLogout = () => {
    localStorage.removeItem('authToken');
    setIsAuthenticated(false);
  };

  return (
    <Router>
      <div className="d-flex">
        {isAuthenticated && <Sidebar onLogout={handleLogout} />}

        <div className="flex-grow-1 p-3">
          <Routes>

            {/* ✅ If already logged in, redirect from login page to dashboard */}
            <Route
              path="/admin-login"
              element={
                isAuthenticated
                  ? <Navigate to="/dashboard" />
                  : <Admin onLogin={handleLogin} />
              }
            />

            {/* ✅ Protected Routes */}
            <Route
              path="/dashboard"
              element={isAuthenticated ? <Dashboard /> : <Navigate to="/admin-login" />}
            />
            <Route
              path="/category-management"
              element={isAuthenticated ? <Categories /> : <Navigate to="/admin-login" />}
            />
            <Route
              path="/products"
              element={isAuthenticated ? <Products /> : <Navigate to="/admin-login" />}
            />
            <Route
              path="/warehouse-management"
              element={isAuthenticated ? <Warehouses /> : <Navigate to="/admin-login" />}
            />
            <Route
              path="/inventory-management"
              element={isAuthenticated ? <Inventory /> : <Navigate to="/admin-login" />}
            />
            <Route
              path="/customer-management"
              element={isAuthenticated ? <Customer /> : <Navigate to="/admin-login" />}
            />
            <Route
              path="/purchase-management"
              element={isAuthenticated ? <Purchase /> : <Navigate to="/admin-login" />}
            />
            <Route
              path="/sales-management"
              element={isAuthenticated ? <Sales /> : <Navigate to="/admin-login" />}
            />

            {/* ✅ Default route: redirect based on login state */}
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
