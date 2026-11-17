import { describe, it, expect } from 'vitest';

import { toApiParams, PAGE_SIZE } from './catalogParams';

describe('toApiParams', () => {
  it('returns default pagination and undefined filters for an empty URL', () => {
    const params = new URLSearchParams('');
    expect(toApiParams(params)).toEqual({
      q: undefined,
      brand: undefined,
      'specs.ram': undefined,
      price_gte: undefined,
      price_lte: undefined,
      rating_gte: undefined,
      stock_gte: undefined,
      _page: 1,
      _limit: PAGE_SIZE,
    });
  });

  it('maps multiple filters (brand, ram, min, max, inStock, rating, q) correctly', () => {
    const params = new URLSearchParams(
      'q=rog&brand=ASUS&brand=Lenovo&ram=16&ram=32&min=20000&max=50000&rating=4&inStock=true',
    );

    expect(toApiParams(params)).toEqual({
      q: 'rog',
      brand: ['ASUS', 'Lenovo'],
      'specs.ram': [16, 32],
      price_gte: 20000,
      price_lte: 50000,
      rating_gte: 4,
      stock_gte: 1,
      _page: 1,
      _limit: 9,
    });
  });

  it('maps sort options to json-server _sort and _order parameters', () => {
    expect(toApiParams(new URLSearchParams('sort=price-asc'))).toMatchObject({
      _sort: 'price',
      _order: 'asc',
    });

    expect(toApiParams(new URLSearchParams('sort=price-desc'))).toMatchObject({
      _sort: 'price',
      _order: 'desc',
    });

    expect(toApiParams(new URLSearchParams('sort=rating'))).toMatchObject({
      _sort: 'rating',
      _order: 'desc',
    });

    expect(toApiParams(new URLSearchParams('sort=newest'))).toMatchObject({
      _sort: 'createdAt',
      _order: 'desc',
    });
  });

  it('keeps _page at 1 and multiplies _limit by 9 on page 3 for cumulative load more', () => {
    const params = new URLSearchParams('page=3');
    const result = toApiParams(params);

    expect(result._page).toBe(1);
    expect(result._limit).toBe(27);
  });
});
