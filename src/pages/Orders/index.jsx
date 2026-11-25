import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { selectCurrentUser, signOut } from '@features/auth';
import { useGetOrdersQuery } from '@features/orders';
import { AccountNav, Button, Container, DataState, EmptyState } from '@shared/components/ui';
import { PATHS } from '@shared/constants';

import styles from './Orders.module.css';
import OrdersList from './OrdersList';
import OrdersSkeleton from './OrdersSkeleton';

function Orders() {
  const { t } = useTranslation('orders');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(selectCurrentUser);

  const ordersResult = useGetOrdersQuery(user?.id, { skip: !user?.id });

  const handleSignOut = () => {
    dispatch(signOut());
    navigate(PATHS.HOME, { replace: true });
  };

  const accountLinks = [
    {
      to: PATHS.ACCOUNT,
      label: t('account:nav.overview', { defaultValue: 'Account Details' }),
      end: true,
    },
    { to: PATHS.ORDERS, label: t('page.title') },
    { to: PATHS.WISHLIST, label: t('account:nav.wishlist', { defaultValue: 'My Wishlist' }) },
  ];

  const displayName = user?.fullName || user?.name || user?.email || 'User';
  const initial = displayName.trim().charAt(0).toUpperCase();

  return (
    <div className={styles.page} data-testid="my-orders-page">
      <Container>
        <header className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>{t('page.title')}</h1>
          <p className={styles.pageSubtitle}>{t('page.subtitle')}</p>
        </header>

        <div className={styles.layout}>
          <aside
            className={styles.sidebar}
            aria-label={t('account:nav.ariaLabel', { defaultValue: 'Account Navigation' })}
          >
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
              <AccountNav
                links={accountLinks}
                ariaLabel={t('account:nav.ariaLabel', { defaultValue: 'Account Navigation' })}
              />
            </div>

            <Button
              variant="quiet"
              className={styles.signOutBtn}
              onClick={handleSignOut}
              data-testid="logout-button"
            >
              {t('account:logout.button', { defaultValue: 'Sign Out' })}
            </Button>
          </aside>

          <main className={styles.content}>
            <DataState
              result={ordersResult}
              loading={<OrdersSkeleton />}
              empty={
                <EmptyState
                  title={t('empty.title')}
                  text={t('empty.text')}
                  action={
                    <Button to={PATHS.PRODUCTS} variant="primary">
                      {t('empty.action')}
                    </Button>
                  }
                />
              }
            >
              {(orders) => <OrdersList orders={orders} />}
            </DataState>
          </main>
        </div>
      </Container>
    </div>
  );
}

export default Orders;
