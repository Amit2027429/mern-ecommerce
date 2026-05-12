import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import Home from './pages/Home.jsx';
import ProductDetails from './pages/ProductDetails.jsx';
import Cart from './pages/Cart.jsx';
import Checkout from './pages/Checkout.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/RegisterPage.jsx';
import Profile from './pages/ProfilePage.jsx';
import OrderHistory from './pages/OrderHistoryPage.jsx';
import AdminDashboard from './pages/AdminDashboardPage.jsx';
import AdminProducts from './pages/AdminProductsPage.jsx';
import AdminUsers from './pages/AdminUsersPage.jsx';
import AdminOrders from './pages/AdminOrdersPage.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';

function App() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/orders" element={<ProtectedRoute><OrderHistory /></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute admin><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/products" element={<ProtectedRoute admin><AdminProducts /></ProtectedRoute>} />
          <Route path="/admin/users" element={<ProtectedRoute admin><AdminUsers /></ProtectedRoute>} />
          <Route path="/admin/orders" element={<ProtectedRoute admin><AdminOrders /></ProtectedRoute>} />
        </Routes>
      </Layout>
    </div>
  );
}

export default App;
