import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import styles from './Breadcrumbs.module.css';

/** Trail above the page title. items: [{ label, to }], the last one is the current page. */
function Breadcrumbs({ items }) {
  const { t } = useTranslation();

  return (
    <nav className={styles.breadcrumbs} aria-label={t('breadcrumbs')}>
      <ol className={styles.list}>
        {items.map((item, index) => (
          <li key={item.label}>
            {index === items.length - 1 ? (
              <span aria-current="page">{item.label}</span>
            ) : (
              <Link to={item.to}>{item.label}</Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

export default Breadcrumbs;
