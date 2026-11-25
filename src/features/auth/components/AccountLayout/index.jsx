import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { AccountNav, Button, Container } from '@shared/components/ui';
import { PATHS } from '@shared/constants';

import { signOut } from '../../authSlice';

import styles from './AccountLayout.module.css';

/** Title, side navigation and content of Account, My orders, Order details and Wishlist. */
function AccountLayout({ title, children }) {
  const { t } = useTranslation('account');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Leaves the page first: signing out on a protected page would send the guest to sign in.
  const handleSignOut = async () => {
    await navigate(PATHS.HOME, { flushSync: true });
    dispatch(signOut());
  };

  return (
    <Container className={styles.page}>
      <h1 className={styles.title}>{title}</h1>
      <div className={styles.layout}>
        <div className={styles.side}>
          <AccountNav
            links={[
              { to: PATHS.ACCOUNT, label: t('nav.account'), end: true },
              { to: PATHS.ORDERS, label: t('nav.orders') },
              { to: PATHS.WISHLIST, label: t('nav.wishlist') },
            ]}
          />
          <Button variant="danger" className={styles.signOut} onClick={handleSignOut}>
            {t('nav.signOut')}
          </Button>
        </div>
        <div className={styles.content}>{children}</div>
      </div>
    </Container>
  );
}

export default AccountLayout;
