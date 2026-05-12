import { useEffect, useState } from 'react';
import { createProduct, deleteProduct, fetchProducts, updateProduct, uploadImage } from '../services/api.js';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import { useToast } from '../context/ToastContext.jsx';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState(null);
  const [formValues, setFormValues] = useState({ name: '', price: 0, category: '', brand: '', countInStock: 0, description: '', image: '' });
  const [imageFile, setImageFile] = useState(null);
  const { notify } = useToast();

  const loadProducts = async () => {
    setLoading(true);
    try {
      const { data } = await fetchProducts({ limit: 100 });
      setProducts(data.products);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const resetForm = () => {
    setEditing(null);
    setFormValues({ name: '', price: 0, category: '', brand: '', countInStock: 0, description: '', image: '' });
    setImageFile(null);
  };

  const handleEdit = (product) => {
    setEditing(product._id);
    setFormValues({
      name: product.name,
      price: product.price,
      category: product.category,
      brand: product.brand,
      countInStock: product.countInStock,
      description: product.description,
      image: product.image
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      let imageUrl = formValues.image;
      if (imageFile) {
        const body = new FormData();
        body.append('image', imageFile);
        const { data } = await uploadImage(body);
        imageUrl = data.imageUrl;
      }
      const payload = { ...formValues, image: imageUrl };
      if (editing) {
        await updateProduct(editing, payload);
        notify('Product updated successfully');
      } else {
        await createProduct(payload);
        notify('Product created successfully');
      }
      resetForm();
      loadProducts();
    } catch (err) {
      notify(err.response?.data?.message || 'Unable to save product', 'error');
    }
  };

  const handleDelete = async (productId) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      await deleteProduct(productId);
      notify('Product deleted successfully');
      loadProducts();
    } catch (err) {
      notify(err.response?.data?.message || 'Unable to delete product', 'error');
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-8">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-900">Manage products</h1>
      </div>
      {error && <div className="rounded-3xl border border-red-200 bg-red-50 p-6 text-red-700">{error}</div>}
      <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-5 text-xl font-semibold text-slate-900">Product catalog</h2>
          <div className="space-y-4">
            {products.map((product) => (
              <div key={product._id} className="flex flex-col gap-4 rounded-3xl border border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-1">
                  <p className="font-semibold text-slate-900">{product.name}</p>
                  <p className="text-sm text-slate-500">{product.category} • ${product.price.toFixed(2)}</p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <button onClick={() => handleEdit(product)} className="rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700">
                    Edit
                  </button>
                  <button onClick={() => handleDelete(product._id)} className="rounded-full bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700">
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-5 text-xl font-semibold text-slate-900">{editing ? 'Edit product' : 'Add a new product'}</h2>
          <form className="space-y-4" onSubmit={handleSubmit}>
            {['name', 'category', 'brand', 'description'].map((field) => (
              <div key={field}>
                <label className="mb-2 block text-sm font-medium text-slate-700">{field.charAt(0).toUpperCase() + field.slice(1)}</label>
                <input value={formValues[field]} onChange={(e) => setFormValues((prev) => ({ ...prev, [field]: e.target.value }))} required className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900" />
              </div>
            ))}
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Price</label>
                <input type="number" step="0.01" value={formValues.price} onChange={(e) => setFormValues((prev) => ({ ...prev, price: Number(e.target.value) }))} required className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900" />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Stock</label>
                <input type="number" value={formValues.countInStock} onChange={(e) => setFormValues((prev) => ({ ...prev, countInStock: Number(e.target.value) }))} required className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900" />
              </div>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Image URL</label>
              <input value={formValues.image} onChange={(e) => setFormValues((prev) => ({ ...prev, image: e.target.value }))} placeholder="http://..." className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900" />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Upload image</label>
              <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] || null)} className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900" />
            </div>
            <button type="submit" className="w-full rounded-3xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700">
              {editing ? 'Update product' : 'Add product'}
            </button>
            {editing && (
              <button type="button" onClick={resetForm} className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100">
                Cancel edit
              </button>
            )}
          </form>
        </section>
      </div>
    </div>
  );
}
