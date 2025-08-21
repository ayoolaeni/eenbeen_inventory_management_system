
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
    warehouses: 0,
  });

  const [salesDataByMonth, setSalesDataByMonth] = useState([]);
  const [inventoryLabels, setInventoryLabels] = useState([]);
  const [inventoryData, setInventoryData] = useState([]);
  const [lowStock, setLowStock] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch all API data in parallel
        const [
          customerRes,
          salesRes,
          purchaseRes,
          productRes,
          warehouseRes,
          inventoryRes,
        ] = await Promise.all([
          fetch('http://localhost:3100/customer'),
          fetch('http://localhost:3100/sales'),
          fetch('http://localhost:3100/purchases'),
          fetch('http://localhost:3100/product'),
          fetch('http://localhost:3100/warehouses'),
          fetch('http://localhost:3100/inventory'),
        ]);

        const [
          customers,
          sales,
          purchases,
          products,
          warehouses,
          inventories,
        ] = await Promise.all([
          customerRes.json(),
          salesRes.json(),
          purchaseRes.json(),
          productRes.json(),
          warehouseRes.json(),
          inventoryRes.json(),
        ]);

        // ✅ Top-level stats
        setStats({
          customers: customers.length,
          sales: sales.length,
          purchases: purchases.length,
          products: products.length,
          warehouses: warehouses.length,
        });

        // ✅ Monthly sales trends
        const monthlySales = Array(12).fill(0);
        sales.forEach(s => {
          const date = new Date(s.created_at || s.date || Date.now());
          const month = date.getMonth();
          monthlySales[month] += parseFloat(s.total_sale || 0);
        });
        setSalesDataByMonth(monthlySales);

        // ✅ Inventory distribution by warehouse
        const warehouseMap = {};
        inventories.forEach(item => {
          warehouseMap[item.warehouse_name] =
            (warehouseMap[item.warehouse_name] || 0) + item.quantity;
        });
        setInventoryLabels(Object.keys(warehouseMap));
        setInventoryData(Object.values(warehouseMap));

        // ✅ Low stock alerts
        const threshold = 5;
        const lowStockItems = products.filter(p => p.quantity < threshold);
        setLowStock(lowStockItems);

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
        <h1 className="text-4xl font-bold text-blue-700 mb-2">
          EENBEEN Inventory Dashboard
        </h1>
        <p className="text-gray-600 text-sm">
          Track warehouses, stock flow, sales, and purchases in real time
        </p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        {[
          { title: 'Customers', value: stats.customers, link: '/customer-management' },
          { title: 'Products', value: stats.products, link: '/products' },
          { title: 'Warehouses', value: stats.warehouses, link: '/warehouse-management' },
          { title: 'Purchases (Stock In)', value: stats.purchases, link: '/purchase-management' },
          { title: 'Sales (Stock Out)', value: stats.sales, link: '/sales-management' },
        ].map((card, index) => (
          <div
            key={index}
            className="bg-white shadow-xl rounded-xl p-6 hover:shadow-2xl transition"
          >
            <h5 className="text-lg font-medium text-gray-700 mb-2">
              {card.title}
            </h5>
            <p className="text-4xl font-bold text-blue-600 mb-4">
              {card.value}
            </p>
            <Link
              to={card.link}
              className="inline-block bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 text-sm"
            >
              Manage {card.title}
            </Link>
          </div>
        ))}
      </div>

      {/* Reports & Analytics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
        {/* Sales Trends */}
        <div className="bg-white shadow-lg rounded-xl p-6">
          <h5 className="text-xl font-semibold text-gray-700 mb-4">
            📈 Monthly Sales Trends
          </h5>
          <Bar
            data={{
              labels: [
                'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
              ],
              datasets: [
                {
                  label: 'Sales (₦)',
                  data: salesDataByMonth,
                  backgroundColor: 'rgba(54, 162, 235, 0.7)',
                  borderRadius: 5,
                },
              ],
            }}
            options={{ responsive: true, plugins: { legend: { display: false } } }}
          />
        </div>

        {/* Inventory Distribution by Warehouse */}
        <div className="bg-white shadow-lg rounded-xl p-6">
          <h5 className="text-xl font-semibold text-gray-700 mb-4">
            🏭 Inventory Distribution by Warehouse
          </h5>
          <Pie
            data={{
              labels: inventoryLabels,
              datasets: [
                {
                  data: inventoryData,
                  backgroundColor: [
                    '#FF6384', '#36A2EB', '#FFCE56',
                    '#4BC0C0', '#9966FF', '#FF9F40', '#00C49F'
                  ],
                },
              ],
            }}
            options={{ responsive: true, plugins: { legend: { position: 'bottom' } } }}
          />
        </div>
      </div>

      {/* Low Stock Alerts */}
      {lowStock.length > 0 && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-xl shadow">
          <h5 className="text-xl font-semibold mb-3">⚠️ Low Stock Alerts</h5>
          <ul className="list-disc list-inside">
            {lowStock.map((item, idx) => (
              <li key={idx}>
                {item.product_name} — only {item.quantity} left
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Dashboard;




