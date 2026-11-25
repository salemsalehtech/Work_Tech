import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Route, Routes, useLocation } from 'react-router-dom';

import { renderWithProviders } from '@/test/renderWithProviders';
import { authReducer, RequireAuth } from '@features/auth';
import i18n from '@services/i18n';

import Auth from '.';

function Page() {
  const { pathname, search } = useLocation();
  return <output>{pathname + search}</output>;
}

const renderAuth = (route = '/auth') =>
  renderWithProviders(
    <Routes>
      <Route path="/auth" element={<Auth />} />
      <Route element={<RequireAuth />}>
        <Route path="/account" element={<Page />} />
        <Route path="/orders" element={<Page />} />
      </Route>
    </Routes>,
    { route, reducer: { auth: authReducer } },
  );
const field = (name) => screen.getByLabelText(name);
const submit = (name) => userEvent.click(screen.getByRole('button', { name }));

afterEach(() => i18n.changeLanguage('en'));

describe('sign in', () => {
  it('signs in with the demo account and opens the account page', async () => {
    renderAuth();

    await userEvent.click(screen.getByRole('button', { name: 'Use the demo account' }));
    await submit('Sign in');

    expect(screen.getByText('/account')).toBeInTheDocument();
  });

  it('brings a guest back to the page that asked for an account, with its query', async () => {
    renderAuth('/orders?status=placed');

    await userEvent.click(screen.getByRole('button', { name: 'Use the demo account' }));
    await submit('Sign in');

    expect(screen.getByText('/orders?status=placed')).toBeInTheDocument();
  });

  it('refuses wrong credentials until they change', async () => {
    renderAuth();
    await userEvent.type(field('Email'), 'marwan@worktech.com');
    await userEvent.type(field('Password'), 'wrong');
    await submit('Sign in');
    expect(screen.getByRole('alert')).toHaveTextContent('The email or password is incorrect.');

    await userEvent.type(field('Password'), '1');
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('focuses the first wrong field', async () => {
    renderAuth();

    await submit('Sign in');

    expect(field('Email')).toHaveFocus();
    expect(field('Email')).toHaveAccessibleDescription('Email is required');
  });

  it('shows the refusal in Arabic', async () => {
    await i18n.changeLanguage('ar');
    renderAuth();
    await userEvent.type(field('البريد الإلكتروني'), 'marwan@worktech.com');
    await userEvent.type(field('كلمة المرور'), 'wrong');
    await submit('تسجيل الدخول');

    expect(screen.getByRole('alert')).toHaveTextContent(
      'البريد الإلكتروني أو كلمة المرور غير صحيحة.',
    );
  });
});

describe('create account', () => {
  it('opens from its tab', async () => {
    renderAuth();

    await userEvent.click(screen.getByRole('radio', { name: 'Create account' }));

    expect(screen.getByRole('heading', { name: 'Create your account' })).toBeInTheDocument();
  });

  it('creates the account and signs it in', async () => {
    renderAuth('/auth?mode=register');
    await userEvent.type(field('Full name'), 'Mona Adel');
    await userEvent.type(field('Email'), 'mona@example.com');
    await userEvent.type(field('Mobile number'), '01012345678');
    await userEvent.type(field('Password'), 'laptop2026');
    await userEvent.type(field('Confirm password'), 'laptop2026');
    await submit('Create account');

    expect(screen.getByText('/account')).toBeInTheDocument();
  });

  it('says a taken email as soon as the field is left', async () => {
    renderAuth('/auth?mode=register');

    await userEvent.type(field('Email'), 'marwan@worktech.com');
    await userEvent.tab();

    expect(field('Email')).toHaveAccessibleDescription('An account with this email already exists');
  });
});
