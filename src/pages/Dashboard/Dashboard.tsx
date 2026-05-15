import React from 'react';
import { 
  Users, 
  Package, 
  ShoppingBag, 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownRight 
} from 'lucide-react';

const Dashboard = () => {
  // Mock data for the cards
  const stats = [
    { name: 'Total Dealers', value: '1,284', icon: <Users className="text-blue-600" />, change: '+12%', positive: true },
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
    <div className="space-y-6">
      {/* Header Section */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-500">Welcome back, Admin. Here is what's happening today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((item) => (
          <div key={item.name} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gray-50 rounded-xl">{item.icon}</div>
              <span className={`flex items-center text-sm font-medium ${item.positive ? 'text-green-600' : 'text-red-600'}`}>
                {item.change}
                {item.positive ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
              </span>
            </div>
            <h3 className="text-gray-500 text-sm font-medium">{item.name}</h3>
            <p className="text-2xl font-bold text-gray-900 mt-1">{item.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Chart Placeholder */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Sales Performance</h3>
          <div className="h-64 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 flex items-center justify-center">
            <p className="text-gray-400 font-medium">Chart visualization would render here</p>
          </div>
        </div>

        {/* Recent Orders List */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Orders</h3>
          <div className="space-y-4">
            {recentOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer">
                <div>
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