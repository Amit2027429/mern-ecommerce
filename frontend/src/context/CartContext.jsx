import { createContext, useContext, useEffect, useState } from 'react';
import { getCart, updateCart, clearCart as clearCartApi } from '../services/api.js';
import { useAuth } from './AuthContext.jsx';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('cart');
    if (!saved) return { items: [] };
    try {
      const parsed = JSON.parse(saved);
      return parsed && typeof parsed === 'object' && Array.isArray(parsed.items)
        ? parsed
        : { items: [] };
    } catch {
      return { items: [] };
    }
  });
  const [total, setTotal] = useState(0);

  useEffect(() => {
    setTotal(cart.items?.reduce((acc, item) => acc + item.qty * item.price, 0) ?? 0);
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    const syncCart = async () => {
      if (user?.token) {
        try {
          const { data } = await getCart();
          setCart(Array.isArray(data?.items) ? data : { items: [] });
        } catch (err) {
          console.error(err);
        }
      }
    };
    syncCart();
  }, [user]);

  const syncCartWithServer = async (items) => {
    if (!user?.token) return;
    try {
      await updateCart(items);
    } catch (err) {
      console.error(err);
    }
  };

  const addItem = (product, qty = 1) => {
    setCart((prev) => {
      const exists = prev.items.find((item) => item.product === product._id);
      const items = exists
        ? prev.items.map((item) => item.product === product._id ? { ...item, qty: Math.min(item.qty + qty, product.countInStock) } : item)
        : [...prev.items, { product: product._id, name: product.name, price: product.price, image: product.image, countInStock: product.countInStock, qty }];
      if (user?.token) syncCartWithServer(items);
      return { ...prev, items };
    });
  };

  const updateItem = (productId, qty) => {
    setCart((prev) => {
      const items = prev.items.map((item) => item.product === productId ? { ...item, qty } : item);
      if (user?.token) syncCartWithServer(items);
      return { ...prev, items };
    });
  };

  const removeItem = (productId) => {
    setCart((prev) => {
      const items = prev.items.filter((item) => item.product !== productId);
      if (user?.token) syncCartWithServer(items);
      return { ...prev, items };
    });
  };

  const clearCart = async () => {
    setCart({ items: [] });
    if (!user?.token) return;
    try {
      await clearCartApi();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <CartContext.Provider value={{ cart, total, addItem, updateItem, removeItem, clearCart, setCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
