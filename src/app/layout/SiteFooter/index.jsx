import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import { Container } from '@shared/components/ui';
import { PATHS } from '@shared/constants';

import styles from './SiteFooter.module.css';

/** Compact footer. The full four-column footer of Home and the catalog is added next. */
function SiteFooter() {
  const { t } = useTranslation('layout');

  return (
    <footer className={styles.footer}>
      <Container className={styles.inner}>
        <span>{t('footer.copyright', { year: new Date().getFullYear() })}</span>
        <nav className={styles.links} aria-label={t('nav.help')}>
          <Link to={PATHS.POLICIES}>{t('nav.policies')}</Link>
          <Link to={PATHS.FAQ}>{t('nav.faq')}</Link>
          <Link to={PATHS.CONTACT}>{t('nav.contact')}</Link>
          <Link to={PATHS.ABOUT}>{t('nav.about')}</Link>
        </nav>
      </Container>
    </footer>
  );
}

export default SiteFooter;
