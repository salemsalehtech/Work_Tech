import { forwardRef } from 'react';

import Field from '../Field';
import { describedBy } from '../Field/describedBy';
import fieldStyles from '../Field/Field.module.css';

/**
 * Native select styled like Input. options: [{ value, label }].
 * Without a visible `label` (Sort), pass aria-label instead.
 */
const Select = forwardRef(function Select(
  { id, label, hint, error, options = [], className, ...rest },
  ref,
) {
  const select = (
    <select
      ref={ref}
      id={id}
      className={fieldStyles.control}
      aria-invalid={error ? true : undefined}
      aria-describedby={describedBy(id, { hint, error })}
      {...rest}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );

  if (!label) return <div className={className}>{select}</div>;

  return (
    <Field id={id} label={label} hint={hint} error={error} className={className}>
      {select}
    </Field>
  );
});

export default Select;
