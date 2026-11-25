import { forwardRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Icon } from '@shared/components/ui';
import Field from '@shared/components/ui/Field';
import { describedBy } from '@shared/components/ui/Field/describedBy';
import fieldStyles from '@shared/components/ui/Field/Field.module.css';

import styles from './Auth.module.css';

/**
 * Labelled password field with visibility toggle and full accessibility support.
 */
const PasswordInput = forwardRef(function PasswordInput(
  { id, label, optionalText, hint, error, size = 'lg', className, ...rest },
  ref,
) {
  const { t } = useTranslation('account');
  const [showPassword, setShowPassword] = useState(false);

  return (
    <Field
      id={id}
      label={label}
      optionalText={optionalText}
      hint={hint}
      error={error}
      className={className}
    >
      <div className={styles.passwordWrapper}>
        <input
          ref={ref}
          id={id}
          type={showPassword ? 'text' : 'password'}
          className={[
            fieldStyles.control,
            size === 'lg' && fieldStyles.large,
            styles.passwordControl,
          ]
            .filter(Boolean)
            .join(' ')}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy(id, { hint, error })}
          {...rest}
        />
        <button
          type="button"
          className={styles.passwordToggle}
          onClick={() => setShowPassword((prev) => !prev)}
          aria-label={showPassword ? t('auth.fields.hidePassword') : t('auth.fields.showPassword')}
          tabIndex={0}
        >
          <Icon name={showPassword ? 'eyeOff' : 'eye'} size={18} />
        </button>
      </div>
    </Field>
  );
});

export default PasswordInput;
