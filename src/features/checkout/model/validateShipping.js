import { isEgyptianMobile } from '@shared/utils';

const validateShipping = (values = {}) => {
  const fields = ['fullName', 'phone', 'city', 'address'];

  for (const field of fields) {
    if (!String(values[field] ?? '').trim()) {
      return {
        field,
        errorKey: `errors.${field}.required`,
      };
    }
  }

  if (!isEgyptianMobile(values.phone)) {
    return {
      field: 'phone',
      errorKey: 'errors.phone.invalid',
    };
  }

  return null;
};

export default validateShipping;
export { validateShipping };
