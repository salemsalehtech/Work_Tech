import { configureStore } from '@reduxjs/toolkit';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { cartReducer, selectCartItems } from '@features/cart';
import { catalogApi, useGetProductQuery, useGetReviewsQuery } from '@features/catalog';
import { compareReducer } from '@features/compare';
import { wishlistReducer } from '@features/wishlist';

import ProductDetails from '.';

vi.mock('../../features/catalog/api/catalogApi', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useGetProductQuery: vi.fn(),
    useGetReviewsQuery: vi.fn(),
  };
});

const sampleLaptop = {
  id: 'asus-zenbook-14',
  brand: 'ASUS',
  name: 'Zenbook 14 OLED',
  price: 76999,
  oldPrice: null,
  currency: 'EGP',
  images: [],
  rating: 4.4,
  reviewsCount: 5,
  stock: 10,
  valueScore: 86,
  specs: {
    cpu: 'Intel Core Ultra 7 255H',
    ram: 16,
    storage: 512,
    gpu: 'Intel Arc',
    gpuVram: null,
    weight: 1.2,
  },
  inTheBox: ['Zenbook 14 OLED', '65 W power adapter'],
  options: {
    memory: [
      { label: '16 GB', delta: 0 },
      { label: '32 GB', delta: 5500 },
    ],
    storage: [
      { label: '512 GB', delta: 0 },
      { label: '1 TB', delta: 4000 },
    ],
    warranty: [
      { label: '1 year', delta: 0 },
      { label: '2 years', delta: 3100 },
    ],
  },
};

function LocationProbe() {
  const location = useLocation();
  return (
    <output data-testid="location">
      {location.pathname}
      {location.search}
    </output>
  );
}

function renderProductRoute(initialEntry = '/products/asus-zenbook-14') {
  const store = configureStore({
    reducer: {
      [catalogApi.reducerPath]: catalogApi.reducer,
      cart: cartReducer,
      compare: compareReducer,
      wishlist: wishlistReducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(catalogApi.middleware),
  });

  render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[initialEntry]}>
        <Routes>
          <Route
            path="/products/:id"
            element={
              <>
                <ProductDetails />
                <LocationProbe />
              </>
            }
          />
          <Route path="/checkout" element={<LocationProbe />} />
        </Routes>
      </MemoryRouter>
    </Provider>,
  );

  return { store };
}

describe('ProductDetails page', () => {
  beforeEach(() => {
    vi.mocked(useGetProductQuery).mockReset();
    vi.mocked(useGetReviewsQuery).mockReturnValue({
      data: [
        {
          id: 'r-001',
          userName: 'Ahmed M.',
          city: 'Nasr City',
          rating: 5,
          title: 'Great screen',
          body: 'The OLED screen is amazing.',
        },
      ],
      isLoading: false,
      isError: false,
    });
  });

  it('shows EmptyState when the product is not found (404)', () => {
    vi.mocked(useGetProductQuery).mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
      error: { status: 404 },
    });

    renderProductRoute('/products/missing-laptop');

    expect(screen.getByRole('heading', { name: 'Product not found' })).toBeInTheDocument();
  });

  it('updates price, installment, URL params, and creates separate cart lines for different options', async () => {
    vi.mocked(useGetProductQuery).mockReturnValue({
      data: sampleLaptop,
      isLoading: false,
      isError: false,
    });

    const { store } = renderProductRoute('/products/asus-zenbook-14');

    // Add default 16 GB configuration
    await userEvent.click(screen.getByRole('button', { name: 'Add to cart' }));

    // Select 32 GB (+5,500 EGP -> 82,499 EGP)
    await userEvent.click(screen.getByRole('radio', { name: /32 GB/ }));

    expect(screen.getAllByText('82,499 EGP').length).toBeGreaterThan(0);
    expect(screen.getByTestId('location').textContent).toContain('memory=32+GB');

    // Add 32 GB configuration -> creates a second line in cart
    await userEvent.click(screen.getByRole('button', { name: 'Add to cart' }));

    const cartItems = selectCartItems(store.getState());
    expect(cartItems).toHaveLength(2);
    expect(cartItems[0].options.memory).toBe('16 GB');
    expect(cartItems[1].options.memory).toBe('32 GB');
  });

  it('opens a shared link with its options and keeps them when another one changes', async () => {
    vi.mocked(useGetProductQuery).mockReturnValue({
      data: sampleLaptop,
      isLoading: false,
      isError: false,
    });

    const { store } = renderProductRoute(
      '/products/asus-zenbook-14?memory=32%20GB&warranty=2%20years',
    );

    expect(screen.getByRole('radio', { name: /32 GB/ })).toBeChecked();
    expect(screen.getByRole('radio', { name: /2 years/ })).toBeChecked();
    expect(screen.getByText('85,599 EGP')).toBeInTheDocument();

    await userEvent.click(screen.getByRole('radio', { name: /1 TB/ }));
    await userEvent.click(screen.getByRole('button', { name: 'Add to cart' }));

    expect(selectCartItems(store.getState())[0]).toMatchObject({
      options: { memory: '32 GB', storage: '1 TB', warranty: '2 years' },
      price: 89599,
      warrantyDelta: 3100,
    });
  });

  it('follows the chosen options and plan in the monthly price', async () => {
    vi.mocked(useGetProductQuery).mockReturnValue({
      data: sampleLaptop,
      isLoading: false,
      isError: false,
    });

    renderProductRoute('/products/asus-zenbook-14?memory=32%20GB');
    expect(screen.getByRole('button', { name: /^24/, pressed: true })).toHaveTextContent(
      '3,437 EGP',
    );

    await userEvent.click(screen.getByRole('button', { name: /^12/ }));

    expect(screen.getByRole('button', { name: /^12/, pressed: true })).toHaveTextContent(
      '6,875 EGP',
    );
    expect(screen.getAllByText('6,875 EGP')).toHaveLength(2);
  });

  it('switches between the specifications, the box and the reviews', async () => {
    vi.mocked(useGetProductQuery).mockReturnValue({
      data: sampleLaptop,
      isLoading: false,
      isError: false,
    });

    renderProductRoute('/products/asus-zenbook-14');
    expect(screen.getByText('1.2 kg')).toBeInTheDocument();
    expect(screen.queryByText('GPU VRAM')).not.toBeInTheDocument();
    expect(useGetReviewsQuery).not.toHaveBeenCalled();

    await userEvent.click(screen.getByRole('tab', { name: 'In the box' }));
    expect(screen.getByText('65 W power adapter')).toBeInTheDocument();

    await userEvent.click(screen.getByRole('tab', { name: 'Reviews (5)' }));
    expect(screen.getByText('Great screen')).toBeInTheDocument();
  });

  it('adds configured item and navigates to checkout on Buy now', async () => {
    vi.mocked(useGetProductQuery).mockReturnValue({
      data: sampleLaptop,
      isLoading: false,
      isError: false,
    });

    const { store } = renderProductRoute('/products/asus-zenbook-14?memory=32%20GB');

    await userEvent.click(screen.getByRole('button', { name: 'Buy now' }));

    expect(selectCartItems(store.getState())).toHaveLength(1);
    expect(screen.getByTestId('location').textContent).toBe('/checkout');
  });
});
