import { useSearchParams } from 'react-router-dom';

import { currentPage } from '../model/catalogParams';
import { FILTER_KEYS, MULTI_FILTERS } from '../model/filterOptions';

/** Reads and writes the catalog filters, sort and page in the URL. */
export function useCatalogFilters() {
  const [searchParams, setSearchParams] = useSearchParams();

  const filters = {
    ...Object.fromEntries(MULTI_FILTERS.map(({ key }) => [key, searchParams.getAll(key)])),
    min: searchParams.get('min') ?? '',
    max: searchParams.get('max') ?? '',
    rating: searchParams.get('rating') ?? '',
    inStock: searchParams.get('inStock') === '1' || searchParams.get('inStock') === 'true',
    sort: searchParams.get('sort') ?? 'featured',
  };

  const updateParams = (mutate, page = 1) => {
    const next = new URLSearchParams(searchParams);
    mutate(next);
    next.set('page', String(page));
    setSearchParams(next, { preventScrollReset: true });
  };

  const setParam = (params, key, value) => {
    if (value) params.set(key, value);
    else params.delete(key);
  };

  return {
    filters,
    activeCount: FILTER_KEYS.reduce(
      (count, key) =>
        count + (Array.isArray(filters[key]) ? filters[key].length : Number(Boolean(filters[key]))),
      0,
    ),
    setMultiFilter: (key, values) =>
      updateParams((params) => {
        params.delete(key);
        values.forEach((value) => params.append(key, value));
      }),
    setSingleFilter: (key, value) => updateParams((params) => setParam(params, key, value)),
    setPriceRange: (min, max) =>
      updateParams((params) => {
        setParam(params, 'min', min.trim());
        setParam(params, 'max', max.trim());
      }),
    setSort: (sort) =>
      updateParams((params) => setParam(params, 'sort', sort === 'featured' ? '' : sort)),
    clearFilters: () => updateParams((params) => FILTER_KEYS.forEach((key) => params.delete(key))),
    loadMore: () => updateParams(() => {}, currentPage(searchParams) + 1),
  };
}
