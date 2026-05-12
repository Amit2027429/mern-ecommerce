import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { register, user, loading } = useAuth();
  const { notify } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      notify('Passwords do not match', 'error');
      return;
    }
    try {
      await register({ name, email, password });
      notify('Account created successfully');
      navigate('/');
    } catch (err) {
      notify(err.response?.data?.message || 'Unable to register', 'error');
    }
  };

  return (
    <div className="mx-auto max-w-2xl rounded-3xl border border-slate-200 bg-white p-10 shadow-sm">
      <h1 className="mb-6 text-3xl font-semibold text-slate-900">Create an account</h1>
      <p className="mb-8 text-slate-600">Join ShopSphere for fast checkout, wishlist, and order tracking.</p>
      <form className="space-y-5" onSubmit={handleSubmit}>
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">Full name</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} required className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900" />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">Email address</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900" />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900" />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">Confirm password</label>
          <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900" />
        </div>
        <button type="submit" disabled={loading} className="w-full rounded-3xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-300">
          {loading ? 'Creating account...' : 'Create account'}
        </button>
      </form>
      <p className="mt-6 text-sm text-slate-600">
        Already have an account? <Link to="/login" className="font-semibold text-indigo-600 hover:text-indigo-700">Sign in</Link>
      </p>
    </div>
  );
}
