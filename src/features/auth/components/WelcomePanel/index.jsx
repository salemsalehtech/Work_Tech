import { useTranslation } from 'react-i18next';

import logo from '@shared/assets/brand/worktech-logo.jpg';

import styles from './WelcomePanel.module.css';

const BENEFITS = ['track', 'alerts', 'compare'];

/** Dark side of the sign in page, on desktop only. */
function WelcomePanel() {
  const { t } = useTranslation('account');

  return (
    <aside className={styles.panel}>
      <img className={styles.logo} src={logo} alt="" />
      <p className={styles.title}>{t('welcome.title')}</p>
      <ol className={styles.benefits}>
        {BENEFITS.map((benefit) => (
          <li key={benefit}>{t(`welcome.${benefit}`)}</li>
        ))}
      </ol>
      <p className={styles.tagline}>{t('common:app.tagline')}</p>
    </aside>
  );
}

export default WelcomePanel;
