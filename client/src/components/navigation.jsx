import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Sidebar = ({ onLogout, role }) => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    onLogout();
    navigate("/admin-login");
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="flex h-screen">
      {/* Mobile toggle button */}
      <button
        className="lg:hidden p-4 text-white bg-blue-500 hover:bg-blue-600 fixed z-20 top-4 left-4 rounded-md shadow-md"
        onClick={toggleSidebar}
      >
        {isOpen ? "Close" : "Menu"}
      </button>

      {/* Sidebar */}
      <div
        className={`bg-gray-900 text-white w-64 fixed lg:static h-full transition-transform transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 ease-in-out duration-300`}
      >
        <h4 className="text-center text-xl font-bold p-4 border-b border-gray-700">
          Workflow Navigation
        </h4>
        <ul className="space-y-4 p-4">
          {/* Dashboard */}
          <li>
            <Link
              to="/dashboard"
              className="flex items-center p-2 hover:bg-gray-700 rounded transition duration-300 ease-in-out"
            >
              <i className="bi bi-speedometer2 mr-2"></i> Dashboard
            </Link>
          </li>

          {/* Setup (Admin only) */}
          {role === "admin" && (
            <>
              <li className="text-gray-400 uppercase text-xs px-2">Setup</li>
             
              <li>
                <Link
                  to="/warehouse-management"
                  className="flex items-center p-2 hover:bg-gray-700 rounded transition duration-300 ease-in-out"
                >
                  <i className="bi bi-building mr-2"></i> Warehouse Management
                </Link>
              </li>
              <li>
                <Link
                  to="/user-management"
                  className="flex items-center p-2 hover:bg-gray-700 rounded transition duration-300 ease-in-out"
                >
                  <i className="bi bi-person-gear mr-2"></i> User Management
                </Link>
              </li>
            </>
          )}

          {/* Common: Products */}
          <li>
            <Link
              to="/products"
              className="flex items-center p-2 hover:bg-gray-700 rounded transition duration-300 ease-in-out"
            >
              <i className="bi bi-box-seam mr-2"></i> Product Management
            </Link>
          </li>

          {/* Transactions */}
          <li className="text-gray-400 uppercase text-xs px-2 mt-4">Transactions</li>
          {role === "admin" && (
            <li>
              <Link
                to="/purchase-management"
                className="flex items-center p-2 hover:bg-gray-700 rounded transition duration-300 ease-in-out"
              >
                <i className="bi bi-cart-plus mr-2"></i> Purchase Management
              </Link>
            </li>
          )}
          <li>
            <Link
              to="/sales-management"
              className="flex items-center p-2 hover:bg-gray-700 rounded transition duration-300 ease-in-out"
            >
              <i className="bi bi-receipt mr-2"></i> Sales Management
            </Link>
          </li>

          {/* Tracking */}
          <li className="text-gray-400 uppercase text-xs px-2 mt-4">Tracking</li>
          <li>
            <Link
              to="/inventory-management"
              className="flex items-center p-2 hover:bg-gray-700 rounded transition duration-300 ease-in-out"
            >
              <i className="bi bi-box2-heart mr-2"></i> Inventory Management
            </Link>
          </li>

          {/* Reports (Admin only) */}
          {role === "admin" && (
            <>
              <li className="text-gray-400 uppercase text-xs px-2 mt-4">Reports</li>
              <li>
                <Link
                  to="/reports"
                  className="flex items-center p-2 hover:bg-gray-700 rounded transition duration-300 ease-in-out"
                >
                  <i className="bi bi-bar-chart-line mr-2"></i> Reports & Analytics
                </Link>
              </li>
              <li>
                <Link
                  to="/customer-management"
                  className="flex items-center p-2 hover:bg-gray-700 rounded transition duration-300 ease-in-out"
                >
                  <i className="bi bi-people mr-2"></i> Customer Management
                </Link>
              </li>
            </>
          )}

          {/* Logout */}
          <li>
          <button
            className="flex items-center p-2 bg-gray-800 hover:bg-gray-700 rounded w-full text-left transition duration-300 ease-in-out"
            onClick={handleLogout}
          >
            <i className="bi bi-person-circle mr-2"></i> Logout
          </button>
        </li>
        </ul>
      </div>

      {/* Content Area */}
      <div className="flex-1 bg-gray-100 p-4 lg:ml-10">
        {/* Main content goes here */}
      </div>
    </div>
  );
};

export default Sidebar;
