import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import { selectCurrentUser } from '@features/auth';
import { useGetOrderQuery, useUpdateOrderStatusMutation } from '@features/orders';
import { Button, Container, DataState, EmptyState, OrderTracker } from '@shared/components/ui';
import {
  CANCELLABLE_STATUSES,
  ORDER_STATUS,
  ORDER_STEP_INDEX,
  ORDER_STEPS,
  PATHS,
} from '@shared/constants';

import CancelOrderModal from './CancelOrderModal';
import styles from './OrderDetails.module.css';
import OrderDetailsHeader from './OrderDetailsHeader';
import OrderDetailsSkeleton from './OrderDetailsSkeleton';
import { isOrderOwnedByUser } from './orderDetailsUtils';
import OrderItemsList from './OrderItemsList';
import OrderSummaryInfo from './OrderSummaryInfo';

function OrderDetailsContent({ order, user }) {
  const { t } = useTranslation('orders');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [cancelError, setCancelError] = useState('');
  const [cancelSuccess, setCancelSuccess] = useState('');

  const [updateOrderStatus, { isLoading: isCancelling }] = useUpdateOrderStatusMutation();

  if (!isOrderOwnedByUser(order, user)) {
    return (
      <EmptyState
        title={t('orderDetails.notFound.title')}
        text={t('orderDetails.notFound.text')}
        action={
          <Button to={PATHS.ORDERS} variant="primary">
            {t('orderDetails.notFound.action')}
          </Button>
        }
      />
    );
  }

  const isCancellable = CANCELLABLE_STATUSES.includes(order.status);
  const trackingIndex = ORDER_STEP_INDEX[order.status] ?? 0;
  const trackerSteps = ORDER_STEPS.map((step) => t(`status.${step}`));

  const handleConfirmCancel = async () => {
    try {
      setCancelError('');
      await updateOrderStatus({ id: order.id, status: ORDER_STATUS.CANCELLED }).unwrap();
      setIsModalOpen(false);
      setCancelSuccess(t('orderDetails.cancelSuccess', { id: order.id }));
    } catch {
      setCancelError(t('orderDetails.cancelError'));
    }
  };

  return (
    <>
      <OrderDetailsHeader
        order={order}
        isCancellable={isCancellable}
        cancelSuccess={cancelSuccess}
        onOpenCancelModal={() => {
          setCancelError('');
          setIsModalOpen(true);
        }}
      />

      <section className={styles.trackerSection} aria-labelledby="tracker-heading">
        <div className={styles.trackerHeader}>
          <h2 id="tracker-heading" className={styles.sectionHeading}>
            {t('orderDetails.trackingLabel')}
          </h2>
        </div>
        <OrderTracker
          steps={trackerSteps}
          current={trackingIndex}
          cancelledLabel={t('status.cancelled')}
          ariaLabel={t('orderDetails.trackingLabel')}
        />
      </section>

      <div className={styles.mainGrid}>
        <OrderItemsList items={order.items} />
        <OrderSummaryInfo shipping={order.shipping} payment={order.payment} totals={order.totals} />
      </div>

      <CancelOrderModal
        open={isModalOpen}
        orderId={order.id}
        isCancelling={isCancelling}
        error={cancelError}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmCancel}
      />
    </>
  );
}

export default function OrderDetails() {
  const { id } = useParams();
  const { t } = useTranslation('orders');
  const user = useSelector(selectCurrentUser);
  const orderResult = useGetOrderQuery(id, { skip: !id });

  return (
    <div className={styles.page} data-testid="order-details-page">
      <Container>
        <DataState
          result={orderResult}
          loading={<OrderDetailsSkeleton />}
          empty={
            <EmptyState
              title={t('orderDetails.notFound.title')}
              text={t('orderDetails.notFound.text')}
              action={
                <Button to={PATHS.ORDERS} variant="primary">
                  {t('orderDetails.notFound.action')}
                </Button>
              }
            />
          }
        >
          {(order) => <OrderDetailsContent order={order} user={user} />}
        </DataState>
      </Container>
    </div>
  );
}
