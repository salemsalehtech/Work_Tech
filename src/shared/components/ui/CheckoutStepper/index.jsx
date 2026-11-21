import styles from './CheckoutStepper.module.css';

export default function CheckoutStepper({ steps, current = 0, ariaLabel = 'خطوات إتمام الطلب' }) {
  return (
    <nav aria-label={ariaLabel}>
      <ol className={styles.stepper}>
        {steps.map((label, index) => {
          const status = index < current ? 'done' : index === current ? 'current' : 'upcoming';

          return (
            <li
              key={label}
              className={`${styles.step} ${styles[status]}`}
              aria-current={status === 'current' ? 'step' : undefined}
            >
              <span className={styles.circle} aria-hidden="true">
                {status === 'done' ? '✓' : index + 1}
              </span>
              <span className={styles.label}>{label}</span>
              {status === 'done' && <span className={styles.srOnly}>Completed</span>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
