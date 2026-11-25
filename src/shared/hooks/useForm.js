import { useState } from 'react';

const allTouched = (values) => Object.fromEntries(Object.keys(values).map((name) => [name, true]));

/**
 * Form values with errors that show after a field is left, or on submit.
 * validate(values) returns { field: errorCode }; the component translates the code.
 *   const form = useForm({ initialValues: { email: '' }, validate });
 *   <form onSubmit={form.handleSubmit(save)}><Input {...form.field('email')} error={…form.errorOf('email')} />
 */
export function useForm({ initialValues, validate }) {
  const [values, setValues] = useState(initialValues);
  const [touched, setTouched] = useState({});
  const errors = validate(values);

  const setValue = (name, value) => setValues((current) => ({ ...current, [name]: value }));

  const reset = (nextValues = initialValues) => {
    setValues(nextValues);
    setTouched({});
  };

  const handleSubmit = (onValid) => (event) => {
    event.preventDefault();
    const firstWrong = Object.keys(values).find((name) => errors[name]);
    if (!firstWrong) {
      onValid(values);
      return;
    }
    setTouched(allTouched(values));
    event.currentTarget.elements[firstWrong]?.focus();
  };

  return {
    values,
    setValue,
    reset,
    handleSubmit,
    errorOf: (name) => (touched[name] ? errors[name] : undefined),
    field: (name) => ({
      name,
      value: values[name],
      onChange: (event) => setValue(name, event.target.value),
      onBlur: () => setTouched((current) => ({ ...current, [name]: true })),
    }),
  };
}
