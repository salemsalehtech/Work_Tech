import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import { Badge, Button, Icon } from '@shared/components/ui';
import { PATHS } from '@shared/constants';

import styles from './OrderDetails.module.css';
import { formatOrderDate, getStatusBadgeTone } from './orderDetailsUtils';

export default function OrderDetailsHeader({
  order,
  isCancellable,
  cancelSuccess,
  onOpenCancelModal,
}) {
  const { t, i18n } = useTranslation('orders');

  return (
    <>
      <div className={styles.breadcrumbsNav}>
        <Link to={PATHS.ORDERS} className={styles.backLink}>
          <Icon name="arrow" size={16} />
          <span>{t('orderDetails.backToOrders')}</span>
        </Link>
      </div>

      {cancelSuccess && (
        <div className={styles.alertSuccess} role="status" aria-live="polite">
          <Icon name="check" size={16} />
          <span>{cancelSuccess}</span>
        </div>
      )}

      <header className={styles.pageHeader}>
        <div className={styles.headerMain}>
          <div className={styles.titleRow}>
            <h1 className={styles.pageTitle}>{t('orderDetails.orderNumber', { id: order.id })}</h1>
            <Badge tone={getStatusBadgeTone(order.status)}>
              {t(`status.${order.status}`, { defaultValue: order.status })}
            </Badge>
          </div>
          <p className={styles.orderDate}>
            {t('orderDetails.placedOn', {
              date: formatOrderDate(order.createdAt, i18n.language),
            })}
          </p>
        </div>

        {isCancellable && (
          <div className={styles.headerActions}>
            <Button
              variant="danger"
              size="sm"
              onClick={onOpenCancelModal}
              className={styles.cancelBtn}
            >
              {t('orderDetails.cancelOrder')}
            </Button>
          </div>
        )}
      </header>
    </>
  );
}
