import React, { useEffect, useState } from "react";

const Categories = () => {
    const [categories, setCategories] = useState([]);
    const [formData, setFormData] = useState({
        category_name: "",
        description: "",
    });
    const [editCategory, setEditCategory] = useState(null);

    const API_URL = "http://localhost:3000/category";

    // Fetch all categories
    const fetchCategories = async () => {
        try {
            const response = await fetch(API_URL);
            const data = await response.json();
            setCategories(data);
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    // Handle input changes
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Create or Update Category
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const method = editCategory ? "PUT" : "POST";
            const url = editCategory ? `${API_URL}/${editCategory.category_id}` : API_URL;

            await fetch(url, {
                method: method,
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            fetchCategories();
            setFormData({ category_name: "", description: "" });
            setEditCategory(null);
        } catch (error) {
            console.error("Error submitting category:", error);
        }
    };

    // Delete a category
    const handleDelete = async (id) => {
        try {
            await fetch(`${API_URL}/${id}`, { method: "DELETE" });
            fetchCategories();
        } catch (error) {
            console.error("Error deleting category:", error);
        }
    };

    // Edit a category
    const handleEdit = (category) => {
        setEditCategory(category);
        setFormData({
            category_name: category.category_name,
            description: category.description,
        });
    };

    return (
        <div>
            {/* Category Form */}
            <form onSubmit={handleSubmit} className="p-6 bg-white rounded-lg shadow-md">
                <div className="mb-4">
                    <label htmlFor="category-name" className="block text-gray-700 font-medium mb-2">
                        Category Name
                    </label>
                    <input
                        type="text"
                        id="category-name"
                        name="category_name"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={formData.category_name}
                        onChange={handleChange}
                        placeholder="Enter category name"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="category-description" className="block text-gray-700 font-medium mb-2">
                        Description
                    </label>
                    <textarea
                        id="category-description"
                        name="description"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Enter description"
                        rows="4"
                        required
                    ></textarea>
                </div>
                <button
                    type="submit"
                    className="w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600"
                >
                    {editCategory ? "Update Category" : "Add Category"}
                </button>
            </form>

            {/* Categories Table */}
            <div className="mt-6">
                <table className="w-full table-auto border-collapse">
                    <thead>
                        <tr className="bg-gray-100 text-gray-700">
                            <th className="py-3 px-4 border-b">Category Name</th>
                            <th className="py-3 px-4 border-b">Description</th>
                            <th className="py-3 px-4 border-b">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {categories.map((category) => (
                            <tr key={category.category_id} className="hover:bg-gray-50">
                                <td className="py-3 px-4 border-b">{category.category_name}</td>
                                <td className="py-3 px-4 border-b">{category.description}</td>
                                <td className="py-3 px-4 border-b">
                                    <button
                                        type="button"
                                        className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 mr-2"
                                        onClick={() => handleEdit(category)}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        type="button"
                                        className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                                        onClick={() => handleDelete(category.category_id)}
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
    );
};

export default Categories;
