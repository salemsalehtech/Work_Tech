import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector, useStore } from 'react-redux';

import { clearAuthError, DEMO_CREDENTIALS, selectAuthError, signIn } from '@features/auth';
import { Button, Icon, Input } from '@shared/components/ui';
import { isEmail } from '@shared/utils';

import styles from './Auth.module.css';
import DemoCredentials from './DemoCredentials';
import PasswordInput from './PasswordInput';

/**
 * Sign In Form Component.
 */
function SignIn({ onSwitchToRegister, onSignInSuccess }) {
  const { t } = useTranslation('account');
  const dispatch = useDispatch();
  const store = useStore();
  const authError = useSelector(selectAuthError);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    if (formErrors.email) {
      setFormErrors((prev) => ({ ...prev, email: undefined }));
    }
    if (authError) {
      dispatch(clearAuthError());
    }
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    if (formErrors.password) {
      setFormErrors((prev) => ({ ...prev, password: undefined }));
    }
    if (authError) {
      dispatch(clearAuthError());
    }
  };

  const validate = () => {
    const errors = {};
    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      errors.email = t('auth.validation.emailRequired');
    } else if (!isEmail(trimmedEmail)) {
      errors.email = t('auth.validation.emailInvalid');
    }

    if (!password) {
      errors.password = t('auth.validation.passwordRequired');
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (!validate()) {
      return;
    }

    setIsSubmitting(true);
    dispatch(signIn({ email: email.trim(), password }));

    const currentError = store.getState().auth.error;
    setIsSubmitting(false);

    if (!currentError && onSignInSuccess) {
      onSignInSuccess();
    }
  };

  const handleFillDemo = () => {
    setEmail(DEMO_CREDENTIALS.email);
    setPassword(DEMO_CREDENTIALS.password);
    setFormErrors({});
    if (authError) {
      dispatch(clearAuthError());
    }
  };

  // Localize backend/slice auth errors
  const displayAuthError = authError
    ? authError === 'No account found with this email'
      ? t('auth.errors.accountNotFound')
      : authError === 'Incorrect password'
        ? t('auth.errors.incorrectPassword')
        : authError === 'Email and password are required'
          ? t('auth.validation.emailRequired')
          : authError
    : null;

  return (
    <div data-testid="sign-in-page">
      <form onSubmit={handleSubmit} className={styles.form} noValidate>
        {displayAuthError && (
          <div className={styles.alertError} role="alert" aria-live="polite">
            <Icon name="close" size={16} className={styles.alertIcon} />
            <span>{displayAuthError}</span>
          </div>
        )}

        <Input
          id="signin-email"
          name="email"
          type="email"
          label={t('auth.fields.email')}
          placeholder={t('auth.fields.emailPlaceholder')}
          value={email}
          onChange={handleEmailChange}
          error={formErrors.email}
          size="lg"
          autoComplete="email"
          required
        />

        <PasswordInput
          id="signin-password"
          name="password"
          label={t('auth.fields.password')}
          placeholder={t('auth.fields.passwordPlaceholder')}
          value={password}
          onChange={handlePasswordChange}
          error={formErrors.password}
          size="lg"
          autoComplete="current-password"
          required
        />

        <Button
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          loading={isSubmitting}
          disabled={isSubmitting}
          className={styles.submitBtn}
        >
          {isSubmitting ? t('auth.actions.signingIn') : t('auth.actions.signIn')}
        </Button>
      </form>

      {onSwitchToRegister && (
        <div className={styles.switchPrompt}>
          <span>{t('auth.actions.dontHaveAccount')}</span>
          <button type="button" className={styles.switchLink} onClick={onSwitchToRegister}>
            {t('auth.actions.goToSignUp')}
          </button>
        </div>
      )}

      {/* Demo account credentials displayed below the Sign In form */}
      <DemoCredentials onFillDemo={handleFillDemo} />
    </div>
  );
}

export default SignIn;
