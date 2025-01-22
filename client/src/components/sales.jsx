import React, { Fragment, useState, useEffect } from 'react';

const Sales = () => {
    const [sales, setSales] = useState([]);
    const [formData, setFormData] = useState({
        product_id: '',
        quantity: '',
        total_sale: ''
    });

    const [editSale, setEditSale] = useState(null);

    // Fetch all sales
    const fetchSales = async () => {
        try {
            const response = await fetch('http://localhost:3000/sales');
            if (!response.ok) throw new Error('Failed to fetch sales');
            const data = await response.json();
            setSales(data);
        } catch (err) {
            console.error('Error fetching sales:', err);
        }
    };

    useEffect(() => {
        fetchSales();
    }, []);

    // Handle input changes
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Create or Update Sale
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const method = editSale ? 'PUT' : 'POST';
            const endpoint = editSale ? `/sales/${editSale.sales_id}` : '/sales';

            const response = await fetch('http://localhost:3000/sales', {
                method: method,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) throw new Error('Failed to submit sale');
            fetchSales();
            setFormData({ product_id: '', quantity: '', total_sale: '' });
            setEditSale(null);
        } catch (err) {
            console.error('Error submitting sale:', err);
        }
    };

    // Delete a Sale
    const handleDelete = async (id) => {
        try {
            const response = await fetch(`http://localhost:3000/sales/${id}`, {
                method: 'DELETE'
            });

            if (!response.ok) throw new Error('Failed to delete sale');
            fetchSales();
        } catch (err) {
            console.error('Error deleting sale:', err);
        }
    };

    // Edit a Sale
    const handleEdit = (sale) => {
        setEditSale(sale);
        setFormData({
            product_id: sale.product_id,
            quantity: sale.quantity,
            total_sale: sale.total_sale
        });
    };

    return (
        <Fragment>
            <div className="container mx-auto my-6 px-4">
                <h1 className="text-3xl font-semibold text-center text-gray-800 mb-6">Sales Management</h1>

                <div className="bg-white shadow-md rounded-lg p-6 mb-6">
                    <h3 className="text-2xl font-medium text-center text-gray-700 mb-4">
                        {editSale ? 'Edit Sale' : 'Add Sale'}
                    </h3>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label htmlFor="product_id" className="block text-gray-600 font-medium mb-2">Product ID</label>
                            <input
                                type="text"
                                id="product_id"
                                name="product_id"
                                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                                placeholder="Enter Product ID"
                                value={formData.product_id}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="quantity" className="block text-gray-600 font-medium mb-2">Quantity</label>
                            <input
                                type="number"
                                id="quantity"
                                name="quantity"
                                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                                placeholder="Enter Quantity"
                                value={formData.quantity}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="total_sale" className="block text-gray-600 font-medium mb-2">Total Sale</label>
                            <input
                                type="number"
                                id="total_sale"
                                name="total_sale"
                                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                                placeholder="Enter Total Sale"
                                value={formData.total_sale}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="flex justify-between">
                            <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400">
                                {editSale ? 'Update Sale' : 'Add Sale'}
                            </button>
                            {editSale && (
                                <button
                                    type="button"
                                    className="px-6 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 focus:outline-none"
                                    onClick={() => {
                                        setEditSale(null);
                                        setFormData({ product_id: '', quantity: '', total_sale: '' });
                                    }}
                                >
                                    Cancel
                                </button>
                            )}
                        </div>
                    </form>
                </div>

                <h3 className="text-xl font-medium text-center text-gray-700 mb-4">Sales List</h3>
                <div className="overflow-x-auto bg-white shadow-md rounded-lg">
                    <table className="min-w-full table-auto">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="px-4 py-2 text-gray-600">ID</th>
                                <th className="px-4 py-2 text-gray-600">Product ID</th>
                                <th className="px-4 py-2 text-gray-600">Quantity</th>
                                <th className="px-4 py-2 text-gray-600">Total Sale</th>
                                <th className="px-4 py-2 text-gray-600">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sales.length > 0 ? (
                                sales.map((sale) => (
                                    <tr key={sale.sales_id} className="border-b">
                                        <td className="px-4 py-2 text-gray-700">{sale.sales_id}</td>
                                        <td className="px-4 py-2 text-gray-700">{sale.product_id}</td>
                                        <td className="px-4 py-2 text-gray-700">{sale.quantity}</td>
                                        <td className="px-4 py-2 text-gray-700">{sale.total_sale}</td>
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
                                    <td colSpan="5" className="px-4 py-2 text-center text-gray-600">
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
