import { useTranslation } from 'react-i18next';

import { ProductCard } from '@features/catalog';
import { Toggle } from '@shared/components/ui';
import { formatPrice } from '@shared/utils';

import styles from './WishlistCard.module.css';

function WishlistCard({ product, savedItem, cardProps, onToggleAlert }) {
  const { t, i18n } = useTranslation('wishlist');
  const lang = i18n.language;

  const savedPrice = savedItem?.savedPrice;
  const currentPrice = product?.price;

  const hasValidPrices =
    typeof savedPrice === 'number' &&
    !Number.isNaN(savedPrice) &&
    savedPrice > 0 &&
    typeof currentPrice === 'number' &&
    !Number.isNaN(currentPrice) &&
    currentPrice > 0;

  const priceDropReduction =
    hasValidPrices && currentPrice < savedPrice ? savedPrice - currentPrice : 0;

  const hasPriceDrop = priceDropReduction > 0;
  const isAlertActive = Boolean(savedItem?.priceAlert);
  const actions = cardProps ? cardProps(product) : {};

  const handleToggle = () => {
    if (onToggleAlert) {
      onToggleAlert(product.id, currentPrice);
    }
  };

  return (
    <article className={styles.card} data-testid={`wishlist-card-${product.id}`}>
      {hasPriceDrop && (
        <div
          className={styles.priceDropBanner}
          data-testid={`price-drop-${product.id}`}
          role="status"
        >
          <div className={styles.priceDropContent}>
            <span className={styles.priceDropIcon} aria-hidden="true">
              ↓
            </span>
            <span className={styles.priceDropMessage}>
              {t('priceDrop.message', {
                amount: formatPrice(priceDropReduction, lang),
              })}
            </span>
          </div>
          {savedPrice > 0 && (
            <span className={styles.savedPriceNote}>
              {t('priceDrop.wasPrice', {
                price: formatPrice(savedPrice, lang),
              })}
            </span>
          )}
        </div>
      )}

      <div className={styles.productCardWrapper}>
        <ProductCard product={product} {...actions} />
      </div>

      <div className={styles.alertToolbar}>
        <div className={styles.alertControl}>
          <Toggle
            id={`price-alert-${product.id}`}
            label={t('alerts.toggleLabel')}
            checked={isAlertActive}
            onChange={handleToggle}
          />
        </div>
        <span
          className={[
            styles.alertStatus,
            isAlertActive ? styles.alertActive : styles.alertInactive,
          ].join(' ')}
          data-testid={`alert-status-${product.id}`}
        >
          {isAlertActive ? t('alerts.enabled') : t('alerts.disabled')}
        </span>
      </div>
    </article>
  );
}

export default WishlistCard;
