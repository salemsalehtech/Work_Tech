import { useTranslation } from 'react-i18next';

import { Button } from '@shared/components/ui';
import { orderPath } from '@shared/constants';
import { formatDate, formatPrice } from '@shared/utils';

import OrderStatusBadge from '../OrderStatusBadge';

import styles from './OrderCard.module.css';

/** One order of My orders. */
function OrderCard({ order }) {
  const { t, i18n } = useTranslation('orders');

  return (
    <article className={styles.card} aria-label={t('number', { id: order.id })}>
      <header className={styles.head}>
        <span className={styles.number}>{order.id}</span>
        <time dateTime={order.createdAt}>{formatDate(order.createdAt, i18n.language)}</time>
        <OrderStatusBadge status={order.status} />
        <strong className={styles.total}>{formatPrice(order.totals.total, i18n.language)}</strong>
      </header>
      <div className={styles.body}>
        <ul className={styles.items}>
          {order.items.map((item) => (
            <li key={item.productId}>
              <bdi>{item.name}</bdi> × {item.quantity}
            </li>
          ))}
        </ul>
        <Button
          to={orderPath(order.id)}
          variant="outline"
          size="sm"
          aria-label={t('viewOrder', { id: order.id })}
        >
          {t('details')}
        </Button>
      </div>
    </article>
  );
}

export default OrderCard;
