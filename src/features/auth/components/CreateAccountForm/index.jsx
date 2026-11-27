import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import { Button, Checkbox, Input, PasswordInput } from '@shared/components/ui';
import { useForm } from '@shared/hooks';

import { register, selectAccounts } from '../../authSlice';
import { validateRegistration } from '../../model/validation';

import styles from './CreateAccountForm.module.css';

const INITIAL_VALUES = {
  fullName: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: '',
  priceDrops: true,
};

function CreateAccountForm() {
  const { t } = useTranslation('account');
  const dispatch = useDispatch();
  const accounts = useSelector(selectAccounts);
  const form = useForm({
    initialValues: INITIAL_VALUES,
    validate: (values) => validateRegistration(values, accounts),
  });

  const fieldProps = (name) => ({
    id: `register-${name}`,
    size: 'lg',
    label: t(`fields.${name}`),
    error: form.errorOf(name) && t(`errors.${form.errorOf(name)}`),
    ...form.field(name),
  });

  const handleRegister = ({ priceDrops, ...account }) =>
    dispatch(register({ ...account, notifications: { priceDrops } }));

  return (
    <form className={styles.form} onSubmit={form.handleSubmit(handleRegister)} noValidate>
      <Input {...fieldProps('fullName')} autoComplete="name" />
      <Input
        {...fieldProps('email')}
        type="email"
        placeholder={t('fields.emailPlaceholder')}
        autoComplete="email"
      />
      <Input
        {...fieldProps('phone')}
        type="tel"
        placeholder={t('fields.phonePlaceholder')}
        autoComplete="tel"
      />
      <PasswordInput
        {...fieldProps('password')}
        hint={t('fields.passwordHint')}
        autoComplete="new-password"
      />
      <PasswordInput {...fieldProps('confirmPassword')} autoComplete="new-password" />
      <Checkbox
        label={t('register.priceDrops')}
        checked={form.values.priceDrops}
        onChange={(event) => form.setValue('priceDrops', event.target.checked)}
      />
      <Button type="submit" size="xl" fullWidth>
        {t('register.submit')}
      </Button>
      <p className={styles.note}>{t('register.note')}</p>
    </form>
  );
}

export default CreateAccountForm;
