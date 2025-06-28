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

  const [salesDataByMonth, setSalesDataByMonth] = useState([]);
  const [categoryDistribution, setCategoryDistribution] = useState([]);
  const [categoryLabels, setCategoryLabels] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [customerRes, salesRes, purchaseRes, productRes, categoryRes, warehouseRes] = await Promise.all([
          fetch('http://localhost:3100/customer'),
          fetch('http://localhost:3100/sales'),
          fetch('http://localhost:3100/purchases'),
          fetch('http://localhost:3100/product'),
          fetch('http://localhost:3100/category'),
          fetch('http://localhost:3100/warehouses')
        ]);

        const [customers, sales, purchases, products, categories, warehouses] = await Promise.all([
          customerRes.json(),
          salesRes.json(),
          purchaseRes.json(),
          productRes.json(),
          categoryRes.json(),
          warehouseRes.json()
        ]);

        // Set total counts
        setStats({
          customers: customers.length,
          sales: sales.length,
          purchases: purchases.length,
          products: products.length,
          categories: categories.length,
          warehouses: warehouses.length,
        });

        // Prepare sales data per month
        const monthlySales = Array(12).fill(0);
        sales.forEach((s) => {
          const date = new Date(s.created_at || s.date || Date.now());
          const month = date.getMonth();
          monthlySales[month] += parseFloat(s.total_sale || 0);
        });
        setSalesDataByMonth(monthlySales);

        // Prepare category distribution
        const categoryCountMap = {};
        products.forEach((product) => {
          const catId = product.category_id;
          categoryCountMap[catId] = (categoryCountMap[catId] || 0) + 1;
        });

        const labels = [];
        const counts = [];
        categories.forEach((cat) => {
          labels.push(cat.category_name);
          counts.push(categoryCountMap[cat.category_id] || 0);
        });

        setCategoryLabels(labels);
        setCategoryDistribution(counts);
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="container mx-auto px-4">
      {/* Company Branding Header */}
      <div className="text-center my-8">
        <h1 className="text-4xl font-bold text-blue-700 mb-2">EENBEEN Dashboard</h1>
        <p className="text-gray-600 text-sm">Overview of your inventory and sales operations</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        {[
          { title: 'Customers', value: stats.customers, link: '/customer-management' },
          { title: 'Sales', value: stats.sales, link: '/sales-management' },
          { title: 'Purchases', value: stats.purchases, link: '/purchase-management' },
          { title: 'Products', value: stats.products, link: '/products' },
          { title: 'Categories', value: stats.categories, link: '/category-management' },
          { title: 'Warehouses', value: stats.warehouses, link: '/warehouse-management' },
        ].map((card, index) => (
          <div key={index} className="bg-white shadow-xl rounded-xl p-6 hover:shadow-2xl transition">
            <h5 className="text-lg font-medium text-gray-700 mb-2">{card.title}</h5>
            <p className="text-4xl font-bold text-blue-600 mb-4">{card.value}</p>
            <Link to={card.link} className="inline-block bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 text-sm">
              Manage {card.title}
            </Link>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white shadow-lg rounded-xl p-6">
          <h5 className="text-xl font-semibold text-gray-700 mb-4">Monthly Sales Trends</h5>
          <Bar
            data={{
              labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
              datasets: [
                {
                  label: 'Sales (₦)',
                  data: salesDataByMonth,
                  backgroundColor: 'rgba(54, 162, 235, 0.7)',
                  borderRadius: 5,
                },
              ],
            }}
            options={{
              responsive: true,
              plugins: {
                legend: { display: false }
              }
            }}
          />
        </div>

        <div className="bg-white shadow-lg rounded-xl p-6">
          <h5 className="text-xl font-semibold text-gray-700 mb-4">Product Distribution by Category</h5>
          <Pie
            data={{
              labels: categoryLabels,
              datasets: [
                {
                  data: categoryDistribution,
                  backgroundColor: [
                    '#FF6384', '#36A2EB', '#FFCE56',
                    '#4BC0C0', '#9966FF', '#FF9F40', '#00C49F'
                  ],
                },
              ],
            }}
            options={{
              responsive: true,
              plugins: {
                legend: { position: 'bottom' }
              }
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
