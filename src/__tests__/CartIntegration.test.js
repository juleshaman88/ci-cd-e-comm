import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import NavBar from '../components/NavBar';
import Products from '../components/Products';
import cartReducer from '../redux/cartSlice';

function createStore() {
  return configureStore({
    reducer: {
      cart: cartReducer,
    },
  });
}

function renderIntegration(ui, store) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>{ui}</Provider>
    </QueryClientProvider>,
  );
}

describe('Cart integration', () => {
  beforeEach(() => {
    Object.defineProperty(globalThis, 'fetch', {
      configurable: true,
      writable: true,
      value: jest.fn(),
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('updates the cart count when a product is added', async () => {
    globalThis.fetch.mockResolvedValue({
      ok: true,
      json: async () => [
        {
          id: 1,
          title: 'Wireless Mouse',
          price: 24.99,
          category: 'electronics',
          description: 'Ergonomic mouse',
          image: 'https://example.com/mouse.png',
          rating: { rate: 4.7, count: 128 },
        },
      ],
    });

    const store = createStore();

    renderIntegration(
      <>
        <NavBar onNavigate={jest.fn()} />
        <Products selectedCategory="all" onSelectProduct={jest.fn()} />
      </>,
      store,
    );

    expect(screen.getByRole('button', { name: /cart \(0\)/i })).toBeInTheDocument();

    const addButton = await screen.findByRole('button', { name: /add to cart/i });
    fireEvent.click(addButton);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /cart \(1\)/i })).toBeInTheDocument();
    });
  });
});