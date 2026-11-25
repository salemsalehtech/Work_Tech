import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';

import { updateProfile } from '@features/auth';
import { Icon, Toggle } from '@shared/components/ui';

import styles from './Account.module.css';

const DEFAULT_PREFERENCES = {
  orderUpdates: true,
  promotions: false,
  priceDrops: true,
  newsletter: false,
};

function NotificationsSection({ user }) {
  const { t } = useTranslation('account');
  const dispatch = useDispatch();
  const [feedback, setFeedback] = useState('');

  const currentPrefs = {
    ...DEFAULT_PREFERENCES,
    ...(user?.notifications || {}),
  };

  const handleToggle = (key, checked) => {
    const nextPrefs = {
      ...currentPrefs,
      [key]: checked,
    };

    dispatch(updateProfile({ notifications: nextPrefs }));
    setFeedback(t('notifications.savedFeedback'));
  };

  const notificationCategories = [
    {
      key: 'orderUpdates',
      label: t('notifications.orderUpdates.label'),
      description: t('notifications.orderUpdates.description'),
    },
    {
      key: 'promotions',
      label: t('notifications.promotions.label'),
      description: t('notifications.promotions.description'),
    },
    {
      key: 'priceDrops',
      label: t('notifications.priceDrops.label'),
      description: t('notifications.priceDrops.description'),
    },
    {
      key: 'newsletter',
      label: t('notifications.newsletter.label'),
      description: t('notifications.newsletter.description'),
    },
  ];

  return (
    <section className={styles.card} aria-labelledby="notifications-heading">
      <div className={styles.sectionHeader}>
        <h2 id="notifications-heading" className={styles.sectionTitle}>
          {t('notifications.title')}
        </h2>
        <p className={styles.sectionSubtitle}>{t('notifications.subtitle')}</p>
      </div>

      {feedback && (
        <div className={styles.alertSuccess} role="status" aria-live="polite">
          <Icon name="check" size={16} />
          <span>{feedback}</span>
        </div>
      )}

      <div className={styles.notificationsList}>
        {notificationCategories.map(({ key, label, description }) => (
          <div key={key} className={styles.notificationItem}>
            <div className={styles.notificationText}>
              <h3 className={styles.notificationLabel}>{label}</h3>
              <p className={styles.notificationDescription}>{description}</p>
            </div>
            <Toggle
              id={`toggle-${key}`}
              label={label}
              checked={Boolean(currentPrefs[key])}
              onChange={(checked) => handleToggle(key, checked)}
            />
          </div>
        ))}
      </div>
    </section>
  );
}

export default NotificationsSection;
