import { useTranslation } from 'react-i18next';

import { ConfirmButton } from '@shared/components/ui';
import { CANCELLABLE_STATUSES, ORDER_STATUS } from '@shared/constants';

import { useUpdateOrderStatusMutation } from '../../api/ordersApi';

import styles from './CancelOrder.module.css';

/** Cancel button of an order that was not packed yet. The order refetches after it. */
function CancelOrder({ order }) {
  const { t } = useTranslation('orders');
  const [updateStatus, { isLoading, isError }] = useUpdateOrderStatusMutation();

  if (!CANCELLABLE_STATUSES.includes(order.status)) return null;

  return (
    <div>
      <ConfirmButton
        label={t('cancel.action')}
        question={t('cancel.question')}
        confirmLabel={t('cancel.confirm')}
        loading={isLoading}
        onConfirm={() => updateStatus({ id: order.id, status: ORDER_STATUS.CANCELLED })}
      />
      {isError && (
        <p className={styles.error} role="alert">
          {t('cancel.error')}
        </p>
      )}
    </div>
  );
}

export default CancelOrder;
