import { Fragment } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

import { ProductGallery, ProductSpecsTabs, useGetProductQuery } from '@features/catalog';
import {
  Breadcrumbs,
  Button,
  Container,
  DataState,
  EmptyState,
  Skeleton,
} from '@shared/components/ui';
import { PATHS } from '@shared/constants';

import styles from './ProductDetails.module.css';
import ProductInfo from './ProductInfo';

function ProductDetailsSkeleton() {
  return (
    <div className={styles.grid} aria-busy="true">
      <Skeleton height={420} />
      <div className={styles.info}>
        <Skeleton height={36} />
        <Skeleton height={48} />
        <Skeleton height={220} />
      </div>
    </div>
  );
}

function ProductDetails() {
  const { id } = useParams();
  const { t } = useTranslation('catalog');
  const result = useGetProductQuery(id);

  const notFound = (
    <EmptyState
      title={t('productDetails.notFoundTitle')}
      text={t('productDetails.notFoundText')}
      action={
        <Button to={PATHS.PRODUCTS} variant="outline">
          {t('productDetails.backToProducts')}
        </Button>
      }
    />
  );

  return (
    <Container className={styles.page}>
      <DataState
        result={result}
        loading={<ProductDetailsSkeleton />}
        empty={notFound}
        error={result.error?.status === 404 ? notFound : undefined}
      >
        {(product) => (
          <Fragment key={product.id}>
            <div className={styles.breadcrumbs}>
              <Breadcrumbs
                items={[
                  { label: t('productDetails.breadcrumbHome'), to: PATHS.HOME },
                  { label: t('products.title'), to: PATHS.PRODUCTS },
                  { label: product.name },
                ]}
              />
            </div>
            <div className={styles.grid}>
              <ProductGallery images={product.images} name={product.name} />
              <ProductInfo product={product} />
            </div>
            <ProductSpecsTabs product={product} />
          </Fragment>
        )}
      </DataState>
    </Container>
  );
}

export default ProductDetails;
