import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';

export default function Profile() {
  const { user, setUser, updateProfile } = useAuth();
  const { notify } = useToast();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
    }
  }, [user]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (password && password !== confirmPassword) {
      notify('Passwords do not match', 'error');
      return;
    }

    setLoading(true);
    try {
      const updatedUser = await updateProfile({ name, email, password: password || undefined });
      setUser(updatedUser);
      notify('Profile updated successfully');
    } catch (err) {
      notify(err.response?.data?.message || 'Unable to update profile', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
      <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="mb-6 text-2xl font-semibold text-slate-900">Your profile</h1>
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Name</label>
            <input value={name} onChange={(e) => setName(e.target.value)} required className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900" />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900" />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900" />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Confirm password</label>
            <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900" />
          </div>
          <button disabled={loading} className="w-full rounded-3xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-300">
            {loading ? 'Saving...' : 'Update profile'}
          </button>
        </form>
      </section>
      <aside className="rounded-3xl border border-slate-200 bg-slate-50 p-8 shadow-sm">
        <h2 className="mb-4 text-xl font-semibold text-slate-900">Account overview</h2>
        <p className="text-slate-600">Manage your profile details and keep your account secure.</p>
        <div className="mt-6 space-y-4 rounded-3xl bg-white p-5 shadow-sm">
          <div className="text-sm text-slate-500">Joined</div>
          <div className="text-base font-semibold text-slate-900">{new Date(user?.createdAt).toLocaleDateString()}</div>
        </div>
      </aside>
    </div>
  );
}
