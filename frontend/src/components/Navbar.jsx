import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiMenu, FiX, FiShoppingCart, FiUser, FiSearch } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext.jsx';
import { useCart } from '../context/CartContext.jsx';
import { useProduct } from '../context/ProductContext.jsx';

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const { categories } = useProduct();
  const navigate = useNavigate();

  const cartCount = cart.items.reduce((sum, item) => sum + item.qty, 0);

  const handleSearch = (event) => {
    event.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/?search=${encodeURIComponent(searchTerm.trim())}`);
      setMobileOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm">
      <div className="container mx-auto flex items-center justify-between px-4 py-4 md:px-6">
        <Link to="/" className="text-2xl font-bold tracking-tight text-slate-900">
          ShopSphere
        </Link>

        <form onSubmit={handleSearch} className="hidden md:flex flex-1 mx-6 items-center max-w-2xl gap-2">
          <div className="relative flex-1">
            <FiSearch className="absolute top-1/2 left-3 -translate-y-1/2 text-slate-500" />
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search products, brands or categories"
              className="w-full rounded-full border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-slate-900 transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
          </div>
          <button className="rounded-full bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700">
            Search
          </button>
        </form>

        <div className="hidden md:flex items-center gap-4">
          <Link to="/cart" className="relative inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-indigo-500 hover:text-indigo-700">
            <FiShoppingCart className="h-4 w-4" />
            Cart
            {cartCount > 0 && <span className="rounded-full bg-indigo-600 px-2 py-0.5 text-xs font-semibold text-white">{cartCount}</span>}
          </Link>
          {user ? (
            <div className="relative group">
              <button className="inline-flex items-center gap-2 rounded-full bg-slate-50 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100">
                <FiUser className="h-4 w-4" />
                {user.name}
              </button>
              <div className="absolute right-0 top-full mt-2 hidden min-w-[180px] rounded-xl border border-slate-200 bg-white shadow-lg group-hover:block">
                <Link to="/profile" className="block px-4 py-3 text-sm text-slate-700 hover:bg-slate-50">Profile</Link>
                <Link to="/orders" className="block px-4 py-3 text-sm text-slate-700 hover:bg-slate-50">Orders</Link>
                {user.isAdmin && <Link to="/admin" className="block px-4 py-3 text-sm text-slate-700 hover:bg-slate-50">Admin</Link>}
                <button onClick={() => logout()} className="w-full text-left px-4 py-3 text-sm text-slate-700 hover:bg-slate-50">
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <Link to="/login" className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-indigo-500 hover:text-indigo-700">
              <FiUser className="h-4 w-4" />
              Sign In
            </Link>
          )}
        </div>

        <button type="button" onClick={() => setMobileOpen(!mobileOpen)} className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-900 md:hidden">
          {mobileOpen ? <FiX className="h-6 w-6" /> : <FiMenu className="h-6 w-6" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="border-t border-slate-200 bg-white md:hidden">
          <div className="container mx-auto space-y-3 px-4 py-4">
            <form onSubmit={handleSearch} className="flex items-center gap-2">
              <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search products"
                className="flex-1 rounded-full border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
              <button className="rounded-full bg-indigo-600 px-4 py-3 text-sm font-semibold text-white">Go</button>
            </form>
            <div className="grid gap-2">
              <Link to="/cart" onClick={() => setMobileOpen(false)} className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700">
                Cart ({cartCount})
              </Link>
              <Link to="/" onClick={() => setMobileOpen(false)} className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700">
                Home
              </Link>
              {categories.slice(0, 5).map((category) => (
                <Link key={category} to={`/?category=${encodeURIComponent(category)}`} onClick={() => setMobileOpen(false)} className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700">
                  {category}
                </Link>
              ))}
              {user ? (
                <button onClick={() => { logout(); setMobileOpen(false); }} className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-left text-sm font-medium text-slate-700">
                  Logout
                </button>
              ) : (
                <Link to="/login" onClick={() => setMobileOpen(false)} className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700">
                  Sign in
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
