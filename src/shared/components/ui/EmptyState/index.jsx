import styles from './EmptyState.module.css';

/**
 * A data view that loaded and has nothing: empty cart, no results, no orders.
 * Title says what is empty, text says what to do, one action.
 */
function EmptyState({ eyebrow, title, text, action, tone, role }) {
  return (
    <div
      className={[styles.state, tone === 'error' && styles.error].filter(Boolean).join(' ')}
      role={role}
    >
      {eyebrow && <span className={styles.eyebrow}>{eyebrow}</span>}
      <h2 className={styles.title}>{title}</h2>
      {text && <p className={styles.text}>{text}</p>}
      {action}
    </div>
  );
}

export default EmptyState;
