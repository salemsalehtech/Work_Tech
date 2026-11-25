import { screen } from '@testing-library/react';

import { renderWithProviders } from '@/test/renderWithProviders';

import CategoryNav from '.';

it('links every category to the catalog', () => {
  renderWithProviders(<CategoryNav />);

  expect(screen.getByRole('link', { name: 'All laptops' })).toHaveAttribute('href', '/products');
  expect(screen.getByRole('link', { name: 'Gaming' })).toHaveAttribute(
    'href',
    '/products?category=gaming',
  );
  expect(screen.queryByRole('link', { current: 'page' })).not.toBeInTheDocument();
});

it('marks the open category', () => {
  renderWithProviders(<CategoryNav />, { route: '/products?category=deals&sort=rating' });

  expect(screen.getByRole('link', { current: 'page' })).toHaveTextContent('Deals');
});
