import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useLocation } from 'react-router-dom';
import { describe, expect, it } from 'vitest';

import { renderWithProviders } from '@/test/renderWithProviders';

import { useCatalogFilters } from '../../hooks/useCatalogFilters';

import ProductFilters from '.';

function FilterHarness() {
  const location = useLocation();
  const { filters, activeCount, setMultiFilter, setSingleFilter, setPriceRange, clearFilters } =
    useCatalogFilters();

  return (
    <>
      <output data-testid="search">{location.search}</output>
      <ProductFilters
        filters={filters}
        activeCount={activeCount}
        onMultiChange={setMultiFilter}
        onSingleChange={setSingleFilter}
        onPriceChange={setPriceRange}
        onClearAll={clearFilters}
      />
    </>
  );
}

describe('ProductFilters & useCatalogFilters', () => {
  it('updates brand filter in the URL and resets page to 1', async () => {
    renderWithProviders(<FilterHarness />, { route: '/products?page=3' });

    await userEvent.click(screen.getByRole('checkbox', { name: 'ASUS' }));

    const params = new URLSearchParams(screen.getByTestId('search').textContent);
    expect(params.getAll('brand')).toEqual(['ASUS']);
    expect(params.get('page')).toBe('1');
  });

  it('writes the processor, graphics and screen filters to the URL', async () => {
    renderWithProviders(<FilterHarness />, { route: '/products' });

    await userEvent.click(screen.getByRole('checkbox', { name: 'AMD' }));
    await userEvent.click(screen.getByRole('checkbox', { name: 'RTX 40 series' }));
    await userEvent.click(screen.getByRole('checkbox', { name: '16″' }));

    const params = new URLSearchParams(screen.getByTestId('search').textContent);
    expect(params.getAll('cpu')).toEqual(['amd']);
    expect(params.getAll('gpu')).toEqual(['rtx-40']);
    expect(params.getAll('screen')).toEqual(['16']);
  });

  it('clears all active filters when Clear all is clicked', async () => {
    renderWithProviders(<FilterHarness />, {
      route: '/products?brand=ASUS&ram=16&inStock=1&page=2',
    });

    await userEvent.click(screen.getByRole('button', { name: 'Clear all' }));

    const params = new URLSearchParams(screen.getByTestId('search').textContent);
    expect(params.getAll('brand')).toEqual([]);
    expect(params.getAll('ram')).toEqual([]);
    expect(params.get('inStock')).toBeNull();
    expect(params.get('page')).toBe('1');
  });
});
