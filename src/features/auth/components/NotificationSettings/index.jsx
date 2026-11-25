import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';

import { Toggle } from '@shared/components/ui';

import { updateProfile } from '../../authSlice';
import AccountSection from '../AccountSection';

import styles from './NotificationSettings.module.css';

const DEFAULTS = { orderUpdates: true, priceDrops: true, promotions: false, newsletter: false };

function NotificationSettings({ notifications }) {
  const { t } = useTranslation('account');
  const dispatch = useDispatch();
  const [message, setMessage] = useState('');
  const settings = { ...DEFAULTS, ...notifications };

  const handleChange = (name, enabled) => {
    dispatch(updateProfile({ notifications: { ...settings, [name]: enabled } }));
    setMessage(t('notifications.saved'));
  };

  return (
    <AccountSection title={t('notifications.title')} message={message}>
      <div>
        {Object.keys(DEFAULTS).map((name) => (
          <div key={name} className={styles.row}>
            <Toggle
              id={`notification-${name}`}
              label={t(`notifications.${name}.label`)}
              description={t(`notifications.${name}.description`)}
              checked={settings[name]}
              onChange={(enabled) => handleChange(name, enabled)}
            />
          </div>
        ))}
      </div>
    </AccountSection>
  );
}

export default NotificationSettings;
