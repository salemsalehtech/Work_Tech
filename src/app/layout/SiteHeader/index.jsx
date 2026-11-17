import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import { selectCurrentUser } from '@features/auth';
import { selectCartCount } from '@features/cart';
import { selectCompareCount } from '@features/compare';
import logo from '@shared/assets/brand/worktech-logo.jpg';
import { Container, Icon } from '@shared/components/ui';
import { PATHS } from '@shared/constants';

import styles from './SiteHeader.module.css';

/**
 * Store header: promo bar, logo, main links and the cart.
 * Search, the category row and the mobile menu are added next (see the Header component of the Design System).
 */
function SiteHeader() {
  const { t, i18n } = useTranslation('layout');
  const cartCount = useSelector(selectCartCount);
  const compareCount = useSelector(selectCompareCount);
  const user = useSelector(selectCurrentUser);

  const toggleLanguage = () => i18n.changeLanguage(i18n.language === 'ar' ? 'en' : 'ar');

  return (
    <header className={styles.header}>
      <div className={styles.topbar}>
        <Container className={styles.topbarInner}>
          <span className={styles.promo}>{t('promo')}</span>
          <nav className={styles.utility} aria-label={t('nav.help')}>
            <Link to={PATHS.ORDERS}>{t('nav.trackOrder')}</Link>
            <Link to={PATHS.FAQ}>{t('nav.help')}</Link>
            <button type="button" className={styles.language} onClick={toggleLanguage}>
              {t('language.switchTo')}
            </button>
          </nav>
        </Container>
      </div>

      <Container className={styles.main}>
        <Link to={PATHS.HOME} className={styles.logo} aria-label={t('common:app.name')}>
          <img src={logo} alt="" />
          <span className={styles.wordmark} aria-hidden="true">
            <span className={styles.work}>work</span>
            <span className={styles.tech}>TECH</span>
          </span>
        </Link>

        <nav className={styles.actions} aria-label={t('common:app.name')}>
          <Link to={PATHS.PRODUCTS} className={styles.link}>
            {t('nav.allLaptops')}
          </Link>
          <Link to={PATHS.COMPARE} className={styles.link}>
            <Icon name="compare" />
            {t('nav.compare')} <span className={styles.count}>({compareCount})</span>
          </Link>
          <Link to={PATHS.WISHLIST} className={styles.link} aria-label={t('nav.wishlist')}>
            <Icon name="heart" />
          </Link>
          <Link
            to={user ? PATHS.ACCOUNT : PATHS.AUTH}
            className={styles.link}
            aria-label={user ? t('nav.account') : t('nav.signIn')}
          >
            <Icon name="user" />
          </Link>
          <Link
            to={PATHS.CART}
            className={styles.cart}
            aria-label={t('nav.cartWithCount', { count: cartCount })}
          >
            <Icon name="cart" size={18} strokeWidth={1.8} />
            <span className={styles.cartLabel}>{t('nav.cart')}</span>
            <span className={styles.count}>{cartCount}</span>
          </Link>
        </nav>
      </Container>
    </header>
  );
}

export default SiteHeader;
