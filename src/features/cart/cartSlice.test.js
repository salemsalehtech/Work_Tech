import reducer, {
  addItem,
  applyPromo,
  clearCart,
  removeItem,
  removePromo,
  selectCartCount,
  selectPromoCode,
  setQuantity,
} from './cartSlice';

const zenbook = {
  productId: 'asus-zenbook-14',
  options: { memory: '16 GB', storage: '512 GB', warranty: '1 year' },
  price: 76999,
  stock: 20,
};
const withOptions = (memory) => ({ ...zenbook, options: { ...zenbook.options, memory } });
const add = (...items) => items.reduce((state, item) => reducer(state, addItem(item)), undefined);

it('merges the same laptop with the same options into one line', () => {
  const { items } = add(zenbook, zenbook);

  expect(items).toHaveLength(1);
  expect(items[0].quantity).toBe(2);
});

it('keeps different options on separate lines', () => {
  expect(add(zenbook, withOptions('32 GB')).items).toHaveLength(2);
});

it('never goes above five, or above the stock', () => {
  expect(add({ ...zenbook, quantity: 9 }).items[0].quantity).toBe(5);
  expect(add({ ...zenbook, stock: 2 }, zenbook, zenbook).items[0].quantity).toBe(2);
});

it('sets a quantity between one and the limit', () => {
  const state = add(zenbook);
  const { key } = state.items[0];

  expect(reducer(state, setQuantity({ key, quantity: 0 })).items[0].quantity).toBe(1);
  expect(reducer(state, setQuantity({ key, quantity: 8 })).items[0].quantity).toBe(5);
});

it('removes one line', () => {
  const state = add(zenbook, withOptions('32 GB'));

  expect(reducer(state, removeItem(state.items[0].key)).items).toEqual([state.items[1]]);
});

it('applies and removes a promo code, and clears everything', () => {
  const state = reducer(add(zenbook), applyPromo('WELCOME10'));

  expect(selectPromoCode({ cart: state })).toBe('WELCOME10');
  expect(selectPromoCode({ cart: reducer(state, removePromo()) })).toBeNull();
  expect(reducer(state, clearCart())).toEqual({ items: [], promoCode: null });
});

it('counts units, not lines', () => {
  expect(selectCartCount({ cart: add(zenbook, zenbook, withOptions('32 GB')) })).toBe(3);
});
