import { createSelector, createSlice, nanoid } from '@reduxjs/toolkit';

import { authenticate, findByEmail, toUser } from './model/accounts';
import { DEMO_ACCOUNTS } from './model/demoAccounts';

// accounts: registered accounts, and demo accounts once edited. The store persists the slice.
const initialState = { userId: null, accounts: [] };

const EDITABLE_FIELDS = ['fullName', 'phone', 'addresses', 'notifications'];

/** Saved accounts over the demo ones. */
const allAccounts = (saved) => [
  ...DEMO_ACCOUNTS.filter((demo) => !saved.some((account) => account.id === demo.id)),
  ...saved,
];

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    signedIn(state, { payload: id }) {
      state.userId = id;
    },
    signOut(state) {
      state.userId = null;
    },
    // Creates the account and signs it in.
    register: {
      prepare: ({ fullName, email, phone, password, notifications }) => ({
        payload: {
          id: `user-${nanoid()}`,
          fullName: fullName.trim(),
          email: email.trim(),
          phone: phone.trim(),
          password,
          notifications,
          addresses: [],
        },
      }),
      reducer(state, { payload: account }) {
        if (findByEmail(allAccounts(state.accounts), account.email)) return;
        state.accounts.push(account);
        state.userId = account.id;
      },
    },
    updateProfile(state, { payload }) {
      const current = allAccounts(state.accounts).find(({ id }) => id === state.userId);
      if (!current) return;

      const changes = Object.fromEntries(
        Object.entries(payload).filter(([field]) => EDITABLE_FIELDS.includes(field)),
      );
      state.accounts = [
        ...state.accounts.filter(({ id }) => id !== current.id),
        { ...current, ...changes },
      ];
    },
  },
});

export const { signOut, register, updateProfile } = authSlice.actions;

export const selectAccounts = createSelector([(state) => state.auth.accounts], allAccounts);

/** The signed-in user without the password, or null. */
export const selectCurrentUser = createSelector(
  [selectAccounts, (state) => state.auth.userId],
  (accounts, userId) => toUser(accounts.find(({ id }) => id === userId)),
);

/** Signs in when the credentials are right. Returns whether they are. */
export const signIn = (credentials) => (dispatch, getState) => {
  const account = authenticate(selectAccounts(getState()), credentials);
  if (account) dispatch(authSlice.actions.signedIn(account.id));
  return Boolean(account);
};

export default authSlice.reducer;
