import { useEffect, useMemo, useState } from 'react';
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
import productService from '../../services/productService';
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

const salesLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'];
const salesValues = [120000, 148000, 132000, 176000, 204000, 238000, 221000];

const Reports = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [productsError, setProductsError] = useState('');

  useEffect(() => {
    productService
      .fetchProducts()
      .then((response) => setProducts(response.data || []))
      .catch((err) => setProductsError(err instanceof Error ? err.message : 'Failed to load products'))
      .finally(() => setLoadingProducts(false));
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

  return (
    <div className="space-y-6 text-left">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Reports</h1>
        <p className="text-gray-500">Sales performance and current product stock overview.</p>
      </div>

      <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-gray-100 min-w-0">
        <div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h3 className="text-lg font-bold text-gray-900">Sales Report</h3>
            <p className="text-sm text-gray-500">Monthly sales trend using dummy data.</p>
          </div>
          <span className="text-sm font-semibold text-green-600">+18% vs last period</span>
        </div>
        <div className="h-72">
          <Line data={salesChartData} options={chartOptions} />
        </div>
      </div>

      <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-gray-100 min-w-0">
        <div className="mb-4">
          <h3 className="text-lg font-bold text-gray-900">Product Stock</h3>
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

export default Reports;
