import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const setToken = (token) => {
  if (token)
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
  else
    delete api.defaults.headers.common.Authorization;
};

export const fetchProducts = (params) =>
  api.get('/products', { params });

export const fetchProduct = (id) =>
  api.get(`/products/${id}`);

export const fetchCategories = () =>
  api.get('/products/categories');

export const loginUser = (credentials) =>
  api.post('/auth/login', credentials);

export const registerUser = (credentials) =>
  api.post('/auth/register', credentials);

export const getProfile = () =>
  api.get('/auth/profile');

export const updateProfile = (data) =>
  api.put('/auth/profile', data);

export const getCart = () =>
  api.get('/cart');

export const updateCart = (items) =>
  api.put('/cart', { items });

export const clearCart = () =>
  api.delete('/cart');

export const createOrder = (payload) =>
  api.post('/orders', payload);

export const getMyOrders = () =>
  api.get('/orders/my-orders');

export const fetchOrders = () =>
  api.get('/orders');

export const createPaymentIntent = (data) =>
  api.post('/orders/payment-intent', data);

export const getUsers = () =>
  api.get('/users');

export const getOrders = () =>
  api.get('/orders');

export const getOrder = (id) =>
  api.get(`/orders/${id}`);

export const cancelOrder = (id) =>
  api.put(`/orders/${id}/cancel`);

export const deliverOrder = (id) =>
  api.put(`/orders/${id}/deliver`);

export const deleteUser = (id) =>
  api.delete(`/users/${id}`);

export const uploadImage = (formData) =>
  api.post('/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });

export const createProduct = (data) =>
  api.post('/products', data);

export const updateProduct = (id, data) =>
  api.put(`/products/${id}`, data);

export const deleteProduct = (id) =>
  api.delete(`/products/${id}`);

export const addReview = (productId, review) =>
  api.post(`/products/${productId}/reviews`, review);

export default api;