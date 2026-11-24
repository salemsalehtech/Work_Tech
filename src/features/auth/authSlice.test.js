import { configureStore } from '@reduxjs/toolkit';
import { beforeEach, describe, expect, it } from 'vitest';

import { loadState } from '@shared/utils';

import authReducer, {
  clearAuthError,
  getInitialAuthState,
  getStoredAccounts,
  getStoredSession,
  register,
  restoreAuth,
  selectAuthError,
  selectCurrentUser,
  selectIsAuthenticated,
  selectRegisteredAccounts,
  signIn,
  signOut,
  updateProfile,
} from './authSlice';
import { DEMO_ACCOUNT, DEMO_ACCOUNTS, DEMO_CREDENTIALS, DEMO_USER } from './model/demoAccounts';

describe('Auth Feature & Slice (AB-01)', () => {
  const getCleanInitialState = () => ({
    user: null,
    accounts: [],
    error: null,
  });

  const validNewUser = {
    fullName: 'Sara Ahmed',
    email: 'sara.ahmed@example.com',
    password: 'securePassword123',
    phone: '01012345678',
    city: 'Giza',
    address: '10 Nile Street',
  };

  beforeEach(() => {
    window.localStorage.clear();
  });

  describe('Demo Accounts', () => {
    it('1. The demo account exists and is exported', () => {
      expect(DEMO_ACCOUNT).toBeDefined();
      expect(DEMO_USER).toBeDefined();
      expect(DEMO_ACCOUNTS).toHaveLength(1);
      expect(DEMO_ACCOUNTS[0]).toBe(DEMO_ACCOUNT);
    });

    it('2. Its ID is exactly demo-user-1', () => {
      expect(DEMO_ACCOUNT.id).toBe('demo-user-1');
    });

    it('3. Its name is Marwan Tarek', () => {
      expect(DEMO_ACCOUNT.fullName).toBe('Marwan Tarek');
      expect(DEMO_ACCOUNT.name).toBe('Marwan Tarek');
    });

    it('4. Its credentials authenticate successfully', () => {
      const state = authReducer(
        getCleanInitialState(),
        signIn({
          email: DEMO_CREDENTIALS.email,
          password: DEMO_CREDENTIALS.password,
        }),
      );

      expect(state.user).not.toBeNull();
      expect(state.user.id).toBe('demo-user-1');
      expect(state.user.email).toBe(DEMO_CREDENTIALS.email);
      expect(state.error).toBeNull();
    });
  });

  describe('signIn', () => {
    it('1. Successful login with valid demo credentials', () => {
      const state = authReducer(
        getCleanInitialState(),
        signIn({
          email: 'marwan@worktech.com',
          password: 'Password123',
        }),
      );

      expect(state.user).toEqual({
        id: 'demo-user-1',
        name: 'Marwan Tarek',
        fullName: 'Marwan Tarek',
        email: 'marwan@worktech.com',
        phone: '01022334455',
        city: 'Cairo',
        address: '16 El Tayaran St',
        addresses: [
          {
            id: 'addr-1',
            fullName: 'Marwan Tarek',
            phone: '01022334455',
            city: 'Cairo',
            address: '16 El Tayaran St',
            isDefault: true,
          },
        ],
      });
      expect(state.error).toBeNull();
      expect(selectCurrentUser({ auth: state })).toEqual(state.user);
      expect(selectIsAuthenticated({ auth: state })).toBe(true);
    });

    it('2. Successful login with valid registered account credentials', () => {
      const stateWithRegisteredAccount = authReducer(
        getCleanInitialState(),
        register(validNewUser),
      );

      const signedInState = authReducer(
        stateWithRegisteredAccount,
        signIn({
          email: validNewUser.email,
          password: validNewUser.password,
        }),
      );

      expect(signedInState.user).not.toBeNull();
      expect(signedInState.user.email).toBe(validNewUser.email);
      expect(signedInState.user.fullName).toBe(validNewUser.fullName);
      expect(signedInState.error).toBeNull();
      expect(signedInState.user.password).toBeUndefined();
    });

    it('3. Failed login with an incorrect password', () => {
      const state = authReducer(
        getCleanInitialState(),
        signIn({
          email: 'marwan@worktech.com',
          password: 'wrongPassword!#',
        }),
      );

      expect(state.user).toBeNull();
      expect(state.error).toBe('Incorrect password');
      expect(selectIsAuthenticated({ auth: state })).toBe(false);
    });

    it('4. Failed login with an unknown email', () => {
      const state = authReducer(
        getCleanInitialState(),
        signIn({
          email: 'nonexistent@worktech.com',
          password: 'Password123',
        }),
      );

      expect(state.user).toBeNull();
      expect(state.error).toBe('No account found with this email');
      expect(selectIsAuthenticated({ auth: state })).toBe(false);
    });

    it('5. Authentication state is updated correctly', () => {
      const store = configureStore({ reducer: { auth: authReducer } });
      expect(selectCurrentUser(store.getState())).toBeNull();

      store.dispatch(
        signIn({
          email: 'marwan@worktech.com',
          password: 'Password123',
        }),
      );

      const state = store.getState();
      expect(selectCurrentUser(state)).toBeDefined();
      expect(selectCurrentUser(state).id).toBe('demo-user-1');
      expect(selectAuthError(state)).toBeNull();
    });

    it('6. Authentication errors are cleared after successful login', () => {
      const errorState = authReducer(
        getCleanInitialState(),
        signIn({ email: 'marwan@worktech.com', password: 'wrong' }),
      );
      expect(errorState.error).toBeTruthy();

      const successState = authReducer(
        errorState,
        signIn({ email: 'marwan@worktech.com', password: 'Password123' }),
      );
      expect(successState.error).toBeNull();
      expect(successState.user).not.toBeNull();
    });

    it('7. Email comparison behaves consistently regardless of capitalization', () => {
      const state = authReducer(
        getCleanInitialState(),
        signIn({
          email: '   MaRwAn@WorkTech.COM  ',
          password: 'Password123',
        }),
      );

      expect(state.user).not.toBeNull();
      expect(state.user.id).toBe('demo-user-1');
      expect(state.error).toBeNull();
    });
  });

  describe('signOut', () => {
    it('1. Current user is cleared', () => {
      const loggedInState = authReducer(
        getCleanInitialState(),
        signIn({ email: 'marwan@worktech.com', password: 'Password123' }),
      );
      expect(loggedInState.user).not.toBeNull();

      const loggedOutState = authReducer(loggedInState, signOut());
      expect(loggedOutState.user).toBeNull();
      expect(loggedOutState.error).toBeNull();
    });

    it('2. Persisted session is removed', () => {
      authReducer(
        getCleanInitialState(),
        signIn({ email: 'marwan@worktech.com', password: 'Password123' }),
      );
      expect(loadState('session', null)).not.toBeNull();

      authReducer(getCleanInitialState(), signOut());
      expect(loadState('session', null)).toBeNull();
      expect(window.localStorage.getItem('worktech:session')).toBeNull();
    });

    it('3. Registered accounts remain available after logout', () => {
      const stateWithAccount = authReducer(getCleanInitialState(), register(validNewUser));
      expect(stateWithAccount.accounts).toHaveLength(1);

      const loggedInState = authReducer(
        stateWithAccount,
        signIn({ email: validNewUser.email, password: validNewUser.password }),
      );
      expect(loggedInState.user).not.toBeNull();

      const loggedOutState = authReducer(loggedInState, signOut());
      expect(loggedOutState.user).toBeNull();
      expect(loggedOutState.accounts).toHaveLength(1);
      expect(loggedOutState.accounts[0].email).toBe(validNewUser.email);
      expect(loadState('accounts', [])).toHaveLength(1);
    });

    it('4. Demo accounts remain available after logout', () => {
      const loggedInState = authReducer(
        getCleanInitialState(),
        signIn({ email: 'marwan@worktech.com', password: 'Password123' }),
      );
      const loggedOutState = authReducer(loggedInState, signOut());

      // Demo accounts can still be signed into immediately
      const reLoggedInState = authReducer(
        loggedOutState,
        signIn({ email: 'marwan@worktech.com', password: 'Password123' }),
      );
      expect(reLoggedInState.user).not.toBeNull();
      expect(reLoggedInState.user.id).toBe('demo-user-1');
    });
  });

  describe('register', () => {
    it('1. A new account can be registered', () => {
      const state = authReducer(getCleanInitialState(), register(validNewUser));

      expect(state.accounts).toHaveLength(1);
      expect(state.accounts[0].email).toBe(validNewUser.email);
      expect(state.accounts[0].fullName).toBe(validNewUser.fullName);
      expect(state.accounts[0].id).toBeDefined();
      expect(state.error).toBeNull();
    });

    it('2. The account is saved in browser storage', () => {
      authReducer(getCleanInitialState(), register(validNewUser));

      const storedAccounts = loadState('accounts', []);
      expect(storedAccounts).toHaveLength(1);
      expect(storedAccounts[0].email).toBe(validNewUser.email);
      expect(storedAccounts[0].fullName).toBe(validNewUser.fullName);
    });

    it('3. Duplicate email registration is rejected', () => {
      const stateWithFirst = authReducer(getCleanInitialState(), register(validNewUser));
      expect(stateWithFirst.accounts).toHaveLength(1);

      const stateWithDuplicate = authReducer(
        stateWithFirst,
        register({
          ...validNewUser,
          fullName: 'Another Person',
        }),
      );

      expect(stateWithDuplicate.accounts).toHaveLength(1);
      expect(stateWithDuplicate.error).toBe('An account with this email already exists');
    });

    it('4. Duplicate checking is case-insensitive', () => {
      const stateWithFirst = authReducer(getCleanInitialState(), register(validNewUser));

      const stateWithDuplicate = authReducer(
        stateWithFirst,
        register({
          ...validNewUser,
          email: '  SARA.AHMED@EXAMPLE.COM  ',
        }),
      );

      expect(stateWithDuplicate.accounts).toHaveLength(1);
      expect(stateWithDuplicate.error).toBe('An account with this email already exists');
    });

    it('5. Existing demo accounts are not overwritten', () => {
      const state = authReducer(
        getCleanInitialState(),
        register({
          fullName: 'Imposter Demo',
          email: 'marwan@worktech.com',
          password: 'newPassword888',
        }),
      );

      expect(state.accounts).toHaveLength(0);
      expect(state.error).toBe('An account with this email already exists');
      expect(DEMO_ACCOUNT.password).toBe('Password123');
    });

    it('6. Invalid registration data is handled properly', () => {
      // Missing name
      const noName = authReducer(
        getCleanInitialState(),
        register({ email: 'test@example.com', password: 'password123' }),
      );
      expect(noName.accounts).toHaveLength(0);
      expect(noName.error).toBe('Full name is required');

      // Invalid email
      const badEmail = authReducer(
        getCleanInitialState(),
        register({ fullName: 'Test User', email: 'not-an-email', password: 'password123' }),
      );
      expect(badEmail.accounts).toHaveLength(0);
      expect(badEmail.error).toBe('A valid email is required');

      // Short password (< 8 chars)
      const shortPass = authReducer(
        getCleanInitialState(),
        register({ fullName: 'Test User', email: 'valid@example.com', password: '123' }),
      );
      expect(shortPass.accounts).toHaveLength(0);
      expect(shortPass.error).toBe('Password must be at least 8 characters');
    });

    it('7. Existing accounts are preserved when a new account is registered', () => {
      const state1 = authReducer(getCleanInitialState(), register(validNewUser));
      const secondUser = {
        fullName: 'Omar Khaled',
        email: 'omar@example.com',
        password: 'password456',
      };
      const state2 = authReducer(state1, register(secondUser));

      expect(state2.accounts).toHaveLength(2);
      expect(state2.accounts[0].email).toBe(validNewUser.email);
      expect(state2.accounts[1].email).toBe(secondUser.email);
      expect(loadState('accounts', [])).toHaveLength(2);
    });
  });

  describe('updateProfile', () => {
    it("1. Current user's profile is updated", () => {
      const state1 = authReducer(
        getCleanInitialState(),
        signIn({ email: 'marwan@worktech.com', password: 'Password123' }),
      );
      expect(state1.user.phone).toBe('01022334455');

      const updated = authReducer(
        state1,
        updateProfile({ phone: '01199887766', city: 'Alexandria' }),
      );

      expect(updated.user.phone).toBe('01199887766');
      expect(updated.user.city).toBe('Alexandria');
      expect(updated.error).toBeNull();
    });

    it('2. Updated data is persisted', () => {
      const state1 = authReducer(
        getCleanInitialState(),
        signIn({ email: 'marwan@worktech.com', password: 'Password123' }),
      );

      authReducer(state1, updateProfile({ phone: '01233445566' }));

      const stored = loadState('session', null);
      expect(stored).not.toBeNull();
      expect(stored.phone).toBe('01233445566');
    });

    it('3. User ID remains unchanged even if passed in payload', () => {
      const state1 = authReducer(
        getCleanInitialState(),
        signIn({ email: 'marwan@worktech.com', password: 'Password123' }),
      );

      const updated = authReducer(
        state1,
        updateProfile({ id: 'hacked-id-999', phone: '01500000000' }),
      );

      expect(updated.user.id).toBe('demo-user-1');
    });

    it('4. Other account data is preserved', () => {
      const state1 = authReducer(
        getCleanInitialState(),
        signIn({ email: 'marwan@worktech.com', password: 'Password123' }),
      );

      const updated = authReducer(state1, updateProfile({ phone: '01099999999' }));

      expect(updated.user.email).toBe('marwan@worktech.com');
      expect(updated.user.fullName).toBe('Marwan Tarek');
      expect(updated.user.addresses).toHaveLength(1);
    });

    it('5. Updating a profile does not affect unrelated accounts', () => {
      const stateWithTwo = authReducer(
        authReducer(getCleanInitialState(), register(validNewUser)),
        register({
          fullName: 'Tamer Hosny',
          email: 'tamer@example.com',
          password: 'password888',
          phone: '01211112222',
        }),
      );

      const loggedInTamer = authReducer(
        stateWithTwo,
        signIn({ email: 'tamer@example.com', password: 'password888' }),
      );

      const updatedState = authReducer(loggedInTamer, updateProfile({ phone: '01299998888' }));

      // Tamer was updated
      expect(updatedState.user.phone).toBe('01299998888');
      const tamerInAccounts = updatedState.accounts.find(
        (acc) => acc.email === 'tamer@example.com',
      );
      expect(tamerInAccounts.phone).toBe('01299998888');

      // Sara was not affected
      const saraInAccounts = updatedState.accounts.find((acc) => acc.email === validNewUser.email);
      expect(saraInAccounts.phone).toBe(validNewUser.phone);
    });

    it('6. Updating a demo account does not accidentally create a duplicate registered account', () => {
      const state = authReducer(
        getCleanInitialState(),
        signIn({ email: 'marwan@worktech.com', password: 'Password123' }),
      );
      expect(state.accounts).toHaveLength(0);

      const updated = authReducer(state, updateProfile({ phone: '01000001111' }));

      expect(updated.accounts).toHaveLength(0);
      expect(loadState('accounts', [])).toHaveLength(0);
    });
  });

  describe('Persistence', () => {
    it('1. Authentication state is restored from browser storage', () => {
      window.localStorage.setItem(
        'worktech:session',
        JSON.stringify({
          id: 'demo-user-1',
          fullName: 'Marwan Tarek',
          email: 'marwan@worktech.com',
        }),
      );
      window.localStorage.setItem(
        'worktech:accounts',
        JSON.stringify([
          {
            id: 'user-1',
            fullName: 'Stored User',
            email: 'stored@example.com',
            password: 'password123',
          },
        ]),
      );

      const restored = authReducer(getCleanInitialState(), restoreAuth());
      expect(restored.user).not.toBeNull();
      expect(restored.user.id).toBe('demo-user-1');
      expect(restored.accounts).toHaveLength(1);
      expect(restored.accounts[0].email).toBe('stored@example.com');
    });

    it('2. Refresh-related initialization works correctly through stored session', () => {
      window.localStorage.setItem(
        'worktech:auth',
        JSON.stringify({
          user: {
            id: 'demo-user-1',
            fullName: 'Marwan Tarek',
            email: 'marwan@worktech.com',
          },
          accounts: [],
        }),
      );

      const refreshedState = getInitialAuthState();
      expect(refreshedState.user).toBeDefined();
      expect(refreshedState.user).toEqual({
        id: 'demo-user-1',
        fullName: 'Marwan Tarek',
        email: 'marwan@worktech.com',
      });
    });

    it('3. Invalid stored JSON does not crash the application', () => {
      window.localStorage.setItem('worktech:session', '{bad-json');
      window.localStorage.setItem('worktech:accounts', '{also-bad');
      window.localStorage.setItem('worktech:auth', '{corrupt');

      expect(() => getStoredSession()).not.toThrow();
      expect(() => getStoredAccounts()).not.toThrow();
      expect(getStoredSession()).toBeNull();
      expect(getStoredAccounts()).toEqual([]);

      const state = getInitialAuthState();
      expect(state.user).toBeNull();
      expect(state.accounts).toEqual([]);
    });

    it('4. Missing storage values are handled safely', () => {
      expect(getStoredSession()).toBeNull();
      expect(getStoredAccounts()).toEqual([]);
      expect(getInitialAuthState()).toEqual({
        user: null,
        accounts: [],
        error: null,
      });
    });
  });

  describe('Selectors and error clearing', () => {
    it('provides working selectors', () => {
      const state = {
        auth: {
          user: { id: 'demo-user-1', fullName: 'Marwan Tarek' },
          accounts: [{ id: 'u1' }],
          error: 'Something went wrong',
        },
      };

      expect(selectCurrentUser(state)).toEqual({ id: 'demo-user-1', fullName: 'Marwan Tarek' });
      expect(selectRegisteredAccounts(state)).toEqual([{ id: 'u1' }]);
      expect(selectAuthError(state)).toBe('Something went wrong');
      expect(selectIsAuthenticated(state)).toBe(true);
    });

    it('clears auth error with clearAuthError action', () => {
      const stateWithError = {
        user: null,
        accounts: [],
        error: 'An error occurred',
      };
      const cleared = authReducer(stateWithError, clearAuthError());
      expect(cleared.error).toBeNull();
    });
  });
});
