import { SectionHeader } from '@shared/components/ui';

import styles from './AccountSection.module.css';

/** One titled block of the account page. `message` confirms the last change to screen readers too. */
function AccountSection({ title, message, children }) {
  return (
    <section className={styles.section}>
      <SectionHeader title={title} size="sm" />
      {children}
      <p className={styles.message} role="status">
        {message}
      </p>
    </section>
  );
}

export default AccountSection;
