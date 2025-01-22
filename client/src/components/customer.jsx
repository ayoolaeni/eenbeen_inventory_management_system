import React, { useState, useEffect } from 'react';

const Customer = () => {
    const [customers, setCustomers] = useState([]);
    const [customer_name, setCustomerName] = useState("");
    const [contact_info, setContactInfo] = useState("");
    const [address, setAddress] = useState("");
    const [editCustomer, setEditCustomer] = useState(null);

    // Fetch all customers
    const fetchCustomers = async () => {
        try {
            const response = await fetch('http://localhost:3000/customer', {
                method: "GET"
            });

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
    const handleChangeName = (e) => {
        setCustomerName(e.target.value)
    };

    const handleChangeContact = (e) => setContactInfo(e.target.value)

    const handleChangeAddress = (e) => setAddress(e.target.value)

    // Add or Update Customer
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const body = { customer_name, contact_info, address }
            const response = await fetch('http://localhost:3000/customer', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body)
            });
            if (response.ok) {
                setCustomerName("")
                setAddress("")
                setContactInfo("")
                await fetchCustomers()
            }

        } catch (err) {
            console.error('Error submitting customer:', err);
        }
    };

    // Delete a Customer
    const handleDelete = async (id) => {
        try {
            const response = await fetch(`http://localhost:3000/customer/${id}`, {
                method: 'DELETE'
            });

            if (!response.ok) throw new Error('Failed to delete customer');
            fetchCustomers();
        } catch (err) {
            console.error('Error deleting customer:', err);
        }
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
                        <label htmlFor="customer_name" className="block text-sm font-medium text-gray-700">Customer Name</label>
                        <input
                            type="text"
                            id="customer_name"
                            className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter Customer Name"
                            value={customer_name}
                            onChange={handleChangeName}
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="contact_info" className="block text-sm font-medium text-gray-700">Contact Info</label>
                        <input
                            type="text"
                            id="contact_info"
                            className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter Contact Info"
                            value={contact_info}
                            onChange={handleChangeContact}
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
                        <input
                            type="text"
                            id="address"
                            className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter Address"
                            value={address}
                            onChange={handleChangeAddress}
                            required
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
