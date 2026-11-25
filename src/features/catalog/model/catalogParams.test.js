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

  it('maps processor, graphics and screen to patterns json-server can match', () => {
    expect(toApiParams('cpu=amd&gpu=rtx-40&gpu=rtx-50&screen=13&screen=99')).toMatchObject({
      'specs.cpu_like': ['AMD|Ryzen'],
      'specs.gpu_like': ['RTX 40', 'RTX 50'],
      'specs.screen_like': ['^1[34]'],
    });
  });

  it.each([
    ['gaming', { tags_like: 'gaming' }],
    ['two-in-one', { tags_like: '2-in-1' }],
    ['deals', { oldPrice_gte: 1 }],
  ])('maps the %s category', (category, expected) => {
    expect(toApiParams(`category=${category}`)).toMatchObject(expected);
  });

  it('keeps the lower of the category price limit and the chosen one', () => {
    expect(toApiParams('category=under-30000').price_lte).toBe(30000);
    expect(toApiParams('category=under-30000&max=25000').price_lte).toBe(25000);
    expect(toApiParams('category=under-30000&max=90000').price_lte).toBe(30000);
  });

  it('ignores a category that does not exist', () => {
    expect(toApiParams('category=phones')).toEqual(toApiParams(''));
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

  it('accepts a raw query string, trims q and brand values, and supports inStock=1', () => {
    const result = toApiParams('q=  legion pro  &brand= Lenovo &brand=   &inStock=1&min=0');

    expect(result.q).toBe('legion pro');
    expect(result.brand).toEqual(['Lenovo']);
    expect(result.stock_gte).toBe(1);
    expect(result.price_gte).toBe(0);
  });

  it('does not include _sort or _order for featured or unknown sort values', () => {
    const featuredResult = toApiParams('sort=featured');
    expect(featuredResult._sort).toBeUndefined();
    expect(featuredResult._order).toBeUndefined();

    const unknownResult = toApiParams('sort=invalid-sort');
    expect(unknownResult._sort).toBeUndefined();
    expect(unknownResult._order).toBeUndefined();
  });

  it('sanitizes non-numeric, negative, and fractional values in min, max, rating, ram, and page', () => {
    const invalidNums = toApiParams(
      'min=abc&max=-500&rating=-1&ram=-8&ram=0&ram=abc&ram=16&page=2.8',
    );

    expect(invalidNums.price_gte).toBeUndefined();
    expect(invalidNums.price_lte).toBeUndefined();
    expect(invalidNums.rating_gte).toBeUndefined();
    expect(invalidNums['specs.ram']).toEqual([16]);
    expect(invalidNums._page).toBe(1);
    expect(invalidNums._limit).toBe(18);
  });

  it('falls back to page 1 (_limit = 9) when page is 0, negative, or non-numeric', () => {
    expect(toApiParams('page=0')._limit).toBe(PAGE_SIZE);
    expect(toApiParams('page=-3')._limit).toBe(PAGE_SIZE);
    expect(toApiParams('page=abc')._limit).toBe(PAGE_SIZE);
    expect(toApiParams('page=0.9')._limit).toBe(PAGE_SIZE);
  });
});
