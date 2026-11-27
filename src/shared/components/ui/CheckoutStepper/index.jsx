import { useTranslation } from 'react-i18next';

import Icon from '../Icon';

import styles from './CheckoutStepper.module.css';

/** Checkout progress. steps: translated labels; current is 0-based. */
function CheckoutStepper({ steps, current = 0, label }) {
  const { t } = useTranslation();

  return (
    <ol className={styles.stepper} aria-label={label ?? t('checkoutSteps')}>
      {steps.map((step, index) => {
        const isDone = index < current;
        return (
          <li
            key={step}
            className={[styles.step, isDone && styles.done].filter(Boolean).join(' ')}
            aria-current={index === current ? 'step' : undefined}
          >
            <span className={styles.number}>
              {isDone ? (
                <Icon name="check" size={14} strokeWidth={2.4} label={t('status.done')} />
              ) : (
                index + 1
              )}
            </span>
            <span className={styles.label}>{step}</span>
          </li>
        );
      })}
    </ol>
  );
}

export default CheckoutStepper;
