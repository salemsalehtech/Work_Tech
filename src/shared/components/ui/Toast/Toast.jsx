import styles from './Toast.module.css';

export default function Toast({ title, tone }) {
  return (
    <div className={`${styles.toast} ${styles[`toast - ${tone}`] ?? ''} `} role="status">
      {title}
    </div>
  );
}
