import { useTranslation } from 'react-i18next';

import { Badge, Button } from '@shared/components/ui';
import { orderPath } from '@shared/constants';
import { formatPrice } from '@shared/utils';

import styles from './Orders.module.css';
import { formatOrderDate, getStatusBadgeTone } from './ordersUtils';

function OrderCard({ order }) {
  const { t, i18n } = useTranslation('orders');

  const items = Array.isArray(order?.items) ? order.items : [];
  const totalItemCount = items.reduce((acc, item) => acc + (item?.quantity || 1), 0);
  const totalAmount = order?.totals?.total ?? order?.total ?? 0;
  const statusKey = order?.status || 'placed';
  const statusLabel = t(`status.${statusKey}`, { defaultValue: statusKey });

  return (
    <article
      className={styles.orderCard}
      data-testid={`order-card-${order.id}`}
      aria-labelledby={`order-heading-${order.id}`}
    >
      <header className={styles.cardHeader}>
        <div className={styles.orderHeaderDetails}>
          <span id={`order-heading-${order.id}`} className={styles.orderId}>
            {order.id}
          </span>
          <time dateTime={order.createdAt} className={styles.orderDate}>
            {t('card.placedOn')}: {formatOrderDate(order.createdAt, i18n.language)}
          </time>
        </div>

        <Badge tone={getStatusBadgeTone(statusKey)}>{statusLabel}</Badge>
      </header>

      {items.length > 0 && (
        <div className={styles.cardBody}>
          <div className={styles.itemsSummary}>
            {t('card.itemsCount', { count: totalItemCount })}
          </div>
          <div className={styles.itemsList}>
            {items.map((item, idx) => (
              <div key={item.id || item.productId || idx} className={styles.itemLine}>
                <span className={styles.itemName}>{item.name || item.productId || 'Item'}</span>
                <span className={styles.itemQuantity}>×{item.quantity || 1}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <footer className={styles.cardFooter}>
        <div className={styles.totalGroup}>
          <span className={styles.totalLabel}>{t('card.total')}:</span>
          <span className={styles.totalValue}>{formatPrice(totalAmount, i18n.language)}</span>
        </div>

        <Button to={orderPath(order.id)} variant="outline" size="sm" className={styles.detailsBtn}>
          {t('card.viewDetails')}
        </Button>
      </footer>
    </article>
  );
}

export default OrderCard;
