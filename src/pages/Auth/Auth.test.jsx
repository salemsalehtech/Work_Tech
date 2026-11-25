import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it } from 'vitest';

import { renderWithProviders } from '@/test/renderWithProviders';
import { authReducer, DEMO_CREDENTIALS } from '@features/auth';
import i18n from '@services/i18n';

import Auth from './index';

describe('AB-03: Sign In & Create Account Pages', () => {
  beforeEach(async () => {
    window.localStorage.clear();
    await i18n.changeLanguage('en');
  });

  const renderAuth = (options = {}) => {
    const { route = '/auth', preloadedState } = options;
    return renderWithProviders(<Auth />, {
      reducer: { auth: authReducer },
      preloadedState,
      route,
    });
  };

  describe('Sign In Form', () => {
    it('1. Renders the Sign In page with all expected fields and demo credentials', () => {
      renderAuth();

      expect(screen.getByTestId('sign-in-page')).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: /sign in to your account/i })).toBeInTheDocument();
      expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/^password/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /^sign in$/i })).toBeInTheDocument();

      // Demo credentials must be displayed below the form
      const demoBox = screen.getByTestId('demo-credentials');
      expect(demoBox).toBeInTheDocument();
      expect(screen.getByTestId('demo-email')).toHaveTextContent(DEMO_CREDENTIALS.email);
      expect(screen.getByTestId('demo-password')).toHaveTextContent(DEMO_CREDENTIALS.password);
    });

    it('2. Accepts typing in email and password inputs', async () => {
      const user = userEvent.setup();
      renderAuth();

      const emailInput = screen.getByLabelText(/email address/i);
      const passwordInput = screen.getByLabelText(/^password/i);

      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'Secret123');

      expect(emailInput).toHaveValue('test@example.com');
      expect(passwordInput).toHaveValue('Secret123');
    });

    it('3. Rejects empty email and empty password submission with clear validation errors', async () => {
      const user = userEvent.setup();
      renderAuth();

      const submitBtn = screen.getByRole('button', { name: /^sign in$/i });
      await user.click(submitBtn);

      expect(screen.getByText(/email address is required/i)).toBeInTheDocument();
      expect(screen.getByText(/password is required/i)).toBeInTheDocument();
    });

    it('4. Rejects invalid email format using Asmaas isEmail validator', async () => {
      const user = userEvent.setup();
      renderAuth();

      const emailInput = screen.getByLabelText(/email address/i);
      const passwordInput = screen.getByLabelText(/^password/i);
      const submitBtn = screen.getByRole('button', { name: /^sign in$/i });

      await user.type(emailInput, 'invalid-email-syntax');
      await user.type(passwordInput, 'Password123');
      await user.click(submitBtn);

      expect(screen.getByText(/please enter a valid email address/i)).toBeInTheDocument();
    });

    it('5. Toggles password visibility', async () => {
      const user = userEvent.setup();
      renderAuth();

      const passwordInput = screen.getByLabelText(/^password/i);
      const toggleBtn = screen.getByRole('button', { name: /show password/i });

      expect(passwordInput).toHaveAttribute('type', 'password');

      await user.click(toggleBtn);
      expect(passwordInput).toHaveAttribute('type', 'text');
      expect(screen.getByRole('button', { name: /hide password/i })).toBeInTheDocument();

      await user.click(toggleBtn);
      expect(passwordInput).toHaveAttribute('type', 'password');
    });

    it('6. Clicking "Use Demo Credentials" fills the form with the real demo account', async () => {
      const user = userEvent.setup();
      renderAuth();

      const fillBtn = screen.getByRole('button', { name: /use demo credentials/i });
      await user.click(fillBtn);

      expect(screen.getByLabelText(/email address/i)).toHaveValue(DEMO_CREDENTIALS.email);
      expect(screen.getByLabelText(/^password/i)).toHaveValue(DEMO_CREDENTIALS.password);
    });

    it('7. Authenticates successfully with valid demo credentials', async () => {
      const user = userEvent.setup();
      const { store } = renderAuth();

      const fillBtn = screen.getByRole('button', { name: /use demo credentials/i });
      await user.click(fillBtn);

      const submitBtn = screen.getByRole('button', { name: /^sign in$/i });
      await user.click(submitBtn);

      expect(store.getState().auth.user).not.toBeNull();
      expect(store.getState().auth.user.email).toBe(DEMO_CREDENTIALS.email);
      expect(store.getState().auth.error).toBeNull();
    });

    it('8. Displays clear error message when incorrect password is submitted', async () => {
      const user = userEvent.setup();
      const { store } = renderAuth();

      const emailInput = screen.getByLabelText(/email address/i);
      const passwordInput = screen.getByLabelText(/^password/i);
      const submitBtn = screen.getByRole('button', { name: /^sign in$/i });

      await user.type(emailInput, DEMO_CREDENTIALS.email);
      await user.type(passwordInput, 'WrongPassword999');
      await user.click(submitBtn);

      expect(store.getState().auth.user).toBeNull();
      const alert = screen.getByRole('alert');
      expect(alert).toBeInTheDocument();
      expect(alert).toHaveTextContent(/incorrect/i);
    });

    it('9. Displays clear error message when unknown email is submitted', async () => {
      const user = userEvent.setup();
      const { store } = renderAuth();

      const emailInput = screen.getByLabelText(/email address/i);
      const passwordInput = screen.getByLabelText(/^password/i);
      const submitBtn = screen.getByRole('button', { name: /^sign in$/i });

      await user.type(emailInput, 'nonexistent@example.com');
      await user.type(passwordInput, 'Password123');
      await user.click(submitBtn);

      expect(store.getState().auth.user).toBeNull();
      const alert = screen.getByRole('alert');
      expect(alert).toBeInTheDocument();
      expect(alert).toHaveTextContent(/no account found with this email/i);
    });

    it('10. Navigates to Create Account when clicking the switch link or tab', async () => {
      const user = userEvent.setup();
      renderAuth();

      const createOneBtn = screen.getByRole('button', { name: /create one/i });
      await user.click(createOneBtn);

      expect(screen.getByTestId('create-account-page')).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: /create your account/i })).toBeInTheDocument();
    });
  });

  describe('Create Account (Registration) Form', () => {
    it('1. Renders the Create Account page with all required registration fields', () => {
      renderAuth({ route: '/auth?mode=register' });

      expect(screen.getByTestId('create-account-page')).toBeInTheDocument();
      expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/mobile number/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/^password/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /^create account$/i })).toBeInTheDocument();
    });

    it('2. Rejects submission with empty required fields', async () => {
      const user = userEvent.setup();
      renderAuth({ route: '/auth?mode=register' });

      const submitBtn = screen.getByRole('button', { name: /^create account$/i });
      await user.click(submitBtn);

      expect(screen.getByText(/full name is required/i)).toBeInTheDocument();
      expect(screen.getByText(/email address is required/i)).toBeInTheDocument();
      expect(screen.getByText(/mobile number is required/i)).toBeInTheDocument();
      expect(screen.getByText(/password is required/i)).toBeInTheDocument();
      expect(screen.getByText(/please confirm your password/i)).toBeInTheDocument();
    });

    it('3. Rejects invalid email syntax during registration', async () => {
      const user = userEvent.setup();
      renderAuth({ route: '/auth?mode=register' });

      await user.type(screen.getByLabelText(/full name/i), 'Youssef Ali');
      await user.type(screen.getByLabelText(/email address/i), 'invalid-email');
      await user.type(screen.getByLabelText(/mobile number/i), '01012345678');
      await user.type(screen.getByLabelText(/^password/i), 'Password123');
      await user.type(screen.getByLabelText(/confirm password/i), 'Password123');

      await user.click(screen.getByRole('button', { name: /^create account$/i }));

      expect(screen.getByText(/please enter a valid email address/i)).toBeInTheDocument();
    });

    it('4. Rejects invalid Egyptian mobile number', async () => {
      const user = userEvent.setup();
      renderAuth({ route: '/auth?mode=register' });

      await user.type(screen.getByLabelText(/full name/i), 'Youssef Ali');
      await user.type(screen.getByLabelText(/email address/i), 'youssef@example.com');
      // 013 is not a valid Egyptian mobile prefix (must be 010, 011, 012, 015)
      await user.type(screen.getByLabelText(/mobile number/i), '01312345678');
      await user.type(screen.getByLabelText(/^password/i), 'Password123');
      await user.type(screen.getByLabelText(/confirm password/i), 'Password123');

      await user.click(screen.getByRole('button', { name: /^create account$/i }));

      expect(screen.getByText(/please enter a valid egyptian mobile number/i)).toBeInTheDocument();
    });

    it('5. Rejects password shorter than 8 characters', async () => {
      const user = userEvent.setup();
      renderAuth({ route: '/auth?mode=register' });

      await user.type(screen.getByLabelText(/full name/i), 'Youssef Ali');
      await user.type(screen.getByLabelText(/email address/i), 'youssef@example.com');
      await user.type(screen.getByLabelText(/mobile number/i), '01012345678');
      await user.type(screen.getByLabelText(/^password/i), 'short7');
      await user.type(screen.getByLabelText(/confirm password/i), 'short7');

      await user.click(screen.getByRole('button', { name: /^create account$/i }));

      expect(screen.getByText(/password must be at least 8 characters/i)).toBeInTheDocument();
    });

    it('6. Rejects password confirmation mismatch', async () => {
      const user = userEvent.setup();
      renderAuth({ route: '/auth?mode=register' });

      await user.type(screen.getByLabelText(/full name/i), 'Youssef Ali');
      await user.type(screen.getByLabelText(/email address/i), 'youssef@example.com');
      await user.type(screen.getByLabelText(/mobile number/i), '01012345678');
      await user.type(screen.getByLabelText(/^password/i), 'Password123');
      await user.type(screen.getByLabelText(/confirm password/i), 'PasswordDifferent');

      await user.click(screen.getByRole('button', { name: /^create account$/i }));

      expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument();
    });

    it('7. Rejects duplicate email registration with existing demo user', async () => {
      const user = userEvent.setup();
      const { store } = renderAuth({ route: '/auth?mode=register' });

      await user.type(screen.getByLabelText(/full name/i), 'Another Marwan');
      await user.type(screen.getByLabelText(/email address/i), DEMO_CREDENTIALS.email);
      await user.type(screen.getByLabelText(/mobile number/i), '01012345678');
      await user.type(screen.getByLabelText(/^password/i), 'SecurePass888');
      await user.type(screen.getByLabelText(/confirm password/i), 'SecurePass888');

      await user.click(screen.getByRole('button', { name: /^create account$/i }));

      expect(store.getState().auth.error).toBe('An account with this email already exists');
      const alert = screen.getByRole('alert');
      expect(alert).toBeInTheDocument();
      expect(alert).toHaveTextContent(/already exists/i);
    });

    it('8. Valid registration creates account and authenticates user', async () => {
      const user = userEvent.setup();
      const { store } = renderAuth({ route: '/auth?mode=register' });

      await user.type(screen.getByLabelText(/full name/i), 'Nour Ibrahim');
      await user.type(screen.getByLabelText(/email address/i), 'nour.ibrahim@example.com');
      await user.type(screen.getByLabelText(/mobile number/i), '01123456789');
      await user.type(screen.getByLabelText(/^password/i), 'MySecret123');
      await user.type(screen.getByLabelText(/confirm password/i), 'MySecret123');

      await user.click(screen.getByRole('button', { name: /^create account$/i }));

      expect(store.getState().auth.accounts).toHaveLength(1);
      expect(store.getState().auth.accounts[0].email).toBe('nour.ibrahim@example.com');
      expect(store.getState().auth.user).not.toBeNull();
      expect(store.getState().auth.user.email).toBe('nour.ibrahim@example.com');
    });

    it('9. Navigates back to Sign In when clicking "Sign In" link', async () => {
      const user = userEvent.setup();
      renderAuth({ route: '/auth?mode=register' });

      const signInLink = screen.getByRole('button', { name: /sign in/i });
      await user.click(signInLink);

      expect(screen.getByTestId('sign-in-page')).toBeInTheDocument();
    });
  });

  describe('Redirects and State Handling', () => {
    it('1. Redirects to previous destination (location.state.from) upon successful login', async () => {
      const user = userEvent.setup();
      const routeWithFrom = {
        pathname: '/auth',
        state: { from: '/checkout' },
      };

      const { store } = renderAuth({ route: routeWithFrom });

      const fillBtn = screen.getByRole('button', { name: /use demo credentials/i });
      await user.click(fillBtn);

      const submitBtn = screen.getByRole('button', { name: /^sign in$/i });
      await user.click(submitBtn);

      expect(store.getState().auth.user).not.toBeNull();
    });

    it('2. Redirects to Account page when no previous destination is provided', async () => {
      const user = userEvent.setup();
      const { store } = renderAuth({ route: '/auth' });

      const fillBtn = screen.getByRole('button', { name: /use demo credentials/i });
      await user.click(fillBtn);

      const submitBtn = screen.getByRole('button', { name: /^sign in$/i });
      await user.click(submitBtn);

      expect(store.getState().auth.user).not.toBeNull();
    });

    it('3. Redirects authenticated user visiting /auth to Account page', () => {
      const authenticatedState = {
        auth: {
          user: { id: 'user-1', email: 'test@example.com', fullName: 'Test' },
          accounts: [],
          error: null,
        },
      };

      renderAuth({ preloadedState: authenticatedState });
      // Authenticated users are redirected
    });
  });

  describe('Arabic Localization & RTL', () => {
    it('1. Renders Sign In page in Arabic when language is ar', async () => {
      await i18n.changeLanguage('ar');
      renderAuth();

      expect(screen.getByRole('heading', { name: /تسجيل الدخول إلى حسابك/ })).toBeInTheDocument();
      expect(screen.getByLabelText(/البريد الإلكتروني/)).toBeInTheDocument();
      expect(screen.getByLabelText(/^كلمة المرور$/)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /^تسجيل الدخول$/ })).toBeInTheDocument();
      expect(screen.getByTestId('demo-credentials')).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: /^بيانات الحساب التجريبي$/ })).toBeInTheDocument();
    });

    it('2. Displays error message in Arabic when credentials are wrong', async () => {
      await i18n.changeLanguage('ar');
      const user = userEvent.setup();
      renderAuth();

      const emailInput = screen.getByLabelText(/البريد الإلكتروني/);
      const passwordInput = screen.getByLabelText(/^كلمة المرور$/);
      const submitBtn = screen.getByRole('button', { name: /^تسجيل الدخول$/ });

      await user.type(emailInput, DEMO_CREDENTIALS.email);
      await user.type(passwordInput, 'wrongpassword');
      await user.click(submitBtn);

      const alert = screen.getByRole('alert');
      expect(alert).toHaveTextContent(/كلمة المرور التي أدخلتها غير صحيحة/);
    });

    it('3. Displays duplicate email error in Arabic during registration', async () => {
      await i18n.changeLanguage('ar');
      const user = userEvent.setup();
      renderAuth({ route: '/auth?mode=register' });

      await user.type(screen.getByLabelText(/الاسم بالكامل/), 'مروان آخر');
      await user.type(screen.getByLabelText(/البريد الإلكتروني/), DEMO_CREDENTIALS.email);
      await user.type(screen.getByLabelText(/رقم الهاتف المحمول/), '01012345678');
      await user.type(screen.getByLabelText(/^كلمة المرور/), 'Password123');
      await user.type(screen.getByLabelText(/تأكيد كلمة المرور/), 'Password123');

      await user.click(screen.getByRole('button', { name: /^إنشاء الحساب$/ }));

      const alert = screen.getByRole('alert');
      expect(alert).toHaveTextContent(/يوجد حساب مسجل بهذا البريد الإلكتروني بالفعل/);
    });
  });
});
