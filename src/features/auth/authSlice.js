import { createSlice } from '@reduxjs/toolkit';

import { isEmail, loadState, saveState } from '@shared/utils';

import { DEMO_ACCOUNTS } from './model/demoAccounts';

const SESSION_KEY = 'session';
const ACCOUNTS_KEY = 'accounts';
const AUTH_KEY = 'auth';

let accountIdCounter = 0;
function generateAccountId() {
  accountIdCounter += 1;
  return `user-${Date.now()}-${accountIdCounter}`;
}

/**
 * Strips sensitive data like password before storing in user session state.
 */
function sanitizeUser(account) {
  if (!account) return null;
  const safeUser = { ...account };
  delete safeUser.password;
  return safeUser;
}

/**
 * Safely loads the persisted session user from browser storage.
 */
export function getStoredSession() {
  const session = loadState(SESSION_KEY, null);
  if (session && typeof session === 'object' && !Array.isArray(session) && session.id) {
    return session;
  }
  const auth = loadState(AUTH_KEY, null);
  if (
    auth &&
    typeof auth === 'object' &&
    auth.user &&
    typeof auth.user === 'object' &&
    auth.user.id
  ) {
    return auth.user;
  }
  return null;
}

/**
 * Safely loads registered accounts from browser storage.
 */
export function getStoredAccounts() {
  const accounts = loadState(ACCOUNTS_KEY, null);
  if (Array.isArray(accounts)) {
    return accounts;
  }
  const auth = loadState(AUTH_KEY, null);
  if (auth && typeof auth === 'object' && Array.isArray(auth.accounts)) {
    return auth.accounts;
  }
  return [];
}

/**
 * Helper to build the initial auth state.
 */
export function getInitialAuthState() {
  return {
    user: getStoredSession(),
    accounts: getStoredAccounts(),
    error: null,
  };
}

const initialState = getInitialAuthState();

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    signIn: (state, action) => {
      const email = String(action.payload?.email || '')
        .trim()
        .toLowerCase();
      const password = String(action.payload?.password || '');

      if (!email || !password) {
        state.user = null;
        state.error = 'Email and password are required';
        return;
      }

      const allAccounts = [...DEMO_ACCOUNTS, ...state.accounts];
      const account = allAccounts.find(
        (acc) => acc.email && acc.email.trim().toLowerCase() === email,
      );

      if (!account) {
        state.user = null;
        state.error = 'No account found with this email';
        return;
      }

      if (account.password !== password) {
        state.user = null;
        state.error = 'Incorrect password';
        return;
      }

      const safeUser = sanitizeUser(account);
      state.user = safeUser;
      state.error = null;

      saveState(SESSION_KEY, safeUser);
      saveState(AUTH_KEY, { user: safeUser, accounts: state.accounts });
    },

    signOut: (state) => {
      state.user = null;
      state.error = null;

      saveState(SESSION_KEY, null);
      try {
        window.localStorage.removeItem('worktech:' + SESSION_KEY);
      } catch {
        // Storage is unavailable or restricted
      }
      saveState(AUTH_KEY, { user: null, accounts: state.accounts });
    },

    register: (state, action) => {
      const accountData = action.payload || {};
      const rawEmail = String(accountData.email || '').trim();
      const normalizedEmail = rawEmail.toLowerCase();
      const password = String(accountData.password || '');
      const fullName = (accountData.fullName || accountData.name || '').trim();

      if (!fullName) {
        state.error = 'Full name is required';
        return;
      }

      if (!rawEmail || !isEmail(rawEmail)) {
        state.error = 'A valid email is required';
        return;
      }

      if (!password || password.length < 8) {
        state.error = 'Password must be at least 8 characters';
        return;
      }

      const allAccounts = [...DEMO_ACCOUNTS, ...state.accounts];
      const emailExists = allAccounts.some(
        (acc) => acc.email && acc.email.trim().toLowerCase() === normalizedEmail,
      );

      if (emailExists) {
        state.error = 'An account with this email already exists';
        return;
      }

      const newAccount = {
        id: accountData.id || generateAccountId(),
        fullName,
        name: fullName,
        email: rawEmail,
        password,
        phone: accountData.phone ? String(accountData.phone).trim() : '',
        city: accountData.city ? String(accountData.city).trim() : '',
        address: accountData.address ? String(accountData.address).trim() : '',
        addresses: Array.isArray(accountData.addresses) ? accountData.addresses : [],
        createdAt: accountData.createdAt || new Date().toISOString(),
      };

      state.accounts.push(newAccount);
      state.error = null;

      saveState(ACCOUNTS_KEY, state.accounts);
      saveState(AUTH_KEY, { user: state.user, accounts: state.accounts });
    },

    updateProfile: (state, action) => {
      if (!state.user) {
        state.error = 'No authenticated user to update';
        return;
      }

      const currentUserId = state.user.id;
      const updates = { ...(action.payload || {}) };
      delete updates.id;

      state.user = {
        ...state.user,
        ...updates,
        id: currentUserId,
      };

      const isDemoUser = DEMO_ACCOUNTS.some((demo) => demo.id === currentUserId);
      if (!isDemoUser) {
        const accountIndex = state.accounts.findIndex((acc) => acc.id === currentUserId);
        if (accountIndex !== -1) {
          state.accounts[accountIndex] = {
            ...state.accounts[accountIndex],
            ...updates,
            id: currentUserId,
          };
          saveState(ACCOUNTS_KEY, state.accounts);
        }
      }

      state.error = null;

      saveState(SESSION_KEY, state.user);
      saveState(AUTH_KEY, { user: state.user, accounts: state.accounts });
    },

    clearAuthError: (state) => {
      state.error = null;
    },

    restoreAuth: (state) => {
      state.user = getStoredSession();
      state.accounts = getStoredAccounts();
      state.error = null;
    },
  },
});

export const { signIn, signOut, register, updateProfile, clearAuthError, restoreAuth } =
  authSlice.actions;

export const selectCurrentUser = (state) => state.auth.user;
export const selectAuthError = (state) => state.auth.error;
export const selectRegisteredAccounts = (state) => state.auth.accounts;
export const selectIsAuthenticated = (state) => Boolean(state.auth.user);

export default authSlice.reducer;
