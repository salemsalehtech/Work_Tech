import { act, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { renderWithProviders } from '@/test/renderWithProviders';
import { cartReducer } from '@features/cart';
import { useGetProductsByIdsQuery } from '@features/catalog';
import { compareReducer } from '@features/compare';
import { wishlistReducer } from '@features/wishlist';
import i18n from '@services/i18n';
import { PATHS } from '@shared/constants';

import Wishlist from './index';

vi.mock('@features/catalog', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useGetProductsByIdsQuery: vi.fn(),
  };
});

const MOCK_PRODUCTS = [
  {
    id: 'laptop-1',
    brand: 'Lenovo',
    name: 'Lenovo Legion Pro 5',
    price: 27000,
    oldPrice: 32000,
    images: ['https://example.com/legion.jpg'],
    rating: 4.8,
    reviewsCount: 32,
    stock: 5,
    valueScore: 9.2,
    specs: {
      cpu: 'Intel Core i7-13700HX',
      ram: '16GB DDR5',
      storage: '1TB SSD',
      gpu: 'RTX 4060',
      screen: '16" WQXGA 165Hz',
    },
  },
  {
    id: 'laptop-2',
    brand: 'ASUS',
    name: 'ASUS ROG Zephyrus G14',
    price: 45000,
    oldPrice: null,
    images: ['https://example.com/rog.jpg'],
    rating: 4.7,
    reviewsCount: 19,
    stock: 3,
    valueScore: 8.9,
    specs: {
      cpu: 'AMD Ryzen 9 7940HS',
      ram: '32GB DDR5',
      storage: '1TB SSD',
      gpu: 'RTX 4070',
      screen: '14" QHD 165Hz',
    },
  },
  {
    id: 'laptop-3',
    brand: 'Apple',
    name: 'MacBook Air M2',
    price: 52000,
    oldPrice: null,
    images: ['https://example.com/macbook.jpg'],
    rating: 4.9,
    reviewsCount: 45,
    stock: 8,
    valueScore: 9.0,
    specs: {
      cpu: 'Apple M2',
      ram: '16GB Unified',
      storage: '512GB SSD',
      gpu: '10-Core GPU',
      screen: '13.6" Liquid Retina',
    },
  },
];

function renderWishlistPage(initialItems = [], initialRoute = PATHS.WISHLIST) {
  return renderWithProviders(
    <Routes>
      <Route path={PATHS.WISHLIST} element={<Wishlist />} />
      <Route
        path={PATHS.PRODUCTS}
        element={<div data-testid="products-page">Products Catalog</div>}
      />
      <Route path={PATHS.HOME} element={<div data-testid="home-page">Home Page</div>} />
    </Routes>,
    {
      reducer: {
        wishlist: wishlistReducer,
        compare: compareReducer,
        cart: cartReducer,
      },
      preloadedState: {
        wishlist: {
          items: initialItems,
        },
      },
      route: initialRoute,
    },
  );
}

