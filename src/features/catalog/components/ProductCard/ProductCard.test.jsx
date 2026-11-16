import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { renderWithProviders } from '@/test/renderWithProviders';

import ProductCard from '.';

const product = {
  id: 'asus-tuf-f16',
  brand: 'ASUS',
  name: 'TUF Gaming F16',
  price: 38990,
  oldPrice: 45990,
  images: [],
  rating: 4.5,
  reviewsCount: 198,
  stock: 3,
  valueScore: 88,
  specs: { cpu: 'Intel Core 5 210H', ram: 16, storage: 512, gpu: 'NVIDIA GeForce RTX 3050' },
};

it('shows the discount, the price, the installment and the low-stock note', () => {
  renderWithProviders(<ProductCard product={product} />);

  expect(screen.getByRole('link', { name: 'TUF Gaming F16' })).toHaveAttribute(
    'href',
    '/products/asus-tuf-f16',
  );
  expect(screen.getByText('−15%')).toBeInTheDocument();
  expect(screen.getByText('38,990 EGP')).toBeInTheDocument();
  expect(screen.getByText('1,625 EGP')).toBeInTheDocument();
  expect(screen.getByText('Only 3 left')).toBeInTheDocument();
  expect(screen.getByText('Core 5 210H · 16GB · 512GB SSD · RTX 3050')).toBeInTheDocument();
});

it('reports clicks to the caller', async () => {
  const onAddToCart = vi.fn();
  const onToggleCompare = vi.fn();
  renderWithProviders(
    <ProductCard product={product} onAddToCart={onAddToCart} onToggleCompare={onToggleCompare} />,
  );

  await userEvent.click(screen.getByRole('button', { name: 'Add to cart' }));
  await userEvent.click(screen.getByRole('button', { name: 'Add to comparison' }));

  expect(onAddToCart).toHaveBeenCalledOnce();
  expect(onToggleCompare).toHaveBeenCalledOnce();
});

it('cannot be added to the cart when out of stock (BR-08)', () => {
  renderWithProviders(<ProductCard product={{ ...product, stock: 0 }} />);

  expect(screen.getByRole('button', { name: 'Out of stock' })).toBeDisabled();
});
