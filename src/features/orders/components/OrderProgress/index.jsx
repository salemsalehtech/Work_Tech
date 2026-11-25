import { useTranslation } from 'react-i18next';

import { OrderTracker } from '@shared/components/ui';
import { ORDER_STATUS, ORDER_STEP_INDEX, ORDER_STEPS } from '@shared/constants';

/** Tracker of an order. A cancelled order has none. */
function OrderProgress({ status }) {
  const { t } = useTranslation('orders');
  const current = ORDER_STEP_INDEX[status];
  const complete = status === ORDER_STATUS.DELIVERED;

  const stateOf = (index) => {
    if (index < current || complete) return 'done';
    return index === current ? 'current' : 'next';
  };

  return (
    <OrderTracker
      steps={ORDER_STEPS.map((step, index) => ({
        status: t(`tracker.${stateOf(index)}`),
        title: t(`status.${step}`),
      }))}
      current={current}
      complete={complete}
    />
  );
}

export default OrderProgress;
