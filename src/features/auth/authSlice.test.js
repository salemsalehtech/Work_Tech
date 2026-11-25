import { configureStore } from '@reduxjs/toolkit';

import authReducer, {
  register,
  selectCurrentUser,
  signIn,
  signOut,
  updateProfile,
} from './authSlice';
import { DEMO_ACCOUNT } from './model/demoAccounts';

const demo = { email: DEMO_ACCOUNT.email, password: DEMO_ACCOUNT.password };
const mona = {
  fullName: 'Mona Adel',
  email: 'mona@example.com',
  phone: '01012345678',
  password: 'laptop2026',
};

const createStore = () => configureStore({ reducer: { auth: authReducer } });
const userOf = (store) => selectCurrentUser(store.getState());

it('signs in with the demo account, whatever the case of the email', () => {
  const store = createStore();

  expect(store.dispatch(signIn({ ...demo, email: ' MARWAN@worktech.com ' }))).toBe(true);
  expect(userOf(store)).toMatchObject({ id: 'demo-user-1', fullName: 'Marwan Tarek' });
});

it('never shows the password of the user', () => {
  const store = createStore();
  store.dispatch(signIn(demo));

  expect(userOf(store)).not.toHaveProperty('password');
});

it('refuses wrong credentials and keeps the signed-in user', () => {
  const store = createStore();
  store.dispatch(signIn(demo));

  expect(store.dispatch(signIn({ ...demo, password: 'wrong' }))).toBe(false);
  expect(store.dispatch(signIn({ ...demo, email: 'nobody@example.com' }))).toBe(false);
  expect(userOf(store).id).toBe('demo-user-1');
});

it('registers an account, signs it in, and lets it sign in again', () => {
  const store = createStore();
  store.dispatch(register(mona));
  expect(userOf(store)).toMatchObject({ fullName: 'Mona Adel', addresses: [] });

  store.dispatch(signOut());
  expect(userOf(store)).toBeNull();
  expect(store.dispatch(signIn(mona))).toBe(true);
});

it('does not register an email twice, or an id chosen by the caller', () => {
  const store = createStore();
  store.dispatch(register({ ...mona, email: 'Marwan@WorkTech.com' }));
  expect(store.getState().auth.accounts).toEqual([]);

  store.dispatch(register({ ...mona, id: 'demo-user-1' }));
  expect(userOf(store).id).not.toBe('demo-user-1');
});

it('keeps the changes of the demo account after signing out', () => {
  const store = createStore();
  store.dispatch(signIn(demo));
  store.dispatch(updateProfile({ phone: '01111111111' }));
  store.dispatch(signOut());
  store.dispatch(signIn(demo));

  expect(userOf(store).phone).toBe('01111111111');
});

it('changes only the profile fields', () => {
  const store = createStore();
  store.dispatch(register(mona));
  const { id } = userOf(store);
  store.dispatch(
    updateProfile({ fullName: 'Mona A.', email: demo.email, password: '1', id: 'demo-user-1' }),
  );

  expect(userOf(store)).toMatchObject({ id, fullName: 'Mona A.', email: mona.email });
  store.dispatch(signOut());
  expect(store.dispatch(signIn(mona))).toBe(true);
});

it('ignores a profile change without a user', () => {
  const store = createStore();
  store.dispatch(updateProfile({ fullName: 'Nobody' }));

  expect(store.getState().auth).toEqual({ userId: null, accounts: [] });
});
