import { MULTI_FILTERS } from './filterOptions';

export const PAGE_SIZE = 9;

const SORTS = {
  featured: {},
  'price-asc': { _sort: 'price', _order: 'asc' },
  'price-desc': { _sort: 'price', _order: 'desc' },
  rating: { _sort: 'rating', _order: 'desc' },
  newest: { _sort: 'createdAt', _order: 'desc' },
};

function parseNonNegativeNumber(value) {
  if (value === null || value.trim() === '') return undefined;
  const number = Number(value);
  return Number.isFinite(number) && number >= 0 ? number : undefined;
}

/** The page in the URL, or 1 when it is missing or not a positive number. */
export function currentPage(searchParams) {
  const page = Math.floor(Number(searchParams.get('page') ?? 1));
  return Number.isFinite(page) && page > 0 ? page : 1;
}

/** What json-server should match for one filter; values that are not an option are dropped. */
function matchesOf({ key, options }, searchParams) {
  const values = searchParams.getAll(key).map((value) => value.trim());
  const matches = options
    .filter((option) => values.includes(option.value))
    .map((option) => option.match ?? option.value);
  return matches.length > 0 ? matches : undefined;
}

/**
 * Turns the catalog URL into json-server params.
 * "Load more" keeps _page at 1 and grows _limit, so the list stays whole.
 * @param {URLSearchParams | string} input
 */
export function toApiParams(input) {
  const searchParams = input instanceof URLSearchParams ? input : new URLSearchParams(input);
  const inStock = searchParams.get('inStock');

  return {
    q: searchParams.get('q')?.trim() || undefined,
    ...Object.fromEntries(
      MULTI_FILTERS.map((filter) => [filter.param, matchesOf(filter, searchParams)]),
    ),
    price_gte: parseNonNegativeNumber(searchParams.get('min')),
    price_lte: parseNonNegativeNumber(searchParams.get('max')),
    rating_gte: parseNonNegativeNumber(searchParams.get('rating')),
    stock_gte: inStock === 'true' || inStock === '1' ? 1 : undefined,
    ...SORTS[searchParams.get('sort')],
    _page: 1,
    _limit: PAGE_SIZE * currentPage(searchParams),
  };
}
