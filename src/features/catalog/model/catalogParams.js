export const PAGE_SIZE = 9;

export const SORTS = {
  featured: {},
  'price-asc': { _sort: 'price', _order: 'asc' },
  'price-desc': { _sort: 'price', _order: 'desc' },
  rating: { _sort: 'rating', _order: 'desc' },
  newest: { _sort: 'createdAt', _order: 'desc' },
};

/**
 * @param {string | null} value
 * @returns {number | undefined}
 */
function parseNonNegativeNumber(value) {
  if (value === null || value.trim() === '') return undefined;
  const num = Number(value);
  return Number.isFinite(num) && num >= 0 ? num : undefined;
}

/**
 * @param {URLSearchParams | string} input
 */
export function toApiParams(input) {
  const searchParams = input instanceof URLSearchParams ? input : new URLSearchParams(input);

  const rawPage = Math.floor(Number(searchParams.get('page') ?? 1));
  const page = Number.isFinite(rawPage) && rawPage > 0 ? rawPage : 1;

  const brands = searchParams
    .getAll('brand')
    .map((b) => b.trim())
    .filter(Boolean);

  const rams = searchParams
    .getAll('ram')
    .map((r) => (r.trim() === '' ? NaN : Number(r)))
    .filter((n) => Number.isFinite(n) && n > 0);

  const inStock = searchParams.get('inStock');
  const sortKey = searchParams.get('sort') ?? 'featured';

  return {
    q: searchParams.get('q')?.trim() || undefined,
    brand: brands.length > 0 ? brands : undefined,
    'specs.ram': rams.length > 0 ? rams : undefined,
    price_gte: parseNonNegativeNumber(searchParams.get('min')),
    price_lte: parseNonNegativeNumber(searchParams.get('max')),
    rating_gte: parseNonNegativeNumber(searchParams.get('rating')),
    stock_gte: inStock === 'true' || inStock === '1' ? 1 : undefined,
    ...(SORTS[sortKey] ?? SORTS.featured),
    _page: 1,
    _limit: PAGE_SIZE * page,
  };
}
