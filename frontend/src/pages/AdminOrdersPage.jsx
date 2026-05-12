import { useEffect, useState } from 'react';
import { deliverOrder, fetchOrders } from '../services/api.js';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import { useToast } from '../context/ToastContext.jsx';

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { notify } = useToast();

  const loadOrders = async () => {
    setLoading(true);
    try {
      const { data } = await fetchOrders();
      setOrders(data);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to load orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleDeliver = async (orderId) => {
    try {
      await deliverOrder(orderId);
      notify('Order marked as delivered');
      loadOrders();
    } catch (err) {
      notify(err.response?.data?.message || 'Unable to update order', 'error');
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-8">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-900">Manage orders</h1>
      </div>
      {error && <div className="rounded-3xl border border-red-200 bg-red-50 p-6 text-red-700">{error}</div>}
      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order._id} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Order #{order._id.slice(-8).toUpperCase()}</h2>
                <p className="text-sm text-slate-500">{new Date(order.createdAt).toLocaleDateString()}</p>
              </div>
              <div className="space-y-1 text-sm text-slate-600">
                <p>Total: ${order.totalPrice.toFixed(2)}</p>
                <p>{order.isPaid ? 'Paid' : 'Pending payment'}</p>
                <p>{order.isDelivered ? 'Delivered' : 'Not delivered'}</p>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <button disabled={order.isDelivered} onClick={() => handleDeliver(order._id)} className="rounded-full bg-indigo-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed">
                Mark Delivered
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
