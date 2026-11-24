import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';

import {
  GridSkeleton,
  ProductCard,
  ProductFilters,
  ProductGrid,
  SORT_KEYS,
  toApiParams,
  useCatalogFilters,
  useGetProductsQuery,
  useProductCardActions,
} from '@features/catalog';
import { Button, Container, DataState, Drawer, EmptyState, Select } from '@shared/components/ui';

import styles from './Products.module.css';

function Products() {
  const { t } = useTranslation('catalog');
  const [searchParams, setSearchParams] = useSearchParams();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const result = useGetProductsQuery(toApiParams(searchParams));
  const cardProps = useProductCardActions();
  const {
    filters,
    activeCount,
    setMultiFilter,
    setSingleFilter,
    setPriceRange,
    setSort,
    clearFilters,
  } = useCatalogFilters();

  const sortOptions = SORT_KEYS.map((key) => ({
    value: key,
    label: t(`sort.${key}`),
  }));

  const handleLoadMore = () => {
    const rawPage = Math.floor(Number(searchParams.get('page') ?? 1));
    const currentPage = Number.isFinite(rawPage) && rawPage > 0 ? rawPage : 1;

    const nextParams = new URLSearchParams(searchParams);
    nextParams.set('page', String(currentPage + 1));
    setSearchParams(nextParams, { preventScrollReset: true });
  };

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
    <Container className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>{t('products.title')}</h1>

        <div className={styles.controls}>
          <div className={styles.mobileFilterBtn}>
            <Button variant="secondary" onClick={() => setDrawerOpen(true)}>
              {activeCount > 0
                ? t('filters.buttonCount', { count: activeCount })
                : t('filters.title')}
            </Button>
          </div>

          <Select
            aria-label={t('sort.label')}
            options={sortOptions}
            value={filters.sort}
            onChange={(e) => setSort(e.target.value)}
          />
        </div>
      </header>

      <div className={styles.layout}>
        <aside className={styles.sidebar}>{filterPanel}</aside>

        <div className={styles.main}>
          <DataState
            result={result}
            loading={<GridSkeleton />}
            empty={
              <EmptyState
                title={t('products.emptyTitle')}
                text={t('products.emptyText')}
                action={
                  activeCount > 0 && (
                    <Button variant="secondary" onClick={clearFilters}>
                      {t('filters.clearAll')}
                    </Button>
                  )
                }
              />
            }
          >
            {({ items, total }) => (
              <>
                <ProductGrid>
                  {items.map((product) => (
                    <ProductCard key={product.id} product={product} {...cardProps(product)} />
                  ))}
                </ProductGrid>

                <div className={styles.footer}>
                  <p className={styles.count}>
                    {t('products.showingCount', {
                      shown: items.length,
                      total,
                    })}
                  </p>

                  {items.length < total && (
                    <Button
                      variant="secondary"
                      onClick={handleLoadMore}
                      disabled={result.isFetching}
                    >
                      {t('products.loadMore')}
                    </Button>
                  )}
                </div>
              </>
            )}
          </DataState>
        </div>
      </div>

      <Drawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title={t('filters.title')}
        side="end"
      >
        {filterPanel}
      </Drawer>
    </Container>
  );
}

export default Products;
