import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useLocation } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { renderWithProviders } from '@/test/renderWithProviders';
import * as catalog from '@features/catalog';

import SearchResults from '.';

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

function LocationProbe() {
  const location = useLocation();
  return <output data-testid="location-search">{location.search}</output>;
}

describe('SearchResults page', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.spyOn(catalog, 'useProductCardActions').mockReturnValue(() => ({}));
  });

  it('queries with q from the URL and displays the matching heading and products', () => {
    const querySpy = vi.spyOn(catalog, 'useGetProductsQuery').mockReturnValue({
      data: { items: [rogLaptop], total: 1 },
      isLoading: false,
      isFetching: false,
      isError: false,
    });

    renderWithProviders(<SearchResults />, { route: '/search?q=rog' });

    expect(querySpy).toHaveBeenCalledWith(expect.objectContaining({ q: 'rog' }));
    expect(screen.getByRole('heading', { name: 'Results for “rog”' })).toBeInTheDocument();
    expect(screen.getByText('ASUS ROG Strix G16')).toBeInTheDocument();
  });

  it('shows EmptyState with search suggestions when no results match and updates q on click', async () => {
    vi.spyOn(catalog, 'useGetProductsQuery').mockReturnValue({
      data: { items: [], total: 0 },
      isLoading: false,
      isFetching: false,
      isError: false,
    });

    renderWithProviders(
      <>
        <SearchResults />
        <LocationProbe />
      </>,
      { route: '/search?q=unknown-laptop' },
    );

    expect(
      screen.getByRole('heading', { name: 'No results for “unknown-laptop”' }),
    ).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: 'ROG' }));

    const params = new URLSearchParams(screen.getByTestId('location-search').textContent);
    expect(params.get('q')).toBe('ROG');
    expect(params.get('page')).toBe('1');
  });
});
