import { Skeleton } from '@shared/components/ui';

import styles from './OrderDetails.module.css';

export default function OrderDetailsSkeleton() {
  return (
    <div className={styles.page} data-testid="order-details-skeleton">
      <div className={styles.breadcrumbsNav}>
        <Skeleton width="160px" height="20px" />
      </div>

      <div className={styles.pageHeader}>
        <div className={styles.headerMain}>
          <div className={styles.titleRow}>
            <Skeleton width="220px" height="32px" />
            <Skeleton width="90px" height="24px" />
          </div>
          <Skeleton width="180px" height="16px" />
        </div>
      </div>

      <div className={styles.trackerSection}>
        <Skeleton width="140px" height="24px" className={styles.trackerHeader} />
        <Skeleton width="100%" height="48px" />
      </div>

      <div className={styles.mainGrid}>
        <div className={styles.card}>
          <Skeleton width="180px" height="24px" className={styles.cardHeader} />
          <div className={styles.itemsList}>
            <Skeleton width="100%" height="80px" />
            <Skeleton width="100%" height="80px" />
          </div>
        </div>

        <div className={styles.summaryColumn}>
          <div className={styles.card}>
            <Skeleton width="140px" height="20px" className={styles.cardHeader} />
            <Skeleton width="100%" height="60px" />
          </div>
          <div className={styles.card}>
            <Skeleton width="140px" height="20px" className={styles.cardHeader} />
            <Skeleton width="100%" height="40px" />
          </div>
          <div className={styles.card}>
            <Skeleton width="140px" height="20px" className={styles.cardHeader} />
            <Skeleton width="100%" height="80px" />
          </div>
        </div>
      </div>
    </div>
  );
}
