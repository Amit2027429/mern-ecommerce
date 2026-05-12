import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { fetchProducts } from '../services/api.js';
import ProductCard from '../components/ProductCard.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import { useCart } from '../context/CartContext.jsx';
import { useProduct } from '../context/ProductContext.jsx';
import { useToast } from '../context/ToastContext.jsx';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchParams, setSearchParams] = useSearchParams();
  const { categories } = useProduct();
  const { addItem } = useCart();
  const { notify } = useToast();

  const search = searchParams.get('search') || '';
  const category = searchParams.get('category') || 'all';

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      try {
        const params = { limit: 24 };
        if (search) params.search = search;
        if (category && category !== 'all') params.category = category;

        const { data } = await fetchProducts(params);
        setProducts(data.products);
        setError('');
      } catch (err) {
        setError(err.response?.data?.message || 'Unable to load products');
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [search, category]);

  const handleAddProduct = (product) => {
    addItem(product, 1);
    notify(`${product.name} added to cart.`);
  };

  const handleCategoryChange = (selectedCategory) => {
    const params = {};
    if (search) params.search = search;
    if (selectedCategory !== 'all') params.category = selectedCategory;
    setSearchParams(params);
  };

  const displayedCategories = [{ key: 'all', label: 'All categories' }, ...categories.map((name) => ({ key: name, label: name }))];

  return (
    <div className="space-y-8 px-4 py-8 sm:px-6 lg:px-8">
      <section className="space-y-3 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-slate-900">Featured products</h1>
            <p className="mt-2 text-slate-600">Browse the latest deals and top-rated items available in the store.</p>
          </div>
          {search && (
            <div className="rounded-3xl bg-slate-50 px-4 py-3 text-sm text-slate-600">
              Showing results for <span className="font-semibold text-slate-900">{search}</span>
            </div>
          )}
        </div>
        <div className="flex flex-wrap gap-3">
          {displayedCategories.map((filter) => (
            <button
              key={filter.key}
              type="button"
              onClick={() => handleCategoryChange(filter.key)}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${category === filter.key ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </section>

      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <div className="rounded-3xl border border-red-200 bg-red-50 p-6 text-red-700">{error}</div>
      ) : products.length === 0 ? (
        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-10 text-center text-slate-600">No products found. Try a different search or category.</div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} onAdd={handleAddProduct} />
          ))}
        </div>
      )}
    </div>
  );
}
