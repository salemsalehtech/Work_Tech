import styles from './Toggle.module.css';

/** On and off switch with its label, for example "In stock only". */
function Toggle({ id, label, checked, onChange, disabled = false }) {
  return (
    <label className={styles.row} htmlFor={id}>
      <span>{label}</span>
      <input
        id={id}
        type="checkbox"
        role="switch"
        className={styles.toggle}
        checked={checked}
        disabled={disabled}
        onChange={(event) => onChange?.(event.target.checked)}
      />
    </label>
  );
}

export default Toggle;
