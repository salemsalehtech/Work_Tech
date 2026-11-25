import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';

import { Button, Input } from '@shared/components/ui';
import { useForm } from '@shared/hooks';

import { updateProfile } from '../../authSlice';
import { validateProfile } from '../../model/validation';
import AccountSection from '../AccountSection';

import styles from './ProfileForm.module.css';

/** Account details. The email is the sign in name, so it cannot change. */
function ProfileForm({ user }) {
  const { t } = useTranslation('account');
  const dispatch = useDispatch();
  const form = useForm({
    initialValues: { fullName: user.fullName, phone: user.phone },
    validate: validateProfile,
  });
  const [savedValues, setSavedValues] = useState(null);

  const fieldProps = (name) => ({
    id: `profile-${name}`,
    label: t(`fields.${name}`),
    error: form.errorOf(name) && t(`errors.${form.errorOf(name)}`),
    ...form.field(name),
  });

  const handleSave = (values) => {
    dispatch(updateProfile({ fullName: values.fullName.trim(), phone: values.phone.trim() }));
    setSavedValues(values);
  };

  return (
    <AccountSection
      title={t('profile.title')}
      message={savedValues === form.values && t('profile.saved')}
    >
      <form className={styles.form} onSubmit={form.handleSubmit(handleSave)} noValidate>
        <Input {...fieldProps('fullName')} autoComplete="name" />
        <Input {...fieldProps('phone')} type="tel" autoComplete="tel" />
        <Input
          id="profile-email"
          label={t('fields.email')}
          hint={t('profile.emailHint')}
          value={user.email}
          disabled
        />
        <div className={styles.actions}>
          <Button type="submit">{t('common:actions.save')}</Button>
        </div>
      </form>
    </AccountSection>
  );
}

export default ProfileForm;
