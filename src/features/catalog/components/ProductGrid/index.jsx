import { useTranslation } from 'react-i18next';

import { Button, Skeleton } from '@shared/components/ui';

import { PAGE_SIZE } from '../../model/catalogParams';

import styles from './ProductGrid.module.css';

export function ProductGrid({ children, shown = 0, total, onLoadMore, isLoadingMore = false }) {
  const { t } = useTranslation('catalog');
  const showFooter = typeof total === 'number' && total > 0;
  const hasMore = showFooter && shown < total;
  const progressPercent = showFooter ? Math.min(100, (shown / total) * 100) : 0;

  return (
    <div className={styles.wrapper}>
      <div className={styles.grid}>{children}</div>

      {showFooter && (
        <div className={styles.footer}>
          <p className={styles.count}>{t('grid.showing', { shown, total })}</p>

          <div className={styles.progressTrack} aria-hidden="true">
            <div className={styles.progressFill} style={{ width: `${progressPercent}%` }} />
          </div>

          {hasMore && onLoadMore && (
            <Button variant="secondary" onClick={onLoadMore} disabled={isLoadingMore}>
              {t('grid.loadMore')}
            </Button>
          )}
        </div>
      )}
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

export default ProductGrid;
