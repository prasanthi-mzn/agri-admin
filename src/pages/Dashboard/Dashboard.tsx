import { useEffect, useMemo, useState } from 'react';
import {
  ArrowDownRight,
  ArrowUpRight,
  Package,
  ShoppingBag,
  TrendingUp,
  UserRound,
  Users,
} from 'lucide-react';
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
} from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';
import { Link } from 'react-router-dom';
import dashboardService from '../../services/dashboardService';
import orderService from '../../services/orderService';
import productService from '../../services/productService';
import type { DashboardResponse } from '../../services/dashboardService';
import type { ApiOrder } from '../../services/orderService';
import type { Product } from '../../services/productService';

ChartJS.register(
  BarElement,
  CategoryScale,
  Filler,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip
);

const formatCount = (value?: number) => {
  if (typeof value !== 'number') return '-';
  return new Intl.NumberFormat('en-IN').format(value);
};

const formatAmount = (value?: string) => {
  if (value === undefined || value === null || value === '') return '-';
  if (value.length > 15) return value;

  const amount = Number(value);
  if (!Number.isFinite(amount)) return value;

  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
  }).format(amount);
};

const formatDate = (value?: string) => {
  if (!value) return '-';
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? value
    : new Intl.DateTimeFormat('en-IN', { dateStyle: 'medium' }).format(date);
};

const formatStatus = (status?: string) => {
  return (status || 'pending').replace(/_/g, ' ');
};

const salesLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'];
const salesValues = [120000, 148000, 132000, 176000, 204000, 238000, 221000];

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState<DashboardResponse | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<ApiOrder[]>([]);
  const [loadingDashboard, setLoadingDashboard] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [dashboardError, setDashboardError] = useState('');
  const [productsError, setProductsError] = useState('');
  const [ordersError, setOrdersError] = useState('');

  useEffect(() => {
    dashboardService
      .fetchDashboard()
      .then((data) => setDashboardData(data))
      .catch((err) => setDashboardError(err instanceof Error ? err.message : 'Failed to load dashboard data'))
      .finally(() => setLoadingDashboard(false));
  }, []);

  useEffect(() => {
    productService
      .fetchProducts()
      .then((response) => setProducts(response.data || []))
      .catch((err) => setProductsError(err instanceof Error ? err.message : 'Failed to load products'))
      .finally(() => setLoadingProducts(false));
  }, []);

  useEffect(() => {
    orderService
      .fetchOrders()
      .then((items) => setOrders(items))
      .catch((err) => setOrdersError(err instanceof Error ? err.message : 'Failed to load orders'))
      .finally(() => setLoadingOrders(false));
  }, []);

  const salesChartData = useMemo(() => ({
    labels: salesLabels,
    datasets: [
      {
        label: 'Sales',
        data: salesValues,
        borderColor: '#16a34a',
        backgroundColor: 'rgba(22, 163, 74, 0.14)',
        fill: true,
        pointBackgroundColor: '#ffffff',
        pointBorderColor: '#16a34a',
        pointBorderWidth: 3,
        pointRadius: 4,
        tension: 0.35,
      },
    ],
  }), []);

  const productChartProducts = useMemo(() => {
    return products
      .filter((product) => Number.isFinite(Number(product.quantity)))
      .sort((a, b) => Number(b.quantity) - Number(a.quantity))
      .slice(0, 8);
  }, [products]);

  const productChartData = useMemo(() => ({
    labels: productChartProducts.map((product) => product.name || `Product #${product.id}`),
    datasets: [
      {
        label: 'Quantity',
        data: productChartProducts.map((product) => Number(product.quantity)),
        backgroundColor: ['#bbf7d0', '#bfdbfe', '#fde68a', '#ddd6fe', '#fecaca', '#bae6fd', '#fed7aa', '#cbd5e1'],
        borderColor: ['#86efac', '#93c5fd', '#fcd34d', '#c4b5fd', '#fca5a5', '#7dd3fc', '#fdba74', '#94a3b8'],
        borderWidth: 1,
        borderRadius: 6,
        maxBarThickness: 44,
      },
    ],
  }), [productChartProducts]);

  const chartOptions = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (context: { parsed: { y?: number }; dataset: { label?: string } }) => {
            const value = context.parsed.y ?? 0;
            return `${context.dataset.label}: ${new Intl.NumberFormat('en-IN').format(value)}`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#6b7280',
          font: {
            weight: 600,
          },
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: '#eef2f7',
        },
        ticks: {
          color: '#6b7280',
          callback: (value: string | number) => new Intl.NumberFormat('en-IN', { notation: 'compact' }).format(Number(value)),
        },
      },
    },
  }), []);

  const monthlyOrderCount = useMemo(() => {
    const now = new Date();
    return orders.filter((order) => {
      if (!order.created_at) return false;
      const createdAt = new Date(order.created_at);
      return (
        !Number.isNaN(createdAt.getTime()) &&
        createdAt.getMonth() === now.getMonth() &&
        createdAt.getFullYear() === now.getFullYear()
      );
    }).length;
  }, [orders]);

  const stats = [
    { name: 'Total Vendors', value: loadingDashboard ? 'Loading...' : formatCount(dashboardData?.total_vendors), icon: <Users className="text-blue-600" />, change: '', positive: true },
    { name: 'Total Customers', value: loadingDashboard ? 'Loading...' : formatCount(dashboardData?.total_customers), icon: <UserRound className="text-teal-600" />, change: '', positive: true },
    { name: 'Active Inventory', value: loadingProducts ? 'Loading...' : formatCount(products.length), icon: <Package className="text-green-600" />, change: '', positive: true },
    { name: 'Monthly Orders', value: loadingOrders ? 'Loading...' : formatCount(monthlyOrderCount), icon: <ShoppingBag className="text-orange-600" />, change: '', positive: true },
    { name: 'Revenue', value: 'Rs 4.2 Cr', icon: <TrendingUp className="text-purple-600" />, change: '+18%', positive: true },
  ];

  const recentOrders = useMemo(() => {
    return [...orders]
      .sort((a, b) => new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime())
      .slice(0, 4);
  }, [orders]);

  return (
    <div className="space-y-6 text-left">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-500">Welcome back, Admin. Here is what's happening today.</p>
        {dashboardError && <div className="mt-2 text-sm text-red-600">{dashboardError}</div>}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4 lg:gap-6">
        {stats.map((item) => (
          <div key={item.name} className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-gray-100 min-w-0">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gray-50 rounded-xl">{item.icon}</div>
              {item.change && (
                <span className={`flex items-center text-sm font-medium ${item.positive ? 'text-green-600' : 'text-red-600'}`}>
                  {item.change}
                  {item.positive ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                </span>
              )}
            </div>
            <h3 className="text-gray-500 text-sm font-medium">{item.name}</h3>
            <p className="text-xl sm:text-2xl font-bold text-gray-900 mt-1">{item.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
        <div className="lg:col-span-2 bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-gray-100 min-w-0">
          <div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h3 className="text-lg font-bold text-gray-900">Sales Performance</h3>
              <p className="text-sm text-gray-500">Monthly sales trend using dummy data.</p>
            </div>
            <span className="text-sm font-semibold text-green-600">+18% vs last period</span>
          </div>
          <div className="h-72">
            <Line data={salesChartData} options={chartOptions} />
          </div>
        </div>

        <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-gray-100 min-w-0">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Orders</h3>
          {ordersError && <div className="mb-3 text-sm text-red-600">{ordersError}</div>}
          <div className="space-y-4">
            {loadingOrders ? (
              <div className="flex min-h-48 items-center justify-center text-sm text-gray-500">Loading orders...</div>
            ) : recentOrders.length > 0 ? recentOrders.map((order) => {
              const status = formatStatus(order.status);
              const isPending = status.toLowerCase().includes('pending');
              return (
              <div key={order.id} className="flex items-center justify-between gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer">
                <div className="min-w-0">
                  <p className="text-sm font-bold text-gray-900">Order #{order.id}</p>
                  <p className="text-xs text-gray-500">{formatDate(order.created_at)}</p>
                </div>
                <div className="text-right">
                  <p className="max-w-32 truncate text-sm font-bold text-gray-900" title={formatAmount(order.total_amount)}>
                    {formatAmount(order.total_amount)}
                  </p>
                  <p className={`text-[10px] font-bold uppercase tracking-wider ${
                    isPending ? 'text-orange-500' : 'text-green-600'
                  }`}
                  >
                    {status}
                  </p>
                </div>
              </div>
              );
            }) : (
              <div className="flex min-h-48 items-center justify-center text-sm text-gray-500">No recent orders found.</div>
            )}
          </div>
          <Link to="/orders" className="block w-full mt-6 py-2 text-center text-sm font-semibold text-green-600 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
            View All Orders
          </Link>
        </div>
      </div>

      <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-gray-100 min-w-0">
        <div className="mb-4">
          <h3 className="text-lg font-bold text-gray-900">Products in Inventory</h3>
          <p className="text-sm text-gray-500">Current stock quantities from inventory products.</p>
          {productsError && <div className="mt-2 text-sm text-red-600">{productsError}</div>}
        </div>
        <div className="h-80">
          {loadingProducts ? (
            <div className="flex h-full items-center justify-center text-sm text-gray-500">Loading products...</div>
          ) : productChartProducts.length > 0 ? (
            <Bar data={productChartData} options={chartOptions} />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-gray-500">No product quantities available.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
