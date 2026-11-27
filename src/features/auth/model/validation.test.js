import { DEMO_ACCOUNT } from './demoAccounts';
import {
  validateAddress,
  validateProfile,
  validateRegistration,
  validateSignIn,
} from './validation';

const registration = {
  fullName: 'Mona Adel',
  email: 'mona@example.com',
  phone: '01012345678',
  password: 'laptop2026',
  confirmPassword: 'laptop2026',
};
const errorsOf = (changes) => validateRegistration({ ...registration, ...changes }, [DEMO_ACCOUNT]);

it('accepts a complete registration', () => {
  expect(errorsOf({})).toEqual({});
});

it.each([
  [{ fullName: ' ' }, { fullName: 'fullNameRequired' }],
  [{ fullName: 'Mo' }, { fullName: 'fullNameLength' }],
  [{ email: 'mona' }, { email: 'emailInvalid' }],
  [{ email: 'MARWAN@worktech.com' }, { email: 'emailTaken' }],
  [{ phone: '0101' }, { phone: 'phoneInvalid' }],
  [{ confirmPassword: 'other' }, { confirmPassword: 'passwordMismatch' }],
])('rejects %o', (changes, expected) => {
  expect(errorsOf(changes)).toEqual(expected);
});

it.each(['short1', 'onlyletters', '12345678'])('rejects the weak password %s', (password) => {
  expect(errorsOf({ password, confirmPassword: password })).toEqual({ password: 'passwordWeak' });
});

it('needs an email and a password to sign in', () => {
  expect(validateSignIn({ email: '', password: '' })).toEqual({
    email: 'emailRequired',
    password: 'passwordRequired',
  });
});

it('checks the profile and the address', () => {
  expect(validateProfile({ fullName: 'Mona Adel', phone: '' })).toEqual({ phone: 'phoneRequired' });
  expect(
    validateAddress({ fullName: 'Mona Adel', phone: '01012345678', city: '', address: 'Short' }),
  ).toEqual({ city: 'cityRequired', address: 'addressLength' });
});
