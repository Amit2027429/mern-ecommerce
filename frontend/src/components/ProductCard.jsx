import { Link } from 'react-router-dom';
import Rating from './Rating.jsx';

const ProductCard = ({ product, onAdd }) => (
  <div className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl">

    <Link
      to={`/product/${product._id}`}
      className="block overflow-hidden bg-slate-100"
    >
      <img
        src={product.image}
        alt={product.name}
        onError={(e) => {
          e.target.src =
            'https://via.placeholder.com/400x400?text=No+Image';
        }}
        className="h-64 w-full object-cover transition duration-500 group-hover:scale-105"
      />
    </Link>

    <div className="space-y-3 p-5">

      <div className="flex items-center justify-between gap-3">

        <h2 className="text-lg font-semibold text-slate-900">
          {product.name}
        </h2>

        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-600">
          {product.category}
        </span>

      </div>

      <Rating
        value={product.rating}
        text={`${product.numReviews} reviews`}
      />

      <p className="text-sm leading-6 text-slate-600 line-clamp-2">
        {product.description}
      </p>

      <div className="flex items-center justify-between gap-3">

        <span className="text-2xl font-bold text-slate-900">
          ₹{product.price.toLocaleString('en-IN')}
        </span>

        <button
          onClick={() => onAdd(product)}
          className="rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700"
        >
          Add
        </button>

      </div>

    </div>
  </div>
);

export default ProductCard;