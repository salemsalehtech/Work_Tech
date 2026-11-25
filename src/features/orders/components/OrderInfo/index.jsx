import { useTranslation } from 'react-i18next';

import styles from './OrderInfo.module.css';

/** Where the order goes and how it is paid. */
function OrderInfo({ shipping, payment }) {
  const { t } = useTranslation('orders');

  return (
    <dl className={styles.info}>
      <div>
        <dt>{t('address')}</dt>
        {[shipping.fullName, shipping.address, shipping.city, shipping.phone].map((line) => (
          <dd key={line}>
            <bdi>{line}</bdi>
          </dd>
        ))}
      </div>
      <div>
        <dt>{t('payment.label')}</dt>
        <dd>{t(`payment.${payment.method}`)}</dd>
      </div>
    </dl>
  );
}

export default OrderInfo;
