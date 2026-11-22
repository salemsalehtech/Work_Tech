import { NavLink } from 'react-router-dom';

import styles from './AccountNav.module.css';

export default function AccountNav({ links, ariaLabel = 'Account List' }) {
  return (
    <nav aria-label={ariaLabel} className={styles.nav}>
      <ul className={styles.list}>
        {links.map(({ to, label, end }) => (
          <li key={to}>
            <NavLink
              to={to}
              end={end}
              className={({ isActive }) => `${styles.link} ${isActive ? styles.active : ''}`}
            >
              {label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
