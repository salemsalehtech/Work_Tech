import { useSearchParams } from 'react-router-dom';

import { FILTER_KEYS } from '../model/filterOptions';

export function useCatalogFilters() {
  const [searchParams, setSearchParams] = useSearchParams();

  const filters = {
    brands: searchParams.getAll('brand'),
    rams: searchParams.getAll('ram'),
    min: searchParams.get('min') ?? '',
    max: searchParams.get('max') ?? '',
    rating: searchParams.get('rating') ?? '',
    inStock: searchParams.get('inStock') === '1' || searchParams.get('inStock') === 'true',
    sort: searchParams.get('sort') ?? 'featured',
  };

  const updateParams = (mutate) => {
    const next = new URLSearchParams(searchParams);
    mutate(next);
    next.set('page', '1');
    setSearchParams(next);
  };

  const setMultiFilter = (key, values) => {
    updateParams((next) => {
      next.delete(key);
      values.forEach((val) => next.append(key, val));
    });
  };

  const setSingleFilter = (key, value) => {
    updateParams((next) => {
      if (value) next.set(key, value);
      else next.delete(key);
    });
  };

  const setPriceRange = (min, max) => {
    updateParams((next) => {
      if (min.trim()) next.set('min', min.trim());
      else next.delete('min');

      if (max.trim()) next.set('max', max.trim());
      else next.delete('max');
    });
  };

  const setSort = (sortValue) => {
    updateParams((next) => {
      if (sortValue && sortValue !== 'featured') next.set('sort', sortValue);
      else next.delete('sort');
    });
  };

  const clearFilters = () => {
    updateParams((next) => {
      FILTER_KEYS.forEach((key) => next.delete(key));
    });
  };

  const activeCount =
    filters.brands.length +
    filters.rams.length +
    (filters.min ? 1 : 0) +
    (filters.max ? 1 : 0) +
    (filters.rating ? 1 : 0) +
    (filters.inStock ? 1 : 0);

  return {
    filters,
    activeCount,
    setMultiFilter,
    setSingleFilter,
    setPriceRange,
    setSort,
    clearFilters,
  };
}
