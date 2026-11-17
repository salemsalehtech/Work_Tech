import { configureStore } from '@reduxjs/toolkit';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';

/**
 * Renders a component with a router and, when `reducer` is given, a Redux store.
 *   renderWithProviders(<CartPage />, { reducer: { cart: cartReducer }, route: '/cart' })
 */
export function renderWithProviders(ui, { reducer, preloadedState, route = '/' } = {}) {
  const store = reducer ? configureStore({ reducer, preloadedState }) : null;
  const tree = <MemoryRouter initialEntries={[route]}>{ui}</MemoryRouter>;

  return {
    store,
    ...render(store ? <Provider store={store}>{tree}</Provider> : tree),
  };
}
