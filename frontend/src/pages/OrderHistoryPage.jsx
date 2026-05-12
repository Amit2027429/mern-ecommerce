import { useEffect, useState } from 'react';
import { cancelOrder, getMyOrders } from '../services/api.js';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import { useToast } from '../context/ToastContext.jsx';

export default function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cancellingOrderId, setCancellingOrderId] = useState(null);
  const { notify } = useToast();

  const loadOrders = async () => {
    setLoading(true);
    try {
      const { data } = await getMyOrders();
      setOrders(data);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to load orders');
      notify(err.response?.data?.message || 'Unable to load orders', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, [notify]);

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;

    setCancellingOrderId(orderId);
    try {
      await cancelOrder(orderId);
      notify('Order cancelled successfully.');
      await loadOrders();
    } catch (err) {
      notify(err.response?.data?.message || 'Unable to cancel order', 'error');
    } finally {
      setCancellingOrderId(null);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-8">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-900">Order history</h1>
        <p className="mt-2 text-slate-600">Track the status of your past purchases and review your order details.</p>
      </div>

      {error ? (
        <div className="rounded-3xl border border-red-200 bg-red-50 p-6 text-red-700">{error}</div>
      ) : orders.length === 0 ? (
        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-8 text-center text-slate-600">You have no orders yet.</div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order._id} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">Order #{order._id.slice(-8).toUpperCase()}</h2>
                  <p className="text-sm text-slate-500">Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="space-y-1 text-sm text-slate-600">
                  <p>Total: ₹{order.totalPrice.toLocaleString('en-IN')}</p>
                  <p>Status: {order.status || (order.isDelivered ? 'Delivered' : order.isPaid ? 'Paid' : 'Processing')}</p>
                  <p>{order.isPaid ? 'Paid' : 'Pending payment'}</p>
                  <p>{order.isDelivered ? 'Delivered' : 'Processing'}</p>
                </div>
              </div>
              {!order.isDelivered && order.status !== 'Cancelled' && (
                <button
                  onClick={() => handleCancelOrder(order._id)}
                  disabled={cancellingOrderId === order._id}
                  className="mt-4 rounded-full bg-rose-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-rose-700 disabled:bg-slate-300 disabled:cursor-not-allowed"
                >
                  {cancellingOrderId === order._id ? 'Cancelling...' : 'Cancel order'}
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