describe('Wishlist Page (AB-07)', () => {
  beforeEach(async () => {
    vi.clearAllMocks();
    await act(async () => {
      await i18n.changeLanguage('en');
    });
  });

  describe('Requirement 1: Fetching saved products', () => {
    it('retrieves saved product IDs from Redux state and passes them to useGetProductsByIdsQuery', () => {
      useGetProductsByIdsQuery.mockReturnValue({
        data: [MOCK_PRODUCTS[0], MOCK_PRODUCTS[1]],
        isLoading: false,
        isError: false,
      });

      renderWishlistPage([
        {
          productId: 'laptop-1',
          savedPrice: 30000,
          savedAt: '2026-10-01T10:00:00Z',
          priceAlert: null,
        },
        {
          productId: 'laptop-2',
          savedPrice: 45000,
          savedAt: '2026-10-02T10:00:00Z',
          priceAlert: null,
        },
      ]);

      expect(useGetProductsByIdsQuery).toHaveBeenCalledWith(['laptop-1', 'laptop-2'], {
        skip: false,
      });
      expect(screen.getByText('Lenovo Legion Pro 5')).toBeInTheDocument();
      expect(screen.getByText('ASUS ROG Zephyrus G14')).toBeInTheDocument();
    });

    it('skips the query when wishlist is empty and does NOT trigger products API request', () => {
      useGetProductsByIdsQuery.mockReturnValue({
        data: undefined,
        isLoading: false,
        isError: false,
      });

      renderWishlistPage([]);

      expect(useGetProductsByIdsQuery).toHaveBeenCalledWith([], {
        skip: true,
      });
      expect(screen.getByTestId('wishlist-empty-state')).toBeInTheDocument();
      expect(screen.queryByTestId('wishlist-grid')).not.toBeInTheDocument();
    });
  });

  describe('Requirement 2: Price drop notifications', () => {
    it('displays price reduction message when currentPrice < savedPrice', () => {
      useGetProductsByIdsQuery.mockReturnValue({
        data: [MOCK_PRODUCTS[0]], // price is 27,000, savedPrice is 30,000 -> dropped by 3,000
        isLoading: false,
        isError: false,
      });

      renderWishlistPage([
        {
          productId: 'laptop-1',
          savedPrice: 30000,
          savedAt: '2026-10-01T10:00:00Z',
          priceAlert: null,
        },
      ]);

      const priceDropEl = screen.getByTestId('price-drop-laptop-1');
      expect(priceDropEl).toBeInTheDocument();
      // Drop amount: 30,000 - 27,000 = 3,000 EGP
      expect(within(priceDropEl).getByText(/Price dropped by 3,000 EGP/i)).toBeInTheDocument();
      expect(within(priceDropEl).getByText(/Saved at 30,000 EGP/i)).toBeInTheDocument();
    });

    it('does NOT display price drop message when currentPrice is equal to savedPrice', () => {
      useGetProductsByIdsQuery.mockReturnValue({
        data: [MOCK_PRODUCTS[1]], // price is 45,000, savedPrice is 45,000
        isLoading: false,
        isError: false,
      });

      renderWishlistPage([
        {
          productId: 'laptop-2',
          savedPrice: 45000,
          savedAt: '2026-10-02T10:00:00Z',
          priceAlert: null,
        },
      ]);

      expect(screen.queryByTestId('price-drop-laptop-2')).not.toBeInTheDocument();
    });

    it('does NOT display price drop message when price has increased', () => {
      useGetProductsByIdsQuery.mockReturnValue({
        data: [MOCK_PRODUCTS[2]], // price is 52,000, savedPrice was 50,000
        isLoading: false,
        isError: false,
      });

      renderWishlistPage([
        {
          productId: 'laptop-3',
          savedPrice: 50000,
          savedAt: '2026-10-03T10:00:00Z',
          priceAlert: null,
        },
      ]);

      expect(screen.queryByTestId('price-drop-laptop-3')).not.toBeInTheDocument();
    });

    it('handles missing or zero savedPrice safely without showing price drop', () => {
      useGetProductsByIdsQuery.mockReturnValue({
        data: [MOCK_PRODUCTS[0]],
        isLoading: false,
        isError: false,
      });

      renderWishlistPage([
        { productId: 'laptop-1', savedPrice: 0, savedAt: '2026-10-01T10:00:00Z', priceAlert: null },
      ]);

      expect(screen.queryByTestId('price-drop-laptop-1')).not.toBeInTheDocument();
    });
  });

  describe('Requirement 3: Price alert toggle', () => {
    it('renders independent price alert toggle for each product with correct initial state', () => {
      useGetProductsByIdsQuery.mockReturnValue({
        data: [MOCK_PRODUCTS[0], MOCK_PRODUCTS[1]],
        isLoading: false,
        isError: false,
      });

      renderWishlistPage([
        {
          productId: 'laptop-1',
          savedPrice: 30000,
          savedAt: '2026-10-01T10:00:00Z',
          priceAlert: 27000,
        },
        {
          productId: 'laptop-2',
          savedPrice: 45000,
          savedAt: '2026-10-02T10:00:00Z',
          priceAlert: null,
        },
      ]);

      const card1 = screen.getByTestId('wishlist-card-laptop-1');
      const card2 = screen.getByTestId('wishlist-card-laptop-2');
      const toggle1 = within(card1).getByRole('switch');
      const toggle2 = within(card2).getByRole('switch');

      expect(toggle1).toBeChecked();
      expect(toggle2).not.toBeChecked();

      expect(screen.getByTestId('alert-status-laptop-1')).toHaveTextContent(/alert active/i);
      expect(screen.getByTestId('alert-status-laptop-2')).toHaveTextContent(/alert off/i);
    });

    it('toggling an alert updates only that specific product in Redux store', async () => {
      const user = userEvent.setup();
      useGetProductsByIdsQuery.mockReturnValue({
        data: [MOCK_PRODUCTS[0], MOCK_PRODUCTS[1]],
        isLoading: false,
        isError: false,
      });

      const { store } = renderWishlistPage([
        {
          productId: 'laptop-1',
          savedPrice: 30000,
          savedAt: '2026-10-01T10:00:00Z',
          priceAlert: null,
        },
        {
          productId: 'laptop-2',
          savedPrice: 45000,
          savedAt: '2026-10-02T10:00:00Z',
          priceAlert: 42000,
        },
      ]);

      const card1 = screen.getByTestId('wishlist-card-laptop-1');
      const toggle1 = within(card1).getByRole('switch');

      await user.click(toggle1);

      const items = store.getState().wishlist.items;
      expect(items.find((i) => i.productId === 'laptop-1').priceAlert).toBeTruthy();
      // laptop-2 alert remains unchanged
      expect(items.find((i) => i.productId === 'laptop-2').priceAlert).toBe(42000);
    });

    it('toggling an enabled alert off sets priceAlert to null', async () => {
      const user = userEvent.setup();
      useGetProductsByIdsQuery.mockReturnValue({
        data: [MOCK_PRODUCTS[1]],
        isLoading: false,
        isError: false,
      });

      const { store } = renderWishlistPage([
        {
          productId: 'laptop-2',
          savedPrice: 45000,
          savedAt: '2026-10-02T10:00:00Z',
          priceAlert: 42000,
        },
      ]);

      const card2 = screen.getByTestId('wishlist-card-laptop-2');
      const toggle2 = within(card2).getByRole('switch');
      expect(toggle2).toBeChecked();

      await user.click(toggle2);

      const items = store.getState().wishlist.items;
      expect(items.find((i) => i.productId === 'laptop-2').priceAlert).toBeNull();
    });
  });

  describe('Requirement 4: Empty wishlist state', () => {
    it('renders shared EmptyState with action button navigating to catalog', async () => {
      const user = userEvent.setup();
      useGetProductsByIdsQuery.mockReturnValue({
        data: undefined,
        isLoading: false,
        isError: false,
      });

      renderWishlistPage([]);

      expect(
        screen.getByRole('heading', { level: 2, name: /your wishlist is empty/i }),
      ).toBeInTheDocument();
      expect(
        screen.getByText(/you haven't saved any laptops to your wishlist yet/i),
      ).toBeInTheDocument();

      const exploreBtn = screen.getByTestId('explore-catalog-btn');
      expect(exploreBtn).toBeInTheDocument();
      expect(exploreBtn).toHaveAttribute('href', PATHS.PRODUCTS);

      await user.click(exploreBtn);
      expect(screen.getByTestId('products-page')).toBeInTheDocument();
    });
  });

  describe('Requirement 5: Product removal & useProductCardActions integration', () => {
    it('removes product from wishlist when favorite icon is clicked', async () => {
      const user = userEvent.setup();
      useGetProductsByIdsQuery.mockReturnValue({
        data: [MOCK_PRODUCTS[0]],
        isLoading: false,
        isError: false,
      });

      const { store } = renderWishlistPage([
        {
          productId: 'laptop-1',
          savedPrice: 30000,
          savedAt: '2026-10-01T10:00:00Z',
          priceAlert: null,
        },
      ]);

      const card = screen.getByTestId('wishlist-card-laptop-1');
      const heartBtn = within(card).getByRole('button', { name: /save to wishlist/i });
      expect(heartBtn).toHaveAttribute('aria-pressed', 'true');

      await user.click(heartBtn);

      expect(store.getState().wishlist.items).toHaveLength(0);
    });

    it('clears all items when clear all button is clicked', async () => {
      const user = userEvent.setup();
      useGetProductsByIdsQuery.mockReturnValue({
        data: [MOCK_PRODUCTS[0], MOCK_PRODUCTS[1]],
        isLoading: false,
        isError: false,
      });

      const { store } = renderWishlistPage([
        {
          productId: 'laptop-1',
          savedPrice: 30000,
          savedAt: '2026-10-01T10:00:00Z',
          priceAlert: null,
        },
        {
          productId: 'laptop-2',
          savedPrice: 45000,
          savedAt: '2026-10-02T10:00:00Z',
          priceAlert: null,
        },
      ]);

      const clearBtn = screen.getByTestId('clear-wishlist-btn');
      await user.click(clearBtn);

      expect(store.getState().wishlist.items).toHaveLength(0);
    });
  });

  describe('Loading and Error states', () => {
    it('displays skeleton when products are loading', () => {
      useGetProductsByIdsQuery.mockReturnValue({
        data: undefined,
        isLoading: true,
        isError: false,
      });

      renderWishlistPage([
        {
          productId: 'laptop-1',
          savedPrice: 30000,
          savedAt: '2026-10-01T10:00:00Z',
          priceAlert: null,
        },
      ]);

      expect(screen.getByTestId('wishlist-skeleton')).toBeInTheDocument();
    });

    it('displays error state with retry button when query fails', async () => {
      const refetch = vi.fn();
      useGetProductsByIdsQuery.mockReturnValue({
        data: undefined,
        isLoading: false,
        isError: true,
        refetch,
      });

      renderWishlistPage([
        {
          productId: 'laptop-1',
          savedPrice: 30000,
          savedAt: '2026-10-01T10:00:00Z',
          priceAlert: null,
        },
      ]);

      const retryBtn = screen.getByRole('button', { name: /try again/i });
      expect(retryBtn).toBeInTheDocument();
    });

    it('handles saved product IDs missing from catalog without crashing', () => {
      useGetProductsByIdsQuery.mockReturnValue({
        data: [], // catalog returned empty list (products not found or deleted)
        isLoading: false,
        isError: false,
      });

      renderWishlistPage([
        {
          productId: 'deleted-laptop-id',
          savedPrice: 30000,
          savedAt: '2026-10-01T10:00:00Z',
          priceAlert: null,
        },
      ]);

      expect(
        screen.getByRole('heading', { level: 2, name: /your wishlist is empty/i }),
      ).toBeInTheDocument();
    });
  });

  describe('Arabic Localization & RTL', () => {
    it('renders price drop and empty state messages in Arabic', async () => {
      await act(async () => {
        await i18n.changeLanguage('ar');
      });

      useGetProductsByIdsQuery.mockReturnValue({
        data: [MOCK_PRODUCTS[0]], // savedPrice: 30,000, current: 27,000 -> drop of 3,000
        isLoading: false,
        isError: false,
      });

      renderWishlistPage([
        {
          productId: 'laptop-1',
          savedPrice: 30000,
          savedAt: '2026-10-01T10:00:00Z',
          priceAlert: null,
        },
      ]);

      // Checks Arabic price drop message "السعر نزل ٣٬٠٠٠ ج.م."
      const priceDropEl = screen.getByTestId('price-drop-laptop-1');
      expect(within(priceDropEl).getByText(/السعر نزل/i)).toBeInTheDocument();
      expect(within(priceDropEl).getByText(/٣[٬,]٠٠٠/)).toBeInTheDocument();
    });

    it('renders empty state in Arabic with Arabic catalog button', async () => {
      await act(async () => {
        await i18n.changeLanguage('ar');
      });

      useGetProductsByIdsQuery.mockReturnValue({
        data: undefined,
        isLoading: false,
        isError: false,
      });

      renderWishlistPage([]);

      expect(
        screen.getByRole('heading', { level: 2, name: /قائمة أمنياتك فارغة/i }),
      ).toBeInTheDocument();
      expect(screen.getByText(/تصفح أجهزة اللابتوب/i)).toBeInTheDocument();
    });
  });
});
