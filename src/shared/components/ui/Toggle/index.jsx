import styles from './Toggle.module.css';

/** On and off switch with its label, for example "In stock only", and an optional description. */
function Toggle({ id, label, description, checked, onChange, disabled = false }) {
  return (
    <label className={styles.row} htmlFor={id}>
      <span>
        {label}
        {description && (
          <span id={`${id}-description`} className={styles.description}>
            {description}
          </span>
        )}
      </span>
      <input
        id={id}
        type="checkbox"
        role="switch"
        className={styles.toggle}
        aria-label={label}
        aria-describedby={description ? `${id}-description` : undefined}
        checked={checked}
        disabled={disabled}
        onChange={(event) => onChange?.(event.target.checked)}
      />
    </label>
  );
}

export default Toggle;
