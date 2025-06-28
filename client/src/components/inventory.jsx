import React, { Fragment, useEffect, useState } from "react";

const Inventory = () => {
  const [inventories, setInventories] = useState([]);
  const [formData, setFormData] = useState({
    product_id: "",
    quantity: "",
    warehouse_id: "",
  });
  const [editId, setEditId] = useState(null);

  // Fetch inventory items from the backend
  const getInventory = async () => {
    try {
      const response = await fetch("http://localhost:3100/inventory", {
        method: "GET",
      });
      const data = await response.json();
      setInventories(data);
    } catch (err) {
      console.error("Error fetching inventory:", err.message);
    }
  };

  // Handle form data changes
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Create a new inventory item
  const addInventory = async () => {
    try {
      const response = await fetch("http://localhost:3100/inventory", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const newInventory = await response.json();
      setInventories([...inventories, newInventory]);
      setFormData({ product_id: "", quantity: "", warehouse_id: "" });
    } catch (err) {
      console.error("Error adding inventory:", err.message);
    }
  };

  // Delete an inventory item
  const deleteInventory = async (id) => {
    try {
      await fetch(`http://localhost:3100/inventory/${id}`, {
        method: "DELETE",
      });
      setInventories(inventories.filter((item) => item.inventory_id !== id));
    } catch (err) {
      console.error("Error deleting inventory:", err.message);
    }
  };

  // Update an inventory item
  const updateInventory = async () => {
    try {
      const response = await fetch(`http://localhost:3100/inventory/${editId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const updatedItem = await response.json();
      setInventories(
        inventories.map((item) =>
          item.inventory_id === editId ? updatedItem : item
        )
      );
      setEditId(null);
      setFormData({ product_id: "", quantity: "", warehouse_id: "" });
    } catch (err) {
      console.error("Error updating inventory:", err.message);
    }
  };

  useEffect(() => {
    getInventory();
  }, []);

  return (
    <Fragment>
      <div className="container mt-5">
        <h1 className="text-center mb-4">Inventory Management</h1>

        {/* Add/Edit Inventory Form */}
        <form
          className="mb-4"
          onSubmit={(e) => {
            e.preventDefault();
            editId ? updateInventory() : addInventory();
          }}
        >
          <div className="row g-3">
            <div className="col-md-3">
              <input
                type="text"
                name="product_id"
                value={formData.product_id}
                className="form-control"
                placeholder="Product ID"
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="col-md-3">
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                className="form-control"
                placeholder="Quantity"
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="col-md-3">
              <input
                type="text"
                name="warehouse_id"
                value={formData.warehouse_id}
                className="form-control"
                placeholder="Warehouse ID"
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="col-md-3">
              <button type="submit" className="btn btn-primary w-100">
                {editId ? "Update" : "Add"}
              </button>
            </div>
          </div>
        </form>

        {/* Inventory Table */}
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Inventory ID</th>
              <th>Product ID</th>
              <th>Quantity</th>
              <th>Warehouse ID</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {inventories.map((item) => (
              <tr key={item.inventory_id}>
                <td>{item.inventory_id}</td>
                <td>{item.product_id}</td>
                <td>{item.quantity}</td>
                <td>{item.warehouse_id}</td>
                <td>
                  <button
                    className="btn btn-warning btn-sm me-2"
                    onClick={() => {
                      setEditId(item.inventory_id);
                      setFormData({
                        product_id: item.product_id,
                        quantity: item.quantity,
                        warehouse_id: item.warehouse_id,
                      });
                    }}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => deleteInventory(item.inventory_id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Fragment>
  );
};

export default Inventory;
