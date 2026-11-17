import styles from './Checkbox.module.css';

/** Checkbox with its label. `count` shows how many laptops match (filters). */
function Checkbox({ label, count, className, ...rest }) {
  return (
    <label className={[styles.checkbox, className].filter(Boolean).join(' ')}>
      <input type="checkbox" {...rest} />
      <span className={styles.text}>{label}</span>
      {count !== undefined && <span className={styles.count}>{count}</span>}
    </label>
  );
}

export default Checkbox;
