import { screen } from '@testing-library/react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { describe, expect, it } from 'vitest';

import { renderWithProviders } from '@/test/renderWithProviders';
import { PATHS } from '@shared/constants';

import { authReducer, DEMO_USER } from '../../index';

import RequireAuth from './index';

function MockSignInPage() {
  const location = useLocation();
  return (
    <div>
      <h1>Sign In Page</h1>
      <span data-testid="redirect-from">{location.state?.from?.pathname || 'none'}</span>
    </div>
  );
}

function MockProtectedPage() {
  return <h1>Protected Account Page</h1>;
}

describe('RequireAuth Component', () => {
  it('renders protected child component when user is authenticated', () => {
    renderWithProviders(
      <Routes>
        <Route
          path={PATHS.ACCOUNT}
          element={
            <RequireAuth>
              <MockProtectedPage />
            </RequireAuth>
          }
        />
        <Route path={PATHS.AUTH} element={<MockSignInPage />} />
      </Routes>,
      {
        reducer: { auth: authReducer },
        preloadedState: {
          auth: {
            user: DEMO_USER,
            accounts: [],
            error: null,
          },
        },
        route: PATHS.ACCOUNT,
      },
    );

    expect(screen.getByText('Protected Account Page')).toBeInTheDocument();
    expect(screen.queryByText('Sign In Page')).not.toBeInTheDocument();
  });

  it('renders Outlet when used as route wrapper for authenticated user', () => {
    renderWithProviders(
      <Routes>
        <Route element={<RequireAuth />}>
          <Route path={PATHS.ACCOUNT} element={<MockProtectedPage />} />
        </Route>
        <Route path={PATHS.AUTH} element={<MockSignInPage />} />
      </Routes>,
      {
        reducer: { auth: authReducer },
        preloadedState: {
          auth: {
            user: DEMO_USER,
            accounts: [],
            error: null,
          },
        },
        route: PATHS.ACCOUNT,
      },
    );

    expect(screen.getByText('Protected Account Page')).toBeInTheDocument();
  });

  it('redirects unauthenticated user to Sign In and preserves requested location in state', () => {
    renderWithProviders(
      <Routes>
        <Route
          path={PATHS.ACCOUNT}
          element={
            <RequireAuth>
              <MockProtectedPage />
            </RequireAuth>
          }
        />
        <Route path={PATHS.AUTH} element={<MockSignInPage />} />
      </Routes>,
      {
        reducer: { auth: authReducer },
        preloadedState: {
          auth: {
            user: null,
            accounts: [],
            error: null,
          },
        },
        route: PATHS.ACCOUNT,
      },
    );

    expect(screen.queryByText('Protected Account Page')).not.toBeInTheDocument();
    expect(screen.getByText('Sign In Page')).toBeInTheDocument();
    expect(screen.getByTestId('redirect-from')).toHaveTextContent(PATHS.ACCOUNT);
  });
});
