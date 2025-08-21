import React, { useState, useEffect, Fragment } from "react";

const Purchase = () => {
  const [purchases, setPurchases] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [formData, setFormData] = useState({
    product_id: "",
    warehouse_id: "",
    vendor_name: "",
    quantity: "",
    total_cost: "",
  });
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch purchases
  const getPurchases = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:3100/purchases");
      const data = await res.json();
      setPurchases(data);
    } catch (err) {
      console.error("Error fetching purchases:", err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch warehouses for dropdown
  const getWarehouses = async () => {
    try {
      const res = await fetch("http://localhost:3100/warehouses");
      const data = await res.json();
      setWarehouses(data);
    } catch (err) {
      console.error("Error fetching warehouses:", err);
    }
  };

  useEffect(() => {
    getPurchases();
    getWarehouses();
  }, []);

  // Convert empty string to null or number
  const safeNumber = (val) => (val === "" ? null : Number(val));

  // Submit form (POST or PUT)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const method = editId ? "PUT" : "POST";
      const url = editId
        ? `http://localhost:3100/purchases/${editId}`
        : "http://localhost:3100/purchases";

      const payload = {
        product_id: safeNumber(formData.product_id),
        warehouse_id: safeNumber(formData.warehouse_id),
        quantity: safeNumber(formData.quantity),
        total_cost: safeNumber(formData.total_cost),
        vendor_name: formData.vendor_name || null,
      };

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Server Error");
      }

      const data = await res.json();

      if (method === "POST") setPurchases([...purchases, data]);
      else
        setPurchases(
          purchases.map((p) => (p.purchase_id === editId ? data : p))
        );

      await updateInventory();
      resetForm();
    } catch (err) {
      console.error("Error saving purchase:", err.message);
    }
  };

  // Delete purchase
  const deletePurchase = async (id) => {
    try {
      await fetch(`http://localhost:3100/purchases/${id}`, { method: "DELETE" });
      setPurchases(purchases.filter((p) => p.purchase_id !== id));
      await updateInventory();
    } catch (err) {
      console.error("Error deleting purchase:", err);
    }
  };

  // Inventory recalculation
  const updateInventory = async () => {
    try {
      await fetch("http://localhost:3100/inventory/recalculate", { method: "POST" });
    } catch (err) {
      console.error("Error updating inventory:", err);
    }
  };

  // Edit form
  const handleEdit = (purchase) => {
    setFormData({
      product_id: purchase.product_id,
      warehouse_id: purchase.warehouse_id,
      vendor_name: purchase.vendor_name,
      quantity: purchase.quantity,
      total_cost: purchase.total_cost,
    });
    setEditId(purchase.purchase_id);
  };

  const resetForm = () => {
    setFormData({ product_id: "", warehouse_id: "", vendor_name: "", quantity: "", total_cost: "" });
    setEditId(null);
  };

  return (
    <Fragment>
      <div className="container mt-4">
        <h2 className="text-center">Purchase Management</h2>

        <form onSubmit={handleSubmit} className="mb-4">
          <div className="row">
            <div className="col-md-2">
              <input
                type="number"
                className="form-control"
                placeholder="Product ID"
                value={formData.product_id}
                onChange={(e) => setFormData({ ...formData, product_id: e.target.value })}
                required
              />
            </div>

            <div className="col-md-2">
              <select
                className="form-control"
                value={formData.warehouse_id}
                onChange={(e) => setFormData({ ...formData, warehouse_id: e.target.value })}
                required
              >
                <option value="">Select Warehouse</option>
                {warehouses.map((w) => (
                  <option key={w.warehouse_id} value={w.warehouse_id}>
                    {w.warehouse_name}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-2">
              <input
                type="text"
                className="form-control"
                placeholder="Vendor Name"
                value={formData.vendor_name}
                onChange={(e) => setFormData({ ...formData, vendor_name: e.target.value })}
              />
            </div>

            <div className="col-md-2">
              <input
                type="number"
                className="form-control"
                placeholder="Quantity"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                required
              />
            </div>

            <div className="col-md-2">
              <input
                type="number"
                step="0.01"
                className="form-control"
                placeholder="Total Cost"
                value={formData.total_cost}
                onChange={(e) => setFormData({ ...formData, total_cost: e.target.value })}
              />
            </div>

            <div className="col-md-2">
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
              <th>Warehouse</th>
              <th>Vendor</th>
              <th>Quantity</th>
              <th>Total Cost</th>
              <th>Purchase Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {purchases.map((p) => (
              <tr key={p.purchase_id}>
                <td>{p.purchase_id}</td>
                <td>{p.product_id}</td>
                <td>{p.warehouse_name || p.warehouse_id}</td>
                <td>{p.vendor_name}</td>
                <td>{p.quantity}</td>
                <td>{p.total_cost}</td>
                <td>{p.purchase_date ? new Date(p.purchase_date).toLocaleDateString() : "-"}</td>
                <td>
                  <button className="btn btn-warning btn-sm me-2" onClick={() => handleEdit(p)}>Edit</button>
                  <button className="btn btn-danger btn-sm" onClick={() => deletePurchase(p.purchase_id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <p className="text-muted small mt-3">
          ✅ Every Add, Update, or Delete automatically triggers inventory recalculation.
        </p>
      </div>
    </Fragment>
  );
};

export default Purchase;
