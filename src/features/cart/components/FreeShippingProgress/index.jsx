import { useTranslation } from 'react-i18next';

import { FREE_SHIPPING_THRESHOLD } from '@shared/constants';
import { formatPrice } from '@shared/utils';

import styles from './FreeShippingProgress.module.css';

/** How far the cart is from free delivery. */
function FreeShippingProgress({ subtotal }) {
  const { t, i18n } = useTranslation('cart');
  const remaining = Math.max(FREE_SHIPPING_THRESHOLD - subtotal, 0);

  return (
    <div className={styles.box}>
      <p className={remaining === 0 ? styles.unlocked : undefined}>
        {remaining > 0
          ? t('shipping.remaining', { amount: formatPrice(remaining, i18n.language) })
          : t('shipping.unlocked')}
      </p>
      <progress
        className={styles.bar}
        max={FREE_SHIPPING_THRESHOLD}
        value={FREE_SHIPPING_THRESHOLD - remaining}
        aria-label={t('shipping.label')}
      />
    </div>
  );
}

export default FreeShippingProgress;
