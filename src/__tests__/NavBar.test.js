import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { fireEvent, render, screen } from '@testing-library/react';
import NavBar from '../components/NavBar';
import cartReducer from '../redux/cartSlice';

function renderWithStore(ui, preloadedCart = []) {
  const store = configureStore({
    reducer: {
      cart: cartReducer,
    },
    preloadedState: {
      cart: { items: preloadedCart },
    },
  });

  return {
    store,
    ...render(<Provider store={store}>{ui}</Provider>),
  };
}

describe('NavBar', () => {
  test('renders cart count and notifies navigation handlers', () => {
    const onNavigate = jest.fn();

    renderWithStore(<NavBar onNavigate={onNavigate} />, [
      {
        id: 'product-1',
        title: 'Noise Cancelling Headphones',
        price: 89.99,
        category: 'electronics',
        description: 'Wireless headphones',
        image: 'https://example.com/headphones.png',
        quantity: 2,
      },
    ]);

    expect(screen.getByRole('button', { name: /cart \(2\)/i })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /home/i }));
    fireEvent.click(screen.getByRole('button', { name: /cart \(2\)/i }));

    expect(onNavigate).toHaveBeenCalledWith('home');
    expect(onNavigate).toHaveBeenCalledWith('cart');
  });
});