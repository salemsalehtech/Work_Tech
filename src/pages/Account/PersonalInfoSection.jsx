import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';

import { updateProfile } from '@features/auth';
import { Button, Icon, Input } from '@shared/components/ui';
import { isEgyptianMobile } from '@shared/utils';

import styles from './Account.module.css';

function PersonalInfoSection({ user }) {
  const { t } = useTranslation('account');
  const dispatch = useDispatch();

  const [fullName, setFullName] = useState(user?.fullName || user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [prevUser, setPrevUser] = useState(user);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (user !== prevUser) {
    setPrevUser(user);
    setFullName(user?.fullName || user?.name || '');
    setPhone(user?.phone || '');
  }

  const handleNameChange = (e) => {
    setFullName(e.target.value);
    if (errors.fullName) setErrors((prev) => ({ ...prev, fullName: undefined }));
    if (success) setSuccess('');
  };

  const handlePhoneChange = (e) => {
    setPhone(e.target.value);
    if (errors.phone) setErrors((prev) => ({ ...prev, phone: undefined }));
    if (success) setSuccess('');
  };

  const validate = () => {
    const nextErrors = {};
    const trimmedName = fullName.trim();
    const trimmedPhone = phone.trim();

    if (!trimmedName) {
      nextErrors.fullName = t('profile.validation.nameRequired');
    } else if (trimmedName.length < 3 || trimmedName.length > 60) {
      nextErrors.fullName = t('profile.validation.nameLength');
    }

    if (!trimmedPhone) {
      nextErrors.phone = t('profile.validation.phoneRequired');
    } else if (!isEgyptianMobile(trimmedPhone)) {
      nextErrors.phone = t('profile.validation.phoneInvalid');
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (!validate()) return;

    setIsSubmitting(true);
    const trimmedName = fullName.trim();
    const trimmedPhone = phone.trim();

    dispatch(
      updateProfile({
        fullName: trimmedName,
        name: trimmedName,
        phone: trimmedPhone,
      }),
    );

    setIsSubmitting(false);
    setSuccess(t('profile.successMessage'));
  };

  return (
    <section className={styles.card} aria-labelledby="personal-info-heading">
      <div className={styles.sectionHeader}>
        <h2 id="personal-info-heading" className={styles.sectionTitle}>
          {t('profile.title')}
        </h2>
        <p className={styles.sectionSubtitle}>{t('profile.subtitle')}</p>
      </div>

      {success && (
        <div className={styles.alertSuccess} role="status" aria-live="polite">
          <Icon name="check" size={16} />
          <span>{success}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className={styles.form} noValidate>
        <div className={styles.formGrid}>
          <Input
            id="account-full-name"
            name="fullName"
            type="text"
            label={t('profile.fullName')}
            placeholder={t('profile.fullNamePlaceholder')}
            value={fullName}
            onChange={handleNameChange}
            error={errors.fullName}
            required
          />

          <Input
            id="account-phone"
            name="phone"
            type="tel"
            label={t('profile.phone')}
            placeholder={t('profile.phonePlaceholder')}
            value={phone}
            onChange={handlePhoneChange}
            error={errors.phone}
            required
          />
        </div>

        <div>
          <Input
            id="account-email"
            name="email"
            type="email"
            label={t('profile.email')}
            value={user?.email || ''}
            disabled
            readOnly
          />
          <p className={styles.emailNote}>{t('profile.emailNote')}</p>
        </div>

        <div className={styles.formActions}>
          <Button type="submit" variant="primary" loading={isSubmitting} disabled={isSubmitting}>
            {isSubmitting ? t('profile.saving') : t('profile.saveChanges')}
          </Button>
        </div>
      </form>
    </section>
  );
}

export default PersonalInfoSection;
