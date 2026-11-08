import { Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import { Outlet } from 'react-router-dom';
function Layout() {
  const { t } = useTranslation();
  return (
    <>
      <header>{t('app.name')}</header>
      <main>
        <Suspense fallback={<p>{t('common.loading')}</p>}>
          <Outlet />
        </Suspense>
      </main>
      <footer>{t('app.name')}</footer>
    </>
  );
}
export default Layout;
