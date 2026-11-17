import { configureStore, createSlice } from '@reduxjs/toolkit';

import { loadPersistedState, persistStore } from './persistence';

const cart = createSlice({
  name: 'cart',
  initialState: { items: [], promoCode: null },
  reducers: { add: (state, action) => void state.items.push(action.payload) },
});
const reducers = {
  cart: cart.reducer,
  wishlist: (state = { items: [] }) => state,
  compare: (state = { items: [] }) => state,
  auth: (state = { user: null }) => state,
};

beforeEach(() => window.localStorage.clear());

it('fills fields missing from an older save with their defaults', () => {
  window.localStorage.setItem('worktech:cart', JSON.stringify({ items: ['a'] }));
  expect(loadPersistedState(reducers)).toEqual({ cart: { items: ['a'], promoCode: null } });
});

it('ignores broken saves', () => {
  window.localStorage.setItem('worktech:cart', '{not json');
  expect(loadPersistedState(reducers)).toEqual({});
});

it('saves a slice when it changes', () => {
  const store = configureStore({ reducer: reducers });
  const stop = persistStore(store);
  store.dispatch(cart.actions.add('x'));
  expect(JSON.parse(window.localStorage.getItem('worktech:cart')).items).toEqual(['x']);
  stop();
});
