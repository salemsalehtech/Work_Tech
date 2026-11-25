import styles from './Toast.module.css';

/** Short confirmation. tone: success | error. Shown through useToast, never rendered directly. */
function Toast({ title, tone = 'success' }) {
  return (
    <div className={[styles.toast, tone === 'error' && styles.error].filter(Boolean).join(' ')}>
      <span className={styles.mark} aria-hidden="true" />
      {title}
    </div>
  );
}

export default Toast;
