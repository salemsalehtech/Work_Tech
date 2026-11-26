import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import { IconButton, ProductImage, QuantityStepper } from '@shared/components/ui';
import { productPath } from '@shared/constants';
import { formatPrice } from '@shared/utils';

import { quantityLimit } from '../../model/cartItem';

import styles from './CartLine.module.css';

/** One row of the cart. Accessories have no page of their own, so only laptops are links. */
function CartLine({ item, onQuantityChange, onRemove }) {
  const { t, i18n } = useTranslation('cart');

  return (
    <article className={styles.line}>
      <div className={styles.media}>
        <ProductImage src={item.image} className={styles.image} />
      </div>

      <div className={styles.info}>
        <span className={styles.brand}>{item.brand}</span>
        {item.kind === 'accessory' ? (
          <span className={styles.name}>{item.name}</span>
        ) : (
          <Link to={productPath(item.productId)} className={styles.name}>
            {item.name}
          </Link>
        )}
        {item.specsLine && (
          <span className={styles.specs}>
            <bdi>{item.specsLine}</bdi>
          </span>
        )}
        {item.options && (
          <dl className={styles.options}>
            {Object.entries(item.options).map(([group, label]) => (
              <div key={group}>
                <dt>{t(`options.${group}`)}</dt>
                <dd>
                  <bdi>{label}</bdi>
                </dd>
              </div>
            ))}
          </dl>
        )}
      </div>

      <div className={styles.quantity}>
        <QuantityStepper
          value={item.quantity}
          max={quantityLimit(item.stock)}
          onChange={onQuantityChange}
        />
      </div>

      <strong className={styles.price}>
        {formatPrice(item.price * item.quantity, i18n.language)}
      </strong>

      <IconButton
        icon="close"
        size="sm"
        className={styles.remove}
        label={t('removeItem', { name: item.name })}
        onClick={onRemove}
      />
    </article>
  );
}

export default CartLine;
