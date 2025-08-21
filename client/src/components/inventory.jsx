
import React, { Fragment, useEffect, useState, useCallback } from "react";

const Inventory = () => {
  const [inventories, setInventories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filterWarehouse, setFilterWarehouse] = useState("all");
  const [warehouses, setWarehouses] = useState([]);

  // ✅ Wrap with useCallback so it's stable across renders
  const getInventory = useCallback(
    async (warehouseId = filterWarehouse) => {
      try {
        setLoading(true);

        const url =
          warehouseId === "all"
            ? "http://localhost:3100/inventory"
            : `http://localhost:3100/inventory/${warehouseId}`;

        const res = await fetch(url);
        const data = await res.json();

        // Ensure it's always an array so .map() never crashes
        setInventories(Array.isArray(data) ? data : [data]);
      } catch (err) {
        console.error("Error fetching inventory:", err);
      } finally {
        setLoading(false);
      }
    },
    [filterWarehouse] // ✅ re-create only when filter changes
  );

  const getWarehouses = useCallback(async () => {
    try {
      const res = await fetch("http://localhost:3100/warehouses");
      const data = await res.json();
      setWarehouses(data);
    } catch (err) {
      console.error("Error fetching warehouses:", err);
    }
  }, []);

  // Initial load + interval refresh
  useEffect(() => {
    getInventory();
    getWarehouses();

    const id = setInterval(() => getInventory(), 10000);
    return () => clearInterval(id);
  }, [getInventory, getWarehouses]);

  // Re-fetch when warehouse filter changes
  useEffect(() => {
    getInventory(filterWarehouse);
  }, [filterWarehouse, getInventory]);

  return (
    <Fragment>
      <div className="container mx-auto my-6 px-4">
        {/* Header + Refresh */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
          <h1 className="text-2xl font-semibold">Inventory Workflow</h1>
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            onClick={() => getInventory(filterWarehouse)}
            disabled={loading}
          >
            {loading ? "Refreshing..." : "Refresh"}
          </button>
        </div>

        {/* Warehouse Filter */}
        <div className="flex flex-wrap gap-4 mb-4">
          <select
            value={filterWarehouse}
            onChange={(e) => setFilterWarehouse(e.target.value)}
            className="px-3 py-2 border rounded"
          >
            <option value="all">All Warehouses</option>
            {warehouses.map((wh) => (
              <option key={wh.warehouse_id} value={wh.warehouse_id}>
                {wh.warehouse_name}
              </option>
            ))}
          </select>
        </div>

        {/* Inventory Table */}
        <div className="overflow-x-auto bg-white shadow rounded">
          <table className="min-w-full table-auto">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2 text-left">#</th>
                <th className="px-4 py-2 text-left">Product</th>
                <th className="px-4 py-2 text-left">Warehouse</th>
                <th className="px-4 py-2 text-left">Quantity</th>
                <th className="px-4 py-2 text-left">Last Updated</th>
                <th className="px-4 py-2 text-left">Updated By</th>
              </tr>
            </thead>
            <tbody>
              {inventories.length ? (
                inventories.map((row) => (
                  <tr
                    key={row.inventory_id}
                    className={`border-b ${
                      row.quantity <= 0 ? "bg-red-50" : "bg-green-50"
                    }`}
                  >
                    <td className="px-4 py-2">{row.inventory_id}</td>
                    <td className="px-4 py-2">{row.product_name}</td>
                    <td className="px-4 py-2">{row.warehouse_name}</td>
                    <td className="px-4 py-2 font-semibold">{row.quantity}</td>
                    <td className="px-4 py-2">
                      {row.last_updated
                        ? new Date(row.last_updated).toLocaleString()
                        : "-"}
                    </td>
                    <td className="px-4 py-2">{row.updated_by || "System"}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="6"
                    className="px-4 py-8 text-center text-gray-500"
                  >
                    No inventory yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <p className="text-sm text-gray-500 mt-3">
          ✅ Purchases increase stock, ❌ Sales decrease stock.
          <br />
          Inventory is auto-updated after each transaction.
        </p>
      </div>
    </Fragment>
  );
};

export default Inventory;
