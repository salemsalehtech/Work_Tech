import { addAddress, removeAddress, setDefaultAddress } from './addresses';

const home = { id: 'home', isDefault: true };
const work = { id: 'work', isDefault: false };
const defaults = (addresses) =>
  addresses.filter((address) => address.isDefault).map(({ id }) => id);

it('makes the first address the default', () => {
  expect(defaults(addAddress([], work))).toEqual(['work']);
});

it('moves the default to a new default address', () => {
  expect(defaults(addAddress([home], { ...work, isDefault: true }))).toEqual(['work']);
  expect(defaults(addAddress([home], work))).toEqual(['home']);
});

it('keeps a default after the default address is removed', () => {
  expect(defaults(removeAddress([home, work], 'home'))).toEqual(['work']);
  expect(removeAddress([home], 'home')).toEqual([]);
});

it('changes the default', () => {
  expect(defaults(setDefaultAddress([home, work], 'work'))).toEqual(['work']);
});
