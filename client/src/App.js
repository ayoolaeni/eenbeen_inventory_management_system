import React, { useState } from 'react';
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

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  return (
    <Router>
      <div className="d-flex">
        {isAuthenticated && <Sidebar onLogout={handleLogout} />}

        <div className="flex-grow-1 p-3">
          <Routes>
            {/* Public Login Route */}
            <Route
              path="/admin-login"
              element={<Admin onLogin={handleLogin} />}
            />

            {/* Protected Routes */}
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

            {/* Redirect any other route to login */}
            <Route path="*" element={<Navigate to="/admin-login" />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
