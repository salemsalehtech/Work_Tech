import { forwardRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import Field from '../Field';
import { describedBy } from '../Field/describedBy';
import fieldStyles from '../Field/Field.module.css';

import styles from './PasswordInput.module.css';

/** Labelled password field with a Show / Hide button. Same props as Input. */
const PasswordInput = forwardRef(function PasswordInput(
  { id, label, hint, error, size = 'md', className, ...rest },
  ref,
) {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);

  return (
    <Field id={id} label={label} hint={hint} error={error} className={className}>
      <div className={styles.wrapper}>
        <input
          ref={ref}
          id={id}
          type={visible ? 'text' : 'password'}
          className={[fieldStyles.control, size === 'lg' && fieldStyles.large, styles.control]
            .filter(Boolean)
            .join(' ')}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy(id, { hint, error })}
          {...rest}
        />
        <button
          type="button"
          className={styles.toggle}
          aria-label={t(visible ? 'password.hideLabel' : 'password.showLabel')}
          onClick={() => setVisible((current) => !current)}
        >
          {t(visible ? 'password.hide' : 'password.show')}
        </button>
      </div>
    </Field>
  );
});

export default PasswordInput;
