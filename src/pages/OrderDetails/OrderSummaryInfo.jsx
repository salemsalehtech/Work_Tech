import { useTranslation } from 'react-i18next';

import { formatPrice } from '@shared/utils';

import styles from './OrderDetails.module.css';

export default function OrderSummaryInfo({ shipping, payment, totals }) {
  const { t, i18n } = useTranslation('orders');

  const subtotal = totals?.subtotal ?? 0;
  const shippingFee = totals?.shipping ?? 0;
  const discount = totals?.discount ?? 0;
  const grandTotal = totals?.total ?? subtotal + shippingFee - discount;

  const paymentMethodKey = payment?.method || 'card';
  const paymentLabel = t(`orderDetails.payment.${paymentMethodKey}`, {
    defaultValue: paymentMethodKey,
  });

  return (
    <div className={styles.summaryColumn}>
      {/* Delivery Address Card */}
      <section className={styles.card} aria-labelledby="shipping-address-heading">
        <div className={styles.cardHeader}>
          <h2 id="shipping-address-heading" className={styles.cardTitle}>
            {t('orderDetails.shippingAddress')}
          </h2>
        </div>
        <dl className={styles.infoList}>
          {shipping?.fullName && (
            <div className={styles.infoRow}>
              <dt className={styles.infoLabel}>{t('orderDetails.recipient')}</dt>
              <dd className={styles.infoValue}>{shipping.fullName}</dd>
            </div>
          )}
          {shipping?.phone && (
            <div className={styles.infoRow}>
              <dt className={styles.infoLabel}>{t('orderDetails.phone')}</dt>
              <dd className={styles.infoValue}>{shipping.phone}</dd>
            </div>
          )}
          {shipping?.address && (
            <div className={styles.infoRow}>
              <dt className={styles.infoLabel}>{t('orderDetails.address')}</dt>
              <dd className={styles.infoValue}>{shipping.address}</dd>
            </div>
          )}
          {shipping?.city && (
            <div className={styles.infoRow}>
              <dt className={styles.infoLabel}>{t('orderDetails.city')}</dt>
              <dd className={styles.infoValue}>{shipping.city}</dd>
            </div>
          )}
        </dl>
      </section>

      {/* Payment Method Card */}
      <section className={styles.card} aria-labelledby="payment-method-heading">
        <div className={styles.cardHeader}>
          <h2 id="payment-method-heading" className={styles.cardTitle}>
            {t('orderDetails.paymentMethod')}
          </h2>
        </div>
        <div className={styles.infoRow}>
          <span className={styles.infoLabel}>{t('orderDetails.paymentMethod')}</span>
          <span className={styles.infoValue} data-testid="payment-method-value">
            {paymentLabel}
          </span>
        </div>
      </section>

      {/* Financial Summary Card */}
      <section className={styles.card} aria-labelledby="financial-summary-heading">
        <div className={styles.cardHeader}>
          <h2 id="financial-summary-heading" className={styles.cardTitle}>
            {t('orderDetails.summary')}
          </h2>
        </div>
        <div className={styles.financialRow}>
          <span>{t('orderDetails.subtotal')}</span>
          <span>{formatPrice(subtotal, i18n.language)}</span>
        </div>
        <div className={styles.financialRow}>
          <span>{t('orderDetails.shipping')}</span>
          {shippingFee === 0 ? (
            <span className={styles.freeBadge}>{t('orderDetails.freeShipping')}</span>
          ) : (
            <span>{formatPrice(shippingFee, i18n.language)}</span>
          )}
        </div>
        {discount > 0 && (
          <div className={styles.financialRow}>
            <span>{t('orderDetails.discount')}</span>
            <span className={styles.discountValue}>- {formatPrice(discount, i18n.language)}</span>
          </div>
        )}
        <div className={`${styles.financialRow} ${styles.totalRow}`}>
          <span>{t('orderDetails.grandTotal')}</span>
          <span data-testid="order-grand-total">{formatPrice(grandTotal, i18n.language)}</span>
        </div>
      </section>
    </div>
  );
}
