import { useId } from 'react';

import styles from './ChoiceList.module.css';

/**
 * Radios, or checkboxes with `multiple`, where the whole row is the target.
 * options: [{ value, label, description?, aside?, disabled? }]. variant: stacked | cards
 * Leave `legend` out inside a FilterGroup, which already names the group.
 */
function ChoiceList({
  legend,
  options = [],
  value,
  onChange,
  multiple = false,
  name,
  variant = 'stacked',
}) {
  const autoName = useId();
  const isChecked = (option) => (multiple ? value.includes(option) : value === option);

  const handleChange = (option) => {
    if (!multiple) onChange?.(option);
    else if (value.includes(option)) onChange?.(value.filter((item) => item !== option));
    else onChange?.([...value, option]);
  };

  return (
    <fieldset className={styles.fieldset}>
      {legend && <legend className={styles.legend}>{legend}</legend>}
      <div className={styles[variant]}>
        {options.map((option) => (
          <label key={option.value} className={styles.choice}>
            <input
              type={multiple ? 'checkbox' : 'radio'}
              name={name ?? autoName}
              value={option.value}
              checked={isChecked(option.value)}
              disabled={option.disabled}
              onChange={() => handleChange(option.value)}
            />
            <span className={styles.text}>
              <span className={styles.title}>
                <bdi>{option.label}</bdi>
              </span>
              {option.description && (
                <span className={styles.description}>{option.description}</span>
              )}
            </span>
            {option.aside && <span className={styles.aside}>{option.aside}</span>}
          </label>
        ))}
      </div>
    </fieldset>
  );
}

export default ChoiceList;
