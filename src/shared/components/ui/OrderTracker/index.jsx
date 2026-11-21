import styles from './OrderTracker.module.css';

const CANCELLED = -1;

export default function OrderTracker({
  steps,
  current = 0, // index الحالة الحالية، أو -1 لو الطلب ملغي
  cancelledLabel = 'Order Cancelled',
  ariaLabel = 'Order Status',
}) {
  if (current === CANCELLED) {
    return (
      <div role="status" className={styles.cancelled}>
        <span className={styles.cancelIcon} aria-hidden="true">
          ✕
        </span>
        {cancelledLabel}
      </div>
    );
  }

  return (
    <nav aria-label={ariaLabel}>
      <ol className={styles.tracker}>
        {steps.map((label, idx) => {
          const status = idx < current ? 'done' : idx === current ? 'current' : 'upcoming';

          return (
            <li
              key={label}
              className={`${styles.step} ${styles[status]}`}
              aria-current={status === 'current' ? 'step' : undefined}
            >
              <span className={styles.dot} aria-hidden="true">
                {status === 'done' ? '✓' : ''}
              </span>
              <span>{label}</span>
              {status === 'done' && <span className={styles.srOnly}> Completed</span>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
