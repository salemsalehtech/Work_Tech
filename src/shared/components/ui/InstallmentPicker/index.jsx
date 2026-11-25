import { useTranslation } from 'react-i18next';

import { INSTALLMENT_PLANS } from '@shared/constants';
import { formatPrice, monthlyInstallment } from '@shared/utils';

import styles from './InstallmentPicker.module.css';

/** Installment plans of a price. value and onChange hold the number of months. */
function InstallmentPicker({ price, value, onChange, plans = INSTALLMENT_PLANS }) {
  const { t, i18n } = useTranslation();

  return (
    <div>
      <div className={styles.head}>
        <span className={styles.title}>{t('installments.title')}</span>
        <span>{t('installments.note')}</span>
      </div>
      <div className={styles.plans} role="group" aria-label={t('installments.title')}>
        {plans.map((months) => (
          <button
            key={months}
            type="button"
            className={styles.plan}
            aria-pressed={months === value}
            onClick={() => onChange?.(months)}
          >
            <span className={styles.months}>{t('installments.plan', { count: months })}</span>
            <span className={styles.amount}>
              {formatPrice(monthlyInstallment(price, months), i18n.language)}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default InstallmentPicker;
