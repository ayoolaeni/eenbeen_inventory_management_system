import React, { Fragment, useState, useEffect } from "react";

const Warehouses = () => {
  const [warehouses, setWarehouses] = useState([]);
  const [formData, setFormData] = useState({ warehouse_name: "", location: "" });
  const [editWarehouse, setEditWarehouse] = useState(null);
  const API_URL = "http://localhost:3100/warehouses";

  const fetchWarehouses = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setWarehouses(data);
    } catch (error) {
      console.error("Error fetching warehouses:", error);
    }
  };

  useEffect(() => {
    fetchWarehouses();
  }, []);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const method = editWarehouse ? "PUT" : "POST";
      const url = editWarehouse ? `${API_URL}/${editWarehouse.warehouse_id}` : API_URL;

      await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      setFormData({ warehouse_name: "", location: "" });
      setEditWarehouse(null);
      fetchWarehouses();
    } catch (error) {
      console.error("Error submitting warehouse:", error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this warehouse?")) return;
    try {
      await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      fetchWarehouses();
    } catch (error) {
      console.error("Error deleting warehouse:", error);
    }
  };

  const handleEdit = (warehouse) => {
    setEditWarehouse(warehouse);
    setFormData({
      warehouse_name: warehouse.warehouse_name,
      location: warehouse.location,
    });
  };

  return (
    <Fragment>
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-semibold text-center mb-6">
          Warehouse Management
        </h1>

        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h3 className="text-xl font-medium text-center mb-4">
            {editWarehouse ? "Edit Warehouse" : "Add Warehouse"}
          </h3>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Warehouse Name
              </label>
              <input
                type="text"
                name="warehouse_name"
                className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                placeholder="Enter Warehouse Name"
                value={formData.warehouse_name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Location
              </label>
              <input
                type="text"
                name="location"
                className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                placeholder="Enter Location"
                value={formData.location}
                onChange={handleChange}
                required
              />
            </div>
            <div className="flex justify-between">
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
              >
                {editWarehouse ? "Update Warehouse" : "Add Warehouse"}
              </button>
              {editWarehouse && (
                <button
                  type="button"
                  className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
                  onClick={() => {
                    setEditWarehouse(null);
                    setFormData({ warehouse_name: "", location: "" });
                  }}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        <h3 className="text-xl font-semibold text-center mb-4">
          Warehouse List
        </h3>
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border-collapse border border-gray-300">
            <thead>
              <tr>
                <th className="px-4 py-2 border border-gray-300 text-left">ID</th>
                <th className="px-4 py-2 border border-gray-300 text-left">Name</th>
                <th className="px-4 py-2 border border-gray-300 text-left">Location</th>
                <th className="px-4 py-2 border border-gray-300 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {warehouses.length > 0 ? (
                warehouses.map((warehouse) => (
                  <tr key={warehouse.warehouse_id}>
                    <td className="px-4 py-2 border border-gray-300">
                      {warehouse.warehouse_id}
                    </td>
                    <td className="px-4 py-2 border border-gray-300">
                      {warehouse.warehouse_name}
                    </td>
                    <td className="px-4 py-2 border border-gray-300">
                      {warehouse.location}
                    </td>
                    <td className="px-4 py-2 border border-gray-300">
                      <button
                        className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600 mr-2"
                        onClick={() => handleEdit(warehouse)}
                      >
                        Edit
                      </button>
                      <button
                        className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                        onClick={() => handleDelete(warehouse.warehouse_id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="4"
                    className="px-4 py-2 text-center text-gray-500"
                  >
                    No warehouses available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Fragment>
  );
};

export default Warehouses;
