import React, { Fragment, useEffect, useState } from "react";

const Products = () => {
    const [products, setProducts] = useState([]);
    const [formData, setFormData] = useState({
        product_name: '',
        description: '',
        price: ''
    });
    const [editProduct, setEditProduct] = useState(null);

    const API_URL = 'http://localhost:3000/product';

    // Fetch all products
    const fetchProducts = async () => {
        try {
            const response = await fetch(API_URL);
            const data = await response.json();
            setProducts(data);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    // Handle input changes
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Create or Update Product
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const method = editProduct ? 'PUT' : 'POST';
            const url = editProduct ? `${API_URL}/${editProduct.product_id}` : API_URL;

            await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            fetchProducts();
            setFormData({ product_name: '', description: '', price: '' });
            setEditProduct(null);
        } catch (error) {
            console.error('Error submitting product:', error);
        }
    };

    // Delete a product
    const handleDelete = async (id) => {
        try {
            await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
            fetchProducts();
        } catch (error) {
            console.error('Error deleting product:', error);
        }
    };

    // Edit a product
    const handleEdit = (product) => {
        setEditProduct(product);
        setFormData({
            product_name: product.product_name,
            description: product.description,
            price: product.price,
        });
    };

    return (
        <Fragment>
            <div className="container mx-auto p-6">
                <h1 className="text-3xl font-bold text-center mb-6">Product Management</h1>

                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-lg font-semibold mb-2">Product Name</label>
                            <input
                                type="text"
                                name="product_name"
                                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={formData.product_name}
                                onChange={handleChange}
                                placeholder="Enter product name"
                            />
                        </div>
                        <div>
                            <label className="block text-lg font-semibold mb-2">Description</label>
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
                    <div>
                        <label className="block text-lg font-semibold mb-2">Price</label>
                        <input
                            type="number"
                            name="price"
                            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={formData.price}
                            onChange={handleChange}
                            placeholder="Enter price"
                        />
                    </div>
                    <div className="text-right">
                        <button
                            type="submit"
                            className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none"
                        >
                            {editProduct ? 'Update Product' : 'Add Product'}
                        </button>
                    </div>
                </form>

                {/* Product List Table */}
                <div className="mt-8 overflow-x-auto">
                    <table className="min-w-full table-auto bg-white shadow-md rounded-lg overflow-hidden">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="px-6 py-3 text-left text-lg font-semibold text-gray-700">Product Name</th>
                                <th className="px-6 py-3 text-left text-lg font-semibold text-gray-700">Description</th>
                                <th className="px-6 py-3 text-left text-lg font-semibold text-gray-700">Price ($)</th>
                                <th className="px-6 py-3 text-left text-lg font-semibold text-gray-700">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((product) => (
                                <tr key={product.product_id} className="border-t">
                                    <td className="px-6 py-4 text-gray-700">{product.product_name}</td>
                                    <td className="px-6 py-4 text-gray-700">{product.description}</td>
                                    <td className="px-6 py-4 text-gray-700">{product.price}</td>
                                    <td className="px-6 py-4">
                                        <button
                                            type="button"
                                            className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 focus:outline-none mr-2"
                                            onClick={() => handleEdit(product)}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            type="button"
                                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none"
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
