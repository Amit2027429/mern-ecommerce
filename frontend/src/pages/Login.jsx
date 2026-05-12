import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, user, loading } = useAuth();
  const { notify } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await login({ email, password });
      notify('Signed in successfully');
      navigate('/');
    } catch (err) {
      notify(err.response?.data?.message || 'Unable to sign in', 'error');
    }
  };

  return (
    <div className="mx-auto max-w-2xl rounded-3xl border border-slate-200 bg-white p-10 shadow-sm">
      <h1 className="mb-6 text-3xl font-semibold text-slate-900">Sign in to your account</h1>
      <p className="mb-8 text-slate-600">Enter your email and password to continue shopping.</p>
      <form className="space-y-5" onSubmit={handleSubmit}>
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">Email address</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900" />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900" />
        </div>
        <button type="submit" disabled={loading} className="w-full rounded-3xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:bg-slate-300 disabled:text-slate-500">
          {loading ? 'Signing in...' : 'Sign in'}
        </button>
      </form>
      <p className="mt-6 text-sm text-slate-600">
        New customer? <Link to="/register" className="font-semibold text-indigo-600 hover:text-indigo-700">Create an account</Link>
      </p>
    </div>
  );
}
