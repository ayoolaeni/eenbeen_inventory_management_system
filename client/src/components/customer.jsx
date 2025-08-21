import React, { useState, useEffect } from 'react';

const Customer = () => {
    const [customers, setCustomers] = useState([]);
    const [formData, setFormData] = useState({
        customer_name: "",
        contact_info: "",
        address: ""
    });
    const [editCustomer, setEditCustomer] = useState(null);

    // Fetch all customers
    const fetchCustomers = async () => {
        try {
            const response = await fetch('http://localhost:3100/customer');
            const data = await response.json();
            setCustomers(data);
        } catch (err) {
            console.error('Error fetching customers:', err);
        }
    };

    useEffect(() => {
        fetchCustomers();
    }, []);

    // Handle input changes
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    // Add or Update Customer
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            let response;
            if (editCustomer) {
                // Update existing customer
                response = await fetch(`http://localhost:3100/customer/${editCustomer.customer_id}`, {
                    method: "PUT",
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData)
                });
            } else {
                // Add new customer
                response = await fetch('http://localhost:3100/customer', {
                    method: "POST",
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData)
                });
            }

            if (response.ok) {
                setFormData({ customer_name: "", contact_info: "", address: "" });
                setEditCustomer(null);
                fetchCustomers();
            }
        } catch (err) {
            console.error('Error submitting customer:', err);
        }
    };

    // Delete a Customer
    const handleDelete = async (id) => {
        try {
            const response = await fetch(`http://localhost:3100/customer/${id}`, {
                method: 'DELETE'
            });

            if (!response.ok) throw new Error('Failed to delete customer');
            fetchCustomers();
        } catch (err) {
            console.error('Error deleting customer:', err);
        }
    };

    // Edit a Customer
    const handleEdit = (customer) => {
        setEditCustomer(customer);
        setFormData({
            customer_name: customer.customer_name,
            contact_info: customer.contact_info,
            address: customer.address
        });
    };

    return (
        <div className="container mx-auto my-4 p-4">
            <h1 className="text-3xl font-semibold text-center mb-4">Customer Management</h1>

            {/* Form for Add/Edit Customer */}
            <div className="card p-6 mb-6 border border-gray-300 rounded-lg shadow-lg">
                <h3 className="text-2xl text-center font-semibold mb-4">
                    {editCustomer ? 'Edit Customer' : 'Add Customer'}
                </h3>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block">Customer Name</label>
                        <input
                            type="text"
                            name="customer_name"
                            value={formData.customer_name}
                            onChange={handleChange}
                            required
                            className="border p-2 w-full"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block">Contact Info</label>
                        <input
                            type="text"
                            name="contact_info"
                            value={formData.contact_info}
                            onChange={handleChange}
                            required
                            className="border p-2 w-full"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block">Address</label>
                        <input
                            type="text"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            required
                            className="border p-2 w-full"
                        />
                    </div>
                    <div className="flex justify-between">
                        <button type="submit" className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600">
                            {editCustomer ? 'Update Customer' : 'Add Customer'}
                        </button>
                        {editCustomer && (
                            <button
                                type="button"
                                className="bg-gray-400 text-white px-6 py-2 rounded-md hover:bg-gray-500"
                                onClick={() => {
                                    setEditCustomer(null);
                                    setFormData({ customer_name: "", contact_info: "", address: "" });
                                }}
                            >
                                Cancel
                            </button>
                        )}
                    </div>
                </form>
            </div>

            {/* Customer List */}
            <h3 className="text-2xl text-center mb-4">Customer List</h3>
            <div className="overflow-x-auto">
                <table className="table-auto w-full border-collapse">
                    <thead>
                        <tr className="border-b">
                            <th className="p-3 text-left">ID</th>
                            <th className="p-3 text-left">Name</th>
                            <th className="p-3 text-left">Contact Info</th>
                            <th className="p-3 text-left">Address</th>
                            <th className="p-3 text-left">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {customers.length > 0 ? (
                            customers.map((customer) => (
                                <tr key={customer.customer_id} className="border-b">
                                    <td className="p-3">{customer.customer_id}</td>
                                    <td className="p-3">{customer.customer_name}</td>
                                    <td className="p-3">{customer.contact_info}</td>
                                    <td className="p-3">{customer.address}</td>
                                    <td className="p-3">
                                        <button
                                            className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600 mr-2"
                                            onClick={() => handleEdit(customer)}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                                            onClick={() => handleDelete(customer.customer_id)}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="text-center p-3">No customer data available.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Customer;
