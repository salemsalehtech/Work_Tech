import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { selectCurrentUser, signOut } from '@features/auth';
import { AccountNav, Button, Container } from '@shared/components/ui';
import { PATHS } from '@shared/constants';

import styles from './Account.module.css';
import AddressesSection from './AddressesSection';
import NotificationsSection from './NotificationsSection';
import PersonalInfoSection from './PersonalInfoSection';

function Account() {
  const { t } = useTranslation('account');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(selectCurrentUser);

  const handleSignOut = () => {
    dispatch(signOut());
    navigate(PATHS.HOME, { replace: true });
  };

  const accountLinks = [
    { to: PATHS.ACCOUNT, label: t('nav.overview'), end: true },
    { to: PATHS.ORDERS, label: t('nav.orders') },
    { to: PATHS.WISHLIST, label: t('nav.wishlist') },
  ];

  const displayName = user?.fullName || user?.name || user?.email || 'User';
  const initial = displayName.trim().charAt(0).toUpperCase();

  return (
    <div className={styles.page} data-testid="account-page">
      <Container>
        <header className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>{t('page.title')}</h1>
          <p className={styles.pageSubtitle}>{t('page.subtitle')}</p>
        </header>

        <div className={styles.layout}>
          <aside className={styles.sidebar} aria-label={t('nav.ariaLabel')}>
            <div className={styles.userSummary}>
              <div className={styles.avatar} aria-hidden="true">
                {initial}
              </div>
              <div className={styles.userInfo}>
                <div className={styles.userName}>{displayName}</div>
                <div className={styles.userEmail}>{user?.email}</div>
              </div>
            </div>

            <div className={styles.sidebarCard}>
              <AccountNav links={accountLinks} ariaLabel={t('nav.ariaLabel')} />
            </div>

            <Button
              variant="quiet"
              className={styles.signOutBtn}
              onClick={handleSignOut}
              data-testid="logout-button"
            >
              {t('logout.button')}
            </Button>
          </aside>

          <main className={styles.content}>
            <PersonalInfoSection user={user} />
            <AddressesSection user={user} />
            <NotificationsSection user={user} />
          </main>
        </div>
      </Container>
    </div>
  );
}

export default Account;
