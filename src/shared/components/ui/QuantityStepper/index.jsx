import { useTranslation } from 'react-i18next';

import { MAX_QTY_PER_ITEM } from '@shared/constants';

import styles from './QuantityStepper.module.css';

/** Minus, value, plus, with translated button names. Pass max = min(stock, MAX_QTY_PER_ITEM) (BR-03); it never goes below min. */
function QuantityStepper({ value, onChange, min = 1, max = MAX_QTY_PER_ITEM, size = 'md', label }) {
  const { t } = useTranslation();
  const set = (next) => onChange?.(Math.min(max, Math.max(min, next)));

  return (
    <span
      className={[styles.stepper, size === 'lg' && styles.large].filter(Boolean).join(' ')}
      role="group"
      aria-label={label ?? t('quantity')}
    >
      <button
        type="button"
        onClick={() => set(value - 1)}
        disabled={value <= min}
        aria-label={t('actions.decrease')}
      >
        −
      </button>
      <output className={styles.value} aria-live="polite">
        {value}
      </output>
      <button
        type="button"
        onClick={() => set(value + 1)}
        disabled={value >= max}
        aria-label={t('actions.increase')}
      >
        +
      </button>
    </span>
  );
}

export default QuantityStepper;
