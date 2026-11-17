export const PAGE_SIZE = 9;

export const SORTS = {
  featured: {},
  'price-asc': { _sort: 'price', _order: 'asc' },
  'price-desc': { _sort: 'price', _order: 'desc' },
  rating: { _sort: 'rating', _order: 'desc' },
  newest: { _sort: 'createdAt', _order: 'desc' },
};

/**
  @param {URLSearchParams | string} input
*/
export function toApiParams(input) {
  const searchParams = input instanceof URLSearchParams ? input : new URLSearchParams(input);

  const rawPage = Number(searchParams.get('page') ?? 1);
  const page = Number.isFinite(rawPage) && rawPage > 0 ? rawPage : 1;

  const brands = searchParams.getAll('brand').filter(Boolean);
  const rams = searchParams.getAll('ram').map(Number).filter(Boolean);

  const min = searchParams.get('min');
  const max = searchParams.get('max');
  const rating = searchParams.get('rating');
  const inStock = searchParams.get('inStock');
  const sortKey = searchParams.get('sort') ?? 'featured';

  return {
    q: searchParams.get('q')?.trim() || undefined,
    brand: brands.length > 0 ? brands : undefined,
    'specs.ram': rams.length > 0 ? rams : undefined,
    price_gte: min ? Number(min) : undefined,
    price_lte: max ? Number(max) : undefined,
    rating_gte: rating ? Number(rating) : undefined,
    stock_gte: inStock === 'true' || inStock === '1' ? 1 : undefined,
    ...(SORTS[sortKey] ?? SORTS.featured),
    _page: 1,
    _limit: PAGE_SIZE * page,
  };
}
