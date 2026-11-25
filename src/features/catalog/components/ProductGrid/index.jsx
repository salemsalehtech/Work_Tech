import { useTranslation } from 'react-i18next';

import { Button, Skeleton } from '@shared/components/ui';

import { PAGE_SIZE } from '../../model/catalogParams';

import styles from './ProductGrid.module.css';

/** The product cards with "showing 9 of 40" and load more under them. */
export function ProductGrid({ children, shown, total, onLoadMore, isLoadingMore = false }) {
  const { t } = useTranslation('catalog');

  return (
    <div className={styles.wrapper}>
      <div className={styles.grid}>{children}</div>

      <div className={styles.footer}>
        <p className={styles.count}>{t('products.showingCount', { shown, total })}</p>
        <progress
          className={styles.progress}
          max={total}
          value={shown}
          aria-label={t('products.showingCount', { shown, total })}
        />
        {shown < total && (
          <Button variant="outline" size="lg" onClick={onLoadMore} loading={isLoadingMore}>
            {t('products.loadMore')}
          </Button>
        )}
      </div>
    </div>
  );
}

export function GridSkeleton({ count = PAGE_SIZE }) {
  return (
    <div className={styles.grid} aria-busy="true">
      {Array.from({ length: count }, (_, index) => (
        <Skeleton key={index} height={420} />
      ))}
    </div>
  );
}
