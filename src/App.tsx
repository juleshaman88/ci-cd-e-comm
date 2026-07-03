import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import HomePage from './components/HomePage';
import { clearCart, hydrateCart } from './redux/cartSlice';
import type { RootState } from './redux/store';
import './App.css';

const CART_STORAGE_KEY = 'guest-cart';

function App() {
  const dispatch = useDispatch();
  const cartItems = useSelector((state: RootState) => state.cart.items);

  useEffect(() => {
    const savedCart = sessionStorage.getItem(CART_STORAGE_KEY);

    if (!savedCart) {
      dispatch(clearCart());
      return;
    }

    try {
      const parsedCart = JSON.parse(savedCart);
      dispatch(hydrateCart(parsedCart));
    } catch {
      sessionStorage.removeItem(CART_STORAGE_KEY);
      dispatch(clearCart());
    }
  }, [dispatch]);

  useEffect(() => {
    sessionStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
  }, [cartItems]);

  return <HomePage />;
}

export default App;
