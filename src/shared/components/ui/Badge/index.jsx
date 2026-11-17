import styles from './Badge.module.css';

/** Short status label. tone: ink | blue | value | sale | drop | success | placed | neutral */
function Badge({ tone = 'ink', className, children }) {
  return (
    <span className={[styles.badge, styles[tone], className].filter(Boolean).join(' ')}>
      {children}
    </span>
  );
}

export default Badge;
