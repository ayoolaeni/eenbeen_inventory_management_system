// import React, { Fragment, useState, useEffect } from "react";

// const Sales = () => {
//   const [sales, setSales] = useState([]);
//   const [warehouses, setWarehouses] = useState([]);
//   const [products, setProducts] = useState([]);
//   const [formData, setFormData] = useState({
//     product_id: "",
//     warehouse_id: "",
//     quantity: "",
//     total_sale: "",
//   });
//   const [editSale, setEditSale] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [submitting, setSubmitting] = useState(false);
//   const [error, setError] = useState("");

//   // Fetch sales
//   const fetchSales = async () => {
//     try {
//       setLoading(true);
//       const response = await fetch("http://localhost:3100/sales");
//       const data = await response.json();
//       setSales(data);
//     } catch (err) {
//       console.error("Error fetching sales:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Fetch warehouses
//   const fetchWarehouses = async () => {
//     try {
//       const res = await fetch("http://localhost:3100/warehouses");
//       const data = await res.json();
//       setWarehouses(data);
//     } catch (err) {
//       console.error("Error fetching warehouses:", err);
//     }
//   };

//   // Fetch products
//   const fetchProducts = async () => {
//     try {
//       const res = await fetch("http://localhost:3100/product");
//       const data = await res.json();
//       setProducts(data);
//     } catch (err) {
//       console.error("Error fetching products:", err);
//     }
//   };

//   useEffect(() => {
//     fetchSales();
//     fetchWarehouses();
//     fetchProducts();
//   }, []);

//   const handleChange = (e) =>
//     setFormData({ ...formData, [e.target.name]: e.target.value });

//   const resetForm = () => {
//     setFormData({ product_id: "", warehouse_id: "", quantity: "", total_sale: "" });
//     setEditSale(null);
//     setError("");
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");
//     setSubmitting(true);
//     try {
//       const method = editSale ? "PUT" : "POST";
//       const endpoint = editSale
//         ? `http://localhost:3100/sales/${editSale.sales_id}`
//         : "http://localhost:3100/sales";

//       const response = await fetch(endpoint, {
//         method,
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(formData),
//       });

