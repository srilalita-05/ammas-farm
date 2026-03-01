import { createContext, useContext, useState, useEffect } from 'react';
import { cartAPI } from '../services/api';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { user } = useAuth();
  const [cart, setCart] = useState({ items: [], cart_total: 0, item_count: 0 });
  const [cartLoading, setCartLoading] = useState(false);

  const fetchCart = async () => {
    if (!user) return;
    try {
      const { data } = await cartAPI.get();
      setCart(data);
    } catch {}
  };

  useEffect(() => {
    if (user && user.role !== 'admin') fetchCart();
    if (!user) setCart({ items: [], cart_total: 0, item_count: 0 });
  }, [user]);

  const addToCart = async (product_id, quantity = 1) => {
    setCartLoading(true);
    try {
      await cartAPI.add(product_id, quantity);
      await fetchCart();
      return true;
    } catch (e) {
      throw e;
    } finally {
      setCartLoading(false);
    }
  };

  const updateCartItem = async (id, quantity) => {
    await cartAPI.update(id, quantity);
    await fetchCart();
  };

  const removeCartItem = async (id) => {
    await cartAPI.remove(id);
    await fetchCart();
  };

  const clearCart = async () => {
    await cartAPI.clear();
    setCart({ items: [], cart_total: 0, item_count: 0 });
  };

  return (
    <CartContext.Provider value={{ cart, cartLoading, fetchCart, addToCart, updateCartItem, removeCartItem, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
