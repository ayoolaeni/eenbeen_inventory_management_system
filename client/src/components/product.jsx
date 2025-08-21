// import React, { Fragment, useEffect, useState } from "react";

// const Products = () => {
//   const [products, setProducts] = useState([]);
//   const [formData, setFormData] = useState({
//     product_name: "",
//     description: "",
//     price: "",
//     warehouse_id: "", // assign to a warehouse for inventory workflow
//   });
//   const [warehouses, setWarehouses] = useState([]);
//   const [editProduct, setEditProduct] = useState(null);

//   const API_URL = "http://localhost:3100/product";
//   const WAREHOUSE_URL = "http://localhost:3100/warehouses";

//   // Fetch products
//   const fetchProducts = async () => {
//     try {
//       const response = await fetch(API_URL);
//       const data = await response.json();
//       setProducts(data);
//     } catch (error) {
//       console.error("Error fetching products:", error);
//     }
//   };

//   // Fetch warehouses (so products can be tied to inventory)
//   const fetchWarehouses = async () => {
//     try {
//       const res = await fetch(WAREHOUSE_URL);
//       const data = await res.json();
//       setWarehouses(data);
//     } catch (error) {
//       console.error("Error fetching warehouses:", error);
//     }
//   };

//   useEffect(() => {
//     fetchProducts();
//     fetchWarehouses();
//   }, []);

//   // Handle input changes
//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   // Create or Update Product
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const method = editProduct ? "PUT" : "POST";
//       const url = editProduct
//         ? `${API_URL}/${editProduct.product_id}`
//         : API_URL;

//       await fetch(url, {
//         method: method,
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(formData),
//       });

//       fetchProducts();
//       setFormData({
//         product_name: "",
//         description: "",
//         price: "",
//         warehouse_id: "",
//       });
//       setEditProduct(null);
//     } catch (error) {
//       console.error("Error submitting product:", error);
//     }
//   };

//   // Delete product (and inventory behind the scenes)
//   const handleDelete = async (id) => {
//     try {
//       await fetch(`${API_URL}/${id}`, { method: "DELETE" });
//       fetchProducts();
//     } catch (error) {
//       console.error("Error deleting product:", error);
//     }
//   };

//   // Edit product
//   const handleEdit = (product) => {
//     setEditProduct(product);
//     setFormData({
//       product_name: product.product_name,
//       description: product.description,
//       price: product.price,
//       warehouse_id: product.warehouse_id || "",
//     });
//   };

//   return (
//     <Fragment>
//       <div className="container mx-auto p-6">
//         <h1 className="text-3xl font-bold text-center mb-6">
//           Product Management (Workflow Integrated)
//         </h1>

//         {/* Product Form */}
//         <form className="space-y-6" onSubmit={handleSubmit}>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div>
//               <label className="block text-lg font-semibold mb-2">
//                 Product Name
//               </label>
//               <input
//                 type="text"
//                 name="product_name"
//                 className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 value={formData.product_name}
//                 onChange={handleChange}
//                 placeholder="Enter product name"
//                 required
//               />
//             </div>
//             <div>
//               <label className="block text-lg font-semibold mb-2">
//                 Description
//               </label>
//               <input
//                 type="text"
//                 name="description"
//                 className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 value={formData.description}
//                 onChange={handleChange}
//                 placeholder="Enter description"
//               />
//             </div>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div>
//               <label className="block text-lg font-semibold mb-2">
//                 Price (₦)
//               </label>
//               <input
//                 type="number"
//                 name="price"
//                 className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 value={formData.price}
//                 onChange={handleChange}
//                 placeholder="Enter price"
//                 required
//               />
//             </div>

//             <div>
//               <label className="block text-lg font-semibold mb-2">
//                 Assign Warehouse
//               </label>
//               <select
//                 name="warehouse_id"
//                 className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 value={formData.warehouse_id}
//                 onChange={handleChange}
//                 required
//               >
//                 <option value="">-- Select Warehouse --</option>
//                 {warehouses.map((wh) => (
//                   <option key={wh.warehouse_id} value={wh.warehouse_id}>
//                     {wh.warehouse_name}
//                   </option>
//                 ))}
//               </select>
//             </div>
//           </div>

//           <div className="text-right">
//             <button
//               type="submit"
//               className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none"
//             >
//               {editProduct ? "Update Product" : "Add Product"}
//             </button>
//           </div>
//         </form>

