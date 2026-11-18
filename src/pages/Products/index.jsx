import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';

import {
  GridSkeleton,
  ProductCard,
  ProductGrid,
  toApiParams,
  useGetProductsQuery,
} from '@features/catalog';
import { Container, DataState, EmptyState } from '@shared/components/ui';

function Products() {
  const { t } = useTranslation('catalog');
  const [searchParams, setSearchParams] = useSearchParams();

  const apiParams = toApiParams(searchParams);
  const result = useGetProductsQuery(apiParams);

  const handleLoadMore = () => {
    const rawPage = Math.floor(Number(searchParams.get('page') ?? 1));
    const currentPage = Number.isFinite(rawPage) && rawPage > 0 ? rawPage : 1;

    const nextParams = new URLSearchParams(searchParams);
    nextParams.set('page', String(currentPage + 1));
    setSearchParams(nextParams, { preventScrollReset: true });
  };

  return (
    <Container>
      <DataState
        result={result}
        loading={<GridSkeleton />}
        empty={<EmptyState title={t('empty.title')} text={t('empty.text')} />}
      >
        {({ items, total }) => (
          <ProductGrid
            shown={items.length}
            total={total}
            onLoadMore={handleLoadMore}
            isLoadingMore={result.isFetching}
          >
            {items.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </ProductGrid>
        )}
      </DataState>
    </Container>
  );
}

export default Products;
