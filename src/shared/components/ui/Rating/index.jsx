import styles from './Rating.module.css';

const STAR = 'M12 2l3 6.9 7.5.6-5.7 4.9 1.8 7.3L12 17.8 5.4 21.7l1.8-7.3L1.5 9.5 9 8.9z';

function starState(position, value) {
  if (position <= Math.floor(value)) return 'full';
  if (position === Math.floor(value) + 1 && value % 1 >= 0.5) return 'half';
  return 'empty';
}

/**
 * Five stars, the average and the review count.
 * Pass `label` with the full sentence for screen readers, e.g. t('…', { value, count }).
 */
function Rating({ value = 0, count, size = 13, hideValue = false, label }) {
  return (
    <span className={styles.rating} role="img" aria-label={label ?? `${value.toFixed(1)} / 5`}>
      <span className={styles.stars} aria-hidden="true">
        {[1, 2, 3, 4, 5].map((position) => (
          <svg key={position} width={size} height={size} viewBox="0 0 24 24">
            <path d={STAR} className={styles[starState(position, value)]} />
          </svg>
        ))}
      </span>
      {!hideValue && (
        <b className={styles.value} aria-hidden="true">
          {value.toFixed(1)}
        </b>
      )}
      {count !== undefined && <span aria-hidden="true">({count})</span>}
    </span>
  );
}

export default Rating;
