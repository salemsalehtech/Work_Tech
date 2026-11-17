import { forwardRef } from 'react';

import Field from '../Field';
import { describedBy } from '../Field/describedBy';
import fieldStyles from '../Field/Field.module.css';

/**
 * Labelled text field. `optionalText` adds "(optional)" after the label.
 * size: md (46px, checkout and account) | lg (48px, sign in and contact)
 */
const Input = forwardRef(function Input(
  { id, label, optionalText, hint, error, size = 'md', className, ...rest },
  ref,
) {
  return (
    <Field
      id={id}
      label={label}
      optionalText={optionalText}
      hint={hint}
      error={error}
      className={className}
    >
      <input
        ref={ref}
        id={id}
        className={[fieldStyles.control, size === 'lg' && fieldStyles.large]
          .filter(Boolean)
          .join(' ')}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, { hint, error })}
        {...rest}
      />
    </Field>
  );
});

export default Input;
