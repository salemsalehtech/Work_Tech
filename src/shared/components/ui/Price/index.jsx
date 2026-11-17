import { useTranslation } from 'react-i18next';

import { discountPercent, formatPrice, monthlyInstallment } from '@shared/utils';

import styles from './Price.module.css';

/**
 * Price in EGP, the struck old price when discounted, and "or X EGP × months".
 * size: sm (19px, catalog cards) | md (20px, home cards) | xl (32px, product details)
 */
function Price({ value, oldPrice, months, size = 'sm', showVat = false, monthsLabel }) {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const onSale = discountPercent(value, oldPrice) > 0;
  const classes = [styles.price, size !== 'sm' && styles[size], onSale && styles.sale]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={classes}>
      <div className={styles.row}>
        <span className={styles.now}>{formatPrice(value, lang)}</span>
        {onSale && <s className={styles.old}>{formatPrice(oldPrice, lang)}</s>}
        {showVat && <span className={styles.vat}>{t('price.vat')}</span>}
      </div>
      {months && (
        <span className={styles.monthly}>
          {t('price.or')} <b>{formatPrice(monthlyInstallment(value, months), lang)}</b> × {months}
          {monthsLabel && ` ${monthsLabel}`}
        </span>
      )}
    </div>
  );
}

export default Price;
