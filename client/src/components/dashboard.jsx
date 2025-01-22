import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

const Dashboard = () => {
  const [stats, setStats] = useState({
    customers: 0,
    sales: 0,
    purchases: 0,
    products: 0,
    categories: 0,
    warehouses: 0,
  });

  const [salesData, setSalesData] = useState([]);
  const [categoryDistribution, setCategoryDistribution] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const customerRes = await fetch('http://localhost:3000/customer');
        const salesRes = await fetch('http://localhost:3000/sales');
        const purchaseRes = await fetch('http://localhost:3000/purchases');
        const productRes = await fetch('http://localhost:3000/product');
        const categoryRes = await fetch('http://localhost:3000/category');
        const warehouseRes = await fetch('http://localhost:3000/warehouses');

        const customers = await customerRes.json();
        const sales = await salesRes.json();
        const purchases = await purchaseRes.json();
        const products = await productRes.json();
        const categories = await categoryRes.json();
        const warehouses = await warehouseRes.json();

        setStats({
          customers: customers.length,
          sales: sales.length,
          purchases: purchases.length,
          products: products.length,
          categories: categories.length,
          warehouses: warehouses.length,
        });

        setSalesData(sales.map((s) => s.amount || 0)); // Assuming sales have an `amount` field
        setCategoryDistribution(categories.map((c) => c.productCount || 0)); // Assuming categories have `productCount`
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-center text-3xl font-bold my-8">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {[
          { title: 'Customers', value: stats.customers, link: '/customer-management' },
          { title: 'Sales', value: stats.sales, link: '/sales-management' },
          { title: 'Purchases', value: stats.purchases, link: '/purchase-management' },
          { title: 'Products', value: stats.products, link: '/products' },
          { title: 'Categories', value: stats.categories, link: '/category-management' },
          { title: 'Warehouses', value: stats.warehouses, link: '/warehouse-management' },
        ].map((card, index) => (
          <div key={index} className="bg-white shadow-lg rounded-lg p-6 text-center">
            <h5 className="text-xl font-semibold mb-2">{card.title}</h5>
            <p className="text-3xl font-bold mb-4">{card.value}</p>
            <Link to={card.link} className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600">
              Manage {card.title}
            </Link>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h5 className="text-xl font-semibold mb-4">Sales Trends</h5>
          <Bar
            data={{
              labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'], // Example labels
              datasets: [
                {
                  label: 'Sales',
                  data: salesData,
                  backgroundColor: 'rgba(54, 162, 235, 0.6)',
                },
              ],
            }}
            options={{ responsive: true }}
          />
        </div>

        <div className="bg-white shadow-lg rounded-lg p-6">
          <h5 className="text-xl font-semibold mb-4">Category Distribution</h5>
          <Pie
            data={{
              labels: ['Category 1', 'Category 2', 'Category 3'], // Example labels
              datasets: [
                {
                  data: categoryDistribution,
                  backgroundColor: ['#ff6384', '#36a2eb', '#ffce56'],
                },
              ],
            }}
            options={{ responsive: true }}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
