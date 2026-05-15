import React from 'react';
import { Plus, Search, Filter, MoreVertical, Download } from 'lucide-react';

const Inventory = () => {
  const inventoryData = [
    { id: 'INV-001', name: 'Organic NPK Fertilizer', category: 'Fertilizers', stock: 120, price: '₹1,200', status: 'In Stock' },
    { id: 'INV-002', name: 'Hybrid Tomato Seeds', category: 'Seeds', stock: 15, price: '₹450', status: 'Low Stock' },
    { id: 'INV-003', name: 'Neem Oil Pesticide', category: 'Pesticides', stock: 0, price: '₹800', status: 'Out of Stock' },
    { id: 'INV-004', name: 'Potting Mix - 5kg', category: 'Soil', stock: 85, price: '₹350', status: 'In Stock' },
    { id: 'INV-005', name: 'Drip Irrigation Kit', category: 'Tools', stock: 10, price: '₹2,500', status: 'Low Stock' },
  ];

  const getStatusStyle = (status) => {
    switch (status) {
      case 'In Stock': return 'bg-green-100 text-green-700';
      case 'Low Stock': return 'bg-orange-100 text-orange-700';
      case 'Out of Stock': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Inventory Management</h1>
          <p className="text-gray-500">Track and manage your agricultural supplies and stock levels.</p>
        </div>
        <button className="flex items-center justify-center gap-2 bg-common-btn-bg hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold transition-all shadow-md">
          <Plus size={18} />
          Add New Product
        </button>
      </div>

      {/* Filters and Search Bar */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search products..." 
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
          />
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600 font-medium">
            <Filter size={18} /> Filter
          </button>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600 font-medium">
            <Download size={18} /> Export
          </button>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600">Product Info</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600">Category</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600">Stock</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600">Price</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600">Status</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {inventoryData.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-bold text-gray-900">{item.name}</p>
                    <p className="text-xs text-gray-500">{item.id}</p>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{item.category}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{item.stock} Units</td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{item.price}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusStyle(item.status)}`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 hover:bg-gray-200 rounded-full text-gray-400 hover:text-gray-600">
                      <MoreVertical size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Pagination Placeholder */}
        <div className="p-4 border-t border-gray-100 bg-gray-50 flex items-center justify-between">
          <p className="text-sm text-gray-500 Small">Showing 5 of 42 items</p>
          <div className="flex gap-2">
            <button className="px-3 py-1 border border-gray-200 rounded bg-white text-sm hover:bg-gray-50 disabled:opacity-50">Prev</button>
            <button className="px-3 py-1 border border-gray-200 rounded bg-white text-sm hover:bg-gray-50">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Inventory;