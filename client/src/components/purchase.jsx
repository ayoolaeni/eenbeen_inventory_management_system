import React, { useState, useEffect } from "react";
import { Fragment } from "react";


const Purchase = () => {
  const [purchases, setPurchases] = useState([]);
  const [formData, setFormData] = useState({
    product_id: "",
    customer_id: "",
    quantity: "",
    total_cost: "",
  });
  const [editId, setEditId] = useState(null);

  // Fetch all purchases
  const getPurchases = async () => {
    try {
      const response = await fetch("http://localhost:3100/purchases");
      const data = await response.json();
      setPurchases(data);
    } catch (err) {
      console.error(err.message);
    }
  };

  // Create or Update a purchase
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const method = editId ? "PUT" : "POST";
      const url = editId
        ? `http://localhost:3100/purchases/${editId}`
        : "http://localhost:3100/purchases";
      const response = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (method === "POST") {
        setPurchases([...purchases, data]);
      } else {
        setPurchases(
          purchases.map((purchase) =>
            purchase.purchase_id === editId ? data : purchase
          )
        );
      }
      resetForm();
    } catch (err) {
      console.error(err.message);
    }
  };

  // Delete a purchase
  const deletePurchase = async (id) => {
    try {
      await fetch(`http://localhost:3100/purchases/${id}`, {
        method: "DELETE",
      });
      setPurchases(purchases.filter((purchase) => purchase.purchase_id !== id));
    } catch (err) {
      console.error(err.message);
    }
  };

  // Set form data for editing
  const handleEdit = (purchase) => {
    setFormData({
      product_id: purchase.product_id,
      customer_id: purchase.customer_id,
      quantity: purchase.quantity,
      total_cost: purchase.total_cost,
    });
    setEditId(purchase.purchase_id);
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      product_id: "",
      customer_id: "",
      quantity: "",
      total_cost: "",
    });
    setEditId(null);
  };

  useEffect(() => {
    getPurchases();
  }, []);

  return (
    <Fragment>
      <div className="container mt-4">
        <h2 className="text-center">Purchase Management</h2>
        <form onSubmit={handleSubmit} className="mb-4">
          <div className="row">
            <div className="col-md-3">
              <input
                type="text"
                className="form-control"
                placeholder="Product ID"
                value={formData.product_id}
                onChange={(e) =>
                  setFormData({ ...formData, product_id: e.target.value })
                }
                required
              />
            </div>
            <div className="col-md-3">
              <input
                type="text"
                className="form-control"
                placeholder="Customer ID"
                value={formData.customer_id}
                onChange={(e) =>
                  setFormData({ ...formData, customer_id: e.target.value })
                }
                required
              />
            </div>
            <div className="col-md-2">
              <input
                type="number"
                className="form-control"
                placeholder="Quantity"
                value={formData.quantity}
                onChange={(e) =>
                  setFormData({ ...formData, quantity: e.target.value })
                }
                required
              />
            </div>
            <div className="col-md-3">
              <input
                type="number"
                step="0.01"
                className="form-control"
                placeholder="Total Cost"
                value={formData.total_cost}
                onChange={(e) =>
                  setFormData({ ...formData, total_cost: e.target.value })
                }
                required
              />
            </div>
            <div className="col-md-1">
              <button type="submit" className="btn btn-primary">
                {editId ? "Update" : "Add"}
              </button>
            </div>
          </div>
        </form>
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Purchase ID</th>
              <th>Product ID</th>
              <th>Customer ID</th>
              <th>Quantity</th>
              <th>Total Cost</th>
              <th>Purchase Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {purchases.map((purchase) => (
              <tr key={purchase.purchase_id}>
                <td>{purchase.purchase_id}</td>
                <td>{purchase.product_id}</td>
                <td>{purchase.customer_id}</td>
                <td>{purchase.quantity}</td>
                <td>{purchase.total_cost}</td>
                <td>{purchase.purchase_date}</td>
                <td>
                  <button
                    className="btn btn-warning btn-sm me-2"
                    onClick={() => handleEdit(purchase)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => deletePurchase(purchase.purchase_id)}
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

export default Purchase;
