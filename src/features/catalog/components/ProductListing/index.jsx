import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';

import { Button, DataState, Drawer, EmptyState, Select } from '@shared/components/ui';

import { toApiParams } from '../../../catalog/model/catalogParams';
import { useGetProductsQuery } from '../../api/catalogApi';
import { useCatalogFilters } from '../../hooks/useCatalogFilters';
import { useProductCardActions } from '../../hooks/useProductCardActions';
import { SORT_KEYS } from '../../model/filterOptions';
import ProductCard from '../ProductCard';
import ProductFilters from '../ProductFilters';
import { GridSkeleton, ProductGrid } from '../ProductGrid';

import styles from './ProductListing.module.css';

/** The laptops of the current URL with sort, filters and load more. Used by Products and Search. */
function ProductListing({ title, emptyTitle, emptyText, emptyAction }) {
  const { t } = useTranslation('catalog');
  const [searchParams] = useSearchParams();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const result = useGetProductsQuery(toApiParams(searchParams));
  const actionsOf = useProductCardActions();
  const {
    filters,
    activeCount,
    setMultiFilter,
    setSingleFilter,
    setPriceRange,
    setSort,
    clearFilters,
    loadMore,
  } = useCatalogFilters();

  const filterPanel = (
    <ProductFilters
      filters={filters}
      activeCount={activeCount}
      onMultiChange={setMultiFilter}
      onSingleChange={setSingleFilter}
      onPriceChange={setPriceRange}
      onClearAll={clearFilters}
    />
  );

  return (
    <>
      <header className={styles.header}>
        <h1 className={styles.title}>{title}</h1>

        <div className={styles.controls}>
          <Button
            variant="outline"
            className={styles.filtersButton}
            onClick={() => setDrawerOpen(true)}
          >
            {activeCount > 0
              ? t('filters.buttonCount', { count: activeCount })
              : t('filters.title')}
          </Button>
          <Select
            aria-label={t('sort.label')}
            options={SORT_KEYS.map((key) => ({ value: key, label: t(`sort.${key}`) }))}
            value={filters.sort}
            onChange={(event) => setSort(event.target.value)}
          />
        </div>
      </header>

      <div className={styles.layout}>
        <aside className={styles.sidebar} aria-label={t('filters.title')}>
          {filterPanel}
        </aside>

        <div className={styles.main}>
          <DataState
            result={result}
            loading={<GridSkeleton />}
            empty={
              <EmptyState
                title={emptyTitle}
                text={emptyText}
                action={
                  <>
                    {emptyAction}
                    {activeCount > 0 && (
                      <Button variant="outline" onClick={clearFilters}>
                        {t('filters.clearAll')}
                      </Button>
                    )}
                  </>
                }
              />
            }
          >
            {({ items, total }) => (
              <ProductGrid
                shown={items.length}
                total={total}
                onLoadMore={loadMore}
                isLoadingMore={result.isFetching}
              >
                {items.map((product) => (
                  <ProductCard key={product.id} product={product} {...actionsOf(product)} />
                ))}
              </ProductGrid>
            )}
          </DataState>
        </div>
      </div>

      <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)} title={t('filters.title')}>
        {filterPanel}
      </Drawer>
    </>
  );
}

export default ProductListing;
