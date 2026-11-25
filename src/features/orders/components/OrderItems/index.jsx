import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import { productPath } from '@shared/constants';
import { formatPrice } from '@shared/utils';

import styles from './OrderItems.module.css';

/** What was bought. Accessories have no page of their own, so only laptops are links. */
function OrderItems({ items }) {
  const { t, i18n } = useTranslation('orders');
  const money = (value) => formatPrice(value, i18n.language);

  return (
    <ul className={styles.items}>
      {items.map((item) => (
        <li
          key={[item.productId, ...Object.values(item.options ?? {})].join()}
          className={styles.item}
        >
          <div className={styles.info}>
            {item.kind === 'accessory' ? (
              <span className={styles.name}>
                <bdi>{item.name}</bdi>
              </span>
            ) : (
              <Link to={productPath(item.productId)} className={styles.name}>
                <bdi>{item.name}</bdi>
              </Link>
            )}
            {item.options && (
              <span className={styles.options}>
                <bdi>{Object.values(item.options).join(' · ')}</bdi>
              </span>
            )}
            <span className={styles.quantity}>{t('quantity', { count: item.quantity })}</span>
          </div>
          <div className={styles.price}>
            <strong>{money(item.price * item.quantity)}</strong>
            {item.quantity > 1 && (
              <span className={styles.each}>{t('each', { price: money(item.price) })}</span>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}

export default OrderItems;
