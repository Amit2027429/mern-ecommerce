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

  // ✅ API URL from environment variable
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetchMerchantDetails();
  }, []);

  // ✅ FIXED
  const fetchMerchantDetails = async () => {
    try {
      const response = await fetch(
        `${API_URL}/razorpay/merchant-details`
      );

      const data = await response.json();

      setMerchantDetails(data.merchant);

    } catch (error) {

      console.error(
        'Failed to fetch merchant details:',
        error
      );

    }
  };

  const cartItems = cart?.items ?? [];

  const itemsPrice = cartItems.reduce(
    (acc, item) =>
      acc + (item.price || 0) * item.qty,
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
    (
      itemsPrice +
      shippingPrice +
      taxPrice
    ).toFixed(2)
  );

  const placeOrder = async () => {

    try {

      if (cartItems.length === 0) {

        throw new Error('Cart is empty');

      }

      const invalidItems =
        cartItems.filter(
          (item) =>
            !item.name ||
            !item.price ||
            !item.image ||
            !item.product ||
            !item.qty
        );

      if (invalidItems.length > 0) {

        throw new Error(
          'Some items are missing required information'
        );

      }

      await createOrder({

        orderItems: cartItems.map((item) => ({
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

      notify(
        'Your order was placed successfully.'
      );

      navigate('/orders');

    } catch (error) {

      const message =
        error.response?.data?.message ||
        error.message ||
        'Failed to place order';

      setError(message);

      notify(message, 'error');

      console.error(
        'Order placement error:',
        error
      );

    }

  };

  // ✅ FIXED
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

      // ✅ FIXED
      const response = await fetch(
        `${API_URL}/razorpay/create-order`,
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

        prefill: {
          name: 'Customer',
          email: 'customer@example.com',
          contact: '9999999999'
        },

        handler: async function (response) {

          try {

            // ✅ FIXED
            const verifyResponse =
              await fetch(
                `${API_URL}/razorpay/verify-payment`,
                {
                  method: 'POST',

                  headers: {
                    'Content-Type':
                      'application/json'
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

      const razorpay =
        new window.Razorpay(options);

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

      if (
        paymentMethod === 'Razorpay'
      ) {

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

      <h1 className="text-3xl font-bold">
        Checkout
      </h1>

    </div>
  );
}