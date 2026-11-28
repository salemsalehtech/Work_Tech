import { describe, expect, it } from 'vitest';

import { validateShipping } from './validateShipping.js';

describe('validateShipping', () => {
  const validShipping = {
    fullName: 'Ahmed Mohamed',
    phone: '01012345678',
    city: 'Cairo',
    address: 'Nasr City',
  };

  it('returns null for valid shipping data', () => {
    expect(validateShipping(validShipping)).toBeNull();
  });

  it('validates required fields', () => {
    const fields = ['fullName', 'phone', 'city', 'address'];

    fields.forEach((field) => {
      const values = { ...validShipping, [field]: '' };

      expect(validateShipping(values)).toEqual({
        field,
        errorKey: `errors.${field}.required`,
      });
    });
  });

  it('rejects invalid Egyptian mobile numbers', () => {
    const result = validateShipping({
      ...validShipping,
      phone: '123456789',
    });

    expect(result).toEqual({
      field: 'phone',
      errorKey: 'errors.phone.invalid',
    });
  });

  it('handles missing values', () => {
    expect(validateShipping()).toEqual({
      field: 'fullName',
      errorKey: 'errors.fullName.required',
    });
  });
});
