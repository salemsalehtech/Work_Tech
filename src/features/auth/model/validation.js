import { isEgyptianMobile, isEmail } from '@shared/utils';

import { findByEmail } from './accounts';

// Every rule returns an error code (a key of account:errors), or undefined.
const rules = {
  fullName(value) {
    const { length } = value.trim();
    if (length === 0) return 'fullNameRequired';
    return length < 3 || length > 60 ? 'fullNameLength' : undefined;
  },
  email(value) {
    if (!value.trim()) return 'emailRequired';
    return isEmail(value) ? undefined : 'emailInvalid';
  },
  phone(value) {
    if (!value.trim()) return 'phoneRequired';
    return isEgyptianMobile(value) ? undefined : 'phoneInvalid';
  },
  password: (value) => (value ? undefined : 'passwordRequired'),
  newPassword(value) {
    if (!value) return 'passwordRequired';
    return /^(?=.*\p{L})(?=.*\d).{8,}$/u.test(value) ? undefined : 'passwordWeak';
  },
  city: (value) => (value.trim() ? undefined : 'cityRequired'),
  address: (value) => (value.trim().length < 10 ? 'addressLength' : undefined),
};

const check = (values, fieldRules) =>
  Object.fromEntries(
    Object.entries(fieldRules)
      .map(([field, rule]) => [field, rule(values[field])])
      .filter(([, code]) => code),
  );

export const validateSignIn = (values) =>
  check(values, { email: rules.email, password: rules.password });

export const validateProfile = (values) =>
  check(values, { fullName: rules.fullName, phone: rules.phone });

export const validateAddress = (values) =>
  check(values, {
    fullName: rules.fullName,
    phone: rules.phone,
    city: rules.city,
    address: rules.address,
  });

export const validateRegistration = (values, accounts) =>
  check(values, {
    fullName: rules.fullName,
    email: (email) => rules.email(email) ?? (findByEmail(accounts, email) && 'emailTaken'),
    phone: rules.phone,
    password: rules.newPassword,
    confirmPassword: (value) => (value === values.password ? undefined : 'passwordMismatch'),
  });
