import { useEffect, useState } from 'react';
import { getUsers, deleteUser } from '../services/api.js';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import { useToast } from '../context/ToastContext.jsx';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { notify } = useToast();

  const loadUsers = async () => {
    setLoading(true);
    try {
      const { data } = await getUsers();
      setUsers(data);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleDelete = async (userId) => {
    if (!window.confirm('Delete this user?')) return;
    try {
      await deleteUser(userId);
      notify('User deleted successfully');
      loadUsers();
    } catch (err) {
      notify(err.response?.data?.message || 'Unable to delete user', 'error');
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-8">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-900">Manage users</h1>
      </div>
      {error && <div className="rounded-3xl border border-red-200 bg-red-50 p-6 text-red-700">{error}</div>}
      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full border-collapse text-left text-sm text-slate-700">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-4 font-medium">Name</th>
              <th className="px-6 py-4 font-medium">Email</th>
              <th className="px-6 py-4 font-medium">Admin</th>
              <th className="px-6 py-4 font-medium">Created</th>
              <th className="px-6 py-4 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((userItem) => (
              <tr key={userItem._id} className="border-t border-slate-200">
                <td className="px-6 py-4">{userItem.name}</td>
                <td className="px-6 py-4">{userItem.email}</td>
                <td className="px-6 py-4">{userItem.isAdmin ? 'Yes' : 'No'}</td>
                <td className="px-6 py-4">{new Date(userItem.createdAt).toLocaleDateString()}</td>
                <td className="px-6 py-4">
                  <button onClick={() => handleDelete(userItem._id)} className="rounded-full bg-red-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-red-700">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
