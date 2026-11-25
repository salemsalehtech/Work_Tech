import { Skeleton } from '@shared/components/ui';

import styles from './Orders.module.css';

function OrdersSkeleton() {
  return (
    <div className={styles.skeletonList} aria-busy="true" aria-label="Loading orders">
      {[1, 2, 3].map((key) => (
        <div key={key} className={styles.skeletonCard}>
          <div className={styles.cardHeader}>
            <div className={styles.orderHeaderDetails}>
              <Skeleton width="120px" height={20} />
              <Skeleton width="160px" height={14} />
            </div>
            <Skeleton width="80px" height={24} radius="4px" />
          </div>

          <div className={styles.cardBody}>
            <Skeleton width="90px" height={16} />
            <Skeleton width="100%" height={14} />
          </div>

          <div className={styles.cardFooter}>
            <Skeleton width="140px" height={22} />
            <Skeleton width="110px" height={36} radius="6px" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default OrdersSkeleton;
