import { useId } from 'react';

function ChoiceList({
  legend,
  options = [],
  value,
  onChange,
  multiple = false,
  name,
  variant = 'list',
}) {
  const autoName = useId();
  const groupName = name || autoName;
  const type = multiple ? 'checkbox' : 'radio';
  const isChecked = (v) => (multiple ? (value || []).includes(v) : value === v);
  const handleChange = (v) => {
    if (!multiple) return onChange(v);
    const current = value || [];
    onChange(current.includes(v) ? current.filter((x) => x !== v) : [...current, v]);
  };
  return (
    <fieldset className={`choiceList ${variant}`}>
      <legend>{legend}</legend>
      <div className="choiceList-options">
        {options.map((option) => {
          const id = `${groupName}-${option.value}`;
          return (
            <div className="choiceList_item" key={option.value}>
              <input
                id={id}
                className="choiceList_input"
                type={type}
                name={groupName}
                value={option.value}
                checked={isChecked(option.value)}
                disabled={option.disabled}
                onChange={() => handleChange(option.value)}
              />
              <label htmlFor={id} className="choiceList_label">
                <span className="choiceList_title">{option.label}</span>
                {option.description && (
                  <span className="choiceList_desc">{option.description}</span>
                )}
              </label>
            </div>
          );
        })}
      </div>
    </fieldset>
  );
}

export default ChoiceList;
