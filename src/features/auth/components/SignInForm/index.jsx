import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';

import { Button, Input, PasswordInput } from '@shared/components/ui';
import { useForm } from '@shared/hooks';

import { signIn } from '../../authSlice';
import { DEMO_ACCOUNT } from '../../model/demoAccounts';
import { validateSignIn } from '../../model/validation';
import DemoCredentials from '../DemoCredentials';

import styles from './SignInForm.module.css';

function SignInForm() {
  const { t } = useTranslation('account');
  const dispatch = useDispatch();
  const form = useForm({ initialValues: { email: '', password: '' }, validate: validateSignIn });
  // The values that were refused: the message goes away as soon as they change.
  const [refused, setRefused] = useState(null);

  const errorText = (name) => form.errorOf(name) && t(`errors.${form.errorOf(name)}`);

  const handleSignIn = (values) => {
    if (!dispatch(signIn(values))) setRefused(values);
  };

  return (
    <>
      <form className={styles.form} onSubmit={form.handleSubmit(handleSignIn)} noValidate>
        {refused === form.values && (
          <p className={styles.refused} role="alert">
            {t('errors.invalidCredentials')}
          </p>
        )}
        <Input
          id="sign-in-email"
          type="email"
          size="lg"
          label={t('fields.email')}
          placeholder={t('fields.emailPlaceholder')}
          autoComplete="email"
          error={errorText('email')}
          {...form.field('email')}
        />
        <PasswordInput
          id="sign-in-password"
          size="lg"
          label={t('fields.password')}
          autoComplete="current-password"
          error={errorText('password')}
          {...form.field('password')}
        />
        <Button type="submit" size="xl" fullWidth>
          {t('signIn.submit')}
        </Button>
      </form>

      <DemoCredentials
        account={DEMO_ACCOUNT}
        onUse={({ email, password }) => form.reset({ email, password })}
      />
    </>
  );
}

export default SignInForm;
