import { useEffect, useState } from 'react';
import { fetchOrders, getUsers, fetchProducts } from '../services/api.js';
import LoadingSpinner from '../components/LoadingSpinner.jsx';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ users: 0, products: 0, orders: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadStats = async () => {
      setLoading(true);
      try {
        const [usersRes, productsRes, ordersRes] = await Promise.all([
          getUsers(),
          fetchProducts({ limit: 100 }),
          fetchOrders()
        ]);
        setStats({
          users: usersRes.data?.length ?? 0,
          products: productsRes.data?.products?.length ?? 0,
          orders: ordersRes.data?.length ?? 0
        });
        setError('');
      } catch (err) {
        setError(err.response?.data?.message || 'Unable to load dashboard data');
      } finally {
        setLoading(false);
      }
    };
    loadStats();
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-8">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-900">Admin dashboard</h1>
        <p className="mt-2 text-slate-600">Review user activity, product inventory, and recent order volume.</p>
      </div>
      {error && <div className="rounded-3xl border border-red-200 bg-red-50 p-6 text-red-700">{error}</div>}
      <div className="grid gap-6 sm:grid-cols-3">
        {[
          { label: 'Active users', value: stats.users },
          { label: 'Published products', value: stats.products },
          { label: 'Total orders', value: stats.orders }
        ].map((item) => (
          <div key={item.label} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm uppercase tracking-[0.3em] text-slate-500">{item.label}</p>
            <p className="mt-4 text-4xl font-semibold text-slate-900">{item.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
