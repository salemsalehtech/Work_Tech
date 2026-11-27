import { useId } from 'react';

import styles from './OptionCards.module.css';

/** Two-column option tiles (memory, storage). options: [{ value, label, aside? }] */
function OptionCards({ legend, options = [], value, onChange, name }) {
  const autoName = useId();

  return (
    <fieldset className={styles.fieldset}>
      <legend className={styles.legend}>{legend}</legend>
      <div className={styles.grid}>
        {options.map((option) => (
          <label key={option.value} className={styles.card}>
            <input
              type="radio"
              className="visually-hidden"
              name={name ?? autoName}
              value={option.value}
              checked={option.value === value}
              onChange={() => onChange?.(option.value)}
            />
            <span className={styles.label}>
              <bdi>{option.label}</bdi>
            </span>
            {option.aside && <span className={styles.aside}>{option.aside}</span>}
          </label>
        ))}
      </div>
    </fieldset>
  );
}

export default OptionCards;
