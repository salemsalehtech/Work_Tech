import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector, useStore } from 'react-redux';

import { clearAuthError, register, selectAuthError, signIn } from '@features/auth';
import { Button, Icon, Input } from '@shared/components/ui';
import { isEgyptianMobile, isEmail } from '@shared/utils';

import styles from './Auth.module.css';
import PasswordInput from './PasswordInput';

/**
 * Create Account / Registration Page Component.
 */
function CreateAccount({ onSwitchToSignIn, onRegisterSuccess }) {
  const { t } = useTranslation('account');
  const dispatch = useDispatch();
  const store = useStore();
  const authError = useSelector(selectAuthError);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (field) => (e) => {
    const value = e.target.value;
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (formErrors[field]) {
      setFormErrors((prev) => ({ ...prev, [field]: undefined }));
    }
    if (authError) {
      dispatch(clearAuthError());
    }
  };

  const validate = () => {
    const errors = {};
    const trimmedName = formData.fullName.trim();
    const trimmedEmail = formData.email.trim();
    const trimmedPhone = formData.phone.trim();
    const pass = formData.password;
    const confirmPass = formData.confirmPassword;

    if (!trimmedName) {
      errors.fullName = t('auth.validation.fullNameRequired');
    }

    if (!trimmedEmail) {
      errors.email = t('auth.validation.emailRequired');
    } else if (!isEmail(trimmedEmail)) {
      errors.email = t('auth.validation.emailInvalid');
    }

    if (!trimmedPhone) {
      errors.phone = t('auth.validation.phoneRequired');
    } else if (!isEgyptianMobile(trimmedPhone)) {
      errors.phone = t('auth.validation.phoneInvalid');
    }

    if (!pass) {
      errors.password = t('auth.validation.passwordRequired');
    } else if (pass.length < 8) {
      errors.password = t('auth.validation.passwordMinLength');
    }

    if (!confirmPass) {
      errors.confirmPassword = t('auth.validation.confirmPasswordRequired');
    } else if (confirmPass !== pass) {
      errors.confirmPassword = t('auth.validation.passwordsMismatch');
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
    const trimmedEmail = formData.email.trim();
    const pass = formData.password;

    dispatch(
      register({
        fullName: formData.fullName.trim(),
        email: trimmedEmail,
        phone: formData.phone.trim(),
        password: pass,
      }),
    );

    const postRegisterError = store.getState().auth.error;

    if (postRegisterError) {
      setIsSubmitting(false);
      return;
    }

    // Automatically authenticate the newly registered user
    dispatch(signIn({ email: trimmedEmail, password: pass }));

    const postSignInError = store.getState().auth.error;
    setIsSubmitting(false);

    if (!postSignInError && onRegisterSuccess) {
      onRegisterSuccess();
    }
  };

  // Localize backend/slice auth error messages
  const displayAuthError = authError
    ? authError === 'An account with this email already exists'
      ? t('auth.errors.emailExists')
      : authError === 'Full name is required'
        ? t('auth.validation.fullNameRequired')
        : authError === 'A valid email is required'
          ? t('auth.validation.emailInvalid')
          : authError === 'Password must be at least 8 characters'
            ? t('auth.validation.passwordMinLength')
            : authError
    : null;

  return (
    <div data-testid="create-account-page">
      <form onSubmit={handleSubmit} className={styles.form} noValidate>
        {displayAuthError && (
          <div className={styles.alertError} role="alert" aria-live="polite">
            <Icon name="close" size={16} className={styles.alertIcon} />
            <span>{displayAuthError}</span>
          </div>
        )}

        <Input
          id="register-fullName"
          name="fullName"
          type="text"
          label={t('auth.fields.fullName')}
          placeholder={t('auth.fields.fullNamePlaceholder')}
          value={formData.fullName}
          onChange={handleChange('fullName')}
          error={formErrors.fullName}
          size="lg"
          autoComplete="name"
          required
        />

        <Input
          id="register-email"
          name="email"
          type="email"
          label={t('auth.fields.email')}
          placeholder={t('auth.fields.emailPlaceholder')}
          value={formData.email}
          onChange={handleChange('email')}
          error={formErrors.email}
          size="lg"
          autoComplete="email"
          required
        />

        <Input
          id="register-phone"
          name="phone"
          type="tel"
          label={t('auth.fields.phone')}
          placeholder={t('auth.fields.phonePlaceholder')}
          value={formData.phone}
          onChange={handleChange('phone')}
          error={formErrors.phone}
          size="lg"
          autoComplete="tel"
          required
        />

        <PasswordInput
          id="register-password"
          name="password"
          label={t('auth.fields.password')}
          placeholder={t('auth.fields.passwordPlaceholder')}
          value={formData.password}
          onChange={handleChange('password')}
          error={formErrors.password}
          size="lg"
          autoComplete="new-password"
          required
        />

        <PasswordInput
          id="register-confirmPassword"
          name="confirmPassword"
          label={t('auth.fields.confirmPassword')}
          placeholder={t('auth.fields.confirmPasswordPlaceholder')}
          value={formData.confirmPassword}
          onChange={handleChange('confirmPassword')}
          error={formErrors.confirmPassword}
          size="lg"
          autoComplete="new-password"
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
          {isSubmitting ? t('auth.actions.creatingAccount') : t('auth.actions.createAccount')}
        </Button>
      </form>

      {onSwitchToSignIn && (
        <div className={styles.switchPrompt}>
          <span>{t('auth.actions.alreadyHaveAccount')}</span>
          <button type="button" className={styles.switchLink} onClick={onSwitchToSignIn}>
            {t('auth.actions.goToSignIn')}
          </button>
        </div>
      )}
    </div>
  );
}

export default CreateAccount;
