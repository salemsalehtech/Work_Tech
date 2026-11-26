import { useTranslation } from 'react-i18next';

import styles from './OrderTracker.module.css';

/**
 * Delivery steps of an order. steps: [{ status, title, note? }], translated by the caller.
 * current is ORDER_STEP_INDEX[status]; `complete` marks the last step as done.
 * A cancelled order (current -1) has no tracker: show its Badge instead.
 */
function OrderTracker({ steps, current = 0, complete = false, label }) {
  const { t } = useTranslation();
  if (current < 0) return null;

  return (
    <ol className={styles.tracker} aria-label={label ?? t('orderProgress')}>
      {steps.map((step, index) => {
        const isDone = index < current || (complete && index === current);
        const isCurrent = index === current && !isDone;
        return (
          <li
            key={step.title}
            className={[styles.step, isDone && styles.done, isCurrent && styles.current]
              .filter(Boolean)
              .join(' ')}
            aria-current={isCurrent ? 'step' : undefined}
          >
            <span className={styles.status}>{step.status}</span>
            <span className={styles.title}>{step.title}</span>
            {step.note && <span className={styles.note}>{step.note}</span>}
          </li>
        );
      })}
    </ol>
  );
}

export default OrderTracker;