//       const payload = await response.json();
//       if (!response.ok) {
//         setError(payload?.error || "Failed to submit sale");
//       } else {
//         await fetchSales();
//         resetForm();
//       }
//     } catch (err) {
//       console.error("Error submitting sale:", err);
//       setError("Failed to submit sale");
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   const handleDelete = async (id) => {
//     if (!window.confirm("Delete this sale? Inventory will be restored.")) return;
//     try {
//       const response = await fetch(`http://localhost:3100/sales/${id}`, {
//         method: "DELETE",
//       });
//       if (!response.ok) {
//         const p = await response.json();
//         alert(p?.error || "Failed to delete sale");
//       } else {
//         fetchSales();
//       }
//     } catch (err) {
//       console.error("Error deleting sale:", err);
//     }
//   };

//   const handleEdit = (sale) => {
//     setEditSale(sale);
//     setFormData({
//       product_id: sale.product_id,
//       warehouse_id: sale.warehouse_id,
//       quantity: sale.quantity,
//       total_sale: sale.total_sale,
//     });
//   };

//   return (
//     <Fragment>
//       <div className="container mx-auto my-6 px-4">
//         <h1 className="text-3xl font-semibold text-center text-gray-800 mb-6">
//           Sales Management
//         </h1>

//         {/* Form */}
//         <div className="bg-white shadow-md rounded-lg p-6 mb-6">
//           <h3 className="text-2xl font-medium text-center text-gray-700 mb-4">
//             {editSale ? "Edit Sale" : "Add Sale"}
//           </h3>

//           {error ? (
//             <div className="mb-4 text-red-600 text-sm">{error}</div>
//           ) : null}

//           <form onSubmit={handleSubmit}>
//             {/* Product Dropdown */}
//             <div className="mb-4">
//               <label className="block text-gray-600 font-medium mb-2">
//                 Product
//               </label>
//               <select
//                 name="product_id"
//                 value={formData.product_id}
//                 onChange={handleChange}
//                 required
//                 className="w-full px-4 py-2 border rounded-md"
//               >
//                 <option value="">Select Product</option>
//                 {products.map((p) => (
//                   <option key={p.product_id} value={p.product_id}>
//                     {p.product_name}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             {/* Warehouse Dropdown */}
//             <div className="mb-4">
//               <label className="block text-gray-600 font-medium mb-2">
//                 Warehouse
//               </label>
//               <select
//                 name="warehouse_id"
//                 value={formData.warehouse_id}
//                 onChange={handleChange}
//                 required
//                 className="w-full px-4 py-2 border rounded-md"
//               >
//                 <option value="">Select Warehouse</option>
//                 {warehouses.map((wh) => (
//                   <option key={wh.warehouse_id} value={wh.warehouse_id}>
//                     {wh.warehouse_name}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             {/* Quantity */}
//             <div className="mb-4">
//               <label className="block text-gray-600 font-medium mb-2">
//                 Quantity
//               </label>
//               <input
//                 type="number"
//                 name="quantity"
//                 className="w-full px-4 py-2 border rounded-md"
//                 placeholder="Enter Quantity"
//                 value={formData.quantity}
//                 onChange={handleChange}
//                 required
//                 min="1"
//               />
//             </div>

//             {/* Total Sale */}
//             <div className="mb-4">
//               <label className="block text-gray-600 font-medium mb-2">
//                 Total Sale
//               </label>
//               <input
//                 type="number"
//                 name="total_sale"
//                 className="w-full px-4 py-2 border rounded-md"
//                 placeholder="Enter Total Sale"
//                 value={formData.total_sale}
//                 onChange={handleChange}
//                 required
//                 min="0"
//               />
//             </div>

//             <div className="flex justify-between">
//               <button
//                 type="submit"
//                 className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-60"
//                 disabled={submitting}
//               >
//                 {submitting ? "Saving..." : editSale ? "Update Sale" : "Add Sale"}
//               </button>
//               {editSale && (
//                 <button
//                   type="button"
//                   className="px-6 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 focus:outline-none"
//                   onClick={resetForm}
//                 >
//                   Cancel
//                 </button>
//               )}
//             </div>
//           </form>
//         </div>

//         {/* Sales List */}
//         <h3 className="text-xl font-medium text-center text-gray-700 mb-4">
//           Sales List
//         </h3>
//         <div className="overflow-x-auto bg-white shadow-md rounded-lg">
//           <table className="min-w-full table-auto">
//             <thead>
//               <tr className="bg-gray-100">
//                 <th className="px-4 py-2 text-gray-600 text-left">ID</th>
//                 <th className="px-4 py-2 text-gray-600 text-left">Product</th>
//                 <th className="px-4 py-2 text-gray-600 text-left">Warehouse</th>
//                 <th className="px-4 py-2 text-gray-600 text-left">Quantity</th>
//                 <th className="px-4 py-2 text-gray-600 text-left">Total Sale</th>
//                 <th className="px-4 py-2 text-gray-600 text-left">Date</th>
//                 <th className="px-4 py-2 text-gray-600 text-left">Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {loading ? (
//                 <tr>
//                   <td colSpan="7" className="px-4 py-6 text-center">
//                     Loading...
//                   </td>
//                 </tr>
//               ) : sales.length > 0 ? (
//                 sales.map((sale) => (
//                   <tr key={sale.sales_id} className="border-b">
//                     <td className="px-4 py-2">{sale.sales_id}</td>
//                     <td className="px-4 py-2">
//                       {sale.product_name || sale.product_id}
//                     </td>
//                     <td className="px-4 py-2">
//                       {sale.warehouse_name || sale.warehouse_id}
//                     </td>
//                     <td className="px-4 py-2">{sale.quantity}</td>
//                     <td className="px-4 py-2">{sale.total_sale}</td>
//                     <td className="px-4 py-2">
//                       {sale.sales_date
//                         ? new Date(sale.sales_date).toLocaleString()
//                         : "-"}
//                     </td>
//                     <td className="px-4 py-2">
//                       <button
//                         className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600"
//                         onClick={() => handleEdit(sale)}
//                       >
//                         Edit
//                       </button>
//                       <button
//                         className="ml-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
//                         onClick={() => handleDelete(sale.sales_id)}
//                       >
//                         Delete
//                       </button>
//                     </td>
//                   </tr>
//                 ))
//               ) : (
//                 <tr>
//                   <td colSpan="7" className="px-4 py-2 text-center text-gray-600">
//                     No sales data available.
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </Fragment>
//   );
// };

// export default Sales;





import React, { Fragment, useState, useEffect } from "react";

const Sales = () => {
  const [sales, setSales] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    product_id: "",
    warehouse_id: "",
    quantity: "",
    total_sale: "",
  });
  const [editSale, setEditSale] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Fetch sales
  const fetchSales = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:3100/sales");
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || "Failed to fetch sales");
      }

      setSales(Array.isArray(data) ? data : []); // protect against non-array
    } catch (err) {
      console.error("Error fetching sales:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch warehouses
  const fetchWarehouses = async () => {
    try {
      const res = await fetch("http://localhost:3100/warehouses");
      const data = await res.json();
      setWarehouses(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching warehouses:", err);
    }
  };

  // Fetch products
  const fetchProducts = async () => {
    try {
      const res = await fetch("http://localhost:3100/product");
      const data = await res.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  };

  useEffect(() => {
    fetchSales();
    fetchWarehouses();
    fetchProducts();
  }, []);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const resetForm = () => {
    setFormData({ product_id: "", warehouse_id: "", quantity: "", total_sale: "" });
    setEditSale(null);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const method = editSale ? "PUT" : "POST";
      const endpoint = editSale
        ? `http://localhost:3100/sales/${editSale.sales_id}`
        : "http://localhost:3100/sales";

      const response = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload?.error || "Failed to submit sale");
      }

      await fetchSales();
      resetForm();
    } catch (err) {
      console.error("Error submitting sale:", err);
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this sale? Inventory will be restored.")) return;
    try {
      const response = await fetch(`http://localhost:3100/sales/${id}`, {
        method: "DELETE",
      });

      const p = await response.json();

      if (!response.ok) {
        throw new Error(p?.error || "Failed to delete sale");
      }

      fetchSales();
    } catch (err) {
      console.error("Error deleting sale:", err);
      alert(err.message);
    }
  };

  const handleEdit = (sale) => {
    setEditSale(sale);
    setFormData({
      product_id: sale.product_id,
      warehouse_id: sale.warehouse_id,
      quantity: sale.quantity,
      total_sale: sale.total_sale,
    });
  };

  return (
    <Fragment>
      <div className="container mx-auto my-6 px-4">
        <h1 className="text-3xl font-semibold text-center text-gray-800 mb-6">
          Sales Management
        </h1>

        {/* Form */}
        <div className="bg-white shadow-md rounded-lg p-6 mb-6">
          <h3 className="text-2xl font-medium text-center text-gray-700 mb-4">
            {editSale ? "Edit Sale" : "Add Sale"}
          </h3>

          {error ? (
            <div className="mb-4 text-red-600 text-sm">{error}</div>
          ) : null}

          <form onSubmit={handleSubmit}>
            {/* Product Dropdown */}
            <div className="mb-4">
              <label className="block text-gray-600 font-medium mb-2">
                Product
              </label>
              <select
                name="product_id"
                value={formData.product_id}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded-md"
              >
                <option value="">Select Product</option>
                {products.map((p) => (
                  <option key={p.product_id} value={p.product_id}>
                    {p.product_name}
                  </option>
                ))}
              </select>
            </div>

            {/* Warehouse Dropdown */}
            <div className="mb-4">
              <label className="block text-gray-600 font-medium mb-2">
                Warehouse
              </label>
              <select
                name="warehouse_id"
                value={formData.warehouse_id}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded-md"
              >
                <option value="">Select Warehouse</option>
                {warehouses.map((wh) => (
                  <option key={wh.warehouse_id} value={wh.warehouse_id}>
                    {wh.warehouse_name}
                  </option>
                ))}
              </select>
            </div>

            {/* Quantity */}
            <div className="mb-4">
              <label className="block text-gray-600 font-medium mb-2">
                Quantity
              </label>
              <input
                type="number"
                name="quantity"
                className="w-full px-4 py-2 border rounded-md"
                placeholder="Enter Quantity"
                value={formData.quantity}
                onChange={handleChange}
                required
                min="1"
              />
            </div>

            {/* Total Sale */}
            <div className="mb-4">
              <label className="block text-gray-600 font-medium mb-2">
                Total Sale
              </label>
              <input
                type="number"
                name="total_sale"
                className="w-full px-4 py-2 border rounded-md"
                placeholder="Enter Total Sale"
                value={formData.total_sale}
                onChange={handleChange}
                required
                min="0"
              />
            </div>

            <div className="flex justify-between">
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-60"
                disabled={submitting}
              >
                {submitting ? "Saving..." : editSale ? "Update Sale" : "Add Sale"}
              </button>
              {editSale && (
                <button
                  type="button"
                  className="px-6 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 focus:outline-none"
                  onClick={resetForm}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Sales List */}
        <h3 className="text-xl font-medium text-center text-gray-700 mb-4">
          Sales List
        </h3>
        <div className="overflow-x-auto bg-white shadow-md rounded-lg">
          <table className="min-w-full table-auto">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2 text-gray-600 text-left">ID</th>
                <th className="px-4 py-2 text-gray-600 text-left">Product</th>
                <th className="px-4 py-2 text-gray-600 text-left">Warehouse</th>
                <th className="px-4 py-2 text-gray-600 text-left">Quantity</th>
                <th className="px-4 py-2 text-gray-600 text-left">Total Sale</th>
                <th className="px-4 py-2 text-gray-600 text-left">Date</th>
                <th className="px-4 py-2 text-gray-600 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" className="px-4 py-6 text-center">
                    Loading...
                  </td>
                </tr>
              ) : sales.length > 0 ? (
                sales.map((sale) => (
                  <tr key={sale.sales_id} className="border-b">
                    <td className="px-4 py-2">{sale.sales_id}</td>
                    <td className="px-4 py-2">
                      {sale.product_name || sale.product_id}
                    </td>
                    <td className="px-4 py-2">
                      {sale.warehouse_name || sale.warehouse_id}
                    </td>
                    <td className="px-4 py-2">{sale.quantity}</td>
                    <td className="px-4 py-2">{sale.total_sale}</td>
                    <td className="px-4 py-2">
                      {sale.sales_date
                        ? new Date(sale.sales_date).toLocaleString()
                        : "-"}
                    </td>
                    <td className="px-4 py-2">
                      <button
                        className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600"
                        onClick={() => handleEdit(sale)}
                      >
                        Edit
                      </button>
                      <button
                        className="ml-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                        onClick={() => handleDelete(sale.sales_id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="px-4 py-2 text-center text-gray-600">
                    No sales data available.
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

export default Sales;
