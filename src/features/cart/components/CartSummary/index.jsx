import { useTranslation } from 'react-i18next';

import { formatPrice } from '@shared/utils';

import styles from './CartSummary.module.css';

/** Totals box of the cart and checkout. totals comes from calcCartTotals; children sit above the rows. */
function CartSummary({ totals, action, note, children }) {
  const { t, i18n } = useTranslation('cart');
  const money = (value) => formatPrice(value, i18n.language);

  const rows = [
    { id: 'subtotal', value: money(totals.products) },
    totals.warranty > 0 && { id: 'warranty', value: money(totals.warranty) },
    totals.discount > 0 && { id: 'discount', value: `−${money(totals.discount)}`, tone: 'sale' },
    totals.shipping > 0
      ? { id: 'shipping', value: money(totals.shipping) }
      : { id: 'shipping', value: t('summary.free'), tone: 'success' },
  ].filter(Boolean);

  return (
    <aside className={styles.summary} aria-labelledby="cart-summary-title">
      <h2 id="cart-summary-title" className={styles.title}>
        {t('summary.title')}
      </h2>
      {children}
      <dl className={styles.rows}>
        {rows.map((row) => (
          <div key={row.id} className={styles[row.tone]}>
            <dt>{t(`summary.${row.id}`)}</dt>
            <dd>{row.value}</dd>
          </div>
        ))}
      </dl>
      <div className={styles.total}>
        <span>{t('summary.total')}</span>
        <strong className={styles.amount}>{money(totals.total)}</strong>
      </div>
      {action}
      {note && <p className={styles.note}>{note}</p>}
    </aside>
  );
}

export default CartSummary;
