import { useTranslation } from 'react-i18next';

import { Button } from '@shared/components/ui';

import styles from './DemoCredentials.module.css';

/** The demo account under the sign in form, with a button that fills it in. */
function DemoCredentials({ account, onUse }) {
  const { t } = useTranslation('account');

  return (
    <section className={styles.box} aria-labelledby="demo-account-title">
      <h2 id="demo-account-title" className={styles.title}>
        {t('demo.title')}
      </h2>
      <dl className={styles.credentials}>
        <div>
          <dt>{t('fields.email')}</dt>
          <dd>{account.email}</dd>
        </div>
        <div>
          <dt>{t('fields.password')}</dt>
          <dd>{account.password}</dd>
        </div>
      </dl>
      <Button variant="outline" fullWidth onClick={() => onUse(account)}>
        {t('demo.use')}
      </Button>
    </section>
  );
}

export default DemoCredentials;
