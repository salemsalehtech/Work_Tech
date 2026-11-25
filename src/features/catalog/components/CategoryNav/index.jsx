import { useTranslation } from 'react-i18next';
import { Link, useLocation, useSearchParams } from 'react-router-dom';

import { Container } from '@shared/components/ui';
import { categoryPath, PATHS } from '@shared/constants';

import { CATEGORIES } from '../../model/categories';

import styles from './CategoryNav.module.css';

/** Category row of the store: every link opens the catalog, and the open one is marked. */
function CategoryNav() {
  const { t } = useTranslation('catalog');
  const { pathname } = useLocation();
  const [searchParams] = useSearchParams();
  const current = pathname === PATHS.PRODUCTS ? (searchParams.get('category') ?? 'all') : null;

  const links = [
    { key: 'all', to: PATHS.PRODUCTS },
    ...CATEGORIES.map(({ key }) => ({ key, to: categoryPath(key) })),
  ];

  return (
    <nav className={styles.nav} aria-label={t('categories.label')}>
      <Container className={styles.row}>
        {links.map(({ key, to }) => (
          <Link
            key={key}
            to={to}
            className={[styles.link, key === 'deals' && styles.deals].filter(Boolean).join(' ')}
            aria-current={key === current ? 'page' : undefined}
          >
            {t(`categories.${key}`)}
          </Link>
        ))}
        <Link to={PATHS.FINDER} className={[styles.link, styles.finder].join(' ')}>
          <span className={styles.mark} aria-hidden="true" />
          {t('categories.finder')}
        </Link>
      </Container>
    </nav>
  );
}

export default CategoryNav;