//         {/* Product List Table */}
//         <div className="mt-8 overflow-x-auto">
//           <table className="min-w-full table-auto bg-white shadow-md rounded-lg overflow-hidden">
//             <thead className="bg-gray-100">
//               <tr>
//                 <th className="px-6 py-3 text-left text-lg font-semibold text-gray-700">
//                   ID
//                 </th>
//                 <th className="px-6 py-3 text-left text-lg font-semibold text-gray-700">
//                   Name
//                 </th>
//                 <th className="px-6 py-3 text-left text-lg font-semibold text-gray-700">
//                   Description
//                 </th>
//                 <th className="px-6 py-3 text-left text-lg font-semibold text-gray-700">
//                   Price (₦)
//                 </th>
//                 <th className="px-6 py-3 text-left text-lg font-semibold text-gray-700">
//                   Warehouse
//                 </th>
//                 {/* <th className="px-6 py-3 text-left text-lg font-semibold text-gray-700">
//                   Quantity
//                 </th> */}
//                 <th className="px-6 py-3 text-left text-lg font-semibold text-gray-700">
//                   Actions
//                 </th>
//               </tr>
//             </thead>
//             <tbody>
//               {products.map((product) => (
//                 <tr key={product.product_id} className="border-t">
//                   <td className="px-6 py-4">{product.product_id}</td>
//                   <td className="px-6 py-4">{product.product_name}</td>
//                   <td className="px-6 py-4">{product.description}</td>
//                   <td className="px-6 py-4">{product.price}</td>
//                   <td className="px-6 py-4">{product.warehouse_name}</td>
//                   <td className="px-6 py-4">
//                     {product.quantity ?? 0} {/* from inventory join */}
//                   </td>
//                   <td className="px-6 py-4">
//                     <button
//                       type="button"
//                       className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 mr-2"
//                       onClick={() => handleEdit(product)}
//                     >
//                       Edit
//                     </button>
//                     <button
//                       type="button"
//                       className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
//                       onClick={() => handleDelete(product.product_id)}
//                     >
//                       Delete
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </Fragment>
//   );
// };

// export default Products;






import React, { Fragment, useEffect, useState } from "react";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    product_name: "",
    description: "",
    price: "",
    warehouse_id: "", // assign to a warehouse for inventory workflow
  });
  const [warehouses, setWarehouses] = useState([]);
  const [editProduct, setEditProduct] = useState(null);

  const API_URL = "http://localhost:3100/product";
  const WAREHOUSE_URL = "http://localhost:3100/warehouses";

  // Fetch products
  const fetchProducts = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  // Fetch warehouses (so products can be tied to inventory)
  const fetchWarehouses = async () => {
    try {
      const res = await fetch(WAREHOUSE_URL);
      const data = await res.json();
      setWarehouses(data);
    } catch (error) {
      console.error("Error fetching warehouses:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchWarehouses();
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Create or Update Product
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const method = editProduct ? "PUT" : "POST";
      const url = editProduct
        ? `${API_URL}/${editProduct.product_id}`
        : API_URL;

      await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      fetchProducts();
      setFormData({
        product_name: "",
        description: "",
        price: "",
        warehouse_id: "",
      });
      setEditProduct(null);
    } catch (error) {
      console.error("Error submitting product:", error);
    }
  };

  // Delete product
  const handleDelete = async (id) => {
    try {
      await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      fetchProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  // Edit product
  const handleEdit = (product) => {
    setEditProduct(product);
    setFormData({
      product_name: product.product_name,
      description: product.description,
      price: product.price,
      warehouse_id: product.warehouse_id || "",
    });
  };

  return (
    <Fragment>
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold text-center mb-6">
          Product Management (Workflow Integrated)
        </h1>

        {/* Product Form */}
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-lg font-semibold mb-2">
                Product Name
              </label>
              <input
                type="text"
                name="product_name"
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.product_name}
                onChange={handleChange}
                placeholder="Enter product name"
                required
              />
            </div>
            <div>
              <label className="block text-lg font-semibold mb-2">
                Description
              </label>
              <input
                type="text"
                name="description"
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter description"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-lg font-semibold mb-2">
                Price (₦)
              </label>
              <input
                type="number"
                name="price"
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.price}
                onChange={handleChange}
                placeholder="Enter price"
                required
              />
            </div>

            <div>
              <label className="block text-lg font-semibold mb-2">
                Assign Warehouse
              </label>
              <select
                name="warehouse_id"
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.warehouse_id}
                onChange={handleChange}
                required
              >
                <option value="">-- Select Warehouse --</option>
                {warehouses.map((wh) => (
                  <option key={wh.warehouse_id} value={wh.warehouse_id}>
                    {wh.warehouse_name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="text-right">
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none"
            >
              {editProduct ? "Update Product" : "Add Product"}
            </button>
          </div>
        </form>

        {/* Product List Table */}
        <div className="mt-8 overflow-x-auto">
          <table className="min-w-full table-auto bg-white shadow-md rounded-lg overflow-hidden">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-lg font-semibold text-gray-700">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-lg font-semibold text-gray-700">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-lg font-semibold text-gray-700">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-lg font-semibold text-gray-700">
                  Price (₦)
                </th>
                <th className="px-6 py-3 text-left text-lg font-semibold text-gray-700">
                  Warehouse
                </th>
                <th className="px-6 py-3 text-left text-lg font-semibold text-gray-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.product_id} className="border-t">
                  <td className="px-6 py-4">{product.product_id}</td>
                  <td className="px-6 py-4">{product.product_name}</td>
                  <td className="px-6 py-4">{product.description}</td>
                  <td className="px-6 py-4">{product.price}</td>
                  <td className="px-6 py-4">{product.warehouse_name}</td>
                  <td className="px-6 py-4">
                    <button
                      type="button"
                      className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 mr-2"
                      onClick={() => handleEdit(product)}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                      onClick={() => handleDelete(product.product_id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Fragment>
  );
};

export default Products;
