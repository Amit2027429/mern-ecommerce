import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { fetchProduct } from '../services/api.js';
import { useCart } from '../context/CartContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import Rating from '../components/Rating.jsx';

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [error, setError] = useState('');
  const { addItem } = useCart();
  const { notify } = useToast();

  useEffect(() => {
    const loadProduct = async () => {
      setLoading(true);
      try {
        const { data } = await fetchProduct(id);
        setProduct(data);
        setQty(data.countInStock > 0 ? 1 : 0);
        setError('');
      } catch (err) {
        setError(err.response?.data?.message || 'Unable to load product details');
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (!product || product.countInStock === 0) return;
    addItem(product, qty);
    notify(`${product.name} added to cart.`);
  };

  if (loading) return <LoadingSpinner />;

  if (error) {
    return <div className="rounded-3xl border border-red-200 bg-red-50 p-6 text-red-700">{error}</div>;
  }

  if (!product) {
    return <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 text-slate-700">Product not found.</div>;
  }

  return (
    <div className="space-y-8 px-4 py-8 sm:px-6 lg:px-8">
      <div className="space-y-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <Link to="/" className="text-sm font-semibold text-indigo-600 hover:text-indigo-700">← Back to shop</Link>
        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-6">
            <div className="overflow-hidden rounded-3xl border border-slate-200 bg-slate-100">
              <img src={product.image} alt={product.name} className="w-full object-cover" />
            </div>
            <div className="space-y-4">
              <h1 className="text-3xl font-semibold text-slate-900">{product.name}</h1>
              <Rating value={product.rating} text={`${product.numReviews} reviews`} />
              <p className="text-slate-600 leading-7">{product.description}</p>
            </div>
          </div>

          <div className="space-y-6 rounded-3xl border border-slate-200 bg-slate-50 p-6">
            <div className="space-y-2">
              <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Price</p>
              <p className="text-3xl font-semibold text-slate-900">${product.price.toFixed(2)}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Availability</p>
              <p className={`text-sm font-semibold ${product.countInStock > 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                {product.countInStock > 0 ? 'In stock' : 'Out of stock'}
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Category</p>
              <p className="text-sm text-slate-700">{product.category}</p>
            </div>
            <div className="space-y-4">
              <label className="block text-sm font-medium text-slate-700">Quantity</label>
              <select
                value={qty}
                onChange={(e) => setQty(Number(e.target.value))}
                disabled={product.countInStock === 0}
                className="w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-slate-900"
              >
                {Array.from({ length: Math.min(product.countInStock, 10) }, (_, index) => index + 1).map((value) => (
                  <option key={value} value={value}>{value}</option>
                ))}
              </select>
            </div>
            <button
              onClick={handleAddToCart}
              disabled={product.countInStock === 0}
              className="w-full rounded-3xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:bg-slate-300 disabled:text-slate-500"
            >
              Add to cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
