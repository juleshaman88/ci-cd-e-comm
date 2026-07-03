import { useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Categories from './Categories';
import Products from './Products';
import ProductDetail from './ProductDetail';
import NavBar from './NavBar';
import type { AppDispatch, RootState } from '../redux/store';
import type { CartItem, Product } from '../redux/cartSlice';
import { clearCart, decreaseCartItemQuantity, increaseCartItemQuantity, removeFromCart } from '../redux/cartSlice';

export default function HomePage() {
  const dispatch = useDispatch<AppDispatch>();
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const [view, setView] = useState<'home' | 'cart'>('home');
  const [uiMessage, setUiMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const totalItems = useMemo(
    () => cartItems.reduce((total: number, item: CartItem) => total + item.quantity, 0),
    [cartItems],
  );

  const totalPrice = useMemo(
    () => cartItems.reduce((total: number, item: CartItem) => total + item.price * item.quantity, 0),
    [cartItems],
  );

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      return;
    }

    dispatch(clearCart());
    setUiMessage('Checkout complete. Your cart was cleared.');
    setErrorMessage('');
    setView('home');
    setSelectedProduct(null);
  };

  const handleNavigate = (nextView: 'home' | 'cart') => {
    setView(nextView);
    setSelectedProduct(null);
    setUiMessage('');
    setErrorMessage('');
  };

  return (
    <div className="app-shell">
      <header className="hero-section">
        <div className="hero-copy">
          <p className="eyebrow">Your Stop for Shopping</p>
          <h1>The Shopping Storefront with Easy Checkout Access</h1>
          <p>
            Browse our products and add them to your cart. You can view your cart and place an order at any time. Enjoy a seamless shopping experience!
          </p>
        </div>
        <div className="hero-stats" aria-label="Cart summary">
          <div className="hero-stat">
            <strong>{totalItems}</strong>
            <span>Items</span>
          </div>
          <div className="hero-stat">
            <strong>${totalPrice.toFixed(2)}</strong>
            <span>Total</span>
          </div>
        </div>
      </header>
      <NavBar onNavigate={handleNavigate} />
      {uiMessage ? <p className="status-message success-message">{uiMessage}</p> : null}
      {errorMessage ? <p className="status-message error-message">{errorMessage}</p> : null}
      {selectedProduct ? (
        <ProductDetail product={selectedProduct} onBack={() => setSelectedProduct(null)} />
      ) : view === 'home' ? (
        <main className="home-view">
          <Categories selectedCategory={selectedCategory} onChange={setSelectedCategory} />
          <Products
            selectedCategory={selectedCategory}
            onSelectProduct={setSelectedProduct}
          />
        </main>
      ) : (
        <main className="cart-view">
          <h2>Your Cart</h2>
          <p>Total items: {totalItems}</p>
          <p>Total price: ${totalPrice.toFixed(2)}</p>
          {cartItems.length === 0 ? (
            <p>Your cart is empty.</p>
          ) : (
            <div className="cart-list">
              {cartItems.map((item: CartItem) => (
                <article className="cart-item" key={item.id}>
                  <img src={item.image} alt={item.title} onError={(event) => {
                    event.currentTarget.src = 'https://via.placeholder.com/120x120?text=No+Image';
                  }} />
                  <div>
                    <h3>{item.title}</h3>
                    <div className="cart-quantity-controls" aria-label={`Adjust quantity for ${item.title}`}>
                      <span>Quantity:</span>
                      <button type="button" onClick={() => dispatch(decreaseCartItemQuantity(item.id))}>
                        -
                      </button>
                      <strong>{item.quantity}</strong>
                      <button type="button" onClick={() => dispatch(increaseCartItemQuantity(item.id))}>
                        +
                      </button>
                    </div>
                    <p>Price: ${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                  <button type="button" onClick={() => dispatch(removeFromCart(item.id))}>
                    Remove
                  </button>
                </article>
              ))}
            </div>
          )}
          <button type="button" className="checkout-button" onClick={handleCheckout} disabled={cartItems.length === 0}>
            Place order
          </button>
        </main>
      )}
    </div>
  );
}
