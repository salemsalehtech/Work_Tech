import { useTranslation } from 'react-i18next';

import { DEMO_CREDENTIALS } from '@features/auth';
import { Button } from '@shared/components/ui';

import styles from './Auth.module.css';

/**
 * Displays the official demo account credentials below the Sign In form.
 * The evaluation team can inspect these credentials or click to populate the form directly.
 */
function DemoCredentials({ onFillDemo }) {
  const { t } = useTranslation('account');

  return (
    <div className={styles.demoBox} data-testid="demo-credentials">
      <div className={styles.demoHeader}>
        <h3 className={styles.demoTitle}>{t('auth.demo.title')}</h3>
        <span className={styles.demoBadge}>{t('auth.demo.badge')}</span>
      </div>
      <p className={styles.demoSubtitle}>{t('auth.demo.subtitle')}</p>
      <div className={styles.demoGrid}>
        <div className={styles.demoRow}>
          <span className={styles.demoLabel}>{t('auth.demo.email')}</span>
          <code className={styles.demoValue} data-testid="demo-email">
            {DEMO_CREDENTIALS.email}
          </code>
        </div>
        <div className={styles.demoRow}>
          <span className={styles.demoLabel}>{t('auth.demo.password')}</span>
          <code className={styles.demoValue} data-testid="demo-password">
            {DEMO_CREDENTIALS.password}
          </code>
        </div>
      </div>
      {onFillDemo && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          className={styles.demoFillBtn}
          onClick={onFillDemo}
        >
          {t('auth.demo.fillButton')}
        </Button>
      )}
    </div>
  );
}

export default DemoCredentials;
