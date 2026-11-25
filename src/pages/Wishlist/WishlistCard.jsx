import { useTranslation } from 'react-i18next';

import { ProductCard } from '@features/catalog';
import { Badge, Toggle } from '@shared/components/ui';
import { formatDate, formatPrice } from '@shared/utils';

import styles from './Wishlist.module.css';

/** A saved laptop: when it was saved, how much its price dropped since, and the price alert. */
function WishlistCard({ product, saved, actions, onAlertChange }) {
  const { t, i18n } = useTranslation('wishlist');
  const drop = saved.savedPrice - product.price;

  return (
    <li className={styles.card}>
      <div className={styles.saved}>
        <span>{t('savedOn', { date: formatDate(saved.savedAt, i18n.language) })}</span>
        {drop > 0 && (
          <Badge tone="drop">{t('priceDrop', { amount: formatPrice(drop, i18n.language) })}</Badge>
        )}
      </div>
      <ProductCard product={product} {...actions} />
      <Toggle
        id={`price-alert-${product.id}`}
        label={t('priceAlert')}
        checked={Boolean(saved.priceAlert)}
        onChange={onAlertChange}
      />
    </li>
  );
}

export default WishlistCard;
