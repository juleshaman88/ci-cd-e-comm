import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import Categories from '../components/Categories';

function renderWithQueryClient(ui) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return render(<QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>);
}

describe('Categories', () => {
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

  test('renders categories from the API and emits the selected value', async () => {
    globalThis.fetch.mockResolvedValue({
      ok: true,
      json: async () => ['electronics', 'jewelery'],
    });

    const onChange = jest.fn();

    renderWithQueryClient(<Categories selectedCategory="all" onChange={onChange} />);

    await waitFor(() => {
      expect(screen.getByRole('option', { name: 'electronics' })).toBeInTheDocument();
    });

    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'electronics' } });

    expect(onChange).toHaveBeenCalledWith('electronics');
  });
});