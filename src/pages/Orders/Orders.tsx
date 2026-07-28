import { useMemo, useState } from 'react';

type OrderStatus = 'confirmed' | 'pending';

type Order = {
  id: string;
  customer: string;
  vendor: string;
  total: string;
  status: OrderStatus;
  createdAt: string;
};

const orders: Order[] = [];

const Orders = () => {
  const [activeTab, setActiveTab] = useState<OrderStatus>('confirmed');

  const visibleOrders = useMemo(
    () => orders.filter((order) => order.status === activeTab),
    [activeTab]
  );

  return (
    <div className="space-y-6 text-left min-w-0">
      <div className="flex items-center gap-3">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Orders</h1>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-200 px-3">
        <div role="tablist" className="flex flex-wrap items-end gap-1">
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'confirmed'}
            onClick={() => setActiveTab('confirmed')}
            className={`px-4 py-3 text-sm font-semibold transition ${
              activeTab === 'confirmed'
                ? 'border-b-2 border-[var(--common-btn-bg)] text-[var(--common-btn-bg)]'
                : 'border-b-2 border-transparent text-gray-600 hover:text-[var(--common-btn-bg)]'
            }`}
          >
            Confirmed Orders
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'pending'}
            onClick={() => setActiveTab('pending')}
            className={`px-4 py-3 text-sm font-semibold transition ${
              activeTab === 'pending'
                ? 'border-b-2 border-[var(--common-btn-bg)] text-[var(--common-btn-bg)]'
                : 'border-b-2 border-transparent text-gray-600 hover:text-[var(--common-btn-bg)]'
            }`}
          >
            Pending Orders
          </button>
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border border-gray-100 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] border-collapse text-left text-[13px]">
            <thead className="border-b border-gray-100 bg-gray-50 text-xs text-gray-600">
              <tr>
                <th className="px-4 py-3 font-semibold">Order ID</th>
                <th className="px-4 py-3 font-semibold">Customer</th>
                <th className="px-4 py-3 font-semibold">Vendor</th>
                <th className="px-4 py-3 font-semibold">Total</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Created</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {visibleOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="whitespace-nowrap px-4 py-3 font-semibold text-gray-900">{order.id}</td>
                  <td className="px-4 py-3 text-gray-600">{order.customer}</td>
                  <td className="px-4 py-3 text-gray-600">{order.vendor}</td>
                  <td className="whitespace-nowrap px-4 py-3 font-medium text-gray-900">{order.total}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${
                      order.status === 'confirmed'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-gray-600">{order.createdAt}</td>
                </tr>
              ))}

              {visibleOrders.length === 0 && (
                <tr>
                  <td className="px-4 py-8 text-center text-xs text-gray-500" colSpan={6}>
                    No {activeTab} orders found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Orders;
