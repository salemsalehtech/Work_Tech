import styles from './ValueScore.module.css';

/**
 * Value score bar. `score` is the 0–100 value from db.json; it shows out of 10 (86 → 8.6)
 * and the bar fills to the nearest 10%. `label` adds the mono "VALUE" word (product details).
 */
function ValueScore({ score, size = 'md', label, ariaLabel }) {
  const outOfTen = score / 10;

  return (
    <span
      className={[styles.valueScore, size === 'lg' && styles.large].filter(Boolean).join(' ')}
      role="img"
      aria-label={ariaLabel ?? `${outOfTen.toFixed(1)} / 10`}
    >
      <span
        className={styles.bar}
        style={{ '--fill': `${Math.round(outOfTen) * 10}%` }}
        aria-hidden="true"
      />
      <span className={styles.number} aria-hidden="true">
        {outOfTen.toFixed(1)}
      </span>
      {label && (
        <span className={styles.label} aria-hidden="true">
          {label}
        </span>
      )}
    </span>
  );
}

export default ValueScore;
