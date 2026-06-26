import { useEffect, useState } from 'react';
import { 
  Users, 
  UserRound,
  Package, 
  ShoppingBag, 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownRight 
} from 'lucide-react';
import dashboardService from '../../services/dashboardService';
import type { DashboardResponse } from '../../services/dashboardService';

const formatCount = (value?: number) => {
  if (typeof value !== 'number') return '-';
  return new Intl.NumberFormat('en-IN').format(value);
};

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState<DashboardResponse | null>(null);
  const [loadingDashboard, setLoadingDashboard] = useState(true);
  const [dashboardError, setDashboardError] = useState('');

  useEffect(() => {
    dashboardService
      .fetchDashboard()
      .then((data) => setDashboardData(data))
      .catch((err) => setDashboardError(err instanceof Error ? err.message : 'Failed to load dashboard data'))
      .finally(() => setLoadingDashboard(false));
  }, []);

  const stats = [
    { name: 'Total Vendors', value: loadingDashboard ? 'Loading...' : formatCount(dashboardData?.total_vendors), icon: <Users className="text-blue-600" />, change: '', positive: true },
    { name: 'Total Customers', value: loadingDashboard ? 'Loading...' : formatCount(dashboardData?.total_customers), icon: <UserRound className="text-teal-600" />, change: '', positive: true },
    { name: 'Active Inventory', value: '43,520', icon: <Package className="text-green-600" />, change: '+3.4%', positive: true },
    { name: 'Monthly Orders', value: '856', icon: <ShoppingBag className="text-orange-600" />, change: '-2.1%', positive: false },
    { name: 'Revenue', value: '₹4.2M', icon: <TrendingUp className="text-purple-600" />, change: '+18%', positive: true },
  ];

  const recentOrders = [
    { id: '#ORD-7721', dealer: 'Green Valley Seeds', status: 'Delivered', amount: '₹12,400' },
    { id: '#ORD-7722', dealer: 'Kerala Agri-Co', status: 'Pending', amount: '₹8,900' },
    { id: '#ORD-7723', dealer: 'Nilgiri Farms', status: 'In Transit', amount: '₹45,200' },
    { id: '#ORD-7724', dealer: 'Coastal Fertilisers', status: 'Delivered', amount: '₹3,150' },
  ];

  return (
    <div className="space-y-6 text-left">
      {/* Header Section */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-500">Welcome back, Admin. Here is what's happening today.</p>
        {dashboardError && <div className="mt-2 text-sm text-red-600">{dashboardError}</div>}
      </div>

      {/* Stats Grid */}
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
        {/* Sales Chart Placeholder */}
        <div className="lg:col-span-2 bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-gray-100 min-w-0">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Sales Performance</h3>
          <div className="h-52 sm:h-64 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 flex items-center justify-center p-4 text-center">
            <p className="text-gray-400 font-medium">Chart visualization would render here</p>
          </div>
        </div>

        {/* Recent Orders List */}
        <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-gray-100 min-w-0">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Orders</h3>
          <div className="space-y-4">
            {recentOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer">
                <div className="min-w-0">
                  <p className="text-sm font-bold text-gray-900">{order.dealer}</p>
                  <p className="text-xs text-gray-500">{order.id}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-gray-900">{order.amount}</p>
                  <p className={`text-[10px] font-bold uppercase tracking-wider ${
                    order.status === 'Delivered' ? 'text-green-600' : 
                    order.status === 'Pending' ? 'text-orange-500' : 'text-blue-500'
                  }`}>
                    {order.status}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-6 py-2 text-sm font-semibold text-green-600 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
            View All Orders
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
