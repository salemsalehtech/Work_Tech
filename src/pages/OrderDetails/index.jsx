import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';

import { AccountLayout, selectCurrentUser } from '@features/auth';
import { CartSummary } from '@features/cart';
import {
  CancelOrder,
  OrderInfo,
  OrderItems,
  OrderProgress,
  OrderStatusBadge,
  useGetOrderQuery,
} from '@features/orders';
import { Button, DataState, EmptyState, SectionHeader, Skeleton } from '@shared/components/ui';
import { PATHS } from '@shared/constants';
import { formatDate } from '@shared/utils';

import styles from './OrderDetails.module.css';

function OrderDetails() {
  const { id } = useParams();
  const { t, i18n } = useTranslation('orders');
  const user = useSelector(selectCurrentUser);
  const result = useGetOrderQuery(id);

  const notFound = (
    <EmptyState
      title={t('notFound.title')}
      text={t('notFound.text')}
      action={<Button to={PATHS.ORDERS}>{t('notFound.action')}</Button>}
    />
  );

  return (
    <AccountLayout title={t('number', { id })}>
      <DataState
        result={result}
        loading={<Skeleton height={420} radius="var(--radius-lg)" />}
        error={result.error?.status === 404 ? notFound : undefined}
        isEmpty={(order) => order?.userId !== user.id}
        empty={notFound}
      >
        {(order) => (
          <>
            <div className={styles.head}>
              <Link to={PATHS.ORDERS}>{t('allOrders')}</Link>
              <time dateTime={order.createdAt}>{formatDate(order.createdAt, i18n.language)}</time>
              <OrderStatusBadge status={order.status} />
              <CancelOrder order={order} />
            </div>
            <OrderProgress status={order.status} />
            <div className={styles.grid}>
              <section className={styles.main}>
                <SectionHeader title={t('items')} size="sm" />
                <OrderItems items={order.items} />
                <OrderInfo shipping={order.shipping} payment={order.payment} />
              </section>
              <CartSummary
                totals={{ ...order.totals, products: order.totals.subtotal, warranty: 0 }}
              />
            </div>
          </>
        )}
      </DataState>
    </AccountLayout>
  );
}

export default OrderDetails;
