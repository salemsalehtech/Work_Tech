import reducer, { removeFromWishlist, setPriceAlert, toggleWishlist } from './wishlistSlice';

const save = (...ids) =>
  ids.reduce(
    (state, productId) => reducer(state, toggleWishlist({ productId, price: 76999 })),
    undefined,
  );

beforeEach(() => {
  vi.useFakeTimers({ now: new Date('2026-11-25T10:00:00Z') });
});

afterEach(() => {
  vi.useRealTimers();
});

it('saves a laptop with its price, the date, and the alert off', () => {
  expect(save('a').items).toEqual([
    { productId: 'a', savedPrice: 76999, savedAt: '2026-11-25T10:00:00.000Z', priceAlert: false },
  ]);
});

it('removes a saved laptop on the second toggle', () => {
  expect(save('a', 'b', 'a').items.map((item) => item.productId)).toEqual(['b']);
});

it('removes one laptop', () => {
  expect(reducer(save('a', 'b'), removeFromWishlist('a')).items).toHaveLength(1);
});

it('turns the price alert on and off', () => {
  const on = reducer(save('a'), setPriceAlert({ productId: 'a', enabled: true }));
  expect(on.items[0].priceAlert).toBe(true);

  const off = reducer(on, setPriceAlert({ productId: 'a', enabled: false }));
  expect(off.items[0].priceAlert).toBe(false);
});

it('ignores an alert for a laptop that is not saved', () => {
  const state = save('a');

  expect(reducer(state, setPriceAlert({ productId: 'b', enabled: true }))).toBe(state);
});
