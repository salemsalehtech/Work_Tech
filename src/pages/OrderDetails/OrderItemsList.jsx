import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import { ProductImage } from '@shared/components/ui';
import { productPath } from '@shared/constants';
import { formatPrice } from '@shared/utils';

import styles from './OrderDetails.module.css';

export default function OrderItemsList({ items = [] }) {
  const { t, i18n } = useTranslation('orders');

  return (
    <section className={styles.card} aria-labelledby="order-items-heading">
      <div className={styles.cardHeader}>
        <h2 id="order-items-heading" className={styles.cardTitle}>
          {t('orderDetails.itemsTitle', { count: items.length })}
        </h2>
      </div>

      <div className={styles.itemsList}>
        {items.map((item, idx) => {
          const itemKey = item.productId ? `${item.productId}-${idx}` : `item-${idx}`;
          const itemTotal = (item.price || 0) * (item.quantity || 1);
          const hasOptions = item.options && typeof item.options === 'object';

          return (
            <article
              key={itemKey}
              className={styles.itemRow}
              data-testid={`order-item-${item.productId || idx}`}
            >
              <div className={styles.itemImageWrapper}>
                <ProductImage src={item.image} alt={item.name} className={styles.itemImage} />
              </div>

              <div className={styles.itemDetails}>
                {item.productId ? (
                  <Link to={productPath(item.productId)} className={styles.itemName}>
                    {item.name}
                  </Link>
                ) : (
                  <span className={styles.itemName}>{item.name}</span>
                )}

                {hasOptions && (
                  <div className={styles.itemOptions} aria-label="Product options">
                    {Object.entries(item.options).map(([key, value]) =>
                      value ? (
                        <span key={key} className={styles.optionBadge}>
                          {value}
                        </span>
                      ) : null,
                    )}
                  </div>
                )}

                <div className={styles.itemMeta}>
                  {t('orderDetails.quantity')}: {item.quantity}
                </div>
              </div>

              <div className={styles.itemPricing}>
                <span className={styles.itemTotalPrice}>
                  {formatPrice(itemTotal, i18n.language)}
                </span>
                {item.quantity > 1 && (
                  <span className={styles.itemUnitPrice}>
                    ({formatPrice(item.price, i18n.language)} / {t('orderDetails.product')})
                  </span>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
