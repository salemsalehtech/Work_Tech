import styles from './SectionHeader.module.css';

/** Section title over a rule, with an optional mono number and an action at the end. size: md | sm */
function SectionHeader({ title, number, action, size = 'md', as: Heading = 'h2' }) {
  return (
    <div className={[styles.header, size === 'sm' && styles.small].filter(Boolean).join(' ')}>
      <div>
        {number && <span className={styles.number}>{number}</span>}
        <Heading className={styles.title}>{title}</Heading>
      </div>
      {action}
    </div>
  );
}

export default SectionHeader;
