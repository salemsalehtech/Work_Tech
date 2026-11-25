import { useTranslation } from 'react-i18next';

import { ProductListing } from '@features/catalog';
import { Container } from '@shared/components/ui';

import styles from './Products.module.css';

function Products() {
  const { t } = useTranslation('catalog');

  return (
    <Container className={styles.page}>
      <ProductListing
        title={t('products.title')}
        emptyTitle={t('products.emptyTitle')}
        emptyText={t('products.emptyText')}
      />
    </Container>
  );
}

export default Products;
