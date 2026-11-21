import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';

import {
  GridSkeleton,
  ProductCard,
  ProductGrid,
  toApiParams,
  useGetProductsQuery,
  useProductCardActions,
} from '@features/catalog';
import { Button, Container, DataState, EmptyState } from '@shared/components/ui';

import styles from './Products.module.css';

function Products() {
  const { t } = useTranslation('catalog');
  const [searchParams, setSearchParams] = useSearchParams();

  const result = useGetProductsQuery(toApiParams(searchParams));
  const cardProps = useProductCardActions();

  const handleLoadMore = () => {
    const rawPage = Math.floor(Number(searchParams.get('page') ?? 1));
    const currentPage = Number.isFinite(rawPage) && rawPage > 0 ? rawPage : 1;

    const nextParams = new URLSearchParams(searchParams);
    nextParams.set('page', String(currentPage + 1));
    setSearchParams(nextParams, { preventScrollReset: true });
  };

  return (
    <Container className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>{t('products.title')}</h1>
      </header>

      <DataState
        result={result}
        loading={<GridSkeleton />}
        empty={<EmptyState title={t('products.emptyTitle')} text={t('products.emptyText')} />}
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
                <Button variant="secondary" onClick={handleLoadMore} disabled={result.isFetching}>
                  {t('products.loadMore')}
                </Button>
              )}
            </div>
          </>
        )}
      </DataState>
    </Container>
  );
}

export default Products;
