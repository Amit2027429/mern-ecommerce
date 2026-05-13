import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';

export default function Cart() {

  const { cart, total, updateItem, removeItem } = useCart();
  const navigate = useNavigate();

  const itemsPrice = total || 0;

  const shippingPrice =
    itemsPrice > 1000
      ? 0
      : itemsPrice > 0
      ? 100
      : 0;

  const taxPrice = Number(
    ((itemsPrice || 0) * 0.07).toFixed(2)
  );

  const totalPrice = Number(
    ((itemsPrice || 0) + shippingPrice + taxPrice).toFixed(2)
  );

  if (!cart?.items?.length) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">

        <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">

          <h1 className="text-3xl font-semibold text-slate-900">
            Your cart is empty
          </h1>

          <p className="mt-4 text-slate-600">
            Browse products and add items to your cart to continue.
          </p>

          <Link
            to="/"
            className="mt-8 inline-flex rounded-full bg-indigo-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
          >
            Continue shopping
          </Link>

        </div>

      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">

      <div className="space-y-6">

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

          <h1 className="text-2xl font-semibold text-slate-900">
            Shopping cart
          </h1>

          <p className="mt-2 text-slate-600">
            Review the items in your cart and proceed to checkout when ready.
          </p>

        </div>

        <div className="grid gap-6 xl:grid-cols-[1.6fr_0.9fr]">

          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

            <div className="space-y-4">

              {cart.items.map((item) => (

                <div
                  key={item.product}
                  className="flex flex-col gap-4 border-b border-slate-200 pb-4 last:border-b-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between"
                >

                  <div className="flex items-center gap-4">

                    <img
                      src={item.image}
                      alt={item.name}
                      onError={(e) => {
                        e.target.src =
                          'https://via.placeholder.com/200x200?text=No+Image';
                      }}
                      className="h-24 w-24 rounded-3xl object-cover"
                    />

                    <div>

                      <h2 className="text-lg font-semibold text-slate-900">
                        {item.name}
                      </h2>

                      <p className="text-sm text-slate-500">
                        ₹{(item.price || 0).toLocaleString('en-IN')}
                      </p>

                    </div>

                  </div>

                  <div className="flex flex-col gap-3 sm:items-end">

                    <select
                      value={item.qty}
                      onChange={(e) =>
                        updateItem(
                          item.product,
                          Number(e.target.value)
                        )
                      }
                      className="w-24 rounded-3xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900"
                    >

                      {Array.from(
                        { length: item.countInStock || 1 },
                        (_, index) => index + 1
                      ).map((value) => (

                        <option key={value} value={value}>
                          {value}
                        </option>

                      ))}

                    </select>

                    <button
                      onClick={() => removeItem(item.product)}
                      className="rounded-full bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
                    >
                      Remove
                    </button>

                  </div>

                </div>

              ))}

            </div>

          </section>

          <aside className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm">

            <h2 className="text-xl font-semibold text-slate-900">
              Order summary
            </h2>

            <div className="mt-6 space-y-4 text-sm text-slate-600">

              <div className="flex items-center justify-between">
                <span>Items</span>
                <span>
                  ₹{itemsPrice.toLocaleString('en-IN')}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span>Shipping</span>
                <span>
                  ₹{shippingPrice.toLocaleString('en-IN')}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span>Tax</span>
                <span>
                  ₹{taxPrice.toLocaleString('en-IN')}
                </span>
              </div>

            </div>

            <div className="mt-6 flex items-center justify-between border-t border-slate-200 pt-4 text-lg font-semibold text-slate-900">

              <span>Total</span>

              <span>
                ₹{totalPrice.toLocaleString('en-IN')}
              </span>

            </div>

            <button
              onClick={() => navigate('/checkout')}
              className="mt-6 w-full rounded-3xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
            >
              Proceed to checkout
            </button>

          </aside>

        </div>

      </div>

    </div>
  );
}