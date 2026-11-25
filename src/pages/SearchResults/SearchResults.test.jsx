import { screen } from '@testing-library/react';

import { renderWithProviders } from '@/test/renderWithProviders';
import { cartReducer } from '@features/cart';
import { useGetProductsQuery } from '@features/catalog';
import { compareReducer } from '@features/compare';
import { wishlistReducer } from '@features/wishlist';

import SearchResults from '.';

vi.mock('../../features/catalog/api/catalogApi', () => ({
  catalogApi: {},
  useGetProductsQuery: vi.fn(),
}));

const rogLaptop = {
  id: 'asus-rog-strix-g16',
  brand: 'ASUS',
  name: 'ASUS ROG Strix G16',
  price: 84999,
  oldPrice: null,
  images: [],
  rating: 4.5,
  reviewsCount: 12,
  stock: 4,
  valueScore: 85,
  tags: ['gaming'],
  specs: { cpu: 'AMD Ryzen 9 8940HX', ram: 16, storage: 512, gpu: 'NVIDIA GeForce RTX 5050' },
};

function renderSearch(route, { items, total }) {
  useGetProductsQuery.mockReturnValue({ data: { items, total }, isLoading: false });
  return renderWithProviders(<SearchResults />, {
    route,
    reducer: { cart: cartReducer, compare: compareReducer, wishlist: wishlistReducer },
  });
}

it('searches for the query in the URL', () => {
  renderSearch('/search?q=rog', { items: [rogLaptop], total: 1 });

  expect(useGetProductsQuery).toHaveBeenCalledWith(expect.objectContaining({ q: 'rog' }));
  expect(screen.getByRole('heading', { name: 'Results for “rog”' })).toBeInTheDocument();
  expect(screen.getByRole('link', { name: 'ASUS ROG Strix G16' })).toBeInTheDocument();
});

it('suggests popular searches when nothing matches', () => {
  renderSearch('/search?q=unknown-laptop', { items: [], total: 0 });

  expect(
    screen.getByRole('heading', { name: 'No results for “unknown-laptop”' }),
  ).toBeInTheDocument();
  expect(screen.getByRole('link', { name: 'ROG' })).toHaveAttribute('href', '/search?q=ROG');
});

it('shows load more only while there are more laptops', () => {
  const { unmount } = renderSearch('/search?q=rog', { items: [rogLaptop], total: 2 });
  expect(screen.getByRole('button', { name: 'Load more laptops' })).toBeInTheDocument();
  unmount();

  renderSearch('/search?q=rog', { items: [rogLaptop], total: 1 });
  expect(screen.queryByRole('button', { name: 'Load more laptops' })).not.toBeInTheDocument();
});
