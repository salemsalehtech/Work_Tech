import styles from './Toggle.module.css';
function Toggle({ id, label, onChange, checked, disabled = false }) {
  return (
    <label htmlFor={id}>
      <input
        className={`toggle ${styles.toggle}`}
        id={id}
        type="checkbox"
        role="switch"
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span>{label}</span>
    </label>
  );
}

export default Toggle;
