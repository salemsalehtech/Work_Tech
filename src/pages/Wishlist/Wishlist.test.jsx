import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { renderWithProviders } from '@/test/renderWithProviders';
import { authReducer } from '@features/auth';
import { cartReducer } from '@features/cart';
import { useGetProductsByIdsQuery } from '@features/catalog';
import { compareReducer } from '@features/compare';
import { wishlistReducer } from '@features/wishlist';

import Wishlist from '.';

vi.mock('../../features/catalog/api/catalogApi', () => ({
  catalogApi: {},
  useGetProductsByIdsQuery: vi.fn(),
}));

const product = (id, price) => ({
  id,
  name: id,
  brand: 'ASUS',
  price,
  oldPrice: null,
  images: [],
  rating: 4.4,
  reviewsCount: 5,
  stock: 10,
  valueScore: 86,
  specs: { cpu: 'Intel Core Ultra 7 255H', ram: 16, storage: 512, gpu: 'Intel Arc' },
});
const saved = (productId, savedPrice) => ({
  productId,
  savedPrice,
  savedAt: '2026-11-08T10:00:00Z',
  priceAlert: false,
});

function renderWishlist(items, products) {
  useGetProductsByIdsQuery.mockReturnValue({ data: products, isLoading: false });
  return renderWithProviders(<Wishlist />, {
    route: '/wishlist',
    reducer: {
      auth: authReducer,
      cart: cartReducer,
      compare: compareReducer,
      wishlist: wishlistReducer,
    },
    preloadedState: { wishlist: { items } },
  });
}

it('does not ask the server when nothing is saved', () => {
  renderWishlist([], undefined);

  expect(useGetProductsByIdsQuery).toHaveBeenCalledWith([], { skip: true });
  expect(screen.getByRole('link', { name: 'Browse laptops' })).toBeInTheDocument();
});

it('shows the price drop only when the price is lower than the saved one', () => {
  renderWishlist(
    [saved('Zenbook', 80000), saved('Legion', 50000)],
    [product('Legion', 52000), product('Zenbook', 76999)],
  );

  expect(screen.getAllByText(/dropped/)).toHaveLength(1);
  expect(screen.getByText('Price dropped 3,001 EGP')).toBeInTheDocument();
});

it('turns the price alert on and off', async () => {
  const { store } = renderWishlist([saved('Zenbook', 80000)], [product('Zenbook', 76999)]);
  const alert = screen.getByRole('switch', { name: 'Price alert' });

  await userEvent.click(alert);
  expect(store.getState().wishlist.items[0].priceAlert).toBe(true);
  await userEvent.click(alert);
  expect(store.getState().wishlist.items[0].priceAlert).toBe(false);
});

it('removes a laptop at once', async () => {
  renderWishlist([saved('Zenbook', 80000)], [product('Zenbook', 76999)]);

  await userEvent.click(screen.getByRole('button', { name: 'Save to wishlist' }));

  expect(screen.queryByRole('article')).not.toBeInTheDocument();
});
