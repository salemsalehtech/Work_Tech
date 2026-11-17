import styles from './Field.module.css';

/** Label above, control, then the error (or the hint). Used by Input and Select. */
function Field({ id, label, optionalText, hint, error, className, children }) {
  return (
    <div className={[styles.field, className].filter(Boolean).join(' ')}>
      {label && (
        <label className={styles.label} htmlFor={id}>
          {label}
          {optionalText && <span className={styles.optional}> {optionalText}</span>}
        </label>
      )}
      {children}
      {error ? (
        <span id={`${id}-error`} className={styles.error}>
          {error}
        </span>
      ) : (
        hint && (
          <span id={`${id}-hint`} className={styles.hint}>
            {hint}
          </span>
        )
      )}
    </div>
  );
}

export default Field;
