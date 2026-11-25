import { useTranslation } from 'react-i18next';

import { Badge } from '@shared/components/ui';
import { ORDER_STATUS } from '@shared/constants';

const TONES = {
  [ORDER_STATUS.PLACED]: 'placed',
  [ORDER_STATUS.PROCESSING]: 'blue',
  [ORDER_STATUS.SHIPPED]: 'blue',
  [ORDER_STATUS.DELIVERED]: 'success',
  [ORDER_STATUS.CANCELLED]: 'neutral',
};

function OrderStatusBadge({ status }) {
  const { t } = useTranslation('orders');
  return <Badge tone={TONES[status]}>{t(`status.${status}`)}</Badge>;
}

export default OrderStatusBadge;
