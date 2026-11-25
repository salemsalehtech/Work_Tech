import { configureStore } from '@reduxjs/toolkit';
import { render, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';

import { authReducer } from '@features/auth';
import { cartReducer } from '@features/cart';
import { compareReducer } from '@features/compare';

import { routes } from './routes';

function openRoute(path, userId = null) {
  const store = configureStore({
    reducer: { auth: authReducer, cart: cartReducer, compare: compareReducer },
    preloadedState: { auth: { userId, accounts: [] } },
  });
  const router = createMemoryRouter(routes, { initialEntries: [path] });
  render(
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>,
  );
  return router;
}
const pathOf = (router) => router.state.location.pathname;

it.each(['/account', '/orders', '/orders/WT-10001', '/checkout', '/order-success'])(
  'sends a guest from %s to sign in',
  async (path) => {
    const router = openRoute(path);

    await waitFor(() => expect(pathOf(router)).toBe('/auth'));
    expect(router.state.location.state.from.pathname).toBe(path);
  },
);

it('lets a signed-in user open the account page', async () => {
  const router = openRoute('/account', 'demo-user-1');

  await waitFor(() => expect(pathOf(router)).toBe('/account'));
});
