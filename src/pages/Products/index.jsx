import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';

import { CategoryNav, findCategory, ProductListing } from '@features/catalog';
import { Container } from '@shared/components/ui';

import styles from './Products.module.css';

function Products() {
  const { t } = useTranslation('catalog');
  const [searchParams] = useSearchParams();
  const category = findCategory(searchParams.get('category'));

  return (
    <>
      <CategoryNav />
      <Container className={styles.page}>
        <ProductListing
          title={category ? t(`categories.${category.key}`) : t('products.title')}
          emptyTitle={t('products.emptyTitle')}
          emptyText={t('products.emptyText')}
        />
      </Container>
    </>
  );
}

export default Products;
