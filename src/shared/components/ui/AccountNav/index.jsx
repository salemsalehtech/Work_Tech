import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router-dom';

import styles from './AccountNav.module.css';

/** Side navigation of the account pages. links: [{ to, label, end? }] */
function AccountNav({ links, label }) {
  const { t } = useTranslation();

  return (
    <nav className={styles.nav} aria-label={label ?? t('accountNav')}>
      {links.map((link) => (
        <NavLink key={link.to} to={link.to} end={link.end} className={styles.link}>
          {link.label}
        </NavLink>
      ))}
    </nav>
  );
}

export default AccountNav;
