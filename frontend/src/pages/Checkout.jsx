import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createOrder, clearCart as clearCartApi } from '../services/api.js';
import { useCart } from '../context/CartContext.jsx';
import { useToast } from '../context/ToastContext.jsx';

export default function Checkout() {

  const { cart, clearCart } = useCart();

  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('');

  const [paymentMethod, setPaymentMethod] =
    useState('Cash on Delivery');

  const [submitting, setSubmitting] = useState(false);

  const [error, setError] = useState('');
  const [merchantDetails, setMerchantDetails] = useState(null);

  const { notify } = useToast();

  const navigate = useNavigate();

  useEffect(() => {
    // Fetch merchant details for QR code
    fetchMerchantDetails();
  }, []);

  const fetchMerchantDetails = async () => {
    try {
      const response = await fetch(
        'http://localhost:5000/api/razorpay/merchant-details'
      );
      const data = await response.json();
      setMerchantDetails(data.merchant);
    } catch (error) {
      console.error('Failed to fetch merchant details:', error);
    }
  };

  const cartItems = cart?.items ?? [];

  const itemsPrice = cartItems.reduce(
    (acc, item) => acc + (item.price || 0) * item.qty,
    0
  );

  const shippingPrice =
    itemsPrice > 1000
      ? 0
      : itemsPrice > 0
      ? 100
      : 0;

  const taxPrice = Number(
    (itemsPrice * 0.07).toFixed(2)
  );

  const totalPrice = Number(
    (itemsPrice + shippingPrice + taxPrice).toFixed(2)
  );

  const placeOrder = async () => {
    try {
      // Validate cart items have all required fields
      if (cartItems.length === 0) {
        throw new Error('Cart is empty');
      }

      const invalidItems = cartItems.filter(item => !item.name || !item.price || !item.image || !item.product || !item.qty);
      if (invalidItems.length > 0) {
        throw new Error('Some items are missing required information');
      }

      await createOrder({
        orderItems: cartItems.map(item => ({
          name: item.name,
          qty: item.qty,
          image: item.image,
          price: item.price,
          product: item.product
        })),

        shippingAddress: {
          address,
          city,
          postalCode,
          country
        },

        paymentMethod,

        itemsPrice,

        shippingPrice,

        taxPrice,

        totalPrice
      });

      await clearCartApi();

      clearCart();

      notify('Your order was placed successfully.');

      navigate('/orders');
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to place order';
      setError(message);
      notify(message, 'error');
      console.error('Order placement error:', error);
    }
  };

  const handleRazorpayPayment = async () => {

    try {

      if (
        !address ||
        !city ||
        !postalCode ||
        !country
      ) {
        setError(
          'Please fill out all shipping fields.'
        );
        return;
      }

      setSubmitting(true);

      const response = await fetch(
        'http://localhost:5000/api/razorpay/create-order',
        {
          method: 'POST',

          headers: {
            'Content-Type': 'application/json'
          },

          body: JSON.stringify({
            amount: totalPrice
          })
        }
      );

      const data = await response.json();

      const options = {

        key: import.meta.env.VITE_RAZORPAY_KEY_ID,

        amount: data.amount,

        currency: data.currency,

        name: 'ShopSphere',

        description: 'Order Payment',

        order_id: data.order_id,

        // Prefill configuration
        prefill: {
          name: 'Customer',
          email: 'customer@example.com',
          contact: '9999999999'
        },

        handler: async function (response) {

          try {

            const verifyResponse = await fetch(
              'http://localhost:5000/api/razorpay/verify-payment',
              {
                method: 'POST',

                headers: {
                  'Content-Type': 'application/json'
                },

                body: JSON.stringify(response)
              }
            );

            const verifyData =
              await verifyResponse.json();

            if (verifyData.success) {

              await placeOrder();

              notify(
                'Payment successful and order placed.'
              );

            } else {

              notify(
                'Payment verification failed',
                'error'
              );

            }

          } catch (error) {

            notify(
              'Payment verification failed',
              'error'
            );

          }

        },

        theme: {
          color: '#4f46e5'
        }

      };

      const razorpay = new window.Razorpay(
        options
      );

      razorpay.on(
        'payment.failed',
        function () {

          notify(
            'Payment failed',
            'error'
          );

        }
      );

      razorpay.open();

    } catch (error) {

      notify(
        error.message || 'Payment failed',
        'error'
      );

    } finally {

      setSubmitting(false);

    }

  };

  const handleSubmit = async (event) => {

    event.preventDefault();

    if (
      !address ||
      !city ||
      !postalCode ||
      !country
    ) {
      setError(
        'Please fill out all shipping fields.'
      );
      return;
    }

    setSubmitting(true);

    try {

      if (paymentMethod === 'Razorpay') {

        await handleRazorpayPayment();

      } else {

        await placeOrder();

      }

    } catch (err) {

      setError(
        err.response?.data?.message ||
          'Unable to place order'
      );

      notify(
        err.response?.data?.message ||
          'Unable to place order',
        'error'
      );

    } finally {

      setSubmitting(false);

    }

  };

  if (!cart?.items?.length) {

    return (
      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">

        <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">

          <h1 className="text-3xl font-semibold text-slate-900">
            Nothing to checkout
          </h1>

          <p className="mt-4 text-slate-600">
            Add items to your cart before
            completing checkout.
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

      <div className="grid gap-6 xl:grid-cols-[1.4fr_0.8fr]">

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

          <h1 className="text-2xl font-semibold text-slate-900">
            Checkout
          </h1>

          <p className="mt-2 text-slate-600">
            Enter shipping details and
            confirm your order.
          </p>

          {error && (

            <div className="mt-6 rounded-3xl border border-red-200 bg-red-50 p-4 text-red-700">

              {error}

            </div>

          )}

          <form
            className="mt-8 space-y-6"
            onSubmit={handleSubmit}
          >

            <div className="grid gap-4 sm:grid-cols-2">

              <div>

                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Address
                </label>

                <input
                  value={address}
                  onChange={(e) =>
                    setAddress(e.target.value)
                  }
                  required
                  className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900"
                />

              </div>

              <div>

                <label className="mb-2 block text-sm font-medium text-slate-700">
                  City
                </label>

                <input
                  value={city}
                  onChange={(e) =>
                    setCity(e.target.value)
                  }
                  required
                  className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900"
                />

              </div>

            </div>

            <div className="grid gap-4 sm:grid-cols-2">

              <div>

                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Postal code
                </label>

                <input
                  value={postalCode}
                  onChange={(e) =>
                    setPostalCode(
                      e.target.value
                    )
                  }
                  required
                  className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900"
                />

              </div>

              <div>

                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Country
                </label>

                <input
                  value={country}
                  onChange={(e) =>
                    setCountry(e.target.value)
                  }
                  required
                  className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900"
                />

              </div>

            </div>

            <div>

              <label className="mb-2 block text-sm font-medium text-slate-700">
                Payment method
              </label>

              <select
                value={paymentMethod}
                onChange={(e) =>
                  setPaymentMethod(
                    e.target.value
                  )
                }
                className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900"
              >

                <option>
                  Cash on Delivery
                </option>

                <option>
                  Credit Card
                </option>

                <option>
                  Razorpay
                </option>

              </select>

            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-3xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:bg-slate-300 disabled:text-slate-500"
            >

              {submitting
                ? 'Processing...'
                : paymentMethod ===
                  'Razorpay'
                ? 'Pay with Razorpay'
                : 'Place order'}

            </button>

          </form>

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
                ₹{shippingPrice.toLocaleString(
                  'en-IN'
                )}
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

        </aside>

      </div>

    </div>
  );
}