import { configureStore } from '@reduxjs/toolkit';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { RouterProvider, createMemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';

import { authReducer, DEMO_USER, RequireAuth } from '@features/auth';
import { PATHS } from '@shared/constants';

function createTestRouter(initialEntries = [PATHS.ACCOUNT]) {
  return createMemoryRouter(
    [
      { path: PATHS.HOME, element: <div>Home Page</div> },
      { path: PATHS.AUTH, element: <div>Sign In Page</div> },
      {
        element: <RequireAuth />,
        children: [
          { path: PATHS.ACCOUNT, element: <div>My Account Content</div> },
          { path: PATHS.ORDERS, element: <div>Orders Content</div> },
          { path: PATHS.CHECKOUT, element: <div>Checkout Content</div> },
        ],
      },
    ],
    { initialEntries },
  );
}

function renderWithRouter(initialEntries, user = null) {
  const store = configureStore({
    reducer: { auth: authReducer },
    preloadedState: {
      auth: {
        user,
        accounts: [],
        error: null,
      },
    },
  });

  const router = createTestRouter(initialEntries);

  return {
    store,
    router,
    ...screen,
    rendered: render(
      <Provider store={store}>
        <RouterProvider router={router} />
      </Provider>,
    ),
  };
}

describe('Protected Routes Integration', () => {
  it('redirects guest from /account to /auth preserving destination in location state', async () => {
    const { router } = renderWithRouter([PATHS.ACCOUNT], null);

    expect(await screen.findByText('Sign In Page')).toBeInTheDocument();
    expect(screen.queryByText('My Account Content')).not.toBeInTheDocument();
    expect(router.state.location.state?.from?.pathname).toBe(PATHS.ACCOUNT);
  });

  it('redirects guest from /orders to /auth preserving destination in location state', async () => {
    const { router } = renderWithRouter([PATHS.ORDERS], null);

    expect(await screen.findByText('Sign In Page')).toBeInTheDocument();
    expect(screen.queryByText('Orders Content')).not.toBeInTheDocument();
    expect(router.state.location.state?.from?.pathname).toBe(PATHS.ORDERS);
  });

  it('redirects guest from /checkout to /auth preserving destination in location state', async () => {
    const { router } = renderWithRouter([PATHS.CHECKOUT], null);

    expect(await screen.findByText('Sign In Page')).toBeInTheDocument();
    expect(screen.queryByText('Checkout Content')).not.toBeInTheDocument();
    expect(router.state.location.state?.from?.pathname).toBe(PATHS.CHECKOUT);
  });

  it('allows authenticated customer to access /account directly', async () => {
    renderWithRouter([PATHS.ACCOUNT], DEMO_USER);

    expect(await screen.findByText('My Account Content')).toBeInTheDocument();
    expect(screen.queryByText('Sign In Page')).not.toBeInTheDocument();
  });

  it('allows authenticated customer to access /orders directly', async () => {
    renderWithRouter([PATHS.ORDERS], DEMO_USER);

    expect(await screen.findByText('Orders Content')).toBeInTheDocument();
    expect(screen.queryByText('Sign In Page')).not.toBeInTheDocument();
  });
});
