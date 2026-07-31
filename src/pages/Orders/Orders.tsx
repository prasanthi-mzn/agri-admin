import { useEffect, useMemo, useState } from 'react';
import orderService from '../../services/orderService';
import type { ApiOrder } from '../../services/orderService';

type OrderStatus = 'confirmed' | 'pending';

const formatAmount = (value?: string) => {
  if (value === undefined || value === null || value === '') return '-';
  return value;
};

const formatDate = (value?: string) => {
  if (!value) return '-';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : new Intl.DateTimeFormat('en-IN', { dateStyle: 'medium' }).format(date);
};

const getOrderStatus = (order: ApiOrder): string => order.status || 'pending';

const Orders = () => {
  const [activeTab, setActiveTab] = useState<OrderStatus>('confirmed');
  const [orders, setOrders] = useState<ApiOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    orderService
      .fetchOrders()
      .then((items) => setOrders(items))
      .catch((err) => setError(err instanceof Error ? err.message : 'Failed to load orders'))
      .finally(() => setLoading(false));
  }, []);

  const visibleOrders = useMemo(
    () => orders.filter((order) => getOrderStatus(order).toLowerCase() === activeTab),
    [activeTab, orders]
  );

  return (
    <div className="space-y-6 text-left min-w-0">
      <div className="flex items-center gap-3">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Orders</h1>
      </div>
      {error && <div className="rounded-md border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

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
          <table className="w-full min-w-[880px] border-collapse text-left text-[13px]">
            <thead className="border-b border-gray-100 bg-gray-50 text-xs text-gray-600">
              <tr>
                <th className="px-4 py-3 font-semibold">Order ID</th>
                <th className="px-4 py-3 font-semibold">Total Amount</th>
                <th className="px-4 py-3 font-semibold">Total Quantity</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Payment Expires</th>
                <th className="px-4 py-3 font-semibold">Created</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {visibleOrders.map((order, index) => {
                const status = getOrderStatus(order).toLowerCase();
                return (
                <tr key={order.id || index} className="hover:bg-gray-50">
                  <td className="whitespace-nowrap px-4 py-3 font-semibold text-gray-900">{order.id ?? '-'}</td>
                  <td className="max-w-80 truncate px-4 py-3 text-gray-600" title={formatAmount(order.total_amount)}>{formatAmount(order.total_amount)}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-gray-600">{order.total_quantity ?? '-'}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${
                      status === 'confirmed'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}
                    >
                      {status}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-gray-600">{formatDate(order.payment_expires_at)}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-gray-600">{formatDate(order.created_at)}</td>
                </tr>
                );
              })}

              {visibleOrders.length === 0 && (
                <tr>
                  <td className="px-4 py-8 text-center text-xs text-gray-500" colSpan={6}>
                    {loading ? 'Loading orders...' : `No ${activeTab} orders found.`}
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
