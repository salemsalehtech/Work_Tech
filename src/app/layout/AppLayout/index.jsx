import { Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import { Outlet, ScrollRestoration } from 'react-router-dom';

import { Container, Skeleton } from '@shared/components/ui';

import SiteFooter from '../SiteFooter';
import SiteHeader from '../SiteHeader';

import styles from './AppLayout.module.css';

function PageLoading() {
  const { t } = useTranslation();
  return (
    <Container className={styles.pageLoading} role="status" aria-label={t('status.loading')}>
      <Skeleton width="30%" height={14} />
      <Skeleton width="55%" height={36} />
      <Skeleton height={240} radius="var(--radius-lg)" />
    </Container>
  );
}

/** Frame of every page: skip link, header, the page, footer. */
function AppLayout() {
  const { t } = useTranslation('layout');

  return (
    <div className={styles.layout}>
      <a href="#main" className={styles.skipLink}>
        {t('skipToContent')}
      </a>
      <SiteHeader />
      <main id="main" className={styles.main} tabIndex={-1}>
        <Suspense fallback={<PageLoading />}>
          <Outlet />
        </Suspense>
      </main>
      <SiteFooter />
      <ScrollRestoration />
    </div>
  );
}

export default AppLayout;
